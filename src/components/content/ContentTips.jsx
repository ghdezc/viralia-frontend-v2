// src/components/content/ContentTips.jsx
import { memo } from 'react';

// Iconos específicos para cada plataforma
const PlatformIcon = ({ platform }) => {
  const icons = {
    linkedin: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
    twitter: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    facebook: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  };

  return (
    <div className={`text-${platform}`}>
      {icons[platform] || (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a3 3 0 0 0-1.5 2.598M21 6.172v9.83l-6 3.446"></path>
          <path d="M3 12.58v4.92a3 3 0 0 0 1.5 2.599l6 3.445a3 3 0 0 0 3 0l6-3.445a3 3 0 0 0 1.5-2.598V7.143"></path>
        </svg>
      )}
    </div>
  );
};

// Componente principal de consejos de contenido
const ContentTips = ({ platform, tips = [] }) => {
  // Colores para cada plataforma
  const platformColors = {
    linkedin: 'text-[#0077b5]',
    twitter: 'text-[#1da1f2]',
    facebook: 'text-[#4267b2]',
    instagram: 'text-[#e1306c]',
  };

  // Título según la plataforma
  const platformTitles = {
    linkedin: 'Consejos para LinkedIn',
    twitter: 'Consejos para Twitter',
    facebook: 'Consejos para Facebook',
    instagram: 'Consejos para Instagram',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`mr-2 ${platformColors[platform] || 'text-indigo-600'}`}>
            <PlatformIcon platform={platform} />
          </div>
          <h3 className="font-medium text-gray-900">
            {platformTitles[platform] || 'Consejos para redes sociales'}
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {tips.length > 0 ? (
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                    platformColors[platform] || 'text-indigo-600'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay consejos disponibles para esta plataforma.</p>
        )}

        <div className="text-center mt-6">
          <a
            href="#"
            className={`text-sm font-medium ${
              platformColors[platform] || 'text-indigo-600'
            } hover:underline`}
          >
            Ver más consejos
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(ContentTips);
