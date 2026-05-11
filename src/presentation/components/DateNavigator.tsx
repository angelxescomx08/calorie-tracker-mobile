import { addDays, format, isToday, parseISO, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DateNavigatorProps {
  date: string
  onChange: (date: string) => void
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const parsed = parseISO(date)

  const prev = () => onChange(format(subDays(parsed, 1), 'yyyy-MM-dd'))
  const next = () => onChange(format(addDays(parsed, 1), 'yyyy-MM-dd'))

  const label = isToday(parsed) ? 'Today' : format(parsed, 'EEE, MMM d')

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={prev} aria-label="Previous day">
        <ChevronLeft className="size-5" />
      </Button>
      <span className="text-sm font-medium">{label}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        disabled={isToday(parsed)}
        aria-label="Next day"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  )
}
