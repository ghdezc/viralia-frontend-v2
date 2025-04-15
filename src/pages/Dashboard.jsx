// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Dashboard principal de la aplicación
 * Muestra resumen de actividad y métricas clave
 */
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      // En un entorno real, esto sería una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      setStats({
        contentGenerated: 23,
        engagementRate: 12.4,
        virality: 8.7,
        pendingCampaigns: 3,
        recentActivity: [
          { id: 1, type: 'content', title: 'Tweet sobre estrategias de marketing', date: '2025-04-12', platform: 'twitter' },
          { id: 2, type: 'content', title: 'Post sobre tendencias IA', date: '2025-04-10', platform: 'linkedin' },
          { id: 3, type: 'campaign', title: 'Lanzamiento Q2', date: '2025-04-08', status: 'active' }
        ]
      });
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Cargando panel de control..." />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.name?.split(' ')[0] || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">
          Aquí tienes el resumen de tu actividad reciente y métricas clave.
        </p>
      </div>
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Contenido Generado" 
          value={stats.contentGenerated} 
          icon="document" 
          change={+15}
          color="indigo"
        />
        <MetricCard 
          title="Tasa de Engagement" 
          value={`${stats.engagementRate}%`} 
          icon="chart" 
          change={+2.3}
          color="blue"
        />
        <MetricCard 
          title="Índice de Viralidad" 
          value={stats.virality.toFixed(1)} 
          icon="trend" 
          change={-0.5}
          color="purple"
        />
        <MetricCard 
          title="Campañas Pendientes" 
          value={stats.pendingCampaigns} 
          icon="calendar" 
          color="pink"
        />
      </div>
      
      {/* Actividad reciente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Actividad Reciente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivity.map(activity => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {activity.type === 'content' 
                    ? `Contenido para ${activity.platform}` 
                    : `Campaña ${activity.status}`}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(activity.date)}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Ver toda la actividad →
          </a>
        </div>
      </div>
      
      {/* Panel de acciones rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Acciones Rápidas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <QuickAction 
            title="Crear Contenido" 
            description="Genera nuevo contenido para redes sociales"
            actionText="Crear ahora"
            actionLink="/generator"
          />
          <QuickAction 
            title="Programar Publicación" 
            description="Programa contenido para publicar automáticamente"
            actionText="Programar"
            actionLink="/campaigns"
          />
          <QuickAction 
            title="Ver Analíticas" 
            description="Revisa el rendimiento de tu contenido"
            actionText="Ver datos"
            actionLink="/analytics"
          />
        </div>
      </div>
    </div>
  );
};

// Componente para tarjeta de métrica
const MetricCard = ({ title, value, icon, change, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
  };
  
  const getIcon = () => {
    switch(icon) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'trend':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`rounded-xl border ${colors[color]} p-4 flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs. mes anterior
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {getIcon()}
      </div>
    </div>
  );
};

// Componente para acción rápida
const QuickAction = ({ title, description, actionText, actionLink }) => {
  return (
    <div className="p-6">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <a 
        href={actionLink} 
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {actionText}
      </a>
    </div>
  );
};

// Helper para formatear fechas
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options);
};

export default Dashboard;