// src/components/content/GeneratedContent.jsx
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function GeneratedContent({ content, platform }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  
  // Plataformas y sus colores/nombres
  const platforms = {
    linkedin: { 
      name: 'LinkedIn', 
      color: '#0077b5',
      icon: 'L',
      previewClass: 'linkedin-preview'
    },
    twitter: { 
      name: 'Twitter', 
      color: '#1da1f2',
      icon: 'X',
      previewClass: 'twitter-preview'
    },
    facebook: { 
      name: 'Facebook', 
      color: '#4267b2',
      icon: 'F',
      previewClass: 'facebook-preview'
    },
    instagram: { 
      name: 'Instagram', 
      color: '#e1306c',
      icon: 'I',
      previewClass: 'instagram-preview'
    }
  };
  
  const currentPlatform = platforms[platform] || platforms.linkedin;
  
  // Extraer las partes relevantes del contenido dependiendo de la plataforma
  const formatContentForPlatform = () => {
    if (!content) return { title: '', paragraphs: [], hashtags: [] };
    
    const title = content.title || '';
    let paragraphs = [];
    let hashtags = [];
    
    // Manejar diferentes formatos de contenido
    if (typeof content.content === 'string') {
      paragraphs = content.content.split('\n\n').filter(p => p.trim() !== '');
    } else if (Array.isArray(content.content)) {
      paragraphs = content.content;
    }
    
    // Manejar diferentes formatos de hashtags
    if (content.hashtags) {
      if (Array.isArray(content.hashtags)) {
        hashtags = content.hashtags;
      } else if (typeof content.hashtags === 'string') {
        // Dividir la cadena de hashtags en un array
        hashtags = content.hashtags.split(/\s+/).filter(tag => tag.trim() !== '');
      }
    }
    
    return { title, paragraphs, hashtags };
  };
  
  const { title, paragraphs, hashtags } = formatContentForPlatform();
  
  // Función para copiar el contenido al portapapeles
  const copyToClipboard = async () => {
    try {
      let textToCopy = '';
      
      if (title) {
        textToCopy += `${title}\n\n`;
      }
      
      if (paragraphs.length > 0) {
        textToCopy += paragraphs.join('\n\n');
      }
      
      if (hashtags.length > 0) {
        textToCopy += '\n\n' + hashtags.join(' ');
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Contenido copiado al portapapeles');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      toast.error('No se pudo copiar el contenido');
    }
  };

  // Métricas del contenido (si existen)
  const metrics = content.metrics || {};
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div 
          className="py-3 px-4 flex items-center" 
          style={{ backgroundColor: currentPlatform.color }}
        >
          <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold mr-2">
            {currentPlatform.icon}
          </div>
          <span className="text-white font-medium">
            Vista previa en {currentPlatform.name}
          </span>
        </div>
      </div>
      
      <div className={`p-6 ${currentPlatform.previewClass}`}>
        {title && (
          <h3 className="text-xl font-bold mb-4">{title}</h3>
        )}
        
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-800">
              {paragraph}
            </p>
          ))}
          
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 text-indigo-600 rounded-full text-sm"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Acciones para el contenido */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
        <button
          onClick={copyToClipboard}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
              Copiar
            </>
          )}
        </button>
        
        <div className="flex space-x-2">
          <button className="btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Regenerar
          </button>
          <button className="btn-primary">
            Publicar ahora
          </button>
        </div>
      </div>
      
      {/* Métricas y recomendaciones */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-4">Predicción de rendimiento</h4>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Potencial viral */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {metrics.potencialViral || metrics.viralPotential || '85'}
            </div>
            <div className="text-sm text-gray-500">Potencial viral</div>
          </div>
          
          {/* Engagement score */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {metrics.engagementScore || '92'}
            </div>
            <div className="text-sm text-gray-500">Engagement score</div>
          </div>
          
          {/* Alcance estimado */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {metrics.alcanceEstimado || metrics.reachEstimate || '15K-25K'}
            </div>
            <div className="text-sm text-gray-500">Alcance estimado</div>
          </div>
        </div>
        
        {/* Mejor horario para publicar */}
        {(metrics.mejorHorario || metrics.bestTimeToPost) && (
          <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-indigo-500 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="font-medium text-indigo-700">Mejor momento para publicar:</span>
            </div>
            <p className="mt-1 text-indigo-600 ml-7">
              {metrics.mejorHorario || metrics.bestTimeToPost}
            </p>
          </div>
        )}
        
        {/* Sugerencias */}
        {content.sugerencias && content.sugerencias.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Sugerencias para mejorar</h4>
            <ul className="space-y-2">
              {content.sugerencias.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="flex items-start"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
