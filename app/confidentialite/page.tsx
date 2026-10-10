import PageLegale, { AComplete } from "@/components/page-legale";

export const metadata = { title: "Politique de confidentialité — Licences" };

export default function Confidentialite() {
  return (
    <PageLegale titre="Confidentialité">
      <p>
        Responsable du traitement : <AComplete>raison sociale</AComplete>,
        joignable à <AComplete>adresse e-mail</AComplete>.
      </p>

      <h2>Données que nous conservons</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Votre adresse e-mail et votre mot de passe (chiffré), pour vous connecter.</li>
        <li>
          Ce que vous saisissez : outils, prix, dates de renouvellement, noms
          et e-mails des personnes de votre entreprise, et leurs comptes.
        </li>
        <li>Les informations de facturation gérées par Stripe. Nous ne voyons jamais votre numéro de carte.</li>
      </ul>

      <h2>Pourquoi</h2>
      <p>
        Uniquement pour faire fonctionner le service et vous facturer. Nous ne
        vendons pas vos données et ne les utilisons pas pour de la publicité.
      </p>

      <h2>Où et combien de temps</h2>
      <p>
        Les données sont stockées dans l&apos;Union européenne chez Supabase.
        Elles sont conservées tant que votre compte existe, puis supprimées
        <AComplete> délai, par exemple 3 mois après la résiliation</AComplete>.
        Les données de facturation sont gardées le temps imposé par la loi.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la correction, l&apos;export ou la
        suppression de vos données en écrivant à{" "}
        <AComplete>adresse e-mail</AComplete>. Vous pouvez aussi saisir la CNIL
        (cnil.fr).
      </p>

      <h2>Cookies et mesure d&apos;audience</h2>
      <p>
        Nous utilisons uniquement le cookie nécessaire à la connexion. Aucun
        cookie publicitaire.
      </p>
    </PageLegale>
  );
}
