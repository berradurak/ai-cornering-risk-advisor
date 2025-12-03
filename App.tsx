import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Simulator } from './components/Simulator';
import { DatasetView } from './components/DatasetView';
import { CodeView } from './components/CodeView';
import { DocsView } from './components/DocsView';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simulator');

  const renderContent = () => {
    switch (activeTab) {
      case 'simulator': return <Simulator />;
      case 'dataset': return <DatasetView />;
      case 'code': return <CodeView />;
      case 'docs': return <DocsView />;
      default: return <Simulator />;
    }
  };

  return (
    <div className="flex h-screen font-sans text-gray-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Glass Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
               AI Cornering Risk Advisor
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              Beta v1.0
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
               <ShieldCheck size={14} />
               <span>Student Project Demo</span>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;