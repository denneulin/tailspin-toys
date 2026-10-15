---
paths:
  - "src/**/*.astro"
  - "src/styles/**"
---

# Interface (Astro + Tailwind CSS v4)

- Pas de framework front (React, Vue, Svelte) : des composants `.astro`. Une interaction côté client passe par un `<script>` d'Astro et les API du DOM, sur des éléments natifs (`<button>`, `<a href>`, `<form>`).
- Les données sont lues dans le frontmatter, avec les fonctions de `src/lib/`. Une route dynamique prérendue énumère ses pages avec `getStaticPaths()`, comme `src/pages/game/[id].astro`.
- Chaque élément interactif porte un `data-testid` qui dit ce qu'il est (`game-card`, `back-game-button`) : les tests e2e s'en servent.
- Accessibilité : HTML sémantique, `aria-label` quand le texte visible ne suffit pas, un focus visible (`focus:ring-2 focus:ring-blue-500 focus:outline-none`), `role="status"` et `aria-live="polite"` pendant un chargement, Escape pour fermer ce qui s'ouvre. La navigation reste un `<nav>` de liens, sans `role="menu"`.
- Thème sombre seulement, palette slate (`bg-slate-800`, `text-slate-100`, `border-slate-700`), coins arrondis. Des classes utilitaires Tailwind plutôt que du CSS à part ; pas de fichier de configuration Tailwind, la v4 se règle dans `src/styles/global.css`.
