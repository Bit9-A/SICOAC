import { useState, useEffect } from 'react'
import { Users, UserPlus, ShieldCheck, Shield, User, Pencil, X, Check, ToggleLeft, ToggleRight } from 'lucide-react'
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
import { normalizeText } from '@/lib/utils'
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
  const [rol, setRol] = useState('operador')
  const [instId, setInstId] = useState('')
  const [loading, setLoading] = useState(false)

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
    if (!username.trim() || !password || !nombre.trim() || !apellido.trim()) return toast.warning('Completá campos obligatorios')
    setLoading(true)
    try {
      await signUp({ username: username.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), password, nombre: normalizeText(nombre), apellido: normalizeText(apellido), telefono: telefono.trim(), rol, institucionId: instId || null })
      toast.success('Usuario creado')
      setShowForm(false); setUsername(''); setPassword(''); setNombre(''); setApellido(''); setTelefono(''); setRol('operador'); setInstId('')
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
              <div className="space-y-2"><Label>Nombre *</Label><Input value={nombre} onChange={e => setNombre(e.target.value)} /></div>
              <div className="space-y-2"><Label>Apellido *</Label><Input value={apellido} onChange={e => setApellido(e.target.value)} /></div>
              <div className="space-y-2"><Label>Usuario *</Label><Input value={username} onChange={e => setUsername(e.target.value)} /></div>
              <div className="space-y-2"><Label>Contraseña *</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Rol *</Label>
                <SearchSelect options={ROLES} value={rol} onChange={setRol} placeholder="Seleccionar..." />
              </div>
              <div className="space-y-2">
                <Label>Institución *</Label>
                <SearchSelect options={instituciones} value={instId} onChange={setInstId} placeholder="Seleccionar..." />
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
