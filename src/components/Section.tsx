import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onHelpClick?: () => void;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, onHelpClick, className = '' }) => {
  return (
    <section className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h2>
        {onHelpClick && (
          <button
            onClick={onHelpClick}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            aria-label="Help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
