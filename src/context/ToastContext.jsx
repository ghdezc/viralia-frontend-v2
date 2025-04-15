// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

// Crear el contexto
export const ToastContext = createContext();

// Hook personalizado para usar el contexto
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}

// Proveedor del contexto
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Generar un ID único para cada toast
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Añadir un nuevo toast
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = generateId();
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, duration },
    ]);

    // Remover toast después del tiempo de duración
    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remover un toast específico
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Helpers para diferentes tipos de toast
  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  // Renderizar los toasts
  const renderToasts = () => {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  };

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
}