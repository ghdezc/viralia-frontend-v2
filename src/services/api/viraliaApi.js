// src/services/api/viraliaApi.js - Cliente API ACTUALIZADO para tu backend
import axios from 'axios';
import { cognitoDirectAPI } from '../auth/cognitoDirectApi';
import toast from 'react-hot-toast';

class ViraliaApiClient {
    constructor() {
        // Usar tu ALB endpoint
        this.baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://viralia-alb-1099907913.us-east-1.elb.amazonaws.com';
        this.apiKey = import.meta.env.VITE_API_KEY || '0vgNwCVv5QgwPKZiexez5VpUmmRslilEZeYPeMhXvuaFYa2nqTkTmOHTDDK7nKJ4h7oNEt';

        console.log('🚀 Viralia API Client Config:', {
            baseURL: this.baseURL,
            apiKey: this.apiKey ? this.apiKey.substring(0, 20) + '...' : 'NOT_SET'
        });

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 120000, // 2 minutos para generación de IA
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
                    const authHeaders = cognitoDirectAPI.getAuthHeaders();
                    config.headers = { ...config.headers, ...authHeaders };

                    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                    console.log('🔑 Auth Headers:', Object.keys(authHeaders));

                    return config;
                } catch (error) {
                    console.error('❌ Error adding auth headers:', error);
                    return config;
                }
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                console.log(`✅ API Response: ${response.status} ${response.config.url}`);
                return response;
            },
            async (error) => {
                console.error('❌ API Error:', error.response?.status, error.response?.data);
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }

    handleApiError(error) {
        const status = error.response?.status;
        const message = error.response?.data?.user_message || error.response?.data?.message || error.message;

        switch (status) {
            case 401:
                toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
                // Redirigir al login si es necesario
                break;
            case 429:
                toast.error('Demasiadas solicitudes. Intenta en unos momentos.');
                break;
            case 500:
                toast.error('Error interno del servidor.');
                break;
            default:
                if (message) {
                    toast.error(message);
                }
        }
    }

    // 🎯 MÉTODO PRINCIPAL: Generar contenido (conecta con /generate_post)
    async generateContent({ tema, tono, plataformas, es_url = false, user_id = 'user' }) {
        try {
            console.log('🎯 Generando contenido:', { tema, tono, plataformas, es_url });

            const response = await this.client.post('/generate_post', {
                tema,
                tono,
                plataformas,
                es_url,
                user_id
            });

            console.log('✅ Respuesta del servidor:', response.data);

            // Procesar la respuesta del backend
            return this.processContentResponse(response.data);
        } catch (error) {
            console.error('❌ Error generando contenido:', error);
            throw new Error(error.response?.data?.user_message || 'Error generando contenido');
        }
    }

    // 🔄 Generar variaciones A/B
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

    // 📊 Análisis de sentimiento
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

    // 🏷️ Sugerir hashtags
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

    // 🔍 Verificar directrices
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

    // ♻️ Reciclar contenido
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

    // ⏰ Optimizar horario
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

    // 📈 Insights de rendimiento
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

    // 🔧 Procesar respuesta de contenido del backend
    processContentResponse(data) {
        console.log('🔧 Procesando respuesta:', data);

        if (!data.ok) {
            throw new Error(data.user_message || 'Error procesando contenido');
        }

        // La respuesta viene en data.result con el formato de tu agent.py
        const processedResult = {};

        Object.entries(data.result).forEach(([platform, content]) => {
            processedResult[platform] = {
                title: this.extractTitle(content.post),
                content: content.post || '',
                hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
                emojis: content.emojis || '',
                sentiment: content.sentiment || 'neutral',
                metrics: {
                    potencialViral: this.generateMetric(80, 95),
                    engagementScore: this.generateMetric(75, 90),
                    alcanceEstimado: this.generateReachEstimate()
                },
                checklist: content.checklist || {},
                politicas_relevantes: content.politicas_relevantes || [],
                url: content.url || null,
                warning: content.warning || null,
                success: content.success !== false,
                // Añadir información de diferenciadores
                diferenciadores: data.diferenciadores || []
            };
        });

        return {
            success: true,
            result: processedResult,
            diferenciadores: data.diferenciadores || []
        };
    }

    // 🎯 Extraer título del post
    extractTitle(post) {
        if (!post) return '';

        // Buscar la primera línea que parezca un título
        const lines = post.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
            const firstLine = lines[0].trim();
            // Si es muy corta o larga, usar como está
            if (firstLine.length > 80) {
                return firstLine.substring(0, 77) + '...';
            }
            return firstLine;
        }
        return '';
    }

    // 📊 Generar métricas simuladas
    generateMetric(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateReachEstimate() {
        const min = Math.floor(Math.random() * 15) + 5;  // 5-20K
        const max = min + Math.floor(Math.random() * 15) + 10; // +10-25K
        return `${min}K-${max}K`;
    }

    // 🏥 Health check
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

// Hook para React (opcional)
export const useViraliaApi = () => {
    return {
        generateContent: viraliaApi.generateContent.bind(viraliaApi),
        generateABVariations: viraliaApi.generateABVariations.bind(viraliaApi),
        analyzeSentiment: viraliaApi.analyzeSentiment.bind(viraliaApi),
        suggestHashtags: viraliaApi.suggestHashtags.bind(viraliaApi),
        checkGuidelines: viraliaApi.checkGuidelines.bind(viraliaApi),
        recycleContent: viraliaApi.recycleContent.bind(viraliaApi),
        optimizeSchedule: viraliaApi.optimizeSchedule.bind(viraliaApi),
        getPerformanceInsights: viraliaApi.getPerformanceInsights.bind(viraliaApi),
        healthCheck: viraliaApi.healthCheck.bind(viraliaApi)
    };
};