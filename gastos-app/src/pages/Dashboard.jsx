import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SearchBar from "../components/SearchBar";
import { supabase } from "../supabaseClient";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  // Cargar gastos al iniciar
  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error cargando gastos:", error);
      else setExpenses(data);
    };

    fetchExpenses();
  }, []);

  const handleAdd = (item) => setExpenses([item, ...expenses]);
  const filtered = expenses.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <SearchBar onSearch={setSearch} />
      <ExpenseForm onAdd={handleAdd} />
      <ExpenseList items={filtered} />
    </div>
  );
}

export default Dashboard;

