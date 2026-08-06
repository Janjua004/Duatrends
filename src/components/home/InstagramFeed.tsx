import React from 'react';
import { Instagram, Heart, ArrowUpRight } from 'lucide-react';

export const InstagramFeed: React.FC = () => {
  const INSTAGRAM_URL = "https://www.instagram.com/duatrends.official";

  const instaImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-pink">
          <Instagram className="w-4 h-4" />
          <span>#DuaTrendsStyle</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Follow Us on Instagram
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Tag <span className="font-bold text-brand-pink">@duatrends.official</span> on Instagram to be featured on our official fashion wall!
        </p>

        <a 
          href={INSTAGRAM_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity"
        >
          <Instagram className="w-4 h-4" />
          <span>Follow @duatrends.official</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto px-4">
        {instaImages.map((img, idx) => (
          <a
            key={idx}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800"
          >
            <img src={img} alt="Dua Trends Instagram Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
              <Instagram className="w-6 h-6" />
              <Heart className="w-5 h-5 text-brand-pink fill-brand-pink" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
