import type { Goal } from '@/domain/entities'
import type { IGoalsRepository } from '@/domain/repositories/IGoalsRepository'

export class GetActiveGoalUseCase {
  constructor(private readonly goalsRepository: IGoalsRepository) {}

  execute(): Promise<Goal> {
    return this.goalsRepository.getActive()
  }
}
