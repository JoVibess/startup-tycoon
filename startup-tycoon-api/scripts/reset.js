// scripts/reset.js
// Vide complètement la table games. Pratique en démo / TP.
// Usage : npm run reset

import 'dotenv/config';
import { truncateGames, countGames } from '../src/db.js';

const removed = truncateGames();
console.log(`🧹 reset done. removed=${removed} rows. total now=${countGames()}`);
