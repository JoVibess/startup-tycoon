# Startup Tycoon – Lancer le projet

Ce projet utilise **React + Vite**.

## Pourquoi React plutôt que Vue ?

J’ai choisi **React** plutôt que **Vue** principalement pour sa **logique de composants** :

- Découper l’interface en **petits composants indépendants**, faciles à comprendre et à réutiliser  
- **Isoler la logique et l’UI** dans une même unité (un composant = son état, ses événements, son rendu)  
- Faciliter la maintenance et l’évolution du code grâce à cette granularité

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

Puis ouvrir l’URL affichée dans le terminal (en général [http://localhost:5173](http://localhost:5173)).

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
