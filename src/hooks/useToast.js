// src/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Hook para acceder a las funcionalidades de Toast
 * Proporciona métodos para mostrar diferentes tipos de notificaciones
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  
  return context;
};