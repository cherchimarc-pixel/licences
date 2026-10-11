import Link from "next/link";

export const metadata = {
  title: "Offre — Licences",
  description:
    "Licences : 79 € par mois pour toute l'entreprise, sans engagement, remboursé si le service ne vous convient pas.",
};

const messages: Record<string, string> = {
  annule: "Le paiement a été annulé. Vous n'avez rien payé.",
  requis: "",
  echec:
    "Le paiement n'a pas pu démarrer. Vous n'avez rien payé. Réessayez dans un instant.",
};

const questions = [
  {
    q: "Que dois-je saisir ?",
    r: "Vos outils avec leur prix, les personnes de l'entreprise et qui a un compte sur quoi. Comptez une vingtaine de minutes pour une première fois.",
  },
  {
    q: "Comment fonctionne le remboursement ?",
    r: "Si le service ne vous convient pas, écrivez-nous : votre premier paiement vous est remboursé, dans le délai indiqué dans les CGV.",
  },
  {
    q: "Puis-je arrêter quand je veux ?",
    r: "Oui. Aucun engagement : la résiliation prend effet à la fin du mois payé.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    r: "Elles sont stockées dans l'Union européenne, visibles uniquement par votre entreprise, et jamais revendues. Détails dans la politique de confidentialité.",
  },
];

export default async function Offre({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { paiement, acces } = await searchParams;
  const message =
    acces === "abonnement"
      ? "Aucun abonnement actif n'a été trouvé pour votre adresse e-mail. Si vous venez de payer, patientez une minute et rouvrez votre espace. Sinon, abonnez-vous ci-dessous avec la même adresse e-mail que votre compte."
      : typeof paiement === "string"
        ? messages[paiement]
        : undefined;

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-bleu">Licences</p>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">
        Une seule offre, tout compris.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gris">
        <span className="font-bold text-encre">79&nbsp;€ par mois</span> pour
        toute l&apos;entreprise, soit environ 2,60&nbsp;€ par jour. Sans
        engagement.
      </p>

      <ul className="mt-6 space-y-2 text-lg leading-snug">
        <li>— Inventaire de tous vos abonnements</li>
        <li>— Coût par outil et par personne</li>
        <li>— Comptes inutilisés et doublons repérés</li>
        <li>— Échéances de renouvellement</li>
      </ul>

      <section className="mt-8 border-2 border-encre bg-white px-5 py-4">
        <h2 className="font-titre text-xl font-bold leading-tight">Garantie de remboursement</h2>
        <p className="mt-2 text-base leading-relaxed">
          Si ça ne vous sert à rien, on vous rembourse. Sur simple demande par
          e-mail, sans justification.
        </p>
      </section>

      {message ? (
        <p role="alert" className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {message}
        </p>
      ) : null}

      <form action="/api/checkout" method="POST" className="mt-8">
        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center bg-bleu px-6 text-lg font-bold text-white transition-colors active:bg-bleu-fonce"
        >
          Payer 79&nbsp;€ par mois
        </button>
        <p className="mt-3 text-sm text-gris">
          Paiement sécurisé par Stripe. Environnement de test : aucune somme
          réelle n&apos;est prélevée pour l&apos;instant.
        </p>
      </form>

      <h2 className="mt-12 font-titre text-2xl font-bold leading-tight">Questions fréquentes</h2>
      <div className="mt-4 divide-y divide-trait border-y border-trait">
        {questions.map((f) => (
          <details key={f.q} className="group py-1">
            <summary className="flex min-h-14 cursor-pointer items-center text-lg font-bold">
              {f.q}
            </summary>
            <p className="pb-4 text-base leading-relaxed text-gris">{f.r}</p>
          </details>
        ))}
      </div>

      <Link href="/commencer" className="mt-8 inline-flex min-h-12 items-center text-base font-bold underline underline-offset-4">
        Refaire l&apos;estimation
      </Link>
    </main>
  );
}
