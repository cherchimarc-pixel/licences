import Link from "next/link";
import Formulaire from "./formulaire";

export const metadata = {
  title: "Connexion — Licences",
  robots: { index: false },
};

const messages: Record<string, string> = {
  lien: "Ce lien n'a pas fonctionné. Connectez-vous avec votre e-mail et votre mot de passe.",
  configuration: "La connexion n'est pas encore configurée. Réessayez plus tard.",
};

export default async function Connexion({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  const { erreur } = await searchParams;
  const messageInitial = typeof erreur === "string" ? messages[erreur] : undefined;

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
      <Link
        href="/"
        className="text-sm font-bold uppercase tracking-[0.18em] text-braise"
      >
        Licences
      </Link>
      <h1 className="mt-6 font-titre text-4xl font-black leading-tight">
        Connexion
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-gris">
        Accédez à votre espace avec votre e-mail et un mot de passe.
      </p>
      <Formulaire messageInitial={messageInitial} />
    </main>
  );
}
