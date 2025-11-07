import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CardsNew() {
  const [bankName, setBankName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validar que el CVV tenga 3 o 4 dígitos
    if (cvv && !/^\d{3,4}$/.test(cvv)) {
      alert("El CVV debe tener 3 o 4 dígitos");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("cards").insert([
      { 
        bank_name: bankName, 
        card_number: cardNumber, 
        expiration, 
        cvv,
        notes 
      }
    ]);
    
    setLoading(false);
    if (error) alert("Error al guardar: " + error.message);
    else {
      alert("Tarjeta guardada correctamente");
      setBankName(""); 
      setCardNumber(""); 
      setExpiration(""); 
      setCvv("");
      setNotes("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <Link to="/" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition">
          ← Volver
        </Link>

        <h1 className="text-2xl font-semibold mb-6">Registrar nueva tarjeta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
            <input 
              type="text" 
              placeholder="Nombre del banco" 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
            <input 
              type="text" 
              placeholder="1234 5678 9012 3456" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
              <input 
                type="text" 
                placeholder="MM/AA" 
                value={expiration} 
                onChange={(e) => setExpiration(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input 
                type="text" 
                placeholder="123" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea 
              placeholder="Notas adicionales..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition w-full" 
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Tarjeta"}
          </button>
        </form>
      </div>
    </div>
  );
}
