// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { BoltIcon } from '@heroicons/react/24/solid';

// Esquema de validación para el formulario inicial
const requestSchema = z.object({
  email: z.string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido')
});

// Esquema de validación para el formulario de confirmación
const confirmSchema = z.object({
  code: z.string()
    .min(1, 'El código es requerido')
    .min(6, 'El código debe tener al menos 6 caracteres'),
  newPassword: z.string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña')
});

/**
 * Componente para recuperación de contraseña
 */
const ForgotPassword = () => {
  // Estados
  const [step, setStep] = useState('request'); // 'request' o 'confirm'
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // Hooks
  const { forgotPassword, confirmNewPassword } = useAuth();
  const toast = useToast();
  
  // Configurar React Hook Form para el paso inicial
  const { 
    register: registerRequest, 
    handleSubmit: handleSubmitRequest, 
    formState: { errors: errorsRequest } 
  } = useForm({
    resolver: zodResolver(requestSchema)
  });
  
  // Configurar React Hook Form para el paso de confirmación
  const { 
    register: registerConfirm, 
    handleSubmit: handleSubmitConfirm, 
    formState: { errors: errorsConfirm } 
  } = useForm({
    resolver: zodResolver(confirmSchema)
  });
  
  // Manejar la solicitud de recuperación de contraseña
  const onSubmitRequest = async (data) => {
    setIsLoading(true);
    try {
      // Guardar el email para el siguiente paso
      setEmail(data.email);
      
      // Llamar a la API de recuperación de contraseña
      await forgotPassword(data.email);
      
      // Avanzar al siguiente paso
      toast.success('Se ha enviado un código de verificación a tu correo');
      setStep('confirm');
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      toast.error(error.message || 'Error al solicitar recuperación de contraseña');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar la confirmación de nueva contraseña
  const onSubmitConfirm = async (data) => {
    // Validar que las contraseñas coinciden
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    try {
      // Llamar a la API para confirmar la nueva contraseña
      await confirmNewPassword(email, data.code, data.newPassword);
      
      // Mostrar mensaje de éxito
      toast.success('Contraseña actualizada correctamente');
      
      // Redireccionar automáticamente al login después de un breve retraso
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error al confirmar contraseña:', error);
      toast.error(error.message || 'Error al confirmar la nueva contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <BoltIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'request' ? 'Recupera tu contraseña' : 'Verifica tu código'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'request' 
            ? 'Te enviaremos un código para restablecer tu contraseña' 
            : 'Ingresa el código enviado a tu correo'}
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Formulario de solicitud de código */}
          {step === 'request' && (
            <form className="space-y-6" onSubmit={handleSubmitRequest(onSubmitRequest)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errorsRequest.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                    {...registerRequest('email')}
                  />
                  {errorsRequest.email && (
                    <p className="mt-2 text-sm text-red-600">{errorsRequest.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar código de recuperación'}
                </button>
              </div>
            </form>
          )}
          
          {/* Formulario de verificación de código y nueva contraseña */}
          {step === 'confirm' && (
            <form className="space-y-6" onSubmit={handleSubmitConfirm(onSubmitConfirm)}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Código de verificación
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    type="text"
                    autoComplete="one-time-code"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errorsConfirm.code ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                    {...registerConfirm('code')}
                  />
                  {errorsConfirm.code && (
                    <p className="mt-2 text-sm text-red-600">{errorsConfirm.code.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errorsConfirm.newPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                    {...registerConfirm('newPassword')}
                  />
                  {errorsConfirm.newPassword && (
                    <p className="mt-2 text-sm text-red-600">{errorsConfirm.newPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errorsConfirm.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                    {...registerConfirm('confirmPassword')}
                  />
                  {errorsConfirm.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errorsConfirm.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setStep('request')}
                >
                  Volver a solicitar código
                </button>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </form>
          )}
          
          {/* Enlace para volver al login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Recordaste tu contraseña?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;