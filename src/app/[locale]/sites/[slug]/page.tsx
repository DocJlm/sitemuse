import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { sites, styles, types, isLocale, related, domain } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { SaveButton } from "@/components/saved";
import { SiteCard } from "@/components/site-card";
type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return sites.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const s = sites.find((s) => s.slug === slug);
  if (!s || !isLocale(locale)) return {};
  return meta(locale, s.name, s.description[locale], `/sites/${slug}`, s.image);
}
export default async function Detail({ params }: Props) {
  const { locale, slug } = await params;
  const s = sites.find((s) => s.slug === slug);
  if (!s || !isLocale(locale)) notFound();
  const t = copy(locale);
  return (
    <>
      <Link className="back-link" href={`/${locale}#collection`}>
        <ArrowLeft size={16} />
        {t.back}
      </Link>
      <section className="detail-title">
        <div>
          <p className="eyebrow">
            {types[s.type][locale]} / {s.author}
          </p>
          <h1>{s.name}</h1>
          <p>{s.description[locale]}</p>
        </div>
        <div className="detail-actions">
          <SaveButton id={s.id} name={s.name} locale={locale} label />
          <a
            className="button"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.visit}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <figure className="detail-image">
        <Image
          src={s.image}
          alt={`${s.name}${t.imageAlt}`}
          width={1280}
          height={800}
          sizes="(max-width: 1400px) 95vw, 1320px"
          priority
        />
        <figcaption>
          <span>
            {t.source}:{" "}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {domain(s.url)} ↗
            </a>
          </span>
          <span>
            {t.verified}: <time dateTime={s.verifiedAt}>{s.verifiedAt}</time>
          </span>
        </figcaption>
      </figure>
      <div className="detail-content">
        <section>
          <h2>{t.notes}</h2>
          <ol>
            {s.takeaways[locale].map((text, i) => (
              <li key={text}>
                <span>0{i + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <aside>
          <h2>{t.bestFor}</h2>
          <p>{s.bestFor[locale]}</p>
          <div className="detail-tags">
            {s.styles.map((tag) => (
              <Link key={tag} href={`/${locale}?style=${tag}#collection`}>
                {styles[tag][locale]}
              </Link>
            ))}
          </div>
          {!!s.links?.length && (
            <>
              <h2>{t.moreLinks}</h2>
              {s.links.map((l) => (
                <a
                  className="related-link"
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label[locale]} ↗
                </a>
              ))}
            </>
          )}
        </aside>
      </div>
      <section className="related">
        <div className="section-heading">
          <h2>{t.related}</h2>
        </div>
        <div className="site-grid">
          {related(s).map((site) => (
            <SiteCard key={site.id} site={site} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
