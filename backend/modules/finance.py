from __future__ import annotations

from typing import List, Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field


class ExpenseItem(BaseModel):
    category: str = Field(..., min_length=1)
    amount: float = Field(..., ge=0)


class FinanceRequest(BaseModel):
    startup_name: str = Field(..., min_length=1)
    monthly_expenses: List[ExpenseItem] = Field(..., min_length=1)
    monthly_revenue: float = Field(..., ge=0)
    funding: float = Field(..., ge=0)


class PricingStrategy(BaseModel):
    recommended_model: Literal["freemium", "subscription", "usage"]
    price_range: str
    justification: str


class RevenueProjectionItem(BaseModel):
    month: int = Field(..., ge=1, le=12)
    projected_revenue: float = Field(..., ge=0)


class FundraisingReadiness(BaseModel):
    score: int = Field(..., ge=1, le=10)
    what_you_have: List[str]
    what_you_need: List[str]
    recommended_stage: Literal["pre-seed", "seed"]


class FinanceResponse(BaseModel):
    startup_name: str
    burn_rate_monthly: float
    runway_months_remaining: float | None
    break_even_months: float | None
    pricing_strategy: PricingStrategy
    revenue_projections_12_months: List[RevenueProjectionItem] = Field(
        ..., min_length=12, max_length=12
    )
    fundraising_readiness: FundraisingReadiness


def _safe_round(value: float) -> float:
    return round(max(value, 0), 2)


def _pricing_strategy(
    monthly_revenue: float, burn_rate: float, expenses_count: int
) -> PricingStrategy:
    if monthly_revenue < 5000:
        return PricingStrategy(
            recommended_model="freemium",
            price_range="$0 free tier, $9-$29/mo premium",
            justification=(
                "Low current revenue suggests reducing acquisition friction. "
                "A freemium funnel can accelerate user adoption, then convert "
                "engaged users to premium plans."
            ),
        )

    if expenses_count >= 5 or burn_rate > monthly_revenue:
        return PricingStrategy(
            recommended_model="subscription",
            price_range="$29-$149/mo by feature tier",
            justification=(
                "Recurring costs are meaningful and cashflow needs predictability. "
                "Subscription pricing creates stable monthly revenue and clearer LTV."
            ),
        )

    return PricingStrategy(
        recommended_model="usage",
        price_range="$0.01-$0.10 per unit or action",
        justification=(
            "Current revenue indicates traction and variable usage potential. "
            "Usage-based pricing aligns customer spend with delivered value."
        ),
    )


def _readiness(
    monthly_revenue: float, burn_rate: float, runway: float | None, funding: float
) -> FundraisingReadiness:
    score = 3
    what_you_have: List[str] = []
    what_you_need: List[str] = []

    if monthly_revenue > 0:
        score += 2
        what_you_have.append("Revenue signal from active customers.")
    else:
        what_you_need.append("Early customer validation and first paid users.")

    if monthly_revenue >= burn_rate and burn_rate > 0:
        score += 2
        what_you_have.append("Sustainable unit economics at current scale.")
    else:
        what_you_need.append("Stronger margin profile or lower operating burn.")

    if runway is not None and runway >= 9:
        score += 2
        what_you_have.append("Healthy runway to execute milestones.")
    else:
        what_you_need.append("Runway extension plan with cost controls.")

    if funding >= 250000:
        score += 1
        what_you_have.append("Initial capital base to support execution.")
    else:
        what_you_need.append("Committed capital cushion for next 12 months.")

    if monthly_revenue >= 20000:
        score += 1
        what_you_have.append("Meaningful monthly traction for investor narrative.")
    else:
        what_you_need.append("Clear growth trend and repeatable customer acquisition.")

    score = max(1, min(10, score))
    stage: Literal["pre-seed", "seed"] = "seed" if score >= 7 else "pre-seed"

    return FundraisingReadiness(
        score=score,
        what_you_have=what_you_have[:4] or ["Founding team and initial product direction."],
        what_you_need=what_you_need[:4] or ["Expand channel efficiency and retention metrics."],
        recommended_stage=stage,
    )


router = APIRouter()


@router.post("/finance", response_model=FinanceResponse)
async def finance_module(request: FinanceRequest) -> FinanceResponse:
    burn_rate = _safe_round(sum(item.amount for item in request.monthly_expenses))
    monthly_revenue = max(request.monthly_revenue, 0)

    if burn_rate == 0:
        runway: float | None = None
        break_even: float | None = 0.0 if monthly_revenue > 0 else None
    else:
        net_burn = burn_rate - monthly_revenue
        runway = None if net_burn <= 0 else _safe_round(request.funding / net_burn)
        break_even = (
            0.0
            if monthly_revenue >= burn_rate
            else _safe_round((burn_rate - monthly_revenue) / max(monthly_revenue * 0.12, 1))
        )

    base_growth = 0.08 if monthly_revenue > 0 else 0.15
    if burn_rate > monthly_revenue:
        base_growth += 0.02

    projections: List[RevenueProjectionItem] = []
    current = monthly_revenue
    for month in range(1, 13):
        current = current * (1 + base_growth)
        projections.append(
            RevenueProjectionItem(month=month, projected_revenue=_safe_round(current))
        )

    pricing = _pricing_strategy(monthly_revenue, burn_rate, len(request.monthly_expenses))
    readiness = _readiness(monthly_revenue, burn_rate, runway, request.funding)

    return FinanceResponse(
        startup_name=request.startup_name,
        burn_rate_monthly=burn_rate,
        runway_months_remaining=runway,
        break_even_months=break_even,
        pricing_strategy=pricing,
        revenue_projections_12_months=projections,
        fundraising_readiness=readiness,
    )
