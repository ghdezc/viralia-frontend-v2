// src/services/auth/cognito.js - Arreglar persistencia de sesión
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

// Configuración desde variables de entorno
const COGNITO_CONFIG = {
  USER_POOL_ID: import.meta.env.VITE_COGNITO_POOL_ID || 'us-east-1_Cs50bmhCD',
  CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || '285uke1u9affrh8phcievcoep7',
  REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
};

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.USER_POOL_ID,
  ClientId: COGNITO_CONFIG.CLIENT_ID,
});

export const cognitoAuthService = {
  // Iniciar sesión
  signIn: (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        const authenticationDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        });

        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: userPool,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            // Obtener tokens
            const accessToken = result.getAccessToken().getJwtToken();
            const idToken = result.getIdToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();

            // Guardar tokens de forma persistente
            const tokenData = {
              accessToken,
              idToken,
              refreshToken,
              expiration: new Date().getTime() + (60 * 60 * 1000), // 1 hora
              timestamp: new Date().getTime()
            };

            localStorage.setItem('viralia_auth', JSON.stringify(tokenData));

            // Obtener atributos del usuario
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                console.error('Error getting user attributes:', err);
                resolve({
                  success: true,
                  user: { username: cognitoUser.getUsername() }
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

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return new Promise((resolve) => {
      try {
        // Verificar tokens en localStorage primero
        const storedTokens = localStorage.getItem('viralia_auth');
        if (!storedTokens) {
          resolve(false);
          return;
        }

        const tokenData = JSON.parse(storedTokens);

        // Verificar si el token ha expirado
        if (tokenData.expiration < new Date().getTime()) {
          localStorage.removeItem('viralia_auth');
          resolve(false);
          return;
        }

        // Verificar con Cognito
        const cognitoUser = userPool.getCurrentUser();

        if (!cognitoUser) {
          localStorage.removeItem('viralia_auth');
          resolve(false);
          return;
        }

        cognitoUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            localStorage.removeItem('viralia_auth');
            resolve(false);
            return;
          }

          // Actualizar tokens si la sesión es válida
          const newTokenData = {
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
            expiration: new Date().getTime() + (60 * 60 * 1000),
            timestamp: new Date().getTime()
          };

          localStorage.setItem('viralia_auth', JSON.stringify(newTokenData));
          resolve(true);
        });
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('viralia_auth');
        resolve(false);
      }
    });
  },

  // Obtener el usuario actual
  getCurrentUser: () => {
    return new Promise((resolve) => {
      try {
        const cognitoUser = userPool.getCurrentUser();

        if (!cognitoUser) {
          resolve(null);
          return;
        }

        cognitoUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            resolve(null);
            return;
          }

          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              resolve({ username: cognitoUser.getUsername() });
              return;
            }

            const userData = {};
            attributes.forEach(attr => {
              userData[attr.getName()] = attr.getValue();
            });

            resolve({
              ...userData,
              username: cognitoUser.getUsername()
            });
          });
        });
      } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        resolve(null);
      }
    });
  },

  // Cerrar sesión
  signOut: () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }

      // Limpiar tokens
      localStorage.removeItem('viralia_auth');
      sessionStorage.clear();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      // Asegurar que se limpien los tokens aunque haya error
      localStorage.removeItem('viralia_auth');
      sessionStorage.clear();
    }
  },

  // Refrescar sesión
  refreshSession: () => {
    return new Promise((resolve, reject) => {
      try {
        const cognitoUser = userPool.getCurrentUser();

        if (!cognitoUser) {
          reject(new Error('No hay usuario autenticado'));
          return;
        }

        cognitoUser.getSession((err, session) => {
          if (err) {
            localStorage.removeItem('viralia_auth');
            reject(err);
            return;
          }

          if (session.isValid()) {
            // Actualizar tokens
            const tokenData = {
              accessToken: session.getAccessToken().getJwtToken(),
              idToken: session.getIdToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
              expiration: new Date().getTime() + (60 * 60 * 1000),
              timestamp: new Date().getTime()
            };

            localStorage.setItem('viralia_auth', JSON.stringify(tokenData));
            resolve({ success: true });
          } else {
            localStorage.removeItem('viralia_auth');
            reject(new Error('Sesión inválida'));
          }
        });
      } catch (error) {
        localStorage.removeItem('viralia_auth');
        reject(error);
      }
    });
  },

  // Resto de métodos (registro, confirmación, etc.)
  signUp: (username, email, password, additionalData = {}) => {
    return new Promise((resolve, reject) => {
      try {
        const attributeList = [];

        const emailAttribute = new CognitoUserAttribute({
          Name: 'email',
          Value: email
        });
        attributeList.push(emailAttribute);

        Object.entries(additionalData).forEach(([key, value]) => {
          const attribute = new CognitoUserAttribute({
            Name: key,
            Value: value
          });
          attributeList.push(attribute);
        });

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
  }
};

// Mapear errores de Cognito
function mapCognitoError(error) {
  let message = 'Error desconocido';

  if (error.message) {
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
        message = error.message;
    }
  }

  const mappedError = new Error(message);
  mappedError.originalError = error;
  return mappedError;
}