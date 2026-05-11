import type { Measurement } from '@/domain/entities'

export interface MeasurementDto {
  measured_date: string
  neck_cm?: number | null
  waist_cm?: number | null
  hip_cm?: number | null
  notes?: string | null
}

export interface IMeasurementRepository {
  getAll(params?: { start_date?: string; end_date?: string }): Promise<{ items: Measurement[] }>
  create(dto: MeasurementDto): Promise<Measurement>
  delete(id: number): Promise<void>
}
