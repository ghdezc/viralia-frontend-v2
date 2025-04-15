// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { cognitoAuthService } from '../services/auth/cognito';
import { useToast } from './ToastContext';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Comprobar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        const isAuthenticated = await cognitoAuthService.isAuthenticated();
        
        if (isAuthenticated) {
          // Obtener usuario actual de Cognito
          const currentUser = cognitoAuthService.getCurrentUser();
          
          // Obtener atributos del usuario
          if (currentUser) {
            currentUser.getUserAttributes((err, attributes) => {
              if (err) {
                console.error('Error getting user attributes:', err);
                setUser(null);
                return;
              }
              
              const userData = {};
              if (attributes) {
                attributes.forEach(attr => {
                  userData[attr.getName()] = attr.getValue();
                });
              }
              
              setUser({
                ...userData,
                username: currentUser.getUsername(),
              });
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Iniciar sesión
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await cognitoAuthService.signIn(username, password);
      
      if (result.success) {
        if (result.requireNewPassword) {
          // Manejar caso de cambio de contraseña requerido
          return {
            success: true,
            requireNewPassword: true,
            userAttributes: result.userAttributes,
            requiredAttributes: result.requiredAttributes,
          };
        }
        
        setUser(result.user);
        toast.success('Inicio de sesión exitoso');
        return { success: true };
      } else {
        throw new Error('Inicio de sesión fallido');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al iniciar sesión');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (username, email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await cognitoAuthService.signUp(
        username,
        email,
        password,
        additionalData
      );
      
      if (result.success) {
        toast.success('Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta.');
        return { 
          success: true, 
          userConfirmed: result.userConfirmed,
          username: result.username
        };
      } else {
        throw new Error('Registro fallido');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al registrarse');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Confirmar registro
  const confirmRegistration = async (username, confirmationCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await cognitoAuthService.confirmSignUp(username, confirmationCode);
      
      toast.success('Cuenta confirmada exitosamente. Ahora puedes iniciar sesión.');
      return { success: true };
    } catch (err) {
      console.error('Confirmation error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al confirmar la cuenta');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código de confirmación
  const resendConfirmationCode = async (username) => {
    try {
      setLoading(true);
      setError(null);
      
      await cognitoAuthService.resendConfirmationCode(username);
      
      toast.success('Se ha enviado un nuevo código de confirmación a tu correo');
      return { success: true };
    } catch (err) {
      console.error('Resend code error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al reenviar el código');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      cognitoAuthService.signOut();
      setUser(null);
      toast.success('Has cerrado sesión');
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al cerrar sesión');
      return { success: false, error: err.message };
    }
  };

  // Olvidé mi contraseña
  const forgotPassword = async (username) => {
    try {
      setLoading(true);
      setError(null);
      
      await cognitoAuthService.forgotPassword(username);
      
      toast.success('Se ha enviado un código para restablecer tu contraseña');
      return { success: true };
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al solicitar recuperación de contraseña');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Confirmar nueva contraseña
  const confirmNewPassword = async (username, code, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await cognitoAuthService.confirmForgotPassword(username, code, newPassword);
      
      toast.success('Contraseña actualizada exitosamente');
      return { success: true };
    } catch (err) {
      console.error('Confirm new password error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al confirmar nueva contraseña');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña (usuario autenticado)
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await cognitoAuthService.changePassword(oldPassword, newPassword);
      
      toast.success('Contraseña cambiada exitosamente');
      return { success: true };
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al cambiar contraseña');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (attributes) => {
    try {
      setLoading(true);
      setError(null);
      
      await cognitoAuthService.updateUserAttributes(attributes);
      
      // Actualizar usuario local
      setUser(prev => ({
        ...prev,
        ...attributes,
      }));
      
      toast.success('Perfil actualizado exitosamente');
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      toast.error(err.message || 'Error al actualizar el perfil');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Refrescar sesión
  const refreshSession = async () => {
    try {
      const result = await cognitoAuthService.refreshSession();
      return { success: true, ...result };
    } catch (err) {
      console.error('Session refresh error:', err);
      // Si falla el refresh, probablemente la sesión expiró
      setUser(null);
      setError('La sesión ha expirado. Por favor inicia sesión nuevamente.');
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    confirmRegistration,
    resendConfirmationCode,
    logout,
    forgotPassword,
    confirmNewPassword,
    changePassword,
    updateProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}