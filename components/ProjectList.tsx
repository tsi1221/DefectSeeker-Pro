
import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Management</h1>
          <p className="text-slate-500 text-sm">Monitor active projects and team assignments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <img key={i} src={`https://picsum.photos/seed/p${i}/32`} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" />
                 ))}
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border-2 border-white ring-1 ring-slate-100">+5</div>
               </div>
               <button className="text-indigo-600 text-sm font-bold hover:underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
