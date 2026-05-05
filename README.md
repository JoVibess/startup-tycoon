# Startup Tycoon – Lancer le projet

Ce projet utilise **React + Vite**.

## Pourquoi React plutôt que Vue ?

J’ai choisi **React** plutôt que **Vue** principalement pour sa **logique de composants** :

- Découper l’interface en **petits composants indépendants**, faciles à comprendre et à réutiliser  
- **Isoler la logique et l’UI** dans une même unité (un composant = son état, ses événements, son rendu)  
- Faciliter la maintenance et l’évolution du code grâce à cette structure.

## Organisation du dossier `src`

Pour que le projet reste clair et facile à faire évoluer, le code dans `src/` est rangé par “rôle” :

- `src/components/`  
    Contient les **composants réutilisables** de l’interface (boutons, cartes, formulaires, barres de navigation…).  
    On les importe dans les pages ou d’autres composants.

- `src/pages/` (ou `src/routes/`)  
    Regroupe les **pages principales** de l’application (ex. : accueil, tableau de bord, profil…).  
    Chaque fichier correspond souvent à une route.

- `src/assets/`  
    Contient les **ressources statiques** : images, icônes, polices, parfois des fichiers CSS globaux.

- `src/services/` (ou `src/api/`)  
    Contient la **logique d’accès aux données** : fonctions pour appeler une API, gérer l’authentification, etc.

- `src/styles/`  
    Garde les **styles globaux** ou les fichiers de configuration CSS/SCSS/Tailwind.

- `src/state/`  
    Centralise la **gestion de l’état global** de l’application (par exemple avec Redux, Zustand, ou le Context API).  
    On y stocke les **stores**, les **reducers**, les **actions** et éventuellement des hooks personnalisés (`useAuthStore`, `useCartStore`, etc.).

Selon ton projet, certains dossiers peuvent ne pas exister ou porter un nom légèrement différent, mais l’idée est toujours de séparer clairement les responsabilités.

## Compréhension du point d’entrée

1. L’application est montée dans le DOM dans le fichier `src/main.jsx`.
2. Le composant racine est `App`, importé depuis `src/App.jsx`.
3. Le router est configuré dans `src/App.jsx`, avec `BrowserRouter`, `Routes` et `Route`.
4. L’élément HTML qui sert de point d’ancrage est `<div id="root"></div>` dans le fichier `index.html`.

## TP 6 — Premier gameplay

La page de jeu `/` est implémentée dans `src/pages/Game.jsx`. C’est le seul fichier qui contient le state local du gameplay pour ce TP :

- `money`, initialisé à `0`
- `clickValue`, initialisé à `1`

Les composants sont séparés par responsabilité :

- `src/components/MoneyDisplay.jsx` affiche uniquement l’argent reçu en prop avec le texte `Money: $X`.
- `src/components/ClickButton.jsx` affiche le bouton `Développer` et déclenche la callback `onClick` quand le joueur clique.
- `src/components/GameHeader.jsx` structure le titre, `MoneyDisplay` et `IncomeDisplay`.
- `src/components/IncomeDisplay.jsx` sert de placeholder pour les revenus automatiques des prochains TP.

Le flux d’événement est le suivant :

1. Le joueur clique sur `ClickButton`.
2. `ClickButton` appelle la callback `onClick` reçue en prop.
3. Dans `src/pages/Game.jsx`, la fonction `handleDevelopClick` met à jour `money` avec `setMoney`.
4. React re-render la page et `MoneyDisplay` reçoit la nouvelle valeur via sa prop `money`.

Le formatage des grands nombres est isolé dans `src/utils/formatNumber.js` :

- `999` reste `999`
- `1200` devient `1.2K`
- `1250000` devient `1.25M`

## TP 7 — Tick 1s et revenu passif

Le revenu passif est géré localement dans `src/pages/Game.jsx`, sans store global.

