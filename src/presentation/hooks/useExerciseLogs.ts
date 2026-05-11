import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { ExerciseLogDto } from '@/domain/repositories/IExerciseLogRepository'

export function useExerciseLogs(date: string) {
  return useQuery({
    queryKey: ['exerciseLogs', date],
    queryFn: () => container.getExerciseLogsUseCase.execute(date),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateExerciseLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: ExerciseLogDto) => container.createExerciseLogUseCase.execute(dto),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['exerciseLogs', vars.log_date] })
    },
  })
}

export function useDeleteExerciseLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: number; date: string }) =>
      container.deleteExerciseLogUseCase.execute(vars.id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['exerciseLogs', vars.date] })
    },
  })
}
