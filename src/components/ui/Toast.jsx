// src/components/ui/Toast.jsx
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Componente Toast para mostrar notificaciones
 * @param {Object} props Propiedades del componente
 * @param {string} props.id ID único del toast
 * @param {string} props.message Mensaje a mostrar
 * @param {string} props.type Tipo de toast (success, error, warning, info)
 * @param {Function} props.onClose Función para cerrar el toast
 * @returns {JSX.Element} Componente Toast
 */
export default function Toast({ id, message, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
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
  
  // Manejar cierre del toast
  const handleClose = () => {
    setIsVisible(false);
    
    // Llamar a onClose después de la animación
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  // Efecto de animación al montar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
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
}
