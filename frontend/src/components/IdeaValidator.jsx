import { useState } from "react";

import { validateIdea } from "../api";

const scoreConfig = [
  { key: "market_size", label: "Market Size" },
  { key: "competition_level", label: "Competition Level" },
  { key: "feasibility", label: "Feasibility" },
  { key: "timing", label: "Timing" },
  { key: "uniqueness", label: "Uniqueness" },
];

const ProgressBar = ({ label, score, rationale }) => {
  const width = `${Math.max(0, Math.min(score, 10)) * 10}%`;

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width }}
        />
      </div>
      <p className="text-sm text-slate-600">{rationale}</p>
    </div>
  );
};

export default function IdeaValidator() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await validateIdea(idea);
      setResult(data);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white/75 p-6 shadow-xl shadow-slate-200/40 backdrop-blur md:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Idea Validator</h2>
        <p className="text-sm text-slate-600">
          Stress-test a startup concept across market, competition, feasibility,
          timing, and uniqueness.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe your startup idea..."
          className="min-h-36 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          required
        />
        <button
          type="submit"
          disabled={loading || !idea.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Validating..." : "Validate Idea"}
        </button>
      </form>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-300">
                  Overall Score
                </p>
                <h3 className="text-4xl font-bold">{result.overall_score}/10</h3>
              </div>
              <p className="max-w-2xl text-sm text-slate-200">{result.verdict}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scoreConfig.map(({ key, label }) => (
              <ProgressBar
                key={key}
                label={label}
                score={result[key]?.score ?? 0}
                rationale={result[key]?.rationale ?? ""}
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h4 className="text-lg font-semibold text-emerald-900">Strengths</h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                {result.strengths.map((item) => (
                  <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <h4 className="text-lg font-semibold text-red-900">Weaknesses</h4>
              <ul className="mt-3 space-y-2 text-sm text-red-800">
                {result.weaknesses.map((item) => (
                  <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {result.overall_score < 6 && result.pivot_suggestions?.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="text-lg font-semibold text-amber-900">
                Pivot Suggestions
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {result.pivot_suggestions.map((item) => (
                  <li key={item} className="rounded-lg bg-white/80 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
