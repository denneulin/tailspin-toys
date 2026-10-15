---
paths:
  - "**/*.test.ts"
---

# Tests unitaires (Vitest)

- Le test est à côté du code qu'il teste : `games.test.ts` à côté de `games.ts`.
- Une fonction d'accès aux données se teste sur une vraie base en mémoire, neuve à chaque test : `createTestDatabase()` (`db/test-helpers.ts`), puis seulement les données dont le test a besoin. Pas de mock de la base.
- À couvrir : le cas nominal, l'absence (un id inconnu donne `null`), la collection vide et l'ordre de tri.
- Un comportement par `it` ; `it.each` pour une table d'entrées et de sorties.
- Aucun serveur Astro dans un test unitaire : ce qui se teste ici ne dépend pas d'Astro.
