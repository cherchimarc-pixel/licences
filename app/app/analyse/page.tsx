import Link from "next/link";
import Navigation from "@/components/navigation";
import {
  SEUIL_INACTIVITE_JOURS,
  analyser,
  type LicenceLigne,
  type OutilLigne,
  type PersonneLigne,
} from "@/lib/analyse";
import { contexteEspace } from "@/lib/contexte";
import { formaterEuros } from "@/lib/outils";

export const metadata = {
  title: "Analyse — Licences",
  robots: { index: false },
};

export default async function Analyse() {
  const { supabase, entreprise } = await contexteEspace();

  const [{ data: outilsData }, { data: personnesData }, { data: licencesData }] =
    await Promise.all([
      supabase
        .from("outils")
        .select("id, nom, fonction, cout_annuel")
        .eq("entreprise_id", entreprise.id),
      supabase
        .from("personnes")
        .select("id, nom, statut")
        .eq("entreprise_id", entreprise.id),
      supabase.from("licences").select("id, outil_id, personne_id, derniere_utilisation"),
    ]);

  const outils = (outilsData ?? []) as OutilLigne[];
  const personnes = (personnesData ?? []) as PersonneLigne[];
  const licences = (licencesData ?? []) as LicenceLigne[];
  const a = analyser(outils, personnes, licences);

  if (outils.length === 0) {
    return (
      <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-bleu">Licences</p>
        <h1 className="mt-5 font-titre text-4xl font-black leading-tight">Analyse</h1>
        <Navigation actif="/app/analyse" />
        <section className="mt-8 border-2 border-dashed border-encre bg-white px-5 py-8">
          <h2 className="font-titre text-2xl font-bold leading-tight">
            Rien à analyser pour l&apos;instant.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-gris">
            Ajoutez d&apos;abord vos outils dans l&apos;onglet Abonnements. Les
            comptes inutilisés et les doublons apparaîtront ici.
          </p>
          <Link href="/app" className="mt-5 flex min-h-14 w-full items-center justify-center bg-bleu px-6 text-lg font-bold text-white">
            Ajouter un outil
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-bleu">Licences</p>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">Analyse</h1>
      <Navigation actif="/app/analyse" />

      <section className="mt-8 border-y border-trait py-6">
        <p className="font-titre text-5xl font-black leading-none">{formaterEuros(a.gaspillage)}</p>
        <p className="mt-2 text-lg leading-snug">
          par an payés pour des comptes à vérifier, sur {formaterEuros(a.total)} dépensés.
        </p>
        {licences.length === 0 ? (
          <p className="mt-3 text-base text-gris">
            Ce chiffre sera calculé quand vous aurez associé des comptes à vos
            outils (ouvrez un outil, puis « Ajouter un compte »).
          </p>
        ) : null}
      </section>

      <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Comptes à vérifier</h2>
      {a.inutilises.length === 0 ? (
        <p className="mt-3 text-base leading-relaxed text-gris">
          Aucun compte inutilisé repéré. Un compte est signalé quand la personne
          est partie, qu&apos;aucune personne n&apos;y est associée, ou que rien
          n&apos;a été ouvert depuis {SEUIL_INACTIVITE_JOURS} jours.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-trait border-y border-trait">
          {a.inutilises.map((c) => (
            <li key={c.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-lg font-bold leading-snug">
                  {c.outilNom}
                  {c.personneNom ? ` — ${c.personneNom}` : ""}
                </p>
                <p className="whitespace-nowrap text-lg font-bold text-braise">{formaterEuros(c.cout)}</p>
              </div>
              <p className="text-base text-gris">{c.raison}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Doublons de fonction</h2>
      {a.doublons.length === 0 ? (
        <p className="mt-3 text-base leading-relaxed text-gris">
          Aucun doublon repéré. Deux outils de même fonction (par exemple deux
          messageries) apparaîtraient ici.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-trait border-y border-trait">
          {a.doublons.map((d) => (
            <li key={d.fonction} className="py-4">
              <p className="text-lg font-bold leading-snug">
                {d.fonction} : {d.outils.length} outils, {formaterEuros(d.total)} par an
              </p>
              <p className="text-base text-gris">
                {d.outils.map((o) => `${o.nom} (${formaterEuros(o.cout)})`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Coût par outil</h2>
      <ul className="mt-4 divide-y divide-trait border-y border-trait">
        {a.coutParOutil.map((o) => (
          <li key={o.id} className="py-4">
            <Link href={`/app/outils/${o.id}`} className="flex items-start justify-between gap-4">
              <span className="text-lg font-bold leading-snug underline underline-offset-4">{o.nom}</span>
              <span className="whitespace-nowrap text-lg font-bold">{formaterEuros(o.cout)}</span>
            </Link>
            <p className="text-base text-gris">
              {o.nbComptes > 0
                ? `${o.nbComptes} compte${o.nbComptes > 1 ? "s" : ""}, ${formaterEuros(o.coutParCompte)} par compte`
                : "Aucun compte associé"}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Coût par personne</h2>
      {a.coutParPersonne.length === 0 ? (
        <p className="mt-3 text-base leading-relaxed text-gris">
          Ajoutez des personnes dans l&apos;onglet Personnes pour voir ce que
          chacune coûte.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-trait border-y border-trait">
          {a.coutParPersonne.map((p) => (
            <li key={p.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-lg font-bold leading-snug">
                  {p.nom}
                  {p.statut === "parti" ? " (parti·e)" : ""}
                </p>
                <p className="whitespace-nowrap text-lg font-bold">{formaterEuros(p.cout)}</p>
              </div>
              <p className="text-base text-gris">
                {p.nbComptes} compte{p.nbComptes > 1 ? "s" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
