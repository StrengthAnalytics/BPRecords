import { useState, useEffect } from 'react';
import type { PowerliftingRecord } from '../types/records';
import { records } from '../data/records';

export const useRecordsData = () => {
  const [allRecords, setAllRecords] = useState<PowerliftingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth UX
    const timer = setTimeout(() => {
      setAllRecords(records);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    allRecords,
    isLoading
  };
};
