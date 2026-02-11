
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Settings, 
  LogOut, 
  Search, 
  Menu,
  X,
  Globe,
  Bell
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'students' | 'leads' | 'settings';
  setActiveTab: (tab: 'overview' | 'students' | 'leads' | 'settings') => void;
  branding: { name: string; logoUrl: string };
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, branding }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', name: 'Students Directory', icon: Users },
    { id: 'leads', name: 'Leads Pipeline', icon: Target },
    { id: 'settings', name: 'System Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Deep Navy Blue with Modern Accents */}
      <aside className={`bg-[#0f172a] w-64 flex-shrink-0 fixed md:static h-full z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col border-r border-slate-800`}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <Globe size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight leading-none">{branding.name}</h1>
              <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 sidebar-active-glow' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={19} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
              <span className="font-semibold text-[13px]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleSignOut} 
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span className="font-semibold text-[13px]">Termination</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 glass-effect sticky top-0 border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-12 pr-6 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl w-80 outline-none text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{branding.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
