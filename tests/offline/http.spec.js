// Supplemental tests only. HTTP results are never represented as file:// validation.
import { test, expect } from "@playwright/test";
import { readFile, mkdtemp, rm, readdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { emptyProgress, STORAGE_KEY } from "../../src/state.js";
const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  ),
  base = "http://127.0.0.1:5181";
const go = async (page, route = "dashboard") => {
  await page.goto(`${base}/#/${route}`);
  await page.locator("main h1").waitFor();
};
test("HTTP complémentaire : le vérificateur local réalise ses 16 contrôles fonctionnels", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/TESTER_ORBITE.html");
  await page
    .getByRole("button", { name: "Lancer les vérifications locales" })
    .click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-orbite-tests",
    "passed",
    { timeout: 30000 },
  );
  await expect(page.locator("#test-results")).toContainText(
    "16 vérifications réussies · 0 échec(s)",
  );
  await expect(page.locator("#test-protocol")).toContainText(
    "ne valide pas une ouverture file://",
  );
  expect(errors).toEqual([]);
});
test("HTTP complémentaire : export/import compatible, thème et données restaurés", async ({
  page,
}) => {
  await go(page, "settings");
  const saved = emptyProgress();
  saved.studied = ["diffraction"];
  saved.theme = "light";
  await page.locator("input[type=file]").setInputFiles({
    name: "progression.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(saved)),
  });
  await expect(page.getByRole("status")).toContainText("Sauvegarde importée");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter ma progression" }).click();
  const download = await promise;
  expect(
    JSON.parse(await readFile(await download.path(), "utf8")).studied,
  ).toEqual(["diffraction"]);
  await go(page);
  await expect(page.locator(".stat").first()).toContainText("1/26");
});
test("HTTP complémentaire : le refus du stockage ne bloque ni le cours ni les réponses", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    }),
  );
  await go(page);
  await expect(page.getByRole("alert")).toContainText(
    "enregistrer la progression",
  );
  await go(page, "practice/diffraction-1");
  await page.getByLabel("Ta réponse numérique", { exact: false }).fill("1,995");
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByRole("status")).toContainText("Le résultat est juste");
  await go(page, "settings");
  const p = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter ma progression" }).click();
  const d = await p;
  expect(
    JSON.parse(await readFile(await d.path(), "utf8")).answers["diffraction-1"]
      .correct,
  ).toBe(true);
});
test("HTTP complémentaire : les deux chronomètres expirent après rechargement", async ({
  page,
}) => {
  await page.clock.install();
  await go(page, "quiz");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Lancer le QCM" }).click();
  await page.reload();
  await page.clock.fastForward(61000);
  await expect(
    page.getByRole("heading", { name: "0/10 questions justes" }),
  ).toBeVisible();
  await expect(page.locator(".quiz-card input").first()).toBeDisabled();
  await go(page, "exams/ds-1");
  await page.locator(".duration-input").fill("1");
  await page.getByRole("button", { name: "Commencer l’épreuve" }).click();
  await page.locator("textarea").first().fill("Mon raisonnement conservé");
  await page.reload();
  await expect(page.locator(".exam-correction")).toHaveCount(0);
  await expect(page.locator("textarea").first()).toHaveValue(
    "Mon raisonnement conservé",
  );
  await page.clock.fastForward(61000);
  await expect(page.locator(".exam-correction")).toHaveCount(5);
  await expect(page.locator("textarea").first()).toBeDisabled();
});
test("HTTP complémentaire : impression réelle et adaptation mobile", async ({
  page,
}) => {
  await go(page, "express");
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: "A4" });
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(pdf.length).toBeGreaterThan(50000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["dashboard", "courses/afocal", "sources", "formulas"]) {
    await go(page, route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
});
test("Contrôle des fichiers : chemins relatifs, polices intégrées et PDF originaux identiques", async () => {
  const out = path.join(root, "ORBITE_HTML"),
    html = await readFile(path.join(out, "index.html"), "utf8"),
    css = await readFile(path.join(out, "ressources/orbite.css"), "utf8");
  expect(html).not.toMatch(/type=["']module/);
  expect(html).not.toMatch(/(?:src|href)=["'](?:https?:|\/)/);
  for (const m of css.matchAll(/url\(([^)]+)\)/g))
    expect(m[1]).toMatch(/^["']?data:/);
  const sources = JSON.parse(
    await readFile(path.join(root, "src/data/sources.json"), "utf8"),
  );
  for (const d of sources)
    expect(await readFile(path.join(out, "documents", `${d.id}.pdf`))).toEqual(
      await readFile(path.join(root, d.name)),
    );
  expect(
    (await readdir(path.join(out, "pages"))).filter((n) => n.endsWith(".jpg")),
  ).toHaveLength(73);
  const originalFiles = execFileSync(
    "git",
    ["ls-tree", "-rz", "--name-only", "729e5b3"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean);
  for (const name of originalFiles) {
    const old = execFileSync("git", ["show", "729e5b3:" + name], {
      cwd: root,
      maxBuffer: 5000000,
    });
    expect(
      createHash("sha256")
        .update(await readFile(path.join(root, name)))
        .digest("hex"),
      name,
    ).toBe(createHash("sha256").update(old).digest("hex"));
  }
});
test("Contrôle du ZIP : extraction autonome complète, y compris chemins avec accents", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "Orbite Édition "));
  try {
    execFileSync("python", [
      "-c",
      `import shutil,sys\nfrom pathlib import Path\np=Path(sys.argv[1]);r=Path(sys.argv[2]);a=shutil.make_archive(str(p/'Orbite'),'zip',root_dir=str(r),base_dir='ORBITE_HTML');shutil.unpack_archive(a,str(p/'Mes révisions'))`,
      temp,
      root,
    ]);
    const extracted = path.join(temp, "Mes révisions/ORBITE_HTML");
    expect(
      await readFile(path.join(extracted, "index.html"), "utf8"),
    ).toContain("./ressources/orbite.js");
    expect(
      await readFile(path.join(extracted, "ressources/orbite.js")),
    ).toEqual(
      await readFile(path.join(root, "ORBITE_HTML/ressources/orbite.js")),
    );
    expect((await readdir(path.join(extracted, "documents"))).length).toBe(10);
    expect((await readdir(path.join(extracted, "pages"))).length).toBe(73);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