L’interval est créé dans le `useEffect` du composant `Game`, dans le fichier `src/pages/Game.jsx` :

```jsx
useEffect(() => {
  const tickId = setInterval(() => {
    setMoney((currentMoney) => currentMoney + incomePerSecond)
  }, 1000)

  return () => {
    clearInterval(tickId)
  }
}, [incomePerSecond])
```

L’interval est nettoyé dans la fonction de retour du `useEffect`, avec `clearInterval(tickId)`.

Ce nettoyage se déclenche :

- quand le composant `Game` est démonté, par exemple après une navigation vers une autre page
- avant de recréer un nouvel interval si `incomePerSecond` change
- pendant certains comportements de développement comme le hot reload ou le mode strict de React

C’est important parce que sans nettoyage, plusieurs intervals pourraient rester actifs en même temps. Le jeu gagnerait alors de l’argent trop vite, même si un seul tick devrait exister. Nettoyer l’interval évite aussi les fuites mémoire et les mises à jour de state sur un composant qui n’est plus affiché.

Les boutons temporaires de test dans `src/pages/Game.jsx` permettent de vérifier le tick sans passer par le Shop :

- `+1 income/sec` augmente `incomePerSecond`
- `Reset income/sec` remet `incomePerSecond` à `0`

Pour prouver le bon fonctionnement du tick, un log temporaire a été placé dans la callback du `setInterval`, puis retiré :

```jsx
console.log('tick revenu passif')
```

Ce log doit apparaître exactement une fois par seconde dans la console. S’il apparaît deux ou trois fois par seconde, cela signifie que plusieurs intervals tournent en même temps.

Un interval mal géré peut “accélérer le temps” du jeu parce que chaque interval actif exécute sa propre callback toutes les secondes. Par exemple, si trois intervals restent actifs après des navigations ou des rechargements à chaud, le jeu applique trois ticks par seconde au lieu d’un seul. Le revenu passif devient donc trois fois trop rapide. C’est pour cela que `clearInterval(tickId)` dans le cleanup du `useEffect` est indispensable.

`setInterval` ne met pas directement le callback dans la Call stack.
Le timer est géré par les Web APIs du navigateur.
Quand le délai est écoulé, le callback est placé dans la macrotask queue.
La Call stack doit être vide pour que l’Event Loop puisse envoyer ce callback dans la Call stack.
Si le thread principal est occupé par du code long, la Call stack reste pleine.
Le tick peut donc arriver en retard, même si le délai demandé est de 1 seconde.

## TP 8 — State partagé

1. `money` et `incomePerSecond` vivent dans `src/App.jsx`.
2. Oui, `Game` et `Shop` ont besoin des mêmes données.
3. Sans store global, `App` partage les données avec des props et des callbacks.
4. C’est fragile parce que `App` grossit vite et doit faire passer beaucoup de props.

## TP 9 — Store global

Le store global utilise Zustand dans `src/state/useGameStore.js`.

Flux :

```txt
View -> Action Zustand -> Store -> render(View)
```

Le state initial et les actions du jeu sont dans `src/state/useGameStore.js`.
Le tick global est créé dans `src/components/GameTick.jsx`, monté dans `Layout`, donc il reste actif sur toutes les pages.

## TP 10 — Format de sauvegarde

La clé `localStorage` prévue pour la sauvegarde est `startup-tycoon-save`.

Le format est défini dans `src/services/gameSave.js` :

```json
{
  "version": 1,
  "savedAt": 1700000000000,
  "state": {
    "money": 120,
    "incomePerSecond": 4,
    "clickValue": 1,
    "upgrades": [],
    "totalClicks": 42,
    "totalEarned": 999
  }
}
```

Au démarrage, le store dans `src/state/useGameStore.js` appelle `loadGameSave`.
Si aucune sauvegarde n’existe, le state par défaut est utilisé.
Si la sauvegarde existe, le JSON, la version `1` et les types du state sont vérifiés.
Si la sauvegarde est invalide ou corrompue, elle est ignorée et le jeu repart de zéro sans crash.

