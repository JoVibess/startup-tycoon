// src/server.js
// Point d'entrée Express. Charge .env, monte CORS + JSON + routes, expose /health.
//
// Lancer en dev : npm run dev   (node --watch)
// Lancer en prod : npm start

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import leaderboardRouter from './routes/leaderboard.js';
import gamesRouter from './routes/games.js';
import { countGames } from './db.js';

const app = express();

// --- CORS ---
// Liste blanche depuis CORS_ORIGINS (ou * en dev si non défini).
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Pas d'origin (ex: curl, Postman) -> on autorise.
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true); // dev sans .env
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: false, // on utilise Authorization: Bearer, pas de cookies cross-site
  })
);

// --- Body parsing ---
app.use(express.json({ limit: '32kb' }));

// --- Petites traces dev ---
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// --- Health ---
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    games: countGames(),
    uptime: process.uptime(),
  });
});

// --- Routes ---
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/games', gamesRouter);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

// --- Error handler ---
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const port = parseInt(process.env.PORT, 10) || 3000;
app.listen(port, () => {
  console.log(`✅ startup-tycoon-api listening on http://localhost:${port}`);
  console.log(`   GET  /api/leaderboard            (public)`);
  console.log(`   GET  /api/games/me               (auth)`);
  console.log(`   POST /api/games                  (auth)`);
  console.log(`   GET  /health`);
});
