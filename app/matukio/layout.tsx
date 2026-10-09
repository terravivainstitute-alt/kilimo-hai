import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matukio na Picha za Kazi Shambani",
  description:
    "Picha na video za matukio, mafunzo na kazi zetu shambani za kilimo hai.",
  alternates: { canonical: "/matukio" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
