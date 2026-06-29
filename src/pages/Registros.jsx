import { useState, useEffect } from 'react'
import { ClipboardList, Search, ArrowDownCircle, ArrowUpCircle, Filter } from 'lucide-react'
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
  const [filterInst, setFilterInst] = useState('')
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
      const prodName = (m.producto?.nombre || '')
      if (!prodName.includes(q)) return false
    }
    return true
  })

  function TipoBadge({ tipo }) {
    if (tipo === 'Entrada') return <Badge variant="success" className="gap-1"><ArrowDownCircle className="w-3 h-3" /> Entrada</Badge>
    return <Badge variant="warning" className="gap-1"><ArrowUpCircle className="w-3 h-3" /> Salida</Badge>
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registros</h1>
        <p className="text-sm text-muted-foreground mt-1">Movimientos de productos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Buscar producto</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Producto..." className="pl-9 w-48" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className="h-10 rounded-lg border border-input bg-secondary px-3 text-sm min-w-[120px]">
            <option value="">Todos</option>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={loadMovimientos} className="gap-1.5">
          <Filter className="w-4 h-4" /> Refrescar
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Cargando...</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.producto?.nombre || 'Producto'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString('es-VE', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold tabular-nums">{Number(m.cantidad).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{m.unidad || 'unidades'}</p>
                </div>
                <TipoBadge tipo={m.tipo?.nombre} />
                <div className="text-xs text-muted-foreground hidden lg:block max-w-[200px] truncate">
                  {m.institucion_origen?.nombre || m.institucion_destino?.nombre || '—'}
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
