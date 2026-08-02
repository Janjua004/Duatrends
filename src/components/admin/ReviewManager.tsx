import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, X, Star } from 'lucide-react';

export const ReviewManager: React.FC = () => {
  const { reviews, updateReviewStatus } = useStore();

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Customer Reviews Moderation</h2>
        <p className="text-xs text-gray-400">Approve or reject customer reviews before publishing to storefront</p>
      </div>

      <div className="bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase font-semibold border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-4 py-4">Rating</th>
              <th className="px-6 py-4">Review Comment</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reviews.map(rev => (
              <tr key={rev.id} className="hover:bg-gray-900/50">
                <td className="px-6 py-4">
                  <span className="font-semibold text-white block">{rev.userName}</span>
                  <span className="text-gray-500 text-[10px]">{rev.userCity}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-700'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 italic max-w-sm">"{rev.comment}"</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === 'Approved' ? 'bg-emerald-950 text-emerald-300' :
                    rev.status === 'Pending' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {rev.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {rev.status !== 'Approved' && (
                    <button 
                      onClick={() => updateReviewStatus(rev.id, 'Approved')}
                      className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {rev.status !== 'Rejected' && (
                    <button 
                      onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                      className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
