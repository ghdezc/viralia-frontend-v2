// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ text = 'Cargando...', size = 'md' }) => {
  // Determinar el tamaño del spinner
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Determinar texto basado en tamaño
  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textClasses[size] || textClasses.md;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg
        className={`animate-spin ${spinnerSize} text-indigo-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`${textSize} text-gray-500 font-medium`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
