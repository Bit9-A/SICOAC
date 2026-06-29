import { useState } from 'react'
import { Package, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { signIn } from '@/lib/auth'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login') // login | register
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Completá usuario y contraseña')
      return
    }
    setLoading(true)
    try {
      await signIn({ username: username.trim(), password })
      toast.success(`Bienvenido, ${username}`)
      onLogin?.()
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password || !nombre.trim() || !apellido.trim()) {
      setError('Completá todos los campos obligatorios')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      // Dynamic import para no cargar signUp siempre
      const { signUp } = await import('@/lib/auth')
      await signUp({
        username: username.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        password,
        nombre: normalizeText(nombre),
        apellido: normalizeText(apellido),
        telefono: telefono.trim(),
        institucionId: null,
      })
      toast.success('Usuario creado — ahora iniciá sesión')
      setMode('login')
      setPassword('')
      setConfirmPassword('')
      setNombre('')
      setApellido('')
      setTelefono('')
    } catch (err) {
      setError(err.message || 'Error al registrar')
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
            {/* <Package className="w-8 h-8 text-primary" /> */}
            <img src="./src/assets/logo_sicoac.png" alt="Logo SICOAC" />
          </div>
          <h1 className="text-xl font-bold">Centros de Acopio</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Iniciá sesión para continuar' : 'Creá tu cuenta'}
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
                <Input
                  id="login-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                <LogIn className="w-4 h-4" />
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿No tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError('') }}
                  className="text-primary hover:underline font-medium"
                >
                  Registrate
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
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
                <Input id="reg-tel" type="tel" placeholder="0412-1234567" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-user">Usuario <span className="text-destructive">*</span></Label>
                <Input id="reg-user" placeholder="ej: mariaperez" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-pass">Contraseña <span className="text-destructive">*</span></Label>
                <Input id="reg-pass" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirmar contraseña <span className="text-destructive">*</span></Label>
                <Input id="reg-confirm" type="password" placeholder="Repetí la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creando...' : 'Crear cuenta'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError('') }}
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
    </div>
  )
}
