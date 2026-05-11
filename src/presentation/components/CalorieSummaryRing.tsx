import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

interface CalorieSummaryRingProps {
  consumed: number
  goal: number
  exerciseCalories?: number
}

export function CalorieSummaryRing({ consumed, goal, exerciseCalories = 0 }: CalorieSummaryRingProps) {
  const net = consumed - exerciseCalories
  const remaining = Math.max(goal - net, 0)
  const percentage = goal > 0 ? Math.min((net / goal) * 100, 100) : 0
  const isOver = goal > 0 && net > goal

  const data = [{ value: percentage, fill: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }]

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="75%"
            outerRadius="95%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'hsl(var(--muted))' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(net)}</span>
          <span className="text-xs text-muted-foreground">de {goal} kcal</span>
        </div>
      </div>
      <div className="mt-2 flex gap-6 text-xs">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{Math.round(consumed)}</span>
          <span className="text-muted-foreground">Consumido</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-green-600">{Math.round(exerciseCalories)}</span>
          <span className="text-muted-foreground">Quemado</span>
        </div>
        <div className="flex flex-col items-center">
          <span className={`font-semibold ${isOver ? 'text-destructive' : ''}`}>{Math.round(remaining)}</span>
          <span className="text-muted-foreground">{isOver ? 'Excedido' : 'Restante'}</span>
        </div>
      </div>
    </div>
  )
}
