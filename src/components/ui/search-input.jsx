import { Search } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export default function SearchInput({ value, onChange, placeholder, className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Buscar...'}
        className="pl-9"
      />
    </div>
  )
}
