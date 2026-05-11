import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { AddMealEntryDto, UpdateDailyLogDto } from '@/domain/repositories/IDailyLogRepository'

export function useDailyLog(date: string) {
  return useQuery({
    queryKey: ['dailyLog', date],
    queryFn: () => container.getDailyLogUseCase.execute(date),
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpdateDailyLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateDailyLogDto; date: string }) =>
      container.updateDailyLogUseCase.execute(id, dto),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['dailyLog', vars.date] })
    },
  })
}

export function useAddMealEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: AddMealEntryDto) => container.addMealEntryUseCase.execute(dto),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['dailyLog', vars.date] })
    },
  })
}

export function useDeleteMealEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, logId }: { entryId: number; logId: number; date: string }) =>
      container.deleteMealEntryUseCase.execute(entryId, logId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['dailyLog', vars.date] })
    },
  })
}
