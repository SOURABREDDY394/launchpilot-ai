import { useState } from "react";

import { analyzeCompetitors } from "../api";

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

function SWOTCard({ label, items, classes }) {
  return (
    <div className={`rounded-2xl border p-5 ${classes}`}>
      <h4 className="text-lg font-semibold">{label}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-white/70 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompetitorAnalyzer() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await analyzeCompetitors(idea);
      setResult(data);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-cyan-200/70 bg-white/80 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Market Intel
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Competitor Analyzer
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Search the live market for real competitors, then synthesize a fast
            competitive map and startup SWOT.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          DuckDuckGo + LangChain
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe the startup idea you want to benchmark..."
          className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          required
        />
        <button
          type="submit"
          disabled={loading || !idea.trim()}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Analyzing competitors..." : "Analyze Competitors"}
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-8">
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
              Market Snapshot
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
              {result.market_summary}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                Top Competitors
              </h3>
              <p className="text-sm text-slate-500">
                Real companies surfaced from web search
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {result.competitors.map((competitor, index) => (
                <article
                  key={competitor.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Competitor {index + 1}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-slate-900">
                        {competitor.name}
                      </h4>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {competitor.description}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <h5 className="text-sm font-semibold text-emerald-900">
                        Strengths
                      </h5>
                      <ul className="mt-2 space-y-2 text-sm text-emerald-800">
                        {competitor.strengths.map((item) => (
                          <li key={item} className="rounded-lg bg-white/80 px-3 py-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <h5 className="text-sm font-semibold text-rose-900">
                        Weaknesses
                      </h5>
                      <ul className="mt-2 space-y-2 text-sm text-rose-800">
                        {competitor.weaknesses.map((item) => (
                          <li key={item} className="rounded-lg bg-white/80 px-3 py-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
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
              {swotConfig.map(({ key, label, classes }) => (
                <SWOTCard
                  key={key}
                  label={label}
                  items={result.swot[key] ?? []}
                  classes={classes}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
