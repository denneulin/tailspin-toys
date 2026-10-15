# Gestionnaire de tickets : Markdown local

Les tickets et les specs de ce dépôt sont des fichiers Markdown dans `.scratch/`.

## Conventions

- Un dossier par fonctionnalité : `.scratch/<slug-fonctionnalite>/`
- La spec est `.scratch/<slug-fonctionnalite>/spec.md`
- Les tickets d'implémentation sont un fichier par ticket, `.scratch/<slug-fonctionnalite>/issues/<NN>-<slug>.md`, numérotés à partir de `01` ; jamais un fichier unique qui regroupe les tickets
- L'état de tri est une ligne `Status:` en haut de chaque ticket (les valeurs sont dans `triage-labels.md`)
- Les commentaires et l'historique des échanges s'ajoutent en bas du fichier, sous un titre `## Comments`

## Quand un skill dit « publier dans le gestionnaire de tickets »

Créer un fichier sous `.scratch/<slug-fonctionnalite>/` (en créant le dossier si besoin).

## Quand un skill dit « récupérer le ticket concerné »

Lire le fichier au chemin indiqué. L'utilisateur donne en général le chemin ou le numéro du ticket.

## Opérations de wayfinding

Utilisées par `/wayfinder`. La **carte** est un fichier, avec un fichier **enfant** par ticket.

- **Carte** : `.scratch/<chantier>/map.md` (corps Notes / Decisions-so-far / Fog).
- **Ticket enfant** : `.scratch/<chantier>/issues/NN-<slug>.md`, numéroté à partir de `01`, avec la question dans le corps. Une ligne `Type:` donne le type (`research`/`prototype`/`grilling`/`task`) ; une ligne `Status:` vaut `claimed` ou `resolved`.
- **Blocage** : une ligne `Blocked by: NN, NN` en haut. Un ticket est débloqué quand tous les fichiers listés sont `resolved`.
- **Front** : parcourir `.scratch/<chantier>/issues/` pour trouver les tickets ouverts, débloqués et non réclamés ; le plus petit numéro l'emporte.
- **Réclamer** : passer à `Status: claimed` et enregistrer avant tout travail.
- **Résoudre** : ajouter la réponse sous un titre `## Answer`, passer à `Status: resolved`, puis ajouter un pointeur (résumé + lien) dans la section Decisions-so-far de `map.md`.
