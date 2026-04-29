from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from utils.llm import get_chat_llm


class ICPProfile(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=18, le=75)
    job_title: str = Field(..., min_length=1)
    goals: List[str] = Field(..., min_length=3, max_length=3)
    pain_points: List[str] = Field(..., min_length=3, max_length=3)
    hangout_online: List[str] = Field(..., min_length=2, max_length=4)
    reach_channels: List[str] = Field(..., min_length=2, max_length=4)


class ResonanceMessage(BaseModel):
    profile_name: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)


class ICPBuilderResponse(BaseModel):
    icps: List[ICPProfile] = Field(..., min_length=3, max_length=3)
    best_customer_segment: str = Field(..., min_length=1)
    resonance_messages: List[ResonanceMessage] = Field(..., min_length=3, max_length=3)


class ICPBuilderRequest(BaseModel):
    product: str = Field(..., min_length=2)
    industry: str = Field(..., min_length=2)


class ICPBuilder:
    def __init__(self, model: str | None = None) -> None:
        base_llm = get_chat_llm(temperature=0.3, model=model)
        self.llm = base_llm.with_structured_output(
            ICPBuilderResponse,
            method="json_mode",
        )

    async def generate(self, product: str, industry: str) -> ICPBuilderResponse:
        prompt = """
You are a senior B2B/B2C market strategist.
Generate exactly 3 Ideal Customer Profiles (ICPs) for the given product and industry.
Return strict JSON only. No markdown, no prose outside JSON.

Requirements:
- Return exactly 3 icps.
- Every ICP must include:
  - name (persona name)
  - age (realistic integer age)
  - job_title
  - goals (exactly 3 concise points)
  - pain_points (exactly 3 concise points)
  - hangout_online (2-4 communities/platforms where they spend time)
  - reach_channels (2-4 channels/tactics to reach this profile)
- best_customer_segment must be the exact profile name from one of the 3 icps and represent who to target first.
- resonance_messages must contain exactly 3 items:
  - One message per profile.
  - profile_name must exactly match one of the ICP names.
  - message should be a sharp 1-2 sentence value proposition that resonates with that profile's goals and pain points.
- Keep all output tightly tailored to the provided product and industry.

Return JSON with exactly this schema:
{
  "icps": [
    {
      "name": "...",
      "age": 30,
      "job_title": "...",
      "goals": ["...", "...", "..."],
      "pain_points": ["...", "...", "..."],
      "hangout_online": ["...", "..."],
      "reach_channels": ["...", "..."]
    }
  ],
  "best_customer_segment": "...",
  "resonance_messages": [
    { "profile_name": "...", "message": "..." }
  ]
}
        """.strip()

        try:
            return await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(
                        content=f"Product: {product}\nIndustry: {industry}"
                    ),
                ]
            )
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid ICP builder payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"ICP builder generation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/icp-builder", response_model=ICPBuilderResponse)
async def build_icp(request: ICPBuilderRequest) -> ICPBuilderResponse:
    try:
        builder = ICPBuilder()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await builder.generate(request.product, request.industry)
