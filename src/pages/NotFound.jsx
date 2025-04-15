// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

/**
 * Página 404 - No encontrado
 * Se muestra cuando el usuario accede a una ruta que no existe
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
          <div className="w-full border-t border-gray-300 my-5 mx-auto" />
          <h2 className="text-3xl font-extrabold text-gray-900">Página no encontrada</h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
        </div>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Es posible que la página que estás buscando haya sido movida, eliminada o que nunca haya existido.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ir al dashboard
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;