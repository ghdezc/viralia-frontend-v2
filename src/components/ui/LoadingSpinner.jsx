// src/components/ui/LoadingSpinner.jsx - COMPLETAMENTE REDISEÑADO
import React from 'react';

/**
 * Componente de carga elegante y creativo
 * Diseño premium sin emojis, múltiples variantes
 */
const LoadingSpinner = ({
                          text = 'Procesando...',
                          size = 'md',
                          variant = 'default',
                          progress = null,
                          steps = null,
                          currentStep = 0
                        }) => {

  // Configuración de tamaños
  const sizeConfig = {
    sm: { spinner: 'h-6 w-6', text: 'text-xs', container: 'space-y-2' },
    md: { spinner: 'h-10 w-10', text: 'text-sm', container: 'space-y-3' },
    lg: { spinner: 'h-16 w-16', text: 'text-base', container: 'space-y-4' },
    xl: { spinner: 'h-20 w-20', text: 'text-lg', container: 'space-y-5' }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Variante para generación A/B (más creativa)
  if (variant === 'ab_generation') {
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generando Variaciones A/B</h3>
              <p className="text-gray-600">Creando contenido optimizado para cada plataforma</p>
            </div>

            {/* Progress Steps */}
            {steps && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                      ${index <= currentStep
                              ? 'bg-indigo-600 text-white scale-110'
                              : 'bg-gray-200 text-gray-400'
                          }
                      ${index === currentStep ? 'ring-4 ring-indigo-200 animate-pulse' : ''}
                    `}>
                            {index + 1}
                          </div>
                          <span className={`text-xs mt-1 transition-colors duration-300 ${
                              index <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-400'
                          }`}>
                      {step}
                    </span>
                        </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
            )}

            {/* Animated content */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>

            {/* Estimated time */}
            <div className="text-center">
              <p className="text-xs text-gray-500">Tiempo estimado: 30-60 segundos</p>
            </div>
          </div>
        </div>
    );
  }

  // Variante para análisis de contenido
  if (variant === 'analysis') {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
          <div className="relative">
            {/* Círculo exterior rotativo */}
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>

            {/* Círculo interior pulsante */}
            <div className="absolute inset-2 w-12 h-12 bg-blue-600 rounded-full animate-pulse flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">{text}</h3>
          <p className="text-sm text-gray-600 mt-1">Analizando métricas y optimizaciones</p>
        </div>
    );
  }

  // Variante con progress numérico
  if (variant === 'progress' && progress !== null) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm mx-auto">
          <div className="text-center mb-4">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium text-gray-900">{text}</p>
            <p className="text-sm text-gray-500 mt-1">Procesando datos...</p>
          </div>
        </div>
    );
  }

  // Spinner por defecto (elegante y minimalista)
  return (
      <div className={`flex flex-col items-center justify-center ${config.container}`}>
        <div className="relative">
          <div className={`${config.spinner} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
          </div>
        </div>

        {text && (
            <div className="text-center">
              <p className={`${config.text} font-medium text-gray-700`}>{text}</p>
              <div className="flex items-center justify-center mt-1 space-x-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    />
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default LoadingSpinner;