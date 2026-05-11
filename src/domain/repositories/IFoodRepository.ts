import type { Food, FoodsResponse } from '@/domain/entities'

export interface SearchFoodsParams {
  q?: string
  limit?: number
  offset?: number
}

export interface FoodDto {
  name: string
  brand?: string | null
  barcode?: string | null
  serving_size_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number | null
  sugar_g?: number | null
  sodium_mg?: number | null
}

export interface IFoodRepository {
  search(params: SearchFoodsParams): Promise<FoodsResponse>
  getById(id: number): Promise<Food>
  create(dto: FoodDto): Promise<Food>
  update(id: number, dto: Omit<FoodDto, 'barcode'>): Promise<Food>
  delete(id: number): Promise<void>
}
