import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
import { sites, styles, isLocale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { SiteCard } from "@/components/site-card";
import { Gallery } from "@/components/gallery";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return meta(
    locale,
    locale === "zh" ? "网页灵感馆" : "A gallery of web inspiration",
    copy(locale).intro,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy(locale);
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{t.curated}</p>
        <h1>{t.hero}</h1>
        <div className="hero-bottom">
          <p>{t.intro}</p>
          <a href="#collection" className="hero-link">
            <span>
              {sites.length} {t.countLabel}
              <small>
                {Object.keys(styles).length} {t.stylesLabel}
              </small>
            </span>
            <ArrowDownRight size={32} />
          </a>
        </div>
      </section>
      <section className="featured">
        <div className="section-heading">
          <h2>{t.picks}</h2>
          <p>{t.pickNote}</p>
        </div>
        <div className="site-grid">
          {sites
            .filter((s) => s.featured)
            .slice(0, 3)
            .map((s) => (
              <SiteCard key={s.id} site={s} locale={locale} priority />
            ))}
        </div>
      </section>
      <Suspense fallback={<p>{t.collection}</p>}>
        <Gallery locale={locale} />
      </Suspense>
    </>
  );
}
