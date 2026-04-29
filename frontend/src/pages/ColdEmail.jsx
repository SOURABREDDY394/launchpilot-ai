import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { generateColdEmail } from "../api";

function EmailBlock({ title, subject, body, onCopy }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {title}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{subject}</h3>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Copy to clipboard
        </button>
      </div>

      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {body}
      </pre>
    </article>
  );
}

export default function ColdEmail() {
  const [product, setProduct] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("day1");
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");

  const isFormReady = useMemo(
    () =>
      product.trim() &&
      targetRole.trim() &&
      industry.trim() &&
      painPoint.trim(),
    [product, targetRole, industry, painPoint]
  );

  const dayOneBody = useMemo(() => {
    if (!result) {
      return "";
    }

    const selectedSubject = result.subject_lines[selectedSubjectIndex] || "";
    const lines = [
      `Subject: ${selectedSubject}`,
      "",
      result.email_body.hook,
      "",
      ...result.email_body.problem_statement,
      "",
      ...result.email_body.solution,
      "",
      result.email_body.social_proof,
      "",
      result.email_body.cta,
    ];

    return lines.join("\n");
  }, [result, selectedSubjectIndex]);

  const dayThreeBody = useMemo(() => {
    if (!result) {
      return "";
    }
    return `Subject: ${result.follow_up_day3.subject}\n\n${result.follow_up_day3.body}`;
  }, [result]);

  const daySevenBody = useMemo(() => {
    if (!result) {
      return "";
    }
    return `Subject: ${result.follow_up_day7.subject}\n\n${result.follow_up_day7.body}`;
  }, [result]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCopyStatus("");

    try {
      const data = await generateColdEmail({
        product: product.trim(),
        target_role: targetRole.trim(),
        industry: industry.trim(),
        pain_point: painPoint.trim(),
      });
      setResult(data);
      setSelectedSubjectIndex(0);
      setActiveTab("day1");
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} copied`);
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-300/20 via-cyan-200/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
                Outreach Automation
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Cold Email Writer
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-200">
                Generate conversion-focused cold emails with subject line options
                and two follow-up emails.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-emerald-200/70 bg-white/90 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur md:p-8">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              placeholder="Product (e.g. AI support copilot for B2B SaaS)"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Target role (e.g. Head of Sales)"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
            <input
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              placeholder="Industry (e.g. Fintech)"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
            <textarea
              value={painPoint}
              onChange={(event) => setPainPoint(event.target.value)}
              placeholder="Pain point (e.g. Losing inbound leads due to slow first response time)"
              className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading || !isFormReady}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Writing emails..." : "Generate Cold Emails"}
              </button>
              {copyStatus ? (
                <span className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-700">
                  {copyStatus}
                </span>
              ) : null}
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
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Subject Lines
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.subject_lines.map((subject, index) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setSelectedSubjectIndex(index)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedSubjectIndex === index
                        ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </article>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("day1")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "day1"
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                Day 1
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("day3")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "day3"
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                Day 3
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("day7")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "day7"
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                Day 7
              </button>
            </div>

            {activeTab === "day1" ? (
              <EmailBlock
                title="Initial Email"
                subject={result.subject_lines[selectedSubjectIndex]}
                body={dayOneBody}
                onCopy={() => copyText(dayOneBody, "Day 1 email")}
              />
            ) : null}

            {activeTab === "day3" ? (
              <EmailBlock
                title="Follow-up (3 days later)"
                subject={result.follow_up_day3.subject}
                body={dayThreeBody}
                onCopy={() => copyText(dayThreeBody, "Day 3 follow-up")}
              />
            ) : null}

            {activeTab === "day7" ? (
              <EmailBlock
                title="Follow-up (7 days later)"
                subject={result.follow_up_day7.subject}
                body={daySevenBody}
                onCopy={() => copyText(daySevenBody, "Day 7 follow-up")}
              />
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
