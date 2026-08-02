import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <div className="py-24 max-w-md mx-auto text-center space-y-4 px-4">
      <h1 className="font-serif text-8xl font-bold text-brand-pink">404</h1>
      <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-sm text-gray-500">The fashion page or outfit collection you are looking for does not exist.</p>
      <button onClick={() => setActiveView('home')} className="btn-pink-gradient py-3 px-6 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Return to Homepage
      </button>
    </div>
  );
};
