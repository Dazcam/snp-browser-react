function SearchTabs({ activeTab, onTab }) {
  return (
    <div className="flex gap-1 mb-3">
      {['single', 'batch'].map(tab => (
        <button
          key={tab}
          onClick={() => onTab(tab)}
          className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
            activeTab === tab
              ? 'bg-slate-700 text-slate-100'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab === 'single' ? 'Single gene' : 'Batch input'}
        </button>
      ))}
    </div>
  )
}

export default SearchTabs
