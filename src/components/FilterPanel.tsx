import React from 'react';
import type { FilterState } from '../types/records';
import { REGIONS, WEIGHT_CLASSES, LIFTS, AGE_CATEGORIES, EQUIPMENT_TYPES, GENDERS } from '../types/records';
import Section from './Section';
import IconButton from './IconButton';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters
}) => {
  const inputClass = "w-full p-3 border-2 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-600 dark:focus:border-red-600 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2";

  return (
    <Section title="Find Records" emoji="🔍">
      <div className="mb-6">
        <label className={labelClass}>Search by Lifter Name</label>
        <input
          type="text"
          placeholder="e.g. John Smith"
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Gender */}
        <div>
          <label className={labelClass}>Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value)}
            className={inputClass}
          >
            {GENDERS.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All' : g === 'M' ? 'Male' : 'Female'}</option>
            ))}
          </select>
        </div>

        {/* Age Category */}
        <div>
          <label className={labelClass}>Age Category</label>
          <select
            value={filters.ageCategory}
            onChange={(e) => onFilterChange('ageCategory', e.target.value)}
            className={inputClass}
          >
            {AGE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Weight Class */}
        <div>
          <label className={labelClass}>Weight Class</label>
          <select
            value={filters.weightClass}
            onChange={(e) => onFilterChange('weightClass', e.target.value)}
            className={inputClass}
          >
            {WEIGHT_CLASSES.map(wc => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>
        </div>

        {/* Lift Type */}
        <div>
          <label className={labelClass}>Lift Type</label>
          <select
            value={filters.lift}
            onChange={(e) => onFilterChange('lift', e.target.value)}
            className={inputClass}
          >
            {LIFTS.map(lift => (
              <option key={lift} value={lift}>{lift}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className={labelClass}>Region</label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
            className={inputClass}
          >
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label className={labelClass}>Equipment</label>
          <select
            value={filters.equipment}
            onChange={(e) => onFilterChange('equipment', e.target.value)}
            className={inputClass}
          >
            {EQUIPMENT_TYPES.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex gap-3">
          <IconButton onClick={onClear} variant="secondary">
            Clear All Filters
          </IconButton>
        </div>
      )}
    </Section>
  );
};

export default FilterPanel;
