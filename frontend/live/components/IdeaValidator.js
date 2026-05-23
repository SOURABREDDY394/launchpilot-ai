import React from "https://esm.sh/react@18.3.1?dev";
import { ArrowRight, Sparkles } from "https://esm.sh/lucide-react@0.469.0";
import { useState } from "https://esm.sh/react@18.3.1?dev";
import { validateIdea } from "../api.js";
function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



const scoreConfig = [
  { key: "market_size", label: "Market" },
  { key: "competition_level", label: "Competition" },
  { key: "feasibility", label: "Feasibility" },
  { key: "timing", label: "Timing" },
  { key: "uniqueness", label: "Differentiation" },
];

const previewResult = {
  market_size: {
    score: 8,
    rationale:
      "Students repeatedly revisit lectures and benefit from a faster comprehension loop.",
  },
  competition_level: {
    score: 6,
    rationale:
      "The market is active, but there is still room for a focused wedge with better workflow design.",
  },
  feasibility: {
    score: 7,
    rationale:
      "AI summarization is accessible technically, though trust and accuracy matter for adoption.",
  },
  timing: {
    score: 8,
    rationale:
      "AI-assisted study tools are well timed thanks to stronger user familiarity and demand.",
  },
  uniqueness: {
    score: 7,
    rationale:
      "Differentiation improves if the product layers recall, citations, and student workflow depth.",
  },
  overall_score: 7.8,
  verdict:
    "Promising wedge if you focus on trust, student retention, and a tighter workflow than generic assistants.",
  strengths: [
    "High-frequency user behavior",
    "Easy value proposition to communicate",
    "Expandable into notes, quizzes, and revision loops",
  ],
  weaknesses: [
    "Crowded AI productivity category",
    "Retention risk without proprietary workflow hooks",
    "Education users expect very high accuracy",
  ],
};

