import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ScanLine, Save, Building, ArrowDownCircle, ArrowUpCircle, ShoppingBag, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import { CreateSelect } from '@/components/ui/create-select'
import {
  sendRecord, isConfigured, getEstados, getMunicipios, getParroquias,
  getInstituciones, createInstitucion, getCategorias, createCategoria, findProductByBarcode
} from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { addToQueue, incrementSessionCount } from '@/lib/storage'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { normalizeText } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function Form({ barcode: initialBarcode, onBack, onScanAgain, onSaved, userProfile }) {
  const online = useOnlineStatus()
  const { rol, institucionId: userInstId } = useAuth()
  const productInputRef = useRef(null)
  const isOperator = rol === 'operador'

  const [step, setStep] = useState(isOperator ? 2 : 1)

  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [parroquias, setParroquias] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [categorias, setCategorias] = useState([])

  const [estadoId, setEstadoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')
  const [parroquiaId, setParroquiaId] = useState('')

  const [institucionId, setInstitucionId] = useState(isOperator ? String(userInstId || '') : '')
  const [newInstitucionNombre, setNewInstitucionNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('Entrada')

  const [barcode, setBarcode] = useState(initialBarcode || '')
  const [product, setProduct] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const isExistingInstitution = institucionId && institucionId !== 'new' && instituciones.some(i => String(i.value) === String(institucionId))
  const isNewInstitution = institucionId === 'new'
  const selectedInstitution = instituciones.find(i => String(i.value) === String(institucionId))

  const estadoLabel = estados.find(e => String(e.value) === String(estadoId))?.label
  const municipioLabel = municipios.find(m => String(m.value) === String(municipioId))?.label
  const parroquiaLabel = parroquias.find(p => String(p.value) === String(parroquiaId))?.label

  // Load initial options
  useEffect(() => {
    async function load() {
      const [ests, insts, cats] = await Promise.all([
        getEstados(), getInstituciones(), getCategorias()
      ])
      setEstados(ests)
      setInstituciones(insts)
      setCategorias(cats)

      // Auto-select institution for operator
      if (isOperator && userInstId) {
        const userInst = insts.find(i => String(i.value) === String(userInstId))
        if (userInst) {
          setInstitucionId(String(userInst.value))
          setDireccion(userInst.direccion || '')
          if (userInst.parroquiaId) loadGeo(userInst.parroquiaId)
        }
      }
    }
    load()
  }, [])

  async function loadGeo(parroquiaId) {
    try {
      const { data } = await supabase
        .from('parroquia')
        .select('id, municipio_id, municipio:id (id, estado_id)')
        .eq('id', parroquiaId)
        .single()
      if (data) {
        setEstadoId(data.municipio?.estado_id)
        const muns = await getMunicipios(data.municipio?.estado_id)
        setMunicipios(muns)
        setMunicipioId(data.municipio_id)
        const parqs = await getParroquias(data.municipio_id)
        setParroquias(parqs)
        setParroquiaId(data.id)
      }
    } catch (err) { console.error(err) }
  }

  useEffect(() => { if (initialBarcode) setBarcode(initialBarcode) }, [initialBarcode])

  useEffect(() => {
    async function checkBarcode() {
      if (barcode?.trim().length >= 3) {
        const prod = await findProductByBarcode(barcode)
        if (prod) {
          setProduct(prod.productName)
          setDescription(prod.description || '')
          setCategoryId(prod.categoryId)
          toast.info(`Producto autocompletado: ${prod.productName}`)
          productInputRef.current?.focus()
        }
      }
    }
    checkBarcode()
  }, [barcode])

  /* Handlers */
  const handleSelectInstitucion = async (id) => {
    setInstitucionId(id)
    setErrors({})
    if (id === 'new' || isOperator) return
    const inst = instituciones.find(i => String(i.value) === String(id))
    if (!inst) return
    setDireccion(inst.direccion || '')
    if (inst.parroquiaId) loadGeo(inst.parroquiaId)
  }

  const handleCreateInstitucion = async (name) => {
    setInstitucionId('new')
    setNewInstitucionNombre(normalizeText(name))
    setDireccion(''); setEstadoId(''); setMunicipioId(''); setParroquiaId('')
    setMunicipios([]); setParroquias([])
    return { value: 'new', label: name }
  }

  const handleCreateCategory = async (name) => ({ value: name, label: name })

  function validateStep1() {
    const e = {}
    if (!institucionId) e.institucionId = 'Seleccioná o creá una institución'
    else if (institucionId === 'new') {
      if (!newInstitucionNombre.trim()) e.institucionId = 'Nombre obligatorio'
      if (!estadoId) e.estadoId = 'Estado obligatorio'
      if (!municipioId) e.municipioId = 'Municipio obligatorio'
      if (!parroquiaId) e.parroquiaId = 'Parroquia obligatoria'
      if (!direccion.trim()) e.direccion = 'Dirección obligatoria'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNextStep() {
    if (validateStep1()) { setStep(2); setTimeout(() => productInputRef.current?.focus(), 100) }
    else toast.warning('Completá los datos de la institución')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!product.trim()) newErrors.product = 'El producto es obligatorio'
    if (!categoryId) newErrors.categoryId = 'La categoría es obligatoria'
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); toast.warning('Completá los campos obligatorios'); return }

    setErrors({})
    setSaving(true)
    try {
      let finalInstId = institucionId
      if (institucionId === 'new') {
        const newInst = await createInstitucion(newInstitucionNombre, direccion, parroquiaId)
        finalInstId = newInst.value
        const updated = await getInstituciones(); setInstituciones(updated)
      }

      const record = {
        institucionId: finalInstId,
        direccion: normalizeText(direccion),
        tipoMovimiento: isOperator ? 'Entrada' : tipoMovimiento,
        barcode: barcode.trim(),
        productName: normalizeText(product),
        description: normalizeText(description),
        quantity: Number(quantity) || 1,
        categoryId,
      }

      if (online && isConfigured()) {
        await sendRecord(record)
        incrementSessionCount()
        toast.success(`Movimiento de ${product} registrado con éxito`)
        resetForm()
      } else {
        addToQueue(record)
        incrementSessionCount()
        toast.success(`${product} guardado — ${online ? 'configurá Supabase' : 'modo offline'}`)
        resetForm()
      }
    } catch (err) {
      console.error(err)
      toast.error('Error — guardado en cola offline')
      addToQueue({
        institucionId, tipoMovimiento: isOperator ? 'Entrada' : tipoMovimiento,
        barcode: barcode.trim(), productName: normalizeText(product),
        description: normalizeText(description), quantity: Number(quantity) || 1, categoryId,
      })
      resetForm()
    } finally {
      setSaving(false)
      onSaved?.()
    }
  }

  function resetForm() {
    setBarcode(''); setProduct(''); setDescription(''); setCategoryId(''); setQuantity(1)
    setErrors({})
    if (isOperator) {
      setStep(2)
    } else {
      setStep(1)
      setInstitucionId(''); setNewInstitucionNombre(''); setDireccion('')
      setEstadoId(''); setMunicipioId(''); setParroquiaId('')
      setMunicipios([]); setParroquias([])
    }
    setTimeout(() => productInputRef.current?.focus(), 100)
  }

  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8 bg-background">
      <div className="w-full max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => step === 1 ? onBack() : setStep(1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onScanAgain}>
            <ScanLine className="w-4 h-4" /> Escanear
          </Button>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isOperator ? 'Registrar Entrada' : 'Registrar Movimiento'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isOperator
              ? 'Registrá los productos que llegan al centro de acopio'
              : step === 1 ? 'Paso 1: Identificá el centro de acopio' : 'Paso 2: Completá los datos del movimiento'
            }
          </p>
        </div>

        {/* Step 1 — Institution (admin only) */}
        {!isOperator && step === 1 && (
          <Card className="p-4 md:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <Building className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">1. Centro de Acopio</h3>
            </div>
            <div className="space-y-2">
              <Label>Institución <span className="text-destructive">*</span></Label>
              <CreateSelect
                options={instituciones} value={institucionId} onChange={handleSelectInstitucion}
                onCreate={handleCreateInstitucion} placeholder="Seleccionar o escribir..." createMessage="Crear institución"
                displayValue={institucionId === 'new' ? newInstitucionNombre : undefined}
              />
              {errors.institucionId && <p className="text-xs text-destructive">{errors.institucionId}</p>}
            </div>

            {isExistingInstitution && (
              <div className="rounded-lg bg-secondary/30 p-4 space-y-1 text-sm border">
                <p className="font-medium text-foreground">{selectedInstitution?.label}</p>
                <p className="text-muted-foreground">Dirección: {direccion || '—'}</p>
                <p className="text-muted-foreground">Estado: {estadoLabel || '—'} / Municipio: {municipioLabel || '—'} / Parroquia: {parroquiaLabel || '—'}</p>
              </div>
            )}

            {isNewInstitution && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <SearchSelect options={estados} value={estadoId} onChange={setEstadoId} placeholder="Seleccionar..." />
                    {errors.estadoId && <p className="text-xs text-destructive">{errors.estadoId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Municipio *</Label>
                    <SearchSelect options={municipios} value={municipioId} onChange={setMunicipioId} placeholder={estadoId ? 'Seleccionar...' : 'Primero Estado'} />
                    {errors.municipioId && <p className="text-xs text-destructive">{errors.municipioId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Parroquia *</Label>
                    <SearchSelect options={parroquias} value={parroquiaId} onChange={setParroquiaId} placeholder={municipioId ? 'Seleccionar...' : 'Primero Municipio'} />
                    {errors.parroquiaId && <p className="text-xs text-destructive">{errors.parroquiaId}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dirección *</Label>
                  <Input value={direccion} onChange={e => setDireccion(normalizeText(e.target.value))} />
                  {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
                </div>
              </>
            )}

            {!institucionId && <p className="text-sm text-muted-foreground text-center py-4">Seleccioná o creá una institución</p>}

            <Button type="button" size="lg" className="w-full gap-2" onClick={handleNextStep}>
              Siguiente <ChevronRight className="w-5 h-5" />
            </Button>
          </Card>
        )}

        {/* Step 2 — Form (operator starts here) */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Institution summary */}
            <Card className="p-3 border-border/60 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium truncate">
                  {isOperator
                    ? (userProfile?.institucion?.nombre || 'Mi institución')
                    : (isNewInstitution ? newInstitucionNombre : selectedInstitution?.label)
                  }
                </span>
                {!isOperator && <span className="text-muted-foreground truncate">— {direccion}</span>}
              </div>
            </Card>

            {/* Movement type */}
            <Card className="p-4 md:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <ArrowDownCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">2. Tipo de Movimiento</h3>
              </div>
              {isOperator ? (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-3 text-sm">
                  <ArrowDownCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-medium text-emerald-400">Entrada (Ingreso)</span>
                  <span className="text-muted-foreground">— Solo registro de entradas</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={tipoMovimiento === 'Entrada' ? 'default' : 'outline'} onClick={() => setTipoMovimiento('Entrada')} className="gap-2">
                    <ArrowDownCircle className="w-4 h-4" /> Entrada
                  </Button>
                  <Button type="button" variant={tipoMovimiento === 'Salida' ? 'default' : 'outline'} onClick={() => setTipoMovimiento('Salida')} className="gap-2">
                    <ArrowUpCircle className="w-4 h-4" /> Salida
                  </Button>
                </div>
              )}
            </Card>

            {/* Product info */}
            <Card className="p-4 md:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">3. Producto</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de barras</Label>
                <div className="flex gap-2">
                  <Input id="barcode" inputMode="numeric" placeholder="Escanear o escribir" value={barcode} onChange={e => setBarcode(e.target.value)} readOnly={!!initialBarcode} />
                  {!initialBarcode && <Button type="button" variant="outline" size="icon" onClick={onScanAgain}><ScanLine className="w-4 h-4" /></Button>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Producto <span className="text-destructive">*</span></Label>
                <Input id="product" ref={productInputRef} placeholder="Ej: Agua Mineral, Arroz..." value={product} onChange={e => { setProduct(normalizeText(e.target.value)); if (errors.product) setErrors(p => ({...p, product: null})) }} />
                {errors.product && <p className="text-xs text-destructive">{errors.product}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" rows={2} placeholder="Detalle adicional..." value={description} onChange={e => setDescription(normalizeText(e.target.value))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad <span className="text-destructive">*</span></Label>
                <Input id="quantity" type="number" min="1" value={quantity} onChange={e => { setQuantity(Number(e.target.value) || 1); if (errors.quantity) setErrors(p => ({...p, quantity: null})) }} />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría <span className="text-destructive">*</span></Label>
                <CreateSelect id="category" options={categorias} value={categoryId} onChange={val => { setCategoryId(val); if (errors.categoryId) setErrors(p => ({...p, categoryId: null})) }} onCreate={handleCreateCategory} placeholder="Seleccionar o escribir..." createMessage="Crear categoría" displayValue={typeof categoryId === 'string' && !categorias.some(c => String(c.value) === String(categoryId)) ? categoryId : undefined} />
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
              </div>
            </Card>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={saving}>
              <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
              {saving ? 'Guardando...' : 'Guardar y siguiente'}
            </Button>
          </form>
        )}

      </div>
    </div>
  )
}
