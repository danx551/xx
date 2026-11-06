/* Tests locaux facultatifs : ce fichier est un script classique sans réseau. */
(() => {
  const panel = document.getElementById("verification"),
    results = document.getElementById("test-results"),
    start = document.getElementById("run-tests");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const text = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  async function until(fn, label) {
    for (let i = 0; i < 100; i++) {
      if (fn()) return;
      await sleep(50);
    }
    throw Error(label || "Élément attendu introuvable");
  }
  async function route(name) {
    location.hash = "/" + name;
    await until(() => document.querySelector("main h1"), "Page non chargée");
    await sleep(120);
  }
  function button(label) {
    const b = [...document.querySelectorAll("#root button")].find((e) =>
      text(e).includes(label),
    );
    if (!b) throw Error("Bouton introuvable : " + label);
    b.click();
    return b;
  }
  function input(el, value) {
    if (!el) throw Error("Champ introuvable");
    const p =
      el.tagName === "SELECT"
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(p, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function check(condition, message) {
    if (!condition) throw Error(message);
  }
  const expected = [
    ["courses", ".topic-card", 26],
    ["methods", ".topic-card", 26],
    ["formulas", ".formula-card", 39],
    ["practice", ".topic-card", 104],
    ["quiz", ".quiz-card", 52],
    ["exams", ".exam-card", 4],
    ["anticipate", ".question", 156],
    ["bac", ".topic-card", 30],
  ];
  start.addEventListener("click", async () => {
    start.disabled = true;
    results.innerHTML = "";
    const key = "orbite-progress-v1";
    let original,
      storageAvailable = true,
      passed = 0,
      failed = 0;
    try {
      original = localStorage.getItem(key);
    } catch {
      storageAvailable = false;
    }
    async function run(name, fn) {
      const li = document.createElement("li");
      li.textContent = "En cours : " + name;
      results.append(li);
      try {
        await fn();
        li.textContent = "✓ " + name;
        li.style.color = "#9ddcc2";
        passed++;
      } catch (e) {
        li.textContent = "✗ " + name + " — " + e.message;
        li.style.color = "#f0aa9a";
        failed++;
      }
    }
    try {
      for (const [name, selector, count] of expected)
        await run(`Contenu ${name} : ${count} éléments`, async () => {
          await route(name);
          check(
            document.querySelectorAll(selector).length === count,
            "Quantité inattendue",
          );
        });
      await run("Cours en trois niveaux et schéma de lunette", async () => {
        await route("courses/afocal");
        button("Maîtriser pour le DS");
        await sleep(100);
        check(
          document.querySelector(".lesson").textContent.includes("rayon"),
          "Cours non affiché",
        );
        input(document.querySelector(".simulation input[type=range]"), "60");
        await until(
          () =>
            document
              .querySelector(".simulation")
              .textContent.includes("G = 5.0"),
          "Curseur non appliqué",
        );
      });
      await run("QCM multiple et explications", async () => {
        await route("quiz/qcm-diffraction");
        const retry = [...document.querySelectorAll("#root button")].find((b) =>
          text(b).includes("Réessayer cette question"),
        );
        if (retry) {
          retry.click();
          await sleep(100);
        }
        document.querySelector(".quiz-card input[type=checkbox]").click();
        button("Valider toutes mes réponses");
        await until(() => document.querySelector(".quiz-card [role=status]"));
        check(
          document
            .querySelector(".quiz-card [role=status]")
            .textContent.includes("Exactement"),
          "Réponse non validée",
        );
        check(
          document
            .querySelector(".quiz-card [role=status]")
            .textContent.includes("Faux"),
          "Explications absentes",
        );
      });
      await run(
        "Exercice numérique avec virgule décimale et sauvegarde",
        async () => {
          await route("practice/young-1");
          input(document.getElementById("exercise-answer"), "3,192");
          button("Vérifier ma réponse");
          await until(() =>
            document
              .querySelector("[role=status]")
              ?.textContent.includes("Le résultat est juste"),
          );
          if (!storageAvailable)
            throw Error("Stockage refusé : utiliser export/import");
          await until(
            () =>
              JSON.parse(localStorage.getItem(key)).answers["young-1"]
                ?.correct === true,
            "Sauvegarde non trouvée",
          );
        },
      );
      await run("Recherche par notion", async () => {
        await route("dashboard");
        const search = document.querySelector(
          'input[aria-label="Rechercher dans toutes les notions"]',
        );
        input(search, "interfrange");
        await until(() => document.querySelector(".search-results"));
        const b = [...document.querySelectorAll(".search-results button")].find(
          (b) => text(b).includes("Fentes d’Young et interfrange"),
        );
        check(b, "Résultat manquant");
        b.click();
        await until(
          () => location.hash.includes("/young"),
          "Navigation de recherche incorrecte",
        );
      });
      await run("Formules LaTeX et polices hors connexion", async () => {
        await route("formulas");
        await document.fonts.ready;
        check(
          document.querySelectorAll(".katex").length >= 39,
          "Formules non affichées",
        );
        check(!document.querySelector(".katex-error"), "Erreur de formule");
        check(document.fonts.check("16px KaTeX_Main"), "Police non chargée");
      });
      await run(
        "Les figures originales sont accessibles localement",
        async () => {
          await route("sources");
          const select = document.querySelector(".source-picker select");
          input(select, "4-bac");
          await until(() =>
            document
              .querySelector(".offline-pages img")
              ?.getAttribute("src")
              ?.includes("4-bac"),
          );
          await until(
            () =>
              document.querySelector(".offline-pages img")?.naturalWidth > 1000,
            "Page image non chargée",
          );
          const a = [...document.querySelectorAll("#root a")].find((a) =>
            text(a).includes("Ouvrir le PDF original"),
          );
          check(
            a?.getAttribute("href").startsWith("./documents/"),
            "Chemin PDF non relatif",
          );
        },
      );
      await run("Favoris enregistrés", async () => {
        await route("courses/diffraction");
        const add = document.querySelector(
          'button[aria-label="Ajouter aux favoris"]',
        );
        if (add) add.click();
        await until(() =>
          document.querySelector('button[aria-label="Retirer des favoris"]'),
        );
        await route("favorites");
        check(
          [...document.querySelectorAll(".topic-card")].some((c) =>
            text(c).includes("Diffraction par une fente ou un fil"),
          ),
          "Favori absent",
        );
      });
      await run("Aucune ressource externe", async () => {
        const resources = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter(
            (u) => /^https?:/.test(u) && !u.startsWith(location.origin + "/"),
          );
        check(
          resources.length === 0,
          "Ressources externes : " + resources.join(", "),
        );
      });
    } finally {
      if (storageAvailable) {
        try {
          if (original === null) localStorage.removeItem(key);
          else localStorage.setItem(key, original);
        } catch {}
      }
      const line = document.createElement("p");
      line.textContent = `${passed} vérifications réussies · ${failed} échec(s) · protocole ${location.protocol} — progression initiale restaurée si le stockage était disponible.`;
      results.append(line);
      start.disabled = false;
      document.documentElement.setAttribute(
        "data-orbite-tests",
        failed ? "failed" : "passed",
      );
    }
  });
  document.getElementById("test-protocol").textContent =
    `Adresse actuelle : ${location.protocol} ${location.protocol === "file:" ? "— test réel depuis le disque" : "— attention : ce résultat ne valide pas une ouverture file://"}`;
})();
