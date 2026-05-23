import React from "https://esm.sh/react@18.3.1?dev";
import { ArrowRight, Sparkles } from "https://esm.sh/lucide-react@0.469.0";
import { Link } from "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1";
const LoginPage = () => {
  return (
    React.createElement('div', { className: "min-h-screen bg-[#050816] px-4 py-16 text-white"    ,}
      , React.createElement('div', { className: "mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center"      ,}
        , React.createElement('section', { className: "w-full rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur md:p-10"         ,}
          , React.createElement('div', { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"          ,}
            , React.createElement(Sparkles, { className: "h-8 w-8" ,} )
          )
          , React.createElement('h1', { className: "mt-6 text-3xl font-semibold tracking-tight md:text-4xl"    ,}, "External sign-in has been removed"

          )
          , React.createElement('p', { className: "mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300"     ,}, "LaunchPilot now opens directly into a local workspace. Every tool is available without OAuth, redirects, or a Supabase browser session."


          )
          , React.createElement(Link, {
            to: "/",
            className: "mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"             ,}
, "Open workspace"

            , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
          )
        )
      )
    )
  );
};

export default LoginPage;
