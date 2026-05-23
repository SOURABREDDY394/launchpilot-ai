import React from "https://esm.sh/react@18.3.1?dev";
import { BrowserRouter, Route, Routes } from "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1";
import Navbar from "./components/Navbar.js";
import { AuthProvider } from "./context/AuthContext.js";
import ColdEmail from "./pages/ColdEmail.js";
import DashboardPage from "./pages/DashboardPage.js";
import Finance from "./pages/Finance.js";
import Hiring from "./pages/Hiring.js";
import Legal from "./pages/Legal.js";
import LoginPage from "./pages/LoginPage.js";
import PitchDeck from "./pages/PitchDeck.js";
import RAGChat from "./pages/RAGChat.js";
function AppShell({ children }) {
  return (
    React.createElement('div', { className: "min-h-screen bg-[#050816] text-slate-200"  ,}
      , React.createElement(Navbar, null )
      , React.createElement('main', null, children)
    )
  );
}

export default function App() {
  return (
    React.createElement(AuthProvider, null
      , React.createElement(BrowserRouter, null
        , React.createElement(Routes, null
          , React.createElement(Route, { path: "/login", element: React.createElement(LoginPage, null ),} )
          , React.createElement(Route, {
            path: "/",
            element: 
              React.createElement(AppShell, null
                , React.createElement(DashboardPage, null )
              )
            ,}
          )
          , React.createElement(Route, {
            path: "/pitch-deck",
            element: 
              React.createElement(AppShell, null
                , React.createElement(PitchDeck, null )
              )
            ,}
          )
          , React.createElement(Route, {
            path: "/cold-email",
            element: 
              React.createElement(AppShell, null
                , React.createElement(ColdEmail, null )
              )
            ,}
          )
          , React.createElement(Route, {
            path: "/finance",
            element: 
              React.createElement(AppShell, null
                , React.createElement(Finance, null )
              )
            ,}
          )
          , React.createElement(Route, {
            path: "/legal",
            element: 
              React.createElement(AppShell, null
                , React.createElement(Legal, null )
              )
            ,}
          )
          , React.createElement(Route, {
            path: "/hiring",
            element: 
              React.createElement(AppShell, null
                , React.createElement(Hiring, null )
              )
            ,}
          )
          , React.createElement(Route, { path: "/rag-chat", element: React.createElement(RAGChat, null ),} )
        )
      )
    )
  );
}
