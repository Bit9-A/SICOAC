import Sidebar from './Sidebar'

export default function AppLayout({
  rol, currentPage, onNavigate, onLogout, onOpenScan, children
}) {
  const isOperator = rol === 'operador'

  // Operador: layout simple sin sidebar
  if (isOperator) {
    return (
      <div className="h-dvh flex flex-col bg-background overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    )
  }

  // Admin / Super Admin: layout con sidebar
  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      <Sidebar
        rol={rol}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onOpenScan={onOpenScan}
      />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
