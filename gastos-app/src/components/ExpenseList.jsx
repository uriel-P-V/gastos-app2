function ExpenseList({ items }) {
  return (
    <ul className="bg-white p-4 rounded shadow-md">
      {items.map((item, index) => (
        <li key={index} className="flex justify-between mb-2 border-b pb-1">
          <span>{item.title}</span>
          <span className={item.type === "gasto" ? "text-red-500" : "text-green-500"}>
            {item.type === "gasto" ? "-" : "+"}${item.amount.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
