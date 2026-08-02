import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { whatsappNumber } = useStore();
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello StyleWing Team! I have an inquiry regarding your luxury fashion collection.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-8 right-6 z-40 group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 animate-bounce" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-semibold pr-2">
        Chat with Us
      </span>
    </a>
  );
};
