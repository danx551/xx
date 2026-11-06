# Progression — Orbite

Mis à jour le 6 novembre 2026.

Une première version utilisable de la plateforme est construite dans ce dépôt. Le parcours est local et sans compte. Les chapitres 4 et 5 occupent une place prioritaire dans le tableau de bord, les questions et les DS. Il n’y a aucune prédiction certaine du futur devoir.

## État par phase

| Phase                     | État de cette version                                                                                                                                                                                          | Fichiers / preuves                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1. Inventaire et analyse  | Dix PDF et 73 pages examinés ; texte extrait ; 30 exercices repérés. Les graphiques utilisés pour les calculs ont été relus à plus grande taille.                                                              | `analysis/ANALYSE_PDF.md`, extractions `.txt`, `sources-sha256.json` |
| 2. Architecture et design | React/Vite, navigation latérale, recherche, responsive, sombre/clair, aucune API payante.                                                                                                                      | `src/main.jsx`, `styles.css`                                         |
| 3. Cours                  | 26 notions en trois niveaux, avec unités, analogies, pièges et références. Compléments pédagogiques distingués des sources.                                                                                    | `src/data/curriculum.js`, `Learning.jsx`                             |
| 4. Fiche essentielle      | 39 relations LaTeX, définitions, conditions, symboles, isolements, exemple et erreur fréquente ; complet/express ; impression/PDF.                                                                             | `curriculum.js`, fiche express réellement exportée et examinée en A4 |
| 5. Méthodes               | 26 familles, huit étapes, rédaction modèle, variantes et quatre exercices par famille.                                                                                                                         | `curriculum.js`, `practice.js`                                       |
| 6. Type bac               | Les 30 énoncés sont référencés dans les PDF locaux. 193 réponses originales rédigées ; aides, objectifs et méthodes par question ; brouillon et auto-évaluation.                                               | `src/data/bac.js`, `COUVERTURE.md`                                   |
| 7. Questions              | 156 entrées organisées par notion et catégorie, avec explications et priorités pédagogiques. Certaines sont des questions de justification ou d’adaptation générale de méthode.                                | `src/data/practice.js`                                               |
| 8. QCM et DS              | 52 QCM multiples expliqués ; mode chronométré. Quatre DS originaux distincts sur 20, durée modifiable, figures de repérage en optique, réponses conservées, corrigés masqués pendant l’épreuve.                | `quizzes.js`, `exams.js`, `Assessment.jsx`                           |
| 9. Contrôle               | Compilation, tests de données/calculs et 12 parcours Chromium réussis. Rendus ordinateur, téléphone et impression examinés. La justesse exhaustive de toutes les rédactions n’est pas certifiée par ces tests. | `tests/`, commandes ci-dessous                                       |

## Fonctionnalités opérationnelles

- Progression sauvegardée dans le navigateur, favoris, résultats, brouillons et paramètres.
- Recherche dans cours, méthodes, formules, exercices, questions et QCM.
- 104 exercices originaux avec vérification numérique en unité imposée, ou auto-évaluation d’une réponse rédigée.
- Quatre indices progressifs par entraînement, par exercice type bac et par question de ces exercices.
- Simulations de diffraction (λ et largeur réglables), de superposition de sinus (phase réglable) et de lunette afocale (oculaire réglable).
- Les échéances des QCM et DS survivent au rechargement. Fermer la page ne suspend pas le temps.
- Export/import de la progression, contrôle du format et message explicite en cas de sauvegarde illisible.
- Consultation locale des dix PDF, avec figures et tableaux d’origine.
- Tableau de couverture dans l’application et dans `COUVERTURE.md`, également disponible en JSON.

Le repère de consolidation exige deux exercices numériques réussis ou deux rédactions auto-évaluées comme comprises, et un QCM juste. Une lecture de cours seule ne vaut pas consolidation. Une auto-évaluation n’est pas une correction automatique. Les scores QCM du tableau de bord concernent les dernières réponses validées ; les questions non validées comptent pour zéro dans le score de la session chronométrée.

## Vérifications exécutées

