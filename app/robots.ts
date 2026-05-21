import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const host = (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return undefined;
    }
  })();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/parc-tabere-7qm2x9", "/api/admin"],
      },
    ],
    host,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
