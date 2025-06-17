// src/pages/Dashboard.jsx - Versión optimizada y limpia
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga optimizada
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStats({
        contentGenerated: 23,
        engagementRate: 12.4,
        virality: 8.7,
        totalReach: 45200
      });
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
      <div className="space-y-8">
        {/* Header Hero */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              ¡Hola, {user?.name?.split(' ')[0] || 'Creador'}! 👋
            </h1>
            <p className="text-indigo-100 text-lg mb-6">
              Tu contenido está generando excelentes resultados
            </p>

            <Link
                to="/generator"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Crear contenido
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </motion.div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
              icon={<Zap className="w-6 h-6" />}
              title="Contenido generado"
              value={stats.contentGenerated}
              change={+15}
              color="indigo"
          />
          <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Engagement"
              value={`${stats.engagementRate}%`}
              change={+2.3}
              color="emerald"
          />
          <MetricCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Índice viral"
              value={stats.virality.toFixed(1)}
              change={-0.5}
              color="purple"
          />
          <MetricCard
              icon={<Users className="w-6 h-6" />}
              title="Alcance total"
              value={formatNumber(stats.totalReach)}
              change={+24}
              color="blue"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActionCard
              icon={<Zap className="w-8 h-8" />}
              title="Generar contenido"
              description="Crea posts virales con IA"
              link="/generator"
              gradient="from-indigo-500 to-purple-600"
          />
          <QuickActionCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Ver analytics"
              description="Analiza tu rendimiento"
              link="/analytics"
              gradient="from-emerald-500 to-teal-600"
          />
          <QuickActionCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Campañas"
              description="Programa publicaciones"
              link="/campaigns"
              gradient="from-purple-500 to-pink-600"
          />
        </div>

        {/* Actividad reciente simplificada */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Actividad reciente</h3>
          <div className="space-y-3">
            {[
              { title: 'Post viral sobre IA', platform: 'LinkedIn', engagement: '+87%' },
              { title: 'Thread sobre tendencias', platform: 'Twitter', engagement: '+52%' },
              { title: 'Análisis de mercado', platform: 'LinkedIn', engagement: '+34%' }
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.platform}</p>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">{item.engagement}</span>
                </div>
            ))}
          </div>
        </motion.div>
      </div>
  );
};

// Componente de métrica optimizado
const MetricCard = ({ icon, title, value, change, color }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600'
  };

  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white`}>
            {icon}
          </div>
          {change !== undefined && (
              <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          )}
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </motion.div>
  );
};

// Tarjeta de acción rápida optimizada
const QuickActionCard = ({ icon, title, description, link, gradient }) => (
    <Link to={link}>
      <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white overflow-hidden cursor-pointer`}
      >
        <div className="relative z-10">
          <div className="mb-4 opacity-80">{icon}</div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      </motion.div>
    </Link>
);

// Esqueleto de carga
const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="bg-gray-200 rounded-3xl h-48 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
        ))}
      </div>
    </div>
);

// Utilidad para formatear números
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default Dashboard;