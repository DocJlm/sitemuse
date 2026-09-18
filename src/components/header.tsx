"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, Heart, Asterisk } from "@phosphor-icons/react";
import { copy } from "@/lib/i18n";
import type { Locale } from "@/lib/catalog";
import { useSaved } from "./saved";
export function Header({ locale }: { locale: Locale }) {
  const t = copy(locale),
    path = usePathname(),
    search = useSearchParams(),
    { ids } = useSaved();
  const alternate = locale === "zh" ? "en" : "zh";
  const switchUrl =
    path.replace(/^\/(zh|en)(?=\/|$)/, `/${alternate}`) +
    (search.toString() ? `?${search}` : "");
  return (
    <header className="header">
      <Link className="wordmark" href={`/${locale}`} aria-label="SiteMuse">
        <Asterisk size={30} weight="bold" />
        <span>
          SiteMuse<span className="wordmark-period">.</span>
        </span>
      </Link>
      <nav aria-label={locale === "zh" ? "主导航" : "Main navigation"}>
        <Link
          aria-current={path === `/${locale}` ? "page" : undefined}
          href={`/${locale}`}
        >
          {t.explore}
        </Link>
        <Link
          aria-current={path.includes("/saved") ? "page" : undefined}
          href={`/${locale}/saved`}
          className="saved-link"
        >
          <Heart size={17} />
          {t.saved}
          <span className="saved-count">{ids.length}</span>
        </Link>
        <Link
          aria-current={path.includes("/about") ? "page" : undefined}
          href={`/${locale}/about`}
        >
          {t.about}
        </Link>
      </nav>
      <div className="header-end">
        <Link href={switchUrl} aria-label={t.language} className="language">
          {alternate === "en" ? "EN" : "中文"}
          <span aria-hidden="true">↔</span>
        </Link>
        <a
          className="github-link"
          href="https://github.com/DocJlm/sitemuse"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ArrowUpRight size={14} />
        </a>
      </div>
    </header>
  );
}
