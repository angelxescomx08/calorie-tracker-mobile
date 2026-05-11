import type { ExerciseLog } from '@/domain/entities'
import type { IExerciseLogRepository } from '@/domain/repositories/IExerciseLogRepository'

export class GetExerciseLogsUseCase {
  constructor(private readonly exerciseLogRepository: IExerciseLogRepository) {}

  execute(date: string): Promise<{ items: ExerciseLog[] }> {
    return this.exerciseLogRepository.getByDate(date)
  }
}
