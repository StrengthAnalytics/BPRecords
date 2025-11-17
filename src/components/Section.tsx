import React from 'react';

interface SectionProps {
  title: string;
  emoji?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, emoji, children, className = '' }) => {
  return (
    <section className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 ${className}`}>
      <div className="flex items-center mb-6">
        {emoji && <span className="text-2xl mr-2">{emoji}</span>}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-50">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export default Section;
