"use client";

import { useFormStatus } from "react-dom";

// Bouton de formulaire : se désactive pendant l'envoi pour éviter un double enregistrement.
export default function BoutonEnvoi({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`${className ?? ""} disabled:cursor-wait disabled:opacity-60`}
    >
      {pending ? "Enregistrement…" : children}
    </button>
  );
}
