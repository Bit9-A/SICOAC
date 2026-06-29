import { useRef, useEffect, useState } from 'react'
import { QrCode, Share2, Copy, Check, Building2, Smartphone, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function QrRegistroPage() {
  const { profile, institucionId } = useAuth()
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [qrReady, setQrReady] = useState(false)

  const instNombre = profile?.institucion?.nombre || 'Mi institución'
  const registerUrl = `${window.location.origin}/?inst=${institucionId}&register`

  useEffect(() => {
    if (canvasRef.current && registerUrl) {
      import('qrcode').then(mod => {
        mod.default.toCanvas(canvasRef.current, registerUrl, {
          width: 280,
          margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
        }, () => setQrReady(true))
      })
    }
  }, [registerUrl])

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: `Registro - ${instNombre}`, text: `Registrate como operador para ${instNombre}`, url: registerUrl })
    } else {
      await navigator.clipboard.writeText(registerUrl)
      toast.success('Enlace copiado')
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(registerUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Enlace copiado al portapapeles')
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-registro-${institucionId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registro por QR</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compartí este código para que voluntarios se registren como operadores de tu centro
        </p>
      </div>

      <Card className="p-6 space-y-4">
        {/* Institution info */}
        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{instNombre}</p>
            <p className="text-xs text-muted-foreground">Centro de Acopio</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <canvas ref={canvasRef} className="w-56 h-56" />
            {!qrReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-card rounded">
                <QrCode className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Registro rápido para voluntarios</p>
          <p className="text-xs text-muted-foreground">
            Al escanear este código, el voluntario puede registrarse como operador de{' '}
            <strong>{instNombre}</strong> sin necesidad de que un admin lo cree manualmente.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> Compartir enlace
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar enlace'}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Descargar QR
            </Button>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Smartphone className="w-4 h-4" /> ¿Cómo funciona?
        </h3>
        <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
          <li>Compartí el código QR con los voluntarios (WhatsApp, impreso, etc.)</li>
          <li>El voluntario escanea el código con su teléfono</li>
          <li>Se abre el formulario de registro con tu centro preseleccionado</li>
          <li>Completa sus datos y queda registrado como <strong>Operador</strong></li>
          <li>Ya puede registrar movimientos en tu centro de acopio</li>
        </ol>
      </Card>
    </div>
  )
}
