import type { StockEntry } from '../types'

interface StockListProps {
  entries: StockEntry[]
  onDelete: (id: number) => void
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function StockList({ entries, onDelete }: StockListProps) {
  if (entries.length === 0) {
    return <p className="empty-state">Belum ada riwayat transaksi stok.</p>
  }

  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.id} className="entry-item">
          <div className="entry-main">
            <span className={entry.type === 'masuk' ? 'badge badge-in' : 'badge badge-out'}>
              {entry.type === 'masuk' ? 'Masuk' : 'Keluar'}
            </span>
            <div className="entry-info">
              <strong>{entry.productName}</strong>
              <span className="entry-meta">
                {entry.barcode} · {entry.qty} {entry.unit}
              </span>
              {entry.note && <span className="entry-note">{entry.note}</span>}
              <span className="entry-date">{formatDate(entry.timestamp)}</span>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Hapus"
            onClick={() => entry.id !== undefined && onDelete(entry.id)}
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  )
}
