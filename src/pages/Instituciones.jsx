import { useState, useEffect } from 'react'
import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { getEstados, getMunicipios, getParroquias, createInstitucion, getInstituciones } from '@/lib/api'
import { toast } from 'sonner'

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState([])
  const [showForm, setShowForm] = useState(false)

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [parroquias, setParroquias] = useState([])
  const [estadoId, setEstadoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')
  const [parroquiaId, setParroquiaId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadData() }, [])
  useEffect(() => {
    if (estadoId) getMunicipios(estadoId).then(setMunicipios)
    else { setMunicipios([]); setMunicipioId('') }
  }, [estadoId])
  useEffect(() => {
    if (municipioId) getParroquias(municipioId).then(setParroquias)
    else { setParroquias([]); setParroquiaId('') }
  }, [municipioId])

  async function loadData() {
    const [insts, ests] = await Promise.all([getInstituciones(), getEstados()])
    setInstituciones(insts)
    setEstados(ests)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!nombre.trim() || !direccion.trim() || !parroquiaId) {
      toast.warning('Completá todos los campos')
      return
    }
    setLoading(true)
    try {
      await createInstitucion(nombre, direccion, parroquiaId)
      toast.success('Institución creada')
      setShowForm(false)
      setNombre(''); setDireccion(''); setEstadoId('')
      setMunicipioId(''); setParroquiaId('')
      loadData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Instituciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Centros de acopio registrados</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Institución
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Nueva Institución</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre <span className="text-destructive">*</span></Label>
                <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Centro de Acopio..." />
              </div>
              <div className="space-y-2">
                <Label>Dirección <span className="text-destructive">*</span></Label>
                <Input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección exacta" />
              </div>
              <div className="space-y-2">
                <Label>Estado <span className="text-destructive">*</span></Label>
                <SearchSelect options={estados} value={estadoId} onChange={setEstadoId} placeholder="Seleccionar..." />
              </div>
              <div className="space-y-2">
                <Label>Municipio <span className="text-destructive">*</span></Label>
                <SearchSelect options={municipios} value={municipioId} onChange={setMunicipioId} placeholder={estadoId ? 'Seleccionar...' : 'Elegí Estado primero'} />
              </div>
              <div className="space-y-2">
                <Label>Parroquia <span className="text-destructive">*</span></Label>
                <SearchSelect options={parroquias} value={parroquiaId} onChange={setParroquiaId} placeholder={municipioId ? 'Seleccionar...' : 'Elegí Municipio primero'} />
              </div>
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Institución'}</Button>
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
              <div>
                <p className="font-medium">{i.label}</p>
                <p className="text-sm text-muted-foreground truncate">{i.direccion}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