La sauvegarde est centralisée dans `src/services/gameSave.js` avec `saveGameState`.
Elle est lancée immédiatement après un achat réussi et après un reset.
Un autosave dans `src/components/GameAutoSave.jsx` sauvegarde aussi toutes les 5 secondes.
On évite donc d’écrire dans `localStorage` à chaque tick.

La page `Settings` contient un bouton `Reset Save`.
Après confirmation, il remet le store à zéro et supprime la clé `startup-tycoon-save` du `localStorage`.
Elle affiche aussi la date de dernière sauvegarde à partir de `savedAt`.

Analyse :

1. Sauvegarder à chaque tick spammerait `localStorage` et pourrait ralentir le jeu.
2. Si le JSON est corrompu, il est ignoré et le jeu repart avec le state par défaut.
3. `version` permet de savoir si une ancienne sauvegarde est compatible avec le code actuel.
4. On sauvegarde le state global du jeu : argent, revenus, upgrades et stats, car ce sont les données de progression.

## TP 11 — Mesure initiale

Baseline Lighthouse en mode Navigation sur `/` :

- Performance : 32
- Accessibility : 100
- Best Practices : 81
- SEO : 82
- First Contentful Paint : 3.7 s
- Largest Contentful Paint : 7.7 s
- Total Blocking Time : 590 ms
- Cumulative Layout Shift : 0.001
- Speed Index : 7.6 s

Baseline Lighthouse en mode Navigation sur `/shop` :

- Performance : 33
- Accessibility : 100
- Best Practices : 81
- SEO : 82
- First Contentful Paint : 3.7 s
- Largest Contentful Paint : 7.0 s
- Total Blocking Time : 590 ms
- Cumulative Layout Shift : 0.001
- Speed Index : 4.3 s

Performance tab sur `/shop` pendant environ 10 secondes :

- Tick actif pendant l’enregistrement.
- Range : 0 ms -> 10.06 s
- Scripting : 2571 ms
- System : 363 ms
- Painting : 30 ms
- Rendering : 29 ms
- CLS : 0.00
- Beaucoup d’activité JS régulière est visible sur le main thread.
- Pas de gros coût côté rendering/painting par rapport au scripting.

Nouveau test Performance tab sur `/` :

- Range : environ 21.08 s
- Scripting estimé : 209 ms
- Rendering estimé : 4 ms
- Painting estimé : 8 ms
- `RunTask` total : 447 ms
- Long task max : 69.7 ms
- Le coût rendering/painting est très faible.
- Le coût JS est beaucoup plus faible que sur la première mesure `/shop`.

Nouveau test Performance tab sur `/shop` :

- Range : environ 5.94 s
- Scripting estimé : 132 ms
- Rendering estimé : 1.5 ms
- Painting estimé : 2.6 ms
- `RunTask` total : 188 ms
- Long task max : 71.8 ms
- Le coût rendering/painting est très faible.
- La page `/shop` est plus légère après isolation des composants et debounce de la recherche.

Constat avec instrumentation temporaire des re-renders :

- `Layout`, `Shop` et les `UpgradeCard` re-render pendant le tick.
- Cela confirme que le tick du state global provoque des re-renders à optimiser.
- Les logs temporaires ont été retirés après observation.

Optimisation des re-renders du Shop :

- `Shop` ne lit plus directement `money`.
- Les stats du shop sont isolées dans `ShopStats`.
- La liste des upgrades est isolée dans `UpgradeList`.
- `UpgradeCard` utilise `memo` et reçoit une action stable.
- Les cartes déjà achetables gardent des props stables pendant le tick, donc elles évitent des re-renders inutiles.
- Le tick a été remis à `1000 ms`, car le jeu doit tourner à 1 tick par seconde.

Optimisation du header :

