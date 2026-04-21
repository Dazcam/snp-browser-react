import { useState } from 'react'

function BatchSearch({ onFetch, loading }) {
  const [text, setText] = useState('')

  function handleSubmit() {
    const symbols = text
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean)
    if (symbols.length > 0) onFetch(symbols)
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'Paste gene symbols, one per line or comma separated:\nTBR1\nEOMES\nSATB2'}
        rows={5}
        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 font-mono">
          {text.split(/[\n,]+/).filter(s => s.trim()).length} genes
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch all'}
        </button>
      </div>
    </div>
  )
}

export default BatchSearch
