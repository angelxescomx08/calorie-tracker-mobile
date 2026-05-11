import type { AxiosInstance } from 'axios'
import type { Measurement } from '@/domain/entities'
import type { IMeasurementRepository, MeasurementDto } from '@/domain/repositories/IMeasurementRepository'

export class MeasurementRepositoryImpl implements IMeasurementRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getAll(params?: { start_date?: string; end_date?: string }): Promise<{ items: Measurement[] }> {
    const res = await this.client.get('/measurements', { params })
    return res.data
  }

  async create(dto: MeasurementDto): Promise<Measurement> {
    const res = await this.client.post('/measurements', dto)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/measurements/${id}`)
  }
}
