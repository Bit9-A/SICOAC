import { useState, useRef, useEffect, useCallback } from 'react'
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
  getInstituciones, createInstitucion, getCategorias, createCategoria,
  getSubcategorias, searchBarcodes, searchProducts, findProductByBarcode,
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
  const quantityRef = useRef(null)
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
  const [institucionOrigenId, setInstitucionOrigenId] = useState(isOperator ? String(userInstId || '') : '')
  const [institucionDestinoId, setInstitucionDestinoId] = useState('')
  const [newInstitucionNombre, setNewInstitucionNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('Entrada')

  const [barcode, setBarcode] = useState(initialBarcode || '')
  const [barcodeOptions, setBarcodeOptions] = useState([])
  const [barcodeSearching, setBarcodeSearching] = useState(false)
  const [product, setProduct] = useState('')
  const [productOptions, setProductOptions] = useState([])
  const [productSearching, setProductSearching] = useState(false)
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [subcategorias, setSubcategorias] = useState([])
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [presentation, setPresentation] = useState('')
  const [quantity, setQuantity] = useState('')

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const isExistingInstitution = institucionId && institucionId !== 'new' && instituciones.some(i => String(i.value) === String(institucionId))
  const isNewInstitution = institucionId === 'new'
  const selectedInstitution = instituciones.find(i => String(i.value) === String(institucionId))

  const estadoLabel = estados.find(e => String(e.value) === String(estadoId))?.label
  const municipioLabel = municipios.find(m => String(m.value) === String(municipioId))?.label
  const parroquiaLabel = parroquias.find(p => String(p.value) === String(parroquiaId))?.label

  const subcategoriasPorCat = (catId) =>
    catId ? subcategorias.filter(s => String(s.categoriaId) === String(catId)) : []

  useEffect(() => {
    async function load() {
      const [ests, insts, cats, subs] = await Promise.all([
        getEstados(), getInstituciones(), getCategorias(), getSubcategorias()
      ])
      setEstados(ests)
      setInstituciones(insts)
      setCategorias(cats)
      setSubcategorias(subs)

      if (userInstId) {
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
      const { data: parroquia } = await supabase
        .from('parroquia')
        .select('id, municipio_id')
        .eq('id', parroquiaId)
        .single()
      if (!parroquia) return

      const { data: municipio } = await supabase
        .from('municipio')
        .select('id, estado_id')
        .eq('id', parroquia.municipio_id)
        .single()
      if (!municipio) return

      setEstadoId(municipio.estado_id)
      const muns = await getMunicipios(municipio.estado_id)
      setMunicipios(muns)
      setMunicipioId(parroquia.municipio_id)
      const parqs = await getParroquias(parroquia.municipio_id)
      setParroquias(parqs)
      setParroquiaId(parroquia.id)
    } catch (err) { }
  }

  const handleBarcodeSearch = useCallback(async (query) => {
    setBarcode(query)
    if (!query || query.trim().length < 2) { setBarcodeOptions([]); return }
    setBarcodeSearching(true)
    try {
      const results = await searchBarcodes(query)
      setBarcodeOptions(results)
    } finally { setBarcodeSearching(false) }
  }, [])

  const handleBarcodeChange = useCallback((val) => {
    setBarcode(val)
    const found = barcodeOptions.find(o => o.value === val)
    if (found) {
      setProduct(found.productName)
      setDescription(found.description || '')
      setCategoryId(found.categoryId)
      setSubcategoriaId(found.subcategoriaId ? String(found.subcategoriaId) : '')
      setPresentation(found.presentation || '')
      toast.info(`Producto autocompletado: ${found.productName}`)
      setTimeout(() => quantityRef.current?.focus(), 100)
    }
  }, [barcodeOptions])

  useEffect(() => {
    if (initialBarcode) {
      setBarcode(initialBarcode)
      handleBarcodeSearch(initialBarcode)
      findProductByBarcode(initialBarcode).then(prod => {
        if (prod) {
          setProduct(prod.productName)
          setDescription(prod.description || '')
          setCategoryId(prod.categoryId)
          setSubcategoriaId(prod.subcategoriaId ? String(prod.subcategoriaId) : '')
          setPresentation(prod.presentation || '')
          toast.info(`Producto autocompletado: ${prod.productName}`)
          setTimeout(() => quantityRef.current?.focus(), 100)
        }
      })
    }
  }, [initialBarcode])

  const handleProductSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) { setProductOptions([]); return }
    setProductSearching(true)
    try {
      const results = await searchProducts(query)
      setProductOptions(results)
    } finally { setProductSearching(false) }
  }, [])

  const handleProductChange = useCallback((val) => {
    const found = productOptions.find(o => o.value === val)
    if (found) {
      setProduct(found.productName)
      setDescription(found.description || '')
      setCategoryId(found.categoryId)
      setSubcategoriaId(found.subcategoriaId ? String(found.subcategoriaId) : '')
      setPresentation(found.presentation || '')
      toast.info(`Producto seleccionado: ${found.productName}`)
      setTimeout(() => quantityRef.current?.focus(), 100)
    }
  }, [productOptions])

  const handleSelectInstitucion = async (id) => {
    setInstitucionId(id)
    setErrors({})
    if (id === 'new' || isOperator) return
    const inst = instituciones.find(i => String(i.value.to) === String(id))
    if (!inst) return
    setDireccion(inst.direccion || '')
    if (inst.parroquiaId) loadGeo(inst.parroquiaId)
  }

  const handleCreateInstitucion = async (name) => {
    setInstitucionId('new')
    setNewInstitucionNombre(name.toUpperCase())
    setDireccion(''); setEstadoId(''); setMunicipioId(''); setParroquiaId('')
    setMunicipios([]); setParroquias([])
    return { value: 'new', label: name }
  }

  const handleCreateCategory = async (name) => ({ value: name, label: name })

  function validateStep1() {
    const e = {}
    if (!institucionId) e.institucionId = 'Selecciona o crea una institución'
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
    if (validateStep1()) { setStep(2); setTimeout(() => quantityRef.current?.focus(), 100) }
    else toast.warning('Completa los datos de la institución')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!product.trim()) newErrors.product = 'El producto es obligatorio'
    if (!categoryId) newErrors.categoryId = 'La categoría es obligatoria'
    const qty = Number(quantity)
    if (!quantity || quantity.trim() === '' || isNaN(qty) || qty <= 0) newErrors.quantity = 'Ingresa una cantidad positiva'

    const isTransfer = tipoMovimiento === 'Transferencia'
    const isSalida = tipoMovimiento === 'Salida'

    if (isTransfer) {
      if (!institucionOrigenId) newErrors.institucionOrigenId = 'Selecciona el origen'
      if (!institucionDestinoId) newErrors.institucionDestinoId = 'Selecciona el destino'
      if (institucionOrigenId && institucionDestinoId && institucionOrigenId === institucionDestinoId) {
        newErrors.institucionDestinoId = 'El destino debe ser diferente al origen'
      }
    } else {
      if (!institucionId) newErrors.institucionId = 'Selecciona una institución'
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); toast.warning('Corrige los campos marcados'); return }

    if ((isSalida || isTransfer) && !isNaN(qty) && qty > 0) {
      const instId = isTransfer ? institucionOrigenId : institucionId
      if (instId && barcodeOptions.length > 0) {
        let prodId = null
        const barcFound = barcodeOptions.find(o => o.value === barcode)
        if (barcFound) prodId = barcFound.productId
        if (!prodId) {
          const prodFound = productOptions.find(o => o.value === product)
          if (prodFound) prodId = prodFound.productId
        }
        if (prodId) {
          const { data: stockData } = await supabase
            .from('inventario')
            .select('cantidad')
            .eq('producto_id', prodId)
            .eq('institucion_id', instId)
            .maybeSingle()
          const disponible = Number(stockData?.cantidad || 0)
          if (qty > disponible) {
            setErrors({ quantity: `Stock insuficiente: disponible ${disponible}, requerido ${qty}` })
            toast.error(`Stock insuficiente: solo hay ${disponible} unidades disponibles`)
            return
          }
        }
      }
    }

    setErrors({})
    setSaving(true)
    try {
      let finalInstId = institucionId
      if (!isTransfer && institucionId === 'new') {
        const newInst = await createInstitucion(newInstitucionNombre, direccion, parroquiaId)
        finalInstId = newInst.value
        const updated = await getInstituciones(); setInstituciones(updated)
      }

      const record = {
        institucionId: isTransfer ? institucionOrigenId : finalInstId,
        institucionOrigenId: isTransfer ? institucionOrigenId : null,
        institucionDestinoId: isTransfer ? institucionDestinoId : null,
        direccion: normalizeText(direccion),
        tipoMovimiento: isTransfer ? 'Transferencia' : (isOperator ? 'Entrada' : tipoMovimiento),
        barcode: barcode.trim(),
        productName: normalizeText(product),
        description: normalizeText(description),
        quantity: qty,
        categoryId,
        subcategoriaId: subcategoriaId || null,
        presentation: presentation || 'unidades',
      }

      if (online && isConfigured()) {
        await sendRecord(record)
        incrementSessionCount()
        toast.success(`Movimiento de ${product} registrado con éxito`)
        resetForm()
      } else {
        addToQueue(record)
        incrementSessionCount()
        toast.success(`${product} guardado — ${online ? 'configura Supabase' : 'modo offline'}`)
        resetForm()
      }
    } catch (err) {
      toast.error('Error — guardado en cola offline')
      addToQueue({
        institucionId: isTransfer ? institucionOrigenId : institucionId,
        institucionOrigenId: isTransfer ? institucionOrigenId : null,
        institucionDestinoId: isTransfer ? institucionDestinoId : null,
        tipoMovimiento: isTransfer ? 'Transferencia' : (isOperator ? 'Entrada' : tipoMovimiento),
        barcode: barcode.trim(), productName: normalizeText(product),
        description: normalizeText(description), quantity: qty, categoryId,
        subcategoriaId: subcategoriaId || null,
        presentation: presentation || 'unidades',
      })
      resetForm()
    } finally {
      setSaving(false)
      onSaved?.()
    }
  }

  function resetForm() {
    setBarcode(''); setBarcodeOptions([])
    setProduct(''); setProductOptions([])
    setDescription(''); setCategoryId(''); setSubcategoriaId(''); setPresentation(''); setQuantity('')
    setErrors({})
    if (isOperator) {
      setStep(2)
    } else {
      setStep(1)
      setInstitucionId(''); setNewInstitucionNombre(''); setDireccion('')
      setEstadoId(''); setMunicipioId(''); setParroquiaId('')
      setMunicipios([]); setParroquias([])
      setInstitucionDestinoId('')
    }
    setTimeout(() => quantityRef.current?.focus(), 100)
  }

  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8 bg-background">
      <div className="w-full max-w-xl mx-auto space-y-6">

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
              ? 'Registra los productos que llegan al centro de acopio'
              : step === 1 ? 'Paso 1: Identifica el centro de acopio' : 'Paso 2: Completa los datos del movimiento'
            }
          </p>
        </div>

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
                <div className="space-y-2">
                  <Label>Nombre de la Institución *</Label>
                  <Input 
                    value={newInstitucionNombre} 
                    onChange={e => setNewInstitucionNombre(e.target.value.toUpperCase())} 
                    placeholder="Ej: CENTRO DE ACOPIO CARACAS"
                  />
                </div>
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

            {!institucionId && <p className="text-sm text-muted-foreground text-center py-4">Selecciona o crea una institución</p>}

            <Button type="button" size="lg" className="w-full gap-2" onClick={handleNextStep}>
              Siguiente <ChevronRight className="w-5 h-5" />
            </Button>
          </Card>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {tipoMovimiento === 'Transferencia' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Origen *</Label>
                  <SearchSelect
                    options={instituciones.filter(i => String(i.value) !== String(institucionDestinoId))}
                    value={institucionOrigenId}
                    onChange={setInstitucionOrigenId}
                    placeholder="Seleccionar origen..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destino *</Label>
                  <SearchSelect
                    options={instituciones.filter(i => String(i.value) !== String(institucionOrigenId))}
                    value={institucionDestinoId}
                    onChange={setInstitucionDestinoId}
                    placeholder="Seleccionar destino..."
                  />
                </div>
              </div>
            ) : (
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
            )}

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
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant={tipoMovimiento === 'Entrada' ? 'default' : 'outline'} onClick={() => setTipoMovimiento('Entrada')} className="gap-2">
                    <ArrowDownCircle className="w-4 h-4" /> Entrada
                  </Button>
                  <Button type="button" variant={tipoMovimiento === 'Salida' ? 'default' : 'outline'} onClick={() => setTipoMovimiento('Salida')} className="gap-2">
                    <ArrowUpCircle className="w-4 h-4" /> Salida
                  </Button>
                  <Button type="button" variant={tipoMovimiento === 'Transferencia' ? 'default' : 'outline'} onClick={() => { setTipoMovimiento('Transferencia'); setStep(2) }} className="gap-2">
                    <ArrowUpCircle className="w-4 h-4" /> Transferencia
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-4 md:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">3. Producto</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de barras</Label>
                <div className="flex gap-2">
                  <SearchSelect
                    id="barcode"
                    options={barcodeOptions}
                    value={barcode}
                    onChange={handleBarcodeChange}
                    onSearch={handleBarcodeSearch}
                    searching={barcodeSearching}
                    placeholder="Escanear o escribir..."
                    emptyMessage={barcode?.trim().length >= 2 ? 'Sin resultados — puedes escribir un código nuevo' : 'Escribe al menos 2 dígitos'}
                    showValueAsText
                    className="flex-1"
                  />
                  {!initialBarcode && <Button type="button" variant="outline" size="icon" onClick={onScanAgain}><ScanLine className="w-4 h-4" /></Button>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Producto <span className="text-destructive">*</span></Label>
                <SearchSelect
                  id="product"
                  options={productOptions}
                  value={product}
                  onChange={handleProductChange}
                  onSearch={handleProductSearch}
                  searching={productSearching}
                  placeholder="Escribe el nombre del producto..."
                  emptyMessage={product?.trim().length >= 2 ? 'Sin resultados' : 'Escribe al menos 2 caracteres'}
                  showValueAsText
                />
                {errors.product && <p className="text-xs text-destructive">{errors.product}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" rows={2} placeholder="Detalle adicional..." value={description} onChange={e => setDescription(normalizeText(e.target.value))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad <span className="text-destructive">*</span></Label>
                <Input
                  id="quantity"
                  ref={quantityRef}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="Ej: 10"
                  value={quantity}
                  onChange={e => { setQuantity(e.target.value); if (errors.quantity) setErrors(p => ({...p, quantity: null})) }}
                  onBlur={() => {
                    const q = Number(quantity)
                    if (quantity && quantity.trim() !== '' && (isNaN(q) || q <= 0)) {
                      setErrors(p => ({...p, quantity: 'Debe ser un número positivo'}))
                    }
                  }}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría <span className="text-destructive">*</span></Label>
                <CreateSelect id="category" options={categorias} value={categoryId} onChange={val => { setCategoryId(val); setSubcategoriaId(''); if (errors.categoryId) setErrors(p => ({...p, categoryId: null})) }} onCreate={handleCreateCategory} placeholder="Seleccionar o escribir..." createMessage="Crear categoría" displayValue={typeof categoryId === 'string' && !categorias.some(c => String(c.value) === String(categoryId)) ? categoryId : undefined} />
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategoría</Label>
                <SearchSelect
                  id="subcategory"
                  options={subcategoriasPorCat(categoryId)}
                  value={subcategoriaId}
                  onChange={setSubcategoriaId}
                  placeholder={categoryId ? 'Seleccionar...' : 'Primero selecciona una categoría'}
                />
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