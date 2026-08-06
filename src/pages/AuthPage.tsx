import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, Key } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginCustomer, registerCustomer, resetPassword, setActiveView, showToast } = useStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    const res = await loginCustomer(email, password);
    setIsLoading(false);
    showToast(res.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please complete all required fields');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const res = await registerCustomer({ name, email, password, phone, city });
    setIsLoading(false);
    showToast(res.message);
    if (res.success) {
      setActiveView('account');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your account email');
      return;
    }
    setIsLoading(true);
    const res = await resetPassword(email);
    setIsLoading(false);
    showToast(res.message);
    setMode('login');
  };

  return (
    <div className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      <div className="text-center space-y-2 max-w-md mx-auto">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-brand-pink block">
          DUA TRENDS OFFICIAL ACCOUNT
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-white tracking-wide">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create New Account' : 'Reset Account Password'}
        </h1>
        <p className="text-xs text-gray-500">
          Access your luxury orders, saved shipping details, and exclusive member privileges.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Editorial Branding Banner */}
        <div className="md:col-span-5 bg-gray-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-pink/20 blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="h-12 w-auto">
              <img src="/logo.png" alt="Dua Trends Logo" className="h-full w-auto object-contain" />
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight">
              Elegance In Every Style
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Sign in with your customer account or official admin credentials (<code className="text-amber-300 font-mono">admin@duatrends.com</code>) to manage store features.
            </p>
          </div>

          <div className="pt-8 border-t border-gray-800 text-[11px] text-gray-400 space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted Account Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Dua Trends Haute Couture House</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 pb-3 text-xs font-bold uppercase tracking-wider gap-6">
            <button 
              onClick={() => setMode('login')}
              className={`pb-2 transition-colors ${mode === 'login' ? 'text-brand-pink border-b-2 border-brand-pink font-extrabold' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`pb-2 transition-colors ${mode === 'signup' ? 'text-brand-pink border-b-2 border-brand-pink font-extrabold' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
            >
              Register Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com or admin@duatrends.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')} 
                    className="text-xs text-brand-pink hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-pink-gradient py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sara Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="email"
                    required
                    placeholder="sara@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-pink-gradient py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* FORGOT FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Registered Account Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Sending Request...' : 'Send Password Reset Link'}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
