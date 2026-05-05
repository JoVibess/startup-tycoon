# Startup Tycoon API

Backend pédagogique fourni pour le **TP 13 — Authentification, Sécurité Web & TanStack Query**
du projet fil rouge *Startup Tycoon*.

> ⚠️ Vous **ne devez pas modifier ce backend pour le TP 13**. Vous y connectez votre SPA.
> Le TP 14 réutilisera et étendra ce projet (rounds, WebSocket, autorité serveur).

## Endpoints

| Méthode | Route                | Auth   | Rôle                                        |
|--------:|----------------------|:------:|---------------------------------------------|
| GET     | `/health`            | non    | sanity check                                |
| GET     | `/api/leaderboard`   | non    | Top 20 all-time (1 entrée par user)         |
| GET     | `/api/games/me`      | oui    | Historique des parties du user authentifié  |
| POST    | `/api/games`         | oui    | Enregistrer une partie solo terminée        |

L'auth est un JWT Clerk envoyé en `Authorization: Bearer <token>`.

### `POST /api/games` — body attendu

```json
{
  "mode": "solo",
  "score": 12450,
  "duration": 300,
  "clicks": 421,
  "upgrades": 23,
  "displayName": "Ma Startup"
}
```

`displayName` est optionnel : si absent, on retombe sur les claims du JWT (`name`, `username`, `email`...).

## Setup

```bash
git clone <url_du_repo>
cd startup-tycoon-api
npm install
cp .env.example .env
# Renseigner CLERK_PUBLISHABLE_KEY (suffit pour la vérif JWT)
npm run dev
```

Le serveur écoute sur `http://localhost:3000`.

Optionnel : `npm run seed` insère ~12 parties fictives pour que le leaderboard ne soit pas vide.

### Variables d'environnement

| Variable                  | Obligatoire | Rôle                                                             |
|---------------------------|:-----------:|------------------------------------------------------------------|
| `CLERK_PUBLISHABLE_KEY`   | oui         | Sert à dériver l'issuer du JWT et l'URL JWKS                     |
| `CLERK_SECRET_KEY`        | non         | Pas utilisé pour la vérif JWT — préparé pour TP 14               |
| `CLERK_JWT_ISSUER`        | non         | Override manuel de l'issuer si la dérivation échoue              |
| `PORT`                    | non         | Port HTTP, défaut 3000                                           |
| `CORS_ORIGINS`            | non         | Liste blanche d'origines, séparées par virgules                  |
| `DB_PATH`                 | non         | Chemin SQLite (`./data/tycoon.sqlite` par défaut, ou `:memory:`) |

> Mode "tout en mémoire" : `DB_PATH=:memory:` — base perdue à chaque redémarrage.

## Stack & choix techniques

- **Node 18+ / Express** — léger, suffisant pour ce qu'on fait.
- **SQLite via `better-sqlite3`** — synchrone, fichier local, zéro service externe.
  Pour la prod : Postgres + pool. Hors-scope ici.
- **`jose`** pour la vérification JWT via JWKS (clé publique de Clerk, cache automatique).
- Pas d'ORM. SQL préparé directement, c'est plus pédagogique et plus court.

## Anatomie de la vérification JWT (à lire avant le TP 13 partie 3.2)

Le middleware `requireAuth()` (dans `src/auth.js`) fait, dans l'ordre :

1. Lit le header `Authorization: Bearer <token>`.
2. Récupère la **JWKS** (JSON Web Key Set) de Clerk à
   `<issuer>/.well-known/jwks.json`. Cette URL expose les **clés publiques** de Clerk.
   `jose` télécharge et cache automatiquement (rotation prise en charge).
3. Vérifie la **signature** du JWT avec la clé publique (algorithme `RS256`).
4. Vérifie l'**issuer** (le JWT vient bien de votre app Clerk).
5. Vérifie l'**expiration** (`exp`) automatiquement.
6. Si OK : attache `req.auth = { userId, claims }` à la requête.

Conséquences importantes (questions du TP) :

- Le serveur **ne contacte pas Clerk à chaque requête**. Il a juste besoin de la clé publique,
  et il peut vérifier la signature localement. La JWKS est rafraîchie en arrière-plan.
- La **`CLERK_SECRET_KEY` n'est pas utilisée** ici pour vérifier les JWT. Elle ne servira que
  si vous appelez l'API Clerk côté backend (récupérer un user, etc — TP 14 éventuellement).
- Si on **modifie le payload** côté client (ex: changer `sub` pour usurper un autre user),
  la signature ne correspond plus → `JWSSignatureVerificationFailed` → 401.

## Validation du score : volontairement absente (TP 13 partie 3.2 question 5)

Le backend **fait confiance au score envoyé** par le client, à part quelques checks de type
(entier positif, durée bornée à 24h). Il n'y a **pas** de cohérence entre `score`, `duration`
et `clicks`. C'est pédagogique : le TP 13 vous demande d'identifier ce problème.

> Le TP 14 corrigera ça en faisant tourner la **logique de jeu côté serveur** (autorité serveur,
> voir la spec gameplay v2). Le client enverra alors des **intentions** (`action:click`, etc),
> pas un score final.

## Structure

```
startup-tycoon-api/
├── package.json
├── .env.example
├── src/
│   ├── server.js              # entry Express + CORS + health
│   ├── db.js                  # SQLite + statements préparés
│   ├── auth.js                # middleware JWT Clerk (jose + JWKS)
│   └── routes/
│       ├── leaderboard.js     # GET /api/leaderboard
│       └── games.js           # GET /api/games/me, POST /api/games
└── scripts/
    ├── seed.js                # npm run seed
    └── reset.js               # npm run reset
```

## Tests rapides (curl)

```bash
# Sanity
curl http://localhost:3000/health

# Public
curl http://localhost:3000/api/leaderboard

# Doit renvoyer 401
curl -i http://localhost:3000/api/games/me

# Avec un vrai JWT Clerk obtenu côté front (window.Clerk.session.getToken())
TOKEN="eyJhbGciOiJSUzI1NiIs..."
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/games/me

curl -X POST http://localhost:3000/api/games \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"solo","score":1234,"duration":300,"clicks":120,"upgrades":7,"displayName":"Ma Startup"}'
```
