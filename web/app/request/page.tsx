import type { Metadata } from "next";

import { RequestPageContent } from "@/components/request-page-content";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

const title = "Request a Codex pet for free";
const description =
  "Request a Codex pet for an anime character, game character, mascot, animal, or original idea. Submitting is free, and an Awesome Codex Pet community contributor may volunteer to make it.";
const pageUrl = `${siteConfig.url}/request`;
const faq = [
  {
    question: "Does it cost money to request a Codex pet?",
    answer:
      "No. Opening a request is free. Community contributors may volunteer to create it, but completion and acceptance are not guaranteed.",
  },
  {
    question: "Can I request an anime or game character?",
    answer:
      "Yes. Include the character name, original work, a recognizable public reference, and honest source information.",
  },
  {
    question: "Do I need to make the spritesheet myself?",
    answer:
      "No. A clear character request and references are enough for the request queue.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "request Codex pet",
    "free Codex pet request",
    "ask community to make Codex pet",
    "anime Codex pet request",
    "game character Codex pet request",
    "custom Codex pet request",
  ],
  alternates: {
    canonical: "/request",
    languages: {
      "en-US": "/request",
      "zh-CN": "/zh/request",
      "x-default": "/request",
    },
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function RequestPage() {
  const pets = getAllPets();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#page`,
        name: title,
        description,
        url: pageUrl,
        inLanguage: "en",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: [
          "Free community Codex pet requests",
          "Anime and game character Codex pets",
          "Volunteer-created desktop companions",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}/#howto`,
        name: "How to request a Codex pet from the community",
        description,
        totalTime: "PT5M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Search the gallery",
            text: "Check the gallery and existing requests for the same character.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Prepare references",
            text: "Provide the character, original work, public references, and visual preferences.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Open the free request",
            text: "Use Codex or the GitHub request form to publish the community request.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <RequestPageContent locale="en" petCount={pets.length} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
