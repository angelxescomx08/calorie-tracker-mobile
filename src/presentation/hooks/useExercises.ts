import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import type { ExerciseCategory } from '@/domain/entities'

export function useExerciseSearch(query: string, category: ExerciseCategory | '') {
  return useQuery({
    queryKey: ['exercises', 'search', query, category],
    queryFn: () => container.searchExercisesUseCase.execute({ q: query, category, limit: 20 }),
    enabled: query.length >= 2 || !!category,
    staleTime: 1000 * 60 * 10,
  })
}
