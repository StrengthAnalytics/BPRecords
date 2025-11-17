import React from 'react';
import type { FilterState } from '../types/records';
import { REGIONS, WEIGHT_CLASSES, LIFTS, AGE_CATEGORIES, EQUIPMENT_TYPES, GENDERS } from '../types/records';
import Section from './Section';
import IconButton from './IconButton';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  onHelpClick?: () => void;
  hasActiveFilters: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClear,
  onHelpClick,
  hasActiveFilters
}) => {
  const inputClass = "w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <Section title="Search Records" onHelpClick={onHelpClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Lifter Name
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Region Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Region
          </label>
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

        {/* Weight Class Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Weight Class
          </label>
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

        {/* Lift Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Lift
          </label>
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

        {/* Age Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Age Category
          </label>
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

        {/* Equipment Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Equipment
          </label>
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

        {/* Gender Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value)}
            className={inputClass}
          >
            {GENDERS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <IconButton onClick={onClear} variant="secondary" disabled={!hasActiveFilters}>
          Clear Filters
        </IconButton>
      </div>
    </Section>
  );
};

export default FilterPanel;
