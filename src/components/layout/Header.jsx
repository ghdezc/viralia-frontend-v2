// src/components/layout/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * Componente de encabezado principal
 * Gestiona la navegación y las acciones de usuario
 */
const Header = ({ onOpenSidebar, user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Cierra dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Datos de notificaciones
  const notifications = [
    {
      id: 1,
      message: 'Tu contenido para LinkedIn generó un 25% más engagement',
      time: 'Hace 2 horas',
      read: false,
    },
    {
      id: 2,
      message: 'Nueva campaña creada: "Lanzamiento Producto Q2"',
      time: 'Ayer',
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
      <div className="flex w-full justify-between px-4">
        {/* Lado izquierdo */}
        <div className="flex items-center">
          {/* Botón hamburguesa para móvil */}
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100 focus:outline-none"
            onClick={onOpenSidebar}
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* Buscador - solo visible en pantallas medianas y grandes */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 h-9 pl-9 pr-4 rounded-lg bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lado derecho */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              aria-label="Ver notificaciones"
            >
              <BellIcon className="h-6 w-6" />
              {/* Indicador de notificaciones no leídas */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            
            {/* Dropdown de notificaciones */}
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="menu">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500">No tienes notificaciones</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-2 hover:bg-gray-50 ${notification.read ? '' : 'bg-indigo-50'}`}
                        >
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Perfil de usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center focus:outline-none"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Menú de usuario"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user?.name || 'Usuario'}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center justify-center">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex ml-2 items-center">
                  <span className="text-sm font-medium text-gray-700 mr-1">
                    {user?.name || 'Usuario'}
                  </span>
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
            
            {/* Dropdown de usuario */}
            {userMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="block px-4 py-2 text-xs text-gray-500">Cuenta</div>
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tu perfil
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onOpenSidebar: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Header;