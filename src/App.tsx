import { useState, useEffect } from 'react';
import RecordsHub from './components/RecordsHub';
import type { BrandingState } from './types/records';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const branding: BrandingState = {
    primaryColor: '#dc2626',
    secondaryColor: '#b91c1c',
    accentColor: '#fecaca'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white py-12 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">British Powerlifting Records</h1>
        <p className="text-xl text-red-100 max-w-2xl mx-auto">
          Search and explore national and regional powerlifting records across all weight classes and categories
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <RecordsHub branding={branding} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-slate-950 text-gray-400 py-6 px-4 text-center mt-12">
        <p>British Powerlifting Records Hub • Data compiled from official competitions</p>
      </footer>
    </div>
  );
}

export default App;
