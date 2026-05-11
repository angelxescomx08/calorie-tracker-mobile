import type { WeightLog } from '@/domain/entities'

export interface WeightLogsParams {
  start_date?: string
  end_date?: string
  limit?: number
}

export interface WeightLogDto {
  weight_kg: number
  logged_date: string
  notes?: string | null
}

export interface IWeightRepository {
  getAll(params?: WeightLogsParams): Promise<{ items: WeightLog[] }>
  create(dto: WeightLogDto): Promise<WeightLog>
  update(id: number, dto: WeightLogDto): Promise<WeightLog>
  delete(id: number): Promise<void>
}
