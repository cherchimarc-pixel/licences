import Link from "next/link";
import Navigation from "@/components/navigation";
import { contexteEspace } from "@/lib/contexte";
import { formaterDate, formaterEuros, joursAvant } from "@/lib/outils";

export const metadata = {
  title: "Échéances — Licences",
  robots: { index: false },
};

type Outil = {
  id: string;
  nom: string;
  cout_annuel: number | string;
  date_renouvellement: string | null;
};

export default async function Renouvellements() {
  const { supabase, entreprise } = await contexteEspace();

  const { data } = await supabase
    .from("outils")
    .select("id, nom, cout_annuel, date_renouvellement")
    .eq("entreprise_id", entreprise.id)
    .order("date_renouvellement", { ascending: true, nullsFirst: false });

  const outils = (data ?? []) as Outil[];
  const avecDate = outils.filter((o) => o.date_renouvellement);
  const sansDate = outils.filter((o) => !o.date_renouvellement);
  const aVenir = avecDate.filter((o) => joursAvant(o.date_renouvellement as string) >= 0);
  const passes = avecDate.filter((o) => joursAvant(o.date_renouvellement as string) < 0);

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-bleu">Licences</p>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">Échéances</h1>
      <Navigation actif="/app/renouvellements" />

      <p className="mt-6 text-base leading-relaxed text-gris">
        Les prochains renouvellements annuels, du plus proche au plus lointain.
        Décidez avant la date si vous gardez chaque outil.
      </p>

      {aVenir.length === 0 ? (
        <section className="mt-6 border-2 border-dashed border-encre bg-white px-5 py-8">
          <p className="text-lg leading-relaxed text-gris">
            Aucune échéance à venir. Ajoutez une date de renouvellement à vos
            outils dans l&apos;onglet Abonnements.
          </p>
        </section>
      ) : (
        <ul className="mt-6 divide-y divide-trait border-y border-trait">
          {aVenir.map((o) => {
            const jours = joursAvant(o.date_renouvellement as string);
            const proche = jours <= 60;
            return (
              <li key={o.id} className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold leading-snug">{o.nom}</h2>
                  <p className="whitespace-nowrap text-lg font-bold">
                    {formaterEuros(Number(o.cout_annuel))}
                  </p>
                </div>
                <p className={`mt-1 text-base ${proche ? "font-bold text-braise" : "text-gris"}`}>
                  {jours === 0
                    ? "Renouvellement aujourd'hui"
                    : `Dans ${jours} jour${jours > 1 ? "s" : ""}`}{" "}
                  · {formaterDate(o.date_renouvellement as string)}
                </p>
                <Link
                  href={`/app/outils/${o.id}`}
                  className="flex min-h-12 items-center text-base font-bold underline underline-offset-4"
                >
                  Voir les comptes
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {passes.length > 0 ? (
        <>
          <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Date dépassée</h2>
          <p className="mt-2 text-base text-gris">
            Mettez la date à jour si l&apos;outil a été renouvelé.
          </p>
          <ul className="mt-3 divide-y divide-trait border-y border-trait">
            {passes.map((o) => (
              <li key={o.id} className="py-4 text-base">
                <span className="font-bold">{o.nom}</span> ·{" "}
                {formaterDate(o.date_renouvellement as string)}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {sansDate.length > 0 ? (
        <>
          <h2 className="mt-10 font-titre text-2xl font-bold leading-tight">Sans date</h2>
          <p className="mt-2 text-base text-gris">
            Ces outils n&apos;ont pas de date de renouvellement : aucun rappel
            possible.
          </p>
          <ul className="mt-3 divide-y divide-trait border-y border-trait">
            {sansDate.map((o) => (
              <li key={o.id} className="py-4 text-base font-bold">
                {o.nom}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
