from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from modules.competitor_analyzer import router as competitor_analyzer_router
from modules.cold_email import router as cold_email_router
from modules.finance import router as finance_router
from modules.gtm_strategy import router as gtm_strategy_router
from modules.hiring import router as hiring_router
from modules.icp_builder import router as icp_builder_router
from modules.idea_validator import router as idea_validator_router
from modules.legal import router as legal_router
from modules.pitch_deck import router as pitch_deck_router
from modules.prd_generator import router as prd_generator_router
from rag.rag_pipeline import router as rag_pipeline_router
from utils.settings import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        description="AI startup copilot powered by FastAPI, LangChain, and OpenAI.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "ok"}

    product_routers = [
        (idea_validator_router, "Idea Validator"),
        (competitor_analyzer_router, "Competitor Analyzer"),
        (prd_generator_router, "PRD Generator"),
        (gtm_strategy_router, "GTM Strategy"),
        (icp_builder_router, "ICP Builder"),
        (pitch_deck_router, "Pitch Deck"),
        (cold_email_router, "Cold Email Writer"),
        (finance_router, "Finance"),
        (legal_router, "Legal"),
        (hiring_router, "Hiring"),
        (rag_pipeline_router, "RAG Pipeline"),
    ]

    for router, tag in product_routers:
        app.include_router(router, tags=[tag])

    return app


app = create_app()
