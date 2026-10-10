import Navigation from "@/components/navigation";
import { contexteEspace } from "@/lib/contexte";
import { formaterDate } from "@/lib/outils";
import { ajouterPersonne, marquerParti, supprimerPersonne } from "./actions";

export const metadata = {
  title: "Personnes — Licences",
  robots: { index: false },
};

const messages: Record<string, string> = {
  nom: "Donnez un nom à la personne (120 caractères au maximum).",
  email: "L'adresse e-mail n'est pas valide.",
  enregistrement: "L'opération n'a pas pu être enregistrée. Réessayez dans un instant.",
};

type Personne = {
  id: string;
  nom: string;
  email: string | null;
  statut: string;
  date_depart: string | null;
};

export default async function Personnes({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { supabase, entreprise } = await contexteEspace();
  const { erreur, ajoute } = await searchParams;
  const message = typeof erreur === "string" ? messages[erreur] : undefined;

  const { data } = await supabase
    .from("personnes")
    .select("id, nom, email, statut, date_depart")
    .eq("entreprise_id", entreprise.id)
    .order("nom", { ascending: true });
  const personnes = (data ?? []) as Personne[];

  const champ = "mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-lg";

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">Licences</p>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">Personnes</h1>
      <Navigation actif="/app/personnes" />

      {ajoute ? (
        <p role="status" className="mt-6 border-l-4 border-encre bg-white px-4 py-3 text-base">
          Personne ajoutée.
        </p>
      ) : null}
      {message ? (
        <p role="alert" className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {message}
        </p>
      ) : null}

      {personnes.length === 0 ? (
        <section className="mt-8 border-2 border-dashed border-encre bg-white px-5 py-8">
          <h2 className="font-titre text-2xl font-bold leading-tight">
            Ajoutez les personnes de l&apos;entreprise.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-gris">
            Salariés, associés, prestataires : toute personne qui a un compte
            sur un de vos outils. Vous pourrez ensuite associer chaque compte à
            sa personne, et voir ce que chacune coûte.
          </p>
        </section>
      ) : (
        <ul className="mt-6 divide-y divide-trait border-y border-trait">
          {personnes.map((p) => (
            <li key={p.id} className="py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold leading-snug">{p.nom}</h2>
                  {p.email ? <p className="break-all text-base text-gris">{p.email}</p> : null}
                </div>
                {p.statut === "parti" ? (
                  <span className="whitespace-nowrap border border-encre px-2 py-1 text-sm font-bold">
                    Parti(e)
                  </span>
                ) : null}
              </div>
              {p.statut === "parti" && p.date_depart ? (
                <p className="mt-1 text-sm text-gris">Départ le {formaterDate(p.date_depart)}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-x-6">
                {p.statut !== "parti" ? (
                  <form action={marquerParti}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="min-h-12 text-base font-bold underline underline-offset-4">
                      Marquer comme parti(e)
                    </button>
                  </form>
                ) : null}
                <form action={supprimerPersonne}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="min-h-12 text-base font-bold underline underline-offset-4">
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <details open={personnes.length === 0 || undefined} className="mt-8 border-2 border-encre bg-white">
        <summary className="flex min-h-14 cursor-pointer items-center px-5 text-lg font-bold">
          Ajouter une personne
        </summary>
        <form action={ajouterPersonne} className="border-t-2 border-encre px-5 pb-6 pt-2">
          <label htmlFor="nom" className="mt-4 block text-base font-bold">
            Nom
          </label>
          <input id="nom" name="nom" type="text" required maxLength={120} placeholder="Par exemple : Julie Martin" className={champ} />

          <label htmlFor="email" className="mt-5 block text-base font-bold">
            E-mail (facultatif)
          </label>
          <input id="email" name="email" type="email" inputMode="email" maxLength={254} placeholder="julie@entreprise.fr" className={champ} />

          <button
            type="submit"
            className="mt-6 flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce"
          >
            Ajouter cette personne
          </button>
        </form>
      </details>
    </main>
  );
}
