import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CardsList() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    let query = supabase.from("cards").select("*").order("created_at", { ascending: false });
    if (search) query = query.ilike("bank_name", `%${search}%`);
    const { data, error } = await query;
    setLoading(false);
    if (error) alert("Error al cargar tarjetas: " + error.message);
    else setCards(data);
  };

  useEffect(() => {
    fetchCards();
  }, [search]);



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition">
            ← Volver
          </Link>
          <Link 
            to="/cards/new" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
          >
            + Nueva Tarjeta
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Tarjetas guardadas</h1>

        <input 
          type="text" 
          placeholder="Buscar por banco..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : cards.length === 0 ? (
          <p className="text-center text-gray-500">No hay tarjetas guardadas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Banco</th>
                  <th className="border px-4 py-2 text-left">Número</th>
                  <th className="border px-4 py-2 text-left">Vencimiento</th>
                  <th className="border px-4 py-2 text-left">CVV</th>
                  <th className="border px-4 py-2 text-left">Notas</th>
                  <th className="border px-4 py-2 text-left">Fecha de creación</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 font-medium">{card.bank_name}</td>
                    <td className="border px-4 py-2 font-mono">{card.card_number}</td>
                    <td className="border px-4 py-2">{card.expiration}</td>
                    <td className="border px-4 py-2 font-mono">{card.cvv}</td>
                    <td className="border px-4 py-2 max-w-xs truncate">{card.notes}</td>
                    <td className="border px-4 py-2 text-sm text-gray-500">
                      {new Date(card.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}