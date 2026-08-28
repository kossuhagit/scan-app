import * as XLSX from 'xlsx'
import type { StockEntry, StockSummary } from '../types'

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function exportStockToExcel(entries: StockEntry[], summary: StockSummary[]) {
  const summaryRows = summary.map((item) => ({
    Barcode: item.barcode,
    'Nama Produk': item.name,
    Satuan: item.unit,
    'Total Masuk': item.totalMasuk,
    'Total Keluar': item.totalKeluar,
    'Stok Saat Ini': item.stok,
    'Update Terakhir': formatDate(item.lastUpdate),
  }))

  const historyRows = entries
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((entry, index) => ({
      No: index + 1,
      Tanggal: formatDate(entry.timestamp),
      Barcode: entry.barcode,
      'Nama Produk': entry.productName,
      Satuan: entry.unit,
      Jenis: entry.type === 'masuk' ? 'Masuk' : 'Keluar',
      Jumlah: entry.qty,
      Catatan: entry.note,
    }))

  const workbook = XLSX.utils.book_new()

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
  summarySheet['!cols'] = [{ wch: 16 }, { wch: 28 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan Stok')

  const historySheet = XLSX.utils.json_to_sheet(historyRows)
  historySheet['!cols'] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 16 },
    { wch: 28 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 24 },
  ]
  XLSX.utils.book_append_sheet(workbook, historySheet, 'Riwayat Transaksi')

  const filename = `stok-produk-${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, filename)
}
