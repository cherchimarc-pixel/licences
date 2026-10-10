import Link from "next/link";

export const metadata = {
  title: "Accès anticipé — Licences",
  description: "Licences : 79 € par mois pour toute l'entreprise, sans engagement.",
};

const messages: Record<string, string> = {
  annule: "Le paiement a été annulé. Vous n'avez rien payé.",
  echec:
    "Le paiement n'a pas pu démarrer. Vous n'avez rien payé. Réessayez dans un instant.",
};

export default async function Offre({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { paiement } = await searchParams;
  const message = typeof paiement === "string" ? messages[paiement] : undefined;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>
      <h1 className="mt-4 font-titre text-4xl font-black leading-tight">
        Accès anticipé à Licences
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gris">
        79&nbsp;€ par mois pour toute l&apos;entreprise, soit environ
        2,60&nbsp;€ par jour. Sans engagement, résiliable à tout moment.
      </p>

      {message ? (
        <p
          role="alert"
          className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base"
        >
          {message}
        </p>
      ) : null}

      <form action="/api/checkout" method="POST" className="mt-8">
        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce sm:w-auto sm:min-w-72"
        >
          Payer 79&nbsp;€ par mois
        </button>
        <p className="mt-3 text-sm text-gris">
          Sans engagement, résiliable à tout moment. Paiement sécurisé par
          Stripe. Environnement de test : aucune somme réelle n&apos;est prélevée.
        </p>
      </form>

      <Link
        href="/commencer"
        className="mt-8 text-base font-bold underline underline-offset-4"
      >
        Refaire l&apos;estimation
      </Link>
    </main>
  );
}
