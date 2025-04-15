// src/pages/auth/AccessDenied.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

/**
 * Página de acceso denegado
 * Se muestra cuando un usuario intenta acceder a una ruta sin los permisos necesarios
 */
const AccessDenied = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener los roles requeridos del estado (si están disponibles)
  const requiredRoles = location.state?.requiredRoles || [];
  
  // Determinar el rol actual del usuario
  const userRole = user?.role || user?.['custom:role'] || 'usuario';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-red-600">
          <ShieldExclamationIcon className="h-20 w-20" />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acceso denegado
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        
        {requiredRoles.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Roles requeridos:</p>
            <div className="mt-2 flex justify-center gap-2">
              {requiredRoles.map((role) => (
                <span 
                  key={role}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="mt-2">Tu rol actual: <span className="font-medium">{userRole}</span></p>
          </div>
        )}
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Si crees que esto es un error o necesitas acceso a esta área, contacta con el administrador del sistema.
            </p>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Volver atrás
              </button>
              
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ir al dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;