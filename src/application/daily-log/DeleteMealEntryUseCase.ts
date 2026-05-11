import type { IDailyLogRepository } from '@/domain/repositories/IDailyLogRepository'

export class DeleteMealEntryUseCase {
  constructor(private readonly dailyLogRepository: IDailyLogRepository) {}

  execute(entryId: number, logId: number): Promise<void> {
    return this.dailyLogRepository.deleteMealEntry(entryId, logId)
  }
}
