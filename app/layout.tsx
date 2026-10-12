import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Pied from "@/components/pied";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Licences — Les logiciels payés par l'entreprise et utilisés par personne",
  description:
    "Retrouvez les abonnements oubliés, les comptes inutilisés et les doublons avant qu'ils ne se renouvellent. Pour les entreprises de 10 à 100 personnes.",
  openGraph: {
    title: "Vous payez des logiciels que personne n'utilise",
    description:
      "Licences repère les comptes inutilisés et les doublons, et vous prévient avant chaque renouvellement.",
    type: "website",
    locale: "fr_FR",
    siteName: "Licences",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vous payez des logiciels que personne n'utilise",
    description:
      "Licences repère les comptes inutilisés et les doublons, et vous prévient avant chaque renouvellement.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2538f5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh">
        {children}
        <Pied />
        <Analytics />
      </body>
    </html>
  );
}
