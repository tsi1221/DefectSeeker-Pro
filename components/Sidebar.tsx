
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = [
    { to: '/', icon: 'fa-chart-pie', label: 'Dashboard' },
    { to: '/defects', icon: 'fa-bug', label: 'Defects' },
    { to: '/projects', icon: 'fa-diagram-project', label: 'Projects' },
    { to: '/reports', icon: 'fa-file-lines', label: 'Reports' },
  ];

  if (role === UserRole.QA || role === UserRole.MANAGER) {
    links.push({ to: '/defects/new', icon: 'fa-plus-circle', label: 'Report Defect' });
  }

  // Management section for Admin/Managers
  const managementLinks = [];
  if (role === UserRole.MANAGER) {
    managementLinks.push({ to: '/users', icon: 'fa-users-gear', label: 'Team Directory' });
    managementLinks.push({ to: '/settings', icon: 'fa-gears', label: 'System Config' });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-11 h-11 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <i className="fa-solid fa-bolt text-2xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tighter leading-none">DefectSeeker</span>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Enterprise</span>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Main Menu</p>
          <nav className="space-y-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <i className={`fa-solid ${link.icon} w-5 text-lg`}></i>
                <span className="font-bold text-sm">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {managementLinks.length > 0 && (
          <div>
            <p className="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</p>
            <nav className="space-y-1">
              {managementLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <i className={`fa-solid ${link.icon} w-5 text-lg`}></i>
                  <span className="font-bold text-sm">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="p-6">
        <NavLink to="/profile" className="flex items-center justify-between gap-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
          <div className="flex items-center gap-3 min-w-0">
             <i className="fa-solid fa-user-circle text-xl text-indigo-400"></i>
             <span className="text-xs font-bold truncate">My Workspace</span>
          </div>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-600 group-hover:translate-x-1 transition-transform"></i>
        </NavLink>
        <div className="mt-4 px-4">
           <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v2.5.0-Stable</span>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
