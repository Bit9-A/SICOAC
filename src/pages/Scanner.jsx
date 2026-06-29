import { useEffect, useRef, useState } from 'react'
import { X, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { startCamera, stopCamera, startDetection, isScannerAvailable } from '@/lib/scanner'

export default function Scanner({ onDetected, onClose, onManual }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [status, setStatus] = useState('initializing')
  const [error, setError] = useState(null)
  const [detectedCode, setDetectedCode] = useState(null)

  // Focus management: Trap focus & Restore focus on unmount
  useEffect(() => {
    const previousActiveElement = document.activeElement
    if (containerRef.current) {
      containerRef.current.focus()
    }
    return () => {
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
  }, [])

  // Keyboard navigation: Close scanner on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!isScannerAvailable()) {
        setError('Escáner no disponible en este navegador. Usá ingreso manual.')
        setStatus('error')
        return
      }

      try {
        setStatus('requesting')
        await startCamera(videoRef.current)
        if (cancelled) { stopCamera(); return }

        setStatus('scanning')
        startDetection(videoRef.current, (code) => {
          if (cancelled) return
          setDetectedCode(code)
          if (navigator.vibrate) navigator.vibrate(100)

          // Esperar un momento para mostrar feedback, luego enviar
          setTimeout(() => {
            if (!cancelled) onDetected(code)
          }, 500)
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setStatus('error')
        }
      }
    }

    init()
    return () => { cancelled = true; stopCamera() }
  }, [onDetected])

  function handleClose() {
    stopCamera()
    onClose()
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-status-text"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black focus:outline-none"
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/80 z-10 shrink-0">
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white/70 hover:text-white" aria-label="Cerrar escáner">
          <X className="w-5 h-5" aria-hidden="true" />
        </Button>
        <span id="scanner-status-text" className="text-sm text-white/60">
          {status === 'scanning' && 'Apunta al código de barras'}
          {status === 'requesting' && 'Solicitando cámara...'}
          {status === 'initializing' && 'Iniciando...'}
        </span>
      </div>

      {/* Camera viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Scan overlay */}
        {status === 'scanning' && !detectedCode && (
          <>
            <div className="absolute inset-0 scan-frame pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[70%] max-w-[280px] aspect-[1.4]">
                {/* Corner brackets */}
                <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr" />
                <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl" />
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br" />
                {/* Scan line */}
                <div className="absolute left-2 right-2 h-[2px] bg-primary shadow-[0_0_8px_hsl(348_73%_58%)] animate-scan-line" />
              </div>
            </div>
            <p className="absolute bottom-24 left-0 right-0 text-center text-xs text-white/50 pointer-events-none">
              El código se detecta automáticamente
            </p>
          </>
        )}

        {/* Detected banner */}
        {detectedCode && (
          <div
            role="status"
            aria-live="polite"
            className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md px-6 py-5 text-center animate-in slide-in-from-bottom"
          >
            <p className="text-lg md:text-xl font-bold tracking-wider text-emerald-400">
              Código detectado: {detectedCode}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-6 text-center">
            <p className="text-destructive text-sm mb-4">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-black/80 shrink-0">
        <Button variant="secondary" className="w-full gap-2" onClick={onManual}>
          <Keyboard className="w-4 h-4" aria-hidden="true" />
          {error ? 'Ingresar manualmente' : 'Ingresar código manualmente'}
        </Button>
      </div>
    </div>
  )
}
