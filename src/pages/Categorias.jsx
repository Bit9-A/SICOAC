import { useState, useEffect } from 'react'
import { Tags, Plus, Pencil, Trash2, X, Check, ListTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')

  const [subcategorias, setSubcategorias] = useState([])
  const [showNewSub, setShowNewSub] = useState(false)
  const [newSubNombre, setNewSubNombre] = useState('')
  const [newSubCategoriaId, setNewSubCategoriaId] = useState('')
  const [editSubId, setEditSubId] = useState(null)
  const [editSubNombre, setEditSubNombre] = useState('')
  const [editSubCategoriaId, setEditSubCategoriaId] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    await Promise.all([loadCategorias(), loadSubcategorias()])
  }

  async function loadCategorias() {
    const { data } = await supabase.from('categoria').select('*').order('nombre')
    setCategorias(data || [])
  }

  async function loadSubcategorias() {
    const { data } = await supabase
      .from('subcategoria')
      .select('*, categoria:categoria_id(nombre)')
      .order('nombre')
    setSubcategorias(data || [])
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('categoria').insert({ nombre: normalizeText(newNombre) })
    if (error) return toast.error(error.message)
    toast.success('Categoría creada')
    setShowNew(false); setNewNombre('')
    loadAll()
  }

  async function handleSave(id) {
    if (!editNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('categoria').update({ nombre: normalizeText(editNombre) }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Categoría actualizada')
    setEditId(null)
    loadAll()
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('categoria').delete().eq('id', id)
    if (error) {
      if (error.code === '23503') return toast.error(`No se puede eliminar "${nombre}" porque tiene productos o subcategorías asociadas`)
      return toast.error(error.message)
    }
    toast.success('Categoría eliminada')
    loadAll()
  }

  async function handleCreateSub(e) {
    e.preventDefault()
    if (!newSubNombre.trim()) return toast.warning('El nombre es obligatorio')
    if (!newSubCategoriaId) return toast.warning('Selecciona una categoría')
    const { error } = await supabase.from('subcategoria').insert({
      nombre: normalizeText(newSubNombre),
      categoria_id: newSubCategoriaId,
    })
    if (error) return toast.error(error.message)
    toast.success('Subcategoría creada')
    setShowNewSub(false)
    setNewSubNombre('')
    setNewSubCategoriaId('')
    loadSubcategorias()
  }

  async function handleSaveSub(id) {
    if (!editSubNombre.trim()) return toast.warning('El nombre es obligatorio')
    if (!editSubCategoriaId) return toast.warning('Selecciona una categoría')
    const { error } = await supabase.from('subcategoria').update({
      nombre: normalizeText(editSubNombre),
      categoria_id: editSubCategoriaId,
    }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Subcategoría actualizada')
    setEditSubId(null)
    loadSubcategorias()
  }

  async function handleDeleteSub(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('subcategoria').delete().eq('id', id)
    if (error) {
      if (error.code === '23503') return toast.error(`No se puede eliminar "${nombre}" porque tiene productos asociados`)
      return toast.error(error.message)
    }
    toast.success('Subcategoría eliminada')
    loadSubcategorias()
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
              <Input value={newNombre} onChange={e => setNewNombre(e.target.value.toUpperCase())} placeholder="Ej: Lácteos, Carnes..." autoFocus />
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

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Subcategorías</h2>
            <p className="text-sm text-muted-foreground mt-1">Clasificación detallada de productos</p>
          </div>
          <Button onClick={() => setShowNewSub(!showNewSub)} className="gap-2"><Plus className="w-4 h-4" /> Nueva Subcategoría</Button>
        </div>

        {showNewSub && (
          <Card className="p-5 space-y-4 mt-4">
            <h3 className="font-semibold">Nueva Subcategoría</h3>
            <form onSubmit={handleCreateSub} className="space-y-3">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <SearchSelect
                  options={categorias.map(c => ({ value: String(c.id), label: c.nombre }))}
                  value={newSubCategoriaId}
                  onChange={setNewSubCategoriaId}
                  placeholder="Seleccionar categoría..."
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={newSubNombre}
                  onChange={e => setNewSubNombre(e.target.value.toUpperCase())}
                  placeholder="Ej: LÁCTEOS, CEREALES..."
                  maxLength={200}
                  className="uppercase"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Crear</Button>
                <Button type="button" variant="outline" onClick={() => { setShowNewSub(false); setNewSubNombre(''); setNewSubCategoriaId('') }}>Cancelar</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {subcategorias.map(sc => (
            <Card key={sc.id} className="p-4">
              {editSubId === sc.id ? (
                <div className="space-y-3">
                  <SearchSelect
                    options={categorias.map(c => ({ value: String(c.id), label: c.nombre }))}
                    value={String(editSubCategoriaId)}
                    onChange={setEditSubCategoriaId}
                    placeholder="Categoría..."
                  />
                  <Input
                    value={editSubNombre}
                    onChange={e => setEditSubNombre(e.target.value.toUpperCase())}
                    maxLength={200}
                    className="uppercase"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveSub(sc.id)} className="gap-1"><Check className="w-3.5 h-3.5" /> Guardar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditSubId(null)} className="gap-1"><X className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ListTree className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{sc.nombre}</p>
                    <p className="text-xs text-muted-foreground truncate">{sc.categoria?.nombre}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={() => { setEditSubId(sc.id); setEditSubNombre(sc.nombre); setEditSubCategoriaId(String(sc.categoria_id)) }}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive shrink-0" onClick={() => handleDeleteSub(sc.id, sc.nombre)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              )}
            </Card>
          ))}
          {subcategorias.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No hay subcategorías</p>}
        </div>
      </div>
    </div>
  )
}
