// src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validatePassword } from '../../utils/security';
import { BoltIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../../components/ui/LoadingScreen';
import { COGNITO_CONFIG } from '../../config/cognito-config';

// Esquema de validación con Zod
const registerSchema = z.object({
  fullName: z.string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(COGNITO_CONFIG.PASSWORD_POLICY.MIN_LENGTH, `La contraseña debe tener al menos ${COGNITO_CONFIG.PASSWORD_POLICY.MIN_LENGTH} caracteres`),
  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña'),
  terms: z.boolean()
    .refine(val => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Configurar React Hook Form con Zod
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });
  
  // Vigilar cambios en el campo de contraseña para validación en tiempo real
  const watchPassword = watch('password');
  
  // Validar contraseña cuando cambia
  const validatePasswordRules = (password) => {
    if (!password) return;
    
    const validation = validatePassword(password, COGNITO_CONFIG.PASSWORD_POLICY);
    setPasswordErrors(validation.errors);
  };
  
  // Manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Validar reglas de contraseña de Cognito
      const passwordValidation = validatePassword(data.password, COGNITO_CONFIG.PASSWORD_POLICY);
      
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        throw new Error(passwordValidation.errors[0]);
      }
      
      // Enviar solicitud de registro
      const result = await registerUser(
        data.email, // Usar email como username
        data.email,
        data.password,
        {
          name: data.fullName,
          // Atributos personalizados opcionales
          'custom:plan': 'free'
        }
      );
      
      if (result.success) {
        toast.success('Registro exitoso. Por favor verifica tu correo para confirmar tu cuenta.');
        
        // Redirigir a la página de confirmación
        navigate('/confirm-registration', { 
          state: { email: data.email }
        });
      } else {
        throw new Error(result.error || 'Error en el registro');
      }
    } catch (error) {
      toast.error(error.message || 'Error al registrar la cuenta');
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
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Únete a Viralia y potencia tu contenido con IA
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Campo de nombre completo */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>
            
            {/* Campo de correo electrónico */}
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
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  {...register('password')}
                  onChange={(e) => {
                    validatePasswordRules(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              {/* Indicadores de seguridad de contraseña */}
              {watchPassword && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Requisitos de contraseña:</div>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center ${watchPassword.length >= COGNITO_CONFIG.PASSWORD_POLICY.MIN_LENGTH ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`mr-1 ${watchPassword.length >= COGNITO_CONFIG.PASSWORD_POLICY.MIN_LENGTH ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                      Mínimo {COGNITO_CONFIG.PASSWORD_POLICY.MIN_LENGTH} caracteres
                    </li>
                    {COGNITO_CONFIG.PASSWORD_POLICY.REQUIRE_UPPERCASE && (
                      <li className={`flex items-center ${/[A-Z]/.test(watchPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`mr-1 ${/[A-Z]/.test(watchPassword) ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                        Al menos una mayúscula
                      </li>
                    )}
                    {COGNITO_CONFIG.PASSWORD_POLICY.REQUIRE_LOWERCASE && (
                      <li className={`flex items-center ${/[a-z]/.test(watchPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`mr-1 ${/[a-z]/.test(watchPassword) ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                        Al menos una minúscula
                      </li>
                    )}
                    {COGNITO_CONFIG.PASSWORD_POLICY.REQUIRE_NUMBERS && (
                      <li className={`flex items-center ${/[0-9]/.test(watchPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`mr-1 ${/[0-9]/.test(watchPassword) ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                        Al menos un número
                      </li>
                    )}
                    {COGNITO_CONFIG.PASSWORD_POLICY.REQUIRE_SYMBOLS && (
                      <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(watchPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className={`mr-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(watchPassword) ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                        Al menos un símbolo (!@#$%^&*)
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Campo de confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            
            {/* Términos y condiciones */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  {...register('terms')}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Acepto los <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">Términos y Condiciones</Link>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                )}
              </div>
            </div>
            
            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <LoadingSpinner text="Registrando..." /> : 'Registrarse'}
              </button>
            </div>
          </form>
          
          {/* Enlace para login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes una cuenta?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
