import React from 'react';
import type { PowerliftingRecord } from '../types/records';
import RecordCard from './RecordCard';
import Section from './Section';
import { formatDate, formatLiftName, formatEquipment, formatGender } from '../utils/recordsFormatters';

type ViewMode = 'tile' | 'table';

interface ResultsDisplayProps {
  records: PowerliftingRecord[];
  totalCount: number;
  isLoading: boolean;
  sortBy: 'weight' | 'date' | 'name';
  onSortChange: (sortBy: 'weight' | 'date' | 'name') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  hasActiveFilters: boolean;
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
  totalCount,
  isLoading,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  hasActiveFilters
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

  const getTitle = () => {
    if (totalCount === 0) return 'Results';
    if (totalCount > records.length) {
      return `Results (${totalCount}) - Top ${records.length} shown`;
    }
    return `Results (${totalCount})`;
  };

  return (
    <Section title={getTitle()} emoji="📊">
      {records.length > 0 && (
        <div className="mb-10 flex flex-col lg:flex-row gap-6 lg:gap-4 lg:items-center lg:justify-between">
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">Sort by:</span>
            <div className="flex gap-3">
              <button
                onClick={() => onSortChange('weight')}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  sortBy === 'weight'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Weight
              </button>
              <button
                onClick={() => onSortChange('date')}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  sortBy === 'date'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => onSortChange('name')}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  sortBy === 'name'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Name
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-lg font-bold text-gray-900 dark:text-slate-100">View:</span>
            <div className="flex gap-3">
              <button
                onClick={() => onViewModeChange('tile')}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  viewMode === 'tile'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Tiles
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  viewMode === 'table'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        !hasActiveFilters ? (
          // No filters applied - Show onboarding
          <div className="text-center py-8 px-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to British Powerlifting Records
            </h3>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Search through thousands of powerlifting records from across the UK
            </p>

            {/* Quick Start Guide */}
            <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-8 text-left">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Quick Start Guide
              </h4>
              <div className="space-y-3 text-gray-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Select a Region</strong>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Choose British, England, Scotland, Wales, or a specific region
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Pick a Weight Class</strong>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Filter by competition weight category (e.g., 83kg, 93kg)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Choose a Lift</strong>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Squat, Bench Press, Deadlift, or Total
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Optional: Search by Name</strong>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Find a specific lifter's records
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Searches Hint */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                💡 Popular searches include:
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium">
                  British • Men • 83kg • Squat
                </span>
                <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium">
                  Scotland • Women • Total
                </span>
                <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium">
                  England • Open • Deadlift
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Filters applied but no matches
          <div className="text-center py-24 px-6">
            <div className="text-8xl mb-8">🔍</div>
            <h3 className="text-3xl font-bold text-gray-700 dark:text-slate-300 mb-4">
              No Records Found
            </h3>
            <p className="text-xl text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              No records match your current filters
            </p>
            <div className="text-sm text-gray-600 dark:text-slate-400 space-y-2">
              <p className="font-semibold">Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Selecting a different weight class</li>
                <li>Choosing a different region</li>
                <li>Checking your lifter name spelling</li>
                <li>Clearing all filters and starting over</li>
              </ul>
            </div>
          </div>
        )
      ) : viewMode === 'tile' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {records.map((record, index) => (
            <RecordCard key={`${record.name}-${record.lift}-${index}`} record={record} />
          ))}
        </div>
      ) : (
        <div className="-mx-4 md:mx-0 overflow-x-auto rounded-none md:rounded-xl border-y-2 md:border-2 border-gray-200 dark:border-slate-700 shadow-lg">
          <table className="w-full">
            <thead className="bg-red-600 dark:bg-red-700 text-white">
              <tr>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Name</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Weight</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Lift</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Class</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Equip</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Gender</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Age</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Region</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left font-bold text-xs md:text-sm whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {records.map((record, index) => (
                <tr
                  key={`${record.name}-${record.lift}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-2 md:px-3 py-2 md:py-3 font-semibold text-gray-900 dark:text-slate-100 text-xs md:text-sm whitespace-nowrap">
                    {record.name}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 font-bold text-red-600 dark:text-red-500 text-xs md:text-sm whitespace-nowrap">
                    {record.record}kg
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-700 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                    {formatLiftName(record.lift)}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-700 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                    {record.weightClass}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-700 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                    {formatEquipment(record.equipment)}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-700 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                    {formatGender(record.gender)}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-700 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                    {record.ageCategory}
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 whitespace-nowrap">
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-bold">
                      {record.region}
                    </span>
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-gray-600 dark:text-slate-400 text-xs md:text-sm whitespace-nowrap">
                    {formatDate(record.dateSet)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
};

export default ResultsDisplay;