- `Layout` ne lit plus directement le state global du jeu.
- Les stats globales sont isolées dans `GlobalStats`.
- Le logo, la navigation et le bouton de theme ne sont plus re-render à chaque tick.

Recherche d'upgrades avec debounce :

- La recherche est disponible sur `/shop`.
- Le champ met à jour `searchTerm` à chaque frappe.
- Le filtre utilise une valeur debouncée de `300 ms`.
- Résultat : le filtrage ne se relance pas à chaque touche, mais après une courte pause.

Lazy loading / code splitting :

- Les pages `/shop` et `/stats` sont chargées avec `React.lazy`.
- `Suspense` affiche un court chargement si le chunk n’est pas encore prêt.
- Dans Network, les chunks de ces pages doivent apparaître seulement quand on visite leur route.
- Preuve sur `/` : `src/assets/tp11-partie5-page-game.png`.
- Preuve sur `/shop` : `src/assets/tp11-partie5-page-shop.png`.

Nouveau test Lighthouse sur `/` :

- Performance : `38`
- Accessibility : `100`
- Best Practices : `100`
- SEO : `82`
- First Contentful Paint : `3.7 s`
- Largest Contentful Paint : `7.1 s`
- Total Blocking Time : `410 ms`
- Cumulative Layout Shift : `0.059`
- Speed Index : `4.2 s`
- Le score progresse, mais le LCP reste élevé.

Nouveau test Lighthouse sur `/shop` :

- Performance : `38`
- Accessibility : `100`
- Best Practices : `100`
- SEO : `82`
- First Contentful Paint : `3.7 s`
- Largest Contentful Paint : `7.1 s`
- Total Blocking Time : `410 ms`
- Cumulative Layout Shift : `0.035`
- Speed Index : `4.3 s`
- Capture : `src/assets/tp11-lighthouse-partie-6-shop.png`.

Rapport d'optimisation React Profiler :

- Montage initial : `9.6 ms`.
- Update mesuré : `2.3 ms`.
- Composants touchés pendant l'update : `Game`, `GameHeader`, `GlobalStats`, `MoneyDisplay`, `IncomeDisplay`, `ClickButton`.
- Les composants les plus coûteux pendant l'update sont `Game` (`2.3 ms`), `GameHeader` (`1.4 ms`) et `GlobalStats` (`1 ms`).
- Le coût React est faible : le problème Lighthouse vient plutôt du TBT, du LCP et des ressources chargées.

Priorités d'optimisation :

1. Optimiser l'image principale `logo-auto-clicker.png`, car elle est lourde.
2. Eviter les re-renders inutiles dans `Game` avec `memo` sur les composants d'affichage stables.
3. Mesurer en build de production, sans extensions Chrome, pour avoir un Lighthouse plus fiable.
4. Garder le lazy loading, même si le gain actuel est faible, car il sera utile si `/shop` ou `/stats` grossissent.

Analyse critique :

1. Avant optimisation, `Shop`, `Layout` et les `UpgradeCard` re-renderaient inutilement au tick.
2. L'isolation des composants et le debounce ont eu l'impact le plus visible dans Performance tab.
3. L'optimisation la plus rentable est d'isoler les composants qui lisent le store.
4. Le tick révèle vite les problèmes, car il modifie le state régulièrement.
5. Je n'ai pas fait d'optimisations complexes, car les mesures montrent déjà un coût React faible.

## TP 12 - SSR / SSG

Hydration :

1. Le HTML est visible avant le JS, car Next envoie deja une page HTML remplie.
2. L'hydration sert a relier ce HTML avec React pour rendre la page interactive.
3. SSR ne veut pas dire "sans JS" : le HTML arrive d'abord, puis le JS hydrate la page.

Comparaison CSR vs SSR / SSG :

- `/stats` (CSR) Lighthouse : `33`
- `/public-stats` (SSR/SSG) Lighthouse : `89`

Analyse simple :

