import React, { useMemo } from 'react';
import type { FilterState } from '../types/records';
import { REGIONS, WEIGHT_CLASSES, WEIGHT_CLASSES_MALE, WEIGHT_CLASSES_FEMALE, LIFTS, AGE_CATEGORIES, EQUIPMENT_TYPES, GENDERS } from '../types/records';
import IconButton from './IconButton';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  onPDFExport: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
  onPDFExport
}) => {
  const inputClass = "w-full px-4 py-4 text-base border-2 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 border-gray-300 dark:border-slate-600 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:focus:ring-red-600/20 dark:focus:border-red-600 transition-all shadow-sm hover:border-red-400 dark:hover:border-red-500";
  const labelClass = "block text-base font-semibold text-gray-800 dark:text-slate-200 mb-3";

  // Compute weight classes based on gender and age category
  const availableWeightClasses = useMemo(() => {
    const isYouthCategory =
      filters.ageCategory === 'Sub-Junior (U16-U18)' ||
      filters.ageCategory === 'Junior (U23)';

    if (filters.gender === 'All') {
      // Show all weight classes
      return WEIGHT_CLASSES;
    } else if (filters.gender === 'M') {
      // Male weight classes
      if (isYouthCategory || filters.ageCategory === 'All') {
        return WEIGHT_CLASSES_MALE; // Includes 53kg
      } else {
        // Exclude 53kg for senior categories (Open, M1-M6)
        return WEIGHT_CLASSES_MALE.filter(wc => wc !== '53kg');
      }
    } else if (filters.gender === 'F') {
      // Female weight classes
      if (isYouthCategory || filters.ageCategory === 'All') {
        return WEIGHT_CLASSES_FEMALE; // Includes 43kg
      } else {
        // Exclude 43kg for senior categories (Open, M1-M6)
        return WEIGHT_CLASSES_FEMALE.filter(wc => wc !== '43kg');
      }
    }

    return WEIGHT_CLASSES;
  }, [filters.gender, filters.ageCategory]);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-10 md:p-12 mb-10">
      <div className="mb-10">
        <label className={labelClass}>Search by Lifter Name</label>
        <input
          type="text"
          placeholder="e.g. John Smith"
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            {availableWeightClasses.map(wc => (
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

      <div className="pt-6 border-t-2 border-gray-100 dark:border-slate-700">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {hasActiveFilters && (
              <IconButton onClick={onClear} variant="secondary">
                Clear All Filters
              </IconButton>
            )}
            <IconButton onClick={onPDFExport} variant="primary">
              📄 Export PDF
            </IconButton>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 italic">
            Generate formatted competition record sheets for display at events
          </p>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
