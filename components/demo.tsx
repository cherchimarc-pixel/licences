"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DUREE_SCENE = 5500;

type Ligne = { nom: string; detail: string; montant: string; surligne?: boolean; delai: string };

function Releve({ lignes }: { lignes: Ligne[] }) {
  return (
    <ul className="border-2 border-encre bg-white">
      {lignes.map((l) => (
        <li
          key={l.nom}
          className="apparait border-b border-trait last:border-b-0"
          style={{ animationDelay: l.delai }}
        >
          <div
            className={`flex items-start justify-between gap-4 px-4 py-3 ${l.surligne ? "surligne" : ""}`}
            style={l.surligne ? { animationDelay: `calc(${l.delai} + 0.9s)` } : undefined}
          >
            <span>
              <span className="block text-lg font-bold leading-snug">{l.nom}</span>
              <span className="block text-sm text-gris">{l.detail}</span>
            </span>
            <span className="whitespace-nowrap text-lg font-bold tabular-nums">{l.montant}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

const lignesBase: Ligne[] = [
  { nom: "Slack", detail: "Messagerie", montant: "960 €", delai: "0.2s" },
  { nom: "Canva", detail: "Design", montant: "540 €", delai: "0.5s" },
  { nom: "Zoom", detail: "Visioconférence", montant: "340 €", delai: "0.8s" },
  { nom: "Google Workspace", detail: "Messagerie", montant: "1 440 €", delai: "1.1s" },
];

const scenes = [
  {
    titre: "Vous payez des abonnements sans les voir.",
    texte: "Chaque mois, des prélèvements partent pour des logiciels. Personne ne sait vraiment lesquels servent encore.",
    visuel: (
      <div>
        <Releve lignes={lignesBase} />
        <p className="apparait mt-3 text-right text-lg font-bold tabular-nums" style={{ animationDelay: "1.6s" }}>
          3 280 € par an
        </p>
      </div>
    ),
  },
  {
    titre: "Quelqu'un est parti. Son compte, lui, continue.",
    texte: "Vous indiquez les personnes de l'entreprise et leurs comptes. Quand une personne part, vous la marquez.",
    visuel: (
      <div>
        <div className="apparait border-2 border-encre bg-white px-4 py-3" style={{ animationDelay: "0.2s" }}>
          <p className="text-lg font-bold leading-snug">Julie Martin</p>
          <p className="text-sm text-gris">A quitté l&apos;entreprise le 30 septembre</p>
        </div>
        <div className="mt-4">
          <Releve
            lignes={[
              { nom: "Slack", detail: "Compte de Julie Martin", montant: "960 €", surligne: true, delai: "0.7s" },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    titre: "Licences chiffre ce que vous perdez.",
    texte: "Les comptes inutilisés et les doublons sont repérés, avec leur coût par an.",
    visuel: (
      <div>
        <Releve
          lignes={[
            { nom: "Slack", detail: "Le salarié est parti", montant: "960 €", surligne: true, delai: "0.2s" },
            { nom: "Canva", detail: "Aucun compte actif", montant: "540 €", surligne: true, delai: "0.5s" },
            { nom: "Zoom", detail: "Doublon avec Teams", montant: "340 €", surligne: true, delai: "0.8s" },
          ]}
        />
        <div
          className="apparait mt-3 flex items-end justify-between gap-4 bg-encre px-4 py-4 text-white"
          style={{ animationDelay: "3s" }}
        >
          <span className="text-base font-bold">Payé pour rien, par an</span>
          <span className="font-titre text-4xl font-extrabold leading-none tabular-nums text-surligneur">
            1&nbsp;840&nbsp;€
          </span>
        </div>
      </div>
    ),
  },
  {
    titre: "Vous décidez avant de repayer.",
    texte: "Les échéances sont classées du plus proche au plus lointain. Gardez, résiliez ou renégociez avant la date.",
    visuel: (
      <div className="apparait border-2 border-encre bg-white px-4 py-4" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-lg font-bold leading-snug">Canva</p>
          <p className="text-lg font-bold tabular-nums">540 €</p>
        </div>
        <p className="mt-1 text-base font-bold text-braise">Se renouvelle dans 31 jours</p>
        <p className="text-sm text-gris">Aucun compte actif depuis 4 mois</p>
      </div>
    ),
  },
];

export default function Demo() {
  const dialogue = useRef<HTMLDialogElement>(null);
  const [ouvert, setOuvert] = useState(false);
  const [scene, setScene] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);

  useEffect(() => {
    if (!ouvert || !auto || scene >= scenes.length - 1) return;
    const minuteur = setTimeout(() => setScene((s) => s + 1), DUREE_SCENE);
    return () => clearTimeout(minuteur);
  }, [ouvert, auto, scene]);

  function ouvrir() {
    setScene(0);
    setOuvert(true);
    dialogue.current?.showModal();
  }

  const courante = scenes[scene];
  const derniere = scene === scenes.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        className="flex min-h-14 w-full items-center justify-center gap-3 border-2 border-white px-6 text-lg font-bold text-white transition-colors active:bg-white/15 sm:w-auto sm:min-w-72"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
          <path d="M3 1.5v15l13-7.5z" fill="currentColor" />
        </svg>
        Voir comment ça marche
      </button>

      <dialog
        ref={dialogue}
        onClose={() => setOuvert(false)}
        onClick={(e) => {
          if (e.target === dialogue.current) dialogue.current?.close();
        }}
        aria-labelledby="titre-demo"
        className="m-auto max-h-[92dvh] w-[min(94vw,36rem)] overflow-auto border-2 border-encre bg-papier p-0 text-encre backdrop:bg-encre/70"
      >
        {ouvert ? (
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-gris">
                Scène {scene + 1} sur {scenes.length}
              </p>
              <button
                type="button"
                onClick={() => dialogue.current?.close()}
                className="min-h-12 px-2 text-base font-bold underline underline-offset-4"
              >
                Fermer
              </button>
            </div>

            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {scenes.map((_, i) => (
                <span key={i} className={`h-1.5 flex-1 ${i <= scene ? "bg-rose" : "bg-trait"}`} />
              ))}
            </div>

            <h2 id="titre-demo" className="mt-6 font-titre text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {courante.titre}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-gris">{courante.texte}</p>

            <div key={scene} className="mt-6 min-h-52">
              {courante.visuel}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={() => setScene((s) => Math.max(0, s - 1))}
                disabled={scene === 0}
                className="min-h-12 text-base font-bold underline underline-offset-4 disabled:opacity-40"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuto(false);
                  setScene((s) => Math.min(scenes.length - 1, s + 1));
                }}
                disabled={derniere}
                className="min-h-12 text-base font-bold underline underline-offset-4 disabled:opacity-40"
              >
                Suivant
              </button>
              <button
                type="button"
                onClick={() => setAuto((a) => !a)}
                className="min-h-12 text-base font-bold underline underline-offset-4"
              >
                {auto ? "Mettre en pause" : "Lecture automatique"}
              </button>
            </div>

            {derniere ? (
              <Link
                href="/commencer"
                className="mt-4 flex min-h-14 w-full items-center justify-center bg-gradient-to-r from-rose to-violet px-6 text-lg font-bold text-white transition-transform active:scale-[0.98]"
              >
                Estimer ce que vous perdez
              </Link>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
