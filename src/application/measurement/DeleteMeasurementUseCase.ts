import type { IMeasurementRepository } from '@/domain/repositories/IMeasurementRepository'

export class DeleteMeasurementUseCase {
  constructor(private readonly measurementRepository: IMeasurementRepository) {}

  execute(id: number): Promise<void> {
    return this.measurementRepository.delete(id)
  }
}
