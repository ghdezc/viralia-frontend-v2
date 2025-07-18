// src/pages/ContentGenerator.jsx - COMPLETAMENTE CORREGIDO
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { viraliaApi } from '../services/api/viraliaApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ViralMetrics from '../components/metrics/ViralMetrics';
import {
  Sparkles,
  RotateCcw,
  FolderOpen,
  Recycle,
  BarChart3,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  Trash2,
  RefreshCw,
  History,
  Clock,
  TrendingUp,
  Target,
  Zap,
  CrownIcon
} from 'lucide-react';

const ContentGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [input, setInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin']);
  const [tone, setTone] = useState('profesional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [categoryResults, setCategoryResults] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPlatformForAction, setSelectedPlatformForAction] = useState('linkedin');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisType, setAnalysisType] = useState('sentiment');
  const [performanceMetrics, setPerformanceMetrics] = useState({
    alcance: 1200,
    engagement: 180,
    likes: 45,
    shares: 20,
    comentarios: 8
  });

  // Estados para loading mejorado
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [loadingVariant, setLoadingVariant] = useState('default');

  const { user } = useAuth();
  const toast = useToast();

  const isUrl = /^https?:\/\//.test(input.trim());

  // PLATAFORMAS ACTUALIZADAS - Sin Instagram, con Twitter Premium
  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'bg-blue-600',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter',
      color: 'bg-sky-600',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700',
      icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
      )
    },
    {
      id: 'twitter_premium',
      name: 'Twitter Premium',
      color: 'bg-gradient-to-r from-sky-600 to-purple-600',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      premium: true,
      icon: (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <CrownIcon className="w-3 h-3" />
          </div>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
      )
    }
  ];

  const tones = [
    { value: 'profesional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'entusiasta', label: 'Entusiasta' },
    { value: 'autoritativo', label: 'Autoritativo' },
    { value: 'inspiracional', label: 'Inspiracional' }
  ];

  const analysisTypes = [
    { value: 'sentiment', label: 'Análisis de Sentimiento', icon: BarChart3 },
    { value: 'hashtags', label: 'Sugerencia de Hashtags', icon: Target },
    { value: 'guidelines', label: 'Verificar Directrices', icon: CheckCircle },
    { value: 'schedule', label: 'Optimizar Horario', icon: Clock },
    { value: 'complete', label: 'Análisis Completo', icon: TrendingUp }
  ];

  // ✅ TABS CORREGIDOS - styling mejorado
  const tabs = [
    { id: 'generate', name: 'Generar', icon: Sparkles, color: 'indigo' },
    { id: 'categories', name: 'Categorías', icon: FolderOpen, color: 'green' },
    { id: 'recycle', name: 'Reciclar', icon: Recycle, color: 'blue' },
    { id: 'analysis', name: 'Analizar', icon: BarChart3, color: 'purple' },
    { id: 'saved', name: 'Guardados', icon: History, color: 'orange' }
  ];

  // Cargar posts guardados al iniciar
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const posts = await viraliaApi.getUserPosts({
        user_id: user?.email || 'demo-user',
        limit: 20
      });
      setSavedPosts(posts || []);
    } catch (error) {
      console.log('Error cargando posts guardados:', error);
    }
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // ✅ GENERACIÓN OPTIMIZADA CON PROGRESS STEPS CORREGIDO
  const handleGenerate = async () => {
    if (!input.trim() || selectedPlatforms.length === 0) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);
    setResults(null);

    // ✅ CORREGIDO: Loader específico para generación (no A/B)
    setLoadingVariant('generation');
    setLoadingSteps([
      'Analizando contenido',
      'Optimizando para plataformas',
      'Aplicando guidelines',
      'Calculando métricas virales',
      'Finalizando posts'
    ]);
    setCurrentLoadingStep(0);

    try {
      const generatedContent = {};

      for (let i = 0; i < selectedPlatforms.length; i++) {
        const platform = selectedPlatforms[i];

        // Actualizar progress step
        setCurrentLoadingStep(Math.floor((i / selectedPlatforms.length) * 5));
        await new Promise(resolve => setTimeout(resolve, 400)); // Delay más visible para UX

        console.log(`🎯 Generando contenido para ${platform}...`);

        const response = await viraliaApi.generateContent({
          tema: input,
          red: platform,
          tono: tone,
          user_id: user?.email || 'demo-user'
        });

        // ✅ CORREGIDO: Manejo específico para Twitter con versiones
        if (response?.result) {
          const platformKey = Object.keys(response.result)[0]; // LinkedIn/Twitter/Facebook etc.
          const rawContent = response.result[platformKey];

          if (rawContent) {
            let finalContent;

            // ✅ ESPECÍFICO PARA TWITTER: Detectar si tiene versiones free/premium
            if (platformKey === 'Twitter' && rawContent.free_version && rawContent.premium_version) {
              // Seleccionar la versión correcta según el checkbox seleccionado
              if (platform === 'twitter_premium') {
                finalContent = rawContent.premium_version;
                console.log(`📝 Twitter Premium seleccionado: ${finalContent.character_count} caracteres`);
              } else {
                finalContent = rawContent.free_version;
                console.log(`📝 Twitter Free seleccionado: ${finalContent.character_count} caracteres`);
              }
            } else {
              // Para LinkedIn, Facebook, etc. - estructura normal
              finalContent = rawContent;
            }

            generatedContent[platform] = {
              post: finalContent.post || finalContent.content,
              hashtags: finalContent.hashtags || [],
              viral_metrics: finalContent.viral_metrics || null,
              sentiment: finalContent.sentiment || null,
              checklist: finalContent.checklist || null,
              politicas_relevantes: finalContent.politicas_relevantes || [],
              character_count: finalContent.character_count || null,
              character_limit: finalContent.character_limit || null,
              type: finalContent.type || null // free/premium
            };
          }
        }
      }

      // Finalizar loading
      setCurrentLoadingStep(4);
      await new Promise(resolve => setTimeout(resolve, 600));

      setResults(generatedContent);
      toast.success(`Contenido generado para ${selectedPlatforms.length} plataforma${selectedPlatforms.length > 1 ? 's' : ''}`);

    } catch (error) {
      console.error('Error generando contenido:', error);
      toast.error('Error al generar contenido. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
      setLoadingProgress(0);
      setCurrentLoadingStep(0);
      setLoadingVariant('default');
    }
  };

  // ✅ NUEVO: Función para generar variaciones A/B
  const handleGenerateAB = async (platform, content) => {
    try {
      setIsGenerating(true);
      setLoadingVariant('ab_generation');

      console.log(`🔄 Generando variaciones A/B para ${platform}...`);

      const response = await viraliaApi.generateABVariations({
        content: content.post,
        red: platform,
        user_id: user?.email || 'demo-user'
      });

      if (response?.result) {
        toast.success('Variaciones A/B generadas correctamente');
        // TODO: Mostrar las variaciones en un modal o expandir la tarjeta
        console.log('Variaciones A/B:', response.result);
      }
    } catch (error) {
      console.error('Error generando variaciones A/B:', error);
      toast.error('Error generando variaciones A/B');
    } finally {
      setIsGenerating(false);
      setLoadingVariant('default');
    }
  };

  // ANÁLISIS CON LOADING ESPECÍFICO
  const handleAnalysis = async () => {
    if (!analysisInput.trim()) {
      toast.error('Por favor ingresa el contenido a analizar');
      return;
    }

    setIsGenerating(true);
    setAnalysisResults(null);
    setLoadingVariant('analysis');

    try {
      let response;

      switch (analysisType) {
        case 'sentiment':
          response = await viraliaApi.analyzeSentiment({
            text: analysisInput,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'hashtags':
          response = await viraliaApi.suggestHashtags({
            tema: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'guidelines':
          response = await viraliaApi.checkGuidelines({
            text: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'schedule':
          response = await viraliaApi.optimizeSchedule({
            tema: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'complete':
          response = await viraliaApi.getPerformanceInsights({
            metrics_json: performanceMetrics,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;
      }

      setAnalysisResults(response);
      toast.success('Análisis completado correctamente');

    } catch (error) {
      console.error('Error en análisis:', error);
      toast.error('Error realizando el análisis');
    } finally {
      setIsGenerating(false);
      setLoadingVariant('default');
    }
  };

  const handleSavePost = async (platform, content) => {
    try {
      await viraliaApi.savePost({
        platform,
        content: content.post,
        hashtags: content.hashtags,
        metrics: content.viral_metrics,
        user_id: user?.email || 'demo-user'
      });
      toast.success('Post guardado correctamente');
      loadSavedPosts();
    } catch (error) {
      toast.error('Error guardando el post');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Contenido copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  // ✅ COMPONENTE PARA TARJETAS DE RESULTADO MEJORADO
  const ContentResultCard = ({ platform, content, onSave, onCopy, onGenerateAB }) => {
    const platformConfig = platforms.find(p => p.id === platform);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header de la plataforma */}
          <div className={`px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${platformConfig?.color || 'bg-gray-600'} rounded-lg flex items-center justify-center text-white`}>
                  {platformConfig?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{platformConfig?.name || platform}</h3>
                  <p className="text-sm text-gray-600">Contenido optimizado</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {/* ✅ NUEVO: Botón para generar variaciones A/B */}
                <button
                    onClick={() => onGenerateAB(platform, content)}
                    className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors flex items-center space-x-1"
                    title="Generar variaciones A/B"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>A/B</span>
                </button>

                <button
                    onClick={() => onCopy(content.post)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copiar contenido"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onSave(platform, content)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Guardar post"
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-line leading-relaxed mb-6">
                {content.post}
              </p>

              {/* Hashtags */}
              {content.hashtags && content.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {content.hashtags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${platformConfig?.textColor || 'text-gray-700'} ${platformConfig?.borderColor || 'border-gray-200'} border bg-opacity-50`}
                        >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                    ))}
                  </div>
              )}

              {/* ✅ CORREGIDO: Integrar ViralMetrics */}
              {content.viral_metrics && (
                  <ViralMetrics metrics={content.viral_metrics} className="mt-6" />
              )}

              {/* Políticas relevantes */}
              {content.politicas_relevantes && content.politicas_relevantes.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Políticas Aplicadas</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {content.politicas_relevantes.map((policy, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-blue-500">•</span>
                            <span>{policy}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
          </div>
        </div>
    );
  };

  return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Generador de Contenido</h1>
            <p className="mt-2 text-gray-600">Crea contenido viral optimizado para múltiples plataformas</p>
          </div>

          {/* Loading overlay mejorado */}
          {isGenerating && (
              <LoadingSpinner
                  variant={loadingVariant}
                  text={
                    loadingVariant === 'ab_generation'
                        ? 'Creando contenido optimizado...'
                        : loadingVariant === 'analysis'
                            ? 'Analizando tu contenido...'
                            : 'Generando contenido...'
                  }
                  steps={loadingSteps.length > 0 ? loadingSteps : null}
                  currentStep={currentLoadingStep}
                  progress={loadingProgress}
              />
          )}

          {/* ✅ TABS CORREGIDOS - styling mejorado */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 max-w-fit">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                    flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm 
                    transition-all duration-200 ease-out min-w-[120px]
                    ${isActive
                            ? `bg-white text-${tab.color}-600 shadow-sm border border-gray-200 transform scale-[1.02]`
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                  `}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      <span>{tab.name}</span>
                    </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Panel lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6 shadow-sm">

                {activeTab === 'generate' && (
                    <>
                      <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                        <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">Configuración</h3>
                      </div>

                      {/* Tipo de contenido */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de contenido</label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button
                              onClick={() => setInput('')}
                              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                  !isUrl ? 'bg-white text-gray-900 shadow-sm transform scale-105' : 'text-gray-600 hover:text-gray-900'
                              }`}
                          >
                            Tema libre
                          </button>
                          <button
                              onClick={() => setInput('https://')}
                              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                  isUrl ? 'bg-white text-gray-900 shadow-sm transform scale-105' : 'text-gray-600 hover:text-gray-900'
                              }`}
                          >
                            Desde URL
                          </button>
                        </div>
                      </div>

                      {/* Input */}
                      <div className="mb-6">
                        {!isUrl ? (
                            <>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tema del contenido</label>
                              <textarea
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  placeholder="Ej: Estrategias de marketing digital para PyMEs en 2025"
                                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                  rows={4}
                              />
                              <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <Info className="h-3 w-3 mr-1" />
                                Describe detalladamente el tema que quieres abordar
                              </p>
                            </>
                        ) : (
                            <>
                              <label className="block text-sm font-medium text-gray-700 mb-2">URL para analizar</label>
                              <input
                                  type="url"
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  placeholder="https://ejemplo.com/articulo-interesante"
                                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              />
                              <p className="text-xs text-blue-600 mt-2 flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Analizaremos automáticamente el contenido de esta URL
                              </p>
                            </>
                        )}
                      </div>

                      {/* PLATAFORMAS ELEGANTES CON CHECKBOXES MÚLTIPLES */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                          Plataformas de destino
                          <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {selectedPlatforms.length} seleccionada{selectedPlatforms.length !== 1 ? 's' : ''}
                      </span>
                        </label>

                        <div className="grid grid-cols-1 gap-3">
                          {platforms.map((platform) => {
                            const isSelected = selectedPlatforms.includes(platform.id);
                            return (
                                <label
                                    key={platform.id}
                                    className={`
                              group relative flex items-center p-4 rounded-xl cursor-pointer
                              transition-all duration-300 ease-out
                              ${isSelected
                                        ? `bg-gradient-to-r from-gray-50 to-gray-100 border-2 ${platform.borderColor} shadow-md ring-1 ring-gray-200/50`
                                        : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }
                            `}
                                >
                                  {/* Checkbox personalizado */}
                                  <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handlePlatformToggle(platform.id)}
                                        className="sr-only"
                                    />

                                    {/* Custom checkbox indicator */}
                                    <div className={`
                                flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200
                                ${isSelected
                                        ? `${platform.color} border-transparent`
                                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                                    }
                              `}>
                                      {isSelected && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                      )}
                                    </div>
                                  </div>

                                  {/* Platform info */}
                                  <div className="flex items-center flex-1 ml-4">
                                    {/* Platform icon */}
                                    <div className={`
                                flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200
                                ${isSelected ? platform.color : 'bg-gray-100 text-gray-500'}
                                ${platform.premium ? 'relative' : ''}
                              `}>
                                      <div className={isSelected ? 'text-white' : 'text-gray-600'}>
                                        {platform.icon}
                                      </div>

                                      {/* Premium badge */}
                                      {platform.premium && (
                                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                          </div>
                                      )}
                                    </div>

                                    {/* Platform name and description */}
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                  <span className={`font-semibold text-sm ${isSelected ? platform.textColor : 'text-gray-900'}`}>
                                    {platform.name}
                                  </span>
                                        {platform.premium && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded">
                                      PRO
                                    </span>
                                        )}
                                      </div>

                                      {/* Platform benefits */}
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {platform.id === 'linkedin' && 'Contenido profesional y corporativo'}
                                        {platform.id === 'twitter' && 'Mensajes concisos hasta 280 caracteres'}
                                        {platform.id === 'twitter_premium' && 'Contenido largo hasta 25,000 caracteres'}
                                        {platform.id === 'facebook' && 'Contenido social y engagement'}
                                      </p>
                                    </div>

                                    {/* Selection indicator */}
                                    <div className={`
                                w-2 h-2 rounded-full transition-all duration-200
                                ${isSelected ? platform.color : 'bg-gray-300'}
                              `} />
                                  </div>
                                </label>
                            );
                          })}
                        </div>

                        {/* Quick selection actions */}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setSelectedPlatforms(platforms.map(p => p.id))}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              Seleccionar todas
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                                type="button"
                                onClick={() => setSelectedPlatforms([])}
                                className="text-xs font-medium text-gray-500 hover:text-gray-600 transition-colors"
                            >
                              Limpiar selección
                            </button>
                          </div>

                          <div className="text-xs text-gray-500">
                            Genera contenido optimizado para cada plataforma
                          </div>
                        </div>
                      </div>

                      {/* Tono */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tono de comunicación</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          {tones.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Botón generar */}
                      <button
                          onClick={handleGenerate}
                          disabled={isGenerating || !input.trim() || selectedPlatforms.length === 0}
                          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {isGenerating ? (
                            <>
                              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                              Generando...
                            </>
                        ) : (
                            <>
                              <Sparkles className="h-5 w-5 mr-2" />
                              Generar Contenido
                            </>
                        )}
                      </button>
                    </>
                )}

                {/* Otras pestañas... */}
                {activeTab === 'analysis' && (
                    <>
                      <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">Análisis</h3>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de análisis</label>
                        <select
                            value={analysisType}
                            onChange={(e) => setAnalysisType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        >
                          {analysisTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido a analizar</label>
                        <textarea
                            value={analysisInput}
                            onChange={(e) => setAnalysisInput(e.target.value)}
                            placeholder="Pega aquí el contenido que quieres analizar..."
                            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            rows={4}
                        />
                      </div>

                      {['guidelines', 'hashtags', 'schedule', 'complete'].includes(analysisType) && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
                            <select
                                value={selectedPlatformForAction}
                                onChange={(e) => setSelectedPlatformForAction(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                              {platforms.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                      )}

                      <button
                          onClick={handleAnalysis}
                          disabled={isGenerating || !analysisInput.trim()}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {isGenerating ? (
                            <>
                              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                              Analizando...
                            </>
                        ) : (
                            <>
                              <BarChart3 className="h-5 w-5 mr-2" />
                              Analizar Contenido
                            </>
                        )}
                      </button>
                    </>
                )}
              </div>
            </div>

            {/* Panel de resultados */}
            <div className="lg:col-span-2">
              {activeTab === 'generate' && (
                  <>
                    {!results && !isGenerating && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-8 w-8 text-indigo-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Generador de Contenido Viral
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Crea contenido optimizado para múltiples plataformas con IA avanzada
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Métricas virales incluidas</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Optimizado por plataforma</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span>Hashtags inteligentes</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Análisis de sentimiento</span>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* ✅ CORREGIDO: Mostrar contenido generado */}
                    {results && (
                        <div className="space-y-6">
                          {Object.entries(results).map(([platform, content]) => (
                              <ContentResultCard
                                  key={platform}
                                  platform={platform}
                                  content={content}
                                  onSave={() => handleSavePost(platform, content)}
                                  onCopy={() => copyToClipboard(content.post)}
                                  onGenerateAB={() => handleGenerateAB(platform, content)}
                              />
                          ))}
                        </div>
                    )}
                  </>
              )}

              {/* Otras pestañas similares... */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ContentGenerator;