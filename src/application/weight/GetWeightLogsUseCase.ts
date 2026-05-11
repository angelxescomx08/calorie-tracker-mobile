import type { WeightLog } from '@/domain/entities'
import type { IWeightRepository, WeightLogsParams } from '@/domain/repositories/IWeightRepository'

export class GetWeightLogsUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  execute(params?: WeightLogsParams): Promise<{ items: WeightLog[] }> {
    return this.weightRepository.getAll(params)
  }
}
