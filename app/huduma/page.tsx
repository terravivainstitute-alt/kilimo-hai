import type { Metadata } from "next";
import HudumaView from "@/app/components/HudumaView";
import { getServices } from "@/lib/server-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Huduma za Kilimo Hai: Ushauri wa Agronomist na Ufuatiliaji wa Shamba",
  description:
    "Huduma za ushauri wa kilimo hai, mbolea za asili (compost), madawa ya asili ya wadudu na ufuatiliaji wa shamba kwa wakulima wakubwa na wadogo.",
  alternates: { canonical: "/huduma" },
};

export default async function Page() {
  const services = await getServices();
  return <HudumaView initialServices={services} />;
}
