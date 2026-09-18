import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { Gallery } from "@/components/gallery";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...meta(locale, copy(locale).saved, copy(locale).savedIntro, "/saved"),
    robots: { index: false, follow: true },
  };
}
export default async function Saved({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy(locale);
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">{t.saved}</p>
        <h1>{t.savedTitle}</h1>
        <p>{t.savedIntro}</p>
      </section>
      <Suspense fallback={<p>{t.loading}</p>}>
        <Gallery locale={locale} savedOnly />
      </Suspense>
    </>
  );
}
