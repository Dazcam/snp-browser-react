function GeneTable({ gene }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Ensembl ID</th>
          <th>Chr</th>
          <th>Start</th>
          <th>End</th>
          <th>Biotype</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{gene.display_name}</td>
          <td>{gene.id}</td>
          <td>{gene.seq_region_name}</td>
          <td>{gene.start?.toLocaleString()}</td>
          <td>{gene.end?.toLocaleString()}</td>
          <td>{gene.biotype}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default GeneTable