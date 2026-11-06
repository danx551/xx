import React from "react";
import "./offline.css";
export function OfflineDocument({ id, start, end }) {
  return (
    <section
      className="offline-pages"
      aria-label="Document original consultable hors connexion"
    >
      <p className="caption">
        Pages originales incluses dans le dossier. Clique sur une page pour
        l’ouvrir en grand. Le PDF reste disponible avec le bouton « Ouvrir le
        PDF original ».
      </p>
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => {
          const url = `./pages/${id}-${String(page).padStart(2, "0")}.jpg`;
          return (
            <figure key={`${id}-${page}`}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ouvrir la page ${page} en grand`}
              >
                <img
                  src={url}
                  alt={`Document ${id}, page ${page} : mise en page originale, figures et tableaux`}
                  loading="lazy"
                />
              </a>
              <figcaption>
                Document {id} · page {page} · original du professeur
              </figcaption>
            </figure>
          );
        },
      )}
    </section>
  );
}
