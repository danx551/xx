import { test, expect, chromium } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { mkdtemp, rm, readFile, readdir, copyFile } from "node:fs/promises";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { emptyProgress, STORAGE_KEY } from "../../src/state.js";
import { topics, formulas } from "../../src/data/curriculum.js";
import { exercises, questionBank } from "../../src/data/practice.js";
import { quizzes } from "../../src/data/quizzes.js";
import { exams } from "../../src/data/exams.js";
import { bacExercises } from "../../src/data/bac.js";
import { createHash } from "node:crypto";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const url = pathToFileURL(path.join(root, "ORBITE_HTML/index.html")).href;
async function open(page, route = "dashboard") {
  await page.goto(`${url}#/${route}`);
  await page.locator("main h1").first().waitFor();
  expect(page.url()).toMatch(/^file:\/\//);
}
test.beforeEach(async ({ context }) => {
  await context.setOffline(true);
});
test("Le fichier démarre hors réseau sans modules, erreurs CORS ni ressources HTTP", async ({
  page,
}) => {
  const errors = [],
    failed = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("requestfailed", (r) =>
    failed.push(r.url() + ":" + r.failure()?.errorText),
  );
  page.on("request", (r) => {
    if (/^https?:/.test(r.url())) external.push(r.url());
  });
  await open(page);
  await expect(page.locator(".chapter-card")).toHaveCount(5);
  await open(page, "formulas");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check("16px KaTeX_Main")),
  ).toBe(true);
  await expect(page.locator(".katex-error")).toHaveCount(0);
  expect(await page.locator("script[type=module]").count()).toBe(0);
  expect(await page.locator("script[src]").first().getAttribute("src")).toBe(
    "./ressources/orbite.js",
  );
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
test("Les quantités de tous les contenus sont conservées dans le fichier local", async ({
  page,
}) => {
  for (const [route, selector, count] of [
    ["courses", ".topic-card", 26],
    ["methods", ".topic-card", 26],
    ["formulas", ".formula-card", 39],
    ["practice", ".topic-card", 104],
    ["quiz", ".quiz-card", 52],
    ["exams", ".exam-card", 4],
    ["anticipate", ".question", 156],
    ["bac", ".topic-card", 30],
  ]) {
    await open(page, route);
    await expect(page.locator(selector)).toHaveCount(count);
  }
  const manifest = JSON.parse(
    await readFile(path.join(root, "ORBITE_HTML/CONTENU.json"), "utf8"),
  );
  const sha = (x) =>
    createHash("sha256").update(JSON.stringify(x)).digest("hex");
  expect(manifest.empreintesContenus).toEqual({
    cours: sha(topics),
    formules: sha(formulas),
    entrainements: sha(exercises),
    qcm: sha(quizzes),
    ds: sha(exams),
    questions: sha(questionBank),
    typeBac: sha(bacExercises),
  });
});
test("Les cours, méthodes, schémas et favoris naviguent via file://", async ({
  page,
}) => {
  await open(page, "courses/afocal");
  await page.getByRole("button", { name: "03 · Maîtriser pour le DS" }).click();
  await expect(page.getByText(/tous les rayons issus de B₁/i)).toBeVisible();
  await page.locator("input[type=range]").fill("60");
  await expect(page.locator(".simulation")).toContainText("G = 5.0");
  await page.getByRole("button", { name: "Ajouter aux favoris" }).click();
  await page
    .getByRole("button", { name: "J’ai étudié les trois niveaux" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Retirer des favoris" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Notion étudiée · retirer ce repère" }),
  ).toBeVisible();
  await open(page, "favorites");
  await expect(
    page.getByRole("heading", {
      name: "Lunette afocale et construction des rayons",
    }),
  ).toBeVisible();
  await open(page, "methods/diffraction");
  await expect(page.locator(".method-section")).toHaveCount(8);
  await expect(page.locator(".exercise-link")).toHaveCount(4);
});
test("Un entraînement est corrigé, ses indices et sa réponse survivent au rechargement", async ({
  page,
}) => {
  await open(page, "practice/diffraction-1");
  const input = page.getByLabel("Ta réponse numérique", { exact: false });
  await input.fill("50");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("À reprendre");
  await page
    .getByRole("button", { name: "Je ne sais pas comment commencer" })
    .click();
  await input.fill("1,995");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
  await page.reload();
  await expect(input).toHaveValue("1,995");
  await expect(
    page.getByRole("button", { name: "Indice suivant (2/4)" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
});
test("Le QCM multiple fonctionne et sauvegarde le résultat en mode fichier", async ({
  page,
}) => {
  await open(page, "quiz/qcm-titration");
  const card = page.locator(".quiz-card");
  await card.locator("input").nth(0).check();
  await card
    .getByRole("button", { name: "Valider toutes mes réponses" })
    .click();
  await expect(card.getByRole("status")).toContainText("Exactement");
  await expect(card.getByRole("status")).toContainText("B · Faux");
  await page.reload();
  await expect(page.locator(".quiz-card").getByRole("status")).toContainText(
    "Exactement",
  );
});
test("La recherche ouvre une notion sans perdre le chemin du fichier", async ({
  page,
}) => {
  await open(page);
  await page
    .getByRole("textbox", { name: "Rechercher dans toutes les notions" })
    .fill("interfrange");
  await page
    .locator(".search-results")
    .getByRole("button")
    .filter({ hasText: "Fentes d’Young et interfrange" })
    .first()
    .click();
  expect(page.url()).toBe(`${url}#/courses/young`);
  await expect(
    page.getByRole("heading", { name: "Fentes d’Young et interfrange" }),
  ).toBeVisible();
  await open(page, "practice");
  await page
    .getByRole("button", { name: "4. Diffraction & interférences" })
    .click();
  await expect(page.locator(".topic-card")).toHaveCount(28);
});
test("Les 73 pages et les dix PDF sont locaux et complets", async ({
  page,
}) => {
  const files = await readdir(path.join(root, "ORBITE_HTML/pages"));
  expect(files.filter((f) => f.endsWith(".jpg")).length).toBe(73);
  const pdfs = await readdir(path.join(root, "ORBITE_HTML/documents"));
  expect(pdfs.length).toBe(10);
  await open(page, "sources");
  const selects = page.locator(".source-picker select");
  await selects.nth(0).selectOption("4-bac");
  await selects.nth(1).selectOption("5");
  const img = page.locator(".offline-pages img");
  await expect(img).toBeVisible();
  expect(await img.evaluate((i) => i.complete && i.naturalWidth > 1000)).toBe(
    true,
  );
  const href = await page
    .getByRole("link", { name: "Ouvrir le PDF original" })
    .getAttribute("href");
  expect(href).toBe("./documents/4-bac.pdf#page=5");
  expect(
    (await readFile(path.join(root, "ORBITE_HTML/documents/4-bac.pdf")))
      .subarray(0, 4)
      .toString(),
  ).toBe("%PDF");
  await open(page, "bac/bac-4-1");
  await page
    .getByRole("button", { name: "Afficher l’énoncé original dans la page" })
    .click();
  await expect(page.locator(".offline-pages img")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Comparer aux corrections détaillées" })
    .click();
  await expect(page.locator(".bac-question")).toHaveCount(7);
  await expect(page.locator(".bac-question").last()).toContainText("0,0095 mm");
});
test("Export, import de l’ancien format et thème fonctionnent sans serveur", async ({
  page,
}) => {
  await open(page, "settings");
  const old = emptyProgress();
  old.studied = ["young"];
  old.favorites = ["formula:young"];
  old.theme = "light";
  const input = page.locator("input[type=file]");
  await input.setInputFiles({
    name: "ancienne-progression.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(old)),
  });
  await expect(page.getByRole("status")).toContainText("Sauvegarde importée");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter ma progression" }).click();
  const download = await promise;
  const raw = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(raw.studied).toEqual(["young"]);
  expect(raw.favorites).toEqual(["formula:young"]);
  await open(page);
  await expect(page.locator(".stat").first()).toContainText("1/26");
});
test("Le chronomètre du QCM continue et expire dans file://", async ({
  page,
}) => {
  await page.clock.install();
  await open(page, "quiz");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Lancer le QCM" }).click();
  await expect(page.locator(".quiz-card")).toHaveCount(10);
  await page.reload();
  await page.clock.fastForward(61000);
  await expect(
    page.getByRole("heading", { name: "0/10 questions justes" }),
  ).toBeVisible();
  await expect(page.locator(".quiz-card input").first()).toBeDisabled();
});
test("Le DS garde sa copie et dévoile la correction seulement après expiration", async ({
  page,
}) => {
  await page.clock.install();
  await open(page, "exams/ds-1");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Commencer l’épreuve" }).click();
  await expect(page.locator(".exam-correction")).toHaveCount(0);
  await page.locator("textarea").first().fill("a = 80 µm");
  await page.reload();
  await expect(page.locator("textarea").first()).toHaveValue("a = 80 µm");
  await page.clock.fastForward(61000);
  await expect(page.locator(".exam-correction")).toHaveCount(5);
  await expect(page.locator("textarea").first()).toBeDisabled();
});
test("La fiche peut être imprimée et les formules restent disponibles hors ligne", async ({
  page,
}) => {
  await open(page, "express");
  await expect(page.locator(".formula-card")).toHaveCount(39);
  await page.evaluate(() => (window.print = () => (window.__print = true)));
  await page.getByRole("button", { name: "Imprimer / PDF" }).click();
  expect(await page.evaluate(() => window.__print)).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".sidebar")).not.toBeVisible();
  const pdf = await page.pdf({ format: "A4" });
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(pdf.length).toBeGreaterThan(50000);
});
test("Si Chrome refuse le stockage, le site reste utilisable et peut exporter", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Stockage bloqué", "SecurityError");
      },
    }),
  );
  await open(page);
  await expect(page.getByRole("alert")).toContainText(
    "enregistrer la progression",
  );
  await open(page, "practice/diffraction-1");
  await page.getByLabel("Ta réponse numérique", { exact: false }).fill("1,995");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
  await open(page, "settings");
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter ma progression" }).click();
  const download = await promise;
  const state = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(state.answers["diffraction-1"].correct).toBe(true);
});
test("Un ZIP extrait dans un chemin avec espaces et accents fonctionne directement", async ({
  page,
}) => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "Orbite Édition Windows "));
  try {
    execFileSync("python", [
      "-c",
      `import shutil,sys\nfrom pathlib import Path\np=Path(sys.argv[1]);root=Path(sys.argv[2])\narchive=shutil.make_archive(str(p/'Orbite'),'zip',root_dir=str(root),base_dir='ORBITE_HTML')\nshutil.unpack_archive(archive,str(p/'Mon espace de révision'))`,
      temp,
      root,
    ]);
    const extracted = path.join(
      temp,
      "Mon espace de révision/ORBITE_HTML/index.html",
    );
    await page.goto(pathToFileURL(extracted).href + "#/quiz/qcm-diffraction");
    await page
      .getByRole("heading", { name: "Tester sa compréhension." })
      .waitFor();
    const card = page.locator(".quiz-card");
    await card.locator("input").first().check();
    await card
      .getByRole("button", { name: "Valider toutes mes réponses" })
      .click();
    await expect(card.getByRole("status")).toContainText("Exactement");
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
test("La progression survit à la fermeture complète et à la réouverture de Chrome", async () => {
  const profile = await mkdtemp(path.join(os.tmpdir(), "orbite-chrome-"));
  const options = {
    headless: true,
    executablePath: process.env.ORBITE_CHROME_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  };
  let context;
  try {
    context = await chromium.launchPersistentContext(profile, options);
    await context.setOffline(true);
    const page = await context.newPage();
    await open(page, "practice/young-1");
    await page
      .getByLabel("Ta réponse numérique", { exact: false })
      .fill("3,192");
    await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Le résultat est juste",
    );
    await context.close();
    context = await chromium.launchPersistentContext(profile, options);
    await context.setOffline(true);
    const restored = await context.newPage();
    await open(restored, "practice/young-1");
    await expect(
      restored.getByLabel("Ta réponse numérique", { exact: false }),
    ).toHaveValue("3,192");
    await expect(restored.getByRole("status")).toContainText(
      "Le résultat est juste",
    );
  } finally {
    if (context) await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
