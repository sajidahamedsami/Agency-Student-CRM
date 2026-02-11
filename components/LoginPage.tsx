
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Globe, Mail, Lock, Loader2, AlertCircle, ArrowLeft, UserPlus, LogIn, KeyRound, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setMessage("Registration successful! Please check your email for confirmation link.");
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("Password reset link sent to your email.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -ml-48 -mb-48 animate-pulse"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-fade-up relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-5 rounded-[2rem] shadow-2xl shadow-blue-500/40 mb-6 group hover:rotate-12 transition-transform">
            <Globe size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Agency' : 'Recover Access'}
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 opacity-60">
            Cholo Abroad Terminal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-xs font-semibold leading-relaxed">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-xs font-semibold leading-relaxed">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 outline-none text-white text-sm transition-all placeholder:text-slate-600"
                placeholder="agency@choloabroad.com"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 outline-none text-white text-sm transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setMode('forgot')}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : mode === 'login' ? (
              <><LogIn size={18} /> Access Dashboard</>
            ) : mode === 'signup' ? (
              <><UserPlus size={18} /> Register Agency</>
            ) : (
              <><KeyRound size={18} /> Reset Password</>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4 items-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-400">
              New agency? {' '}
              <button onClick={() => setMode('signup')} className="text-blue-400 font-bold hover:underline">Create Account</button>
            </p>
          ) : (
            <button 
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to login
            </button>
          )}
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">Cloud Security Integrated</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
