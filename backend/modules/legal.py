from __future__ import annotations

from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field


class LegalRequest(BaseModel):
    startup_name: str = Field(..., min_length=1)
    product_description: str = Field(..., min_length=1)
    country: str = Field(..., min_length=1)
    data_collected: str = Field(..., min_length=1)


class CoFounderAgreementOutline(BaseModel):
    roles_and_responsibilities: str
    equity_split_suggestion: str
    vesting_schedule: str
    ip_ownership: str


class LegalResponse(BaseModel):
    startup_name: str
    country: str
    terms_and_conditions: str
    privacy_policy: str
    cofounder_agreement_outline: CoFounderAgreementOutline
    compliance_checklist: List[str] = Field(..., min_length=10, max_length=10)
    recommended_business_structure: str


def _country_profile(country: str) -> dict[str, str]:
    normalized = country.strip().lower()
    if normalized in {"india", "in", "bharat"}:
        return {
            "region_law": "Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023",
            "authority": "relevant Indian regulator(s), including the Ministry of Electronics and Information Technology",
            "business_structure": "Private Limited Company",
            "governing_law": "laws of India",
        }
    if normalized in {"united states", "usa", "us"}:
        return {
            "region_law": "state privacy laws (including CCPA/CPRA where applicable) and federal consumer protection guidance",
            "authority": "applicable U.S. federal and state regulators",
            "business_structure": "LLC",
            "governing_law": "laws of the United States and applicable state law",
        }
    if normalized in {"united kingdom", "uk", "great britain", "england"}:
        return {
            "region_law": "UK GDPR, Data Protection Act 2018, and PECR",
            "authority": "Information Commissioner's Office (ICO)",
            "business_structure": "LLP",
            "governing_law": "laws of England and Wales",
        }
    if normalized in {"germany", "france", "spain", "italy", "netherlands", "eu", "european union"}:
        return {
            "region_law": "EU GDPR and ePrivacy requirements",
            "authority": "competent EU data protection authority",
            "business_structure": "LLC",
            "governing_law": "laws of the applicable EU member state",
        }
    return {
        "region_law": "applicable national data protection and consumer protection laws",
        "authority": "applicable data protection authority",
        "business_structure": "LLC",
        "governing_law": f"laws of {country.strip()}",
    }


def _terms_and_conditions(
    startup_name: str, product_description: str, country: str, governing_law: str
) -> str:
    return (
        f"TERMS AND CONDITIONS\n\n"
        f"Effective Date: [Insert Date]\n\n"
        f"1. Introduction\n"
        f"Welcome to {startup_name}. These Terms and Conditions (\"Terms\") govern access to and use of "
        f"our product and related services: {product_description}. By using the service, users agree to "
        f"be bound by these Terms.\n\n"
        f"2. Eligibility\n"
        f"Users must be at least 18 years old (or the age of majority in {country}) and legally capable "
        f"of entering into contracts.\n\n"
        f"3. Accounts and Security\n"
        f"Users are responsible for maintaining account confidentiality and for all activities under their "
        f"accounts. {startup_name} may suspend or terminate accounts for misuse, fraud, or security risks.\n\n"
        f"4. Acceptable Use\n"
        f"Users must not misuse the platform, reverse engineer core systems, introduce malware, violate "
        f"intellectual property rights, or use the service for unlawful activities.\n\n"
        f"5. Fees and Billing\n"
        f"Where paid plans apply, users agree to pay listed fees and applicable taxes. Unless otherwise "
        f"stated, charges are non-refundable except where required by law.\n\n"
        f"6. Intellectual Property\n"
        f"All rights in the service, including software, branding, and content (excluding user-submitted "
        f"materials), remain the exclusive property of {startup_name} and its licensors.\n\n"
        f"7. User Content\n"
        f"Users retain ownership of submitted content but grant {startup_name} a limited, non-exclusive "
        f"license to host, process, and display it solely to operate and improve the service.\n\n"
        f"8. Service Availability and Changes\n"
        f"{startup_name} may modify, suspend, or discontinue features at any time. We aim for reasonable "
        f"uptime but do not guarantee uninterrupted availability.\n\n"
        f"9. Disclaimer of Warranties\n"
        f"The service is provided \"as is\" and \"as available\" without warranties of merchantability, "
        f"fitness for a particular purpose, or non-infringement, to the fullest extent permitted by law.\n\n"
        f"10. Limitation of Liability\n"
        f"To the maximum extent allowed by law, {startup_name} shall not be liable for indirect, incidental, "
        f"special, consequential, or punitive damages, or for loss of profits, data, or goodwill.\n\n"
        f"11. Indemnity\n"
        f"Users agree to indemnify and hold harmless {startup_name}, its directors, employees, and affiliates "
        f"from claims arising from misuse of the service or violation of these Terms.\n\n"
        f"12. Termination\n"
        f"Either party may terminate use at any time. Provisions relating to IP, liability, indemnity, and "
        f"dispute resolution survive termination.\n\n"
        f"13. Governing Law and Dispute Resolution\n"
        f"These Terms are governed by {governing_law}. Disputes shall be resolved through good-faith "
        f"negotiation, and if unresolved, through courts/arbitration with competent jurisdiction in {country}.\n\n"
        f"14. Updates to Terms\n"
        f"{startup_name} may update these Terms from time to time. Continued use after publication of revised "
        f"Terms constitutes acceptance.\n\n"
        f"15. Contact\n"
        f"For legal notices, contact: legal@{startup_name.lower().replace(' ', '')}.com"
    )


