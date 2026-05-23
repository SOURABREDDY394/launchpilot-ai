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
} from "lucide-react";
import { Link } from "react-router-dom";

import CompetitorAnalyzer from "../components/CompetitorAnalyzer";
import IdeaValidator from "../components/IdeaValidator";
import PRDGenerator from "../components/PRDGenerator";
import Prism from "../components/Prism";
import { useAuth } from "../context/AuthContext";

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
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
      {children}
    </p>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_22%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.16),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(3,10,24,0.78),rgba(4,12,28,0.92))] px-4 py-8 shadow-[0_30px_120px_rgba(2,6,23,0.45)] sm:px-6 lg:px-8 lg:py-10">
          <div className="absolute inset-0 z-0">
            <Prism
              animationType="hover"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              glow={1.5}
              noise={0.3}
              bloom={1.2}
              colorFrequency={1}
              hueShift={0}
              transparent={true}
            />
          </div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(3,10,24,0.18),transparent_32%),linear-gradient(180deg,rgba(4,8,20,0.5),rgba(4,8,20,0.76))]" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
                <Sparkles className="h-4 w-4" />
                Trusted by 1000+ founders
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
                  Validate startup ideas before you build them
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  LaunchPilot AI helps founders test demand, pressure-check competition, and spot
                  execution risk before time, money, and momentum disappear into the wrong product.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#idea-validator"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50"
                >
                  Analyze My Idea
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur"
                  >
                    <p className="text-3xl font-semibold tracking-tight text-white">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -right-8 bottom-12 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl md:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_26%)]" />

                <div className="relative">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <SectionEyebrow>Live Preview</SectionEyebrow>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        See what a high-signal validation looks like
                      </h2>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                      Early Signal
                    </div>
                  </div>

                  <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Idea</p>
                        <p className="mt-2 text-lg font-medium text-white">
                          AI tool for summarizing lectures for students
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                          Score
                        </p>
                        <p className="mt-2 text-4xl font-semibold text-white">78</p>
                        <p className="text-sm text-cyan-100/80">out of 100</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {previewMetrics.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                        >
                          <p className="text-sm text-slate-400">{item.label}</p>
                          <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                      <p className="text-sm font-semibold text-white">Insight</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Strong recurring usage and clear user pain, but long-term retention depends
                        on a differentiated workflow beyond generic AI summaries.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100">
                    Local workspace ready
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_120px_rgba(2,6,23,0.4)] backdrop-blur md:p-10"
        >
          <div className="max-w-2xl space-y-3">
            <SectionEyebrow>How It Works</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Three steps from idea to signal
            </h2>
            <p className="text-base leading-7 text-slate-300">
              A cleaner validation workflow for founders who want sharper decisions before they
              commit engineering time.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">0{index + 1}</p>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <IdeaValidator />

          <div className="grid gap-8 xl:grid-cols-2">
            <CompetitorAnalyzer />
            <PRDGenerator />
          </div>
        </div>

        <section id="pricing" className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Choose the plan that matches your build pace
            </h2>
            <p className="text-base leading-7 text-slate-300">
              Start with a couple of validations for free, then upgrade when idea volume picks up.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`relative overflow-hidden rounded-[30px] border p-8 transition duration-200 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-cyan-300/40 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(15,23,42,0.92))] shadow-[0_30px_100px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                {tier.highlighted ? (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
                ) : null}

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                        {tier.price}
                      </p>
                    </div>
                    {tier.highlighted ? (
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-950">
                        Most Popular
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-300">{tier.description}</p>

                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-100">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
                      tier.highlighted
                        ? "bg-white text-slate-950 hover:bg-cyan-50"
                        : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <SectionEyebrow>Social Proof</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Trusted by 1000+ founders building with more conviction
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3 text-cyan-200">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-semibold">Founder testimonial</p>
                </div>
                <p className="mt-5 text-base leading-8 text-slate-100">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_120px_rgba(2,6,23,0.4)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <SectionEyebrow>More Workflows</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Move from validation into execution
              </h2>
              <p className="text-base leading-7 text-slate-300">
                Once an idea earns the right signal, keep momentum going with the rest of the
                LaunchPilot workspace.
              </p>
            </div>

            {!user ? (
              <Link
                to="/pitch-deck"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/25 hover:bg-white/15"
              >
                Open the full workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {advancedModules.map((module) => (
              <Link
                key={module.title}
                to={module.to}
                className="group rounded-[28px] border border-white/10 bg-slate-950/55 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-950/75"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                  {module.title.includes("Pitch") ? (
                    <FileText className="h-5 w-5" />
                  ) : module.title.includes("Cold") ? (
                    <Sparkles className="h-5 w-5" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{module.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{module.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
