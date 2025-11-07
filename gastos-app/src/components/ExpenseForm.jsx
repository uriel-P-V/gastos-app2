import { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("gasto"); // gasto o ingreso

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    onAdd({ title, amount: parseFloat(amount), type });
    setTitle("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
      <input
        type="text"
        placeholder="Descripción"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      >
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </select>
      <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
        Agregar
      </button>
    </form>
  );
}

export default ExpenseForm;
