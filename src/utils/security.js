// src/utils/security.js

/**
 * Sanitiza un input para prevenir ataques XSS
 * @param {string} input Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
export function sanitizeInput(input) {
  if (!input) return input;
  
  // Si no es string, convertir a string
  if (typeof input !== 'string') {
    input = String(input);
  }
  
  // Escapar caracteres especiales de HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Valida un email
 * @param {string} email Email a validar
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Valida una contraseña según reglas específicas
 * @param {string} password Contraseña a validar
 * @param {Object} rules Reglas de validación
 * @returns {Object} Resultado de la validación
 */
export function validatePassword(password, rules = {}) {
  const defaultRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true
  };
  
  const activeRules = { ...defaultRules, ...rules };
  const result = {
    isValid: true,
    errors: []
  };
  
  // Validar longitud mínima
  if (password.length < activeRules.minLength) {
    result.isValid = false;
    result.errors.push(`La contraseña debe tener al menos ${activeRules.minLength} caracteres`);
  }
  
  // Validar mayúsculas
  if (activeRules.requireUppercase && !/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('La contraseña debe incluir al menos una letra mayúscula');
  }
  
  // Validar minúsculas
  if (activeRules.requireLowercase && !/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('La contraseña debe incluir al menos una letra minúscula');
  }
  
  // Validar números
  if (activeRules.requireNumbers && !/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('La contraseña debe incluir al menos un número');
  }
  
  // Validar símbolos
  if (activeRules.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.errors.push('La contraseña debe incluir al menos un símbolo');
  }
  
  return result;
}

/**
 * Valida un nombre de usuario
 * @param {string} username Nombre de usuario a validar
 * @returns {Object} Resultado de la validación
 */
export function validateUsername(username) {
  const result = {
    isValid: true,
    errors: []
  };
  
  // Validar longitud
  if (username.length < 3) {
    result.isValid = false;
    result.errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  }
  
  // Validar caracteres permitidos
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    result.isValid = false;
    result.errors.push('El nombre de usuario solo puede contener letras, números, puntos, guiones bajos y guiones');
  }
  
  return result;
}

/**
 * Sanitiza y valida una URL
 * @param {string} url URL a validar
 * @returns {Object} Resultado con la URL sanitizada y validación
 */
export function sanitizeAndValidateUrl(url) {
  if (!url) return { isValid: false, sanitizedUrl: '' };
  
  // Sanitizar URL
  const sanitizedUrl = sanitizeInput(url.trim());
  
  // Validar URL
  try {
    // Intentar crear un objeto URL (lanzará error si no es válida)
    new URL(sanitizedUrl);
    
    // Validar que sea http o https
    if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
      return { isValid: false, sanitizedUrl, error: 'La URL debe empezar con http:// o https://' };
    }
    
    return { isValid: true, sanitizedUrl };
  } catch (error) {
    return { isValid: false, sanitizedUrl, error: 'URL inválida' };
  }
}

/**
 * Genera un token aleatorio
 * @param {number} length Longitud del token
 * @returns {string} Token generado
 */
export function generateRandomToken(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
}

/**
 * Formatea los datos para prevenir inyección SQL
 * (Aunque usamos ORM/APIs, esta es una capa adicional de seguridad)
 * @param {string} input Texto a formatear
 * @returns {string} Texto formateado
 */
export function preventSqlInjection(input) {
  if (!input) return input;
  
  // Convertir a string si no lo es
  if (typeof input !== 'string') {
    input = String(input);
  }
  
  // Escapar caracteres que podrían usarse en inyecciones SQL
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;');
}

/**
 * Protege contra ataques CSRF verificando el token
 * @param {string} token Token CSRF
 * @param {string} storedToken Token almacenado para verificación
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validateCsrfToken(token, storedToken) {
  return token === storedToken;
}

/**
 * Sanitiza datos de salida para prevenir XSS al mostrar en la UI
 * @param {Object|Array|string} data Datos a sanitizar
 * @returns {Object|Array|string} Datos sanitizados
 */
export function sanitizeOutputData(data) {
  if (!data) return data;
  
  // Si es string, sanitizar
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }
  
  // Si es array, recorrer y sanitizar cada elemento
  if (Array.isArray(data)) {
    return data.map(item => sanitizeOutputData(item));
  }
  
  // Si es objeto, recorrer y sanitizar cada propiedad
  if (typeof data === 'object') {
    const sanitizedData = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = sanitizeOutputData(data[key]);
      }
    }
    
    return sanitizedData;
  }
  
  // Si es otro tipo de dato, devolver sin cambios
  return data;
}
