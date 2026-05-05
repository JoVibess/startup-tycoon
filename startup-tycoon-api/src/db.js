// src/db.js
// Couche d'accès SQLite synchrone (better-sqlite3).
// Choix pédagogique : synchrone, fichier local, zéro service externe à installer.
// Pour une vraie prod : migrer vers Postgres + connection pool, c'est explicitement hors-scope ici.

import Database from 'better-sqlite3';
import { dirname, resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DB_PATH || './data/tycoon.sqlite';

if (dbPath !== ':memory:') {
  const absPath = resolve(__dirname, '..', dbPath);
  const parent = dirname(absPath);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
}

const dbResolved = dbPath === ':memory:' ? ':memory:' : resolve(__dirname, '..', dbPath);
export const db = new Database(dbResolved);

// WAL est plus performant mais peut échouer sur certains filesystems
// (mounts Windows, Docker bind-mount). On essaye, et si ça plante on retombe
// sur le mode journal par défaut (DELETE) — fonctionne partout.
try {
  db.pragma('journal_mode = WAL');
} catch (e) {
  if (process.env.DEBUG) console.warn('[db] WAL non disponible, fallback DELETE:', e.message);
}
db.pragma('foreign_keys = ON');

// --- Schéma ---
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      TEXT    NOT NULL,
    display_name TEXT    NOT NULL DEFAULT '',
    mode         TEXT    NOT NULL DEFAULT 'solo',
    score        INTEGER NOT NULL,
    duration     INTEGER NOT NULL,
    clicks       INTEGER NOT NULL,
    upgrades     INTEGER NOT NULL,
    created_at   INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_games_score ON games(score DESC);
  CREATE INDEX IF NOT EXISTS idx_games_user_created ON games(user_id, created_at DESC);
`);

// --- Statements préparés ---

const stmtInsertGame = db.prepare(`
  INSERT INTO games (user_id, display_name, mode, score, duration, clicks, upgrades, created_at)
  VALUES (@user_id, @display_name, @mode, @score, @duration, @clicks, @upgrades, @created_at)
`);

const stmtGetGameById = db.prepare(`SELECT * FROM games WHERE id = ?`);

const stmtGamesByUser = db.prepare(`
  SELECT id, user_id, display_name, mode, score, duration, clicks, upgrades, created_at
  FROM games
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`);

const stmtLeaderboard = db.prepare(`
  SELECT
    g.user_id,
    g.display_name,
    g.score,
    g.duration,
    g.clicks,
    g.upgrades,
    g.created_at
  FROM games g
  INNER JOIN (
    SELECT user_id, MAX(score) AS best
    FROM games
    WHERE mode = 'solo'
    GROUP BY user_id
  ) best ON best.user_id = g.user_id AND best.best = g.score
  WHERE g.mode = 'solo'
  GROUP BY g.user_id
  ORDER BY g.score DESC, g.created_at ASC
  LIMIT ?
`);

const stmtCountGames = db.prepare(`SELECT COUNT(*) AS c FROM games`);
const stmtTruncate = db.prepare(`DELETE FROM games`);

// --- API du module ---

export function insertGame({ userId, displayName, mode, score, duration, clicks, upgrades }) {
  const info = stmtInsertGame.run({
    user_id: userId,
    display_name: displayName ?? '',
    mode: mode ?? 'solo',
    score,
    duration,
    clicks,
    upgrades,
    created_at: Date.now(),
  });
  return rowToGame(stmtGetGameById.get(info.lastInsertRowid));
}

export function listGamesByUser(userId, limit = 50) {
  return stmtGamesByUser.all(userId, limit).map(rowToGame);
}

export function getLeaderboard(limit = 20) {
  return stmtLeaderboard.all(limit).map(rowToLeaderboardEntry);
}

export function countGames() {
  return stmtCountGames.get().c;
}

export function truncateGames() {
  return stmtTruncate.run().changes;
}

// --- Mappers (snake_case DB -> camelCase API) ---

function rowToGame(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    mode: row.mode,
    score: row.score,
    duration: row.duration,
    clicks: row.clicks,
    upgrades: row.upgrades,
    createdAt: row.created_at,
  };
}

function rowToLeaderboardEntry(row) {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    score: row.score,
    duration: row.duration,
    clicks: row.clicks,
    upgrades: row.upgrades,
    achievedAt: row.created_at,
  };
}
