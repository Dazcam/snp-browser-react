import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import SearchTabs from './SearchTabs'
import BatchSearch from './BatchSearch'
import GeneTable from './GeneTable'
import Controls from './Controls'

function App() {
  const [query, setQuery]       = useState('')
  const [genes, setGenes]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [species, setSpecies]   = useState('homo_sapiens')
  const [build, setBuild]       = useState('GRCh38')
  const [activeTab, setActiveTab] = useState('single')

  const apiBase = build === 'GRCh37'
    ? 'https://grch37.rest.ensembl.org'
    : 'https://rest.ensembl.org'

  function handleSpecies(s) {
    setSpecies(s)
    setGenes([])
    setBuild('GRCh38')
  }

  function removeGene(id) {
    setGenes(prev => prev.filter(g => g.id !== id))
  }

  async function fetchGene(symbol) {
    const res = await fetch(
      `${apiBase}/lookup/symbol/${species}/${symbol}?content-type=application/json`
    )
    if (!res.ok) throw new Error(`"${symbol}" not found`)
    return res.json()
  }

  async function handleBatchFetch(symbols) {
    setLoading(true)
    setError(null)
    const errors = []

    for (const symbol of symbols) {
      try {
        const data = await fetchGene(symbol)
        setGenes(prev => {
          if (prev.find(g => g.id === data.id)) return prev
          return [...prev, data]
        })
      } catch (err) {
        errors.push(err.message)
      }
    }

    if (errors.length > 0) setError(errors.join(' · '))
    setLoading(false)
  }

  useEffect(() => {
    if (!query) return

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchGene(query)
        setGenes(prev => {
          if (prev.find(g => g.id === data.id)) return prev
          return [...prev, data]
        })
        setQuery('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, species, build])

  const buildLabel = species === 'homo_sapiens' ? build : 'GRCm39'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-1">
              Ensembl REST API
            </p>
            <h1 className="text-2xl font-bold text-white">
              Ensembl Gene Browser
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {species === 'homo_sapiens' ? 'Homo sapiens' : 'Mus musculus'} · {buildLabel}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        <SearchTabs activeTab={activeTab} onTab={setActiveTab} />

        {activeTab === 'single' ? (
          <SearchBar
            query={query}
            onChange={setQuery}
            loading={loading}
            error={error}
            gene={genes.length > 0}
          />
        ) : (
          <BatchSearch onFetch={handleBatchFetch} loading={loading} />
        )}

        <Controls
          species={species}
          onSpecies={handleSpecies}
          build={build}
          onBuild={setBuild}
        />

        <div className="mt-6 mb-4 flex items-center gap-3 text-xs font-mono text-slate-400">
          {genes.length > 0 && (
            <>
              <span className="text-emerald-400">●</span>
              <span>{genes.length} gene{genes.length > 1 ? 's' : ''}</span>
              <span className="text-slate-600">·</span>
              <span>{buildLabel}</span>
            </>
          )}
          {genes.length === 0 && !loading && !error && (
            <span>Enter a gene symbol to search</span>
          )}
          {genes.length > 0 && (
            <button
              onClick={() => setGenes([])}
              className="ml-auto text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
            >
              Clear all
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        {genes.length > 0 && (
          <GeneTable genes={genes} onRemove={removeGene} />
        )}

      </main>
    </div>
  )
}

export default App
