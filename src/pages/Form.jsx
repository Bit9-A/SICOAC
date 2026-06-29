import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ScanLine, Save, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sendRecord, isConfigured } from '@/lib/api'
import { addToQueue, incrementSessionCount } from '@/lib/storage'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { toast } from 'sonner'

const CATEGORIES = [
  'Alimentos', 'Agua / Bebidas', 'Medicinas / Farmacia',
  'Higiene / Limpieza', 'Ropa / Calzado', 'Aseo Personal',
  'Herramientas', 'Bebés / Niños', 'Mascotas', 'Otros',
]

const UNITS = [
  { value: 'unidades', label: 'Unidades' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lt', label: 'Litros (lt)' },
  { value: 'gr', label: 'Gramos (gr)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'paquetes', label: 'Paquetes' },
  { value: 'cajas', label: 'Cajas' },
  { value: 'bolsas', label: 'Bolsas' },
]

export default function Form({ barcode: initialBarcode, onBack, onScanAgain, onSaved }) {
  const online = useOnlineStatus()
  const inputRef = useRef(null)

  const [barcode, setBarcode] = useState(initialBarcode || '')
  const [product, setProduct] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('unidades')
  const [donor, setDonor] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialBarcode) setBarcode(initialBarcode)
  }, [initialBarcode])

  // Auto-focus producto al montar o cambiar el código
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [barcode])

  async function handleSubmit(e) {
    e.preventDefault()
    
    const newErrors = {}
    if (!product.trim()) newErrors.product = 'El nombre del producto es obligatorio'
    if (!category) newErrors.category = 'La categoría es obligatoria'
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.warning('Completá los campos obligatorios')
      return
    }

    setErrors({})
    const record = {
      barcode: barcode.trim(),
      productName: product.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      donor: donor.trim(),
      notes: notes.trim(),
    }

    setSaving(true)

    if (online && isConfigured()) {
      try {
        await sendRecord(record)
        incrementSessionCount()
        toast.success(`${product} registrado`)
        resetForm()
      } catch (err) {
        toast.error(`Error al enviar: guardado en cola offline`)
        addToQueue(record)
        resetForm()
      }
    } else {
      addToQueue(record)
      incrementSessionCount()
      const msg = online
        ? 'Configurá VITE_GS_URL en el .env'
        : 'Guardado offline — sincronizá después'
      toast.success(`${product} guardado — ${msg}`)
      resetForm()
    }

    setSaving(false)
    onSaved?.()
  }

  function resetForm() {
    setBarcode('')
    setProduct('')
    setCategory('')
    setQuantity(1)
    setUnit('unidades')
    setDonor('')
    setNotes('')
    setErrors({})
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div className="flex flex-col min-h-full px-4 py-4 md:py-6 lg:py-8">
      <div className="w-full max-w-lg mx-auto space-y-6">

        {/* Back + Scan again */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver al inicio">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onScanAgain}>
            <ScanLine className="w-4 h-4" aria-hidden="true" />
            Escanear
          </Button>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Registrar Producto</h2>
          <p className="text-sm text-muted-foreground mt-1">Completá los datos del producto que llegó</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Barcode */}
          <div className="space-y-2">
            <Label htmlFor="barcode">Código de barras</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                inputMode="numeric"
                placeholder="Escanear o escribir código"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                readOnly={!!initialBarcode}
                className={initialBarcode ? 'opacity-80' : ''}
              />
              {!initialBarcode && (
                <Button type="button" variant="outline" size="icon" onClick={onScanAgain} title="Escanear" aria-label="Escanear código de barras">
                  <ScanLine className="w-4 h-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="product">
              Producto <span className="text-destructive" aria-hidden="true">*</span>
            </Label>
            <Input
              id="product"
              ref={inputRef}
              required
              aria-required="true"
              aria-invalid={!!errors.product}
              aria-describedby={errors.product ? 'product-error' : undefined}
              placeholder="Ej: Arroz, Leche, Gasas..."
              value={product}
              onChange={e => {
                setProduct(e.target.value)
                if (errors.product) setErrors(prev => ({ ...prev, product: null }))
              }}
              className={errors.product ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.product && (
              <span id="product-error" className="text-xs text-destructive block mt-1" role="alert">
                {errors.product}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Categoría <span className="text-destructive" aria-hidden="true">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={val => {
                setCategory(val)
                if (errors.category) setErrors(prev => ({ ...prev, category: null }))
              }}
              required
            >
              <SelectTrigger
                id="category"
                aria-required="true"
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? 'category-error' : undefined}
                className={errors.category ? 'border-destructive focus:ring-destructive' : ''}
              >
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <span id="category-error" className="text-xs text-destructive block mt-1" role="alert">
                {errors.category}
              </span>
            )}
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Cantidad <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                required
                aria-required="true"
                aria-invalid={!!errors.quantity}
                aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                value={quantity}
                onChange={e => {
                  setQuantity(Number(e.target.value) || '')
                  if (errors.quantity) setErrors(prev => ({ ...prev, quantity: null }))
                }}
                className={errors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.quantity && (
                <span id="quantity-error" className="text-xs text-destructive block mt-1" role="alert">
                  {errors.quantity}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(u => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Donor */}
          <div className="space-y-2">
            <Label htmlFor="donor">Donante / Procedencia</Label>
            <Input
              id="donor"
              placeholder="Nombre, organización..."
              value={donor}
              onChange={e => setDonor(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Vence pronto, frágil, etc."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full gap-2 text-base" disabled={saving}>
            <Save className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} aria-hidden="true" />
            {saving ? 'Guardando...' : 'Guardar y siguiente'}
          </Button>
        </form>

      </div>
    </div>
  )
}
