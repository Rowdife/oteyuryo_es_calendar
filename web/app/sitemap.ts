import { MetadataRoute } from "next";
import { getPostings } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://es-calendar.example.com"; // TODO: 本番URLに変更
  const postings = getPostings();

  const postingUrls: MetadataRoute.Sitemap = postings.map((posting) => ({
    url: `${baseUrl}/p/${posting.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postingUrls,
  ];
}
