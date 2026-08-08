import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText, ChevronDown, Search, MessageCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'Ordering' | 'Shipping' | 'Returns' | 'Stitching';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: 'Ordering',
    question: 'How do I place an order on Dua Trends?',
    answer: 'Select your preferred unstitched or formal dress, click "Add to Cart" or "Buy Now via WhatsApp", fill in your delivery details, and submit. Your order is compiled into a clean message and sent directly to our WhatsApp store team for instant confirmation.'
  },
  {
    id: '2',
    category: 'Ordering',
    question: 'What is the 25% Advance Downpayment payment method?',
    answer: 'We offer a flexible 25% Advance Downpayment option! You only pay 25% upfront via Safepay or Bank Transfer, and the remaining 75% balance is paid on Cash on Delivery when the parcel arrives at your doorstep.'
  },
  {
    id: '3',
    category: 'Shipping',
    question: 'Is Cash on Delivery (COD) available across Pakistan?',
    answer: 'Yes! We deliver via tracked TCS and Courier partners to over 150+ cities and regions across Pakistan with Cash on Delivery.'
  },
  {
    id: '4',
    category: 'Shipping',
    question: 'How long does delivery take and what are the shipping fees?',
    answer: 'Orders in major cities (Lahore, Karachi, Islamabad, Rawalpindi) arrive within 2–3 working days. Flat delivery charge is Rs 250 across Pakistan, and shipping is FREE on all orders exceeding Rs 5,000!'
  },
  {
    id: '5',
    category: 'Returns',
    question: 'What is your 7-Day Exchange & Refund policy?',
    answer: 'If you receive a dress with size discrepancies or fabric defects, you can request a 7-day hassle-free exchange. Simply message our WhatsApp team with your order ID and parcel photos.'
  },
  {
    id: '6',
    category: 'Stitching',
    question: 'Can I get custom tailoring for unstitched lawn suits?',
    answer: 'Yes! We offer professional custom stitching for Small (S), Medium (M), Large (L), XL, and Custom Tailored dimensions. Select your desired size variant on the product page.'
  }
];

export const PolicyPage: React.FC = () => {
  const { activeView, whatsappNumber } = useStore();
  const [openFaqId, setOpenFaqId] = useState<string | null>('1');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = faqCategoryFilter === 'All' || faq.category === faqCategoryFilter;
    const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTitleAndContent = () => {
    switch (activeView) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: ShieldCheck,
          content: (
            <div className="space-y-4 text-sm leading-relaxed">
              <p>At Dua Trends, we prioritize protecting your personal information. When you place an order or contact us, we collect basic contact details (Name, Phone Number, WhatsApp Number, Shipping Address) strictly to fulfill your order and provide customer support.</p>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Data Usage</h3>
              <p>We do not share, sell, or rent your personal data to third parties. All WhatsApp checkout communication is encrypted and securely handled directly through standard WhatsApp protocols.</p>
            </div>
          )
        };
      case 'refund':
        return {
          title: 'Refund & 7-Day Exchange Policy',
          icon: RotateCcw,
          content: (
            <div className="space-y-4 text-sm leading-relaxed">
              <p>We want you to love your Dua Trends outfit. If you receive a product with sizing issues or manufacturing defects, we offer a <strong>7-Day Hassle-Free Exchange Guarantee</strong>.</p>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Exchange Conditions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Item must be unused, unwashed, and in original packaging with tags intact.</li>
                <li>Custom-tailored or altered items are not eligible for exchange unless defective.</li>
                <li>Contact our WhatsApp support team within 7 days of delivery to initiate an exchange.</li>
              </ul>
            </div>
          )
        };
      case 'shipping':
        return {
          title: 'Shipping & Nationwide Delivery',
          icon: Truck,
          content: (
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Dua Trends offers Cash on Delivery (COD) and 25% Advance Downpayment delivery across all major cities and towns in Pakistan.</p>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Delivery Timelines & Charges</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Major Cities (Lahore, Karachi, Islamabad, Rawalpindi): 2 - 3 Working Days.</li>
                <li>Other Cities & Rural Areas: 3 - 5 Working Days.</li>
                <li>Standard Shipping Fee: Flat Rs 250 across Pakistan.</li>
                <li><strong>FREE Shipping</strong> on all orders exceeding Rs 5,000!</li>
              </ul>
            </div>
          )
        };
      case 'faq':
        return {
          title: 'Frequently Asked Questions',
          icon: HelpCircle,
          content: (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                {['All', 'Ordering', 'Shipping', 'Returns', 'Stitching'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      faqCategoryFilter === cat
                        ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input 
                  type="text" 
                  placeholder="Search questions (e.g. advance, delivery, tailoring)..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink shadow-inner"
                />
              </div>

              {/* Accordion FAQ Items */}
              <div className="space-y-3">
                {filteredFaqs.map(faq => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className="bg-gray-50 dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 text-left font-serif font-semibold text-sm text-gray-900 dark:text-white flex justify-between items-center gap-4 hover:text-brand-pink transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-pink flex-shrink-0" />
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-pink' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Support CTA Card */}
              <div className="bg-gradient-to-r from-emerald-900/30 to-brand-pink/20 p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <h4 className="font-serif font-bold text-gray-900 dark:text-white text-base">Have more questions?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Our dedicated fashion concierge team is active 24/7 on WhatsApp.</p>
                </div>
                <button
                  onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              </div>

            </div>
          )
        };
      default:
        return {
          title: 'Terms & Conditions',
          icon: FileText,
          content: (
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Welcome to Dua Trends. By browsing or purchasing from our platform, you agree to comply with our store terms and conditions.</p>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Product Images & Color Variations</h3>
              <p>We make every effort to display true fabric colors. However, slight variations may occur due to photography lighting and mobile screen calibration.</p>
            </div>
          )
        };
    }
  };

  const policyData = getTitleAndContent();
  const IconComp = policyData.icon;

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-brand-pink flex items-center justify-center border border-rose-200 dark:border-rose-800/40">
          <IconComp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            {policyData.title}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Dua Trends Luxury Collection Customer Policy & Help Center</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300">
        {policyData.content}
      </div>

    </div>
  );
};
