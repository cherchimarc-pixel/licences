import PageLegale, { AComplete } from "@/components/page-legale";

export const metadata = { title: "Conditions générales de vente — Licences" };

export default function Cgv() {
  return (
    <PageLegale titre="Conditions générales de vente">
      <p>
        Ces conditions s&apos;appliquent à l&apos;abonnement au service Licences,
        proposé par <AComplete>raison sociale</AComplete> (SIRET{" "}
        <AComplete>numéro</AComplete>) à des clients professionnels.
      </p>

      <h2>Le service</h2>
      <p>
        Licences permet d&apos;inventorier les abonnements logiciels d&apos;une
        entreprise, de calculer leur coût par outil et par personne, de repérer
        les comptes inutilisés et les doublons, et de rappeler les dates de
        renouvellement. Le service ne garantit aucune économie : il fournit des
        informations à partir des données que vous saisissez.
      </p>

      <h2>Prix et paiement</h2>
      <p>
        L&apos;abonnement coûte 79 € par mois <AComplete>« HT » ou « TTC » selon votre régime de TVA</AComplete>,
        pour une entreprise. Il est payé par carte bancaire via Stripe et se
        renouvelle chaque mois.
      </p>

      <h2>Résiliation</h2>
      <p>
        Vous pouvez résilier à tout moment ; la résiliation prend effet à la
        fin de la période mensuelle en cours. Aucune durée minimale
        d&apos;engagement.
      </p>

      <h2>Garantie de remboursement</h2>
      <p>
        Si le service ne vous convient pas, vous êtes remboursé de votre
        premier paiement sur simple demande par e-mail, dans un délai de{" "}
        <AComplete>nombre de jours, par exemple 30</AComplete> jours après
        l&apos;achat.
      </p>

      <h2>Vos données</h2>
      <p>
        Les données saisies restent la propriété de votre entreprise. Voir la
        politique de confidentialité.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Le service est fourni « en l&apos;état ». Notre responsabilité est
        limitée au montant des sommes payées au cours des douze derniers mois.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le droit français s&apos;applique. En cas de litige, les parties
        chercheront d&apos;abord une solution amiable.
      </p>

      <p className="text-sm text-gris">
        Contact : <AComplete>adresse e-mail</AComplete>
      </p>
    </PageLegale>
  );
}
