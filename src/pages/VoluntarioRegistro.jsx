import { useState, useEffect, useMemo } from 'react'
import { Clock, CheckCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createVoluntario, getInstituciones } from '@/lib/api'
import { toast } from 'sonner'

const DIAS = [
  { key: 'L', label: 'Lun' }, { key: 'M', label: 'Mar' }, { key: 'MI', label: 'Mie' },
  { key: 'J', label: 'Jue' }, { key: 'V', label: 'Vie' }, { key: 'S', label: 'Sab' },
  { key: 'D', label: 'Dom' },
]

// Generar horas cada 30 min (6:00 a 22:00)
const HORAS = Array.from({ length: 33 }, (_, i) => {
  const h = Math.floor(i / 2) + 6
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

function formatPhone(value) {
  const digits = value.replace(/\D/g, '')        // solo dígitos
  if (!digits) return ''
  let n = digits
  if (n.startsWith('58') && n.length > 2) n = n.slice(2)  // +58 → quitar 58
  else if (n.startsWith('0')) n = n.slice(1)               // 0412 → quitar 0

  const operador = n.slice(0, 3)
  const numero = n.slice(3, 10)
  if (numero) return `${operador}-${numero}`
  return operador
}

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
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (instId) {
      getInstituciones().then(insts => {
        const f = insts.find(i => String(i.value) === String(instId))
        if (f) setInstNombre(f.label)
      })
    }
  }, [instId])

  function toggleDia(key) {
    setDispDias(p => p.includes(key) ? p.filter(d => d !== key) : [...p, key])
  }

  function handlePhone(e) {
    const raw = e.target.value
    const formatted = formatPhone(raw)
    setTelefono(formatted)
  }

  function validate() {
    const e = {}
    if (!cedula.trim()) e.cedula = 'La cédula es obligatoria'
    else if (!/^[VEJPG]?[-]?\d{6,10}$/i.test(cedula.trim())) e.cedula = 'Formato inválido (Ej: V-12345678)'
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!apellido.trim()) e.apellido = 'El apellido es obligatorio'
    if (!email.trim()) e.email = 'El correo es obligatorio'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Correo inválido'
    if (telefono && !/^\d{3}-\d{7}$/.test(telefono)) e.telefono = 'Formato inválido (Ej: 412-7445102)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await createVoluntario({
        cedula: cedula.trim(),
        nombre,
        apellido,
        email: email.trim().toLowerCase(),
        telefono,
        disponibilidadDias: dispDias.join(','),
        disponibilidadHoraDesde: dispDesde || null,
        disponibilidadHoraHasta: dispHasta || null,
        institucionId: instId || null,
      })
      setCompletado(true)
    } catch (err) {
      if (err.message?.includes('voluntarios_cedula_key')) {
        setErrors({ cedula: 'Ya existe un voluntario con esa cédula' })
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
            {instNombre ? `Centro: ${instNombre}` : 'Completa tus datos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {instNombre && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">{instNombre}</span>
            </div>
          )}

          {/* Cédula */}
          <div className="space-y-2">
            <Label>Cédula de identidad *</Label>
            <Input value={cedula} onChange={e => setCedula(e.target.value.toUpperCase())} placeholder="V-12345678" className={errors.cedula ? 'border-destructive' : ''} />
            {errors.cedula && <p className="text-xs text-destructive">{errors.cedula}</p>}
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())} placeholder="MARIA" className={errors.nombre ? 'border-destructive' : ''} />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
            </div>
            <div className="space-y-2">
              <Label>Apellido *</Label>
              <Input value={apellido} onChange={e => setApellido(e.target.value.toUpperCase())} placeholder="PEREZ" className={errors.apellido ? 'border-destructive' : ''} />
              {errors.apellido && <p className="text-xs text-destructive">{errors.apellido}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Correo electrónico *</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="maria@correo.com" className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              value={telefono}
              onChange={handlePhone}
              placeholder="412-7445102"
              className={errors.telefono ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Formato: código operador - número (Ej: 412-7445102)</p>
            {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
          </div>

          {/* Disponibilidad */}
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
              <div className="space-y-1">
                <Label className="text-xs">Desde</Label>
                <select value={dispDesde} onChange={e => setDispDesde(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm">
                  <option value="">—</option>
                  {HORAS.filter(h => !dispHasta || h < dispHasta).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hasta</Label>
                <select value={dispHasta} onChange={e => setDispHasta(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm">
                  <option value="">—</option>
                  {HORAS.filter(h => !dispDesde || h > dispDesde).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
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
