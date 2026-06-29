import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ScanLine, Save, Building, ArrowDownCircle, ArrowUpCircle, ShoppingBag, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchSelect } from '@/components/ui/search-select'
import { CreateSelect } from '@/components/ui/create-select'
import {
  sendRecord,
  isConfigured,
  getEstados,
  getMunicipios,
  getParroquias,
  getInstituciones,
  createInstitucion,
  getCategorias,
  createCategoria,
  findProductByBarcode
} from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { addToQueue, incrementSessionCount } from '@/lib/storage'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { toast } from 'sonner'

export default function Form({ barcode: initialBarcode, onBack, onScanAgain, onSaved }) {
  const online = useOnlineStatus()
  const productInputRef = useRef(null)

  // Wizard step
  const [step, setStep] = useState(1)

  // Geopolitical states
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [parroquias, setParroquias] = useState([])
  const [instituciones, setInstituciones] = useState([])
  const [categorias, setCategorias] = useState([])

  const [estadoId, setEstadoId] = useState('')
  const [municipioId, setMunicipioId] = useState('')
  const [parroquiaId, setParroquiaId] = useState('')

  // Form inputs state
  const [institucionId, setInstitucionId] = useState('')
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

  // Load initial options
  useEffect(() => {
    console.log('[Form] montado — cargando opciones iniciales...')
    async function loadOptions() {
      try {
        const [ests, insts, cats] = await Promise.all([
          getEstados(),
          getInstituciones(),
          getCategorias()
        ])
        setEstados(ests)
        setInstituciones(insts)
        setCategorias(cats)
        console.log(`[Form] opciones cargadas: ${ests.length} estados, ${insts.length} instituciones, ${cats.length} categorías`)
      } catch (err) {
        console.error('[Form] error cargando opciones iniciales:', err)
      }
    }
    loadOptions()
  }, [])

  // Sync initial barcode
  useEffect(() => {
    if (initialBarcode) setBarcode(initialBarcode)
  }, [initialBarcode])

  // Load municipios when estado changes
  useEffect(() => {
    async function loadMunicipios() {
      if (estadoId) {
        console.log(`[Form] estado cambiado a id=${estadoId}, cargando municipios...`)
        try {
          const muns = await getMunicipios(estadoId)
          setMunicipios(muns)
        } catch (err) {
          console.error('[Form] error al cargar municipios:', err)
        }
      } else {
        setMunicipios([])
      }
      setMunicipioId('')
      setParroquiaId('')
    }
    loadMunicipios()
  }, [estadoId])

  // Load parroquias when municipio changes
  useEffect(() => {
    async function loadParroquias() {
      if (municipioId) {
        console.log(`[Form] municipio cambiado a id=${municipioId}, cargando parroquias...`)
        try {
          const parqs = await getParroquias(municipioId)
          setParroquias(parqs)
        } catch (err) {
          console.error('[Form] error al cargar parroquias:', err)
        }
      } else {
        setParroquias([])
      }
      setParroquiaId('')
    }
    loadParroquias()
  }, [municipioId])

  // Barcode search / auto-populate
  useEffect(() => {
    async function checkBarcode() {
      if (barcode && barcode.trim().length >= 3) {
        console.log(`[Form] buscando producto por código "${barcode}"...`)
        const prod = await findProductByBarcode(barcode)
        if (prod) {
          setProduct(prod.productName)
          setDescription(prod.description || '')
          setCategoryId(prod.categoryId)
          toast.info(`Producto autocompletado: ${prod.productName}`)
          if (productInputRef.current) productInputRef.current.focus()
        }
      }
    }
    checkBarcode()
  }, [barcode])

  // Auto-focus on mount
  useEffect(() => {
    if (productInputRef.current) productInputRef.current.focus()
  }, [])

  /* ============================================================
     Institution handlers
     ============================================================ */
  const handleSelectInstitucion = async (id) => {
    console.log(`[Form] seleccionando institución id=${id}...`)
    setInstitucionId(id)
    setErrors({})
    
    if (id === 'new') return

    setNewInstitucionNombre('')

    const inst = instituciones.find((i) => String(i.value) === String(id))
    if (!inst) return

    console.log(`[Form] institución encontrada: "${inst.label}", parroquia_id=${inst.parroquiaId}`)
    setDireccion(inst.direccion || '')

    if (inst.parroquiaId) {
      try {
        const { data, error } = await supabase
          .from('parroquia')
          .select('id, municipio_id, municipio:id (id, estado_id)')
          .eq('id', inst.parroquiaId)
          .single()

        if (error) {
          console.error('[Form] error consultando parroquia:', error)
          return
        }

        if (data) {
          const estadoIdVal = data.municipio?.estado_id
          const municipioIdVal = data.municipio_id

          console.log(`[Form] resolviendo jerarquía: parroquia=${data.id}, municipio=${municipioIdVal}, estado=${estadoIdVal}`)

          setEstadoId(estadoIdVal)
          const muns = await getMunicipios(estadoIdVal)
          setMunicipios(muns)
          setMunicipioId(municipioIdVal)

          const parqs = await getParroquias(municipioIdVal)
          setParroquias(parqs)
          setParroquiaId(data.id)
        }
      } catch (err) {
        console.error('[Form] error al resolver la jerarquía geográfica:', err)
      }
    }
  }

  const handleCreateInstitucion = async (name) => {
    setInstitucionId('new')
    setNewInstitucionNombre(name)
    setDireccion('')
    setEstadoId('')
    setMunicipioId('')
    setParroquiaId('')
    setMunicipios([])
    setParroquias([])
    return { value: 'new', label: name }
  }

  const handleCreateCategory = async (name) => {
    return { value: name, label: name }
  }

  /* ============================================================
     Step navigation
     ============================================================ */
  function validateStep1() {
    const newErrors = {}
    
    if (!institucionId) {
      newErrors.institucionId = 'Seleccioná o creá una institución'
    } else if (institucionId === 'new') {
      if (!newInstitucionNombre.trim()) newErrors.institucionId = 'El nombre de la institución es obligatorio'
      if (!estadoId) newErrors.estadoId = 'El estado es obligatorio'
      if (!municipioId) newErrors.municipioId = 'El municipio es obligatorio'
      if (!parroquiaId) newErrors.parroquiaId = 'La parroquia es obligatoria'
      if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNextStep() {
    if (validateStep1()) {
      setStep(2)
      if (productInputRef.current) productInputRef.current.focus()
    } else {
      toast.warning('Completá los datos de la institución')
    }
  }

  /* ============================================================
     Submit
     ============================================================ */
  async function handleSubmit(e) {
    e.preventDefault()
    console.log('[Form] handleSubmit — iniciando validación...')

    const newErrors = {}
    if (!product.trim()) newErrors.product = 'El producto es obligatorio'
    if (!categoryId) newErrors.categoryId = 'La categoría es obligatoria'
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero'

    if (Object.keys(newErrors).length > 0) {
      console.warn('[Form] validación fallida:', newErrors)
      setErrors(newErrors)
      toast.warning('Completá los campos obligatorios')
      return
    }

    console.log('[Form] validación OK, enviando...')
    setErrors({})
    setSaving(true)

    try {
      let finalInstitucionId = institucionId
      if (institucionId === 'new') {
        console.log('[Form] creando nueva institución...')
        const newInst = await createInstitucion(newInstitucionNombre, direccion, parroquiaId)
        finalInstitucionId = newInst.value
        console.log(`[Form] institución creada: id=${finalInstitucionId}`)
        const updatedInsts = await getInstituciones()
        setInstituciones(updatedInsts)
      }

      const record = {
        institucionId: finalInstitucionId,
        direccion,
        tipoMovimiento,
        barcode: barcode.trim(),
        productName: product.trim(),
        description: description.trim(),
        quantity: Number(quantity) || 1,
        categoryId,
      }

      console.log('[Form] record a enviar:', record)

      if (online && isConfigured()) {
        await sendRecord(record)
        incrementSessionCount()
        toast.success(`Movimiento de ${product} registrado con éxito`)
        resetForm()
      } else {
        addToQueue(record)
        incrementSessionCount()
        const msg = online
          ? 'Configurá las credenciales de Supabase en el .env'
          : 'Guardado offline — se sincronizará después'
        toast.success(`${product} guardado — ${msg}`)
        resetForm()
      }
    } catch (err) {
      console.error('[Form] ERROR al guardar:', err)
      toast.error(`Error al enviar: guardado en cola offline`)
      addToQueue({
        institucionId,
        direccion,
        tipoMovimiento,
        barcode: barcode.trim(),
        productName: product.trim(),
        description: description.trim(),
        quantity: Number(quantity) || 1,
        categoryId,
      })
      resetForm()
    } finally {
      setSaving(false)
      onSaved?.()
    }
  }

  function resetForm() {
    setBarcode('')
    setProduct('')
    setDescription('')
    setCategoryId('')
    setQuantity(1)
    setErrors({})
    setStep(1)
    setInstitucionId('')
    setNewInstitucionNombre('')
    setDireccion('')
    setEstadoId('')
    setMunicipioId('')
    setParroquiaId('')
    setMunicipios([])
    setParroquias([])
    if (productInputRef.current) productInputRef.current.focus()
  }

  /* ============================================================
     Institution info display (read-only)
     ============================================================ */
  const estadoLabel = estados.find(e => String(e.value) === String(estadoId))?.label
  const municipioLabel = municipios.find(m => String(m.value) === String(municipioId))?.label
  const parroquiaLabel = parroquias.find(p => String(p.value) === String(parroquiaId))?.label

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8 bg-background">
      <div className="w-full max-w-xl mx-auto space-y-6">

        {/* Back + Scan */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => step === 1 ? onBack() : setStep(1)} aria-label="Volver">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5 border-input" onClick={onScanAgain}>
            <ScanLine className="w-4 h-4" />
            Escanear
          </Button>
        </div>

        {/* Title + Steps indicator */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Registrar Movimiento</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 ? 'Paso 1: Identificá el centro de acopio' : 'Paso 2: Completá los datos del movimiento'}
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant={step === 1 ? 'default' : 'secondary'} className="gap-1.5 px-3 py-1">
              <Building className="w-3 h-3" />
              Institución
            </Badge>
            <Badge variant={step === 2 ? 'default' : 'secondary'} className="gap-1.5 px-3 py-1">
              <ShoppingBag className="w-3 h-3" />
              Producto
            </Badge>
          </div>
        </div>

        {/* ============================================================
             STEP 1 — Institution
             ============================================================ */}
        {step === 1 && (
          <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
              <Building className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-base text-foreground">1. Centro de Acopio</h3>
            </div>

            {/* Institution selector */}
            <div className="space-y-2">
              <Label htmlFor="institucion">Institución <span className="text-destructive">*</span></Label>
              <CreateSelect
                id="institucion"
                options={instituciones}
                value={institucionId}
                onChange={handleSelectInstitucion}
                onCreate={handleCreateInstitucion}
                placeholder="Seleccionar o escribir para crear..."
                createMessage="Crear institución"
                displayValue={institucionId === 'new' ? newInstitucionNombre : undefined}
                aria-invalid={!!errors.institucionId}
                className={errors.institucionId ? '[&_input]:border-destructive' : ''}
              />
              {errors.institucionId && (
                <span className="text-xs text-destructive block mt-1">{errors.institucionId}</span>
              )}
            </div>

            {/* Existing institution — read-only summary */}
            {isExistingInstitution && (
              <div className="rounded-lg bg-secondary/30 p-4 space-y-2 border border-border/40">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-foreground">{selectedInstitution?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span>{direccion || '—'}</span>
                  <span className="text-muted-foreground">Estado:</span>
                  <span>{estadoLabel || '—'}</span>
                  <span className="text-muted-foreground">Municipio:</span>
                  <span>{municipioLabel || '—'}</span>
                  <span className="text-muted-foreground">Parroquia:</span>
                  <span>{parroquiaLabel || '—'}</span>
                </div>
              </div>
            )}

            {/* New institution — editable fields */}
            {isNewInstitution && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado <span className="text-destructive">*</span></Label>
                    <SearchSelect
                      id="estado"
                      options={estados}
                      value={estadoId}
                      onChange={setEstadoId}
                      placeholder="Seleccionar..."
                      aria-invalid={!!errors.estadoId}
                    />
                    {errors.estadoId && <span className="text-xs text-destructive block mt-1">{errors.estadoId}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipio">Municipio <span className="text-destructive">*</span></Label>
                    <SearchSelect
                      id="municipio"
                      options={municipios}
                      value={municipioId}
                      onChange={setMunicipioId}
                      placeholder={estadoId ? 'Seleccionar...' : 'Elegí Estado primero'}
                      aria-invalid={!!errors.municipioId}
                    />
                    {errors.municipioId && <span className="text-xs text-destructive block mt-1">{errors.municipioId}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parroquia">Parroquia <span className="text-destructive">*</span></Label>
                    <SearchSelect
                      id="parroquia"
                      options={parroquias}
                      value={parroquiaId}
                      onChange={setParroquiaId}
                      placeholder={municipioId ? 'Seleccionar...' : 'Elegí Municipio primero'}
                      aria-invalid={!!errors.parroquiaId}
                    />
                    {errors.parroquiaId && <span className="text-xs text-destructive block mt-1">{errors.parroquiaId}</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección <span className="text-destructive">*</span></Label>
                  <Input
                    id="direccion"
                    placeholder="Dirección física exacta"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    aria-invalid={!!errors.direccion}
                    className={errors.direccion ? 'border-destructive' : ''}
                  />
                  {errors.direccion && <span className="text-xs text-destructive block mt-1">{errors.direccion}</span>}
                </div>
              </>
            )}

            {/* No institution selected — hint */}
            {!institucionId && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Seleccioná una institución existente o escribí el nombre para crear una nueva
              </p>
            )}

            {/* Next button */}
            <Button
              type="button"
              size="lg"
              className="w-full gap-2 text-base mt-2"
              onClick={handleNextStep}
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Card>
        )}

        {/* ============================================================
             STEP 2 — Movement + Product
             ============================================================ */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Institution summary */}
            <Card className="p-3 md:p-4 border-border/60 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium truncate">
                  {isNewInstitution ? newInstitucionNombre : selectedInstitution?.label}
                </span>
                <span className="text-muted-foreground">— {direccion}</span>
              </div>
            </Card>

            {/* Movement type */}
            <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
                <ArrowDownCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base text-foreground">2. Tipo de Movimiento</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={tipoMovimiento === 'Entrada' ? 'default' : 'outline'}
                  onClick={() => setTipoMovimiento('Entrada')}
                  className="w-full gap-2 text-sm justify-center py-5"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  Entrada (Ingreso)
                </Button>
                <Button
                  type="button"
                  variant={tipoMovimiento === 'Salida' ? 'default' : 'outline'}
                  onClick={() => setTipoMovimiento('Salida')}
                  className="w-full gap-2 text-sm justify-center py-5"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  Salida (Despacho)
                </Button>
              </div>
            </Card>

            {/* Product */}
            <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base text-foreground">3. Información del Producto</h3>
              </div>

              {/* Barcode */}
              <div className="space-y-2">
                <Label htmlFor="barcode">Código de barras (opcional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    inputMode="numeric"
                    placeholder="Escanear o escribir código"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    readOnly={!!initialBarcode}
                    className={initialBarcode ? 'opacity-80' : ''}
                  />
                  {!initialBarcode && (
                    <Button type="button" variant="outline" size="icon" onClick={onScanAgain} className="shrink-0 border-input">
                      <ScanLine className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Product name */}
              <div className="space-y-2">
                <Label htmlFor="product">Nombre del Producto <span className="text-destructive">*</span></Label>
                <Input
                  id="product"
                  ref={productInputRef}
                  required
                  placeholder="Ej: Agua Mineral, Paracetamol, etc."
                  value={product}
                  onChange={(e) => {
                    setProduct(e.target.value)
                    if (errors.product) setErrors((prev) => ({ ...prev, product: null }))
                  }}
                  aria-invalid={!!errors.product}
                  className={errors.product ? 'border-destructive' : ''}
                />
                {errors.product && <span className="text-xs text-destructive block mt-1">{errors.product}</span>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del producto</Label>
                <Textarea
                  id="description"
                  rows={2}
                  placeholder="Detalle adicional del producto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Quantity only (presentation removed) */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad <span className="text-destructive">*</span></Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value) || 1)
                    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }))
                  }}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && <span className="text-xs text-destructive block mt-1">{errors.quantity}</span>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría <span className="text-destructive">*</span></Label>
                <CreateSelect
                  id="category"
                  options={categorias}
                  value={categoryId}
                  onChange={(val) => {
                    setCategoryId(val)
                    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: null }))
                  }}
                  onCreate={handleCreateCategory}
                  placeholder="Seleccionar o escribir..."
                  createMessage="Crear categoría"
                  displayValue={typeof categoryId === 'string' && !categorias.some(c => String(c.value) === String(categoryId)) ? categoryId : undefined}
                  aria-invalid={!!errors.categoryId}
                  className={errors.categoryId ? '[&_input]:border-destructive' : ''}
                />
                {errors.categoryId && <span className="text-xs text-destructive block mt-1">{errors.categoryId}</span>}
              </div>
            </Card>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full gap-2 text-base" disabled={saving}>
              <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
              {saving ? 'Guardando...' : 'Guardar y siguiente'}
            </Button>
          </form>
        )}

      </div>
    </div>
  )
}
