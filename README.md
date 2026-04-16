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
