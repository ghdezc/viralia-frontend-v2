// src/components/metrics/ViralMetrics.jsx - TODOS LOS ICONOS CORREGIDOS
import { memo } from 'react';
import {
    ArrowTrendingUpIcon,    // ✅ Corregido: era TrendingUpIcon
    EyeIcon,
    HeartIcon,
    ShareIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    LightBulbIcon,
    SparklesIcon,
    FireIcon,
    Cog6ToothIcon          // ✅ Corregido: era CogIcon
} from '@heroicons/react/24/outline';

/**
 * Componente elegante para mostrar métricas virales del backend
 * Recibe los datos viral_metrics que ya vienen de las APIs
 */
const ViralMetrics = memo(({ metrics, className = "", showTitle = true }) => {
    if (!metrics) return null;

    // Función para determinar el color basado en el score
    const getScoreColor = (score) => {
        if (score >= 80) return {
            text: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            gradient: 'from-emerald-500 to-green-600',
            ring: 'ring-emerald-200'
        };
        if (score >= 60) return {
            text: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            gradient: 'from-amber-500 to-orange-600',
            ring: 'ring-amber-200'
        };
        if (score >= 40) return {
            text: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            gradient: 'from-orange-500 to-red-600',
            ring: 'ring-orange-200'
        };
        return {
            text: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            gradient: 'from-red-500 to-red-700',
            ring: 'ring-red-200'
        };
    };

    // Función para obtener el máximo de cada categoría del score_breakdown
    const getMaxValue = (categoria) => {
        const maxValues = {
            tecnico: 25,
            emocional: 35,
            compartibilidad: 25,
            algoritmo: 15
        };
        return maxValues[categoria] || 100;
    };

    // Función para obtener el ícono de cada categoría (TODOS CORREGIDOS)
    const getCategoryIcon = (categoria) => {
        const icons = {
            tecnico: ChartBarIcon,
            emocional: HeartIcon,
            compartibilidad: ShareIcon,
            algoritmo: Cog6ToothIcon // ✅ Corregido: ahora Cog6ToothIcon
        };
        return icons[categoria] || ChartBarIcon;
    };

    // Función para obtener descripción de categoría
    const getCategoryDescription = (categoria) => {
        const descriptions = {
            tecnico: 'Estructura y formato del contenido',
            emocional: 'Impacto emocional y conexión',
            compartibilidad: 'Potencial de viralización',
            algoritmo: 'Optimización para algoritmos'
        };
        return descriptions[categoria] || '';
    };

    const scoreColor = getScoreColor(metrics.potencial_viral);
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (metrics.potencial_viral / 100) * circumference;

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
            {/* Header con score principal */}
            {showTitle && (
                <div className={`px-6 py-4 ${scoreColor.bg} border-b ${scoreColor.border}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${scoreColor.text} bg-white rounded-full flex items-center justify-center shadow-sm ring-2 ${scoreColor.ring}`}>
                                <SparklesIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Análisis Viral</h3>
                                <p className="text-sm text-gray-600">Métricas de rendimiento estimado</p>
                            </div>
                        </div>

                        {/* Score principal circular */}
                        <div className="relative">
                            <div className="w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#e5e7eb"
                                        strokeWidth="6"
                                        fill="none"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        className={`${scoreColor.text} transition-all duration-1000 ease-out`}
                                        style={{
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-lg font-bold ${scoreColor.text}`}>
                                        {metrics.potencial_viral}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-6">
                {/* Métricas de proyección principales */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <HeartIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Engagement Est.</span>
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                            {metrics.engagement_estimado || 'N/A'}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            Interacciones proyectadas
                        </div>
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <EyeIcon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Alcance Est.</span>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                            {metrics.alcance_estimado || 'N/A'}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                            Personas alcanzadas
                        </div>
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
                    </div>
                </div>

                {/* Desglose por categorías */}
                {metrics.score_breakdown && Object.keys(metrics.score_breakdown).length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                            <ChartBarIcon className="h-4 w-4 mr-2 text-gray-600" />
                            Desglose Detallado
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(metrics.score_breakdown).map(([categoria, score]) => {
                                const maxValue = getMaxValue(categoria);
                                const percentage = (score / maxValue) * 100;
                                const categoryColor = getScoreColor(percentage);
                                const IconComponent = getCategoryIcon(categoria);

                                return (
                                    <div key={categoria} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <IconComponent className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-900 capitalize">
                                                    {categoria}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {score}/{maxValue}
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${categoryColor.gradient}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            {getCategoryDescription(categoria)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Factores positivos */}
                {metrics.factores_positivos && metrics.factores_positivos.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                            Fortalezas Detectadas
                        </h4>
                        <div className="space-y-2">
                            {metrics.factores_positivos.map((factor, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-green-800">{factor}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Factores negativos */}
                {metrics.factores_negativos && metrics.factores_negativos.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-amber-600" />
                            Áreas de Mejora
                        </h4>
                        <div className="space-y-2">
                            {metrics.factores_negativos.map((factor, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-amber-800">{factor}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mejoras sugeridas */}
                {metrics.mejoras_sugeridas && metrics.mejoras_sugeridas.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <LightBulbIcon className="h-4 w-4 mr-2 text-blue-600" />
                            Recomendaciones Estratégicas
                        </h4>
                        <div className="space-y-2">
                            {metrics.mejoras_sugeridas.map((mejora, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <LightBulbIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-blue-800">{mejora}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Score visual compacto si no hay título */}
                {!showTitle && (
                    <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${scoreColor.text} mb-1`}>
                                {metrics.potencial_viral}
                            </div>
                            <div className="text-sm text-gray-600">Score Viral</div>
                        </div>
                    </div>
                )}

                {/* Footer con estadísticas rápidas */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <FireIcon className="h-3 w-3" />
                            <span>Análisis basado en IA</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ArrowTrendingUpIcon className="h-3 w-3" /> {/* ✅ Corregido */}
                            <span>Actualizado en tiempo real</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ViralMetrics.displayName = 'ViralMetrics';

export default ViralMetrics;

// Hook auxiliar para usar en otros componentes
export const useViralMetrics = (metrics) => {
    if (!metrics) return null;

    return {
        score: metrics.potencial_viral,
        engagement: metrics.engagement_estimado,
        reach: metrics.alcance_estimado,
        breakdown: metrics.score_breakdown,
        strengths: metrics.factores_positivos,
        weaknesses: metrics.factores_negativos,
        suggestions: metrics.mejoras_sugeridas,
        hasMetrics: Boolean(metrics.potencial_viral),

        // Funciones auxiliares
        getScoreLevel: () => {
            const score = metrics.potencial_viral;
            if (score >= 80) return 'excellent';
            if (score >= 60) return 'good';
            if (score >= 40) return 'average';
            return 'needs-improvement';
        },

        getScoreDescription: () => {
            const score = metrics.potencial_viral;
            if (score >= 80) return 'Excelente potencial viral';
            if (score >= 60) return 'Buen potencial viral';
            if (score >= 40) return 'Potencial viral moderado';
            return 'Necesita optimización';
        }
    };
};