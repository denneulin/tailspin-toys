# Docs de domaine

Comment les skills d'ingénierie lisent la documentation de domaine de ce dépôt quand ils explorent le code.

## Avant d'explorer, lire

- **`GLOSSARY.md`** à la racine du dépôt.
- **`docs/adr/`** : les ADR qui touchent la zone où l'on va travailler.

Si l'un de ces fichiers n'existe pas, **continuer sans rien dire**. Ne pas signaler leur absence ni proposer de les créer d'avance. Le skill `/domain-modeling` (atteint via `/grill-with-docs` et `/improve-codebase-architecture`) les crée au fil de l'eau, quand un terme ou une décision est réellement tranché.

Comme le reste des docs du projet, le glossaire et les ADR sont rédigés en français.

## Structure des fichiers

Dépôt à contexte unique :

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-<décision>.md
│   └── 0002-<décision>.md
└── src/
```

## Employer le vocabulaire du glossaire

Quand une production nomme un concept du domaine (titre de ticket, proposition de refactoring, hypothèse, nom de test), utiliser le terme tel qu'il est défini dans `GLOSSARY.md`. Ne pas glisser vers des synonymes que le glossaire écarte explicitement.

Si le concept n'est pas encore dans le glossaire, c'est un signal : soit on invente un langage que le projet n'emploie pas (à reconsidérer), soit il y a un vrai manque (à noter pour `/domain-modeling`).

## Signaler les conflits avec un ADR

Si une production contredit un ADR existant, le dire explicitement plutôt que de passer outre en silence :

> _Contredit l'ADR-0007 (commandes en event sourcing), mais mérite d'être rouvert parce que…_
