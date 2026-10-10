import { NextResponse } from "next/server";
import { adresseDuSite } from "@/lib/site";
import { creerClientServeur } from "@/lib/supabase/server";

// Le lien magique de l'e-mail arrive ici avec un code à usage unique.
export async function GET(requete: Request) {
  const site = adresseDuSite(requete);
  const code = new URL(requete.url).searchParams.get("code");

  if (code) {
    const supabase = await creerClientServeur();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${site}/app`);
      }
    }
  }

  return NextResponse.redirect(`${site}/connexion?erreur=lien`);
}
