import { useState } from 'react'
import {
  LayoutDashboard, Package, ClipboardList, Users, Building2, Settings, LogOut,
  ScanLine, ChevronLeft, Menu, ShoppingBag, Tags, Sun, Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

const NAV_ITEMS = {
  super_admin: [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'inventario',    label: 'Inventario',    icon: Package },
    { id: 'registros',     label: 'Registros',     icon: ClipboardList },
    { id: 'productos',     label: 'Productos',     icon: ShoppingBag },
    { id: 'categorias',    label: 'Categorías',    icon: Tags },
    { id: 'usuarios',      label: 'Usuarios',      icon: Users },
    { id: 'instituciones', label: 'Instituciones',  icon: Building2 },
  ],
  admin: [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'inventario',    label: 'Inventario',    icon: Package },
    { id: 'registros',     label: 'Registros',     icon: ClipboardList },
    { id: 'productos',     label: 'Productos',     icon: ShoppingBag },
    { id: 'categorias',    label: 'Categorías',    icon: Tags },
    { id: 'usuarios',      label: 'Usuarios',      icon: Users },
  ],
}

export default function Sidebar({ rol, currentPage, onNavigate, onLogout, onOpenScan }) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggle } = useTheme()
  const items = NAV_ITEMS[rol] || NAV_ITEMS.admin

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setCollapsed(true)} />
      )}

      <aside className={cn(
        'fixed md:static inset-y-0 left-0 z-30 flex flex-col bg-card border-r border-border transition-all duration-200',
        collapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'w-64 translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 h-14 px-4 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && <span className="font-bold text-sm truncate">Centros de Acopio</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto w-7 h-7 rounded-md hover:bg-secondary flex items-center justify-center shrink-0"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            onClick={onOpenScan}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            <ScanLine className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Registrar</span>}
          </button>

          <div className="my-3 border-t border-border/50" />

          {items.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Theme toggle + logout */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {!collapsed && <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Mobile hamburger */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-3 left-3 z-20 w-10 h-10 rounded-lg bg-card border border-border shadow flex items-center justify-center md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
