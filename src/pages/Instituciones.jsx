import { useState, useEffect } from 'react'
import { Building2, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { getEstados, getMunicipios, getParroquias, createInstitucion, getInstituciones } from '@/lib/api'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState([])
  const [estados, setEstados] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [editId, setEditId] = useState(null)

  // New form
  const [newNombre, setNewNombre] = useState('')
  const [newDir, setNewDir] = useState('')
  const [newEstado, setNewEstado] = useState('')
  const [newMunicipio, setNewMunicipio] = useState('')
  const [newParroquia, setNewParroquia] = useState('')
  const [municipios, setMunicipios] = useState([])
  const [parroquias, setParroquias] = useState([])

  useEffect(() => { loadData() }, [])
  useEffect(() => {
    if (newEstado) getMunicipios(newEstado).then(setMunicipios)
    else { setMunicipios([]); setNewMunicipio('') }
  }, [newEstado])
  useEffect(() => {
    if (newMunicipio) getParroquias(newMunicipio).then(setParroquias)
    else { setParroquias([]); setNewParroquia('') }
  }, [newMunicipio])

  async function loadData() {
    const [insts, ests] = await Promise.all([getInstituciones(), getEstados()])
    setInstituciones(insts)
    setEstados(ests)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim() || !newDir.trim() || !newParroquia) return toast.warning('Completá todos los campos')
    await createInstitucion(newNombre, newDir, newParroquia)
    toast.success('Institución creada')
    setShowNew(false); setNewNombre(''); setNewDir(''); setNewEstado(''); setNewMunicipio(''); setNewParroquia('')
    loadData()
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('institucion').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Institución eliminada')
    loadData()
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instituciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Centros de acopio registrados</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="w-4 h-4" /> Nueva</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Nueva Institución</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={newNombre} onChange={e => setNewNombre(e.target.value)} /></div>
              <div className="space-y-2"><Label>Dirección *</Label><Input value={newDir} onChange={e => setNewDir(e.target.value)} /></div>
              <div className="space-y-2"><Label>Estado *</Label><SearchSelect options={estados} value={newEstado} onChange={setNewEstado} placeholder="Seleccionar..." /></div>
              <div className="space-y-2"><Label>Municipio *</Label><SearchSelect options={municipios} value={newMunicipio} onChange={setNewMunicipio} placeholder={newEstado ? 'Seleccionar...' : 'Primero Estado'} /></div>
              <div className="space-y-2"><Label>Parroquia *</Label><SearchSelect options={parroquias} value={newParroquia} onChange={setNewParroquia} placeholder={newMunicipio ? 'Seleccionar...' : 'Primero Municipio'} /></div>
            </div>
            <Button type="submit">Crear Institución</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instituciones.map(i => (
          <Card key={i.value} className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{i.label}</p>
                <p className="text-sm text-muted-foreground truncate">{i.direccion}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleDelete(i.value, i.label)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
        {instituciones.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No hay instituciones</p>}
      </div>
    </div>
  )
}
