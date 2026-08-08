import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Tag } from 'lucide-react';

export const CouponManager: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(3000);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      addCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase),
        expiryDate: '2026-12-31',
        usageLimit: 500,
        isActive: true,
      });
      setCode('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Coupon & Promo Code Management</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Create percentage or flat discount coupons for marketing sales</p>
      </div>

      {/* Add Coupon Form */}
      <form onSubmit={handleCreateCoupon} className="p-6 bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl shadow-sm">
        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-pink" />
          Create New Promo Code
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Coupon Code</label>
            <input 
              type="text" 
              required
              placeholder="e.g. SUMMER25"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-mono uppercase focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
            >
              <option value="percentage">Percentage (%) Off</option>
              <option value="fixed">Fixed Amount (Rs) Off</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Discount Value</label>
            <input 
              type="number" 
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Min Purchase (Rs)</label>
            <input 
              type="number" 
              required
              value={minPurchase}
              onChange={(e) => setMinPurchase(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <button type="submit" className="btn-pink-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-md">
          Add Coupon Code
        </button>
      </form>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase font-semibold border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-5 py-4">Code</th>
              <th className="px-4 py-4">Discount</th>
              <th className="px-4 py-4">Min Purchase</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-4 font-mono font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-brand-pink" />
                  {coupon.code}
                </td>
                <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Rs ${coupon.discountValue} OFF`}
                </td>
                <td className="px-4 py-4">Rs {coupon.minPurchase.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
