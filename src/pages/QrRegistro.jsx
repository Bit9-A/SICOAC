import { useRef, useEffect, useState } from 'react'
import { QrCode, Share2, Copy, Check, Building2, Smartphone, Download, HeartHandshake, UserPlus, Shield, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

const TIPOS = [
  {
    id: 'operador',
    icon: UserPlus,
    title: 'Operadores',
    subtitle: 'Acceso completo al sistema',
    description: 'La persona escanea, completa sus datos y puede iniciar sesión para registrar movimientos, gestionar inventario y administrar el centro.',
    badge: 'Con acceso al sistema',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    id: 'voluntario',
    icon: HeartHandshake,
    title: 'Voluntarios',
    subtitle: 'Solo censo, sin acceso',
    description: 'La persona escanea y queda censada con sus datos personales. No puede iniciar sesión ni acceder al sistema.',
    badge: 'Sin acceso al sistema',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
]

export default function QrRegistroPage() {
  const { profile, institucionId } = useAuth()
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [qrReady, setQrReady] = useState(false)
  const [tipo, setTipo] = useState('operador')

  const instNombre = profile?.institucion?.nombre || 'Mi institución'
  const hasInst = Boolean(institucionId)
  const registerUrl = !hasInst ? null : (tipo === 'operador'
    ? `${window.location.origin}/?inst=${institucionId}&register`
    : `${window.location.origin}/voluntario?inst=${institucionId}`)

  const current = TIPOS.find(t => t.id === tipo) || TIPOS[0]

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

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: `${current.title} - ${instNombre}`, text: current.description, url: registerUrl })
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

  async function handleDownload() {
    setDownloading(true)
    try {
      const { default: QRCode } = await import('qrcode')
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, registerUrl, {
        width: 1200, margin: 4,
        color: { dark: '#1a1a2e', light: '#ffffff' },
      })
      const link = document.createElement('a')
      link.download = `qr-${tipo}-${institucionId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('QR descargado — listo para imprimir')
    } catch {
      toast.error('Error al generar la imagen')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Códigos QR</h1>
        <p className="text-sm text-muted-foreground mt-1">Generá códigos para registrar personas en tu centro</p>
      </div>

      {/* Card-style type selector */}
      <div className="grid grid-cols-2 gap-3">
        {TIPOS.map(t => {
          const Icon = t.icon
          const active = tipo === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipo(t.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                active
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                  : 'border-border/60 bg-card hover:border-border hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-sm leading-tight">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.subtitle}</p>
              <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full ${t.badgeClass}`}>
                {t.badge}
              </span>
            </button>
          )
        })}
      </div>

      {/* QR Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{instNombre}</p>
            <p className="text-xs text-muted-foreground">{current.title} &middot; {current.subtitle}</p>
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

        <p className="text-sm text-center text-muted-foreground leading-relaxed">{current.description}</p>

        <div className="space-y-2">
          <Button className="w-full gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> Compartir
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar enlace'}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleDownload} disabled={downloading}>
              <Download className="w-4 h-4" />
              {downloading ? 'Generando...' : 'Descargar QR'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Comparison table */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Smartphone className="w-4 h-4" /> ¿Cuál usar?</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-1.5 font-medium text-blue-800 dark:text-blue-300">
              <Shield className="w-4 h-4" /> Operador
            </div>
            <ul className="text-xs text-blue-700/80 dark:text-blue-300/80 space-y-1">
              <li className="flex items-start gap-1.5"><span className="mt-0.5">✅</span> Inicia sesión en el sistema</li>
              <li className="flex items-start gap-1.5"><span className="mt-0.5">✅</span> Registra movimientos y stock</li>
              <li className="flex items-start gap-1.5"><span className="mt-0.5">✅</span> Accede a reportes</li>
            </ul>
          </div>
          <div className="space-y-1.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-300">
              <Eye className="w-4 h-4" /> Voluntario
            </div>
            <ul className="text-xs text-amber-700/80 dark:text-amber-300/80 space-y-1">
              <li className="flex items-start gap-1.5"><span className="mt-0.5">🔒</span> Solo censo de datos</li>
              <li className="flex items-start gap-1.5"><span className="mt-0.5">🚫</span> Sin acceso al sistema</li>
              <li className="flex items-start gap-1.5"><span className="mt-0.5">📋</span> Solo registro civil</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
