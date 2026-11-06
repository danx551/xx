import { writeFile } from "node:fs/promises";
import { chapters, topics, formulas, issues } from "../src/data/curriculum.js";
import { exercises, questionBank } from "../src/data/practice.js";
import { bacExercises } from "../src/data/bac.js";
import { quizzes } from "../src/data/quizzes.js";
import sources from "../src/data/sources.json" with { type: "json" };
const escape = (s) => String(s).replaceAll("|", "/").replaceAll("\n", " ");
const table = (head, rows) =>
  `| ${head.join(" | ")} |\n| ${head.map(() => "---").join(" | ")} |\n${rows.map((r) => `| ${r.map(escape).join(" | ")} |`).join("\n")}\n`;
let md =
  "# Couverture pédagogique\n\nÉtat : première version fonctionnelle. Les contenus sont rédigés et reliés aux sources ; les tests techniques et les calculs de référence ne constituent pas une certification scientifique exhaustive. Les lectures graphiques sont approchées.\n\n";
md +=
  "## Documents\n\n" +
  table(
    ["Document", "Pages", "État"],
    sources.map((s) => [
      s.name,
      s.pages.length,
      "Texte extrait ; pages examinées visuellement ; original conservé",
    ]),
  );
for (const c of chapters) {
  md += `\n## Chapitre ${c.id} — ${c.title}\n\n`;
  md += table(
    ["Notion / famille", "Pages du cours", "Contenus", "État"],
    topics
      .filter((t) => t.chapter === c.id)
      .map((t) => [
        t.title,
        t.pages,
        `Cours : #/courses/${t.id} ; méthode : #/methods/${t.id} ; ${exercises.filter((e) => e.topic === t.id).length} exercices ; ${quizzes.filter((q) => q.topic === t.id).length} QCM ; ${questionBank.filter((q) => q.topic === t.id).length} questions`,
        "3 niveaux rédigés ; variantes originales ; relecture indépendante recommandée",
      ]),
  );
  md +=
    "\n### Formules\n\n" +
    table(
      ["Relation", "Notion source", "État"],
      formulas
        .filter((f) => f.chapter === c.id)
        .map((f) => [
          f.title,
          topics.find((t) => t.id === f.topic).title,
          "LaTeX testé ; symboles, conditions, isolements et exemple rédigés",
        ]),
    );
  md +=
    "\n### Exercices du professeur, question par question\n\n" +
    table(
      ["Exercice", "Question", "Source PDF", "Notion / méthode", "État"],
      bacExercises
        .filter((e) => e.chapter === c.id)
        .flatMap((e) =>
          e.questions.map((q) => [
            `${e.number}. ${e.title}`,
            q.number,
            `Livret p. ${e.start}${e.start !== e.end ? `–${e.end}` : ""}`,
            `${topics.find((t) => t.id === q.topic).title} ; #/methods/${q.topic}`,
            "Correction originale rédigée ; 4 indices ; pas de corrigé officiel joint",
          ]),
        ),
    );
}
md +=
  "\n## Réserves, ajouts et éléments non fournis\n\n" +
  issues.map((i) => `### ${i.title}\n\n${i.source}. ${i.detail}\n`).join("\n");
await writeFile("COUVERTURE.md", md);
await writeFile(
  "analysis/coverage.json",
  JSON.stringify(
    {
      sources: sources.map(({ pages, ...s }) => ({
        ...s,
        pageCount: pages.length,
      })),
      topics: topics.map((t) => ({
        id: t.id,
        title: t.title,
        chapter: t.chapter,
        sourcePages: t.pages,
        exerciseIds: exercises.filter((e) => e.topic === t.id).map((e) => e.id),
        formulaIds: formulas.filter((f) => f.topic === t.id).map((f) => f.id),
      })),
      bac: bacExercises.map((e) => ({
        id: e.id,
        chapter: e.chapter,
        source: e.source,
        pages: [e.start, e.end],
        questions: e.questions.map((q) => ({
          number: q.number,
          topic: q.topic,
          status: "original-solution-written-not-official",
        })),
      })),
      issues,
    },
    null,
    2,
  ),
);
console.log("COUVERTURE.md et analysis/coverage.json générés.");
