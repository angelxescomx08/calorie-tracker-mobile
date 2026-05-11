import type { DailyLog, MealEntry, MealType } from '@/domain/entities'

export interface AddMealEntryDto {
  date: string
  meal_type: MealType
  food_id: number
  quantity_g: number
}

export interface UpdateMealEntryDto {
  meal_type: MealType
  food_id: number
  quantity_g: number
}

export interface UpdateDailyLogDto {
  water_ml?: number
  notes?: string | null
}

export interface IDailyLogRepository {
  getByDate(date: string): Promise<DailyLog>
  update(id: number, dto: UpdateDailyLogDto): Promise<Omit<DailyLog, 'meal_entries'>>
  addMealEntry(dto: AddMealEntryDto): Promise<MealEntry>
  updateMealEntry(entryId: number, logId: number, dto: UpdateMealEntryDto): Promise<MealEntry>
  deleteMealEntry(entryId: number, logId: number): Promise<void>
}
