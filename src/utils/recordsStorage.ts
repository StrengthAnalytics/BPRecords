import type { PowerliftingRecord, RecordsData } from '../types/records';

const STORAGE_KEY = 'british_powerlifting_records';

export const loadRecords = (): RecordsData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { records: [], lastUpdated: '' };
  } catch (error) {
    console.error('Error loading records from localStorage:', error);
    return { records: [], lastUpdated: '' };
  }
};

export const saveRecords = (data: RecordsData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving records to localStorage:', error);
  }
};

export const importRecords = (jsonData: PowerliftingRecord[]): void => {
  const data: RecordsData = {
    records: jsonData,
    lastUpdated: new Date().toISOString()
  };
  saveRecords(data);
};

export const clearRecords = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing records from localStorage:', error);
  }
};
