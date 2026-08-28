import { lazy, Suspense, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addStockEntry, deleteStockEntry, clearAllData } from './db'
import type { StockEntry, StockSummary, StockType } from './types'
import StockForm from './components/StockForm'
import StockList from './components/StockList'
import SummaryTable from './components/SummaryTable'

const Scanner = lazy(() => import('./components/Scanner'))

type Tab = 'input' | 'riwayat' | 'ringkasan'

const EMPTY_ENTRIES: StockEntry[] = []

export default function App() {
  const [tab, setTab] = useState<Tab>('input')
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)

  const scannedProduct = useLiveQuery(
    () => (scannedBarcode ? db.products.get(scannedBarcode) : undefined),
    [scannedBarcode],
  )

  const entries = useLiveQuery(() => db.entries.orderBy('timestamp').reverse().toArray(), []) ?? EMPTY_ENTRIES

  const summary = useMemo<StockSummary[]>(() => {
    const map = new Map<string, StockSummary>()
    for (const entry of entries) {
      const existing = map.get(entry.barcode)
      const delta = entry.type === 'masuk' ? entry.qty : -entry.qty
      if (existing) {
        existing.totalMasuk += entry.type === 'masuk' ? entry.qty : 0
        existing.totalKeluar += entry.type === 'keluar' ? entry.qty : 0
        existing.stok += delta
        if (entry.timestamp > existing.lastUpdate) {
          existing.lastUpdate = entry.timestamp
          existing.name = entry.productName
          existing.unit = entry.unit
        }
      } else {
        map.set(entry.barcode, {
          barcode: entry.barcode,
          name: entry.productName,
          unit: entry.unit,
          totalMasuk: entry.type === 'masuk' ? entry.qty : 0,
          totalKeluar: entry.type === 'keluar' ? entry.qty : 0,
          stok: delta,
          lastUpdate: entry.timestamp,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [entries])

  async function handleSubmit(data: { name: string; unit: string; type: StockType; qty: number; note: string }) {
    if (!scannedBarcode) return
    await addStockEntry({
      barcode: scannedBarcode,
      productName: data.name,
      unit: data.unit,
      type: data.type,
      qty: data.qty,
      note: data.note,
      timestamp: Date.now(),
    })
    setScannedBarcode(null)
  }

  async function handleDelete(id: number) {
    await deleteStockEntry(id)
  }

  async function handleClearAll() {
    if (confirm('Hapus semua data produk dan riwayat stok? Tindakan ini tidak bisa dibatalkan.')) {
      await clearAllData()
    }
  }

  async function handleExport() {
    if (entries.length === 0) {
      alert('Belum ada data untuk diekspor.')
      return
    }
    const { exportStockToExcel } = await import('./utils/exportExcel')
    exportStockToExcel(entries, summary)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Scan Stok Produk</h1>
        <button type="button" className="btn btn-export" onClick={handleExport}>
          ⬇ Ekspor Excel
        </button>
      </header>

      <nav className="tabs">
        <button className={tab === 'input' ? 'tab active' : 'tab'} onClick={() => setTab('input')}>
          Scan
        </button>
        <button className={tab === 'riwayat' ? 'tab active' : 'tab'} onClick={() => setTab('riwayat')}>
          Riwayat ({entries.length})
        </button>
        <button className={tab === 'ringkasan' ? 'tab active' : 'tab'} onClick={() => setTab('ringkasan')}>
          Ringkasan
        </button>
      </nav>

      <main className="app-main">
        {tab === 'input' &&
          (scannedBarcode ? (
            <StockForm
              barcode={scannedBarcode}
              initialName={scannedProduct?.name ?? ''}
              initialUnit={scannedProduct?.unit ?? ''}
              onSubmit={handleSubmit}
              onCancel={() => setScannedBarcode(null)}
            />
          ) : (
            <Suspense fallback={<p className="empty-state">Memuat pemindai...</p>}>
              <Scanner onScan={setScannedBarcode} />
            </Suspense>
          ))}

        {tab === 'riwayat' && (
          <>
            <StockList entries={entries} onDelete={handleDelete} />
            {entries.length > 0 && (
              <button type="button" className="btn btn-danger" onClick={handleClearAll}>
                Hapus Semua Data
              </button>
            )}
          </>
        )}

        {tab === 'ringkasan' && <SummaryTable summary={summary} />}
      </main>
    </div>
  )
}
