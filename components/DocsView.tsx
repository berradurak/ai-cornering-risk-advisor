import React from 'react';
import { README_CONTENT } from '../constants';

export const DocsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
       <div className="shrink-0 border-b border-white/10 pb-6">
         <h2 className="text-2xl font-bold text-white tracking-tight">Project Documentation</h2>
         <p className="text-sm text-gray-400 mt-1">Read the full specification and run instructions.</p>
       </div>

       <div className="flex-1 overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl">
         <div className="h-full overflow-y-auto p-10 custom-scrollbar">
           <article className="max-w-4xl mx-auto prose prose-invert prose-indigo prose-lg">
             {README_CONTENT.split('\n').map((line, i) => {
               if (line.startsWith('# ')) 
                 return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-6 tracking-tight">{line.replace('# ', '')}</h1>;
               if (line.startsWith('## ')) 
                 return <h2 key={i} className="text-xl font-semibold text-indigo-300 mt-8 mb-4 border-b border-white/10 pb-2">{line.replace('## ', '')}</h2>;
               if (line.startsWith('### ')) 
                 return <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-3">{line.replace('### ', '')}</h3>;
               if (line.startsWith('- ')) 
                 return <li key={i} className="ml-4 list-disc text-gray-300 my-2 marker:text-indigo-500">{line.replace('- ', '')}</li>;
               if (line.startsWith('```')) return null; 
               if (line.trim() === '') return <br key={i}/>;
               return <p key={i} className="my-3 leading-7 text-gray-300">{line}</p>;
             })}
           </article>
         </div>
       </div>
    </div>
  );
};