import React from 'react';
import type { RecordsHubProps } from '../types/records';
import { useRecordsData } from '../hooks/useRecordsData';
import { useRecordsFilter } from '../hooks/useRecordsFilter';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';
import RecordsImport from './RecordsImport';

const RecordsHub: React.FC<RecordsHubProps> = () => {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <RecordsImport onImport={handleImport} lastUpdated={lastUpdated} />

      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
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
