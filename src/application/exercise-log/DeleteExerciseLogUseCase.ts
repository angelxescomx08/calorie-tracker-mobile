import type { IExerciseLogRepository } from '@/domain/repositories/IExerciseLogRepository'

export class DeleteExerciseLogUseCase {
  constructor(private readonly exerciseLogRepository: IExerciseLogRepository) {}

  execute(id: number): Promise<void> {
    return this.exerciseLogRepository.delete(id)
  }
}
