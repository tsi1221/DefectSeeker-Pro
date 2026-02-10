
import React, { useState } from 'react';
import { User, Notification } from '../types';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: User;
  notifications: Notification[];
  onLogout: () => void;
  onMarkRead: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, notifications, onLogout, onMarkRead }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search across projects..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-full transition-colors ${showNotifs ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fa-solid fa-bell text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => onMarkRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                          notif.type === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <i className={`fa-solid ${notif.type === 'Alert' ? 'fa-triangle-exclamation' : 'fa-info-circle'} text-xs`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Notifications</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-[10px] text-indigo-600 mt-1 font-bold uppercase tracking-wider">{user.role}</p>
          </div>
          <div className="relative group cursor-pointer">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 hover:ring-2 hover:ring-indigo-500 transition-all" />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Account Settings</Link>
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
