from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd
from joblib import load

from .common import get_paths
from .sales_predictor import SalesPredictor


class ExplainableAI:
    def __init__(self) -> None:
        self._paths = get_paths()
        self.sales = SalesPredictor()

    def _load_bundle(self) -> Dict[str, Any]:
        if not self.sales.model_path.exists():
            raise FileNotFoundError("Sales model not trained yet. Call train() first.")
        return load(self.sales.model_path)

    def get_feature_importance(self) -> List[Dict[str, Any]]:
        raw = self._load_bundle()
        rf = raw["rf"]
        cols = list(raw["feature_columns"])
        importances = getattr(rf, "feature_importances_", np.zeros(len(cols)))

        ranked = sorted(zip(cols, importances), key=lambda t: float(t[1]), reverse=True)
        out: List[Dict[str, Any]] = []
        for name, score in ranked:
            s = float(score)
            label = "High impact" if s >= 0.2 else "Medium impact" if s >= 0.1 else "Low impact"
            out.append(
                {
                    "feature_name": name,
                    "importance_score": round(s, 6),
                    "direction": "mixed",
                    "label": label,
                }
            )
        return out

    def get_prediction_explanation(self, input: Dict[str, Any]) -> str:
        # Plain-English explanation using SHAP if available, falling back to feature importances.
        raw = self._load_bundle()
        cols = list(raw["feature_columns"])

        row = {c: float(input.get(c, 0.0)) for c in cols}
        X = pd.DataFrame([row])[cols].astype(float)

        try:
            import shap  # type: ignore

            rf = raw["rf"]
            explainer = shap.TreeExplainer(rf)
            shap_values = explainer.shap_values(X)
            vals = shap_values[0] if isinstance(shap_values, list) else shap_values[0]
            pairs = sorted(zip(cols, vals), key=lambda t: abs(float(t[1])), reverse=True)[:3]
            parts = []
            for f, v in pairs:
                direction = "increases" if float(v) > 0 else "decreases"
                parts.append(f"`{f}` {direction} the forecast")
            return "Top drivers: " + ", ".join(parts) + "."
        except Exception:
            imp = self.get_feature_importance()[:3]
            return (
                "This forecast is mainly influenced by "
                + ", ".join([f"`{i['feature_name']}`" for i in imp])
                + "."
            )

    def get_model_comparison(self) -> Dict[str, Any]:
        raw = self._load_bundle()
        metrics = raw.get("metrics") or {}
        return {
            "random_forest": metrics.get("random_forest", {}),
            "linear_regression": metrics.get("linear_regression", {}),
        }

