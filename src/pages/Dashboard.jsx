// src/pages/Dashboard.jsx - Dashboard elegante y limpio
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  Heart
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos optimizada
    const loadDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));

      setStats({
        postsGenerated: 23,
        totalEngagement: 12.4,
        viralityScore: 8.7,
        totalReach: 45200
      });

      setRecentActivity([
        {
          id: 1,
          type: 'post',
          content: 'Post sobre IA en marketing',
          platform: 'LinkedIn',
          engagement: '+87%',
          time: '2h',
          icon: '💼'
        },
        {
          id: 2,
          type: 'thread',
          content: 'Thread sobre tendencias 2025',
          platform: 'Twitter',
          engagement: '+52%',
          time: '4h',
          icon: '🐦'
        },
        {
          id: 3,
          type: 'post',
          content: 'Análisis de mercado tech',
          platform: 'LinkedIn',
          engagement: '+34%',
          time: '1d',
          icon: '📊'
        }
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario';

  return (
      <div className="space-y-8 p-6">
        {/* Hero Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay -translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full mix-blend-overlay translate-x-20 translate-y-20" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              ¡Hola, {firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
              Tu contenido está generando resultados increíbles. Sigue creando posts virales.
            </p>

            <Link
                to="/generator"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all group"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Crear contenido
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
              icon={<Zap className="w-6 h-6" />}
              title="Posts generados"
              value={stats.postsGenerated}
              change={+15}
              color="blue"
          />
          <StatCard
              icon={<Heart className="w-6 h-6" />}
              title="Engagement promedio"
              value={`${stats.totalEngagement}%`}
              change={+2.3}
              color="pink"
          />
          <StatCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Índice viral"
              value={stats.viralityScore.toFixed(1)}
              change={-0.5}
              color="purple"
          />
          <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Alcance total"
              value={formatNumber(stats.totalReach)}
              change={+24}
              color="emerald"
          />
        </div>

        {/* Action Cards & Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
                icon={<Zap className="w-8 h-8" />}
                title="Generar contenido"
                description="Crea posts virales con IA"
                href="/generator"
                gradient="from-blue-500 to-cyan-500"
            />
            <ActionCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="Ver analytics"
                description="Analiza el rendimiento"
                href="/analytics"
                gradient="from-emerald-500 to-teal-500"
            />
            <ActionCard
                icon={<Calendar className="w-8 h-8" />}
                title="Programar posts"
                description="Gestiona tu calendario"
                href="/scheduler"
                gradient="from-violet-500 to-purple-500"
            />
            <ActionCard
                icon={<MessageSquare className="w-8 h-8" />}
                title="Ideas virales"
                description="Descubre tendencias"
                href="/ideas"
                gradient="from-pink-500 to-rose-500"
            />
          </div>

          {/* Recent Activity */}
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Actividad reciente
            </h3>

            <div className="space-y-3">
              {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">{item.engagement}</span>
                  </div>
              ))}
            </div>

            <Link
                to="/analytics"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-4"
            >
              Ver todo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
  );
}

// Componente de métrica optimizado
function StatCard({ icon, title, value, change, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    pink: 'from-pink-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600'
  };

  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {typeof change === 'number' && (
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
}

// Tarjeta de acción optimizada
function ActionCard({ icon, title, description, href, gradient }) {
  return (
      <Link to={href}>
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative bg-gradient-to-br ${gradient} rounded-xl p-6 text-white overflow-hidden cursor-pointer group`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
              {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>

          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        </motion.div>
      </Link>
  );
}

// Skeleton loading
function DashboardSkeleton() {
  return (
      <div className="space-y-8 p-6 animate-pulse">
        <div className="bg-gray-300 rounded-2xl h-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-xl h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-xl h-24" />
            ))}
          </div>
          <div className="bg-gray-300 rounded-xl h-80" />
        </div>
      </div>
  );
}

// Utilidad para formatear números
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}