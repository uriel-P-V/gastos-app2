function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Buscar..."
      onChange={(e) => onSearch(e.target.value)}
      className="border p-2 w-full mb-4 rounded"
    />
  );
}

export default SearchBar;
