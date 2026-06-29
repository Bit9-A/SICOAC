import { useState, useCallback, useEffect } from 'react'
import { Toaster } from 'sonner'
import { Package } from 'lucide-react'
import { getSessionCount } from '@/lib/storage'
import { isScannerAvailable } from '@/lib/scanner'
import { initializeDbData } from '@/lib/api'
import Home from '@/pages/Home'
import Scanner from '@/pages/Scanner'
import Form from '@/pages/Form'

/* Screen keys */
const SCREEN = { HOME: 'home', FORM: 'form' }

export default function App() {
  const [screen, setScreen] = useState(SCREEN.HOME)
  const [showScanner, setShowScanner] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [sessionCount, setSessionCount] = useState(getSessionCount)

  const refreshSessionCount = useCallback(() => {
    setSessionCount(getSessionCount())
  }, [])

  // Inicializar geografía y categorías en la base de datos Supabase
  useEffect(() => {
    initializeDbData()
  }, [])

  // Registrar service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {})
    }
  }, [])

  const goHome = useCallback(() => {
    setShowScanner(false)
    setScreen(SCREEN.HOME)
    setBarcode('')
    refreshSessionCount()
  }, [refreshSessionCount])

  const openScan = useCallback(() => {
    setShowScanner(true)
  }, [])

  const closeScan = useCallback(() => {
    setShowScanner(false)
  }, [])

  const onDetected = useCallback((code) => {
    setBarcode(code)
    setShowScanner(false)
    setScreen(SCREEN.FORM)
  }, [])

  const onManual = useCallback(() => {
    setShowScanner(false)
    setScreen(SCREEN.FORM)
  }, [])

  const onOpenManual = useCallback(() => {
    setScreen(SCREEN.FORM)
  }, [])

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* Header — solo visible en Home y Form */}
      {screen !== SCREEN.HOME && !showScanner && (
        <header className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0 bg-card/50 backdrop-blur-sm">
          <Package className="w-5 h-5 text-primary" aria-hidden="true" />
          <h1 className="font-semibold text-sm">Centros de Acopio</h1>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {screen === SCREEN.HOME && (
          <Home
            onStartScan={openScan}
            onStartManual={onOpenManual}
            sessionCount={sessionCount}
          />
        )}

        {screen === SCREEN.FORM && (
          <Form
            barcode={barcode}
            onBack={goHome}
            onScanAgain={openScan}
            onSaved={refreshSessionCount}
          />
        )}
      </main>

      {/* Scanner overlay */}
      {showScanner && (
        <Scanner
          onDetected={onDetected}
          onClose={closeScan}
          onManual={onManual}
        />
      )}

      {/* Sonner toaster */}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3000}
      />
    </div>
  )
}
