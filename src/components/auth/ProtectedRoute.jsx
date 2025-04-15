// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';
import { useEffect } from 'react';

/**
 * Componente mejorado para proteger rutas que requieren autenticación
 * - Validación de roles
 * - Mejor manejo de redirecciones
 * - Soporte para rutas anidadas
 * - Registro de actividad para seguridad
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login', 
  roles = [],
  requiredPlan = null
}) {
  const { user, loading, isAuthenticated, refreshSession } = useAuth();
  const location = useLocation();

  // Actualizar timestamp de última actividad para sesiones
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('lastActivity', Date.now().toString());
      
      // Refrescar sesión si es necesario (token a punto de expirar)
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      if (tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        const currentTime = Date.now();
        
        // Si el token expira en menos de 5 minutos, refrescarlo
        if (expirationTime - currentTime < 5 * 60 * 1000) {
          refreshSession();
        }
      }
    }
  }, [isAuthenticated, refreshSession, location.pathname]);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen message="Verificando acceso..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se requiere validación de roles
  if (roles.length > 0) {
    const userRole = user?.role || user?.['custom:role'] || 'user';
    const hasRequiredRole = roles.includes(userRole);

    if (!hasRequiredRole) {
      // Si no tiene el rol requerido, redirigir a una página de acceso denegado
      return <Navigate to="/access-denied" replace state={{ requiredRoles: roles }} />;
    }
  }

  // Si se requiere un plan específico
  if (requiredPlan) {
    const userPlan = user?.plan || user?.['custom:plan'] || 'free';
    
    if (userPlan !== requiredPlan) {
      // Si no tiene el plan requerido, redirigir a una página de actualización
      return <Navigate to="/upgrade-plan" replace state={{ requiredPlan, currentPlan: userPlan }} />;
    }
  }

  // Si pasa todas las validaciones, renderizar los componentes hijos
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  requiredPlan: PropTypes.string
};