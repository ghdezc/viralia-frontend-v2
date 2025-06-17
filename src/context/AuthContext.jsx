// src/context/AuthContext.jsx - Compatible con tu estructura actual
import { createContext, useContext, useState, useEffect } from 'react';
import { cognitoAuthService } from '../services/auth/cognito'; // Usar tu servicio existente
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const authenticated = await cognitoAuthService.isAuthenticated();

      if (authenticated) {
        const userData = await cognitoAuthService.getCurrentUser();
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login usando tu servicio existente
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await cognitoAuthService.signIn(email, password);

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
      setError(error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout usando tu servicio existente
  const logout = async () => {
    try {
      cognitoAuthService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      toast.success('Sesión cerrada correctamente');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      toast.error('Error al cerrar sesión');
      return { success: false, error: error.message };
    }
  };

  // Register usando tu servicio existente
  const register = async (username, email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await cognitoAuthService.signUp(username, email, password, additionalData);

      if (result.success) {
        toast.success('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
        return { success: true, ...result };
      }

      throw new Error(result.error || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Confirmar registro
  const confirmRegistration = async (username, code) => {
    try {
      setLoading(true);
      setError(null);

      const result = await cognitoAuthService.confirmSignUp(username, code);

      if (result.success) {
        toast.success('Cuenta confirmada exitosamente');
        return { success: true };
      }

      throw new Error('Confirmation failed');
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código de confirmación
  const resendConfirmationCode = async (username) => {
    try {
      const result = await cognitoAuthService.resendConfirmationCode(username);

      if (result.success) {
        toast.success('Código reenviado exitosamente');
        return { success: true };
      }

      throw new Error('Resend failed');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (username) => {
    try {
      const result = await cognitoAuthService.forgotPassword(username);

      if (result.success) {
        toast.success('Código de recuperación enviado');
        return { success: true };
      }

      throw new Error('Forgot password failed');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Confirm new password
  const confirmNewPassword = async (username, code, newPassword) => {
    try {
      const result = await cognitoAuthService.confirmForgotPassword(username, code, newPassword);

      if (result.success) {
        toast.success('Contraseña actualizada exitosamente');
        return { success: true };
      }

      throw new Error('Password confirmation failed');
    } catch (error) {
      console.error('Password confirmation error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const result = await cognitoAuthService.changePassword(oldPassword, newPassword);

      if (result.success) {
        toast.success('Contraseña cambiada exitosamente');
        return { success: true };
      }

      throw new Error('Password change failed');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update profile
  const updateProfile = async (attributes) => {
    try {
      const result = await cognitoAuthService.updateUserAttributes(attributes);

      if (result.success) {
        // Actualizar usuario en el estado
        await checkAuthStatus();
        toast.success('Perfil actualizado exitosamente');
        return { success: true };
      }

      throw new Error('Profile update failed');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const result = await cognitoAuthService.refreshSession();

      if (result.success) {
        const userData = await cognitoAuthService.getCurrentUser();
        setUser(userData);
        return { success: true };
      }

      throw new Error('Session refresh failed');
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
    error,
    isAuthenticated,
    login,
    logout,
    register,
    confirmRegistration,
    resendConfirmationCode,
    forgotPassword,
    confirmNewPassword,
    changePassword,
    updateProfile,
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

// Hook personalizado exportado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Export por defecto para compatibilidad
export default AuthContext;