1. Pour le SEO, `/public-stats` est meilleur car le contenu est deja present dans le HTML initial.
2. Pour FCP/LCP, `/public-stats` est meilleur car la page est deja rendue avant le chargement complet du JS.
3. Le cout cote serveur, c'est qu'il faut generer la page et maintenir un projet Next en plus.

Choix technique :

- Framework : `Next.js`
- Strategie de donnees : fichier JSON mock `public-stats.json`
- Projet separe : `startup-tycoon-public`

## TP 13 - Backend/Auth (preuves curl)

Tests realises sur `http://localhost:3000` :

1. Sanity check backend

```bash
curl http://localhost:3000/health
```

Reponse :

```json
{"status":"ok","games":0,"uptime":15.098189417}
```

2. Endpoint public leaderboard

```bash
curl http://localhost:3000/api/leaderboard
```

Reponse :

```json
{"limit":20,"count":0,"entries":[]}
```

3. Endpoint protege sans token

```bash
curl -i http://localhost:3000/api/games/me
```

Reponse :

```text
HTTP/1.1 401 Unauthorized
...
{"error":"Missing Authorization header"}
```

Conclusion : l'API est bien accessible, le leaderboard est public, et `/api/games/me` est correctement protege par un header `Authorization: Bearer <token>`.

### Anatomie de l'authentification Clerk (TP13 Partie 2)

Cookies (DevTools > Application > Cookies) :

1. Cookies Clerk observes : voir capture (`__session` inclus).
2. Pour chaque cookie, relever : `HttpOnly`, `Secure`, `SameSite`, domaine, expiration.
3. Role de `__session` : cookie de session qui represente l'etat connecte.
4. `document.cookie` n'affiche pas les cookies `HttpOnly`, donc on ne peut pas les lire en JS.

JWT (via `getToken()`) :

