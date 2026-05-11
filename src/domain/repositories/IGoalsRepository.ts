import type { Goal, GoalType } from '@/domain/entities'

export interface GoalDto {
  goal_type: GoalType
  target_weight_kg: number | null
  weekly_rate_kg: number | null
  daily_calorie_target: number
  start_date: string
  end_date: string | null
}

export interface IGoalsRepository {
  getActive(): Promise<Goal>
  create(dto: GoalDto): Promise<Goal>
  update(id: number, dto: GoalDto): Promise<Goal>
  delete(id: number): Promise<void>
}
