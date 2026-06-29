import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle({ theme, onToggle, collapsed }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9"
      onClick={onToggle}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
