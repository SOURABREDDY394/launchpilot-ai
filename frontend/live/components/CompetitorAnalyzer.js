import React from "https://esm.sh/react@18.3.1?dev";
import { ArrowRight, SearchCheck } from "https://esm.sh/lucide-react@0.469.0";
import { useState } from "https://esm.sh/react@18.3.1?dev";
import { analyzeCompetitors } from "../api.js";
function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



function SWOTCard({ label, items }) {
  return (
    React.createElement('div', { className: "rounded-[24px] border border-white/10 bg-slate-950/60 p-4"    ,}
      , React.createElement('p', { className: "text-sm font-semibold text-white"  ,}, label)
      , React.createElement('ul', { className: "mt-3 space-y-2 text-sm leading-7 text-slate-300"    ,}
        , items.map((item) => (
          React.createElement('li', { key: item, className: "rounded-2xl bg-white/5 px-3 py-2"   ,}
            , item
          )
        ))
      )
    )
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
    React.createElement('section', { className: "rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur md:p-8"      ,}
      , React.createElement('div', { className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between"     ,}
        , React.createElement('div', { className: "space-y-3",}
          , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75"    ,}, "Competitor Analyzer"

          )
          , React.createElement('h2', { className: "text-2xl font-semibold tracking-tight text-white"   ,}, "Benchmark the market after the idea looks promising"

          )
          , React.createElement('p', { className: "max-w-xl text-sm leading-7 text-slate-300"   ,}, "Use this second. It helps you map nearby competitors, understand how crowded the space is, and spot possible whitespace before you commit."


          )
        )

        , React.createElement('div', { className: "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"         ,}, "Supporting workflow"

        )
      )

      , React.createElement('form', { onSubmit: handleSubmit, className: "mt-6 space-y-4" ,}
        , React.createElement('div', { className: "rounded-[28px] border border-white/10 bg-slate-950/60 p-4"    ,}
          , React.createElement('label', { className: "text-sm font-semibold text-white"  ,}, "What should we benchmark?"   )
          , React.createElement('p', { className: "mt-1 text-sm leading-6 text-slate-400"   ,}, "Hint: describe the product and user clearly so the market scan returns better competitors and sharper positioning clues."


          )
          , React.createElement('textarea', {
            value: idea,
            onChange: (event) => setIdea(event.target.value),
            placeholder: "AI assistant that helps SMB founders monitor churn risk from customer conversations"           ,
            className: "mt-4 min-h-[150px] w-full resize-none rounded-[22px] border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-300/10"                  ,
            required: true,}
          )
        )

        , React.createElement('div', { className: "flex flex-col gap-3 sm:flex-row sm:items-center"    ,}
          , React.createElement('button', {
            type: "submit",
            disabled: loading || !idea.trim(),
            className: "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"                  ,}

            , loading ? "Scanning competitors..." : "Find Competitors"
            , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
          )
        )
      )

      , error ? (
        React.createElement('div', { className: "mt-5 rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"        ,}
          , error
        )
      ) : null

      , result ? (
        React.createElement('div', { className: "mt-6 space-y-5" ,}
          , React.createElement('div', { className: "rounded-[28px] border border-white/10 bg-slate-950/60 p-5"    ,}
            , React.createElement('div', { className: "flex items-center gap-3 text-cyan-200"   ,}
              , React.createElement(SearchCheck, { className: "h-5 w-5" ,} )
              , React.createElement('p', { className: "text-sm font-semibold" ,}, "Market snapshot" )
            )
            , React.createElement('p', { className: "mt-4 text-sm leading-7 text-slate-300"   ,}, result.market_summary)
          )

          , React.createElement('div', { className: "grid gap-4" ,}
            , result.competitors.slice(0, 3).map((competitor, index) => (
              React.createElement('article', {
                key: competitor.name,
                className: "rounded-[28px] border border-white/10 bg-slate-950/60 p-5"    ,}

                , React.createElement('div', { className: "flex items-center justify-between gap-4"   ,}
                  , React.createElement('div', null
                    , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"    ,}, "Competitor "
                       , index + 1
                    )
                    , React.createElement('h3', { className: "mt-2 text-lg font-semibold text-white"   ,}, competitor.name)
                  )
                )
                , React.createElement('p', { className: "mt-3 text-sm leading-7 text-slate-300"   ,}, competitor.description)
              )
            ))
          )

          , React.createElement('div', { className: "grid gap-4 lg:grid-cols-2"  ,}
            , React.createElement(SWOTCard, { label: "Strengths", items: _nullishCoalesce(_optionalChain([result, 'access', _ => _.swot, 'optionalAccess', _2 => _2.strengths]), () => ( [])),} )
            , React.createElement(SWOTCard, { label: "Weaknesses", items: _nullishCoalesce(_optionalChain([result, 'access', _3 => _3.swot, 'optionalAccess', _4 => _4.weaknesses]), () => ( [])),} )
            , React.createElement(SWOTCard, { label: "Opportunities", items: _nullishCoalesce(_optionalChain([result, 'access', _5 => _5.swot, 'optionalAccess', _6 => _6.opportunities]), () => ( [])),} )
            , React.createElement(SWOTCard, { label: "Threats", items: _nullishCoalesce(_optionalChain([result, 'access', _7 => _7.swot, 'optionalAccess', _8 => _8.threats]), () => ( [])),} )
          )
        )
      ) : null
    )
  );
}
