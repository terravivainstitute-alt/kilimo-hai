import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wasiliana Nasi",
  description:
    "Wasiliana na Kilimo Hai kwa simu, WhatsApp au barua pepe kwa ushauri wa kilimo hai na bidhaa za asili.",
  alternates: { canonical: "/wasiliana" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
