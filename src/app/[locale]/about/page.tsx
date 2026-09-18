import { notFound } from "next/navigation";
import { isLocale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { meta } from "@/lib/meta";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return meta(locale, copy(locale).about, copy(locale).aboutIntro, "/about");
}
export default async function About({
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
        <p className="eyebrow">ABOUT SITEMUSE</p>
        <h1>{t.aboutTitle}</h1>
        <p>{t.aboutIntro}</p>
      </section>
      <div className="about-content">
        <section>
          <h2>{t.principles}</h2>
          <ul>
            {t.principleItems.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t.maintenance}</h2>
          <p>{t.maintenanceText}</p>
          <a
            className="text-link"
            href="https://github.com/DocJlm/sitemuse"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </section>
        <section>
          <h2>{t.attribution}</h2>
          <p>{t.attributionText}</p>
        </section>
        <section>
          <h2>{t.privacy}</h2>
          <p>{t.privacyText}</p>
        </section>
      </div>
    </>
  );
}
