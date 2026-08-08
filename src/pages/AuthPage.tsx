import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, Phone, MapPin, Calendar, Gift, Zap } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginCustomer, registerCustomer, resetPassword, setActiveView, showToast } = useStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
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
    if (!name || !email || !password || !phone) {
      showToast('Please complete all required registration fields');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const res = await registerCustomer({ 
      name, 
      email, 
      password, 
      phone, 
      gender,
      dob,
      city, 
      address 
    });
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
          DUA TRENDS PRIVILEGE CLUB
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-white tracking-wide">
          {mode === 'login' ? 'Customer Sign In' : mode === 'signup' ? 'Join Privilege Club' : 'Reset Password'}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Access your luxury orders, saved shipping details, and exclusive member privileges.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Editorial Branding & VIP Benefits Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/80 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-pink/20 blur-2xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="h-12 w-auto">
              <img src="/logo.png" alt="Dua Trends Logo" className="h-full w-auto object-contain" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold leading-tight">
                Luxury Fashion Privilege
              </h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Unlock VIP fashion perks with your Dua Trends personal account.
              </p>
            </div>

            {/* VIP Registration Benefits */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <Zap className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">1-Click Express Checkout</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Save your default address for instant hassle-free orders.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <Gift className="w-4 h-4 text-brand-pink flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Exclusive Secret Offers</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Enjoy member-only discount codes and early collection access.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Live Parcel Tracking</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Track your unstitched & formal suit deliveries in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 text-[11px] text-gray-400 flex items-center gap-2 relative z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Customer Protection</span>
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
              Register VIP Account
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
                    placeholder="name@example.com"
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

          {/* SIGNUP FORM WITH BASIC USER INFO (DOB, Gender, Phone, City, Address) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              
              {/* Full Name */}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input 
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth (DOB)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Default Shipping Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      placeholder="House / Street / Area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
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
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-pink-gradient py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete VIP Registration'}</span>
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
