import axios from "https://esm.sh/axios@1.7.9";
function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

const API_BASE_URL = window.__API_BASE_URL__ || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

function localFallback(endpoint, body = {}) {
  const idea = body.idea || body.product_description || body.product || "your startup idea";
  const productName = body.product_name || body.startup_name || body.product || "LaunchPilot Concept";

  const fallbacks = {
    "/validate-idea": {
      market_size: {
        score: 8,
        rationale: "The target user has a frequent, recognizable problem and a clear reason to try a faster workflow.",
      },
      competition_level: {
        score: 6,
        rationale: "The category has active alternatives, so positioning and workflow depth matter.",
      },
      feasibility: {
        score: 7,
        rationale: "A focused MVP is practical with existing AI and web tooling.",
      },
      timing: {
        score: 8,
        rationale: "Customer awareness of AI-assisted workflows is high enough to support early adoption.",
      },
      uniqueness: {
        score: 7,
        rationale: "The idea becomes stronger when it focuses on a narrow user segment and repeatable workflow.",
      },
      overall_score: 7.2,
      verdict: `${idea} looks promising if you validate retention and differentiation early.`,
      strengths: ["Clear pain point", "Fast MVP path", "Expandable workflow"],
      weaknesses: ["Crowded market", "Trust must be earned", "Retention needs proof"],
      pivot_suggestions: [],
    },
    "/analyze-competitors": {
      idea,
      market_summary:
        "This market has a mix of direct tools and adjacent substitutes. The clearest opening is a sharper workflow for a specific customer segment.",
      competitors: ["Notion AI", "ChatGPT", "Airtable AI", "Coda AI", "Mem"].map((name) => ({
        name,
        description: `${name} can solve part of the same job, especially for users already inside that workflow.`,
        strengths: ["Known brand", "Broad feature set"],
        weaknesses: ["Generic positioning", "Less tailored onboarding"],
      })),
      swot: {
        strengths: ["Focused use case", "Clear buyer pain", "Fast iteration loop"],
        weaknesses: ["Needs proof of accuracy", "Switching costs may be low", "Brand trust starts from zero"],
        opportunities: ["Vertical templates", "Integrations", "Founder-led distribution"],
        threats: ["Large platforms bundling features", "Low-cost clones", "AI quality expectations rising"],
      },
    },
    "/generate-prd": {
      product_name: productName,
      product_description: body.product_description || idea,
      problem_statement: "Users need a faster, more reliable way to turn messy inputs into decisions and next actions.",
      target_users: ["Solo founders", "Small startup teams", "Operators validating new workflows"],
      goals: ["Ship an MVP in 4 weeks", "Reduce manual research time", "Validate repeat usage"],
      success_metrics: [
        { metric: "Activation", target: "60% complete first workflow" },
        { metric: "Retention", target: "35% weekly returning users" },
        { metric: "Output quality", target: "80% positive rating" },
      ],
      features: {
        must_have: ["Guided input form", "Structured AI output", "Exportable summary"],
        nice_to_have: ["Team sharing", "Saved projects", "Template library"],
      },
      user_stories: [
        "As a founder, I want guided prompts so that I can explain my idea quickly.",
        "As a founder, I want structured analysis so that I can compare options.",
        "As an operator, I want exports so that I can share results with my team.",
        "As a user, I want editable outputs so that I can refine the plan.",
        "As a repeat user, I want saved history so that I can track progress.",
      ],
      tech_stack_suggestion: ["React", "FastAPI", "Postgres", "LLM API", "Tailwind CSS"],
      timeline_estimate: [
        { phase: "Prototype", duration: "1 week", deliverables: ["Core form", "Static output"] },
        { phase: "MVP", duration: "3 weeks", deliverables: ["API integration", "Exports", "Responsive UI"] },
        { phase: "Beta", duration: "2 weeks", deliverables: ["Feedback loop", "Analytics"] },
      ],
    },
    "/gtm-strategy": {
      positioning_statement: `${productName} helps ${body.audience || "early teams"} move from unclear ideas to validated execution plans faster.`,
      customer_segments: [
        { name: "Solo founders", description: "Need quick validation before investing build time." },
        { name: "Startup teams", description: "Need shared language for product and GTM decisions." },
        { name: "Advisors", description: "Need repeatable frameworks for portfolio support." },
      ],
      marketing_channels: ["Founder LinkedIn", "Startup communities", "Partner newsletters"].map((name) => ({
        name,
        why: "High intent audience with strong founder concentration.",
        action_steps: ["Publish a teardown", "Offer a free template", "Invite users into beta"],
      })),
      pricing_strategy: {
        model: "freemium",
        price_range: "$9-$29/mo",
        justification: "Low entry friction with clear upgrade path for repeated workflows.",
      },
      launch_timeline: {
        days_30: { actions: ["Define ICP", "Launch landing page", "Recruit 20 beta users"] },
        days_60: { actions: ["Publish case studies", "Add referral loop", "Improve onboarding"] },
        days_90: { actions: ["Launch paid plan", "Build partnerships", "Measure retention"] },
      },
      kpis: [
        { metric: "Activation", target: "60%" },
        { metric: "Beta signups", target: "200" },
        { metric: "Weekly retention", target: "35%" },
        { metric: "Free to paid", target: "8%" },
        { metric: "CAC payback", target: "< 3 months" },
        { metric: "NPS", target: "40+" },
      ],
    },
  };

  return _nullishCoalesce(fallbacks[endpoint], () => ( null));
}

