import { useState, useEffect } from 'react'
import { ScanLine, ClipboardList, Clock, WifiOff, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getQueue, clearQueue } from '@/lib/storage'
import { sendBatch, isConfigured } from '@/lib/api'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { toast } from 'sonner'

export default function Home({ onStartScan, onStartManual, sessionCount }) {
  const online = useOnlineStatus()
  const [queue, setQueue] = useState(getQueue)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const onFocus = () => setQueue(getQueue())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const refreshQueue = () => setQueue(getQueue())

  async function handleSync() {
    if (!online) { toast.warning('Sin conexión — no se puede sincronizar'); return }
    if (!isConfigured()) { toast.warning('Configurá VITE_GS_URL en el .env'); return }

    setSyncing(true)
    const items = getQueue()
    const { ok, fail } = await sendBatch(items, (cur, total) => {
      toast.loading(`Sincronizando ${cur}/${total}...`, { id: 'sync' })
    })
    toast.dismiss('sync')

    if (fail.length === 0) {
      clearQueue()
      toast.success(`${ok.length} registro(s) sincronizados`)
    } else {
      fail.forEach(({ record, error }) => {
        toast.error(`Error: ${record.productName} — ${error}`)
      })
      if (ok.length > 0) {
        const okIds = new Set(ok.map(r => r._id))
        const remaining = items.filter(r => !okIds.has(r._id))
        remaining.forEach(r => clearQueue() || null) // reset
        remaining.forEach(r => {
          const q = getQueue()
          q.push(r)
          localStorage.setItem('acopio_queue', JSON.stringify(q))
        })
        toast.success(`${ok.length} sincronizados`)
      }
    }
    setSyncing(false)
    refreshQueue()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-md mx-auto space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <ScanLine className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Centros de Acopio
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
            Escaneá el código de barras para registrar lo que llega al centro
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button size="lg" className="w-full gap-3 text-base" onClick={onStartScan}>
            <ScanLine className="w-5 h-5" aria-hidden="true" />
            Escanear Código
          </Button>
          <Button variant="secondary" size="lg" className="w-full gap-3 text-base" onClick={onStartManual}>
            <ClipboardList className="w-5 h-5" aria-hidden="true" />
            Ingreso Manual
          </Button>
        </div>

        {/* Connection badge */}
        <div className="flex justify-center">
          <Badge variant={online ? 'success' : 'warning'} className="gap-1.5 px-3 py-1">
            <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-600' : 'bg-amber-600'}`} aria-hidden="true" />
            {online ? 'Conectado' : 'Sin conexión'}
          </Badge>
        </div>

        {/* Stats card */}
        <Card className="p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
              <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registrados en esta sesión</p>
              <p className="text-2xl font-bold tabular-nums">{sessionCount}</p>
            </div>
          </div>
        </Card>

        {/* Queue card */}
        {queue.length > 0 && (
          <Card className="p-4 md:p-5 border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 shrink-0">
                <WifiOff className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Pendientes de sincronizar</p>
                <p className="text-2xl font-bold tabular-nums">{queue.length}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={handleSync}
                disabled={syncing || !online}
              >
                <Upload className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
                {syncing ? '...' : 'Sincronizar'}
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}
