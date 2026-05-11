import type { AxiosInstance } from 'axios'
import type { Goal } from '@/domain/entities'
import type { GoalDto, IGoalsRepository } from '@/domain/repositories/IGoalsRepository'

export class GoalsRepositoryImpl implements IGoalsRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getActive(): Promise<Goal> {
    const res = await this.client.get('/goals/active')
    return res.data
  }

  async create(dto: GoalDto): Promise<Goal> {
    const res = await this.client.post('/goals', dto)
    return res.data
  }

  async update(id: number, dto: GoalDto): Promise<Goal> {
    const res = await this.client.put(`/goals/${id}`, dto)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/goals/${id}`)
  }
}
