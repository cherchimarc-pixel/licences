import Link from "next/link";

export const metadata = {
  title: "Merci — Licences",
  robots: { index: false },
};

export default function Merci() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>
      <h1 className="mt-4 font-titre text-4xl font-black leading-tight">
        Merci, votre paiement est confirmé.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gris">
        Dernière étape : créez votre compte pour accéder à votre espace.
        Utilisez <strong className="text-encre">la même adresse e-mail que celle
        saisie lors du paiement</strong>, c&apos;est ce qui ouvre votre accès.
      </p>
      <Link
        href="/connexion"
        className="mt-8 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce sm:w-auto sm:min-w-72"
      >
        Créer mon compte
      </Link>
      <p className="mt-4 text-sm text-gris">
        Déjà un compte ? Sur la page suivante, choisissez « Me connecter ».
        Stripe vous a aussi envoyé un reçu par e-mail.
      </p>
    </main>
  );
}
