
import React from 'react';
import { Defect, Project } from '../types';

interface ReportsProps {
  defects: Defect[];
  projects: Project[];
}

const Reports: React.FC<ReportsProps> = ({ defects, projects }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Intelligence & Reporting</h1>
        <p className="text-slate-500 text-sm">Generate audits, summaries, and analytical spreadsheets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-6">
             <i className="fa-solid fa-file-pdf"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Assurance Audit</h3>
          <p className="text-sm text-slate-500 mb-8">Comprehensive report of all open critical defects across all active projects for the current sprint.</p>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-download"></i>
            Export PDF
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-6">
             <i className="fa-solid fa-file-csv"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Inventory Export</h3>
          <p className="text-sm text-slate-500 mb-8">Complete CSV dump of all defect records including discussion history and AI reasoning logs.</p>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Scheduled Reports</h3>
          <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">Add Schedule</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Weekly System Health', rec: 'Every Monday, 8:00 AM', to: 'Managers' },
            { name: 'Critical Bug Alert', rec: 'Real-time', to: 'Developers' },
            { name: 'Monthly Stakeholder Summary', rec: 'Last Day of Month', to: 'All' },
          ].map((item, idx) => (
            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-400 mt-1">{item.rec} • Recipients: {item.to}</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
