import type { MetadataRoute } from "next";
import { sites } from "@/lib/catalog";
import { baseUrl } from "@/lib/meta";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["zh", "en"].flatMap((locale) =>
    ["", "/about", ...sites.map((s) => `/sites/${s.slug}`)].map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      alternates: {
        languages: {
          "zh-CN": `${baseUrl}/zh${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    })),
  );
}
