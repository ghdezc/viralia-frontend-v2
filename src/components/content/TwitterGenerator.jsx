// src/components/content/TwitterGenerator.jsx
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validación para el formulario
const twitterFormSchema = z.object({
  prompt: z.string().min(3, 'Por favor ingresa al menos 3 caracteres'),
  contentType: z.enum(['tweet', 'thread', 'poll'], {
    required_error: 'Selecciona un tipo de contenido',
  }),
  goal: z.enum(['viral', 'engagement', 'awareness', 'traffic', 'opinion'], {
    required_error: 'Selecciona un objetivo',
  }),
  tone: z.enum(['casual', 'informative', 'humorous', 'controversial'], {
    required_error: 'Selecciona un tono',
  }),
  includeHashtags: z.boolean().default(true),
  includeCTA: z.boolean().default(true),
  includeEmojis: z.boolean().default(true),
});

export default function TwitterGenerator({ prompt, setPrompt, isGenerating, onSubmit }) {
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Configurar react-hook-form con validación zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(twitterFormSchema),
    defaultValues: {
      prompt: prompt || '',
      contentType: 'tweet',
      goal: 'engagement',
      tone: 'casual',
      includeHashtags: true,
      includeCTA: true,
      includeEmojis: true,
    },
  });

  // Función para manejar el envío del formulario
  const processSubmit = (data) => {
    // Actualizar el prompt en el componente padre
    setPrompt(data.prompt);
    
    // Llamar al onSubmit del componente padre con los datos del formulario
    onSubmit(new Event('submit'));
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      {/* Campo principal para el prompt */}
      <div>
        <label htmlFor="twitter-prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Tema o idea para tu tweet
        </label>
        <textarea
          id="twitter-prompt"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.prompt ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: consejos de productividad, opinión sobre IA, tendencias tecnológicas..."
          {...register('prompt')}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        {errors.prompt && (
          <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Sé conciso pero específico. Twitter premia la claridad y originalidad.
        </p>
      </div>

      {/* Toggle para opciones avanzadas */}
      <div className="flex items-center">
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          onClick={() => setAdvancedMode(!advancedMode)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 mr-1 transition-transform ${advancedMode ? 'rotate-90' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Opciones avanzadas
        </button>
      </div>

      {/* Opciones avanzadas (condicional) */}
      {advancedMode && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          {/* Tipo de contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tweet', label: 'Tweet único' },
                { id: 'thread', label: 'Hilo' },
                { id: 'poll', label: 'Encuesta' },
              ].map((type) => (
                <div key={type.id} className="relative">
                  <input
                    type="radio"
                    id={`content-type-${type.id}`}
                    value={type.id}
                    className="sr-only peer"
                    {...register('contentType')}
                    disabled={isGenerating}
                  />
                  <label
                    htmlFor={`content-type-${type.id}`}
                    className="flex p-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer peer-checked:bg-indigo-50 peer-checked:border-indigo-500 hover:bg-gray-50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Objetivo del contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo del tweet
            </label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register('goal')}
              disabled={isGenerating}
            >
              <option value="viral">Maximizar viralidad</option>
              <option value="engagement">Generar conversación</option>
              <option value="awareness">Aumentar visibilidad</option>
              <option value="traffic">Dirigir tráfico</option>
              <option value="opinion">Compartir opinión</option>
            </select>
          </div>

          {/* Tono de voz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tono de voz
            </label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register('tone')}
              disabled={isGenerating}
            >
              <option value="casual">Casual y conversacional</option>
              <option value="informative">Informativo y educativo</option>
              <option value="humorous">Humorístico</option>
              <option value="controversial">Provocativo (debate)</option>
            </select>
          </div>

          {/* Checkboxes para opciones adicionales */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                id="include-hashtags"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                {...register('includeHashtags')}
                disabled={isGenerating}
              />
              <label htmlFor="include-hashtags" className="ml-2 text-sm text-gray-700">
                Hashtags
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="include-cta"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                {...register('includeCTA')}
                disabled={isGenerating}
              />
              <label htmlFor="include-cta" className="ml-2 text-sm text-gray-700">
                Llamado a la acción
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="include-emojis"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                {...register('includeEmojis')}
                disabled={isGenerating}
              />
              <label htmlFor="include-emojis" className="ml-2 text-sm text-gray-700">
                Emojis
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Botón de generar */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isGenerating || !prompt?.trim()}
          className={`
            flex items-center justify-center px-6 py-2.5 rounded-md text-white font-medium
            ${
              isGenerating || !prompt?.trim()
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }
            transition-all duration-200
          `}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generando...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Generar tweet
            </>
          )}
        </button>
      </div>

      {/* Sugerencias rápidas */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700">Sugerencias rápidas</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            'Pregunta controversial', 
            'Dato sorprendente', 
            'Consejo práctico',
            'Opinión del sector', 
            'Predicción', 
            'Reflexión personal'
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setPrompt(prompt ? `${prompt} con enfoque de ${suggestion.toLowerCase()}` : suggestion)}
              className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              disabled={isGenerating}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
