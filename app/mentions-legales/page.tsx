import PageLegale, { AComplete } from "@/components/page-legale";

export const metadata = { title: "Mentions légales — Licences" };

export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales">
      <p>
        Le site Licences est édité par <AComplete>raison sociale ou nom et prénom de l&apos;entrepreneur</AComplete>,{" "}
        <AComplete>forme juridique, par exemple micro-entreprise</AComplete>.
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>SIRET : <AComplete>numéro SIRET</AComplete></li>
        <li>Adresse : <AComplete>adresse postale</AComplete></li>
        <li>Contact : <AComplete>adresse e-mail de contact</AComplete></li>
        <li>Directeur de la publication : <AComplete>nom</AComplete></li>
        <li>TVA : <AComplete>numéro de TVA, ou mention « TVA non applicable, art. 293 B du CGI » si vous êtes en franchise</AComplete></li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
        CA 91789, États-Unis. Les données sont stockées chez Supabase, dans
        l&apos;Union européenne.
      </p>

      <h2>Paiement</h2>
      <p>
        Les paiements sont traités par Stripe. Licences ne conserve aucun
        numéro de carte bancaire.
      </p>
    </PageLegale>
  );
}
