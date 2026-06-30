import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createVoluntario } from '@/lib/api'
import { toast } from 'sonner'

const DIAS = [
  { key: 'L', label: 'Lun' }, { key: 'M', label: 'Mar' }, { key: 'MI', label: 'Mie' },
  { key: 'J', label: 'Jue' }, { key: 'V', label: 'Vie' }, { key: 'S', label: 'Sab' },
  { key: 'D', label: 'Dom' },
]

export default function VoluntarioRegistroPage() {
  const params = new URLSearchParams(window.location.search)
  const instId = params.get('inst')

  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [dispDias, setDispDias] = useState([])
  const [dispDesde, setDispDesde] = useState('')
  const [dispHasta, setDispHasta] = useState('')
  const [loading, setLoading] = useState(false)
  const [completado, setCompletado] = useState(false)
  const [instNombre, setInstNombre] = useState('')

  useEffect(() => {
    if (instId) {
      import('./lib/api').then(mod => mod.getInstituciones ? mod.getInstituciones().then(insts => {
        const f = insts.find(i => String(i.value) === String(instId))
        if (f) setInstNombre(f.label)
      }) : null)
    }
  }, [instId])

  function toggleDia(key) {
    setDispDias(p => p.includes(key) ? p.filter(d => d !== key) : [...p, key])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!cedula.trim() || !nombre.trim() || !apellido.trim() || !email.trim()) {
      toast.warning('Completa cédula, nombre, apellido y correo')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      toast.warning('Correo electrónico inválido')
      return
    }
    setLoading(true)
    try {
      await createVoluntario({
        cedula, nombre, apellido, email, telefono,
        disponibilidadDias: dispDias.join(','),
        disponibilidadHoraDesde: dispDesde || null,
        disponibilidadHoraHasta: dispHasta || null,
        institucionId: instId || null,
      })
      setCompletado(true)
    } catch (err) {
      if (err.message?.includes('voluntarios_cedula_key')) {
        toast.error('Ya existe un voluntario registrado con esa cédula')
      } else {
        toast.error(err.message || 'Error al registrar')
      }
    } finally { setLoading(false) }
  }

  if (completado) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-4">
        <Card className="max-w-sm w-full p-8 text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold">Registro completado</h2>
          <p className="text-sm text-muted-foreground">
            Gracias por registrarte{instNombre ? ` como voluntario de ${instNombre}` : ''}. 
            El administrador del centro se pondrá en contacto.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-12 rounded-2xl bg-primary/10">
            <img src="/logo_sicoac.png" alt="SICOAC" className="h-8" />
          </div>
          <h1 className="text-xl font-bold">Registro de Voluntarios</h1>
          <p className="text-sm text-muted-foreground">
            {instNombre ? `Centro: ${instNombre}` : 'Completa tus datos para ser voluntario'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {instNombre && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">{instNombre}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label>Cédula de identidad *</Label>
            <Input value={cedula} onChange={e => setCedula(e.target.value.toUpperCase())} placeholder="V-12345678" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())} placeholder="MARIA" />
            </div>
            <div className="space-y-2">
              <Label>Apellido *</Label>
              <Input value={apellido} onChange={e => setApellido(e.target.value.toUpperCase())} placeholder="PEREZ" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Correo electrónico *</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="maria@correo.com" />
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="0412-1234567" />
          </div>

          <div className="space-y-2 border-t border-border/50 pt-3">
            <Label className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Disponibilidad horaria</Label>
            <p className="text-xs text-muted-foreground">Días que podés asistir</p>
            <div className="flex flex-wrap gap-1.5">
              {DIAS.map(d => (
                <button key={d.key} type="button" onClick={() => toggleDia(d.key)}
                  className={cn('px-3 py-1.5 rounded-lg text-sm border transition-colors',
                    dispDias.includes(d.key)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-muted-foreground border-input'
                  )}>
                  {d.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div><Label className="text-xs">Desde</Label><Input type="time" value={dispDesde} onChange={e => setDispDesde(e.target.value)} className="h-9" /></div>
              <div><Label className="text-xs">Hasta</Label><Input type="time" value={dispHasta} onChange={e => setDispHasta(e.target.value)} className="h-9" /></div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme como voluntario'}
          </Button>
        </form>
      </div>
    </div>
  )
}
