// src/services/auth/cognitoAuth.js - Autenticación segura
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute
} from 'amazon-cognito-identity-js';

// Configuración segura desde variables de entorno
const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_POOL_ID, // us-east-1_Cs50bmhCD
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID   // 285uke1u9affrh8phcievcoep7
};

const userPool = new CognitoUserPool(poolData);

class CognitoAuthService {
    constructor() {
        this.currentUser = null;
        this.tokens = {
            idToken: null,
            accessToken: null,
            refreshToken: null
        };
    }

    // Login principal con validación robusta
    async signIn(username, password) {
        return new Promise((resolve, reject) => {
            // Sanitizar entrada
            const sanitizedUsername = username.trim().toLowerCase();

            const authenticationDetails = new AuthenticationDetails({
                Username: sanitizedUsername,
                Password: password,
            });

            const cognitoUser = new CognitoUser({
                Username: sanitizedUsername,
                Pool: userPool,
            });

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    // Extraer tokens de forma segura
                    this.tokens = {
                        idToken: result.getIdToken().getJwtToken(),
                        accessToken: result.getAccessToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken()
                    };

                    // Almacenar tokens de forma segura
                    this.storeTokensSecurely();

                    // Obtener atributos del usuario
                    cognitoUser.getUserAttributes((err, attributes) => {
                        if (err) {
                            console.error('Error getting user attributes:', err);
                            resolve({
                                success: true,
                                user: { username: sanitizedUsername },
                                tokens: this.tokens
                            });
                            return;
                        }

                        const userData = {};
                        attributes.forEach(attribute => {
                            userData[attribute.getName()] = attribute.getValue();
                        });

                        this.currentUser = {
                            ...userData,
                            username: cognitoUser.getUsername()
                        };

                        resolve({
                            success: true,
                            user: this.currentUser,
                            tokens: this.tokens
                        });
                    });
                },
                onFailure: (err) => {
                    reject(this.mapCognitoError(err));
                },
                newPasswordRequired: (userAttributes, requiredAttributes) => {
                    resolve({
                        success: true,
                        requireNewPassword: true,
                        userAttributes,
                        requiredAttributes,
                        cognitoUser
                    });
                }
            });
        });
    }

    // Verificar si está autenticado
    async isAuthenticated() {
        try {
            // Verificar tokens almacenados
            const storedTokens = this.getStoredTokens();
            if (!storedTokens) return false;

            // Verificar expiración
            if (this.isTokenExpired(storedTokens)) {
                this.clearTokens();
                return false;
            }

            // Verificar con Cognito
            const currentUser = userPool.getCurrentUser();
            if (!currentUser) return false;

            return new Promise((resolve) => {
                currentUser.getSession((err, session) => {
                    if (err || !session.isValid()) {
                        this.clearTokens();
                        resolve(false);
                        return;
                    }

                    // Actualizar tokens si la sesión es válida
                    this.tokens = {
                        idToken: session.getIdToken().getJwtToken(),
                        accessToken: session.getAccessToken().getJwtToken(),
                        refreshToken: session.getRefreshToken().getToken()
                    };

                    this.storeTokensSecurely();
                    resolve(true);
                });
            });
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }

    // Obtener usuario actual
    async getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        const currentUser = userPool.getCurrentUser();
        if (!currentUser) return null;

        return new Promise((resolve) => {
            currentUser.getUserAttributes((err, attributes) => {
                if (err) {
                    resolve(null);
                    return;
                }

                const userData = {};
                attributes.forEach(attr => {
                    userData[attr.getName()] = attr.getValue();
                });

                this.currentUser = {
                    ...userData,
                    username: currentUser.getUsername()
                };

                resolve(this.currentUser);
            });
        });
    }

    // Cerrar sesión de forma segura
    signOut() {
        try {
            const currentUser = userPool.getCurrentUser();
            if (currentUser) {
                currentUser.signOut();
            }
        } catch (error) {
            console.warn('Logout warning:', error);
        } finally {
            this.clearTokens();
            this.currentUser = null;
        }
    }

    // Refrescar tokens automáticamente
    async refreshTokens() {
        try {
            const currentUser = userPool.getCurrentUser();
            if (!currentUser) throw new Error('No current user');

            return new Promise((resolve, reject) => {
                currentUser.getSession((err, session) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (session.isValid()) {
                        this.tokens = {
                            idToken: session.getIdToken().getJwtToken(),
                            accessToken: session.getAccessToken().getJwtToken(),
                            refreshToken: session.getRefreshToken().getToken()
                        };

                        this.storeTokensSecurely();
                        resolve(this.tokens);
                    } else {
                        reject(new Error('Invalid session'));
                    }
                });
            });
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    }

    // Almacenar tokens de forma segura
    storeTokensSecurely() {
        try {
            const expirationTime = new Date().getTime() + (60 * 60 * 1000); // 1 hora

            const tokenData = {
                ...this.tokens,
                expiration: expirationTime,
                timestamp: new Date().getTime()
            };

            localStorage.setItem('viralia_auth', JSON.stringify(tokenData));

            // Auto-refresh antes de que expire
            this.scheduleTokenRefresh();
        } catch (error) {
            console.error('Error storing tokens:', error);
        }
    }

    // Obtener tokens almacenados
    getStoredTokens() {
        try {
            const stored = localStorage.getItem('viralia_auth');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading tokens:', error);
            return null;
        }
    }

    // Verificar si el token ha expirado
    isTokenExpired(tokenData) {
        if (!tokenData.expiration) return true;
        return new Date().getTime() > tokenData.expiration;
    }

    // Programar refresh automático
    scheduleTokenRefresh() {
        // Refresh 5 minutos antes de expirar
        const refreshTime = 55 * 60 * 1000;

        setTimeout(async () => {
            try {
                await this.refreshTokens();
                console.log('Tokens refreshed automatically');
            } catch (error) {
                console.warn('Auto-refresh failed:', error);
                this.signOut();
            }
        }, refreshTime);
    }

    // Limpiar tokens
    clearTokens() {
        this.tokens = { idToken: null, accessToken: null, refreshToken: null };

        try {
            localStorage.removeItem('viralia_auth');
            sessionStorage.clear();
        } catch (error) {
            console.warn('Error clearing tokens:', error);
        }
    }

    // Obtener headers para API calls
    getAuthHeaders() {
        const tokens = this.getStoredTokens();
        if (!tokens?.idToken) return {};

        return {
            'Authorization': `Bearer ${tokens.idToken}`,
            'X-API-Key': import.meta.env.VITE_API_KEY,
            'Content-Type': 'application/json'
        };
    }

    // Mapear errores de Cognito a mensajes amigables
    mapCognitoError(error) {
        const errorMessages = {
            'NotAuthorizedException': 'Credenciales incorrectas. Verifica tu email y contraseña.',
            'UserNotFoundException': 'Usuario no encontrado. Verifica tu email.',
            'UserNotConfirmedException': 'Por favor confirma tu cuenta desde el email enviado.',
            'PasswordResetRequiredException': 'Es necesario restablecer tu contraseña.',
            'InvalidPasswordException': 'La contraseña no cumple con los requisitos.',
            'LimitExceededException': 'Demasiados intentos. Intenta más tarde.',
            'TooManyRequestsException': 'Demasiadas solicitudes. Espera un momento.',
            'NetworkError': 'Error de conexión. Verifica tu internet.'
        };

        const message = errorMessages[error.code] || error.message || 'Error de autenticación';

        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.error('Cognito Error:', error);
        }

        return new Error(message);
    }

    // Registro de usuario (para casos futuros)
    async signUp(username, email, password, attributes = {}) {
        return new Promise((resolve, reject) => {
            const attributeList = [
                new CognitoUserAttribute({ Name: 'email', Value: email })
            ];

            // Añadir atributos adicionales
            Object.entries(attributes).forEach(([key, value]) => {
                attributeList.push(new CognitoUserAttribute({ Name: key, Value: value }));
            });

            userPool.signUp(username, password, attributeList, null, (err, result) => {
                if (err) {
                    reject(this.mapCognitoError(err));
                    return;
                }

                resolve({
                    success: true,
                    userConfirmed: result.userConfirmed,
                    username: result.user.getUsername()
                });
            });
        });
    }
}

// Instancia singleton
export const cognitoAuth = new CognitoAuthService();
export default cognitoAuth;