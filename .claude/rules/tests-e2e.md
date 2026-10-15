---
paths:
  - "e2e-tests/**"
---

# Tests e2e (Playwright)

- Un fichier par fonctionnalité ou par page (`<fonctionnalité>.spec.ts`), un `test.describe` par fonctionnalité, des titres de la forme « Fonctionnalité - scénario », `test.step` pour les étapes d'un parcours.
- Localisateurs par rôle ou par libellé (`getByRole`, `getByLabel`) ; `getByTestId` pour ce qui n'a ni rôle clair ni libellé.
- Des assertions qui attendent d'elles-mêmes (`await expect(…).toHaveText(…)`) ; jamais de `waitForTimeout`, ni de délai rallongé.
- Une route d'API se teste avec le fixture `request`, comme dans `api.spec.ts`.
- Les tests tournent en parallèle, sur la même base : un test qui écrit ne compte pas sur l'état laissé par un autre.
- `accessibility.spec.ts` passe axe (WCAG 2.1 AA) sur l'accueil, une fiche de jeu et la page À propos ; une nouvelle page mérite le même contrôle.
