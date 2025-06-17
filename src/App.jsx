// src/App.jsx - Con autenticación segura
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading de páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const Login = lazy(() => import('./pages/auth/Login'));
const AppLayout = lazy(() => import('./components/layout/AppLayout'));

// Loading component
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando Viralia...</p>
      </div>
    </div>
);

function App() {
  return (
      <Router>
        <AuthProvider>
          {/* Toast notifications */}
          <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
          />

          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />

              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Generador de contenido */}
                <Route path="generator" element={<ContentGenerator />} />

                {/* Otras rutas protegidas */}
                <Route path="campaigns" element={
                  <ProtectedRoute requiredPlan="pro">
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-900">Campañas</h2>
                      <p className="text-gray-600 mt-2">Próximamente disponible</p>
                    </div>
                  </ProtectedRoute>
                } />

                <Route path="analytics" element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                    <p className="text-gray-600 mt-2">Próximamente disponible</p>
                  </div>
                } />

                <Route path="settings" element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
                    <p className="text-gray-600 mt-2">Próximamente disponible</p>
                  </div>
                } />
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
                    <a href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                      Volver al inicio
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
  );
}

export default App;