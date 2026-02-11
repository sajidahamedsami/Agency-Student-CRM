
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis
} from 'recharts';
import { Users, UserCheck, TrendingUp, Award, MapPin, MousePointer2, Zap, BarChart3, Filter } from 'lucide-react';
import { Student, Lead } from '../types';

interface Props {
  students: Student[];
  leads: Lead[];
}

const DashboardOverview: React.FC<Props> = ({ students, leads }) => {
  const successStages = ['Visa', 'Final Student payment', 'Depart'];
  const successfulDepartures = students.filter(s => successStages.includes(s.currentStatus)).length;
  const activeProcesses = students.filter(s => !successStages.includes(s.currentStatus)).length;
  const activeLeadsCount = leads.filter(l => l.status !== 'Converted to Student').length;

  const countryData = useMemo(() => {
    const countryMap: Record<string, number> = {};
    students.forEach(s => {
      countryMap[s.targetCountry] = (countryMap[s.targetCountry] || 0) + 1;
    });
    return Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [students]);

  const sourceData = useMemo(() => {
    const sourceMap: Record<string, number> = {};
    leads.forEach(l => {
      sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
    });
    return Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [leads]);

  const funnelData = useMemo(() => {
    return [
      { subject: 'Prospects', A: leads.length },
      { subject: 'In-Process', A: activeProcesses },
      { subject: 'Visa Success', A: successfulDepartures },
    ];
  }, [leads, activeProcesses, successfulDepartures]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#94a3b8'];

  return (
    <div className="space-y-8 animate-bounce-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Operational Dynamics & Success Metrics</p>
        </div>
      </div>

      {/* KPI Cards - Vibrant with Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Files', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', shadow: 'shadow-blue-500/10' },
          { label: 'Active Pipeline', value: activeProcesses, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', shadow: 'shadow-amber-500/10' },
          { label: 'Market Leads', value: activeLeadsCount, icon: MousePointer2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'shadow-emerald-500/10' },
          { label: 'Visa Wins', value: successfulDepartures, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', shadow: 'shadow-indigo-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white rounded-[2rem] p-8 border ${kpi.border} shadow-lg ${kpi.shadow} hover:scale-[1.03] transition-all cursor-pointer group`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl group-hover:rotate-6 transition-transform`}>
                <kpi.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="h-2 w-2 bg-slate-200 rounded-full"></div>
            </div>
            <p className="text-4xl font-bold text-slate-900 tracking-tighter">{kpi.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Global Market Share */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={16} /></div> Destination Metrics
            </h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 12 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 600 }} />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Efficiency */}
        <div className="lg:col-span-4 bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-700 shadow-xl shadow-slate-900/10">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><Zap size={16} /></div> Conversion Logic
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={funnelData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '11px', background: '#ffffff', color: '#0f172a' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Leads to Process</p>
              <p className="text-lg font-bold text-white">{(activeProcesses / (leads.length || 1) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Visa Success</p>
              <p className="text-lg font-bold text-emerald-400">{(successfulDepartures / (activeProcesses || 1) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
