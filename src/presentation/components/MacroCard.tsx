import { Progress } from '@/components/ui/progress'

interface MacroCardProps {
  label: string
  current: number
  goal: number
  unit?: string
  color?: string
}

export function MacroCard({ label, current, goal, unit = 'g', color = 'bg-primary' }: MacroCardProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0

  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">
        {Math.round(current)}<span className="text-xs font-normal text-muted-foreground">/{goal}{unit}</span>
      </span>
      <Progress value={percentage} className={`h-1.5 [&>div]:${color}`} />
    </div>
  )
}
