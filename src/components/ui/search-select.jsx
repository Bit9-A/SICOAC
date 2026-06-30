import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchSelect({
  options = [],
  value = '',
  onChange,
  placeholder = 'Seleccionar...',
  emptyMessage = 'No se encontraron resultados',
  className,
  id,
  onSearch,       // (query: string) => void — se llama al escribir, desactiva filtro interno
  searching,      // bool — muestra spinner de búsqueda
  showValueAsText,// bool — si no hay option que matchee el value, muestra el value como texto
  error,          // bool — muestra borde rojo de error
  inputMode,      // string — inputMode override (ej: 'numeric' para barcode)
}) {
  const [open, setOpen]           = useState(false)
  const [query, setQuery]         = useState('')
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const inputRef     = useRef(null)
  const listRef      = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = options.find((opt) => String(opt.value) === String(value))

  const displayOptions = onSearch ? options : (
    query
      ? options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
      : options
  )

  // Recalculate dropdown position on open / scroll / resize
  const updatePos = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setDropdownPos({
      top:   rect.bottom + window.scrollY + 4,
      left:  rect.left   + window.scrollX,
      width: rect.width,
    })
  }, [])

  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        !document.getElementById('ss-portal-root')?.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) { setQuery(''); setActiveIndex(-1) }
    else setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const handleSelect = (val) => { onChange?.(val); setOpen(false) }

  const handleInputChange = useCallback((e) => {
    const q = e.target.value
    setQuery(q)
    setActiveIndex(0)
    if (!open) setOpen(true)
    onSearch?.(q)
  }, [open, onSearch])

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < displayOptions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < displayOptions.length) handleSelect(displayOptions[activeIndex].value)
        else if (displayOptions.length === 1) handleSelect(displayOptions[0].value)
        break
      case 'Escape':
        e.preventDefault(); setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      listRef.current.childNodes[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const triggerText = selectedOption
    ? selectedOption.label
    : (showValueAsText && value ? value : placeholder)

  const dropdown = open ? (
    <div
      style={{
        position: 'absolute',
        top:   dropdownPos.top,
        left:  dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
      }}
      className="rounded-lg border border-border bg-popover text-popover-foreground shadow-xl"
    >
      {displayOptions.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          {searching ? 'Buscando...' : emptyMessage}
        </div>
      ) : (
        <ul ref={listRef} className="max-h-60 overflow-auto p-1" role="listbox">
          {displayOptions.map((option, index) => {
            const isSelected = String(option.value) === String(value)
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(option.value) }}
                className={cn(
                  'relative flex cursor-default select-none items-start rounded-md py-2 pl-8 pr-3 text-sm outline-none',
                  'hover:bg-secondary focus:bg-secondary',
                  isSelected && 'bg-secondary font-medium',
                  index === activeIndex && 'bg-secondary',
                )}
              >
                <span className="absolute left-2 top-2.5 flex h-3.5 w-3.5 items-center justify-center">
                  {isSelected && <Check className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.detail && (
                    <span className="block truncate text-xs text-muted-foreground">{option.detail}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  ) : null

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger / Input */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <input
          id={id}
          ref={inputRef}
          type="text"
          inputMode={inputMode}
          placeholder={triggerText}
          value={open ? query : ''}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm ring-offset-background',
            error ? 'border-destructive' : 'border-input',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Portal: renderiza el dropdown directamente en <body> */}
      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  )
}
