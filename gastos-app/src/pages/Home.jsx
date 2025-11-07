import { Link } from "react-router-dom";
import { Wallet, Mail, CreditCard, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Gestor Personal
        </h1>
        <p className="text-gray-600 text-sm mb-8 text-center">
          Organiza tus finanzas y correos fácilmente
        </p>
        
        <div className="space-y-3">
          {/* Gastos */}
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link
              to="/expenses/list"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Gastos</span>
              </div>
              <span className="text-sm text-gray-500">Ver lista</span>
            </Link>
            <div className="border-t border-gray-200">
              <Link
                to="/expenses/new"
                className="flex items-center gap-2 p-3 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar gasto</span>
              </Link>
            </div>
          </div>

          {/* Correos */}
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link
              to="/emails/list"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Correos</span>
              </div>
              <span className="text-sm text-gray-500">Ver lista</span>
            </Link>
            <div className="border-t border-gray-200">
              <Link
                to="/emails/new"
                className="flex items-center gap-2 p-3 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar correo</span>
              </Link>
            </div>
          </div>

          {/* Tarjetas */}
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link
              to="/cards/list"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Tarjetas</span>
              </div>
              <span className="text-sm text-gray-500">Ver lista</span>
            </Link>
            <div className="border-t border-gray-200">
              <Link
                to="/cards/new"
                className="flex items-center gap-2 p-3 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar tarjeta</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Mi Gestor Personal
      </footer>
    </div>
  );
}