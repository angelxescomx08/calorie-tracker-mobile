import type { Goal } from '@/domain/entities'
import type { GoalDto, IGoalsRepository } from '@/domain/repositories/IGoalsRepository'

export class CreateGoalUseCase {
  constructor(private readonly goalsRepository: IGoalsRepository) {}

  execute(dto: GoalDto): Promise<Goal> {
    return this.goalsRepository.create(dto)
  }
}
