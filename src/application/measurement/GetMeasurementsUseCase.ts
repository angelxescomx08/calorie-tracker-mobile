import type { Measurement } from '@/domain/entities'
import type { IMeasurementRepository } from '@/domain/repositories/IMeasurementRepository'

export class GetMeasurementsUseCase {
  constructor(private readonly measurementRepository: IMeasurementRepository) {}

  execute(params?: { start_date?: string; end_date?: string }): Promise<{ items: Measurement[] }> {
    return this.measurementRepository.getAll(params)
  }
}
