import React from 'react';

/**
 * Product Card Loading Skeleton
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse space-y-3 p-3">
      <div className="h-64 sm:h-72 bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />
      <div className="space-y-2 pt-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

/**
 * Category Card Loading Skeleton
 */
export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="h-44 sm:h-52 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse relative overflow-hidden p-6 flex flex-col justify-end">
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16" />
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32" />
      </div>
    </div>
  );
};

/**
 * Page Section Loading Skeleton
 */
export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl w-1/3 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};
