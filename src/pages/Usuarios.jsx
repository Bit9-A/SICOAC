import { useState, useEffect } from 'react'
import { Users, UserPlus, ShieldCheck, Shield, User, Pencil, X, Check, ToggleLeft, ToggleRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { getInstituciones } from '@/lib/api'
import { signUp } from '@/lib/auth'
import { cn, normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Administrador' },
  { value: 'operador', label: 'Operador' },
]

const ROLE_BADGE = {
  super_admin: { variant: 'destructive', label: 'Super Admin', icon: ShieldCheck },
  admin: { variant: 'default', label: 'Admin', icon: Shield },
  operador: { variant: 'secondary', label: 'Operador', icon: User },
}

export default function UsuariosPage() {
  const { isSuperAdmin, institucionId: userInstId } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editRol, setEditRol] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [rol, setRol] = useState('operador')
  const [instId, setInstId] = useState('')
  const [dispDias, setDispDias] = useState([])
  const [dispDesde, setDispDesde] = useState('')
  const [dispHasta, setDispHasta] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const DIAS = [
    { key: 'L', label: 'Lun' }, { key: 'M', label: 'Mar' }, { key: 'MI', label: 'Mie' },
    { key: 'J', label: 'Jue' }, { key: 'V', label: 'Vie' }, { key: 'S', label: 'Sab' },
    { key: 'D', label: 'Dom' },
  ]

  const HORAS = Array.from({ length: 33 }, (_, i) => {
    const h = Math.floor(i / 2) + 6; const m = i % 2 === 0 ? '00' : '30'
    return `${String(h).padStart(2, '0')}:${m}`
  })

  function toggleDia(key) {
    setDispDias(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key])
  }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    let n = digits
    if (n.startsWith('58') && n.length > 2) n = n.slice(2)
    else if (n.startsWith('0')) n = n.slice(1)
    const operador = n.slice(0, 3); const num = n.slice(3, 10)
    return num ? `${operador}-${num}` : operador
  }

  useEffect(() => { loadUsuarios(); loadInstituciones() }, [])

  async function loadUsuarios() {
    let q = supabase.from('usuarios').select('*, institucion:institucion_id (nombre)').order('nombre')
    if (!isSuperAdmin && userInstId) q = q.eq('institucion_id', userInstId)
    const { data } = await q
    setUsuarios(data || [])
  }

  async function loadInstituciones() {
    const insts = await getInstituciones()
    if (!isSuperAdmin && userInstId) setInstituciones(insts.filter(i => String(i.value) === String(userInstId)))
    else setInstituciones(insts)
  }

  async function handleCreate(e) {
    e.preventDefault()
    const newErrors = {}
    const normNombre = normalizeText(nombre)
    const normApellido = normalizeText(apellido)
    const normUsername = username.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normTel = telefono.trim()

    if (!normNombre) newErrors.nombre = 'El nombre es obligatorio'
    if (!normApellido) newErrors.apellido = 'El apellido es obligatorio'
    if (!normUsername) newErrors.username = 'El usuario es obligatorio'
    else if (normUsername.length < 3) newErrors.username = 'Mínimo 3 caracteres'
    else if (!/^[a-zA-Z0-9._]+$/.test(normUsername)) newErrors.username = 'Solo letras, números, puntos y guion bajo'
    if (!password) newErrors.password = 'La contraseña es obligatoria'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    if (!instId) newErrors.instId = 'La institución es obligatoria'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return toast.warning('Corrige los campos marcados')

    setLoading(true)
    try {
      // Verificar username único
      const { data: exist } = await supabase.from('usuarios').select('id').eq('username', normUsername).maybeSingle()
      if (exist) { setErrors({ username: 'El nombre de usuario ya existe' }); setLoading(false); return }

      await signUp({ username: normUsername, password, nombre: normNombre, apellido: normApellido, cedula: cedula.trim() || null, telefono: normTel, rol, institucionId: instId || null, disponibilidadDias: dispDias.join(','), disponibilidadHoraDesde: dispDesde || null, disponibilidadHoraHasta: dispHasta || null })
      toast.success('Usuario creado')
      setShowForm(false); setUsername(''); setPassword(''); setNombre(''); setApellido(''); setCedula(''); setTelefono(''); setRol('operador'); setInstId(''); setDispDias([]); setDispDesde(''); setDispHasta(''); setErrors({})
      loadUsuarios()
    } catch (err) { toast.error(err.message) } finally { setLoading(false) }
  }

  async function handleSaveRol(id) {
    const { error } = await supabase.from('usuarios').update({ rol: editRol }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Rol actualizado')
    setEditId(null)
    loadUsuarios()
  }

  async function handleToggleActive(id, activo) {
    const { error } = await supabase.from('usuarios').update({ activo: !activo }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success(activo ? 'Usuario desactivado' : 'Usuario activado')
    loadUsuarios()
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de usuarios del sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><UserPlus className="w-4 h-4" /> Nuevo</Button>
      </div>

      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Crear Usuario</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input value={nombre} onChange={e => setNombre(normalizeText(e.target.value))} className={errors.nombre ? 'border-destructive' : ''} placeholder="Ej: MARIA" />
                {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
              </div>
              <div className="space-y-2">
                <Label>Apellido *</Label>
                <Input value={apellido} onChange={e => setApellido(normalizeText(e.target.value))} className={errors.apellido ? 'border-destructive' : ''} placeholder="Ej: PEREZ" />
                {errors.apellido && <p className="text-xs text-destructive">{errors.apellido}</p>}
              </div>
              <div className="space-y-2">
                <Label>Usuario *</Label>
                <Input value={username} onChange={e => setUsername(e.target.value)} className={errors.username ? 'border-destructive' : ''} placeholder="ej: mariaperez" />
                {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label>Contraseña *</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className={errors.password ? 'border-destructive' : ''} placeholder="Mínimo 6 caracteres" />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label>Cédula</Label>
                <Input value={cedula} onChange={e => setCedula(e.target.value.toUpperCase())} placeholder="V-12345678" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={telefono} onChange={e => setTelefono(formatPhone(e.target.value))} placeholder="412-7445102" />
              </div>
              <div className="space-y-2">
                <Label>Rol *</Label>
                <SearchSelect options={ROLES} value={rol} onChange={setRol} placeholder="Seleccionar..." />
              </div>
              <div className="space-y-2 md:col-span-2 border-t border-border/50 pt-3">
                <Label className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Disponibilidad horaria
                </Label>
                <p className="text-xs text-muted-foreground">Días disponibles</p>
                <div className="flex flex-wrap gap-1.5">
                  {DIAS.map(d => (
                    <button key={d.key} type="button" onClick={() => toggleDia(d.key)}
                      className={cn('px-3 py-1.5 rounded-lg text-sm border transition-colors',
                        dispDias.includes(d.key)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary text-muted-foreground border-input hover:bg-secondary/80'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs">Desde</Label>
                    <select value={dispDesde} onChange={e => setDispDesde(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm">
                      <option value="">—</option>
                      {HORAS.filter(h => !dispHasta || h < dispHasta).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Hasta</Label>
                    <select value={dispHasta} onChange={e => setDispHasta(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm">
                      <option value="">—</option>
                      {HORAS.filter(h => !dispDesde || h > dispDesde).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Institución *</Label>
                <SearchSelect options={instituciones} value={instId} onChange={val => { setInstId(val); if (errors.instId) setErrors(p => ({...p, instId: null})) }} placeholder="Seleccionar..." error={!!errors.instId} />
                {errors.instId && <p className="text-xs text-destructive">{errors.instId}</p>}
              </div>
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Usuario'}</Button>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {usuarios.map(u => {
          const Rb = ROLE_BADGE[u.rol] || ROLE_BADGE.operador
          const Icon = Rb.icon
          return (
            <Card key={u.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{u.nombre} {u.apellido}</p>
                  <p className="text-sm text-muted-foreground truncate">@{u.username}</p>
                </div>
                {u.institucion?.nombre && <span className="text-sm text-muted-foreground hidden md:inline">{u.institucion.nombre}</span>}

                {editId === u.id ? (
                  <div className="flex items-center gap-2">
                    <select value={editRol} onChange={e => setEditRol(e.target.value)}
                      className="h-9 rounded-lg border border-input bg-secondary px-2 text-sm">
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <Button size="sm" variant="ghost" className="w-8 h-8" onClick={() => handleSaveRol(u.id)}><Check className="w-4 h-4 text-emerald-400" /></Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={Rb.variant} className="gap-1"><Icon className="w-3 h-3" />{Rb.label}</Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditId(u.id); setEditRol(u.rol) }} title="Cambiar rol"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleToggleActive(u.id, u.activo)} title={u.activo ? 'Desactivar' : 'Activar'}>
                      {u.activo ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
        {usuarios.length === 0 && <p className="text-center text-muted-foreground py-8">No hay usuarios</p>}
      </div>
    </div>
  )
}
