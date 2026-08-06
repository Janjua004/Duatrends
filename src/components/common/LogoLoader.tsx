import React from 'react';

interface LogoLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({ fullScreen = true, message }) => {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md' : 'py-16'} flex flex-col items-center justify-center p-6 transition-all duration-300`}>
      <div className="relative flex items-center justify-center">
        
        {/* Glowing Halo Ring Background */}
        <div className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-brand-pink/40 via-rose-500/30 to-amber-300/40 blur-2xl animate-pulse" />
        
        {/* Pulsing Emblem Container */}
        <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center transform animate-pulse duration-1000">
          <img
            src="/logo.png"
            alt="Dua Trends Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Brand Subtitle & Optional Loading Message */}
      <div className="mt-6 text-center space-y-1.5 z-10">
        <span className="font-serif text-lg font-bold tracking-[0.25em] text-gray-950 dark:text-white uppercase block">
          DUA <span className="text-brand-pink">TRENDS</span>
        </span>
        <span className="text-[9px] tracking-[0.35em] font-semibold text-gray-400 dark:text-gray-500 uppercase block">
          HAUTE COUTURE FASHION HOUSE
        </span>
        
        {message && (
          <p className="text-xs font-medium text-brand-pink animate-pulse pt-2 font-mono">
            {message}
          </p>
        )}
      </div>

    </div>
  );
};
