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
