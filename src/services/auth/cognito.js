// src/services/auth/cognito.js
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserAttribute 
} from 'amazon-cognito-identity-js';

// Configuración de Cognito (importada desde la configuración)
const COGNITO_CONFIG = {
  USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_xxxxxxxx',
  CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
};

// Crear pool de usuarios
const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.USER_POOL_ID,
  ClientId: COGNITO_CONFIG.CLIENT_ID,
});

/**
 * Servicio para la autenticación con Cognito de forma segura
 * Implementa:
 * - Autenticación de usuarios
 * - Gestión de sesión
 * - Manejo de errores específicos
 * - Seguridad mejorada
 */
export const cognitoAuthService = {
  /**
   * Iniciar sesión
   * @param {string} username Nombre de usuario o email
   * @param {string} password Contraseña
   * @returns {Promise<Object>} Resultado de la operación
   */
  signIn: (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        // Si estamos en modo desarrollo y no hay configuración real de Cognito, simular el login
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando login exitoso');
          setTimeout(() => {
            resolve({
              success: true,
              user: {
                username,
                email: username,
                name: 'Usuario de Prueba',
                plan: 'free',
                role: 'user'
              }
            });
          }, 1000);
          return;
        }

        // Crear objeto de detalles de autenticación
        const authenticationDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        });

        // Crear objeto de usuario
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool,
        });

        // Autenticar usuario
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            // Obtener tokens
            const accessToken = result.getAccessToken().getJwtToken();
            const idToken = result.getIdToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();

            // Guardar tokens en localStorage (con precaución)
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('idToken', idToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            // Calcular expiración del token (1 hora por defecto)
            const expirationTime = new Date().getTime() + 3600 * 1000;
            localStorage.setItem('tokenExpiration', expirationTime.toString());
            
            // Obtener atributos del usuario
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                console.error('Error getting user attributes:', err);
                resolve({
                  success: true,
                  user: { username }
                });
                return;
              }
              
              const userData = {};
              attributes.forEach(attribute => {
                userData[attribute.getName()] = attribute.getValue();
              });

              resolve({
                success: true,
                user: {
                  ...userData,
                  username: cognitoUser.getUsername()
                }
              });
            });
          },
          onFailure: (err) => {
            reject(mapCognitoError(err));
          },
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            // Este callback se llama cuando el usuario necesita cambiar su contraseña
            resolve({
              success: true,
              requireNewPassword: true,
              userAttributes,
              requiredAttributes
            });
          }
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Registrar nuevo usuario
   * @param {string} username Nombre de usuario
   * @param {string} email Correo electrónico
   * @param {string} password Contraseña
   * @param {Object} additionalData Datos adicionales (nombre, teléfono, etc.)
   * @returns {Promise<Object>} Resultado de la operación
   */
  signUp: (username, email, password, additionalData = {}) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando registro exitoso');
          setTimeout(() => {
            resolve({
              success: true,
              userConfirmed: false,
              username
            });
          }, 1000);
          return;
        }
        
        // Crear atributos del usuario
        const attributeList = [];
        
        // Añadir correo electrónico
        const emailAttribute = new CognitoUserAttribute({
          Name: 'email',
          Value: email
        });
        attributeList.push(emailAttribute);
        
        // Añadir datos adicionales
        Object.entries(additionalData).forEach(([key, value]) => {
          const attribute = new CognitoUserAttribute({
            Name: key,
            Value: value
          });
          attributeList.push(attribute);
        });
        
        // Registrar usuario
        userPool.signUp(username, password, attributeList, null, (err, result) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          resolve({
            success: true,
            userConfirmed: result.userConfirmed,
            username: result.user.getUsername()
          });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Confirmar registro con código
   * @param {string} username Nombre de usuario
   * @param {string} code Código de confirmación
   * @returns {Promise<Object>} Resultado de la operación
   */
  confirmSignUp: (username, code) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando confirmación exitosa');
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool
        });
        
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          resolve({ success: true });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Reenviar código de confirmación
   * @param {string} username Nombre de usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  resendConfirmationCode: (username) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando reenvío de código');
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool
        });
        
        cognitoUser.resendConfirmationCode((err, result) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          resolve({ success: true });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Cerrar sesión
   * @returns {void}
   */
  signOut: () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
      
      // Limpiar tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiration');
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
    }
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {Promise<boolean>} True si está autenticado, false en caso contrario
   */
  isAuthenticated: () => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo - usar localStorage para simular auth
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          // Verificar si hay un token simulado
          const devAuthToken = localStorage.getItem('devAuthToken');
          resolve(!!devAuthToken);
          return;
        }
        
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          resolve(false);
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            // No rechazamos para no interrumpir el flujo de la app
            console.error('Error al verificar sesión:', err);
            resolve(false);
            return;
          }
          
          resolve(session.isValid());
        });
      } catch (error) {
        console.error('Error en verificación de autenticación:', error);
        resolve(false);
      }
    });
  },

  /**
   * Obtener el usuario actual
   * @returns {CognitoUser|null} Usuario actual o null
   */
  getCurrentUser: () => {
    try {
      // Modo simulación para desarrollo
      if (process.env.NODE_ENV === 'development' && 
          (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
           COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
        // Devolver un usuario simulado si hay token de desarrollo
        const devAuthToken = localStorage.getItem('devAuthToken');
        if (devAuthToken) {
          // Crear un objeto que simule CognitoUser
          return {
            getUsername: () => localStorage.getItem('devUsername') || 'dev_user',
            getUserAttributes: (callback) => {
              const attrs = [
                { getName: () => 'email', getValue: () => localStorage.getItem('devEmail') || 'dev@example.com' },
                { getName: () => 'name', getValue: () => localStorage.getItem('devName') || 'Usuario Desarrollo' },
                { getName: () => 'custom:plan', getValue: () => localStorage.getItem('devPlan') || 'free' },
                { getName: () => 'custom:role', getValue: () => localStorage.getItem('devRole') || 'user' }
              ];
              callback(null, attrs);
            }
          };
        }
        return null;
      }
      
      return userPool.getCurrentUser();
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  /**
   * Iniciar proceso de recuperación de contraseña
   * @param {string} username Nombre de usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  forgotPassword: (username) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando solicitud de recuperación de contraseña');
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool
        });
        
        cognitoUser.forgotPassword({
          onSuccess: () => {
            resolve({ success: true });
          },
          onFailure: (err) => {
            reject(mapCognitoError(err));
          }
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Confirmar nueva contraseña con código
   * @param {string} username Nombre de usuario
   * @param {string} code Código de confirmación
   * @param {string} newPassword Nueva contraseña
   * @returns {Promise<Object>} Resultado de la operación
   */
  confirmForgotPassword: (username, code, newPassword) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando confirmación de recuperación de contraseña');
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool
        });
        
        cognitoUser.confirmPassword(code, newPassword, {
          onSuccess: () => {
            resolve({ success: true });
          },
          onFailure: (err) => {
            reject(mapCognitoError(err));
          }
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },

  /**
   * Cambiar contraseña (usuario autenticado)
   * @param {string} oldPassword Contraseña actual
   * @param {string} newPassword Nueva contraseña
   * @returns {Promise<Object>} Resultado de la operación
   */
  changePassword: (oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando cambio de contraseña');
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          reject(new Error('No hay usuario autenticado'));
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
            if (err) {
              reject(mapCognitoError(err));
              return;
            }
            
            resolve({ success: true });
          });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },
  
  /**
   * Actualizar atributos del usuario
   * @param {Object} attributes Atributos a actualizar
   * @returns {Promise<Object>} Resultado de la operación
   */
  updateUserAttributes: (attributes) => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando actualización de atributos');
          
          // Almacenar los atributos en localStorage para simulación
          Object.entries(attributes).forEach(([key, value]) => {
            localStorage.setItem(`dev${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
          });
          
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
          return;
        }
        
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          reject(new Error('No hay usuario autenticado'));
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          const attributeList = Object.entries(attributes).map(([key, value]) => {
            return new CognitoUserAttribute({
              Name: key,
              Value: value
            });
          });
          
          cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
              reject(mapCognitoError(err));
              return;
            }
            
            resolve({ success: true });
          });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },
  
  /**
   * Refrescar token de sesión
   * @returns {Promise<Object>} Tokens de sesión actualizados
   */
  refreshSession: () => {
    return new Promise((resolve, reject) => {
      try {
        // Modo simulación para desarrollo
        if (process.env.NODE_ENV === 'development' && 
            (COGNITO_CONFIG.USER_POOL_ID === 'us-east-1_xxxxxxxx' || 
             COGNITO_CONFIG.CLIENT_ID === 'xxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          console.log('Modo desarrollo: simulando refreshToken');
          
          // Actualizar el token simulado
          localStorage.setItem('devAuthToken', Date.now().toString());
          
          setTimeout(() => {
            resolve({ 
              success: true, 
              accessToken: 'dev_access_token_' + Date.now(),
              idToken: 'dev_id_token_' + Date.now()
            });
          }, 500);
          return;
        }
        
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          reject(new Error('No hay usuario autenticado'));
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(mapCognitoError(err));
            return;
          }
          
          // Obtener refresh token almacenado
          const refreshToken = session.getRefreshToken();
          
          cognitoUser.refreshSession(refreshToken, (err, session) => {
            if (err) {
              reject(mapCognitoError(err));
              return;
            }
            
            // Actualizar tokens en localStorage
            const accessToken = session.getAccessToken().getJwtToken();
            const idToken = session.getIdToken().getJwtToken();
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('idToken', idToken);
            
            // Actualizar expiración del token
            const expirationTime = new Date().getTime() + 3600 * 1000;
            localStorage.setItem('tokenExpiration', expirationTime.toString());
            
            resolve({
              success: true,
              accessToken,
              idToken
            });
          });
        });
      } catch (error) {
        reject(mapCognitoError(error));
      }
    });
  },
  
  /**
   * Inicializar el servicio con un usuario de desarrollo
   * Solo funciona en modo desarrollo
   */
  initDevUser: (userData = {}) => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('devAuthToken', Date.now().toString());
      localStorage.setItem('devUsername', userData.username || 'dev_user');
      localStorage.setItem('devEmail', userData.email || 'dev@example.com');
      localStorage.setItem('devName', userData.name || 'Usuario Desarrollo');
      localStorage.setItem('devPlan', userData.plan || 'free');
      localStorage.setItem('devRole', userData.role || 'user');
      
      console.log('Modo desarrollo: usuario simulado inicializado');
      return true;
    }
    return false;
  }
};

/**
 * Mapear errores de Cognito a mensajes más amigables
 * @param {Error} error Error de Cognito
 * @returns {Error} Error con mensaje amigable
 */
function mapCognitoError(error) {
  let message = 'Error desconocido';
  
  if (error.message) {
    // Mapeo de errores comunes de Cognito
    switch (error.code || error.name) {
      case 'NotAuthorizedException':
        message = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
        break;
      case 'UserNotFoundException':
        message = 'No existe un usuario con ese correo o nombre de usuario.';
        break;
      case 'UsernameExistsException':
        message = 'Ya existe un usuario con ese correo o nombre de usuario.';
        break;
      case 'CodeMismatchException':
        message = 'El código ingresado es incorrecto.';
        break;
      case 'ExpiredCodeException':
        message = 'El código ha expirado. Solicita uno nuevo.';
        break;
      case 'InvalidPasswordException':
        message = 'La contraseña no cumple los requisitos de seguridad.';
        break;
      case 'LimitExceededException':
        message = 'Has excedido el límite de intentos. Intenta más tarde.';
        break;
      default:
        // Si hay un mensaje de error, usarlo
        message = error.message;
    }
  }
  
  const mappedError = new Error(message);
  mappedError.originalError = error;
  return mappedError;
}