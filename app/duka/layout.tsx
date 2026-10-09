import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duka: Mbolea za Asili (Compost) na Madawa ya Wadudu",
  description:
    "Nunua mbolea za asili (compost) na madawa ya asili ya kuzuia wadudu wa shambani kabla na baada ya kuvuna. Agiza mtandaoni na ulipe kwa mobile money.",
  alternates: { canonical: "/duka" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
