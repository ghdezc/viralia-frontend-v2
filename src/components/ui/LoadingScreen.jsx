// src/components/ui/LoadingScreen.jsx
import { BoltIcon } from '@heroicons/react/24/solid';

/**
 * Componente de pantalla de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.message='Cargando...'] - Mensaje a mostrar durante la carga
 * @param {boolean} [props.fullScreen=true] - Si debe ocupar toda la pantalla
 * @returns {JSX.Element} Componente renderizado
 */
export default function LoadingScreen({ message = 'Cargando...', fullScreen = true }) {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-white ${
        fullScreen ? 'fixed inset-0 z-50' : 'h-full w-full py-12'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <BoltIcon className="h-10 w-10 text-indigo-600 animate-pulse" />
          </div>
          
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Viralia</h2>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Versión pequeña del spinner para componentes individuales
export function LoadingSpinner({ text = 'Cargando...', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };
  
  return (
    <div className="flex items-center justify-center space-x-3">
      <svg 
        className={`animate-spin ${sizeClasses[size] || sizeClasses.md} text-indigo-600`} 
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
      
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}
