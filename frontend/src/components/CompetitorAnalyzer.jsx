import { ArrowRight, SearchCheck } from "lucide-react";
import { useState } from "react";

import { analyzeCompetitors } from "../api";

function SWOTCard({ label, items }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
      <p className="text-sm font-semibold text-white">{label}</p>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white/5 px-3 py-2">
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
    <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
            Competitor Analyzer
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Benchmark the market after the idea looks promising
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-300">
            Use this second. It helps you map nearby competitors, understand how crowded the space
            is, and spot possible whitespace before you commit.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          Supporting workflow
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
          <label className="text-sm font-semibold text-white">What should we benchmark?</label>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Hint: describe the product and user clearly so the market scan returns better
            competitors and sharper positioning clues.
          </p>
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="AI assistant that helps SMB founders monitor churn risk from customer conversations"
            className="mt-4 min-h-[150px] w-full resize-none rounded-[22px] border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-300/10"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Scanning competitors..." : "Find Competitors"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-5 rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-center gap-3 text-cyan-200">
              <SearchCheck className="h-5 w-5" />
              <p className="text-sm font-semibold">Market snapshot</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{result.market_summary}</p>
          </div>

          <div className="grid gap-4">
            {result.competitors.slice(0, 3).map((competitor, index) => (
              <article
                key={competitor.name}
                className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Competitor {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{competitor.name}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{competitor.description}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SWOTCard label="Strengths" items={result.swot?.strengths ?? []} />
            <SWOTCard label="Weaknesses" items={result.swot?.weaknesses ?? []} />
            <SWOTCard label="Opportunities" items={result.swot?.opportunities ?? []} />
            <SWOTCard label="Threats" items={result.swot?.threats ?? []} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
