from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from utils.llm import get_chat_llm


class ColdEmailRequest(BaseModel):
    product: str = Field(..., min_length=2)
    target_role: str = Field(..., min_length=2)
    industry: str = Field(..., min_length=2)
    pain_point: str = Field(..., min_length=5)


class DayOneEmail(BaseModel):
    hook: str = Field(..., min_length=1)
    problem_statement: List[str] = Field(..., min_length=2, max_length=2)
    solution: List[str] = Field(..., min_length=2, max_length=2)
    social_proof: str = Field(..., min_length=1)
    cta: str = Field(..., min_length=1)


class FollowUpEmail(BaseModel):
    subject: str = Field(..., min_length=1)
    body: str = Field(..., min_length=1)


class ColdEmailResponse(BaseModel):
    subject_lines: List[str] = Field(..., min_length=3, max_length=3)
    email_body: DayOneEmail
    follow_up_day3: FollowUpEmail
    follow_up_day7: FollowUpEmail


class ColdEmailWriter:
    def __init__(self) -> None:
        self.llm = get_chat_llm(temperature=0.5).with_structured_output(
            ColdEmailResponse,
            method="json_mode",
        )

    async def generate(self, request: ColdEmailRequest) -> ColdEmailResponse:
        prompt = """
You are an expert B2B cold email copywriter.
Return strict JSON only.

Write concise, high-converting cold outreach for a startup product.

Rules:
- Generate exactly 3 subject line variations in subject_lines.
- For email_body:
  - hook: exactly 1 sentence.
  - problem_statement: exactly 2 concise sentences.
  - solution: exactly 2 concise sentences.
  - social_proof: exactly 1 sentence.
  - cta: exactly 1 sentence.
- Create follow_up_day3 and follow_up_day7 with:
  - subject: exactly 1 short subject line each.
  - body: 3 to 5 short sentences each, with a polite tone and clear CTA.
- Keep everything personalized to target_role, industry, and pain_point.
- Do not use placeholders such as [Name] or [Company].
- Avoid buzzword-heavy text. Keep it direct and specific.

Return JSON with exactly this schema:
{
  "subject_lines": ["...", "...", "..."],
  "email_body": {
    "hook": "...",
    "problem_statement": ["...", "..."],
    "solution": ["...", "..."],
    "social_proof": "...",
    "cta": "..."
  },
  "follow_up_day3": {
    "subject": "...",
    "body": "..."
  },
  "follow_up_day7": {
    "subject": "...",
    "body": "..."
  }
}
        """.strip()

        user_context = (
            f"Product: {request.product}\n"
            f"Target role: {request.target_role}\n"
            f"Industry: {request.industry}\n"
            f"Pain point: {request.pain_point}"
        )

        try:
            return await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(content=user_context),
                ]
            )
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid cold email payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Cold email generation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/cold-email", response_model=ColdEmailResponse)
async def generate_cold_email(request: ColdEmailRequest) -> ColdEmailResponse:
    try:
        writer = ColdEmailWriter()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await writer.generate(request)