def _privacy_policy(
    startup_name: str,
    product_description: str,
    country: str,
    data_collected: str,
    region_law: str,
    authority: str,
) -> str:
    return (
        f"PRIVACY POLICY\n\n"
        f"Effective Date: [Insert Date]\n\n"
        f"1. Scope\n"
        f"This Privacy Policy explains how {startup_name} collects, uses, stores, and protects personal "
        f"data when users access {product_description}. This policy is drafted to align with GDPR principles "
        f"and {region_law}.\n\n"
        f"2. Data Controller\n"
        f"{startup_name} acts as the data controller for personal data processed through the service.\n\n"
        f"3. Categories of Data Collected\n"
        f"We may collect: {data_collected}. We may also process technical metadata such as IP address, "
        f"device/browser details, and usage analytics for security and service quality.\n\n"
        f"4. Legal Bases for Processing (GDPR)\n"
        f"We process personal data under one or more lawful bases: consent, contract performance, "
        f"legitimate interests, legal obligations, and vital interests where applicable.\n\n"
        f"5. Purposes of Processing\n"
        f"Data is processed to provide and improve the service, personalize user experience, communicate "
        f"service updates, ensure security, comply with legal obligations, and prevent abuse.\n\n"
        f"6. Data Sharing and Processors\n"
        f"We may share data with vetted processors (hosting, analytics, payment, support) under written "
        f"contracts with confidentiality and data protection obligations. We do not sell personal data.\n\n"
        f"7. International Transfers\n"
        f"If data is transferred internationally, we implement appropriate safeguards such as Standard "
        f"Contractual Clauses or equivalent legally approved mechanisms.\n\n"
        f"8. Retention\n"
        f"Personal data is retained only as long as necessary for stated purposes, legal compliance, and "
        f"defense of claims. Retention periods are periodically reviewed.\n\n"
        f"9. Data Subject Rights\n"
        f"Users may request access, rectification, erasure, restriction, portability, objection to processing, "
        f"and withdrawal of consent where applicable. Users may also lodge complaints with {authority}.\n\n"
        f"10. Security Measures\n"
        f"We apply technical and organizational controls including access restrictions, encryption in transit, "
        f"monitoring, incident response procedures, and periodic security reviews.\n\n"
        f"11. Cookies and Tracking\n"
        f"We use essential and optional analytics/marketing cookies. Where required by law, we collect "
        f"prior consent and provide preference controls.\n\n"
        f"12. Children's Data\n"
        f"Our service is not directed to children under applicable age thresholds. We do not knowingly "
        f"collect children's data without lawful authorization.\n\n"
        f"13. Policy Updates\n"
        f"We may update this policy as legal or operational requirements evolve. Material changes will be "
        f"communicated through appropriate channels.\n\n"
        f"14. Contact\n"
        f"Privacy requests and questions: privacy@{startup_name.lower().replace(' ', '')}.com ({country})."
    )


def _cofounder_outline(startup_name: str, product_description: str) -> CoFounderAgreementOutline:
    return CoFounderAgreementOutline(
        roles_and_responsibilities=(
            f"For {startup_name}, define clear functional ownership: CEO (strategy, fundraising, hiring), "
            f"CTO (product architecture, engineering execution, security), and optional COO/CMO roles "
            f"(operations, growth, partnerships). Include decision rights, weekly reporting cadence, and "
            f"measurable quarterly OKRs tied to delivery of {product_description}."
        ),
        equity_split_suggestion=(
            "Use a contribution-based model balancing time commitment, prior work, domain expertise, "
            "and future role criticality. A neutral baseline for two full-time co-founders is 50/50, with "
            "adjustments where one founder contributes significantly more capital, IP, or execution risk."
        ),
        vesting_schedule=(
            "Adopt 4-year vesting with a 1-year cliff for founder equity. After the cliff, vest monthly or "
            "quarterly. Include accelerated vesting clauses only for specific events (e.g., acquisition and "
            "termination without cause), and define treatment for voluntary departure."
        ),
        ip_ownership=(
            f"All inventions, code, designs, trademarks, data models, and related work product created for "
            f"{startup_name} must be assigned to the company via signed IP assignment agreements. Include "
            "confidentiality, non-disclosure, and pre-existing IP carve-out clauses."
        ),
    )


def _compliance_checklist(country: str, region_law: str) -> List[str]:
    return [
        f"Register the legal entity and obtain required tax IDs in {country}.",
        "Publish Terms and Conditions and Privacy Policy on all user entry points.",
        f"Map all personal data flows and processing activities under {region_law}.",
        "Implement consent capture and withdrawal mechanisms for optional tracking.",
        "Sign Data Processing Agreements with all third-party processors.",
        "Enable data subject rights workflow (access, deletion, correction, portability).",
        "Enforce role-based access control and maintain audit logs for sensitive systems.",
        "Adopt incident response and breach-notification process with defined timelines.",
        "Create records retention and deletion policy with periodic reviews.",
        "Run annual legal and security compliance review with counsel or a compliance advisor.",
    ]


router = APIRouter()


@router.post("/legal", response_model=LegalResponse)
async def legal_module(request: LegalRequest) -> LegalResponse:
    profile = _country_profile(request.country)
    terms = _terms_and_conditions(
        request.startup_name,
        request.product_description,
        request.country,
        profile["governing_law"],
    )
    privacy = _privacy_policy(
        request.startup_name,
        request.product_description,
        request.country,
        request.data_collected,
        profile["region_law"],
        profile["authority"],
    )
    outline = _cofounder_outline(request.startup_name, request.product_description)
    checklist = _compliance_checklist(request.country, profile["region_law"])

    return LegalResponse(
        startup_name=request.startup_name,
        country=request.country,
        terms_and_conditions=terms,
        privacy_policy=privacy,
        cofounder_agreement_outline=outline,
        compliance_checklist=checklist,
        recommended_business_structure=profile["business_structure"],
    )
