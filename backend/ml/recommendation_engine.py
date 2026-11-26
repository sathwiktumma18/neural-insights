from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd

from .customer_segmentation import CustomerSegmentation
from .sales_predictor import SalesPredictor


class RecommendationEngine:
    def __init__(self) -> None:
        self.sales = SalesPredictor()
        self.segments = CustomerSegmentation()

    def _segment_distribution(self) -> Dict[str, float]:
        segs = self.segments.get_all_segments()
        total = sum(int(s.get("customers", 0)) for s in segs) or 1
        return {str(s.get("label")): float(int(s.get("customers", 0))) / total for s in segs}

    def _trending_products(self) -> Dict[str, Any]:
        # Month-over-month change per product.
        paths = self.sales._paths  # intentional internal reuse
        df = pd.read_csv(paths.sample_sales_csv)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])
        df["revenue"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
        df["year"] = df["date"].dt.year.astype(int)
        df["month"] = df["date"].dt.month.astype(int)
        m = (
            df.groupby(["product", "year", "month"], as_index=False)
            .agg(revenue=("revenue", "sum"))
            .sort_values(["product", "year", "month"])
        )
        if m.empty:
            return {"product": None, "growth_pct": 0.0}
        # last two months per product
        latest = m.groupby("product").tail(2)
        growth_rows = []
        for product, grp in latest.groupby("product"):
            if len(grp) < 2:
                continue
            prev, last = grp.iloc[-2], grp.iloc[-1]
            prev_rev = float(prev["revenue"])
            last_rev = float(last["revenue"])
            if prev_rev <= 0:
                continue
            growth_pct = (last_rev - prev_rev) / prev_rev * 100.0
            growth_rows.append({"product": product, "growth_pct": growth_pct})
        if not growth_rows:
            return {"product": None, "growth_pct": 0.0}
        top = max(growth_rows, key=lambda r: r["growth_pct"])
        return top

    def generate_recommendations(self) -> List[Dict[str, Any]]:
        dist = self._segment_distribution()
        at_risk_pct = dist.get("At-Risk High Value", 0.0) + dist.get("Churned / Inactive", 0.0)
        new_pct = dist.get("New Customers", 0.0)

        preds = self.sales.predict_next_months(1)
        next_rev = float(preds[0]["predicted_revenue"]) if preds else 0.0

        # last month revenue from training data
        b = self.sales._ensure_loaded()
        last_month_rev = float(b.monthly.sort_values(["year", "month"]).iloc[-1]["revenue"]) if not b.monthly.empty else 0.0

        trending = self._trending_products()
        trending_growth = float(trending.get("growth_pct", 0.0))

        recs: List[Dict[str, Any]] = []

        if at_risk_pct > 0.15:
            recs.append(
                {
                    "title": "Launch retention email campaign",
                    "description": "A meaningful share of customers are at-risk; re-engagement can reduce churn and protect revenue.",
                    "channel": "Email",
                    "priority": "HIGH",
                    "estimated_impact_inr": 85000,
                    "target_segment": "At-Risk High Value",
                    "confidence_pct": 82,
                    "action_steps": [
                        "Create win-back offer (limited-time coupon)",
                        "Segment list by churn risk > 0.6",
                        "Send 2-step email sequence over 7 days",
                    ],
                }
            )

        if new_pct > 0.30:
            recs.append(
                {
                    "title": "Onboarding nurture needed",
                    "description": "High share of new customers indicates onboarding can improve repeat purchases and LTV.",
                    "channel": "Email + In-app",
                    "priority": "MEDIUM",
                    "estimated_impact_inr": 45000,
                    "target_segment": "New Customers",
                    "confidence_pct": 75,
                    "action_steps": [
                        "Welcome series with product education",
                        "First-purchase incentive within 72 hours",
                        "Retarget non-converters on social",
                    ],
                }
            )

        if trending_growth > 8.0 and trending.get("product"):
            recs.append(
                {
                    "title": "Increase ad spend on trending category",
                    "description": f"Demand for {trending['product']} is trending up ({trending_growth:.1f}% MoM).",
                    "channel": "Paid Social",
                    "priority": "HIGH",
                    "estimated_impact_inr": 65000,
                    "target_segment": "All",
                    "confidence_pct": 78,
                    "action_steps": [
                        "Increase budget by 10–15% for 7 days",
                        "Refresh creatives for the trending product",
                        "Monitor CAC and ROAS daily",
                    ],
                }
            )

        if last_month_rev > 0 and next_rev < last_month_rev * 0.9:
            recs.append(
                {
                    "title": "Run short-term promo to protect revenue",
                    "description": "Forecast suggests a potential revenue dip next month; a targeted promo can offset the decline.",
                    "channel": "Email + Social",
                    "priority": "CRITICAL",
                    "estimated_impact_inr": 120000,
                    "target_segment": "All",
                    "confidence_pct": 80,
                    "action_steps": [
                        "Offer 10% discount for 5 days",
                        "Target at-risk + price-sensitive segments",
                        "Bundle best-selling products",
                    ],
                }
            )

        # Always provide at least one suggestion.
        if not recs:
            recs.append(
                {
                    "title": "Maintain current growth strategy",
                    "description": "No major risk signals detected; continue monitoring and optimize creatives weekly.",
                    "channel": "Organic + Email",
                    "priority": "LOW",
                    "estimated_impact_inr": 25000,
                    "target_segment": "All",
                    "confidence_pct": 68,
                    "action_steps": ["Review weekly KPIs", "A/B test subject lines", "Keep retargeting warm audiences"],
                }
            )

        return recs

    def get_best_channels(self) -> List[Dict[str, Any]]:
        # Simple heuristic ranking; can be expanded later.
        segs = self.segments.get_all_segments()
        by_label = {s["label"]: s for s in segs}
        return [
            {"channel": "Email", "score": 92, "best_for": ["At-Risk High Value", "Loyal Champions"]},
            {"channel": "Paid Social", "score": 86, "best_for": ["New Customers"]},
            {"channel": "In-app", "score": 78, "best_for": ["New Customers", "Loyal Champions"]},
            {"channel": "SMS", "score": 72, "best_for": ["At-Risk High Value"]},
            {"channel": "Organic", "score": 65, "best_for": ["All"]},
        ]

    def get_campaign_strategy(self, objective: str) -> Dict[str, Any]:
        obj = (objective or "").strip().lower()
        if "retain" in obj or "churn" in obj:
            return {
                "objective": objective,
                "strategy": "Win-back retention sequence",
                "steps": ["Identify churn risk > 0.6", "Send offer + reminder", "Follow-up with feedback survey"],
                "recommended_channels": ["Email", "SMS"],
            }
        if "acquire" in obj or "growth" in obj:
            return {
                "objective": objective,
                "strategy": "Prospecting + onboarding funnel",
                "steps": ["Boost top product ads", "Landing page optimization", "Welcome series"],
                "recommended_channels": ["Paid Social", "Email"],
            }
        return {
            "objective": objective,
            "strategy": "Balanced optimization",
            "steps": ["Segment audience", "Run 2 A/B tests", "Measure weekly uplift"],
            "recommended_channels": ["Email", "Paid Social", "In-app"],
        }

