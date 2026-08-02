import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Key, X, ShieldAlert, ArrowRight } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { showAdminLoginModal, setShowAdminLoginModal, loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter admin password');
      return;
    }

    const success = loginAdmin(password);
    if (success) {
      setPassword('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Password. Try: admin123');
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
          <p className="text-xs text-gray-400">Restricted area for StyleWing store administration</p>
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

        <div className="text-center text-[11px] text-gray-500 bg-gray-950 p-3 rounded-xl border border-gray-800">
          🔑 Default Passwords: <code className="text-brand-pink font-bold">admin123</code> or <code className="text-brand-pink font-bold">stylewing</code>
        </div>

      </div>
    </div>
  );
};
