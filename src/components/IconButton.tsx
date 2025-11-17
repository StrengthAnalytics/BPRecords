import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'px-8 py-4 rounded-xl font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';

  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 dark:bg-red-600 dark:hover:bg-red-700',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500/50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-50 shadow-md',
    danger: 'bg-red-800 hover:bg-red-900 text-white focus:ring-red-600/50 dark:bg-red-800 dark:hover:bg-red-900'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
