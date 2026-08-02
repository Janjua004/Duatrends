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
    <div className="space-y-6">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Coupon & Promo Code Management</h2>
        <p className="text-xs text-gray-400">Create percentage or flat discount coupons for marketing sales</p>
      </div>

      {/* Add Coupon Form */}
      <form onSubmit={handleCreateCoupon} className="p-6 bg-gray-950 rounded-3xl border border-gray-800 space-y-4 max-w-xl">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-pink" />
          Create New Promo Code
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Coupon Code</label>
            <input 
              type="text" 
              required
              placeholder="e.g. SUMMER25"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white"
            >
              <option value="percentage">Percentage (%) Off</option>
              <option value="fixed">Fixed Amount (Rs) Off</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Discount Value</label>
            <input 
              type="number" 
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Min Purchase (Rs)</label>
            <input 
              type="number" 
              required
              value={minPurchase}
              onChange={(e) => setMinPurchase(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white"
            />
          </div>
        </div>

        <button type="submit" className="btn-pink-gradient px-6 py-2.5 rounded-xl text-xs font-bold">
          Add Coupon Code
        </button>
      </form>

      {/* Coupons Table */}
      <div className="bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase font-semibold border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Discount</th>
              <th className="px-4 py-4">Min Spend</th>
              <th className="px-4 py-4">Times Used</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-900/50">
                <td className="px-6 py-4 font-mono font-bold text-brand-pink">{coupon.code}</td>
                <td className="px-4 py-4 uppercase text-[10px]">{coupon.discountType}</td>
                <td className="px-4 py-4 font-bold text-emerald-400">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs ${coupon.discountValue}`}
                </td>
                <td className="px-4 py-4">Rs {coupon.minPurchase.toLocaleString()}</td>
                <td className="px-4 py-4 font-mono">{coupon.timesUsed}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg bg-gray-800 text-rose-400">
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
