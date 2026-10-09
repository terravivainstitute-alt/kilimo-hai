/** Anwani kuu ya tovuti. Ukinunua domain, weka NEXT_PUBLIC_SITE_URL kwenye Vercel. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kilimo-hai.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Kilimo Hai";
