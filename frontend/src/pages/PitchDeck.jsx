import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

import { generatePitchDeck } from "../api";

function SlideCard({ slide }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-700">
          Slide {slide.slide_number}
        </p>
        <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-medium text-fuchsia-800">
          Investor Narrative
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{slide.title}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
        {slide.content.map((line) => (
          <li key={`${slide.slide_number}-${line}`} className="rounded-lg bg-slate-50 px-3 py-2">
            {line}
          </li>
        ))}
      </ul>
    </article>
  );
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export default function PitchDeck() {
  const [startupName, setStartupName] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [market, setMarket] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormReady = useMemo(
    () =>
      startupName.trim() &&
      problem.trim() &&
      solution.trim() &&
      market.trim() &&
      businessModel.trim(),
    [startupName, problem, solution, market, businessModel]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await generatePitchDeck({
        startup_name: startupName.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        market: market.trim(),
        business_model: businessModel.trim(),
      });
      setResult(data);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) {
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageHeight = 280;
    const marginX = 14;
    const maxWidth = 182;
    let y = 16;

    const ensureSpace = (required = 14) => {
      if (y + required > pageHeight) {
        doc.addPage();
        y = 16;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${result.startup_name} Pitch Deck`, marginX, y);
    y += 10;

    result.slides.forEach((slide) => {
      ensureSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${slide.slide_number}. ${slide.title}`, marginX, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      slide.content.forEach((line) => {
        ensureSpace(8);
        y = addWrappedText(doc, `- ${line}`, marginX, y, maxWidth, 5);
      });
      y += 4;
    });

    doc.save(
      `${result.startup_name.replace(/\s+/g, "_").toLowerCase()}_pitch_deck.pdf`
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-fuchsia-300/20 via-violet-200/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-fuchsia-950/20 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-fuchsia-200">
                Fundraising Narrative
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Pitch Deck Builder
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-200">
                Generate a 10-slide investor deck with structured talking points
                from your startup inputs.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-400/20"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-fuchsia-200/70 bg-white/90 p-6 shadow-2xl shadow-fuchsia-950/10 backdrop-blur md:p-8">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              value={startupName}
              onChange={(event) => setStartupName(event.target.value)}
              placeholder="Startup name"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              required
            />
            <textarea
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              placeholder="Problem: what painful issue are you solving?"
              className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              required
            />
            <textarea
              value={solution}
              onChange={(event) => setSolution(event.target.value)}
              placeholder="Solution: what is your product and why it works?"
              className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              required
            />
            <textarea
              value={market}
              onChange={(event) => setMarket(event.target.value)}
              placeholder="Market: segment, geography, TAM/SAM/SOM assumptions"
              className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              required
            />
            <textarea
              value={businessModel}
              onChange={(event) => setBusinessModel(event.target.value)}
              placeholder="Business model: pricing, revenue streams, monetization"
              className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              required
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !isFormReady}
                className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Generating deck..." : "Generate Pitch Deck"}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!result}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export to PDF
              </button>
            </div>
          </form>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </section>

        {result ? (
          <section className="mt-8 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {result.startup_name} - Generated Slides
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  10-slide investor narrative with structured slide content.
                </p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {result.slides.map((slide) => (
                <SlideCard key={slide.slide_number} slide={slide} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
