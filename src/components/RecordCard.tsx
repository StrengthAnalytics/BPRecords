import React from 'react';
import type { PowerliftingRecord } from '../types/records';
import { formatDate, formatLiftName, formatEquipment, formatGender } from '../utils/recordsFormatters';

interface RecordCardProps {
  record: PowerliftingRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50">
          {record.name}
        </h3>
        <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
          {record.region}
        </span>
      </div>

      <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 my-3">
        {record.record}kg
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
        <div className="flex flex-wrap gap-1">
          <span className="font-medium">{formatLiftName(record.lift)}</span>
          <span>•</span>
          <span>{record.weightClass}</span>
          <span>•</span>
          <span>{formatEquipment(record.equipment)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
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
