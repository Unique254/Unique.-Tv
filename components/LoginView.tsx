
import React, { useState } from 'react';
import { Icons } from '../constants';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Login
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover blur-sm" alt="Background" />
      </div>
      
      <div className="relative w-full max-w-md bg-zinc-900/80 backdrop-blur-3xl p-12 rounded-[48px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl shadow-red-900/40 mb-6 transform hover:rotate-6 transition-transform">U</div>
          <h1 className="text-3xl font-black tracking-tighter italic">UNIQUE<span className="text-red-600">TV</span></h1>
          <p className="text-zinc-500 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">Authorized Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all text-sm font-medium"
              placeholder="admin@uniquetv.pro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Trouble accessing account?</button>
          <div className="flex items-center gap-2 text-zinc-700">
            <div className="w-8 h-[1px] bg-zinc-800"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">or</span>
            <div className="w-8 h-[1px] bg-zinc-800"></div>
          </div>
          <button className="px-8 py-3 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Request Membership</button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
