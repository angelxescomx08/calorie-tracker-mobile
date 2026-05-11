import type { DailyLog } from '@/domain/entities'
import type { IDailyLogRepository, UpdateDailyLogDto } from '@/domain/repositories/IDailyLogRepository'

export class UpdateDailyLogUseCase {
  constructor(private readonly dailyLogRepository: IDailyLogRepository) {}

  execute(id: number, dto: UpdateDailyLogDto): Promise<Omit<DailyLog, 'meal_entries'>> {
    return this.dailyLogRepository.update(id, dto)
  }
}
