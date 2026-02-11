
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = [
    { to: '/', icon: 'fa-chart-pie', label: 'Dashboard' },
    { to: '/defects', icon: 'fa-bug', label: 'Inventory' },
    { to: '/projects', icon: 'fa-diagram-project', label: 'Projects' },
    { to: '/reports', icon: 'fa-file-lines', label: 'Analytics' },
  ];

  if (role === UserRole.QA || role === UserRole.MANAGER || role === UserRole.ADMIN) {
    links.push({ to: '/defects/new', icon: 'fa-plus-circle', label: 'Log Incident' });
  }

  const managementLinks = [];
  if (role === UserRole.MANAGER || role === UserRole.ADMIN) {
    managementLinks.push({ to: '/users', icon: 'fa-users-gear', label: 'Team Directory' });
  }
  
  if (role === UserRole.ADMIN) {
    managementLinks.push({ to: '/settings', icon: 'fa-gears', label: 'System Config' });
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white shadow-2xl z-20 overflow-hidden">
      <div className="p-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform rotate-3 hover:rotate-0 transition-transform">
          <i className="fa-solid fa-bolt text-2xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-tighter leading-none">DefectSeeker</span>
          <span className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-1.5 bg-indigo-400/10 px-2 py-0.5 rounded-full w-fit">MVP PRO</span>
        </div>
      </div>
      
      <div className="flex-1 px-6 py-4 space-y-10 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 mb-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Workflow Management</p>
          <nav className="space-y-1.5">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${
                    isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <i className={`fa-solid ${link.icon} w-5 text-xl transition-transform group-hover:scale-110`}></i>
                <span className="font-bold text-sm tracking-tight">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {managementLinks.length > 0 && (
          <div>
            <p className="px-4 mb-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Control Plane</p>
            <nav className="space-y-1.5">
              {managementLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${
                      isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <i className={`fa-solid ${link.icon} w-5 text-xl transition-transform group-hover:scale-110`}></i>
                  <span className="font-bold text-sm tracking-tight">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-white/5">
        <NavLink to="/profile" className="flex items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-3xl hover:bg-slate-800 transition-all border border-white/5 group shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
             <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
               <i className="fa-solid fa-user-circle text-xl"></i>
             </div>
             <div className="flex flex-col min-w-0">
               <span className="text-xs font-black truncate">User Profile</span>
               <span className="text-[8px] text-slate-500 font-bold uppercase truncate tracking-widest">Active Session</span>
             </div>
          </div>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-600 group-hover:translate-x-1 transition-transform"></i>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
