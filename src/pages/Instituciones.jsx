import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  Building2, Plus, Trash2, QrCode, Share2, X, Copy, Check,
  Search, Phone, Clock, Package, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { getEstados, getMunicipios, getParroquias, createInstitucion } from '@/lib/api'
import { toast } from 'sonner'
import Pagination from '@/components/ui/pagination'

const pageSize = 12

export default function InstitucionesPage() {
  const [instituciones, setInstituciones] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroMunicipio, setFiltroMunicipio] = useState('')
  const [filtroAyuda, setFiltroAyuda] = useState('')

  // New form
  const [newNombre, setNewNombre] = useState('')
  const [newDir, setNewDir] = useState('')
  const [newEstado, setNewEstado] = useState('')
  const [newMunicipio, setNewMunicipio] = useState('')
  const [newParroquia, setNewParroquia] = useState('')
  const [formMunicipios, setFormMunicipios] = useState([])
  const [formParroquias, setFormParroquias] = useState([])

  // QR dialog
  const [qrInst, setQrInst] = useState(null)
  const [copied, setCopied] = useState(false)

  // Estados (cargar una sola vez)
  useEffect(() => { getEstados().then(setEstados) }, [])

  // Municipios según estado
  useEffect(() => {
    if (filtroEstado) getMunicipios(filtroEstado).then(setMunicipios)
    else { setMunicipios([]); setFiltroMunicipio('') }
  }, [filtroEstado])

  // Form municipios/parroquias
  useEffect(() => {
    if (newEstado) getMunicipios(newEstado).then(setFormMunicipios)
    else { setFormMunicipios([]); setNewMunicipio('') }
  }, [newEstado])
  useEffect(() => {
    if (newMunicipio) getParroquias(newMunicipio).then(setFormParroquias)
    else { setFormParroquias([]); setNewParroquia('') }
  }, [newMunicipio])

  // Carga server-side con filtros y paginación
  const load = useCallback(async () => {
    let query = supabase
      .from('institucion')
      .select('*, parroquia:parroquia_id (id, nombre, municipio:municipio_id (id, nombre, estado_id))', { count: 'exact' })
      .order('nombre')

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,direccion.ilike.%${search}%`)
    }
    if (filtroEstado) {
      query = query.eq('parroquia.municipio.estado_id', filtroEstado)
    }
    if (filtroMunicipio) {
      query = query.eq('parroquia.municipio_id', filtroMunicipio)
    }
    if (filtroAyuda) {
      query = query.ilike('tipos_ayuda', `%${filtroAyuda}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
      toast.error(error.message)
      return
    }

    setTotal(count || 0)
    setInstituciones((data || []).map(i => {
      const p = i.parroquia
      const m = p?.municipio
      return {
        id: i.id,
        nombre: i.nombre,
        direccion: i.direccion,
        organizacion: i.organizacion,
        telefono: i.telefono,
        horario: i.horario,
        tipos_ayuda: i.tipos_ayuda,
        notas: i.notas,
        latitud: i.latitud,
        longitud: i.longitud,
        activo: i.activo,
        parroquiaId: p?.id || null,
        parroquiaNombre: p?.nombre || '',
        municipioId: m?.id || null,
        municipioNombre: m?.nombre || '',
        estadoId: m?.estado_id || null,
        estadoNombre: '',
      }
    }))
  }, [page, search, filtroEstado, filtroMunicipio, filtroAyuda])

  useEffect(() => { load() }, [load])

  // Llenar estadoNombre
  useEffect(() => {
    if (instituciones.length > 0 && estados.length > 0) {
      const estMap = Object.fromEntries(estados.map(e => [e.value, e.label]))
      setInstituciones(prev => prev.map(i => ({ ...i, estadoNombre: estMap[i.estadoId] || '' })))
    }
  }, [instituciones.length, estados.length])

  // Calcular tipos de ayuda disponibles
  const tiposDisponibles = useMemo(() => {
    const set = new Set()
    instituciones.forEach(i => {
      (i.tipos_ayuda || '').split('|').filter(Boolean).forEach(t => set.add(t.trim()))
    })
    return [...set].sort()
  }, [instituciones])


  async function handleCreate(e) {
    e.preventDefault()
    if (!newNombre.trim() || !newDir.trim() || !newParroquia) return toast.warning('Completa todos los campos')
    await createInstitucion(newNombre, newDir, newParroquia)
    toast.success('Institución creada')
    setShowNew(false); setNewNombre(''); setNewDir(''); setNewEstado(''); setNewMunicipio(''); setNewParroquia('')
    load()
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    const { error } = await supabase.from('institucion').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Institución eliminada')
    load()
  }

  function getRegisterUrl(instId) {
    return `${window.location.origin}/?inst=${instId}&register`
  }

  async function handleShare(inst) {
    const url = getRegisterUrl(inst.id)
    if (navigator.share) {
      await navigator.share({ title: `Registro - ${inst.nombre}`, text: `Registrate como operador para ${inst.nombre}`, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Enlace copiado')
    }
  }

  async function handleCopyLink(inst) {
    await navigator.clipboard.writeText(getRegisterUrl(inst.id))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Enlace copiado')
  }

  const qrCanvasRef = useRef(null)
  const qrUrl = qrInst ? getRegisterUrl(qrInst.id) : ''

  useEffect(() => {
    if (qrUrl && qrCanvasRef.current) {
      import('qrcode').then(mod => {
        mod.default.toCanvas(qrCanvasRef.current, qrUrl, {
          width: 220,
          margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
        })
      })
    }
  }, [qrUrl])

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Instituciones</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} centro(s) de acopio</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="w-4 h-4" /> Nueva</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Nueva Institución</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={newNombre} onChange={e => setNewNombre(e.target.value.toUpperCase())} /></div>
              <div className="space-y-2"><Label>Dirección *</Label><Input value={newDir} onChange={e => setNewDir(e.target.value.toUpperCase())} /></div>
              <div className="space-y-2"><Label>Estado *</Label><SearchSelect options={estados} value={newEstado} onChange={setNewEstado} placeholder="Seleccionar..." /></div>
              <div className="space-y-2"><Label>Municipio *</Label><SearchSelect options={formMunicipios} value={newMunicipio} onChange={setNewMunicipio} placeholder={newEstado ? 'Seleccionar...' : 'Primero Estado'} /></div>
              <div className="space-y-2"><Label>Parroquia *</Label><SearchSelect options={formParroquias} value={newParroquia} onChange={setNewParroquia} placeholder={newMunicipio ? 'Seleccionar...' : 'Primero Municipio'} /></div>
            </div>
            <Button type="submit">Crear Institución</Button>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => { setSearch(e.target.value.toUpperCase()); setPage(1) }} placeholder="Nombre o dirección..." className="pl-9" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Estado</Label>
            <SearchSelect options={estados} value={filtroEstado} onChange={v => { setFiltroEstado(v); setFiltroMunicipio(''); setPage(1) }} placeholder="Todos" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Municipio</Label>
            <SearchSelect options={municipios} value={filtroMunicipio} onChange={v => { setFiltroMunicipio(v); setPage(1) }} placeholder={filtroEstado ? 'Seleccionar...' : 'Primero Estado'} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo de ayuda</Label>
            <SearchSelect
              options={tiposDisponibles.map(t => ({ value: t, label: t }))}
              value={filtroAyuda}
              onChange={v => { setFiltroAyuda(v); setPage(1) }}
              placeholder="Todos"
            />
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instituciones.map(i => {
          const tipos = (i.tipos_ayuda || '').split('|').filter(Boolean)
          return (
            <Card key={i.id} className="p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium truncate">{i.nombre}</p>
                  {i.organizacion && <p className="text-xs text-muted-foreground truncate">{i.organizacion}</p>}
                  <p className="text-xs text-muted-foreground truncate">{i.direccion}</p>
                  {(i.municipioNombre || i.parroquiaNombre || i.estadoNombre) && (
                    <p className="text-xs text-muted-foreground">
                      {[i.parroquiaNombre, i.municipioNombre, i.estadoNombre].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-1.5">
                {i.telefono && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Phone className="w-3 h-3" /> {i.telefono}
                  </Badge>
                )}
                {i.horario && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Clock className="w-3 h-3" /> {i.horario}
                  </Badge>
                )}
              </div>

              {/* Supply types */}
              {tipos.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tipos.slice(0, 4).map(t => (
                    <span key={t} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                  {tipos.length > 4 && <span className="text-xs text-muted-foreground">+{tipos.length - 4}</span>}
                </div>
              )}

              {/* Notes */}
              {i.notas && <p className="text-xs text-muted-foreground line-clamp-2">{i.notas}</p>}

              {/* Actions */}
              <div className="flex gap-1 pt-1 border-t border-border/50">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => { setQrInst(i); setCopied(false) }} title="Código QR">
                  <QrCode className="w-3.5 h-3.5" /> QR
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => handleShare(i)} title="Compartir">
                  <Share2 className="w-3.5 h-3.5" /> Compartir
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => {
                  const url = (i.latitud && i.longitud)
                    ? `https://www.google.com/maps?q=${i.latitud},${i.longitud}`
                    : `https://www.google.com/maps?q=${encodeURIComponent(i.direccion + ', ' + i.municipioNombre + ', ' + i.estadoNombre)}`
                  window.open(url, '_blank')
                }} title="Ver en Google Maps">
                  <MapPin className="w-3.5 h-3.5" /> Maps
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-destructive" onClick={() => handleDelete(i.id, i.nombre)} title="Eliminar">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          )
        })}
        {instituciones.length === 0 && (
          <p className="text-center text-muted-foreground py-8 col-span-full">No hay instituciones con esos filtros</p>
        )}
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />

      {/* QR Dialog */}
      {qrInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setQrInst(null)}>
          <Card className="w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Registro para:</h3>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setQrInst(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="font-medium">{qrInst.nombre}</p>

            {qrUrl && (
              <div className="flex justify-center">
                <canvas ref={qrCanvasRef} className="w-48 h-48" />
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Escanea este código para registrarte como operador de esta institución
            </p>

            {/* Maps link */}
            {(qrInst?.latitud && qrInst?.longitud) ? (
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => window.open(`https://www.google.com/maps?q=${qrInst.latitud},${qrInst.longitud}`, '_blank')}>
                <MapPin className="w-4 h-4" /> Ver ubicación en Google Maps
              </Button>
            ) : qrInst?.direccion ? (
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => window.open(`https://www.google.com/maps?q=${encodeURIComponent(qrInst.direccion)}`, '_blank')}>
                <MapPin className="w-4 h-4" /> Ver dirección en Google Maps
              </Button>
            ) : null}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => handleCopyLink(qrInst)}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar enlace'}
              </Button>
              <Button className="flex-1 gap-2" onClick={() => handleShare(qrInst)}>
                <Share2 className="w-4 h-4" /> Compartir
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
