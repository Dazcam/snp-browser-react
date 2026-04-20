function GeneTable({ gene }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Ensembl ID</th>
            <th className="px-4 py-3">Chr</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Strand</th>
            <th className="px-4 py-3">Biotype</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-slate-900 hover:bg-slate-800 transition-colors">
            <td className="px-4 py-3 font-semibold text-white">{gene.display_name}</td>
            <td className="px-4 py-3 font-mono text-xs text-emerald-400">{gene.id}</td>
            <td className="px-4 py-3 text-slate-300">{gene.seq_region_name}</td>
            <td className="px-4 py-3 text-slate-300">{gene.start?.toLocaleString()}</td>
            <td className="px-4 py-3 text-slate-300">{gene.end?.toLocaleString()}</td>
            <td className="px-4 py-3 text-slate-300">{gene.strand === 1 ? '+' : '−'}</td>
            <td className="px-4 py-3">
              <span className="rounded-full bg-emerald-900/40 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-800">
                {gene.biotype}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default GeneTable