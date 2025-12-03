import React from 'react';
import { PYTHON_SCRIPT_CONTENT } from '../constants';
import { Copy, Check, FileCode } from 'lucide-react';

export const CodeView: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
       <div className="flex justify-between items-center shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Python Model</h2>
            <p className="text-sm text-gray-400 mt-1">Full training script with RandomForest implementation.</p>
         </div>
         <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl hover:bg-indigo-600/30 text-indigo-300 transition-colors text-sm font-medium backdrop-blur-md"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
       </div>

       <div className="flex-1 border border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border-b border-white/5">
            <FileCode size={14} className="text-indigo-400" />
            <span className="text-xs font-mono text-gray-400">train_model.py</span>
            <div className="ml-auto flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            <pre className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {PYTHON_SCRIPT_CONTENT}
            </pre>
          </div>
       </div>
    </div>
  );
};