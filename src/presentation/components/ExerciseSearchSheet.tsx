import { useState } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { Exercise, ExerciseCategory } from '@/domain/entities'
import { useCreateExerciseLog } from '@/presentation/hooks/useExerciseLogs'
import { useExerciseSearch } from '@/presentation/hooks/useExercises'

interface ExerciseSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
}

const CATEGORIES: { value: ExerciseCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Fuerza' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'sports', label: 'Deportes' },
  { value: 'other', label: 'Otro' },
]

export function ExerciseSearchSheet({ open, onOpenChange, date }: ExerciseSearchSheetProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ExerciseCategory | ''>('')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [duration, setDuration] = useState('30')

  const { data, isLoading } = useExerciseSearch(query, category)
  const createLog = useCreateExerciseLog()

  const handleAdd = () => {
    if (!selected) return
    const mins = parseInt(duration)
    if (isNaN(mins) || mins <= 0) return

    createLog.mutate(
      { exercise_id: selected.id, log_date: format(new Date(date), 'yyyy-MM-dd'), duration_minutes: mins },
      {
        onSuccess: () => {
          toast.success(`${selected.name} registrado`)
          handleClose()
        },
        onError: () => toast.error('No se pudo registrar el ejercicio'),
      },
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setQuery('')
      setCategory('')
      setSelected(null)
      setDuration('30')
    }, 300)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-0">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle>Registrar ejercicio</SheetTitle>
        </SheetHeader>

        {selected ? (
          <div className="flex flex-col gap-4 px-4">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="font-medium">{selected.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{selected.category} · MET {selected.met_value}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Duración (minutos)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                Volver
              </Button>
              <Button className="flex-1" onClick={handleAdd} disabled={createLog.isPending}>
                {createLog.isPending ? 'Guardando...' : 'Registrar'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ejercicios..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <Select value={category} onValueChange={(v) => setCategory(v as ExerciseCategory | '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value || '__all__'}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[calc(85vh-200px)]">
              <div className="flex flex-col px-4">
                {isLoading && (
                  <>{[1, 2, 3].map((i) => <Skeleton key={i} className="mb-2 h-14 w-full" />)}</>
                )}
                {!isLoading && (query.length < 2 && !category) && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Busca o selecciona una categoría
                  </p>
                )}
                {!isLoading && (query.length >= 2 || !!category) && !data?.items.length && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron ejercicios</p>
                )}
                {data?.items.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => setSelected(exercise)}
                    className="flex items-center justify-between rounded-lg px-2 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{exercise.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{exercise.category}</p>
                    </div>
                    <span className="ml-2 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">
                      MET {exercise.met_value}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
