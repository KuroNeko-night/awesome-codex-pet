import type { MetadataRoute } from "next";

import { getAllPets } from "@/lib/pets";
import { getCollectionSlugs } from "@/lib/collection-catalog";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/collections`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/zh`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/install`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/zh/install`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/request`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/zh/request`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/guide`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
  const petEntries = getAllPets().map((pet) => ({
    url: `${siteConfig.url}/pets/${pet.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const collectionEntries = getCollectionSlugs(getAllPets()).map((slug) => ({
    url: `${siteConfig.url}/collections/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
  return [...staticEntries, ...collectionEntries, ...petEntries];
}
