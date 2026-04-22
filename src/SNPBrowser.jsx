import { useState } from 'react'

function SNPBrowser({ species }) {
  const [query, setQuery]     = useState('')
  const [snps, setSnps]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function fetchSNP(rsid) {
    const res = await fetch(
      `https://rest.ensembl.org/variation/${species}/${rsid}?content-type=application/json`
    )
    if (!res.ok) throw new Error(`"${rsid}" not found`)
    return res.json()
  }

  async function fetchSNPBatch(rsids) {
    const res = await fetch(
      `https://rest.ensembl.org/variation/${species}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ids: rsids })
      }
    )
    if (!res.ok) throw new Error('Batch request failed')
    const data = await res.json()
    return Object.entries(data).map(([name, info]) => ({ ...info, name }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
        if (isMultiple) {
            await handleBatch(e)
        } else {
            await handleSearch(e)
        }
}

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSNP(query.trim())
      setSnps(prev => {
        if (prev.find(s => s.name === data.name)) return prev
        return [...prev, data]
      })
      setQuery('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBatch(e) {
    e.preventDefault()
    const rsids = query
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean)
    if (!rsids.length) return
    setLoading(true)
    setError(null)
    try {
      const results = await fetchSNPBatch(rsids)
      setSnps(prev => {
        const existing = new Set(prev.map(s => s.name))
        const newOnes = results.filter(r => !existing.has(r.name))
        return [...prev, ...newOnes]
      })
      setQuery('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function removeSNP(name) {
    setSnps(prev => prev.filter(s => s.name !== name))
  }

  function getLocation(snp) {
    if (!snp.most_severe_consequence) return '—'
    const c = snp.most_severe_consequence
    if (c.includes('intron'))      return 'intronic'
    if (c.includes('missense'))    return 'exonic'
    if (c.includes('synonymous'))  return 'exonic'
    if (c.includes('UTR'))         return 'UTR'
    if (c.includes('upstream'))    return 'upstream'
    if (c.includes('downstream'))  return 'downstream'
    if (c.includes('intergenic'))  return 'intergenic'
    return c.replace(/_/g, ' ')
  }

  function getLocationColour(location) {
    if (location === 'exonic')                                return 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
    if (location === 'intronic')                              return 'bg-slate-700/60 text-slate-300 border-slate-600'
    if (location === 'UTR')                                   return 'bg-blue-900/40 text-blue-400 border-blue-800'
    if (location === 'upstream' || location === 'downstream') return 'bg-amber-900/40 text-amber-400 border-amber-800'
    return 'bg-slate-700/60 text-slate-300 border-slate-600'
  }

  function exportTSV() {
    const headers = ['rsid', 'class', 'chromosome', 'position', 'alleles', 'ancestral', 'minor_allele', 'MAF', 'location', 'evidence']
    const rows = snps.map(s => {
      const m = s.mappings?.[0] || {}
      return [
        s.name,
        s.var_class,
        m.seq_region_name,
        m.start,
        m.allele_string,
        m.ancestral_allele,
        s.minor_allele || '—',
        s.MAF !== null && s.MAF !== undefined ? s.MAF.toFixed(3) : '—',
        getLocation(s),
        (s.evidence || []).join(';')
      ].join('\t')
    })
    const tsv = [headers.join('\t'), ...rows].join('\n')
    const blob = new Blob([tsv], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snp_browser_${species}_${new Date().toISOString().slice(0, 10)}.tsv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isMultiple = query.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).length > 1
  const mapping = snps.length > 0 ? snps[0].mappings?.[0] : null

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="rsID or comma separated list e.g. rs6311, rs429358"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
        {snps.length > 0 && (
          <>
            <span className="text-emerald-400">●</span>
            <span>{snps.length} variant{snps.length > 1 ? 's' : ''}</span>
            {snps.length === 1 && mapping && (
              <>
                <span className="text-slate-600">·</span>
                <span>{mapping.assembly_name}</span>
                <span className="text-slate-600">·</span>
                <span>chr{mapping.seq_region_name}:{mapping.start?.toLocaleString()}</span>
              </>
            )}
          </>
        )}
        {snps.length === 0 && !loading && !error && (
          <span>Enter an rsID to search</span>
        )}
        {snps.length > 0 && (
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={exportTSV}
              className="text-slate-500 hover:text-emerald-400 transition-colors text-xs font-mono"
            >
              Export TSV
            </button>
            <button
              onClick={() => setSnps([])}
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

      {snps.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">rsID</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Chr</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Alleles</th>
                <th className="px-4 py-3">Ancestral</th>
                <th className="px-4 py-3">Minor allele</th>
                <th className="px-4 py-3">MAF</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {snps.map(snp => {
                const m = snp.mappings?.[0] || {}
                const location = getLocation(snp)
                const locationColour = getLocationColour(location)
                return (
                  <tr key={snp.name} className="bg-slate-900 hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">
                      <a
                        href={"https://www.ensembl.org/id/" + snp.name}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                      >
                        {snp.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{snp.var_class}</td>
                    <td className="px-4 py-3 text-slate-300">{m.seq_region_name}</td>
                    <td className="px-4 py-3 text-slate-300">{m.start?.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">{m.allele_string}</td>
                    <td className="px-4 py-3 text-slate-300">{m.ancestral_allele}</td>
                    <td className="px-4 py-3 text-slate-300">{snp.minor_allele || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {snp.MAF !== null && snp.MAF !== undefined ? snp.MAF.toFixed(3) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium border whitespace-nowrap ${locationColour}`}>
                        {location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeSNP(snp.name)}
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SNPBrowser
