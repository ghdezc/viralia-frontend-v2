// src/hooks/useAuth.js
import { useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext'; // Importación por defecto

/**
 * Hook personalizado para manejar la autenticación
 * - Implementa mejores prácticas de seguridad
 * - Proporciona funciones para todas las operaciones de autenticación
 * - Incluye manejo de tokens con expiración
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  const { 
    user, 
    loading, 
    error,
    isAuthenticated,
    login: contextLogin,
    logout: contextLogout,
    register: contextRegister,
    confirmRegistration: contextConfirmRegistration,
    forgotPassword: contextForgotPassword,
    confirmNewPassword: contextConfirmNewPassword,
    changePassword: contextChangePassword,
    updateProfile: contextUpdateProfile,
    refreshSession: contextRefreshSession,
    resendConfirmationCode: contextResendConfirmationCode,
  } = context;

  // Versión mejorada de la función de login con validación adicional
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'El correo y la contraseña son requeridos' };
    }
    
    try {
      // Sanitizar email (prevenir inyección)
      const sanitizedEmail = email.trim().toLowerCase();
      
      return await contextLogin(sanitizedEmail, password);
    } catch (err) {
      console.error('Error en login:', err);
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    }
  }, [contextLogin]);

  // Versión mejorada de la función de registro
  const register = useCallback(async (username, email, password, additionalData = {}) => {
    try {
      // Sanitizar email y username
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedUsername = username.trim().toLowerCase();
      
      return await contextRegister(sanitizedUsername, sanitizedEmail, password, additionalData);
    } catch (err) {
      console.error('Error en registro:', err);
      return { success: false, error: err.message || 'Error al registrarse' };
    }
  }, [contextRegister]);

  // Cierre de sesión con limpieza
  const logout = useCallback(async () => {
    try {
      // Limpiar datos de sesión adicionales si existen
      sessionStorage.removeItem('lastActivity');
      localStorage.removeItem('rememberMe');
      
      return await contextLogout();
    } catch (err) {
      console.error('Error en logout:', err);
      return { success: false, error: err.message || 'Error al cerrar sesión' };
    }
  }, [contextLogout]);

  // Verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role || user['custom:role'] === role;
  }, [user]);

  // Confirmar registro
  const confirmRegistration = useCallback(async (username, code) => {
    try {
      const sanitizedUsername = username.trim().toLowerCase();
      return await contextConfirmRegistration(sanitizedUsername, code);
    } catch (err) {
      console.error('Error confirmando registro:', err);
      return { success: false, error: err.message || 'Error al confirmar el registro' };
    }
  }, [contextConfirmRegistration]);

  // Implementar recuperación de contraseña
  const forgotPassword = useCallback(async (email) => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      return await contextForgotPassword(sanitizedEmail);
    } catch (err) {
      console.error('Error en recuperación de contraseña:', err);
      return { success: false, error: err.message || 'Error al solicitar recuperación de contraseña' };
    }
  }, [contextForgotPassword]);

  // Confirmar nueva contraseña después de recuperación
  const confirmNewPassword = useCallback(async (username, code, newPassword) => {
    try {
      const sanitizedUsername = username.trim().toLowerCase();
      return await contextConfirmNewPassword(sanitizedUsername, code, newPassword);
    } catch (err) {
      console.error('Error confirmando nueva contraseña:', err);
      return { success: false, error: err.message || 'Error al confirmar la nueva contraseña' };
    }
  }, [contextConfirmNewPassword]);

  // Cambiar contraseña (estando autenticado)
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    return await contextChangePassword(oldPassword, newPassword);
  }, [contextChangePassword]);

  // Actualizar perfil de usuario
  const updateProfile = useCallback(async (attributes) => {
    return await contextUpdateProfile(attributes);
  }, [contextUpdateProfile]);

  // Refrescar sesión
  const refreshSession = useCallback(async () => {
    return await contextRefreshSession();
  }, [contextRefreshSession]);

  // Reenviar código de confirmación
  const resendConfirmationCode = useCallback(async (username) => {
    try {
      const sanitizedUsername = username.trim().toLowerCase();
      return await contextResendConfirmationCode(sanitizedUsername);
    } catch (err) {
      console.error('Error reenviando código:', err);
      return { success: false, error: err.message || 'Error al reenviar el código' };
    }
  }, [contextResendConfirmationCode]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    hasRole,
    login,
    logout,
    register,
    confirmRegistration,
    resendConfirmationCode,
    forgotPassword,
    confirmNewPassword,
    changePassword,
    updateProfile,
    refreshSession
  };
};