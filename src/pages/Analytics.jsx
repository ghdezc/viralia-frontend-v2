// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Página de Analytics
 * Muestra estadísticas y visualizaciones del rendimiento de contenido
 */
const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [contentType, setContentType] = useState('all');

  // Cargar datos de ejemplo
  useEffect(() => {
    const fetchData = async () => {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      setStatsData({
        overview: {
          reach: 15482,
          engagement: 3241,
          clicks: 827,
          conversion: 108
        },
        contentPerformance: [
          { id: 1, title: 'Post sobre IA en marketing', platform: 'linkedin', engagement: 387, reach: 2450, clickRate: 4.8 },
          { id: 2, title: 'Thread sobre tendencias 2025', platform: 'twitter', engagement: 512, reach: 3200, clickRate: 3.2 },
          { id: 3, title: 'Post sobre herramientas productividad', platform: 'linkedin', engagement: 289, reach: 1850, clickRate: 5.1 },
          { id: 4, title: 'Análisis de competencia', platform: 'linkedin', engagement: 178, reach: 1640, clickRate: 2.9 },
          { id: 5, title: 'Encuesta sobre tecnología', platform: 'twitter', engagement: 423, reach: 2980, clickRate: 1.7 }
        ],
        timeData: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          series: [
            { name: 'Alcance', data: [4200, 5100, 8500, 7800, 12400, 15482] },
            { name: 'Engagement', data: [820, 970, 1700, 1690, 2700, 3241] },
            { name: 'Clics', data: [210, 280, 420, 510, 650, 827] }
          ]
        },
        platforms: [
          { name: 'LinkedIn', percentage: 65 },
          { name: 'Twitter', percentage: 25 },
          { name: 'Facebook', percentage: 7 },
          { name: 'Instagram', percentage: 3 }
        ]
      });
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [period, contentType]);

  if (isLoading) {
    return <LoadingSpinner text="Cargando analíticas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analiza el rendimiento de tu contenido
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {/* Selector de período */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          
          {/* Selector de tipo de contenido */}
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Todo el contenido</option>
            <option value="posts">Posts</option>
            <option value="threads">Threads</option>
            <option value="polls">Encuestas</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Alcance total" 
          value={statsData.overview.reach.toLocaleString()} 
          change={+24}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard 
          title="Engagement total" 
          value={statsData.overview.engagement.toLocaleString()} 
          change={+17}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905A3.61 3.61 0 018.5 7.5" />
            </svg>
          }
        />
        <StatCard 
          title="Clics" 
          value={statsData.overview.clicks.toLocaleString()} 
          change={+32}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        <StatCard 
          title="Conversiones" 
          value={statsData.overview.conversion.toLocaleString()} 
          change={+12}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Gráfico - simulado con representación estática */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Tendencias</h2>
        </div>
        <div className="p-6">
          <div className="aspect-w-16 aspect-h-6 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-gray-500">Gráfico de tendencias</p>
                <p className="text-sm text-gray-400">
                  Un gráfico interactivo se mostraría aquí, usando recharts, chart.js o similar
                </p>
                <div className="flex justify-center space-x-6 mt-2">
                  {statsData.timeData.series.map((series, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-xs text-gray-600">{series.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rendimiento por contenido */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Rendimiento por contenido</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataforma
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alcance
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statsData.contentPerformance.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <PlatformBadge platform={content.platform} />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                    {content.engagement.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                    {content.reach.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                    {content.clickRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribución de plataformas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Distribución por plataforma</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsData.platforms.map((platform) => (
              <div key={platform.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">{platform.name}</span>
                  <span className="text-sm font-bold text-gray-900">{platform.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      platform.name === 'LinkedIn' ? 'bg-blue-500' :
                      platform.name === 'Twitter' ? 'bg-sky-500' :
                      platform.name === 'Facebook' ? 'bg-indigo-500' : 'bg-pink-500'
                    }`}
                    style={{ width: `${platform.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Tarjeta Estadística
const StatCard = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs. periodo anterior
            </p>
          )}
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar la plataforma
const PlatformBadge = ({ platform }) => {
  const platformConfig = {
    linkedin: { label: 'LinkedIn', bg: 'bg-blue-50', text: 'text-blue-700' },
    twitter: { label: 'Twitter', bg: 'bg-sky-50', text: 'text-sky-700' },
    facebook: { label: 'Facebook', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    instagram: { label: 'Instagram', bg: 'bg-pink-50', text: 'text-pink-700' }
  };

  const config = platformConfig[platform] || platformConfig.linkedin;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default Analytics;