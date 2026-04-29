import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, MessageSquare, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">LaunchPilot</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/rag-chat" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
          <img 
            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} 
            alt="Avatar" 
            className="h-9 w-9 rounded-full border border-slate-700"
          />
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
