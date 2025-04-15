// src/components/common/LoadingSpinner.jsx
import PropTypes from 'prop-types';

/**
 * Componente de spinner de carga optimizado
 * Compatible con diferentes tamaños y colores
 */
const LoadingSpinner = ({ 
  text = 'Cargando...', 
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  // Tamaños predefinidos
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Tamaños de texto
  const textClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Colores
  const colorClasses = {
    primary: 'text-primary-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textClasses[size] || textClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <svg
        className={`animate-spin ${spinnerSize} ${spinnerColor}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
      
      {text && (
        <p className={`${textSize} text-gray-500 font-medium`}>{text}</p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'gray', 'white']),
  className: PropTypes.string
};

export default LoadingSpinner;