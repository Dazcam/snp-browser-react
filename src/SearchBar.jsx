function SearchBar({ query, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search gene symbol e.g. TBR1"
        value={query}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  )
}

export default SearchBar