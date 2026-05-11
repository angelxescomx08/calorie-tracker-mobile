import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { GoalDto } from '@/domain/repositories/IGoalsRepository'

export function useActiveGoal() {
  return useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () => container.getActiveGoalUseCase.execute(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: GoalDto) => container.createGoalUseCase.execute(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: GoalDto }) =>
      container.updateGoalUseCase.execute(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}
