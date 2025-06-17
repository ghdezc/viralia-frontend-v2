// src/services/auth/secureAuth.js
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { sanitizeInput } from '../utils/security';

// Configuración segura con validación
const AUTH_CONFIG = {
    userPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
    apiKey: import.meta.env.VITE_API_KEY
};

// Validar configuración crítica
if (!AUTH_CONFIG.userPoolId || !AUTH_CONFIG.clientId) {
    console.error('❌ Configuración de Cognito incompleta');
}

const userPool = new CognitoUserPool({
    UserPoolId: AUTH_CONFIG.userPoolId,
    ClientId: AUTH_CONFIG.clientId
});

class SecureAuthService {
    constructor() {
        this.currentUser = null;
        this.tokens = {
            idToken: null,
            accessToken: null,
            refreshToken: null
        };
    }

    // Autenticación principal con máxima seguridad
    async signIn(email, password) {
        try {
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());

            return new Promise((resolve, reject) => {
                const authDetails = new AuthenticationDetails({
                    Username: sanitizedEmail,
                    Password: password
                });

                const cognitoUser = new CognitoUser({
                    Username: sanitizedEmail,
                    Pool: userPool
                });

                cognitoUser.authenticateUser(authDetails, {
                    onSuccess: (result) => {
                        this.tokens = {
                            idToken: result.getIdToken().getJwtToken(),
                            accessToken: result.getAccessToken().getJwtToken(),
                            refreshToken: result.getRefreshToken().getToken()
                        };

                        // Almacenamiento seguro de tokens
                        this.secureTokenStorage();

                        cognitoUser.getUserAttributes((err, attributes) => {
                            const userData = this.parseUserAttributes(attributes);

                            resolve({
                                success: true,
                                user: { ...userData, username: cognitoUser.getUsername() },
                                tokens: this.tokens
                            });
                        });
                    },
                    onFailure: (err) => reject(this.mapSecurityError(err)),
                    newPasswordRequired: (userAttributes) => {
                        resolve({
                            success: true,
                            requireNewPassword: true,
                            userAttributes,
                            tempUser: cognitoUser
                        });
                    }
                });
            });
        } catch (error) {
            throw this.mapSecurityError(error);
        }
    }

    // Registro con validación exhaustiva
    async signUp(email, password, userData = {}) {
        try {
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());

            return new Promise((resolve, reject) => {
                const attributeList = [
                    new CognitoUserAttribute({ Name: 'email', Value: sanitizedEmail })
                ];

                // Añadir atributos seguros
                Object.entries(userData).forEach(([key, value]) => {
                    if (this.isAllowedAttribute(key)) {
                        attributeList.push(new CognitoUserAttribute({
                            Name: key,
                            Value: sanitizeInput(value)
                        }));
                    }
                });

                userPool.signUp(sanitizedEmail, password, attributeList, null, (err, result) => {
                    if (err) {
                        reject(this.mapSecurityError(err));
                        return;
                    }

                    resolve({
                        success: true,
                        userConfirmed: result.userConfirmed,
                        username: result.user.getUsername()
                    });
                });
            });
        } catch (error) {
            throw this.mapSecurityError(error);
        }
    }

    // Validación y refrescado seguro de tokens
    async refreshSession() {
        try {
            const currentUser = userPool.getCurrentUser();
            if (!currentUser) throw new Error('No authenticated user');

            return new Promise((resolve, reject) => {
                currentUser.getSession((err, session) => {
                    if (err) {
                        this.clearSecureTokens();
                        reject(err);
                        return;
                    }

                    if (session.isValid()) {
                        this.tokens = {
                            idToken: session.getIdToken().getJwtToken(),
                            accessToken: session.getAccessToken().getJwtToken(),
                            refreshToken: session.getRefreshToken().getToken()
                        };

                        this.secureTokenStorage();
                        resolve({ success: true, tokens: this.tokens });
                    } else {
                        this.clearSecureTokens();
                        reject(new Error('Invalid session'));
                    }
                });
            });
        } catch (error) {
            this.clearSecureTokens();
            throw error;
        }
    }

    // Almacenamiento seguro de tokens con expiración
    secureTokenStorage() {
        if (typeof window === 'undefined') return;

        try {
            // Calcular expiración (1 hora)
            const expiration = new Date().getTime() + (60 * 60 * 1000);

            localStorage.setItem('auth_tokens', JSON.stringify({
                ...this.tokens,
                expiration
            }));

            // Establecer auto-renovación
            this.scheduleTokenRefresh();
        } catch (error) {
            console.error('Error storing tokens securely:', error);
        }
    }

    // Programar renovación automática de tokens
    scheduleTokenRefresh() {
        // Renovar 5 minutos antes de expirar
        const refreshTime = 55 * 60 * 1000;

        setTimeout(async () => {
            try {
                await this.refreshSession();
            } catch (error) {
                console.warn('Auto-refresh failed:', error);
                this.signOut();
            }
        }, refreshTime);
    }

    // Verificación de estado de autenticación
    async isAuthenticated() {
        try {
            const storedTokens = this.getStoredTokens();
            if (!storedTokens) return false;

            // Verificar expiración
            if (storedTokens.expiration < new Date().getTime()) {
                this.clearSecureTokens();
                return false;
            }

            return await this.refreshSession().then(() => true).catch(() => false);
        } catch {
            return false;
        }
    }

    // Obtener tokens almacenados de forma segura
    getStoredTokens() {
        try {
            const stored = localStorage.getItem('auth_tokens');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    // Cierre de sesión seguro
    signOut() {
        try {
            const currentUser = userPool.getCurrentUser();
            if (currentUser) {
                currentUser.signOut();
            }
        } catch (error) {
            console.warn('Logout warning:', error);
        } finally {
            this.clearSecureTokens();
            this.currentUser = null;
        }
    }

    // Limpiar tokens de forma segura
    clearSecureTokens() {
        this.tokens = { idToken: null, accessToken: null, refreshToken: null };

        try {
            localStorage.removeItem('auth_tokens');
            sessionStorage.clear();
        } catch (error) {
            console.warn('Error clearing tokens:', error);
        }
    }

    // Parsear atributos de usuario de forma segura
    parseUserAttributes(attributes) {
        if (!attributes) return {};

        const userData = {};
        attributes.forEach(attr => {
            const name = attr.getName();
            if (this.isAllowedAttribute(name)) {
                userData[name] = sanitizeInput(attr.getValue());
            }
        });

        return userData;
    }

    // Validar atributos permitidos
    isAllowedAttribute(name) {
        const allowedAttributes = [
            'email', 'name', 'family_name', 'given_name',
            'custom:company', 'custom:role', 'custom:plan'
        ];
        return allowedAttributes.includes(name);
    }

    // Mapear errores de seguridad
    mapSecurityError(error) {
        const secureErrorMessages = {
            'NotAuthorizedException': 'Credenciales incorrectas',
            'UserNotFoundException': 'Usuario no encontrado',
            'UsernameExistsException': 'Email ya registrado',
            'CodeMismatchException': 'Código de verificación incorrecto',
            'ExpiredCodeException': 'Código expirado',
            'InvalidPasswordException': 'Contraseña no cumple requisitos',
            'LimitExceededException': 'Demasiados intentos. Intenta más tarde'
        };

        const message = secureErrorMessages[error.code] || 'Error de autenticación';

        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.error('Auth Error:', error);
        }

        return new Error(message);
    }

    // Obtener headers de autenticación para API
    getAuthHeaders() {
        const tokens = this.getStoredTokens();
        if (!tokens?.idToken) return {};

        return {
            'Authorization': `Bearer ${tokens.idToken}`,
            'X-API-Key': AUTH_CONFIG.apiKey,
            'Content-Type': 'application/json'
        };
    }
}

export const secureAuth = new SecureAuthService();