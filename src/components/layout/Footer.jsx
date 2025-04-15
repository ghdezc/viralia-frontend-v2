// src/components/layout/Footer.jsx

/**
 * Footer optimizado y minimalista
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-500">
        <div>
          &copy; {currentYear} Viralia. Todos los derechos reservados.
        </div>
        <div className="flex space-x-4">
          <a href="/terms" className="hover:text-primary-600 transition-colors">
            Términos
          </a>
          <a href="/privacy" className="hover:text-primary-600 transition-colors">
            Privacidad
          </a>
          <a href="/help" className="hover:text-primary-600 transition-colors">
            Ayuda
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;