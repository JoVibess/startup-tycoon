// scripts/seed.js
// Insère ~12 parties fictives pour avoir un leaderboard non vide en démo.
// Usage : npm run seed

import 'dotenv/config';
import { insertGame, truncateGames, countGames } from '../src/db.js';

const fakes = [
  { user: 'user_seed_alice',    name: 'Alice (CTO)',          score: 18450,  duration: 300, clicks: 412, upgrades: 38 },
  { user: 'user_seed_bob',      name: 'Bob — Bootstrappé',    score: 12780,  duration: 300, clicks: 555, upgrades: 24 },
  { user: 'user_seed_chloe',    name: 'Chloé Inc.',           score: 9930,   duration: 300, clicks: 388, upgrades: 21 },
  { user: 'user_seed_dimitri',  name: 'Dimitri',              score: 8120,   duration: 280, clicks: 412, upgrades: 19 },
  { user: 'user_seed_elena',    name: 'Elena Studio',         score: 7220,   duration: 300, clicks: 320, upgrades: 17 },
  { user: 'user_seed_farid',    name: 'Farid',                score: 6190,   duration: 250, clicks: 290, upgrades: 15 },
  { user: 'user_seed_gabi',     name: 'Gabi & co.',           score: 5310,   duration: 300, clicks: 270, upgrades: 13 },
  { user: 'user_seed_hugo',     name: 'Hugo Tech',            score: 4480,   duration: 220, clicks: 240, upgrades: 12 },
  { user: 'user_seed_ines',     name: 'Inès',                 score: 3550,   duration: 300, clicks: 210, upgrades: 10 },
  { user: 'user_seed_jules',    name: 'Jules',                score: 2780,   duration: 300, clicks: 188, upgrades: 8 },
  { user: 'user_seed_kim',      name: 'Kim',                  score: 1920,   duration: 180, clicks: 150, upgrades: 6 },
  { user: 'user_seed_leo',      name: 'Léo',                  score: 980,    duration: 120, clicks: 95,  upgrades: 4 },
];

const reset = process.argv.includes('--reset');
if (reset) {
  const removed = truncateGames();
  console.log(`🧹 truncated games (${removed} rows removed)`);
}

let inserted = 0;
for (const f of fakes) {
  insertGame({
    userId: f.user,
    displayName: f.name,
    mode: 'solo',
    score: f.score,
    duration: f.duration,
    clicks: f.clicks,
    upgrades: f.upgrades,
  });
  inserted++;
}

console.log(`🌱 seed done. inserted=${inserted}, total games in DB=${countGames()}`);
