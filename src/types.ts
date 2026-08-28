export type StockType = 'masuk' | 'keluar'

export interface Product {
  barcode: string
  name: string
  unit: string
  updatedAt: number
}

export interface StockEntry {
  id?: number
  barcode: string
  productName: string
  unit: string
  type: StockType
  qty: number
  note: string
  timestamp: number
}

export interface StockSummary {
  barcode: string
  name: string
  unit: string
  totalMasuk: number
  totalKeluar: number
  stok: number
  lastUpdate: number
}
