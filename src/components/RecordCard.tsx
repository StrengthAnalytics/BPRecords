import React from 'react';
import type { PowerliftingRecord } from '../types/records';
import { formatDate, formatLiftName, formatEquipment, formatGender } from '../utils/recordsFormatters';

interface RecordCardProps {
  record: PowerliftingRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 border-l-4 border-red-600 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900 dark:text-slate-50">
          {record.name}
        </h3>
        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-md font-medium">
          {record.region}
        </span>
      </div>

      <div className="text-4xl font-extrabold text-red-600 dark:text-red-500 my-4">
        {record.record}kg
      </div>

      <div className="text-sm text-gray-600 dark:text-slate-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold text-gray-800 dark:text-slate-300">{formatLiftName(record.lift)}</span>
          <span>•</span>
          <span>{record.weightClass}</span>
          <span>•</span>
          <span>{formatEquipment(record.equipment)}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span>{formatGender(record.gender)}</span>
          <span>•</span>
          <span>{record.ageCategory}</span>
          <span>•</span>
          <span>{formatDate(record.dateSet)}</span>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
