from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from utils.llm import get_chat_llm


class CustomerSegment(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class MarketingChannel(BaseModel):
    name: str = Field(..., min_length=1)
    why: str = Field(..., min_length=1)
    action_steps: List[str] = Field(..., min_length=3, max_length=3)


class PricingStrategy(BaseModel):
    model: str = Field(..., min_length=1)
    price_range: str = Field(..., min_length=1)
    justification: str = Field(..., min_length=1)


class TimelinePhase(BaseModel):
    actions: List[str] = Field(..., min_length=5, max_length=5)


class LaunchTimeline(BaseModel):
    days_30: TimelinePhase
    days_60: TimelinePhase
    days_90: TimelinePhase


class KPI(BaseModel):
    metric: str = Field(..., min_length=1)
    target: str = Field(..., min_length=1)


class GTMStrategyResponse(BaseModel):
    customer_segments: List[CustomerSegment] = Field(..., min_length=3, max_length=3)
    positioning_statement: str = Field(..., min_length=1)
    marketing_channels: List[MarketingChannel] = Field(..., min_length=3, max_length=3)
    pricing_strategy: PricingStrategy
    launch_timeline: LaunchTimeline
    kpis: List[KPI] = Field(..., min_length=6, max_length=6)


class GTMStrategyRequest(BaseModel):
    product: str = Field(..., min_length=2)
    audience: str = Field(..., min_length=2)
    industry: str = Field(..., min_length=2)


class GTMStrategy:
    def __init__(self, model: str | None = None) -> None:
        base_llm = get_chat_llm(temperature=0.3, model=model)
        self.llm = base_llm.with_structured_output(
            GTMStrategyResponse,
            method="json_mode",
        )

    async def generate(
        self,
        product: str,
        audience: str,
        industry: str,
    ) -> GTMStrategyResponse:
        prompt = """
You are a senior go-to-market strategist building a launch-ready GTM plan for an early-stage startup.
Return strict JSON only. No commentary, no markdown, no backticks.

Requirements:
- Provide exactly 3 customer_segments. Each segment needs a concise name and a 1-2 sentence description that captures pains, goals, and buying triggers.
- positioning_statement must be a single, sharp sentence following the pattern:
  "For [audience], [product] is the [category] that [differentiator] because [reason to believe]."
- Provide exactly 3 marketing_channels. For each channel:
  - name: the channel itself (e.g. "LinkedIn Thought Leadership", "Founder-led Community").
  - why: the reason this channel fits the audience and product.
  - action_steps: exactly 3 concrete, executable steps (verbs first, no fluff).
- pricing_strategy must specify:
  - model: e.g. "Freemium SaaS", "Tiered subscription", "Usage-based", "Enterprise contract".
  - price_range: a specific range with currency, e.g. "$29-$199 / month per seat".
  - justification: 1-2 sentences grounding the price in willingness-to-pay, comparable products, and value delivered.
- launch_timeline must contain three phases (days_30, days_60, days_90), each with exactly 5 action items written as imperative bullets that compound on the previous phase.
- kpis must be exactly 6 metrics. Each kpi needs:
  - metric: name of the KPI (e.g. "Activation Rate", "MQL to SQL Conversion", "MRR").
  - target: a measurable target with a number and timeframe, e.g. "≥ 25% by day 90".
- All advice must be specific, realistic, and tailored to the provided product, audience, and industry.

Return JSON with exactly this schema:
{
  "customer_segments": [
    { "name": "...", "description": "..." }
  ],
  "positioning_statement": "...",
  "marketing_channels": [
    {
      "name": "...",
      "why": "...",
      "action_steps": ["...", "...", "..."]
    }
  ],
  "pricing_strategy": {
    "model": "...",
    "price_range": "...",
    "justification": "..."
  },
  "launch_timeline": {
    "days_30": { "actions": ["...", "...", "...", "...", "..."] },
    "days_60": { "actions": ["...", "...", "...", "...", "..."] },
    "days_90": { "actions": ["...", "...", "...", "...", "..."] }
  },
  "kpis": [
    { "metric": "...", "target": "..." }
  ]
}
        """.strip()

        try:
            return await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(
                        content=(
                            f"Product: {product}\n"
                            f"Target audience: {audience}\n"
                            f"Industry: {industry}"
                        )
                    ),
                ]
            )
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid GTM strategy payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"GTM strategy generation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/gtm-strategy", response_model=GTMStrategyResponse)
async def generate_gtm_strategy(request: GTMStrategyRequest) -> GTMStrategyResponse:
    try:
        strategist = GTMStrategy()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await strategist.generate(
        request.product,
        request.audience,
        request.industry,
    )
