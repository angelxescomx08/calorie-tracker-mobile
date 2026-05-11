import type { Profile } from '@/domain/entities'
import type { IProfileRepository } from '@/domain/repositories/IProfileRepository'

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  execute(): Promise<Profile> {
    return this.profileRepository.get()
  }
}
