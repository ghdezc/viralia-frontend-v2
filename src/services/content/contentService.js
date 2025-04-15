// src/services/content/contentService.js
import axios from 'axios';
import { sanitizeOutputData } from '../../utils/security';

// URL base de la API
const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://api.viralia.ai/v1';

// Interceptor para sanitizar las respuestas (seguridad)
axios.interceptors.response.use(
  (response) => {
    // Sanitizar los datos de la respuesta
    if (response.data) {
      response.data = sanitizeOutputData(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Instancia axios configurada
const apiClient = axios.create({
  baseURL: `${API_URL}/content`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio para generación de contenido mejorado
 * - Mejor manejo de errores
 * - Sanitización de datos
 * - Soporte para cancelación de peticiones
 */
export const contentService = {
  /**
   * Genera contenido basado en el prompt y la plataforma
   * @param {Object} params Parámetros para la generación
   * @param {string} params.platform Plataforma (linkedin, twitter, etc)
   * @param {string} params.prompt Tema o descripción del contenido
   * @param {string} params.contentType Tipo de contenido (post, tweet, etc)
   * @param {Object} params.options Opciones adicionales
   * @param {AbortSignal} [signal] Señal para cancelar la petición
   * @returns {Promise<Object>} Contenido generado
   */
  generateContent: async ({ platform, prompt, contentType = 'post', options = {} }, signal) => {
    try {
      // En desarrollo, simular la respuesta para no depender de la API
      if (process.env.NODE_ENV === 'development' || !API_URL.includes('api.viralia')) {
        return await mockGenerateContent(platform, prompt, contentType);
      }
      
      // En producción, realizar la llamada real a la API
      const token = localStorage.getItem('authToken');
      
      const { data } = await apiClient.post('/generate', {
        platform,
        prompt,
        type: contentType,
        ...options
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal // Permite cancelar la petición
      });
      
      return data;
    } catch (error) {
      // Mejorar manejo de errores
      if (axios.isCancel(error)) {
        console.log('Solicitud cancelada:', error.message);
        throw new Error('Generación cancelada');
      }
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al generar contenido';
                         
      console.error('Error generando contenido:', error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Analiza el rendimiento del contenido generado
   * @param {string} contentId ID del contenido generado
   * @param {AbortSignal} [signal] Señal para cancelar la petición
   * @returns {Promise<Object>} Análisis del contenido
   */
  analyzeContent: async (contentId, signal) => {
    try {
      if (process.env.NODE_ENV === 'development' || !API_URL.includes('api.viralia')) {
        return await mockAnalyzeContent(contentId);
      }
      
      const token = localStorage.getItem('authToken');
      
      const { data } = await apiClient.get(`/${contentId}/analyze`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal
      });
      
      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Solicitud cancelada:', error.message);
        throw new Error('Análisis cancelado');
      }
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al analizar contenido';
                         
      console.error('Error analizando contenido:', error);
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Guarda un contenido generado
   * @param {Object} content Contenido a guardar
   * @returns {Promise<Object>} Contenido guardado
   */
  saveContent: async (content) => {
    try {
      if (process.env.NODE_ENV === 'development' || !API_URL.includes('api.viralia')) {
        // Simular guardado en desarrollo
        return {
          ...content,
          id: `content-${Date.now()}`,
          savedAt: new Date().toISOString()
        };
      }
      
      const token = localStorage.getItem('authToken');
      
      const { data } = await apiClient.post('/save', content, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al guardar contenido';
                         
      console.error('Error guardando contenido:', error);
      throw new Error(errorMessage);
    }
  }
};

// Función de simulación para desarrollo
async function mockGenerateContent(platform, prompt, contentType) {
  // Simular tiempo de respuesta de la API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Contenido generado según la plataforma
  const mockResponses = {
    linkedin: {
      title: `${capitalizeFirstLetter(prompt)}: Cómo Transformar Tu Estrategia en 2025`,
      content: `¿Sabías que el 78% de las empresas que implementan estrategias de ${prompt} ven un aumento del 30% en su ROI durante el primer año?\n\nEn mi experiencia trabajando con equipos de marketing, he observado que el éxito no viene solo de adoptar las últimas tendencias, sino de implementarlas estratégicamente alineadas con tus objetivos de negocio.\n\nAquí comparto 3 formas en que puedes transformar tu enfoque de ${prompt} este año:\n\n1️⃣ Integra análisis avanzados para identificar patrones y oportunidades que tus competidores están pasando por alto\n\n2️⃣ Desarrolla una estrategia omnicanal genuina que mantenga consistencia pero aproveche las fortalezas únicas de cada plataforma\n\n3️⃣ Invierte en crear experiencias personalizadas que generen valor real para tu audiencia\n\n¿Qué estrategias de ${prompt} están funcionando mejor para ti este año? Comparte tu experiencia en los comentarios.`,
      hashtags: ["#MarketingDigital", "#Innovación", `#${formatHashtag(prompt)}`],
      metrics: {
        potencialViral: 87,
        engagementScore: 92,
        alcanceEstimado: "15K-25K",
        mejorHorario: "Martes o Jueves, entre 10:00 - 11:30 AM"
      }
    },
    twitter: {
      content: `La clave para destacar en ${prompt} no es hacer más, sino hacer lo correcto. He visto equipos pequeños superar a gigantes simplemente por enfocarse en lo que importa.\n\n¿Tu estrategia actual está alineada con tus objetivos o solo sigues tendencias?`,
      hashtags: [`#${formatHashtag(prompt)}`, "#Estrategia", "#Crecimiento"],
      metrics: {
        potencialViral: 81,
        engagementScore: 89,
        alcanceEstimado: "5K-8K",
        mejorHorario: "Entre 12:00 - 13:00 o 18:00 - 19:00"
      }
    },
    facebook: {
      title: `Revolucionando ${capitalizeFirstLetter(prompt)} en 2025`,
      content: `Hoy quiero compartir algo que ha cambiado por completo nuestra forma de abordar ${prompt}.\n\nLa mayoría de los equipos siguen utilizando las mismas estrategias de siempre, pero el mundo ha cambiado dramáticamente. Lo que funcionaba antes ya no da resultados.\n\nEn los últimos 6 meses, hemos experimentado con un nuevo enfoque que nos ha permitido duplicar nuestros resultados sin aumentar el presupuesto.\n\n¿Quieres saber cómo? Deja un "¡Sí!" en los comentarios y compartiré nuestra estrategia paso a paso.`,
      hashtags: [`#${formatHashtag(prompt)}`, "#Innovación", "#Crecimiento"],
      metrics: {
        potencialViral: 78,
        engagementScore: 85,
        alcanceEstimado: "8K-15K",
        mejorHorario: "Entre 13:00 - 15:00"
      }
    },
    instagram: {
      content: `Transformando la forma en que vemos ${prompt} 🚀\n\nLa diferencia entre el éxito y el fracaso no está en las herramientas que usas, sino en cómo las implementas.\n\nHoy comparto los 3 principios que nos han ayudado a triplicar resultados:\n\n✅ Consistencia sobre perfección\n✅ Datos sobre intuición\n✅ Valor sobre volumen\n\n¿Cuál de estos principios te resulta más desafiante? Cuéntame en los comentarios 👇`,
      hashtags: [`#${formatHashtag(prompt)}`, "#CrecimientoPersonal", "#Éxito", "#Estrategia", "#Innovación"],
      metrics: {
        potencialViral: 92,
        engagementScore: 88,
        alcanceEstimado: "10K-20K",
        mejorHorario: "Entre 17:00 - 19:00 o 21:00 - 22:00"
      }
    }
  };
  
  // Devolver respuesta específica para la plataforma
  return mockResponses[platform] || mockResponses.linkedin;
}

// Simulación de análisis
async function mockAnalyzeContent(contentId) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: contentId,
    analysis: {
      sentimentScore: 0.82,
      readabilityScore: 76.3,
      toneAnalysis: {
        professional: 0.72,
        conversational: 0.65,
        persuasive: 0.83
      },
      predictedEngagement: {
        likes: '180-250',
        comments: '15-25',
        shares: '40-60'
      },
      improvementSuggestions: [
        "Considera añadir una pregunta al inicio para fomentar más interacción",
        "Incluir datos específicos puede aumentar la credibilidad",
        "Un llamado a la acción más claro podría mejorar la tasa de conversión"
      ]
    }
  };
}

// Helpers
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatHashtag(text) {
  return text
    .replace(/\s+/g, '')
    .replace(/[^\w\s]/gi, '')
    .trim();
}