- `npm ci --no-audit --no-fund` : installation figée réussie.
- `npm test` : **8 tests réussis**, aucun échec ni test ignoré. Ils couvrent notamment les références aux 73 pages et aux 193 questions, les liens entre contenus, les 39 formules LaTeX, des calculs numériques indépendants, les réponses multiples exactes, les barèmes sur 20 et la validation des sauvegardes.
- `npm run test:e2e` : **12 tests Chromium réussis**, aucun échec ni test ignoré. Navigation, cours/favoris/thème persistants, réponses et indices après rechargement, auto-évaluation distincte, QCM multiples, expiration QCM, expiration DS et brouillon, recherche/filtres, PDF/corrections, impression, export/import, mobile sans débordement.
- `npm run build` : compilation de production réussie, avec les documents et polices locales. Découpage en modules pour éviter un unique gros fichier JavaScript.
- Export réel de la fiche express : **7 pages A4**, première page examinée. L’application permet de filtrer un chapitre avant impression.
- `git diff --name-only -- '*.pdf'` : aucun PDF original modifié.
- Serveur de production local : réponse numérique corrigée et conservée après rechargement, formules LaTeX, PDF source, aucun appel externe ni erreur JavaScript observés.
- Instructions cloud `install_script` et `start_skill` enregistrées dans le brouillon ; publication non effectuée.

Un défaut découvert par le test de rechargement a été corrigé : les compteurs d’indices sont désormais enregistrés au même format que les autres notes, ce qui évite de rejeter la sauvegarde entière.

## Points scientifiques signalés

1. Exemple d’interfrange du cours 4, p. 6 : les valeurs fournies donnent **625 nm** avant arrondi, et non exactement 633 nm.
2. Première extinction d’une fente : la démonstration est complétée par l’appariement des demi-fentes. Deux rayons de bord seuls ne prouvent pas l’annulation.
3. Grossissement : le cours utilise le module positif ; le rapport des angles orientés d’une lunette de Kepler est négatif.
4. Scarabées : le résultat de simulation est compatible avec une hypothèse de lecture à ±0,1 cm, mais la convention n’est pas explicitée dans le livret. Une convention d’arrondi à une demi-graduation donnerait une autre incertitude. L’hypothèse choisie est indiquée dans la correction.
5. Notice des étoiles doubles : longueur fixe et oculaires donnés ne conduisent pas exactement à une même focale objectif ; le grossissement maximal calculé est proche de 92, pas de 100.
6. UV-visible : le seul maximum à 660 nm ne justifie pas l’absorption du vert ; considérer le spectre complet.
7. Doppler lumineux : le raisonnement classique demandé par le livret n’est utilisé qu’au premier ordre non relativiste ; il n’est pas présenté comme une loi exacte de la lumière.
8. Canon anti-grêle : distinguer crête et moyenne sur huit heures ; la soustraction donnée pour l’émergence est replacée dans son modèle, avec remarque sur la somme physique des intensités.

## Limites et travail restant identifié

- **Corrigés officiels non fournis.** Les livrets annoncent un document séparé absent du dépôt. Les 193 réponses sont des corrections originales, pas une transcription certifiée des solutions du professeur.
- **Pages du manuel Hachette absentes.** Les numéros d’exercices et corrigés cités dans les cours ne peuvent pas être traités fidèlement sans ces pages. Aucun contenu manquant n’a été inventé comme s’il provenait du manuel.
- **Relecture pédagogique indépendante à prévoir.** Les tests contrôlent des calculs de référence, la structure et le fonctionnement ; ils ne prouvent pas automatiquement toutes les 193 corrections rédigées, toutes les priorités ni la pertinence exhaustive des variantes. Les lectures de graphiques sont explicitement approximatives.
- **Profondeur perfectible.** La version donne un parcours complet d’accès aux cinq chapitres et un volume conséquent d’entraînement. Les variantes de certaines familles restent proches de l’application directe ; on peut enrichir les transferts et détailler davantage certains barèmes question par question. Les niveaux n’ont pas été étalonnés auprès d’élèves.
- **Schémas.** Les figures d’origine sont consultables dans les PDF ; les simulateurs et schémas ajoutés sont pédagogiques. Il n’y a pas d’éditeur de construction optique ni de correction automatique d’un dessin.
- **Évaluation.** La tolérance de 1,5 % des calculs n’évalue ni la rédaction ni les chiffres significatifs. Les rédactions et notes de DS reposent sur une auto-évaluation guidée.
- **Sauvegarde.** Locale au navigateur. Pas de synchronisation multi-appareil, d’authentification ou de serveur de comptes. Exporter régulièrement la progression.
- **Livraison.** Le projet complet est préparé sur la branche `codex/orbite-revision-platform` du dépôt `danx551/xx`. Aucune publication de site n’est effectuée. Les PDF sources sont conservés et doivent rester à usage personnel.

## Reprendre le travail

Lire `README.md`, `analysis/ANALYSE_PDF.md` et `COUVERTURE.md`. Utiliser le checkout existant dans `/workspace/xx`, sans créer de worktree sauf demande explicite. Préserver les PDF. Lancer `npm ci`, puis `npm run dev`. Pour une modification de contenu, actualiser `COUVERTURE.md` avec `node scripts/coverage.mjs` et exécuter les vérifications pertinentes.
