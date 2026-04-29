import React, { useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);
const API_BASE_URL = window.__API_BASE_URL__ || "http://127.0.0.1:8000";

const scoreConfig = [
  { key: "market_size", label: "Market Size" },
  { key: "competition_level", label: "Competition Level" },
  { key: "feasibility", label: "Feasibility" },
  { key: "timing", label: "Timing" },
  { key: "uniqueness", label: "Uniqueness" },
];

const swotConfig = [
  {
    key: "strengths",
    label: "Strengths",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  {
    key: "weaknesses",
    label: "Weaknesses",
    classes: "border-rose-200 bg-rose-50 text-rose-900",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    classes: "border-sky-200 bg-sky-50 text-sky-900",
  },
  {
    key: "threats",
    label: "Threats",
    classes: "border-amber-200 bg-amber-50 text-amber-900",
  },
];

function ProgressBar({ label, score, rationale }) {
  const width = `${Math.max(0, Math.min(score ?? 0, 10)) * 10}%`;

  return html`
    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-800">${label}</span>
        <span className="text-sm font-bold text-slate-900">${score}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style=${{ width }}
        ></div>
      </div>
      <p className="text-sm text-slate-600">${rationale}</p>
    </div>
  `;
}

function SWOTCard({ label, items, classes }) {
  return html`
    <div className=${`rounded-2xl border p-5 ${classes}`}>
      <h4 className="text-lg font-semibold">${label}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        ${items.map(
          (item) => html`<li key=${item} className="rounded-xl bg-white/70 px-3 py-2">${item}</li>`
        )}
      </ul>
    </div>
  `;
}

function SectionList({ title, items }) {
  return html`
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">${title}</h4>
      <ul className="space-y-2 text-sm text-slate-700">
        ${items.map(
          (item) => html`<li key=${item} className="rounded-xl bg-slate-50 px-3 py-2">${item}</li>`
        )}
      </ul>
    </section>
  `;
}

function App() {
  const [idea, setIdea] = useState("");
  const [ideaResult, setIdeaResult] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [competitorIdea, setCompetitorIdea] = useState("");
  const [competitorResult, setCompetitorResult] = useState(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);
  const [competitorError, setCompetitorError] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [prdResult, setPrdResult] = useState(null);
  const [prdLoading, setPrdLoading] = useState(false);
  const [prdError, setPrdError] = useState("");

  const handleIdeaSubmit = async (event) => {
    event.preventDefault();
    setIdeaLoading(true);
    setIdeaError("");

    try {
      const response = await fetch(`${API_BASE_URL}/validate-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to validate idea right now.");
      }

      setIdeaResult(data);
    } catch (submitError) {
      setIdeaResult(null);
      setIdeaError(submitError.message);
    } finally {
      setIdeaLoading(false);
    }
  };

  const handleCompetitorSubmit = async (event) => {
    event.preventDefault();
    setCompetitorLoading(true);
    setCompetitorError("");

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: competitorIdea }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to analyze competitors right now.");
      }

      setCompetitorResult(data);
    } catch (submitError) {
      setCompetitorResult(null);
      setCompetitorError(submitError.message);
    } finally {
      setCompetitorLoading(false);
    }
  };

  const handlePrdSubmit = async (event) => {
    event.preventDefault();
    setPrdLoading(true);
    setPrdError("");

    try {
      const response = await fetch(`${API_BASE_URL}/generate-prd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName,
          product_description: productDescription,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to generate PRD right now.");
      }

      setPrdResult(data);
    } catch (submitError) {
      setPrdResult(null);
      setPrdError(submitError.message);
    } finally {
      setPrdLoading(false);
    }
  };

  return html`
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div
        className="absolute inset-0 opacity-80"
        style=${{
          backgroundImage:
            "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(135deg, rgba(15, 23, 42, 0.04) 25%, transparent 25%)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-cyan-300/20 via-emerald-200/10 to-transparent"></div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">LaunchPilot AI</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Validate startup ideas before you spend a quarter building them.
              </h1>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              FastAPI + LangChain + OpenAI
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Structured JSON scoring with clear rationale.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Ready for RAG, Supabase, ChromaDB, and Cloudinary layers.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Local backend hooked to the validator endpoint.
            </div>
          </div>
        </header>

        <div className="space-y-8">
        <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white/75 p-6 shadow-xl shadow-slate-200/40 backdrop-blur md:p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Idea Validator</h2>
            <p className="text-sm text-slate-600">
              Stress-test a startup concept across market, competition, feasibility, timing, and uniqueness.
            </p>
          </div>

          <form onSubmit=${handleIdeaSubmit} className="space-y-4">
            <textarea
              value=${idea}
              onChange=${(event) => setIdea(event.target.value)}
              placeholder="Describe your startup idea..."
              className="min-h-36 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            ></textarea>
            <button
              type="submit"
              disabled=${ideaLoading || !idea.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              ${ideaLoading ? "Validating..." : "Validate Idea"}
            </button>
          </form>

          ${ideaError
            ? html`<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ideaError}</div>`
            : null}

          ${ideaResult
            ? html`
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-slate-300">Overall Score</p>
                        <h3 className="text-4xl font-bold">${ideaResult.overall_score}/10</h3>
                      </div>
                      <p className="max-w-2xl text-sm text-slate-200">${ideaResult.verdict}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    ${scoreConfig.map(
                      ({ key, label }) =>
                        html`<${ProgressBar}
                          key=${key}
                          label=${label}
                          score=${ideaResult[key]?.score ?? 0}
                          rationale=${ideaResult[key]?.rationale ?? ""}
                        />`
                    )}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                      <h4 className="text-lg font-semibold text-emerald-900">Strengths</h4>
                      <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                        ${ideaResult.strengths.map(
                          (item) => html`<li key=${item} className="rounded-lg bg-white/70 px-3 py-2">${item}</li>`
                        )}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                      <h4 className="text-lg font-semibold text-red-900">Weaknesses</h4>
                      <ul className="mt-3 space-y-2 text-sm text-red-800">
                        ${ideaResult.weaknesses.map(
                          (item) => html`<li key=${item} className="rounded-lg bg-white/70 px-3 py-2">${item}</li>`
                        )}
                      </ul>
                    </div>
                  </div>

                  ${ideaResult.overall_score < 6 && ideaResult.pivot_suggestions?.length > 0
                    ? html`
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                          <h4 className="text-lg font-semibold text-amber-900">Pivot Suggestions</h4>
                          <ul className="mt-3 space-y-2 text-sm text-amber-900">
                            ${ideaResult.pivot_suggestions.map(
                              (item) =>
                                html`<li key=${item} className="rounded-lg bg-white/80 px-3 py-2">${item}</li>`
                            )}
                          </ul>
                        </div>
                      `
                    : null}
                </div>
              `
            : null}
        </section>
        
        <section className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-cyan-200/70 bg-white/80 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Market Intel</p>
              <h2 className="text-2xl font-bold text-slate-900">Competitor Analyzer</h2>
              <p className="max-w-2xl text-sm text-slate-600">
                Search the live market for real competitors, then synthesize a competitive map and SWOT table.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
              DuckDuckGo + LangChain
            </div>
          </div>

          <form onSubmit=${handleCompetitorSubmit} className="space-y-4">
            <textarea
              value=${competitorIdea}
              onChange=${(event) => setCompetitorIdea(event.target.value)}
              placeholder="Describe the startup idea you want to benchmark..."
              className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              required
            ></textarea>
            <button
              type="submit"
              disabled=${competitorLoading || !competitorIdea.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              ${competitorLoading ? "Analyzing competitors..." : "Analyze Competitors"}
            </button>
          </form>

          ${competitorError
            ? html`<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${competitorError}</div>`
            : null}

          ${competitorResult
            ? html`
                <div className="space-y-8">
                  <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Market Snapshot</p>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">${competitorResult.market_summary}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-900">Top Competitors</h3>
                      <p className="text-sm text-slate-500">Real companies surfaced from web search</p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      ${competitorResult.competitors.map(
                        (competitor, index) => html`
                          <article key=${competitor.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Competitor ${index + 1}</p>
                              <h4 className="mt-1 text-lg font-semibold text-slate-900">${competitor.name}</h4>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">${competitor.description}</p>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <h5 className="text-sm font-semibold text-emerald-900">Strengths</h5>
                                <ul className="mt-2 space-y-2 text-sm text-emerald-800">
                                  ${competitor.strengths.map(
                                    (item) => html`<li key=${item} className="rounded-lg bg-white/80 px-3 py-2">${item}</li>`
                                  )}
                                </ul>
                              </div>
                              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                                <h5 className="text-sm font-semibold text-rose-900">Weaknesses</h5>
                                <ul className="mt-2 space-y-2 text-sm text-rose-800">
                                  ${competitor.weaknesses.map(
                                    (item) => html`<li key=${item} className="rounded-lg bg-white/80 px-3 py-2">${item}</li>`
                                  )}
                                </ul>
                              </div>
                            </div>
                          </article>
                        `
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">SWOT Table</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Strategic summary for the idea based on the competitive field
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      ${swotConfig.map(
                        ({ key, label, classes }) => html`
                          <${SWOTCard}
                            key=${key}
                            label=${label}
                            items=${competitorResult.swot[key] ?? []}
                            classes=${classes}
                          />
                        `
                      )}
                    </div>
                  </div>
                </div>
              `
            : null}
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-violet-200/70 bg-white/85 p-6 shadow-2xl shadow-violet-950/10 backdrop-blur md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Product Planning</p>
              <h2 className="text-2xl font-bold text-slate-900">PRD Generator</h2>
              <p className="max-w-2xl text-sm text-slate-600">
                Turn a product concept into a structured PRD with goals, features, user stories, technical direction,
                and delivery phases.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
              OpenAI or Gemini via LangChain
            </div>
          </div>

          <form onSubmit=${handlePrdSubmit} className="grid gap-4">
            <input
              value=${productName}
              onChange=${(event) => setProductName(event.target.value)}
              placeholder="Product name"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              required
            />
            <textarea
              value=${productDescription}
              onChange=${(event) => setProductDescription(event.target.value)}
              placeholder="Describe the product, the problem it solves, and the kind of experience you want to build..."
              className="min-h-36 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              required
            ></textarea>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled=${prdLoading || !productName.trim() || !productDescription.trim()}
                className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                ${prdLoading ? "Generating PRD..." : "Generate PRD"}
              </button>
              <button
                type="button"
                onClick=${() => window.print()}
                disabled=${!prdResult}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export to PDF
              </button>
            </div>
          </form>

          ${prdError
            ? html`<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${prdError}</div>`
            : null}

          ${prdResult
            ? html`
                <article className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                  <header className="rounded-3xl bg-slate-900 p-6 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Product Requirements Document</p>
                    <h3 className="mt-2 text-3xl font-bold">${prdResult.product_name}</h3>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">${prdResult.product_description}</p>
                  </header>

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900">Problem Statement</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-700">${prdResult.problem_statement}</p>
                  </section>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <${SectionList} title="Target Users" items=${prdResult.target_users} />
                    <${SectionList} title="Goals" items=${prdResult.goals} />
                  </div>

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900">Goals & Success Metrics</h4>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Metric</th>
                            <th className="px-4 py-3 font-semibold">Target</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                          ${prdResult.success_metrics.map(
                            (item) => html`
                              <tr key=${`${item.metric}-${item.target}`}>
                                <td className="px-4 py-3">${item.metric}</td>
                                <td className="px-4 py-3">${item.target}</td>
                              </tr>
                            `
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <${SectionList} title="Must Have Features" items=${prdResult.features.must_have} />
                    <${SectionList} title="Nice to Have Features" items=${prdResult.features.nice_to_have} />
                  </div>

                  <${SectionList} title="User Stories" items=${prdResult.user_stories} />
                  <${SectionList} title="Tech Stack Suggestion" items=${prdResult.tech_stack_suggestion} />

                  <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900">Timeline Estimate</h4>
                    <div className="space-y-4">
                      ${prdResult.timeline_estimate.map(
                        (phase) => html`
                          <div key=${`${phase.phase}-${phase.duration}`} className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
                            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                              <h5 className="text-base font-semibold text-slate-900">${phase.phase}</h5>
                              <span className="text-sm font-medium text-violet-800">${phase.duration}</span>
                            </div>
                            <ul className="mt-3 space-y-2 text-sm text-slate-700">
                              ${phase.deliverables.map(
                                (item) => html`<li key=${item} className="rounded-xl bg-white/80 px-3 py-2">${item}</li>`
                              )}
                            </ul>
                          </div>
                        `
                      )}
                    </div>
                  </section>
                </article>
              `
            : null}
        </section>
        </div>
      </div>
    </main>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
