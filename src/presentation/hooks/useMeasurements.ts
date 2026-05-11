import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { MeasurementDto } from '@/domain/repositories/IMeasurementRepository'

export function useMeasurements() {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: () => container.getMeasurementsUseCase.execute(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateMeasurement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: MeasurementDto) => container.createMeasurementUseCase.execute(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['measurements'] }),
  })
}

export function useDeleteMeasurement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => container.deleteMeasurementUseCase.execute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['measurements'] }),
  })
}
