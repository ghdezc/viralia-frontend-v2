// src/components/content/form-sections/SuggestionsList.jsx
import PropTypes from 'prop-types';

/**
 * Componente para mostrar sugerencias rápidas en los formularios de contenido
 */
const SuggestionsList = ({ suggestions, setPrompt, prompt, isGenerating }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-medium text-gray-700">Sugerencias rápidas</h3>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        {suggestions.map((suggestion) => (
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
  );
};

SuggestionsList.propTypes = {
  suggestions: PropTypes.array,
  setPrompt: PropTypes.func.isRequired,
  prompt: PropTypes.string,
  isGenerating: PropTypes.bool
};

export default SuggestionsList;
