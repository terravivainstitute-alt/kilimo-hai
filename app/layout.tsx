import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kilimo-hai.vercel.app";
const DESCRIPTION =
  "Ushauri wa kitaalamu wa kilimo hai, mbolea za asili, na madawa ya asili ya wadudu kwa wakulima wa Tanzania.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kilimo Hai — Organic Farming Services",
  description: DESCRIPTION,
  openGraph: {
    title: "Kilimo Hai — Organic Farming Services",
    description: DESCRIPTION,
    siteName: "Kilimo Hai",
    locale: "sw_TZ",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Kilimo Hai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kilimo Hai — Organic Farming Services",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sw">
      <body>
        <LanguageProvider>
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
