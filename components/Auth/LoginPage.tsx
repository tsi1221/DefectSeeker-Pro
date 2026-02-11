
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
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Hint: Try a demo profile below!');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMagicLinkSent(true);
    setTimeout(() => {
      setMagicLinkSent(false);
      setShowForgot(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/40 transform transition-transform hover:rotate-6 hover:scale-105">
            <i className="fa-solid fa-bolt text-5xl text-white"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">DefectSeeker<span className="text-indigo-500">.</span></h1>
          <p className="text-slate-400 font-medium tracking-wide">Enterprise Quality Assurance Suite</p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white/20">
          <form onSubmit={handleFormLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Corporate ID / Email</label>
              <div className="relative group">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secret Key / Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-900"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
            >
              Access Command Center
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Simulator Profiles</h3>
            <div className="grid grid-cols-2 gap-3">
              {users.slice(0, 4).map(user => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group"
                >
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-200 grayscale group-hover:grayscale-0 transition-all" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{user.name.split(' ')[0]}</p>
                    <p className="text-[8px] text-indigo-500 font-bold uppercase truncate tracking-tighter">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            New to the system? <Link to="/register" className="text-indigo-600 font-black hover:underline decoration-2">Register User</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowForgot(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-key"></i>
              </div>
              <h2 className="text-xl font-black text-slate-900">Account Recovery</h2>
              <p className="text-sm text-slate-500 mt-2">Enter your email for a recovery link.</p>
            </div>
            {magicLinkSent ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center animate-in zoom-in duration-300">
                 <i className="fa-solid fa-circle-check text-4xl mb-3 block"></i>
                 <p className="font-bold">Recovery link sent!</p>
                 <p className="text-xs mt-1">Check your inbox for instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-semibold"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl"
                >
                  Send Recovery Email
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
