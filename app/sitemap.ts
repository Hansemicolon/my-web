import type { MetadataRoute } from "next";

const SITE_URL = "https://ephemeral-2qiq.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
