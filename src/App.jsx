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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-sm font-medium tracking-widest text-blue-600 uppercase mb-1">
            Single-nucleus eQTL atlas
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            eQTL Browser
          </h1>
        </div>

        <SearchBar query={query} onChange={setQuery} />

        <div className="mt-6">
          {loading && (
            <p className="text-sm text-gray-500">Loading...</p>
          )}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {gene && <GeneTable gene={gene} />}
        </div>

      </div>
    </div>
  )
}

export default App