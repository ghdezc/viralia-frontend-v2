// src/services/auth/cognito.js
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserAttribute 
} from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from '../../config/cognito-config';

// Configuración de Cognito
const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.USER_POOL_ID,
  ClientId: COGNITO_CONFIG.CLIENT_ID,
});

/**
 * Servicio para la autenticación con AWS Cognito
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
          reject(err);
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
          reject(err);
          return;
        }
        
        resolve({
          success: true,
          userConfirmed: result.userConfirmed,
          username: result.user.getUsername()
        });
      });
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
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });
      
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({ success: true });
      });
    });
  },

  /**
   * Reenviar código de confirmación
   * @param {string} username Nombre de usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  resendConfirmationCode: (username) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });
      
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({ success: true });
      });
    });
  },

  /**
   * Cerrar sesión
   * @returns {void}
   */
  signOut: () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
    }
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {Promise<boolean>} True si está autenticado, false en caso contrario
   */
  isAuthenticated: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        resolve(false);
        return;
      }
      
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(session.isValid());
      });
    });
  },

  /**
   * Obtener el usuario actual
   * @returns {CognitoUser|null} Usuario actual o null
   */
  getCurrentUser: () => {
    return userPool.getCurrentUser();
  },

  /**
   * Iniciar proceso de recuperación de contraseña
   * @param {string} username Nombre de usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  forgotPassword: (username) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });
      
      cognitoUser.forgotPassword({
        onSuccess: () => {
          resolve({ success: true });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
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
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });
      
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          resolve({ success: true });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
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
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No hay usuario autenticado'));
        return;
      }
      
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        
        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ success: true });
        });
      });
    });
  },
  
  /**
   * Actualizar atributos del usuario
   * @param {Object} attributes Atributos a actualizar
   * @returns {Promise<Object>} Resultado de la operación
   */
  updateUserAttributes: (attributes) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No hay usuario autenticado'));
        return;
      }
      
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
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
            reject(err);
            return;
          }
          
          resolve({ success: true });
        });
      });
    });
  },
  
  /**
   * Refrescar token de sesión
   * @returns {Promise<Object>} Tokens de sesión actualizados
   */
  refreshSession: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No hay usuario autenticado'));
        return;
      }
      
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Obtener refresh token almacenado
        const refreshToken = session.getRefreshToken();
        
        cognitoUser.refreshSession(refreshToken, (err, session) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Actualizar tokens en localStorage
          const accessToken = session.getAccessToken().getJwtToken();
          const idToken = session.getIdToken().getJwtToken();
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('idToken', idToken);
          
          resolve({
            success: true,
            accessToken,
            idToken
          });
        });
      });
    });
  }
};
