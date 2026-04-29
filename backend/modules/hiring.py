from __future__ import annotations

from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field


class HiringRequest(BaseModel):
    startup_name: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    stage: str = Field(..., min_length=1)
    equity_budget: str = Field(..., min_length=1)
    salary_budget: str = Field(..., min_length=1)


class JobDescription(BaseModel):
    role_summary: str
    responsibilities: List[str] = Field(..., min_length=8, max_length=8)
    requirements: List[str] = Field(..., min_length=6, max_length=6)
    nice_to_have: List[str] = Field(..., min_length=4, max_length=4)
    benefits: str


class EquitySplitAdvisor(BaseModel):
    suggested_equity_percent_for_role: str
    vesting_schedule_recommendation: str
    justification: str


class InterviewPlan(BaseModel):
    round_1_screening: List[str] = Field(..., min_length=5, max_length=5)
    round_2_technical: List[str] = Field(..., min_length=5, max_length=5)
    round_3_culture_fit: List[str] = Field(..., min_length=5, max_length=5)


class OrgChartSuggestion(BaseModel):
    current_stage_team_structure: List[str]
    next_6_months_hiring_plan: List[str]


class CompensationBenchmarks(BaseModel):
    market_salary_range_for_role: str
    equity_range_for_stage: str


class HiringResponse(BaseModel):
    startup_name: str
    role: str
    stage: str
    job_description: JobDescription
    equity_split_advisor: EquitySplitAdvisor
    interview_plan: InterviewPlan
    org_chart_suggestion: OrgChartSuggestion
    compensation_benchmarks: CompensationBenchmarks


def _normalize_stage(stage: str) -> str:
    normalized = stage.strip().lower()
    aliases = {
        "pre seed": "pre-seed",
        "preseed": "pre-seed",
        "seed stage": "seed",
        "series a": "series-a",
        "series b": "series-b",
        "series c": "series-c",
    }
    return aliases.get(normalized, normalized.replace(" ", "-"))


def _equity_by_stage(stage: str) -> str:
    table = {
        "pre-seed": "0.6% - 2.0%",
        "seed": "0.3% - 1.2%",
        "series-a": "0.15% - 0.7%",
        "series-b": "0.05% - 0.3%",
        "series-c": "0.02% - 0.12%",
    }
    return table.get(stage, "0.05% - 0.5%")


def _salary_by_stage(stage: str) -> str:
    table = {
        "pre-seed": "$80,000 - $140,000",
        "seed": "$100,000 - $170,000",
        "series-a": "$130,000 - $210,000",
        "series-b": "$150,000 - $240,000",
        "series-c": "$170,000 - $280,000",
    }
    return table.get(stage, "$110,000 - $200,000")


def _current_structure(stage: str, startup_name: str) -> List[str]:
    if stage == "pre-seed":
        return [
            f"Founder/CEO at {startup_name}",
            "Technical Co-founder / Founding Engineer",
            "Product + Design ownership shared by founders",
            "Part-time operations/finance support",
        ]
    if stage == "seed":
        return [
            "CEO / Founder",
            "Engineering Lead with 2-4 engineers",
            "Product Manager and Product Designer",
            "Growth/Marketing generalist and Customer Success",
        ]
    return [
        "Executive team (CEO, CTO, and GTM leadership)",
        "Engineering pods by product area",
        "Dedicated Product, Design, and Data functions",
        "Sales, Marketing, and Customer Success teams",
    ]


def _next_hiring_plan(stage: str, role: str) -> List[str]:
    base = [
        f"Hire {role} in month 1-2 with a 30/60/90-day success plan.",
        "Add one complementary cross-functional hire (product, design, or GTM) by month 3.",
        "Strengthen execution capacity with one mid-level specialist by month 4-5.",
        "Backfill operations support (recruiting, people ops, or finance) by month 6.",
    ]
    if stage in {"pre-seed", "seed"}:
        return base
    return [
        f"Add {role} as core owner in the target function.",
        "Hire a manager-level operator to scale team process and hiring quality.",
        "Build a bench of 2-3 IC hires aligned to roadmap priorities.",
        "Formalize recruiting pipeline with quarterly headcount planning.",
    ]


