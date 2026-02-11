
import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'ai'>('general');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Configuration</h1>
        <p className="text-slate-500 text-sm">Fine-tune the platform behavior and internal AI engine.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Alerts
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          AI Engine
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'general' && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">System Maintenance Mode</p>
                <p className="text-xs text-slate-500 mt-1">Temporarily restrict access for scheduled maintenance.</p>
              </div>
              <button 
                onClick={() => setMaintenance(!maintenance)}
                className={`w-12 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${maintenance ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="pt-8 border-t border-slate-100">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Name</label>
               <input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all" defaultValue="DefectSeeker Pro Enterprise" />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Enable Gemini Severity Prediction</p>
                <p className="text-xs text-slate-500 mt-1">Automatically suggest defect severity during logging.</p>
              </div>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${aiEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${aiEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="font-bold text-sm mb-2">Engine Health: Optimal</h4>
                 <p className="text-xs text-slate-400">Current Model: <span className="text-indigo-400 font-mono">gemini-3-flash-preview</span></p>
                 <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Check for Updates</button>
               </div>
               <i className="fa-solid fa-brain absolute -right-4 -bottom-4 text-7xl opacity-5"></i>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 text-center py-20">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-bell-slash"></i>
             </div>
             <p className="text-slate-500 font-medium">Notification templates are managed in the <span className="text-indigo-600 font-bold">MailCenter v2</span> dashboard.</p>
             <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline mt-4">Launch MailCenter</button>
          </div>
        )}

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
           <button className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 py-2">Reset to Default</button>
           <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">Commit Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
