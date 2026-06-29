import { useState, useCallback, useEffect } from 'react'
import { Toaster } from 'sonner'
import { Package } from 'lucide-react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { getSessionCount } from '@/lib/storage'
import AppLayout from '@/components/layout/AppLayout'
import Home from '@/pages/Home'
import Scanner from '@/pages/Scanner'
import Form from '@/pages/Form'
import Login from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import InventarioPage from '@/pages/Inventario'
import UsuariosPage from '@/pages/Usuarios'
import InstitucionesPage from '@/pages/Instituciones'
import ProductosPage from '@/pages/Productos'
import CategoriasPage from '@/pages/Categorias'
import RegistrosPage from '@/pages/Registros'

function AppContent() {
  const { user, profile, loading, logout, rol, isOperator, isAdmin } = useAuth()

  const [page, setPage] = useState('home')
  const [showScanner, setShowScanner] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [sessionCount, setSessionCount] = useState(getSessionCount)

  const refreshSessionCount = useCallback(() => setSessionCount(getSessionCount()), [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {})
    }
  }, [])

  const goHome = useCallback(() => {
    setShowScanner(false)
    setPage('home')
    setBarcode('')
    refreshSessionCount()
  }, [refreshSessionCount])

  const openScan = useCallback(() => setShowScanner(true), [])
  const closeScan = useCallback(() => setShowScanner(false), [])

  const onDetected = useCallback((code) => {
    setBarcode(code)
    setShowScanner(false)
    setPage('form')
  }, [])

  const onManual = useCallback(() => {
    setShowScanner(false)
    setPage('form')
  }, [])

  const onOpenManual = useCallback(() => setPage('form'), [])

  const handleNavigate = useCallback((p) => {
    setPage(p)
    setShowScanner(false)
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  // Loading
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Package className="w-10 h-10 text-primary animate-pulse mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Login
  if (!user) return <Login onLogin={() => {}} />

  return (
    <AppLayout
      rol={rol}
      currentPage={page}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onOpenScan={openScan}
    >
      {/* Home — todos los roles */}
      {page === 'home' && (
        <Home
          onStartScan={openScan}
          onStartManual={onOpenManual}
          sessionCount={sessionCount}
        />
      )}

      {/* Form — todos */}
      {page === 'form' && (
        <Form
          barcode={barcode}
          onBack={goHome}
          onScanAgain={openScan}
          onSaved={refreshSessionCount}
          userProfile={profile}
        />
      )}

      {/* Dashboard — admin+ */}
      {page === 'dashboard' && isAdmin && <DashboardPage />}

      {/* Inventario — admin+ */}
      {page === 'inventario' && isAdmin && <InventarioPage />}

      {/* Usuarios — admin+ (super_admin ve todo, admin ve su inst) */}
      {page === 'usuarios' && isAdmin && <UsuariosPage />}

      {/* Productos — admin+ */}
      {page === 'productos' && isAdmin && <ProductosPage />}

      {/* Categorías — admin+ */}
      {page === 'categorias' && isAdmin && <CategoriasPage />}

      {/* Registros — admin+ */}
      {page === 'registros' && isAdmin && <RegistrosPage />}

      {/* Instituciones — solo super_admin */}
      {page === 'instituciones' && rol === 'super_admin' && <InstitucionesPage />}

      {/* Scanner overlay */}
      {showScanner && (
        <Scanner onDetected={onDetected} onClose={closeScan} onManual={onManual} />
      )}

      <Toaster position="top-center" richColors closeButton duration={3000} />
    </AppLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
