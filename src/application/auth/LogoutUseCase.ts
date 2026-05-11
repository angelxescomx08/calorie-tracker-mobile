import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.logout()
  }
}
