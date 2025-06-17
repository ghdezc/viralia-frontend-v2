// src/services/api/viraliaApi.js - Cliente API optimizado para EC2
import axios from 'axios';
import { secureAuth } from '../auth/secureAuth';
import toast from 'react-hot-toast';

class ViraliaApiClient {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://viralia-alb-1099907913.us-east-1.elb.amazonaws.com';
        this.apiKey = import.meta.env.VITE_API_KEY || '0vgNwCVv5QgwPKZiexez5VpUmmRslilEZeYPeMhXvuaFYa2nqTkTmOHTDDK7nKJ4h7oNEt';

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 120000, // 2 minutos para generación de contenido
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey
            }
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor - añadir autenticación
        this.client.interceptors.request.use(
            async (config) => {
                try {
                    const authHeaders = secureAuth.getAuthHeaders();
                    config.headers = { ...config.headers, ...authHeaders };

                    // Log para debugging en desarrollo
                    if (import.meta.env.DEV) {
                        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                    }

                    return config;
                } catch (error) {
                    console.error('Error adding auth headers:', error);
                    return config;
                }
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - manejo de errores
        this.client.interceptors.response.use(
            (response) => {
                if (import.meta.env.DEV) {
                    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Manejo de errores 401 - token expirado
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        await secureAuth.refreshSession();
                        const authHeaders = secureAuth.getAuthHeaders();
                        originalRequest.headers = { ...originalRequest.headers, ...authHeaders };
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        secureAuth.signOut();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                // Manejo de otros errores
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }

    handleApiError(error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 429:
                toast.error('Demasiadas solicitudes. Intenta en unos momentos.');
                break;
            case 500:
                toast.error('Error interno del servidor. Nuestro equipo ha sido notificado.');
                break;
            case 503:
                toast.error('Servicio temporalmente no disponible.');
                break;
            default:
                if (import.meta.env.DEV) {
                    console.error('API Error:', error);
                }
        }
    }

    // Generación de contenido principal
    async generateContent({ tema, tono, plataformas, es_url = false, user_id = 'user' }) {
        try {
            const response = await this.client.post('/generate_post', {
                tema,
                tono,
                plataformas,
                es_url,
                user_id
            });

            return this.processContentResponse(response.data);
        } catch (error) {
            throw new Error(error.response?.data?.user_message || 'Error generando contenido');
        }
    }

    // Variaciones A/B
    async generateABVariations({ base_post, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/ab_variations', {
                base_post,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error generando variaciones A/B');
        }
    }

    // Contenido por categoría
    async generateByCategory({ tema, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/by_category', {
                tema,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error generando contenido por categoría');
        }
    }

    // Sugerir hashtags
    async suggestHashtags({ text, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/suggest_hashtags', {
                text,
                red,
                user_id
            });

            return Array.isArray(response.data) ? response.data : response.data.hashtags || [];
        } catch (error) {
            throw new Error('Error sugiriendo hashtags');
        }
    }

    // Análisis de sentimiento
    async analyzeSentiment({ text, user_id = 'user' }) {
        try {
            const response = await this.client.post('/analyze_sentiment', {
                text,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error analizando sentimiento');
        }
    }

    // Verificar directrices
    async checkGuidelines({ text, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/guideline_checker', {
                text,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error verificando directrices');
        }
    }

    // Reciclar contenido evergreen
    async recycleContent({ old_post, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/recycle_evergreen', {
                old_post,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error reciclando contenido');
        }
    }

    // Optimizar horario
    async optimizeSchedule({ tema, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/optimize_schedule', {
                tema,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error optimizando horario');
        }
    }

    // Insights de rendimiento
    async getPerformanceInsights({ metrics_json, red, user_id = 'user' }) {
        try {
            const response = await this.client.post('/performance_insights', {
                metrics_json,
                red,
                user_id
            });

            return response.data;
        } catch (error) {
            throw new Error('Error obteniendo insights');
        }
    }

    // Procesar respuesta de contenido
    processContentResponse(data) {
        if (!data.ok) {
            throw new Error(data.user_message || 'Error procesando contenido');
        }

        // Transformar respuesta del backend a formato del frontend
        const processedResult = {};

        Object.entries(data.result).forEach(([platform, content]) => {
            processedResult[platform] = {
                title: content.post?.split('\n')[0] || '',
                content: content.post || '',
                hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
                emojis: content.emojis || '',
                sentiment: content.sentiment || 'neutral',
                metrics: {
                    potencialViral: Math.floor(Math.random() * 20) + 80, // Simulated for demo
                    engagementScore: Math.floor(Math.random() * 15) + 85,
                    alcanceEstimado: `${Math.floor(Math.random() * 15) + 10}K-${Math.floor(Math.random() * 20) + 25}K`
                },
                checklist: content.checklist || {},
                politicas_relevantes: content.politicas_relevantes || [],
                url: content.url || null,
                warning: content.warning || null,
                success: content.success !== false
            };
        });

        return processedResult;
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.client.get('/healthz');
            return response.data;
        } catch (error) {
            return { ok: false, error: error.message };
        }
    }
}

// Instancia singleton
export const viraliaApi = new ViraliaApiClient();

// Hooks para React Query (opcional)
export const useViraliaApi = () => {
    return {
        generateContent: viraliaApi.generateContent.bind(viraliaApi),
        generateABVariations: viraliaApi.generateABVariations.bind(viraliaApi),
        generateByCategory: viraliaApi.generateByCategory.bind(viraliaApi),
        suggestHashtags: viraliaApi.suggestHashtags.bind(viraliaApi),
        analyzeSentiment: viraliaApi.analyzeSentiment.bind(viraliaApi),
        checkGuidelines: viraliaApi.checkGuidelines.bind(viraliaApi),
        recycleContent: viraliaApi.recycleContent.bind(viraliaApi),
        optimizeSchedule: viraliaApi.optimizeSchedule.bind(viraliaApi),
        getPerformanceInsights: viraliaApi.getPerformanceInsights.bind(viraliaApi)
    };
};