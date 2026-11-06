export const STORAGE_KEY = "orbite-progress-v1";
export const emptyProgress = () => ({
  version: 1,
  studied: [],
  favorites: [],
  answers: {},
  quizResults: {},
  quizDrafts: {},
  notes: {},
  exams: {},
  theme: "dark",
  quizSession: null,
});
const record = (v) => v && typeof v === "object" && !Array.isArray(v);
export function validateProgress(v) {
  if (
    !record(v) ||
    v.version !== 1 ||
    !Array.isArray(v.studied) ||
    !Array.isArray(v.favorites)
  )
    throw new Error("Format de sauvegarde incompatible.");
  for (const key of ["answers", "quizResults", "quizDrafts", "notes", "exams"])
    if (!record(v[key])) throw new Error(`Champ ${key} invalide.`);
  if (
    !v.studied.every((x) => typeof x === "string") ||
    !v.favorites.every((x) => typeof x === "string")
  )
    throw new Error("Identifiants invalides.");
  const stringMap = (map) =>
    Object.values(map).every((x) => typeof x === "string");
  const finite = (x) => typeof x === "number" && Number.isFinite(x);
  const result = (r) =>
    record(r) &&
    Array.isArray(r.selected) &&
    r.selected.every((x) => Number.isInteger(x) && x >= 0 && x < 20) &&
    typeof r.correct === "boolean";
  if (!stringMap(v.notes)) throw new Error("Notes invalides.");
  for (const a of Object.values(v.answers))
    if (
      !record(a) ||
      (a.raw !== undefined && typeof a.raw !== "string") ||
      (a.checked !== undefined && typeof a.checked !== "boolean") ||
      (a.correct !== undefined &&
        a.correct !== null &&
        typeof a.correct !== "boolean")
    )
      throw new Error("Réponse invalide.");
  if (!Object.values(v.quizResults).every(result))
    throw new Error("Résultats QCM invalides.");
  if (
    !Object.values(v.quizDrafts).every(
      (a) =>
        Array.isArray(a) &&
        a.every((x) => Number.isInteger(x) && x >= 0 && x < 20),
    )
  )
    throw new Error("Brouillons QCM invalides.");
  for (const e of Object.values(v.exams))
    if (
      !record(e) ||
      !finite(e.started) ||
      !finite(e.deadline) ||
      !finite(e.duration) ||
      typeof e.finished !== "boolean" ||
      !record(e.answers) ||
      !stringMap(e.answers) ||
      !record(e.scores) ||
      !Object.values(e.scores).every((x) => finite(x) && x >= 0 && x <= 20)
    )
      throw new Error("Épreuve invalide.");
  if (v.quizSession !== null && v.quizSession !== undefined) {
    const q = v.quizSession;
    if (
      !record(q) ||
      !finite(q.started) ||
      !finite(q.deadline) ||
      !Array.isArray(q.ids) ||
      !q.ids.every((x) => typeof x === "string") ||
      typeof q.finished !== "boolean" ||
      !record(q.results) ||
      !Object.values(q.results).every(result) ||
      !record(q.drafts) ||
      !Object.values(q.drafts).every(
        (a) =>
          Array.isArray(a) &&
          a.every((x) => Number.isInteger(x) && x >= 0 && x < 20),
      )
    )
      throw new Error("Session QCM invalide.");
  }
  return {
    ...emptyProgress(),
    ...v,
    theme: v.theme === "light" ? "light" : "dark",
  };
}
export function readProgress(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return {
      data: raw ? validateProgress(JSON.parse(raw)) : emptyProgress(),
      error: null,
    };
  } catch {
    return {
      data: emptyProgress(),
      error:
        "La sauvegarde locale est indisponible ou illisible. Exportez votre progression pour la conserver.",
    };
  }
}
export function topicStats(topic, progress, quizzes) {
  const results = Object.entries(progress.answers).filter(
    ([id, a]) => id.startsWith(topic.id + "-") && a?.checked,
  );
  const quiz = quizzes
    .filter((q) => q.topic === topic.id)
    .map((q) => progress.quizResults[q.id])
    .filter(Boolean);
  const correct = results.filter(([, r]) => r.correct === true).length;
  const selfUnderstood = results.filter(
    ([, r]) => r.correct === null && r.selfAssessed === "understood",
  ).length;
  const failed =
    results.some(([, r]) => r.correct === false) ||
    quiz.some((r) => !r.correct);
  return {
    studied: progress.studied.includes(topic.id),
    done: results.length,
    correct,
    quizCorrect: quiz.filter((r) => r.correct).length,
    mastered: correct + selfUnderstood >= 2 && quiz.some((r) => r.correct),
    review: failed,
  };
}
