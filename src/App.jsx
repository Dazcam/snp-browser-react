import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import GeneTable from './GeneTable'
import Controls from './Controls'
import SNPBrowser from './SNPBrowser'

function App() {
  const [query, setQuery]         = useState('')
  const [genes, setGenes]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [species, setSpecies]     = useState('homo_sapiens')
  const [build, setBuild]         = useState('GRCh38')
  const [appTab, setAppTab]       = useState('genes')

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

  async function fetchGene(input) {
    const isEnsemblId = /^ENS(MUS)?G\d+/.test(input.trim())
    const url = isEnsemblId
      ? `${apiBase}/lookup/id/${input.trim()}?content-type=application/json`
      : `${apiBase}/lookup/symbol/${species}/${input.trim()}?content-type=application/json`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`"${input}" not found`)
    return res.json()
  }

  async function fetchGeneBatch(symbols) {
    const res = await fetch(
      `${apiBase}/lookup/symbol/${species}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ symbols })
      }
    )
    if (!res.ok) throw new Error('Batch request failed')
    const data = await res.json()
    return Object.entries(data)
      .filter(([, info]) => info)
      .map(([symbol, info]) => ({ ...info, display_name: symbol }))
  }

  const isMultiple = query.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).length > 1

  async function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)

    if (isMultiple) {
      const symbols = query.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      try {
        const results = await fetchGeneBatch(symbols)
        setGenes(prev => {
          const existing = new Set(prev.map(g => g.id))
          const newOnes = results.filter(r => r.id && !existing.has(r.id))
          return [...prev, ...newOnes]
        })
        setQuery('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      const timer = setTimeout(async () => {
        try {
          const data = await fetchGene(query.trim())
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
    }
  }

  const buildLabel = species === 'homo_sapiens' ? build : 'GRCm39'

  function exportTSV() {
    const headers = ['symbol', 'ensembl_id', 'chromosome', 'start', 'end', 'strand', 'biotype', 'assembly']
    const rows = genes.map(g => [
      g.display_name,
      g.id,
      g.seq_region_name,
      g.start,
      g.end,
      g.strand === 1 ? '+' : '-',
      g.biotype,
      g.assembly_name
    ].join('\t'))
    const tsv = [headers.join('\t'), ...rows].join('\n')
    const blob = new Blob([tsv], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gene_browser_${species}_${buildLabel}_${new Date().toISOString().slice(0, 10)}.tsv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-1">
              Ensembl REST API
            </p>
            <h1 className="text-2xl font-bold text-white">
              Ensembl Gene & SNP Browser
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {species === 'homo_sapiens' ? 'Homo sapiens' : 'Mus musculus'} · {buildLabel}
          </span>
        </div>

        <div className="max-w-4xl mx-auto mt-4 flex gap-1">
          {['genes', 'snps'].map(tab => (
            <button
              key={tab}
              onClick={() => setAppTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
                appTab === tab
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'genes' ? 'Gene Browser' : 'SNP Browser'}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {appTab === 'genes' ? (
          <>
            <Controls
              species={species}
              onSpecies={handleSpecies}
              build={build}
              onBuild={setBuild}
            />

            <form onSubmit={handleSubmit} className="flex gap-2 mt-4 mb-3">
              <SearchBar
                query={query}
                onChange={setQuery}
                loading={loading}
                error={error}
                gene={genes.length > 0}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono transition-colors whitespace-nowrap"
              >
                {loading ? 'Fetching...' : isMultiple ? 'Fetch all' : 'Look up'}
              </button>
            </form>

            <div className="mb-4 flex items-center gap-3 text-xs font-mono text-slate-400">
              {genes.length > 0 && (
                <>
                  <span className="text-emerald-400">●</span>
                  <span>{genes.length} gene{genes.length > 1 ? 's' : ''}</span>
                  <span className="text-slate-600">·</span>
                  <span>{buildLabel}</span>
                  {genes.length === 1 && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span>chr{genes[0].seq_region_name}:{genes[0].start?.toLocaleString()}–{genes[0].end?.toLocaleString()}</span>
                      <span className="text-slate-600">·</span>
                      <span>{Math.round((genes[0].end - genes[0].start) / 1000)}kb</span>
                    </>
                  )}
                </>
              )}
              {genes.length === 0 && !loading && !error && (
                <span>Enter a gene symbol to search</span>
              )}
              {genes.length > 0 && (
                <div className="ml-auto flex items-center gap-3">
                  <button
                    onClick={exportTSV}
                    className="text-slate-500 hover:text-emerald-400 transition-colors text-xs font-mono"
                  >
                    Export TSV
                  </button>
                  <button
                    onClick={() => setGenes([])}
                    className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                  >
                    Clear all
                  </button>
                </div>
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
          </>
        ) : (
          <>
            <Controls
              species={species}
              onSpecies={handleSpecies}
              build={build}
              onBuild={setBuild}
            />
            <div className="mt-4">
              <SNPBrowser species={species} />
            </div>
          </>
        )}

      </main>
    </div>
  )
}

export default App