function ScorePill({ label, value }) {
  return (
    React.createElement('div', { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"      ,}
      , React.createElement('p', { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"    ,}
        , label
      )
      , React.createElement('p', { className: "mt-2 text-lg font-semibold text-white"   ,}, value)
    )
  );
}

function MetricBar({ label, score, rationale }) {
  const width = `${Math.max(0, Math.min(score, 10)) * 10}%`;

  return (
    React.createElement('div', { className: "rounded-[24px] border border-white/10 bg-slate-950/55 p-4"    ,}
      , React.createElement('div', { className: "flex items-center justify-between gap-4"   ,}
        , React.createElement('p', { className: "text-sm font-medium text-white"  ,}, label)
        , React.createElement('p', { className: "text-sm font-semibold text-cyan-200"  ,}, score, "/10")
      )
      , React.createElement('div', { className: "mt-3 h-2 rounded-full bg-white/10"   ,}
        , React.createElement('div', {
          className: "h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 transition-all duration-500"       ,
          style: { width },}
        )
      )
      , React.createElement('p', { className: "mt-3 text-sm leading-6 text-slate-400"   ,}, rationale)
    )
  );
}

function LoadingPanel() {
  return (
    React.createElement('div', { className: "rounded-[30px] border border-white/10 bg-slate-950/60 p-6"    ,}
      , React.createElement('div', { className: "flex items-center gap-3 text-sm font-medium text-cyan-200"     ,}
        , React.createElement('span', { className: "flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300"     ,} ), "AI is pressure-testing your idea"

      )

      , React.createElement('div', { className: "mt-5 space-y-3" ,}
        , React.createElement('div', { className: "h-16 animate-pulse rounded-[24px] bg-white/5"   ,} )
        , React.createElement('div', { className: "h-32 animate-pulse rounded-[24px] bg-white/5"   ,} )
        , React.createElement('div', { className: "grid gap-3 md:grid-cols-3"  ,}
          , React.createElement('div', { className: "h-20 animate-pulse rounded-[20px] bg-white/5"   ,} )
          , React.createElement('div', { className: "h-20 animate-pulse rounded-[20px] bg-white/5"   ,} )
          , React.createElement('div', { className: "h-20 animate-pulse rounded-[20px] bg-white/5"   ,} )
        )
      )
    )
  );
}

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

  const resolvedResult = _nullishCoalesce(result, () => ( previewResult));
  const overallPercent = Math.round((_nullishCoalesce(resolvedResult.overall_score, () => ( previewResult.overall_score))) * 10);

  return (
    React.createElement('section', {
      id: "idea-validator",
      className: "relative overflow-hidden rounded-[36px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(12,20,37,0.96),rgba(4,8,20,0.98))] p-6 shadow-[0_40px_140px_rgba(4,12,28,0.62)] md:p-8 lg:p-10"         ,}

      , React.createElement('div', { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.16),transparent_24%)]"  ,} )

      , React.createElement('div', { className: "relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr]"   ,}
        , React.createElement('div', { className: "space-y-6",}
          , React.createElement('div', { className: "space-y-4",}
            , React.createElement('div', { className: "inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200"             ,}, "Main Focus"

            )
            , React.createElement('h2', { className: "max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl"      ,}, "Validate your startup idea before the build starts"

            )
            , React.createElement('p', { className: "max-w-2xl text-base leading-7 text-slate-300"   ,}, "This is the core LaunchPilot workflow. Describe your idea once and get a structured read on market pull, competitive pressure, feasibility, and whether the concept earns more time."



            )
          )

          , React.createElement('form', { onSubmit: handleSubmit, className: "space-y-5",}
            , React.createElement('div', { className: "rounded-[30px] border border-white/10 bg-white/[0.06] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"     ,}
              , React.createElement('div', { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"     ,}
                , React.createElement('div', null
                  , React.createElement('p', { className: "text-sm font-semibold text-white"  ,}, "Describe your startup idea"   )
                  , React.createElement('p', { className: "mt-1 text-sm leading-6 text-slate-400"   ,}, "Be specific about who it is for, the problem, and how the product works."

                  )
                )

                , React.createElement('div', { className: "inline-flex items-center rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"          ,}, "Full access enabled"

                )
              )

              , React.createElement('textarea', {
                value: idea,
                onChange: (event) => setIdea(event.target.value),
                placeholder: "AI tool for summarizing lectures for students"      ,
                className: "mt-4 min-h-[240px] w-full resize-none rounded-[26px] border border-white/10 bg-slate-950/80 px-5 py-4 text-base text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-300/10"                  ,
                required: true,}
              )

              , React.createElement('div', { className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"      ,}
                , React.createElement('p', { className: "text-sm text-slate-400" ,}, "Example prompt: AI tool for summarizing lectures for students"

                )
                , React.createElement('p', { className: "text-sm text-slate-400" ,}, "Unlimited validations enabled locally"

                )
              )
            )

            , React.createElement('div', { className: "flex flex-col gap-3 sm:flex-row sm:items-center"    ,}
              , React.createElement('button', {
                type: "submit",
                disabled: loading || !idea.trim(),
                className: "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-500"                ,}

                , loading ? (
                  React.createElement(React.Fragment, null
                    , React.createElement('span', { className: "h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"      ,} ), "Analyzing your idea..."

                  )
                ) : (
                  React.createElement(React.Fragment, null, "Analyze My Idea"

                    , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
                  )
                )
              )

            )
          )

          , error ? (
            React.createElement('div', { className: "rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100"       ,}
              , error
            )
          ) : null

          , loading ? React.createElement(LoadingPanel, null ) : null

          , result && !loading ? (
            React.createElement('div', { className: "relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/60 p-6"      ,}
              , React.createElement('div', null
                , React.createElement('div', { className: "grid gap-4 lg:grid-cols-[0.88fr_1.12fr]"  ,}
                  , React.createElement('div', { className: "space-y-4 rounded-[28px] border border-cyan-300/15 bg-cyan-300/10 p-5"     ,}
                    , React.createElement('div', { className: "flex items-start justify-between gap-4"   ,}
                      , React.createElement('div', null
                        , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80"    ,}, "Validation Score"

                        )
                        , React.createElement('div', { className: "mt-3 flex items-end gap-2"   ,}
                          , React.createElement('p', { className: "text-5xl font-semibold text-white"  ,}, overallPercent)
                          , React.createElement('p', { className: "pb-1 text-sm text-cyan-100/80"  ,}, "/ 100" )
                        )
                      )
                      , React.createElement(Sparkles, { className: "mt-1 h-5 w-5 text-cyan-100"   ,} )
                    )

                    , React.createElement('p', { className: "text-sm leading-7 text-cyan-50/90"  ,}, resolvedResult.verdict)

                    , React.createElement('div', { className: "grid gap-3 sm:grid-cols-3 lg:grid-cols-1"   ,}
                      , React.createElement(ScorePill, {
                        label: "Market",
                        value: `${_nullishCoalesce(_optionalChain([resolvedResult, 'access', _ => _.market_size, 'optionalAccess', _2 => _2.score]), () => ( 0))}/10`,}
                      )
                      , React.createElement(ScorePill, {
                        label: "Competition",
                        value: `${_nullishCoalesce(_optionalChain([resolvedResult, 'access', _3 => _3.competition_level, 'optionalAccess', _4 => _4.score]), () => ( 0))}/10`,}
                      )
                      , React.createElement(ScorePill, {
                        label: "Feasibility",
                        value: `${_nullishCoalesce(_optionalChain([resolvedResult, 'access', _5 => _5.feasibility, 'optionalAccess', _6 => _6.score]), () => ( 0))}/10`,}
                      )
                    )
                  )

                  , React.createElement('div', { className: "space-y-4",}
                    , scoreConfig.map(({ key, label }) => (
                      React.createElement(MetricBar, {
                        key: key,
                        label: label,
                        score: _nullishCoalesce(_optionalChain([resolvedResult, 'access', _7 => _7[key], 'optionalAccess', _8 => _8.score]), () => ( 0)),
                        rationale: _nullishCoalesce(_optionalChain([resolvedResult, 'access', _9 => _9[key], 'optionalAccess', _10 => _10.rationale]), () => ( "")),}
                      )
                    ))
                  )
                )

                , React.createElement('div', { className: "mt-5 grid gap-4 lg:grid-cols-2"   ,}
                  , React.createElement('div', { className: "rounded-[28px] border border-emerald-300/15 bg-emerald-300/10 p-5"    ,}
                    , React.createElement('p', { className: "text-sm font-semibold text-emerald-100"  ,}, "Strengths")
                    , React.createElement('ul', { className: "mt-4 space-y-3 text-sm leading-7 text-emerald-50/90"    ,}
                      , (_nullishCoalesce(resolvedResult.strengths, () => ( []))).map((item) => (
                        React.createElement('li', { key: item, className: "rounded-2xl bg-white/10 px-4 py-3"   ,}
                          , item
                        )
                      ))
                    )
                  )

                  , React.createElement('div', { className: "rounded-[28px] border border-rose-300/15 bg-rose-300/10 p-5"    ,}
                    , React.createElement('p', { className: "text-sm font-semibold text-rose-100"  ,}, "Risks to watch"  )
                    , React.createElement('ul', { className: "mt-4 space-y-3 text-sm leading-7 text-rose-50/90"    ,}
                      , (_nullishCoalesce(resolvedResult.weaknesses, () => ( []))).map((item) => (
                        React.createElement('li', { key: item, className: "rounded-2xl bg-white/10 px-4 py-3"   ,}
                          , item
                        )
                      ))
                    )
                  )
                )
              )
            )
          ) : null
        )

        , React.createElement('aside', { className: "space-y-4",}
          , React.createElement('div', { className: "rounded-[30px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur"     ,}
            , React.createElement('div', { className: "flex items-center gap-3 text-cyan-200"   ,}
              , React.createElement(Sparkles, { className: "h-5 w-5" ,} )
              , React.createElement('p', { className: "text-sm font-semibold uppercase tracking-[0.2em]"   ,}, "Sample Output Preview"

              )
            )

            , React.createElement('div', { className: "mt-5 space-y-4" ,}
              , React.createElement('div', { className: "rounded-[24px] border border-white/10 bg-slate-950/70 p-5"    ,}
                , React.createElement('div', { className: "flex items-center justify-between gap-3"   ,}
                  , React.createElement('div', null
                    , React.createElement('p', { className: "text-sm text-slate-400" ,}, "Score")
                    , React.createElement('p', { className: "mt-2 text-4xl font-semibold text-white"   ,}, "78/100")
                  )
                  , React.createElement('div', { className: "rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"        ,}, "Founder fit"

                  )
                )
              )

              , React.createElement('div', { className: "grid gap-3 sm:grid-cols-3 xl:grid-cols-1"   ,}
                , React.createElement(ScorePill, { label: "Market", value: "8/10",} )
                , React.createElement(ScorePill, { label: "Competition", value: "6/10",} )
                , React.createElement(ScorePill, { label: "Feasibility", value: "7/10",} )
              )

              , React.createElement('div', { className: "rounded-[24px] border border-white/10 bg-slate-950/70 p-5"    ,}
                , React.createElement('p', { className: "text-sm font-semibold text-white"  ,}, "Insight")
                , React.createElement('p', { className: "mt-3 text-sm leading-7 text-slate-300"   ,}, "Strong problem clarity and repeat usage potential, but the product needs a more differentiated workflow to build durable retention."


                )
              )
            )
          )
        )
      )
    )
  );
}
