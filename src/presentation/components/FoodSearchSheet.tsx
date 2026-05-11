import { useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { Food, MealType } from '@/domain/entities'
import { useAddMealEntry } from '@/presentation/hooks/useDailyLog'
import { useFoodSearch } from '@/presentation/hooks/useFoods'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Merienda',
}

interface FoodSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
  mealType: MealType
}

export function FoodSearchSheet({ open, onOpenChange, date, mealType }: FoodSearchSheetProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState('100')

  const { data, isLoading } = useFoodSearch(query)
  const addMeal = useAddMealEntry()

  const handleAdd = () => {
    if (!selected) return
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) return

    addMeal.mutate(
      { date, meal_type: mealType, food_id: selected.id, quantity_g: qty },
      {
        onSuccess: () => {
          toast.success(`${selected.name} agregado a ${MEAL_LABELS[mealType]}`)
          handleClose()
        },
        onError: () => toast.error('No se pudo agregar el alimento'),
      },
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setQuery('')
      setSelected(null)
      setQuantity('100')
    }, 300)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-0">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle>Agregar a {MEAL_LABELS[mealType]}</SheetTitle>
        </SheetHeader>

        {selected ? (
          <div className="flex flex-col gap-4 px-4">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="font-medium">{selected.name}</p>
              {selected.brand && <p className="text-xs text-muted-foreground">{selected.brand}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Por 100g: {selected.calories} kcal · {selected.protein_g}g P · {selected.carbs_g}g C · {selected.fat_g}g F
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Cantidad (gramos)</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div className="flex-1 rounded-lg border bg-muted/40 p-3 text-center">
                <p className="text-xs text-muted-foreground">Calorías</p>
                <p className="text-lg font-semibold">
                  {Math.round((parseFloat(quantity) || 0) * selected.calories / 100)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                Volver
              </Button>
              <Button className="flex-1" onClick={handleAdd} disabled={addMeal.isPending}>
                {addMeal.isPending ? 'Guardando...' : 'Agregar'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative px-4 pb-3">
              <Search className="absolute left-7 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alimentos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <ScrollArea className="h-[calc(85vh-140px)]">
              <div className="flex flex-col px-4">
                {isLoading && (
                  <>
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="mb-2 h-14 w-full" />)}
                  </>
                )}
                {!isLoading && query.length >= 2 && !data?.items.length && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron alimentos</p>
                )}
                {query.length < 2 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Escribe al menos 2 caracteres para buscar
                  </p>
                )}
                {data?.items.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelected(food)}
                    className="flex items-center justify-between rounded-lg px-2 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {food.brand ? `${food.brand} · ` : ''}{food.calories} kcal / {food.serving_size_g}g
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 text-xs font-medium text-muted-foreground">
                      {food.protein_g}P {food.carbs_g}C {food.fat_g}F
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
