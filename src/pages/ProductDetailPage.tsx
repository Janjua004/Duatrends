import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Share2, 
  Check, 
  MessageCircle, 
  ZoomIn, 
  ChevronLeft,
  ChevronRight,
  Ruler,
  Truck,
  RotateCcw,
  Mail,
  Facebook,
  Twitter
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductForModal, 
    products,
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    whatsappNumber,
    showToast,
    trackProductClick,
    setActiveView
  } = useStore();

  const product = selectedProductForModal || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('UNSTITCHED');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [product?.id]);

  // Dynamic Cursor Zoom Lens
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string }>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">No product selected</h2>
        <button 
          onClick={() => setActiveView('shop')}
          className="btn-pink-gradient px-6 py-3 rounded-xl font-bold text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const activeColor = selectedColor || (product.colors && product.colors[0]) || 'Default';
  const isWishlisted = isInWishlist(product.id);

  // Ensure minimum 3+ images per product
  const displayImages = product.images.length >= 3 ? product.images : [
    product.images[0],
    product.images[1] || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    product.images[2] || "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
  ];

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 16;

  const savingsAmount = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : Math.round(product.price * 0.2);

  // Recommended products
  const recommendedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  // Cursor Zoom Engine
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

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleAddToCart = () => {
    trackProductClick(product.id);
    addToCart(product, activeColor, selectedSize, quantity);
    showToast(`Added ${product.title} to shopping cart!`);
  };

  const handleDirectWhatsAppOrder = () => {
    trackProductClick(product.id);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const text = `Hello StyleWing! 🛍️\n\nI want to place an order directly for:\n*${product.title}*\nSKU: ${product.sku}\nColor: ${activeColor}\nSize: ${selectedSize}\nQty: ${quantity}\nPrice: Rs ${product.price.toLocaleString()}\n\nPlease process my order with 25% Advance Downpayment option.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      
      {/* Main Product Layout (Matching Uploaded Screenshot Layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Main Image & Slider Arrows & 5-Column Thumbnail Gallery */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Zoomable Image with Left/Right Arrows */}
          <div className="relative group">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 cursor-zoom-in"
            >
              <img 
                src={displayImages[selectedImageIndex] || displayImages[0]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={zoomStyle}
              />

              {/* Zoom Hint Badge */}
              <div className={`absolute bottom-3 right-3 bg-black/70 text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded flex items-center gap-1 transition-opacity z-10 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                <ZoomIn className="w-3.5 h-3.5 text-pink-500" />
                <span>Hover to Zoom</span>
              </div>
            </div>

            {/* Left & Right Image Navigation Arrows */}
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-white shadow hover:bg-white transition-all z-20"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-white shadow hover:bg-white transition-all z-20"
              aria-label="Next Image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Column Thumbnail Gallery (Matching Screenshot) */}
          <div className="grid grid-cols-5 gap-2.5">
            {displayImages.map((img, idx) => (
              <button 
                key={idx}
                onMouseEnter={() => setSelectedImageIndex(idx)}
                onClick={() => setSelectedImageIndex(idx)}
                className={`aspect-[3/4] overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx 
                    ? 'border-black dark:border-white ring-1 ring-black dark:ring-white scale-95' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Details Column (Matching Uploaded Screenshot Layout) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Top Badges: Red Sale Tag & Stock Tag */}
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
              -{discountPercent}%
            </span>
            {product.stock > 0 ? (
              <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
                In stock
              </span>
            ) : (
              <span className="bg-gray-900 text-white font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
                Out of stock
              </span>
            )}
          </div>

          {/* Product Title (SKU | 3 PC Lawn) */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-gray-900 dark:text-white tracking-wide">
              {product.sku} | 3 PC Lawn
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1 font-semibold">
              {product.title}
            </p>
          </div>

          {/* Price & Savings Line */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-gray-400 line-through font-serif">
                  Rs. {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              You Save: <span className="font-semibold text-gray-700 dark:text-gray-300">Rs. {savingsAmount.toLocaleString()} ({discountPercent}%)</span>
            </p>
          </div>

          <div className="border-t border-dashed border-gray-200 dark:border-gray-800 my-4" />

          {/* Size Selector Box & Dynamic Active / Cross-Out Options */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
              <span>SIZE: <span className="text-gray-900 dark:text-white font-bold">{selectedSize}</span></span>
              {selectedSize !== 'UNSTITCHED' && product.stitchingFee && (
                <span className="text-emerald-600 font-bold text-[11px]">+Rs {product.stitchingFee.toLocaleString()} Stitching Included</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Check UNSTITCHED */}
              {(product.sizes?.includes('UNSTITCHED') || product.sizes?.includes('Unstitched') || !product.sizes || product.sizes.length === 0) ? (
                <button
                  onClick={() => setSelectedSize('UNSTITCHED')}
                  className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedSize === 'UNSTITCHED'
                      ? 'border-black dark:border-white text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 ring-1 ring-black dark:ring-white'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black'
                  }`}
                >
                  UNSTITCHED
                </button>
              ) : (
                <div 
                  className="relative px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-400 text-xs font-bold cursor-not-allowed opacity-40 uppercase"
                  title="Unstitched variant sold out"
                >
                  <span>UNSTITCHED</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400 rotate-12" />
                  </div>
                </div>
              )}

              {/* Stitched Sizes (Small, Medium, Large, XL, Custom Tailored) */}
              {[
                { name: 'Small', label: 'S' },
                { name: 'Medium', label: 'M' },
                { name: 'Large', label: 'L' },
                { name: 'XL', label: 'XL' },
                { name: 'Custom Tailored', label: 'CUSTOM' }
              ].map(sizeObj => {
                const isAvailable = product.sizes?.some(s => s.toLowerCase() === sizeObj.name.toLowerCase() || s === sizeObj.label);
                const isSelected = selectedSize === sizeObj.name || selectedSize === sizeObj.label;

                if (isAvailable) {
                  return (
                    <button
                      key={sizeObj.name}
                      onClick={() => setSelectedSize(sizeObj.name)}
                      className={`min-w-[40px] h-9 px-3 border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-black dark:border-white text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 ring-1 ring-black dark:ring-white'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black'
                      }`}
                      title={`${sizeObj.name} Stitched Suit`}
                    >
                      {sizeObj.label}
                    </button>
                  );
                }

                // Unavailable size - Render crossed out box with X
                return (
                  <div 
                    key={sizeObj.name}
                    className="relative min-w-[40px] h-9 px-3 border border-gray-300 dark:border-gray-700 text-gray-400 flex items-center justify-center text-xs font-bold cursor-not-allowed opacity-40 uppercase"
                    title={`${sizeObj.name} size currently not available`}
                  >
                    <span>{sizeObj.label}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                      <div className="w-full h-0.5 bg-gray-400 -rotate-45" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Size Guide Link */}
            <button 
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-xs text-gray-700 dark:text-gray-300 underline font-medium flex items-center gap-1.5 pt-1.5 hover:text-brand-pink"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>

          {/* Quantity & Solid Black ADD TO CART Button Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 font-bold text-xs"
              >
                -
              </button>
              <span className="px-4 py-2 text-xs font-bold text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 font-bold text-xs"
              >
                +
              </button>
            </div>

            {/* Full-width Solid Black ADD TO CART Button / SOLD OUT */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 font-bold text-xs uppercase tracking-widest py-3.5 px-6 transition-colors shadow-md flex items-center justify-center gap-2 ${
                product.stock > 0
                  ? 'bg-black hover:bg-gray-800 text-white'
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.stock > 0 ? 'ADD TO CART' : 'SOLD OUT / OUT OF STOCK'}</span>
            </button>

            {/* Wishlist Icon */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 border transition-colors ${
                isWishlisted 
                  ? 'border-brand-pink text-brand-pink bg-rose-50 dark:bg-rose-950/40' 
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-black'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-pink' : ''}`} />
            </button>
          </div>

          {/* Direct 25% Advance Downpayment WhatsApp Order */}
          <button
            onClick={handleDirectWhatsAppOrder}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ORDER ON WHATSAPP (25% ADVANCE DOWNPAYMENT)</span>
          </button>

          {/* Itemized Fabric Specifications Breakdown (Bullet Points matching Screenshot) */}
          <div className="space-y-4 pt-4 text-xs text-gray-700 dark:text-gray-300 font-sans border-t border-gray-100 dark:border-gray-800">
            
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Shirt</h4>
              <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Embroidered Front Lawn (1 Pc)</li>
                <li>Dyed Back Lawn (0.84 Meters)</li>
                <li>Embroidered Sleeve Lawn (0.55 Meters)</li>
                <li>Embroidered Front Patch (1 Pc)</li>
                <li>Embroidered Front Daman (1 Pc)</li>
                <li>Embroidered Sleeve Lace (0.90 Meters)</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Dupatta</h4>
              <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Embroidered Monarc Dupatta (2.50 Meters)</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Trouser</h4>
              <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Dyed Cambric Trouser (2.50 Meters)</li>
              </ul>
            </div>

          </div>

          {/* Delivery & Message Links */}
          <div className="flex items-center gap-6 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setActiveView('shipping')} className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
              <Truck className="w-4 h-4 text-brand-pink" />
              <span className="underline">DELIVERY & RETURN</span>
            </button>

            <button onClick={() => setActiveView('contact')} className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
              <Mail className="w-4 h-4 text-brand-pink" />
              <span className="underline">MESSAGE</span>
            </button>
          </div>

          {/* Minimal Social Share Buttons (Facebook, X, Pinterest) */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span className="font-bold uppercase tracking-widest text-gray-500">SHARE:</span>
            <div className="flex items-center gap-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-rose-50 dark:bg-gray-800 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="Pinterest">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Size Guide Modal Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full space-y-4 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-lg">Standard Size Chart (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-gray-500 font-bold">X</button>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 font-bold uppercase">
                <tr>
                  <th className="p-2">Size</th>
                  <th className="p-2">Chest</th>
                  <th className="p-2">Waist</th>
                  <th className="p-2">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-600 dark:text-gray-300">
                <tr><td className="p-2 font-bold">Small</td><td className="p-2">36"</td><td className="p-2">32"</td><td className="p-2">42"</td></tr>
                <tr><td className="p-2 font-bold">Medium</td><td className="p-2">40"</td><td className="p-2">36"</td><td className="p-2">44"</td></tr>
                <tr><td className="p-2 font-bold">Large</td><td className="p-2">44"</td><td className="p-2">40"</td><td className="p-2">46"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommended Products Section (Matching Uploaded Screenshot) */}
      <div className="max-w-7xl mx-auto space-y-8 pt-8 border-t border-gray-100 dark:border-gray-900">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-normal text-gray-900 dark:text-white tracking-wide">
            Recommended products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map(recProduct => (
            <ProductCard key={recProduct.id} product={recProduct} />
          ))}
        </div>
      </div>

      {/* Customer Reviews & Rating Submission Section */}
      <ProductReviewsSection product={product} />

    </div>
  );
};

// Customer Reviews & Rating Submission Section Component
const ProductReviewsSection: React.FC<{ product: any }> = ({ product }) => {
  const { reviews, addReview, currentUser } = useStore();
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userCity, setUserCity] = useState(currentUser?.city || 'Lahore');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'Approved');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    addReview({
      productId: product.id,
      productTitle: product.title,
      userName: userName.trim(),
      userCity: userCity.trim() || 'Pakistan',
      rating,
      comment: comment.trim()
    });

    setSubmitted(true);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-12 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Verified buyer ratings and authentic product feedback</p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
          className="btn-pink-gradient px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md w-fit"
        >
          {showForm ? 'Cancel Review' : '★ Write A Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 animate-fadeIn">
          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">Thank You For Your Review!</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Your review has been submitted to store administration for approval and will appear here shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Share Your Experience</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore / Karachi"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Feedback Comment *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about fabric quality, embroidery details, or stitching..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-brand-pink"
                />
              </div>

              <button
                type="submit"
                className="btn-pink-gradient px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Submit Customer Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      {productReviews.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No verified customer reviews yet for this dress.</p>
          <p className="text-xs text-gray-500">Be the first customer to share your feedback by clicking "Write A Review" above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.map(rev => (
            <div key={rev.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white">{rev.userName}</h5>
                  <span className="text-[10px] text-gray-400">{rev.userCity} • Verified Purchase</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{rev.comment}"</p>
              <span className="text-[10px] text-gray-400 block text-right">{rev.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
