// src/pages/auth/Login.jsx - Login seguro conectado con Cognito
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Zap, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: 'demo@viralia.ai', // Pre-filled para demo
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Guardar preferencia de recordar
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('lastUsername', formData.username);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('lastUsername');
        }

        // Redirigir a la página solicitada
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setFormData({
      username: 'demo@viralia.ai',
      password: 'TuPassword$2024',
      rememberMe: false
    });
    toast.success('Credenciales demo cargadas');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido a Viralia
            </h1>
            <p className="text-gray-600">
              La plataforma de contenido viral con IA
            </p>
          </div>

          {/* Login Form */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            {/* Demo Banner */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Demo Disponible</span>
                </div>
                <button
                    onClick={fillDemoCredentials}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
                >
                  Usar Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="tu@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Tu contraseña"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>

                <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Login Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </>
                ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </>
                )}
              </button>
            </form>

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>Cognito Secure</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  <span>Encriptado</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Version Info */}
          <div className="text-center mt-6 text-xs text-gray-500">
            Viralia v1.0 • Protegido por AWS Cognito
          </div>
        </motion.div>
      </div>
  );
};

export default Login;