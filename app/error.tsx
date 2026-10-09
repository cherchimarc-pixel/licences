"use client";

import Link from "next/link";

export default function Erreur({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <h1 className="font-titre text-3xl font-black leading-tight">
        Quelque chose s&apos;est mal passé.
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-gris">
        Ce n&apos;est pas de votre faute. Réessayez, ou revenez à l&apos;accueil.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white sm:w-auto sm:min-w-72"
      >
        Réessayer
      </button>
      <Link
        href="/"
        className="mt-3 flex min-h-14 w-full items-center justify-center border border-encre px-6 text-lg font-bold sm:w-auto sm:min-w-72"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
