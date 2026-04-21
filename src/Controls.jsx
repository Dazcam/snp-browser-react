function Controls({ species, onSpecies, build, onBuild }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">

      {/* Species toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-700 p-1">
        {['homo_sapiens', 'mus_musculus'].map(s => (
          <button
            key={s}
            onClick={() => onSpecies(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
              species === s
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s === 'homo_sapiens' ? 'Human' : 'Mouse'}
          </button>
        ))}
      </div>

      {/* Genome build toggle — human only */}
      {species === 'homo_sapiens' && (
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 p-1">
          {['GRCh38', 'GRCh37'].map(b => (
            <button
              key={b}
              onClick={() => onBuild(b)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
                build === b
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default Controls
