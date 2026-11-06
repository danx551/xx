# Orbite — Révisions de physique-chimie

Application personnelle de Terminale spécialité construite à partir des dix PDF de ce dépôt. Priorité pédagogique aux chapitres diffraction/interférences et lunette astronomique. Les sources d’origine sont conservées.

## Démarrer

Prérequis : Node.js ≥ 22.12 (testé avec 24.22.1), npm et Poppler (`pdftotext`, `pdfinfo`). Aucun compte, clé API, service payant ou base de données.

```bash
cd /workspace/xx
npm ci
npm run dev
```

Le serveur écoute uniquement l’interface locale, sur le port indiqué par Vite. La préparation des dix PDF est exécutée automatiquement avant `dev` et `build`. Les PDF sont copiés dans `public/documents/` sans modifier les originaux ; le texte par page est reconstruit dans `src/data/sources.json`.

Pour préparer une compilation de production :

```bash
npm run build
npm run preview
```

La compilation inclut KaTeX, ses polices et les documents. L’application ne contacte aucun CDN au chargement. Elle exige un serveur HTTP local ; ouvrir directement `index.html` depuis le disque ne suffit pas.

**Usage personnel :** le serveur n’a pas d’authentification. Ne pas publier les PDF et les énoncés sur un hébergement public. Aucune publication ni aucun push GitHub n’est effectué par ces commandes.

## Ce qui fonctionne

- Tableau de bord avec progression réelle, difficultés, résultats récents et favoris.
- 26 notions en trois niveaux et 26 méthodes en huit étapes.
- 39 fiches de formules en LaTeX ; définitions ; modes complet/express et impression/PDF.
- 104 exercices originaux : réponses numériques avec unités imposées et tolérance de 1,5 %, ou rédaction à auto-évaluer ; quatre indices progressifs.
- Les 30 exercices type bac fournis, référencés dans leurs PDF, et 193 réponses originales avec aides par question.
- 156 questions organisées par catégorie et priorité pédagogique.
- 52 QCM à réponses multiples, avec explication de chaque proposition et mode chronométré.
- Quatre DS blancs distincts sur 20, durée réglable, brouillons persistants, fin automatique et corrigés masqués pendant l’épreuve. La notation des rédactions est une auto-évaluation.
- Simulateurs de diffraction, de somme de sinusoïdes et de lunette afocale ; figures de repérage dans les DS d’optique.
- Recherche, modes sombre/clair, interface mobile et export/import de progression.
- Documents sources et tableau de couverture dans l’application.

Les quatre niveaux ne représentent pas une mesure étalonnée de difficulté. Une réponse numérique juste ne valide pas automatiquement la rédaction. Le repère « consolidée » combine deux exercices réussis ou auto-évalués comme compris et un QCM juste ; il ne certifie pas une maîtrise exhaustive.

## Vérifier

```bash
npm test
npm run test:e2e
npm run build
```

Les tests navigateur utilisent Chromium à `/usr/bin/chromium` dans cet environnement. Sur une autre machine, adapter `playwright.config.js` à un Chromium installé ou installer celui de Playwright. Le runner démarre Vite automatiquement si nécessaire. Dans cet environnement, l’ouverture de ports et le lancement du navigateur peuvent nécessiter l’exécution hors du bac à sable de commande.

`npm test` contrôle notamment les références aux sources, les 30 exercices, le calcul exact des QCM, la validité LaTeX, les barèmes et une sélection de calculs scientifiques indépendants. Les tests ne sont pas une preuve automatique de justesse de toutes les explications en langage naturel.

## Organisation

- `src/data/curriculum.js` : cours, méthodes, formules, définitions et réserves scientifiques.
- `src/data/practice.js`, `quizzes.js`, `exams.js` : entraînement original.
- `src/data/bac.js` : références, questions extraites et corrections originales.
- `src/state.js` : persistance et validation des sauvegardes.
- `src/Learning.jsx`, `Assessment.jsx`, `components.jsx` : parcours et interactions.
- `analysis/` : extractions des PDF, inventaire, couverture structurée et empreintes des sources.
- `COUVERTURE.md` : notions, formules et chaque question type bac, avec références et état.
- `PROGRESSION.md` : travail terminé, validations et limites.

Régénérer les documents de traçabilité :

```bash
npm run prepare:sources
node scripts/coverage.mjs
```

## Progression et confidentialité

Les données sont conservées dans `localStorage`, clé `orbite-progress-v1`, uniquement dans le navigateur utilisé. Elles ne suivent pas automatiquement un autre appareil. Exporter une sauvegarde depuis les paramètres ; l’import remplace les données actuelles. Le chronomètre repose sur une échéance absolue : fermer la page ne le suspend pas. L’horloge locale peut être modifiée : ce n’est pas un système d’examen sécurisé.

Les corrigés séparés et les exercices du manuel Hachette cités par les cours ne sont pas fournis. Les corrections de l’application sont rédigées à partir des énoncés, sans attribution au professeur. Les points ambigus et incohérences numériques identifiés sont présentés dans « Couverture & vérifications » et dans `COUVERTURE.md`.
