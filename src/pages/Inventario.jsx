import { useState, useEffect } from 'react'
import { Package, Search, AlertTriangle, Settings2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function InventarioPage() {
  const { institucionId, isSuperAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [umbral, setUmbral] = useState(() => {
    return Number(localStorage.getItem('inv_umbral') || 5)
  })
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    loadInventario()
  }, [])

  async function loadInventario() {
    setLoading(true)
    try {
      let query = supabase
        .from('inventario')
        .select('*, producto:producto_id (id, nombre, presentacion, categoria_id), institucion:institucion_id (id, nombre)')
        .gte('cantidad', 0)

      if (!isSuperAdmin && institucionId) {
        query = query.eq('institucion_id', institucionId)
      }

      const { data } = await query
      setItems(data || [])
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const filtered = items.filter(i => {
    if (!filter) return true
    const q = normalizeText(filter)
    return (i.producto?.nombre || '').includes(q) || (i.institucion?.nombre || '').includes(q)
  })

  function handleUmbralChange(val) {
    const n = Number(val)
    if (n >= 0 && !isNaN(n)) {
      setUmbral(n)
      localStorage.setItem('inv_umbral', String(n))
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-muted-foreground mt-1">Stock actual por producto e institución</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowConfig(!showConfig)}>
          <Settings2 className="w-4 h-4" /> Alerta
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar producto o institución..." value={filter} onChange={e => setFilter(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Config umbral */}
      {showConfig && (
        <Card className="p-4 flex items-center gap-3">
          <Label className="shrink-0 text-sm">Alertar cuando stock ≤</Label>
          <Input type="number" min="0" value={umbral} onChange={e => handleUmbralChange(e.target.value)} className="w-20 h-9 text-center" />
          <span className="text-sm text-muted-foreground">unidades</span>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Cargando inventario...</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, idx) => {
            const cantidad = Number(item.cantidad)
            return (
              <Card key={`${item.producto_id}-${item.institucion_id}-${idx}`} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.producto?.nombre || 'Producto'}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.institucion?.nombre || '—'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold tabular-nums">{cantidad.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{item.producto?.presentacion || 'unidades'}</p>
                </div>
                {cantidad <= umbral && (
                  <Badge variant="warning" className="gap-1 shrink-0">
                    <AlertTriangle className="w-3 h-3" />
                    Stock bajo
                  </Badge>
                )}
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No hay productos en inventario</p>
          )}
        </div>
      )}
    </div>
  )
}
