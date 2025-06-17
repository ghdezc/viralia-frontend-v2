// src/pages/auth/Login.jsx - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: 'demo@viralia.ai',
    password: 'TuPassword$2024'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const { login, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo('Iniciando autenticación...');

    console.log('🔑 LOGIN ATTEMPT:', {
      username: formData.username,
      passwordLength: formData.password.length,
      timestamp: new Date().toISOString()
    });

    try {
      const result = await login(formData.username, formData.password);
      console.log('🔑 LOGIN RESULT:', result);

      if (result.success) {
        setDebugInfo('✅ Login exitoso! Redirigiendo...');
      } else {
        setDebugInfo('❌ Login falló: ' + result.error);
      }
    } catch (error) {
      console.error('🔑 LOGIN ERROR:', error);
      setDebugInfo('❌ Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test con credenciales exactas del CLI
  const testDirectLogin = async () => {
    setDebugInfo('🧪 Probando con credenciales exactas del CLI...');
    setIsLoading(true);

    try {
      // Usar exactamente las mismas credenciales que funcionaron en CLI
      const result = await login('demo@viralia.ai', 'TuPassword$2024');
      console.log('🧪 DIRECT TEST RESULT:', result);
      setDebugInfo(result.success ? '✅ Test directo exitoso!' : '❌ Test directo falló: ' + result.error);
    } catch (error) {
      console.error('🧪 DIRECT TEST ERROR:', error);
      setDebugInfo('❌ Test directo error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Viralia Login
            </h1>
            <p className="text-gray-600">
              CLI funciona ✅ - Probando frontend
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* CLI Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-sm font-medium text-green-800">
                CLI Auth: SUCCESS
              </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Credenciales verificadas en AWS CLI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email/Username
                </label>
                <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="demo@viralia.ai"
                    required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                    name="password"
                    type="text"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                    placeholder="TuPassword$2024"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password visible para debug
                </p>
              </div>

              {/* Debug Info */}
              {debugInfo && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 font-mono">{debugInfo}</p>
                  </div>
              )}

              {/* Buttons */}
              <div className="space-y-3">
                {/* Normal Login */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Autenticando...
                      </>
                  ) : (
                      <>
                        🔑 Login Normal
                      </>
                  )}
                </button>

                {/* Direct Test */}
                <button
                    type="button"
                    onClick={testDirectLogin}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50"
                >
                  🧪 Test Directo (CLI Credentials)
                </button>
              </div>
            </form>

            {/* Debug Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">🔍 Config Debug:</h3>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono space-y-1">
                <div>Pool: {import.meta.env.VITE_COGNITO_POOL_ID}</div>
                <div>Client: {import.meta.env.VITE_COGNITO_CLIENT_ID}</div>
                <div>Region: {import.meta.env.VITE_COGNITO_REGION}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;