import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Plus, Pencil, Trash2, X, Check, Barcode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { getCategorias, createCategoria, getSubcategorias } from '@/lib/api'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [filter, setFilter] = useState('')
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editCatId, setEditCatId] = useState('')
  const [editSubcatId, setEditSubcatId] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCatId, setNewCatId] = useState('')
  const [newSubcatId, setNewSubcatId] = useState('')
  const [newBarcode, setNewBarcode] = useState('')

  const [newBarcodeInput, setNewBarcodeInput] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [prods, cats, subs] = await Promise.all([
      supabase
        .from('producto')
        .select('*, categoria:categoria_id (nombre), subcategoria:subcategoria_id (nombre), producto_codigo (id, codigo)')
        .order('nombre'),
      getCategorias(),
      getSubcategorias(),
    ])
    setProductos(prods.data || [])
    setCategorias(cats)
    setSubcategorias(subs)
  }

  const filtered = productos.filter(p =>
    !filter || (p.nombre || '').toLowerCase().includes(filter.toLowerCase())
  )

  const subcategoriasPorCat = (catId) =>
    catId ? subcategorias.filter(s => String(s.categoriaId) === String(catId)) : []

  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim() || !newCatId) return toast.warning('Completa nombre y categoría')

    const { data: prod, error } = await supabase.from('producto').insert({
      nombre: normalizeText(newNombre),
      descripcion: normalizeText(newDesc),
      categoria_id: newCatId,
      subcategoria_id: newSubcatId || null,
    }).select()
    if (error) return toast.error(error.message)

    if (newBarcode.trim()) {
      const { error: bcErr } = await supabase.from('producto_codigo').insert({
        producto_id: prod[0].id,
        codigo: newBarcode.trim(),
      })
      if (bcErr) toast.error(`Producto creado, pero error con código: ${bcErr.message}`)
    }

    toast.success('Producto creado')
    setShowNew(false)
    setNewNombre(''); setNewDesc(''); setNewCatId(''); setNewSubcatId(''); setNewBarcode('')
    load()
  }

  async function handleSave(id) {
    if (!editNombre.trim()) return toast.warning('El nombre es obligatorio')
    const { error } = await supabase.from('producto').update({
      nombre: normalizeText(editNombre),
      descripcion: normalizeText(editDesc),
      categoria_id: editCatId,
      subcategoria_id: editSubcatId || null,
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

  async function handleAddBarcode(productoId) {
    const codigo = newBarcodeInput.trim()
    if (!codigo) return
    const { error } = await supabase.from('producto_codigo').insert({ producto_id: productoId, codigo })
    if (error) return toast.error(error.message)
    toast.success('Código agregado')
    setNewBarcodeInput('')
    load()
  }

  async function handleRemoveBarcode(barcodeId) {
    const { error } = await supabase.from('producto_codigo').delete().eq('id', barcodeId)
    if (error) return toast.error(error.message)
    load()
  }

  function startEdit(p) {
    setEditId(p.id)
    setEditNombre(p.nombre)
    setEditDesc(p.descripcion || '')
    setEditCatId(String(p.categoria_id))
    setEditSubcatId(p.subcategoria_id ? String(p.subcategoria_id) : '')
    setNewBarcodeInput('')
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
              <SearchSelect
                options={categorias}
                value={newCatId}
                onChange={v => { setNewCatId(v); setNewSubcatId('') }}
                placeholder="Seleccionar..."
              />
            </div>
            <div className="space-y-2">
              <Label>Subcategoría</Label>
              <SearchSelect
                options={subcategoriasPorCat(newCatId)}
                value={newSubcatId}
                onChange={setNewSubcatId}
                placeholder={newCatId ? 'Seleccionar...' : 'Primero selecciona una categoría'}
              />
            </div>
            <div className="space-y-2">
              <Label>Código de barras</Label>
              <Input
                value={newBarcode} onChange={e => setNewBarcode(e.target.value)}
                inputMode="numeric" placeholder="Opcional"
              />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    <SearchSelect
                      options={categorias}
                      value={editCatId}
                      onChange={v => { setEditCatId(v); setEditSubcatId('') }}
                      placeholder="Seleccionar..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Subcategoría</Label>
                    <SearchSelect
                      options={subcategoriasPorCat(editCatId)}
                      value={editSubcatId}
                      onChange={setEditSubcatId}
                      placeholder={editCatId ? 'Seleccionar...' : 'Primero selecciona una categoría'}
                    />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3">
                  <Label className="text-xs mb-2 block">Códigos de barras</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(p.producto_codigo || []).map(bc => (
                      <Badge key={bc.id} variant="secondary" className="gap-1.5 pr-1">
                        <Barcode className="w-3 h-3" />
                        {bc.codigo}
                        <button
                          type="button"
                          onClick={() => handleRemoveBarcode(bc.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {(p.producto_codigo || []).length === 0 && (
                      <span className="text-xs text-muted-foreground">Sin códigos</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newBarcodeInput}
                      onChange={e => setNewBarcodeInput(e.target.value)}
                      inputMode="numeric"
                      placeholder="Agregar código..."
                      className="h-8 text-xs"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddBarcode(p.id) } }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-xs"
                      disabled={!newBarcodeInput.trim()}
                      onClick={() => handleAddBarcode(p.id)}
                    >
                      <Plus className="w-3 h-3" /> Agregar
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
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
                  {(p.producto_codigo || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(p.producto_codigo || []).slice(0, 4).map(bc => (
                        <span key={bc.id} className="inline-flex items-center gap-1 text-xs bg-secondary/60 px-1.5 py-0.5 rounded">
                          <Barcode className="w-2.5 h-2.5" />
                          {bc.codigo}
                        </span>
                      ))}
                      {(p.producto_codigo || []).length > 4 && (
                        <span className="text-xs text-muted-foreground">+{p.producto_codigo.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <Badge variant="secondary">{p.categoria?.nombre || '—'}</Badge>
                  {p.subcategoria?.nombre && (
                    <span className="text-xs text-muted-foreground">{p.subcategoria.nombre}</span>
                  )}
                </div>
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
