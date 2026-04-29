from __future__ import annotations

import json
from typing import List

from fastapi import APIRouter, HTTPException
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError, field_validator

from utils.llm import get_chat_llm


class CompetitorProfile(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    strengths: List[str] = Field(..., min_length=2, max_length=3)
    weaknesses: List[str] = Field(..., min_length=2, max_length=3)


class SWOTAnalysis(BaseModel):
    strengths: List[str] = Field(..., min_length=3, max_length=4)
    weaknesses: List[str] = Field(..., min_length=3, max_length=4)
    opportunities: List[str] = Field(..., min_length=3, max_length=4)
    threats: List[str] = Field(..., min_length=3, max_length=4)


class CompetitorAnalysisResponse(BaseModel):
    idea: str = Field(..., min_length=5)
    market_summary: str = Field(..., min_length=1)
    competitors: List[CompetitorProfile] = Field(..., min_length=5, max_length=5)
    swot: SWOTAnalysis


class CompetitorAnalysisRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="Startup idea to analyze")


class CompetitorAnalyzer:
    def __init__(self, model: str | None = None) -> None:
        self.search = DuckDuckGoSearchResults(
            output_format="list",
            num_results=8,
        )
        base_llm = get_chat_llm(temperature=0.2, model=model)
        self.llm = base_llm.with_structured_output(
            CompetitorAnalysisResponse,
            method="json_mode",
        )

    def _search_queries(self, idea: str) -> list[str]:
        return [
            f"{idea} startup competitors",
            f"{idea} alternatives software companies",
            f"companies similar to {idea}",
        ]

    def _collect_search_context(self, idea: str) -> str:
        search_payload: list[dict[str, object]] = []
        for query in self._search_queries(idea):
            results = self.search.invoke(query)
            if isinstance(results, str):
                try:
                    parsed_results = json.loads(results)
                except json.JSONDecodeError:
                    parsed_results = [{"snippet": results}]
            else:
                parsed_results = results
            search_payload.append({"query": query, "results": parsed_results})
        return json.dumps(search_payload, ensure_ascii=True)

    async def analyze(self, idea: str) -> CompetitorAnalysisResponse:
        prompt = """
You are an expert startup research analyst.
You will receive a startup idea and real-world web search results from DuckDuckGo.
Use only the grounded search evidence to infer relevant real competitors.

Requirements:
- Return exactly 5 competitors.
- Each competitor needs name, description, 2-3 strengths, and 2-3 weaknesses.
- Build a SWOT summary for the startup idea itself, not for one competitor.
- Prefer real companies and products that plausibly compete for the same customer or budget.
- If direct competitors are sparse, include adjacent substitutes, but keep them real.
- Return strict JSON only.

Return JSON with exactly this schema:
{
  "idea": "...",
  "market_summary": "...",
  "competitors": [
    {
      "name": "...",
      "description": "...",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."]
    }
  ],
  "swot": {
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "opportunities": ["...", "...", "..."],
    "threats": ["...", "...", "..."]
  }
}
        """.strip()

        search_context = self._collect_search_context(idea)
        try:
            response = await self.llm.ainvoke(
                [
                    SystemMessage(content=prompt),
                    HumanMessage(
                        content=(
                            f"Startup idea: {idea}\n"
                            f"DuckDuckGo search evidence: {search_context}"
                        )
                    ),
                ]
            )
            return response
        except ValidationError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned invalid competitor analysis payload: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Competitor analysis failed: {exc}",
            ) from exc


router = APIRouter()


@router.post("/analyze-competitors", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(
    request: CompetitorAnalysisRequest,
) -> CompetitorAnalysisResponse:
    try:
        analyzer = CompetitorAnalyzer()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return await analyzer.analyze(request.idea)
