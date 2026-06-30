import { useState, useEffect, useCallback } from 'react'
import { Users, UserPlus, Search, ShieldCheck, Shield, User, Pencil, X, Check, ToggleLeft, ToggleRight, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import Pagination from '@/components/ui/pagination'
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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [loadingList, setLoadingList] = useState(false)
  const pageSize = 20
  
  // Estado de edición principal
  const [editId, setEditId] = useState(null)

  // Estados compartidos para creación y edición
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  
  const [cedulaPrefijo, setCedulaPrefijo] = useState('V')
  const [cedulaNumero, setCedulaNumero] = useState('')

  const [rol, setRol] = useState('operador')
  const [instId, setInstId] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleCedulaChange(e) {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 9) {
      setCedulaNumero(value)
      if (errors.cedula) {
        setErrors(prev => ({ ...prev, cedula: null }))
      }
    }
  }

  // Validación asíncrona de cédula única al salir del campo (onBlur)
  async function validateCedulaUnica() {
    if (!cedulaNumero.trim() || editId) return

    const cedulaCompleta = `${cedulaPrefijo}-${cedulaNumero.trim()}`
    try {
      const { data: exist } = await supabase
        .from('usuarios')
        .select('id')
        .eq('cedula', cedulaCompleta)
        .maybeSingle()

      if (exist) {
        setErrors(prev => ({ ...prev, cedula: 'La cédula pertenece a otro usuario' }))
        toast.error('Esta cédula ya se encuentra registrada en el sistema')
      } else {
        setErrors(prev => ({ ...prev, cedula: null }))
      }
    } catch (err) {
      console.error(err)
    }
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

  function handlePasswordChange(e) {
    const val = e.target.value
    setPassword(val)
    if (val && val.length < 6) {
      setErrors(prev => ({ ...prev, password: 'La contraseña debe tener 6 caracteres o más' }))
    } else {
      setErrors(prev => ({ ...prev, password: null }))
    }
    if (confirmPassword) {
      if (val !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas ingresadas no coinciden' }))
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: null }))
      }
    }
  }

  function handleConfirmPasswordChange(e) {
    const val = e.target.value
    setConfirmPassword(val)
    if (password === val) {
      setErrors(prev => ({ ...prev, confirmPassword: null }))
    }
  }

  function validatePasswordsMatch() {
    if (confirmPassword && password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas ingresadas no coinciden' }))
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: null }))
    }
  }

  const loadUsuarios = useCallback(async () => {
    setLoadingList(true)
    let q = supabase
      .from('usuarios')
      .select('*, institucion:institucion_id (nombre)', { count: 'exact' })

    if (!isSuperAdmin && userInstId) q = q.eq('institucion_id', userInstId)

    if (search) {
      q = q.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,username.ilike.%${search}%,cedula.ilike.%${search}%`)
    }

    q = q.order('nombre')

    const rangeStart = (page - 1) * pageSize
    const { data, count, error } = await q.range(rangeStart, rangeStart + pageSize - 1)
    if (error) toast.error(error.message)
    setUsuarios(data || [])
    setTotal(count || 0)
    setLoadingList(false)
  }, [page, search, isSuperAdmin, userInstId])

  useEffect(() => { loadUsuarios() }, [loadUsuarios])
  useEffect(() => { loadInstituciones() }, [])

  async function loadInstituciones() {
    const insts = await getInstituciones()
    if (!isSuperAdmin && userInstId) setInstituciones(insts.filter(i => String(i.value) === String(userInstId)))
    else setInstituciones(insts)
  }

  const resetForm = () => {
    setUsername(''); setPassword(''); setConfirmPassword(''); setNombre(''); setApellido(''); 
    setCedulaNumero(''); setCedulaPrefijo('V'); setTelefono(''); setRol('operador'); 
    setInstId(''); setErrors({}); setShowPassword(false); setShowConfirmPassword(false); setEditId(null);
  }

  function startEdit(u) {
    resetForm()
    setEditId(u.id)
    setNombre(u.nombre || '')
    setApellido(u.apellido || '')
    setUsername(u.username || '')
    setTelefono(u.telefono || '')
    setRol(u.rol || 'operador')
    setInstId(u.institucion_id ? String(u.institucion_id) : '')
    if (u.cedula && u.cedula.includes('-')) {
      const parts = u.cedula.split('-')
      setCedulaPrefijo(parts[0])
      setCedulaNumero(parts[1])
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    const newErrors = { ...errors }
    const normNombre = normalizeText(nombre)
    const normApellido = normalizeText(apellido)
    const normUsername = username.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normTel = telefono.trim()

    if (!normNombre) newErrors.nombre = 'El nombre es obligatorio'
    if (!normApellido) newErrors.apellido = 'El apellido es obligatorio'
    if (!normUsername) newErrors.username = 'El usuario es obligatorio'
    else if (normUsername.length < 3) newErrors.username = 'Mínimo 3 caracteres'
    else if (!/^[a-zA-Z0-9._]+$/.test(normUsername)) newErrors.username = 'Solo letras, números, puntos y guion bajo'
    
    if (!cedulaNumero.trim()) newErrors.cedula = 'La cédula es obligatoria'
    if (!password) newErrors.password = 'La contraseña es obligatoria'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    
    if (!confirmPassword) newErrors.confirmPassword = 'Debes confirmar la contraseña'
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas ingresadas no coinciden'
    
    if (!instId) newErrors.instId = 'La institución es obligatoria'

    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v != null))
    setErrors(activeErrors)

    if (Object.keys(activeErrors).length > 0) return toast.warning('Corrige los campos marcados')

    const cedulaCompleta = `${cedulaPrefijo}-${cedulaNumero.trim()}`

    setLoading(true)
    try {
      const { data: existUser } = await supabase.from('usuarios').select('id').eq('username', normUsername).maybeSingle()
      if (existUser) { setErrors(p => ({ ...p, username: 'El nombre de usuario ya existe' })); setLoading(false); return }

      const { data: existCed } = await supabase.from('usuarios').select('id').eq('cedula', cedulaCompleta).maybeSingle()
      if (existCed) { setErrors(p => ({ ...p, cedula: 'La cédula pertenece a otro usuario' })); setLoading(false); return }

      await signUp({ 
        username: normUsername, 
        password, 
        nombre: normNombre, 
        apellido: normApellido, 
        telefono: normTel, 
        rol, 
        institucionId: instId || null,
        cedula: cedulaCompleta
      })

      const { error: patchError } = await supabase
        .from('usuarios')
        .update({ cedula: cedulaCompleta })
        .eq('username', normUsername)

      if (patchError) {
        console.error("Error guardando la cédula:", patchError.message)
      }
      
      toast.success('Usuario creado con éxito')
      setShowForm(false)
      resetForm()
      loadUsuarios()
    } catch (err) { 
      toast.error(err.message) 
    } finally { 
      setLoading(false) 
    }
  }

  async function handleUpdate(e, id) {
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
    
    if (password) {
      if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
      if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas ingresadas no coinciden'
    }
    
    if (!instId) newErrors.instId = 'La institución es obligatoria'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return toast.warning('Corrige los campos marcados')

    setLoading(true)
    try {
      const { data: exist } = await supabase.from('usuarios').select('id').eq('username', normUsername).neq('id', id).maybeSingle()
      if (exist) { setErrors({ username: 'El nombre de usuario ya existe' }); setLoading(false); return }

      if (password) {
        const { error: authError } = await supabase.auth.updateUser({ password: password })
        if (authError) console.warn("Nota RLS/Auth: No se pudo cambiar la contraseña vía SDK", authError.message)
      }

      const updateData = {
        nombre: normNombre,
        apellido: normApellido,
        username: normUsername,
        telefono: normTel,
        rol,
        institucion_id: instId || null
      }

      const { error } = await supabase.from('usuarios').update(updateData).eq('id', id)
      if (error) throw error

      toast.success('Usuario actualizado con éxito')
      resetForm()
      loadUsuarios()
    } catch (err) { 
      toast.error(err.message) 
    } finally { 
      setLoading(false) 
    }
  }

  async function handleToggleActive(id, activo) {
    const { error } = await supabase.from('usuarios').update({ activo: !activo }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success(activo ? 'Usuario desactivado' : 'Usuario activado')
    loadUsuarios()
  }

  // Nueva función para restablecer la contraseña al mismo username
  async function handleResetPassword(userRaw) {
    const defaultPassword = userRaw.username.toLowerCase().trim()
    
    if (defaultPassword.length < 6) {
      return toast.warning(`El nombre de usuario (${defaultPassword}) debe tener mínimo 6 caracteres para poder usarse como contraseña automática.`)
    }

    setLoading(true)
    try {
      // Nota: Desde Supabase Client estándar, updateUser aplica sobre la sesión actual. 
      // Si eres Super Admin administrando terceros, lo ideal es usar una Edge Function o supabase.auth.admin.updateUserById desde un backend/RPC.
      const { error } = await supabase.auth.updateUser({ password: defaultPassword })
      
      if (error) throw error
      toast.success(`Contraseña restablecida con éxito. Nueva clave: "${defaultPassword}"`)
    } catch (err) {
      console.error(err)
      toast.error(`No se pudo actualizar en Auth: ${err.message}. Asegúrate de tener los permisos necesarios.`)
    } finally {
      setLoading(false)
    }
  }

  const renderFormFields = (isEdit = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input value={nombre} onChange={e => setNombre(normalizeText(e.target.value))} className={errors.nombre ? 'border-destructive' : ''} placeholder="Ej: MARIA" />
        {errors.nombre && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.nombre}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Apellido *</Label>
        <Input value={apellido} onChange={e => setApellido(normalizeText(e.target.value))} className={errors.apellido ? 'border-destructive' : ''} placeholder="Ej: PEREZ" />
        {errors.apellido && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.apellido}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Usuario *</Label>
        <Input 
          value={username} 
          onChange={e => {
            setUsername(e.target.value);
            if (errors.username) {
              setErrors(prev => ({ ...prev, username: null }));
            }
          }} 
          className={errors.username ? 'border-destructive' : ''} 
          placeholder="ej: mariaperez" 
        />
        {errors.username && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.username}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Cédula *</Label>
        <div className="flex gap-2">
          <select
            value={cedulaPrefijo}
            disabled={isEdit}
            onChange={e => { setCedulaPrefijo(e.target.value); setTimeout(() => { validateCedulaUnica() }, 50) }}
            className="flex h-9 w-20 rounded-lg border border-input bg-secondary px-3 py-1 text-sm font-medium shadow-sm focus-visible:outline-none disabled:opacity-50"
          >
            <option value="V">V</option>
            <option value="E">E</option>
          </select>
          <Input 
            type="text"
            inputMode="numeric"
            value={cedulaNumero} 
            onChange={handleCedulaChange}
            onBlur={validateCedulaUnica}
            disabled={isEdit}
            placeholder="30609563" 
            className={cn('flex-1', errors.cedula ? 'border-destructive' : '')}
          />
        </div>
        {errors.cedula && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.cedula}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Contraseña {isEdit ? '(Dejar en blanco para conservar)' : '*'}</Label>
        <div className="relative">
          <Input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={handlePasswordChange} 
            className={cn('pr-10', errors.password ? 'border-destructive' : '')} 
            placeholder={isEdit ? "Escribe nueva contraseña" : "Mínimo 6 caracteres"} 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          {errors.password ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.password}</span>
            </div>
          ) : (
            <span className={cn("text-muted-foreground transition-colors", password.length >= 6 && "text-emerald-500 font-medium")}>
              {password.length >= 6 ? '✓ Longitud válida' : isEdit ? 'Opcional' : 'Mínimo 6 caracteres'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Verificar contraseña {isEdit && password && '*'}</Label>
        <div className="relative">
          <Input 
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange}
            onBlur={validatePasswordsMatch}
            className={cn('pr-10', errors.confirmPassword ? 'border-destructive' : '')} 
            placeholder="Repite la contraseña exactamente" 
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.confirmPassword}</span>
          </div>
        ) : (
          confirmPassword && password === confirmPassword && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium mt-1">
              <span>✓ Las contraseñas coinciden correctamente</span>
            </div>
          )
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input value={telefono} onChange={e => setTelefono(formatPhone(e.target.value))} placeholder="412-7445102" />
      </div>
      
      <div className="space-y-2">
        <Label>Rol *</Label>
        <SearchSelect options={ROLES} value={rol} onChange={setRol} placeholder="Seleccionar..." />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Institución *</Label>
        <SearchSelect options={instituciones} value={instId} onChange={val => { setInstId(val); if (errors.instId) setErrors(p => ({...p, instId: null})) }} placeholder="Seleccionar..." error={!!errors.instId} />
        {errors.instId && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.instId}</span>
          </div>
        )}
      </div>
    </div>
  )

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de usuarios del sistema</p>
        </div>
        <Button 
          onClick={() => { 
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else { 
              resetForm(); 
              setShowForm(true); 
            } 
          }} 
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" /> {showForm ? 'Cerrar' : 'Nuevo'}
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar por nombre, usuario o cédula..."
          className="pl-9"
        />
      </div>

      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-lg">Crear Usuario</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {renderFormFields(false)}
            <Button type="submit" disabled={loading || !!errors.cedula}>{loading ? 'Creando...' : 'Crear Usuario'}</Button>
          </form>
        </Card>
      )}

      {/* Lista de usuarios */}
      <div className="space-y-2">
        {usuarios.map(u => {
          const Rb = ROLE_BADGE[u.rol] || ROLE_BADGE.operador
          const Icon = Rb.icon
          const isEditing = editId === u.id

          return (
            <Card key={u.id} className={cn("p-4 transition-all", isEditing && "border-primary/50 bg-initial")}>
              {isEditing ? (
                <form onSubmit={(e) => handleUpdate(e, u.id)} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="text-sm font-semibold text-primary">Modificando a: {u.nombre} {u.apellido}</span>
                  </div>
                  
                  {renderFormFields(true)}

                  <div className="flex items-center gap-2 pt-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4 mr-1" /> Cancelar
                    </Button>
                    <Button type="submit" size="sm" disabled={loading || !!errors.cedula}>
                      <Check className="w-4 h-4 mr-1" /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{u.nombre} {u.apellido}</p>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground truncate">
                      <span>@{u.username}</span>
                      {u.cedula && (
                        <>
                          <span className="text-border">•</span>
                          <span>{u.cedula}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {u.institucion?.nombre && <span className="text-sm text-muted-foreground hidden md:inline">{u.institucion.nombre}</span>}

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={Rb.variant} className="gap-1"><Icon className="w-3 h-3" />{Rb.label}</Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => startEdit(u)} title="Editar usuario"><Pencil className="w-4 h-4" /></Button>
                    
                    {/* Botón de Restablecer Contraseña */}
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" onClick={() => handleResetPassword(u)} title="Restablecer clave como username" disabled={loading}>
                      <KeyRound className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleToggleActive(u.id, u.activo)} title={u.activo ? 'Desactivar' : 'Activar'}>
                      {u.activo ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
        {loadingList ? (
          <p className="text-center text-muted-foreground py-8">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No se encontraron usuarios</p>
        ) : null}
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />
    </div>
  )
}