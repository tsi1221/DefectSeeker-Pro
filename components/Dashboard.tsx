
import React from 'react';
import { Defect, DefectStatus, DefectSeverity } from '../types';
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

  // Mock trend data
  const trendData = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 12 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 2 },
  ];

  const categoryData = defects.reduce((acc: any[], defect) => {
    const existing = acc.find(item => item.name === defect.category);
    if (existing) existing.count++;
    else acc.push({ name: defect.category, count: 1 });
    return acc;
  }, []);

  const stats = [
    { label: 'Active Issues', value: statusCounts[DefectStatus.OPEN] + statusCounts[DefectStatus.IN_PROGRESS], icon: 'fa-triangle-exclamation', color: 'indigo' },
    { label: 'Avg Resolution', value: '3.4d', icon: 'fa-bolt-lightning', color: 'blue' },
    { label: 'High Priority', value: defects.filter(d => d.severity === DefectSeverity.CRITICAL || d.severity === DefectSeverity.HIGH).length, icon: 'fa-fire', color: 'red' },
    { label: 'Closure Rate', value: '82%', icon: 'fa-circle-check', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of system health and team velocity.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex shadow-sm">
            <button className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-md">Live</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-400">Weekly</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-400">Monthly</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color === 'red' ? 'red' : stat.color}-50 flex items-center justify-center text-${stat.color === 'red' ? 'red' : stat.color}-600`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Defect Discovery Trend</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> This Week</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Severity Mix</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {severityData.map(entry => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-bold text-slate-700">{entry.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{entry.value} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Distribution by Category</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} width={100} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span className="text-xs font-bold uppercase tracking-widest">AI Insights</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Predicted Workload Increase</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Based on recent ticket velocity and project complexity, the model predicts a <span className="text-white font-bold">24% increase</span> in critical bugs over the next sprint. We recommend allocating additional QA resources to "Phoenix Redesign".</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all">Optimize Resources</button>
           </div>
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <i className="fa-solid fa-chart-line text-9xl -rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
