import { useState, useEffect } from 'react'
import { Car, Search, Plus, Pencil, X, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([])
  const [filter, setFilter] = useState('')
  const [editId, setEditId] = useState(null)
  
  const [editMarca, setEditMarca] = useState('')
  const [editModelo, setEditModelo] = useState('')
  const [editColor, setEditColor] = useState('')
  const [editCapacidad, setEditCapacidad] = useState('')

  const [showNew, setShowNew] = useState(false)
  const [newPlaca, setNewPlaca] = useState('')
  const [newMarca, setNewMarca] = useState('')
  const [newModelo, setNewModelo] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newCapacidad, setNewCapacidad] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data, error } = await supabase
      .from('vehiculo')
      .select('*')
      .order('modelo')
    
    if (error) return toast.error(error.message)
    setVehiculos(data || [])
  }

  const filtered = vehiculos.filter(v =>
    !filter || 
    (v.placa || '').toLowerCase().includes(filter.toLowerCase()) ||
    (v.modelo || '').toLowerCase().includes(filter.toLowerCase()) ||
    (v.marca || '').toLowerCase().includes(filter.toLowerCase())
  )

  async function handleCreate(e) {
    e.preventDefault()
    if (!newPlaca.trim() || !newModelo.trim()) {
      return toast.warning('Placa y Modelo son campos obligatorios')
    }

    const { error } = await supabase.from('vehiculo').insert({
      placa: newPlaca.trim().toUpperCase(),
      marca: normalizeText(newMarca),
      modelo: normalizeText(newModelo),
      color: normalizeText(newColor),
      capacidad_carga: normalizeText(newCapacidad)
    })

    if (error) {
      if (error.code === '23505') return toast.error('Esta placa ya se encuentra registrada')
      return toast.error(error.message)
    }

    toast.success('¡Vehículo registrado con éxito!', {
      description: `Unidad ${newModelo.toUpperCase()} incorporada a la flota.`
    })
    setShowNew(false)
    setNewPlaca(''); setNewMarca(''); setNewModelo(''); setNewColor(''); setNewCapacidad('')
    load()
  }

  async function handleSave(id) {
    if (!editModelo.trim()) {
      return toast.warning('El modelo del vehículo es obligatorio')
    }

    const targetId = isNaN(id) ? id : Number(id)

    const { error } = await supabase.from('vehiculo').update({
      marca: normalizeText(editMarca),
      modelo: normalizeText(editModelo),
      color: normalizeText(editColor),
      capacidad_carga: normalizeText(editCapacidad)
    }).eq('id', targetId)

    if (error) return toast.error(error.message)
    
    toast.success('¡Flota actualizada!', {
      description: `Los datos de la unidad han sido modificados.`
    })
    setEditId(null)
    load()
  }

  async function handleToggleActive(id, activo, modelo, placa) {
    const nuevoEstado = !activo
    const targetId = isNaN(id) ? id : Number(id)

    const { error } = await supabase
      .from('vehiculo')
      .update({ activo: nuevoEstado })
      .eq('id', targetId)

    if (error) return toast.error(error.message)
    
    if (!nuevoEstado) {
      toast.error('Vehículo inactivado', {
        description: `Unidad ${modelo} [${placa}] fuera de servicio.`
      })
    } else {
      toast.success('Vehículo reactivado', {
        description: `Unidad ${modelo} [${placa}] lista para despacho.`
      })
    }
    load()
  }

  function startEdit(v) {
    setEditId(v.id)
    setEditMarca(v.marca || '')
    setEditModelo(v.modelo || '')
    setEditColor(v.color || '')
    setEditCapacidad(v.capacidad_carga || '')
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Vehículos</h1>
          <p className="text-sm text-muted-foreground mt-1">Control de la flota para rutas de despacho de ayuda</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Vehículo
        </Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Registrar Nuevo Vehículo</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Placa *</Label>
              <Input 
                placeholder="Ej: ABC12D" 
                value={newPlaca} 
                onChange={e => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                  setNewPlaca(value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Marca</Label>
              <Input 
                placeholder="Ej: Ford" 
                value={newMarca} 
                onChange={e => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()
                  setNewMarca(value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo *</Label>
              <Input 
                placeholder="Ej: Triton" 
                value={newModelo} 
                onChange={e => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase()
                  setNewModelo(value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input 
                placeholder="Ej: Blanco" 
                value={newColor} 
                onChange={e => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()
                  setNewColor(value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidad</Label>
              <Input 
                placeholder="Ej: 3500" 
                value={newCapacidad} 
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  setNewCapacidad(value)
                }}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="md:col-span-5 flex gap-2">
              <Button type="submit">Registrar Vehículo</Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por placa, modelo o marca..." value={filter} onChange={e => setFilter(e.target.value.toUpperCase())} className="pl-9" />
      </div>

      <div className="space-y-2">
        {filtered.map(v => (
          <Card key={v.id} className={`p-4 transition-all ${!v.activo ? 'opacity-60 bg-secondary/30' : ''}`}>
            {editId === v.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Placa (No modificable)</Label>
                    <Input value={v.placa} disabled className="bg-muted cursor-not-allowed uppercase" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Marca</Label>
                    <Input 
                      value={editMarca} 
                      onChange={e => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                        setEditMarca(value)
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Modelo</Label>
                    <Input 
                      value={editModelo} 
                      onChange={e => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')
                        setEditModelo(value)
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <Input 
                      value={editColor} 
                      onChange={e => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                        setEditColor(value)
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Capacidad</Label>
                    <Input 
                      value={editCapacidad} 
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '')
                        setEditCapacidad(value)
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => handleSave(v.id)} className="gap-1">
                    <Check className="w-3.5 h-3.5" /> Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="gap-1">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${v.activo ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Car className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{v.marca ? `${v.marca} ` : ''}{v.modelo}</p>
                    <Badge variant={v.activo ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0.5">
                      {v.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Color: {v.color || '—'} | Capacidad: {v.capacidad_carga || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0">
                  <Badge variant="outline" className="font-mono uppercase">{v.placa}</Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8" disabled={!v.activo} onClick={() => startEdit(v)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleToggleActive(v.id, v.activo, v.modelo, v.placa)} title={v.activo ? 'Desactivar' : 'Activar'}>
                      {v.activo ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No se encontraron vehículos</p>}
      </div>
    </div>
  )
}