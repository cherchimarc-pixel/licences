import Link from "next/link";

export default function Pied() {
  return (
    <footer className="mx-auto max-w-xl border-t border-trait px-5 pb-10 pt-6 text-sm text-gris sm:px-8">
      <nav aria-label="Informations légales" className="flex flex-wrap gap-x-6">
        <Link href="/mentions-legales" className="flex min-h-12 items-center underline underline-offset-4">
          Mentions légales
        </Link>
        <Link href="/cgv" className="flex min-h-12 items-center underline underline-offset-4">
          CGV
        </Link>
        <Link href="/confidentialite" className="flex min-h-12 items-center underline underline-offset-4">
          Confidentialité
        </Link>
      </nav>
    </footer>
  );
}
