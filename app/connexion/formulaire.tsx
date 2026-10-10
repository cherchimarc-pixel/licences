"use client";

import { useState, type FormEvent } from "react";
import { creerClientNavigateur } from "@/lib/supabase/client";

type Etat =
  | { type: "repos" }
  | { type: "envoi" }
  | { type: "code"; email: string; message?: string }
  | { type: "verification"; email: string }
  | { type: "erreur"; message: string };

export default function Formulaire({ messageInitial }: { messageInitial?: string }) {
  const [etat, setEtat] = useState<Etat>(
    messageInitial ? { type: "erreur", message: messageInitial } : { type: "repos" },
  );

  async function envoyerEmail(evenement: FormEvent<HTMLFormElement>) {
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
          : "L'e-mail n'a pas pu être envoyé. Vérifiez l'adresse et réessayez.",
      });
      return;
    }

    setEtat({ type: "code", email });
  }

  async function verifierCode(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    if (etat.type !== "code") return;
    const email = etat.email;

    const donnees = new FormData(evenement.currentTarget);
    const code = String(donnees.get("code") ?? "").replace(/\D/g, "");

    if (code.length < 6 || code.length > 10) {
      setEtat({ type: "code", email, message: "Entrez le code à chiffres reçu par e-mail." });
      return;
    }

    const supabase = creerClientNavigateur();
    if (!supabase) {
      setEtat({ type: "code", email, message: "La connexion n'est pas disponible pour le moment." });
      return;
    }

    setEtat({ type: "verification", email });

    let { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      // Première connexion : le code est de type « signup ».
      const essai = await supabase.auth.verifyOtp({ email, token: code, type: "signup" });
      error = essai.error;
    }

    if (error) {
      setEtat({
        type: "code",
        email,
        message: "Ce code est incorrect ou a expiré. Vérifiez-le ou demandez-en un nouveau.",
      });
      return;
    }

    // Rechargement complet : le serveur doit voir la session toute neuve.
    window.location.assign("/app");
  }

  if (etat.type === "code" || etat.type === "verification") {
    const enCours = etat.type === "verification";
    const message = etat.type === "code" ? etat.message : undefined;
    return (
      <form onSubmit={verifierCode} className="mt-8" noValidate>
        <div role="status" className="border-l-4 border-braise bg-white px-4 py-4">
          <p className="text-lg font-bold">Regardez vos e-mails.</p>
          <p className="mt-2 leading-relaxed text-gris">
            Nous avons envoyé un e-mail à {etat.email}. Saisissez ci-dessous le
            code qu&apos;il contient. Pensez à vérifier vos courriers
            indésirables.
          </p>
        </div>

        <label htmlFor="code" className="mt-6 block text-base font-bold">
          Code reçu par e-mail
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={12}
          required
          placeholder="123456"
          className="mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-center text-2xl tracking-[0.3em]"
        />

        {message ? (
          <p role="alert" className="mt-3 border-l-4 border-braise bg-white px-4 py-3 text-base">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={enCours}
          className="mt-5 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce disabled:opacity-60"
        >
          {enCours ? "Vérification…" : "Me connecter"}
        </button>

        <button
          type="button"
          onClick={() => setEtat({ type: "repos" })}
          className="mt-4 min-h-12 text-base font-bold underline underline-offset-4"
        >
          Utiliser une autre adresse
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={envoyerEmail} className="mt-8" noValidate>
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
        {etat.type === "envoi" ? "Envoi en cours…" : "Recevoir mon code de connexion"}
      </button>
      <p className="mt-3 text-sm text-gris">
        Pas de mot de passe : un code à usage unique vous est envoyé par e-mail.
      </p>
    </form>
  );
}
