// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

// Iconos de navegación optimizados como componentes independientes
import { 
  HomeIcon, 
  BoltIcon,
  DocumentDuplicateIcon, 
  ChartBarIcon, 
  Cog6ToothIcon 
} from '../common/Icons';

/**
 * Sidebar optimizado y limpio
 * - Componentes más pequeños y enfocados
 * - Mejor rendimiento 
 * - Menos elementos visuales para reducir carga cognitiva
 */
const Sidebar = ({ isOpen, onClose, isMobile, user }) => {
  // Definir enlaces de navegación
  const navigationLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Generador', href: '/generator', icon: BoltIcon },
    { name: 'Campañas', href: '/campaigns', icon: DocumentDuplicateIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon }
  ];

  // Clases condicionales para sidebar en móvil/desktop
  const sidebarClasses = isMobile
    ? `fixed z-30 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden lg:block';

  return (
    <aside className={sidebarClasses}>
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between p-4">
          <Logo />
          
          {/* Botón cerrar (solo visible en móvil) */}
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Cerrar menú"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Perfil del usuario (mini) */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.name || user?.email || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.plan || 'Plan Free'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación principal - diseño simplificado */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => 
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg group transition-all ${
                  isActive 
                    ? 'text-primary-700 bg-primary-50' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon 
                className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors ${
                  ({ isActive }) => isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'
                }`} 
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default Sidebar;