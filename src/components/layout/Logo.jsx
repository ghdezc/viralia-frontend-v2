// src/components/layout/Logo.jsx
import { Link } from 'react-router-dom';
import { BoltIcon } from '@heroicons/react/24/solid';

/**
 * Componente para el logo de la aplicación
 * Reutilizable en diferentes partes de la UI
 */
const Logo = ({ variant = 'default', linkTo = '/' }) => {
  // Variantes: default, small, large
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const textClasses = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl'
  };

  const iconClass = sizeClasses[variant] || sizeClasses.default;
  const textClass = textClasses[variant] || textClasses.default;

  return (
    <Link to={linkTo} className="flex items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <BoltIcon className={`${iconClass} text-white`} />
        </div>
        <span className={`${textClass} font-bold text-primary-600`}>Viralia</span>
      </div>
    </Link>
  );
};

export default Logo;
