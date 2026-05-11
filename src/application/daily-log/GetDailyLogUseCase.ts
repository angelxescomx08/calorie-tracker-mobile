import type { DailyLog } from '@/domain/entities'
import type { IDailyLogRepository } from '@/domain/repositories/IDailyLogRepository'

export class GetDailyLogUseCase {
  constructor(private readonly dailyLogRepository: IDailyLogRepository) {}

  execute(date: string): Promise<DailyLog> {
    return this.dailyLogRepository.getByDate(date)
  }
}
