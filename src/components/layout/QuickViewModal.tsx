import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, Share2, Check, MessageCircle, ZoomIn } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    whatsappNumber,
    showToast,
    trackProductClick
  } = useStore();

  const product = selectedProductForModal;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Dynamic Hover Zoom Lens State
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string }>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) return null;

  const activeColor = selectedColor || product.colors[0] || 'Default';
  const activeSize = selectedSize || product.sizes[0] || 'Unstitched';
  const isWishlisted = isInWishlist(product.id);

  // Dynamic Cursor Zoom Engine
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
    setIsZoomed(false);
  };

  const handleAddToCart = () => {
    trackProductClick(product.id);
    addToCart(product, activeColor, activeSize, quantity);
    setSelectedProductForModal(null);
  };

  const handleDirectWhatsAppOrder = () => {
    trackProductClick(product.id);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const text = `Hello StyleWing! 🛍️\n\nI want to place an order directly for:\n*${product.title}*\nSKU: ${product.sku}\nColor: ${activeColor}\nSize: ${activeSize}\nQty: ${quantity}\nPrice: Rs ${product.price.toLocaleString()}\n\nPlease process my order.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Product link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Ensure minimum 3 images per product
  const displayImages = product.images.length >= 3 ? product.images : [
    product.images[0],
    product.images[1] || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    product.images[2] || "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800 relative">
        
        {/* Close Button */}
        <button 
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
          
          {/* Left Column: Interactive Zoom Gallery (StyleWing exact layout) */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Main Image with Cursor Hover Zoom Lens */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in border border-gray-200 dark:border-gray-800 group shadow-inner"
            >
              <img 
                src={displayImages[selectedImageIndex] || displayImages[0]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={zoomStyle}
              />

              {/* Red Sale Tag */}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-widest shadow z-10">
                  -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              )}

              {/* Zoom Hint Badge */}
              <div className={`absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-opacity z-10 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                <ZoomIn className="w-3 h-3" />
                <span>Hover to Zoom</span>
              </div>
            </div>

            {/* Thumbnail Image Selector Grid (Minimum 3 images) */}
            <div className="grid grid-cols-5 gap-2.5">
              {displayImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx 
                      ? 'border-brand-pink ring-2 ring-brand-pink/30 scale-95' 
                      : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Product Info & Order Options */}
          <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-pink bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-gray-400">SKU: {product.sku}</span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-wide text-gray-900 dark:text-white mt-2">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Pricing in PKR */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl md:text-3xl font-bold font-mono text-brand-pink">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-base font-mono text-gray-400 line-through">
                    PKR {product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications List */}
              {product.specifications && (
                <div className="mt-4 p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs space-y-1.5 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-200/50 dark:border-gray-700/50 pb-1 last:border-0 last:pb-0">
                      <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">{key}:</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Color: <span className="text-brand-pink font-bold">{activeColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          activeColor === color 
                            ? 'border-brand-pink bg-rose-50 text-brand-pink dark:bg-rose-950/40' 
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-pink'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Size: <span className="text-brand-pink font-bold">{activeSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          activeSize === size 
                            ? 'border-brand-pink bg-rose-50 text-brand-pink dark:bg-rose-950/40' 
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-pink'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold dark:text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-pink-gradient py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-center ${
                    isWishlisted 
                      ? 'border-brand-pink bg-rose-50 text-brand-pink dark:bg-rose-950/40' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-pink'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-brand-pink text-brand-pink' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-pink transition-colors flex items-center justify-center"
                  aria-label="Share"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={handleDirectWhatsAppOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Buy Now via WhatsApp (25% Advance Available)
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
