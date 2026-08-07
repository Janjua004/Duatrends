import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, PhoneCall, Megaphone, ShieldAlert, Lock, Key, CheckCircle2 } from 'lucide-react';

export const CMSSettings: React.FC = () => {
  const { 
    whatsappNumber, 
    setWhatsappNumber, 
    announcementText, 
    setAnnouncementText,
    changeAdminPassword,
    showToast
  } = useStore();

  const [inputNumber, setInputNumber] = useState(whatsappNumber);
  const [inputText, setInputText] = useState(announcementText);

  // Admin Password Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappNumber(inputNumber);
    setAnnouncementText(inputText);
    showToast('CMS Settings updated!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Please enter a new admin password');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    const success = changeAdminPassword(newPassword);
    if (success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Store CMS & Security Settings</h2>
        <p className="text-xs text-gray-400">Configure instant order routing details, store announcements, and master admin security</p>
      </div>

      {/* SECTION 1: ADMIN MASTER PASSWORD CHANGE */}
      <form onSubmit={handleChangePassword} className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-pink" />
            Change Admin Master Password
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Update your master admin password used to log into this Store Administration Dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              New Master Password *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-brand-pink focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-brand-pink focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-brand-pink hover:bg-brand-pink-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-pink/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Update Admin Password</span>
        </button>
      </form>

      {/* SECTION 2: CMS & WHATSAPP CONFIG */}
      <form onSubmit={handleSaveCMS} className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-6">
        
        {/* WhatsApp Phone Config */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Store WhatsApp Checkout Number
          </label>
          <p className="text-[11px] text-gray-500">
            This is the phone number where all customer checkout orders will automatically be sent via WhatsApp message.
          </p>
          <input 
            type="text"
            required
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="+923001234567"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-brand-pink focus:outline-none"
          />
        </div>

        {/* Announcement Ticker Text */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-brand-pink" />
            Homepage Top Announcement Bar Text
          </label>
          <input 
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:border-brand-pink focus:outline-none"
          />
        </div>

        {/* Save button */}
        <button type="submit" className="btn-pink-gradient px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
          <Save className="w-4 h-4" />
          <span>Save CMS Settings</span>
        </button>

      </form>

      {/* SECTION 3: CLOUDINARY CDN IMAGE HOSTING CONFIG */}
      <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Save className="w-5 h-5 text-blue-400" />
            Cloudinary Image CDN Hosting Settings
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Configure your Cloudinary Cloud Name and Unsigned Upload Preset for fast product image CDN hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              Cloudinary Cloud Name
            </label>
            <input 
              type="text"
              placeholder="e.g. dwdnfn1ab"
              defaultValue={localStorage.getItem('stylewing_cloudinary_cloud_name') || 'dwdnfn1ab'}
              onChange={(e) => localStorage.setItem('stylewing_cloudinary_cloud_name', e.target.value.trim())}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-brand-pink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              Unsigned Upload Preset
            </label>
            <input 
              type="text"
              placeholder="e.g. stylewing_preset"
              defaultValue={localStorage.getItem('stylewing_cloudinary_preset') || 'ml_default'}
              onChange={(e) => localStorage.setItem('stylewing_cloudinary_preset', e.target.value.trim())}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-brand-pink focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 text-[11px] text-gray-400 space-y-1">
          <p className="text-emerald-400 font-semibold">✨ Multi-Tier Backup System Active:</p>
          <p>If Cloudinary is not configured or offline, images automatically upload to <strong>Supabase Storage</strong> or convert to <strong>Base64 Data URLs</strong> so product creation never fails!</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-xs text-gray-400 space-y-1">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          WhatsApp Checkout Engine Note
        </h4>
        <p>
          When a customer clicks <strong>Place Order</strong>, Dua Trends automatically compiles customer name, phone, full delivery address, itemized products, subtotal, shipping fee, discount, and grand total into a cleanly formatted message routed directly to <strong>{whatsappNumber}</strong>.
        </p>
      </div>

    </div>
  );
};
