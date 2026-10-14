"use client";

import { useEffect, useRef } from "react";

type Etoile = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  couleur: string;
  scintille: boolean;
  phase: number;
  vitesse: number;
  halo: boolean;
};

// Teintes réelles des étoiles : la plupart blanches, quelques-unes bleutées ou chaudes.
const COULEURS = ["255,255,255", "255,255,255", "255,255,255", "205,222,255", "170,200,255", "255,236,205"];

function creerEtoiles(largeur: number, hauteur: number): Etoile[] {
  const nombre = Math.round((largeur * hauteur) / 650);
  return Array.from({ length: nombre }, () => {
    const tirage = Math.random();
    const grosse = tirage > 0.985;
    const moyenne = tirage > 0.9;
    return {
      x: Math.random() * largeur,
      y: Math.random() * hauteur,
      r: grosse ? 1.3 + Math.random() * 0.7 : moyenne ? 0.8 + Math.random() * 0.4 : 0.3 + Math.random() * 0.45,
      alpha: grosse ? 1 : moyenne ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.55,
      couleur: COULEURS[Math.floor(Math.random() * COULEURS.length)],
      scintille: Math.random() < 0.18,
      phase: Math.random() * Math.PI * 2,
      vitesse: 0.0008 + Math.random() * 0.0018,
      halo: grosse,
    };
  });
}

export function Ciel() {
  const toile = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = toile.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let etoiles: Etoile[] = [];
    let largeur = 0;
    let hauteur = 0;
    let image = 0;
    let dernierDessin = 0;

    const dessiner = (instant: number) => {
      ctx.clearRect(0, 0, largeur, hauteur);
      for (const e of etoiles) {
        const alpha = e.scintille ? e.alpha * (0.55 + 0.45 * Math.sin(instant * e.vitesse + e.phase)) : e.alpha;
        if (e.halo) {
          const lueur = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
          lueur.addColorStop(0, `rgba(${e.couleur},${(alpha * 0.35).toFixed(3)})`);
          lueur.addColorStop(1, `rgba(${e.couleur},0)`);
          ctx.fillStyle = lueur;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${e.couleur},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const preparer = () => {
      const densite = Math.min(window.devicePixelRatio || 1, 2);
      largeur = window.innerWidth;
      hauteur = Math.max(window.innerHeight, window.screen.height);
      canvas.width = Math.round(largeur * densite);
      canvas.height = Math.round(hauteur * densite);
      canvas.style.height = `${hauteur}px`;
      ctx.setTransform(densite, 0, 0, densite, 0, 0);
      etoiles = creerEtoiles(largeur, hauteur);
      dessiner(0);
    };

    const boucle = (instant: number) => {
      if (instant - dernierDessin > 45) {
        dernierDessin = instant;
        dessiner(instant);
      }
      image = requestAnimationFrame(boucle);
    };

    const demarrer = () => {
      if (!mouvementReduit && !image) image = requestAnimationFrame(boucle);
    };
    const arreter = () => {
      if (image) cancelAnimationFrame(image);
      image = 0;
    };
    const changementVisibilite = () => (document.hidden ? arreter() : demarrer());

    // On ne refait le ciel que si la largeur change : la barre d'adresse du téléphone
    // modifie la hauteur en défilant, et les étoiles ne doivent pas bouger à ce moment.
    let largeurPrecedente = window.innerWidth;
    const redimension = () => {
      if (window.innerWidth === largeurPrecedente) return;
      largeurPrecedente = window.innerWidth;
      preparer();
    };

    preparer();
    demarrer();
    window.addEventListener("resize", redimension);
    document.addEventListener("visibilitychange", changementVisibilite);
    return () => {
      arreter();
      window.removeEventListener("resize", redimension);
      document.removeEventListener("visibilitychange", changementVisibilite);
    };
  }, []);

  return (
    <div aria-hidden="true" className="ciel">
      <svg className="ciel-nuage ciel-nuage-a" width="100%" height="100%" preserveAspectRatio="none">
        <filter id="gaz-a">
          <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.009" numOctaves="4" seed="11" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.36  0 0 0 0 0.27  0 0 0 0 0.95  2.6 0 0 0 -1.0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#gaz-a)" />
      </svg>
      <svg className="ciel-nuage ciel-nuage-b" width="100%" height="100%" preserveAspectRatio="none">
        <filter id="gaz-b">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="42" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.95  0 0 0 0 0.2  0 0 0 0 0.6  2.6 0 0 0 -1.05"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#gaz-b)" />
      </svg>
      <canvas ref={toile} className="ciel-toile" />
    </div>
  );
}

// Planète lointaine : surface texturée par du bruit, côté nuit sombre, liseré d'atmosphère.
export function Planete() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_0_36px_rgba(90,130,255,0.4)]">
      <defs>
        <radialGradient id="planete-base" cx="30%" cy="26%" r="85%">
          <stop offset="0" stopColor="#4a6be0" />
          <stop offset="0.4" stopColor="#1a2780" />
          <stop offset="1" stopColor="#03051a" />
        </radialGradient>
        <radialGradient id="planete-ombre" cx="27%" cy="24%" r="90%">
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0.9" />
          <stop offset="1" stopColor="#000" stopOpacity="0.97" />
        </radialGradient>
        <filter id="planete-bruit" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="5" seed="5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 1  1.8 0 0 0 -0.7" />
        </filter>
        <clipPath id="planete-disque">
          <circle cx="200" cy="200" r="190" />
        </clipPath>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#planete-base)" />
      <g clipPath="url(#planete-disque)">
        <rect width="400" height="400" filter="url(#planete-bruit)" opacity="0.4" />
      </g>
      <circle cx="200" cy="200" r="190" fill="url(#planete-ombre)" />
      <circle cx="200" cy="200" r="189" fill="none" stroke="#9dbbff" strokeOpacity="0.4" strokeWidth="2" />
    </svg>
  );
}
