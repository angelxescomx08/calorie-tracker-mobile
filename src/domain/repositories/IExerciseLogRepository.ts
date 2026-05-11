import type { ExerciseLog } from '@/domain/entities'

export interface ExerciseLogDto {
  exercise_id: number
  log_date: string
  duration_minutes: number
  sets?: number | null
  reps?: number | null
  distance_km?: number | null
  avg_heart_rate?: number | null
  notes?: string | null
  calories_burned?: number
}

export interface IExerciseLogRepository {
  getByDate(date: string): Promise<{ items: ExerciseLog[] }>
  create(dto: ExerciseLogDto): Promise<ExerciseLog>
  update(id: number, dto: Partial<ExerciseLogDto>): Promise<ExerciseLog>
  delete(id: number): Promise<void>
}
