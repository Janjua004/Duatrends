import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MousePointerClick, TrendingUp, Eye, Flame } from 'lucide-react';

export const AnalyticsManager: React.FC = () => {
  const { products } = useStore();

  const sortedByClicks = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const mostClicked = sortedByClicks.slice(0, 10);
  const leastClicked = sortedByClicks.slice(-5).reverse();

  const maxClickCount = mostClicked[0]?.clicks || 1;

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Product Click Tracking Analytics</h2>
        <p className="text-xs text-gray-400">Real-time user engagement tracking on product view clicks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Clicked Products Heatmap */}
        <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-pink animate-bounce" />
              Most Popular Products (Click Heatmap)
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {mostClicked.map((product, idx) => (
              <div key={product.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white truncate max-w-[240px]">
                    #{idx + 1} {product.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-mono">Rs {product.price.toLocaleString()}</span>
                    <span className="font-mono font-bold text-brand-pink">{product.clicks || 0} clicks</span>
                  </div>
                </div>
                
                {/* Bar */}
                <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, ((product.clicks || 0) / maxClickCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Clicked Products */}
        <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-gray-500" />
            Least Viewed / Needs Promotion
          </h3>

          <div className="divide-y divide-gray-800">
            {leastClicked.map((product) => (
              <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="w-8 h-10 object-cover rounded bg-gray-800" />
                  <div>
                    <span className="font-semibold text-gray-200 block truncate max-w-[180px]">{product.title}</span>
                    <span className="text-gray-500">{product.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-gray-400 block">{product.clicks || 0} clicks</span>
                  <span className="text-[10px] text-rose-400">Consider Discount</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
