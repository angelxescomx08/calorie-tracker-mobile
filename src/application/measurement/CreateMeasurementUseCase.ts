import type { Measurement } from '@/domain/entities'
import type { IMeasurementRepository, MeasurementDto } from '@/domain/repositories/IMeasurementRepository'

export class CreateMeasurementUseCase {
  constructor(private readonly measurementRepository: IMeasurementRepository) {}

  execute(dto: MeasurementDto): Promise<Measurement> {
    return this.measurementRepository.create(dto)
  }
}
