import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, PhoneCall, Megaphone, ShieldAlert } from 'lucide-react';

export const CMSSettings: React.FC = () => {
  const { 
    whatsappNumber, 
    setWhatsappNumber, 
    announcementText, 
    setAnnouncementText 
  } = useStore();

  const [inputNumber, setInputNumber] = useState(whatsappNumber);
  const [inputText, setInputText] = useState(announcementText);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappNumber(inputNumber);
    setAnnouncementText(inputText);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Store CMS & WhatsApp Configuration</h2>
        <p className="text-xs text-gray-400">Configure instant order routing details and store announcements</p>
      </div>

      <form onSubmit={handleSave} className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-6">
        
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
          <span>Save Changes</span>
        </button>

      </form>

      {/* Info Box */}
      <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-xs text-gray-400 space-y-1">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          WhatsApp Checkout Engine Note
        </h4>
        <p>
          When a customer clicks <strong>Place Order</strong>, StyleWing automatically compiles customer name, phone, full delivery address, itemized products, subtotal, shipping fee, discount, and grand total into a cleanly formatted message routed directly to <strong>{whatsappNumber}</strong>.
        </p>
      </div>

    </div>
  );
};
