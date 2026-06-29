import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CreateSelect({
  options = [],
  value = '',
  onChange,
  onCreate,
  placeholder = 'Seleccionar...',
  createMessage = 'Crear nuevo',
  displayValue,
  className,
  id,
  'aria-describedby': ariaDescribedby,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = options.find((opt) => String(opt.value) === String(value))

  const filteredOptions = query
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      )
    : options

  const hasExactMatch = options.some(
    (opt) => opt.label.toLowerCase() === query.trim().toLowerCase()
  )

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(-1)
    }
  }, [open])

  const handleSelect = (val) => {
    onChange?.(val)
    setOpen(false)
  }

  const handleCreate = async () => {
    const trimmed = query.trim()
    if (!trimmed) return
    if (onCreate) {
      const newOption = await onCreate(trimmed)
      if (newOption) {
        onChange?.(newOption.value)
      }
    }
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    const itemsCount = filteredOptions.length + (query && !hasExactMatch ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex].value)
        } else if (activeIndex === filteredOptions.length && query && !hasExactMatch) {
          handleCreate()
        } else if (filteredOptions.length === 1) {
          handleSelect(filteredOptions[0].value)
        } else if (query && !hasExactMatch && filteredOptions.length === 0) {
          handleCreate()
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.childNodes[activeIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${id}-listbox` : undefined}
        className="relative"
      >
        <input
          id={id}
          type="text"
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={open ? query : (selectedOption ? selectedOption.label : displayValue || '')}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-describedby={ariaDescribedby}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
          className="flex h-10 w-full rounded-lg border border-input bg-card pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </div>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          ref={listRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none"
        >
          {filteredOptions.map((option, index) => {
            const isSelected = String(option.value) === String(value)
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none transition-colors hover:bg-secondary hover:text-foreground cursor-pointer',
                  isSelected && 'bg-secondary font-medium',
                  index === activeIndex && 'bg-secondary text-foreground'
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {isSelected && <Check className="h-4 w-4" />}
                </span>
                {option.label}
              </li>
            )
          })}

          {query.trim() && !hasExactMatch && (
            <li
              role="option"
              onClick={handleCreate}
              className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-md py-2 px-3 text-sm text-primary font-medium hover:bg-secondary cursor-pointer border-t border-border/50 mt-1',
                activeIndex === filteredOptions.length && 'bg-secondary'
              )}
            >
              <Plus className="mr-1.5 h-4 w-4 shrink-0" />
              {createMessage} "{query.trim()}"
            </li>
          )}

          {filteredOptions.length === 0 && !query.trim() && (
            <li className="relative flex w-full select-none items-center rounded-md py-2 px-3 text-sm text-muted-foreground">
              No hay opciones disponibles
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
