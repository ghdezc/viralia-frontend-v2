// src/components/auth/ProtectedRoute.jsx - Rutas protegidas OPTIMIZADO
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPlan = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 🔄 Mostrar loading mientras verifica
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando acceso...</p>
          </div>
        </div>
    );
  }

  // 🚫 Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    console.log('🚫 No autenticado, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🎭 Verificar rol requerido
  if (requiredRole && user && !hasRole(user, requiredRole)) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-gray-500">
              Rol requerido: <span className="font-medium">{requiredRole}</span>
            </p>
            <button
                onClick={() => window.history.back()}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
    );
  }

  // 💳 Verificar plan requerido
  if (requiredPlan && user && !hasPlan(user, requiredPlan)) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Requerido</h2>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad requiere una suscripción premium.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Plan requerido: <span className="font-medium">{requiredPlan}</span>
            </p>
            <button
                onClick={() => window.location.href = '/upgrade'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Actualizar Plan
            </button>
          </div>
        </div>
    );
  }

  // ✅ Si pasa todas las validaciones, renderizar contenido
  return children;
};

// Helpers para verificar roles y planes
const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role || user['custom:role'] === role;
};

const hasPlan = (user, plan) => {
  if (!user) return false;
  return user.plan === plan || user['custom:plan'] === plan;
};

export default ProtectedRoute;