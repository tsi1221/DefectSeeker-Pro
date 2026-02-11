
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../../types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.QA,
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please accept the compliance terms");
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: `https://picsum.photos/seed/${formData.name.split(' ')[0]}/100`
    };
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-[2rem] mb-6 shadow-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
            <i className="fa-solid fa-bolt text-3xl text-indigo-500 group-hover:scale-110 transition-transform"></i>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Create New Account</h1>
          <p className="text-slate-400 font-medium tracking-wide">Enter your details to join the workspace</p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Identity</label>
              <input 
                type="text" 
                required
                placeholder="E.g. Alan Turing"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Work Domain Email</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Primary System Role</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Min. 8 char"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-xs font-semibold"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Repeat</label>
                <input 
                  type="password" 
                  required
                  placeholder="Confirm"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-xs font-semibold"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>

            <div className="py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 transition-all cursor-pointer"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">I accept the SOC2 compliance terms</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 mt-2 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
            >
              Initialize Profile
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium tracking-wide">
            Already registered? <Link to="/login" className="text-indigo-600 font-black hover:underline decoration-2">Sign into portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
