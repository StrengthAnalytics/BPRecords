import { useState, useMemo } from 'react';
import type { PowerliftingRecord, FilterState } from '../types/records';
import { filterRecords, sortRecords } from '../utils/recordsFilters';

const initialFilterState: FilterState = {
  name: '',
  region: 'All',
  weightClass: 'All',
  lift: 'All',
  ageCategory: 'All',
  equipment: 'All',
  gender: 'All'
};

export const useRecordsFilter = (records: PowerliftingRecord[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortBy, setSortBy] = useState<'weight' | 'date' | 'name'>('weight');

  const filteredRecords = useMemo(() => {
    // If no filters are active, return empty array instead of all records
    const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
      if (key === 'name') return value !== '';
      return value !== 'All';
    });

    if (!hasAnyFilter) {
      return [];
    }

    const filtered = filterRecords(records, filters);
    return sortRecords(filtered, sortBy);
  }, [records, filters, sortBy]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'name') return value !== '';
      return value !== 'All';
    });
  }, [filters]);

  return {
    filters,
    filteredRecords,
    sortBy,
    updateFilter,
    updateFilters,
    clearFilters,
    setSortBy,
    hasActiveFilters
  };
};
