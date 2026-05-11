import type { AxiosInstance } from 'axios'
import type { AuthResponse, User } from '@/domain/entities'
import type { IAuthRepository, LoginDto, RegisterDto } from '@/domain/repositories/IAuthRepository'

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private readonly client: AxiosInstance) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await this.client.post('/auth/login', dto)
    return res.data
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await this.client.post('/auth/register', dto)
    return res.data
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout')
  }

  async getMe(): Promise<User> {
    const res = await this.client.get('/auth/me')
    return res.data
  }
}
