import type { FoodsResponse } from '@/domain/entities'
import type { IFoodRepository, SearchFoodsParams } from '@/domain/repositories/IFoodRepository'

export class SearchFoodsUseCase {
  constructor(private readonly foodRepository: IFoodRepository) {}

  execute(params: SearchFoodsParams): Promise<FoodsResponse> {
    return this.foodRepository.search(params)
  }
}
