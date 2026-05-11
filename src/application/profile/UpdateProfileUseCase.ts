import type { Profile } from '@/domain/entities'
import type { IProfileRepository, UpdateProfileDto } from '@/domain/repositories/IProfileRepository'

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  execute(dto: UpdateProfileDto): Promise<Profile> {
    return this.profileRepository.update(dto)
  }
}
