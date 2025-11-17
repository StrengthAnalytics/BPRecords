import React from 'react';
import type { PowerliftingRecord } from '../types/records';
import RecordCard from './RecordCard';
import Section from './Section';

interface ResultsDisplayProps {
  records: PowerliftingRecord[];
  isLoading: boolean;
  sortBy: 'weight' | 'date' | 'name';
  onSortChange: (sortBy: 'weight' | 'date' | 'name') => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border-l-4 border-slate-300 animate-pulse">
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2 my-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  records,
  isLoading,
  sortBy,
  onSortChange
}) => {
  if (isLoading) {
    return (
      <Section title="Results">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={`Results (${records.length})`}>
      {/* Sort Controls */}
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort by:</span>
        <div className="flex gap-2">
          <button
            onClick={() => onSortChange('weight')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'weight'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => onSortChange('date')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'date'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            Date
          </button>
          <button
            onClick={() => onSortChange('name')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            Name
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-50">
            No records found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your filters or import some records to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record, index) => (
            <RecordCard key={`${record.name}-${record.lift}-${index}`} record={record} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default ResultsDisplay;
