import type { AxiosInstance } from 'axios'
import type { Profile } from '@/domain/entities'
import type { IProfileRepository, UpdateProfileDto } from '@/domain/repositories/IProfileRepository'

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private readonly client: AxiosInstance) {}

  async get(): Promise<Profile> {
    const res = await this.client.get('/profile')
    return res.data
  }

  async update(dto: UpdateProfileDto): Promise<Profile> {
    const res = await this.client.put('/profile', dto)
    return res.data
  }
}
