import { useState, useEffect } from 'react';
import type { UserProfile, UserLifts } from '../types/records';
import {
  WEIGHT_CLASSES_MALE,
  WEIGHT_CLASSES_FEMALE,
  AGE_CATEGORIES,
  REGIONS
} from '../types/records';

interface ComparisonInputPanelProps {
  userProfile: UserProfile | null;
  userLifts: UserLifts;
  selectedRegions: string[];
  onProfileChange: (profile: UserProfile) => void;
  onLiftsChange: (lifts: UserLifts) => void;
  onRegionsChange: (regions: string[]) => void;
}

export function ComparisonInputPanel({
  userProfile,
  userLifts,
  selectedRegions,
  onProfileChange,
  onLiftsChange,
  onRegionsChange
}: ComparisonInputPanelProps) {
  // Local state for form inputs
  const [gender, setGender] = useState<'M' | 'F'>(userProfile?.gender || 'M');
  const [weightClass, setWeightClass] = useState(userProfile?.weightClass || '');
  const [ageCategory, setAgeCategory] = useState(userProfile?.ageCategory || 'Open');
  const [equipment, setEquipment] = useState<'equipped' | 'unequipped'>(
    userProfile?.equipment || 'unequipped'
  );

  // Update parent when profile changes
  useEffect(() => {
    if (weightClass) {
      onProfileChange({
        gender,
        weightClass,
        ageCategory,
        equipment
      });
    }
  }, [gender, weightClass, ageCategory, equipment, onProfileChange]);

  const weightClasses = gender === 'M' ? WEIGHT_CLASSES_MALE : WEIGHT_CLASSES_FEMALE;
  const availableRegions = REGIONS.filter(r => r !== 'All');

  const handleLiftChange = (lift: keyof UserLifts, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onLiftsChange({
      ...userLifts,
      [lift]: numValue
    });
  };

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionsChange(selectedRegions.filter(r => r !== region));
    } else {
      onRegionsChange([...selectedRegions, region]);
    }
  };

  const selectAllRegions = () => {
    onRegionsChange([]);
  };

  const hasAnyLift = Object.values(userLifts).some(v => v !== undefined && v > 0);

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b-2 border-blue-500 dark:border-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          🎯 Compare Your Lifts
        </h2>

        {/* Profile Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('M')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  gender === 'M'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('F')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  gender === 'F'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Weight Class */}
          <div>
            <label htmlFor="weight-class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight Class
            </label>
            <select
              id="weight-class"
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              {weightClasses.filter(wc => wc !== 'All').map((wc) => (
                <option key={wc} value={wc}>{wc}</option>
              ))}
            </select>
          </div>

          {/* Age Category */}
          <div>
            <label htmlFor="age-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age Category
            </label>
            <select
              id="age-category"
              value={ageCategory}
              onChange={(e) => setAgeCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {AGE_CATEGORIES.filter(ac => ac !== 'All').map((ac) => (
                <option key={ac} value={ac}>{ac}</option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Equipment
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setEquipment('unequipped')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  equipment === 'unequipped'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Raw
              </button>
              <button
                onClick={() => setEquipment('equipped')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  equipment === 'equipped'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Equipped
              </button>
            </div>
          </div>
        </div>

        {/* Lifts Section */}
        {weightClass && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              <div>
                <label htmlFor="squat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Squat (kg)
                </label>
                <input
                  id="squat"
                  type="number"
                  step="0.5"
                  min="0"
                  value={userLifts.squat || ''}
                  onChange={(e) => handleLiftChange('squat', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bench" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bench (kg)
                </label>
                <input
                  id="bench"
                  type="number"
                  step="0.5"
                  min="0"
                  value={userLifts.bench_press || ''}
                  onChange={(e) => handleLiftChange('bench_press', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bench-ac" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bench A/C (kg)
                </label>
                <input
                  id="bench-ac"
                  type="number"
                  step="0.5"
                  min="0"
                  value={userLifts.bench_press_ac || ''}
                  onChange={(e) => handleLiftChange('bench_press_ac', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="deadlift" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadlift (kg)
                </label>
                <input
                  id="deadlift"
                  type="number"
                  step="0.5"
                  min="0"
                  value={userLifts.deadlift || ''}
                  onChange={(e) => handleLiftChange('deadlift', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="total" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total (kg)
                </label>
                <input
                  id="total"
                  type="number"
                  step="0.5"
                  min="0"
                  value={userLifts.total || ''}
                  onChange={(e) => handleLiftChange('total', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Region Selection */}
            {hasAnyLift && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compare Against Regions
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={selectAllRegions}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedRegions.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Regions
                  </button>
                  {availableRegions.map((region) => (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedRegions.length > 0 && selectedRegions.includes(region)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasAnyLift && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                Enter your lift numbers above to see comparisons
              </p>
            )}
          </>
        )}

        {!weightClass && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            Select your weight class to begin
          </p>
        )}
      </div>
    </div>
  );
}
