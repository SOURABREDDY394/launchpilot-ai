import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ColdEmail from "./pages/ColdEmail";
import DashboardPage from "./pages/DashboardPage";
import Finance from "./pages/Finance";
import Hiring from "./pages/Hiring";
import Legal from "./pages/Legal";
import LoginPage from "./pages/LoginPage";
import PitchDeck from "./pages/PitchDeck";
import RAGChat from "./pages/RAGChat";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-200">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/pitch-deck"
            element={
              <AppShell>
                <PitchDeck />
              </AppShell>
            }
          />
          <Route
            path="/cold-email"
            element={
              <AppShell>
                <ColdEmail />
              </AppShell>
            }
          />
          <Route
            path="/finance"
            element={
              <AppShell>
                <Finance />
              </AppShell>
            }
          />
          <Route
            path="/legal"
            element={
              <AppShell>
                <Legal />
              </AppShell>
            }
          />
          <Route
            path="/hiring"
            element={
              <AppShell>
                <Hiring />
              </AppShell>
            }
          />
          <Route path="/rag-chat" element={<RAGChat />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
