import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

async function fetchMyGames() {
  const data = await apiFetch('/api/games/me')
  return Array.isArray(data.games) ? data.games : []
}

export function useMyGames() {
  return useQuery({
    queryKey: ['games', 'me'],
    queryFn: fetchMyGames,
  })
}
