export interface PowerliftingRecord {
  region: string;
  name: string;
  weightClass: string;
  gender: 'M' | 'F';
  lift: 'squat' | 'bench_press' | 'deadlift' | 'total' | 'bench_press_ac';
  ageCategory: string;
  record: number;
  dateSet: string;
  equipment: 'equipped' | 'unequipped';
}

export interface RecordsData {
  records: PowerliftingRecord[];
  lastUpdated: string;
}

export interface FilterState {
  name: string;
  region: string;
  weightClass: string;
  lift: string;
  ageCategory: string;
  equipment: string;
  gender: string;
}

export interface BrandingState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface RecordsHubProps {
  branding: BrandingState;
  onHelpClick?: () => void;
}

export const REGIONS = [
  'All',
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'North East',
  'North West',
  'Yorkshire',
  'East Midlands',
  'West Midlands',
  'East of England',
  'London',
  'South East',
  'South West'
];

export const WEIGHT_CLASSES = [
  'All',
  '59kg',
  '66kg',
  '74kg',
  '83kg',
  '93kg',
  '105kg',
  '120kg',
  '120+kg'
];

export const LIFTS = [
  'All',
  'Squat',
  'Bench Press',
  'Bench Press A/C',
  'Deadlift',
  'Total'
];

export const AGE_CATEGORIES = [
  'All',
  'Sub-Junior',
  'Junior',
  'Open',
  'M1',
  'M2',
  'M3',
  'M4'
];

export const EQUIPMENT_TYPES = [
  'All',
  'Equipped',
  'Unequipped'
];

export const GENDERS = [
  'All',
  'M',
  'F'
];
