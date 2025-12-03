import React from 'react';
import { LayoutDashboard, Database, FileCode, BookOpen, Activity } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'simulator', label: 'Simulator', icon: <LayoutDashboard size={20} /> },
  { id: 'dataset', label: 'Dataset', icon: <Database size={20} /> },
  { id: 'code', label: 'Model Code', icon: <FileCode size={20} /> },
  { id: 'docs', label: 'Documentation', icon: <BookOpen size={20} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-72 border-r border-white/5 h-screen flex flex-col shrink-0 z-20 bg-slate-900/30 backdrop-blur-xl">
      <div className="p-8 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 rounded-full"></div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl relative shadow-lg">
            <Activity size={24} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-wide text-lg leading-tight">AutoAI</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Telemetry</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
              ${activeTab === item.id 
                ? 'text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {/* Active Background Glow */}
            {activeTab === item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-white/5 rounded-xl"></div>
            )}
            
            <div className={`relative z-10 transition-transform duration-200 ${activeTab === item.id ? 'scale-110 text-indigo-400' : 'group-hover:text-gray-200'}`}>
               {item.icon}
            </div>
            <span className="relative z-10">{item.label}</span>
            
            {/* Active Indicator Dot */}
            {activeTab === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/5 rounded-2xl p-4">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-semibold text-gray-300">System Status</span>
           </div>
           <p className="text-[11px] text-gray-500 leading-relaxed">
             Model: v2.5-Flash<br/>
             Latency: 24ms<br/>
             API: Connected
           </p>
        </div>
      </div>
    </div>
  );
};