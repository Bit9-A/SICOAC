import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CreateSelect({
  options = [],
  value = '',
  onChange,
  onCreate,
  placeholder = 'Seleccionar...',
  createMessage = 'Crear',
  displayValue,
  className,
  id,
  error,
}) {
  const [open, setOpen]               = useState(false)
  const [query, setQuery]             = useState('')
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const inputRef     = useRef(null)
  const listRef      = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = options.find((opt) => String(opt.value) === String(value))
  const displayLabel   = selectedOption?.label || displayValue || ''

  const filteredOptions  = query
    ? options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
    : options
  const hasExactMatch    = options.some((opt) => opt.label.toLowerCase() === query.trim().toLowerCase())
  const showCreateOption = query.trim() && !hasExactMatch

  // Recalculate dropdown position
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
        !document.getElementById('cs-portal-root')?.contains(e.target)
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

  const handleCreate = async () => {
    const trimmed = query.trim()
    if (!trimmed || !onCreate) return
    const newOption = await onCreate(trimmed)
    if (newOption) onChange?.(newOption.value)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) }
      return
    }
    const totalItems = filteredOptions.length + (showCreateOption ? 1 : 0)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) handleSelect(filteredOptions[activeIndex].value)
        else if (activeIndex === filteredOptions.length && showCreateOption) handleCreate()
        else if (filteredOptions.length === 1) handleSelect(filteredOptions[0].value)
        else if (showCreateOption && filteredOptions.length === 0) handleCreate()
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
      {/* Search */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setQuery('') }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Options */}
      <ul ref={listRef} className="max-h-60 overflow-auto p-1" role="listbox">
        {filteredOptions.map((option, index) => {
          const isSelected = String(option.value) === String(value)
          return (
            <li
              key={option.value}
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(option.value) }}
              className={cn(
                'relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none',
                'hover:bg-secondary focus:bg-secondary',
                isSelected && 'bg-secondary font-medium',
                index === activeIndex && 'bg-secondary',
              )}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
              </span>
              {option.label}
            </li>
          )
        })}

        {showCreateOption && (
          <li
            role="option"
            onMouseDown={(e) => { e.preventDefault(); handleCreate() }}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm outline-none border-t mt-1 pt-2',
              'text-primary font-medium hover:bg-secondary focus:bg-secondary',
              activeIndex === filteredOptions.length && 'bg-secondary',
            )}
          >
            <Plus className="mr-1.5 h-4 w-4 shrink-0" />
            {createMessage} &ldquo;{query.trim()}&rdquo;
          </li>
        )}

        {filteredOptions.length === 0 && !showCreateOption && (
          <li className="py-6 text-center text-sm text-muted-foreground">No hay opciones disponibles</li>
        )}
      </ul>
    </div>
  ) : null

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border bg-secondary px-3 py-2 text-sm',
          error ? 'border-destructive' : 'border-input',
          'hover:bg-secondary/80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        id={id}
      >
        <span className={cn('truncate', !displayLabel && 'text-muted-foreground')}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown className={cn(
          'ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform',
          open && 'rotate-180',
        )} />
      </button>

      {/* Portal: renderiza el dropdown directamente en <body> */}
      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  )
}
