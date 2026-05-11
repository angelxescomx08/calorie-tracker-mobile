import type { WeightLog } from '@/domain/entities'
import type { IWeightRepository, WeightLogDto } from '@/domain/repositories/IWeightRepository'

export class CreateWeightLogUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  execute(dto: WeightLogDto): Promise<WeightLog> {
    return this.weightRepository.create(dto)
  }
}
