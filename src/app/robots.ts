import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/meta";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/zh/saved", "/en/saved"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
