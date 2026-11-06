import { test, expect } from "@playwright/test";
import { emptyProgress, STORAGE_KEY } from "../../src/state.js";
const open = async (page, route = "dashboard") => {
  await page.goto(`/#/${route}`);
  await page.locator("main h1").first().waitFor();
};
test("Les pages et tous les types de détail se rendent sans erreur JavaScript", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "dashboard",
    "courses",
    "courses/diffraction",
    "methods/afocal",
    "formulas",
    "express",
    "practice",
    "practice/young-4",
    "anticipate",
    "bac",
    "bac/bac-4-3",
    "quiz",
    "exams",
    "help",
    "sources",
    "coverage",
    "settings",
    "favorites",
  ]) {
    await open(page, route);
    await expect(page.locator("main")).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
});
test("Étude, favori et thème persistent après rechargement", async ({
  page,
}) => {
  await open(page, "courses/diffraction");
  await page.getByRole("button", { name: "03 · Maîtriser pour le DS" }).click();
  await expect(
    page.getByText("Deux rayons de bord seuls", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "J’ai étudié les trois niveaux" })
    .click();
  await page.getByRole("button", { name: "Ajouter aux favoris" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Notion étudiée · retirer ce repère" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retirer des favoris" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Activer le mode clair" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await open(page, "favorites");
  await expect(
    page.getByRole("heading", { name: "Diffraction par une fente ou un fil" }),
  ).toBeVisible();
});
test("Les calculs faux puis justes et les indices sont enregistrés", async ({
  page,
}) => {
  await open(page, "practice/diffraction-1");
  await page.getByLabel("Ta réponse numérique", { exact: false }).fill("500");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("À reprendre");
  await page
    .getByRole("button", { name: "Je ne sais pas comment commencer" })
    .click();
  await expect(
    page.getByText("Notion à reconnaître", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Ta réponse numérique", { exact: false }).fill("1,995");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
  await page.reload();
  await expect(
    page.getByLabel("Ta réponse numérique", { exact: false }),
  ).toHaveValue("1,995");
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
});
test("Un raisonnement écrit reste une auto-évaluation distincte", async ({
  page,
}) => {
  await open(page, "practice/proton-1");
  await page
    .getByLabel("Ton raisonnement", { exact: false })
    .fill("CH3COOH cède H+ à l’eau.");
  await page
    .getByRole("button", { name: "Comparer au corrigé", exact: true })
    .click();
  await expect(
    page.getByText("elle n’est pas corrigée automatiquement", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "J’ai compris le raisonnement" })
    .click();
  await expect(page.getByRole("status")).toContainText("compris");
  const state = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    STORAGE_KEY,
  );
  expect(state.answers["proton-1"].correct).toBeNull();
});
test("Le QCM à réponses multiples explique aussi les propositions fausses", async ({
  page,
}) => {
  await open(page, "quiz/qcm-diffraction");
  const card = page.locator(".quiz-card").first();
  await card.locator("input[type=checkbox]").nth(0).check();
  await card
    .getByRole("button", { name: "Valider toutes mes réponses" })
    .click();
  await expect(card.getByRole("status")).toContainText("Exactement");
  await expect(card.getByRole("status")).toContainText("B · Faux");
  await page.reload();
  await expect(
    page.locator(".quiz-card").first().getByRole("status"),
  ).toContainText("Exactement");
});
test("Le chronomètre QCM expire et verrouille les réponses", async ({
  page,
}) => {
  await page.clock.install();
  await open(page, "quiz");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Lancer le QCM" }).click();
  await expect(page.locator(".quiz-card")).toHaveCount(10);
  await page.clock.fastForward(61000);
  await expect(
    page.getByRole("heading", { name: "0/10 questions justes" }),
  ).toBeVisible();
  await expect(
    page.locator(".quiz-card").first().locator("input").first(),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "0/10 questions justes" }),
  ).toBeVisible();
});
test("Un DS conserve le brouillon, masque le corrigé et expire après rechargement", async ({
  page,
}) => {
  await page.clock.install();
  await open(page, "exams/ds-1");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Commencer l’épreuve" }).click();
  await expect(page.locator(".exam-correction")).toHaveCount(0);
  await page.locator("textarea").first().fill("L = 2λD/a, donc a = 80 µm.");
  await page.reload();
  await expect(page.locator("textarea").first()).toHaveValue(
    "L = 2λD/a, donc a = 80 µm.",
  );
  await expect(page.locator(".exam-correction")).toHaveCount(0);
  await page.clock.fastForward(61000);
  await expect(page.locator(".exam-correction")).toHaveCount(5);
  await expect(page.locator("textarea").first()).toBeDisabled();
  for (const score of await page
    .locator(".exam-correction .duration-input")
    .all())
    await score.fill("4");
  await expect(page.getByRole("heading", { name: "20.0 / 20" })).toBeVisible();
});
test("Le filtre, la recherche et les favoris mènent au bon contenu", async ({
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
  await expect(page).toHaveURL(/courses\/young/);
  await open(page, "practice");
  await page
    .getByRole("button", { name: "4. Diffraction & interférences" })
    .click();
  await expect(page.locator(".topic-card")).toHaveCount(28);
});
test("Les quatre indices type bac, le PDF et le corrigé sont accessibles", async ({
  page,
}) => {
  await open(page, "bac/bac-4-3");
  const hints = page.locator(".hint-box").first();
  await hints
    .getByRole("button", { name: "Je ne sais pas comment commencer" })
    .click();
  for (let i = 0; i < 3; i++)
    await hints.getByRole("button", { name: /Indice suivant/ }).click();
  await expect(
    page.getByRole("button", { name: "Tous les indices sont affichés" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Afficher l’énoncé original dans la page" })
    .click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    "/documents/4-bac.pdf#page=5",
  );
  await page
    .getByRole("button", { name: "Comparer aux corrections détaillées" })
    .click();
  await expect(page.locator(".bac-question")).toHaveCount(8);
  await expect(
    page.getByText("les rouges 632, 650 et 694 nm", { exact: false }),
  ).toBeVisible();
  const response = await page.request.get("/documents/4-bac.pdf");
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
});
test("La fiche LaTeX complète ou express peut être imprimée", async ({
  page,
}) => {
  await open(page, "formulas");
  await expect(page.locator(".katex-error")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Fiche express", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Isoler les inconnues" }),
  ).toHaveCount(0);
  await page.evaluate(() => {
    window.print = () => (window.__printed = true);
  });
  await page.getByRole("button", { name: "Imprimer / PDF" }).click();
  expect(await page.evaluate(() => window.__printed)).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".sidebar")).not.toBeVisible();
});
test("Export/import et rejet d’un fichier incompatible", async ({ page }) => {
  await open(page, "settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter ma progression" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/orbite-progression/);
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("alert")).toContainText("Import impossible");
  const saved = emptyProgress();
  saved.studied = ["diffraction"];
  await page.locator("input[type=file]").setInputFiles({
    name: "ok.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(saved)),
  });
  await expect(page.getByRole("status")).toContainText("Sauvegarde importée");
  await page.reload();
  await open(page);
  await expect(page.locator(".stat").first()).toContainText("1/26");
});
test("Le mode mobile garde une navigation utilisable et sans débordement", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "dashboard",
    "courses/afocal",
    "methods/young",
    "formulas",
    "quiz/qcm-diffraction",
    "exams",
  ]) {
    await open(page, route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, route).toBe(false);
  }
  await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Les méthodes" })
    .click();
  await expect(
    page.getByRole("heading", { name: "À chaque problème, sa méthode." }),
  ).toBeVisible();
});
