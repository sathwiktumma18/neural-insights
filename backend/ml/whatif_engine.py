from __future__ import annotations

from typing import Any, Dict, List

from .sales_predictor import SalesPredictor


class WhatIfEngine:
    def __init__(self) -> None:
        self.sales = SalesPredictor()

    def simulate(self, params: Dict[str, Any]) -> Dict[str, Any]:
        marketing_spend = float(params.get("marketing_spend", 0.0))
        discount_rate = float(params.get("discount_rate", 0.0))
        target_region = str(params.get("target_region", "All"))
        ad_channel = str(params.get("ad_channel", "Email"))

        baseline = self.sales.predict_next_months(1)
        baseline_revenue = float(baseline[0]["predicted_revenue"]) if baseline else 0.0

        # Heuristic uplift model:
        # - Marketing spend has diminishing returns
        # - Discounts increase volume but reduce margin (net effect capped)
        spend_uplift = 0.12 * (marketing_spend / (marketing_spend + 200000.0))  # up to ~12%
        discount_uplift = min(0.10, max(0.0, discount_rate) * 0.6)  # e.g. 0.1 discount → +6% capped at 10%
        margin_penalty = min(0.12, max(0.0, discount_rate) * 0.9)   # net penalty

        channel_factor = {
            "Email": 0.02,
            "Paid Social": 0.04,
            "Social": 0.03,
            "In-app": 0.025,
            "SMS": 0.02,
            "Search": 0.035,
        }.get(ad_channel, 0.02)

        region_factor = {
            "All": 0.0,
            "North": 0.01,
            "South": 0.008,
            "East": 0.006,
            "West": 0.009,
        }.get(target_region, 0.0)

        change_pct = (spend_uplift + discount_uplift + channel_factor + region_factor - margin_penalty) * 100.0
        projected = baseline_revenue * (1.0 + change_pct / 100.0)

        risk_level = "LOW"
        if discount_rate > 0.2 or marketing_spend > 500000:
            risk_level = "HIGH"
        elif discount_rate > 0.1 or marketing_spend > 250000:
            risk_level = "MEDIUM"

        recommendations: List[str] = []
        if discount_rate > 0.15:
            recommendations.append("Limit discount to protect margins; consider bundles instead.")
        if marketing_spend > 300000 and ad_channel.lower() in {"email", "sms"}:
            recommendations.append("Shift incremental budget to Paid Social/Search for scale.")
        if risk_level != "LOW":
            recommendations.append("Set a 7-day checkpoint to stop/adjust if ROAS drops.")

        return {
            "baseline_revenue": round(baseline_revenue, 2),
            "projected_revenue": round(projected, 2),
            "change_pct": round(change_pct, 2),
            "change_inr": round(projected - baseline_revenue, 2),
            "risk_level": risk_level,
            "recommendations": recommendations,
        }

    def get_preset_scenarios(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "Aggressive Growth",
                "params": {"marketing_spend": 400000, "discount_rate": 0.12, "target_region": "All", "ad_channel": "Paid Social"},
            },
            {
                "name": "Conservative",
                "params": {"marketing_spend": 80000, "discount_rate": 0.03, "target_region": "All", "ad_channel": "Email"},
            },
            {
                "name": "Balanced",
                "params": {"marketing_spend": 180000, "discount_rate": 0.07, "target_region": "All", "ad_channel": "Search"},
            },
        ]

