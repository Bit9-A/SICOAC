import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ScanLine, Save, Building, ArrowDownCircle, ArrowUpCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
  const [presentation, setPresentation] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Load initial options
  useEffect(() => {
    async function loadOptions() {
      try {
        const ests = await getEstados()
        setEstados(ests)
        const insts = await getInstituciones()
        setInstituciones(insts)
        const cats = await getCategorias()
        setCategorias(cats)
      } catch (err) {
        console.error('Error cargando opciones iniciales:', err)
      }
    }
    loadOptions()
  }, [])

  // Load municipios when estado changes
  useEffect(() => {
    async function loadMunicipios() {
      if (estadoId) {
        try {
          const muns = await getMunicipios(estadoId)
          setMunicipios(muns)
        } catch (err) {
          console.error(err)
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
        try {
          const parqs = await getParroquias(municipioId)
          setParroquias(parqs)
        } catch (err) {
          console.error(err)
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
        const prod = await findProductByBarcode(barcode)
        if (prod) {
          setProduct(prod.productName)
          setDescription(prod.description || '')
          setPresentation(prod.presentation || '')
          setCategoryId(prod.categoryId)
          toast.info(`Producto autocompletado: ${prod.productName}`)
          if (productInputRef.current) productInputRef.current.focus()
        }
      }
    }
    checkBarcode()
  }, [barcode])

  // Sync scan code
  useEffect(() => {
    if (initialBarcode) setBarcode(initialBarcode)
  }, [initialBarcode])

  // Auto-focus on mount
  useEffect(() => {
    if (productInputRef.current) productInputRef.current.focus()
  }, [])

  const handleSelectInstitucion = async (id) => {
    setInstitucionId(id)
    setNewInstitucionNombre('')
    
    const inst = instituciones.find((i) => String(i.value) === String(id))
    if (inst) {
      setDireccion(inst.direccion || '')
      if (inst.parroquiaId) {
        try {
          const { data, error } = await supabase
            .from('parroquia')
            .select('id, municipio_id, municipio (id, estado_id)')
            .eq('id', inst.parroquiaId)
            .single()
          
          if (data) {
            setEstadoId(data.municipio.estado_id)
            const muns = await getMunicipios(data.municipio.estado_id)
            setMunicipios(muns)
            setMunicipioId(data.municipio_id)
            
            const parqs = await getParroquias(data.municipio_id)
            setParroquias(parqs)
            setParroquiaId(data.id)
          }
        } catch (err) {
          console.error('Error al resolver la jerarquía geográfica:', err)
        }
      }
    }
  }

  const handleCreateInstitucion = async (name) => {
    setInstitucionId('new')
    setNewInstitucionNombre(name)
    setDireccion('')
    return { value: 'new', label: name }
  }

  const handleCreateCategory = async (name) => {
    return { value: name, label: name }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}
    
    // Geographical validations if creating a new institution
    if (!institucionId) {
      newErrors.institucionId = 'La institución es obligatoria'
    } else if (institucionId === 'new') {
      if (!newInstitucionNombre.trim()) newErrors.institucionId = 'El nombre de la nueva institución es obligatorio'
      if (!estadoId) newErrors.estadoId = 'El estado es obligatorio para la nueva institución'
      if (!municipioId) newErrors.municipioId = 'El municipio es obligatorio para la nueva institución'
      if (!parroquiaId) newErrors.parroquiaId = 'La parroquia es obligatoria para la nueva institución'
      if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria para la nueva institución'
    }

    if (!product.trim()) newErrors.product = 'El producto es obligatorio'
    if (!categoryId) newErrors.categoryId = 'La categoría es obligatoria'
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.warning('Completá los campos obligatorios antes de continuar')
      return
    }

    setErrors({})
    setSaving(true)

    try {
      let finalInstitucionId = institucionId
      if (institucionId === 'new') {
        const newInst = await createInstitucion(newInstitucionNombre, direccion, parroquiaId)
        finalInstitucionId = newInst.value
        
        // Refresh list
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
        presentation: presentation.trim(),
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
        const msg = online
          ? 'Configurá las credenciales de Supabase en el .env'
          : 'Guardado offline — se sincronizará después'
        toast.success(`${product} guardado — ${msg}`)
        resetForm()
      }
    } catch (err) {
      console.error(err)
      toast.error(`Error al enviar: guardado en cola offline`)
      // Fallback a cola local
      addToQueue({
        institucionId,
        direccion,
        tipoMovimiento,
        barcode: barcode.trim(),
        productName: product.trim(),
        description: description.trim(),
        presentation: presentation.trim(),
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
    setPresentation('')
    setCategoryId('')
    setQuantity(1)
    setErrors({})
    if (productInputRef.current) productInputRef.current.focus()
  }

  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8 bg-background">
      <div className="w-full max-w-xl mx-auto space-y-6">

        {/* Back + Scan again */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver al inicio" className="hover:bg-secondary">
            <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5 border-input hover:bg-secondary" onClick={onScanAgain}>
            <ScanLine className="w-4 h-4" aria-hidden="true" />
            Escanear
          </Button>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Registrar Movimiento</h2>
          <p className="text-sm text-muted-foreground mt-1">Registrá la entrada o salida de productos en los centros de acopio</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Centro de Acopio */}
          <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
              <Building className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-base text-foreground">1. Información del Centro de Acopio</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institucion">Institución <span className="text-destructive" aria-hidden="true">*</span></Label>
              <CreateSelect
                id="institucion"
                options={instituciones}
                value={institucionId}
                onChange={handleSelectInstitucion}
                onCreate={handleCreateInstitucion}
                placeholder="Seleccionar o escribir para crear..."
                createMessage="Crear institución"
                aria-required="true"
                aria-invalid={!!errors.institucionId}
                aria-describedby={errors.institucionId ? 'institucion-error' : undefined}
                className={errors.institucionId ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.institucionId && (
                <span id="institucion-error" className="text-xs text-destructive block mt-1" role="alert">
                  {errors.institucionId}
                </span>
              )}
            </div>

            {/* Geographical inputs (required if new institution) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado {institucionId === 'new' && <span className="text-destructive" aria-hidden="true">*</span>}</Label>
                <SearchSelect
                  id="estado"
                  options={estados}
                  value={estadoId}
                  onChange={setEstadoId}
                  placeholder="Seleccionar..."
                  aria-required={institucionId === 'new' ? 'true' : 'false'}
                  aria-invalid={!!errors.estadoId}
                  aria-describedby={errors.estadoId ? 'estado-error' : undefined}
                />
                {errors.estadoId && (
                  <span id="estado-error" className="text-xs text-destructive block mt-1" role="alert">
                    {errors.estadoId}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio">Municipio {institucionId === 'new' && <span className="text-destructive" aria-hidden="true">*</span>}</Label>
                <SearchSelect
                  id="municipio"
                  options={municipios}
                  value={municipioId}
                  onChange={setMunicipioId}
                  placeholder={estadoId ? 'Seleccionar...' : 'Elegí Estado primero'}
                  aria-required={institucionId === 'new' ? 'true' : 'false'}
                  aria-invalid={!!errors.municipioId}
                  aria-describedby={errors.municipioId ? 'municipio-error' : undefined}
                />
                {errors.municipioId && (
                  <span id="municipio-error" className="text-xs text-destructive block mt-1" role="alert">
                    {errors.municipioId}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parroquia">Parroquia {institucionId === 'new' && <span className="text-destructive" aria-hidden="true">*</span>}</Label>
                <SearchSelect
                  id="parroquia"
                  options={parroquias}
                  value={parroquiaId}
                  onChange={setParroquiaId}
                  placeholder={municipioId ? 'Seleccionar...' : 'Elegí Municipio primero'}
                  aria-required={institucionId === 'new' ? 'true' : 'false'}
                  aria-invalid={!!errors.parroquiaId}
                  aria-describedby={errors.parroquiaId ? 'parroquia-error' : undefined}
                />
                {errors.parroquiaId && (
                  <span id="parroquia-error" className="text-xs text-destructive block mt-1" role="alert">
                    {errors.parroquiaId}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección {institucionId === 'new' && <span className="text-destructive" aria-hidden="true">*</span>}</Label>
              <Input
                id="direccion"
                placeholder="Dirección física exacta"
                value={direccion}
                onChange={(e) => {
                  setDireccion(e.target.value)
                  if (errors.direccion) setErrors((prev) => ({ ...prev, direccion: null }))
                }}
                aria-required={institucionId === 'new' ? 'true' : 'false'}
                aria-invalid={!!errors.direccion}
                aria-describedby={errors.direccion ? 'direccion-error' : undefined}
                className={errors.direccion ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.direccion && (
                <span id="direccion-error" className="text-xs text-destructive block mt-1" role="alert">
                  {errors.direccion}
                </span>
              )}
            </div>
          </Card>

          {/* Section 2: Tipo de Movimiento */}
          <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
              <ArrowDownCircle className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-base text-foreground">2. Detalle del Movimiento</h3>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Movimiento</Label>
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
            </div>
          </Card>

          {/* Section 3: Información de la Donación / Producto */}
          <Card className="p-4 md:p-5 space-y-4 border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-primary" aria-hidden="true" />
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
                  <Button type="button" variant="outline" size="icon" onClick={onScanAgain} title="Escanear" aria-label="Escanear código de barras" className="shrink-0 border-input">
                    <ScanLine className="w-4 h-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product">Nombre del Producto <span className="text-destructive" aria-hidden="true">*</span></Label>
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
                aria-required="true"
                aria-invalid={!!errors.product}
                aria-describedby={errors.product ? 'product-error' : undefined}
                className={errors.product ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.product && (
                <span id="product-error" className="text-xs text-destructive block mt-1" role="alert">
                  {errors.product}
                </span>
              )}
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

            {/* Presentation & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="presentation">Presentación (empaque/unidad)</Label>
                <Input
                  id="presentation"
                  placeholder="Ej: paquete de agua de 24, 24x, caja de 500g"
                  value={presentation}
                  onChange={(e) => setPresentation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad <span className="text-destructive" aria-hidden="true">*</span></Label>
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
                  aria-required="true"
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                  className={errors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.quantity && (
                  <span id="quantity-error" className="text-xs text-destructive block mt-1" role="alert">
                    {errors.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría <span className="text-destructive" aria-hidden="true">*</span></Label>
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
                aria-required="true"
                aria-invalid={!!errors.categoryId}
                aria-describedby={errors.categoryId ? 'category-error' : undefined}
                className={errors.categoryId ? 'border-destructive focus:ring-destructive' : ''}
              />
              {errors.categoryId && (
                <span id="category-error" className="text-xs text-destructive block mt-1" role="alert">
                  {errors.categoryId}
                </span>
              )}
            </div>
          </Card>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full gap-2 text-base shadow hover:bg-primary/95" disabled={saving}>
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} aria-hidden="true" />
            {saving ? 'Guardando...' : 'Guardar y siguiente'}
          </Button>
        </form>

      </div>
    </div>
  )
}
