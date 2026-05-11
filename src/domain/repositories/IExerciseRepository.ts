import type { Exercise, ExerciseCategory, ExercisesResponse } from '@/domain/entities'

export interface SearchExercisesParams {
  q?: string
  category?: ExerciseCategory | ''
  limit?: number
  offset?: number
}

export interface CreateExerciseDto {
  name: string
  category: ExerciseCategory
  met_value: number
  description?: string | null
}

export interface IExerciseRepository {
  search(params: SearchExercisesParams): Promise<ExercisesResponse>
  getById(id: number): Promise<Exercise>
  create(dto: CreateExerciseDto): Promise<Exercise>
}
