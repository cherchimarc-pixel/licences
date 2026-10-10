import Link from "next/link";
import Stripe from "stripe";

export const metadata = {
  title: "Merci — Licences",
  robots: { index: false },
};

// Vérifie auprès de Stripe que cette session de paiement est bien réglée.
async function paiementConfirme(sessionId: string | undefined): Promise<boolean> {
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete || !sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  try {
    const stripe = new Stripe(cleSecrete);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.status === "complete";
  } catch {
    return false;
  }
}

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;
  const confirme = await paiementConfirme(typeof session_id === "string" ? session_id : undefined);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">Licences</p>

      {confirme ? (
        <>
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
        </>
      ) : (
        <>
          <h1 className="mt-4 font-titre text-4xl font-black leading-tight">
            Nous n&apos;avons pas trouvé de paiement.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gris">
            Si vous venez de payer, patientez une minute et rechargez la page.
            Sinon, vous pouvez consulter l&apos;offre.
          </p>
          <Link
            href="/offre"
            className="mt-8 flex min-h-14 w-full items-center justify-center bg-encre px-6 text-lg font-bold text-white sm:w-auto sm:min-w-72"
          >
            Voir l&apos;offre
          </Link>
        </>
      )}
    </main>
  );
}
