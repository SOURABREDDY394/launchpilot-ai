import { useState } from "react";

import { generateIcpProfiles } from "../api";

function ProfileCard({ profile, message, isBestSegment }) {
  const avatarInitials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-sm ${
        isBestSegment
          ? "border-amber-300 ring-2 ring-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {avatarInitials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{profile.name}</h3>
            <p className="text-sm text-slate-600">
              {profile.job_title} • {profile.age}
            </p>
          </div>
        </div>
        {isBestSegment ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Best Segment
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Goals
          </p>
          <ul className="mt-2 space-y-2">
            {profile.goals.map((goal) => (
              <li
                key={goal}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Pain Points
          </p>
          <ul className="mt-2 space-y-2">
            {profile.pain_points.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Hangs Out Online
          </p>
          <p className="mt-2 text-sm text-slate-700">
            {profile.hangout_online.join(", ")}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            How To Reach
          </p>
          <p className="mt-2 text-sm text-slate-700">
            {profile.reach_channels.join(", ")}
          </p>
        </div>

        {message ? (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Resonating Message
            </p>
            <p className="mt-2 text-sm text-indigo-900">{message}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ICPBuilder() {
  const [product, setProduct] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormReady = product.trim() && industry.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await generateIcpProfiles(product.trim(), industry.trim());
      setResult(data);
    } catch (submitError) {
      setResult(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const messageByProfile =
    result?.resonance_messages?.reduce((accumulator, current) => {
      accumulator[current.profile_name] = current.message;
      return accumulator;
    }, {}) || {};

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border border-indigo-200/80 bg-white/90 p-6 shadow-2xl shadow-indigo-900/10 backdrop-blur md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
          Audience Discovery
        </p>
        <h2 className="text-2xl font-bold text-slate-900">ICP Builder</h2>
        <p className="text-sm text-slate-600">
          Generate three ideal customer profiles, identify who to target first,
          and craft messaging that resonates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          placeholder="Product"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />
        <input
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          placeholder="Industry"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading || !isFormReady}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Building ICPs..." : "Build ICPs"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Target First
            </p>
            <p className="mt-1 text-base font-semibold text-amber-900">
              {result.best_customer_segment}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {result.icps.map((profile) => (
              <ProfileCard
                key={profile.name}
                profile={profile}
                message={messageByProfile[profile.name]}
                isBestSegment={result.best_customer_segment === profile.name}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
