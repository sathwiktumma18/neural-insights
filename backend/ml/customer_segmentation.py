from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from .common import get_paths


def _clamp01(x: float) -> float:
    return float(max(0.0, min(1.0, x)))


@dataclass
class _SegBundle:
    kmeans: KMeans
    scaler: StandardScaler
    feature_columns: List[str]
    cluster_labels: Dict[int, str]
    customers_scored: pd.DataFrame
    segment_stats: List[Dict[str, Any]]


class CustomerSegmentation:
    def __init__(self) -> None:
        self._paths = get_paths()
        self._bundle: Optional[_SegBundle] = None

    @property
    def model_path(self):
        return self._paths.models_dir / "segmentation_model.pkl"

    def _load_customers(self) -> pd.DataFrame:
        c = pd.read_csv(self._paths.sample_customers_csv)
        c = c.copy()
        c["customer_id"] = np.arange(1, len(c) + 1)
        c["total_spent"] = pd.to_numeric(c.get("total_spent", 0), errors="coerce").fillna(0.0)
        return c

    def _load_sales(self) -> pd.DataFrame:
        s = pd.read_csv(self._paths.sample_sales_csv)
        s["date"] = pd.to_datetime(s["date"], errors="coerce")
        s = s.dropna(subset=["date"])
        s["revenue"] = pd.to_numeric(s["price"], errors="coerce").fillna(0.0)
        s["customer_id"] = pd.to_numeric(s["customer_id"], errors="coerce")
        s = s.dropna(subset=["customer_id"]).copy()
        s["customer_id"] = s["customer_id"].astype(int)
        return s

    def _build_features(self) -> pd.DataFrame:
        customers = self._load_customers()
        sales = self._load_sales()

        # Derive purchase behavior from sales transactions (stable and consistent with sample CSVs).
        agg = (
            sales.groupby("customer_id", as_index=False)
            .agg(
                total_purchases=("revenue", "count"),
                avg_order_value=("revenue", "mean"),
                last_purchase_date=("date", "max"),
                ltv=("revenue", "sum"),
            )
        )

        df = customers.merge(agg, on="customer_id", how="left")

        now = max(sales["date"].max(), pd.Timestamp.utcnow().tz_localize(None))
        df["total_purchases"] = df["total_purchases"].fillna(0).astype(int)
        df["avg_order_value"] = df["avg_order_value"].fillna(0.0).astype(float)
        df["ltv"] = df["ltv"].fillna(df["total_spent"]).astype(float)
        df["last_purchase_date"] = pd.to_datetime(df["last_purchase_date"], errors="coerce")
        df["days_since_last_purchase"] = (now - df["last_purchase_date"]).dt.days
        df["days_since_last_purchase"] = df["days_since_last_purchase"].fillna(999).clip(lower=0).astype(int)

        # Ensure required columns exist
        for col in ["total_purchases", "avg_order_value", "days_since_last_purchase", "ltv"]:
            if col not in df.columns:
                df[col] = 0

        return df

    def _auto_label_clusters(self, df: pd.DataFrame, cluster_col: str = "cluster") -> Dict[int, str]:
        # Spend: higher LTV; Recent: lower days_since_last_purchase
        med_spend = float(df["ltv"].median())
        med_recency = float(df["days_since_last_purchase"].median())

        labels: Dict[int, str] = {}
        for k in sorted(df[cluster_col].unique().tolist()):
            sub = df[df[cluster_col] == k]
            spend = float(sub["ltv"].mean())
            recency = float(sub["days_since_last_purchase"].mean())

            high_spend = spend >= med_spend
            recent = recency <= med_recency

            if high_spend and recent:
                labels[int(k)] = "Loyal Champions"
            elif high_spend and not recent:
                labels[int(k)] = "At-Risk High Value"
            elif (not high_spend) and recent:
                labels[int(k)] = "New Customers"
            else:
                labels[int(k)] = "Churned / Inactive"

        return labels

    def _compute_churn_risk(self, df: pd.DataFrame) -> pd.Series:
        # Simple bounded score: more days since purchase → higher risk; higher LTV → lower risk.
        d = df["days_since_last_purchase"].astype(float)
        ltv = df["ltv"].astype(float)
        d_norm = (d - d.min()) / (d.max() - d.min() + 1e-9)
        l_norm = (ltv - ltv.min()) / (ltv.max() - ltv.min() + 1e-9)
        score = 0.75 * d_norm + 0.25 * (1.0 - l_norm)
        return score.map(_clamp01)

    def train(self) -> Dict[str, Any]:
        df = self._build_features()
        feature_columns = ["total_purchases", "avg_order_value", "days_since_last_purchase", "ltv"]

        X = df[feature_columns].astype(float)
        scaler = StandardScaler()
        Xs = scaler.fit_transform(X)

        kmeans = KMeans(n_clusters=4, random_state=42, n_init="auto")
        clusters = kmeans.fit_predict(Xs)
        df["cluster"] = clusters.astype(int)

        cluster_labels = self._auto_label_clusters(df, "cluster")
        df["segment_label"] = df["cluster"].map(cluster_labels)
        df["churn_risk_score"] = self._compute_churn_risk(df).astype(float)

        seg_stats = (
            df.groupby(["cluster", "segment_label"], as_index=False)
            .agg(
                customers=("customer_id", "count"),
                avg_ltv=("ltv", "mean"),
                avg_order_value=("avg_order_value", "mean"),
                avg_days_since_last=("days_since_last_purchase", "mean"),
                avg_churn_risk=("churn_risk_score", "mean"),
            )
            .sort_values("customers", ascending=False)
        )
        segment_stats = [
            {
                "cluster": int(r["cluster"]),
                "label": str(r["segment_label"]),
                "customers": int(r["customers"]),
                "avg_ltv": float(r["avg_ltv"]),
                "avg_order_value": float(r["avg_order_value"]),
                "avg_days_since_last_purchase": float(r["avg_days_since_last"]),
                "avg_churn_risk": float(r["avg_churn_risk"]),
            }
            for _, r in seg_stats.iterrows()
        ]

        self._bundle = _SegBundle(
            kmeans=kmeans,
            scaler=scaler,
            feature_columns=feature_columns,
            cluster_labels=cluster_labels,
            customers_scored=df,
            segment_stats=segment_stats,
        )

        dump(
            {
                "kmeans": kmeans,
                "scaler": scaler,
                "feature_columns": feature_columns,
                "cluster_labels": cluster_labels,
                "customers_scored": df,
                "segment_stats": segment_stats,
            },
            self.model_path,
        )

        return {"model_path": str(self.model_path), "segments": segment_stats, "customers": int(len(df))}

    def _ensure_loaded(self) -> _SegBundle:
        if self._bundle is not None:
            return self._bundle
        if not self.model_path.exists():
            raise FileNotFoundError("Segmentation model not trained yet. Call train() first.")
        raw = load(self.model_path)
        self._bundle = _SegBundle(
            kmeans=raw["kmeans"],
            scaler=raw["scaler"],
            feature_columns=list(raw["feature_columns"]),
            cluster_labels=dict(raw["cluster_labels"]),
            customers_scored=raw["customers_scored"],
            segment_stats=list(raw.get("segment_stats", [])),
        )
        return self._bundle

    def get_all_segments(self) -> List[Dict[str, Any]]:
        b = self._ensure_loaded()
        return b.segment_stats

    def predict_segment(self, customer_dict: Dict[str, Any]) -> Dict[str, Any]:
        b = self._ensure_loaded()
        feat = {c: float(customer_dict.get(c, 0.0)) for c in b.feature_columns}
        X = pd.DataFrame([feat])[b.feature_columns].astype(float)
        Xs = b.scaler.transform(X)
        cluster = int(b.kmeans.predict(Xs)[0])
        label = b.cluster_labels.get(cluster, f"Cluster {cluster}")

        # Approximate churn risk for ad-hoc input
        days = float(feat.get("days_since_last_purchase", 0.0))
        ltv = float(feat.get("ltv", 0.0))
        risk = _clamp01((days / (days + 60.0)) * (1.0 - (ltv / (ltv + 1000.0))))

        return {"cluster": cluster, "label": label, "churn_risk_score": round(risk, 4)}

    def get_at_risk_customers(self, limit: int = 20) -> List[Dict[str, Any]]:
        b = self._ensure_loaded()
        df = b.customers_scored.copy()
        df = df.sort_values(["churn_risk_score", "days_since_last_purchase"], ascending=False).head(int(limit))
        cols = [
            "customer_id",
            "name",
            "email",
            "location",
            "total_purchases",
            "avg_order_value",
            "days_since_last_purchase",
            "ltv",
            "segment_label",
            "churn_risk_score",
        ]
        for c in cols:
            if c not in df.columns:
                df[c] = None
        return df[cols].to_dict("records")

