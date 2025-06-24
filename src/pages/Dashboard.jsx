// src/pages/Dashboard.jsx - Versión limpia y enfocada
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      // Simular carga optimizada
      await new Promise(resolve => setTimeout(resolve, 500));

      setStats({
        postsThisWeek: 12,
        engagementRate: 8.4,
        totalReach: 25600,
        savedPosts: 47
      });

      setRecentPosts([
        {
          id: 1,
          content: 'Estrategias de marketing digital para PyMEs...',
          platform: 'LinkedIn',
          performance: 'Alto',
          createdAt: '2 horas'
        },
        {
          id: 2,
          content: 'Tendencias de IA en 2025...',
          platform: 'Twitter',
          performance: 'Medio',
          createdAt: '5 horas'
        },
        {
          id: 3,
          content: 'Análisis del mercado tecnológico...',
          platform: 'LinkedIn',
          performance: 'Alto',
          createdAt: '1 día'
        }
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const userName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario';

  return (
      <div className="space-y-6">
        {/* Header simplificado */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, {userName}
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tu contenido y analiza el rendimiento
              </p>
            </div>
            <Link
                to="/generator"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Crear contenido
            </Link>
          </div>
        </div>

        {/* Stats grid simplificado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
              title="Posts esta semana"
              value={stats.postsThisWeek}
              description="Contenido generado"
          />
          <StatCard
              title="Engagement promedio"
              value={`${stats.engagementRate}%`}
              description="Tasa de interacción"
          />
          <StatCard
              title="Alcance total"
              value={formatNumber(stats.totalReach)}
              description="Personas alcanzadas"
          />
          <StatCard
              title="Posts guardados"
              value={stats.savedPosts}
              description="En tu biblioteca"
          />
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard
                    title="Generar contenido"
                    description="Crear nuevo post con IA"
                    href="/generator"
                    icon="lightning"
                />
                <ActionCard
                    title="Analizar rendimiento"
                    description="Ver métricas detalladas"
                    href="/analytics"
                    icon="chart"
                />
                <ActionCard
                    title="Gestionar campañas"
                    description="Organizar publicaciones"
                    href="/campaigns"
                    icon="calendar"
                />
                <ActionCard
                    title="Configuración"
                    description="Ajustar preferencias"
                    href="/settings"
                    icon="settings"
                />
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{post.platform}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                            post.performance === 'Alto'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                      {post.performance}
                    </span>
                      </div>
                      <span className="text-xs text-gray-500">{post.createdAt}</span>
                    </div>
                  </div>
              ))}
            </div>
            <Link
                to="/history"
                className="block text-center text-sm text-indigo-600 hover:text-indigo-800 mt-4"
            >
              Ver historial completo
            </Link>
          </div>
        </div>
      </div>
  );
};

// Componentes helper optimizados
const StatCard = ({ title, value, description }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
);

const ActionCard = ({ title, description, href, icon }) => {
  const icons = {
    lightning: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    chart: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    calendar: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    settings: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
  };

  return (
      <Link
          to={href}
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start space-x-3">
          <div className="text-indigo-600">
            {icons[icon]}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </Link>
  );
};

const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-200 rounded-lg h-24"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-200 rounded-lg h-64"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    </div>
);

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default Dashboard;