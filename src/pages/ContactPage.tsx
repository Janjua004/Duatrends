import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PhoneCall, Mail, MapPin, Send, MessageCircle, Instagram } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { whatsappNumber, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Thank you! Your message has been sent to StyleWing customer support.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-pink">GET IN TOUCH</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Contact StyleWing Support
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We are available 24/7 on WhatsApp & Instagram to assist with sizing, order updates, or custom suit requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6 bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="font-serif text-2xl font-bold">Boutique Head Office</h2>
          <p className="text-xs text-gray-400">Visit our flagship studio or connect via WhatsApp and Instagram for instant inquiries.</p>

          <div className="space-y-4 pt-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">WhatsApp Support</span>
                <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="font-semibold hover:text-brand-pink">
                  {whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Official Instagram</span>
                <a href="https://www.instagram.com/stylewing299?igsh=MW1oZm5pYWk4ZmViYg==" target="_blank" rel="noreferrer" className="font-semibold hover:text-brand-pink">
                  @stylewing299
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-pink/20 text-brand-pink flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Official Email</span>
                <span className="font-semibold">support@duatrends.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Boutique Address</span>
                <span className="font-semibold">Fashion Avenue, Gulberg III, Lahore</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 space-y-2">
            <a 
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Instant WhatsApp Inquiry
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Send Us a Message</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Sara Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="sara@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input 
                type="text" 
                required 
                placeholder="Inquiry regarding sizing / custom order"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                required 
                rows={4}
                placeholder="Write your query here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
              />
            </div>

            <button type="submit" className="btn-pink-gradient px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
