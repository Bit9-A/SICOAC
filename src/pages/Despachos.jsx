import { useState, useEffect, useRef } from 'react'
import {
  Truck, Plus, Search, X, Printer, Eye, Package, Building2, Minus, PlusCircle,
  FileText, ArrowRight, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { getInstituciones, searchProducts, crearDespacho, getDespachos, getDespachoConMovimientos } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'

export default function DespachosPage() {
  const { institucionId, isSuperAdmin, userProfile } = useAuth()
  const printRef = useRef(null)

  const [despachos, setDespachos] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [view, setView] = useState('list') // list | create | guide
  const [guia, setGuia] = useState(null)

  // Create form
  const [origenId, setOrigenId] = useState(isSuperAdmin ? '' : String(institucionId || ''))
  const [destinoId, setDestinoId] = useState('')
  const [transportista, setTransportista] = useState('')
  const [vehiculo, setVehiculo] = useState('')
  const [placa, setPlaca] = useState('')
  const [notas, setNotas] = useState('')
  const [cart, setCart] = useState([]) // { nombre, cantidad, unidad }
  const [prodSearch, setProdSearch] = useState('')
  const [prodResults, setProdResults] = useState([])
  const [prodSearching, setProdSearching] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [d, insts] = await Promise.all([getDespachos(), getInstituciones()])
    setDespachos(d)
    setInstituciones(insts)
  }

  // Product search
  useEffect(() => {
    if (prodSearch.trim().length < 2) { setProdResults([]); return }
    const timer = setTimeout(async () => {
      setProdSearching(true)
      const res = await searchProducts(prodSearch)
      setProdResults(res)
      setProdSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [prodSearch])

  function addToCart(prod) {
    const existing = cart.find(c => c.nombre === prod.productName)
    if (existing) {
      setCart(cart.map(c => c.nombre === prod.productName ? { ...c, cantidad: c.cantidad + 1 } : c))
    } else {
      setCart([...cart, { nombre: prod.productName, id: prod.productId, cantidad: 1, unidad: prod.presentation || 'unidades' }])
    }
    setProdSearch(''); setProdResults([])
    toast.success(`${prod.productName} agregado`)
  }

  function removeFromCart(idx) {
    setCart(cart.filter((_, i) => i !== idx))
  }

  function updateCant(idx, val) {
    setCart(cart.map((c, i) => i === idx ? { ...c, cantidad: Math.max(1, Number(val) || 1) } : c))
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!transportista.trim()) return toast.warning('Nombre del transportista obligatorio')
    if (!vehiculo.trim()) return toast.warning('Vehículo obligatorio')
    if (!origenId) return toast.warning('Selecciona el origen')
    if (!destinoId) return toast.warning('Selecciona el destino')
    if (origenId === destinoId) return toast.warning('Origen y destino deben ser diferentes')
    if (cart.length === 0) return toast.warning('Agrega al menos un producto')

    try {
      const desp = await crearDespacho({
        institucionOrigenId: origenId,
        institucionDestinoId: destinoId,
        transportista: normalizeText(transportista),
        vehiculo: normalizeText(vehiculo),
        placa: placa.trim(),
        notas: normalizeText(notas),
        productos: cart,
      })
      toast.success(`Despacho #${desp.id} creado`)
      loadData()
      setView('list')
      resetForm()
    } catch (err) { toast.error(err.message) }
  }

  function resetForm() {
    setTransportista(''); setVehiculo(''); setPlaca(''); setNotas('')
    setCart([]); setProdSearch(''); setProdResults([])
  }

  async function handleViewGuia(id) {
    try {
      const g = await getDespachoConMovimientos(id)
      setGuia(g)
      setView('guide')
    } catch (err) { toast.error(err.message) }
  }

  function handlePrint() {
    window.print()
  }

  const instOrigen = instituciones.find(i => String(i.value) === String(origenId))
  const instDestino = instituciones.find(i => String(i.value) === String(destinoId))

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Despachos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {view === 'list' && 'Gestión de guías de carga y transporte'}
            {view === 'create' && 'Nuevo despacho'}
            {view === 'guide' && 'Guía de despacho'}
          </p>
        </div>
        <div className="flex gap-2">
          {view !== 'list' && (
            <Button variant="outline" onClick={() => { setView('list'); setGuia(null) }}>Volver</Button>
          )}
          {view === 'list' && (
            <Button className="gap-2" onClick={() => setView('create')}>
              <Plus className="w-4 h-4" /> Nuevo Despacho
            </Button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="space-y-2">
          {despachos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No hay despachos registrados</p>
          )}
          {despachos.map(d => (
            <Card key={d.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Despacho #{d.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(d.created_at).toLocaleDateString('es-VE', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground hidden md:block max-w-[200px] truncate">
                  {d.institucion_origen?.nombre} → {d.institucion_destino?.nombre}
                </div>
                <div className="text-sm text-muted-foreground hidden lg:block truncate max-w-[150px]">
                  {d.transportista}
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleViewGuia(d.id)}>
                  <Eye className="w-4 h-4" /> Ver Guía
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE VIEW */}
      {view === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Institution selects */}
          <Card className="p-4 md:p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4" /> Origen y Destino</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institución Origen *</Label>
                <SearchSelect options={instituciones.filter(i => String(i.value) !== String(destinoId))} value={origenId} onChange={setOrigenId} placeholder="Seleccionar..." />
              </div>
              <div className="space-y-2">
                <Label>Institución Destino *</Label>
                <SearchSelect options={instituciones.filter(i => String(i.value) !== String(origenId))} value={destinoId} onChange={setDestinoId} placeholder="Seleccionar..." />
              </div>
            </div>
          </Card>

          {/* Transport info */}
          <Card className="p-4 md:p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" /> Datos del Transporte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Transportista *</Label><Input value={transportista} onChange={e => setTransportista(e.target.value)} placeholder="Nombre del conductor" /></div>
              <div className="space-y-2"><Label>Vehículo *</Label><Input value={vehiculo} onChange={e => setVehiculo(e.target.value)} placeholder="Ej: Camión 350" /></div>
              <div className="space-y-2"><Label>Placa</Label><Input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="Opcional" /></div>
            </div>
            <div className="space-y-2"><Label>Notas</Label><Textarea rows={2} value={notas} onChange={e => setNotas(e.target.value)} placeholder="Instrucciones adicionales..." /></div>
          </Card>

          {/* Products cart */}
          <Card className="p-4 md:p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Package className="w-4 h-4" /> Productos a despachar</h3>

            {/* Product search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Buscar producto para agregar..." className="pl-9" />
              {prodResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-lg max-h-48 overflow-auto">
                  {prodResults.map(p => (
                    <button key={p.value} type="button" onClick={() => addToCart(p)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2">
                      <PlusCircle className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="font-medium">{p.productName}</span>
                      {p.detail && <span className="text-muted-foreground">— {p.detail}</span>}
                    </button>
                  ))}
                </div>
              )}
              {prodSearching && <p className="text-xs text-muted-foreground mt-1">Buscando...</p>}
            </div>

            {/* Cart items */}
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Busca y agrega productos al despacho</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                    <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-sm font-medium truncate">{item.nombre}</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" min="1" value={item.cantidad} onChange={e => updateCant(idx, e.target.value)}
                        className="w-16 h-8 text-sm text-center" />
                      <span className="text-xs text-muted-foreground w-12">{item.unidad}</span>
                    </div>
                    <button type="button" onClick={() => removeFromCart(idx)} className="text-destructive hover:text-destructive/80">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-right">{cart.length} producto(s)</p>
              </div>
            )}
          </Card>

          <Button type="submit" size="lg" className="w-full gap-2">
            <FileText className="w-4 h-4" /> Confirmar Despacho y Generar Guía
          </Button>
        </form>
      )}

      {/* GUIDE VIEW (printable) */}
      {view === 'guide' && guia && (
        <>
          {/* Print button - hidden when printing */}
          <div className="no-print flex justify-center">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Imprimir Guía
            </Button>
          </div>

          {/* Guide document */}
          <div ref={printRef} className="guide-print bg-white text-black rounded-xl p-6 md:p-8 space-y-6 shadow-lg">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-4">
              <h2 className="text-xl font-bold uppercase">Guía de Despacho</h2>
              <p className="text-sm text-gray-600">Centros de Acopio — SICOAC</p>
              <p className="text-sm text-gray-600">N° {guia.id} — {new Date(guia.created_at).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Origen:</p>
                <p>{guia.institucion_origen?.nombre || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Destino:</p>
                <p>{guia.institucion_destino?.nombre || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Transportista:</p>
                <p>{guia.transportista}</p>
              </div>
              <div>
                <p className="font-semibold">Vehículo:</p>
                <p>{guia.vehiculo}{guia.placa ? ` — Placa: ${guia.placa}` : ''}</p>
              </div>
            </div>

            {guia.notas && (
              <div className="text-sm">
                <p className="font-semibold">Notas:</p>
                <p className="text-gray-600">{guia.notas}</p>
              </div>
            )}

            {/* Products table */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Producto</th>
                  <th className="text-right py-2 px-2">Cantidad</th>
                  <th className="text-right py-2 px-2">Unidad</th>
                </tr>
              </thead>
              <tbody>
                {guia.movimientos.map((m, i) => (
                  <tr key={m.id} className="border-b border-gray-200">
                    <td className="py-2 px-2">{i + 1}</td>
                    <td className="py-2 px-2">{m.producto?.nombre || '—'}</td>
                    <td className="py-2 px-2 text-right font-medium">{Number(m.cantidad).toFixed(0)}</td>
                    <td className="py-2 px-2 text-right">{m.unidad || 'unidades'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature lines */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-sm">
              <div>
                <p className="font-semibold mb-8">Entregué conforme:</p>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-gray-500">{guia.transportista}</p>
                  <p className="text-gray-400 text-xs">Firma y cédula del transportista</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-8">Recibí conforme:</p>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-gray-400 text-xs">Nombre, firma y cédula del receptor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Print styles */}
          <style>{`
            @media print {
              body { background: white; }
              .no-print { display: none !important; }
              .guide-print { box-shadow: none; margin: 0; padding: 0; border-radius: 0; }
              @page { margin: 1.5cm; }
            }
          `}</style>
        </>
      )}
    </div>
  )
}
