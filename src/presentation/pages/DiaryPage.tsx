import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { MealType } from '@/domain/entities'
import { FoodSearchSheet } from '@/presentation/components/FoodSearchSheet'
import { DateNavigator } from '@/presentation/components/DateNavigator'
import { useDailyLog, useDeleteMealEntry } from '@/presentation/hooks/useDailyLog'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Merienda',
}

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export function DiaryPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')

  const { data: log, isLoading } = useDailyLog(date)
  const deleteMeal = useDeleteMealEntry()

  const mealTotals = useMemo(() => {
    if (!log) return {}
    return MEAL_ORDER.reduce<Record<string, number>>((acc, type) => {
      const entries = log.meal_entries.filter((e) => e.meal_type === type)
      acc[type] = entries.reduce((s, e) => s + e.calories, 0)
      return acc
    }, {})
  }, [log])

  const totalCalories = useMemo(
    () => (log?.meal_entries ?? []).reduce((s, e) => s + e.calories, 0),
    [log],
  )

  const openSheet = (mealType: MealType) => {
    setActiveMeal(mealType)
    setSheetOpen(true)
  }

  const handleDelete = (entryId: number, logId: number) => {
    deleteMeal.mutate(
      { entryId, logId, date },
      { onError: () => toast.error('No se pudo eliminar el registro') },
    )
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 px-4 py-3 backdrop-blur">
        <DateNavigator date={date} onChange={setDate} />
        <div className="mt-1 text-right text-xs text-muted-foreground">
          Total: <span className="font-medium">{Math.round(totalCalories)} kcal</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {isLoading ? (
          <>{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full" />)}</>
        ) : (
          MEAL_ORDER.map((mealType) => {
            const entries = log?.meal_entries.filter((e) => e.meal_type === mealType) ?? []
            return (
              <Card key={mealType}>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{MEAL_LABELS[mealType]}</CardTitle>
                    <div className="flex items-center gap-2">
                      {entries.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(mealTotals[mealType] ?? 0)} kcal
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => openSheet(mealType)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {entries.length > 0 && (
                  <CardContent className="pt-0">
                    <Separator className="mb-2" />
                    <div className="flex flex-col gap-1">
                      {entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between py-1">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">
                              {entry.food?.name ?? `Alimento #${entry.food_id}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.quantity_g}g · {Math.round(entry.protein_g)}P {Math.round(entry.carbs_g)}C {Math.round(entry.fat_g)}F
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 pl-2">
                            <span className="text-xs font-medium">{Math.round(entry.calories)} kcal</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(entry.id, entry.daily_log_id)}
                              disabled={deleteMeal.isPending}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>

      <FoodSearchSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        date={date}
        mealType={activeMeal}
      />
    </div>
  )
}
