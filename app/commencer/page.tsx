import Link from "next/link";

export const metadata = {
  title: "Commencer — Licences",
  description: "Trois questions pour chiffrer ce que vos logiciels vous coûtent.",
};

export default function Commencer() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>
      <h1 className="mt-4 font-titre text-4xl font-black leading-tight">
        Les trois questions arrivent.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gris">
        Cette page est en cours de construction. Revenez très bientôt.
      </p>
      <Link
        href="/"
        className="mt-8 flex min-h-14 w-full items-center justify-center bg-encre px-6 text-lg font-bold text-white sm:w-auto sm:min-w-72"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
