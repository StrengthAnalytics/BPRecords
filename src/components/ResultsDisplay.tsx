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
      <Section title="Results" emoji="📊">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={records.length > 0 ? `Results (${records.length})` : 'Results'} emoji="📊">
      {records.length > 0 && (
        <div className="mb-6 flex gap-2 items-center flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onSortChange('weight')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'weight'
                  ? 'bg-red-600 text-white dark:bg-red-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Weight
            </button>
            <button
              onClick={() => onSortChange('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-red-600 text-white dark:bg-red-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => onSortChange('name')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-red-600 text-white dark:bg-red-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Name
            </button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
            Ready to find records?
          </h3>
          <p className="text-gray-500 dark:text-slate-500">
            Select your criteria above and search to view results
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record, index) => (
            <RecordCard key={`${record.name}-${record.lift}-${index}`} record={record} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default ResultsDisplay;
