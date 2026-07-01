import { useState } from 'react'
import {
  Package, ClipboardList,
  ScanLine, Truck, Home, LogOut,
  LayoutDashboard, Users, Building2, ShoppingBag,
  Tags, QrCode, HeartHandshake, Contact, Car,
  MoreHorizontal, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Primary nav items visible in the bottom bar
const PRIMARY_NAV = {
  super_admin: [
    { id: 'home',       label: 'Inicio',     icon: Home },
    { id: 'inventario', label: 'Stock',       icon: Package },
    { id: 'registros',  label: 'Registros',  icon: ClipboardList },
    { id: 'despachos',  label: 'Despachos',  icon: Truck },
  ],
  admin: [
    { id: 'home',       label: 'Inicio',     icon: Home },
    { id: 'inventario', label: 'Stock',       icon: Package },
    { id: 'registros',  label: 'Registros',  icon: ClipboardList },
    { id: 'despachos',  label: 'Despachos',  icon: Truck },
  ],
  operador: [
    { id: 'home', label: 'Inicio', icon: Home },
  ],
}

// Secondary (overflow) items shown in the "More" drawer
const SECONDARY_NAV = {
  super_admin: [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'productos',     label: 'Productos',     icon: ShoppingBag },
    { id: 'categorias',    label: 'Categorías',    icon: Tags },
    { id: 'usuarios',      label: 'Usuarios',      icon: Users },
    { id: 'instituciones', label: 'Instituciones', icon: Building2 },
    { id: 'choferes',      label: 'Choferes',      icon: Contact },
    { id: 'vehiculos',     label: 'Vehículos',     icon: Car },
    { id: 'voluntarios',   label: 'Voluntarios',   icon: HeartHandshake },
    { id: 'qr',            label: 'QR Registro',   icon: QrCode },
  ],
  admin: [
    { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'productos',  label: 'Productos',  icon: ShoppingBag },
    { id: 'categorias', label: 'Categorías', icon: Tags },
    { id: 'usuarios',   label: 'Usuarios',   icon: Users },
    { id: 'choferes',   label: 'Choferes',   icon: Contact },
    { id: 'vehiculos',  label: 'Vehículos',  icon: Car },
    { id: 'voluntarios', label: 'Voluntarios', icon: HeartHandshake },
    { id: 'qr',         label: 'QR Registro', icon: QrCode },
  ],
  operador: [],
}

export default function BottomNav({ rol, currentPage, onNavigate, onOpenScan, onLogout }) {
  const [showMore, setShowMore] = useState(false)

  const primaryItems = PRIMARY_NAV[rol] || PRIMARY_NAV.operador
  const secondaryItems = SECONDARY_NAV[rol] || []
  const isOperator = rol === 'operador'

  const leftItems = isOperator ? [] : primaryItems.slice(0, 2)
  const rightItems = isOperator ? primaryItems : primaryItems.slice(2)

  // Is the current page in the secondary nav?
  const isSecondaryActive = secondaryItems.some(i => i.id === currentPage)

  function handleNavigate(id) {
    setShowMore(false)
    onNavigate(id)
  }

  return (
    <>
      {/* More drawer overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-[45] md:hidden"
          onClick={() => setShowMore(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="absolute bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-2xl pb-2 safe-area-bottom"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle + header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/50">
              <p className="text-sm font-semibold">Más módulos</p>
              <button
                onClick={() => setShowMore(false)}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of secondary items */}
            <div className="grid grid-cols-4 gap-1 p-3">
              {secondaryItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      isActive ? 'bg-primary/15' : 'bg-secondary/80'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn('text-[11px] text-center leading-tight', isActive ? 'font-semibold' : 'font-medium')}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Logout row */}
            {onLogout && (
              <div className="px-3 pb-1">
                <button
                  onClick={() => { setShowMore(false); onLogout() }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-lg safe-area-bottom">
        <div className="flex items-end h-16 px-1">
          {/* Left primary items */}
          {leftItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2 flex-1 transition-colors h-full',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>{item.label}</span>
              </button>
            )
          })}

          {/* Central Scan FAB */}
          <div className="flex flex-col items-center justify-end flex-shrink-0 px-2 pb-1">
            <button
              onClick={onOpenScan}
              className="flex flex-col items-center gap-0.5"
              aria-label="Registrar"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 -mt-5 border-4 border-card transition-transform active:scale-95">
                <ScanLine className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-[10px] text-primary font-semibold">Registrar</span>
            </button>
          </div>

          {/* Right primary items */}
          {rightItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2 flex-1 transition-colors h-full',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>{item.label}</span>
              </button>
            )
          })}

          {/* "More" button — shown when there are secondary items */}
          {secondaryItems.length > 0 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 flex-1 transition-colors h-full',
                (showMore || isSecondaryActive) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <MoreHorizontal className={cn('w-5 h-5 transition-transform', showMore && 'rotate-90')} />
                {isSecondaryActive && !showMore && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn('text-[10px]', (showMore || isSecondaryActive) ? 'font-semibold' : 'font-medium')}>Más</span>
            </button>
          )}

          {/* Operator: logout directly in bar */}
          {isOperator && onLogout && (
            <button
              onClick={onLogout}
              className="flex flex-col items-center justify-center gap-0.5 py-2 flex-1 transition-colors h-full text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-medium">Salir</span>
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
