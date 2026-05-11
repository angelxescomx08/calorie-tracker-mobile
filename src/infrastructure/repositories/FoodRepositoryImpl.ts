import type { AxiosInstance } from 'axios'
import type { Food, FoodsResponse } from '@/domain/entities'
import type { FoodDto, IFoodRepository, SearchFoodsParams } from '@/domain/repositories/IFoodRepository'

export class FoodRepositoryImpl implements IFoodRepository {
  constructor(private readonly client: AxiosInstance) {}

  async search(params: SearchFoodsParams): Promise<FoodsResponse> {
    const res = await this.client.get('/foods', { params })
    return res.data
  }

  async getById(id: number): Promise<Food> {
    const res = await this.client.get(`/foods/${id}`)
    return res.data
  }

  async create(dto: FoodDto): Promise<Food> {
    const res = await this.client.post('/foods', dto)
    return res.data
  }

  async update(id: number, dto: Omit<FoodDto, 'barcode'>): Promise<Food> {
    const res = await this.client.put(`/foods/${id}`, dto)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/foods/${id}`)
  }
}
