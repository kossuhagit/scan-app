import Dexie, { type Table } from 'dexie'
import type { Product, StockEntry } from './types'

export class ScanAppDB extends Dexie {
  products!: Table<Product, string>
  entries!: Table<StockEntry, number>

  constructor() {
    super('scan-app-db')
    this.version(1).stores({
      products: 'barcode, name, updatedAt',
      entries: '++id, barcode, type, timestamp',
    })
  }
}

export const db = new ScanAppDB()

export async function upsertProduct(barcode: string, name: string, unit: string) {
  await db.products.put({ barcode, name, unit, updatedAt: Date.now() })
}

export async function addStockEntry(entry: Omit<StockEntry, 'id'>) {
  await upsertProduct(entry.barcode, entry.productName, entry.unit)
  return db.entries.add(entry)
}

export async function deleteStockEntry(id: number) {
  await db.entries.delete(id)
}

export async function clearAllData() {
  await db.transaction('rw', db.products, db.entries, async () => {
    await db.products.clear()
    await db.entries.clear()
  })
}
