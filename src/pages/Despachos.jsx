import { useState, useEffect, useRef } from 'react'
import {
  Truck, Plus, Search, X, Printer, Eye, Package, Building2, PlusCircle,
  FileText, Contact, Hash, CheckCircle, XCircle, AlertTriangle, ArrowUpRight, ArrowDownLeft, Download, ScanLine
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { supabase } from '@/lib/supabase'
import { findProductByBarcode } from '@/lib/api'
import { getInstituciones } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { normalizeText } from '@/lib/utils'
import { toast } from 'sonner'
import Scanner from '@/pages/Scanner'

// Importamos la librería para conversión a PDF
import html2pdf from 'html2pdf.js'

export default function DespachosPage() {
  const { institucionId, isSuperAdmin, user, userProfile } = useAuth()
  const printRef = useRef(null)

  const [despachos, setDespachos] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [choferes, setChoferes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  
  const [view, setView] = useState('list') 
  const [guia, setGuia] = useState(null)
  const [activeTab, setActiveTab] = useState('salidas') 

  // Modales personalizados de confirmación
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Form states
  const [origenId, setOrigenId] = useState(isSuperAdmin ? '' : String(institucionId || ''))
  const [destinoId, setDestinoId] = useState('')
  const [choferId, setChoferId] = useState('')
  const [vehiculoId, setVehiculoId] = useState('')
  const [detallesDestino, setDetallesDestino] = useState('')
  
  const [cart, setCart] = useState([]) 
  const [prodSearch, setProdSearch] = useState('')
  const [prodResults, setProdResults] = useState([])
  const [prodSearching, setProdSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => { 
    if (view === 'list') fetchDespachos() 
  }, [activeTab, origenId])

  useEffect(() => { loadData() }, [origenId])

  async function loadData() {
    const [insts, choferesRes, vehiculosRes] = await Promise.all([
      getInstituciones(),
      supabase.from('chofer').select('*').eq('activo', true).order('nombre'),
      supabase.from('vehiculo').select('*').eq('activo', true).order('modelo')
    ])

    setInstituciones(insts)
    setChoferes((choferesRes.data || []).map(c => ({ value: String(c.id), label: `${c.nombre} ${c.apellido} — C.I: ${c.cedula}` })))
    setVehiculos((vehiculosRes.data || []).map(v => ({ value: String(v.id), label: `${v.marca || ''} ${v.modelo} [Placa: ${v.placa}]` })))
    
    fetchDespachos()
  }

  async function fetchDespachos() {
    let q = supabase
      .from('despacho')
      .select(`
        id, created_at, numero_guia, estado_entrega, detalles_destino,
        institucion_origen_id, institucion_destino_id,
        origen:institucion_origen_id (nombre),
        destino:institucion_destino_id (nombre),
        chofer:chofer_id (nombre, apellido),
        vehiculo:vehiculo_id (marca, modelo, placa)
      `)
      .order('created_at', { ascending: false })

    if (!isSuperAdmin && institucionId) {
      if (activeTab === 'salidas') {
        q = q.eq('institucion_origen_id', institucionId)
      } else {
        q = q.eq('institucion_destino_id', institucionId)
      }
    }

    const { data, error } = await q
    if (error) toast.error('Error al cargar rutas: ' + error.message)
    setDespachos(data || [])
  }

  useEffect(() => {
    if (prodSearch.trim().length < 2 || !origenId) { setProdResults([]); return }
    
    const timer = setTimeout(async () => {
      setProdSearching(true)
      const { data, error } = await supabase
        .from('inventario') 
        .select(`
          cantidad,
          producto:producto_id (id, nombre, presentacion)
        `)
        .eq('institucion_id', Number(origenId))
        .gt('cantidad', 0)
        .ilike('producto.nombre', `%${prodSearch}%`)

      if (error) {
        setProdResults([])
      } else {
        const formated = (data || [])
          .filter(item => item.producto)
          .map(item => ({
            productId: item.producto.id,
            productName: item.producto.nombre,
            presentation: item.producto.presentacion,
            stockDisponible: item.cantidad
          }))
        setProdResults(formated)
      }
      setProdSearching(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [prodSearch, origenId])

  function addToCart(prod) {
    const existing = cart.find(c => c.id === prod.productId)
    if (existing) {
      if (existing.cantidad >= prod.stockDisponible) {
        return toast.error(`No puedes despachar más de lo disponible (${prod.stockDisponible} en stock)`)
      }
      setCart(cart.map(c => c.id === prod.productId ? { ...c, cantidad: c.cantidad + 1 } : c))
    } else {
      setCart([...cart, { 
        id: prod.productId, 
        nombre: prod.productName, 
        cantidad: 1, 
        unidad: prod.presentation || 'unidades',
        maxStock: prod.stockDisponible
      }])
    }
    setProdSearch(''); setProdResults([])
    toast.success(`${prod.productName} añadido al lote`)
  }

  function updateCant(id, val) {
    setCart(cart.map(c => {
      if (c.id !== id) return c
      if (val === '' || val === '0') return { ...c, cantidad: val }
      const num = Number(val)
      if (isNaN(num) || num < 1) return c
      if (num > c.maxStock) {
        toast.warning(`Cantidad ajustada al stock máximo disponible (${c.maxStock})`)
        return { ...c, cantidad: c.maxStock }
      }
      return { ...c, cantidad: num }
    }))
  }

  function handleCantBlur(id) {
    setCart(cart.map(c => {
      if (c.id !== id) return c
      if (c.cantidad === '' || c.cantidad === '0' || Number(c.cantidad) < 1) {
        return { ...c, cantidad: 1 }
      }
      return c
    }))
  }

  function resetForm() {
    setDestinoId(''); setChoferId(''); setVehiculoId(''); setDetallesDestino(''); setCart([])
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!origenId) return toast.warning('Selecciona origen')
    if (!destinoId) return toast.warning('Selecciona destino')
    if (origenId === destinoId) return toast.warning('Origen y destino deben ser distintos')
    if (!choferId || !vehiculoId) return toast.warning('Asigna chofer y vehículo activos')
    if (cart.length === 0) return toast.warning('El cargamento está vacío')

    setLoading(true)
    let despInsertedId = null

    try {
      const { data: tipoMov } = await supabase.from('tipo_movimiento').select('id').eq('nombre', 'Transferencia').single()
      if (!tipoMov) throw new Error("Tipo de movimiento 'Transferencia' ausente.")

      const ahora = new Date()
      const nGuiaGenerated = `GD-${ahora.toISOString().replace(/[-T:.Z]/g, '').slice(0, 12)}`

      const { data: despInserted, error: despErr } = await supabase
        .from('despacho')
        .insert({
          numero_guia: nGuiaGenerated,
          institucion_origen_id: Number(origenId),
          institucion_destino_id: Number(destinoId),
          chofer_id: Number(choferId),
          vehiculo_id: Number(vehiculoId),
          detalles_destino: normalizeText(detallesDestino),
          created_by: user?.id || null
        })
        .select().single()

      if (despErr) throw despErr
      despInsertedId = despInserted.id

      const movimientosLote = cart.map(item => ({
        institucion_origen_id: Number(origenId),
        institucion_destino_id: Number(destinoId),
        tipo_movimiento_id: tipoMov.id,
        estado: 'enviado', 
        created_by: user?.id || null,
        despacho_id: despInserted.id, 
        producto_id: item.id,
        cantidad: Number(item.cantidad), 
        unidad: item.unidad
      }))

      const { error: movsErr } = await supabase.from('movimiento').insert(movimientosLote)
      
      if (movsErr) {
        await supabase.from('despacho').delete().eq('id', despInsertedId)
        throw movsErr
      }

      toast.success('¡Despacho exitoso y stock descontado!', { description: `Guía: ${nGuiaGenerated}` })
      resetForm(); setView('list'); fetchDespachos()
    } catch (err) {
      toast.error('Error al despachar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompletarEntrega() {
    const despachoIdNumerico = Number(guia.id)
    setActionLoading(true)
    try {
      const { data: movsActualizados, error: movsErr } = await supabase
        .from('movimiento')
        .update({ 
          estado: 'recibido',
          recibido_en: new Date().toISOString()
        })
        .eq('despacho_id', despachoIdNumerico)
        .eq('estado', 'enviado')
        .select()

      if (movsErr) throw movsErr

      if (!movsActualizados || movsActualizados.length === 0) {
        throw new Error("No se encontraron insumos pendientes para este camión.");
      }

      const { error: despErr } = await supabase
        .from('despacho')
        .update({ estado_entrega: 'Entregado' })
        .eq('id', despachoIdNumerico)

      if (despErr) throw despErr

      toast.success('¡Cargamento Recibido!', {
        description: `Se cargaron exitosamente ${movsActualizados.length} insumos al destino.`
      })
      
      setShowDeliveryModal(false)
      setView('list')
      await fetchDespachos() 
    } catch (err) {
      toast.error('Error al recibir: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancelatEntrega() {
    const despachoIdNumerico = Number(guia.id)
    setActionLoading(true)
    try {
      const { data: tipoEntrada } = await supabase.from('tipo_movimiento').select('id').eq('nombre', 'Entrada').single()
      if (!tipoEntrada) throw new Error("Tipo de movimiento 'Entrada' no encontrado en el esquema.")

      const { data: movimientos, error: fetchErr } = await supabase
        .from('movimiento')
        .select('producto_id, institucion_origen_id, institucion_destino_id, cantidad, unidad')
        .eq('despacho_id', despachoIdNumerico)
        .eq('estado', 'enviado')

      if (fetchErr) throw fetchErr

      if (movimientos && movimientos.length > 0) {
        const nuevosMovimientosKardex = []

        for (const mov of movimientos) {
          const { data: currentInv } = await supabase
            .from('inventario')
            .select('cantidad')
            .eq('producto_id', mov.producto_id)
            .eq('institucion_id', mov.institucion_origen_id)
            .single()

          const stockPrevio = currentInv ? Number(currentInv.cantidad) : 0
          const nuevaCantidad = stockPrevio + Number(mov.cantidad)

          const { error: invErr } = await supabase
            .from('inventario')
            .upsert({
              producto_id: mov.producto_id,
              institucion_id: mov.institucion_origen_id,
              cantidad: nuevaCantidad,
              updated_at: new Date().toISOString()
            }, { onConflict: 'producto_id,institucion_id' })

          if (invErr) throw invErr

          nuevosMovimientosKardex.push({
            institucion_origen_id: mov.institucion_destino_id, 
            institucion_destino_id: mov.institucion_origen_id, 
            tipo_movimiento_id: tipoEntrada.id,
            estado: 'completado', 
            created_by: user?.id || null,
            despacho_id: despachoIdNumerico, 
            producto_id: mov.producto_id,
            cantidad: Number(mov.cantidad),
            unidad: mov.unidad
          })
        }

        if (nuevosMovimientosKardex.length > 0) {
          const { error: insertMovErr } = await supabase.from('movimiento').insert(nuevosMovimientosKardex)
          if (insertMovErr) throw insertMovErr
        }
      }

      await supabase.from('movimiento').update({ estado: 'cancelado' }).eq('despacho_id', despachoIdNumerico).eq('estado', 'enviado')
      await supabase.from('despacho').update({ estado_entrega: 'Cancelado' }).eq('id', despachoIdNumerico)

      toast.error('Despacho cancelado.', { 
        description: 'La ruta fue anulada, el stock retornó al origen y se registró la devolución en el Kardex.' 
      })
      
      setShowCancelModal(false)
      setView('list')
      await fetchDespachos()
    } catch (err) {
      toast.error('Fallo al cancelar despacho: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleViewGuia(id) {
    try {
      const { data, error } = await supabase
        .from('despacho')
        .select(`
          id, created_at, numero_guia, estado_entrega, detalles_destino,
          institucion_origen_id, institucion_destino_id,
          origen:institucion_origen_id (nombre, direccion),
          destino:institucion_destino_id (nombre, direccion),
          chofer:chofer_id (nombre, apellido, cedula, telefono),
          vehiculo:vehiculo_id (marca, modelo, placa, capacidad_carga)
        `)
        .eq('id', id).single()

      if (error) throw error

      const { data: itemsData } = await supabase
        .from('movimiento')
        .select('id, cantidad, unidad, producto:producto_id (nombre, presentacion)')
        .eq('despacho_id', id)

      setGuia({ ...data, items: itemsData || [] })
      setView('guide')
    } catch (err) {
      toast.error('Error al generar la vista de la guía: ' + err.message)
    }
  }

  // LOGICA PARA EXPORTAR EL ELEMENTO HTML A UN PDF DIGITAL PERFECTO
  function handleDownloadPDF() {
    const elemento = printRef.current;
    const opciones = {
      margin:       [10, 10, 10, 10], // Margen de seguridad estándar
      filename:     `Guia_Despacho_${guia.numero_guia}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false }, // Duplica la escala para alta definición
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' } // Formato Carta Oficial
    };

    toast.promise(
      html2pdf().set(opciones).from(elemento).save(),
      {
        loading: 'Cargando hoja de Ruta...',
        success: '¡Formato PDF generado y descargado con éxito!',
        error: 'Fallo al estructurar el PDF digital.'
      }
    );
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id))
  }

  async function handleBarcodeDetected(code) {
    setShowScanner(false)
    if (!origenId) return toast.warning('Selecciona un origen primero')

    const prod = await findProductByBarcode(code)
    if (!prod) return toast.error('Producto no encontrado para el código: ' + code)

    const { data: inv } = await supabase
      .from('inventario')
      .select('cantidad')
      .eq('producto_id', prod.id)
      .eq('institucion_id', Number(origenId))
      .maybeSingle()

    const stockDisponible = inv ? Number(inv.cantidad) : 0
    if (stockDisponible <= 0) return toast.warning('No hay stock disponible de este producto en el origen')

    addToCart({ productId: prod.id, productName: prod.productName, presentation: prod.presentation, stockDisponible })
    toast.success(`${prod.productName} añadido por código de barras`)
  }

  const esInstitucionReceptora = guia ? String(guia.institucion_destino_id) === String(institucionId) : false
  const esInstitucionEmisora = guia ? String(guia.institucion_origen_id) === String(institucionId) : false

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 relative">
      
      {/* MODAL DE CONFIRMACIÓN DE ENTREGA */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in no-print">
          <Card className="p-6 max-w-md w-full space-y-4 shadow-xl border border-emerald-100">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">¿Confirmar Recepción de Carga?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al confirmar, los suministros declarados en esta guía se darán por ingresados de forma definitiva y se sumarán al inventario de tu centro receptor. Esta acción es irreversible.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeliveryModal(false)} disabled={actionLoading}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleCompletarEntrega} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
                {actionLoading ? 'Procesando...' : 'Sí, confirmar llegada'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in no-print">
          <Card className="p-6 max-w-md w-full space-y-4 shadow-xl border border-destructive/10">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">¿Anular Ruta de Despacho?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ¿Estás seguro de cancelar esta salida? El cargamento completo se declarará en reversa y las unidades de stock se reincorporarán automáticamente al inventario de origen.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCancelModal(false)} disabled={actionLoading}>
                Cerrar Ventana
              </Button>
              <Button variant="destructive" size="sm" onClick={handleCancelatEntrega} disabled={actionLoading} className="font-medium">
                {actionLoading ? 'Extornando...' : 'Sí, anular y reincorporar'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 no-print">
        <div>
          <h1 className="text-2xl font-bold">Despachos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {view === 'list' && 'Gestión de guías de carga y transporte de suministros'}
            {view === 'create' && 'Registrar nueva salida de recursos'}
            {view === 'guide' && 'Documento oficial de ruta de entrega'}
          </p>
        </div>
        <div className="flex gap-2">
          {view !== 'list' && (
            <Button variant="outline" onClick={() => { setView('list'); setGuia(null) }}>Volver al Listado</Button>
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
        <div className="space-y-4 no-print">
          {!isSuperAdmin && (
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setActiveTab('salidas')}
                className={`pb-2.5 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'salidas' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-slate-700'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-orange-500" /> Salidas / Mis Despachos
              </button>
              <button
                onClick={() => setActiveTab('entradas')}
                className={`pb-2.5 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'entradas' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-slate-700'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> Entradas / Cargas en Camino
              </button>
            </div>
          )}

          {despachos.length === 0 && (
            <p className="text-center text-muted-foreground py-12 bg-slate-50 rounded-xl border border-dashed">
              {activeTab === 'salidas' 
                ? 'No has realizado ninguna salida o transferencia de recursos' 
                : 'No registras cargamentos en ruta asignados hacia tu institución'}
            </p>
          )}

          {despachos.map(d => (
            <Card key={d.id} className="p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  !isSuperAdmin && activeTab === 'entradas' ? 'bg-emerald-100/70' : 'bg-primary/10'
                }`}>
                  <Truck className={`w-5 h-5 ${!isSuperAdmin && activeTab === 'entradas' ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm sm:text-base">{d.numero_guia || `ID Interno: #${d.id}`}</p>
                    <Badge variant={d.estado_entrega === 'En Ruta' ? 'default' : d.estado_entrega === 'Entregado' ? 'success' : 'destructive'} className="text-[10px]">
                      {d.estado_entrega}
                    </Badge>
                    
                    {!isSuperAdmin && (
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        d.estado_entrega === 'Cancelado' 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {d.estado_entrega === 'Cancelado' 
                          ? 'Anulado por Origen' 
                          : activeTab === 'salidas' ? 'Despachado' : 'Por Recibir'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-slate-800">{d.origen?.nombre || 'Donación'}</span> → <span className="font-medium text-slate-800">{d.destino?.nombre}</span>
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground hidden md:block shrink-0 px-4">
                  <p className="font-medium text-slate-600">{d.chofer ? `${d.chofer.nombre} ${d.chofer.apellido}` : 'Sin chofer'}</p>
                  <p className="uppercase text-[11px] font-mono text-slate-500">{d.vehiculo ? `Placa: ${d.vehiculo.placa}` : 'Sin vehículo'}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 ml-auto sm:ml-0 font-medium" onClick={() => handleViewGuia(d.id)}>
                  <Eye className="w-4 h-4" /> {d.estado_entrega === 'Cancelado' ? 'Ver Detalles' : (!isSuperAdmin && activeTab === 'entradas' && d.estado_entrega === 'En Ruta') ? 'Procesar Recepción' : 'Ver Hoja de Ruta'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE VIEW */}
      {view === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 md:p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-slate-800"><Building2 className="w-4 h-4 text-primary" /> Logística de Ruta</h3>
              <div className="space-y-3">
                {isSuperAdmin ? (
                  <div className="space-y-1.5">
                    <Label>Institución Origen *</Label>
                    <SearchSelect options={instituciones} value={origenId} onChange={setOrigenId} placeholder="Seleccionar origen..." />
                  </div>
                ) : (
                  <div className="space-y-1 bg-secondary/20 p-2.5 rounded-lg border">
                    <Label className="text-xs text-muted-foreground">Centro Despachador (Tu Institución)</Label>
                    <p className="text-sm font-medium text-slate-900">{userProfile?.institucion?.nombre || 'Centro Asignado'}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Institución Destino / Punto Receptor *</Label>
                  <SearchSelect options={instituciones.filter(i => String(i.value) !== String(origenId))} value={destinoId} onChange={setDestinoId} placeholder="Buscar centro destino..." />
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-slate-800"><Contact className="w-4 h-4 text-primary" /> Personal y Flota Activa</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Label>Chofer Asignado *</Label>
                  <SearchSelect options={choferes} value={choferId} onChange={setChoferId} placeholder="Buscar conductor activo..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Vehículo de Carga *</Label>
                  <SearchSelect options={vehiculos} value={vehiculoId} onChange={setVehiculoId} placeholder="Seleccionar placa activa..." />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-3">
            <Hash className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Numeración de Seguridad de la Carga</p>
              <p className="text-sm text-muted-foreground">La guía digital e impresa se generará automáticamente con codificación incremental inalterable para auditoría de rutas en contingencia.</p>
            </div>
          </Card>

          <Card className="p-4 md:p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-slate-800"><Package className="w-4 h-4 text-primary" /> Carga de Suministros (Lector / Manual)</h3>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Buscar producto por nombre..." className="pl-9 pr-2" />
                {prodResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-lg max-h-48 overflow-auto">
                    {prodResults.map(p => (
                      <button key={p.productId} type="button" onClick={() => addToCart(p)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 border-b last:border-0">
                        <PlusCircle className="w-4 h-4 shrink-0 text-primary" />
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{p.productName}</span>
                          <span className="text-[11px] text-emerald-600 font-medium">Disponible en este almacén: {p.stockDisponible} {p.presentation || 'unidades'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {prodSearching && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Buscando existencias reales...</p>}
              </div>
              <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => setShowScanner(true)} title="Escanear código de barras">
                <ScanLine className="w-4 h-4" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">El cargamento del camión está vacío. Agrega suministros.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
                    <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="flex-1 text-sm font-medium text-slate-800 truncate">{item.nombre}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] font-normal text-emerald-600 border-emerald-200 bg-emerald-50 whitespace-nowrap">
                        Stock: {item.maxStock}
                      </Badge>
                      <Input type="number" value={item.cantidad} onChange={e => updateCant(item.id, e.target.value)} onBlur={() => handleCantBlur(item.id)}
                        className="w-20 h-8 text-sm text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                      <Badge variant="secondary" className="text-xs font-normal">{item.unidad}</Badge>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <Label>Observaciones de Destino / Punto de Despliegue</Label>
            <Textarea rows={2} value={detallesDestino} onChange={e => setDetallesDestino(e.target.value.toUpperCase())} placeholder="Indica direcciones de escuelas, refugios, o detalles adicionales del destino..." className="mt-1.5" />
          </Card>

          <Button type="submit" size="lg" className="w-full gap-2 font-semibold" disabled={loading || cart.length === 0}>
            <FileText className="w-5 h-5" /> {loading ? 'Despachando Carga...' : 'Confirmar Carga y Despachar Ruta'}
          </Button>
        </form>
      )}

      {/* DOCUMENTO OFICIAL MANIFIESTO */}
      {view === 'guide' && guia && (
        <div className="space-y-4">
          
          {guia.estado_entrega === 'En Ruta' && (
            <div className="no-print flex flex-col items-center justify-center gap-2 p-4 bg-secondary/40 border rounded-xl max-w-4xl mx-auto">
              <div className="flex justify-center gap-3 flex-wrap">
                {(esInstitucionReceptora || isSuperAdmin) && (
                  <Button onClick={() => setShowDeliveryModal(true)} disabled={actionLoading} className="gap-2 bg-emerald-600 hover:bg-emerald-500 font-semibold shadow-sm">
                    <CheckCircle className="w-4 h-4" /> Confirmar Recepción y Descargar Mercancía
                  </Button>
                )}

                {(esInstitucionEmisora || isSuperAdmin) && (
                  <Button onClick={() => setShowCancelModal(true)} disabled={actionLoading} variant="destructive" className="gap-2 font-semibold shadow-sm">
                    <XCircle className="w-4 h-4" /> Cancelar Despacho y Reincorporar Stock
                  </Button>
                )}
              </div>
              
              {!isSuperAdmin && esInstitucionEmisora && (
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  * Estás visualizando un despacho saliente. Solo el centro receptor destino puede dar el "Recibido" definitivo.
                </p>
              )}
              {!isSuperAdmin && esInstitucionReceptora && (
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  * Este cargamento viene asignado a tu almacén. Valida físicamente las unidades antes de presionar confirmar de llegada.
                </p>
              )}
            </div>
          )}

          {/* MENSAJE TÉCNICO DE BLOQUEO SI LA COMPRA/RUTA FUE ANULADA */}
          {guia.estado_entrega === 'Cancelado' ? (
            <div className="no-print p-4 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <div className="text-sm">
                <p className="font-bold">ORDEN DE LOGÍSTICA ANULADA</p>
                <p className="text-red-700 text-xs mt-0.5">Esta hoja de ruta fue cancelada formalmente por el centro distribuidor. Los suministros fueron extornados al inventario de origen y la carga ya no llegará al destino.</p>
              </div>
            </div>
          ) : (
            // ACCIONES DE DESCARGA E IMPRESIÓN INTERACTIVA
            <div className="no-print flex justify-center gap-3">
              <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-500 font-medium text-white shadow-sm">
                <Download className="w-4 h-4" /> Exportar Documento de Ruta
              </Button>
            </div>
          )}

          {/* HOJA DE GUÍA FÍSICA / MANIFIESTO COMPILADO */}
          <div ref={printRef} className="bg-white text-black rounded-xl p-6 md:p-10 border shadow-md space-y-6 max-w-4xl mx-auto font-sans relative overflow-hidden">
            
            {guia.estado_entrega === 'Cancelado' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-[0.08]">
                <p className="text-[90px] font-black uppercase tracking-widest text-red-700 border-8 border-red-700 p-6 rounded-3xl rotate-12">
                  ANULADO
                </p>
              </div>
            )}

            <div className="flex justify-between items-start border-b-2 border-slate-300 pb-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Guía de Despacho Logístico</h2>
                <p className="text-xs text-slate-500 uppercase font-semibold">Sistema Unificado de Control de Acopio (SICOAC)</p>
                <p className="text-xs text-slate-400">Asistencia y Suministros Humanitarios de Emergencia</p>
              </div>
              <div className="text-right bg-slate-50 border p-3 rounded-lg">
                <p className="text-xs text-slate-500 font-bold uppercase">NÚMERO DE GUÍA</p>
                <p className="text-base font-mono font-bold text-primary mt-0.5">{guia.numero_guia}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(guia.created_at).toLocaleDateString('es-VE')} — {new Date(guia.created_at).toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            {guia.estado_entrega === 'Cancelado' && (
              <div className="p-3 bg-red-600 text-white font-bold text-center rounded-lg text-xs uppercase tracking-wider shadow-sm">
                ⚠️ ATENCIÓN: Este documento carece de validez legal de transporte. Cargamento Cancelado en Tránsito.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b pb-5">
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border">
                <p className="font-bold uppercase text-slate-500 tracking-wider">Centro de Despacho (Origen)</p>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{guia.origen?.nombre || 'Donación Directa'}</p>
                <p className="text-slate-500 mt-1"><span className="font-medium">Dirección:</span> {guia.origen?.direccion || 'N/A'}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border">
                <p className="font-bold uppercase text-slate-500 tracking-wider">Punto de Entrega (Destino Asignado)</p>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{guia.destino?.nombre || 'Comunidad / Zona Afectada'}</p>
                <p className="text-slate-500 mt-1"><span className="font-medium">Detalles Destino:</span> {guia.detalles_destino || 'Entrega estándar.'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b pb-5 bg-slate-50/50 p-3 rounded-lg border">
              <div>
                <p className="text-slate-500 font-semibold uppercase">Conductor Autorizado:</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{guia.chofer ? `${guia.chofer.nombre} ${guia.chofer.apellido}` : '—'}</p>
                <p className="text-slate-500 mt-0.5">C.I: {guia.chofer?.cedula} | Teléfono: {guia.chofer?.telefono}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold uppercase">Unidad de Transporte:</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 uppercase">{guia.vehiculo ? `${guia.vehiculo.marca || ''} ${guia.vehiculo.modelo}` : '—'}</p>
                <p className="text-slate-500 mt-0.5">Placa: {guia.vehiculo?.placa} | Capacidad: {guia.vehiculo?.capacidad_carga || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Manifiesto del Cargamento Despachado</p>
              <table className="w-full text-xs border-collapse text-left">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-md">Item</th>
                    <th className="py-2.5 px-3">Descripción de Insumo</th>
                    <th className="py-2.5 px-3 text-right">Cantidad</th>
                    <th className="py-2.5 px-3 text-right rounded-r-md">Unidad Medida</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b">
                  {(guia.items || []).map((m, i) => (
                    <tr key={m.id} className={`font-medium ${guia.estado_entrega === 'Cancelado' ? 'text-slate-400 line-through decoration-red-500' : 'text-slate-800'}`}>
                      <td className="py-2.5 px-3 text-slate-400">{i + 1}</td>
                      <td className="py-2.5 px-3 text-sm">{m.producto?.nombre}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-base text-slate-900">{Number(m.cantidad).toFixed(0)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-normal">{m.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-16 text-xs text-center">
              <div className="space-y-1">
                <div className="border-t-2 border-slate-400 mx-auto w-48 mt-8" />
                <p className="font-bold text-slate-800">{guia.chofer ? `${guia.chofer.nombre} ${guia.chofer.apellido}` : 'Transportista'}</p>
                <p className="text-slate-400 text-[10px]">Firma de Despacho y Custodia en Ruta</p>
              </div>
              <div className="space-y-1">
                <div className="border-t-2 border-slate-400 mx-auto w-48 mt-8" />
                <p className="font-bold text-slate-800">
                  {guia.estado_entrega === 'Cancelado' ? 'X — RUTA ANULADA' : '___________________________'}
                </p>
                <p className="text-slate-400 text-[10px]">Firma, Nombre y Cédula de Recepción Destino</p>
              </div>
            </div>
          </div>

          <style>{`
            @media print {
              body { background: white; color: black; }
              .no-print { display: none !important; }
              .guide-print { box-shadow: none; border: none; margin: 0; padding: 0; }
              @page { margin: 1cm; size: portrait; }
            }
          `}</style>
        </div>
      )}

      {/* Scanner overlay */}
      {showScanner && (
        <Scanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
          onManual={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}