import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard, Package, ClipboardList, Users, Building2, Settings, LogOut,
  ScanLine, ChevronLeft, Menu, ShoppingBag, Tags, QrCode, Truck, HeartHandshake, Contact, Car, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = {
  super_admin: [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'inventario',    label: 'Inventario',    icon: Package },
    { id: 'registros',     label: 'Registros',     icon: ClipboardList },
    { id: 'productos',     label: 'Productos',     icon: ShoppingBag },
    { id: 'categorias',    label: 'Categorías',    icon: Tags },
    { id: 'usuarios',      label: 'Usuarios',      icon: Users },
    { id: 'instituciones', label: 'Instituciones',  icon: Building2 },
    { id: 'choferes',      label: 'Choferes',      icon: Contact },
    { id: 'vehiculos',     label: 'Vehículos',     icon: Car },
    { id: 'despachos',     label: 'Despachos',     icon: Truck },
    { id: 'voluntarios',   label: 'Voluntarios',   icon: HeartHandshake },
    { id: 'qr',            label: 'QR Registro',    icon: QrCode },
  ],
  admin: [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'inventario',    label: 'Inventario',    icon: Package },
    { id: 'registros',     label: 'Registros',     icon: ClipboardList },
    { id: 'choferes',      label: 'Choferes',      icon: Contact },
    { id: 'vehiculos',     label: 'Vehículos',     icon: Car },
    { id: 'despachos',     label: 'Despachos',     icon: Truck },
    { id: 'productos',     label: 'Productos',     icon: ShoppingBag },
    { id: 'categorias',    label: 'Categorías',    icon: Tags },
    { id: 'usuarios',      label: 'Usuarios',      icon: Users },
    { id: 'voluntarios',   label: 'Voluntarios',   icon: HeartHandshake },
    { id: 'qr',            label: 'QR Registro',    icon: QrCode },
  ],
}

export default function Sidebar({ rol, currentPage, onNavigate, onLogout, onOpenScan, user, profile }) {
  const [collapsed, setCollapsed] = useState(false)
  const collapsedRef = useRef(collapsed)
  const touchStartRef = useRef(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const items = NAV_ITEMS[rol] || NAV_ITEMS.admin

  const initials = profile ? (profile.nombre?.[0] || '') + (profile.apellido?.[0] || '') : '?'

  useEffect(() => {
    collapsedRef.current = collapsed
  }, [collapsed])

  useEffect(() => {
    const SWIPE_ZONE = window.innerWidth * 0.2
    const THRESHOLD = 50

    const handleTouchStart = (e) => {
      if (e.touches[0].clientX > SWIPE_ZONE) return
      touchStartRef.current = e.touches[0].clientX
    }

    const handleTouchMove = (e) => {
      if (touchStartRef.current === null) return
      const delta = e.touches[0].clientX - touchStartRef.current
      if (delta > THRESHOLD && collapsedRef.current) setCollapsed(false)
      if (delta < -THRESHOLD && !collapsedRef.current) setCollapsed(true)
      touchStartRef.current = null
    }

    const handleTouchEnd = () => {
      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  function handleLogoutClick() {
    setShowUserMenu(false)
    onLogout()
  }

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
            {/* <Package className="w-5 h-5 text-primary" /> */}
            <img src="/logo_sicoac.png" alt="Logo SICOAC" />
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

        {/* User area */}
        {profile && (
          <div className="border-t border-border">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
              title={collapsed ? `${profile.nombre} ${profile.apellido}` : undefined}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">{initials}</span>
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{profile.nombre} {profile.apellido}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile.institucion?.nombre || 'Sin institución'}</p>
                  </div>
                  <ChevronUp className={cn('w-4 h-4 text-muted-foreground transition-transform', showUserMenu && 'rotate-180')} />
                </>
              )}
            </button>

            {!collapsed && showUserMenu && (
              <div className="px-4 pb-3 space-y-2">
                <p className="text-xs text-muted-foreground capitalize">{profile.rol?.replace('_', ' ')}</p>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}

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
