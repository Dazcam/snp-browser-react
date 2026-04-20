function SearchBar({ query, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search gene symbol e.g. TBR1"
      value={query}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default SearchBar