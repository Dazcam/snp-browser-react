function SearchBar({ query, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search gene symbol e.g. TBR1, EOMES, SATB2"
      value={query}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
    />
  )
}

export default SearchBar