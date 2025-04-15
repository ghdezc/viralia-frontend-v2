// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Iconos de navegación
import { 
  HomeIcon, 
  BoltIcon,
  CampaignIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  XMarkIcon
} from './Icons';

// Logo personalizado
const Logo = () => (
  <div className="flex items-center px-6 py-4">
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg w-8 h-8 flex items-center justify-center">
        <BoltIcon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-indigo-600">Viralia</span>
    </div>
  </div>
);

export default function Sidebar({ sidebarOpen, setSidebarOpen, isMobile }) {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Generador', href: '/generator', icon: BoltIcon },
    { name: 'Campañas', href: '/campaigns', icon: CampaignIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon }
  ];

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`
    : 'w-64 flex-shrink-0';

  return (
    <aside className={sidebarClasses}>
      <div className="h-full flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Botón cerrar (solo visible en móvil) */}
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Perfil del usuario (mini) */}
        <div className="px-6 py-3 mt-2 mb-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 flex items-center justify-center text-white font-medium">
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

        {/* Navegación principal */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group transition-all ${
                    isActive 
                      ? 'text-indigo-700 bg-indigo-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon 
                  className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`} 
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Tarjeta promocional */}
        <div className="p-4 mx-3 my-4 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100">
          <h4 className="text-xs font-semibold text-indigo-800">Pro Tips</h4>
          <p className="mt-1 text-xs text-indigo-700">
            Mejora tus resultados con un post al día utilizando nuestro generador de contenido.
          </p>
          <button className="mt-2 text-xs font-medium text-indigo-700 hover:text-indigo-800">
            Ver guía →
          </button>
        </div>
      </div>
    </aside>
  );
}

// Componente Icons.jsx para importar en un archivo separado
export function HomeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  );
}

export function BoltIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
  );
}

export function CampaignIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
    </svg>
  );
}

export function ChartBarIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
    </svg>
  );
}

export function Cog6ToothIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </svg>
  );
}

export function XMarkIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
}
