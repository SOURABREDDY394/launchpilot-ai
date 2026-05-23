import React from "https://esm.sh/react@18.3.1?dev";
import { useMemo, useState } from "https://esm.sh/react@18.3.1?dev";
import { Link } from "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1";
import { generateHiring } from "../api.js";
const interviewTabs = [
  { id: "screening", label: "Screening" },
  { id: "technical", label: "Technical" },
  { id: "culture", label: "Culture" },
];

function buildJdDocument(result) {
  if (!result) {
    return "";
  }
  const jd = result.job_description;
  return [
    `JOB DESCRIPTION - ${result.role.toUpperCase()}`,
    `Startup: ${result.startup_name}`,
    `Stage: ${result.stage}`,
    "",
    "Role Summary",
    jd.role_summary,
    "",
    "Responsibilities",
    ...jd.responsibilities.map((item, idx) => `${idx + 1}. ${item}`),
    "",
    "Requirements",
    ...jd.requirements.map((item, idx) => `${idx + 1}. ${item}`),
    "",
    "Nice to Have",
    ...jd.nice_to_have.map((item, idx) => `${idx + 1}. ${item}`),
    "",
    "Benefits",
    jd.benefits,
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

export default function Hiring() {
  const [form, setForm] = useState({
    startup_name: "",
    role: "",
    stage: "",
    equity_budget: "",
    salary_budget: "",
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("screening");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const canSubmit = useMemo(
    () => Object.values(form).every((value) => value.trim().length > 0) && !loading,
    [form, loading]
  );

  const jdDocument = useMemo(() => buildJdDocument(result), [result]);

  const activeQuestions = useMemo(() => {
    if (!result) {
      return [];
    }
    if (activeTab === "screening") {
      return result.interview_plan.round_1_screening;
    }
    if (activeTab === "technical") {
      return result.interview_plan.round_2_technical;
    }
    return result.interview_plan.round_3_culture_fit;
  }, [activeTab, result]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await generateHiring({
        startup_name: form.startup_name.trim(),
        role: form.role.trim(),
        stage: form.stage.trim(),
        equity_budget: form.equity_budget.trim(),
        salary_budget: form.salary_budget.trim(),
      });
      setResult(response);
      setActiveTab("screening");
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const copyJd = async () => {
    if (!jdDocument) {
      return;
    }
    try {
      await navigator.clipboard.writeText(jdDocument);
      setNotice("Job description copied to clipboard.");
    } catch (e) {
      setNotice("Clipboard permission denied by browser.");
    }
  };

  const exportJdPdf = () => {
    if (!jdDocument) {
      return;
    }
    const success = openPdfWindow(`${result.role} Job Description`, jdDocument);
    setNotice(success ? "JD export opened." : "Popup blocked. Allow popups to export PDF.");
  };

  return (
    React.createElement('main', { className: "min-h-screen bg-slate-950 text-slate-950"  ,}
      , React.createElement('div', { className: "absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80"    ,} )
      , React.createElement('div', { className: "absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sky-300/20 via-cyan-200/10 to-transparent"       ,} )

      , React.createElement('div', { className: "relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8"          ,}
        , React.createElement('header', { className: "mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-cyan-950/20 backdrop-blur"            ,}
          , React.createElement('div', { className: "flex flex-wrap items-center justify-between gap-3"    ,}
            , React.createElement('div', null
              , React.createElement('p', { className: "text-sm font-medium uppercase tracking-[0.2em] text-cyan-200"    ,}, "Hiring Intelligence"

              )
              , React.createElement('h1', { className: "mt-2 text-3xl font-bold tracking-tight sm:text-4xl"    ,}, "Hiring Module" )
              , React.createElement('p', { className: "mt-3 max-w-3xl text-sm text-slate-200"   ,}, "Generate complete hiring plans with JD, equity advice, interview rounds, org chart, and compensation benchmarks."

              )
            )
            , React.createElement(Link, {
              to: "/",
              className: "inline-flex items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"             ,}
, "Back to Dashboard"

            )
          )
        )

        , React.createElement('section', { className: "space-y-6 rounded-3xl border border-cyan-200/60 bg-white/90 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur md:p-8"         ,}
          , React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4",}
            , React.createElement('div', { className: "grid gap-4 md:grid-cols-2"  ,}
              , React.createElement('input', {
                value: form.startup_name,
                onChange: (event) => updateField("startup_name", event.target.value),
                placeholder: "Startup name" ,
                className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"              ,
                required: true,}
              )
              , React.createElement('input', {
                value: form.role,
                onChange: (event) => updateField("role", event.target.value),
                placeholder: "Role (e.g., Founding Engineer)"   ,
                className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"              ,
                required: true,}
              )
            )
            , React.createElement('div', { className: "grid gap-4 md:grid-cols-3"  ,}
              , React.createElement('input', {
                value: form.stage,
                onChange: (event) => updateField("stage", event.target.value),
                placeholder: "Stage (e.g., pre-seed, seed)"   ,
                className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"              ,
                required: true,}
              )
              , React.createElement('input', {
                value: form.equity_budget,
                onChange: (event) => updateField("equity_budget", event.target.value),
                placeholder: "Equity budget (e.g., 1.5%)"   ,
                className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"              ,
                required: true,}
              )
              , React.createElement('input', {
                value: form.salary_budget,
                onChange: (event) => updateField("salary_budget", event.target.value),
                placeholder: "Salary budget (e.g., $120k-$160k)"   ,
                className: "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"              ,
                required: true,}
              )
            )
            , React.createElement('button', {
              type: "submit",
              disabled: !canSubmit,
              className: "inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"             ,}

              , loading ? "Generating hiring package..." : "Generate Hiring Package"
            )
          )

          , error ? (
            React.createElement('div', { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"       ,}
              , error
            )
          ) : null
          , notice ? (
            React.createElement('div', { className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"       ,}
              , notice
            )
          ) : null
        )

        , result ? (
          React.createElement('section', { className: "mt-8 space-y-6" ,}
            , React.createElement('article', { className: "rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm"     ,}
              , React.createElement('div', { className: "flex flex-wrap items-center justify-between gap-2"    ,}
                , React.createElement('h2', { className: "text-xl font-bold text-slate-900"  ,}, "Job Description" )
                , React.createElement('div', { className: "flex flex-wrap gap-2"  ,}
                  , React.createElement('button', {
                    type: "button",
                    onClick: copyJd,
                    className: "rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"          ,}
, "Copy JD"

                  )
                  , React.createElement('button', {
                    type: "button",
                    onClick: exportJdPdf,
                    className: "rounded-xl bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"        ,}
, "Export JD to PDF"

                  )
                )
              )

              , React.createElement('div', { className: "mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"     ,}
                , React.createElement('h3', { className: "text-base font-semibold uppercase tracking-[0.12em] text-cyan-700"    ,}, "Role Summary"

                )
                , React.createElement('p', { className: "mt-2 text-sm leading-6 text-slate-700"   ,}, result.job_description.role_summary)

                , React.createElement('div', { className: "mt-5 grid gap-5 lg:grid-cols-2"   ,}
                  , React.createElement('div', null
                    , React.createElement('h4', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700"    ,}, "Responsibilities"

                    )
                    , React.createElement('ul', { className: "mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"     ,}
                      , result.job_description.responsibilities.map((item) => (
                        React.createElement('li', { key: item,}, item)
                      ))
                    )
                  )
                  , React.createElement('div', null
                    , React.createElement('h4', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700"    ,}, "Requirements"

                    )
                    , React.createElement('ul', { className: "mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"     ,}
                      , result.job_description.requirements.map((item) => (
                        React.createElement('li', { key: item,}, item)
                      ))
                    )
                  )
                )

                , React.createElement('div', { className: "mt-5",}
                  , React.createElement('h4', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700"    ,}, "Nice to Have"

                  )
                  , React.createElement('ul', { className: "mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"     ,}
                    , result.job_description.nice_to_have.map((item) => (
                      React.createElement('li', { key: item,}, item)
                    ))
                  )
                )

                , React.createElement('div', { className: "mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4"     ,}
                  , React.createElement('h4', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700"    ,}, "Benefits"

                  )
                  , React.createElement('p', { className: "mt-2 text-sm text-slate-700"  ,}, result.job_description.benefits)
                )
              )
            )

            , React.createElement('div', { className: "grid gap-4 lg:grid-cols-2"  ,}
              , React.createElement('article', { className: "rounded-2xl border border-cyan-300 bg-cyan-50 p-6 shadow-sm"     ,}
                , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700"    ,}, "Equity Split Advisor"

                )
                , React.createElement('h3', { className: "mt-3 text-2xl font-bold text-slate-900"   ,}
                  , result.equity_split_advisor.suggested_equity_percent_for_role
                )
                , React.createElement('p', { className: "mt-3 text-sm font-medium text-slate-800"   ,}
                  , result.equity_split_advisor.vesting_schedule_recommendation
                )
                , React.createElement('p', { className: "mt-3 text-sm leading-6 text-slate-700"   ,}
                  , result.equity_split_advisor.justification
                )
              )

              , React.createElement('article', { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"     ,}
                , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700"    ,}, "Compensation Benchmarks"

                )
                , React.createElement('div', { className: "mt-4 overflow-x-auto" ,}
                  , React.createElement('table', { className: "min-w-full border-collapse text-left text-sm text-slate-700"    ,}
                    , React.createElement('thead', null
                      , React.createElement('tr', null
                        , React.createElement('th', { className: "border-b border-slate-200 px-3 py-2 font-semibold text-slate-900"     ,}, "Benchmark"

                        )
                        , React.createElement('th', { className: "border-b border-slate-200 px-3 py-2 font-semibold text-slate-900"     ,}, "Range"

                        )
                      )
                    )
                    , React.createElement('tbody', null
                      , React.createElement('tr', null
                        , React.createElement('td', { className: "border-b border-slate-100 px-3 py-2"   ,}, "Market salary range for role"

                        )
                        , React.createElement('td', { className: "border-b border-slate-100 px-3 py-2"   ,}
                          , result.compensation_benchmarks.market_salary_range_for_role
                        )
                      )
                      , React.createElement('tr', null
                        , React.createElement('td', { className: "px-3 py-2" ,}, "Equity range for stage"   )
                        , React.createElement('td', { className: "px-3 py-2" ,}
                          , result.compensation_benchmarks.equity_range_for_stage
                        )
                      )
                    )
                  )
                )
              )
            )

            , React.createElement('article', { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"     ,}
              , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700"    ,}, "Interview Plan"

              )
              , React.createElement('div', { className: "mt-4 flex flex-wrap gap-2"   ,}
                , interviewTabs.map((tab) => (
                  React.createElement('button', {
                    key: tab.id,
                    type: "button",
                    onClick: () => setActiveTab(tab.id),
                    className: `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-cyan-600 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`,}

                    , tab.label
                  )
                ))
              )
              , React.createElement('ol', { className: "mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700"     ,}
                , activeQuestions.map((question) => (
                  React.createElement('li', { key: question,}, question)
                ))
              )
            )

            , React.createElement('article', { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"     ,}
              , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700"    ,}, "Org Chart Suggestion"

              )
              , React.createElement('div', { className: "mt-4 grid gap-4 lg:grid-cols-2"   ,}
                , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4"    ,}
                  , React.createElement('h3', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-slate-700"    ,}, "Current stage team structure"

                  )
                  , React.createElement('div', { className: "mt-3 space-y-2" ,}
                    , result.org_chart_suggestion.current_stage_team_structure.map((node, index) => (
                      React.createElement('div', { key: node, className: "flex items-start gap-2"  ,}
                        , React.createElement('span', { className: "mt-[7px] h-2 w-2 rounded-full bg-cyan-500"    ,} )
                        , React.createElement('div', { className: `rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ${index > 0 ? "ml-4" : ""}`,}
                          , node
                        )
                      )
                    ))
                  )
                )

                , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4"    ,}
                  , React.createElement('h3', { className: "text-sm font-semibold uppercase tracking-[0.12em] text-slate-700"    ,}, "Next 6 months hiring plan"

                  )
                  , React.createElement('ol', { className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700"     ,}
                    , result.org_chart_suggestion.next_6_months_hiring_plan.map((item) => (
                      React.createElement('li', { key: item,}, item)
                    ))
                  )
                )
              )
            )
          )
        ) : null
      )
    )
  );
}
