import type { AxiosInstance } from 'axios'
import type { DailyLog, Food, MealEntry } from '@/domain/entities'
import type {
  AddMealEntryDto,
  IDailyLogRepository,
  UpdateDailyLogDto,
  UpdateMealEntryDto,
} from '@/domain/repositories/IDailyLogRepository'

export class DailyLogRepositoryImpl implements IDailyLogRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getByDate(date: string): Promise<DailyLog> {
    const res = await this.client.get('/daily', { params: { date } })
    const log = res.data as DailyLog & { meal_entries: Array<MealEntry & { food_id: number }> }

    if (!log.meal_entries || log.meal_entries.length === 0) {
      return { ...log, meal_entries: [] }
    }

    const uniqueFoodIds = [...new Set(log.meal_entries.map((e) => e.food_id))]
    const results = await Promise.allSettled(
      uniqueFoodIds.map((id) => this.client.get(`/foods/${id}`).then((r) => r.data as Food)),
    )

    const foodMap = new Map<number, Food>()
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') foodMap.set(uniqueFoodIds[i], result.value)
    })

    return {
      ...log,
      meal_entries: log.meal_entries.map((e) => ({ ...e, food: foodMap.get(e.food_id) })),
    }
  }

  async update(id: number, dto: UpdateDailyLogDto): Promise<Omit<DailyLog, 'meal_entries'>> {
    const res = await this.client.put(`/daily/${id}`, dto)
    return res.data
  }

  async addMealEntry(dto: AddMealEntryDto): Promise<MealEntry> {
    const res = await this.client.post('/daily/meals', dto)
    return res.data
  }

  async updateMealEntry(entryId: number, logId: number, dto: UpdateMealEntryDto): Promise<MealEntry> {
    const res = await this.client.put(`/daily/meals/${entryId}/${logId}`, dto)
    return res.data
  }

  async deleteMealEntry(entryId: number, logId: number): Promise<void> {
    await this.client.delete(`/daily/meals/${entryId}/${logId}`)
  }
}
