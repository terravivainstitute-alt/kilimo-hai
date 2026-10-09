import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CartProvider } from "@/lib/CartContext";
import { getUiOverrides } from "@/lib/server-data";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const revalidate = 60;

const TITLE = "Kilimo Hai: Ushauri wa Kilimo Hai, Mbolea na Madawa ya Asili Tanzania";
const DESCRIPTION =
  "Ushauri wa kitaalamu wa kilimo hai, mbolea za asili (compost) na madawa ya asili ya wadudu kwa wakulima wa Tanzania.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "sw_TZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  // Weka NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION kwenye Vercel ili kuthibitisha tovuti kwenye Google Search Console
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const overrides = await getUiOverrides();

  return (
    <html lang="sw">
      <body>
        <LanguageProvider initialOverrides={overrides}>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
