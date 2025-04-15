// src/pages/Campaigns.jsx
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Página de campañas 
 * Gestiona la programación y seguimiento de campañas de contenido
 */
const Campaigns = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Cargar campañas de ejemplo
  useEffect(() => {
    const fetchCampaigns = async () => {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos de ejemplo
      setCampaigns([
        {
          id: 1,
          name: 'Lanzamiento Producto Q2',
          status: 'active',
          startDate: '2025-04-01',
          endDate: '2025-04-30',
          platform: 'multi',
          posts: 12,
          completed: 5,
          performance: 87,
        },
        {
          id: 2,
          name: 'Campaña de Brand Awareness',
          status: 'scheduled',
          startDate: '2025-05-01',
          endDate: '2025-05-31',
          platform: 'linkedin',
          posts: 8,
          completed: 0,
          performance: null,
        },
        {
          id: 3,
          name: 'Promoción de Webinar',
          status: 'completed',
          startDate: '2025-03-01',
          endDate: '2025-03-15',
          platform: 'twitter',
          posts: 6,
          completed: 6,
          performance: 92,
        },
        {
          id: 4,
          name: 'Estrategia de Contenido Educativo',
          status: 'active',
          startDate: '2025-03-15',
          endDate: '2025-04-30',
          platform: 'multi',
          posts: 15,
          completed: 8,
          performance: 76,
        },
        {
          id: 5,
          name: 'Campaña de Engagement',
          status: 'paused',
          startDate: '2025-02-15',
          endDate: '2025-03-15',
          platform: 'facebook',
          posts: 10,
          completed: 4,
          performance: 65,
        }
      ]);
      
      setIsLoading(false);
    };
    
    fetchCampaigns();
  }, []);

  // Filtrar campañas según el estado seleccionado
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeFilter === 'all') return true;
    return campaign.status === activeFilter;
  });

  if (isLoading) {
    return <LoadingSpinner text="Cargando campañas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y programa tus campañas de contenido
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva campaña
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex space-x-4">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'active', label: 'Activas' },
              { id: 'scheduled', label: 'Programadas' },
              { id: 'completed', label: 'Completadas' },
              { id: 'paused', label: 'Pausadas' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === filter.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de campañas */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No hay campañas que coincidan con el filtro seleccionado.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Ver todas las campañas
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaña
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periodo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PlatformBadge platform={campaign.platform} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateRange(campaign.startDate, campaign.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.round((campaign.completed / campaign.posts) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {campaign.completed}/{campaign.posts}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.performance ? (
                        <div className={`text-sm font-medium ${
                          campaign.performance >= 80 ? 'text-green-600' : 
                          campaign.performance >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {campaign.performance}/100
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                      <button className="text-gray-600 hover:text-gray-900">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para mostrar el estado de la campaña
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Activa', bg: 'bg-green-100', text: 'text-green-800' },
    scheduled: { label: 'Programada', bg: 'bg-blue-100', text: 'text-blue-800' },
    completed: { label: 'Completada', bg: 'bg-gray-100', text: 'text-gray-800' },
    paused: { label: 'Pausada', bg: 'bg-yellow-100', text: 'text-yellow-800' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Componente para mostrar la plataforma
const PlatformBadge = ({ platform }) => {
  const platformConfig = {
    linkedin: { label: 'LinkedIn', bg: 'bg-blue-50', text: 'text-blue-700' },
    twitter: { label: 'Twitter', bg: 'bg-sky-50', text: 'text-sky-700' },
    facebook: { label: 'Facebook', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    instagram: { label: 'Instagram', bg: 'bg-pink-50', text: 'text-pink-700' },
    multi: { label: 'Múltiples', bg: 'bg-purple-50', text: 'text-purple-700' }
  };

  const config = platformConfig[platform] || platformConfig.multi;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Helper para formatear rango de fechas
const formatDateRange = (startDate, endDate) => {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}`;
};

export default Campaigns;