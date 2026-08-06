import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Send, 
  ShieldCheck, 
  Truck, 
  RotateCcw 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, whatsappNumber, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to StyleWing Newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-24 lg:pb-12 border-t border-gray-900">
      {/* Upper Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-brand-pink mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-semibold text-lg">100% Premium Quality</h4>
            <p className="text-sm text-gray-400">Handcrafted luxury fabrics with exquisite detail and durability.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-brand-pink mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-semibold text-lg">Nationwide Fast Delivery</h4>
            <p className="text-sm text-gray-400">Cash on Delivery across Pakistan. Dispatch within 24-48 hours.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-brand-pink mb-2">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-white font-semibold text-lg">Easy 7-Day Exchange</h4>
            <p className="text-sm text-gray-400">Hassle-free size or product exchange policy for complete peace of mind.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-20 sm:h-24 w-auto flex items-center justify-start py-1">
              <img 
                src="/logo.png" 
                alt="Dua Trends Logo" 
                className="h-full w-auto max-w-[280px] sm:max-w-[340px] object-contain"
                onError={(e) => {
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="font-serif text-3xl font-bold tracking-wider text-white uppercase">Dua <span class="text-brand-pink">Trends</span></span>`;
                  }
                }}
              />
            </div>

            <p className="text-sm text-gray-400 max-w-sm">
              Dua Trends defines luxury women’s apparel with unstitched lawn, silk chiffon formal wear, prêt collection, and haute couture fashion designed to empower your inner radiance.
            </p>

            {/* Contact Details */}
            <div className="space-y-2 text-sm text-gray-400 pt-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-pink" />
                <span>WhatsApp: {whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-pink" />
                <span>support@duatrends.store</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-pink" />
                <span>Gulberg III, Fashion Avenue, Lahore, Pakistan</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/stylewing299?igsh=MW1oZm5pYWk4ZmViYg==" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveView('shop')} className="hover:text-brand-pink transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('offers')} className="hover:text-brand-pink transition-colors">
                  Flash Sales & Offers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('track')} className="hover:text-brand-pink transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('wishlist')} className="hover:text-brand-pink transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('cart')} className="hover:text-brand-pink transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-brand-pink transition-colors text-emerald-400 font-medium">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveView('privacy')} className="hover:text-brand-pink transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('refund')} className="hover:text-brand-pink transition-colors">
                  Refund & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('shipping')} className="hover:text-brand-pink transition-colors">
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faq')} className="hover:text-brand-pink transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('terms')} className="hover:text-brand-pink transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Join StyleWing Circle</h4>
            <p className="text-xs text-gray-400">
              Subscribe to get exclusive early access to upcoming luxury lawn & festive collections.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-brand-pink text-white placeholder-gray-500"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-pink hover:bg-brand-pink-hover text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 StyleWing Fashion Store. All rights reserved. Designed with Elegance.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Bank Transfer</span>
            <span>•</span>
            <span>Instant WhatsApp Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
