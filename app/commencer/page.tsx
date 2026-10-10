import Link from "next/link";
import Quiz from "./quiz";

export const metadata = {
  title: "Chiffrez vos licences inutilisées — Licences",
  description:
    "Trois questions, deux minutes : estimez ce que votre entreprise paie pour des logiciels que personne n'utilise.",
};

export default function Commencer() {
  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
      <Link
        href="/"
        className="text-sm font-bold uppercase tracking-[0.18em] text-braise"
      >
        Licences
      </Link>
      <Quiz />
    </main>
  );
}
