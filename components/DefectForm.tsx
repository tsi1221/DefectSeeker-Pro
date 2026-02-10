
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Defect, DefectStatus, DefectSeverity, UserRole } from '../types';
import { CATEGORIES, MOCK_PROJECTS } from '../constants';
import { predictSeverity } from '../services/geminiService';

interface DefectFormProps {
  onSubmit: (defect: Defect) => void;
  currentUser: User;
  users: User[];
  initialData?: Defect;
}

const DefectForm: React.FC<DefectFormProps> = ({ onSubmit, currentUser, users, initialData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || CATEGORIES[0],
    severity: initialData?.severity || DefectSeverity.MEDIUM,
    assigneeId: initialData?.assigneeId || '',
    projectId: initialData?.projectId || MOCK_PROJECTS[0].id,
    aiReasoning: initialData?.aiReasoning || ''
  });

  const handlePredict = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter a title and description first.");
      return;
    }
    setPredicting(true);
    const result = await predictSeverity(formData.title, formData.description, formData.category);
    setFormData(prev => ({ 
      ...prev, 
      severity: result.severity,
      aiReasoning: result.reasoning
    }));
    setPredicting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newDefect: Defect = {
      id: initialData?.id || `DEF-${Math.floor(Math.random() * 900) + 100}`,
      title: formData.title,
      description: formData.description,
      status: initialData?.status || DefectStatus.OPEN,
      severity: formData.severity,
      category: formData.category,
      reporterId: initialData?.reporterId || currentUser.id,
      assigneeId: formData.assigneeId || undefined,
      projectId: formData.projectId,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: initialData?.comments || [],
      aiReasoning: formData.aiReasoning
    };

    onSubmit(newDefect);
    setTimeout(() => {
      setLoading(false);
      navigate('/defects');
    }, 500);
  };

  const developers = users.filter(u => u.role === UserRole.DEVELOPER);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Update Record' : 'Report Incident'}</h1>
        <p className="text-slate-500">Document the software defect for internal triage and resolution.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Defect Title</label>
            <input 
              required
              type="text" 
              placeholder="Briefly summarize the issue..."
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Project</label>
              <select 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-semibold"
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
              >
                {MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
              <select 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-semibold"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Detailed Description</label>
            <textarea 
              required
              rows={5}
              placeholder="Provide reproduction steps, expected results, and actual results..."
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none text-sm leading-relaxed"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
          </div>

          <div className="p-6 bg-slate-900 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-sparkles text-indigo-400"></i>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Gemini Engine Prediction</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">The AI models will analyze the linguistic context of your report to determine the severity level.</p>
                {formData.aiReasoning && (
                  <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] text-indigo-300 font-bold italic">“{formData.aiReasoning}”</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select 
                  className="w-full sm:w-auto px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white outline-none focus:bg-white/20"
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as DefectSeverity }))}
                >
                  {Object.values(DefectSeverity).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                </select>
                <button 
                  type="button"
                  onClick={handlePredict}
                  disabled={predicting}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  {predicting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                  Auto-Predict
                </button>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-brain text-[200px] text-white"></i>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Developer (Assignment)</label>
            <select 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-semibold"
              value={formData.assigneeId}
              onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
            >
              <option value="">Pending Assignment</option>
              {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/defects')}
            className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 disabled:opacity-50 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
          >
            {loading ? 'Submitting...' : (initialData ? 'Finalize Updates' : 'Commit Defect')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DefectForm;
