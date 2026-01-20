'use client';

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onClose: () => void
  onScan: (entradaId: number) => void
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const startScanning = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            try {
              // El QR contiene: "id-dni"
              const parts = decodedText.split('-')
              if (parts.length >= 1) {
                const entradaId = parseInt(parts[0])
                if (!isNaN(entradaId)) {
                  scanner.stop().then(() => {
                    setScanning(false)
                    onScan(entradaId)
                  })
                } else {
                  setError('Código QR inválido')
                }
              } else {
                setError('Formato de QR inválido')
              }
            } catch (err) {
              setError('Error al procesar el código QR')
            }
          },
          (errorMessage) => {
            // Ignorar errores de escaneo (continuar escaneando)
          }
        )

        setScanning(true)
      } catch (err: any) {
        console.error('Error starting scanner:', err)
        setError('No se pudo acceder a la cámara. Verifica los permisos.')
      }
    }

    startScanning()

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current = null
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err)
          })
      }
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Escanear QR</h2>
          <button
            onClick={() => {
              if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                  onClose()
                })
              } else {
                onClose()
              }
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4">
          <div id="qr-reader" className="w-full min-h-[400px]"></div>
          {!scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                <p>Iniciando cámara...</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm">
          Apunta la cámara al código QR de la entrada
        </p>

        <button
          onClick={() => {
            if (scannerRef.current) {
              scannerRef.current.stop().then(() => {
                onClose()
              })
            } else {
              onClose()
            }
          }}
          className="mt-4 w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
