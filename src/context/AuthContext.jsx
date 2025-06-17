// src/context/AuthContext.jsx - USANDO API DIRECTA
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cognitoDirectAPI } from '../services/auth/cognitoDirectApi';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔍 Verificar estado de autenticación al cargar
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Verificando estado de autenticación (Direct API)...');

      const authenticated = await cognitoDirectAPI.isAuthenticated();

      if (authenticated) {
        const userData = await cognitoDirectAPI.getCurrentUser();
        console.log('✅ Usuario autenticado (Direct API):', userData?.email);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('❌ Usuario no autenticado (Direct API)');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error verificando auth (Direct API):', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar auth al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 🔑 LOGIN usando API directa
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      console.log('🔑 Iniciando login (Direct API) para:', email);

      const result = await cognitoDirectAPI.signIn(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        toast.success(`¡Bienvenido ${result.user.email || result.user.username}!`);
        console.log('✅ Login exitoso (Direct API)');

        return { success: true };
      }

      throw new Error('Login falló');
    } catch (error) {
      console.error('❌ Error en login (Direct API):', error);
      toast.error(error.message);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚪 LOGOUT
  const logout = useCallback(async () => {
    try {
      console.log('🚪 Cerrando sesión (Direct API)...');
      cognitoDirectAPI.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error en logout (Direct API):', error);
      toast.error('Error cerrando sesión');
      return { success: false, error: error.message };
    }
  }, []);

  // 👤 Verificar rol de usuario
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role || user['custom:role'] === role;
  }, [user]);

  // 💳 Verificar plan del usuario
  const hasPlan = useCallback((plan) => {
    if (!user) return false;
    return user.plan === plan || user['custom:plan'] === plan;
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasPlan,
    checkAuthStatus
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;