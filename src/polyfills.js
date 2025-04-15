// src/polyfills.js

// Añadir global al objeto window para compatibilidad con librerías de Node.js
if (typeof window !== 'undefined' && !window.global) {
    window.global = window;
  }
  
  // Polyfill para process.nextTick (usado por algunas librerías)
  if (typeof window !== 'undefined' && !window.process) {
    window.process = {
      env: { NODE_ENV: process.env.NODE_ENV },
      nextTick: callback => setTimeout(callback, 0)
    };
  }
  
  // Polyfill para Buffer (usado por amazon-cognito-identity-js)
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = {
      isBuffer: () => false,
      from: (value) => value
    };
  }