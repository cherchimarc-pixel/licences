import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <p className="font-titre text-7xl font-black leading-none text-bleu">
        404
      </p>
      <h1 className="mt-4 font-titre text-3xl font-black leading-tight">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-gris">
        Le lien est peut-être erroné ou la page a été déplacée.
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
