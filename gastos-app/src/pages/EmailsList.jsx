import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";

export default function EmailsList() {
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  const fetchEmails = async () => {
    setLoading(true);
    let query = supabase.from("emails").select("*").order("created_at", { ascending: false });
    if (search) query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%,purpose.ilike.%${search}%`);
    const { data, error } = await query;
    setLoading(false);
    if (error) alert("Error al cargar correos: " + error.message);
    else setEmails(data);
  };

  useEffect(() => {
    fetchEmails();
  }, [search]);

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from("emails").update({ status: newStatus }).eq("id", id);
    if (error) alert("Error al actualizar: " + error.message);
    else fetchEmails();
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este correo?")) {
      const { error } = await supabase.from("emails").delete().eq("id", id);
      if (error) alert("Error al eliminar: " + error.message);
      else fetchEmails();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition">
            ← Volver al Inicio
          </Link>
          <Link 
            to="/emails/new" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
          >
            + Nuevo Correo
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Gestor de Correos</h1>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Buscar por correo, nombre o propósito..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando correos...</p>
        ) : emails.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay correos guardados</p>
            <Link 
              to="/emails/new" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Agregar primer correo
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-3 text-left">Nombre</th>
                  <th className="border px-4 py-3 text-left">Correo</th>
                  <th className="border px-4 py-3 text-left">Contraseña</th>
                  <th className="border px-4 py-3 text-left">Propósito</th>
                  <th className="border px-4 py-3 text-left">Notas</th>
                  <th className="border px-4 py-3 text-left">Estado</th>
                  <th className="border px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3 font-medium">{email.name || '-'}</td>
                    <td className="border px-4 py-3">
                      <a 
                        href={`mailto:${email.email}`} 
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {email.email}
                      </a>
                    </td>
                    <td className="border px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPassword[email.id] ? email.password : '•'.repeat(8)}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(email.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showPassword[email.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="border px-4 py-3">{email.purpose || '-'}</td>
                    <td className="border px-4 py-3 max-w-xs">
                      <div className="truncate" title={email.notes}>
                        {email.notes || '-'}
                      </div>
                    </td>
                    <td className="border px-4 py-3">
                      <select 
                        value={email.status} 
                        onChange={(ev) => handleStatusChange(email.id, ev.target.value)} 
                        className={`border border-gray-300 rounded-lg p-1 text-sm ${getStatusColor(email.status)}`}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="personalizado">Personalizado</option>
                      </select>
                    </td>
                    <td className="border px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(email.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Total: {emails.length} correo{emails.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}