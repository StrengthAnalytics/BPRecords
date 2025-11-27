import React, { useMemo } from 'react';
import type { FilterState, UserProfile, UserLifts } from '../types/records';
import { REGIONS, WEIGHT_CLASSES, WEIGHT_CLASSES_MALE, WEIGHT_CLASSES_FEMALE, LIFTS, AGE_CATEGORIES, EQUIPMENT_TYPES, GENDERS } from '../types/records';
import { records } from '../data/records';
import IconButton from './IconButton';
import GuidePopover from './GuidePopover';
import { ComparisonInputPanel } from './ComparisonInputPanel';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  onPDFExport: () => void;
  comparisonMode?: boolean;
  onComparisonToggle?: () => void;
  // Comparison props
  userProfile?: UserProfile | null;
  userLifts?: UserLifts;
  selectedRegions?: string[];
  onProfileChange?: (profile: UserProfile) => void;
  onLiftsChange?: (lifts: UserLifts) => void;
  onRegionsChange?: (regions: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
  onPDFExport,
  comparisonMode = false,
  onComparisonToggle,
  userProfile,
  userLifts,
  selectedRegions,
  onProfileChange,
  onLiftsChange,
  onRegionsChange
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

  // Compute available regions based on uploaded records
  const availableRegions = useMemo(() => {
    // Get unique regions from the actual records data
    const regionsWithData = new Set(records.map(record => record.region));

    // Filter REGIONS to only include 'All' and regions that have data
    return REGIONS.filter(region =>
      region === 'All' || regionsWithData.has(region)
    );
  }, []);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-10 md:p-12 mb-10">
      {/* Guide Button */}
      <div className="mb-6">
        <GuidePopover />
      </div>

      {/* Mode Toggle Switch - Centered */}
      {onComparisonToggle && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-xl">
            <button
              onClick={() => !comparisonMode && onComparisonToggle()}
              className={`px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 ${
                !comparisonMode
                  ? 'bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              📊 Records
            </button>
            <button
              onClick={() => comparisonMode && onComparisonToggle()}
              className={`px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 ${
                comparisonMode
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🎯 Comparison
            </button>
          </div>
        </div>
      )}

      {/* Conditionally show either filters or comparison inputs */}
      {comparisonMode ? (
        // Comparison Mode UI
        onProfileChange && onLiftsChange && onRegionsChange && (
          <ComparisonInputPanel
            userProfile={userProfile || null}
            userLifts={userLifts || {}}
            selectedRegions={selectedRegions || []}
            onProfileChange={onProfileChange}
            onLiftsChange={onLiftsChange}
            onRegionsChange={onRegionsChange}
          />
        )
      ) : (
        // Normal Filter Mode UI
        <>
      <div className="mb-10">
        <label className={labelClass}>Search by Lifter Name</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className={inputClass}
          />
          {filters.name && (
            <button
              onClick={() => onFilterChange('name', '')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              aria-label="Clear name search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
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
            {availableRegions.map(region => (
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
              Export PDF
            </IconButton>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 italic">
            Generate formatted competition record sheets for display at events
          </p>
        </div>
      </div>
        </>
      )}
    </section>
  );
};

export default FilterPanel;
