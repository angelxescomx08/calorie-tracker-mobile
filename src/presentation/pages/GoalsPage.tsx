import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useActiveGoal, useCreateGoal, useUpdateGoal } from '@/presentation/hooks/useGoals'

const schema = z.object({
  goal_type: z.enum(['lose_weight', 'gain_weight', 'maintain']),
  daily_calorie_target: z.coerce.number().min(500, 'Minimum 500 kcal'),
  target_weight_kg: z.coerce.number().positive().optional().or(z.literal('')),
  weekly_rate_kg: z.coerce.number().positive().optional().or(z.literal('')),
  start_date: z.string().min(1),
})
type FormData = z.infer<typeof schema>

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight',
  gain_weight: 'Gain Weight',
  maintain: 'Maintain Weight',
}

export function GoalsPage() {
  const { data: goal, isLoading } = useActiveGoal()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      goal_type: 'maintain',
      daily_calorie_target: 2000,
      start_date: new Date().toISOString().split('T')[0],
    },
  })

  const goalType = watch('goal_type')

  useEffect(() => {
    if (goal) {
      reset({
        goal_type: goal.goal_type,
        daily_calorie_target: goal.daily_calorie_target,
        target_weight_kg: goal.target_weight_kg ?? '',
        weekly_rate_kg: goal.weekly_rate_kg ?? '',
        start_date: goal.start_date,
      })
    }
  }, [goal, reset])

  const onSubmit = (data: FormData) => {
    const dto = {
      goal_type: data.goal_type,
      daily_calorie_target: data.daily_calorie_target,
      target_weight_kg: data.target_weight_kg ? Number(data.target_weight_kg) : null,
      weekly_rate_kg: data.weekly_rate_kg ? Number(data.weekly_rate_kg) : null,
      start_date: data.start_date,
      end_date: null,
    }

    if (goal) {
      updateGoal.mutate(
        { id: goal.id, dto },
        {
          onSuccess: () => toast.success('Goal updated'),
          onError: () => toast.error('Failed to update goal'),
        },
      )
    } else {
      createGoal.mutate(dto, {
        onSuccess: () => toast.success('Goal created'),
        onError: () => toast.error('Failed to create goal'),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Goal</h2>
          {goal && <Badge variant="secondary">Active</Badge>}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {goal && (
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm">Current Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{GOAL_LABELS[goal.goal_type]}</span>
                <span className="text-muted-foreground">Daily Calories</span>
                <span className="font-medium">{goal.daily_calorie_target} kcal</span>
                {goal.target_weight_kg && (
                  <>
                    <span className="text-muted-foreground">Target Weight</span>
                    <span className="font-medium">{goal.target_weight_kg} kg</span>
                  </>
                )}
                {goal.weekly_rate_kg && (
                  <>
                    <span className="text-muted-foreground">Weekly Rate</span>
                    <span className="font-medium">{goal.weekly_rate_kg} kg/week</span>
                  </>
                )}
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium">{goal.start_date}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">{goal ? 'Edit Goal' : 'Set a Goal'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div>
                <Label className="text-xs">Goal Type</Label>
                <Select
                  value={goalType}
                  onValueChange={(v) => setValue('goal_type', v as FormData['goal_type'])}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_weight">Gain Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Daily Calorie Target</Label>
                <Input
                  type="number"
                  className="mt-1"
                  {...register('daily_calorie_target')}
                />
                {errors.daily_calorie_target && (
                  <p className="text-xs text-destructive">{errors.daily_calorie_target.message}</p>
                )}
              </div>

              {goalType !== 'maintain' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Target Weight (kg)</Label>
                    <Input type="number" step="0.1" className="mt-1" {...register('target_weight_kg')} />
                  </div>
                  <div>
                    <Label className="text-xs">Weekly Rate (kg)</Label>
                    <Input type="number" step="0.1" className="mt-1" {...register('weekly_rate_kg')} />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="date" className="mt-1" {...register('start_date')} />
              </div>

              <Button
                type="submit"
                disabled={createGoal.isPending || updateGoal.isPending}
              >
                {createGoal.isPending || updateGoal.isPending
                  ? 'Saving...'
                  : goal
                  ? 'Update Goal'
                  : 'Set Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
