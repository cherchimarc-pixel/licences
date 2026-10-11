"use client";

import { useState, type FormEvent } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";

type Mode = "connexion" | "creation";

type Etat =
  | { type: "repos" }
  | { type: "envoi" }
  | { type: "confirmer"; email: string }
  | { type: "erreur"; message: string };

const LONGUEUR_MIN = 8;
const LONGUEUR_MAX = 72;

export default function Formulaire({ messageInitial }: { messageInitial?: string }) {
  const [mode, setMode] = useState<Mode>("connexion");
  const [etat, setEtat] = useState<Etat>(
    messageInitial ? { type: "erreur", message: messageInitial } : { type: "repos" },
  );

  function changerMode(nouveau: Mode) {
    setMode(nouveau);
    setEtat({ type: "repos" });
  }

  async function envoyer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    const email = String(donnees.get("email") ?? "").trim();
    const motDePasse = String(donnees.get("motdepasse") ?? "");

    if (email.length < 5 || email.length > 254 || !email.includes("@")) {
      setEtat({ type: "erreur", message: "Entrez une adresse e-mail valide." });
      return;
    }
    if (motDePasse.length < LONGUEUR_MIN || motDePasse.length > LONGUEUR_MAX) {
      setEtat({
        type: "erreur",
        message: `Le mot de passe doit contenir entre ${LONGUEUR_MIN} et ${LONGUEUR_MAX} caractères.`,
      });
      return;
    }

    const supabase = creerClientNavigateur();
    if (!supabase) {
      setEtat({
        type: "erreur",
        message: "La connexion n'est pas disponible pour le moment. Réessayez plus tard.",
      });
      return;
    }

    setEtat({ type: "envoi" });

    if (mode === "connexion") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });
      if (error) {
        setEtat({
          type: "erreur",
          message:
            error.status === 429
              ? "Trop de tentatives. Attendez quelques minutes avant de réessayer."
              : "E-mail ou mot de passe incorrect.",
        });
        return;
      }
      window.location.assign("/app");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });
    if (error) {
      const dejaPris = /already|registered/i.test(error.message);
      setEtat({
        type: "erreur",
        message: dejaPris
          ? "Un compte existe déjà avec cet e-mail. Connectez-vous."
          : error.status === 429
            ? "Trop de tentatives. Attendez quelques minutes avant de réessayer."
            : "Le compte n'a pas pu être créé. Vérifiez vos informations et réessayez.",
      });
      return;
    }

    if (data.session) {
      // Rechargement complet : le serveur doit voir la session toute neuve.
      window.location.assign("/app");
      return;
    }
    setEtat({ type: "confirmer", email });
  }

  if (etat.type === "confirmer") {
    return (
      <div role="status" className="mt-8 border-l-4 border-braise bg-white px-4 py-4">
        <p className="text-lg font-bold">Un dernier geste.</p>
        <p className="mt-2 leading-relaxed text-gris">
          Nous avons envoyé un e-mail de confirmation à {etat.email}. Ouvrez-le
          pour activer votre compte, puis revenez vous connecter.
        </p>
        <button
          type="button"
          onClick={() => changerMode("connexion")}
          className="mt-4 min-h-12 text-base font-bold underline underline-offset-4"
        >
          Aller à la connexion
        </button>
      </div>
    );
  }

  const creation = mode === "creation";

  return (
    <form onSubmit={envoyer} className="mt-8" noValidate>
      <div className="grid grid-cols-2 border-2 border-encre">
        <button
          type="button"
          onClick={() => changerMode("connexion")}
          aria-pressed={!creation}
          className={`min-h-12 text-base font-bold ${!creation ? "bg-encre text-white" : "bg-white"}`}
        >
          Me connecter
        </button>
        <button
          type="button"
          onClick={() => changerMode("creation")}
          aria-pressed={creation}
          className={`min-h-12 text-base font-bold ${creation ? "bg-encre text-white" : "bg-white"}`}
        >
          Créer un compte
        </button>
      </div>

      <label htmlFor="email" className="mt-6 block text-base font-bold">
        Votre adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder="prenom@entreprise.fr"
        className="mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-lg"
      />

      <label htmlFor="motdepasse" className="mt-5 block text-base font-bold">
        Mot de passe
      </label>
      <input
        id="motdepasse"
        name="motdepasse"
        type="password"
        autoComplete={creation ? "new-password" : "current-password"}
        required
        minLength={LONGUEUR_MIN}
        maxLength={LONGUEUR_MAX}
        className="mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-lg"
      />
      {creation ? (
        <p className="mt-2 text-sm text-gris">
          Au moins {LONGUEUR_MIN} caractères.
        </p>
      ) : null}

      {etat.type === "erreur" ? (
        <p role="alert" className="mt-4 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {etat.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={etat.type === "envoi"}
        className="mt-6 flex min-h-14 w-full items-center justify-center bg-bleu px-6 text-lg font-bold text-white transition-colors active:bg-bleu-fonce disabled:opacity-60"
      >
        {etat.type === "envoi"
          ? "Un instant…"
          : creation
            ? "Créer mon compte"
            : "Me connecter"}
      </button>
    </form>
  );
}