def _job_description(startup_name: str, role: str, stage: str) -> JobDescription:
    return JobDescription(
        role_summary=(
            f"{startup_name} is hiring a {role} to accelerate execution at the {stage} stage. "
            "This role will own key outcomes, collaborate across product and business teams, "
            "and help build repeatable systems as the company scales."
        ),
        responsibilities=[
            f"Own end-to-end delivery for the {role} function with clear weekly outcomes.",
            "Translate company goals into measurable quarterly plans and milestones.",
            "Collaborate with founders and cross-functional peers to prioritize highest-impact work.",
            "Build and improve operational processes to increase speed and quality.",
            "Use data and customer feedback to guide decisions and iteration cycles.",
            "Document strategy, execution playbooks, and decision rationale for team alignment.",
            "Mentor early team members and raise standards for execution and ownership.",
            "Report progress, risks, and recommendations with concise stakeholder communication.",
        ],
        requirements=[
            f"3+ years of hands-on experience in a role similar to {role}.",
            "Demonstrated ability to execute in fast-paced startup environments.",
            "Strong structured thinking and problem-solving with limited resources.",
            "Excellent written and verbal communication across technical and non-technical teams.",
            "Bias toward action with high accountability and ownership mindset.",
            "Experience using metrics to evaluate impact and refine strategy.",
        ],
        nice_to_have=[
            "Prior experience in a venture-backed startup from 0 to 1 or 1 to 10 stage.",
            "Exposure to fundraising or investor reporting workflows.",
            "Experience hiring and mentoring small, high-performing teams.",
            "Domain expertise aligned to the startup's market segment.",
        ],
        benefits=(
            "Competitive salary, meaningful equity, flexible work setup, direct mentorship from founders, "
            "high ownership from day one, and the opportunity to shape company culture and product direction."
        ),
    )


def _equity_advice(role: str, stage: str, equity_budget: str) -> EquitySplitAdvisor:
    suggested = _equity_by_stage(stage)
    return EquitySplitAdvisor(
        suggested_equity_percent_for_role=suggested,
        vesting_schedule_recommendation=(
            "4-year vesting with a 1-year cliff, then monthly vesting. "
            "Consider double-trigger acceleration only for acquisition + termination without cause."
        ),
        justification=(
            f"For a {role} hire at the {stage} stage, market grants typically land in {suggested}. "
            f"Given the stated equity budget ({equity_budget}), align the final grant to role criticality, "
            "candidate seniority, and expected ownership of company-level milestones."
        ),
    )


def _interview_plan(role: str) -> InterviewPlan:
    return InterviewPlan(
        round_1_screening=[
            f"What attracted you to this {role} opportunity at an early-stage startup?",
            "Walk us through a recent project where you drove impact under ambiguity.",
            "How do you prioritize when everything feels urgent?",
            "What type of team culture helps you do your best work?",
            "Why is this role the right next step in your career?",
        ],
        round_2_technical=[
            f"Describe the core frameworks or methods you rely on to succeed as a {role}.",
            "Explain a difficult problem you solved and how you measured success.",
            "How would you structure your first 30/60/90 days in this role?",
            "What trade-offs do you make between speed, quality, and scope?",
            "Share an example of a failed approach and what you changed afterwards.",
        ],
        round_3_culture_fit=[
            "How do you respond when priorities change quickly after planning is complete?",
            "Tell us about a disagreement with leadership and how you resolved it.",
            "What does ownership mean to you in a startup context?",
            "How do you balance independent execution with team collaboration?",
            "What values are non-negotiable for the company you choose to join?",
        ],
    )


router = APIRouter()


@router.post("/hiring", response_model=HiringResponse)
async def hiring_module(request: HiringRequest) -> HiringResponse:
    stage = _normalize_stage(request.stage)

    return HiringResponse(
        startup_name=request.startup_name,
        role=request.role,
        stage=stage,
        job_description=_job_description(request.startup_name, request.role, stage),
        equity_split_advisor=_equity_advice(request.role, stage, request.equity_budget),
        interview_plan=_interview_plan(request.role),
        org_chart_suggestion=OrgChartSuggestion(
            current_stage_team_structure=_current_structure(stage, request.startup_name),
            next_6_months_hiring_plan=_next_hiring_plan(stage, request.role),
        ),
        compensation_benchmarks=CompensationBenchmarks(
            market_salary_range_for_role=(
                f"{_salary_by_stage(stage)} (reference vs provided budget: {request.salary_budget})"
            ),
            equity_range_for_stage=_equity_by_stage(stage),
        ),
    )
