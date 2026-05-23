import React from "https://esm.sh/react@18.3.1?dev";
import { useState } from "https://esm.sh/react@18.3.1?dev";
import { generateGtmStrategy } from "../api.js";
const timelineConfig = [
  {
    key: "days_30",
    label: "First 30 Days",
    badge: "Foundation",
    classes: "border-teal-200 bg-teal-50/70 text-teal-900",
    accent: "text-teal-700",
  },
  {
    key: "days_60",
    label: "Days 31-60",
    badge: "Acceleration",
    classes: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
    accent: "text-emerald-700",
  },
  {
    key: "days_90",
    label: "Days 61-90",
    badge: "Scale",
    classes: "border-sky-200 bg-sky-50/70 text-sky-900",
    accent: "text-sky-700",
  },
];

function SegmentCard({ index, segment }) {
  return (
    React.createElement('article', { className: "flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"         ,}
      , React.createElement('div', null
        , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-600"    ,}, "Segment "
           , index + 1
        )
        , React.createElement('h4', { className: "mt-1 text-lg font-semibold text-slate-900"   ,}
          , segment.name
        )
      )
      , React.createElement('p', { className: "text-sm leading-6 text-slate-600"  ,}, segment.description)
    )
  );
}

function ChannelCard({ index, channel }) {
  return (
    React.createElement('article', { className: "flex h-full flex-col gap-4 rounded-2xl border border-teal-200/80 bg-white p-5 shadow-sm"         ,}
      , React.createElement('div', null
        , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-600"    ,}, "Channel "
           , index + 1
        )
        , React.createElement('h4', { className: "mt-1 text-lg font-semibold text-slate-900"   ,}
          , channel.name
        )
      )
      , React.createElement('p', { className: "text-sm leading-6 text-slate-600"  ,}, channel.why)
      , React.createElement('details', { className: "group rounded-xl border border-teal-100 bg-teal-50/60 p-4 open:bg-teal-50"      ,}
        , React.createElement('summary', { className: "flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-teal-900"       ,}
          , React.createElement('span', null, "Action steps" )
          , React.createElement('span', { className: "text-xs font-medium uppercase tracking-wider text-teal-700 transition group-open:rotate-180"      ,}, "▾"

          )
        )
        , React.createElement('ol', { className: "mt-3 space-y-2 text-sm text-teal-900"   ,}
          , channel.action_steps.map((step, stepIndex) => (
            React.createElement('li', {
              key: step,
              className: "flex gap-3 rounded-lg bg-white/80 px-3 py-2"     ,}

              , React.createElement('span', { className: "font-semibold text-teal-700" ,}
                , stepIndex + 1, "."
              )
              , React.createElement('span', { className: "text-slate-700",}, step)
            )
          ))
        )
      )
    )
  );
}

function TimelineColumn({ phase, actions }) {
  return (
    React.createElement('section', {
      className: `flex h-full flex-col gap-3 rounded-2xl border p-5 shadow-sm ${phase.classes}`,}

      , React.createElement('div', { className: "flex items-center justify-between"  ,}
        , React.createElement('h4', { className: "text-base font-semibold" ,}, phase.label)
        , React.createElement('span', {
          className: `rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${phase.accent}`,}

          , phase.badge
        )
      )
      , React.createElement('ol', { className: "space-y-2 text-sm" ,}
        , actions.map((action, index) => (
          React.createElement('li', {
            key: action,
            className: "flex gap-3 rounded-xl bg-white/85 px-3 py-2 text-slate-700"      ,}

            , React.createElement('span', { className: `font-semibold ${phase.accent}`,}
              , index + 1, "."
            )
            , React.createElement('span', null, action)
          )
        ))
      )
    )
  );
}

function KpiCard({ kpi }) {
  return (
    React.createElement('article', { className: "flex h-full flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"          ,}
      , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"    ,}
        , kpi.metric
      )
      , React.createElement('p', { className: "text-2xl font-semibold leading-tight text-slate-900"   ,}
        , kpi.target
      )
    )
  );
}

