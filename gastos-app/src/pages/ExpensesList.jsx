import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Search, Plus, Filter, Download, Eye, Trash2 } from "lucide-react";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("todos");
  const [filterCategory, setFilterCategory] = useState("todas");
  const [categories, setCategories] = useState([]);

  const fetchExpenses = async () => {
    setLoading(true);
    let query = supabase.from("expenses").select("*").order("date", { ascending: false });
    
    // Aplicar filtros
    if (search) {
      query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
    }
    if (filterType !== "todos") {
      query = query.eq("type", filterType);
    }
    if (filterCategory !== "todas") {
      query = query.eq("category", filterCategory);
    }
    
    const { data, error } = await query;
    setLoading(false);
    if (error) alert("Error al cargar datos: " + error.message);
    else setExpenses(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("category")
      .not("category", "is", null);
    
    if (data) {
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [search, filterType, filterCategory]);

  const deleteExpense = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) alert("Error al eliminar: " + error.message);
      else fetchExpenses();
    }
  };

  const calculateTotals = () => {
    const ingresos = expenses.filter(e => e.type === "ingreso").reduce((sum, e) => sum + Number(e.amount), 0);
    const gastos = expenses.filter(e => e.type === "gasto").reduce((sum, e) => sum + Number(e.amount), 0);
    const balance = ingresos - gastos;
    return { ingresos, gastos, balance };
  };

  const { ingresos, gastos, balance } = calculateTotals();

  const exportToCSV = () => {
    const headers = ["Título", "Monto", "Tipo", "Categoría", "Fecha"];
    const csvData = expenses.map(expense => [
      expense.title,
      expense.amount,
      expense.type,
      expense.category || "-",
      new Date(expense.date).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gastos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition">
            ← Volver al Inicio
          </Link>
          <Link 
            to="/expenses/new" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
          >
            <Plus size={18} className="mr-2" />
            Nuevo Registro
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Historial de Gastos / Ingresos</h1>
        
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Ingresos</p>
            <p className="text-2xl font-bold text-green-700">${ingresos.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Gastos</p>
            <p className="text-2xl font-bold text-red-700">${gastos.toFixed(2)}</p>
          </div>
          <div className={`border rounded-lg p-4 ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className="text-sm font-medium">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="todos">Todos los tipos</option>
            <option value="gasto">Solo gastos</option>
            <option value="ingreso">Solo ingresos</option>
          </select>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="todas">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            <Download size={18} className="mr-2" />
            Exportar CSV
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando registros...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay registros</p>
            <Link 
              to="/expenses/new" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Agregar primer registro
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-3 text-left">Título</th>
                  <th className="border px-4 py-3 text-left">Monto</th>
                  <th className="border px-4 py-3 text-left">Tipo</th>
                  <th className="border px-4 py-3 text-left">Categoría</th>
                  <th className="border px-4 py-3 text-left">Fecha</th>
                  <th className="border px-4 py-3 text-left">Imagen</th>
                  <th className="border px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3 font-medium">{expense.title}</td>
                    <td className={`border px-4 py-3 font-semibold ${expense.type === "gasto" ? "text-red-600" : "text-green-600"}`}>
                      ${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="border px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        expense.type === "gasto" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {expense.type}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      {expense.category ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {expense.category}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-4 py-3 text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-3 text-center">
                      {expense.image_url ? (
                        <div className="flex justify-center">
                          <img 
                            src={expense.image_url} 
                            alt={expense.title} 
                            className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(expense.image_url, '_blank')}
                          />
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-4 py-3">
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800 p-1 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contador */}
        <div className="mt-4 text-sm text-gray-500">
          Total: {expenses.length} registro{expenses.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}