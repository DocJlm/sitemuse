import type { Metadata } from "next";
import type { Locale } from "./catalog";
export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "sitemuse.vercel.app"}`;
export function meta(
  locale: Locale,
  title: string,
  description: string,
  path = "",
  image = "/og.png",
): Metadata {
  const url = `${baseUrl}/${locale}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": `${baseUrl}/zh${path}`,
        en: `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}/zh${path}`,
      },
    },
    openGraph: {
      title: `${title} | SiteMuse`,
      description,
      url,
      siteName: "SiteMuse",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      images: [{ url: image, width: 1280, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
