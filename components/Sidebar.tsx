
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

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-bolt text-xl"></i>
        </div>
        <span className="font-bold text-xl tracking-tight">DefectSeeker</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <i className={`fa-solid ${link.icon} w-5`}></i>
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6">
        <NavLink to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors group">
          <i className="fa-solid fa-user-gear group-hover:text-indigo-400"></i>
          <span className="text-sm font-medium">My Account</span>
        </NavLink>
        <div className="mt-4 bg-slate-800 rounded-xl p-4 text-[10px] text-slate-400">
          <p className="font-semibold text-white mb-1">DefectSeeker Pro</p>
          <p>Enterprise Edition v2.5</p>
          <div className="mt-2 flex items-center gap-2 text-indigo-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Connected
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
