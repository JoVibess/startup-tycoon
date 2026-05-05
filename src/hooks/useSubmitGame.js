import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

async function submitGame({ payload }) {
  return apiFetch('/api/games', {
    method: 'POST',
    body: payload,
  })
}

export function useSubmitGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitGame,
    onMutate: async ({ payload, optimistic }) => {
      await queryClient.cancelQueries({ queryKey: ['games', 'me'] })
      await queryClient.cancelQueries({ queryKey: ['leaderboard'] })

      const previousGames = queryClient.getQueryData(['games', 'me']) || []
      const previousLeaderboard = queryClient.getQueryData(['leaderboard']) || []

      const nowIso = new Date().toISOString()
      const optimisticGame = {
        id: `optimistic-${Date.now()}`,
        mode: payload.mode,
        score: payload.score,
        duration: payload.duration,
        clicks: payload.clicks,
        upgrades: payload.upgrades,
        created_at: nowIso,
        display_name: optimistic.displayName,
      }

      queryClient.setQueryData(['games', 'me'], [optimisticGame, ...previousGames])

      const leader = optimistic
      const existing = previousLeaderboard.find((entry) => entry.user_id === leader.userId)
      let nextLeaderboard = previousLeaderboard

      if (existing) {
        nextLeaderboard = previousLeaderboard.map((entry) => {
          if (entry.user_id !== leader.userId) {
            return entry
          }

          return {
            ...entry,
            display_name: leader.displayName,
            best_score: Math.max(entry.best_score || 0, payload.score),
            games_count: (entry.games_count || 0) + 1,
          }
        })
      } else {
        nextLeaderboard = [
          ...previousLeaderboard,
          {
            user_id: leader.userId,
            display_name: leader.displayName,
            best_score: payload.score,
            games_count: 1,
          },
        ]
      }

      nextLeaderboard = [...nextLeaderboard]
        .sort((a, b) => (b.best_score || 0) - (a.best_score || 0))
        .slice(0, 20)

      queryClient.setQueryData(['leaderboard'], nextLeaderboard)

      return { previousGames, previousLeaderboard }
    },
    onError: (_error, _variables, context) => {
      if (!context) return
      queryClient.setQueryData(['games', 'me'], context.previousGames)
      queryClient.setQueryData(['leaderboard'], context.previousLeaderboard)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['games', 'me'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['games', 'me'] })
    },
  })
}
