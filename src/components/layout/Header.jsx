// src/components/layout/Header.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Importar iconos
import { Bars3Icon, BellIcon, UserCircleIcon } from './Icons';

export default function Header({ setSidebarOpen, user }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Botón hamburguesa para móvil */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menú</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* Buscador (solo visible en escritorio) */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 border-0 bg-gray-100 rounded-lg py-2 px-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Controles de la derecha */}
        <div className="flex items-center space-x-4">
          {/* Ayuda */}
          <button className="text-sm text-gray-600 hidden md:block hover:text-indigo-600">
            Centro de ayuda
          </button>
          
          {/* Notificaciones */}
          <div className="relative">
            <button
              type="button"
              className="relative p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              )}
            </button>
            
            {/* Dropdown de notificaciones */}
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
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
          <div className="relative">
            <button
              type="button"
              className="flex items-center text-sm focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">Abrir menú de usuario</span>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user?.name || 'Usuario'}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex ml-2 items-center">
                  <span className="text-sm font-medium text-gray-700 mr-1">
                    {user?.name || 'Usuario'}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
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
                  role="menuitem"
                >
                  Tu perfil
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Configuración
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
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
}

// Iconos adicionales
function SearchIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
    </svg>
  );
}

export function Bars3Icon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
    </svg>
  );
}

export function UserCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  );
}
