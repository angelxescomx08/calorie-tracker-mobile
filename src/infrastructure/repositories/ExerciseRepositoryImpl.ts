import type { AxiosInstance } from 'axios'
import type { Exercise, ExercisesResponse } from '@/domain/entities'
import type {
  CreateExerciseDto,
  IExerciseRepository,
  SearchExercisesParams,
} from '@/domain/repositories/IExerciseRepository'

export class ExerciseRepositoryImpl implements IExerciseRepository {
  constructor(private readonly client: AxiosInstance) {}

  async search(params: SearchExercisesParams): Promise<ExercisesResponse> {
    const cleanParams = { ...params }
    if (!cleanParams.category) delete cleanParams.category
    const res = await this.client.get('/exercises', { params: cleanParams })
    return res.data
  }

  async getById(id: number): Promise<Exercise> {
    const res = await this.client.get(`/exercises/${id}`)
    return res.data
  }

  async create(dto: CreateExerciseDto): Promise<Exercise> {
    const res = await this.client.post('/exercises', dto)
    return res.data
  }
}
