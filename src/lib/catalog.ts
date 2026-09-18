import raw from "@/data/sites.json";
export type Locale = "zh" | "en";
export type Localized = Record<Locale, string>;
export interface Site {
  id: string;
  slug: string;
  name: string;
  author: string;
  url: string;
  image: string;
  type: string;
  styles: string[];
  featured: boolean;
  rank: number;
  verifiedAt: string;
  addedAt: string;
  description: Localized;
  takeaways: Record<Locale, string[]>;
  bestFor: Localized;
  links?: { label: Localized; url: string }[];
}
export const sites = raw as Site[];
export const types: Record<string, Localized> = {
  personal: { zh: "个人主页", en: "Personal" },
  portfolio: { zh: "作品集", en: "Portfolio" },
  blog: { zh: "博客", en: "Blog" },
  playground: { zh: "创意实验", en: "Playground" },
};
export const styles: Record<string, Localized> = {
  bold: { zh: "大胆配色", en: "Bold color" },
  minimal: { zh: "极简", en: "Minimal" },
  editorial: { zh: "编辑排版", en: "Editorial" },
  playful: { zh: "趣味交互", en: "Playful" },
  "3d": { zh: "三维场景", en: "3D" },
  retro: { zh: "复古", en: "Retro" },
  illustration: { zh: "插画", en: "Illustration" },
  dark: { zh: "深色", en: "Dark" },
  typography: { zh: "字体设计", en: "Typography" },
  brutalist: { zh: "粗野主义", en: "Brutalist" },
};
export const isLocale = (v: string): v is Locale => v === "zh" || v === "en";
export const domain = (url: string) =>
  new URL(url).hostname.replace(/^www\./, "");
export function related(site: Site) {
  return sites
    .filter((s) => s.id !== site.id)
    .sort((a, b) => {
      const score = (s: Site) =>
        s.styles.filter((t) => site.styles.includes(t)).length * 2 +
        Number(s.type === site.type);
      return score(b) - score(a) || a.rank - b.rank;
    })
    .slice(0, 3);
}
export interface Filters {
  q: string;
  types: string[];
  styles: string[];
  sort: string;
}
export function parseFilters(params: URLSearchParams): Filters {
  return {
    q: params.get("q") || "",
    types: (params.get("type") || "").split(",").filter((t) => t in types),
    styles: (params.get("style") || "").split(",").filter((t) => t in styles),
    sort: params.get("sort") === "new" ? "new" : "curated",
  };
}
export function filterSites(input: Site[], f: Filters) {
  const query = f.q.trim().toLocaleLowerCase();
  return input
    .filter(
      (s) =>
        (!f.types.length || f.types.includes(s.type)) &&
        (!f.styles.length || s.styles.some((t) => f.styles.includes(t))) &&
        (!query ||
          [
            s.name,
            s.author,
            domain(s.url),
            s.description.zh,
            s.description.en,
            s.bestFor.zh,
            s.bestFor.en,
            ...s.takeaways.zh,
            ...s.takeaways.en,
            types[s.type].zh,
            types[s.type].en,
            ...s.styles.flatMap((t) => [styles[t].zh, styles[t].en]),
          ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query)),
    )
    .sort((a, b) =>
      f.sort === "new"
        ? b.addedAt.localeCompare(a.addedAt) || a.rank - b.rank
        : a.rank - b.rank,
    );
}
