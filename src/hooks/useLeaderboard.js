import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

async function fetchLeaderboard() {
  const data = await apiFetch('/api/leaderboard', { auth: false })
  return Array.isArray(data.entries) ? data.entries : []
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 10_000,
  })
}
