import type { Goal } from '@/domain/entities'
import type { GoalDto, IGoalsRepository } from '@/domain/repositories/IGoalsRepository'

export class UpdateGoalUseCase {
  constructor(private readonly goalsRepository: IGoalsRepository) {}

  execute(id: number, dto: GoalDto): Promise<Goal> {
    return this.goalsRepository.update(id, dto)
  }
}
