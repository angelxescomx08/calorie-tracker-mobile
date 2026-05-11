import type { AxiosInstance } from 'axios'
import type { Exercise, ExerciseLog } from '@/domain/entities'
import type { ExerciseLogDto, IExerciseLogRepository } from '@/domain/repositories/IExerciseLogRepository'

export class ExerciseLogRepositoryImpl implements IExerciseLogRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getByDate(date: string): Promise<{ items: ExerciseLog[] }> {
    const res = await this.client.get('/exercise-logs', { params: { date } })
    const data = res.data as { items: Array<ExerciseLog & { exercise_id: number }> }

    if (!data.items || data.items.length === 0) {
      return { items: [] }
    }

    const uniqueIds = [...new Set(data.items.map((e) => e.exercise_id))]
    const results = await Promise.allSettled(
      uniqueIds.map((id) => this.client.get(`/exercises/${id}`).then((r) => r.data as Exercise)),
    )

    const exerciseMap = new Map<number, Exercise>()
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') exerciseMap.set(uniqueIds[i], result.value)
    })

    return {
      items: data.items.map((e) => ({ ...e, exercise: exerciseMap.get(e.exercise_id) })),
    }
  }

  async create(dto: ExerciseLogDto): Promise<ExerciseLog> {
    const res = await this.client.post('/exercise-logs', dto)
    return res.data
  }

  async update(id: number, dto: Partial<ExerciseLogDto>): Promise<ExerciseLog> {
    const res = await this.client.put(`/exercise-logs/${id}`, dto)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/exercise-logs/${id}`)
  }
}
