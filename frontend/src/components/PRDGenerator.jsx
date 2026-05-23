import { ArrowRight, FileText } from "lucide-react";
import { useState } from "react";

import { jsPDF } from "jspdf";

import { generatePrd } from "../api";

function SectionList({ title, items }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
      <h4 className="text-base font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white/5 px-3 py-2">
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
    <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/75">
            PRD Generator
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Turn idea clarity into a clean product plan
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-300">
            Generate a structured product brief once the opportunity feels worth building. Keep the
            form simple, then let the output organize the details.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          Structured planning
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
            <label className="text-sm font-semibold text-white">Product name</label>
            <input
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="LaunchPilot Classroom"
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-sky-300/30 focus:ring-2 focus:ring-sky-300/10"
              required
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4">
            <label className="text-sm font-semibold text-white">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the user problem, the core workflow, and what success should feel like."
              className="mt-4 min-h-[160px] w-full resize-none rounded-[22px] border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-sky-300/30 focus:ring-2 focus:ring-sky-300/10"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading || !productName.trim() || !description.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-50 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {loading ? "Generating product plan..." : "Generate Product Plan"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!result}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-5 rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {result ? (
        <article className="mt-6 space-y-5 rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
          <header className="rounded-[28px] border border-sky-300/15 bg-sky-300/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/80">
              Product Requirements Document
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">{result.product_name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">{result.product_description}</p>
          </header>

          <section className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
            <h4 className="text-base font-semibold text-white">Problem statement</h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">{result.problem_statement}</p>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionList title="Target users" items={result.target_users} />
            <SectionList title="Goals" items={result.goals} />
          </div>

          <section className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
            <h4 className="text-base font-semibold text-white">Success metrics</h4>
            <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Metric</th>
                    <th className="px-4 py-3 font-semibold">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-200">
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
            <SectionList title="Must-have features" items={result.features.must_have} />
            <SectionList title="Nice-to-have features" items={result.features.nice_to_have} />
          </div>

          <SectionList title="User stories" items={result.user_stories} />
          <SectionList title="Tech stack suggestion" items={result.tech_stack_suggestion} />

          <section className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
            <h4 className="text-base font-semibold text-white">Timeline estimate</h4>
            <div className="mt-4 space-y-4">
              {result.timeline_estimate.map((phase) => (
                <div
                  key={`${phase.phase}-${phase.duration}`}
                  className="rounded-[24px] border border-sky-300/15 bg-sky-300/10 p-4"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h5 className="text-sm font-semibold text-white">{phase.phase}</h5>
                    <span className="text-sm text-sky-100">{phase.duration}</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                    {phase.deliverables.map((item) => (
                      <li key={item} className="rounded-2xl bg-white/10 px-3 py-2">
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
