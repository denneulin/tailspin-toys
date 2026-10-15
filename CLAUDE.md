# Tailspin Toys

Site fictif de financement participatif de jeux, en Astro 7 et Tailwind CSS v4, sans framework front. Les pages sont prérendues au build ; une route qui exporte `prerender = false` est servie à la demande par l'adaptateur Node : le modèle est `src/pages/api/games/[id].ts`, testé dans `e2e-tests/api.spec.ts`. Les données sont dans un SQLite local, lu avec Drizzle ORM et le module `node:sqlite` de Node.

## Commandes

- `npm run dev` : serveur de dev, sur le premier port libre à partir de 4321 ; l'URL est dans la sortie.
- `npm run test:unit` : Vitest, en moins d'une seconde. Un seul fichier : `npx vitest run src/lib/games.test.ts`.
- `npm run test:e2e` : Playwright. Construit le site, le sert sur un port propre au dossier, puis lance les tests. Un seul fichier : `npx playwright test e2e-tests/api.spec.ts`.
- `npm run lint`
- `npm run typecheck:all` : `tsgo` pour `db/` et `src/lib/`, `astro check` pour les `.astro` et les routes d'API.

Une tâche est finie quand `npm run lint`, `npm run typecheck:all` et `npm run test:unit` passent, plus `npm run test:e2e` dès qu'une page ou une route a changé.

## Pièges

- Sous macOS et Linux, Astro 7 détecte que c'est un agent qui lance `npm run dev` ou `npm run preview` : le serveur passe en arrière-plan, et la commande rend la main avec l'URL. Un second `npm run dev` dans le même dossier ne relance rien, il redonne cette URL. `npx astro dev status`, `npx astro dev logs` et `npx astro dev stop` le pilotent (`npx astro preview …` pour la preview).
- Le `webServer` de `playwright.config.ts` (un port calculé par dossier, `--ignore-lock`, aucun serveur réutilisé) permet à chaque worktree de tester son propre code : ne le change pas.
- `tailspin.db`, ignorée par git, est construite à partir de `db/games.csv` par `npm run db:setup`, que lancent `npm run dev` et `npm run build`. Le seed n'ajoute que les jeux absents : après un changement du CSV ou du seed, supprime `tailspin.db`.
- Les migrations de `db/migrations/` sont produites par `npm run db:generate` après un changement de `db/schema.ts`, et committées avec lui ; ne les écris jamais à la main.
- Le paquet `typescript` reste en v6 : ESLint et `astro check` ne supportent pas encore la v7. TypeScript 7 (`tsgo`) ne sert qu'à la vérification de types.
- Le site est en anglais : textes affichés, noms et commentaires restent en anglais, même quand on te parle en français.
