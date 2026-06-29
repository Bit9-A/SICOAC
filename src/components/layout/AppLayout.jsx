import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import Sidebar from './Sidebar'

export default function AppLayout({
  rol, currentPage, onNavigate, onLogout, onOpenScan, children
}) {
  const { theme, toggle } = useTheme()
  const isOperator = rol === 'operador'

  // Operador: layout simple sin sidebar
  if (isOperator) {
    return (
      <div className="h-dvh flex flex-col bg-background overflow-hidden">
        <header className="flex items-center justify-end px-4 py-2 border-b border-border bg-card/50 shrink-0">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={toggle} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </header>
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