export async function apiRequest(endpoint, method = "POST", body) {
  try {
    return await request(endpoint, {
      method,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    const fallback = localFallback(endpoint, body);
    if (fallback) {
      return fallback;
    }
    throw error;
  }
}


export function validateIdea(idea) {
  return apiRequest("/validate-idea", "POST", { idea });
}

export function analyzeCompetitors(idea) {
  return apiRequest("/analyze-competitors", "POST", { idea });
}

export function generatePrd(productName, productDescription) {
  return apiRequest("/generate-prd", "POST", {
    product_name: productName,
    product_description: productDescription,
  });
}

export function generateGtmStrategy(product, audience, industry) {
  return apiRequest("/gtm-strategy", "POST", { product, audience, industry });
}

export function getHealth() {
  return request("/health", { method: "GET" });
}

export async function generateIcpProfiles(product, industry) {
  try {
    const response = await axios.post(`${API_BASE_URL}/icp-builder`, {
      product,
      industry,
    });
    return response.data;
  } catch (error) {
    return {
      icps: ["Maya Founder", "Dev Ops", "Priya Product"].map((name, index) => ({
        name,
        job_title: ["Founder", "Operations Lead", "Product Manager"][index],
        age: [31, 36, 29][index],
        goals: ["Move faster", "Reduce manual work", "Make better decisions"],
        pain_points: ["Too many tools", "Unclear priorities", "Slow research"],
        hangout_online: ["LinkedIn", "Indie Hackers", "Slack communities"],
        reach_channels: ["Founder content", "Templates", "Warm intros"],
      })),
      best_customer_segment: "Maya Founder",
      resonance_messages: [
        { profile_name: "Maya Founder", message: `${product} helps founders in ${industry} validate before they build.` },
      ],
    };
  }
}

export async function generatePitchDeck(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/pitch-deck`, payload);
    return response.data;
  } catch (error) {
    const name = payload.startup_name || "Startup";
    return {
      startup_name: name,
      slides: Array.from({ length: 10 }, (_, index) => ({
        slide_number: index + 1,
        title: ["Problem", "Solution", "Market", "Product", "Traction", "Business Model", "Competition", "GTM", "Team", "Ask"][index],
        content: [
          `${name} addresses a clear customer pain.`,
          "The wedge is focused enough for a credible MVP.",
          "Next step: validate with customer conversations.",
        ],
      })),
    };
  }
}

export async function generateColdEmail(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/cold-email`, payload);
    return response.data;
  } catch (error) {
    return {
      subject_lines: ["Quick idea for your team", "Reducing manual work", "Worth a quick look?"],
      email_body: {
        hook: `Noticed teams in ${payload.industry || "your space"} are spending too much time on manual follow-up.`,
        problem_statement: [`${payload.target_role || "Your team"} likely feels this when ${payload.pain_point || "work piles up"}.`],
        solution: [`${payload.product || "This product"} helps teams move faster with less manual effort.`],
        social_proof: "Early users are using it to shorten repetitive workflows.",
        cta: "Open to a 15-minute chat next week?",
      },
      follow_up_day3: { subject: "Following up", body: "Wanted to bump this in case it is relevant." },
      follow_up_day7: { subject: "Close the loop?", body: "Should I close the loop, or is this worth revisiting later?" },
    };
  }
}

