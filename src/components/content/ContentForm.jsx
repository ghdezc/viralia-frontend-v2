// src/components/content/ContentForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import AdvancedOptions from './form-sections/AdvancedOptions';
import SuggestionsList from './form-sections/SuggestionsList';
import LoadingButton from '../common/LoadingButton';

/**
 * Componente base para los formularios de generación de contenido
 * Reduce duplicación entre TwitterGenerator y LinkedInGenerator
 */
const ContentForm = ({
  platform,
  prompt,
  setPrompt,
  isGenerating,
  onSubmit,
  register,
  handleSubmit,
  errors,
  advancedFields,
  suggestions,
  buttonText = 'Generar contenido'
}) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Procesar el formulario
  const processSubmit = (data) => {
    setPrompt(data.prompt);
    onSubmit(new Event('submit'));
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      {/* Campo principal para el prompt */}
      <div>
        <label htmlFor={`${platform}-prompt`} className="block text-sm font-medium text-gray-700 mb-1">
          Tema o idea para tu publicación
        </label>
        <textarea
          id={`${platform}-prompt`}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
            errors.prompt ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`Ej: estrategias de marketing, tendencias de ${platform}...`}
          {...register('prompt')}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        {errors.prompt && (
          <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Sé específico para obtener mejores resultados.
        </p>
      </div>

      {/* Toggle para opciones avanzadas */}
      <div className="flex items-center">
        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
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
        <AdvancedOptions 
          register={register} 
          isGenerating={isGenerating} 
          fields={advancedFields} 
        />
      )}

      {/* Botón de generar */}
      <div className="flex justify-center">
        <LoadingButton
          type="submit"
          isLoading={isGenerating}
          disabled={isGenerating || !prompt?.trim()}
          icon={
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
          }
        >
          {buttonText}
        </LoadingButton>
      </div>

      {/* Sugerencias rápidas */}
      <SuggestionsList 
        suggestions={suggestions}
        setPrompt={setPrompt}
        prompt={prompt}
        isGenerating={isGenerating}
      />
    </form>
  );
};

ContentForm.propTypes = {
  platform: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  setPrompt: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  advancedFields: PropTypes.object,
  suggestions: PropTypes.array,
  buttonText: PropTypes.string
};

export default ContentForm;
