import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const { activeView } = useStore();

  const getTitleAndContent = () => {
    switch (activeView) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: ShieldCheck,
          content: (
            <div className="space-y-4 text-sm leading-relaxed">
              <p>At StyleWing, we prioritize protecting your personal information. When you place an order or contact us, we collect basic contact details (Name, Phone Number, WhatsApp Number, Shipping Address) strictly to fulfill your order and provide customer support.</p>
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
              <p>We want you to love your StyleWing outfit. If you receive a product with sizing issues or manufacturing defects, we offer a <strong>7-Day Hassle-Free Exchange Guarantee</strong>.</p>
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
              <p>StyleWing offers Cash on Delivery (COD) and Bank Transfer delivery across all major cities and towns in Pakistan.</p>
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
          title: 'Frequently Asked Questions (FAQ)',
          icon: HelpCircle,
          content: (
            <div className="space-y-6 text-sm leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Q: How do I place an order?</h4>
                <p>A: Simply add your desired outfits to the cart, click Proceed to Checkout, fill in your delivery address, and tap <strong>Place Order via WhatsApp</strong>. Your order will be sent to our WhatsApp store team instantly.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Q: Is Cash on Delivery available nationwide?</h4>
                <p>A: Yes! We offer Cash on Delivery across all 150+ cities and regions of Pakistan.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Q: Are all fabrics unstitched or prêt?</h4>
                <p>A: We offer both 3-piece unstitched lawn/silk suit sets and ready-to-wear prêt dresses in Small, Medium, Large, and Custom sizes.</p>
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
              <p>Welcome to StyleWing. By browsing or purchasing from our platform, you agree to comply with our store terms and conditions.</p>
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
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-brand-pink flex items-center justify-center">
          <IconComp className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
          {policyData.title}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300">
        {policyData.content}
      </div>

    </div>
  );
};
