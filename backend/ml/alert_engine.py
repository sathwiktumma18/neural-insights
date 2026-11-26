from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd

from .customer_segmentation import CustomerSegmentation
from .sales_predictor import SalesPredictor


class AlertEngine:
    def __init__(self) -> None:
        self.sales = SalesPredictor()
        self.segments = CustomerSegmentation()

    def scan_and_generate(self) -> List[Dict[str, Any]]:
        alerts: List[Dict[str, Any]] = []

        # Revenue drops > 10%
        b = self.sales._ensure_loaded()
        monthly = b.monthly.sort_values(["year", "month"])
        if len(monthly) >= 2:
            last = float(monthly.iloc[-1]["revenue"])
            prev = float(monthly.iloc[-2]["revenue"])
            if prev > 0 and last < prev * 0.9:
                alerts.append(
                    {
                        "alert_type": "revenue_drop",
                        "title": "Revenue drop detected",
                        "message": f"Revenue dropped by {((prev - last) / prev * 100):.1f}% vs previous month.",
                        "severity": "CRITICAL",
                        "suggested_action": "Run promo and investigate channel performance.",
                    }
                )

        # Churn risk up > 5% (approx: compare avg churn risk vs 0.5 baseline)
        segs = self.segments.get_all_segments()
        avg_risk = 0.0
        total = 0
        for s in segs:
            c = int(s.get("customers", 0))
            avg_risk += float(s.get("avg_churn_risk", 0.0)) * c
            total += c
        avg_risk = avg_risk / (total or 1)
        if avg_risk > 0.55:
            alerts.append(
                {
                    "alert_type": "churn_risk_up",
                    "title": "Churn risk elevated",
                    "message": f"Average churn risk score is {avg_risk:.2f} (above 0.55).",
                    "severity": "HIGH",
                    "suggested_action": "Target at-risk customers with retention campaign.",
                }
            )

        # Product demand drops > 20% (MoM per product)
        paths = self.sales._paths
        s = pd.read_csv(paths.sample_sales_csv)
        s["date"] = pd.to_datetime(s["date"], errors="coerce")
        s = s.dropna(subset=["date"])
        s["revenue"] = pd.to_numeric(s["price"], errors="coerce").fillna(0.0)
        s["year"] = s["date"].dt.year.astype(int)
        s["month"] = s["date"].dt.month.astype(int)
        m = (
            s.groupby(["product", "year", "month"], as_index=False)
            .agg(revenue=("revenue", "sum"))
            .sort_values(["product", "year", "month"])
        )
        for product, grp in m.groupby("product"):
            if len(grp) < 2:
                continue
            prev, last = grp.iloc[-2], grp.iloc[-1]
            prev_rev = float(prev["revenue"])
            last_rev = float(last["revenue"])
            if prev_rev > 0 and last_rev < prev_rev * 0.8:
                alerts.append(
                    {
                        "alert_type": "product_demand_drop",
                        "title": "Product demand drop",
                        "message": f"{product} demand dropped by {((prev_rev - last_rev) / prev_rev * 100):.1f}% MoM.",
                        "severity": "HIGH",
                        "suggested_action": "Review pricing/stock; consider targeted promotion.",
                    }
                )
                break

        # New customer acquisition dropped (proxy: New Customers segment < 10%)
        dist = {s["label"]: int(s.get("customers", 0)) for s in segs}
        total_customers = sum(dist.values()) or 1
        new_pct = dist.get("New Customers", 0) / total_customers
        if new_pct < 0.10:
            alerts.append(
                {
                    "alert_type": "acquisition_drop",
                    "title": "New customer acquisition slowdown",
                    "message": f"New Customers segment is only {new_pct*100:.1f}% of base.",
                    "severity": "MEDIUM",
                    "suggested_action": "Increase prospecting budget and refresh onboarding funnel.",
                }
            )

        # Model confidence < 80% (proxy: RandomForest R2 < 0.8)
        acc = self.sales.get_model_accuracy().get("random_forest", {})
        r2 = float(acc.get("r2", 0.0))
        if r2 < 0.8:
            alerts.append(
                {
                    "alert_type": "model_confidence_low",
                    "title": "Model confidence is low",
                    "message": f"Sales model R² is {r2:.2f} (below 0.80).",
                    "severity": "LOW",
                    "suggested_action": "Retrain with more data and review feature quality.",
                }
            )

        return alerts

