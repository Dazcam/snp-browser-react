import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import GeneTable from './GeneTable'

function App() {
  const [query, setQuery]     = useState('')
  const [gene, setGene]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!query) {
      setGene(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://rest.ensembl.org/lookup/symbol/homo_sapiens/${query}?content-type=application/json`
        )
        if (!res.ok) throw new Error('Gene not found')
        const data = await res.json()
        setGene(data)
      } catch (err) {
        setError(err.message)
        setGene(null)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* Header bar */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-1">
              Ensembl REST API
            </p>
            <h1 className="text-2xl font-bold text-white">
              Gene Browser
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Homo sapiens · GRCh38
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Search */}
        <div className="mb-6">
          <SearchBar query={query} onChange={setQuery} />
        </div>

        {/* Status strip */}
        <div className="mb-4 flex items-center gap-3 text-xs font-mono text-slate-400">
          {gene && (
            <>
              <span className="text-emerald-400">●</span>
              <span>1 result</span>
              <span className="text-slate-600">·</span>
              <span>{gene.assembly_name}</span>
              <span className="text-slate-600">·</span>
              <span>chr{gene.seq_region_name}:{gene.start?.toLocaleString()}–{gene.end?.toLocaleString()}</span>
            </>
          )}
          {!gene && !loading && !error && (
            <span>Enter a gene symbol to search</span>
          )}
        </div>

        {/* States */}
        {loading && (
          <p className="text-sm text-slate-400 font-mono">Fetching...</p>
        )}
        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {gene && <GeneTable gene={gene} />}

      </main>
    </div>
  )
}

export default App