// src/config/cognito-config.js

// Configuración de AWS Cognito
export const COGNITO_CONFIG = {
  // Estos valores deben ser reemplazados con los valores reales de tu aplicación
  // y preferiblemente cargados desde variables de entorno
  USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_xxxxxxxx',
  CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
  
  // Variables opcionales para la configuración avanzada
  IDENTITY_POOL_ID: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
  USER_ATTRIBUTES: {
    // Atributos estándar
    GIVEN_NAME: 'given_name',
    FAMILY_NAME: 'family_name',
    EMAIL: 'email',
    PHONE_NUMBER: 'phone_number',
    
    // Atributos personalizados (si los has definido)
    COMPANY: 'custom:company',
    ROLE: 'custom:role',
    PLAN: 'custom:plan',
  },
  
  // Reglas de validación
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
  }
};

// Valores cargados en tiempo de ejecución
export const COGNITO_RUNTIME_CONFIG = {
  isConfigured: !!COGNITO_CONFIG.USER_POOL_ID && COGNITO_CONFIG.USER_POOL_ID !== 'us-east-1_xxxxxxxx'
};
