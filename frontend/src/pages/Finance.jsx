import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { generateFinance } from "../api";

const initialExpense = { category: "", amount: "" };

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function Finance() {
  const [startupName, setStartupName] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [funding, setFunding] = useState("");
  const [expenses, setExpenses] = useState([{ ...initialExpense }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!startupName.trim()) {
      return false;
    }
    if (monthlyRevenue === "" || funding === "") {
      return false;
    }
    return expenses.every(
      (item) => item.category.trim() && item.amount !== "" && Number(item.amount) >= 0
    );
  }, [expenses, funding, monthlyRevenue, startupName]);

  const updateExpense = (index, key, value) => {
    setExpenses((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item))
    );
  };

  const addExpenseRow = () => {
    setExpenses((prev) => [...prev, { ...initialExpense }]);
  };

  const removeExpenseRow = (index) => {
    setExpenses((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        startup_name: startupName.trim(),
        monthly_expenses: expenses.map((item) => ({
          category: item.category.trim(),
          amount: Number(item.amount),
        })),
        monthly_revenue: Number(monthlyRevenue),
        funding: Number(funding),
      };
      const response = await generateFinance(payload);
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="absolute inset-0 bg-launchpilot-grid bg-[length:32px_32px] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-violet-300/20 via-indigo-200/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl shadow-indigo-950/20 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-200">
                Finance Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Startup Finance Module
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-200">
                Model burn, runway, pricing strategy, projections, and fundraising readiness.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-indigo-300/40 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-400/20"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-indigo-200/60 bg-white/90 p-6 shadow-2xl shadow-indigo-950/10 backdrop-blur md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={startupName}
                onChange={(event) => setStartupName(event.target.value)}
                placeholder="Startup name"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={monthlyRevenue}
                onChange={(event) => setMonthlyRevenue(event.target.value)}
                placeholder="Monthly revenue (USD)"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={funding}
                onChange={(event) => setFunding(event.target.value)}
                placeholder="Funding available (USD)"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Monthly Expenses
                </h2>
                <button
                  type="button"
                  onClick={addExpenseRow}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  Add row
                </button>
              </div>

              <div className="space-y-3">
                {expenses.map((item, index) => (
                  <div key={`expense-${index}`} className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
                    <input
                      value={item.category}
                      onChange={(event) => updateExpense(index, "category", event.target.value)}
                      placeholder="Category (e.g. Payroll)"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amount}
                      onChange={(event) => updateExpense(index, "amount", event.target.value)}
                      placeholder="Amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeExpenseRow(index)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={expenses.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Analyzing finances..." : "Run Finance Analysis"}
            </button>
          </form>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </section>

        {result ? (
          <section className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Burn Rate
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">
                  {formatCurrency(result.burn_rate_monthly)}
                </p>
                <p className="mt-2 text-sm text-slate-600">Per month</p>
              </article>
              <article className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Runway
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">
                  {result.runway_months_remaining === null
                    ? "Sustainable"
                    : `${result.runway_months_remaining} mo`}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Break-even in{" "}
                  {result.break_even_months === null ? "N/A" : `${result.break_even_months} mo`}
                </p>
              </article>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                Revenue Projection (12 months)
              </p>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.revenue_projections_12_months}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" tickFormatter={(val) => `$${Math.round(val / 1000)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="projected_revenue"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Pricing Strategy
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-900 capitalize">
                  {result.pricing_strategy.recommended_model}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {result.pricing_strategy.price_range}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {result.pricing_strategy.justification}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  Fundraising Readiness
                </p>
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Score</span>
                    <span className="text-sm font-bold text-slate-900">
                      {result.fundraising_readiness.score}/10
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${result.fundraising_readiness.score * 10}%` }}
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Recommended stage:{" "}
                  <span className="capitalize">
                    {result.fundraising_readiness.recommended_stage}
                  </span>
                </p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      What you have
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {result.fundraising_readiness.what_you_have.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                      What you need
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {result.fundraising_readiness.what_you_need.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
