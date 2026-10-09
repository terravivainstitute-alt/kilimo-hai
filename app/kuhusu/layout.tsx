import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuhusu Sisi: Agronomist wa Kilimo Hai",
  description:
    "Fahamu Agronomist wako: elimu, vyeti na uzoefu wa kusaidia wakulima kuboresha mazao kwa njia za kilimo hai.",
  alternates: { canonical: "/kuhusu" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
