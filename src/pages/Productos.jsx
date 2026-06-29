import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { getCategorias, createCategoria } from '@/lib/api'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filter, setFilter] = useState('')
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editCatId, setEditCatId] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCatId, setNewCatId] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [prods, cats] = await Promise.all([
      supabase.from('producto').select('*, categoria:categoria_id (nombre)').order('nombre'),
      getCategorias()
    ])
    setProductos(prods.data || [])
    setCategorias(cats)
  }

  const filtered = productos.filter(p =>
    !filter || (p.nombre || '').toLowerCase().includes(filter.toLowerCase())
  )

  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim() || !newCatId) return toast.warning('Completá nombre y categoría')
    const { error } = await supabase.from('producto').insert({
      nombre: normalizeText(newNombre),
      descripcion: normalizeText(newDesc),
      categoria_id: newCatId
    })
    if (error) return toast.error(error.message)
    toast.success('Producto creado')
    setShowNew(false); setNewNombre(''); setNewDesc(''); setNewCatId('')
    load()
  }

  async function handleSave(id) {
    if (!editNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('producto').update({
      nombre: normalizeText(editNombre),
      descripcion: normalizeText(editDesc),
      categoria_id: editCatId
    }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Producto actualizado')
    setEditId(null)
    load()
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('producto').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Producto eliminado')
    load()
  }

  function startEdit(p) {
    setEditId(p.id)
    setEditNombre(p.nombre)
    setEditDesc(p.descripcion || '')
    setEditCatId(String(p.categoria_id))
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de productos del sistema</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="w-4 h-4" /> Nuevo Producto</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Nuevo Producto</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Nombre *</Label><Input value={newNombre} onChange={e => setNewNombre(e.target.value)} /></div>
            <div className="space-y-2"><Label>Descripción</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <select value={newCatId} onChange={e => setNewCatId(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm">
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <Button type="submit">Crear Producto</Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar producto..." value={filter} onChange={e => setFilter(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <Card key={p.id} className="p-4">
            {editId === p.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Descripción</Label>
                    <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Categoría</Label>
                    <select value={editCatId} onChange={e => setEditCatId(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm">
                      {categorias.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(p.id)} className="gap-1"><Check className="w-3.5 h-3.5" /> Guardar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="gap-1"><X className="w-3.5 h-3.5" /> Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.nombre}</p>
                  <p className="text-sm text-muted-foreground truncate">{p.descripcion || '—'}</p>
                </div>
                <Badge variant="secondary">{p.categoria?.nombre || '—'}</Badge>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleDelete(p.id, p.nombre)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No hay productos</p>}
      </div>
    </div>
  )
}
