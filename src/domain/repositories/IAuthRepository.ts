import type { AuthResponse, User } from '@/domain/entities'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface IAuthRepository {
  login(dto: LoginDto): Promise<AuthResponse>
  register(dto: RegisterDto): Promise<AuthResponse>
  logout(): Promise<void>
  getMe(): Promise<User>
}
