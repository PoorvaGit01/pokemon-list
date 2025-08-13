"use client";

import React from 'react';

export const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
      <div className="relative">
        {/* Favorite button skeleton */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        
        {/* Image skeleton */}
        <div className="mb-4 flex justify-center">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>

        {/* Pokemon info skeleton */}
        <div className="text-center">
          {/* ID */}
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
          
          {/* Name */}
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-3"></div>
          
          {/* Types */}
          <div className="flex justify-center gap-2 mb-3">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-1"></div>
              <div className="w-8 h-3 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-1"></div>
              <div className="w-8 h-3 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input skeleton */}
        <div className="flex-1">
          <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        
        {/* Mobile filter button skeleton */}
        <div className="lg:hidden w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      
      {/* Filter options skeleton */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="flex-1">
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="flex items-end">
          <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="flex justify-center gap-2">
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div>
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="w-12 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-16 h-5 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};