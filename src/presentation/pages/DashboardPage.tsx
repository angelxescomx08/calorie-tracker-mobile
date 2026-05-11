import { useMemo } from 'react'
import { format } from 'date-fns'
import { Droplets, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CalorieSummaryRing } from '@/presentation/components/CalorieSummaryRing'
import { MacroCard } from '@/presentation/components/MacroCard'
import { useAuth } from '@/presentation/context/AuthContext'
import { useUpdateDailyLog, useDailyLog } from '@/presentation/hooks/useDailyLog'
import { useExerciseLogs } from '@/presentation/hooks/useExerciseLogs'
import { useActiveGoal } from '@/presentation/hooks/useGoals'

const today = format(new Date(), 'yyyy-MM-dd')

export function DashboardPage() {
  const { user } = useAuth()
  const { data: dailyLog, isLoading: logLoading } = useDailyLog(today)
  const { data: goal } = useActiveGoal()
  const { data: exerciseData } = useExerciseLogs(today)
  const updateLog = useUpdateDailyLog()

  const macros = useMemo(() => {
    if (!dailyLog?.meal_entries) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    return dailyLog.meal_entries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein_g,
        carbs: acc.carbs + e.carbs_g,
        fat: acc.fat + e.fat_g,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }, [dailyLog])

  const exerciseCalories = useMemo(
    () => (exerciseData?.items ?? []).reduce((acc, e) => acc + e.calories_burned, 0),
    [exerciseData],
  )

  const calorieGoal = goal?.daily_calorie_target ?? 2000
  const waterMl = dailyLog?.water_ml ?? 0

  const changeWater = (delta: number) => {
    if (!dailyLog) return
    const newWater = Math.max(0, waterMl + delta)
    updateLog.mutate({ id: dailyLog.id, dto: { water_ml: newWater }, date: today })
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">
          {greeting()}, {user?.name.split(' ')[0]}
        </h2>
        <p className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>

      {logLoading ? (
        <Skeleton className="mx-auto h-48 w-48 rounded-full" />
      ) : (
        <div className="flex justify-center">
          <CalorieSummaryRing
            consumed={macros.calories}
            goal={calorieGoal}
            exerciseCalories={exerciseCalories}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <MacroCard label="Protein" current={macros.protein} goal={goal ? 50 : 50} color="bg-blue-500" />
        <MacroCard label="Carbs" current={macros.carbs} goal={goal ? Math.round(calorieGoal * 0.5 / 4) : 250} color="bg-yellow-500" />
        <MacroCard label="Fat" current={macros.fat} goal={goal ? Math.round(calorieGoal * 0.3 / 9) : 65} color="bg-orange-500" />
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-blue-500" />
            <span className="text-sm font-medium">Water</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => changeWater(-250)}
              disabled={updateLog.isPending || waterMl === 0}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-16 text-center text-sm font-medium">{waterMl} ml</span>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => changeWater(250)}
              disabled={updateLog.isPending}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-3">
          <span className="text-sm font-medium">Exercise</span>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(exerciseCalories)} kcal burned
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
