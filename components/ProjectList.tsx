
import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAddProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as Project['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString()
    };

    onAddProject(newProject);
    setFormData({ name: '', description: '', status: 'Active' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Portfolio Management</h1>
          <p className="text-slate-500 text-sm">Monitor active projects and team assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Initiate Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                project.status === 'Active' ? 'bg-green-100 text-green-700' : 
                project.status === 'Planning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">{project.name}</h3>
            <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">{project.description || 'No description provided for this infrastructure project.'}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <img key={i} src={`https://picsum.photos/seed/p${project.id}${i}/32`} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" alt="team member" />
                 ))}
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border-2 border-white ring-1 ring-slate-100">+4</div>
               </div>
               <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline decoration-2">Inspect Details</button>
            </div>
            
            {/* Visual highlight on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900">Project Initiation</h2>
              <p className="text-sm text-slate-500 mt-1">Configure the new workspace parameters.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Identifier / Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  placeholder="E.g. Project Phoenix"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Strategic Description</label>
                <textarea 
                  rows={4}
                  placeholder="Outline the scope and objectives..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-medium text-slate-700 transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lifecycle Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Planning', 'Active', 'Archived'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status }))}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.status === status 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
                >
                  Confirm Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
