// src/pages/UpgradePlan.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { CheckIcon } from '@heroicons/react/24/solid';

/**
 * Página para actualizar a un plan premium
 * Se muestra cuando un usuario intenta acceder a funcionalidades que requieren un plan superior
 */
const UpgradePlan = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener información del plan requerido del estado (si está disponible)
  const requiredPlan = location.state?.requiredPlan || 'pro';
  const currentPlan = location.state?.currentPlan || user?.plan || user?.['custom:plan'] || 'free';
  
  // Planes disponibles con sus características
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      description: 'Ideal para comenzar con la generación de contenido',
      features: [
        'Generación de 20 posts al mes',
        'Análisis básico de rendimiento',
        'Acceso a dos redes sociales',
        'Soporte por email'
      ],
      current: currentPlan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '19,99',
      description: 'Perfecto para creadores de contenido y pequeñas empresas',
      features: [
        'Generación ilimitada de contenido',
        'Análisis avanzado de rendimiento',
        'Acceso a todas las redes sociales',
        'Programación de publicaciones',
        'Campañas automáticas',
        'Soporte prioritario'
      ],
      current: currentPlan === 'pro',
      recommended: true
    },
    {
      id: 'business',
      name: 'Business',
      price: '49,99',
      description: 'Para equipos y empresas con necesidades avanzadas',
      features: [
        'Todo lo incluido en Pro',
        'Múltiples usuarios (hasta 5)',
        'API de integración',
        'Personalización de marca',
        'Estrategias de contenido personalizadas',
        'Soporte 24/7'
      ],
      current: currentPlan === 'business'
    }
  ];
  
  // Manejar la actualización del plan
  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    try {
      // En un entorno real, aquí procesaríamos el pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular éxito
      toast.success(`Plan actualizado a ${selectedPlan} correctamente`);
      
      // Redirigir al dashboard o a la página que intentaba acceder
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Actualiza tu plan
          </h1>
          {requiredPlan && (
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              La funcionalidad que intentas acceder requiere el plan {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}.
            </p>
          )}
        </div>
        
        {/* Planes de suscripción */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative flex flex-col rounded-2xl border ${
                selectedPlan === plan.id 
                  ? 'border-indigo-600 shadow-lg' 
                  : 'border-gray-200 shadow-sm hover:shadow'
              } p-6 bg-white`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 -mt-3 mr-8">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Recomendado
                  </span>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute top-0 left-0 -mt-3 ml-8">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Plan actual
                  </span>
                </div>
              )}
              
              <div className="mt-4 flex items-baseline text-gray-900">
                <span className="text-4xl font-extrabold">{plan.price}€</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/mes</span>
              </div>
              
              <div className="mt-2">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              </div>
              
              <div className="mt-4 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-5 w-5 text-indigo-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <input
                  type="radio"
                  id={`plan-${plan.id}`}
                  name="selected-plan"
                  className="sr-only"
                  checked={selectedPlan === plan.id}
                  onChange={() => setSelectedPlan(plan.id)}
                />
                <label
                  htmlFor={`plan-${plan.id}`}
                  className={`block w-full py-2 px-3 rounded-md ${
                    selectedPlan === plan.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-600'
                  } text-center text-sm font-medium cursor-pointer`}
                >
                  {plan.current 
                    ? 'Plan actual' 
                    : selectedPlan === plan.id 
                      ? 'Seleccionado' 
                      : 'Seleccionar plan'}
                </label>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de acción */}
        <div className="mt-12 flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </Link>
          
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={isProcessing || currentPlan === selectedPlan}
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing 
              ? 'Procesando...' 
              : currentPlan === selectedPlan 
                ? 'Plan actual' 
                : `Actualizar a ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`}
          </button>
        </div>
        
        {/* Información adicional */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            ¿Tienes preguntas sobre nuestros planes? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Contacta con nosotros</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;