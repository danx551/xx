import React, { useState } from "react";
import katex from "katex";
import {
  Star,
  Check,
  ChevronRight,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
export function MathBlock({ latex }) {
  return (
    <div
      className="math"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true,
          trust: false,
          strict: "warn",
        }),
      }}
    />
  );
}
export function Favorite({ id, progress, update }) {
  const active = progress.favorites.includes(id);
  return (
    <button
      className={`icon-button favorite ${active ? "selected" : ""}`}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      onClick={() =>
        update((p) => ({
          ...p,
          favorites: active
            ? p.favorites.filter((x) => x !== id)
            : [...p.favorites, id],
        }))
      }
    >
      <Star size={17} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
export function SourceLink({ chapter, kind = "course", page = 1, children }) {
  return (
    <a
      className="source-link"
      href={`/documents/${chapter}-${kind}.pdf#page=${parseInt(page) || 1}`}
      target="_blank"
      rel="noreferrer"
    >
      {children || `Source professeur · ch. ${chapter}, p. ${page}`}{" "}
      <ExternalLink size={12} />
    </a>
  );
}
export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Empty({ title = "Rien ici pour le moment", text, action }) {
  return (
    <div className="empty">
      <div className="empty-orbit">◎</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Pill({ children, tone = "" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
export function StepList({ steps }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={i}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <p>{s}</p>
        </li>
      ))}
    </ol>
  );
}
export function HintBox({ hints, id, progress, update }) {
  const count = Number(progress.notes[`hints-${id}`] || 0);
  return (
    <div className="hint-box">
      {count > 0 && (
        <ol>
          {hints.slice(0, count).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
      )}
      <button
        className="button subtle"
        disabled={count >= hints.length}
        onClick={() =>
          update((p) => ({
            ...p,
            notes: {
              ...p.notes,
              [`hints-${id}`]: String(Math.min(hints.length, count + 1)),
            },
          }))
        }
      >
        <Lightbulb size={16} />
        {count === 0
          ? "Je ne sais pas comment commencer"
          : count >= hints.length
            ? "Tous les indices sont affichés"
            : `Indice suivant (${count + 1}/${hints.length})`}
      </button>
    </div>
  );
}
export function Timer({ remaining }) {
  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  return (
    <span className={`timer ${seconds < 300 ? "urgent" : ""}`}>
      {String(Math.floor(seconds / 3600)).padStart(2, "0")}:
      {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:
      {String(seconds % 60).padStart(2, "0")}
    </span>
  );
}
export function Diagram({ type = "diffraction" }) {
  const [lambda, setLambda] = useState(600),
    [a, setA] = useState(100),
    [phase, setPhase] = useState(0),
    [ocular, setOcular] = useState(40);
  if (
    type === "lens" ||
    type === "afocal" ||
    type === "magnification" ||
    type === "resolution"
  ) {
    const x1 = 100,
      f1 = 300,
      f2 = ocular,
      x2 = x1 + f1 + f2,
      base = 150,
      slope = 0.1;
    const rays = [-40, 20].map((y) => {
      const yfocus = f1 * slope;
      const outgoing = slope - y / f1;
      const at2 = yfocus + outgoing * f2;
      return `${20},${base + y - slope * 80} ${x1},${base + y} ${x1 + f1},${base + yfocus} ${x2},${base + at2} 620,${base + at2 - (yfocus / f2) * (620 - x2)}`;
    });
    return (
      <div className="simulation">
        <div className="row">
          <Pill>Schéma paraxial · rayons hors axe</Pill>
          <span>G = {(f1 / f2).toFixed(1)}</span>
        </div>
        <svg
          role="img"
          aria-label="Deux faisceaux parallèles traversent l’objectif, convergent dans le plan focal commun puis ressortent parallèles de l’oculaire."
          viewBox="0 0 660 290"
        >
          <line
            x1="20"
            y1={base}
            x2="640"
            y2={base}
            stroke="var(--muted)"
            strokeDasharray="4 5"
          />
          <line
            x1={x1}
            y1="40"
            x2={x1}
            y2="250"
            stroke="#b9a2ff"
            strokeWidth="4"
          />
          <line
            x1={x2}
            y1="40"
            x2={x2}
            y2="250"
            stroke="#8baafa"
            strokeWidth="4"
          />
          <line
            x1={x1 + f1}
            y1="65"
            x2={x1 + f1}
            y2="235"
            stroke="var(--muted)"
            strokeDasharray="4 5"
          />
          {rays.map((r, i) => (
            <polyline
              key={i}
              points={r}
              fill="none"
              stroke={i ? "#81c8ba" : "#d9b882"}
              strokeWidth="2"
            />
          ))}
          <circle cx={x1 + f1} cy={base + f1 * slope} r="4" fill="#fff" />
          <text x={x1 - 28} y="25">
            Objectif L₁
          </text>
          <text x={x2 - 25} y="25">
            Oculaire L₂
          </text>
          <text x={x1 - 5} y={base + 20}>
            O₁
          </text>
          <text x={x2 - 3} y={base + 20}>
            O₂
          </text>
          <text x={x1 + f1 - 20} y="270">
            F′₁ = F₂
          </text>
          <text x={x1 + f1 + 8} y={base + f1 * slope + 15}>
            B₁
          </text>
        </svg>
        <label>
          Focale de l’oculaire : {ocular} mm{" "}
          <input
            type="range"
            min="20"
            max="80"
            value={ocular}
            onChange={(e) => setOcular(Number(e.target.value))}
          />
        </label>
        <p className="caption">
          Objectif : 300 mm. Le plan focal commun reste fixe ; l’oculaire se
          déplace pour conserver le réglage afocal. Image finale à l’infini,
          renversée. Axes gradués de manière schématique.
        </p>
      </div>
    );
  }
  if (["interference", "acousticdiff", "thinfilm"].includes(type)) {
    const path = (offset, sum = false) =>
      Array.from({ length: 400 }, (_, i) => {
        const x = (i / 399) * 600,
          angle = (i / 399) * 6 * Math.PI;
        const y =
          145 -
          35 *
            (sum
              ? Math.sin(angle) + Math.sin(angle + phase)
              : Math.sin(angle + offset));
        return `${i ? "L" : "M"}${x + 20},${y}`;
      }).join(" ");
    return (
      <div className="simulation">
        <div className="row">
          <Pill>Superposition de deux ondes</Pill>
          <span>φ = {(phase / Math.PI).toFixed(2)}π rad</span>
        </div>
        <svg
          role="img"
          aria-label="Somme de deux sinusoïdes synchrones en fonction du déphasage"
          viewBox="0 0 660 270"
        >
          <line x1="20" y1="145" x2="640" y2="145" stroke="var(--muted)" />
          <path d={path(0)} stroke="#82c8ba" fill="none" strokeWidth="1.5" />
          <path
            d={path(phase)}
            stroke="#d9b882"
            fill="none"
            strokeWidth="1.5"
          />
          <path
            d={path(0, true)}
            stroke="#b9a2ff"
            fill="none"
            strokeWidth="3"
          />
          <text x="20" y="245">
            Vert : s₁ · Or : s₂ · Violet : somme · Amplitudes égales
          </text>
        </svg>
        <label>
          Déphasage{" "}
          <input
            type="range"
            min="0"
            max={2 * Math.PI}
            step={Math.PI / 100}
            value={phase}
            onChange={(e) => setPhase(Number(e.target.value))}
          />
        </label>
        <div className="row">
          <button className="button subtle" onClick={() => setPhase(0)}>
            En phase
          </button>
          <button className="button subtle" onClick={() => setPhase(Math.PI)}>
            En opposition
          </button>
        </div>
        <p className="caption">
          L’amplitude de la somme vaut{" "}
          {Math.abs(2 * Math.cos(phase / 2)).toFixed(2)} pour deux amplitudes
          initiales de 1. La fréquence reste identique.
        </p>
      </div>
    );
  }
  const L = (2 * lambda * 1e-9 * 2) / (a * 1e-6),
    scale = 500 / 0.1;
  const path = Array.from({ length: 501 }, (_, i) => {
    const x = (i - 250) / scale,
      z = (Math.PI * (a * 1e-6) * x) / (lambda * 1e-9 * 2),
      I = z === 0 ? 1 : (Math.sin(z) / z) ** 2;
    return `${i ? "L" : "M"}${70 + i},${225 - I * 150}`;
  }).join(" ");
  return (
    <div className="simulation">
      <div className="row">
        <Pill>Laboratoire · diffraction</Pill>
        <span>L = {(L * 100).toFixed(2)} cm</span>
      </div>
      <svg
        role="img"
        aria-label="Intensité de diffraction par une fente. La largeur centrale augmente quand la fente rétrécit."
        viewBox="0 0 660 290"
      >
        <defs>
          <linearGradient id="plotfill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#a78bfa" stopOpacity=".4" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="70"
            x2="570"
            y1={75 + i * 50}
            y2={75 + i * 50}
            stroke="var(--border)"
          />
        ))}
        <path d={`${path} L570,225 L70,225 Z`} fill="url(#plotfill)" />
        <path d={path} fill="none" stroke="#b8a2ff" strokeWidth="2.5" />
        <line
          x1={320 - (L / 2) * scale}
          x2={320 + (L / 2) * scale}
          y1="53"
          y2="53"
          stroke="#dcc18b"
          strokeWidth="2"
        />
        <text x="310" y="42">
          L
        </text>
        <text x="70" y="254">
          −5 cm
        </text>
        <text x="316" y="254">
          0
        </text>
        <text x="540" y="254">
          +5 cm
        </text>
        <text x="16" y="83">
          I/Imax
        </text>
        <text x="250" y="282">
          Position sur l’écran (D = 2,00 m)
        </text>
      </svg>
      <div className="controls">
        <label>
          Longueur d’onde : {lambda} nm
          <input
            type="range"
            min="400"
            max="750"
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
          />
        </label>
        <label>
          Largeur de fente : {a} µm
          <input
            type="range"
            min="50"
            max="200"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>
      </div>
      <p className="caption">
        Modèle lointain de fente unique, petits angles. Le trait doré délimite
        toute la tache centrale entre les premiers minima.
      </p>
    </div>
  );
}
// Figures de sujet : schémas de repérage, sans résultat calculé.
export function ExamFigure({ topics: ids }) {
  if (ids.includes("young"))
    return (
      <figure className="exam-figure">
        <svg
          viewBox="0 0 660 240"
          role="img"
          aria-label="Dispositif d’Young : sources S1 et S2 séparées de b, écran à distance D et point M d’abscisse x"
        >
          <line
            x1="120"
            y1="35"
            x2="120"
            y2="195"
            stroke="var(--muted)"
            strokeWidth="4"
          />
          <line
            x1="540"
            y1="25"
            x2="540"
            y2="205"
            stroke="var(--muted)"
            strokeWidth="3"
          />
          <line
            x1="120"
            y1="120"
            x2="540"
            y2="120"
            stroke="var(--border)"
            strokeDasharray="5 5"
          />
          <path
            d="M120 92 L540 65 L120 148"
            stroke="#a997e9"
            fill="none"
            strokeWidth="2"
          />
          <circle cx="120" cy="92" r="4" fill="#c7b5ff" />
          <circle cx="120" cy="148" r="4" fill="#c7b5ff" />
          <circle cx="540" cy="65" r="4" fill="#c7b5ff" />
          <path
            d="M95 92 L95 148 M90 92 L100 92 M90 148 L100 148 M120 217 L540 217 M570 65 L570 120"
            stroke="#d2b784"
            fill="none"
          />
          <text x="75" y="125">
            b
          </text>
          <text x="320" y="236">
            D
          </text>
          <text x="580" y="97">
            x
          </text>
          <text x="130" y="84">
            S₁
          </text>
          <text x="130" y="170">
            S₂
          </text>
          <text x="550" y="51">
            M
          </text>
          <text x="550" y="137">
            O
          </text>
          <text x="500" y="18">
            Écran
          </text>
        </svg>
        <figcaption>
          Schéma de repérage d’Young, sans échelle. Sources supposées en phase.
        </figcaption>
      </figure>
    );
  if (ids.includes("diffraction") || ids.includes("diffgraph"))
    return (
      <figure className="exam-figure">
        <svg
          viewBox="0 0 660 230"
          role="img"
          aria-label="Diffraction : ouverture sur l’axe, écran à distance D, largeur totale L et demi-angle theta"
        >
          <path
            d="M140 35 L140 104 M140 116 L140 185 M540 20 L540 195"
            stroke="var(--muted)"
            strokeWidth="4"
          />
          <line
            x1="35"
            y1="110"
            x2="540"
            y2="110"
            stroke="var(--border)"
            strokeDasharray="4 5"
          />
          <path
            d="M140 110 L540 50 M140 110 L540 170"
            stroke="#b6a1f0"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M180 110 Q181 107 179 104 M570 50 L570 170 M140 210 L540 210"
            stroke="#d2b784"
            fill="none"
          />
          <text x="190" y="105">
            θ
          </text>
          <text x="580" y="115">
            L
          </text>
          <text x="330" y="228">
            D
          </text>
          <text x="90" y="20">
            Fente / fil
          </text>
          <text x="518" y="16">
            Écran
          </text>
          <text x="22" y="98">
            Laser
          </text>
        </svg>
        <figcaption>
          Schéma géométrique sans échelle. L désigne la largeur complète de la
          tache centrale.
        </figcaption>
      </figure>
    );
  if (ids.includes("afocal") || ids.includes("magnification"))
    return (
      <figure className="exam-figure">
        <svg
          viewBox="0 0 660 200"
          role="img"
          aria-label="Lunette à deux lentilles convergentes, objectif L1 et oculaire L2 sur un axe orienté"
        >
          <defs>
            <marker
              id="axis-arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0 0 L6 3 L0 6" fill="var(--muted)" />
            </marker>
          </defs>
          <line
            x1="30"
            y1="100"
            x2="630"
            y2="100"
            stroke="var(--muted)"
            markerEnd="url(#axis-arrow)"
          />
          <path
            d="M130 25 L130 175 M120 37 L130 25 L140 37 M120 163 L130 175 L140 163 M495 45 L495 155 M485 57 L495 45 L505 57 M485 143 L495 155 L505 143"
            stroke="#b7a1f1"
            fill="none"
            strokeWidth="2"
          />
          <text x="105" y="15">
            Objectif L₁
          </text>
          <text x="465" y="30">
            Oculaire L₂
          </text>
          <text x="134" y="121">
            O₁
          </text>
          <text x="499" y="121">
            O₂
          </text>
          <path d="M130 184 L495 184" stroke="#d2b784" />
          <text x="305" y="198">
            d
          </text>
        </svg>
        <figcaption>
          Schéma de la lunette à compléter sur ta copie : foyers, rayons, image
          intermédiaire et angles. Sans échelle.
        </figcaption>
      </figure>
    );
  return null;
}
