import { useState, useEffect } from 'react'
import { ClipboardList, Search, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Filter, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { getInstituciones } from '@/lib/api'
import { normalizeText } from '@/lib/utils'

export default function RegistrosPage() {
  const { institucionId, isSuperAdmin } = useAuth()
  const [movimientos, setMovimientos] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadMovimientos(), getInstituciones().then(setInstituciones)])
  }, [])

  async function loadMovimientos() {
    setLoading(true)
    let q = supabase
      .from('movimiento')
      .select('*, producto:producto_id (nombre), institucion_origen:institucion_origen_id (nombre), institucion_destino:institucion_destino_id (nombre), tipo:tipo_movimiento_id (nombre)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!isSuperAdmin && institucionId) {
      q = q.or(`institucion_origen_id.eq.${institucionId},institucion_destino_id.eq.${institucionId}`)
    }

    const { data } = await q
    setMovimientos(data || [])
    setLoading(false)
  }

  const filtered = movimientos.filter(m => {
    if (filterTipo && m.tipo?.nombre !== filterTipo) return false
    if (search) {
      const q = normalizeText(search)
      if (!(m.producto?.nombre || '').includes(q)) return false
    }
    return true
  })

  function EstadoBadge({ m }) {
    if (m.tipo?.nombre !== 'Transferencia') return null
    
    if (m.estado === 'recibido' || m.estado === 'completado') {
      return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Recibido</Badge>
    }
    if (m.estado === 'cancelado') {
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Cancelado</Badge>
    }
    return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Enviado</Badge>
  }

  function TipoBadge({ tipo }) {
    if (tipo === 'Entrada') return <Badge variant="success" className="gap-1"><ArrowDownCircle className="w-3 h-3" /> Entrada</Badge>
    if (tipo === 'Transferencia') return <Badge variant="default" className="gap-1"><ArrowLeftRight className="w-3 h-3" /> Transferencia</Badge>
    return <Badge variant="warning" className="gap-1"><ArrowUpCircle className="w-3 h-3" /> Salida</Badge>
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registros</h1>
        <p className="text-sm text-muted-foreground mt-1">Movimientos e historial de auditoría de productos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Buscar producto</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value.toUpperCase())} placeholder="Producto..." className="pl-9 w-48" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className="h-10 rounded-lg border border-input bg-secondary px-3 text-sm min-w-[120px]">
            <option value="">Todos</option>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={loadMovimientos} className="gap-1.5">
          <Filter className="w-4 h-4" /> Refrescar
        </Button>
      </div>

      {/* Resumen de estados en Transferencias */}
      {!filterTipo && (
        <div className="flex flex-wrap gap-2">
          {['Enviado', 'Recibido', 'Cancelado'].filter(s => {
            const dbStatus = s === 'Enviado' ? 'enviado' : s === 'Recibido' ? 'recibido' : 'cancelado';
            return movimientos.some(m => m.tipo?.nombre === 'Transferencia' && (m.estado === dbStatus || (dbStatus === 'recibido' && m.estado === 'completado')))
          }).map(s => {
            const dbStatus = s === 'Enviado' ? 'enviado' : s === 'Recibido' ? 'recibido' : 'cancelado';
            const count = movimientos.filter(m => 
              m.tipo?.nombre === 'Transferencia' && 
              (m.estado === dbStatus || (dbStatus === 'recibido' && m.estado === 'completado'))
            ).length;

            return (
              <Badge 
                key={s} 
                variant={s === 'Enviado' ? 'warning' : s === 'Recibido' ? 'success' : 'destructive'} 
                className="gap-1"
              >
                {s === 'Enviado' && <Clock className="w-3 h-3" />}
                {s === 'Recibido' && <CheckCircle className="w-3 h-3" />}
                {s === 'Cancelado' && <XCircle className="w-3 h-3" />}
                {s} ({count})
              </Badge>
            )
          })}
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Cargando movimientos...</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${m.estado === 'cancelado' ? 'line-through text-muted-foreground decoration-red-400' : ''}`}>
                    {m.producto?.nombre || 'Producto'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString('es-VE', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold tabular-nums ${m.estado === 'cancelado' ? 'text-muted-foreground line-through decoration-red-400' : ''}`}>
                    {Number(m.cantidad).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.unidad || 'unidades'}</p>
                </div>
                <TipoBadge tipo={m.tipo?.nombre} />
                <EstadoBadge m={m} />
                <div className="text-xs text-muted-foreground hidden lg:block max-w-[240px] truncate">
                  {m.tipo?.nombre === 'Transferencia' ? (
                    <span>{m.institucion_origen?.nombre || '?'} → {m.institucion_destino?.nombre || '?'}</span>
                  ) : (
                    m.institucion_origen?.nombre || m.institucion_destino?.nombre || '—'
                  )}
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No hay movimientos registrados</p>}
        </div>
      )}
    </div>
  )
}