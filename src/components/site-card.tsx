import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { domain, styles, types, type Site, type Locale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { SaveButton } from "./saved";
export function SiteCard({
  site,
  locale,
  priority = false,
}: {
  site: Site;
  locale: Locale;
  priority?: boolean;
}) {
  const t = copy(locale);
  return (
    <article className="site-card" data-site-id={site.id}>
      <Link
        className="preview"
        href={`/${locale}/sites/${site.slug}`}
        aria-label={`${t.details}: ${site.name}`}
      >
        <Image
          src={site.image}
          alt={`${site.name}${t.imageAlt}`}
          width={1280}
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
          priority={priority}
        />
      </Link>
      <div className="card-heading">
        <div>
          <span className="card-type">{types[site.type][locale]}</span>
          <h3>
            <Link href={`/${locale}/sites/${site.slug}`}>
              {site.name}
              <ArrowUpRight size={18} />
            </Link>
          </h3>
        </div>
        <SaveButton id={site.id} name={site.name} locale={locale} />
      </div>
      <p className="card-description">{site.description[locale]}</p>
      <div className="card-bottom">
        <span>{domain(site.url)}</span>
        <div>
          {site.styles.slice(0, 2).map((s) => (
            <span className="tag" key={s}>
              {styles[s][locale]}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
