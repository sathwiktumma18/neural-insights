from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from .common import get_paths


def _rmse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    return float(np.sqrt(mean_squared_error(y_true, y_pred)))


@dataclass
class _TrainedSalesBundle:
    rf: RandomForestRegressor
    lr: LinearRegression
    feature_columns: List[str]
    metrics: Dict[str, Dict[str, float]]
    monthly: pd.DataFrame
    granularity: str
    daily: pd.DataFrame


class SalesPredictor:
    def __init__(self) -> None:
        self._paths = get_paths()
        self._bundle: Optional[_TrainedSalesBundle] = None

    @property
    def model_path(self):
        return self._paths.models_dir / "sales_model.pkl"

    def _load_sales(self) -> pd.DataFrame:
        df = pd.read_csv(self._paths.sample_sales_csv)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])
        # In the provided sample, `price` appears to represent line revenue already.
        df["revenue"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
        return df

    def _monthly_aggregate(self, df: pd.DataFrame) -> pd.DataFrame:
        df["year"] = df["date"].dt.year.astype(int)
        df["month"] = df["date"].dt.month.astype(int)
        df["quarter"] = ((df["month"] - 1) // 3 + 1).astype(int)
        monthly = (
            df.groupby(["year", "month"], as_index=False)
            .agg(revenue=("revenue", "sum"))
            .sort_values(["year", "month"])
            .reset_index(drop=True)
        )
        monthly["date"] = pd.to_datetime(monthly[["year", "month"]].assign(day=1))
        monthly["quarter"] = ((monthly["month"] - 1) // 3 + 1).astype(int)
        return monthly

    def _daily_aggregate(self, df: pd.DataFrame) -> pd.DataFrame:
        d = df.copy()
        d["date"] = pd.to_datetime(d["date"], errors="coerce")
        d = d.dropna(subset=["date"])
        d["date_only"] = d["date"].dt.date
        daily = (
            d.groupby("date_only", as_index=False)
            .agg(revenue=("revenue", "sum"))
        )
        daily["date"] = pd.to_datetime(daily["date_only"])
        daily = daily.sort_values("date").reset_index(drop=True)
        daily["year"] = daily["date"].dt.year.astype(int)
        daily["month"] = daily["date"].dt.month.astype(int)
        daily["quarter"] = ((daily["month"] - 1) // 3 + 1).astype(int)
        return daily[["date", "year", "month", "quarter", "revenue"]]

    def _add_features(self, monthly: pd.DataFrame) -> pd.DataFrame:
        m = monthly.copy()
        m["lag_1"] = m["revenue"].shift(1)
        m["lag_3"] = m["revenue"].shift(3)
        m["lag_6"] = m["revenue"].shift(6)
        m["rolling_avg_3"] = m["revenue"].rolling(window=3, min_periods=1).mean().shift(1)
        m["rolling_avg_6"] = m["revenue"].rolling(window=6, min_periods=1).mean().shift(1)
        return m

    def train(self) -> Dict[str, Any]:
        sales = self._load_sales()
        monthly = self._monthly_aggregate(sales)
        daily = self._daily_aggregate(sales)

        # Prefer true monthly training, but fall back to daily if CSV doesn't span enough months.
        granularity = "monthly"
        base = monthly
        feat = self._add_features(base).dropna().reset_index(drop=True)
        if len(feat) < 8:
            granularity = "daily"
            base = daily
            feat = self._add_features(base).dropna().reset_index(drop=True)
        # Allow training on very small sample CSVs (demo mode), but metrics will be noisy.
        if len(feat) < 4:
            raise ValueError("Not enough data after feature engineering to train models (need more history).")

        feature_columns = ["month", "quarter", "lag_1", "lag_3", "lag_6", "rolling_avg_3", "rolling_avg_6"]
        X = feat[feature_columns].astype(float)
        y = feat["revenue"].astype(float)

        # Time-based split (last 20% as test)
        # Keep at least 1 row for train and 1 for test when possible.
        split_idx = int(len(feat) * 0.8)
        split_idx = max(1, min(split_idx, len(feat) - 1))
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        rf = RandomForestRegressor(n_estimators=150, random_state=42)
        rf.fit(X_train.to_numpy(), y_train.to_numpy())

        lr = LinearRegression()
        lr.fit(X_train.to_numpy(), y_train.to_numpy())

        rf_pred = rf.predict(X_test.to_numpy())
        lr_pred = lr.predict(X_test.to_numpy())

        rf_r2 = r2_score(y_test, rf_pred)
        lr_r2 = r2_score(y_test, lr_pred)
        rf_r2_val = float(rf_r2) if np.isfinite(rf_r2) else None
        lr_r2_val = float(lr_r2) if np.isfinite(lr_r2) else None

        metrics = {
            "random_forest": {
                "r2": rf_r2_val,
                "rmse": _rmse(y_test.to_numpy(), rf_pred),
                "mae": float(mean_absolute_error(y_test, rf_pred)),
            },
            "linear_regression": {
                "r2": lr_r2_val,
                "rmse": _rmse(y_test.to_numpy(), lr_pred),
                "mae": float(mean_absolute_error(y_test, lr_pred)),
            },
        }

        self._bundle = _TrainedSalesBundle(
            rf=rf,
            lr=lr,
            feature_columns=feature_columns,
            metrics=metrics,
            monthly=monthly,
            granularity=granularity,
            daily=daily,
        )

        dump(
            {
                "rf": rf,
                "lr": lr,
                "feature_columns": feature_columns,
                "metrics": metrics,
                "monthly": monthly,
                "daily": daily,
                "granularity": granularity,
                # For SHAP + explainability (small sample)
                "training_features": X_train,
                "training_target": y_train,
            },
            self.model_path,
        )

        return {
            "model_path": str(self.model_path),
            "metrics": metrics,
            "months_available": int(len(monthly)),
            "days_available": int(len(daily)),
            "training_granularity": granularity,
        }

    def _ensure_loaded(self) -> _TrainedSalesBundle:
        if self._bundle is not None:
            return self._bundle
        if not self.model_path.exists():
            raise FileNotFoundError("Sales model not trained yet. Call train() first.")
        raw = load(self.model_path)
        self._bundle = _TrainedSalesBundle(
            rf=raw["rf"],
            lr=raw["lr"],
            feature_columns=list(raw["feature_columns"]),
            metrics=dict(raw.get("metrics", {})),
            monthly=raw["monthly"],
            granularity=str(raw.get("granularity", "monthly")),
            daily=raw.get("daily", pd.DataFrame()),
        )
        return self._bundle

    def predict_next_months(self, n: int = 6) -> List[Dict[str, Any]]:
        b = self._ensure_loaded()

        # If trained on monthly, we can forecast monthly directly; otherwise forecast daily then sum per month.
        if b.granularity == "monthly" and not b.monthly.empty:
            monthly = b.monthly.copy().sort_values(["year", "month"]).reset_index(drop=True)
            series = monthly[["year", "month", "revenue"]].copy()
            out: List[Dict[str, Any]] = []
            for _ in range(int(n)):
                last_year = int(series.iloc[-1]["year"])
                last_month = int(series.iloc[-1]["month"])
                next_month = last_month + 1
                next_year = last_year
                if next_month > 12:
                    next_month = 1
                    next_year += 1
                quarter = (next_month - 1) // 3 + 1

                rev = series["revenue"].astype(float)
                lag_1 = float(rev.iloc[-1])
                lag_3 = float(rev.iloc[-3]) if len(rev) >= 3 else float(rev.iloc[0])
                lag_6 = float(rev.iloc[-6]) if len(rev) >= 6 else float(rev.iloc[0])
                rolling_avg_3 = float(rev.tail(3).mean())
                rolling_avg_6 = float(rev.tail(6).mean())

                X_next = pd.DataFrame(
                    [
                        {
                            "month": next_month,
                            "quarter": quarter,
                            "lag_1": lag_1,
                            "lag_3": lag_3,
                            "lag_6": lag_6,
                            "rolling_avg_3": rolling_avg_3,
                            "rolling_avg_6": rolling_avg_6,
                        }
                    ]
                )[b.feature_columns].to_numpy()

                pred = float(b.rf.predict(X_next)[0])
                tree_preds = np.array([t.predict(X_next)[0] for t in b.rf.estimators_], dtype=float)
                lower = float(np.percentile(tree_preds, 10))
                upper = float(np.percentile(tree_preds, 90))

                out.append(
                    {
                        "month": next_month,
                        "year": next_year,
                        "predicted_revenue": round(pred, 2),
                        "confidence_lower": round(lower, 2),
                        "confidence_upper": round(upper, 2),
                    }
                )
                series = pd.concat(
                    [series, pd.DataFrame([{"year": next_year, "month": next_month, "revenue": pred}])],
                    ignore_index=True,
                )
            return out

        # Daily-trained fallback: predict future days and aggregate into months.
        if b.daily.empty:
            raise ValueError("No daily training data available.")

        daily = b.daily.copy().sort_values("date").reset_index(drop=True)
        series = daily[["date", "revenue"]].copy()
        start_date = pd.to_datetime(series.iloc[-1]["date"]).normalize() + pd.Timedelta(days=1)
        end_date = (start_date + pd.DateOffset(months=int(n))).normalize()
        future_dates = pd.date_range(start=start_date, end=end_date - pd.Timedelta(days=1), freq="D")

        preds_by_day: List[Dict[str, Any]] = []
        for dt in future_dates:
            month = int(dt.month)
            quarter = (month - 1) // 3 + 1

            rev = series["revenue"].astype(float)
            lag_1 = float(rev.iloc[-1])
            lag_3 = float(rev.iloc[-3]) if len(rev) >= 3 else float(rev.iloc[0])
            lag_6 = float(rev.iloc[-6]) if len(rev) >= 6 else float(rev.iloc[0])
            rolling_avg_3 = float(rev.tail(3).mean())
            rolling_avg_6 = float(rev.tail(6).mean())

            X_next = pd.DataFrame(
                [
                    {
                        "month": month,
                        "quarter": quarter,
                        "lag_1": lag_1,
                        "lag_3": lag_3,
                        "lag_6": lag_6,
                        "rolling_avg_3": rolling_avg_3,
                        "rolling_avg_6": rolling_avg_6,
                    }
                ]
            )[b.feature_columns].to_numpy()

            pred = float(b.rf.predict(X_next)[0])
            tree_preds = np.array([t.predict(X_next)[0] for t in b.rf.estimators_], dtype=float)
            lower = float(np.percentile(tree_preds, 10))
            upper = float(np.percentile(tree_preds, 90))

            preds_by_day.append({"date": dt, "pred": pred, "lower": lower, "upper": upper})
            series = pd.concat([series, pd.DataFrame([{"date": dt, "revenue": pred}])], ignore_index=True)

        dfp = pd.DataFrame(preds_by_day)
        dfp["year"] = dfp["date"].dt.year.astype(int)
        dfp["month"] = dfp["date"].dt.month.astype(int)
        monthly_pred = (
            dfp.groupby(["year", "month"], as_index=False)
            .agg(
                predicted_revenue=("pred", "sum"),
                confidence_lower=("lower", "sum"),
                confidence_upper=("upper", "sum"),
            )
            .sort_values(["year", "month"])
            .head(int(n))
        )
        return [
            {
                "month": int(r["month"]),
                "year": int(r["year"]),
                "predicted_revenue": round(float(r["predicted_revenue"]), 2),
                "confidence_lower": round(float(r["confidence_lower"]), 2),
                "confidence_upper": round(float(r["confidence_upper"]), 2),
            }
            for _, r in monthly_pred.iterrows()
        ]

    def get_top_products(self, n: int = 5) -> List[Dict[str, Any]]:
        sales = self._load_sales()
        grouped = (
            sales.groupby("product", as_index=False)
            .agg(total_revenue=("revenue", "sum"), orders=("revenue", "count"))
            .sort_values("total_revenue", ascending=False)
            .head(int(n))
        )
        return [
            {"product": r["product"], "total_revenue": float(r["total_revenue"]), "orders": int(r["orders"])}
            for _, r in grouped.iterrows()
        ]

    def get_model_accuracy(self) -> Dict[str, Any]:
        b = self._ensure_loaded()
        rf = b.metrics.get("random_forest", {})
        lr = b.metrics.get("linear_regression", {})
        return {
            "random_forest": rf,
            "linear_regression": lr,
        }

