// src/pages/ContentGenerator.jsx
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../hooks/useToast';
import { contentService } from '../services/content/contentService';
import SocialMediaTabs from '../components/content/SocialMediaTabs';
import LinkedInGenerator from '../components/content/LinkedInGenerator';
import TwitterGenerator from '../components/content/TwitterGenerator';
import GeneratedContent from '../components/content/GeneratedContent';
import ContentTips from '../components/content/ContentTips';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Página del generador de contenido optimizada
 * - UI más limpia y menos cargada
 * - Mejoras de rendimiento
 * - Mejor organización del código
 * - Soporte para cancelación de peticiones
 */
const ContentGenerator = () => {
  // Estados
  const [platform, setPlatform] = useState('linkedin');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('creator');
  
  // Refs
  const abortControllerRef = useRef(null);
  
  // Hooks
  const toast = useToast();

  // Definición de plataformas
  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5' },
    { id: 'twitter', name: 'Twitter', color: '#1da1f2' },
    { id: 'facebook', name: 'Facebook', color: '#4267b2', disabled: true },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', disabled: true },
  ];

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      // Cancelar cualquier petición pendiente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cambiar plataforma
  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    setGeneratedContent(null);
  };

  // Generar contenido
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.warning('Por favor ingresa un tema para generar contenido.');
      return;
    }
    
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    
    setIsGenerating(true);
    
    try {
      // Llamada al servicio de generación de contenido
      const result = await contentService.generateContent({
        platform,
        prompt,
        contentType: 'post',
      }, abortControllerRef.current.signal);
      
      setGeneratedContent(result);
      toast.success('¡Contenido generado con éxito!');
    } catch (error) {
      // No mostrar error si fue cancelado intencionalmente
      if (error.message !== 'Generación cancelada') {
        console.error('Error al generar contenido:', error);
        toast.error('Hubo un error al generar el contenido. Por favor intenta nuevamente.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Tips contextuales según la plataforma
  const platformTips = {
    linkedin: [
      "Los posts con preguntas generan un 50% más de comentarios",
      "El contenido sobre liderazgo y tendencias de la industria tiene mayor alcance",
      "Usa entre 1-3 hashtags relevantes para mayor visibilidad"
    ],
    twitter: [
      "Los tweets con imágenes reciben un 150% más de retweets",
      "La longitud ideal es de 71-100 caracteres para mayor engagement",
      "Los hilos de 3-5 tweets tienen más probabilidad de volverse virales"
    ],
    facebook: [
      "El contenido con videos tiene un 59% más de engagement",
      "Las publicaciones cortas (menos de 80 caracteres) generan más interacción",
      "El mejor momento para publicar es entre las 1PM y 3PM"
    ],
    instagram: [
      "Utiliza de 5 a 9 hashtags para optimizar el alcance",
      "Las imágenes con tonos azules generan un 24% más de likes",
      "Las historias con encuestas aumentan la interacción en un 80%"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Encabezado con tabs */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de Contenido</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crea contenido optimizado para diferentes plataformas
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('creator')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'creator' 
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Creador
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'analytics' 
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Análisis
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'creator' ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Selector de plataforma */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">1. Selecciona una plataforma</h2>
                <SocialMediaTabs 
                  platforms={platforms} 
                  activePlatform={platform} 
                  onChange={handlePlatformChange} 
                />
              </div>
            </div>
            
            {/* Formulario de generación */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  2. ¿Sobre qué quieres crear contenido?
                </h2>
                
                {platform === 'linkedin' && (
                  <LinkedInGenerator 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isGenerating={isGenerating}
                    onSubmit={handleSubmit}
                  />
                )}
                
                {platform === 'twitter' && (
                  <TwitterGenerator 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isGenerating={isGenerating}
                    onSubmit={handleSubmit}
                  />
                )}
                
                {(platform === 'facebook' || platform === 'instagram') && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">
                      Generador para {platform === 'facebook' ? 'Facebook' : 'Instagram'} próximamente disponible.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Por favor, selecciona LinkedIn o Twitter por ahora.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contenido generado */}
            {isGenerating ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Generando contenido optimizado..." />
              </div>
            ) : (
              generatedContent && (
                <GeneratedContent 
                  content={generatedContent} 
                  platform={platform} 
                />
              )
            )}
          </div>
          
          {/* Sidebar con consejos */}
          <div className="space-y-6">
            <ContentTips 
              platform={platform}
              tips={platformTips[platform] || []}
            />
            
            {/* Métricas de campañas (simplificado) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Rendimiento reciente</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Engagement</span>
                    <span className="font-medium text-primary-600">+24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Posts virales</span>
                    <span className="font-medium text-primary-600">2 de 10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
                  Ver informe completo →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Tab de Analytics (simplificado)
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Análisis de Engagement</h3>
            <p className="mt-2 text-gray-500">
              Esta sección estará disponible próximamente. Aquí podrás analizar el rendimiento
              de tus publicaciones y compararlas con las tendencias del mercado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;