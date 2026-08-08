import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, X, Star } from 'lucide-react';

export const ReviewManager: React.FC = () => {
  const { reviews, updateReviewStatus } = useStore();

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews Moderation</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Approve or reject customer reviews before publishing to storefront</p>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase font-semibold border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-4 py-4">Rating</th>
              <th className="px-6 py-4">Review Comment</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <Star className="w-8 h-8 text-amber-300 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-sm">No customer reviews submitted yet.</p>
                  <p className="text-xs text-gray-400 mt-1">When customers submit product reviews on the website, they will appear here for approval.</p>
                </td>
              </tr>
            ) : (
              reviews.map(rev => (
                <tr key={rev.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900 dark:text-white block">{rev.userName}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">{rev.userCity}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 italic max-w-sm">"{rev.comment}"</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rev.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                      rev.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {rev.status !== 'Approved' && (
                      <button 
                        onClick={() => updateReviewStatus(rev.id, 'Approved')}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {rev.status !== 'Rejected' && (
                      <button 
                        onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
