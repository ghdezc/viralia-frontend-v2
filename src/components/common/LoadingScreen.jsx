// src/components/common/LoadingScreen.jsx
import PropTypes from 'prop-types';
import { BoltIcon } from '@heroicons/react/24/solid';

/**
 * Componente de pantalla de carga completo
 * Versión optimizada y más limpia visualmente
 */
const LoadingScreen = ({ 
  message = 'Cargando...', 
  fullScreen = true,
  showLogo = true
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-white ${
        fullScreen ? 'fixed inset-0 z-50' : 'h-full w-full py-12'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        {showLogo && (
          <div className="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 p-3">
            <BoltIcon className="h-8 w-8 text-white" />
          </div>
        )}
        
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg 
              className="h-10 w-10 text-indigo-600 animate-pulse" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        </div>
        
        <div className="text-center">
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  showLogo: PropTypes.bool
};

export default LoadingScreen;