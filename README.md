# scan-app

PWA (Progressive Web App) untuk scan barcode produk dan pencatatan stok, dengan ekspor data ke Excel.

## Fitur

- **Scan barcode** menggunakan kamera perangkat (mendukung barcode 1D umum dan QR code), dengan opsi input manual jika kamera tidak tersedia.
- **Input stok masuk/keluar** per produk yang di-scan (nama, satuan, jumlah, catatan).
- **Riwayat transaksi** stok dengan opsi hapus per baris atau hapus semua data.
- **Ringkasan stok** per produk (total masuk, total keluar, stok saat ini).
- **Ekspor ke Excel (.xlsx)** — menghasilkan file dengan sheet "Ringkasan Stok" dan "Riwayat Transaksi".
- **Bekerja offline** dan bisa di-install ke home screen (PWA) — data tersimpan lokal di perangkat (IndexedDB).

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan (default `http://localhost:5173`). Akses kamera memerlukan koneksi HTTPS atau `localhost`.

## Build produksi

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/`, siap di-deploy ke hosting statis apa pun (Netlify, Vercel, GitHub Pages, dll). Setelah di-deploy dengan HTTPS, aplikasi bisa di-install sebagai PWA dari browser (Chrome/Edge: ikon install di address bar; Safari iOS: menu Share > Add to Home Screen).

## Teknologi

- Vite + React + TypeScript
- `vite-plugin-pwa` (manifest + service worker/offline cache)
- `html5-qrcode` (scan barcode via kamera)
- `dexie` / `dexie-react-hooks` (penyimpanan lokal IndexedDB)
- `xlsx` (SheetJS) untuk ekspor Excel
