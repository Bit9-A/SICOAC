import { useState, useEffect } from 'react'
import { Tags, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('categoria').select('*').order('nombre')
    setCategorias(data || [])
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('categoria').insert({ nombre: normalizeText(newNombre) })
    if (error) return toast.error(error.message)
    toast.success('Categoría creada')
    setShowNew(false); setNewNombre('')
    load()
  }

  async function handleSave(id) {
    if (!editNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('categoria').update({ nombre: normalizeText(editNombre) }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Categoría actualizada')
    setEditId(null)
    load()
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('categoria').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Categoría eliminada')
    load()
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-muted-foreground mt-1">Clasificación de productos</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="w-4 h-4" /> Nueva Categoría</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Nueva Categoría</h3>
          <form onSubmit={handleCreate} className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label>Nombre *</Label>
              <Input value={newNombre} onChange={e => setNewNombre(e.target.value)} placeholder="Ej: Lácteos, Carnes..." autoFocus />
            </div>
            <Button type="submit">Crear</Button>
            <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorias.map(c => (
          <Card key={c.id} className="p-4">
            {editId === c.id ? (
              <div className="space-y-3">
                <Input value={editNombre} onChange={e => setEditNombre(e.target.value)} autoFocus />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(c.id)} className="gap-1"><Check className="w-3.5 h-3.5" /> Guardar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="gap-1"><X className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Tags className="w-4.5 h-4.5 text-primary" />
                </div>
                <p className="flex-1 font-medium">{c.nombre}</p>
                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { setEditId(c.id); setEditNombre(c.nombre) }}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => handleDelete(c.id, c.nombre)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            )}
          </Card>
        ))}
        {categorias.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No hay categorías</p>}
      </div>
    </div>
  )
}
