// src/services/auth/cognito.js - VERSIÓN LIMPIA SIN ERRORES
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

// Configuración desde .env
const COGNITO_CONFIG = {
  USER_POOL_ID: import.meta.env.VITE_COGNITO_POOL_ID || 'us-east-1_Cs50bmhCD',
  CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || '285uke1u9affrh8phcievcoep7',
  REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
};

console.log('🔐 Cognito Config:', COGNITO_CONFIG);

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.USER_POOL_ID,
  ClientId: COGNITO_CONFIG.CLIENT_ID,
});

class CognitoService {
  constructor() {
    this.currentUser = null;
    this.tokens = {};
  }

  // LOGIN principal
  async signIn(email, password) {
    console.log('🔑 Intentando login con:', email);
    console.log('🔑 Password length:', password.length);
    console.log('🔑 Password has special chars:', /[!@#$%^&*(),.?":{}|<>]/.test(password));

    return new Promise((resolve, reject) => {
      const cleanEmail = email.trim().toLowerCase();

      const authDetails = new AuthenticationDetails({
        Username: cleanEmail,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: cleanEmail,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log('✅ Login exitoso');

          this.tokens = {
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          };

          this._saveTokens();

          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.warn('⚠️ Error obteniendo atributos:', err);
              resolve({
                success: true,
                user: {
                  username: cognitoUser.getUsername(),
                  email: cleanEmail
                }
              });
              return;
            }

            const userData = this._parseAttributes(attributes);
            this.currentUser = {
              ...userData,
              username: cognitoUser.getUsername()
            };

            resolve({
              success: true,
              user: this.currentUser
            });
          });
        },

        onFailure: (err) => {
          console.error('❌ Login falló:', err);
          reject(this._mapError(err));
        },

        newPasswordRequired: (userAttributes) => {
          console.log('🔄 Nueva contraseña requerida');
          resolve({
            success: true,
            requireNewPassword: true,
            userAttributes
          });
        }
      });
    });
  }

  // Verificar si está autenticado
  async isAuthenticated() {
    try {
      const tokens = this._getStoredTokens();
      if (!tokens || this._isTokenExpired(tokens)) {
        console.log('❌ No hay tokens válidos');
        this._clearTokens();
        return false;
      }

      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        console.log('❌ No hay usuario en Cognito');
        this._clearTokens();
        return false;
      }

      return new Promise((resolve) => {
        cognitoUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            console.log('❌ Sesión inválida:', err);
            this._clearTokens();
            resolve(false);
            return;
          }

          console.log('✅ Sesión válida');
          this.tokens = {
            idToken: session.getIdToken().getJwtToken(),
            accessToken: session.getAccessToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken()
          };
          this._saveTokens();
          resolve(true);
        });
      });
    } catch (error) {
      console.error('❌ Error verificando auth:', error);
      this._clearTokens();
      return false;
    }
  }

  // Obtener usuario actual
  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      return null;
    }

    return new Promise((resolve) => {
      cognitoUser.getSession((err, session) => {
        if (err || !session.isValid()) {
          resolve(null);
          return;
        }

        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            resolve({
              username: cognitoUser.getUsername()
            });
            return;
          }

          const userData = this._parseAttributes(attributes);
          this.currentUser = {
            ...userData,
            username: cognitoUser.getUsername()
          };

          resolve(this.currentUser);
        });
      });
    });
  }

  // Cerrar sesión
  signOut() {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
    } catch (error) {
      console.warn('⚠️ Error en signOut:', error);
    } finally {
      this._clearTokens();
      this.currentUser = null;
      console.log('✅ Sesión cerrada');
    }
  }

  // Refrescar sesión
  async refreshSession() {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      throw new Error('No hay usuario autenticado');
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          this._clearTokens();
          reject(err);
          return;
        }

        if (session.isValid()) {
          this.tokens = {
            idToken: session.getIdToken().getJwtToken(),
            accessToken: session.getAccessToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken()
          };
          this._saveTokens();
          resolve({ success: true });
        } else {
          this._clearTokens();
          reject(new Error('Sesión inválida'));
        }
      });
    });
  }

  // Obtener headers para API
  getAuthHeaders() {
    const tokens = this._getStoredTokens();
    if (!tokens?.idToken) {
      return {};
    }

    return {
      'Authorization': 'Bearer ' + tokens.idToken,
      'X-API-Key': import.meta.env.VITE_API_KEY,
      'Content-Type': 'application/json'
    };
  }

  // Métodos privados
  _saveTokens() {
    try {
      const tokenData = {
        ...this.tokens,
        expiration: Date.now() + (60 * 60 * 1000),
        timestamp: Date.now()
      };
      localStorage.setItem('viralia_auth', JSON.stringify(tokenData));
      console.log('💾 Tokens guardados');
    } catch (error) {
      console.error('❌ Error guardando tokens:', error);
    }
  }

  _getStoredTokens() {
    try {
      const stored = localStorage.getItem('viralia_auth');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('❌ Error leyendo tokens:', error);
      return null;
    }
  }

  _isTokenExpired(tokenData) {
    if (!tokenData.expiration) return true;
    return Date.now() > tokenData.expiration;
  }

  _clearTokens() {
    this.tokens = {};
    try {
      localStorage.removeItem('viralia_auth');
      sessionStorage.clear();
    } catch (error) {
      console.warn('⚠️ Error limpiando tokens:', error);
    }
  }

  _parseAttributes(attributes) {
    const userData = {};
    if (attributes) {
      attributes.forEach(attr => {
        userData[attr.getName()] = attr.getValue();
      });
    }
    return userData;
  }

  _mapError(error) {
    const errorMap = {
      'NotAuthorizedException': 'Email o contraseña incorrectos',
      'UserNotFoundException': 'Usuario no encontrado',
      'UserNotConfirmedException': 'Usuario no confirmado. Revisa tu email.',
      'PasswordResetRequiredException': 'Es necesario cambiar la contraseña',
      'InvalidPasswordException': 'Contraseña inválida',
      'LimitExceededException': 'Demasiados intentos. Intenta más tarde.',
      'TooManyRequestsException': 'Demasiadas solicitudes. Espera un momento.',
    };

    const message = errorMap[error.code] || error.message || 'Error de autenticación';
    console.error('🚨 Error mapeado:', message);

    return new Error(message);
  }
}

// Instancia singleton
export const cognitoService = new CognitoService();
export default cognitoService;