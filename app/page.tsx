import type { Metadata } from "next";
import HomeView from "@/app/components/HomeView";
import JsonLd from "@/app/components/JsonLd";
import { getHomeData } from "@/lib/server-data";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Page() {
  const { hero, services } = await getHomeData();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo-mark.svg`,
          description:
            "Ushauri wa kitaalamu wa kilimo hai, mbolea za asili (compost) na madawa ya asili ya wadudu kwa wakulima wa Tanzania.",
          areaServed: "TZ",
          knowsAbout: ["Kilimo hai", "Organic farming", "Compost", "Madawa ya asili ya wadudu"],
        }}
      />
      <HomeView initialHero={hero} initialServices={services} />
    </>
  );
}
