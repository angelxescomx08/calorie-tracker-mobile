import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'

export function useFoodSearch(query: string) {
  return useQuery({
    queryKey: ['foods', 'search', query],
    queryFn: () => container.searchFoodsUseCase.execute({ q: query, limit: 20 }),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  })
}
