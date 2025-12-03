import React, { useState, useMemo } from 'react';
import { generateDataset, convertToCSV } from '../utils/dataGenerator';
import { DatasetRow } from '../types';
import { Download, RefreshCw } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DatasetView: React.FC = () => {
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  
  React.useEffect(() => {
    if (dataset.length === 0) setDataset(generateDataset(400));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = () => setDataset(generateDataset(400));
  const handleDownload = () => {
    const csv = convertToCSV(dataset);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cornering_data.csv';
    a.click();
  };

  const scatterData = useMemo(() => {
    return dataset.map(d => ({ x: d.speed_kmh, y: Math.abs(d.lateral_g), risk: d.risk_level }));
  }, [dataset]);

  const getRiskColor = (risk: string) => {
    if (risk === 'High') return '#F43F5E'; // rose-500
    if (risk === 'Medium') return '#F59E0B'; // amber-500
    return '#10B981'; // emerald-500
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Synthetic Dataset</h2>
           <p className="text-sm text-gray-400 mt-1">Generated 400 rows of training data.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={handleRegenerate} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors text-sm font-medium backdrop-blur-md">
            <RefreshCw size={14} /> Regenerate
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8 overflow-hidden min-h-0">
        {/* Table */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-white/5">
            <h3 className="text-sm font-semibold text-gray-200">Data Preview</h3>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-black/20 text-gray-300 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="p-4 font-medium border-b border-white/5">Speed</th>
                  <th className="p-4 font-medium border-b border-white/5">Lat G</th>
                  <th className="p-4 font-medium border-b border-white/5">Angle</th>
                  <th className="p-4 font-medium border-b border-white/5">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataset.slice(0, 50).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">{row.speed_kmh}</td>
                    <td className="p-4">{row.lateral_g}</td>
                    <td className="p-4">{row.steering_angle_deg}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${row.risk_level === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/20' : 
                          row.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20' : 
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'}`}>
                        {row.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl flex flex-col p-6">
           <h3 className="text-sm font-semibold text-gray-200 mb-6">Risk Distribution (Speed vs Lat G)</h3>
           <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" dataKey="x" name="Speed" unit="km/h" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis type="number" dataKey="y" name="Lat G" unit="g" stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '12px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                  cursor={{ stroke: 'rgba(255,255,255,0.2)' }} 
                />
                <Scatter name="Telemetry" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};