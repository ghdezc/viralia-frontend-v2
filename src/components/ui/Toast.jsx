// src/components/ui/Toast.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

/**
 * Componente Toast para mostrar notificaciones
 */
const Toast = ({ id, message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Configuración según el tipo
  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-400',
      iconColor: 'text-green-400',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-400',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: ExclamationCircleIcon,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-400',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-400',
    },
  };
  
  const { icon: Icon, bgColor, textColor, borderColor, iconColor } = config[type] || config.info;
  
  // Efecto de animación al montar
  useEffect(() => {
    // Mostrar el toast con un pequeño retraso para la animación
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manejar cierre del toast
  const handleClose = () => {
    setIsVisible(false);
    
    // Llamar a onClose después de la animación
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div 
        className={`${bgColor} ${textColor} ${borderColor} border-l-4 p-4 rounded-r-md shadow-md flex items-start max-w-md`}
        role="alert"
      >
        <div className={`${iconColor} flex-shrink-0 mr-3`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-grow mr-2">
          <p className="text-sm font-medium">{message}</p>
        </div>
        
        <button
          type="button"
          className={`${textColor} hover:bg-opacity-10 hover:bg-gray-700 rounded-full p-1 focus:outline-none`}
          onClick={handleClose}
          aria-label="Cerrar"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onClose: PropTypes.func
};

export default Toast;