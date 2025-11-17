import React, { useRef, useState } from 'react';
import type { PowerliftingRecord } from '../types/records';
import Section from './Section';
import IconButton from './IconButton';

interface RecordsImportProps {
  onImport: (records: PowerliftingRecord[]) => void;
  lastUpdated: string;
}

const RecordsImport: React.FC<RecordsImportProps> = ({ onImport, lastUpdated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of records');
      }

      const records = data as PowerliftingRecord[];

      if (records.length === 0) {
        throw new Error('No records found in file');
      }

      const requiredFields = ['region', 'name', 'weightClass', 'gender', 'lift', 'ageCategory', 'record', 'dateSet', 'equipment'];
      const firstRecord = records[0];
      const missingFields = requiredFields.filter(field => !(field in firstRecord));

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      onImport(records);
      setSuccess(`Successfully imported ${records.length} records`);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import records');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Section title="Import Records">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Import powerlifting records from a JSON file. The file should contain an array of record objects
          with the required fields.
        </p>

        <div className="flex gap-3 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <IconButton onClick={handleButtonClick}>
            Choose JSON File
          </IconButton>

          {lastUpdated && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded text-green-700 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View expected JSON format
          </summary>
          <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded overflow-x-auto text-xs">
{`[
  {
    "region": "England",
    "name": "John Smith",
    "weightClass": "83kg",
    "gender": "M",
    "lift": "squat",
    "ageCategory": "Open",
    "record": 250.5,
    "dateSet": "2024-01-15",
    "equipment": "unequipped"
  }
]`}
          </pre>
        </details>
      </div>
    </Section>
  );
};

export default RecordsImport;
