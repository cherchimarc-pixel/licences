import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation";
import { contexteEspace } from "@/lib/contexte";
import { UUID_REGEX, formaterDate, formaterEuros } from "@/lib/outils";
import { ajouterCompte, supprimerCompte } from "./actions";

export const metadata = {
  title: "Comptes d'un outil — Licences",
  robots: { index: false },
};

const messages: Record<string, string> = {
  personne: "Choisissez une personne dans la liste.",
  date: "La date n'est pas valide.",
  doublon: "Cette personne a déjà un compte sur cet outil.",
  enregistrement: "L'opération n'a pas pu être enregistrée. Réessayez dans un instant.",
};

type Compte = { id: string; personne_id: string | null; derniere_utilisation: string | null };
type Personne = { id: string; nom: string; statut: string };

export default async function Outil({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) notFound();

  const { supabase, entreprise } = await contexteEspace();
  const { erreur, ajoute } = await searchParams;
  const message = typeof erreur === "string" ? messages[erreur] : undefined;

  const { data: outil } = await supabase
    .from("outils")
    .select("id, nom, fonction, cout_annuel")
    .eq("id", id)
    .eq("entreprise_id", entreprise.id)
    .maybeSingle();
  if (!outil) notFound();

  const { data: comptesData } = await supabase
    .from("licences")
    .select("id, personne_id, derniere_utilisation")
    .eq("outil_id", id);
  const comptes = (comptesData ?? []) as Compte[];

  const { data: personnesData } = await supabase
    .from("personnes")
    .select("id, nom, statut")
    .eq("entreprise_id", entreprise.id)
    .order("nom", { ascending: true });
  const personnes = (personnesData ?? []) as Personne[];
  const personneParId = new Map(personnes.map((p) => [p.id, p]));

  const coutAnnuel = Number(outil.cout_annuel);
  const parCompte = comptes.length > 0 ? coutAnnuel / comptes.length : null;
  const champ = "mt-2 min-h-14 w-full border-2 border-encre bg-white px-4 text-lg";

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-bleu">Licences</p>
      <Navigation actif="/app" />

      <Link href="/app" className="mt-6 inline-flex min-h-12 items-center text-base font-bold underline underline-offset-4">
        Retour aux abonnements
      </Link>

      <h1 className="mt-2 font-titre text-4xl font-black leading-tight">{outil.nom}</h1>
      <p className="mt-1 text-base text-gris">
        {outil.fonction} · {formaterEuros(coutAnnuel)} par an
        {parCompte !== null ? ` · ${formaterEuros(Math.round(parCompte * 100) / 100)} par compte` : ""}
      </p>

      {ajoute ? (
        <p role="status" className="mt-6 border-l-4 border-encre bg-white px-4 py-3 text-base">
          Compte ajouté.
        </p>
      ) : null}
      {message ? (
        <p role="alert" className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base">
          {message}
        </p>
      ) : null}

      <h2 className="mt-8 font-titre text-2xl font-bold leading-tight">
        Qui a un compte sur cet outil
      </h2>

      {comptes.length === 0 ? (
        <section className="mt-4 border-2 border-dashed border-encre bg-white px-5 py-6">
          <p className="text-lg leading-relaxed text-gris">
            Aucun compte pour l&apos;instant. Ajoutez les personnes qui
            utilisent cet outil : nous répartirons son coût entre elles.
          </p>
        </section>
      ) : (
        <ul className="mt-4 divide-y divide-trait border-y border-trait">
          {comptes.map((c) => {
            const p = c.personne_id ? personneParId.get(c.personne_id) : undefined;
            return (
              <li key={c.id} className="py-4">
                <p className="text-lg font-bold leading-snug">
                  {p ? p.nom : "Personne supprimée"}
                  {p?.statut === "parti" ? " (parti·e)" : ""}
                </p>
                <p className="text-base text-gris">
                  {c.derniere_utilisation
                    ? `Dernière utilisation le ${formaterDate(c.derniere_utilisation)}`
                    : "Dernière utilisation inconnue"}
                </p>
                <form action={supprimerCompte} className="mt-1">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="outil_id" value={outil.id} />
                  <button type="submit" className="min-h-12 text-base font-bold underline underline-offset-4">
                    Retirer ce compte
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      {personnes.length === 0 ? (
        <p className="mt-6 text-base leading-relaxed text-gris">
          Pour ajouter un compte, ajoutez d&apos;abord des personnes dans
          l&apos;onglet{" "}
          <Link href="/app/personnes" className="font-bold underline underline-offset-4">
            Personnes
          </Link>
          .
        </p>
      ) : (
        <details open={comptes.length === 0 || undefined} className="mt-6 border-2 border-encre bg-white">
          <summary className="flex min-h-14 cursor-pointer items-center px-5 text-lg font-bold">
            Ajouter un compte
          </summary>
          <form action={ajouterCompte} className="border-t-2 border-encre px-5 pb-6 pt-2">
            <input type="hidden" name="outil_id" value={outil.id} />

            <label htmlFor="personne_id" className="mt-4 block text-base font-bold">
              Personne
            </label>
            <select id="personne_id" name="personne_id" required defaultValue="" className={champ}>
              <option value="" disabled>
                Choisir…
              </option>
              {personnes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                  {p.statut === "parti" ? " (parti·e)" : ""}
                </option>
              ))}
            </select>

            <label htmlFor="derniere_utilisation" className="mt-5 block text-base font-bold">
              Dernière utilisation (facultatif)
            </label>
            <input id="derniere_utilisation" name="derniere_utilisation" type="date" className={`${champ} block min-w-0 max-w-full appearance-none text-left`} />
            <p className="mt-2 text-sm text-gris">
              Si vous la connaissez : c&apos;est ce qui permet de repérer les
              comptes qui ne servent plus.
            </p>

            <button
              type="submit"
              className="mt-6 flex min-h-14 w-full items-center justify-center bg-bleu px-6 text-lg font-bold text-white transition-colors active:bg-bleu-fonce"
            >
              Ajouter ce compte
            </button>
          </form>
        </details>
      )}
    </main>
  );
}
