function SearchBar({ query, onChange, loading, error, gene }) {
  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : gene
    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20'

  return (
    <div className="relative flex items-center flex-1">
      <input
        type="text"
        placeholder="Gene symbol or comma separated list e.g. TBR1, EOMES, SATB2"
        value={query}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-2 transition-colors duration-200 ${borderClass}`}
      />
      {loading && (
        <div className="absolute right-3 flex items-center gap-2">
          <span className="spinner" />
          <span className="text-xs text-slate-500 font-mono">fetching...</span>
        </div>
      )}
    </div>
  )
}

export default SearchBar
