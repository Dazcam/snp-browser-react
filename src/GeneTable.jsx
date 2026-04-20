function GeneTable({ gene }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Ensembl ID</th>
            <th className="px-4 py-3">Chr</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Biotype</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white hover:bg-blue-50 transition-colors">
            <td className="px-4 py-3 font-medium text-gray-900">{gene.display_name}</td>
            <td className="px-4 py-3 text-blue-600 font-mono text-xs">{gene.id}</td>
            <td className="px-4 py-3 text-gray-600">{gene.seq_region_name}</td>
            <td className="px-4 py-3 text-gray-600">{gene.start?.toLocaleString()}</td>
            <td className="px-4 py-3 text-gray-600">{gene.end?.toLocaleString()}</td>
            <td className="px-4 py-3">
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
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