from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field, ValidationError, field_validator

from utils.llm import get_chat_llm


class ParameterScore(BaseModel):
    score: int = Field(..., ge=1, le=10)
    rationale: str = Field(..., min_length=1)


class IdeaValidationResponse(BaseModel):
    market_size: ParameterScore
    competition_level: ParameterScore
    feasibility: ParameterScore
    timing: ParameterScore
    uniqueness: ParameterScore
    overall_score: float = Field(..., ge=1, le=10)
    verdict: str = Field(..., min_length=1)
    strengths: List[str] = Field(..., min_length=3, max_length=3)
    weaknesses: List[str] = Field(..., min_length=3, max_length=3)
    pivot_suggestions: List[str] = Field(default_factory=list, max_length=3)

    @field_validator("pivot_suggestions")
    @classmethod
    def validate_pivots(cls, value: List[str]) -> List[str]:
        if len(value) not in {0, 3}:
            raise ValueError("pivot_suggestions must contain either 0 or 3 items")
        return value


class IdeaValidationRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="Startup idea to evaluate")


class IdeaValidator:
    def __init__(self, model: str | None = None) -> None:
        base_llm = get_chat_llm(temperature=0.3, model=model)
        self.llm = base_llm.with_structured_output(
            IdeaValidationResponse,
            method="json_mode",
        )

    async def validate_idea(self, idea: str) -> IdeaValidationResponse:
        prompt = """
You are an expert startup analyst.
Evaluate the startup idea and return strict JSON only.

Scoring rules:
- Score each category from 1 to 10.
- Provide concise rationale for each category.
- Provide an overall_score from 1 to 10.
- Provide a one-line verdict.
- Return exactly 3 strengths.
- Return exactly 3 weaknesses.
- Return exactly 3 pivot_suggestions only if overall_score is below 6, otherwise return [].

Return JSON with exactly this schema:
{
  "market_size": { "score": 1, "rationale": "..." },
  "competition_level": { "score": 1, "rationale": "..." },
  "feasibility": { "score": 1, "rationale": "..." },
  "timing": { "score": 1, "rationale": "..." },
  "uniqueness": { "score": 1, "rationale": "..." },
  "overall_score": 1,
  "verdict": "...",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "pivot_suggestions": ["...", "...", "..."]
}
        """.strip()

        try:
            return await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(content=f"Startup idea: {idea}"),
                ]
            )
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid validation payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Idea validation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/validate-idea", response_model=IdeaValidationResponse)
async def validate_idea(request: IdeaValidationRequest) -> IdeaValidationResponse:
    try:
        validator = IdeaValidator()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await validator.validate_idea(request.idea)