1. Le token est recupere cote client avec `getToken()` (teste dans `/stats` avec le bouton "Inspecter mon token").
2. Structure JWT : `header.payload.signature`.
3. Algorithme de signature attendu : `RS256` (champ `alg`).
4. Payload observe : `sub` (user id), `iss` (issuer), `iat`, `exp`, et autres claims Clerk.
5. Modifier le payload cote client casse la signature : le backend repond `401`.
6. Duree de vie : `exp - iat` (affichee dans le bloc d'investigation `/stats`).

Network :

1. Requetes Clerk visibles vers `clerk.com` / `*.clerk.accounts.dev`.
2. Pour l'API backend, le header attendu est `Authorization: Bearer <token>`.
3. Le token d'acces est recupere a la demande via Clerk (`getToken()`), pas stocke en clair dans `localStorage` par notre app.

Preuves a fournir (captures TP) :

1. /startup-tycoon/src/assets/tp13-Partie2-A.png
2. /startup-tycoon/src/assets/tp13-Partie2-B.png
3. /startup-tycoon/src/assets/tp13-Partie2-C.png

### Lecture backend (TP13 Partie 3.2)

1. Middleware qui verifie le JWT :
`requireAuth()` dans `startup-tycoon-api/src/auth.js`.

2. Pourquoi le serveur n'appelle pas Clerk a chaque requete :
il verifie localement la signature avec la cle publique Clerk recuperee via JWKS (`createRemoteJWKSet`), avec cache automatique.

3. Ou est stocke le `user_id` apres verification :
dans `req.auth.userId` (et les claims dans `req.auth.claims`).

4. Reponse sans header `Authorization` sur `/api/games/me` :
`401` avec `{"error":"Missing Authorization header"}`.

5. Validation du score :
validation minimale de type uniquement (entier positif, bornes de duree), sans coherence gameplay (`score`, `duration`, `clicks`).
Probleme : un client peut tricher et envoyer un score gonfle.

### State client vs state serveur (TP13 Partie 3.3)

1. Qu'est-ce qu'un state client ?
Le state client est l'etat local de l'interface, gere par le front pendant la session.

2. Qu'est-ce qu'un state serveur ?
Le state serveur vient d'une API et peut etre partage entre utilisateurs.

3. Pourquoi `useState + useEffect + fetch` est fragile pour les donnees serveur ?
Parce qu'on doit tout gerer a la main : chargement, erreurs, cache, refetch, synchronisation entre pages.

4. Trois problemes de l'approche naive :
- pas de cache central fiable
- pas de deduplication automatique des requetes
- invalidation/refetch manuel apres mutation (risque de desynchronisation UI)

Conclusion :
TanStack Query est utile car il gere nativement le cache, le refetch, la deduplication et l'etat loading/error pour les donnees serveur.

### Setup TanStack Query (TP13 Partie 3.4)

- Installation React : `@tanstack/react-query`.
- Setup racine dans `src/main.jsx` avec `QueryClientProvider`.
- Valeurs par defaut configurees :
`staleTime: 30_000` et `retry: 2`.

### Client HTTP authentifie (TP13 Partie 3.5)

Module cree : `src/lib/api.js`

`apiFetch(path, options)` fait :

1. Recupere le token Clerk via `window.Clerk.session.getToken()`.
2. Ajoute automatiquement `Authorization: Bearer <token>` quand `auth=true`.
3. Gere les erreurs HTTP :
- `401` : redirection vers `/sign-in`
- `4xx/5xx` : `throw Error(...)`

Base URL :
- `VITE_API_BASE_URL` si definie
- sinon `http://localhost:3000`

Usage actuel :
- `/stats` appelle `/api/games/me` via `apiFetch`.

### Queries et Mutation (TP13 Partie 3.6)

Hooks crees :

- `useLeaderboard()` :
queryKey `['leaderboard']`, fetch `GET /api/leaderboard`, `staleTime: 10_000`.
- `useMyGames()` :
queryKey `['games','me']`, fetch `GET /api/games/me`.
- `useSubmitGame()` :
mutation `POST /api/games`, puis invalidation de `['leaderboard']` et `['games','me']`.

Pages branchees :

- `/leaderboard` (publique) : affiche le top all-time via `useLeaderboard`.
- `/stats` (protegee) : charge l'historique personnel via `useMyGames`.

### Optimistic update (TP13 Partie 3.7)

Implementation :

- `useSubmitGame()` utilise :
`onMutate`, `onError`, `onSettled`.
- `onMutate` :
mise a jour immediate du cache `['games','me']` et `['leaderboard']`.
- `onError` :
rollback vers les snapshots precedents.
- `onSettled` :
invalidation `['games','me']` et `['leaderboard']` pour resynchroniser avec le serveur.

Test manuel simple :

1. Aller sur `/stats` (connecte).
2. Ouvrir Network et filtrer `api/games`.
3. Cliquer `Envoyer une partie test`.
4. Observer :
- l'UI se met a jour tout de suite (optimistic)
- la requete `POST /api/games` apparait dans Network
- puis la requete de refetch remet l'etat serveur final.
5. Pour tester rollback :
- arreter temporairement `startup-tycoon-api`
- recliquer `Envoyer une partie test`
- l'UI revient en arriere et affiche une erreur.

## Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/) ou [yarn](https://yarnpkg.com/)

## Installation

Dans le dossier du projet (`startup-tycoon`) :

```bash
# avec npm
npm install

# ou avec pnpm
pnpm install

# ou avec yarn
yarn
```

## Lancer le projet en développement

```bash
# avec npm
npm run dev

# ou avec pnpm
pnpm dev

# ou avec yarn
yarn dev
```

Puis ouvrir l’URL affichée dans le terminal.

## Build pour la production

```bash
# avec npm
npm run build

# ou avec pnpm
pnpm build

# ou avec yarn
yarn build
```

Pour prévisualiser le build :

```bash
# avec npm
npm run preview

# ou avec pnpm
pnpm preview

# ou avec yarn
yarn preview
```
