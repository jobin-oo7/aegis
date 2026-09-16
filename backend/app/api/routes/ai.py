from fastapi import APIRouter, Depends, Body
from typing import Dict, Any
from backend.app.ai import get_ai_provider

router = APIRouter(prefix="/ai", tags=["AI Explainability & Synthesis"])

@router.post("/risk-summary")
async def generate_risk_summary(risk_context: Dict[str, Any] = Body(...)):
    provider = get_ai_provider()
    return await provider.generate_risk_summary(risk_context)

@router.post("/recommendation")
async def generate_recommendation(investment_context: Dict[str, Any] = Body(...)):
    provider = get_ai_provider()
    return await provider.generate_investment_narrative(investment_context)
