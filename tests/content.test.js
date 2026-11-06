import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { topics, formulas, chapters } from "../src/data/curriculum.js";
import {
  exercises,
  questionBank,
  parseAnswer,
  isCorrect,
} from "../src/data/practice.js";
import { quizzes, gradeQuiz } from "../src/data/quizzes.js";
import { exams } from "../src/data/exams.js";
import { bacExercises } from "../src/data/bac.js";
import sources from "../src/data/sources.json" with { type: "json" };
import {
  emptyProgress,
  validateProgress,
  readProgress,
  topicStats,
} from "../src/state.js";
function near(actual, expected, tolerance = 1e-5) {
  assert.ok(
    Math.abs(actual - expected) <=
      Math.max(1e-14, Math.abs(expected) * tolerance),
    `${actual} ≠ ${expected}`,
  );
}
test("La couverture référence les 73 pages et les 30 exercices sources", () => {
  assert.equal(
    sources.reduce((n, s) => n + s.pages.length, 0),
    73,
  );
  assert.equal(bacExercises.length, 30);
  for (const chapter of chapters) {
    assert.equal(
      bacExercises.filter((e) => e.chapter === chapter.id).length,
      6,
    );
  }
  for (const e of bacExercises) {
    const doc = sources.find((s) => s.id === e.source);
    assert.ok(e.start > 0 && e.end <= doc.pages.length);
    const raw = doc.pages.slice(e.start - 1, e.end).join("\n");
    const count = new Set(
      [...raw.matchAll(/\bQ(\d+)\./g)].map((m) => Number(m[1])),
    ).size;
    assert.equal(e.questions.length, count, e.id);
    for (const q of e.questions) {
      assert.ok(q.answer.trim().length > 0, e.id);
      assert.ok(!q.text.includes("voir l’énoncé original"), e.id);
    }
  }
});
test("Chaque famille a trois applications et un transfert ; les liens existent", () => {
  assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
  for (const t of topics) {
    assert.deepEqual(
      exercises.filter((e) => e.topic === t.id).map((e) => e.level),
      [1, 2, 3, 4],
    );
    assert.ok(quizzes.some((q) => q.topic === t.id));
    assert.ok(bacExercises.some((e) => e.topicIds.includes(t.id)));
  }
  for (const f of formulas) {
    assert.ok(topics.some((t) => t.id === f.topic));
    katex.renderToString(f.latex, { throwOnError: true, trust: false });
  }
  for (const q of questionBank) assert.ok(topics.some((t) => t.id === q.topic));
});
test("Calculs indépendants de référence pour les exercices numériques", () => {
  const expected = {
    "concentration-1": 0.117,
    "beer-1": 6,
    "conductivity-1": 12.64,
    "gas-1": 4.086,
    "titration-1": 0.06,
    "ph-1": 0.001,
    "carbonate-1": 24.47,
    "wave-1": 0.77272727,
    "sound-1": 1e-6,
    "attenuation-1": 6.0205999,
    "doppler-1": 1030.30303,
    "redshift-1": 656.5187667,
    "diffraction-1": 1.995,
    "diffgraph-1": 160,
    "circular-1": 13.42,
    "young-1": 3.192,
    "thinfilm-1": 69.117647,
    "acousticdiff-1": 51.2198,
    "lens-1": 60,
    "afocal-1": 52,
    "magnification-1": 36,
    "resolution-1": 250,
    "uncertainty-1": 2 / 3,
  };
  for (const [id, value] of Object.entries(expected)) {
    const e = exercises.find((e) => e.id === id);
    near(e.value, value, 0.001);
  }
  near(exercises.find((e) => e.id === "titration-4").value, 0.45);
  near(exercises.find((e) => e.id === "ph-4").value, 1e-5);
  for (const e of exercises.filter((e) => Number.isFinite(e.value))) {
    assert.ok(e.unit);
    assert.ok(isCorrect(String(e.value), e.value));
    assert.ok(!isCorrect(String(e.value * 2), e.value), e.id);
  }
});
test("Relations physiques de référence et limites numériques", () => {
  const wavelength = (2.5e-3 * 0.5e-3) / 2;
  near(wavelength * 1e9, 625);
  const a = (2.44 * 0.35 * 635e-9) / 0.045;
  near(a * 1e6, 12.0508889);
  const u = a * Math.hypot(1 / 350, 1 / 635, 1 / 45);
  near(u * 1e6, 0.270689, 0.002);
  const G = 34 / 0.07,
    theta = 0.094 / G,
    utheta = theta * Math.hypot(0.002 / 0.094, 40 / G);
  near(theta, 1.9352941176e-4);
  assert.ok(Math.abs(theta - 2.2e-4) / utheta < 2);
  near(((345 * (2200 - 1500)) / (2200 + 1500)) * 3.6, 234.97297297);
  const amp = 2 * Math.abs(Math.cos(Math.PI / 2));
  assert.ok(amp < 1e-12);
  assert.ok(Math.abs(Math.asin(343 / 440) - 343 / 440) > 0.1);
});
test("Le correcteur accepte les écritures françaises et rejette le vide", () => {
  near(parseAnswer("2,5e-4"), 0.00025);
  near(parseAnswer("2,5 × 10^-4"), 0.00025);
  near(parseAnswer("2,5*10**-4"), 0.00025);
  assert.ok(!isCorrect("", 0));
  assert.ok(!isCorrect("n’importe quoi", 10));
  assert.ok(!isCorrect("Infinity", 10));
  assert.ok(isCorrect("101", 100));
  assert.ok(!isCorrect("104", 100));
});
test("Les QCM exigent l’ensemble exact, sans donner de point pour une sélection partielle", () => {
  for (const q of quizzes) {
    const selected = q.choices.flatMap((c, i) => (c.correct ? [i] : []));
    assert.ok(selected.length > 0);
    assert.ok(q.choices.some((c) => !c.correct));
    assert.ok(gradeQuiz(selected, q.choices));
    assert.ok(!gradeQuiz([], q.choices));
    const wrong = q.choices.findIndex((c) => !c.correct);
    assert.ok(!gradeQuiz([...selected, wrong], q.choices));
    if (selected.length > 1)
      assert.ok(!gradeQuiz(selected.slice(1), q.choices));
    for (const c of q.choices) assert.ok(c.explanation.trim().length > 0);
  }
});
test("Quatre sujets distincts sur 20 et des corrigés pour toutes les questions", () => {
  assert.equal(exams.length, 4);
  const ids = [];
  for (const exam of exams) {
    assert.equal(
      exam.problems.reduce((n, p) => n + p.points, 0),
      20,
    );
    for (const p of exam.problems) {
      ids.push(p.id);
      assert.equal(p.questions.length, p.answers.length);
      assert.ok(p.statement.trim().length > 0);
      for (const t of p.topics) assert.ok(topics.some((x) => x.id === t));
    }
  }
  assert.equal(new Set(ids).size, ids.length);
});
test("La sauvegarde résiste aux données corrompues et ne confond pas lecture et maîtrise", () => {
  assert.deepEqual(validateProgress(emptyProgress()), emptyProgress());
  assert.throws(() => validateProgress({ version: 3 }));
  assert.throws(() =>
    validateProgress({ ...emptyProgress(), notes: { a: 22 } }),
  );
  assert.throws(() =>
    validateProgress({
      ...emptyProgress(),
      quizResults: { q: { correct: true, selected: "bad" } },
    }),
  );
  assert.ok(readProgress({ getItem: () => "{bad" }).error);
  assert.ok(
    readProgress({
      getItem: () => {
        throw Error("denied");
      },
    }).error,
  );
  const p = emptyProgress();
  p.studied.push("diffraction");
  assert.equal(
    topicStats(
      topics.find((t) => t.id === "diffraction"),
      p,
      quizzes,
    ).mastered,
    false,
  );
  p.answers["diffraction-1"] = { checked: true, correct: true };
  p.answers["diffraction-2"] = { checked: true, correct: true };
  p.quizResults["qcm-diffraction"] = { correct: true, selected: [0] };
  assert.equal(
    topicStats(
      topics.find((t) => t.id === "diffraction"),
      p,
      quizzes,
    ).mastered,
    true,
  );
});
