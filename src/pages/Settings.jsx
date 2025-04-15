// src/pages/Settings.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

/**
 * Página de configuración de la cuenta
 * Permite al usuario gestionar su perfil y preferencias
 */
const Settings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  
  // Estados para los diferentes formularios
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailDigest: true,
    contentPerformance: true,
    newFeatures: true,
    tips: false
  });
  
  // Estado de carga para los formularios
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  
  // Manejar cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en las notificaciones
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Enviar formulario de perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    
    try {
      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En un entorno real, llamaríamos a updateProfile
      // await updateProfile(profileForm);
      
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  // Enviar formulario de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setIsPasswordLoading(true);
    
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En un entorno real, llamaríamos a changePassword
      // await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      // Resetear formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Contraseña actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la contraseña');
      console.error(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  // Guardar configuración de notificaciones
  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setIsNotificationsLoading(true);
    
    try {
      // Simular actualización de notificaciones
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Preferencias de notificaciones actualizadas');
    } catch (error) {
      toast.error('Error al actualizar las notificaciones');
      console.error(error);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra tu cuenta y preferencias
        </p>
      </div>
      
      {/* Secciones de configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información del perfil */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Información de perfil</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre completo
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled
                        className="shadow-sm bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Empresa / Organización
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={profileForm.company}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Cargo / Rol
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={profileForm.role}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isProfileLoading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Cambio de contraseña */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Cambiar contraseña</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Contraseña actual
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      Nueva contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmar nueva contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isPasswordLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Plan actual */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Tu plan</h2>
            </div>
            <div className="p-6">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-indigo-800">Plan Free</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Activo
                  </span>
                </div>
                <p className="mt-2 text-sm text-indigo-700">
                  Generación de contenido básico con límite de 20 posts/mes.
                </p>
                <button className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Actualizar a Pro
                </button>
              </div>
            </div>
          </div>
          
          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Notificaciones</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleNotificationsSubmit}>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailDigest"
                        name="emailDigest"
                        type="checkbox"
                        checked={notificationSettings.emailDigest}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailDigest" className="font-medium text-gray-700">Resumen semanal</label>
                      <p className="text-gray-500">Recibe un resumen semanal de tu rendimiento.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="contentPerformance"
                        name="contentPerformance"
                        type="checkbox"
                        checked={notificationSettings.contentPerformance}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="contentPerformance" className="font-medium text-gray-700">Rendimiento de contenido</label>
                      <p className="text-gray-500">Alertas sobre el rendimiento de tu contenido.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="newFeatures"
                        name="newFeatures"
                        type="checkbox"
                        checked={notificationSettings.newFeatures}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="newFeatures" className="font-medium text-gray-700">Nuevas funciones</label>
                      <p className="text-gray-500">Mantente informado sobre nuevas características.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="tips"
                        name="tips"
                        type="checkbox"
                        checked={notificationSettings.tips}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="tips" className="font-medium text-gray-700">Tips y consejos</label>
                      <p className="text-gray-500">Consejos sobre cómo mejorar tu contenido.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isNotificationsLoading}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isNotificationsLoading ? 'Guardando...' : 'Guardar preferencias'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;