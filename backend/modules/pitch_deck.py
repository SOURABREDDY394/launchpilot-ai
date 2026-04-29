from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from utils.llm import get_chat_llm


class PitchDeckRequest(BaseModel):
    startup_name: str = Field(..., min_length=2)
    problem: str = Field(..., min_length=10)
    solution: str = Field(..., min_length=10)
    market: str = Field(..., min_length=5)
    business_model: str = Field(..., min_length=5)


class Slide(BaseModel):
    slide_number: int = Field(..., ge=1, le=10)
    title: str = Field(..., min_length=1)
    content: List[str] = Field(..., min_length=1, max_length=6)


class PitchDeckResponse(BaseModel):
    startup_name: str = Field(..., min_length=1)
    slides: List[Slide] = Field(..., min_length=10, max_length=10)


class PitchDeckBuilder:
    def __init__(self) -> None:
        self.llm = get_chat_llm(temperature=0.4).with_structured_output(
            PitchDeckResponse,
            method="json_mode",
        )

    async def generate(self, request: PitchDeckRequest) -> PitchDeckResponse:
        prompt = """
You are a startup fundraising advisor creating a concise investor pitch deck.
Return strict JSON only.

Create exactly 10 slides and keep slide_number in order from 1 to 10.
Each slide must use the exact title shown below and provide concise, investor-ready bullets in content.

Slide structure:
1. Title Slide (tagline)
2. Problem (3 pain points)
3. Solution (3 key points)
4. Market Size (TAM, SAM, SOM)
5. Product (key features)
6. Business Model (revenue streams)
7. Traction (milestones placeholder)
8. Competition (positioning)
9. Team (roles needed)
10. Ask (funding amount + use of funds)

Detailed requirements:
- Slide 1 title must be "Title Slide" and content must include startup name and one tagline.
- Slide 2 title must be "Problem" and include exactly 3 pain points.
- Slide 3 title must be "Solution" and include exactly 3 key points.
- Slide 4 title must be "Market Size" and include TAM, SAM, SOM as separate bullets.
- Slide 5 title must be "Product" and include 3-5 key features.
- Slide 6 title must be "Business Model" and include 3-5 revenue stream bullets.
- Slide 7 title must be "Traction" and include realistic placeholder milestones (3-4 bullets).
- Slide 8 title must be "Competition" and include 3-4 bullets positioning the startup.
- Slide 9 title must be "Team" and include 3-5 critical roles to hire/fill.
- Slide 10 title must be "Ask" and include a funding amount plus 3-4 bullets for use of funds.
- Every content item must be short, specific, and presentation-ready.

Return JSON with exactly this schema:
{
  "startup_name": "...",
  "slides": [
    {
      "slide_number": 1,
      "title": "Title Slide",
      "content": ["..."]
    }
  ]
}
        """.strip()

        user_context = (
            f"Startup name: {request.startup_name}\n"
            f"Problem: {request.problem}\n"
            f"Solution: {request.solution}\n"
            f"Market: {request.market}\n"
            f"Business model: {request.business_model}"
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
                detail=f"Model returned invalid pitch deck payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Pitch deck generation failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/pitch-deck", response_model=PitchDeckResponse)
async def generate_pitch_deck(request: PitchDeckRequest) -> PitchDeckResponse:
    try:
        builder = PitchDeckBuilder()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await builder.generate(request)
