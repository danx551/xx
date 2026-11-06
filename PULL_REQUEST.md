Orbite transforme le dépôt de documents PDF en une application personnelle de révision de physique-chimie. Cette branche contient le code, les dépendances verrouillées, les tests, les analyses et la documentation nécessaires pour récupérer et lancer le projet sur un ordinateur.

- Cinq chapitres, 26 notions en trois niveaux, 26 méthodes et 39 fiches de formules LaTeX imprimables.
- 104 exercices originaux, 52 QCM à réponses multiples, 156 questions et quatre DS blancs chronométrés sur 20.
- Les 30 exercices type bac des PDF sont référencés, avec 193 réponses originales et des indices progressifs par question.
- Progression locale, favoris, recherche, modes clair/sombre, interface mobile et export/import des sauvegardes.
- Les dix PDF existants sont conservés sans modification. Aucun compte ni service payant n’est nécessaire.

## Récupérer et démarrer

Prérequis : Node.js ≥ 22.12, npm, Python 3 et Poppler (`pdftotext`, `pdfinfo`).

```bash
git clone --branch codex/orbite-revision-platform https://github.com/danx551/xx.git
cd xx
npm ci
npm run dev
```

`predev` prépare automatiquement les copies locales des PDF. Les fichiers générés, `node_modules` et les rapports de tests sont exclus de Git ; ils sont reproductibles depuis les fichiers de cette branche. Le README détaille également la compilation de production.

## Validation

- `npm ci` : installation depuis le verrouillage vérifiée.
- `npm test` : huit tests réussis.
- `npm run test:e2e` : douze tests Chromium réussis, dont sauvegarde après rechargement, expiration des chronomètres, QCM multiples, PDF, export/import et mobile.
- `npm run build` : compilation réussie ; contrôle fonctionnel effectué sur le serveur de production local.
- Intégrité des dix PDF comparée au contenu de `HEAD` avant ajout de l’application.

## Limites pédagogiques

Les corrigés séparés du professeur et les pages du manuel citées sont absents. Les réponses de l’application sont des rédactions originales ; les lectures graphiques sont approchées. Les tests techniques ne certifient pas exhaustivement toutes les explications scientifiques. Les réponses rédigées et les DS reposent sur une auto-évaluation guidée. Les priorités ne prédisent pas le futur devoir.

Consulter `PROGRESSION.md`, `COUVERTURE.md` et `analysis/ANALYSE_PDF.md` pour le détail des contenus, validations et réserves. Le serveur n’a pas d’authentification : le projet est destiné à un usage personnel, sans publication publique des documents.
