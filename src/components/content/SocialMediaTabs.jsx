// src/components/content/SocialMediaTabs.jsx
import { memo } from 'react';

/**
 * Componente de pestañas para seleccionar plataformas de redes sociales
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.platforms - Array de plataformas disponibles
 * @param {string} props.activePlatform - ID de la plataforma activa
 * @param {Function} props.onChange - Función para cambiar la plataforma
 * @param {Array} props.restrictedPlatforms - Plataformas restringidas a seleccionar (opcional)
 * @returns {JSX.Element} Componente renderizado
 */
const SocialMediaTabs = memo(({ 
  platforms, 
  activePlatform, 
  onChange, 
  restrictedPlatforms = null 
}) => {
  // Determinar si una plataforma está disponible
  const isPlatformAvailable = (platformId) => {
    // Si no hay restricciones, todas están disponibles
    if (!restrictedPlatforms) return true;
    
    // Si hay restricciones, solo las que están en la lista
    return restrictedPlatforms.includes(platformId);
  };
  
  return (
    <div className="social-media-tabs">
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => {
          const isActive = platform.id === activePlatform;
          const isAvailable = isPlatformAvailable(platform.id);
          
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => isAvailable && onChange(platform.id)}
              disabled={!isAvailable}
              className={`
                flex items-center px-4 py-2 rounded-md transition-all
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gray-50'
                }
                ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                borderColor: isActive ? platform.color : undefined,
                boxShadow: isActive ? `0 2px 8px rgba(0, 0, 0, 0.1)` : undefined
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white font-semibold text-xs"
                style={{ backgroundColor: platform.color }}
              >
                {platform.name.charAt(0)}
              </div>
              <span className="font-medium">{platform.name}</span>
            </button>
          );
        })}
      </div>
      
      {/* Mensaje opcional para plataformas restringidas */}
      {restrictedPlatforms && (
        <p className="mt-2 text-xs text-gray-500 italic">
          Solo se muestran las plataformas configuradas para esta campaña.
        </p>
      )}
    </div>
  );
});

SocialMediaTabs.displayName = 'SocialMediaTabs';

export default SocialMediaTabs;
