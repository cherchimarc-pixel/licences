import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import { contexteEspace } from "@/lib/contexte";
import { FONCTIONS, formaterDate, formaterEuros, joursAvant } from "@/lib/outils";
import { creerClientServeur } from "@/lib/supabase/server";
import { ajouterOutil, supprimerOutil } from "./actions";

export const metadata = {
  title: "Mon espace — Licences",
  robots: { index: false },
};

const messages: Record<string, string> = {
  nom: "Donnez un nom à l'outil (120 caractères au maximum).",
  fonction: "Choisissez une fonction dans la liste.",
  periode: "Indiquez si le montant est par mois ou par an.",
  montant: "Entrez un montant valide, en euros (par exemple 12,50).",
  date: "La date de renouvellement n'est pas valide.",
  enregistrement: "L'opération n'a pas pu être enregistrée. Réessayez dans un instant.",
};

type Outil = {
  id: string;
  nom: string;
  fonction: string;
  cout_annuel: number | string;
  date_renouvellement: string | null;
};

export default async function Espace({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { supabase, user, entreprise } = await contexteEspace();

  const { erreur, ajoute } = await searchParams;
  const message = typeof erreur === "string" ? messages[erreur] : undefined;

  const { data } = await supabase
    .from("outils")
    .select("id, nom, fonction, cout_annuel, date_renouvellement")
    .eq("entreprise_id", entreprise.id)
    .order("date_renouvellement", { ascending: true, nullsFirst: false });

  const outils = (data ?? []) as Outil[];
  const total = outils.reduce((somme, o) => somme + Number(o.cout_annuel), 0);

  async function deconnexion() {
    "use server";
    const client = await creerClientServeur();
    if (client) await client.auth.signOut();
    redirect("/");
  }

  const champ = "mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-lg";

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">
        Vos abonnements
      </h1>
      <p className="mt-2 text-base text-gris">Connecté : {user.email}</p>
      <Navigation actif="/app" />

      {outils.length > 0 ? (
        <section className="mt-8 border-y border-trait py-6">
          <p className="font-titre text-5xl font-black leading-none">
            {formaterEuros(total)}
          </p>
          <p className="mt-2 text-lg leading-snug">
            par an pour {outils.length} {outils.length > 1 ? "outils" : "outil"}.
          </p>
        </section>
      ) : null}

      {ajoute ? (
        <p role="status" className="mt-6 border-l-4 border-encre bg-white px-4 py-3 text-base">
          Outil ajouté.
        </p>
      ) : null}
      {message ? (
        <p role="alert" className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {message}
        </p>
      ) : null}

      {outils.length === 0 ? (
        <section className="mt-8 border-2 border-dashed border-encre bg-white px-5 py-8">
          <h2 className="font-titre text-2xl font-bold leading-tight">
            Commencez par un premier outil.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-gris">
            Messagerie, design, comptabilité… Ajoutez un logiciel que votre
            entreprise paie, avec son prix. Le total par an apparaît dès le
            premier.
          </p>
        </section>
      ) : (
        <ul className="mt-6 divide-y divide-trait border-y border-trait">
          {outils.map((outil) => {
            const jours = outil.date_renouvellement ? joursAvant(outil.date_renouvellement) : null;
            const proche = jours !== null && jours >= 0 && jours <= 60;
            return (
              <li key={outil.id} className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold leading-snug">{outil.nom}</h2>
                    <p className="text-base text-gris">{outil.fonction}</p>
                  </div>
                  <p className="whitespace-nowrap text-lg font-bold">
                    {formaterEuros(Number(outil.cout_annuel))}
                    <span className="text-sm font-normal text-gris"> / an</span>
                  </p>
                </div>
                {outil.date_renouvellement ? (
                  <p className={`mt-2 text-base ${proche ? "font-bold text-braise" : "text-gris"}`}>
                    {jours !== null && jours < 0
                      ? `Renouvelé le ${formaterDate(outil.date_renouvellement)}`
                      : `Renouvellement le ${formaterDate(outil.date_renouvellement)}${
                          proche ? ` (dans ${jours} jour${jours > 1 ? "s" : ""})` : ""
                        }`}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-x-6">
                  <Link
                    href={`/app/outils/${outil.id}`}
                    className="flex min-h-12 items-center text-base font-bold underline underline-offset-4"
                  >
                    Comptes sur cet outil
                  </Link>
                  <form action={supprimerOutil}>
                    <input type="hidden" name="id" value={outil.id} />
                    <button
                      type="submit"
                      className="min-h-12 text-base font-bold underline underline-offset-4"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <details open={outils.length === 0 || undefined} className="mt-8 border-2 border-encre bg-white">
        <summary className="flex min-h-14 cursor-pointer items-center px-5 text-lg font-bold">
          Ajouter un outil
        </summary>
        <form action={ajouterOutil} className="border-t-2 border-encre px-5 pb-6 pt-2">
          <label htmlFor="nom" className="mt-4 block text-base font-bold">
            Nom de l&apos;outil
          </label>
          <input id="nom" name="nom" type="text" required maxLength={120} placeholder="Par exemple : Slack" className={champ} />

          <label htmlFor="fonction" className="mt-5 block text-base font-bold">
            À quoi il sert
          </label>
          <select id="fonction" name="fonction" required defaultValue="" className={champ}>
            <option value="" disabled>
              Choisir…
            </option>
            {FONCTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="montant" className="block text-base font-bold">
                Montant (€)
              </label>
              <input id="montant" name="montant" type="text" inputMode="decimal" required placeholder="12,50" className={champ} />
            </div>
            <div>
              <label htmlFor="periode" className="block text-base font-bold">
                Payé
              </label>
              <select id="periode" name="periode" required defaultValue="mois" className={champ}>
                <option value="mois">par mois</option>
                <option value="an">par an</option>
              </select>
            </div>
          </div>
          <p className="mt-2 text-sm text-gris">
            Le prix total pour toute l&apos;entreprise, pas par personne.
          </p>

          <label htmlFor="date_renouvellement" className="mt-5 block text-base font-bold">
            Prochain renouvellement (facultatif)
          </label>
          <input id="date_renouvellement" name="date_renouvellement" type="date" className={champ} />

          <button
            type="submit"
            className="mt-6 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce"
          >
            Ajouter cet outil
          </button>
        </form>
      </details>

      <form action={deconnexion} className="mt-10">
        <button type="submit" className="min-h-12 text-base font-bold underline underline-offset-4">
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
