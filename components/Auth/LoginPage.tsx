
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Try a demo profile below!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 right-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/30 transform transition-transform hover:rotate-12">
            <i className="fa-solid fa-bolt text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">DefectSeeker Pro</h1>
          <p className="text-slate-400 font-medium">Enterprise Quality Assurance Management</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20">
          <form onSubmit={handleFormLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Demo Access</h3>
            <div className="grid grid-cols-2 gap-3">
              {users.slice(0, 4).map(user => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{user.name.split(' ')[0]}</p>
                    <p className="text-[8px] text-indigo-500 font-bold uppercase truncate">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:underline">Register now</Link>
          </p>
        </div>
        
        <p className="mt-10 text-center text-slate-500 text-xs font-medium">
          Protected by AES-256 Enterprise Grade Security
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
