import { forwardRef } from 'react';
import type { PowerliftingRecord } from '../types/records';
import { formatDate, formatLiftName, formatEquipment } from '../utils/recordsFormatters';

interface ShareCardProps {
  record: PowerliftingRecord;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ record }, ref) => {
  return (
    <div
      ref={ref}
      className="fixed pointer-events-none"
      style={{
        width: '1080px',
        height: '1920px',
        left: '-20000px',
        top: '0',
        zIndex: -9999
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white p-20 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="text-5xl font-black mb-4 tracking-tight">
            BRITISH POWERLIFTING
          </div>
          <div className="text-4xl font-bold text-red-100">
            RECORDS
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center -mt-32">
          {/* Lifter Name */}
          <div className="mb-12">
            <div className="text-7xl font-black leading-tight mb-4">
              {record.name}
            </div>
          </div>

          {/* Record Weight - HUGE */}
          <div className="mb-16 flex items-end justify-center gap-4">
            <div className="text-[280px] font-black leading-none tracking-tighter">
              {record.record}
            </div>
            <div className="text-8xl font-bold text-red-100 pb-8">
              KG
            </div>
          </div>

          {/* Lift Type */}
          <div className="mb-12">
            <div className="text-6xl font-bold">
              {formatLiftName(record.lift)}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 text-4xl font-semibold text-red-50">
            <div>{record.weightClass} • {record.gender === 'M' ? 'Male' : 'Female'}</div>
            <div>{record.region} • {record.ageCategory}</div>
            <div>{formatEquipment(record.equipment)}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-white/20 pt-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-semibold text-red-100">
                {formatDate(record.dateSet)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                Strength Analytics
              </div>
              <div className="text-2xl text-red-100">
                strengthanalytics.co.uk
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;
