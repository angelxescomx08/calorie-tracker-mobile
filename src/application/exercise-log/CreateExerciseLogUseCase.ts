import type { ExerciseLog } from '@/domain/entities'
import type { ExerciseLogDto, IExerciseLogRepository } from '@/domain/repositories/IExerciseLogRepository'

export class CreateExerciseLogUseCase {
  constructor(private readonly exerciseLogRepository: IExerciseLogRepository) {}

  execute(dto: ExerciseLogDto): Promise<ExerciseLog> {
    return this.exerciseLogRepository.create(dto)
  }
}
