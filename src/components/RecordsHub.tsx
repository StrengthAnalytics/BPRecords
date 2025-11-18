import React, { useState, useEffect } from 'react';
import type { RecordsHubProps } from '../types/records';
import { useRecordsData } from '../hooks/useRecordsData';
import { useRecordsFilter } from '../hooks/useRecordsFilter';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';
import CSVConverterModal from './CSVConverterModal';
import PDFExportModal from './PDFExportModal';

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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        onPDFExport={() => setShowPDFExport(true)}
      />

      <ResultsDisplay
        records={filteredRecords}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <CSVConverterModal
        isOpen={showConverter}
        onClose={() => setShowConverter(false)}
      />

      <PDFExportModal
        isOpen={showPDFExport}
        onClose={() => setShowPDFExport(false)}
        allRecords={allRecords}
      />
    </div>
  );
};

export default RecordsHub;
