import CompetitorAnalyzer from "../components/CompetitorAnalyzer";
import GTMStrategy from "../components/GTMStrategy";
import ICPBuilder from "../components/ICPBuilder";
import IdeaValidator from "../components/IdeaValidator";
import PRDGenerator from "../components/PRDGenerator";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-cyan-300/20 via-emerald-200/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
                LaunchPilot AI
              </p>
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
              Frontend proxy already wired to the API during local development.
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/cold-email"
            className="rounded-2xl border border-emerald-300/50 bg-emerald-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Cold Email Writer
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              Generate outreach emails with subject variants and timed follow-ups.
            </p>
          </Link>

          <Link
            to="/pitch-deck"
            className="rounded-2xl border border-fuchsia-300/50 bg-fuchsia-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Pitch Deck Builder
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              Generate a complete 10-slide investor deck and export it as PDF.
            </p>
          </Link>

          <Link
            to="/finance"
            className="rounded-2xl border border-indigo-300/50 bg-indigo-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Finance Module</h2>
            <p className="mt-2 text-sm text-slate-700">
              Analyze burn rate, runway, pricing, projections, and fundraising readiness.
            </p>
          </Link>

          <Link
            to="/legal"
            className="rounded-2xl border border-amber-300/50 bg-amber-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Legal Module</h2>
            <p className="mt-2 text-sm text-slate-700">
              Draft T&C, privacy policy, founder agreement outline, and compliance checklist.
            </p>
          </Link>

          <Link
            to="/hiring"
            className="rounded-2xl border border-cyan-300/50 bg-cyan-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Hiring Module</h2>
            <p className="mt-2 text-sm text-slate-700">
              Build JD, interview process, equity strategy, org chart, and compensation benchmarks.
            </p>
          </Link>

          <Link
            to="/rag-chat"
            className="rounded-2xl border border-blue-300/50 bg-blue-50 p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              New Module
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Knowledge Base AI</h2>
            <p className="mt-2 text-sm text-slate-700">
              Upload your startup docs and chat with them using RAG. Features smart retrieval and web fallback.
            </p>
          </Link>
        </section>

        <div className="space-y-8">
          <IdeaValidator />
          <CompetitorAnalyzer />
          <PRDGenerator />
          <GTMStrategy />
          <ICPBuilder />
        </div>
      </div>
    </main>
  );
}