export default function GTMStrategy() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormReady = product.trim() && audience.trim() && industry.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await generateGtmStrategy(
        product.trim(),
        audience.trim(),
        industry.trim()
      );
      setResult(data);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    React.createElement('section', { className: "mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-teal-200/70 bg-white/85 p-6 shadow-2xl shadow-teal-950/10 backdrop-blur md:p-8"            ,}
      , React.createElement('div', { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between"     ,}
        , React.createElement('div', { className: "space-y-2",}
          , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-700"    ,}, "Launch Playbook"

          )
          , React.createElement('h2', { className: "text-2xl font-bold text-slate-900"  ,}, "GTM Strategy Generator"

          )
          , React.createElement('p', { className: "max-w-2xl text-sm text-slate-600"  ,}, "Translate a product, audience, and industry into segments, positioning, channels, pricing, a 30-60-90 plan, and the KPIs that prove it is working."



          )
        )
        , React.createElement('div', { className: "rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900"       ,}, "LangChain + Gemini via OpenRouter"

        )
      )

      , React.createElement('form', { onSubmit: handleSubmit, className: "grid gap-4 md:grid-cols-3"  ,}
        , React.createElement('input', {
          value: product,
          onChange: (event) => setProduct(event.target.value),
          placeholder: "Product name" ,
          className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"              ,
          required: true,}
        )
        , React.createElement('input', {
          value: audience,
          onChange: (event) => setAudience(event.target.value),
          placeholder: "Target audience" ,
          className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"              ,
          required: true,}
        )
        , React.createElement('input', {
          value: industry,
          onChange: (event) => setIndustry(event.target.value),
          placeholder: "Industry",
          className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"              ,
          required: true,}
        )
        , React.createElement('div', { className: "md:col-span-3",}
          , React.createElement('button', {
            type: "submit",
            disabled: loading || !isFormReady,
            className: "inline-flex items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-400"             ,}

            , loading ? "Generating GTM strategy..." : "Generate GTM Strategy"
          )
        )
      )

      , error ? (
        React.createElement('div', { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"       ,}
          , error
        )
      ) : null

      , result ? (
        React.createElement('article', { className: "space-y-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner"      ,}
          , React.createElement('header', { className: "rounded-3xl bg-slate-900 p-6 text-white"   ,}
            , React.createElement('p', { className: "text-xs uppercase tracking-[0.2em] text-teal-200"   ,}, "Go-To-Market Strategy"

            )
            , React.createElement('h3', { className: "mt-2 text-3xl font-bold"  ,}, product)
            , React.createElement('p', { className: "mt-3 max-w-4xl text-sm leading-6 text-slate-200"    ,}, "Tailored for "
                , audience, " in the "   , industry, " space."
            )
          )

          , React.createElement('section', { className: "space-y-3 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm"         ,}
            , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-700"    ,}, "Positioning Statement"

            )
            , React.createElement('p', { className: "text-lg font-semibold leading-7 text-slate-900"   ,}
              , result.positioning_statement
            )
          )

          , React.createElement('section', { className: "space-y-4",}
            , React.createElement('div', { className: "flex items-end justify-between"  ,}
              , React.createElement('div', null
                , React.createElement('h3', { className: "text-xl font-semibold text-slate-900"  ,}, "Customer Segments"

                )
                , React.createElement('p', { className: "mt-1 text-sm text-slate-500"  ,}, "Three priority segments to win in the first 90 days"

                )
              )
              , React.createElement('span', { className: "rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800"        ,}
                , result.customer_segments.length, " segments"
              )
            )
            , React.createElement('div', { className: "grid gap-4 md:grid-cols-3"  ,}
              , result.customer_segments.map((segment, index) => (
                React.createElement(SegmentCard, {
                  key: segment.name,
                  index: index,
                  segment: segment,}
                )
              ))
            )
          )

          , React.createElement('section', { className: "space-y-4",}
            , React.createElement('div', { className: "flex items-end justify-between"  ,}
              , React.createElement('div', null
                , React.createElement('h3', { className: "text-xl font-semibold text-slate-900"  ,}, "Top Marketing Channels"

                )
                , React.createElement('p', { className: "mt-1 text-sm text-slate-500"  ,}, "Why each channel fits, with action steps you can run this week"


                )
              )
              , React.createElement('span', { className: "rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800"        ,}, "Click to expand"

              )
            )
            , React.createElement('div', { className: "grid gap-4 md:grid-cols-3"  ,}
              , result.marketing_channels.map((channel, index) => (
                React.createElement(ChannelCard, {
                  key: channel.name,
                  index: index,
                  channel: channel,}
                )
              ))
            )
          )

          , React.createElement('section', { className: "space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"      ,}
            , React.createElement('div', { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between"     ,}
              , React.createElement('div', null
                , React.createElement('h3', { className: "text-xl font-semibold text-slate-900"  ,}, "Pricing Strategy"

                )
                , React.createElement('p', { className: "mt-1 text-sm text-slate-500"  ,}, "Model, range, and the rationale behind it"

                )
              )
              , React.createElement('span', { className: "self-start rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-900 md:self-auto"          ,}
                , result.pricing_strategy.price_range
              )
            )
            , React.createElement('div', { className: "grid gap-4 lg:grid-cols-3"  ,}
              , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4"    ,}
                , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"    ,}, "Model"

                )
                , React.createElement('p', { className: "mt-2 text-base font-semibold text-slate-900"   ,}
                  , result.pricing_strategy.model
                )
              )
              , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4"    ,}
                , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"    ,}, "Price Range"

                )
                , React.createElement('p', { className: "mt-2 text-base font-semibold text-slate-900"   ,}
                  , result.pricing_strategy.price_range
                )
              )
              , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-1"     ,}
                , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"    ,}, "Justification"

                )
                , React.createElement('p', { className: "mt-2 text-sm leading-6 text-slate-700"   ,}
                  , result.pricing_strategy.justification
                )
              )
            )
          )

          , React.createElement('section', { className: "space-y-4",}
            , React.createElement('div', null
              , React.createElement('h3', { className: "text-xl font-semibold text-slate-900"  ,}, "30 / 60 / 90 Day Launch Plan"

              )
              , React.createElement('p', { className: "mt-1 text-sm text-slate-500"  ,}, "Each phase compounds on the previous one"

              )
            )
            , React.createElement('div', { className: "grid gap-4 md:grid-cols-3"  ,}
              , timelineConfig.map((phase) => (
                React.createElement(TimelineColumn, {
                  key: phase.key,
                  phase: phase,
                  actions: result.launch_timeline[phase.key].actions,}
                )
              ))
            )
          )

          , React.createElement('section', { className: "space-y-4",}
            , React.createElement('div', { className: "flex items-end justify-between"  ,}
              , React.createElement('div', null
                , React.createElement('h3', { className: "text-xl font-semibold text-slate-900"  ,}, "Success KPIs"

                )
                , React.createElement('p', { className: "mt-1 text-sm text-slate-500"  ,}, "The six metrics that tell you GTM is working"

                )
              )
              , React.createElement('span', { className: "rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800"        ,}
                , result.kpis.length, " metrics"
              )
            )
            , React.createElement('div', { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"   ,}
              , result.kpis.map((kpi) => (
                React.createElement(KpiCard, { key: `${kpi.metric}-${kpi.target}`, kpi: kpi,} )
              ))
            )
          )
        )
      ) : null
    )
  );
}
