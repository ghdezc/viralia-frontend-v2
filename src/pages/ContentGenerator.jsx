// src/pages/ContentGenerator.jsx - SOLO mejoras de estilo, misma funcionalidad
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { viraliaApi } from '../services/api/viraliaApi';
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
  Zap
} from 'lucide-react';

const ContentGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [input, setInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LinkedIn']);
  const [tone, setTone] = useState('profesional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [categoryResults, setCategoryResults] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPlatformForAction, setSelectedPlatformForAction] = useState('LinkedIn');
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

  const { user } = useAuth();
  const toast = useToast();

  const isUrl = /^https?:\/\//.test(input.trim());

  const platforms = [
    { id: 'LinkedIn', name: 'LinkedIn', color: 'bg-blue-600' },
    { id: 'Twitter', name: 'Twitter', color: 'bg-gray-900' },
    { id: 'Facebook', name: 'Facebook', color: 'bg-blue-700' },
    { id: 'Instagram', name: 'Instagram', color: 'bg-pink-600' }
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

  // 1. GENERAR CONTENIDO PRINCIPAL
  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Ingresa un tema o URL');
      return;
    }

    setIsGenerating(true);
    setResults(null);

    try {
      const result = await viraliaApi.generateContent({
        tema: input,
        tono: tone,
        plataformas: selectedPlatforms,
        es_url: isUrl,
        user_id: user?.email || 'demo-user'
      });

      if (result.success) {
        setResults(result.result);
        toast.success('¡Contenido generado!');
      }
    } catch (error) {
      toast.error(error.message || 'Error al generar contenido');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. VARIANTES A/B - desde un post específico
  const handleGenerateAB = async (postContent, platform) => {
    setIsGenerating(true);
    try {
      const variations = await viraliaApi.generateABVariations({
        base_post: postContent,
        red: platform,
        user_id: user?.email || 'demo-user'
      });

      const variationsData = Array.isArray(variations) ? variations : [variations];

      setResults(prev => ({
        ...prev,
        [`${platform}_AB_Variantes`]: {
          content: `=== VARIANTES A/B ===\n\n${variationsData.map((v, i) => `VARIANTE ${i + 1}:\n${v}\n\n`).join('')}`,
          hashtags: [],
          sentiment: 'neutral',
          checklist: {},
          politicas_relevantes: []
        }
      }));

      toast.success('Variantes A/B generadas');
    } catch (error) {
      toast.error('Error generando variantes A/B');
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. POR CATEGORÍAS
  const handleGenerateByCategory = async () => {
    if (!input.trim()) {
      toast.error('Ingresa un tema');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await viraliaApi.generateByCategory({
        tema: input,
        red: selectedPlatformForAction,
        user_id: user?.email || 'demo-user'
      });

      setCategoryResults(result);
      setActiveTab('categories');
      toast.success('Contenido por categorías generado');
    } catch (error) {
      toast.error('Error generando por categorías');
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. RECICLAR CONTENIDO
  const handleRecycleContent = async (oldPost, platform) => {
    setIsGenerating(true);
    try {
      const recycled = await viraliaApi.recycleContent({
        old_post: oldPost,
        red: platform,
        user_id: user?.email || 'demo-user'
      });

      setResults(prev => ({
        ...prev,
        [`${platform}_Reciclado`]: {
          content: recycled,
          hashtags: [],
          sentiment: 'neutral',
          checklist: {},
          politicas_relevantes: []
        }
      }));

      setActiveTab('generate');
      toast.success('Contenido reciclado');
    } catch (error) {
      toast.error('Error reciclando contenido');
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. GUARDAR POST
  const handleSavePost = async (content, platform) => {
    try {
      await viraliaApi.savePost({
        content: content.post || content.content,
        platform,
        user_id: user?.email || 'demo-user',
        title: content.title || content.content.substring(0, 50) + '...',
        hashtags: content.hashtags || [],
        metrics: content.metrics || {}
      });

      toast.success('Post guardado');
      loadSavedPosts();
    } catch (error) {
      toast.error('Error guardando post');
    }
  };

  // 6. ANÁLISIS COMPLETO
  const handleAnalysis = async () => {
    if (!analysisInput.trim()) {
      toast.error('Ingresa contenido para analizar');
      return;
    }

    setIsGenerating(true);
    try {
      let result = {};

      switch (analysisType) {
        case 'sentiment':
          result.sentiment = await viraliaApi.analyzeSentiment({
            text: analysisInput,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'guidelines':
          result.guidelines = await viraliaApi.checkGuidelines({
            text: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'hashtags':
          result.hashtags = await viraliaApi.suggestHashtags({
            text: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'schedule':
          result.schedule = await viraliaApi.optimizeSchedule({
            tema: analysisInput,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'performance':
          result.insights = await viraliaApi.getPerformanceInsights({
            metrics_json: performanceMetrics,
            red: selectedPlatformForAction,
            user_id: user?.email || 'demo-user'
          });
          break;

        case 'complete':
          const [sentiment, guidelines, hashtags, schedule] = await Promise.all([
            viraliaApi.analyzeSentiment({ text: analysisInput, user_id: user?.email || 'demo-user' }),
            viraliaApi.checkGuidelines({ text: analysisInput, red: selectedPlatformForAction, user_id: user?.email || 'demo-user' }),
            viraliaApi.suggestHashtags({ text: analysisInput, red: selectedPlatformForAction, user_id: user?.email || 'demo-user' }),
            viraliaApi.optimizeSchedule({ tema: analysisInput, red: selectedPlatformForAction, user_id: user?.email || 'demo-user' })
          ]);

          result = { sentiment, guidelines, hashtags, schedule };
          break;
      }

      setAnalysisResults(result);
      toast.success('Análisis completado');
    } catch (error) {
      toast.error('Error en el análisis');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const renderRealChecklist = (checklist) => {
    if (!checklist || typeof checklist !== 'object') return null;

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Checklist de Calidad</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(checklist).map(([key, value]) => (
                <div key={key} className="flex items-center text-xs">
                  {value ? (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                      <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={value ? 'text-green-700' : 'text-red-700'}>
                {key.replace(/_/g, ' ')}
              </span>
                </div>
            ))}
          </div>
        </div>
    );
  };

  return (
      <div className="space-y-6">
        {/* Header mejorado visualmente pero conservador */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Generador de Contenido
              </h1>
              <p className="text-gray-600 mt-1">
                Crea contenido optimizado para tus redes sociales con IA
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Posts generados hoy: 12</span>
              <span>•</span>
              <span>Promedio viral: 87%</span>
            </div>
          </div>
        </div>

        {/* Tabs mejoradas pero manteniendo funcionalidad */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {[
              { id: 'generate', name: 'Generar', icon: Sparkles, color: 'indigo' },
              { id: 'categories', name: 'Categorías', icon: FolderOpen, color: 'green' },
              { id: 'recycle', name: 'Reciclar', icon: Recycle, color: 'orange' },
              { id: 'analyze', name: 'Análisis', icon: BarChart3, color: 'purple' }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-3 rounded-md transition-all duration-200 ${
                          isActive
                              ? `bg-${tab.color}-600 text-white shadow-md transform scale-105`
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                  >
                    <IconComponent className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel lateral con mejor styling */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6 shadow-sm">

              {activeTab === 'generate' && (
                  <>
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                      <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Configuración</h3>
                    </div>

                    {/* Tipo de contenido mejorado */}
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

                    {/* Input mejorado */}
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

                    {/* Plataformas mejoradas */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Plataformas seleccionadas ({selectedPlatforms.length})
                      </label>
                      <div className="space-y-3">
                        {platforms.map((platform) => (
                            <label key={platform.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <input
                                  type="checkbox"
                                  checked={selectedPlatforms.includes(platform.id)}
                                  onChange={() => handlePlatformToggle(platform.id)}
                                  className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`}></div>
                              <span className="text-sm font-medium">{platform.name}</span>
                            </label>
                        ))}
                      </div>
                    </div>

                    {/* Tono mejorado */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tono de comunicación</label>
                      <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="profesional">Profesional</option>
                        <option value="casual">Casual</option>
                        <option value="inspirador">Inspirador</option>
                        <option value="educativo">Educativo</option>
                      </select>
                    </div>

                    {/* Botón principal mejorado */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !input.trim()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {isGenerating ? (
                          <>
                            <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                            Generando contenido...
                          </>
                      ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Generar Contenido
                          </>
                      )}
                    </button>

                    {/* Botón secundario mejorado */}
                    <button
                        onClick={handleGenerateByCategory}
                        disabled={isGenerating || !input.trim()}
                        className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-all duration-200"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      También por Categorías
                    </button>
                  </>
              )}

              {/* Resto de tabs manteniendo funcionalidad original pero con mejor estilo */}
              {activeTab === 'categories' && (
                  <>
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                      <FolderOpen className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Por Categorías</h3>
                    </div>

                    {categoryResults ? (
                        <div className="space-y-4">
                          {Object.entries(categoryResults).map(([category, content]) => (
                              <div key={category} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium capitalize text-sm text-gray-900">{category}</span>
                                  <button
                                      onClick={() => copyToClipboard(content)}
                                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Copy className="h-3 w-3 text-gray-500" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-700 line-clamp-3">{content}</p>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">Genera contenido primero para ver las categorías aquí.</p>
                        </div>
                    )}
                  </>
              )}

              {activeTab === 'recycle' && (
                  <>
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                      <Recycle className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Reciclar Posts</h3>
                    </div>

                    {savedPosts.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {savedPosts.map((post) => (
                              <div key={post.post_id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{post.platform}</span>
                                  <button
                                      onClick={() => handleRecycleContent(post.content, post.platform)}
                                      className="p-1.5 hover:bg-orange-100 rounded text-orange-600 transition-colors"
                                      disabled={isGenerating}
                                  >
                                    <Recycle className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-700 line-clamp-3">{post.content}</p>
                                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                          <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">No tienes posts guardados aún.</p>
                          <p className="text-xs text-gray-500 mt-1">Guarda posts para poder reciclarlos después.</p>
                        </div>
                    )}
                  </>
              )}

              {activeTab === 'analyze' && (
                  <>
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                      <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Centro de Análisis</h3>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de análisis</label>
                      <select
                          value={analysisType}
                          onChange={(e) => setAnalysisType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      >
                        <option value="sentiment">Análisis de Sentimiento</option>
                        <option value="guidelines">Verificar Directrices</option>
                        <option value="hashtags">Sugerir Hashtags</option>
                        <option value="schedule">Horario Óptimo</option>
                        <option value="performance">Predicción Rendimiento</option>
                        <option value="complete">Análisis Completo</option>
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

          {/* Panel de resultados con mejor styling pero misma funcionalidad */}
          <div className="lg:col-span-2">
            {activeTab === 'generate' && (
                <>
                  {!results && !isGenerating && (
                      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Listo para generar</h3>
                        <p className="text-gray-600">Configura tu contenido en el panel lateral y genera posts optimizados</p>
                      </div>
                  )}

                  {isGenerating && (
                      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generando contenido...</h3>
                        <p className="text-gray-600">Esto puede tomar hasta 30 segundos</p>
                        <div className="mt-4 bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                          <div className="bg-indigo-600 h-2 rounded-full animate-pulse w-3/4"></div>
                        </div>
                      </div>
                  )}

                  {results && (
                      <div className="space-y-6">
                        {Object.entries(results).map(([platform, content]) => {
                          const platformConfig = platforms.find(p => platform.includes(p.id.replace('_Reciclado', '').replace('_AB_Variantes', '')));
                          return (
                              <div key={platform} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full ${platformConfig?.color || 'bg-gray-500'} mr-3`}></div>
                                    <h3 className="font-semibold text-gray-900">{platform}</h3>
                                    {content.sentiment && (
                                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                                            content.sentiment === 'positivo' ? 'bg-green-100 text-green-800' :
                                                content.sentiment === 'negativo' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                {content.sentiment}
                              </span>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                        onClick={() => copyToClipboard(content.post || content.content)}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Copiar contenido"
                                    >
                                      <Copy className="h-4 w-4 text-gray-600" />
                                    </button>
                                    {!platform.includes('_') && (
                                        <>
                                          <button
                                              onClick={() => handleGenerateAB(content.post || content.content, platform)}
                                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                              title="Generar variantes A/B"
                                              disabled={isGenerating}
                                          >
                                            <RotateCcw className="h-4 w-4 text-gray-600" />
                                          </button>
                                          <button
                                              onClick={() => handleSavePost(content, platform)}
                                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                              title="Guardar post"
                                          >
                                            <Save className="h-4 w-4 text-gray-600" />
                                          </button>
                                        </>
                                    )}
                                  </div>
                                </div>

                                <div className="p-6">
                                  <div className="prose max-w-none">
                                    <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                      {content.post || content.content}
                                    </p>

                                    {content.hashtags && content.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-6">
                                          {content.hashtags.map((tag, index) => (
                                              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                  </span>
                                          ))}
                                        </div>
                                    )}

                                    {content.emojis && (
                                        <div className="mt-4 flex items-center">
                                          <span className="text-sm text-gray-600 mr-3">Emojis sugeridos:</span>
                                          <span className="text-lg">{content.emojis}</span>
                                        </div>
                                    )}

                                    {renderRealChecklist(content.checklist)}

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

                                    {/* Métricas mejoradas */}
                                    {content.metrics && (
                                        <div className="mt-6 grid grid-cols-3 gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                          <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                              {content.metrics.potencialViral || '85'}
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium">Potencial viral</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                              {content.metrics.engagementScore || '92'}
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium">Engagement</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                              {content.metrics.alcanceEstimado || '15K-25K'}
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium">Alcance estimado</div>
                                          </div>
                                        </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  )}
                </>
            )}

            {/* Otros tabs mantienen funcionalidad pero con mejor estilo */}
            {activeTab === 'analyze' && (
                <div className="space-y-6">
                  {!analysisResults && !isGenerating && (
                      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Centro de Análisis Avanzado</h3>
                        <p className="text-gray-600 mb-6">
                          Analiza cualquier contenido con herramientas profesionales de IA
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                          {[
                            { name: 'Sentimiento', desc: 'Positivo, negativo, neutral' },
                            { name: 'Directrices', desc: 'Cumplimiento de políticas' },
                            { name: 'Hashtags', desc: 'Sugerencias optimizadas' },
                            { name: 'Horarios', desc: 'Momento óptimo para publicar' },
                            { name: 'Rendimiento', desc: 'Predicciones de engagement' },
                            { name: 'Completo', desc: 'Todos los análisis juntos' }
                          ].map((tool) => (
                              <div key={tool.name} className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                <div className="text-sm font-semibold text-gray-900">{tool.name}</div>
                                <div className="text-xs text-gray-600 mt-1">{tool.desc}</div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  {isGenerating && (
                      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analizando contenido...</h3>
                        <p className="text-gray-600">Aplicando algoritmos de análisis avanzado</p>
                      </div>
                  )}

                  {analysisResults && (
                      <div className="space-y-6">
                        {analysisResults.sentiment && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                <h3 className="text-white font-semibold">Análisis de Sentimiento</h3>
                              </div>
                              <div className="p-6">
                                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                                    analysisResults.sentiment === 'positivo' ? 'bg-green-100 text-green-800' :
                                        analysisResults.sentiment === 'negativo' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                  Sentimiento: {analysisResults.sentiment}
                                </div>
                              </div>
                            </div>
                        )}

                        {analysisResults.schedule && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                                <h3 className="text-white font-semibold">Horario Óptimo</h3>
                              </div>
                              <div className="p-6">
                                <div className="bg-orange-50 p-4 rounded-lg">
                                  <p className="text-orange-800">{analysisResults.schedule}</p>
                                </div>
                              </div>
                            </div>
                        )}
                      </div>
                  )}
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido por Categorías</h3>
                  {categoryResults ? (
                      <div className="space-y-4">
                        {Object.entries(categoryResults).map(([category, content]) => (
                            <div key={category} className="p-5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold capitalize text-gray-900">{category}</span>
                                <button
                                    onClick={() => copyToClipboard(content)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Copy className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>
                              <p className="text-gray-800 leading-relaxed">{content}</p>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FolderOpen className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-gray-600">Usa el generador principal para crear contenido por categorías</p>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ContentGenerator;