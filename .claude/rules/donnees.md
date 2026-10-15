---
paths:
  - "db/**/*.ts"
  - "src/lib/**/*.ts"
---

# Couche de données (Drizzle + node:sqlite)

- Une fonction d'accès aux données reçoit la base en premier paramètre (`db: Database`) : les pages et les routes lui passent `getDatabase()`, les tests une base en mémoire. Elle ne l'ouvre jamais elle-même.
- Toute liste est triée sur une colonne stable (`orderBy(asc(games.title))`) : les pages sont prérendues, et deux builds doivent donner le même site.
- Les lignes Drizzle sont converties une seule fois, dans `src/lib/`, vers les types de `src/types/` ; les composants ne voient jamais une ligne brute.
- Les valeurs calculées au seed sont déterministes, comme `ratingFromTitle` : jamais de `Math.random()`.
- La lecture du CSV et les calculs du seed sont des fonctions pures, dans `db/transforms.ts`, sans accès à la base.
- Les fonctions exportées déclarent le type de leurs paramètres et de leur retour.
