// src/components/common/LoadingButton.jsx
import PropTypes from 'prop-types';

/**
 * Botón con estado de carga integrado
 */
const LoadingButton = ({ 
  children, 
  isLoading, 
  disabled, 
  icon, 
  loadingText = 'Cargando...', 
  className = '',
  type = 'button',
  onClick,
  variant = 'primary'
}) => {
  // Variantes de estilo
  const variants = {
    primary: `bg-primary-600 hover:bg-primary-700 text-white`,
    secondary: `bg-gray-200 hover:bg-gray-300 text-gray-800`,
    outline: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`
  };

  const baseClasses = `
    flex items-center justify-center px-6 py-2.5 rounded-md font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
  `;

  const variantClasses = variants[variant] || variants.primary;
  const disabledClasses = `opacity-50 cursor-not-allowed`;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${disabled || isLoading ? disabledClasses : variantClasses}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5"
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
          {loadingText}
        </>
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </button>
  );
};

LoadingButton.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  loadingText: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline'])
};

export default LoadingButton;
