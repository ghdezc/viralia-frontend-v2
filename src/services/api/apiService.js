// src/services/api/apiService.js
import axios from 'axios';
import { cognitoAuthService } from '../auth/cognito';

// URL base de la API
const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://api.viralia.ai/v1';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Verificar si hay una sesión activa
      const isAuthenticated = await cognitoAuthService.isAuthenticated();
      
      if (isAuthenticated) {
        // Obtener el token del localStorage
        const token = localStorage.getItem('idToken');
        
        if (token) {
          // Añadir el token al encabezado Authorization
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Si no hay token pero hay sesión, intentar refrescar la sesión
          const cognitoUser = cognitoAuthService.getCurrentUser();
          
          if (cognitoUser) {
            try {
              // Intentar refrescar la sesión
              const session = await new Promise((resolve, reject) => {
                cognitoUser.getSession((err, session) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  resolve(session);
                });
              });
              
              // Obtener el nuevo token
              const newToken = session.getIdToken().getJwtToken();
              
              // Guardar el nuevo token
              localStorage.setItem('idToken', newToken);
              
              // Añadir el nuevo token al encabezado
              config.headers['Authorization'] = `Bearer ${newToken}`;
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
            }
          }
        }
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Obtener la configuración original de la petición
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no hemos intentado refrescar el token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const cognitoUser = cognitoAuthService.getCurrentUser();
        
        if (cognitoUser) {
          // Refrescar la sesión
          const result = await cognitoAuthService.refreshSession();
          
          if (result.success) {
            // Actualizar el encabezado Authorization con el nuevo token
            originalRequest.headers['Authorization'] = `Bearer ${result.idToken}`;
            
            // Reintentar la petición con el nuevo token
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing session:', refreshError);
      }
    }
    
    // Si llegamos aquí, no se pudo refrescar el token o hubo otro error
    return Promise.reject(error);
  }
);

/**
 * Servicio para interactuar con la API
 */
export const apiService = {
  /**
   * Realizar una petición GET
   * @param {string} endpoint Endpoint de la API
   * @param {Object} params Parámetros de la petición
   * @returns {Promise<any>} Respuesta de la API
   */
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Realizar una petición POST
   * @param {string} endpoint Endpoint de la API
   * @param {Object} data Datos a enviar
   * @param {Object} config Configuración adicional
   * @returns {Promise<any>} Respuesta de la API
   */
  post: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Realizar una petición PUT
   * @param {string} endpoint Endpoint de la API
   * @param {Object} data Datos a enviar
   * @param {Object} config Configuración adicional
   * @returns {Promise<any>} Respuesta de la API
   */
  put: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Realizar una petición DELETE
   * @param {string} endpoint Endpoint de la API
   * @param {Object} config Configuración adicional
   * @returns {Promise<any>} Respuesta de la API
   */
  delete: async (endpoint, config = {}) => {
    try {
      const response = await apiClient.delete(endpoint, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Realizar una petición PATCH
   * @param {string} endpoint Endpoint de la API
   * @param {Object} data Datos a enviar
   * @param {Object} config Configuración adicional
   * @returns {Promise<any>} Respuesta de la API
   */
  patch: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Subir un archivo a la API
   * @param {string} endpoint Endpoint de la API
   * @param {File} file Archivo a subir
   * @param {Object} additionalData Datos adicionales
   * @param {Function} onProgress Función para seguimiento del progreso
   * @returns {Promise<any>} Respuesta de la API
   */
  uploadFile: async (endpoint, file, additionalData = {}, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Añadir datos adicionales al FormData
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      // Añadir callback de progreso si se proporciona
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }
      
      const response = await apiClient.post(endpoint, formData, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

/**
 * Manejar errores de la API
 * @param {Error} error Error de la petición
 */
function handleApiError(error) {
  if (error.response) {
    // La petición fue hecha y el servidor respondió con un código de estado fuera del rango 2xx
    console.error('API Response Error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
    
    // Personalizar el mensaje de error según el código de estado
    switch (error.response.status) {
      case 401:
        error.message = 'No autorizado. Por favor inicia sesión nuevamente.';
        // Podríamos redirigir al login o realizar otras acciones
        break;
      case 403:
        error.message = 'No tienes permisos para realizar esta acción.';
        break;
      case 404:
        error.message = 'El recurso solicitado no fue encontrado.';
        break;
      case 422:
        error.message = 'Datos de entrada inválidos.';
        break;
      case 429:
        error.message = 'Demasiadas solicitudes. Por favor intenta más tarde.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        error.message = 'Error del servidor. Por favor intenta más tarde.';
        break;
      default:
        // Usar el mensaje de error proporcionado por la API si está disponible
        error.message = error.response.data?.message || 'Ocurrió un error al procesar la solicitud.';
    }
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    console.error('API Request Error:', error.request);
    error.message = 'No se recibió respuesta del servidor. Verifica tu conexión a internet.';
  } else {
    // Ocurrió un error al configurar la petición
    console.error('API Error:', error.message);
    error.message = 'Error al configurar la solicitud.';
  }
}
