// src/pages/auth/ConfirmRegistration.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { BoltIcon } from '@heroicons/react/24/solid';

// Esquema de validación
const confirmSchema = z.object({
  email: z.string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido'),
  code: z.string()
    .min(1, 'El código es requerido')
    .min(6, 'El código debe tener al menos 6 caracteres')
});

/**
 * Componente para confirmar el registro de un nuevo usuario
 */
const ConfirmRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Hooks
  const { confirmRegistration, resendConfirmationCode } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener email del estado de navegación (si está disponible)
  const emailFromState = location.state?.email || '';
  
  // Configurar React Hook Form
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: emailFromState,
      code: ''
    }
  });
  
  // Establecer el email desde la navegación
  useEffect(() => {
    if (emailFromState) {
      setValue('email', emailFromState);
    }
  }, [emailFromState, setValue]);
  
  // Manejar la confirmación del registro
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await confirmRegistration(data.email, data.code);
      
      if (result.success) {
        toast.success('¡Cuenta confirmada correctamente! Ahora puedes iniciar sesión.');
        
        // Redireccionar al login después de un breve retraso
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(result.error || 'Error al confirmar la cuenta');
      }
    } catch (error) {
      console.error('Error al confirmar registro:', error);
      toast.error(error.message || 'Error al confirmar el registro');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar el reenvío del código
  const handleResendCode = async () => {
    const email = document.getElementById('email').value;
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    setIsResending(true);
    try {
      const result = await resendConfirmationCode(email);
      
      if (result.success) {
        toast.success('Se ha enviado un nuevo código a tu correo');
      } else {
        throw new Error(result.error || 'Error al reenviar el código');
      }
    } catch (error) {
      console.error('Error al reenviar código:', error);
      toast.error(error.message || 'Error al reenviar el código');
    } finally {
      setIsResending(false);
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
          Confirma tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa el código que enviamos a tu correo electrónico
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  {...register('email')}
                  disabled={!!emailFromState}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
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
                    errors.code ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  {...register('code')}
                />
                {errors.code && (
                  <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? 'Enviando...' : '¿No recibiste el código?'}
              </button>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verificando...' : 'Confirmar cuenta'}
              </button>
            </div>
          </form>
          
          {/* Enlaces adicionales */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya confirmaste tu cuenta?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegistration;