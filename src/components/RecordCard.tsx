import React from 'react';
import type { PowerliftingRecord } from '../types/records';
import { formatDate, formatLiftName, formatEquipment, formatGender } from '../utils/recordsFormatters';

interface RecordCardProps {
  record: PowerliftingRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 p-8 hover:shadow-2xl hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 hover:-translate-y-2">
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
    </div>
  );
};

export default RecordCard;
