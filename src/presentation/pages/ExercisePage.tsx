import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Flame, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ExerciseSearchSheet } from '@/presentation/components/ExerciseSearchSheet'
import { DateNavigator } from '@/presentation/components/DateNavigator'
import { useDeleteExerciseLog, useExerciseLogs } from '@/presentation/hooks/useExerciseLogs'

export function ExercisePage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data, isLoading } = useExerciseLogs(date)
  const deleteLog = useDeleteExerciseLog()

  const totalCalories = useMemo(
    () => (data?.items ?? []).reduce((acc, e) => acc + e.calories_burned, 0),
    [data],
  )

  const handleDelete = (id: number) => {
    deleteLog.mutate(
      { id, date },
      { onError: () => toast.error('No se pudo eliminar el ejercicio') },
    )
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 px-4 py-3 backdrop-blur">
        <DateNavigator date={date} onChange={setDate} />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Registro de ejercicios</span>
          <span className="font-medium text-green-600">{Math.round(totalCalories)} kcal quemadas</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {isLoading ? (
          <>{[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Flame className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Sin ejercicios registrados</p>
            <p className="text-xs text-muted-foreground">Pulsa + para agregar un ejercicio</p>
          </div>
        ) : (
          data?.items.map((log) => (
            <Card key={log.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {log.exercise?.name ?? `Ejercicio #${log.exercise_id}`}
                  </p>
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {log.exercise?.category ?? 'ejercicio'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.duration_minutes} min</span>
                    {log.distance_km && (
                      <span className="text-xs text-muted-foreground">{log.distance_km} km</span>
                    )}
                    {log.avg_heart_rate && (
                      <span className="text-xs text-muted-foreground">{log.avg_heart_rate} bpm</span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="mt-1 text-xs italic text-muted-foreground">{log.notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 pl-2">
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round(log.calories_burned)} kcal
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(log.id)}
                    disabled={deleteLog.isPending}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <Button
          className="mt-2 w-full"
          variant="outline"
          onClick={() => setSheetOpen(true)}
        >
          <Plus className="mr-1 size-4" />
          Agregar ejercicio
        </Button>
      </div>

      <ExerciseSearchSheet open={sheetOpen} onOpenChange={setSheetOpen} date={date} />
    </div>
  )
}
