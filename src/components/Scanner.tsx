import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const ELEMENT_ID = 'barcode-scanner-viewport'

interface ScannerProps {
  onScan: (code: string) => void
}

export default function Scanner({ onScan }: ScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current
      if (scanner) {
        scanner
          .stop()
          .catch(() => {})
          .finally(() => scanner.clear())
      }
    }
  }, [])

  async function startScanning() {
    setError('')
    try {
      const scanner = new Html5Qrcode(ELEMENT_ID, { verbose: false })
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 160 } },
        (decodedText) => {
          onScan(decodedText.trim())
          stopScanning()
        },
        () => {
          // ignore per-frame decode failures
        },
      )
      setActive(true)
    } catch (err) {
      setError('Tidak bisa mengakses kamera. Periksa izin kamera pada browser, atau masukkan barcode secara manual.')
      console.error(err)
    }
  }

  async function stopScanning() {
    const scanner = scannerRef.current
    if (scanner) {
      try {
        await scanner.stop()
        scanner.clear()
      } catch {
        // already stopped
      }
    }
    setActive(false)
  }

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault()
    const code = manualCode.trim()
    if (code) {
      onScan(code)
      setManualCode('')
    }
  }

  return (
    <div className="scanner">
      <div id={ELEMENT_ID} className={active ? 'scanner-viewport active' : 'scanner-viewport'} />

      {!active ? (
        <button type="button" className="btn btn-primary" onClick={startScanning}>
          📷 Mulai Scan Barcode
        </button>
      ) : (
        <button type="button" className="btn btn-secondary" onClick={stopScanning}>
          ⏹ Hentikan Scan
        </button>
      )}

      {error && <p className="error-text">{error}</p>}

      <form className="manual-entry" onSubmit={handleManualSubmit}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Atau ketik barcode manual..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <button type="submit" className="btn btn-outline">
          Cari
        </button>
      </form>
    </div>
  )
}
