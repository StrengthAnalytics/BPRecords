import React, { useRef, useState } from 'react';
import type { PowerliftingRecord } from '../types/records';

interface CSVConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegionData {
  [region: string]: PowerliftingRecord[];
}

const CSVConverterModal: React.FC<CSVConverterModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);
  const [convertedData, setConvertedData] = useState<RegionData | null>(null);

  if (!isOpen) return null;

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index].trim();
        });
        records.push(record);
      }
    }

    return records;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  };

  const normalizeLift = (lift: string): string => {
    // Normalize the input: lowercase, remove extra spaces, normalize parentheses
    const normalized = lift.toLowerCase()
      .replace(/\s*\(\s*/g, ' (')  // Normalize space before opening parenthesis
      .replace(/\s*\)\s*/g, ')')   // Remove space before closing parenthesis
      .replace(/\s+/g, ' ')        // Collapse multiple spaces
      .trim();

    const liftMap: { [key: string]: string } = {
      'squat': 'squat',
      'bench press': 'bench_press',
      'bench': 'bench_press',
      'bench press a/c': 'bench_press_ac',
      'bench press (a/c)': 'bench_press_ac',
      'bench a/c': 'bench_press_ac',
      'bench (a/c)': 'bench_press_ac',
      'bench press ac': 'bench_press_ac',
      'bench ac': 'bench_press_ac',
      'deadlift': 'deadlift',
      'dead lift': 'deadlift',
      'total': 'total'
    };

    return liftMap[normalized] || lift.toLowerCase().replace(/\s+/g, '_');
  };

  const normalizeEquipment = (equipment: string): string => {
    const eqMap: { [key: string]: string } = {
      'equipped': 'equipped',
      'unequipped': 'unequipped',
      'raw': 'unequipped',
      'classic': 'unequipped'
    };
    return eqMap[equipment.toLowerCase()] || 'unequipped';
  };

  const normalizeAgeCategory = (ageCategory: string): string => {
    const trimmed = ageCategory.trim();
    const upper = trimmed.toUpperCase();

    // Map common variations and abbreviations
    const ageCategoryMap: { [key: string]: string } = {
      'OPEN': 'Open',
      'O': 'Open',
      'J': 'U18',        // Junior → U18
      'SJ': 'U16',       // Sub-Junior → U16
      'U16': 'U16',
      'U18': 'U18',
      'U23': 'U23',
      'M1': 'M1',
      'M2': 'M2',
      'M3': 'M3',
      'M4': 'M4',
      'M5': 'M5',
      'M6': 'M6'
    };

    return ageCategoryMap[upper] || trimmed;
  };

  const normalizeWeightClass = (weightClass: string): string => {
    // Remove minus sign prefix (e.g., "-53kg" -> "53kg")
    return weightClass.replace(/^-/, '');
  };

  const parseDate = (dateStr: string): string => {
    // Handle DD/MM/YYYY format (e.g., "29/04/2023")
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }

    // Try to parse other date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const convertToJSON = (records: any[]): PowerliftingRecord[] => {
    return records.map(record => ({
      region: record['Region'] || record['region'] || '',
      name: record['Name'] || record['name'] || '',
      weightClass: normalizeWeightClass(record['Weight Class'] || record['weightClass'] || ''),
      gender: (record['Gender'] || record['gender'] || '').toUpperCase() as 'M' | 'F',
      lift: normalizeLift(record['Lift'] || record['lift'] || '') as any,
      ageCategory: normalizeAgeCategory(record['Age Category'] || record['ageCategory'] || ''),
      record: parseFloat(record['Record'] || record['record'] || '0'),
      dateSet: parseDate(record['Date Set'] || record['dateSet'] || ''),
      equipment: normalizeEquipment(record['Equipment'] || record['equipment'] || '') as any
    }));
  };

  const groupByRegion = (records: PowerliftingRecord[]): RegionData => {
    const grouped: RegionData = {};
    records.forEach(record => {
      const region = record.region;
      if (!grouped[region]) {
        grouped[region] = [];
      }
      grouped[region].push(record);
    });
    return grouped;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus({ type: 'info', message: 'Processing file...' });

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      const converted = convertToJSON(csvData);
      const regionData = groupByRegion(converted);

      setConvertedData(regionData);
      setStatus({ type: 'success', message: `Successfully converted ${converted.length} records from ${Object.keys(regionData).length} regions!` });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to process file' });
    }
  };

  const downloadRegion = (region: string) => {
    if (!convertedData) return;

    const records = convertedData[region];
    const json = JSON.stringify(records, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${region.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (!convertedData) return;

    // Download each region as a separate file in quick succession
    Object.keys(convertedData).forEach((region, index) => {
      setTimeout(() => downloadRegion(region), index * 100);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">CSV to JSON Converter</h2>
            <p className="text-red-100 text-sm mt-1">Admin Tool - Convert Google Sheets export to region JSON files</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Export your Google Sheets as CSV</li>
              <li>Upload the CSV file below</li>
              <li>Download individual region JSON files</li>
              <li>Place them in <code className="bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">data-source/</code></li>
              <li>Run <code className="bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">npm run build:data</code></li>
              <li>Commit and push the changes</li>
            </ol>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center bg-gray-50 dark:bg-slate-900/50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Choose CSV File
            </button>
            <p className="text-gray-600 dark:text-slate-400 mt-3 text-sm">
              Expected columns: Region, Name, Weight Class, Gender, Lift, Age Category, Record, Date Set, Equipment
            </p>
          </div>

          {status && (
            <div className={`p-4 rounded-xl border-2 ${
              status.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300' :
              status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300'
            }`}>
              <p className="font-semibold">{status.message}</p>
            </div>
          )}

          {convertedData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Converted Regions ({Object.keys(convertedData).length})
                </h3>
                <button
                  onClick={downloadAll}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Download All Regions
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(convertedData).sort().map(region => (
                  <div
                    key={region}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">{region}</h4>
                    <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-3">
                      {convertedData[region].length} records
                    </p>
                    <button
                      onClick={() => downloadRegion(region)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
                    >
                      Download {region}.json
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="bg-gray-50 dark:bg-slate-900/50 border-2 border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <summary className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold">
              View Expected JSON Format
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-slate-950 rounded-lg overflow-x-auto text-xs border border-gray-300 dark:border-slate-700">
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
      </div>
    </div>
  );
};

export default CSVConverterModal;
