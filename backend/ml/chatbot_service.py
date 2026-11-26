from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

from .alert_engine import AlertEngine
from .customer_segmentation import CustomerSegmentation
from .recommendation_engine import RecommendationEngine
from .sales_predictor import SalesPredictor
from .whatif_engine import WhatIfEngine


class ChatbotService:
    def __init__(self) -> None:
        load_dotenv()
        self.sales = SalesPredictor()
        self.segments = CustomerSegmentation()
        self.recs = RecommendationEngine()
        self.whatif = WhatIfEngine()
        self.alerts = AlertEngine()

    def build_business_context(self) -> Dict[str, Any]:
        # Pulls from ML modules; if a model isn't trained, callers should train first.
        return {
            "sales_forecast_next_6": self.sales.predict_next_months(6),
            "top_products": self.sales.get_top_products(5),
            "model_accuracy": self.sales.get_model_accuracy(),
            "segments": self.segments.get_all_segments(),
            "at_risk_customers": self.segments.get_at_risk_customers(10),
            "recommendations": self.recs.generate_recommendations(),
            "alerts": self.alerts.scan_and_generate(),
            "whatif_presets": self.whatif.get_preset_scenarios(),
        }

    def chat(self, message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        load_dotenv()
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return {
                "reply": "ANTHROPIC_API_KEY is not set on the backend. Add it to your .env and restart the server.",
                "suggested_followups": [
                    "How do I set ANTHROPIC_API_KEY?",
                    "Can you run without Claude?",
                    "What context do you include?",
                ],
            }

        try:
            from anthropic import Anthropic  # type: ignore
        except Exception:
            return {
                "reply": "The `anthropic` package is not installed on the backend. Install it and restart the server.",
                "suggested_followups": ["Which version should I install?", "How do I update requirements.txt?", "How to verify install?"],
            }

        client = Anthropic(api_key=api_key)
        ctx = self.build_business_context()

        system = (
            "You are a business intelligence assistant. "
            "Use the provided live data context to answer succinctly with actionable recommendations. "
            "If you are uncertain due to missing data, say so and propose next best steps."
        )

        msgs: List[Dict[str, str]] = []
        for m in (conversation_history or [])[-12:]:
            if m.get("role") in {"user", "assistant"} and isinstance(m.get("content"), str):
                msgs.append({"role": m["role"], "content": m["content"]})

        # Inject live context as a hidden message.
        msgs.append({"role": "user", "content": f"Live business context (JSON): {ctx}"})
        msgs.append({"role": "user", "content": message})

        resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=600,
            system=system,
            messages=msgs,
        )

        text = ""
        try:
            # anthropic SDK returns content blocks
            text = "".join([c.text for c in resp.content if getattr(c, "type", "") == "text"])
        except Exception:
            text = str(resp)

        suggested = [
            "What are the top churn risks this month?",
            "Which product should we promote next?",
            "Simulate a 10% discount with ₹200k marketing spend",
        ]

        return {"reply": text.strip() or "I couldn't generate a reply.", "suggested_followups": suggested}

