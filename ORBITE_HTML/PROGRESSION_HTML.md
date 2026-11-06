# Orbite autonome — livraison séparée

## Utilisation

Extraire complètement le ZIP de la branche `codex/orbite-html-autonome`, puis ouvrir `ORBITE_HTML/index.html` dans Google Chrome. Le dossier est une livraison compilée : l’utilisateur n’a besoin ni de Node.js, ni de Python, ni d’un serveur ou d’Internet. Conserver ensemble le HTML, les ressources, les pages et les documents. `LISEZ-MOI.html` détaille les étapes Windows.

La version de développement existante reste intégralement conservée dans le dépôt. La branche précédente `codex/orbite-revision-platform` et le commit `729e5b3` constituent également un repère inchangé.

## Contenu conservé

- Cinq chapitres et 26 notions en trois niveaux.
- Les 26 méthodes en huit étapes.
- Les 39 fiches de formules, les définitions et les modes complet/express.
- Les 104 entraînements, leurs indices, corrections et auto-évaluations.
- Les 52 QCM multiples, leurs explications et le mode chronométré.
- Les quatre DS blancs, barèmes, corrections, figures et chronomètres.
- Les 156 questions types.
- Les 30 exercices des livrets et leurs 193 réponses originales.
- Les dix PDF d’origine et les 73 pages en images locales, avec leurs figures et tableaux.
- Navigation, recherche, favoris, progression, export/import, thèmes et impression.

`CONTENU.json` contient les quantités et empreintes SHA-256 des contenus pédagogiques d’origine. Les tableaux sont intégrés au même script que l’application ; aucun chargement JSON distant ou local par `fetch` n’est requis.

## Adaptations techniques

Un outil de fabrication situé dans `scripts/offline/` regroupe React, les icônes, KaTeX, les données et les composants dans **un script classique IIFE**, chargé par une balise `script defer`. Le fichier livré n’est pas un module ES. Les polices sont intégrées au CSS en données ; les références aux PDF et images sont relatives au dossier.

La consultation intégrée des PDF est remplacée par leurs pages en images, afin de ne pas dépendre des réglages du lecteur PDF de Chrome. Un lien conserve l’accès aux originaux. Les schémas interactifs SVG restent dans l’application.

La lecture initiale du stockage est protégée contre une exception de Chrome. Si le stockage est bloqué, l’application reste ouverte et les réponses peuvent être exportées avant fermeture. Le format de sauvegarde est compatible avec la version précédente.

## Vérifications et limites de validation

**Important : l’ouverture `file://` n’a pas pu être validée dans le navigateur de cet environnement cloud.** La tentative réelle de la suite de 14 tests a été bloquée dès la navigation par `net::ERR_BLOCKED_BY_ADMINISTRATOR`. La politique du Chromium administré bloque toutes les URL et n’autorise explicitement que certaines familles, dont HTTP/HTTPS ; elle n’autorise pas `file://`. Aucune protection n’a été désactivée ou contournée. Ce blocage intervient avant le chargement d’Orbite et n’établit pas un défaut de l’application, mais il empêche de certifier ici son exécution en mode fichier.

**Résultat exécuté : 7 tests complémentaires réussis, aucun échec ni test ignoré ; le vérificateur inclus réalise 16 contrôles réussis.**

Les contrôles complémentaires utilisent exactement les fichiers de `ORBITE_HTML`, servis temporairement en HTTP local. Ces résultats ne sont **pas** présentés comme une validation `file://` :

- Le vérificateur intégré exécute 16 contrôles : quantités des huit familles de contenus, cours/schéma, QCM, exercice/sauvegarde, recherche, formules/polices, figures, favoris et absence de ressource externe.
- La suite complémentaire contrôle aussi l’export/import, le thème, le refus du stockage, l’expiration des QCM et DS après rechargement, une impression PDF réelle, le responsive, les chemins relatifs, les polices intégrées, l’intégrité des PDF et l’extraction d’un ZIP avec espaces et accents.
- Le contrôle compare chaque fichier de la version antérieure au commit `729e5b3` pour vérifier qu’il est conservé octet pour octet.
- Les images et PDF sont inclus ; le ZIP extrait contient tout le nécessaire. Aucun module distant, CDN ou serveur métier n’est utilisé.

Le fichier `TESTER_ORBITE.html` est fourni pour permettre un vrai contrôle `file://` sur Windows **sans installer d’outil de test** : l’ouvrir dans Chrome puis cliquer sur « Lancer les vérifications locales ». Le rapport affiche le protocole réellement utilisé. Pour la persistance entre deux sessions, répondre dans `index.html`, fermer Chrome, puis rouvrir le même fichier avec le même profil.

Les tests automatisés `tests/offline/file.spec.js` sont également conservés pour un environnement de développement dont le navigateur autorise les fichiers locaux. La commande correspondante n’est pas nécessaire à l’utilisation du site.

## Limites d’utilisation

Le stockage des URL `file://` dépend du navigateur et de l’emplacement. Un déplacement du dossier, un changement de profil, la navigation privée ou un nettoyage de Chrome peut empêcher de retrouver la progression automatiquement. Exporter avant de déplacer et importer au nouvel emplacement. Il n’est pas possible d’accéder automatiquement aux résultats de l’ancien serveur depuis le fichier local : utiliser l’export/import.

Les limites pédagogiques de la première version demeurent : pas de corrigé officiel joint, lectures graphiques approchées, priorités non prédictives et auto-évaluation des rédactions. Les chronomètres suivent l’horloge locale ; fermer la page ne les met pas en pause.

## Pour les développeurs uniquement

La fabrication peut être reproduite depuis le projet existant avec `node scripts/offline/build.mjs` après installation de ses dépendances de développement. Poppler est nécessaire pour reconstruire les images des PDF si elles ont changé ; il ne l’est pas pour utiliser le dossier livré. Les fichiers d’aide utilisateur sont conservés dans `ORBITE_HTML`.

Tests supplémentaires :

- `./node_modules/.bin/playwright test --config playwright.static.config.js` : contrôles complémentaires HTTP, distincts du mode fichier.
- `./node_modules/.bin/playwright test --config playwright.offline.config.js` : tests `file://` ; utiliser un navigateur qui autorise ce protocole et, si besoin, renseigner `ORBITE_CHROME_PATH` pour son chemin standard. Ne pas désactiver de politique d’administration.
