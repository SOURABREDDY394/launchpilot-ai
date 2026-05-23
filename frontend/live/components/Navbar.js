import React from "https://esm.sh/react@18.3.1?dev";
import { LayoutDashboard, Menu, Rocket, X } from "https://esm.sh/lucide-react@0.469.0";
import { useState } from "https://esm.sh/react@18.3.1?dev";
import { Link } from "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1";
import { useAuth } from "../context/AuthContext.js";
function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }




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
    React.createElement('header', { className: "sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl"      ,}
      , React.createElement('div', { className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"        ,}
        , React.createElement('div', { className: "flex items-center gap-8"  ,}
          , React.createElement(Link, { to: "/", className: "flex items-center gap-3"  ,}
            , React.createElement('div', { className: "flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]"          ,}
              , React.createElement(Rocket, { className: "h-5 w-5" ,} )
            )
            , React.createElement('div', null
              , React.createElement('p', { className: "text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/80"    ,}, "LaunchPilot AI"

              )
              , React.createElement('p', { className: "text-sm font-semibold text-white"  ,}, "Local founder workspace"  )
            )
          )

          , React.createElement('nav', { className: "hidden items-center gap-5 lg:flex"   ,}
            , productLinks.map((link) => (
              React.createElement(Link, {
                key: link.label,
                to: link.to,
                className: "text-sm font-medium text-slate-300 transition duration-200 hover:text-white"     ,}

                , link.label
              )
            ))
          )
        )

        , React.createElement('div', { className: "hidden items-center gap-3 lg:flex"   ,}
          , React.createElement('div', { className: "flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2"        ,}
            , React.createElement('div', { className: "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-semibold text-slate-950"           ,}
              , (_optionalChain([user, 'optionalAccess', _ => _.user_metadata, 'optionalAccess', _2 => _2.full_name]) || "L").slice(0, 1).toUpperCase()
            )
            , React.createElement('div', { className: "text-left",}
              , React.createElement('p', { className: "text-sm font-medium text-white"  ,}
                , _optionalChain([user, 'optionalAccess', _3 => _3.user_metadata, 'optionalAccess', _4 => _4.full_name]) || "Local Workspace"
              )
              , React.createElement('p', { className: "text-xs text-slate-400" ,}, "All tools enabled"  )
            )
          )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setMobileOpen((value) => !value),
          className: "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition duration-200 hover:bg-white/10 lg:hidden"            ,}

          , mobileOpen ? React.createElement(X, { className: "h-5 w-5" ,} ) : React.createElement(Menu, { className: "h-5 w-5" ,} )
        )
      )

      , mobileOpen ? (
        React.createElement('div', { className: "border-t border-white/10 bg-[#050816]/95 px-4 py-4 lg:hidden"     ,}
          , React.createElement('div', { className: "flex flex-col gap-4"  ,}
            , productLinks.map((link) => (
              React.createElement(Link, {
                key: link.label,
                to: link.to,
                onClick: () => setMobileOpen(false),
                className: "inline-flex items-center gap-2 text-sm font-medium text-slate-200"     ,}

                , React.createElement(LayoutDashboard, { className: "h-4 w-4 text-cyan-300"  ,} )
                , link.label
              )
            ))
          )
        )
      ) : null
    )
  );
}
