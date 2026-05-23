import React from "https://esm.sh/react@18.3.1?dev";
import {
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "https://esm.sh/lucide-react@0.469.0";
import { Link } from "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1";
import CompetitorAnalyzer from "../components/CompetitorAnalyzer.js";
import IdeaValidator from "../components/IdeaValidator.js";
import PRDGenerator from "../components/PRDGenerator.js";
import Prism from "../components/Prism.js";
import { useAuth } from "../context/AuthContext.js";
const workflowSteps = [
  {
    icon: Compass,
    title: "Describe your idea",
    body: "Share the product, customer, and wedge you want to test in plain English.",
  },
  {
    icon: Search,
    title: "AI analyzes market + competition",
    body: "LaunchPilot maps demand, market pressure, and what existing players already own.",
  },
  {
    icon: BarChart3,
    title: "Get structured insights + score",
    body: "Walk away with a weighted score, opportunity read, and the next move worth making.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "2 validations",
    description: "A lightweight starting point for solo founders testing a new direction.",
    features: [
      "2 startup idea validations",
      "Local workspace access",
      "Starter dashboard access",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9/mo",
    description: "Built for founders iterating quickly and validating every idea with confidence.",
    features: [
      "Unlimited validations",
      "Competitor analysis",
      "PRD generation",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29/mo",
    description: "For small teams collaborating on what to build, why, and in what order.",
    features: [
      "Team collaboration",
      "Shared validation workspace",
      "Placeholder team controls",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote:
      "LaunchPilot helped us stop chasing a shiny idea and double down on the one customers were already leaning into.",
    name: "Aanya Gupta",
    role: "Founder, PulseDraft",
  },
  {
    quote:
      "The output is clear enough for founders and structured enough for advisors. That is a rare combination.",
    name: "Marcus Reed",
    role: "Program Lead, Northline Ventures",
  },
  {
    quote:
      "It feels like a strategy teammate that can challenge a startup idea before we spend a sprint building it.",
    name: "Sara Kim",
    role: "Solo Founder, LedgerBloom",
  },
];

const advancedModules = [
  {
    title: "Pitch Deck Builder",
    body: "Turn a validated idea into a sharper fundraising narrative and structure.",
    to: "/pitch-deck",
  },
  {
    title: "Cold Email Writer",
    body: "Draft outreach for customers, beta users, partners, and investors in minutes.",
    to: "/cold-email",
  },
  {
    title: "Knowledge Base AI",
    body: "Chat with your internal research, notes, transcripts, and startup documents.",
    to: "/rag-chat",
  },
];

const heroMetrics = [
  { value: "78/100", label: "Example validation score" },
  { value: "3 min", label: "To pressure-test an idea" },
  { value: "No OAuth", label: "All tools open locally" },
];

const previewMetrics = [
  { label: "Market", value: "8/10" },
  { label: "Competition", value: "6/10" },
  { label: "Feasibility", value: "7/10" },
];

function SectionEyebrow({ children }) {
  return (
    React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75"    ,}
      , children
    )
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    React.createElement('div', { className: "relative overflow-hidden bg-[#050816] text-white"   ,}
      , React.createElement('div', { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_22%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.16),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_28%)]"   ,} )
      , React.createElement('div', { className: "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20"     ,} )

      , React.createElement('div', { className: "relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pt-12"            ,}
        , React.createElement('section', { className: "relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(3,10,24,0.78),rgba(4,12,28,0.92))] px-4 py-8 shadow-[0_30px_120px_rgba(2,6,23,0.45)] sm:px-6 lg:px-8 lg:py-10"           ,}
          , React.createElement('div', { className: "absolute inset-0 z-0"  ,}
            , React.createElement(Prism, {
              animationType: "hover",
              timeScale: 0.5,
              height: 3.5,
              baseWidth: 5.5,
              scale: 3.6,
              glow: 1.5,
              noise: 0.3,
              bloom: 1.2,
              colorFrequency: 1,
              hueShift: 0,
              transparent: true,}
            )
          )
          , React.createElement('div', { className: "absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(3,10,24,0.18),transparent_32%),linear-gradient(180deg,rgba(4,8,20,0.5),rgba(4,8,20,0.76))]"   ,} )
          , React.createElement('div', { className: "relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]"     ,}
            , React.createElement('div', { className: "space-y-8",}
              , React.createElement('div', { className: "inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"            ,}
                , React.createElement(Sparkles, { className: "h-4 w-4" ,} ), "Trusted by 1000+ founders"

              )

              , React.createElement('div', { className: "space-y-5",}
                , React.createElement('h1', { className: "max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl"      ,}, "Validate startup ideas before you build them"

                )
                , React.createElement('p', { className: "max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"    ,}, "LaunchPilot AI helps founders test demand, pressure-check competition, and spot execution risk before time, money, and momentum disappear into the wrong product."


                )
              )

              , React.createElement('div', { className: "flex flex-col gap-3 sm:flex-row"   ,}
                , React.createElement('a', {
                  href: "#idea-validator",
                  className: "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50"              ,}
, "Analyze My Idea"

                  , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
                )
                , React.createElement('a', {
                  href: "#how-it-works",
                  className: "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/10"                ,}
, "See How It Works"

                )
              )

              , React.createElement('div', { className: "grid gap-4 sm:grid-cols-3"  ,}
                , heroMetrics.map((metric) => (
                  React.createElement('div', {
                    key: metric.label,
                    className: "rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur"      ,}

                    , React.createElement('p', { className: "text-3xl font-semibold tracking-tight text-white"   ,}, metric.value)
                    , React.createElement('p', { className: "mt-2 text-sm leading-6 text-slate-300"   ,}, metric.label)
                  )
                ))
              )
            )

            , React.createElement('div', { className: "relative",}
              , React.createElement('div', { className: "absolute -left-8 top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"       ,} )
              , React.createElement('div', { className: "absolute -right-8 bottom-12 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl"       ,} )

              , React.createElement('div', { className: "relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl md:p-7"         ,}
                , React.createElement('div', { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_26%)]"  ,} )

                , React.createElement('div', { className: "relative",}
                  , React.createElement('div', { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"     ,}
                    , React.createElement('div', null
                      , React.createElement(SectionEyebrow, null, "Live Preview" )
                      , React.createElement('h2', { className: "mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"     ,}, "See what a high-signal validation looks like"

                      )
                    )
                    , React.createElement('div', { className: "inline-flex items-center rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100"            ,}, "Early Signal"

                    )
                  )

                  , React.createElement('div', { className: "mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5"     ,}
                    , React.createElement('div', { className: "flex items-center justify-between gap-4"   ,}
                      , React.createElement('div', null
                        , React.createElement('p', { className: "text-sm text-slate-400" ,}, "Idea")
                        , React.createElement('p', { className: "mt-2 text-lg font-medium text-white"   ,}, "AI tool for summarizing lectures for students"

                        )
                      )
                      , React.createElement('div', { className: "rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-center"      ,}
                        , React.createElement('p', { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100"    ,}, "Score"

                        )
                        , React.createElement('p', { className: "mt-2 text-4xl font-semibold text-white"   ,}, "78")
                        , React.createElement('p', { className: "text-sm text-cyan-100/80" ,}, "out of 100"  )
                      )
                    )

                    , React.createElement('div', { className: "mt-5 grid gap-3 sm:grid-cols-3"   ,}
                      , previewMetrics.map((item) => (
                        React.createElement('div', {
                          key: item.label,
                          className: "rounded-2xl border border-white/10 bg-slate-950/70 p-4"    ,}

                          , React.createElement('p', { className: "text-sm text-slate-400" ,}, item.label)
                          , React.createElement('p', { className: "mt-2 text-xl font-semibold text-white"   ,}, item.value)
                        )
                      ))
                    )

                    , React.createElement('div', { className: "mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-5"     ,}
                      , React.createElement('p', { className: "text-sm font-semibold text-white"  ,}, "Insight")
                      , React.createElement('p', { className: "mt-3 text-sm leading-7 text-slate-300"   ,}, "Strong recurring usage and clear user pain, but long-term retention depends on a differentiated workflow beyond generic AI summaries."


                      )
                    )
                  )

                  , React.createElement('div', { className: "mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100"            ,}, "Local workspace ready"

                    , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
                  )
                )
              )
            )
          )
        )

        , React.createElement('section', {
          id: "how-it-works",
          className: "rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_120px_rgba(2,6,23,0.4)] backdrop-blur md:p-10"       ,}

          , React.createElement('div', { className: "max-w-2xl space-y-3" ,}
            , React.createElement(SectionEyebrow, null, "How It Works"  )
            , React.createElement('h2', { className: "text-3xl font-semibold tracking-tight text-white"   ,}, "Three steps from idea to signal"

            )
            , React.createElement('p', { className: "text-base leading-7 text-slate-300"  ,}, "A cleaner validation workflow for founders who want sharper decisions before they commit engineering time."


            )
          )

          , React.createElement('div', { className: "mt-10 grid gap-4 lg:grid-cols-3"   ,}
            , workflowSteps.map(({ icon: Icon, title, body }, index) => (
              React.createElement('article', {
                key: title,
                className: "group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30"           ,}

                , React.createElement('div', { className: "absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%)]"      ,} )
                , React.createElement('div', { className: "relative",}
                  , React.createElement('div', { className: "flex items-center justify-between"  ,}
                    , React.createElement('div', { className: "flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100"         ,}
                      , React.createElement(Icon, { className: "h-5 w-5" ,} )
                    )
                    , React.createElement('p', { className: "text-sm font-semibold text-slate-500"  ,}, "0", index + 1)
                  )
                  , React.createElement('h3', { className: "mt-6 text-xl font-semibold text-white"   ,}, title)
                  , React.createElement('p', { className: "mt-3 text-sm leading-7 text-slate-300"   ,}, body)
                )
              )
            ))
          )
        )

        , React.createElement('div', { className: "space-y-8",}
          , React.createElement(IdeaValidator, null )

          , React.createElement('div', { className: "grid gap-8 xl:grid-cols-2"  ,}
            , React.createElement(CompetitorAnalyzer, null )
            , React.createElement(PRDGenerator, null )
          )
        )

        , React.createElement('section', { id: "pricing", className: "space-y-8",}
          , React.createElement('div', { className: "max-w-2xl space-y-3" ,}
            , React.createElement(SectionEyebrow, null, "Pricing")
            , React.createElement('h2', { className: "text-3xl font-semibold tracking-tight text-white"   ,}, "Choose the plan that matches your build pace"

            )
            , React.createElement('p', { className: "text-base leading-7 text-slate-300"  ,}, "Start with a couple of validations for free, then upgrade when idea volume picks up."

            )
          )

          , React.createElement('div', { className: "grid gap-5 lg:grid-cols-3"  ,}
            , pricingTiers.map((tier) => (
              React.createElement('article', {
                key: tier.name,
                className: `relative overflow-hidden rounded-[30px] border p-8 transition duration-200 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-cyan-300/40 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(15,23,42,0.92))] shadow-[0_30px_100px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-white/[0.05]"
                }`,}

                , tier.highlighted ? (
                  React.createElement('div', { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]"  ,} )
                ) : null

                , React.createElement('div', { className: "relative",}
                  , React.createElement('div', { className: "flex items-start justify-between gap-4"   ,}
                    , React.createElement('div', null
                      , React.createElement('h3', { className: "text-2xl font-semibold text-white"  ,}, tier.name)
                      , React.createElement('p', { className: "mt-3 text-3xl font-semibold tracking-tight text-white"    ,}
                        , tier.price
                      )
                    )
                    , tier.highlighted ? (
                      React.createElement('span', { className: "rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-950"        ,}, "Most Popular"

                      )
                    ) : null
                  )

                  , React.createElement('p', { className: "mt-4 text-sm leading-7 text-slate-300"   ,}, tier.description)

                  , React.createElement('ul', { className: "mt-6 space-y-3" ,}
                    , tier.features.map((feature) => (
                      React.createElement('li', { key: feature, className: "flex items-start gap-3 text-sm text-slate-100"    ,}
                        , React.createElement(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-cyan-200"    ,} )
                        , React.createElement('span', null, feature)
                      )
                    ))
                  )

                  , React.createElement('button', {
                    className: `mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
                      tier.highlighted
                        ? "bg-white text-slate-950 hover:bg-cyan-50"
                        : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                    }`,}

                    , tier.cta
                  )
                )
              )
            ))
          )
        )

        , React.createElement('section', { id: "testimonials", className: "space-y-8",}
          , React.createElement('div', { className: "max-w-2xl space-y-3" ,}
            , React.createElement(SectionEyebrow, null, "Social Proof" )
            , React.createElement('h2', { className: "text-3xl font-semibold tracking-tight text-white"   ,}, "Trusted by 1000+ founders building with more conviction"

            )
          )

          , React.createElement('div', { className: "grid gap-5 lg:grid-cols-3"  ,}
            , testimonials.map((testimonial) => (
              React.createElement('article', {
                key: testimonial.name,
                className: "rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur"     ,}

                , React.createElement('div', { className: "flex items-center gap-3 text-cyan-200"   ,}
                  , React.createElement(ShieldCheck, { className: "h-5 w-5" ,} )
                  , React.createElement('p', { className: "text-sm font-semibold" ,}, "Founder testimonial" )
                )
                , React.createElement('p', { className: "mt-5 text-base leading-8 text-slate-100"   ,}, "\""
                  , testimonial.quote, "\""
                )
                , React.createElement('div', { className: "mt-6 border-t border-white/10 pt-5"   ,}
                  , React.createElement('p', { className: "font-medium text-white" ,}, testimonial.name)
                  , React.createElement('p', { className: "text-sm text-slate-400" ,}, testimonial.role)
                )
              )
            ))
          )
        )

        , React.createElement('section', { className: "rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_120px_rgba(2,6,23,0.4)] backdrop-blur md:p-10"       ,}
          , React.createElement('div', { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"     ,}
            , React.createElement('div', { className: "max-w-2xl space-y-3" ,}
              , React.createElement(SectionEyebrow, null, "More Workflows" )
              , React.createElement('h2', { className: "text-3xl font-semibold tracking-tight text-white"   ,}, "Move from validation into execution"

              )
              , React.createElement('p', { className: "text-base leading-7 text-slate-300"  ,}, "Once an idea earns the right signal, keep momentum going with the rest of the LaunchPilot workspace."


              )
            )

            , !user ? (
              React.createElement(Link, {
                to: "/pitch-deck",
                className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/15"               ,}
, "Open the full workspace"

                , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
              )
            ) : null
          )

          , React.createElement('div', { className: "mt-8 grid gap-4 lg:grid-cols-3"   ,}
            , advancedModules.map((module) => (
              React.createElement(Link, {
                key: module.title,
                to: module.to,
                className: "group rounded-[28px] border border-white/10 bg-slate-950/55 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-950/75"          ,}

                , React.createElement('div', { className: "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200"         ,}
                  , module.title.includes("Pitch") ? (
                    React.createElement(FileText, { className: "h-5 w-5" ,} )
                  ) : module.title.includes("Cold") ? (
                    React.createElement(Sparkles, { className: "h-5 w-5" ,} )
                  ) : (
                    React.createElement(Users, { className: "h-5 w-5" ,} )
                  )
                )
                , React.createElement('h3', { className: "mt-5 text-xl font-semibold text-white"   ,}, module.title)
                , React.createElement('p', { className: "mt-3 text-sm leading-7 text-slate-300"   ,}, module.body)
                , React.createElement('span', { className: "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200"      ,}, "Open tool"

                  , React.createElement(ArrowRight, { className: "h-4 w-4 transition duration-200 group-hover:translate-x-0.5"    ,} )
                )
              )
            ))
          )
        )
      )
    )
  );
}
