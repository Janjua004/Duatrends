import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Key, X, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { checkRateLimit, recordFailedAttempt, clearRateLimit, sanitizeInput } from '../../utils/security';

export const AdminLoginModal: React.FC = () => {
  const { showAdminLoginModal, setShowAdminLoginModal, loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedPass = sanitizeInput(password);

    // Rate Limit Check (5 attempts max, 15 min lock)
    const rateCheck = checkRateLimit('admin_login_attempts', 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      setLockoutRemaining(rateCheck.remainingSeconds);
      setErrorMsg(`Too many failed attempts. Security lockout active for ${Math.ceil(rateCheck.remainingSeconds / 60)} minutes.`);
      return;
    }

    if (!sanitizedPass) {
      setErrorMsg('Please enter admin password');
      return;
    }

    const success = loginAdmin(sanitizedPass);
    if (success) {
      clearRateLimit('admin_login_attempts');
      setPassword('');
      setErrorMsg('');
      setLockoutRemaining(0);
    } else {
      const attemptRecord = recordFailedAttempt('admin_login_attempts', 5, 15 * 60 * 1000);
      if (attemptRecord.locked) {
        setLockoutRemaining(attemptRecord.remainingSeconds);
        setErrorMsg('Maximum failed login attempts reached. Security lockout activated.');
      } else {
        setErrorMsg('Invalid Master Password. Access denied.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative">
        
        <button 
          onClick={() => setShowAdminLoginModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-pink/20 text-brand-pink mx-auto flex items-center justify-center border border-brand-pink/30 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">Admin Panel Access</h2>
          <p className="text-xs text-gray-400">Restricted area for Dua Trends store administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin Master Password
            </label>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-950 border border-gray-800 rounded-2xl focus:outline-none focus:border-brand-pink text-white font-mono"
              />
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full btn-pink-gradient py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl"
          >
            <span>Log In to Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
