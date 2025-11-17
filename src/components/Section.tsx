import React from 'react';

interface SectionProps {
  title: string;
  emoji?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, emoji, children, className = '' }) => {
  return (
    <section className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-10 md:p-12 mb-10 ${className}`}>
      <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-gray-100 dark:border-slate-700">
        {emoji && <span className="text-3xl">{emoji}</span>}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-50">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export default Section;
