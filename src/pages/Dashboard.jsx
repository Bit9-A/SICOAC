import { useState, useEffect } from 'react'
import { Package, ArrowDownCircle, ArrowUpCircle, Building2, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function Dashboard() {
  const { institucionId, isSuperAdmin } = useAuth()
  const [stats, setStats] = useState({ productos: 0, entradas: 0, salidas: 0, instituciones: 0 })

  useEffect(() => {
    async function load() {
      try {
        let query = supabase.from('movimiento').select('*', { count: 'exact', head: true })
        if (!isSuperAdmin && institucionId) {
          query = query.or(`institucion_origen_id.eq.${institucionId},institucion_destino_id.eq.${institucionId}`)
        }
        const { count: totalMov } = await query

        const { count: entradas } = await supabase
          .from('movimiento')
          .select('*', { count: 'exact', head: true })
          .eq('tipo_movimiento_id', 1)
          .or(`institucion_destino_id.eq.${institucionId}`)

        const { count: productos } = await supabase
          .from('producto')
          .select('*', { count: 'exact', head: true })

        const { count: instituciones } = await supabase
          .from('institucion')
          .select('*', { count: 'exact', head: true })

        setStats({
          productos: productos || 0,
          entradas: entradas || 0,
          salidas: (totalMov || 0) - (entradas || 0),
          instituciones: isSuperAdmin ? (instituciones || 0) : 1,
        })
      } catch (err) {
        console.error('[Dashboard] error:', err)
      }
    }
    load()
  }, [institucionId, isSuperAdmin])

  const cards = [
    { label: 'Productos', value: stats.productos, icon: Package, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Entradas', value: stats.entradas, icon: ArrowDownCircle, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Salidas', value: stats.salidas, icon: ArrowUpCircle, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Instituciones', value: stats.instituciones, icon: Building2, color: 'text-purple-400 bg-purple-500/10' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen del sistema</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.label} className="p-4 md:p-5 space-y-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
