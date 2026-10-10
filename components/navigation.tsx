import Link from "next/link";

const liens = [
  { href: "/app", libelle: "Abonnements" },
  { href: "/app/personnes", libelle: "Personnes" },
  { href: "/app/analyse", libelle: "Analyse" },
  { href: "/app/renouvellements", libelle: "Échéances" },
];

export default function Navigation({ actif }: { actif: string }) {
  return (
    <nav aria-label="Mon espace" className="mt-6 grid grid-cols-4 border-2 border-encre text-center">
      {liens.map((lien) => {
        const courant = lien.href === actif;
        return (
          <Link
            key={lien.href}
            href={lien.href}
            aria-current={courant ? "page" : undefined}
            className={`flex min-h-12 items-center justify-center px-1 text-sm font-bold sm:text-base ${
              courant ? "bg-encre text-white" : "bg-white"
            }`}
          >
            {lien.libelle}
          </Link>
        );
      })}
    </nav>
  );
}
