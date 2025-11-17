import type { PowerliftingRecord, FilterState } from '../types/records';

const normalizeLift = (lift: string): string => {
  const liftMap: { [key: string]: string } = {
    'Squat': 'squat',
    'Bench Press': 'bench_press',
    'Bench Press A/C': 'bench_press_ac',
    'Deadlift': 'deadlift',
    'Total': 'total'
  };
  return liftMap[lift] || lift.toLowerCase();
};

export const filterRecords = (
  records: PowerliftingRecord[],
  filters: FilterState
): PowerliftingRecord[] => {
  return records.filter(record => {
    if (filters.name && !record.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.region !== 'All' && record.region !== filters.region) {
      return false;
    }

    if (filters.weightClass !== 'All' && record.weightClass !== filters.weightClass) {
      return false;
    }

    if (filters.lift !== 'All') {
      const normalizedFilterLift = normalizeLift(filters.lift);
      if (record.lift !== normalizedFilterLift) {
        return false;
      }
    }

    if (filters.ageCategory !== 'All' && record.ageCategory !== filters.ageCategory) {
      return false;
    }

    if (filters.equipment !== 'All' && record.equipment.toLowerCase() !== filters.equipment.toLowerCase()) {
      return false;
    }

    if (filters.gender !== 'All' && record.gender !== filters.gender) {
      return false;
    }

    return true;
  });
};

export const sortRecords = (
  records: PowerliftingRecord[],
  sortBy: 'weight' | 'date' | 'name' = 'weight'
): PowerliftingRecord[] => {
  return [...records].sort((a, b) => {
    switch (sortBy) {
      case 'weight':
        return b.record - a.record;
      case 'date':
        return new Date(b.dateSet).getTime() - new Date(a.dateSet).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};
