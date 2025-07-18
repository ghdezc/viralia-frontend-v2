// src/services/api/viraliaApi.js - CORREGIDO PARA CASE-SENSITIVE
import axios from 'axios';
import { cognitoDirectAPI } from '../auth/cognitoDirectApi';
import toast from 'react-hot-toast';

class ViraliaApiClient {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://viralia-alb-1099907913.us-east-1.elb.amazonaws.com';
        this.apiKey = import.meta.env.VITE_API_KEY || '0vgNwCVv5QgwPKZiexez5VpUmmRslilEZeYPeMhXvuaFYa2nqTkTmOHTDDK7nKJ4h7oNEt';

        // ✅ MAPEO CRÍTICO: Frontend IDs → Backend Names
        this.platformMapping = {
            'linkedin': 'LinkedIn',           // ✅ linkedin → LinkedIn
            'twitter': 'Twitter',             // ✅ twitter → Twitter
            'twitter_premium': 'Twitter',     // ✅ twitter_premium → Twitter (por ahora)
            'facebook': 'Facebook'            // ✅ facebook → Facebook
        };

        console.log('🚀 Viralia API Client Config:', {
            baseURL: this.baseURL,
            apiKey: this.apiKey ? this.apiKey.substring(0, 20) + '...' : 'NOT_SET',
            platformMapping: this.platformMapping
        });

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 180000, // ⏱️ 3 MINUTOS
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        this.setupInterceptors();
    }

    // ✅ FUNCIÓN CRÍTICA: Mapear ID del frontend → Nombre del backend
    mapPlatformForBackend(frontendId) {
        const backendName = this.platformMapping[frontendId];
        if (!backendName) {
            console.warn(`[Platform Mapping] Unknown platform: ${frontendId}, defaulting to LinkedIn`);
            return 'LinkedIn';
        }
        console.log(`[Platform Mapping] ${frontendId} → ${backendName}`);
        return backendName;
    }

    // ✅ FUNCIÓN CRÍTICA: Mapear múltiples plataformas
    mapPlatformsForBackend(frontendIds) {
        return frontendIds.map(id => this.mapPlatformForBackend(id));
    }

    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            async (config) => {
                try {
                    const authHeaders = cognitoDirectAPI.getAuthHeaders();
                    config.headers = { ...config.headers, ...authHeaders };

                    console.log(`[Viralia API] ${config.method?.toUpperCase()} ${config.url}`);
                    console.log('[Auth] Headers validated:', Object.keys(authHeaders));

                    config.metadata = { startTime: Date.now() };
                    return config;
                } catch (error) {
                    console.error('[Auth Error] Failed to add headers:', error);
                    return config;
                }
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                const duration = Date.now() - (response.config.metadata?.startTime || 0);
                console.log(`[API Success] ${response.status} ${response.config.url} (${duration}ms)`);

                if (response.data?.result?.viral_metrics) {
                    console.log('[Viral Metrics] Score:', response.data.result.viral_metrics.potencial_viral);
                }

                return response;
            },
            async (error) => {
                const duration = Date.now() - (error.config?.metadata?.startTime || 0);
                console.error(`[API Error] ${error.response?.status} ${error.config?.url} (${duration}ms)`, error.response?.data);
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }

    handleApiError(error) {
        const status = error.response?.status;
        const message = error.response?.data?.user_message || error.response?.data?.message || error.message;

        const errorMap = {
            400: 'Solicitud inválida. Verifica los datos enviados.',
            401: 'Sesión expirada. Iniciando sesión nuevamente...',
            403: 'Acceso denegado. Verifica tus permisos.',
            404: 'Recurso no encontrado. Verifica la URL.',
            422: 'Datos inválidos. Verifica el formato de los datos.',
            429: 'Límite de solicitudes alcanzado. Reintentando en unos momentos...',
            500: 'Error interno del servidor. Nuestro equipo ha sido notificado.',
            502: 'Servidor temporalmente no disponible. Reintentando...',
            503: 'Servicio en mantenimiento. Intenta en unos minutos.',
            504: 'La solicitud tardó más de lo esperado. Verifica tu conexión.'
        };

        const userMessage = errorMap[status] || `Error de conexión: ${message}`;

        // Solo mostrar toast para errores importantes (no 422)
        if (status !== 422) {
            toast.error(userMessage, {
                duration: status >= 500 ? 8000 : 5000,
                style: {
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontWeight: '500',
                    maxWidth: '500px'
                }
            });
        }
    }

    // ================== MÉTODOS PRINCIPALES ==================

    // ✅ Generación de contenido - CON MAPEO CORRECTO
    async generateContent({ tema, red, tono = 'profesional', user_id = 'user' }) {
        try {
            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Generate] Frontend: ${red} → Backend: ${backendPlatform}, Topic: ${tema.substring(0, 50)}...`);

            const requestData = {
                tema,
                tono,
                plataformas: [backendPlatform], // ✅ Array con nombre correcto del backend
                es_url: /^https?:\/\//.test(tema.trim()),
                user_id
            };

            const response = await this.client.post('/generate_post', requestData);

            console.log('[Generate Success] Content generated for:', backendPlatform);
            return response.data;
        } catch (error) {
            console.error('[Generate Error]', error.message);
            throw new Error('Error generando contenido viral. Intenta con un tema diferente.');
        }
    }

    // ✅ Variaciones A/B - CON MAPEO CORRECTO
    async generateABVariations({ content, red, user_id = 'user' }) {
        try {
            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[A/B Test] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                base_post: content,
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/ab_variations', requestData);

            console.log(`[A/B Result] Generated variations for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[A/B Error]', error.message);
            throw new Error('Error generando variaciones A/B. Intenta con contenido más específico.');
        }
    }

    // ✅ Análisis de sentimiento
    async analyzeSentiment({ text, user_id = 'user' }) {
        try {
            if (!text || text.trim().length < 10) {
                throw new Error('El texto debe tener al menos 10 caracteres para analizar');
            }

            const requestData = {
                text: text.trim(),
                user_id
            };

            const response = await this.client.post('/analyze_sentiment', requestData);

            console.log('[Sentiment] Analysis completed for', text.length, 'characters');
            return response.data;
        } catch (error) {
            console.error('[Sentiment Error]', error.message);
            throw new Error('Error analizando sentimiento. Verifica que el texto sea válido.');
        }
    }

    // ✅ Sugerencia de hashtags - CON MAPEO CORRECTO
    async suggestHashtags({ tema, red, cantidad = 10, user_id = 'user' }) {
        try {
            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Hashtags] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                text: tema.trim(),
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/suggest_hashtags', requestData);

            console.log(`[Hashtags] Generated hashtags for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[Hashtags Error]', error.message);
            throw new Error('Error generando hashtags. Intenta con un tema más específico.');
        }
    }

    // ✅ Verificación de directrices - CON MAPEO CORRECTO
    async checkGuidelines({ text, red, user_id = 'user' }) {
        try {
            if (!text || text.trim().length < 5) {
                throw new Error('El texto es muy corto para verificar directrices');
            }

            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Guidelines] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                text: text.trim(),
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/guideline_checker', requestData);

            console.log(`[Guidelines] Checked for ${backendPlatform} platform`);
            return response.data;
        } catch (error) {
            console.error('[Guidelines Error]', error.message);
            throw new Error('Error verificando directrices. Intenta nuevamente.');
        }
    }

    // ✅ Reciclaje de contenido - CON MAPEO CORRECTO
    async recycleContent({ old_post, red, user_id = 'user' }) {
        try {
            if (!old_post || old_post.trim().length < 20) {
                throw new Error('El contenido debe tener al menos 20 caracteres para reciclar');
            }

            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Recycle] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                old_post: old_post.trim(),
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/recycle_evergreen', requestData);

            console.log(`[Recycle] Content recycled for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[Recycle Error]', error.message);
            throw new Error('Error reciclando contenido. Verifica que el contenido sea válido.');
        }
    }

    // ✅ Optimización de horarios - CON MAPEO CORRECTO
    async optimizeSchedule({ tema, red, user_id = 'user' }) {
        try {
            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Schedule] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                tema: tema.trim(),
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/optimize_schedule', requestData);

            console.log(`[Schedule] Optimization completed for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[Schedule Error]', error.message);
            throw new Error('Error optimizando horario. Intenta nuevamente.');
        }
    }

    // ✅ Insights de rendimiento - CON MAPEO CORRECTO
    async getPerformanceInsights({ metrics_json, red, user_id = 'user' }) {
        try {
            let parsedMetrics;

            if (typeof metrics_json === 'string') {
                parsedMetrics = JSON.parse(metrics_json);
            } else {
                parsedMetrics = metrics_json;
            }

            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Insights] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                metrics_json: parsedMetrics,
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/performance_insights', requestData);

            console.log(`[Insights] Performance analysis completed for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[Insights Error]', error.message);
            throw new Error('Error obteniendo insights. Verifica las métricas proporcionadas.');
        }
    }

    // ✅ Generación por categorías - CON MAPEO CORRECTO
    async generateByCategory({ tema, red, user_id = 'user' }) {
        try {
            // ✅ CRÍTICO: Mapear plataforma frontend → backend
            const backendPlatform = this.mapPlatformForBackend(red);

            console.log(`[Categories] Frontend: ${red} → Backend: ${backendPlatform}`);

            const requestData = {
                tema: tema.trim(),
                red: backendPlatform, // ✅ Nombre correcto del backend
                user_id
            };

            const response = await this.client.post('/by_category', requestData);

            console.log(`[Categories] Content generated for ${backendPlatform}`);
            return response.data;
        } catch (error) {
            console.error('[Categories Error]', error.message);
            throw new Error('Error generando por categorías.');
        }
    }

    // ================== MÉTODOS SIMULADOS (para futuro) ==================

    async savePost({ platform, content, hashtags = [], metrics = null, user_id = 'user' }) {
        try {
            console.log(`[Save] Post saved locally for ${platform} (backend not implemented yet)`);

            const savedPost = {
                id: Date.now().toString(),
                platform,
                content: content.trim(),
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                metrics: metrics || {},
                user_id,
                saved_at: new Date().toISOString()
            };

            const saved = JSON.parse(localStorage.getItem('viralia_saved_posts') || '[]');
            saved.unshift(savedPost);
            localStorage.setItem('viralia_saved_posts', JSON.stringify(saved.slice(0, 50)));

            return { ok: true, post_id: savedPost.id, message: 'Post guardado localmente' };
        } catch (error) {
            console.error('[Save Error]', error.message);
            throw new Error('Error guardando el post.');
        }
    }

    async getUserPosts({ user_id = 'user', limit = 20, platform = null }) {
        try {
            console.log(`[Posts] Retrieving saved posts (local storage)`);

            const saved = JSON.parse(localStorage.getItem('viralia_saved_posts') || '[]');

            let filtered = saved;
            if (platform) {
                filtered = saved.filter(post => post.platform === platform);
            }

            const posts = filtered.slice(0, Math.max(1, Math.min(limit, 100)));

            console.log(`[Posts] Retrieved ${posts.length} posts from local storage`);
            return posts;
        } catch (error) {
            console.error('[Posts Error]', error.message);
            return [];
        }
    }

    // ✅ Health check
    async healthCheck() {
        try {
            const response = await this.client.get('/healthz');

            console.log('[Health] API is healthy');
            return {
                ok: true,
                status: response.status,
                timestamp: new Date().toISOString(),
                ...response.data
            };
        } catch (error) {
            console.error('[Health] API health check failed:', error.message);
            return {
                ok: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    clearCache() {
        console.log('[Cache] Clearing local storage cache');
        localStorage.removeItem('viralia_saved_posts');
    }
}

// Instancia singleton
export const viraliaApi = new ViraliaApiClient();

// Hook para React
export const useViraliaApi = () => {
    return {
        generateContent: viraliaApi.generateContent.bind(viraliaApi),
        generateABVariations: viraliaApi.generateABVariations.bind(viraliaApi),
        analyzeSentiment: viraliaApi.analyzeSentiment.bind(viraliaApi),
        suggestHashtags: viraliaApi.suggestHashtags.bind(viraliaApi),
        checkGuidelines: viraliaApi.checkGuidelines.bind(viraliaApi),
        recycleContent: viraliaApi.recycleContent.bind(viraliaApi),
        generateByCategory: viraliaApi.generateByCategory.bind(viraliaApi),
        optimizeSchedule: viraliaApi.optimizeSchedule.bind(viraliaApi),
        getPerformanceInsights: viraliaApi.getPerformanceInsights.bind(viraliaApi),
        savePost: viraliaApi.savePost.bind(viraliaApi),
        getUserPosts: viraliaApi.getUserPosts.bind(viraliaApi),
        healthCheck: viraliaApi.healthCheck.bind(viraliaApi),
        clearCache: viraliaApi.clearCache.bind(viraliaApi)
    };
};