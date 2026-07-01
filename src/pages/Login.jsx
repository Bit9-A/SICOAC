import { useState, useEffect } from 'react'
import { LogIn, UserPlus, ScanLine, Clock, Eye, EyeOff, AlertCircle, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { signIn } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { getInstituciones } from '@/lib/api'
import { cn, normalizeText } from '@/lib/utils'
import { toast } from 'sonner'
import Scanner from '@/pages/Scanner'

export default function Login({ onLogin, defaultInstitucionId }) {
  const [mode, setMode] = useState(defaultInstitucionId ? 'register' : 'login')
  const [instituciones, setInstituciones] = useState([])
  const [instLabel, setInstLabel] = useState('')
  const [localInstId, setLocalInstId] = useState(defaultInstitucionId || '')
  const [showScanner, setShowScanner] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [dispDias, setDispDias] = useState([])
  const [dispDesde, setDispDesde] = useState('')
  const [dispHasta, setDispHasta] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estados para alternar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const DIAS = [
    { key: 'L', label: 'Lun' }, { key: 'M', label: 'Mar' }, { key: 'MI', label: 'Mie' },
    { key: 'J', label: 'Jue' }, { key: 'V', label: 'Vie' }, { key: 'S', label: 'Sab' },
    { key: 'D', label: 'Dom' },
  ]

  const HORAS = Array.from({ length: 33 }, (_, i) => {
    const h = Math.floor(i / 2) + 6
    const m = i % 2 === 0 ? '00' : '30'
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
    const operador = n.slice(0, 3)
    const numero = n.slice(3, 10)
    if (numero) return `${operador}-${numero}`
    return operador
  }

  const effectiveInstId = localInstId || defaultInstitucionId

  useEffect(() => {
    if (effectiveInstId) {
      getInstituciones().then(insts => {
        setInstituciones(insts)
        const found = insts.find(i => String(i.value) === String(effectiveInstId))
        if (found) setInstLabel(found.label)
      })
    }
  }, [effectiveInstId])

  function handleQrDetected(code) {
    setShowScanner(false)
    try {
      const url = new URL(code.startsWith('http') ? code : `https://${code}`)
      const inst = url.searchParams.get('inst')
      if (inst) {
        setLocalInstId(inst)
        setMode('register')
        toast.success('Código QR detectado')
      } else {
        toast.error('El código no contiene una institución válida')
      }
    } catch {
      toast.error('Código QR no válido')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    
    if (!username.trim() || !password) {
      toast.warning('Campos incompletos', {
        description: 'Por favor, escribe tu usuario y contraseña para ingresar.',
      })
      setError('Por favor, ingresa tu usuario y contraseña.')
      return
    }
    
    setLoading(true)
    try {
      await signIn({ username: username.trim(), password })
      toast.success(`Bienvenido, ${username}`)
      onLogin?.()
    } catch (err) {
      const isCredentialError = err.message?.includes('Invalid login credentials') || err.status === 400 || err.message?.includes('creden')
      
      if (isCredentialError) {
        const msgError = 'El usuario o la contraseña no coinciden. Por favor, verificalo e intenta nuevamente.'
        setError(msgError)
        
        toast.error('Acceso denegado', {
          description: 'Credenciales inválidas. Revisa tus datos.',
          duration: 5000,
        })
      } else {
        const msgGenerico = 'Hubo un problema de conexión al validar tus datos. Intenta más tarde.'
        setError(msgGenerico)
        toast.error('Error del sistema', { description: err.message || msgGenerico })
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password || !nombre.trim() || !apellido.trim()) {
      setError('Por favor, rellena todos los campos obligatorios (*).')
      return
    }
    if (password.length < 6) {
      setError('La contraseña es muy corta. Debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden. Verifícalas.')
      return
    }

    setLoading(true)
    try {
      const { signUp } = await import('@/lib/auth')
      const instId = effectiveInstId || null
      const normUsername = username.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

      const { data: exist } = await supabase.from('usuarios').select('id').eq('username', normUsername).maybeSingle()
      if (exist) { setError('Este nombre de usuario ya se encuentra registrado.'); setLoading(false); return }

      await signUp({
        username: normUsername,
        password,
        nombre: normalizeText(nombre),
        apellido: normalizeText(apellido),
        cedula: cedula.trim() || null,
        telefono: telefono.trim(),
        rol: 'operador',
        institucionId: instId,
        disponibilidadDias: dispDias.join(','),
        disponibilidadHoraDesde: dispDesde || null,
        disponibilidadHoraHasta: dispHasta || null,
      })
      toast.success('¡Registro exitoso! Ya puedes iniciar sesión.')
      setMode('login')
      setPassword(''); setConfirmPassword('')
      setNombre(''); setApellido(''); setTelefono('')
      setDispDias([]); setDispDesde(''); setDispHasta('')
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-6">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-14 rounded-2xl bg-primary/10">
            <img src="/logo_sicoac.png" alt="Logo SICOAC" />
          </div>
          <h1 className="text-xl font-bold">Centros de Acopio</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Inicia sesión para continuar' : !effectiveInstId ? 'Registro para operadores' : 'Completa tus datos'}
          </p>
        </div>

        <Card className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-user">Usuario</Label>
                <Input
                  id="login-user"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-pass">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Contenedor de Error Amigable */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in-50 duration-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                <LogIn className="w-4 h-4" />
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setShowPassword(false); }}
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate
                </button>
              </p>

              <div className="border-t border-border pt-4 text-center">
                <a
                  href="/instalar"
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Descargar App Móvil (APK) y Guía
                </a>
              </div>
            </form>
          ) : !effectiveInstId ? (
            /* Paso 1: Escanear QR */
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <ScanLine className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Escanea el código QR del administrador del centro de acopio para registrarte
                </p>
              </div>
              <Button type="button" size="lg" className="w-full gap-2" onClick={() => setShowScanner(true)}>
                <ScanLine className="w-4 h-4" />
                Escanear código QR
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setShowPassword(false); }}
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          ) : (
            /* Paso 2: Formulario después del QR */
            <form onSubmit={handleRegister} className="space-y-4">
              {instLabel && (
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm space-y-1">
                  <p className="font-medium text-primary">Registro para:</p>
                  <p className="text-foreground">{instLabel}</p>
                  <p className="text-xs text-muted-foreground">Se registrará como Operador</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reg-cedula">Cédula</Label>
                <Input id="reg-cedula" value={cedula} onChange={e => setCedula(e.target.value.toUpperCase())} placeholder="V-12345678" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-nombre">Nombre <span className="text-destructive">*</span></Label>
                  <Input id="reg-nombre" placeholder="María" value={nombre} onChange={(e) => setNombre(normalizeText(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-apellido">Apellido <span className="text-destructive">*</span></Label>
                  <Input id="reg-apellido" placeholder="Pérez" value={apellido} onChange={(e) => setApellido(normalizeText(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-tel">Teléfono</Label>
                <Input id="reg-tel" type="tel" placeholder="412-7445102" value={telefono} onChange={e => setTelefono(formatPhone(e.target.value))} />
              </div>

              {/* Disponibilidad */}
              <div className="space-y-2 border-t border-border/50 pt-3">
                <Label className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Disponibilidad horaria
                </Label>
                <p className="text-xs text-muted-foreground">Seleccioná los días que podés asistir</p>
                <div className="flex flex-wrap gap-1.5">
                  {DIAS.map(d => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => toggleDia(d.key)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm border transition-colors',
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
                <Label htmlFor="reg-user">Usuario <span className="text-destructive">*</span></Label>
                <Input id="reg-user" placeholder="ej: mariaperez" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
              </div>
              
              {/* Contraseña Registro */}
              <div className="space-y-2">
                <Label htmlFor="reg-pass">Contraseña <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña Registro */}
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirmar contraseña <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Contenedor de Error Amigable Registro */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in-50 duration-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creando...' : 'Crear cuenta'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setShowPassword(false); setShowConfirmPassword(false); }}
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          )}
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          App para registro en centros de acopio
        </p>
      </div>

      {/* QR Scanner overlay */}
      {showScanner && (
        <Scanner
          onDetected={handleQrDetected}
          onClose={() => setShowScanner(false)}
          onManual={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}