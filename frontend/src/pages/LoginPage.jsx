import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome to LaunchPilot AI</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your AI-powered startup workspace
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-slate-900 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="h-5 w-5"
              />
            </span>
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
