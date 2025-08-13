"use client";

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Oops! Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  showHomeButton = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="relative mb-6">
        <AlertCircle size={64} className="text-red-500 animate-pulse" />
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {message}
      </p>

      <div className="flex gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
        
        {showHomeButton && (
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
          >
            <Home size={16} />
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  action?: React.ReactNode;
}> = ({
  title = 'No results found',
  message = 'Try adjusting your search criteria or filters.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="text-8xl mb-6">🔍</div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};