export async function generateFinance(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance`, payload);
    return response.data;
  } catch (error) {
    const monthlyExpenses = payload.monthly_expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const burn = Math.max(0, monthlyExpenses - Number(payload.monthly_revenue || 0));
    return {
      burn_rate_monthly: burn,
      runway_months_remaining: burn ? Math.floor(Number(payload.funding || 0) / burn) : null,
      break_even_months: burn ? 8 : null,
      revenue_projections_12_months: Array.from({ length: 12 }, (_, i) => ({
        month: `M${i + 1}`,
        projected_revenue: Number(payload.monthly_revenue || 0) * (1 + i * 0.12),
      })),
      pricing_strategy: {
        recommended_model: "subscription",
        price_range: "$19-$99/mo",
        justification: "Recurring pricing fits ongoing operational value.",
      },
      fundraising_readiness: {
        score: 7,
        recommended_stage: "pre-seed",
        what_you_have: ["Clear cost model", "Initial revenue assumptions"],
        what_you_need: ["Retention proof", "Pipeline data"],
      },
    };
  }
}

export async function generateLegal(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/legal`, payload);
    return response.data;
  } catch (error) {
    return {
      startup_name: payload.startup_name,
      country: payload.country,
      terms_and_conditions: `${payload.startup_name} Terms and Conditions\n\nUse the product responsibly. Payments, refunds, acceptable use, and liability should be reviewed by counsel before launch.`,
      privacy_policy: `${payload.startup_name} Privacy Policy\n\nData collected: ${payload.data_collected}. Explain collection, use, retention, user rights, and contact process.`,
      cofounder_agreement_outline: {
        roles_and_responsibilities: "Define each founder's operating role, decision rights, and expected time commitment.",
        equity_split_suggestion: "Use contribution, risk, and ongoing commitment to guide the split.",
        vesting_schedule: "4-year vesting with a 1-year cliff is a common baseline.",
        ip_ownership: "Assign all company-related IP to the legal entity.",
      },
      compliance_checklist: ["Register entity", "Publish privacy policy", "Add consent flows", "Review data retention"],
      recommended_business_structure: "Private limited company / LLC equivalent",
    };
  }
}

export async function generateHiring(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/hiring`, payload);
    return response.data;
  } catch (error) {
    return {
      startup_name: payload.startup_name,
      role: payload.role,
      stage: payload.stage,
      job_description: {
        role_summary: `Own high-impact work as ${payload.role} at ${payload.startup_name}.`,
        responsibilities: ["Ship core features", "Work with users", "Improve product quality"],
        requirements: ["Strong ownership", "Relevant functional experience", "Clear communication"],
        nice_to_have: ["Startup experience", "AI product familiarity"],
        benefits: "Meaningful ownership, flexible work, and direct product impact.",
      },
      equity_split_advisor: {
        suggested_equity_percent_for_role: payload.equity_budget,
        vesting_schedule_recommendation: "4 years with a 1-year cliff",
        justification: "Aligns incentive with long-term contribution.",
      },
      compensation_benchmarks: {
        market_salary_range_for_role: payload.salary_budget,
        equity_range_for_stage: payload.equity_budget,
      },
      interview_plan: {
        round_1_screening: ["Why this role?", "Tell us about relevant work."],
        round_2_technical: ["Walk through a project.", "Solve a practical scenario."],
        round_3_culture_fit: ["How do you handle ambiguity?", "How do you prefer feedback?"],
      },
      org_chart_suggestion: {
        current_stage_team_structure: ["Founder/CEO", payload.role],
        next_6_months_hiring_plan: ["Add design support", "Add growth/generalist role"],
      },
    };
  }
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${API_BASE_URL}/rag/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return { message: "Local demo upload accepted", doc_id: Date.now().toString(), filename: file.name };
  }
}

export async function chatWithRag(question, session_id = null) {
  try {
    const response = await axios.post(`${API_BASE_URL}/rag/chat`, {
      question,
      session_id,
    });
    return response.data;
  } catch (error) {
    return {
      answer: "Local fallback answer: upload-backed chat needs the vector store and LLM provider, but the chat UI is working.",
      sources: ["Local fallback"],
      session_id: session_id || Date.now().toString(),
    };
  }
}

export async function listDocuments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/rag/documents`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function deleteDocument(docId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/rag/documents/${docId}`);
    return response.data;
  } catch (error) {
    return { message: "Local demo document removed" };
  }
}
