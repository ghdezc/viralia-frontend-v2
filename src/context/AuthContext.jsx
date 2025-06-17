// src/context/AuthContext.jsx - Context seguro de autenticación
import { createContext, useContext, useState, useEffect } from 'react';
import { cognitoAuth } from '../services/auth/cognitoAuth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      const authenticated = await cognitoAuth.isAuthenticated();

      if (authenticated) {
        const userData = await cognitoAuth.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (username, password) => {
    try {
      setLoading(true);

      const result = await cognitoAuth.signIn(username, password);

      if (result.success) {
        if (result.requireNewPassword) {
          return {
            success: true,
            requireNewPassword: true,
            ...result
          };
        }

        setUser(result.user);
        setIsAuthenticated(true);

        toast.success(`¡Bienvenido ${result.user.name || result.user.email}!`);

        return { success: true };
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      cognitoAuth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Sesión cerrada correctamente');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
      return { success: false, error: error.message };
    }
  };

  // Refresh de sesión
  const refreshSession = async () => {
    try {
      await cognitoAuth.refreshTokens();
      const userData = await cognitoAuth.getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Session refresh failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    }
  };

  // Verificar rol de usuario
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user['custom:role'] === role;
  };

  // Verificar plan del usuario
  const hasPlan = (plan) => {
    if (!user) return false;
    return user.plan === plan || user['custom:plan'] === plan;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshSession,
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

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;