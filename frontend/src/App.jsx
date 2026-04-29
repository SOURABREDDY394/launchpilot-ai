import ColdEmail from "./pages/ColdEmail";
import DashboardPage from "./pages/DashboardPage";
import Finance from "./pages/Finance";
import Hiring from "./pages/Hiring";
import Legal from "./pages/Legal";
import PitchDeck from "./pages/PitchDeck";
import RAGChat from "./pages/RAGChat";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-200">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen">
                    <Navbar />
                    <main className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/pitch-deck" element={<PitchDeck />} />
                        <Route path="/cold-email" element={<ColdEmail />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/hiring" element={<Hiring />} />
                        <Route path="/rag-chat" element={<RAGChat />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}


