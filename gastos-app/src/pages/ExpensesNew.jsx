import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Upload, X } from "lucide-react";

export default function ExpensesNew() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("gasto");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const commonCategories = [
    "Comida", "Transporte", "Vivienda", "Entretenimiento", 
    "Salud", "Educación", "Ropa", "Tecnología", "Viajes", "Otros"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    // Resetear el input file
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let image_url = null;

    // Si se carga imagen, la subimos a Supabase Storage
    if (image) {
      const fileName = `expenses/${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, image);

      if (uploadError) {
        alert("Error al subir imagen: " + uploadError.message);
        setLoading(false);
        return;
      } else {
        const { data: publicUrl } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        image_url = publicUrl.publicUrl;
      }
    }

    const { error } = await supabase.from("expenses").insert([
      { 
        title, 
        amount: Number(amount), 
        type, 
        category: category || null, 
        image_url,
        date
      }
    ]);

    setLoading(false);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Registro guardado correctamente!");
      // Limpiar formulario
      setTitle("");
      setAmount("");
      setType("gasto");
      setCategory("");
      setImage(null);
      setImagePreview(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <Link
          to="/expenses/list"
          className="inline-flex items-center px-4 py-2 mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition"
        >
          ← Volver al Listado
        </Link>

        <h1 className="text-2xl font-semibold mb-6">Agregar Gasto o Ingreso</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título o descripción *
            </label>
            <input 
              type="text" 
              placeholder="Ej: Compra en el supermercado" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                min="0"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                <option value="">Seleccionar categoría</option>
                {commonCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>

         
            
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Registro"}
          </button>
        </form>
      </div>
    </div>
  );
}