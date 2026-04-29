import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { generateLegal } from "../api";

const tabs = [
  { id: "terms", label: "T&C" },
  { id: "privacy", label: "Privacy" },
  { id: "agreement", label: "Agreement" },
];

function agreementToText(outline) {
  if (!outline) {
    return "";
  }

  return [
    "CO-FOUNDER AGREEMENT OUTLINE",
    "",
    "1. Roles & Responsibilities",
    outline.roles_and_responsibilities,
    "",
    "2. Equity Split Suggestion",
    outline.equity_split_suggestion,
    "",
    "3. Vesting Schedule",
    outline.vesting_schedule,
    "",
    "4. IP Ownership",
    outline.ip_ownership,
  ].join("\n");
}

function openPdfWindow(title, content) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!printWindow) {
    return false;
  }

  const escapedTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escapedBody = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapedTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 36px; color: #111827; line-height: 1.6; }
          h1 { margin-bottom: 20px; font-size: 24px; }
          pre { white-space: pre-wrap; word-break: break-word; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>${escapedTitle}</h1>
        <pre>${escapedBody}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}

export default function Legal() {
  const [form, setForm] = useState({
    startup_name: "",
    product_description: "",
    country: "",
    data_collected: "",
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("terms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [notice, setNotice] = useState("");

  const canSubmit = useMemo(
    () =>
      Object.values(form).every((value) => value.trim().length > 0) && !loading,
    [form, loading]
  );

  const tabContent = useMemo(() => {
    if (!result) {
      return "";
    }
    if (activeTab === "terms") {
      return result.terms_and_conditions;
    }
    if (activeTab === "privacy") {
      return result.privacy_policy;
    }
    return agreementToText(result.cofounder_agreement_outline);
  }, [activeTab, result]);

  const tabTitle = useMemo(() => {
    if (activeTab === "terms") {
      return "Terms and Conditions";
    }
    if (activeTab === "privacy") {
      return "Privacy Policy";
    }
    return "Co-founder Agreement Outline";
  }, [activeTab]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await generateLegal({
        startup_name: form.startup_name.trim(),
        product_description: form.product_description.trim(),
        country: form.country.trim(),
        data_collected: form.data_collected.trim(),
      });
      setResult(response);
      setCheckedItems({});
      setActiveTab("terms");
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCurrentDocument = async () => {
    if (!tabContent) {
      return;
    }
    try {
      await navigator.clipboard.writeText(tabContent);
      setNotice(`${tabTitle} copied to clipboard.`);
    } catch {
      setNotice("Clipboard permission denied by browser.");
    }
  };

  const exportCurrentDocument = () => {
    if (!tabContent) {
      return;
    }
    const success = openPdfWindow(tabTitle, tabContent);
    setNotice(success ? `${tabTitle} export opened.` : "Popup blocked. Allow popups to export PDF.");
  };

  const toggleChecklist = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-amber-300/20 via-orange-200/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-amber-950/20 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-200">
                Legal Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Legal Module</h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-200">
                Generate legal drafts, founder agreement outline, country-specific compliance checklist, and business structure recommendation.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/20"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-amber-200/60 bg-white/90 p-6 shadow-2xl shadow-amber-950/10 backdrop-blur md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.startup_name}
                onChange={(event) => updateField("startup_name", event.target.value)}
                placeholder="Startup name"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                required
              />
              <input
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                placeholder="Country"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                required
              />
            </div>
            <textarea
              value={form.product_description}
              onChange={(event) => updateField("product_description", event.target.value)}
              placeholder="Product description"
              rows={4}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              required
            />
            <textarea
              value={form.data_collected}
              onChange={(event) => updateField("data_collected", event.target.value)}
              placeholder="Data collected (e.g., name, email, usage analytics)"
              rows={3}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              required
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Generating legal drafts..." : "Generate Legal Documents"}
            </button>
          </form>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}
        </section>

        {result ? (
          <section className="mt-8 space-y-6">
            <article className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-amber-600 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyCurrentDocument}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Copy to Clipboard
                </button>
                <button
                  type="button"
                  onClick={exportCurrentDocument}
                  className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-500"
                >
                  Export to PDF
                </button>
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-bold text-slate-900">{tabTitle}</h3>
                <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {tabContent}
                </pre>
              </div>
            </article>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Compliance Checklist
                </p>
                <div className="mt-4 space-y-3">
                  {result.compliance_checklist.map((item) => (
                    <label
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedItems[item])}
                        onChange={() => toggleChecklist(item)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Recommended Business Structure
                </p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  {result.recommended_business_structure}
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Suggested for {result.startup_name} operating in {result.country}.
                </p>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
