import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Tags, Plus, Pencil, Trash2, X, Check, ListTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

const PAGE_SIZE = 10

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [catPage, setCatPage] = useState(1)

  const [subcategorias, setSubcategorias] = useState([])
  const [showNewSub, setShowNewSub] = useState(false)
  const [newSubNombre, setNewSubNombre] = useState('')
  const [newSubCategoriaId, setNewSubCategoriaId] = useState('')
  const [editSubId, setEditSubId] = useState(null)
  const [editSubNombre, setEditSubNombre] = useState('')
  const [editSubCategoriaId, setEditSubCategoriaId] = useState('')
  const [subPage, setSubPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState(null)

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

  const catTotalPages = Math.max(1, Math.ceil(categorias.length / PAGE_SIZE))
  const subTotalPages = Math.max(1, Math.ceil(subcategorias.length / PAGE_SIZE))
  const catPaginated = categorias.slice((catPage - 1) * PAGE_SIZE, catPage * PAGE_SIZE)
  const subPaginated = subcategorias.slice((subPage - 1) * PAGE_SIZE, subPage * PAGE_SIZE)

  useEffect(() => { if (catPage > catTotalPages) setCatPage(catTotalPages) }, [categorias.length])
  useEffect(() => { if (subPage > subTotalPages) setSubPage(subTotalPages) }, [subcategorias.length])

  useEffect(() => {
    if (confirmDelete) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [confirmDelete])

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

  function handleDelete(id, nombre) {
    setConfirmDelete({ id, nombre, type: 'categoria' })
  }

  async function executeDelete() {
    if (!confirmDelete) return
    const { id, nombre, type } = confirmDelete
    setConfirmDelete(null)
    const table = type === 'categoria' ? 'categoria' : 'subcategoria'
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      if (error.code === '23503') {
        const msg = type === 'categoria'
          ? `No se puede eliminar "${nombre}" porque tiene productos o subcategorías asociadas`
          : `No se puede eliminar "${nombre}" porque tiene productos asociados`
        return toast.error(msg)
      }
      return toast.error(error.message)
    }
    toast.success(type === 'categoria' ? 'Categoría eliminada' : 'Subcategoría eliminada')
    type === 'categoria' ? loadAll() : loadSubcategorias()
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

  function handleDeleteSub(id, nombre) {
    setConfirmDelete({ id, nombre, type: 'subcategoria' })
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8">
      {/* ===== CATEGORÍAS ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Categorías</h1>
            <p className="text-sm text-muted-foreground mt-1">Clasificación de productos</p>
          </div>
          <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="w-4 h-4" /> Nueva Categoría</Button>
        </div>

        {showNew && (
          <Card className="p-5 space-y-4 mb-4">
            <h3 className="font-semibold">Nueva Categoría</h3>
            <form onSubmit={handleCreate} className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label>Nombre *</Label>
                <Input value={newNombre} onChange={e => setNewNombre(e.target.value.toUpperCase())} placeholder="Ej: LÁCTEOS, CARNES..." autoFocus />
              </div>
              <Button type="submit">Crear</Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            </form>
          </Card>
        )}

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 text-sm">
                <th className="text-left font-medium px-4 py-3">Nombre</th>
                <th className="text-right font-medium px-4 py-3 w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {catPaginated.map(c => (
                <tr key={c.id} className="border-t border-border">
                  {editId === c.id ? (
                    <>
                      <td className="px-4 py-2">
                        <Input value={editNombre} onChange={e => setEditNombre(e.target.value)} autoFocus />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" onClick={() => handleSave(c.id)} className="gap-1"><Check className="w-3.5 h-3.5" /> Guardar</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="gap-1"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Tags className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{c.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { setEditId(c.id); setEditNombre(c.nombre) }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => handleDelete(c.id, c.nombre)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-muted-foreground py-8">No hay categorías</td>
                </tr>
              )}
            </tbody>
          </table>
          {categorias.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30 text-sm">
              <span className="text-muted-foreground">
                {((catPage - 1) * PAGE_SIZE) + 1}–{Math.min(catPage * PAGE_SIZE, categorias.length)} de {categorias.length}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={catPage <= 1} onClick={() => setCatPage(p => p - 1)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={catPage >= catTotalPages} onClick={() => setCatPage(p => p + 1)}>Siguiente</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== SUBCATEGORÍAS ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Subcategorías</h2>
            <p className="text-sm text-muted-foreground mt-1">Clasificación detallada de productos</p>
          </div>
          <Button onClick={() => setShowNewSub(!showNewSub)} className="gap-2"><Plus className="w-4 h-4" /> Nueva Subcategoría</Button>
        </div>

        {showNewSub && (
          <Card className="p-5 space-y-4 mb-4">
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

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 text-sm">
                <th className="text-left font-medium px-4 py-3">Categoría</th>
                <th className="text-left font-medium px-4 py-3">Nombre</th>
                <th className="text-right font-medium px-4 py-3 w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subPaginated.map(sc => (
                <tr key={sc.id} className="border-t border-border">
                  {editSubId === sc.id ? (
                    <>
                      <td className="px-4 py-2">
                        <SearchSelect
                          options={categorias.map(c => ({ value: String(c.id), label: c.nombre }))}
                          value={String(editSubCategoriaId)}
                          onChange={setEditSubCategoriaId}
                          placeholder="Categoría..."
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={editSubNombre}
                          onChange={e => setEditSubNombre(e.target.value.toUpperCase())}
                          maxLength={200}
                          className="uppercase"
                          autoFocus
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" onClick={() => handleSaveSub(sc.id)} className="gap-1"><Check className="w-3.5 h-3.5" /> Guardar</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditSubId(null)} className="gap-1"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{sc.categoria?.nombre}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <ListTree className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{sc.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={() => { setEditSubId(sc.id); setEditSubNombre(sc.nombre); setEditSubCategoriaId(String(sc.categoria_id)) }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive shrink-0" onClick={() => handleDeleteSub(sc.id, sc.nombre)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {subcategorias.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted-foreground py-8">No hay subcategorías</td>
                </tr>
              )}
            </tbody>
          </table>
          {subcategorias.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30 text-sm">
              <span className="text-muted-foreground">
                {((subPage - 1) * PAGE_SIZE) + 1}–{Math.min(subPage * PAGE_SIZE, subcategorias.length)} de {subcategorias.length}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={subPage <= 1} onClick={() => setSubPage(p => p - 1)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={subPage >= subTotalPages} onClick={() => setSubPage(p => p + 1)}>Siguiente</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={() => setConfirmDelete(null)}>
          <Card className="p-6 w-full max-w-sm mx-4 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg">Confirmar eliminación</h3>
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de eliminar <strong>"{confirmDelete.nombre}"</strong>?
              {confirmDelete.type === 'categoria'
                ? ' Las subcategorías asociadas también se eliminarán.'
                : ''}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={executeDelete}>Eliminar</Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  )
}
