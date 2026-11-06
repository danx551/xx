import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  BookOpen,
  Sigma,
  Route,
  Lightbulb,
  PenLine,
  ClipboardCheck,
  Timer as TimerIcon,
  Compass,
  Star,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Files,
  ShieldCheck,
  Download,
  Upload,
  Settings,
  ChevronRight,
  Atom,
} from "lucide-react";
import "katex/dist/katex.min.css";
import "./styles.css";
import { topics, formulas, chapters } from "./data/curriculum.js";
import { exercises, questionBank } from "./data/practice.js";
import { quizzes } from "./data/quizzes.js";
import { bacExercises } from "./data/bac.js";
import { readProgress, validateProgress, STORAGE_KEY } from "./state.js";
import { SectionHeader, Empty, Pill, Favorite } from "./components.jsx";
import {
  Dashboard,
  Courses,
  Formulas,
  Methods,
  Practice,
  Anticipate,
  Bac,
  Help,
  Coverage,
  Sources,
} from "./Learning.jsx";
import { Quiz, Exams } from "./Assessment.jsx";
const nav = [
  ["dashboard", "Tableau de bord", LayoutDashboard],
  ["courses", "Les cours", BookOpen],
  ["formulas", "L’essentiel & formules", Sigma],
  ["methods", "Les méthodes", Route],
  ["anticipate", "Anticiper mon DS", Compass],
  ["practice", "Entraînement", PenLine],
  ["bac", "Exercices type bac", Files],
  ["quiz", "QCM & questions pièges", ClipboardCheck],
  ["exams", "DS blancs", TimerIcon],
  ["help", "Je ne comprends rien", Lightbulb],
];
const entries = [
  ...topics.map((t) => ({
    id: t.id,
    title: t.title,
    chapter: t.chapter,
    type: "Cours",
    page: "courses",
    text: t.understand,
  })),
  ...topics.map((t) => ({
    id: `method:${t.id}`,
    routeId: t.id,
    title: t.title,
    chapter: t.chapter,
    type: "Méthode",
    page: "methods",
    text: t.recognize,
  })),
  ...formulas.map((f) => ({
    id: `formula:${f.id}`,
    routeId: f.id,
    title: f.title,
    chapter: f.chapter,
    type: "Formule",
    page: "formulas",
    text: f.symbols,
  })),
  ...exercises.map((e) => ({
    id: e.id,
    title: `${topics.find((t) => t.id === e.topic).title} · niveau ${e.level}`,
    chapter: e.chapter,
    type: "Entraînement",
    page: "practice",
    text: e.question,
  })),
  ...bacExercises.map((e) => ({
    id: e.id,
    title: e.title,
    chapter: e.chapter,
    type: "Type bac",
    page: "bac",
    text: e.evaluated.join(" "),
  })),
  ...questionBank.map((q) => ({
    id: q.id,
    title: q.question,
    chapter: q.chapter,
    type: "Question",
    page: "anticipate",
    routeId: q.id,
    text: q.answer,
  })),
  ...quizzes.map((q) => ({
    id: q.id,
    title: q.question,
    chapter: q.chapter,
    type: "QCM",
    page: "quiz",
    routeId: q.id,
    text: q.choices.map((c) => c.text).join(" "),
  })),
];
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function getRoute() {
  const [page = "dashboard", id = ""] = window.location.hash
    .slice(2)
    .split("/");
  return { page: page || "dashboard", id: decodeURIComponent(id) };
}
function App() {
  const [initial] = useState(() => readProgress(window.localStorage));
  const [progress, setProgress] = useState(initial.data),
    [error, setError] = useState(initial.error),
    [route, setRoute] = useState(getRoute),
    [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(""),
    [searchOpen, setSearchOpen] = useState(false),
    [notice, setNotice] = useState("");
  const searchRef = useRef(null),
    mainRef = useRef(null),
    importRef = useRef(null);
  useEffect(() => {
    const listener = () => {
      setRoute(getRoute());
      setMobile(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setError(
        "Le navigateur ne peut pas enregistrer la progression. Exporte une sauvegarde pour la conserver.",
      );
    }
  }, [progress]);
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [route.page, route.id]);
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  function go(page, id = "") {
    window.location.hash = `/${page}${id ? `/${encodeURIComponent(id)}` : ""}`;
    setSearchOpen(false);
    setSearch("");
  }
  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `orbite-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Sauvegarde exportée. Conserve ce fichier sur ton appareil.");
  }
  async function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 5000000) throw new Error("Fichier trop volumineux.");
      const next = validateProgress(JSON.parse(await file.text()));
      setProgress(next);
      setNotice(
        "Sauvegarde importée : elle remplace la progression de cet appareil.",
      );
    } catch (e) {
      setError(`Import impossible : ${e.message}`);
    }
    event.target.value = "";
  }
  const props = { progress, update: setProgress, go, id: route.id };
  let content;
  switch (route.page) {
    case "dashboard":
      content = <Dashboard {...props} />;
      break;
    case "courses":
      content = <Courses {...props} />;
      break;
    case "formulas":
      content = <Formulas {...props} />;
      break;
    case "express":
      content = <Formulas {...props} express />;
      break;
    case "methods":
      content = <Methods {...props} />;
      break;
    case "practice":
      content = <Practice {...props} />;
      break;
    case "anticipate":
      content = <Anticipate {...props} />;
      break;
    case "bac":
      content = <Bac {...props} />;
      break;
    case "quiz":
      content = <Quiz {...props} />;
      break;
    case "exams":
      content = <Exams {...props} />;
      break;
    case "help":
      content = <Help {...props} />;
      break;
    case "sources":
      content = <Sources />;
      break;
    case "coverage":
      content = <Coverage {...props} />;
      break;
    case "favorites": {
      const list = entries.filter((e) => progress.favorites.includes(e.id));
      content = (
        <>
          <SectionHeader
            eyebrow="TON CARNET PERSONNEL"
            title="Les repères à garder."
            description="Cours, formules, méthodes et exercices que tu veux retrouver facilement."
          />
          {list.length ? (
            <div className="topic-grid">
              {list.map((e) => (
                <article className="topic-card" key={e.id}>
                  <div className="row">
                    <Pill>
                      {e.type} · Ch. {e.chapter}
                    </Pill>
                    <Favorite
                      id={e.id}
                      progress={progress}
                      update={setProgress}
                    />
                  </div>
                  <h3>{e.title}</h3>
                  <p>{e.text.slice(0, 130)}…</p>
                  <button
                    className="text-button"
                    onClick={() => go(e.page, e.routeId || e.id)}
                  >
                    Retrouver ce contenu <ArrowRight size={15} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              title="Tes futurs raccourcis sont ici."
              text="Ajoute une étoile à une formule, une méthode ou un exercice pour la retrouver au prochain passage."
              action={
                <button
                  className="button secondary"
                  onClick={() => go("formulas")}
                >
                  Explorer les formules <ArrowRight size={15} />
                </button>
              }
            />
          )}
        </>
      );
      break;
    }
    case "settings":
      content = (
        <>
          <SectionHeader
            eyebrow="TON ESPACE, TES DONNÉES"
            title="Une progression qui reste à toi."
            description="Aucun compte ni service payant. Les réponses et favoris sont stockés dans ce navigateur."
          />
          <div className="panel">
            <h3>Conserver ma progression</h3>
            <p>
              Le stockage du navigateur peut être effacé par un nettoyage des
              données ou un changement d’appareil. Exporte régulièrement un
              fichier pour garder une copie. L’import remplace les données
              locales actuelles.
            </p>
            <div className="row actions">
              <button className="button primary" onClick={exportProgress}>
                <Download size={16} /> Exporter ma progression
              </button>
              <button
                className="button secondary"
                onClick={() => importRef.current.click()}
              >
                <Upload size={16} /> Importer une sauvegarde
              </button>
              <input
                ref={importRef}
                type="file"
                hidden
                accept="application/json,.json"
                onChange={importProgress}
              />
            </div>
          </div>
          <div className="panel">
            <h3>Apparence</h3>
            <button
              className="button secondary"
              onClick={() =>
                setProgress((p) => ({
                  ...p,
                  theme: p.theme === "dark" ? "light" : "dark",
                }))
              }
            >
              {progress.theme === "dark" ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}{" "}
              Passer en mode {progress.theme === "dark" ? "clair" : "sombre"}
            </button>
          </div>
          <div className="panel">
            <h3>Sources et confidentialité</h3>
            <p>
              Les PDF sont servis depuis le projet local. Aucune analyse de
              fréquentation, aucun envoi de réponse à un serveur externe. Les
              polices et le moteur LaTeX sont inclus dans la compilation.
            </p>
            <p>
              Ce serveur local n’a pas de contrôle d’accès. Pour garder tes
              documents personnels privés, évite de publier ce projet tel quel
              sur un hébergement public.
            </p>
            <button className="text-button" onClick={() => go("coverage")}>
              Voir la couverture et les points à vérifier{" "}
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      );
      break;
    default:
      content = (
        <Empty
          title="Cette page n’existe pas."
          action={
            <button className="button primary" onClick={() => go("dashboard")}>
              Retour au tableau de bord
            </button>
          }
        />
      );
  }
  const results = search.trim()
    ? entries
        .filter((e) =>
          normalize(`${e.title} ${e.text}`).includes(normalize(search)),
        )
        .slice(0, 12)
    : [];
  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView();
        }}
      >
        Aller au contenu
      </a>
      {mobile && (
        <button
          className="mobile-overlay"
          aria-label="Fermer la navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <button
          className="brand"
          onClick={() => go("dashboard")}
          aria-label="Orbite — tableau de bord"
        >
          <span className="brand-icon">
            <Atom size={24} />
          </span>
          <span>
            orbite<span className="brand-dot">.</span>
            <small>APPRENDRE À COMPRENDRE</small>
          </span>
        </button>
        <div className="workspace-badge">
          <span className="workspace-avatar">PC</span>
          <span>
            Mon espace de révision<small>Terminale · Spécialité</small>
          </span>
          <span className="live-dot" />
        </div>
        <div className="nav-caption">MON PARCOURS</div>
        <nav aria-label="Navigation principale">
          {nav.map(([page, label, Icon]) => (
            <button
              key={page}
              className={`${route.page === page || (page === "formulas" && route.page === "express") ? "active" : ""}`}
              onClick={() => go(page)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {page === "exams" && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            onClick={() => go("favorites")}
            className={route.page === "favorites" ? "active" : ""}
          >
            <Star size={17} /> Mes favoris{" "}
            <span>{progress.favorites.length}</span>
          </button>
          <button
            onClick={() => go("sources")}
            className={route.page === "sources" ? "active" : ""}
          >
            <Files size={17} /> Documents sources
          </button>
          <button
            onClick={() => go("coverage")}
            className={route.page === "coverage" ? "active" : ""}
          >
            <ShieldCheck size={17} /> Couverture & vérifications
          </button>
          <div className="sidebar-footer">
            <span className="footer-avatar">Moi</span>
            <span>
              Mon objectif : progresser
              <small>Sauvegarde sur cet appareil</small>
            </span>
            <button
              className="icon-button"
              aria-label="Paramètres et sauvegarde"
              onClick={() => go("settings")}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="app-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Ouvrir la navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Mon espace</span>
            <ChevronRight size={13} />
            <strong>
              {nav.find((n) => n[0] === route.page)?.[1] ||
                {
                  express: "Révision express",
                  sources: "Documents sources",
                  coverage: "Couverture",
                  settings: "Paramètres",
                  favorites: "Mes favoris",
                }[route.page] ||
                "Orbite"}
            </strong>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={16} />
              <input
                ref={searchRef}
                value={search}
                aria-label="Rechercher dans toutes les notions"
                placeholder="Rechercher une notion…"
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
              />
              <kbd>⌘ K</kbd>
              {searchOpen && search.trim() && (
                <div className="search-results">
                  <div className="row">
                    <span className="eyebrow">RÉSULTATS</span>
                    <button
                      className="icon-button"
                      aria-label="Fermer la recherche"
                      onClick={() => setSearchOpen(false)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  {results.length ? (
                    results.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => go(e.page, e.routeId || e.id)}
                      >
                        <span>
                          <small>
                            {e.type} · Chapitre {e.chapter}
                          </small>
                          <strong>{e.title}</strong>
                        </span>
                        <ArrowUpRight size={15} />
                      </button>
                    ))
                  ) : (
                    <p>Aucun résultat pour « {search} ».</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button theme-toggle"
              aria-label={`Activer le mode ${progress.theme === "dark" ? "clair" : "sombre"}`}
              onClick={() =>
                setProgress((p) => ({
                  ...p,
                  theme: p.theme === "dark" ? "light" : "dark",
                }))
              }
            >
              {progress.theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              className="header-avatar"
              aria-label="Ma progression et mes sauvegardes"
              onClick={() => go("settings")}
            >
              Moi
            </button>
          </div>
        </header>
        <main ref={mainRef} id="main" tabIndex={-1}>
          {error && (
            <div className="alert" role="alert">
              <p>{error}</p>
              <button
                className="icon-button"
                aria-label="Fermer le message"
                onClick={() => setError(null)}
              >
                <X size={15} />
              </button>
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              <p>{notice}</p>
              <button
                className="icon-button"
                aria-label="Fermer le message"
                onClick={() => setNotice("")}
              >
                <X size={15} />
              </button>
            </div>
          )}
          <div key={`${route.page}/${route.id}`} className="page-content">
            {content}
          </div>
          <footer className="main-footer">
            <span>Orbite · De la curiosité à la maîtrise.</span>
            <button onClick={() => go("coverage")}>
              Sources, couverture et limites <ArrowUpRight size={12} />
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
