import { useRef, useEffect, useState } from 'react'
import { QrCode, Share2, Copy, Check, Building2, Smartphone, Download, HeartHandshake, UserPlus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function QrRegistroPage() {
  const { profile, institucionId } = useAuth()
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [qrReady, setQrReady] = useState(false)
  const [tipo, setTipo] = useState('operador') // operador | voluntario

  const instNombre = profile?.institucion?.nombre || 'Mi institución'
  const hasInst = Boolean(institucionId)
  const registerUrl = !hasInst ? null : (tipo === 'operador'
    ? `${window.location.origin}/?inst=${institucionId}&register`
    : `${window.location.origin}/voluntario?inst=${institucionId}`)

  useEffect(() => {
    setQrReady(false)
    if (canvasRef.current && registerUrl) {
      import('qrcode').then(mod => {
        mod.default.toCanvas(canvasRef.current, registerUrl, {
          width: 260, margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
        }, () => setQrReady(true))
      })
    }
  }, [registerUrl])

  if (!hasInst) {
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Códigos QR</h1>
        <Card className="p-6 text-center space-y-2">
          <p className="text-muted-foreground">Tu usuario no tiene una institución asignada.</p>
          <p className="text-sm text-muted-foreground">Para generar códigos QR, un super_admin debe asignarte una institución.</p>
        </Card>
      </div>
    )
  }

  const descripcion = tipo === 'operador'
    ? 'Al escanear este código, el voluntario puede registrarse como operador del sistema para registrar movimientos en tu centro.'
    : 'Al escanear este código, la persona se registra como voluntario (sin acceso al sistema). Sus datos quedan censados en tu centro.'

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: `${tipo === 'operador' ? 'Registro operador' : 'Registro voluntario'} - ${instNombre}`, text: descripcion, url: registerUrl })
    } else {
      await navigator.clipboard.writeText(registerUrl)
      toast.success('Enlace copiado')
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(registerUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Enlace copiado')
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${tipo}-${institucionId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Códigos QR</h1>
        <p className="text-sm text-muted-foreground mt-1">Generá códigos para registrar operadores y voluntarios en tu centro</p>
      </div>

      {/* Tipo selector */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant={tipo === 'operador' ? 'default' : 'outline'} onClick={() => setTipo('operador')} className="gap-2">
          <UserPlus className="w-4 h-4" /> Operadores
        </Button>
        <Button variant={tipo === 'voluntario' ? 'default' : 'outline'} onClick={() => setTipo('voluntario')} className="gap-2">
          <HeartHandshake className="w-4 h-4" /> Voluntarios
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{instNombre}</p>
            <p className="text-xs text-muted-foreground">
              {tipo === 'operador' ? 'Registro de operadores (con acceso al sistema)' : 'Registro de voluntarios (solo censo)'}
            </p>
          </div>
        </div>

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

        <p className="text-sm text-center text-muted-foreground">{descripcion}</p>

        <div className="space-y-2">
          <Button className="w-full gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> Compartir
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

      <Card className="p-4 space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Smartphone className="w-4 h-4" /> Diferencia</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">Operador:</strong> escanea → completa datos → puede iniciar sesión y registrar movimientos.</p>
          <p><strong className="text-foreground">Voluntario:</strong> escanea → completa datos → queda censado (sin acceso al sistema).</p>
        </div>
      </Card>
    </div>
  )
}
