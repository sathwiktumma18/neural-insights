from __future__ import annotations

from flask import Blueprint, jsonify, request

from backend.ml.alert_engine import AlertEngine
from backend.ml.chatbot_service import ChatbotService
from backend.ml.customer_segmentation import CustomerSegmentation
from backend.ml.explainable_ai import ExplainableAI
from backend.ml.recommendation_engine import RecommendationEngine
from backend.ml.sales_predictor import SalesPredictor
from backend.ml.whatif_engine import WhatIfEngine


ai_bp = Blueprint("ai_routes", __name__)


def _get_months_param(default: int = 6) -> int:
    try:
        return int(request.args.get("months", default))
    except Exception:
        return int(default)


@ai_bp.post("/train")
def train_all():
    sales = SalesPredictor()
    seg = CustomerSegmentation()
    sales_out = sales.train()
    seg_out = seg.train()
    return jsonify({"sales": sales_out, "segmentation": seg_out})


@ai_bp.get("/sales/predict")
def sales_predict():
    months = _get_months_param(6)
    sales = SalesPredictor()
    return jsonify(
        {
            "predictions": sales.predict_next_months(months),
            "accuracy": sales.get_model_accuracy(),
            "top_products": sales.get_top_products(5),
        }
    )


@ai_bp.get("/sales/top-products")
def sales_top_products():
    sales = SalesPredictor()
    return jsonify({"top_products": sales.get_top_products(5)})


@ai_bp.get("/customers/segments")
def customers_segments():
    seg = CustomerSegmentation()
    return jsonify({"segments": seg.get_all_segments()})


@ai_bp.get("/customers/at-risk")
def customers_at_risk():
    seg = CustomerSegmentation()
    return jsonify({"customers": seg.get_at_risk_customers(20)})


@ai_bp.post("/customers/predict-segment")
def customers_predict_segment():
    payload = request.get_json(silent=True) or {}
    seg = CustomerSegmentation()
    return jsonify(seg.predict_segment(payload))


@ai_bp.get("/recommendations")
def recommendations():
    eng = RecommendationEngine()
    return jsonify({"recommendations": eng.generate_recommendations(), "best_channels": eng.get_best_channels()})


@ai_bp.get("/whatif/scenarios")
def whatif_scenarios():
    eng = WhatIfEngine()
    return jsonify({"scenarios": eng.get_preset_scenarios()})


@ai_bp.post("/whatif/simulate")
def whatif_simulate():
    payload = request.get_json(silent=True) or {}
    eng = WhatIfEngine()
    return jsonify(eng.simulate(payload))


@ai_bp.get("/explain/features")
def explain_features():
    xai = ExplainableAI()
    return jsonify({"features": xai.get_feature_importance()})


@ai_bp.get("/explain/prediction")
def explain_prediction():
    # Accepts feature values as query params (month, quarter, lag_1, ...)
    payload = dict(request.args)
    xai = ExplainableAI()
    return jsonify({"explanation": xai.get_prediction_explanation(payload), "input": payload})


@ai_bp.get("/alerts")
def alerts_get():
    eng = AlertEngine()
    return jsonify({"alerts": eng.scan_and_generate()})


@ai_bp.post("/alerts/scan")
def alerts_scan():
    eng = AlertEngine()
    return jsonify({"alerts": eng.scan_and_generate()})


@ai_bp.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()
    history = payload.get("conversation_history") or []
    bot = ChatbotService()
    return jsonify(bot.chat(message, history))

