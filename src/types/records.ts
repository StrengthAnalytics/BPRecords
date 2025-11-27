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
  'British',
  'England',
  'Wales',
  'Scotland',
  'Northern Ireland',
  'Yorkshire & North East',
  'North West',
  'North Midlands',
  'East Midlands',
  'West Midlands',
  'Greater London',
  'South West',
  'South Midlands',
  'South East',
  'British Universities'
];

export const WEIGHT_CLASSES_MALE = [
  'All',
  '53kg', // Junior/Sub-Junior only
  '59kg',
  '66kg',
  '74kg',
  '83kg',
  '93kg',
  '105kg',
  '120kg',
  '120kg+'
];

export const WEIGHT_CLASSES_FEMALE = [
  'All',
  '43kg', // Junior/Sub-Junior only
  '47kg',
  '52kg',
  '57kg',
  '63kg',
  '69kg',
  '76kg',
  '84kg',
  '84kg+'
];

// Legacy export - all weight classes combined
export const WEIGHT_CLASSES = [
  'All',
  '43kg',
  '47kg',
  '52kg',
  '53kg',
  '57kg',
  '59kg',
  '63kg',
  '66kg',
  '69kg',
  '74kg',
  '76kg',
  '83kg',
  '84kg',
  '84kg+',
  '93kg',
  '105kg',
  '120kg',
  '120kg+'
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
  'Sub-Junior (U16-U18)',
  'Junior (U23)',
  'Open',
  'M1',
  'M2',
  'M3',
  'M4',
  'M5',
  'M6'
];

// Individual age categories for PDF generation (each region has separate records)
export const AGE_CATEGORIES_PDF = [
  'U16',
  'U18',
  'SJ',   // Sub-Junior
  'U23',
  'J',    // Junior
  'Open',
  'M1',
  'M2',
  'M3',
  'M4',
  'M5',
  'M6'
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

// Comparison feature types
export interface UserLifts {
  squat?: number;
  bench_press?: number;
  bench_press_ac?: number;
  deadlift?: number;
  total?: number;
}

export interface UserProfile {
  gender: 'M' | 'F';
  weightClass: string;
  ageCategory: string;
  equipment: 'equipped' | 'unequipped';
}

export interface ComparisonState {
  isEnabled: boolean;
  userProfile: UserProfile | null;
  userLifts: UserLifts;
  selectedRegions: string[]; // empty array means all regions
}

export type ComparisonColor = 'green' | 'yellow' | 'red' | 'gray';
