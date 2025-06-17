// src/services/auth/cognitoDirectApi.js - Usar la API directa como CLI
class CognitoDirectAPI {
    constructor() {
        this.config = {
            poolId: import.meta.env.VITE_COGNITO_POOL_ID || 'us-east-1_Cs50bmhCD',
            clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '285uke1u9affrh8phcievcoep7',
            region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1'
        };
        this.tokens = {};
        console.log('🔧 CognitoDirectAPI Config:', this.config);
    }

    // 🔑 LOGIN usando API directa (como CLI)
    async signIn(username, password) {
        console.log('🔑 Direct API Login:', username);

        try {
            // Usar la misma API que usa el CLI
            const response = await fetch(`https://cognito-idp.${this.config.region}.amazonaws.com/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-amz-json-1.1',
                    'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
                },
                body: JSON.stringify({
                    AuthFlow: 'USER_PASSWORD_AUTH',
                    ClientId: this.config.clientId,
                    AuthParameters: {
                        USERNAME: username,
                        PASSWORD: password
                    }
                })
            });

            console.log('🔧 API Response Status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('🔧 API Error Data:', errorData);
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Direct API Success');

            // Guardar tokens
            if (data.AuthenticationResult) {
                this.tokens = {
                    idToken: data.AuthenticationResult.IdToken,
                    accessToken: data.AuthenticationResult.AccessToken,
                    refreshToken: data.AuthenticationResult.RefreshToken
                };

                this._saveTokens();

                // Parsear datos del usuario desde el ID Token
                const userData = this._parseIdToken(data.AuthenticationResult.IdToken);

                return {
                    success: true,
                    user: userData
                };
            }

            throw new Error('No authentication result');

        } catch (error) {
            console.error('❌ Direct API Login Error:', error);
            throw new Error(this._mapError(error));
        }
    }

    // 🔍 Verificar autenticación
    async isAuthenticated() {
        const tokens = this._getStoredTokens();
        if (!tokens || this._isTokenExpired(tokens)) {
            return false;
        }
        return true;
    }

    // 👤 Obtener usuario actual
    async getCurrentUser() {
        const tokens = this._getStoredTokens();
        if (!tokens?.idToken) {
            return null;
        }

        return this._parseIdToken(tokens.idToken);
    }

    // 🚪 Cerrar sesión
    signOut() {
        this._clearTokens();
        this.tokens = {};
        console.log('✅ Direct API Logout');
    }

    // 🔑 Headers para API calls
    getAuthHeaders() {
        const tokens = this._getStoredTokens();
        if (!tokens?.idToken) {
            return {};
        }

        return {
            'Authorization': `Bearer ${tokens.idToken}`,
            'X-API-Key': import.meta.env.VITE_API_KEY,
            'Content-Type': 'application/json'
        };
    }

    // 💾 Guardar tokens
    _saveTokens() {
        try {
            const tokenData = {
                ...this.tokens,
                expiration: Date.now() + (60 * 60 * 1000), // 1 hora
                timestamp: Date.now()
            };
            localStorage.setItem('viralia_auth', JSON.stringify(tokenData));
            console.log('💾 Tokens guardados (Direct API)');
        } catch (error) {
            console.error('❌ Error guardando tokens:', error);
        }
    }

    // 📖 Obtener tokens guardados
    _getStoredTokens() {
        try {
            const stored = localStorage.getItem('viralia_auth');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('❌ Error leyendo tokens:', error);
            return null;
        }
    }

    // ⏰ Verificar expiración
    _isTokenExpired(tokenData) {
        if (!tokenData.expiration) return true;
        return Date.now() > tokenData.expiration;
    }

    // 🗑️ Limpiar tokens
    _clearTokens() {
        try {
            localStorage.removeItem('viralia_auth');
            sessionStorage.clear();
        } catch (error) {
            console.warn('⚠️ Error limpiando tokens:', error);
        }
    }

    // 🏷️ Parsear ID Token (JWT)
    _parseIdToken(idToken) {
        try {
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);
            console.log('🏷️ ID Token Payload:', payload);

            return {
                username: payload['cognito:username'] || payload.sub,
                email: payload.email,
                sub: payload.sub,
                ...payload
            };
        } catch (error) {
            console.error('❌ Error parsing ID token:', error);
            return { username: 'unknown' };
        }
    }

    // ⚠️ Mapear errores
    _mapError(error) {
        if (error.message) {
            if (error.message.includes('NotAuthorizedException')) {
                return 'Email o contraseña incorrectos';
            }
            if (error.message.includes('UserNotFoundException')) {
                return 'Usuario no encontrado';
            }
            if (error.message.includes('UserNotConfirmedException')) {
                return 'Usuario no confirmado';
            }
            if (error.message.includes('USER_PASSWORD_AUTH')) {
                return 'Flujo de autenticación no habilitado. Revisa configuración de Cognito.';
            }
        }

        return error.message || 'Error de autenticación';
    }
}

// Instancia singleton
export const cognitoDirectAPI = new CognitoDirectAPI();
export default cognitoDirectAPI;