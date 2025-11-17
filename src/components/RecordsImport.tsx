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
    <Section title="Import Records" emoji="📁">
      <div className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
          Import powerlifting records from a JSON file. The file should contain an array of record objects
          with the required fields.
        </p>

        <div className="flex gap-6 items-center flex-wrap">
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
            <span className="text-base text-gray-700 dark:text-slate-300">
              Last updated: <span className="font-bold text-red-600 dark:text-red-400">{formatLastUpdated(lastUpdated)}</span>
            </span>
          )}
        </div>

        {error && (
          <div className="p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-xl text-red-800 dark:text-red-300 shadow-lg">
            <p className="font-bold text-lg">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="p-5 bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600 rounded-xl text-green-800 dark:text-green-300 shadow-lg">
            <p className="font-bold text-lg">✅ {success}</p>
          </div>
        )}

        <details className="group">
          <summary className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-base list-none flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform">▶</span>
            View expected JSON format
          </summary>
          <pre className="mt-4 p-5 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-x-auto text-sm border-2 border-gray-300 dark:border-slate-700 shadow-inner">
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
