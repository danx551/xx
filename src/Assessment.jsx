import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Play,
  Square,
  ChevronDown,
} from "lucide-react";
import { quizzes, gradeQuiz } from "./data/quizzes.js";
import { exams } from "./data/exams.js";
import { topics } from "./data/curriculum.js";
import { ChapterFilter } from "./Learning.jsx";
import {
  SectionHeader,
  Pill,
  Timer,
  StepList,
  Favorite,
  Empty,
  ExamFigure,
} from "./components.jsx";
export function QuizCard({
  quiz,
  progress,
  update,
  locked = false,
  session = false,
}) {
  const sessionId = progress.quizSession?.started;
  const draft = session
    ? progress.quizSession?.drafts?.[quiz.id] || []
    : progress.quizDrafts[quiz.id] || [];
  const result = session
    ? progress.quizSession?.results?.[quiz.id]
    : progress.quizResults[quiz.id];
  const checked = Boolean(result),
    selected = checked ? result.selected : draft;
  function change(index) {
    const next = draft.includes(index)
      ? draft.filter((i) => i !== index)
      : [...draft, index];
    update((p) =>
      session
        ? {
            ...p,
            quizSession: {
              ...p.quizSession,
              drafts: { ...p.quizSession.drafts, [quiz.id]: next },
            },
          }
        : { ...p, quizDrafts: { ...p.quizDrafts, [quiz.id]: next } },
    );
  }
  function submit() {
    const result = {
      selected: draft,
      correct: gradeQuiz(draft, quiz.choices),
      updatedAt: Date.now(),
    };
    update((p) => ({
      ...p,
      quizResults: { ...p.quizResults, [quiz.id]: result },
      ...(session
        ? {
            quizSession: {
              ...p.quizSession,
              results: { ...p.quizSession.results, [quiz.id]: result },
            },
          }
        : {}),
    }));
  }
  return (
    <article className="panel quiz-card">
      <div className="row">
        <Pill>Ch. {quiz.chapter} · Plusieurs réponses possibles</Pill>
        <Favorite id={quiz.id} progress={progress} update={update} />
      </div>
      <h3>{quiz.question}</h3>
      <fieldset disabled={checked || locked}>
        <legend className="sr-only">
          Sélectionner toutes les réponses correctes
        </legend>
        {quiz.choices.map((c, i) => (
          <label
            key={i}
            className={`quiz-option ${checked ? (c.correct ? "right" : selected.includes(i) ? "wrong" : "") : ""}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(i)}
              onChange={() => change(i)}
            />
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            <span>{c.text}</span>
            {checked && c.correct && <Check size={16} />}
          </label>
        ))}
      </fieldset>
      {!checked && !locked && (
        <button
          className="button primary"
          disabled={!draft.length}
          onClick={submit}
        >
          Valider toutes mes réponses <Check size={15} />
        </button>
      )}
      {locked && !checked && (
        <p className="feedback incorrect">
          Question non validée pendant le temps imparti.
        </p>
      )}
      {checked && (
        <div
          className={`feedback ${result.correct ? "success" : "incorrect"}`}
          role="status"
        >
          <strong>
            {result.correct ? "Exactement." : "Il reste un point à éclaircir."}
          </strong>
          <ul>
            {quiz.choices.map((c, i) => (
              <li key={i}>
                <strong>
                  {String.fromCharCode(65 + i)} · {c.correct ? "Vrai" : "Faux"}.
                </strong>{" "}
                {c.explanation}
              </li>
            ))}
          </ul>
          {!session && (
            <button
              className="text-button"
              onClick={() =>
                update((p) => {
                  const next = { ...p.quizResults };
                  delete next[quiz.id];
                  return {
                    ...p,
                    quizResults: next,
                    quizDrafts: { ...p.quizDrafts, [quiz.id]: [] },
                  };
                })
              }
            >
              Réessayer cette question
            </button>
          )}
        </div>
      )}
    </article>
  );
}
export function Quiz({ id, progress, update, go }) {
  const [chapter, setChapter] = useState(0),
    [minutes, setMinutes] = useState(10),
    [now, setNow] = useState(Date.now());
  const s = progress.quizSession;
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (s && !s.finished && now >= s.deadline)
      update((p) => ({
        ...p,
        quizSession: { ...p.quizSession, finished: true },
      }));
  }, [now, s?.deadline, s?.finished]);
  const filtered = quizzes.filter(
    (q) => (!id || q.id === id) && (!chapter || q.chapter === chapter),
  );
  function start() {
    const ids = [...filtered]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((q) => q.id);
    update((p) => ({
      ...p,
      quizSession: {
        ids,
        started: Date.now(),
        deadline: Date.now() + minutes * 60000,
        finished: false,
        results: {},
        drafts: {},
      },
    }));
  }
  const list = s
    ? s.ids.map((id) => quizzes.find((q) => q.id === id)).filter(Boolean)
    : filtered;
  const correct = s
    ? Object.values(s.results || {}).filter((r) => r.correct).length
    : 0;
  return (
    <>
      {id && (
        <button className="back-button" onClick={() => go("quiz")}>
          <ArrowLeft size={15} /> Toute la banque de QCM
        </button>
      )}
      <SectionHeader
        eyebrow="LES PIÈGES N’ATTENDENT QUE TOI"
        title="Tester sa compréhension."
        description={`${quizzes.length} QCM à réponses multiples. Chaque proposition est expliquée ; une question est juste si toutes les bonnes réponses, et elles seules, sont cochées.`}
      />
      {!s ? (
        <>
          <ChapterFilter value={chapter} setValue={setChapter} />
          {!id && (
            <div className="panel timed-banner">
              <div>
                <Pill>MODE CHRONOMÉTRÉ</Pill>
                <h3>Dix questions, toute ton attention.</h3>
                <p>
                  Tirage parmi les questions du filtre choisi. Le temps continue
                  si tu changes de page.
                </p>
              </div>
              <div className="row">
                <label>
                  Durée{" "}
                  <input
                    className="duration-input"
                    type="number"
                    min="1"
                    max="120"
                    value={minutes}
                    onChange={(e) =>
                      setMinutes(
                        Math.max(1, Math.min(120, Number(e.target.value) || 1)),
                      )
                    }
                  />{" "}
                  min
                </label>
                <button className="button primary" onClick={start}>
                  <Play size={15} /> Lancer le QCM
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="panel timer-bar">
          <div>
            <Pill>{s.finished ? "SESSION TERMINÉE" : "QCM EN COURS"}</Pill>
            <h3>
              {s.finished
                ? `${correct}/${s.ids.length} questions justes`
                : `${Object.keys(s.results || {}).length}/${s.ids.length} réponses validées`}
            </h3>
            <p>
              Les questions non validées comptent pour zéro dans le score de
              cette session.
            </p>
          </div>
          {!s.finished ? (
            <>
              <Timer remaining={s.deadline - now} />
              <button
                className="button secondary"
                onClick={() =>
                  update((p) => ({
                    ...p,
                    quizSession: { ...p.quizSession, finished: true },
                  }))
                }
              >
                Terminer le QCM
              </button>
            </>
          ) : (
            <button
              className="button secondary"
              onClick={() => update((p) => ({ ...p, quizSession: null }))}
            >
              Revenir à la banque de QCM
            </button>
          )}
        </div>
      )}
      <div className="question-list">
        {list.map((q) => (
          <QuizCard
            key={`${q.id}-${s?.started || "practice"}`}
            quiz={q}
            progress={progress}
            update={update}
            session={Boolean(s)}
            locked={Boolean(s?.finished) || Boolean(s && now >= s.deadline)}
          />
        ))}
      </div>
      {s?.finished && (
        <div className="panel">
          <h3>Les notions à revoir</h3>
          {list
            .filter((q) => !s.results?.[q.id]?.correct)
            .map((q) => (
              <button
                key={q.id}
                className="review-link"
                onClick={() => go("methods", q.topic)}
              >
                {topics.find((t) => t.id === q.topic)?.title}
                <ArrowRight size={14} />
              </button>
            ))}
          {correct === list.length && (
            <p>
              Toutes les questions de cette session sont réussies. Essaie
              maintenant un exercice de transfert.
            </p>
          )}
        </div>
      )}
    </>
  );
}
export function Exams({ id, progress, update, go }) {
  const exam = exams.find((e) => e.id === id),
    [minutes, setMinutes] = useState(120),
    [now, setNow] = useState(Date.now());
  const state = exam ? progress.exams[exam.id] : null;
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (exam && state?.started && !state.finished && now >= state.deadline)
      update((p) => ({
        ...p,
        exams: {
          ...p.exams,
          [exam.id]: {
            ...p.exams[exam.id],
            finished: true,
            endedAt: Date.now(),
          },
        },
      }));
  }, [now, state?.deadline, state?.finished, exam?.id]);
  if (!exam)
    return (
      <>
        <SectionHeader
          eyebrow="SE METTRE DANS LES CONDITIONS"
          title="Le prochain DS commence ici."
          description="Quatre sujets originaux, distincts, avec un barème sur 20. Les brouillons, le chronomètre et l’auto-évaluation sont conservés localement."
        />
        <div className="exam-grid">
          {exams.map((e, i) => {
            const s = progress.exams[e.id];
            const scored =
              s?.finished &&
              e.problems.every((p) => Number.isFinite(s.scores?.[p.id]));
            const score = scored
              ? Object.values(s.scores).reduce((a, b) => a + b, 0)
              : null;
            return (
              <article className="panel exam-card" key={e.id}>
                <div className="row">
                  <span className="exam-number">0{i + 1}</span>
                  <Pill>
                    {s?.finished
                      ? "Terminé · auto-évaluation"
                      : s?.started
                        ? "En cours"
                        : "Sujet original"}
                  </Pill>
                </div>
                <h2>{e.title}</h2>
                <p>{e.subtitle}</p>
                <div className="exam-meta">
                  <span>
                    <Clock size={15} /> 2 h · durée modifiable
                  </span>
                  <span>20 points · {e.problems.length} exercices</span>
                </div>
                {score !== null && (
                  <p className="exam-score">
                    {score.toFixed(1)} / 20 <small>Auto-évaluation</small>
                  </p>
                )}
                <button
                  className="button secondary full"
                  onClick={() => go("exams", e.id)}
                >
                  {s?.started ? "Reprendre le sujet" : "Découvrir le sujet"}{" "}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </>
    );
  const started = Boolean(state?.started),
    finished = Boolean(state?.finished),
    expired = Boolean(started && now >= state.deadline);
  const scored =
    finished &&
    exam.problems.every((p) => Number.isFinite(state.scores?.[p.id]));
  const score = scored
    ? exam.problems.reduce((sum, p) => sum + state.scores[p.id], 0)
    : null;
  const setExam = (fn) =>
    update((p) => ({
      ...p,
      exams: { ...p.exams, [exam.id]: fn(p.exams[exam.id] || {}) },
    }));
  return (
    <>
      <button className="back-button" onClick={() => go("exams")}>
        <ArrowLeft size={15} /> Tous les DS blancs
      </button>
      <SectionHeader
        eyebrow={`DS BLANC ${exams.indexOf(exam) + 1} · /20`}
        title={exam.title}
        description={exam.subtitle}
      />
      {!started ? (
        <div className="panel start-exam">
          <h2>Préparer ton espace de travail.</h2>
          <p>
            Prévois du papier, une calculatrice et un moment sans interruption.
            Les corrections sont masquées pendant l’épreuve. Le temps continue
            si tu fermes ou recharges la page.
          </p>
          <ul>
            {exam.problems.map((p) => (
              <li key={p.id}>
                {p.title} · {p.points} points
              </li>
            ))}
          </ul>
          <label>
            Durée de l’épreuve{" "}
            <input
              className="duration-input"
              type="number"
              value={minutes}
              min="1"
              max="360"
              onChange={(e) =>
                setMinutes(
                  Math.max(1, Math.min(360, Number(e.target.value) || 1)),
                )
              }
            />{" "}
            minutes
          </label>
          <div className="actions">
            <button
              className="button primary"
              onClick={() =>
                setExam(() => ({
                  started: Date.now(),
                  deadline: Date.now() + minutes * 60000,
                  duration: minutes,
                  finished: false,
                  answers: {},
                  scores: {},
                }))
              }
            >
              <Play size={16} /> Commencer l’épreuve
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="panel timer-bar sticky-timer">
            <div>
              <Pill>{finished ? "ÉPREUVE TERMINÉE" : "ÉPREUVE EN COURS"}</Pill>
              <h3>
                {finished
                  ? "Prendre le temps de comprendre ses erreurs."
                  : "Les corrections restent masquées."}
              </h3>
            </div>
            {!finished && <Timer remaining={state.deadline - now} />}{" "}
            {!finished && (
              <button
                className="button secondary"
                onClick={() =>
                  setExam((s) => ({
                    ...s,
                    finished: true,
                    endedAt: Date.now(),
                  }))
                }
              >
                <Square size={14} /> Terminer et corriger
              </button>
            )}
          </div>
          {finished && (
            <div className="panel assessment-summary">
              <h2>
                {scored
                  ? `${score.toFixed(1)} / 20`
                  : "À toi d’évaluer ta copie."}
              </h2>
              <p>
                Les réponses rédigées ne sont pas corrigées automatiquement.
                Compare avec la rédaction proposée, puis attribue tes points
                selon le barème de chaque question. Cette note est une
                auto-évaluation.
              </p>
              <p className="caption">
                La durée choisie était de {state.duration} minutes. Le sujet
                reste lisible après la fin ; les réponses de l’épreuve sont
                alors verrouillées.
              </p>
            </div>
          )}
          {exam.problems.map((p, i) => (
            <article className="panel exam-problem" key={p.id}>
              <div className="row">
                <div className="eyebrow">
                  EXERCICE {i + 1} · CHAPITRE {p.chapter}
                </div>
                <Pill>{p.points} points</Pill>
              </div>
              <h2>{p.title}</h2>
              <p className="statement">{p.statement}</p>
              <ExamFigure topics={p.topics} />
              <ol className="exam-questions">
                {p.questions.map((q, j) => (
                  <li key={j}>
                    {q}
                    <span className="caption">
                      {" "}
                      ({(p.points / p.questions.length).toFixed(2)} pt environ)
                    </span>
                  </li>
                ))}
              </ol>
              <label className="field-label" htmlFor={p.id}>
                Ma réponse
              </label>
              <textarea
                id={p.id}
                rows={6}
                disabled={finished || expired}
                value={state.answers?.[p.id] || ""}
                placeholder="Ton raisonnement est sauvegardé automatiquement."
                onChange={(e) =>
                  setExam((s) => ({
                    ...s,
                    answers: { ...s.answers, [p.id]: e.target.value },
                  }))
                }
              />
              {finished && (
                <div className="exam-correction">
                  <div className="eyebrow">CORRECTION & BARÈME INDICATIF</div>
                  <StepList steps={p.answers} />
                  <p className="caption">
                    Chaque question vaut environ{" "}
                    {(p.points / p.questions.length).toFixed(2)} points :
                    attribuer la moitié pour une démarche justifiée et la moitié
                    pour le résultat et son interprétation. Conserver le total
                    maximal de {p.points} points pour cet exercice.
                  </p>
                  <label>
                    Points obtenus (sur {p.points}){" "}
                    <input
                      className="duration-input"
                      type="number"
                      min="0"
                      max={p.points}
                      step="0.25"
                      value={state.scores?.[p.id] ?? ""}
                      onChange={(e) =>
                        setExam((s) => {
                          const scores = { ...s.scores };
                          if (e.target.value === "") delete scores[p.id];
                          else
                            scores[p.id] = Math.max(
                              0,
                              Math.min(p.points, Number(e.target.value)),
                            );
                          return { ...s, scores };
                        })
                      }
                    />
                  </label>
                  <div className="tags">
                    {p.topics.map((t) => (
                      <button
                        className="text-button"
                        key={t}
                        onClick={() => go("methods", t)}
                      >
                        {topics.find((n) => n.id === t)?.title}{" "}
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
          {finished && (
            <div className="panel">
              <h3>Mon plan pour la suite</h3>
              {exam.problems
                .filter((p) => (state.scores?.[p.id] ?? -1) < p.points * 0.75)
                .map((p) => (
                  <div key={p.id}>
                    <p>
                      {p.title} :{" "}
                      {state.scores?.[p.id] === undefined
                        ? "à auto-évaluer"
                        : "à consolider"}
                    </p>
                    <div className="tags">
                      {p.topics.map((t) => (
                        <button
                          className="button subtle"
                          key={t}
                          onClick={() => go("methods", t)}
                        >
                          {topics.find((n) => n.id === t)?.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              <p className="caption">
                Un sujet différent t’attend dans la liste des DS. Les sujets
                terminés conservent ta copie et tes scores.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
