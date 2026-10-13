import React, { useState } from 'react';
import { getSupabase, getSupabaseAnonKey, setSupabaseAnonKey, resetSupabaseClient, AuthUser } from '../../lib/supabase';
import { Button } from '../common/Button';
import {
  Lock,
  Mail,
  Key,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AuthPageProps {
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [anonKeyInput, setAnonKeyInput] = useState(getSupabaseAnonKey());
  const [showKeyInput, setShowKeyInput] = useState(!getSupabaseAnonKey());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    // Save anon key if updated
    if (anonKeyInput.trim()) {
      setSupabaseAnonKey(anonKeyInput.trim());
      resetSupabaseClient();
    }

    const client = getSupabase();
    if (!client) {
      setErrorMsg('Please enter your Supabase Anon Public Key below to connect to your project.');
      setShowKeyInput(true);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data.user) {
          if (data.session) {
            onAuthenticated({ id: data.user.id, email: data.user.email || email.trim() });
          } else {
            setSuccessMsg('Account created! Please check your email for the confirmation link, or sign in.');
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data.user) {
          onAuthenticated({ id: data.user.id, email: data.user.email || email.trim() });
        }
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const msg = (err as { message?: string })?.message || String(err);
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: AuthUser = {
      id: 'demo-user-1',
      email: email.trim() || 'reader@documind.ai',
      isGuest: true,
    };
    localStorage.setItem('documind_guest_user', JSON.stringify(guestUser));
    onAuthenticated(guestUser);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-cream/70 p-4 sm:p-6 relative overflow-hidden bg-subtle-grid">
      {/* Decorative vintage notebook watermark */}
      <div className="absolute top-10 right-10 text-cherry/5 select-none pointer-events-none hidden md:block">
        <BookOpen className="w-96 h-96 -rotate-12 stroke-[0.8]" />
      </div>

      <div className="w-full max-w-md bg-paper rounded-3xl border border-cherry/20 shadow-paper p-7 sm:p-9 relative z-10 space-y-6">
        {/* Masthead */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blush-soft border border-cherry/20 text-cherry text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DocuMind Authentication</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-wine uppercase">
            DOCUMIND
          </h1>
          <p className="text-xs text-wine-muted font-serif italic">
            Your grounded AI document reading notebook
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-cream/70 rounded-2xl border border-cherry/15">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-serif font-semibold rounded-xl transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-paper text-cherry shadow-2xs border border-cherry/20 font-bold'
                : 'text-wine-muted hover:text-wine'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-serif font-semibold rounded-xl transition-all cursor-pointer ${
              isSignUp
                ? 'bg-paper text-cherry shadow-2xs border border-cherry/20 font-bold'
                : 'text-wine-muted hover:text-wine'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-800 animate-fade-in font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-800 animate-fade-in font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-wine-muted block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-wine-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-cream/50 border border-cherry/25 rounded-xl text-xs sm:text-sm text-wine placeholder:text-wine-muted/50 focus:outline-none focus:border-cherry focus:ring-2 focus:ring-cherry/15 font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-wine-muted block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-wine-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-cream/50 border border-cherry/25 rounded-xl text-xs sm:text-sm text-wine placeholder:text-wine-muted/50 focus:outline-none focus:border-cherry focus:ring-2 focus:ring-cherry/15 font-sans"
              />
            </div>
          </div>

          {/* Optional Supabase Anon Key Input */}
          {showKeyInput && (
            <div className="space-y-1 pt-1 border-t border-cherry/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-cherry flex items-center space-x-1">
                  <Key className="w-3 h-3" />
                  <span>Supabase Anon Public Key</span>
                </label>
                <span className="text-[10px] font-mono text-wine-muted">Project Connected</span>
              </div>
              <input
                type="text"
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 bg-cream/70 border border-cherry/25 rounded-xl text-xs font-mono text-wine placeholder:text-wine-muted/40 focus:outline-none focus:border-cherry focus:ring-2 focus:ring-cherry/15"
              />
              <p className="text-[10px] text-wine-muted font-sans italic">
                From your Supabase Project Settings &rarr; API &rarr; Project API keys (anon/public).
              </p>
            </div>
          )}

          {!showKeyInput && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowKeyInput(true)}
                className="text-[11px] text-wine-muted hover:text-cherry underline font-mono cursor-pointer"
              >
                Configure Supabase Key
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-2.5 mt-2"
            disabled={isLoading}
            icon={isLoading ? undefined : <ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {isLoading ? 'Authenticating...' : isSignUp ? 'Create DocuMind Account' : 'Sign In'}
          </Button>
        </form>

        {/* Guest fallback for instant evaluation */}
        <div className="pt-2 border-t border-cherry/10 space-y-3 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-2 px-3 bg-cream hover:bg-blush-soft text-wine rounded-xl text-xs font-semibold border border-cherry/20 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs hover:border-cherry/40"
          >
            <UserCheck className="w-4 h-4 text-cherry" />
            <span>Continue as Guest Reader</span>
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-wine-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-cherry" />
            <span>Connected to https://gdrfrlrcyrqvkxophyvf.supabase.co</span>
          </div>
        </div>
      </div>
    </div>
  );
};
