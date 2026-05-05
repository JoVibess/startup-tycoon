// src/routes/games.js
// Routes "parties" (games). Toutes authentifiées via JWT Clerk (sauf indication contraire).
//
//  POST /api/games        -> créer une partie solo terminée. Body : { mode, score, duration, clicks, upgrades, displayName? }
//  GET  /api/games/me     -> historique des parties du user authentifié.
//
// IMPORTANT (TP 13 partie 3.2 question 5) : on NE valide PAS la cohérence du score
// avec la durée ou le nombre de clics. C'est volontaire. Les étudiants doivent identifier
// que ce backend FAIT CONFIANCE au client. Le TP 14 corrigera ça en faisant tourner la
// logique de jeu côté serveur (autorité serveur, voir spec v2).

import { Router } from 'express';
import { requireAuth, displayNameFromClaims } from '../auth.js';
import { insertGame, listGamesByUser } from '../db.js';

const router = Router();

// --- POST /api/games -------------------------------------------------------

router.post('/', requireAuth(), (req, res) => {
  const { auth } = req;
  const body = req.body ?? {};

  // Validation minimale (formes / types). Pas de "logique métier".
  const errors = [];

  const mode = typeof body.mode === 'string' ? body.mode : 'solo';
  if (!['solo', 'multi'].includes(mode)) errors.push('mode must be "solo" or "multi"');

  const score = toInt(body.score);
  if (score === null || score < 0) errors.push('score must be a non-negative integer');
  if (score !== null && score > Number.MAX_SAFE_INTEGER - 1) errors.push('score is absurdly large');

  const duration = toInt(body.duration);
  if (duration === null || duration < 0 || duration > 24 * 60 * 60) {
    errors.push('duration must be an integer between 0 and 86400 (seconds)');
  }

  const clicks = toInt(body.clicks);
  if (clicks === null || clicks < 0) errors.push('clicks must be a non-negative integer');

  const upgrades = toInt(body.upgrades);
  if (upgrades === null || upgrades < 0) errors.push('upgrades must be a non-negative integer');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid payload', details: errors });
  }

  // displayName : on accepte la valeur envoyée par le client (ex: "nom de startup"),
  // sinon on retombe sur les claims du JWT. Pas d'échappement ici : c'est le front qui
  // décide comment le rendre. Voir TP 13 partie 4 (XSS) — c'est pédagogique.
  const displayName =
    (typeof body.displayName === 'string' && body.displayName.trim()) ||
    displayNameFromClaims(auth.claims);

  const game = insertGame({
    userId: auth.userId,
    displayName: String(displayName).slice(0, 200), // borne sanity, mais pas d'échappement
    mode,
    score,
    duration,
    clicks,
    upgrades,
  });

  res.status(201).json(game);
});

// --- GET /api/games/me -----------------------------------------------------

router.get('/me', requireAuth(), (req, res) => {
  const limit = clamp(parseInt(req.query.limit, 10) || 50, 1, 200);
  const games = listGamesByUser(req.auth.userId, limit);
  res.json({
    limit,
    count: games.length,
    games,
  });
});

// --- helpers ---------------------------------------------------------------

function toInt(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return null;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export default router;
