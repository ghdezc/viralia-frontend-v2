// src/hooks/useToast.js - Hook simple para notificaciones
import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    warning: (message) => toast(message, { icon: '⚠️' }),
    info: (message) => toast(message, { icon: 'ℹ️' }),
  };
};