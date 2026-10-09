import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        404
      </h1>
      <p className="mt-4 text-ink/70">Ukurasa huu haupatikani. / This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
      >
        Nyumbani / Home
      </Link>
    </div>
  );
}
