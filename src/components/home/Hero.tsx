import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  category: string;
}

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Dil-e-Raqsum",
      subtitle: "BY DUA TRENDS",
      tagline: "Unstitched Luxury Lawn '26 Vol-01",
      image: "/images/hero_slide_1.jpg",
      category: "Casual Wear"
    },
    {
      id: 2,
      title: "Mahara Festive",
      subtitle: "LUXURY VELVET",
      tagline: "Silk Chiffon & Zardozi Threadwork",
      image: "/images/hero_slide_2.jpg",
      category: "Party Wear"
    },
    {
      id: 3,
      title: "Noor-e-Bahar",
      subtitle: "SUMMER LAWN '26",
      tagline: "Pastel Embroidered 3-Piece Suit Sets",
      image: "/images/hero_slide_3.jpg",
      category: "Casual Wear"
    },
    {
      id: 4,
      title: "Sapphire Royal",
      subtitle: "FORMAL CHIFFON",
      tagline: "Intricate Gold Zari Evening Wear",
      image: "/images/hero_slide_4.jpg",
      category: "Formal"
    }
  ];

  // Auto slide transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlideData = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-gray-950 text-white min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center group">
      
      {/* Background Image Slider with Face Framing */}
      {slides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover object-[center_top] sm:object-[center_15%] transition-transform duration-10000 ease-out"
          />
          {/* Soft Gradient Overlay for clean contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-gray-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
        </div>
      ))}

      {/* Clean Floating Text Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-12 flex flex-col justify-between h-full">
        
        <div className="flex items-center justify-between">
          
          {/* Left Clean Floating Text */}
          <div className="space-y-4 max-w-lg animate-fadeIn">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300 block mb-1 drop-shadow">
                {activeSlideData.subtitle}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-none tracking-wide text-white drop-shadow-md">
                {activeSlideData.title}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 font-light tracking-widest uppercase border-l-2 border-brand-pink pl-3 py-0.5 drop-shadow">
              {activeSlideData.tagline}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(activeSlideData.category);
                  setActiveView('shop');
                }}
                className="btn-pink-gradient px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('offers')}
                className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-gray-950/60 hover:bg-gray-950 text-white backdrop-blur-md border border-white/30 shadow-lg transition-all"
              >
                Special Sale
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Pagination Dots (Arrow buttons removed) */}
        <div className="pt-16 flex items-center justify-center">
          
          {/* Slide Navigation Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide 
                    ? 'w-7 h-2.5 bg-brand-pink ring-2 ring-brand-pink/50' 
                    : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
