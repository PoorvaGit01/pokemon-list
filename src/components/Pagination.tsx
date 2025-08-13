"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main pagination controls */}
      <nav className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2" aria-label="Pagination">
        {/* First page */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onPageChange(1);
          }}
          disabled={!canGoPrevious}
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          aria-label="Go to first page"
        >
          <ChevronsLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            First page
          </div>
        </button>

        {/* Previous page */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
          disabled={!canGoPrevious}
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          aria-label="Go to previous page"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Previous
          </div>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <div
                  key={`dots-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-400 dark:text-gray-500"
                >
                  <MoreHorizontal size={16} />
                </div>
              );
            }

            const pageNum = page as number;
            const isCurrentPage = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
                disabled={isLoading}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isCurrentPage
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-110 ring-2 ring-blue-300 dark:ring-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105'
                } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
                {isCurrentPage && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
          disabled={!canGoNext}
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          aria-label="Go to next page"
        >
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Next
          </div>
        </button>

        {/* Last page */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onPageChange(totalPages);
          }}
          disabled={!canGoNext}
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          aria-label="Go to last page"
        >
          <ChevronsRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Last page
          </div>
        </button>
      </nav>

      {/* Enhanced page info with progress bar */}
      <div className="flex flex-col items-center gap-2">
        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
        
        {/* Page information */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Page</span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold text-base">
            {currentPage}
          </span>
          <span className="text-gray-600 dark:text-gray-400">of</span>
          <span className="text-gray-900 dark:text-gray-100 font-semibold">
            {totalPages}
          </span>
        </div>

        {/* Quick jump for large page counts */}
        {totalPages > 10 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Jump to:</span>
            <div className="flex gap-1">
              {[1, Math.ceil(totalPages * 0.25), Math.ceil(totalPages * 0.5), Math.ceil(totalPages * 0.75), totalPages]
                .filter((page, index, arr) => arr.indexOf(page) === index && page !== currentPage)
                .slice(0, 3)
                .map((page) => (
                  <button
                    key={page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {page}
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};