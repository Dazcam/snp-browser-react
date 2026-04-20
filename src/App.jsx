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
    <div>
      <h1> <h1 className="text-3xl font-bold text-blue-800">eQTL Browser</h1></h1>

      <SearchBar query={query} onChange={setQuery} />

      {loading && <p>Loading...</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {gene    && <GeneTable gene={gene} />}

    </div>
  )
}

export default App