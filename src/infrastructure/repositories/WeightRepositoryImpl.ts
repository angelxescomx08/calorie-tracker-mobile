import type { AxiosInstance } from 'axios'
import type { WeightLog } from '@/domain/entities'
import type { IWeightRepository, WeightLogDto, WeightLogsParams } from '@/domain/repositories/IWeightRepository'

export class WeightRepositoryImpl implements IWeightRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getAll(params?: WeightLogsParams): Promise<{ items: WeightLog[] }> {
    const res = await this.client.get('/weight', { params })
    return res.data
  }

  async create(dto: WeightLogDto): Promise<WeightLog> {
    const res = await this.client.post('/weight', dto)
    return res.data
  }

  async update(id: number, dto: WeightLogDto): Promise<WeightLog> {
    const res = await this.client.put(`/weight/${id}`, dto)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/weight/${id}`)
  }
}
