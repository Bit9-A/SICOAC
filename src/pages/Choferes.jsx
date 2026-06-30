import { useState, useEffect, useCallback } from 'react'
import { Contact, Search, Plus, Pencil, X, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Pagination from '@/components/ui/pagination'
import { supabase } from '@/lib/supabase'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function ChoferesPage() {
  const [choferes, setChoferes] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editApellido, setEditApellido] = useState('')
  const [editTelefono, setEditTelefono] = useState('')
  
  const [showNew, setShowNew] = useState(false)
  const [newCedula, setNewCedula] = useState('')
  const [newNombre, setNewNombre] = useState('')
  const [newApellido, setNewApellido] = useState('')
  const [newTelefono, setNewTelefono] = useState('')

  const load = useCallback(async () => {
    let q = supabase
      .from('chofer')
      .select('*', { count: 'exact' })

    if (search) {
      q = q.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,cedula.ilike.%${search}%`)
    }

    q = q.order('nombre')

    const rangeStart = (page - 1) * pageSize
    const { data, count, error } = await q.range(rangeStart, rangeStart + pageSize - 1)
    if (error) return toast.error('Error al cargar: ' + error.message)
    setChoferes(data || [])
    setTotal(count || 0)
  }, [page, search])

  useEffect(() => { load() }, [load])

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newCedula.trim() || !newNombre.trim() || !newApellido.trim() || !newTelefono.trim()) {
      return toast.warning('Completa todos los campos obligatorios')
    }

    const { error } = await supabase.from('chofer').insert({
      cedula: newCedula.trim(),
      nombre: normalizeText(newNombre),
      apellido: normalizeText(newApellido),
      telefono: newTelefono.trim()
    })

    if (error) {
      if (error.code === '23505') return toast.error('Esta cédula ya se encuentra registrada')
      return toast.error(error.message)
    }

    toast.success('¡Chofer registrado exitosamente!')
    setShowNew(false)
    setNewCedula(''); setNewNombre(''); setNewApellido(''); setNewTelefono('')
    load()
  }

  async function handleSave(id) {
    if (!editNombre.trim() || !editApellido.trim() || !editTelefono.trim()) {
      return toast.warning('Nombre, apellido y teléfono son obligatorios')
    }

    const { error, count } = await supabase
      .from('chofer')
      .update({
        nombre: normalizeText(editNombre),
        apellido: normalizeText(editApellido),
        telefono: editTelefono.trim()
      }, { count: 'exact' })
      .eq('id', id)

    if (error) return toast.error('Error de Supabase: ' + error.message)
    
    if (count === 0) {
      return toast.error('No se modificó ninguna fila. Verifica si el ID es correcto o si hay políticas RLS activadas.')
    }
    
    toast.success('¡Datos actualizados con éxito!')
    setEditId(null)
    load()
  }

  async function handleToggleActive(id, activo, nombre, apellido) {
    const nuevoEstado = !activo

    const { error, count } = await supabase
      .from('chofer')
      .update({ activo: nuevoEstado }, { count: 'exact' })
      .eq('id', id)

    if (error) return toast.error('Error al cambiar estado: ' + error.message)
    
    if (count === 0) {
      return toast.error('Error: No se pudo actualizar el estado. ¿Existe la columna "activo" en la tabla "chofer"?')
    }
    
    if (!nuevoEstado) {
      toast.error('Chofer desactivado', {
        description: `${nombre} ${apellido} ha sido removido temporalmente.`
      })
    } else {
      toast.success('Chofer reactivado', {
        description: `${nombre} ${apellido} está listo nuevamente.`
      })
    }
    load()
  }

  function startEdit(c) {
    setEditId(c.id)
    setEditNombre(c.nombre)
    setEditApellido(c.apellido)
    setEditTelefono(c.telefono)
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Choferes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión y control de transportistas de ayuda humanitaria</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Chofer
        </Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Registrar Nuevo Chofer</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Cédula *</Label>
              <Input 
                placeholder="Ej: V-12345678" 
                value={newCedula} 
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '')
                  setNewCedula(value)
                }}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input placeholder="Ej: Juan" value={newNombre} onChange={e => setNewNombre(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-2">
              <Label>Apellido *</Label>
              <Input placeholder="Ej: Pérez" value={newApellido} onChange={e => setNewApellido(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono *</Label>
              <Input 
                placeholder="Ej: 0414-1234567" 
                value={newTelefono} 
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9()+\-]/g, '')
                  setNewTelefono(value)
                }}
              />
            </div>
            <div className="md:col-span-4 flex gap-2">
              <Button type="submit">Registrar Chofer</Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input placeholder="Buscar por nombre, apellido o cédula..." value={search} onChange={e => handleSearchChange(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-2">
        {choferes.map(c => (
          <Card key={c.id} className={`p-4 transition-all ${!c.activo ? 'opacity-60 bg-secondary/30' : ''}`}>
            {editId === c.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Cédula (No modificable)</Label>
                    <Input value={c.cedula} disabled className="bg-muted cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input value={editNombre} onChange={e => setEditNombre(e.target.value.toUpperCase())} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Apellido</Label>
                    <Input value={editApellido} onChange={e => setEditApellido(e.target.value.toUpperCase())} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Teléfono</Label>
                    <Input 
                      value={editTelefono} 
                      onChange={e => {
                        const value = e.target.value.replace(/[^0-9()+\-]/g, '')
                        setEditTelefono(value)
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => handleSave(c.id)} className="gap-1">
                    <Check className="w-3.5 h-3.5" /> Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="gap-1">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.activo ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Contact className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{c.nombre.toUpperCase()} {c.apellido.toUpperCase()}</p>
                    <Badge variant={c.activo ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0.5">
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">Teléfono: {c.telefono}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0">
                  <Badge variant="outline" className="font-mono">{c.cedula}</Badge>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8" disabled={!c.activo} onClick={() => startEdit(c)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleToggleActive(c.id, c.activo, c.nombre, c.apellido)} title={c.activo ? 'Desactivar' : 'Activar'}>
                      {c.activo ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
        {choferes.length === 0 && <p className="text-center text-muted-foreground py-8">No se encontraron choferes</p>}
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />
    </div>
  )
}