// src/components/layout/Footer.jsx

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Viralia. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600">
              Términos
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600">
              Privacidad
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600">
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
