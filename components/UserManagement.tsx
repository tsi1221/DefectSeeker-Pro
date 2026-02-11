
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateRole, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Personnel Directory</h1>
          <p className="text-slate-500 text-sm">Manage user access levels and platform permissions.</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
          <i className="fa-solid fa-user-plus"></i>
          Provision User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
             <input 
              type="text" 
              placeholder="Filter by name, email or role..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><i className="fa-solid fa-filter"></i></button>
             <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><i className="fa-solid fa-download"></i></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-10 h-10 rounded-2xl bg-slate-200 border border-slate-100" alt={user.name} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={user.role}
                      onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                    >
                      {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button 
                        onClick={() => { if(confirm('Permanently de-provision this user?')) onDeleteUser(user.id); }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <i className="fa-solid fa-user-minus"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
