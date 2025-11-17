import { useState, useEffect } from 'react';
import type { PowerliftingRecord } from '../types/records';
import { loadRecords, importRecords as saveImportedRecords } from '../utils/recordsStorage';

export const useRecordsData = () => {
  const [allRecords, setAllRecords] = useState<PowerliftingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const data = loadRecords();
      setAllRecords(data.records);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const importRecords = (jsonData: PowerliftingRecord[]) => {
    try {
      saveImportedRecords(jsonData);
      setAllRecords(jsonData);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error importing records:', error);
      throw error;
    }
  };

  return {
    allRecords,
    isLoading,
    lastUpdated,
    importRecords,
    reloadRecords: loadData
  };
};
