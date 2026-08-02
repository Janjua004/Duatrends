import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, addReview } = useStore();
  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && comment) {
      addReview({
        productId: 'general',
        productTitle: 'StyleWing Fashion',
        userName,
        userCity: userCity || 'Pakistan',
        rating,
        comment,
      });
      setUserName('');
      setUserCity('');
      setComment('');
      setShowReviewForm(false);
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-pink block mb-1">
              LOVED BY THOUSANDS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              What Our Customers Say
            </h2>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-rose-50 dark:bg-rose-950/40 text-brand-pink px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-brand-pink hover:text-white transition-all self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Submit Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Share Your StyleWing Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sara Ahmed"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input 
                  type="text"
                  placeholder="e.g. Lahore / Karachi"
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1 text-amber-400"
                  >
                    <Star className={`w-6 h-6 ${num <= rating ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
              <textarea 
                required
                rows={3}
                placeholder="Tell us about the fabric, fitting, embroidery and delivery..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white"
              />
            </div>

            <button type="submit" className="btn-pink-gradient px-6 py-2.5 rounded-xl font-semibold text-sm">
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div 
              key={rev.id}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-brand-pink-light dark:bg-rose-950/60 text-brand-pink font-bold flex items-center justify-center text-sm">
                  {rev.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>{rev.userName}</span>
                    <span title="Verified Buyer">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400">{rev.userCity}, Pakistan</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
