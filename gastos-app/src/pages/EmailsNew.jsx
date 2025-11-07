import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function EmailsNew() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("activo");
  const [customStatus, setCustomStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Determinar el estado final
    const finalStatus = status === "personalizado" ? customStatus : status;

    const { error } = await supabase.from("emails").insert([
      { 
        name, 
        email, 
        password, 
        notes, 
        purpose, 
        status: finalStatus 
      }
    ]);

    setLoading(false);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Correo guardado correctamente");
      // Limpiar formulario
      setName(""); 
      setEmail(""); 
      setPassword(""); 
      setNotes(""); 
      setPurpose(""); 
      setStatus("activo");
      setCustomStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <Link
          to="/emails/list"
          className="inline-flex items-center px-4 py-2 mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition"
        >
          ← Volver a Lista
        </Link>

        <h1 className="text-2xl font-semibold mb-6">Agregar nuevo correo</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input 
              type="text" 
              placeholder="Ej: Correo personal" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <input 
              type="email" 
              placeholder="usuario@ejemplo.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input 
              type="text" 
              placeholder="Contraseña del correo" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propósito
            </label>
            <input 
              type="text" 
              placeholder="Ej: Trabajo, Personal, Suscripciones" 
              value={purpose} 
              onChange={(e) => setPurpose(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none mb-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="personalizado">Personalizado</option>
            </select>
            
            {status === "personalizado" && (
              <input
                type="text"
                placeholder="Escribe el estado personalizado"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea 
              placeholder="Notas adicionales sobre este correo..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition w-full font-medium" 
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Correo"}
          </button>
        </form>
      </div>
    </div>
  );
}