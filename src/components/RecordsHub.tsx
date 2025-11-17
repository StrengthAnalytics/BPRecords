import React from 'react';
import type { RecordsHubProps } from '../types/records';
import { useRecordsData } from '../hooks/useRecordsData';
import { useRecordsFilter } from '../hooks/useRecordsFilter';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';
import RecordsImport from './RecordsImport';

const RecordsHub: React.FC<RecordsHubProps> = ({ onHelpClick }) => {
  const { allRecords, isLoading, lastUpdated, importRecords } = useRecordsData();
  const {
    filters,
    filteredRecords,
    sortBy,
    updateFilter,
    clearFilters,
    setSortBy,
    hasActiveFilters
  } = useRecordsFilter(allRecords);

  const handleImport = (records: any[]) => {
    importRecords(records);
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          British Powerlifting Records Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Search and explore powerlifting records across the UK
        </p>
      </header>

      <RecordsImport onImport={handleImport} lastUpdated={lastUpdated} />

      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        onHelpClick={onHelpClick}
        hasActiveFilters={hasActiveFilters}
      />

      <ResultsDisplay
        records={filteredRecords}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
};

export default RecordsHub;
