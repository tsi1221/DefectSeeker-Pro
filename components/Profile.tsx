
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="flex items-end justify-between mb-8">
            <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg bg-white" alt="Avatar" />
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Change Avatar</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Role Configuration</label>
              <div className="px-4 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-500 flex items-center gap-2">
                 <i className="fa-solid fa-shield-halved"></i>
                 {user.role} (Restricted)
              </div>
              <p className="text-[10px] text-slate-400 mt-2 px-1">Roles can only be modified by a System Administrator for security compliance.</p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
               <button type="button" className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Reset</button>
               <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
