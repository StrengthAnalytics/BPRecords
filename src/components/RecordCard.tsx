import React, { useRef, useState } from 'react';
import type { PowerliftingRecord } from '../types/records';
import { formatDate, formatLiftName, formatEquipment, formatGender } from '../utils/recordsFormatters';
import ShareCard from './ShareCard';
import { shareRecordImage } from '../utils/shareRecord';

interface RecordCardProps {
  record: PowerliftingRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing) return;

    setIsSharing(true);
    try {
      await shareRecordImage(shareCardRef.current, record);
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to generate share image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 p-8 hover:shadow-2xl hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 hover:-translate-y-2">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-bold text-2xl text-gray-900 dark:text-slate-50 leading-tight">
          {record.name}
        </h3>
        <span className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full font-bold shadow-sm">
          {record.region}
        </span>
      </div>

      <div className="mb-6 pb-6 border-b-2 border-gray-100 dark:border-slate-700">
        <div className="text-6xl font-black text-red-600 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
          {record.record}<span className="text-4xl ml-1">kg</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 text-base font-medium text-gray-700 dark:text-slate-300">
          <span className="font-bold text-gray-900 dark:text-slate-100">{formatLiftName(record.lift)}</span>
          <span className="text-gray-400">•</span>
          <span>{record.weightClass}</span>
          <span className="text-gray-400">•</span>
          <span>{formatEquipment(record.equipment)}</span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-slate-400">
          <span>{formatGender(record.gender)}</span>
          <span className="text-gray-400">•</span>
          <span>{record.ageCategory}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{formatDate(record.dateSet)}</span>
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-6 pt-6 border-t-2 border-gray-100 dark:border-slate-700">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-label="Share record"
        >
          {isSharing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Share Image</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden ShareCard for image generation */}
      <ShareCard ref={shareCardRef} record={record} />
    </div>
  );
};

export default RecordCard;
