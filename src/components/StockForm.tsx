import { useEffect, useState, type FormEvent } from 'react'
import type { StockType } from '../types'

interface StockFormProps {
  barcode: string
  initialName: string
  initialUnit: string
  onSubmit: (data: { name: string; unit: string; type: StockType; qty: number; note: string }) => void
  onCancel: () => void
}

export default function StockForm({ barcode, initialName, initialUnit, onSubmit, onCancel }: StockFormProps) {
  const [name, setName] = useState(initialName)
  const [unit, setUnit] = useState(initialUnit || 'pcs')
  const [type, setType] = useState<StockType>('masuk')
  const [qty, setQty] = useState('1')
  const [note, setNote] = useState('')

  useEffect(() => {
    setName(initialName)
    setUnit(initialUnit || 'pcs')
  }, [initialName, initialUnit, barcode])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsedQty = Number(qty)
    if (!name.trim() || !parsedQty || parsedQty <= 0) return
    onSubmit({ name: name.trim(), unit: unit.trim() || 'pcs', type, qty: parsedQty, note: note.trim() })
    setQty('1')
    setNote('')
  }

  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Barcode</label>
        <input type="text" value={barcode} readOnly className="readonly-input" />
      </div>

      <div className="field">
        <label>Nama Produk</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama produk"
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Satuan</label>
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs / box / kg" />
        </div>
        <div className="field">
          <label>Jumlah</label>
          <input
            type="number"
            min="1"
            step="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label>Jenis Transaksi</label>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'masuk' ? 'toggle-btn active-in' : 'toggle-btn'}
            onClick={() => setType('masuk')}
          >
            ⬇ Stok Masuk
          </button>
          <button
            type="button"
            className={type === 'keluar' ? 'toggle-btn active-out' : 'toggle-btn'}
            onClick={() => setType('keluar')}
          >
            ⬆ Stok Keluar
          </button>
        </div>
      </div>

      <div className="field">
        <label>Catatan (opsional)</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan tambahan" />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          💾 Simpan
        </button>
      </div>
    </form>
  )
}
