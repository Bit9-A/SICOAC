import { useState } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout({
  rol, currentPage, onNavigate, onLogout, onOpenScan, user, profile, children
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isOperator = rol === 'operador'

  function handleLogoutRequest() {
    setShowConfirm(true)
  }

  function handleConfirmLogout() {
    setShowConfirm(false)
    onLogout()
  }

  const confirmDialog = (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
      <div className="bg-card rounded-xl p-6 w-full max-w-sm mx-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-semibold text-lg">¿Cerrar sesión?</h3>
        <p className="text-sm text-muted-foreground mt-2">¿Estás seguro de que deseas cerrar la sesión?</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-input hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmLogout}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )

  // Operador: simple layout, no sidebar — bottom nav only on mobile
  if (isOperator) {
    return (
      <div className="h-dvh flex flex-col bg-background overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {children}
        </main>
        <BottomNav
          rol={rol}
          currentPage={currentPage}
          onNavigate={onNavigate}
          onOpenScan={onOpenScan}
          onLogout={handleLogoutRequest}
        />
        {showConfirm && confirmDialog}
      </div>
    )
  }

  // Admin / Super Admin: sidebar on desktop, bottom nav on mobile
  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      {/* Sidebar — only visible on md+ */}
      <div className="hidden md:flex h-full">
        <Sidebar
          rol={rol}
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={handleLogoutRequest}
          onOpenScan={onOpenScan}
          user={user}
          profile={profile}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main content — add bottom padding for mobile bottom nav */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — only on mobile */}
      <BottomNav
        rol={rol}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenScan={onOpenScan}
        onLogout={handleLogoutRequest}
      />

      {showConfirm && confirmDialog}
    </div>
  )
}
