import type { PowerliftingRecord, UserLifts, UserProfile, ComparisonColor } from '../types/records';

/**
 * Calculate percentage of user's lift compared to record
 * Returns a number between 0-200+ (100 = equal to record)
 */
export function calculatePercentage(userLift: number, recordLift: number): number {
  if (recordLift === 0) return 0;
  return Math.round((userLift / recordLift) * 100);
}

/**
 * Determine color coding based on percentage
 * Green: User exceeds or equals record (≥100%)
 * Yellow: Close to record (85-99%)
 * Red: Working towards record (<85%)
 * Gray: No user data for this lift
 */
export function getComparisonColor(percentage: number | null): ComparisonColor {
  if (percentage === null) return 'gray';
  if (percentage >= 100) return 'green';
  if (percentage >= 85) return 'yellow';
  return 'red';
}

/**
 * Get Tailwind CSS classes for comparison color
 */
export function getComparisonColorClasses(color: ComparisonColor): {
  bg: string;
  text: string;
  border: string;
  progressBg: string;
} {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        progressBg: 'bg-green-500 dark:bg-green-600'
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
        progressBg: 'bg-yellow-500 dark:bg-yellow-600'
      };
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        progressBg: 'bg-red-500 dark:bg-red-600'
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-700',
        progressBg: 'bg-gray-400 dark:bg-gray-600'
      };
  }
}

/**
 * Check if a record matches the user's profile
 * Used to filter records for comparison
 */
export function matchesUserProfile(
  record: PowerliftingRecord,
  profile: UserProfile
): boolean {
  return (
    record.gender === profile.gender &&
    record.weightClass === profile.weightClass &&
    matchesAgeCategory(record.ageCategory, profile.ageCategory) &&
    record.equipment === profile.equipment
  );
}

/**
 * Match age categories (handles the combined "Sub-Junior (U16-U18)" category)
 */
function matchesAgeCategory(recordAge: string, profileAge: string): boolean {
  // Direct match
  if (recordAge === profileAge) return true;

  // Handle Sub-Junior grouping
  if (profileAge === 'Sub-Junior (U16-U18)') {
    return recordAge === 'U16' || recordAge === 'U18' || recordAge === 'SJ';
  }

  // Handle Junior grouping
  if (profileAge === 'Junior (U23)') {
    return recordAge === 'U23' || recordAge === 'J';
  }

  return false;
}

/**
 * Get the user's lift value for a specific lift type
 */
export function getUserLift(
  userLifts: UserLifts,
  liftType: PowerliftingRecord['lift']
): number | null {
  const value = userLifts[liftType];
  return value !== undefined && value > 0 ? value : null;
}

/**
 * Calculate what the user needs to break the record
 */
export function calculateGapToRecord(userLift: number, recordLift: number): number {
  return Math.max(0, recordLift - userLift);
}

/**
 * Format comparison message
 */
export function getComparisonMessage(
  userLift: number,
  recordLift: number,
  recordName: string
): string {
  const percentage = calculatePercentage(userLift, recordLift);

  if (percentage >= 100) {
    const excess = userLift - recordLift;
    return `You exceed ${recordName}'s record by ${excess}kg! 🎉`;
  }

  const gap = calculateGapToRecord(userLift, recordLift);
  return `${percentage}% of ${recordName}'s record (need +${gap}kg)`;
}

/**
 * Get list of lift types that have user values entered
 */
export function getActiveLifts(userLifts: UserLifts): PowerliftingRecord['lift'][] {
  const activeLifts: PowerliftingRecord['lift'][] = [];

  if (userLifts.squat !== undefined && userLifts.squat > 0) {
    activeLifts.push('squat');
  }
  if (userLifts.bench_press !== undefined && userLifts.bench_press > 0) {
    activeLifts.push('bench_press');
  }
  if (userLifts.bench_press_ac !== undefined && userLifts.bench_press_ac > 0) {
    activeLifts.push('bench_press_ac');
  }
  if (userLifts.deadlift !== undefined && userLifts.deadlift > 0) {
    activeLifts.push('deadlift');
  }
  if (userLifts.total !== undefined && userLifts.total > 0) {
    activeLifts.push('total');
  }

  return activeLifts;
}

/**
 * Filter records to only show those matching user's profile, selected regions, and active lifts
 */
export function filterRecordsForComparison(
  records: PowerliftingRecord[],
  profile: UserProfile | null,
  selectedRegions: string[],
  userLifts: UserLifts
): PowerliftingRecord[] {
  if (!profile) return [];

  // Get which lifts have values entered
  const activeLifts = getActiveLifts(userLifts);

  // If no lifts have values, don't show any records
  if (activeLifts.length === 0) return [];

  return records.filter(record => {
    // Must match profile
    if (!matchesUserProfile(record, profile)) return false;

    // Must be one of the lifts with user values
    if (!activeLifts.includes(record.lift)) return false;

    // If no regions selected, show all
    if (selectedRegions.length === 0) return true;

    // Otherwise, must match selected regions
    return selectedRegions.includes(record.region);
  });
}
