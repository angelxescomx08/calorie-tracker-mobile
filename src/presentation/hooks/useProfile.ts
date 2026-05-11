import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { UpdateProfileDto } from '@/domain/repositories/IProfileRepository'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => container.getProfileUseCase.execute(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => container.updateProfileUseCase.execute(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}
