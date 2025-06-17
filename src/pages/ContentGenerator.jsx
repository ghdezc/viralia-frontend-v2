// src/pages/ContentGenerator.jsx - GENERADOR COMPLETO
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { viraliaApi } from '../services/api/viraliaApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ContentGenerator = () => {
  // Estados principales
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LinkedIn']);
  const [tone, setTone] = useState('profesional');
  const [isUrl, setIsUrl] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Refs y hooks
  const abortControllerRef = useRef(null);
  const { user } = useAuth();
  const toast = useToast();

  // Configuración de plataformas
  const platforms = [
    { id: 'LinkedIn', name: 'LinkedIn', color: '#0077b5', icon: '💼' },
    { id: 'Twitter', name: 'Twitter/X', color: '#1da1f2', icon: '🐦' },
    { id: 'Facebook', name: 'Facebook', color: '#4267b2', icon: '📘' },
    { id: 'Instagram', name: 'Instagram', color: '#e1306c', icon: '📸' },
  ];

  // Opciones de tono
  const toneOptions = [
    { value: 'profesional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'inspirador', label: 'Inspirador' },
    { value: 'educativo', label: 'Educativo' },
    { value: 'humoristico', label: 'Humorístico' },
  ];

  // Sugerencias rápidas
  const quickSuggestions = [
    'Estrategias de marketing digital 2025',
    'Inteligencia artificial en empresas',
    'Tendencias de redes sociales',
    'Productividad en el trabajo remoto',
    'Innovación tecnológica',
    'Liderazgo empresarial',
  ];

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Manejar selección de plataformas
  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Detectar si es URL
  const handlePromptChange = (value) => {
    setPrompt(value);
    setIsUrl(value.startsWith('http://') || value.startsWith('https://'));
  };

  // Generar contenido
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor ingresa un tema o URL');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Selecciona al menos una plataforma');
      return;
    }

    // Cancelar petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      console.log('🎯 Generando contenido:', {
        tema: prompt,
        tono: tone,
        plataformas: selectedPlatforms,
        es_url: isUrl,
        user_id: user?.email || 'demo-user'
      });

      const result = await viraliaApi.generateContent({
        tema: prompt,
        tono: tone,
        plataformas: selectedPlatforms,
        es_url: isUrl,
        user_id: user?.email || 'demo-user'
      });

      console.log('✅ Resultado:', result);

      if (result.success) {
        setGeneratedContent(result.result);
        toast.success('¡Contenido generado exitosamente!');

        // Mostrar diferenciadores
        if (result.diferenciadores?.length > 0) {
          console.log('🚀 Diferenciadores Viralia:', result.diferenciadores);
        }
      } else {
        throw new Error('Error en la generación');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(error.message || 'Error al generar contenido');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar contenido
  const copyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Contenido copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Generador de Contenido Viral
          </h1>
          <p className="text-gray-600">
            Crea contenido optimizado para múltiples plataformas con IA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel de Configuración */}
          <div className="lg:col-span-1 space-y-6">
            {/* Formulario Principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">⚙️ Configuración</h2>

              {/* Input del tema/URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isUrl ? '🌐 URL del contenido' : '💭 Tema del contenido'}
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={3}
                    placeholder={isUrl ? 'https://ejemplo.com/articulo' : 'Ej: Estrategias de marketing digital para PyMEs'}
                />
                {isUrl && (
                    <p className="text-xs text-blue-600 mt-1">
                      📄 Detectamos una URL - analizaremos el contenido
                    </p>
                )}
              </div>

              {/* Selección de Plataformas */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 Plataformas ({selectedPlatforms.length})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                      <button
                          key={platform.id}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                              selectedPlatforms.includes(platform.id)
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <span className="text-lg mr-2">{platform.icon}</span>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </button>
                  ))}
                </div>
              </div>

              {/* Selector de Tono */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎭 Tono de voz
                </label>
                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {toneOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                  ))}
                </select>
              </div>

              {/* Opciones Avanzadas */}
              <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 mb-4"
              >
                {showAdvanced ? '🔼' : '🔽'} Opciones avanzadas
              </button>

              {showAdvanced && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Incluir hashtags trending</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Optimizar para viralidad</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Incluir call-to-action</span>
                      </label>
                    </div>
                  </div>
              )}

              {/* Botón Generar */}
              <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || selectedPlatforms.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      Generando contenido...
                    </>
                ) : (
                    <>
                      ⚡ Generar Contenido
                    </>
                )}
              </button>
            </div>

            {/* Sugerencias Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Sugerencias</h3>
              <div className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handlePromptChange(suggestion)}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de Resultados */}
          <div className="lg:col-span-2">
            {isGenerating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">
                    Generando contenido optimizado con IA...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Esto puede tomar hasta 30 segundos
                  </p>
                </div>
            )}

            {!isGenerating && !generatedContent && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    ¡Listo para crear contenido viral!
                  </h3>
                  <p className="text-gray-600">
                    Configura tu contenido y haz clic en "Generar" para comenzar
                  </p>
                </div>
            )}

            {generatedContent && (
                <div className="space-y-6">
                  {Object.entries(generatedContent).map(([platform, content]) => (
                      <ContentCard
                          key={platform}
                          platform={platform}
                          content={content}
                          onCopy={copyContent}
                      />
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

// Componente para mostrar el contenido generado
const ContentCard = ({ platform, content, onCopy }) => {
  const platformConfig = {
    LinkedIn: { color: '#0077b5', icon: '💼' },
    Twitter: { color: '#1da1f2', icon: '🐦' },
    Facebook: { color: '#4267b2', icon: '📘' },
    Instagram: { color: '#e1306c', icon: '📸' },
  };

  const config = platformConfig[platform] || platformConfig.LinkedIn;

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{config.icon}</span>
              <h3 className="text-lg font-semibold" style={{ color: config.color }}>
                {platform}
              </h3>
            </div>
            <button
                onClick={() => onCopy(content.content)}
                className="flex items-center px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm mr-1">📋</span>
              <span className="text-sm">Copiar</span>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {content.title && (
              <h4 className="text-xl font-bold mb-4 text-gray-800">
                {content.title}
              </h4>
          )}

          <div className="prose max-w-none mb-4">
            <p className="text-gray-800 whitespace-pre-line">
              {content.content}
            </p>
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {content.hashtags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
                ))}
              </div>
          )}

          {/* Métricas */}
          {content.metrics && (
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-indigo-600">
                    {content.metrics.potencialViral || '85'}
                  </div>
                  <div className="text-xs text-gray-500">Potencial Viral</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {content.metrics.engagementScore || '78'}
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {content.metrics.alcanceEstimado || '10K-15K'}
                  </div>
                  <div className="text-xs text-gray-500">Alcance Est.</div>
                </div>
              </div>
          )}

          {/* Warning si existe */}
          {content.warning && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">⚠️ {content.warning}</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default ContentGenerator;