import type { ExercisesResponse } from '@/domain/entities'
import type { IExerciseRepository, SearchExercisesParams } from '@/domain/repositories/IExerciseRepository'

export class SearchExercisesUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  execute(params: SearchExercisesParams): Promise<ExercisesResponse> {
    return this.exerciseRepository.search(params)
  }
}
