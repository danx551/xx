import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  BookOpen,
  Printer,
  Search,
  CheckCircle2,
  ChevronDown,
  Bookmark,
} from "lucide-react";
import {
  chapters,
  topics,
  formulas,
  issues,
  definitions,
} from "./data/curriculum.js";
import { exercises, questionBank, isCorrect } from "./data/practice.js";
import { bacExercises } from "./data/bac.js";
import { quizzes } from "./data/quizzes.js";
import { topicStats } from "./state.js";
import sources from "./data/sources.json";
import {
  Favorite,
  SourceLink,
  MathBlock,
  SectionHeader,
  Empty,
  Pill,
  StepList,
  HintBox,
  Diagram,
} from "./components.jsx";
export function ChapterFilter({ value, setValue }) {
  return (
    <div className="filters" aria-label="Filtrer par chapitre">
      <button
        className={value === 0 ? "active" : ""}
        onClick={() => setValue(0)}
      >
        Tous les chapitres
      </button>
      {chapters.map((c) => (
        <button
          className={value === c.id ? "active" : ""}
          key={c.id}
          onClick={() => setValue(c.id)}
        >
          <span className="dot" style={{ background: c.color }} />
          {c.id}. {c.short}
        </button>
      ))}
    </div>
  );
}
export function Dashboard({ progress, go }) {
  const stats = topics.map((t) => topicStats(t, progress, quizzes));
  const bacDone = bacExercises.filter(
    (e) => progress.notes[`${e.id}-review`],
  ).length;
  const done =
    Object.values(progress.answers).filter((a) => a.checked).length + bacDone;
  const quizResults = Object.values(progress.quizResults);
  const quizCorrect = quizResults.filter((r) => r.correct).length;
  const studied = progress.studied.length;
  const mastered = stats.filter((s) => s.mastered).length;
  const next =
    [
      ...topics.filter((t) => t.chapter >= 4),
      ...topics.filter((t) => t.chapter < 4),
    ].find((t) => !topicStats(t, progress, quizzes).mastered) || topics[0];
  return (
    <>
      <div className="dashboard-intro">
        <div>
          <div className="eyebrow">
            <span className="dot" /> TON ESPACE DE RÉVISION
          </div>
          <h1>
            À chaque révision,
            <br />
            <em>un peu plus loin.</em>
          </h1>
          <p>
            Comprendre les phénomènes. Trouver la méthode.
            <br />
            Prendre confiance pour le prochain DS.
          </p>
        </div>
        <div className="intro-label">
          <span>TERMINALE GÉNÉRALE</span>
          <strong>Spécialité physique-chimie</strong>
          <span>5 chapitres · un objectif : l’autonomie</span>
        </div>
      </div>
      <div className="stats-grid">
        {[
          [
            "Notions étudiées",
            `${studied}/${topics.length}`,
            "Cours marqués comme lus",
            "book",
          ],
          [
            "Exercices réalisés",
            done,
            `${Object.values(progress.answers).filter((a) => a.correct === true).length} calcul(s) juste(s) · ${bacDone} type bac auto-évalué(s)`,
            "pen",
          ],
          [
            "Résultats aux QCM",
            quizResults.length
              ? `${Math.round((quizCorrect / quizResults.length) * 100)} %`
              : "—",
            `${quizResults.length} question(s) validée(s)`,
            "quiz",
          ],
          [
            "Notions consolidées",
            mastered,
            "2 exercices validés ou auto-évalués + QCM",
            "target",
          ],
        ].map(([label, value, sub]) => (
          <div className="stat" key={label}>
            <div className="stat-label">
              {label}
              <ArrowUpRight size={13} />
            </div>
            <strong>{value}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>
      <div className="dashboard-main">
        <div>
          <div className="hero-card">
            <div className="hero-content">
              <Pill tone="purple">TON CAP POUR LE DS</Pill>
              <h2>
                La lumière sur
                <br />
                l’optique.
              </h2>
              <p>
                Diffraction, interférences et lunette :<br />
                tes deux chapitres prioritaires, pas à pas.
              </p>
              <button
                className="button primary"
                onClick={() => go("courses", "diffraction")}
              >
                Reprendre les fondamentaux <ArrowRight size={16} />
              </button>
              <span className="hero-note">
                Priorité pédagogique · aucune prédiction du sujet
              </span>
            </div>
            <div className="hero-art" aria-hidden="true">
              <svg viewBox="0 0 330 300">
                <defs>
                  <radialGradient id="glow">
                    <stop stopColor="#a88bfa" stopOpacity=".6" />
                    <stop offset="1" stopColor="#a88bfa" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="165" cy="148" r="145" fill="url(#glow)" />
                <g stroke="#9e8bc1" fill="none" opacity=".4">
                  <ellipse
                    cx="165"
                    cy="148"
                    rx="135"
                    ry="60"
                    transform="rotate(-34 165 148)"
                  />
                  <ellipse
                    cx="165"
                    cy="148"
                    rx="135"
                    ry="60"
                    transform="rotate(34 165 148)"
                  />
                  <circle cx="165" cy="148" r="97" />
                  <line
                    x1="25"
                    y1="148"
                    x2="305"
                    y2="148"
                    strokeDasharray="4 6"
                  />
                </g>
                <path
                  d="M30 90 L190 148 L300 75 M30 148 L190 148 L300 148 M30 206 L190 148 L300 221"
                  stroke="#d5c1ff"
                  strokeWidth="1.5"
                  fill="none"
                />
                <ellipse
                  cx="190"
                  cy="148"
                  rx="17"
                  ry="100"
                  stroke="#d3c1ff"
                  strokeWidth="2"
                  fill="#b899f4"
                  fillOpacity=".12"
                />
                <circle cx="190" cy="148" r="5" fill="#f4e8ff" />
                <circle cx="73" cy="85" r="4" fill="#c5b0ff" />
                <circle cx="268" cy="206" r="3" fill="#c5b0ff" />
                <text
                  x="215"
                  y="274"
                  fill="#d4c3f7"
                  fontSize="18"
                  fontFamily="Georgia"
                >
                  θ ≈ λ/a
                </text>
              </svg>
            </div>
          </div>
          <div className="row section-row">
            <h2>Tes cinq chapitres</h2>
            <button className="text-button" onClick={() => go("courses")}>
              Tout explorer <ArrowRight size={15} />
            </button>
          </div>
          <div className="chapter-cards">
            {chapters.map((c) => {
              const subset = topics.filter((t) => t.chapter === c.id),
                count = subset.filter((t) =>
                  progress.studied.includes(t.id),
                ).length;
              const percent = Math.round((count / subset.length) * 100);
              return (
                <button
                  key={c.id}
                  className="chapter-card"
                  style={{ "--chapter": c.color }}
                  onClick={() => go("courses", String(c.id))}
                >
                  <div className="row">
                    <span className="chapter-number">0{c.id}</span>
                    <Pill tone={c.priority ? "purple" : ""}>{c.tag}</Pill>
                  </div>
                  <h3>{c.short}</h3>
                  <p>{c.description}</p>
                  <div className="chapter-bottom">
                    <div className="row">
                      <span>
                        {count}/{subset.length} notions étudiées
                      </span>
                      <strong>{percent} %</strong>
                    </div>
                    <div className="progress-track">
                      <div style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="card-arrow" size={17} />
                </button>
              );
            })}
          </div>
        </div>
        <aside className="right-column">
          <div className="panel next-panel">
            <div className="eyebrow">PROCHAINE ÉTAPE</div>
            <span className="large-step">
              01<span>/ UN PAS À LA FOIS</span>
            </span>
            <h3>{next.title}</h3>
            <p>{next.recognize}</p>
            <div className="small-divider" />
            <div className="row mini">
              <BookOpen size={16} />
              <span>Comprendre → appliquer → maîtriser</span>
            </div>
            <button
              className="button secondary full"
              onClick={() => go("courses", next.id)}
            >
              C’est parti <ArrowRight size={15} />
            </button>
          </div>
          <div className="panel express-panel">
            <div className="symbol">✧</div>
            <h3>Dernière ligne droite ?</h3>
            <p>
              Les relations, unités et pièges à revoir avant de rendre ta copie.
            </p>
            <button className="text-button" onClick={() => go("express")}>
              Révision express avant le DS <ArrowRight size={14} />
            </button>
          </div>
          <div className="panel">
            <div className="eyebrow">À RETRAVAILLER</div>
            {stats.some((s) => s.review) ? (
              topics
                .filter((t, i) => stats[i].review)
                .slice(0, 4)
                .map((t) => (
                  <button
                    key={t.id}
                    className="review-link"
                    onClick={() => go("methods", t.id)}
                  >
                    {t.title}
                    <ArrowRight size={14} />
                  </button>
                ))
            ) : (
              <p className="caption">
                Tes difficultés apparaîtront ici après tes premiers exercices et
                QCM. Chaque erreur t’indiquera quoi revoir.
              </p>
            )}
          </div>
          <div className="source-note">
            <span className="status-dot" />
            <span>
              Ta progression reste sur cet appareil.
              <br />
              Aucun compte. Aucun abonnement.
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
export function Courses({ id, progress, update, go }) {
  const initial = Number(id) || 0;
  const [chapter, setChapter] = useState(initial),
    [level, setLevel] = useState(0);
  const topic = topics.find((t) => t.id === id);
  if (topic) {
    const contents = [topic.understand, topic.apply, topic.master];
    return (
      <>
        <button
          className="back-button"
          onClick={() => go("courses", String(topic.chapter))}
        >
          <ArrowLeft size={15} /> Chapitre {topic.chapter}
        </button>
        <SectionHeader
          eyebrow={`COURS · CHAPITRE ${topic.chapter}`}
          title={topic.title}
          description="Un parcours en trois niveaux, à ton rythme."
          action={
            <Favorite id={topic.id} progress={progress} update={update} />
          }
        />
        <div className="detail-layout">
          <div>
            <div className="tabs">
              {[
                "01 · Comprendre",
                "02 · Appliquer",
                "03 · Maîtriser pour le DS",
              ].map((s, i) => (
                <button
                  className={i === level ? "active" : ""}
                  key={s}
                  onClick={() => setLevel(i)}
                >
                  {s}
                </button>
              ))}
            </div>
            <article className="panel lesson">
              <Pill>Rédaction pédagogique · d’après le cours</Pill>
              <h2>
                {
                  [
                    "Voir le phénomène",
                    "Passer aux calculs",
                    "Aller plus loin",
                  ][level]
                }
              </h2>
              <p className="lesson-text">{contents[level]}</p>
              <div className="analogy">
                <strong>Pour te le représenter</strong>
                <p>{topic.analogy}</p>
              </div>
              <h3>Les unités à surveiller</h3>
              <p>{topic.data}</p>
              <SourceLink chapter={topic.chapter} page={topic.pages} />
            </article>
            {[
              "diffraction",
              "young",
              "diffgraph",
              "circular",
              "lens",
              "afocal",
              "magnification",
              "resolution",
              "interference",
              "acousticdiff",
              "thinfilm",
            ].includes(topic.id) && <Diagram type={topic.id} />}
            <div className="panel">
              <h3>Les relations à relier au phénomène</h3>
              {formulas
                .filter((f) => f.topic === topic.id)
                .map((f) => (
                  <div className="inline-formula" key={f.id}>
                    <h4>{f.title}</h4>
                    <MathBlock latex={f.latex} />
                    <p>{f.when}</p>
                    <button
                      className="text-button"
                      onClick={() => go("formulas", f.id)}
                    >
                      Comprendre tous les symboles <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
            </div>
            <button
              className={`button ${progress.studied.includes(topic.id) ? "secondary" : "primary"}`}
              onClick={() =>
                update((p) => ({
                  ...p,
                  studied: p.studied.includes(topic.id)
                    ? p.studied.filter((x) => x !== topic.id)
                    : [...p.studied, topic.id],
                }))
              }
            >
              <Check size={16} />
              {progress.studied.includes(topic.id)
                ? "Notion étudiée · retirer ce repère"
                : "J’ai étudié les trois niveaux"}
            </button>
            <p className="caption">
              Ce repère indique une lecture déclarée. La consolidation est un
              repère : deux exercices numériques réussis ou réponses écrites
              auto-évaluées comme comprises, et au moins un QCM juste. Elle ne
              certifie pas une maîtrise exhaustive.
            </p>
          </div>
          <aside>
            <div className="panel">
              <h3>De la notion à la méthode</h3>
              <p>{topic.recognize}</p>
              <button
                className="button secondary full"
                onClick={() => go("methods", topic.id)}
              >
                Voir la méthode <ArrowRight size={16} />
              </button>
              <button
                className="button subtle full"
                onClick={() => go("practice", `${topic.id}-1`)}
              >
                M’entraîner <ArrowRight size={16} />
              </button>
            </div>
            <div className="panel warning">
              <h3>Le piège à éviter</h3>
              <p>{topic.traps}</p>
            </div>
            <div className="panel">
              <h3>Dans tes documents</h3>
              <p>
                Lire les figures, tableaux et exercices dans leur mise en page
                d’origine.
              </p>
              <SourceLink chapter={topic.chapter} page={topic.pages} />
              <button
                className="text-button"
                onClick={() => go("bac", String(topic.chapter))}
              >
                Exercices du professeur <ArrowRight size={14} />
              </button>
            </div>
          </aside>
        </div>
      </>
    );
  }
  return (
    <>
      <SectionHeader
        eyebrow="COMPRENDRE AVANT DE MÉMORISER"
        title="Tes cours, pas à pas."
        description="Les cinq chapitres, expliqués en trois niveaux. Les compléments sont distingués des sources."
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      {chapters
        .filter((c) => !chapter || c.id === chapter)
        .map((c) => (
          <section className="course-section" key={c.id}>
            <div className="row">
              <div>
                <div className="eyebrow">
                  CHAPITRE 0{c.id} · {c.tag}
                </div>
                <h2>{c.title}</h2>
              </div>
              <SourceLink chapter={c.id} />
            </div>
            <div className="topic-grid">
              {topics
                .filter((t) => t.chapter === c.id)
                .map((t) => (
                  <div className="topic-card" key={t.id}>
                    <div className="row">
                      <Pill>
                        {progress.studied.includes(t.id)
                          ? "Étudiée"
                          : "À explorer"}
                      </Pill>
                      <Favorite id={t.id} progress={progress} update={update} />
                    </div>
                    <h3>{t.title}</h3>
                    <p>{t.understand.slice(0, 145)}…</p>
                    <button
                      className="text-button"
                      onClick={() => go("courses", t.id)}
                    >
                      Explorer la notion <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
    </>
  );
}
export function Formulas({ id, progress, update, go, express = false }) {
  const [chapter, setChapter] = useState(0),
    [compact, setCompact] = useState(express),
    [query, setQuery] = useState("");
  const selected = formulas.find((f) => f.id === id);
  const list = selected
    ? [selected]
    : formulas.filter(
        (f) =>
          (!chapter || f.chapter === chapter) &&
          `${f.title} ${f.symbols} ${f.when}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      );
  return (
    <div className={`formula-page ${compact ? "compact-sheet" : ""}`}>
      <SectionHeader
        eyebrow="LA FICHE À GARDER PRÈS DE SOI"
        title={
          express
            ? "Révision express avant le DS"
            : "TOUT CE QU’IL FAUT CONNAÎTRE POUR LE DS"
        }
        description="Relations, unités, conditions et pièges. Une formule prend son sens avec ses hypothèses."
        action={
          <button className="button secondary" onClick={() => window.print()}>
            <Printer size={16} /> Imprimer / PDF
          </button>
        }
      />
      <div className="row toolbar">
        <div className="tabs">
          <button
            className={!compact ? "active" : ""}
            onClick={() => setCompact(false)}
          >
            Fiche complète
          </button>
          <button
            className={compact ? "active" : ""}
            onClick={() => setCompact(true)}
          >
            Fiche express
          </button>
        </div>
        <label className="search-small">
          <Search size={15} />
          <input
            aria-label="Rechercher une formule"
            placeholder="Rechercher une formule…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {!selected && <ChapterFilter value={chapter} setValue={setChapter} />}
      <div className="panel essentials">
        <h3>Les réflexes qui sauvent des points</h3>
        <div className="essential-grid">
          <p>
            <strong>Convertir</strong>1 nm = 10⁻⁹ m · 1 µm = 10⁻⁶ m · 1 mm =
            10⁻³ m · 1 L = 10⁻³ m³ · 1 mL = 10⁻⁶ m³ · 1 hPa = 100 Pa · T(K) =
            θ(°C)+273,15 · v(km·h⁻¹) = 3,6v(m·s⁻¹).
          </p>
          <p>
            <strong>Justifier</strong>« Les sources sont cohérentes et en phase…
            » · « À l’équivalence, les réactifs sont dans les proportions
            stœchiométriques… »
          </p>
          <p>
            <strong>Distinguer</strong>Largeur a / séparation b · rayon /
            diamètre · grossissement G / grandissement γ · intensité / niveau.
          </p>
          <p>
            <strong>Reproduire</strong>Montage de titrage légendé · triangle de
            diffraction avec L/2 · dispositif de Young · plan focal commun d’une
            lunette.
          </p>
        </div>
      </div>
      <div className="panel definitions">
        <h3>Définitions et lois à savoir expliquer</h3>
        <dl>
          {definitions
            .filter(([c]) => !chapter || c === chapter)
            .map(([c, title, text]) => (
              <div key={title}>
                <dt>
                  Ch. {c} · {title}
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
        </dl>
      </div>
      <div className="formula-list">
        {list.map((f) => (
          <article className="panel formula-card" key={f.id} id={f.id}>
            <div className="row">
              <div>
                <div className="eyebrow">
                  CHAPITRE {f.chapter} · {chapters[f.chapter - 1].short}
                </div>
                <h2>{f.title}</h2>
              </div>
              <Favorite
                id={`formula:${f.id}`}
                progress={progress}
                update={update}
              />
            </div>
            <MathBlock latex={f.latex} />
            <p className="symbols">{f.symbols}</p>
            <div className="formula-details">
              <div>
                <h4>Quand l’utiliser</h4>
                <p>{f.when}</p>
              </div>
              {!compact && (
                <>
                  <div>
                    <h4>Isoler les inconnues</h4>
                    <p>{f.isolate}</p>
                  </div>
                  <div>
                    <h4>Application numérique</h4>
                    <p>{f.example}</p>
                  </div>
                </>
              )}
              <div className="trap">
                <h4>Erreur fréquente</h4>
                <p>{f.error}</p>
              </div>
            </div>
            <div className="row formula-footer">
              <button
                className="text-button"
                onClick={() => go("methods", f.topic)}
              >
                Appliquer la méthode <ArrowRight size={14} />
              </button>
              <SourceLink
                chapter={f.chapter}
                page={topics.find((t) => t.id === f.topic)?.pages}
              />
            </div>
          </article>
        ))}
      </div>
      {list.length === 0 && (
        <Empty text="Aucune formule ne correspond à cette recherche." />
      )}
      {express && (
        <div className="panel">
          <h2>Dernière vérification avant de rendre</h2>
          <StepList
            steps={[
              "J’ai écrit la relation littérale avant de remplacer les valeurs.",
              "Toutes les unités sont compatibles et indiquées dans la réponse.",
              "J’ai vérifié le facteur 2 pour les taches et les échos.",
              "J’ai annoncé les hypothèses : petits angles, sources en phase, gaz idéal…",
              "J’ai interprété le signe et l’ordre de grandeur.",
              "Je compare un écart à une incertitude sans affirmer une égalité certaine.",
            ]}
          />
        </div>
      )}
    </div>
  );
}
export function Methods({ id, progress, update, go }) {
  const [chapter, setChapter] = useState(Number(id) || 0);
  const topic = topics.find((t) => t.id === id);
  if (topic)
    return (
      <>
        <button
          className="back-button"
          onClick={() => go("methods", String(topic.chapter))}
        >
          <ArrowLeft size={15} /> Toutes les méthodes du chapitre
        </button>
        <SectionHeader
          eyebrow="LA BOÎTE À OUTILS DU RAISONNEMENT"
          title={topic.title}
          description="Reconnaître, choisir, résoudre, rédiger. Puis transférer."
          action={
            <Favorite
              id={`method:${topic.id}`}
              progress={progress}
              update={update}
            />
          }
        />
        <div className="detail-layout">
          <div>
            <article className="panel method-sheet">
              <Pill>Famille d’exercices · chapitre {topic.chapter}</Pill>
              <div className="method-section">
                <span>01</span>
                <div>
                  <h2>Reconnaître l’exercice</h2>
                  <p>{topic.recognize}</p>
                </div>
              </div>
              <div className="method-section">
                <span>02</span>
                <div>
                  <h2>Identifier les données</h2>
                  <p>{topic.data}</p>
                </div>
              </div>
              <div className="method-section">
                <span>03</span>
                <div>
                  <h2>Choisir la méthode</h2>
                  <p>{topic.understand}</p>
                </div>
              </div>
              <div className="method-section">
                <span>04</span>
                <div>
                  <h2>Résoudre, étape par étape</h2>
                  <StepList steps={topic.solve} />
                </div>
              </div>
              <div className="method-section">
                <span>05</span>
                <div>
                  <h2>Rédiger sur la copie</h2>
                  <p>
                    Commencer par la propriété qui justifie la méthode, puis
                    écrire la relation littérale avant le calcul. Exemple rédigé
                    :
                  </p>
                  <blockquote>{topic.apply}</blockquote>
                  <p>
                    Terminer par une phrase interprétant le résultat dans le
                    contexte, avec les unités et une précision cohérente avec
                    les données.
                  </p>
                </div>
              </div>
              <div className="method-section">
                <span>06</span>
                <div>
                  <h2>Adapter aux variantes</h2>
                  <p>{topic.variants}</p>
                  <p>{topic.master}</p>
                </div>
              </div>
              <div className="method-section">
                <span>07</span>
                <div>
                  <h2>Éviter les pièges</h2>
                  <p>{topic.traps}</p>
                </div>
              </div>
              <div className="method-section">
                <span>08</span>
                <div>
                  <h2>S’entraîner et transférer</h2>
                  {exercises
                    .filter((e) => e.topic === topic.id)
                    .map((e) => (
                      <button
                        className="exercise-link"
                        key={e.id}
                        onClick={() => go("practice", e.id)}
                      >
                        <span className="exercise-level">0{e.level}</span>
                        <span>
                          <strong>{e.title}</strong>
                          <small>
                            {e.level === 4
                              ? "Transfert · situation différente"
                              : "Application progressive"}
                          </small>
                        </span>
                        <ArrowRight size={17} />
                      </button>
                    ))}
                </div>
              </div>
              <SourceLink chapter={topic.chapter} page={topic.pages} />
            </article>
          </div>
          <aside>
            <div className="panel">
              <h3>Les relations utiles</h3>
              {formulas
                .filter((f) => f.topic === topic.id)
                .map((f) => (
                  <MathBlock key={f.id} latex={f.latex} />
                ))}
              <button
                className="text-button"
                onClick={() => go("courses", topic.id)}
              >
                Revenir au cours <ArrowRight size={14} />
              </button>
            </div>
            <div className="panel">
              <h3>Dans les exercices du professeur</h3>
              {bacExercises
                .filter((e) => e.topicIds.includes(topic.id))
                .map((e) => (
                  <button
                    key={e.id}
                    className="review-link"
                    onClick={() => go("bac", e.id)}
                  >
                    Ch. {e.chapter} · {e.title}
                    <ArrowRight size={14} />
                  </button>
                ))}
            </div>
          </aside>
        </div>
      </>
    );
  return (
    <>
      <SectionHeader
        eyebrow="PRIORITÉ : APPRENDRE À RÉSOUDRE"
        title="À chaque problème, sa méthode."
        description={`${topics.length} familles, huit étapes et quatre entraînements par famille. Les variantes sont des créations pédagogiques.`}
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      <div className="topic-grid">
        {topics
          .filter((t) => !chapter || t.chapter === chapter)
          .map((t) => (
            <article key={t.id} className="topic-card">
              <div className="row">
                <Pill>Ch. {t.chapter}</Pill>
                <Favorite
                  id={`method:${t.id}`}
                  progress={progress}
                  update={update}
                />
              </div>
              <h3>{t.title}</h3>
              <p>{t.recognize}</p>
              <button
                className="text-button"
                onClick={() => go("methods", t.id)}
              >
                Ouvrir la méthode <ArrowRight size={15} />
              </button>
            </article>
          ))}
      </div>
    </>
  );
}
export function Practice({ id, progress, update, go }) {
  const [chapter, setChapter] = useState(Number(id) || 0),
    [level, setLevel] = useState(0);
  const ex = exercises.find((e) => e.id === id),
    [show, setShow] = useState(false);
  if (ex) {
    const topic = topics.find((t) => t.id === ex.topic),
      answer = progress.answers[ex.id] || {};
    const numeric = Number.isFinite(ex.value);
    const hints = [
      `Notion à reconnaître : ${topic.title}.`,
      topic.solve[0],
      formulas.find((f) => f.topic === topic.id)?.isolate || topic.data,
      ex.steps[0],
    ];
    return (
      <>
        <button
          className="back-button"
          onClick={() => go("practice", String(ex.chapter))}
        >
          <ArrowLeft size={15} /> Tous les entraînements
        </button>
        <SectionHeader
          eyebrow={`CHAPITRE ${ex.chapter} · NIVEAU ${ex.level} / 4`}
          title={topic.title}
          description={ex.title}
          action={<Favorite id={ex.id} progress={progress} update={update} />}
        />
        <div className="detail-layout">
          <div>
            <article className="panel exercise-statement">
              <Pill>{ex.origin}</Pill>
              <h2>À toi de jouer.</h2>
              <p className="statement">{ex.question}</p>
              <label className="field-label" htmlFor="exercise-answer">
                {numeric
                  ? `Ta réponse numérique en ${ex.unit} (tolérance : 1,5 %)`
                  : "Ton raisonnement, avec les étapes et justifications"}
              </label>
              {numeric ? (
                <input
                  id="exercise-answer"
                  className="answer-input"
                  inputMode="decimal"
                  value={answer.raw || ""}
                  placeholder="Ex. 2,5e-4"
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      answers: {
                        ...p.answers,
                        [ex.id]: {
                          ...p.answers[ex.id],
                          raw: e.target.value,
                          checked: false,
                        },
                      },
                    }))
                  }
                />
              ) : (
                <textarea
                  id="exercise-answer"
                  value={answer.raw || ""}
                  rows={7}
                  placeholder="Je reconnais… J’utilise… Je calcule… J’en conclus…"
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      answers: {
                        ...p.answers,
                        [ex.id]: {
                          ...p.answers[ex.id],
                          raw: e.target.value,
                          checked: false,
                        },
                      },
                    }))
                  }
                />
              )}
              <div className="row actions">
                <button
                  className="button primary"
                  disabled={!answer.raw?.trim()}
                  onClick={() => {
                    update((p) => ({
                      ...p,
                      answers: {
                        ...p.answers,
                        [ex.id]: {
                          ...p.answers[ex.id],
                          checked: true,
                          correct: numeric
                            ? isCorrect(answer.raw, ex.value)
                            : null,
                          updatedAt: Date.now(),
                        },
                      },
                    }));
                    if (!numeric) setShow(true);
                  }}
                >
                  {numeric ? "Vérifier ma réponse" : "Comparer au corrigé"}{" "}
                  <Check size={15} />
                </button>
                <button
                  className="button subtle"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Masquer le corrigé" : "Voir le corrigé"}
                </button>
              </div>
              {answer.checked && numeric && (
                <div
                  role="status"
                  className={`feedback ${answer.correct ? "success" : "incorrect"}`}
                >
                  <strong>
                    {answer.correct
                      ? "Le résultat est juste."
                      : "À reprendre : vérifie les données et les conversions."}
                  </strong>
                  <p>
                    {answer.correct
                      ? "Vérifie aussi ta relation littérale et ton interprétation."
                      : "Les indices peuvent t’aider sans révéler toute la correction."}
                  </p>
                </div>
              )}
              <HintBox
                id={ex.id}
                hints={hints}
                progress={progress}
                update={update}
              />
            </article>
            {(show || (answer.checked && answer.correct)) && (
              <article className="panel solution">
                <div className="eyebrow">CORRECTION ORIGINALE</div>
                <h2>Le raisonnement, pas seulement le résultat.</h2>
                <StepList steps={ex.steps} />
                {!numeric && (
                  <>
                    <p>
                      Une réponse rédigée nécessite une auto-évaluation ; elle
                      n’est pas corrigée automatiquement.
                    </p>
                    <div className="row">
                      <button
                        className="button secondary"
                        onClick={() =>
                          update((p) => ({
                            ...p,
                            answers: {
                              ...p.answers,
                              [ex.id]: {
                                ...p.answers[ex.id],
                                checked: true,
                                selfAssessed: "understood",
                                correct: null,
                              },
                            },
                          }))
                        }
                      >
                        J’ai compris le raisonnement
                      </button>
                      <button
                        className="button subtle"
                        onClick={() =>
                          update((p) => ({
                            ...p,
                            answers: {
                              ...p.answers,
                              [ex.id]: {
                                ...p.answers[ex.id],
                                checked: true,
                                selfAssessed: "review",
                                correct: false,
                              },
                            },
                          }))
                        }
                      >
                        À retravailler
                      </button>
                    </div>
                    {answer.selfAssessed && (
                      <p role="status">
                        Auto-évaluation enregistrée :{" "}
                        {answer.selfAssessed === "understood"
                          ? "compris"
                          : "à retravailler"}
                        .
                      </p>
                    )}
                  </>
                )}
                <button
                  className="text-button"
                  onClick={() => go("methods", ex.topic)}
                >
                  Retenir la méthode générale <ArrowRight size={15} />
                </button>
              </article>
            )}
          </div>
          <aside>
            <div className="panel">
              <h3>Avant de calculer</h3>
              <p>{topic.data}</p>
              <SourceLink chapter={ex.chapter} page={topic.pages} />
            </div>
            <div className="panel">
              <h3>Ton parcours</h3>
              {exercises
                .filter((e) => e.topic === ex.topic)
                .map((e) => (
                  <button
                    key={e.id}
                    className={`review-link ${e.id === ex.id ? "current" : ""}`}
                    onClick={() => go("practice", e.id)}
                  >
                    Niveau {e.level} · {e.title}
                    {progress.answers[e.id]?.checked ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </button>
                ))}
            </div>
          </aside>
        </div>
      </>
    );
  }
  return (
    <>
      <SectionHeader
        eyebrow="ESSAYER · COMPRENDRE · RECOMMENCER"
        title="Le terrain d’entraînement."
        description={`${exercises.length} exercices originaux. Trois étapes d’application puis un transfert pour chaque famille.`}
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      <div className="row toolbar">
        <span>
          {
            exercises.filter(
              (e) =>
                (!chapter || e.chapter === chapter) &&
                (!level || e.level === level),
            ).length
          }{" "}
          exercices
        </span>
        <label>
          Niveau{" "}
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            <option value="0">Tous les niveaux</option>
            {[1, 2, 3, 4].map((n) => (
              <option value={n} key={n}>
                {n === 4 ? "4 · Transfert" : `${n} · Application`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="topic-grid">
        {exercises
          .filter(
            (e) =>
              (!chapter || e.chapter === chapter) &&
              (!level || e.level === level),
          )
          .map((e) => (
            <article className="topic-card" key={e.id}>
              <div className="row">
                <Pill>
                  {e.level === 4 ? "Transfert" : `Niveau ${e.level}`} · Ch.{" "}
                  {e.chapter}
                </Pill>
                <Favorite id={e.id} progress={progress} update={update} />
              </div>
              <h3>{topics.find((t) => t.id === e.topic).title}</h3>
              <p>{e.question.slice(0, 145)}…</p>
              <button
                className="text-button"
                onClick={() => go("practice", e.id)}
              >
                {progress.answers[e.id]?.checked
                  ? "Revoir ma réponse"
                  : "Commencer"}{" "}
                <ArrowRight size={15} />
              </button>
            </article>
          ))}
      </div>
    </>
  );
}
export function Anticipate({ id, progress, update, go }) {
  const [chapter, setChapter] = useState(0),
    [category, setCategory] = useState("Tous"),
    [priority, setPriority] = useState(0),
    [query, setQuery] = useState("");
  const list = questionBank.filter(
    (q) =>
      (!id || q.id === id) &&
      (!chapter || q.chapter === chapter) &&
      (category === "Tous" || q.category === category) &&
      (!priority || q.priority === priority) &&
      `${q.question} ${q.answer}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <SectionHeader
        eyebrow="ANTICIPER MON DS"
        title="Savoir à quoi se préparer."
        description="Des questions pertinentes au regard des documents. Les priorités sont des estimations pédagogiques, sans certitude sur le futur sujet."
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      <div className="toolbar row">
        <label>
          Catégorie{" "}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              "Tous",
              "Cours",
              "Calcul",
              "Démonstration",
              "Documents",
              "Pièges",
              "Transversal",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Priorité{" "}
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option value="0">Toutes</option>
            {[1, 2, 3].map((p) => (
              <option key={p} value={p}>
                {p} · {["", "Très utile", "Important", "Complémentaire"][p]}
              </option>
            ))}
          </select>
        </label>
        <label className="search-small">
          <Search size={15} />
          <input
            aria-label="Rechercher une question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Une notion…"
          />
        </label>
      </div>
      <p className="caption">
        {list.length} questions · Les catégories « Démonstration » et «
        Transversal » incluent des justifications et des adaptations de méthode.
      </p>
      <div className="question-list">
        {list.map((q) => (
          <details
            className="panel question"
            key={q.id}
            open={id === q.id || undefined}
          >
            <summary>
              <span>
                <Pill>
                  P{q.priority} · {q.category} · Ch. {q.chapter}
                </Pill>
                <strong>{q.question}</strong>
              </span>
              <ChevronDown size={17} />
            </summary>
            <div className="question-answer">
              <p>{q.answer}</p>
              <h4>Ce qui est évalué</h4>
              <p>{q.evaluation}</p>
              <h4>La méthode</h4>
              <StepList steps={q.method} />
              <h4>Le piège</h4>
              <p>{q.trap}</p>
              <h4>Une variante</h4>
              <p>{q.variant}</p>
              <div className="row">
                <button
                  className="text-button"
                  onClick={() => go("methods", q.topic)}
                >
                  Étudier la méthode <ArrowRight size={14} />
                </button>
                <Favorite id={q.id} progress={progress} update={update} />
              </div>
            </div>
          </details>
        ))}
      </div>
      {!list.length && (
        <Empty text="Modifie les filtres pour retrouver des questions." />
      )}
    </>
  );
}
export function Bac({ id, progress, update, go }) {
  const [chapter, setChapter] = useState(Number(id) || 0),
    [show, setShow] = useState(false),
    [pdf, setPdf] = useState(false);
  const ex = bacExercises.find((e) => e.id === id);
  if (ex)
    return (
      <>
        <button
          className="back-button"
          onClick={() => go("bac", String(ex.chapter))}
        >
          <ArrowLeft size={15} /> Les exercices type bac
        </button>
        <SectionHeader
          eyebrow={`DOCUMENT DU PROFESSEUR · CHAPITRE ${ex.chapter} · EXERCICE ${ex.number}`}
          title={ex.title}
          description={`Livret p. ${ex.start}${ex.end !== ex.start ? `–${ex.end}` : ""} · ${ex.questions.length} questions`}
          action={<Favorite id={ex.id} progress={progress} update={update} />}
        />
        <div className="panel">
          <div className="row">
            <div>
              <h3>L’énoncé et ses figures d’origine</h3>
              <p>
                Référence fidèle au PDF local. Les corrections ci-dessous sont
                rédigées pour l’application, sans corrigé officiel fourni.
              </p>
            </div>
            <SourceLink chapter={ex.chapter} kind="bac" page={ex.start}>
              Ouvrir le PDF original
            </SourceLink>
          </div>
          <button className="button secondary" onClick={() => setPdf(!pdf)}>
            {pdf
              ? "Masquer le document"
              : "Afficher l’énoncé original dans la page"}
          </button>
          {pdf && (
            <iframe
              className="pdf-frame"
              src={ex.url}
              title={`Énoncé original : ${ex.title}`}
            />
          )}
        </div>
        <div className="detail-layout">
          <div>
            <div className="panel">
              <h3>Ce que cet exercice évalue</h3>
              <div className="tags">
                {ex.evaluated.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              <HintBox
                id={ex.id}
                hints={ex.hints}
                progress={progress}
                update={update}
              />
              <label className="field-label" htmlFor="bac-notes">
                Mon brouillon et ma rédaction
              </label>
              <textarea
                id="bac-notes"
                rows={8}
                placeholder="Réponds question par question. Ton brouillon est sauvegardé sur cet appareil."
                value={progress.notes[ex.id] || ""}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    notes: { ...p.notes, [ex.id]: e.target.value },
                  }))
                }
              />
              <button className="button primary" onClick={() => setShow(!show)}>
                {show
                  ? "Masquer les corrections"
                  : "Comparer aux corrections détaillées"}
              </button>
            </div>
            {ex.questions.map((q) => (
              <article className="panel bac-question" key={q.number}>
                <div className="eyebrow">
                  QUESTION {q.number} ·{" "}
                  {show ? "CORRECTION ORIGINALE" : "REPÈRES POUR DÉMARRER"}
                </div>
                <h3>{q.text}</h3>
                <p className="caption">Objectif : {q.evaluation}</p>
                <HintBox
                  id={`${ex.id}-q${q.number}`}
                  hints={q.hints}
                  progress={progress}
                  update={update}
                />
                {show && (
                  <>
                    <p className="lesson-text">{q.answer}</p>
                    <details>
                      <summary>
                        Retenir la méthode, les pièges et les variantes
                      </summary>
                      <StepList steps={q.method} />
                      <h4>À éviter</h4>
                      <p>{q.trap}</p>
                      <h4>Variante</h4>
                      <p>{q.variant}</p>
                      <button
                        className="text-button"
                        onClick={() => go("methods", q.topic)}
                      >
                        Travailler cette méthode <ArrowRight size={14} />
                      </button>
                    </details>
                  </>
                )}
              </article>
            ))}
            {show && (
              <div className="panel">
                <h3>Prendre du recul</h3>
                {ex.traps.map((trap, i) => (
                  <p key={i}>{trap}</p>
                ))}
                <div className="row">
                  <button
                    className="button secondary"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        notes: {
                          ...p.notes,
                          [`${ex.id}-review`]: "understood",
                        },
                      }))
                    }
                  >
                    Je sais refaire · auto-évaluation
                  </button>
                  <button
                    className="button subtle"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        notes: { ...p.notes, [`${ex.id}-review`]: "review" },
                      }))
                    }
                  >
                    À retravailler
                  </button>
                </div>
                {progress.notes[`${ex.id}-review`] && (
                  <p role="status">Auto-évaluation enregistrée.</p>
                )}
              </div>
            )}
          </div>
          <aside>
            <div className="panel">
              <h3>Les méthodes à retenir</h3>
              {ex.topicIds.map((id) => (
                <button
                  className="review-link"
                  key={id}
                  onClick={() => go("methods", id)}
                >
                  {topics.find((t) => t.id === id).title}
                  <ArrowRight size={14} />
                </button>
              ))}
              <button
                className="button secondary full"
                onClick={() => go("practice", `${ex.variantTopic}-4`)}
              >
                Essayer une variante originale <ArrowRight size={15} />
              </button>
            </div>
            <div className="panel warning">
              <h3>Lectures graphiques</h3>
              <p>
                Les valeurs lues sur les figures sont approchées. Consulte le
                PDF avant de comparer tes résultats. Une petite différence de
                lecture doit se discuter avec la précision disponible.
              </p>
            </div>
          </aside>
        </div>
      </>
    );
  return (
    <>
      <SectionHeader
        eyebrow="TES DOCUMENTS, EXPLOITÉS"
        title="Les 30 exercices type bac."
        description="Énoncés originaux accessibles localement, corrections rédigées, pistes pour démarrer et liens vers les méthodes."
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      <div className="topic-grid">
        {bacExercises
          .filter((e) => !chapter || e.chapter === chapter)
          .map((e) => (
            <article className="topic-card" key={e.id}>
              <div className="row">
                <Pill>
                  Ch. {e.chapter} · Ex. {e.number}
                </Pill>
                <Favorite id={e.id} progress={progress} update={update} />
              </div>
              <h3>{e.title}</h3>
              <p>{e.evaluated.join(" · ")}</p>
              <div className="row">
                <span className="caption">
                  {e.questions.length} questions · p. {e.start}
                  {e.end !== e.start ? `–${e.end}` : ""}
                </span>
                <button className="text-button" onClick={() => go("bac", e.id)}>
                  Travailler <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
      </div>
    </>
  );
}
export function Help({ go }) {
  const [chapter, setChapter] = useState(0);
  return (
    <>
      <SectionHeader
        eyebrow="ON REPREND DEPUIS LE DÉBUT"
        title="« Je ne comprends rien. »"
        description="Tu n’as pas besoin de tout comprendre d’un coup. Une idée concrète, un petit exemple, puis un premier pas."
      />
      <ChapterFilter value={chapter} setValue={setChapter} />
      {topics
        .filter((t) => !chapter || t.chapter === chapter)
        .map((t) => (
          <article className="panel help-card" key={t.id}>
            <Pill>Chapitre {t.chapter}</Pill>
            <h2>{t.title}</h2>
            <div className="analogy">
              <strong>L’image à garder</strong>
              <p>{t.analogy}</p>
            </div>
            <p>{t.understand}</p>
            <details>
              <summary>Voir un exemple facile</summary>
              <p>{t.apply}</p>
            </details>
            <div className="row actions">
              <button
                className="button secondary"
                onClick={() => go("practice", `${t.id}-1`)}
              >
                Faire le premier petit test <ArrowRight size={15} />
              </button>
              <button
                className="text-button"
                onClick={() => go("methods", t.id)}
              >
                Passer à la méthode
              </button>
            </div>
          </article>
        ))}
    </>
  );
}
export function Coverage({ go }) {
  const [kind, setKind] = useState("Notions"),
    [chapter, setChapter] = useState(0);
  let rows =
    kind === "Notions"
      ? topics.map((t) => ({
          id: t.id,
          chapter: t.chapter,
          name: t.title,
          source: `Cours p. ${t.pages}`,
          status: "Texte source analysé · rédaction en trois niveaux",
          page: "courses",
        }))
      : kind === "Formules"
        ? formulas.map((f) => ({
            id: f.id,
            chapter: f.chapter,
            name: f.title,
            source: `Cours p. ${topics.find((t) => t.id === f.topic)?.pages}`,
            status: "Symboles, unités, hypothèses et isolements rédigés",
            page: "formulas",
          }))
        : kind === "Méthodes"
          ? topics.map((t) => ({
              id: t.id,
              chapter: t.chapter,
              name: t.title,
              source: `Cours p. ${t.pages} et livrets associés`,
              status: "8 étapes · 3 applications + 1 transfert original",
              page: "methods",
            }))
          : bacExercises.map((e) => ({
              id: e.id,
              chapter: e.chapter,
              name: `Ex. ${e.number} · ${e.title}`,
              source: `Livret p. ${e.start}–${e.end}`,
              status: `${e.questions.length} réponses originales · figures relues, lectures approchées`,
              page: "bac",
            }));
  rows = rows.filter((r) => !chapter || r.chapter === chapter);
  return (
    <>
      <SectionHeader
        eyebrow="TRAÇABILITÉ & QUALITÉ"
        title="Rien sous le tapis."
        description="Ce qui vient des documents, ce qui a été rédigé et ce qui demande encore une vérification indépendante."
      />
      <div className="panel">
        <h3>Périmètre et limites</h3>
        <p>
          10 PDF, 73 pages, 30 exercices type bac. Texte intégral extrait et
          pages examinées visuellement. Les cours et les corrections de
          l’application sont des rédactions originales ; les PDF restent la
          référence de l’énoncé. Les contrôles automatisés testent des calculs
          et les fonctionnalités, pas une certification exhaustive du contenu
          scientifique.
        </p>
        <p>
          Les variantes, QCM et DS blancs sont des créations pédagogiques
          alignées sur les notions rencontrées. Les priorités 1 à 3 ne prédisent
          pas le futur DS.
        </p>
      </div>
      <div className="tabs">
        {["Notions", "Formules", "Méthodes", "Exercices type bac"].map((k) => (
          <button
            key={k}
            className={kind === k ? "active" : ""}
            onClick={() => setKind(k)}
          >
            {k}
          </button>
        ))}
      </div>
      <ChapterFilter value={chapter} setValue={setChapter} />
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Chapitre</th>
              <th>{kind}</th>
              <th>Référence PDF</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>0{r.chapter}</td>
                <td>
                  <button
                    className="text-button"
                    onClick={() => go(r.page, r.id)}
                  >
                    {r.name}
                  </button>
                </td>
                <td>{r.source}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="spaced-title">
        Points de vigilance et contenus non fournis
      </h2>
      {issues.map((issue) => (
        <article className="panel issue" key={issue.id}>
          <Pill>{issue.source}</Pill>
          <h3>{issue.title}</h3>
          <p>{issue.detail}</p>
        </article>
      ))}
    </>
  );
}
export function Sources() {
  const [selected, setSelected] = useState(sources[0].id),
    [page, setPage] = useState(1);
  const doc = sources.find((s) => s.id === selected);
  return (
    <>
      <SectionHeader
        eyebrow="BIBLIOTHÈQUE PERSONNELLE"
        title="Retour aux sources."
        description="Les documents du professeur restent disponibles dans leur mise en page d’origine, avec leurs figures et tableaux."
      />
      <div className="source-picker">
        <label>
          Document{" "}
          <select
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setPage(1);
            }}
          >
            {sources.map((d) => (
              <option value={d.id} key={d.id}>
                Ch. {d.chapter} ·{" "}
                {d.kind === "course" ? "Cours" : "Exercices type bac"} (
                {d.pages.length} pages)
              </option>
            ))}
          </select>
        </label>
        <label>
          Page{" "}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            {doc.pages.map((p, i) => (
              <option value={i + 1} key={i}>
                Page {i + 1}
              </option>
            ))}
          </select>
        </label>
        <a
          className="button secondary"
          href={`${doc.url}#page=${page}`}
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir le PDF original
        </a>
      </div>
      <iframe
        key={`${doc.id}-${page}`}
        src={`${doc.url}#page=${page}`}
        className="pdf-frame"
        title={doc.name}
      />
      <details className="panel">
        <summary>
          Texte extrait de cette page (les figures sont dans le PDF)
        </summary>
        <pre className="source-text">{doc.pages[page - 1]}</pre>
        <p className="caption">
          L’extraction peut altérer les symboles et les fractions : toujours
          vérifier les formules dans le document original.
        </p>
      </details>
    </>
  );
}
