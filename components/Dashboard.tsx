
import React from 'react';
import { Defect, DefectStatus, DefectSeverity, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  defects: Defect[];
}

const Dashboard: React.FC<DashboardProps> = ({ defects }) => {
  const statusCounts = {
    [DefectStatus.OPEN]: defects.filter(d => d.status === DefectStatus.OPEN).length,
    [DefectStatus.IN_PROGRESS]: defects.filter(d => d.status === DefectStatus.IN_PROGRESS).length,
    [DefectStatus.RESOLVED]: defects.filter(d => d.status === DefectStatus.RESOLVED).length,
    [DefectStatus.CLOSED]: defects.filter(d => d.status === DefectStatus.CLOSED).length,
  };

  const severityData = [
    { name: 'Low', value: defects.filter(d => d.severity === DefectSeverity.LOW).length, color: '#94a3b8' },
    { name: 'Medium', value: defects.filter(d => d.severity === DefectSeverity.MEDIUM).length, color: '#f59e0b' },
    { name: 'High', value: defects.filter(d => d.severity === DefectSeverity.HIGH).length, color: '#f97316' },
    { name: 'Critical', value: defects.filter(d => d.severity === DefectSeverity.CRITICAL).length, color: '#ef4444' },
  ];

  const categoryData = defects.reduce((acc: any[], defect) => {
    const existing = acc.find(item => item.name === defect.category);
    if (existing) existing.count++;
    else acc.push({ name: defect.category, count: 1 });
    return acc;
  }, []);

  const stats = [
    { label: 'Active Incidents', value: statusCounts[DefectStatus.OPEN] + statusCounts[DefectStatus.IN_PROGRESS], icon: 'fa-triangle-exclamation', color: 'indigo' },
    { label: 'Critical Defects', value: defects.filter(d => d.severity === DefectSeverity.CRITICAL).length, icon: 'fa-fire-alt', color: 'red' },
    { label: 'Resolution Rate', value: defects.length > 0 ? `${Math.round((statusCounts[DefectStatus.CLOSED] / defects.length) * 100)}%` : '0%', icon: 'fa-check-circle', color: 'green' },
    { label: 'Avg Triage Time', value: '1.2h', icon: 'fa-bolt', color: 'blue' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Health Score</h1>
          <p className="text-slate-500 text-sm font-medium">Global summary of cross-project software stability.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 shadow-sm">
             <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Engine Online</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'red' ? 'red' : stat.color}-50 flex items-center justify-center text-${stat.color === 'red' ? 'red' : stat.color}-600 text-xl mb-4`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <i className="fa-solid fa-chart-bar text-indigo-500"></i> Category Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 'bold'}} width={100} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-900 mb-8">Severity Mix</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value">
                  {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {severityData.map(entry => (
              <div key={entry.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6 text-indigo-400">
              <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
              <span className="text-xs font-black uppercase tracking-[0.3em]">AI-Powered Predictive Analysis</span>
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Gemini predicts a 15% increase in UI/UX bottlenecks.</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">Based on recent ticket velocity in "Phoenix Redesign", we suggest reallocating <span className="text-white font-bold underline decoration-indigo-500 underline-offset-4">2 additional developers</span> to frontend tasks to maintain the release schedule.</p>
            <div className="flex gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">Apply Optimization</button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">View Full Forecast</button>
            </div>
         </div>
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <i className="fa-solid fa-brain text-[300px] -rotate-12 translate-x-20 translate-y-20"></i>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
