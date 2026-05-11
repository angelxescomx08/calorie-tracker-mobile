import { NavLink } from 'react-router-dom'
import { BookOpen, Dumbbell, Home, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/', icon: Home, label: 'Inicio', end: true },
  { to: '/diary', icon: BookOpen, label: 'Diario', end: false },
  { to: '/exercise', icon: Dumbbell, label: 'Ejercicio', end: false },
  { to: '/progress', icon: TrendingUp, label: 'Progreso', end: false },
  { to: '/profile', icon: User, label: 'Perfil', end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full items-center justify-around px-2">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
