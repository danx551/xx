/** Build-time tool only. The resulting ORBITE_HTML needs no runtime or server. */
import { build } from "esbuild";
import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  readdir,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import sources from "../../src/data/sources.json" with { type: "json" };
import { topics, formulas } from "../../src/data/curriculum.js";
import { exercises, questionBank } from "../../src/data/practice.js";
import { quizzes } from "../../src/data/quizzes.js";
import { exams } from "../../src/data/exams.js";
import { bacExercises } from "../../src/data/bac.js";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const out = path.join(root, "ORBITE_HTML");
const sha = (s) => createHash("sha256").update(s).digest("hex");
await mkdir(out, { recursive: true });
await mkdir(path.join(out, "documents"), { recursive: true });
await mkdir(path.join(out, "pages"), { recursive: true });
// Remove generated code only, never delete documents or user progress exports.
await rm(path.join(out, "ressources"), { recursive: true, force: true });
let images = 0;
let previousHashes = {};
try {
  previousHashes =
    JSON.parse(await readFile(path.join(out, "CONTENU.json"), "utf8"))
      .sourcePDFHashes || {};
} catch {}
const sourcePDFHashes = {};
for (const doc of sources) {
  const original = path.join(root, doc.name),
    dest = path.join(out, "documents", `${doc.id}.pdf`);
  sourcePDFHashes[doc.id] = sha(await readFile(original));
  await copyFile(original, dest);
  const first = path.join(out, "pages", `${doc.id}-01.jpg`);
  const count = doc.pages.length;
  const existing = await readdir(path.join(out, "pages"));
  if (
    previousHashes[doc.id] !== sourcePDFHashes[doc.id] ||
    !existing.includes(path.basename(first)) ||
    existing.filter((n) => n.startsWith(doc.id + "-")).length !== count
  ) {
    const tmp = path.join(out, "pages", `render-${doc.id}`);
    const run = spawnSync(
      "pdftoppm",
      ["-jpeg", "-scale-to", "1800", "-jpegopt", "quality=88", original, tmp],
      { encoding: "utf8" },
    );
    if (run.status !== 0)
      throw new Error(`PDF ${doc.id}: ${run.stderr || run.error}`);
    for (const name of await readdir(path.join(out, "pages"))) {
      if (name.startsWith(`render-${doc.id}-`)) {
        const n = Number(name.match(/-(\d+)\.jpg$/)[1]);
        await copyFile(
          path.join(out, "pages", name),
          path.join(
            out,
            "pages",
            `${doc.id}-${String(n).padStart(2, "0")}.jpg`,
          ),
        );
        await rm(path.join(out, "pages", name));
      }
    }
  }
  images += count;
}
function mustReplace(s, from, to) {
  if (!s.includes(from)) throw Error(`Source changed: missing ${from}`);
  return s.replace(from, to);
}
const addon = JSON.stringify(path.join(root, "scripts/offline/Document.jsx"));
await build({
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  outfile: path.join(out, "ressources/orbite.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["chrome100"],
  minify: true,
  charset: "utf8",
  legalComments: "eof",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".woff": "dataurl", ".woff2": "dataurl", ".ttf": "dataurl" },
  metafile: true,
  plugins: [
    {
      name: "standalone-file-adapters",
      setup(b) {
        b.onLoad({ filter: /src\/data\/sources\.json$/ }, async () => ({
          loader: "json",
          contents: JSON.stringify(
            sources.map((d) => ({ ...d, url: `./documents/${d.id}.pdf` })),
          ),
        }));
        b.onLoad(
          { filter: /src\/(main|Learning|components)\.jsx$/ },
          async (args) => {
            let s = await readFile(args.path, "utf8");
            if (args.path.endsWith("/components.jsx"))
              s = mustReplace(s, "href={`/documents/", "href={`./documents/");
            if (args.path.endsWith("/main.jsx")) {
              s = mustReplace(
                s,
                "readProgress(window.localStorage)",
                'readProgress((() => { try { return window.localStorage; } catch { return { getItem() { throw new Error("Stockage local bloqué"); } }; } })())',
              );
              s = mustReplace(
                s,
                '<div key={`${route.page}/${route.id}`} className="page-content">',
                '<div className="offline-version">Version autonome · sans installation · hors connexion<a href="./LISEZ-MOI.html" target="_blank" rel="noreferrer">Mode d’emploi et sauvegardes</a></div><div key={`${route.page}/${route.id}`} className="page-content">',
              );
              s = mustReplace(
                s,
                "Les PDF sont servis depuis le projet local.",
                "Les PDF et les images des pages sont inclus dans ce dossier local.",
              );
              s = mustReplace(
                s,
                "Ce serveur local n’a pas de contrôle d’accès.",
                "Cette version s’ouvre directement depuis le disque, sans serveur.",
              );
              s = mustReplace(
                s,
                "L’import remplace les données",
                "En mode fichier, déplacer le dossier, changer de navigateur ou effacer ses données peut dissocier ta progression. Exporter puis réimporter permet de la transférer. L’import remplace les données",
              );
            }
            if (args.path.endsWith("/Learning.jsx")) {
              s = `import {OfflineDocument} from ${addon};\n` + s;
              let replaced = 0;
              s = s.replace(/<iframe\b[\s\S]*?\/>/g, (part) => {
                replaced++;
                if (part.includes("ex.url"))
                  return "<OfflineDocument id={ex.source} start={ex.start} end={ex.end}/>";
                if (part.includes("doc.url"))
                  return "<OfflineDocument id={doc.id} start={page} end={page}/>";
                throw Error("Unknown iframe");
              });
              if (replaced !== 2)
                throw Error(`Expected 2 source viewers, got ${replaced}`);
            }
            return {
              loader: "jsx",
              contents: s,
              resolveDir: path.dirname(args.path),
            };
          },
        );
      },
    },
  ],
});
await writeFile(
  path.join(out, "index.html"),
  `<!doctype html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#10121b"><meta name="description" content="Orbite : révisions personnelles de physique-chimie, sans installation et hors connexion."><title>Orbite — Révisions hors connexion</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23b6a0ed'/%3E%3Ctext x='50' y='72' font-size='70' text-anchor='middle' fill='%23211c32'%3E◎%3C/text%3E%3C/svg%3E"><link rel="stylesheet" href="./ressources/orbite.css"><script defer src="./ressources/orbite.js"></script></head><body><div id="root"></div><noscript>Orbite a besoin de JavaScript, activé par défaut dans Google Chrome. Aucune connexion ni installation n’est nécessaire.</noscript></body></html>\n`,
);
const inventory = {
  version: "1.0-autonome",
  sourcePDFHashes,
  chapitres: 5,
  notions: topics.length,
  methodes: topics.length,
  formules: formulas.length,
  entrainements: exercises.length,
  qcm: quizzes.length,
  dsBlancs: exams.length,
  questionsTypes: questionBank.length,
  exercicesProfesseur: bacExercises.length,
  correctionsProfesseur: bacExercises.reduce(
    (s, e) => s + e.questions.length,
    0,
  ),
  pdf: sources.length,
  pages: images,
  empreintesContenus: {
    cours: sha(JSON.stringify(topics)),
    formules: sha(JSON.stringify(formulas)),
    entrainements: sha(JSON.stringify(exercises)),
    qcm: sha(JSON.stringify(quizzes)),
    ds: sha(JSON.stringify(exams)),
    questions: sha(JSON.stringify(questionBank)),
    typeBac: sha(JSON.stringify(bacExercises)),
  },
};
await writeFile(
  path.join(out, "CONTENU.json"),
  JSON.stringify(inventory, null, 2) + "\n",
);
const licenses = [];
for (const name of ["react", "react-dom", "katex", "lucide-react"])
  licenses.push(
    `=== ${name} ===\n` +
      (await readFile(
        path.join(root, "node_modules", name, "LICENSE"),
        "utf8",
      )),
  );
await writeFile(path.join(out, "LICENCES.txt"), licenses.join("\n\n"));
await copyFile(
  path.join(root, "scripts/offline/verifier.js"),
  path.join(out, "ressources/verifier.js"),
);
await copyFile(
  path.join(root, "scripts/offline/tester.html"),
  path.join(out, "TESTER_ORBITE.html"),
);
console.log(
  `ORBITE_HTML prêt : ${inventory.methodes} méthodes, ${inventory.formules} formules, ${inventory.entrainements} entraînements, ${inventory.qcm} QCM, ${inventory.dsBlancs} DS, ${images} pages locales. Aucun serveur requis.`,
);
