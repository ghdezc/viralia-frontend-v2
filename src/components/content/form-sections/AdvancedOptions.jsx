// src/components/content/form-sections/AdvancedOptions.jsx
import PropTypes from 'prop-types';

/**
 * Componente para mostrar opciones avanzadas de formulario
 * Configurable según la plataforma (Twitter, LinkedIn, etc.)
 */
const AdvancedOptions = ({ register, isGenerating, fields }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      {/* Tipo de contenido */}
      {fields.contentTypes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de contenido
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {fields.contentTypes.map((type) => (
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
                  className="flex p-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer peer-checked:bg-primary-50 peer-checked:border-primary-500 hover:bg-gray-50 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objetivo del contenido */}
      {fields.goals && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo del contenido
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            {...register('goal')}
            disabled={isGenerating}
          >
            {fields.goals.map(goal => (
              <option key={goal.value} value={goal.value}>{goal.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tono de voz */}
      {fields.tones && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tono de voz
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            {...register('tone')}
            disabled={isGenerating}
          >
            {fields.tones.map(tone => (
              <option key={tone.value} value={tone.value}>{tone.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Checkboxes para opciones adicionales */}
      {fields.options && (
        <div className="flex flex-wrap gap-4">
          {fields.options.map(option => (
            <div key={option.id} className="flex items-center">
              <input
                id={`include-${option.id}`}
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register(option.name)}
                disabled={isGenerating}
              />
              <label htmlFor={`include-${option.id}`} className="ml-2 text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AdvancedOptions.propTypes = {
  register: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  fields: PropTypes.shape({
    contentTypes: PropTypes.array,
    goals: PropTypes.array,
    tones: PropTypes.array,
    options: PropTypes.array
  })
};

export default AdvancedOptions;
