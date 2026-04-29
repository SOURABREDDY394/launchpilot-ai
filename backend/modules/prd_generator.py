from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from utils.llm import get_chat_llm


class SuccessMetric(BaseModel):
    metric: str = Field(..., min_length=1)
    target: str = Field(..., min_length=1)


class FeatureBucket(BaseModel):
    must_have: List[str] = Field(..., min_length=3, max_length=6)
    nice_to_have: List[str] = Field(..., min_length=2, max_length=5)


class TimelinePhase(BaseModel):
    phase: str = Field(..., min_length=1)
    duration: str = Field(..., min_length=1)
    deliverables: List[str] = Field(..., min_length=2, max_length=5)


class PRDResponse(BaseModel):
    product_name: str = Field(..., min_length=1)
    product_description: str = Field(..., min_length=1)
    problem_statement: str = Field(..., min_length=1)
    target_users: List[str] = Field(..., min_length=3, max_length=6)
    goals: List[str] = Field(..., min_length=3, max_length=5)
    success_metrics: List[SuccessMetric] = Field(..., min_length=3, max_length=5)
    features: FeatureBucket
    user_stories: List[str] = Field(..., min_length=5, max_length=8)
    tech_stack_suggestion: List[str] = Field(..., min_length=4, max_length=8)
    timeline_estimate: List[TimelinePhase] = Field(..., min_length=3, max_length=5)


class PRDRequest(BaseModel):
    product_name: str = Field(..., min_length=2)
    product_description: str = Field(..., min_length=10)


class PRDGenerator:
    def __init__(self) -> None:
        self.llm = get_chat_llm(temperature=0.3).with_structured_output(
            PRDResponse,
            method="json_mode",
        )

    async def generate(self, product_name: str, product_description: str) -> PRDResponse:
        prompt = """
You are a senior product manager creating an execution-ready Product Requirements Document.
Return strict JSON only.

Requirements:
- Write clear, specific, startup-friendly product strategy.
- Problem statement should be concise but concrete.
- Target users should be role or persona oriented.
- Goals and success metrics should be measurable.
- Features must be split into must_have and nice_to_have.
- User stories should follow the pattern: "As a ..., I want ..., so that ..."
- Tech stack suggestion should recommend practical technologies or services.
- Timeline estimate should be broken into phases with duration and deliverables.

Return JSON with exactly this schema:
{
  "product_name": "...",
  "product_description": "...",
  "problem_statement": "...",
  "target_users": ["...", "...", "..."],
  "goals": ["...", "...", "..."],
  "success_metrics": [
    { "metric": "...", "target": "..." }
  ],
  "features": {
    "must_have": ["...", "...", "..."],
    "nice_to_have": ["...", "..."]
  },
  "user_stories": ["As a ..., I want ..., so that ..."],
  "tech_stack_suggestion": ["...", "...", "...", "..."],
  "timeline_estimate": [
    {
      "phase": "...",
      "duration": "...",
      "deliverables": ["...", "..."]
    }
  ]
}
        """.strip()

        try:
            return await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(
                        content=(
                            f"Product name: {product_name}\n"
                            f"Product description: {product_description}"
                        )
                    ),
                ]
            )
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid PRD payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"PRD generation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/generate-prd", response_model=PRDResponse)
async def generate_prd(request: PRDRequest) -> PRDResponse:
    try:
        generator = PRDGenerator()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await generator.generate(request.product_name, request.product_description)
