import React, { useState, useMemo } from 'react';
import type { PowerliftingRecord } from '../types/records';
import { REGIONS, WEIGHT_CLASSES_MALE, WEIGHT_CLASSES_FEMALE } from '../types/records';
import { generateRecordsPDF } from '../utils/pdfGenerator';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRecords: PowerliftingRecord[];
}

const PDFExportModal: React.FC<PDFExportModalProps> = ({ isOpen, onClose, allRecords }) => {
  // Compute available regions based on uploaded records
  const availableRegions = useMemo(() => {
    // Get unique regions from the actual records data
    const regionsWithData = new Set(allRecords.map(record => record.region));

    // Filter REGIONS to exclude 'All' and only include regions that have data
    return REGIONS.filter(region =>
      region !== 'All' && regionsWithData.has(region)
    );
  }, [allRecords]);

  // Set default region to first available region, or 'British' if it exists
  const [region, setRegion] = useState(() => {
    if (availableRegions.includes('British')) return 'British';
    return availableRegions[0] || 'British';
  });
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      await generateRecordsPDF(allRecords, region, gender, orientation);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRecordCount = () => {
    return allRecords.filter(r => r.region === region && r.gender === gender).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Export Records PDF</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 text-3xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-red-100 mt-2">Generate a formatted PDF for competition display</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Region Selection */}
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 dark:text-slate-200 mb-3">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-4 text-base border-2 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 border-gray-300 dark:border-slate-600 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:focus:ring-red-600/20 dark:focus:border-red-600 transition-all shadow-sm hover:border-red-400 dark:hover:border-red-500"
            >
              {availableRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 dark:text-slate-200 mb-3">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGender('M')}
                className={`px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  gender === 'M'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('F')}
                className={`px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  gender === 'F'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Orientation Selection */}
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 dark:text-slate-200 mb-3">
              Page Orientation
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOrientation('portrait')}
                className={`px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  orientation === 'portrait'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  orientation === 'landscape'
                    ? 'bg-red-600 text-white dark:bg-red-600 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Landscape
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              Portrait: Better for web viewing • Landscape: Fits more age categories per page
            </p>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 dark:bg-slate-700 border-2 border-blue-200 dark:border-slate-600 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">Export Preview</h3>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1">
              <p>• Region: <strong>{region}</strong></p>
              <p>• Gender: <strong>{gender === 'M' ? 'Male' : 'Female'}</strong></p>
              <p>• Orientation: <strong>{orientation.charAt(0).toUpperCase() + orientation.slice(1)}</strong></p>
              <p>• Records to include: <strong>{getRecordCount()}</strong></p>
              <p>• Weight Classes: <strong>{gender === 'M' ? WEIGHT_CLASSES_MALE.filter(wc => wc !== 'All').length : WEIGHT_CLASSES_FEMALE.filter(wc => wc !== 'All').length}</strong></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="flex-1 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating PDF...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportModal;
