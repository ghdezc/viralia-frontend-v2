// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TailwindTest from './components/TailwindTest';


// Lazy loading de páginas para mejor performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Settings = lazy(() => import('./pages/Settings'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ConfirmRegistration = lazy(() => import('./pages/auth/ConfirmRegistration'));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));
const UpgradePlan = lazy(() => import('./pages/UpgradePlan'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Componente principal de la aplicación
 * IMPORTANTE: ToastProvider debe envolver a AuthProvider ya que AuthProvider usa useToast
 */
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/confirm-registration" element={<ConfirmRegistration />} />
              
              {/* Rutas de acceso denegado */}
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/upgrade-plan" element={<UpgradePlan />} />
              
              {/* Rutas protegidas dentro del layout principal */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                {/* Dashboard - acceso básico */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Generador de contenido - acceso según rol */}
                <Route path="/generator" element={
                  <ProtectedRoute roles={['user', 'admin', 'editor']}>
                    <ContentGenerator />
                  </ProtectedRoute>
                } />
                
                {/* Campañas - requiere plan pro o admin */}
                <Route path="/campaigns" element={
                  <ProtectedRoute roles={['admin', 'editor']} requiredPlan="pro">
                    <Campaigns />
                  </ProtectedRoute>
                } />
                
                {/* Analytics - acceso según rol */}
                <Route path="/analytics" element={
                  <ProtectedRoute roles={['admin', 'editor', 'analyst']}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                
                {/* Configuración - acceso para todos los autenticados */}
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Redirección por defecto */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Ruta 404 para cualquier ruta no coincidente */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;