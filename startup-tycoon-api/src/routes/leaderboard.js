// src/routes/leaderboard.js
// GET /api/leaderboard — public, top N best scores all-time (1 entrée par user).
// Pas d'auth requise (la spec TP 13 indique : leaderboard public).

import { Router } from 'express';
import { getLeaderboard } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const limit = clamp(parseInt(req.query.limit, 10) || 20, 1, 100);
  const entries = getLeaderboard(limit);
  res.json({
    limit,
    count: entries.length,
    entries,
  });
});

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export default router;
