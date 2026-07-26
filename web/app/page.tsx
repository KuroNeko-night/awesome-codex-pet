import type { Metadata } from "next";

import { FeaturedCollections } from "@/components/featured-collections";
import { HeroSection } from "@/components/hero-section";
import { PetGallery } from "@/components/pet-gallery";
import { getCollections } from "@/lib/collection-catalog";
import { getAllPets, getCategories } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.title} — free Codex pet gallery and community`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "zh-CN": "/zh",
      "x-default": "/",
    },
  },
  openGraph: {
    title: `${siteConfig.title} — free Codex pet gallery and community`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    images: [
      {
        url: siteConfig.ogImage,
        width: siteConfig.ogImageWidth,
        height: siteConfig.ogImageHeight,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title} — free Codex pet gallery and community`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function HomePage() {
  const pets = getAllPets();
  const categories = getCategories(pets);
  const collections = getCollections(pets);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/#gallery`,
        name: `${siteConfig.title} — curated OpenAI Codex pet gallery`,
        description: siteConfig.description,
        url: siteConfig.url,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        inLanguage: ["en", "zh-CN"],
        isAccessibleForFree: true,
        potentialAction: [
          {
            "@type": "ViewAction",
            name: "Browse free Codex pets",
            target: `${siteConfig.url}/#gallery`,
          },
          {
            "@type": "InstallAction",
            name: "Install a Codex pet",
            target: `${siteConfig.url}/install`,
          },
          {
            "@type": "CreateAction",
            name: "Request a character from the community",
            target: `${siteConfig.url}/request`,
          },
        ],
        mainEntity: {
          "@type": "ItemList",
          name: "Curated Codex pets",
          numberOfItems: pets.length,
          itemListElement: pets.slice(0, 24).map((pet, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteConfig.url}/pets/${pet.slug}`,
            name: pet.localizedNames.zh
              ? `${pet.localizedNames.en ?? pet.name} / ${pet.localizedNames.zh}`
              : pet.name,
          })),
        },
      },
      {
        "@type": "Dataset",
        "@id": `${siteConfig.url}/#catalog`,
        name: "Awesome Codex Pet catalog",
        alternateName: "Codex 宠物目录",
        description:
          "A machine-readable catalog of free-to-browse community Codex pets, creators, localized names, categories, animation versions, licenses, previews, and one-step installation commands.",
        url: siteConfig.url,
        creator: {
          "@id": `${siteConfig.url}/#organization`,
        },
        isAccessibleForFree: true,
        inLanguage: ["en", "zh-CN"],
        keywords: siteConfig.keywords,
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${siteConfig.url}${siteConfig.catalog}`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${siteConfig.url}${siteConfig.collectionsCatalog}`,
          },
        ],
      },
    ],
  };

  return (
    <main>
      <HeroSection
        petCount={pets.length}
        categoryCount={categories.length}
        featured={pets}
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1720px]">
          <FeaturedCollections collections={collections} />
          <PetGallery pets={pets} categories={categories} />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </main>
  );
}
