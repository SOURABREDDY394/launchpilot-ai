import { useState } from "react";

import { jsPDF } from "jspdf";

import { generatePrd } from "../api";

function SectionList({ title, items }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 7) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export default function PRDGenerator() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await generatePrd(productName, description);
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
    const marginX = 16;
    const maxWidth = 178;
    let y = 18;

    const ensureSpace = (required = 18) => {
      if (y + required > pageHeight) {
        doc.addPage();
        y = 18;
      }
    };

    const addTitle = (text) => {
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(text, marginX, y);
      y += 10;
    };

    const addSection = (title, content) => {
      ensureSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, marginX, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y = addWrappedText(doc, content, marginX, y, maxWidth, 5);
      y += 5;
    };

    const addBulletList = (title, items) => {
      ensureSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, marginX, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      items.forEach((item) => {
        ensureSpace(10);
        y = addWrappedText(doc, `- ${item}`, marginX, y, maxWidth, 5);
      });
      y += 4;
    };

    addTitle(`${result.product_name} PRD`);
    addSection("Product Description", result.product_description);
    addSection("Problem Statement", result.problem_statement);
    addBulletList("Target Users", result.target_users);
    addBulletList("Goals", result.goals);
    addBulletList(
      "Success Metrics",
      result.success_metrics.map((item) => `${item.metric}: ${item.target}`)
    );
    addBulletList("Must Have Features", result.features.must_have);
    addBulletList("Nice to Have Features", result.features.nice_to_have);
    addBulletList("User Stories", result.user_stories);
    addBulletList("Tech Stack Suggestion", result.tech_stack_suggestion);
    result.timeline_estimate.forEach((phase) => {
      addSection(
        `Timeline - ${phase.phase} (${phase.duration})`,
        phase.deliverables.join(", ")
      );
    });

    doc.save(`${result.product_name.replace(/\s+/g, "_").toLowerCase()}_prd.pdf`);
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-violet-200/70 bg-white/85 p-6 shadow-2xl shadow-violet-950/10 backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Product Planning
          </p>
          <h2 className="text-2xl font-bold text-slate-900">PRD Generator</h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Turn a product concept into a structured PRD with goals, features,
            user stories, technical direction, and delivery phases.
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          OpenAI or Gemini via LangChain
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="Product name"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the product, the problem it solves, and the kind of experience you want to build..."
          className="min-h-36 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          required
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading || !productName.trim() || !description.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Generating PRD..." : "Generate PRD"}
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

      {result ? (
        <article className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
          <header className="rounded-3xl bg-slate-900 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-200">
              Product Requirements Document
            </p>
            <h3 className="mt-2 text-3xl font-bold">{result.product_name}</h3>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
              {result.product_description}
            </p>
          </header>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">
              Problem Statement
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {result.problem_statement}
            </p>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionList title="Target Users" items={result.target_users} />
            <SectionList title="Goals" items={result.goals} />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">
              Goals & Success Metrics
            </h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Metric</th>
                    <th className="px-4 py-3 font-semibold">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {result.success_metrics.map((item) => (
                    <tr key={`${item.metric}-${item.target}`}>
                      <td className="px-4 py-3">{item.metric}</td>
                      <td className="px-4 py-3">{item.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionList
              title="Must Have Features"
              items={result.features.must_have}
            />
            <SectionList
              title="Nice to Have Features"
              items={result.features.nice_to_have}
            />
          </div>

          <SectionList title="User Stories" items={result.user_stories} />
          <SectionList
            title="Tech Stack Suggestion"
            items={result.tech_stack_suggestion}
          />

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">
              Timeline Estimate
            </h4>
            <div className="space-y-4">
              {result.timeline_estimate.map((phase) => (
                <div
                  key={`${phase.phase}-${phase.duration}`}
                  className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h5 className="text-base font-semibold text-slate-900">
                      {phase.phase}
                    </h5>
                    <span className="text-sm font-medium text-violet-800">
                      {phase.duration}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {phase.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-white/80 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </article>
      ) : null}
    </section>
  );
}
