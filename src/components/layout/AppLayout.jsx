// src/components/layout/AppLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';

/**
 * Layout principal de la aplicación, optimizado para:
 * - Mejor rendimiento en móviles
 * - Interfaz más limpia y menos cargada
 * - Adaptabilidad a distintos tamaños de pantalla
 */
export default function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Detectar si es un dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);
  
  // Cerrar sidebar en cambios de ruta (en móviles)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Detector de tamaño de pantalla optimizado (con debounce)
  useEffect(() => {
    // Función para actualizar el estado de isMobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Llamar inicialmente
    handleResize();
    
    // Debounce para mejorar rendimiento
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar - versión desktop siempre visible, móvil condicional */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isMobile={isMobile} 
        user={user}
      />

      {/* Overlay para cerrar sidebar en móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          onOpenSidebar={() => setSidebarOpen(true)} 
          user={user} 
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}