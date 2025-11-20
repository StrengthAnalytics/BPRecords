import { useState, useEffect, useRef } from 'react';

const GuidePopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        aria-label="Open user guide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Guide</span>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-50">
              Quick Guide
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label="Close guide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            {/* Search Functions */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-50 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Functions
              </h4>
              <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1 ml-7">
                <li>• Search by lifter name in the field below</li>
                <li>• Filter by gender, age, weight class, and more</li>
                <li>• Combine multiple filters to narrow results</li>
                <li>• Use "Clear All Filters" to reset your search</li>
              </ul>
            </div>

            {/* PDF Export */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-50 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF Export
              </h4>
              <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1 ml-7">
                <li>• Click "Export PDF" to generate record sheets</li>
                <li>• Perfect for printing and displaying at events</li>
                <li>• Exports filtered results in competition format</li>
                <li>• Professional formatting for official use</li>
              </ul>
            </div>

            {/* Sharing Functions */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-50 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Records
              </h4>
              <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1 ml-7">
                <li>• Click "Share Image" on any record card</li>
                <li>• Generates a social media-ready image</li>
                <li>• Optimized for Instagram Stories (9:16 ratio)</li>
                <li>• On mobile: Opens native share menu</li>
                <li>• On desktop: Downloads image file</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-slate-400 italic">
              💡 Tip: Type "PDF" in the name search to quickly open PDF export
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidePopover;
