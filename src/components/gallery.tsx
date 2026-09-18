"use client";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlass, ArrowRight, Heart, X } from "@phosphor-icons/react";
import Link from "next/link";
import {
  sites,
  types,
  styles,
  filterSites,
  parseFilters,
  type Locale,
} from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { useSaved } from "./saved";
import { SiteCard } from "./site-card";
export function Gallery({
  locale,
  savedOnly = false,
}: {
  locale: Locale;
  savedOnly?: boolean;
}) {
  const params = useSearchParams(),
    f = parseFilters(new URLSearchParams(params)),
    t = copy(locale),
    { ids, ready } = useSaved();
  const results = filterSites(
    savedOnly ? sites.filter((s) => ids.includes(s.id)) : sites,
    f,
  );
  function update(key: string, value: string) {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (p.size ? `?${p}` : ""),
    );
  }
  function toggle(key: "type" | "style", value: string) {
    const current = key === "type" ? f.types : f.styles;
    update(
      key,
      current.includes(value)
        ? current.filter((s) => s !== value).join(",")
        : [...current, value].join(","),
    );
  }
  function clear() {
    window.history.replaceState(null, "", window.location.pathname);
  }
  const active = !!(f.q || f.types.length || f.styles.length);
  if (savedOnly && !ready)
    return (
      <p className="empty" role="status">
        {t.loading}
      </p>
    );
  if (savedOnly && !ids.some((id) => sites.some((s) => s.id === id)))
    return (
      <div className="empty">
        <Heart size={40} />
        <h2>{t.savedEmpty}</h2>
        <p>{t.savedEmptyText}</p>
        <Link className="button" href={`/${locale}`}>
          {t.browse}
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  return (
    <section className="collection" id="collection">
      <div className="collection-heading">
        <h2>
          {savedOnly ? t.saved : t.collection}
          <span>
            {savedOnly
              ? sites.filter((s) => ids.includes(s.id)).length
              : sites.length}
          </span>
        </h2>
        <label className="search">
          <MagnifyingGlass size={20} />
          <input
            aria-label={t.searchLabel}
            placeholder={t.search}
            value={f.q}
            onChange={(e) => update("q", e.target.value)}
          />
          {f.q && (
            <button aria-label={t.clear} onClick={() => update("q", "")}>
              <X size={16} />
            </button>
          )}
        </label>
      </div>
      <div className="filters">
        {(
          [
            ["type", types, f.types],
            ["style", styles, f.styles],
          ] as const
        ).map(([key, values, selected]) => (
          <fieldset key={key}>
            <legend>{key === "type" ? t.type : t.style}</legend>
            <div className="filter-options">
              <button
                aria-pressed={!selected.length}
                className={!selected.length ? "selected" : ""}
                onClick={() => update(key, "")}
              >
                {t.all}
              </button>
              {Object.entries(values).map(([id, name]) => (
                <button
                  key={id}
                  aria-pressed={selected.includes(id)}
                  className={selected.includes(id) ? "selected" : ""}
                  onClick={() => toggle(key, id)}
                >
                  {name[locale]}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="results-toolbar">
        <div aria-live="polite">
          {results.length} {t.results}
          {active && (
            <button className="clear" onClick={clear}>
              {t.clear}
              <X size={12} />
            </button>
          )}
        </div>
        <label>
          {t.sort}
          <select
            aria-label={t.sort}
            value={f.sort}
            onChange={(e) =>
              update("sort", e.target.value === "curated" ? "" : e.target.value)
            }
          >
            <option value="curated">{t.recommended}</option>
            <option value="new">{t.newest}</option>
          </select>
        </label>
      </div>
      {results.length ? (
        <div className="site-grid">
          {results.map((s) => (
            <SiteCard key={s.id} site={s} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <MagnifyingGlass size={40} />
          <h3>{t.empty}</h3>
          <p>{t.emptyText}</p>
          <button className="button" onClick={clear}>
            {t.clear}
          </button>
        </div>
      )}
    </section>
  );
}
