import type { MealEntry } from '@/domain/entities'
import type { AddMealEntryDto, IDailyLogRepository } from '@/domain/repositories/IDailyLogRepository'

export class AddMealEntryUseCase {
  constructor(private readonly dailyLogRepository: IDailyLogRepository) {}

  execute(dto: AddMealEntryDto): Promise<MealEntry> {
    return this.dailyLogRepository.addMealEntry(dto)
  }
}
