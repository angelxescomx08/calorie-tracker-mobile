import type { AuthResponse } from '@/domain/entities'
import type { IAuthRepository, RegisterDto } from '@/domain/repositories/IAuthRepository'

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(dto: RegisterDto): Promise<AuthResponse> {
    return this.authRepository.register(dto)
  }
}
