import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { WeightLogDto, WeightLogsParams } from '@/domain/repositories/IWeightRepository'

export function useWeightLogs(params?: WeightLogsParams) {
  return useQuery({
    queryKey: ['weightLogs', params],
    queryFn: () => container.getWeightLogsUseCase.execute(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateWeightLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: WeightLogDto) => container.createWeightLogUseCase.execute(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weightLogs'] }),
  })
}

export function useDeleteWeightLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => container.deleteWeightLogUseCase.execute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weightLogs'] }),
  })
}
