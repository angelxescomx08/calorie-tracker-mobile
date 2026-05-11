import type { ActivityLevel, Gender, Profile } from '@/domain/entities'

export interface UpdateProfileDto {
  birth_date: string
  gender: Gender
  height_cm: number
  activity_level: ActivityLevel
}

export interface IProfileRepository {
  get(): Promise<Profile>
  update(dto: UpdateProfileDto): Promise<Profile>
}
