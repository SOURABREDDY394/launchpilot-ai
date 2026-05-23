import { LayoutDashboard, Menu, Rocket, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const productLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Pitch Deck", to: "/pitch-deck" },
  { label: "Cold Email", to: "/cold-email" },
  { label: "Finance", to: "/finance" },
  { label: "Legal", to: "/legal" },
  { label: "Hiring", to: "/hiring" },
  { label: "AI Chat", to: "/rag-chat" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/80">
                LaunchPilot AI
              </p>
              <p className="text-sm font-semibold text-white">Local founder workspace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {productLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-300 transition duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-semibold text-slate-950">
              {(user?.user_metadata?.full_name || "L").slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user?.user_metadata?.full_name || "Local Workspace"}
              </p>
              <p className="text-xs text-slate-400">All tools enabled</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition duration-200 hover:bg-white/10 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#050816]/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {productLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-200"
              >
                <LayoutDashboard className="h-4 w-4 text-cyan-300" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
