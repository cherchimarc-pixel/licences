"use client";

import { useState, type FormEvent } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";

type Etat =
  | { type: "repos" }
  | { type: "envoi" }
  | { type: "envoye"; email: string }
  | { type: "erreur"; message: string };

export default function Formulaire({ messageInitial }: { messageInitial?: string }) {
  const [etat, setEtat] = useState<Etat>(
    messageInitial ? { type: "erreur", message: messageInitial } : { type: "repos" },
  );

  async function envoyer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    const email = String(donnees.get("email") ?? "").trim();

    if (email.length < 5 || email.length > 254 || !email.includes("@")) {
      setEtat({ type: "erreur", message: "Entrez une adresse e-mail valide." });
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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      const limite = error.status === 429;
      setEtat({
        type: "erreur",
        message: limite
          ? "Trop de demandes en peu de temps. Attendez quelques minutes avant de réessayer."
          : "Le lien n'a pas pu être envoyé. Vérifiez l'adresse et réessayez.",
      });
      return;
    }

    setEtat({ type: "envoye", email });
  }

  if (etat.type === "envoye") {
    return (
      <div role="status" className="mt-8 border-l-4 border-braise bg-white px-4 py-4">
        <p className="text-lg font-bold">Regardez vos e-mails.</p>
        <p className="mt-2 leading-relaxed text-gris">
          Nous avons envoyé un lien de connexion à {etat.email}. Ouvrez-le sur
          ce téléphone. Pensez à vérifier vos courriers indésirables.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="mt-8" noValidate>
      <label htmlFor="email" className="block text-base font-bold">
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

      {etat.type === "erreur" ? (
        <p role="alert" className="mt-3 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {etat.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={etat.type === "envoi"}
        className="mt-5 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce disabled:opacity-60"
      >
        {etat.type === "envoi" ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
      </button>
      <p className="mt-3 text-sm text-gris">
        Pas de mot de passe : un lien à usage unique vous est envoyé par e-mail.
      </p>
    </form>
  );
}
