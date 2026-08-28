import type { StockSummary } from '../types'

interface SummaryTableProps {
  summary: StockSummary[]
}

export default function SummaryTable({ summary }: SummaryTableProps) {
  if (summary.length === 0) {
    return <p className="empty-state">Belum ada data stok untuk diringkas.</p>
  }

  return (
    <div className="table-wrap">
      <table className="summary-table">
        <thead>
          <tr>
            <th>Barcode</th>
            <th>Nama Produk</th>
            <th>Satuan</th>
            <th>Masuk</th>
            <th>Keluar</th>
            <th>Stok Saat Ini</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item) => (
            <tr key={item.barcode}>
              <td>{item.barcode}</td>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>{item.totalMasuk}</td>
              <td>{item.totalKeluar}</td>
              <td className={item.stok < 0 ? 'stok-negative' : 'stok-value'}>{item.stok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
