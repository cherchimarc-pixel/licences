import { redirect } from "next/navigation";
import { creerClientServeur } from "@/lib/supabase/server";

export const metadata = {
  title: "Mon espace — Licences",
  robots: { index: false },
};

export default async function Espace() {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  async function deconnexion() {
    "use server";
    const client = await creerClientServeur();
    if (client) await client.auth.signOut();
    redirect("/");
  }

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>
      <h1 className="mt-6 font-titre text-4xl font-black leading-tight">
        Mon espace
      </h1>
      <p className="mt-2 text-base text-gris">Connecté : {user.email}</p>

      <section className="mt-10 border-2 border-dashed border-encre bg-white px-5 py-8">
        <h2 className="font-titre text-2xl font-bold leading-tight">
          Aucun abonnement pour l&apos;instant.
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-gris">
          Ici apparaîtra la liste de vos logiciels, avec ce que chacun coûte
          par an et par personne. La saisie arrive à la prochaine étape.
        </p>
      </section>

      <form action={deconnexion} className="mt-10">
        <button
          type="submit"
          className="min-h-12 text-base font-bold underline underline-offset-4"
        >
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
