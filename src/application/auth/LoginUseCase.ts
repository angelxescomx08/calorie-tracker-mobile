import type { AuthResponse } from '@/domain/entities'
import type { IAuthRepository, LoginDto } from '@/domain/repositories/IAuthRepository'

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(dto: LoginDto): Promise<AuthResponse> {
    return this.authRepository.login(dto)
  }
}
