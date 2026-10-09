import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omba Ushauri wa Kilimo",
  description:
    "Tuma ombi la ushauri wa Agronomist kuhusu shamba lako: udongo, mbolea za asili na udhibiti wa wadudu.",
  alternates: { canonical: "/booking" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
