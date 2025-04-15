// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Elementos hijos (componentes protegidos)
 * @param {string} [props.redirectTo='/login'] - Ruta de redirección si no hay autenticación
 * @param {boolean} [props.allowRoles=false] - Indica si se debe validar roles
 * @param {Array} [props.roles=[]] - Roles permitidos para acceder a la ruta
 * @returns {JSX.Element} Componente renderizado
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login', 
  allowRoles = false,
  roles = [] 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se requiere validación de roles
  if (allowRoles && roles.length > 0) {
    // Verificar si el usuario tiene alguno de los roles requeridos
    const userRole = user?.role || 'user';
    const hasRequiredRole = roles.includes(userRole);

    if (!hasRequiredRole) {
      // Si no tiene el rol requerido, redirigir a una página de acceso denegado
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Si pasa todas las validaciones, renderizar los componentes hijos
  return children;
}
