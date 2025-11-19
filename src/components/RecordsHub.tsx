import React, { useState, useEffect } from 'react';
import type { RecordsHubProps } from '../types/records';
import { useRecordsData } from '../hooks/useRecordsData';
import { useRecordsFilter } from '../hooks/useRecordsFilter';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';
import CSVConverterModal from './CSVConverterModal';
import PDFExportModal from './PDFExportModal';
import PDFErrorBoundary from './PDFErrorBoundary';
import ErrorBoundary from './ErrorBoundary';

const RecordsHub: React.FC<RecordsHubProps> = () => {
  const { allRecords, isLoading } = useRecordsData();
  const {
    filters,
    filteredRecords,
    sortBy,
    updateFilter,
    clearFilters,
    setSortBy,
    hasActiveFilters
  } = useRecordsFilter(allRecords);

  const [showConverter, setShowConverter] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [viewMode, setViewMode] = useState<'tile' | 'table'>('tile');
  const [visibleCount, setVisibleCount] = useState(20);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Constants for load more functionality
  const ITEMS_PER_PAGE = 20;
  const MAX_RESULTS = 100;

  const totalCount = filteredRecords.length;
  const cappedResults = filteredRecords.slice(0, MAX_RESULTS);
  const displayedRecords = cappedResults.slice(0, visibleCount);
  const hasMore = visibleCount < cappedResults.length;
  const remainingCount = cappedResults.length - visibleCount;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filters]);

  // Secret trigger: typing "JSON" in the name field opens the converter
  useEffect(() => {
    if (filters.name.toUpperCase() === 'JSON') {
      setShowConverter(true);
      updateFilter('name', ''); // Clear the name field
    }
  }, [filters.name, updateFilter]);

  // Secret trigger: typing "PDF" in the name field opens the PDF export
  useEffect(() => {
    if (filters.name.toUpperCase() === 'PDF') {
      setShowPDFExport(true);
      updateFilter('name', ''); // Clear the name field
    }
  }, [filters.name, updateFilter]);

  // Show/hide "Back to Top" button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        onPDFExport={() => setShowPDFExport(true)}
      />

      <ErrorBoundary>
        <ResultsDisplay
          records={displayedRecords}
          totalCount={totalCount}
          isLoading={isLoading}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasActiveFilters={hasActiveFilters}
        />
      </ErrorBoundary>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, cappedResults.length))}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Load {Math.min(ITEMS_PER_PAGE, remainingCount)} More
            <span className="ml-2 text-red-100">
              ({remainingCount} remaining)
            </span>
          </button>
          {cappedResults.length >= MAX_RESULTS && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Results limited to top {MAX_RESULTS} records for performance
            </p>
          )}
        </div>
      )}

      <ErrorBoundary>
        <CSVConverterModal
          isOpen={showConverter}
          onClose={() => setShowConverter(false)}
        />
      </ErrorBoundary>

      <PDFErrorBoundary onClose={() => setShowPDFExport(false)}>
        <PDFExportModal
          isOpen={showPDFExport}
          onClose={() => setShowPDFExport(false)}
          allRecords={allRecords}
        />
      </PDFErrorBoundary>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-xl transition-all transform hover:scale-110 z-40"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecordsHub;
