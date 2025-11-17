import React from 'react';
import type { RecordsHubProps } from '../types/records';
import { useRecordsData } from '../hooks/useRecordsData';
import { useRecordsFilter } from '../hooks/useRecordsFilter';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';

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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
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
