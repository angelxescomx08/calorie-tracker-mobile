import type { IWeightRepository } from '@/domain/repositories/IWeightRepository'

export class DeleteWeightLogUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  execute(id: number): Promise<void> {
    return this.weightRepository.delete(id)
  }
}
