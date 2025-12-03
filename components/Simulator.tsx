import React, { useState, useEffect, useCallback } from 'react';
import { TelemetryData, RiskLevel } from '../types';
import { getSafetyInsight } from '../services/geminiService';
import { AlertTriangle, CheckCircle, BrainCircuit, Activity } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [data, setData] = useState<TelemetryData>({
    speed_kmh: 85,
    lateral_g: 0.3,
    longitudinal_g: 0,
    steering_angle_deg: 15,
    road_incline_deg: 0,
    tire_temp_c: 65,
    esp_active: 0,
    tc_active: 0
  });

  const [risk, setRisk] = useState<RiskLevel>('Low');
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    let score = 0;
    score += (data.speed_kmh / 200) * 40;
    score += (Math.abs(data.lateral_g) / 1.5) * 50;
    score += (Math.abs(data.steering_angle_deg) / 180) * 20;
    if (data.longitudinal_g < -0.4 && Math.abs(data.lateral_g) > 0.3) score += 25;
    if (data.tire_temp_c < 20 || data.tire_temp_c > 100) score += 15;
    if (data.esp_active) score += 40;
    if (data.tc_active) score += 30;

    if (score < 45) setRisk('Low');
    else if (score < 75) setRisk('Medium');
    else setRisk('High');
  }, [data]);

  const handleSliderChange = (key: keyof TelemetryData, value: number) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleBoolean = (key: 'esp_active' | 'tc_active') => {
    setData(prev => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
  };

  const fetchInsight = useCallback(async () => {
    setLoadingInsight(true);
    const text = await getSafetyInsight(data, risk);
    setInsight(text);
    setLoadingInsight(false);
  }, [data, risk]);

  // Map -1.5g to 1.5g range to 0-100%
  const ggX = 50 + (data.lateral_g / 1.5) * 50;
  const ggY = 50 - (data.longitudinal_g / 1.5) * 50;

  const getRiskStyles = () => {
    switch (risk) {
        case 'Low': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', shadow: 'shadow-emerald-500/10' };
        case 'Medium': return { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', shadow: 'shadow-amber-500/10' };
        case 'High': return { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', shadow: 'shadow-rose-500/10' };
    }
  };
  const riskStyle = getRiskStyles();

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      
      {/* LEFT COLUMN: Controls */}
      <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
               <Activity size={18} />
             </div>
             <h2 className="text-base font-semibold text-white tracking-wide">
               Telemetry Controls
             </h2>
          </div>

          <div className="space-y-8">
            {[
              { label: 'Speed', key: 'speed_kmh', min: 0, max: 250, step: 1, unit: 'km/h' },
              { label: 'Lateral G', key: 'lateral_g', min: -1.5, max: 1.5, step: 0.1, unit: 'g' },
              { label: 'Longitudinal G', key: 'longitudinal_g', min: -1.0, max: 1.0, step: 0.1, unit: 'g' },
              { label: 'Steering Angle', key: 'steering_angle_deg', min: -180, max: 180, step: 1, unit: 'deg' },
              { label: 'Tire Temp', key: 'tire_temp_c', min: 0, max: 150, step: 1, unit: '°C' },
            ].map((control) => (
              <div key={control.key} className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">{control.label}</label>
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                    {(data as any)[control.key]} {control.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={(data as any)[control.key]}
                  onChange={(e) => handleSliderChange(control.key as any, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
            <button
              onClick={() => toggleBoolean('esp_active')}
              className={`py-3 px-4 text-sm font-semibold rounded-xl border transition-all duration-300 ${
                data.esp_active 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
              }`}
            >
              ESP: {data.esp_active ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => toggleBoolean('tc_active')}
              className={`py-3 px-4 text-sm font-semibold rounded-xl border transition-all duration-300 ${
                data.tc_active 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
              }`}
            >
              TC: {data.tc_active ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Visuals */}
      <div className="col-span-8 flex flex-col gap-6">
        
        {/* TOP ROW: Charts */}
        <div className="grid grid-cols-2 gap-6 h-1/2 min-h-[300px]">
            
            {/* G-G Diagram */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col relative shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                 <Activity size={120} />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">G-Force Plot</h3>
              </div>
              
              <div className="flex-1 relative bg-black/40 rounded-2xl border border-white/5 m-2 shadow-inner">
                 {/* Grid lines */}
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-full h-[1px] bg-white/10"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="h-full w-[1px] bg-white/10"></div>
                 </div>
                 {/* Concentric Circles */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[50%] h-[50%] border border-white/5 rounded-full"></div>
                 </div>
                 
                 {/* The Dot */}
                 <div 
                  className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)] absolute border-2 border-white transition-all duration-150 ease-out z-20"
                  style={{
                    left: `${Math.min(Math.max(ggX, 0), 100)}%`,
                    top: `${Math.min(Math.max(ggY, 0), 100)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                 ></div>
                 
                 {/* Trail Effect (Simulated) */}
                 <div 
                  className="w-8 h-8 bg-indigo-500/20 rounded-full absolute blur-sm transition-all duration-300 ease-out z-10"
                  style={{
                    left: `${Math.min(Math.max(ggX, 0), 100)}%`,
                    top: `${Math.min(Math.max(ggY, 0), 100)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                 ></div>
              </div>
              
              <div className="flex justify-between text-xs text-indigo-300 mt-2 font-mono relative z-10">
                <span>Lat: {data.lateral_g.toFixed(2)}g</span>
                <span>Long: {data.longitudinal_g.toFixed(2)}g</span>
              </div>
            </div>

            {/* Risk Card */}
            <div className={`rounded-3xl border backdrop-blur-xl p-6 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-500 ${riskStyle.bg} ${riskStyle.shadow}`}>
                <div className={`absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none`}></div>
                
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 opacity-70 ${riskStyle.color}`}>Current Risk Level</h3>
                <div className={`text-6xl font-black tracking-tighter mb-4 ${riskStyle.color} drop-shadow-lg`}>
                  {risk}
                </div>
                
                <div className={`flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5 text-sm font-medium text-white`}>
                  {risk === 'Low' && <CheckCircle size={16} className="text-emerald-400" />}
                  {risk === 'Medium' && <AlertTriangle size={16} className="text-amber-400" />}
                  {risk === 'High' && <AlertTriangle size={16} className="text-rose-400" />}
                  <span>Speed: {data.speed_kmh} km/h</span>
                </div>
            </div>

        </div>

        {/* BOTTOM ROW: AI Analysis */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-xl flex-1 min-h-[250px]">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <BrainCircuit size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-100">AI Safety Insight</h3>
            </div>
            <button 
                onClick={fetchInsight}
                disabled={loadingInsight}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingInsight ? 'Processing...' : 'Analyze Scenario'}
            </button>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-mono text-sm">
             {loadingInsight ? (
               <div className="space-y-4 animate-pulse">
                 <div className="h-2 bg-white/10 rounded w-3/4"></div>
                 <div className="h-2 bg-white/10 rounded w-1/2"></div>
                 <div className="h-2 bg-white/10 rounded w-5/6"></div>
               </div>
             ) : insight ? (
               <div className="prose prose-invert max-w-none">
                 <p className="text-indigo-100 leading-relaxed whitespace-pre-line">{insight}</p>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm text-center">
                 <p>AI system ready.<br/>Request analysis for current telemetry.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};