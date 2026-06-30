import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, ScanLine, Save, Building, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchSelect } from '@/components/ui/search-select'
import {
  sendRecord, isConfigured, getInstituciones, getCategorias,
  searchProducts, findProductByBarcode,
} from '@/lib/api'
import { addToQueue, incrementSessionCount } from '@/lib/storage'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { normalizeText } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function Form({ barcode: initialBarcode, onBack, onScanAgain, onSaved, userProfile }) {
  const online = useOnlineStatus()
  const { rol, institucionId: userInstId } = useAuth()
  const quantityRef = useRef(null)
  const isSuperAdmin = rol === 'super_admin'

  const [instituciones, setInstituciones] = useState([])
  const [institucionId, setInstitucionId] = useState(
    !isSuperAdmin ? String(userInstId || '') : '',
  )

  const [barcode, setBarcode] = useState(initialBarcode || '')
  const [product, setProduct] = useState('')
  const [productOptions, setProductOptions] = useState([])
  const [productSearching, setProductSearching] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [weight, setWeight] = useState('')

  // Hidden — auto-managed from product selection / barcode lookup
  const [categoryId, setCategoryId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [presentation, setPresentation] = useState('')
  const [description, setDescription] = useState('')
  const [defaultCategoryId, setDefaultCategoryId] = useState('')

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // ── Load inicial ──────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [insts, cats] = await Promise.all([
        getInstituciones(),
        getCategorias(),
      ])
      setInstituciones(insts)
      if (cats.length > 0) setDefaultCategoryId(cats[0].value)
      if (userInstId) setInstitucionId(String(userInstId))
    }
    load()
  }, [])

  // ── Código de barras recibido del escáner ─────────────────
  useEffect(() => {
    if (!initialBarcode) return
    setBarcode(initialBarcode)
    findProductByBarcode(initialBarcode).then((prod) => {
      if (prod) {
        fillProduct(prod.productName, prod.categoryId, prod.subcategoriaId, prod.presentation, prod.description)
        toast.info(`Producto autocompletado: ${prod.productName}`)
        setTimeout(() => quantityRef.current?.focus(), 100)
      } else {
        clearProduct()
      }
    })
  }, [initialBarcode])

  // ── Helpers ───────────────────────────────────────────────
  function fillProduct(name, catId, subId, pres, desc) {
    setProduct(name)
    setCategoryId(catId || '')
    setSubcategoriaId(subId ? String(subId) : '')
    setPresentation(pres || '')
    setDescription(desc || '')
  }

  function clearProduct() {
    setProduct('')
    setProductOptions([])
    setCategoryId('')
    setSubcategoriaId('')
    setPresentation('')
    setDescription('')
  }

  // ── Búsqueda de productos ─────────────────────────────────
  const handleProductSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) { setProductOptions([]); return }
    setProductSearching(true)
    try {
      const results = await searchProducts(query)
      setProductOptions(results)
    } finally { setProductSearching(false) }
  }, [])

  const handleProductChange = useCallback((val) => {
    const found = productOptions.find((o) => o.value === val)
    if (!found) return
    fillProduct(found.productName, found.categoryId, found.subcategoriaId, found.presentation, found.description)
    setBarcode((prev) => found.barcode || prev)
    toast.info(`Producto seleccionado: ${found.productName}`)
    setTimeout(() => quantityRef.current?.focus(), 100)
  }, [productOptions])

  // ── Búsqueda manual por código de barras ──────────────────
  const handleBarcodeBlur = useCallback(async () => {
    const code = barcode?.trim()
    if (!code || code.length < 2) return
    const prod = await findProductByBarcode(code)
    if (!prod) return
    fillProduct(prod.productName, prod.categoryId, prod.subcategoriaId, prod.presentation, prod.description)
    toast.info(`Producto autocompletado: ${prod.productName}`)
    setTimeout(() => quantityRef.current?.focus(), 100)
  }, [barcode])

  // ── Submit ────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!product.trim()) newErrors.product = 'El producto es obligatorio'
    const qty = Number(quantity)
    if (!quantity || quantity.trim() === '' || isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Ingresa una cantidad positiva'
    }
    if (!institucionId && isSuperAdmin) {
      newErrors.institucionId = 'Selecciona una institución'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.warning('Corrige los campos marcados')
      return
    }

    setErrors({})
    setSaving(true)

    const finalCatId = categoryId || defaultCategoryId || 'General'

    const record = {
      institucionId,
      institucionOrigenId: null,
      institucionDestinoId: null,
      tipoMovimiento: 'Entrada',
      barcode: barcode.trim(),
      productName: normalizeText(product),
      description: normalizeText(description),
      quantity: qty,
      peso_unitario: weight ? Number(weight) : null,
      categoryId: finalCatId,
      subcategoriaId: subcategoriaId || null,
      presentation: presentation || 'unidades',
    }

    try {
      if (online && isConfigured()) {
        await sendRecord(record)
        incrementSessionCount()
        toast.success(`${product} registrado con éxito`)
      } else {
        addToQueue(record)
        incrementSessionCount()
        toast.success(`${product} guardado en modo offline`)
      }
      resetForm()
    } catch {
      toast.error('Error — guardado en cola offline')
      addToQueue(record)
      resetForm()
    } finally {
      setSaving(false)
      onSaved?.()
    }
  }

  function resetForm() {
    setBarcode('')
    clearProduct()
    setQuantity('')
    setWeight('')
    setErrors({})
    setTimeout(() => quantityRef.current?.focus(), 100)
  }

  const selectedInstitution = instituciones.find(
    (i) => String(i.value) === String(institucionId),
  )
  const displayInstitution =
    userProfile?.institucion?.nombre || selectedInstitution?.label

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8 bg-background">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onScanAgain}>
            <ScanLine className="w-4 h-4" /> Escanear
          </Button>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold">Registrar Entrada</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Registra los productos que ingresan al centro de acopio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Institución — solo super_admin elige, resto ve su institución */}
          {isSuperAdmin ? (
            <Card className="p-4 md:p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Centro de Acopio</h3>
              </div>
              <div className="space-y-2">
                <Label>
                  Institución <span className="text-destructive">*</span>
                </Label>
                <SearchSelect
                  options={instituciones}
                  value={institucionId}
                  onChange={setInstitucionId}
                  placeholder="Seleccionar institución..."
                />
                {errors.institucionId && (
                  <p className="text-xs text-destructive">{errors.institucionId}</p>
                )}
              </div>
            </Card>
          ) : displayInstitution ? (
            <Card className="p-3 border-border/60 bg-card">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium truncate">{displayInstitution}</span>
              </div>
            </Card>
          ) : null}

          {/* Producto */}
          <Card className="p-4 md:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Producto</h3>
            </div>

            {/* Código de barras — opcional */}
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de barras (opcional)</Label>
              <Input
                id="barcode"
                type="text"
                inputMode="numeric"
                placeholder="Escanear o escribir código..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onBlur={handleBarcodeBlur}
              />
            </div>

            {/* Nombre del producto */}
            <div className="space-y-2">
              <Label htmlFor="product">
                Producto <span className="text-destructive">*</span>
              </Label>
              <SearchSelect
                id="product"
                options={productOptions}
                value={product}
                onChange={handleProductChange}
                onSearch={handleProductSearch}
                onQueryChange={(v) => {
                  const upper = v.toUpperCase()
                  if (upper !== product) clearProduct()
                  setProduct(upper)
                }}
                searching={productSearching}
                placeholder="Escribe el nombre del producto..."
                emptyMessage={
                  product?.trim().length >= 2
                    ? 'Sin resultados — se creará uno nuevo'
                    : 'Escribe al menos 2 caracteres'
                }
                showValueAsText
              />
              {errors.product && (
                <p className="text-xs text-destructive">{errors.product}</p>
              )}
            </div>

            {/* Cantidad + Peso unitario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Cantidad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  ref={quantityRef}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="Ej: 10"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    if (errors.quantity) setErrors((p) => ({ ...p, quantity: null }))
                  }}
                  onBlur={() => {
                    const q = Number(quantity)
                    if (quantity && quantity.trim() !== '' && (isNaN(q) || q <= 0)) {
                      setErrors((p) => ({ ...p, quantity: 'Debe ser un número positivo' }))
                    }
                  }}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive">{errors.quantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso unit. (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="Ej: 2.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={saving}
          >
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? 'Guardando...' : 'Guardar y siguiente'}
          </Button>
        </form>
      </div>
    </div>
  )
}
