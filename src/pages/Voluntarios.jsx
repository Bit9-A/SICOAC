import { useState, useEffect, useCallback } from 'react'
import { HeartHandshake, Search, Download, Clock, Phone, Mail, Building2, UserCheck, UserX, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { getVoluntarios, getInstituciones } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { cn, normalizeText } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Pagination from '@/components/ui/pagination'

export default function VoluntariosPage() {
  const { institucionId, isSuperAdmin } = useAuth()
  const [voluntarios, setVoluntarios] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [search, setSearch] = useState('')
  const [filtroInst, setFiltroInst] = useState('')
  const [filtroDia, setFiltroDia] = useState('')

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  const tieneInstitucion = !!institucionId

  const DIAS = [
    { key: 'L', label: 'Lun' }, { key: 'M', label: 'Mar' }, { key: 'MI', label: 'Mie' },
    { key: 'J', label: 'Jue' }, { key: 'V', label: 'Vie' }, { key: 'S', label: 'Sab' },
    { key: 'D', label: 'Dom' },
  ]

  const load = useCallback(async () => {
    const [res, insts] = await Promise.all([
      getVoluntarios({ institucionId, page, pageSize, search, filtroInst, filtroDia }),
      getInstituciones()
    ])
    setVoluntarios(res.data)
    setTotal(res.count)
    setInstituciones(insts)
  }, [page, search, filtroInst, filtroDia, institucionId])

  useEffect(() => { load() }, [load])

  async function handleToggleActivo(v) {
    const { error } = await supabase.from('voluntarios').update({ activo: !v.activo }).eq('id', v.id)
    if (error) return toast.error(error.message)
    load()
  }

  function exportCSV() {
    const rows = voluntarios.map(v =>
      [v.cedula, v.nombre, v.apellido, v.email, v.telefono, v.disponibilidad_dias, v.disponibilidad_hora_desde, v.disponibilidad_hora_hasta, v.institucion?.nombre].join(',')
    )
    const csv = ['cedula,nombre,apellido,email,telefono,dias,desde,hasta,institucion', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `voluntarios-${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Voluntarios</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} voluntario(s) registrados</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Nombre, cédula o email..." className="pl-9" />
            </div>
          </div>
          {!tieneInstitucion && (
            <div className="space-y-1">
              <Label className="text-xs">Institución</Label>
              <SearchSelect options={instituciones} value={filtroInst} onChange={v => { setFiltroInst(v); setPage(1) }} placeholder="Todas" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Disponibilidad por día</Label>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => { setFiltroDia(''); setPage(1) }}
              className={cn('px-2.5 py-1 rounded-lg text-xs border transition-colors',
                !filtroDia ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-input'
              )}>Todos</button>
            {DIAS.map(d => (
              <button key={d.key} onClick={() => { setFiltroDia(d.key); setPage(1) }}
                className={cn('px-2.5 py-1 rounded-lg text-xs border transition-colors',
                  filtroDia === d.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-input'
                )}>{d.label}</button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {voluntarios.map(v => (
          <Card key={v.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{v.nombre} {v.apellido}</p>
                <p className="text-xs text-muted-foreground">C.I. {v.cedula}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {v.email}</span>
                  {v.telefono && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {v.telefono}</span>}
                  {v.institucion?.nombre && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="w-3 h-3" /> {v.institucion.nombre}</span>}
                </div>
                {(v.disponibilidad_dias || v.disponibilidad_hora_desde) && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {v.disponibilidad_dias && (
                      <div className="flex gap-0.5">
                        {['L','M','MI','J','V','S','D'].map(d => (
                          <span key={d} className={`text-xs px-1 rounded ${v.disponibilidad_dias.includes(d) ? 'bg-primary/20 text-primary' : 'text-muted-foreground/30'}`}>{d}</span>
                        ))}
                      </div>
                    )}
                    {v.disponibilidad_hora_desde && <span className="text-xs text-muted-foreground ml-1">{v.disponibilidad_hora_desde.slice(0,5)} - {v.disponibilidad_hora_hasta?.slice(0,5)}</span>}
                  </div>
                )}
              </div>
              <button onClick={() => handleToggleActivo(v)} className="shrink-0" title={v.activo ? 'Desactivar' : 'Activar'}>
                {v.activo ? <UserCheck className="w-5 h-5 text-emerald-400" /> : <UserX className="w-5 h-5 text-muted-foreground" />}
              </button>
            </div>
          </Card>
        ))}
        {voluntarios.length === 0 && <p className="text-center text-muted-foreground py-8">No hay voluntarios registrados</p>}
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />
    </div>
  )
}
