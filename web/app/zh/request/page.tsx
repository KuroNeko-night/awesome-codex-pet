import type { Metadata } from "next";

import { RequestPageContent } from "@/components/request-page-content";
import { getAllPets } from "@/lib/pets";
import { siteConfig } from "@/lib/site";

const title = "免费申请制作喜欢角色的 Codex 小宠物";
const description =
  "免费提交动漫角色、游戏人物、吉祥物、动物或原创形象的 Codex 小宠物制作申请。Awesome Codex Pet 社区贡献者可能会志愿认领并免费制作，但不承诺交付。";
const pageUrl = `${siteConfig.url}/zh/request`;
const faq = [
  {
    question: "申请制作 Codex 小宠物收费吗？",
    answer:
      "不收费。创建申请完全免费，社区贡献者可能志愿制作，但项目不承诺一定收录或完成时间。",
  },
  {
    question: "可以申请动漫或游戏人物吗？",
    answer:
      "可以。请提供角色名称、所属作品、可公开访问的清楚参考图和真实来源说明。",
  },
  {
    question: "申请人需要自己制作 spritesheet 吗？",
    answer: "不需要。申请阶段只需要清楚的角色信息、参考资料和制作偏好。",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "免费申请 Codex 小宠物",
    "Codex 宠物制作申请",
    "请社区制作 Codex 宠物",
    "动漫 Codex 宠物申请",
    "游戏人物 Codex 宠物申请",
    "定制 Codex 小宠物",
  ],
  alternates: {
    canonical: "/zh/request",
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
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function ChineseRequestPage() {
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
        inLanguage: "zh-CN",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: [
          "免费社区 Codex 小宠物制作申请",
          "动漫和游戏人物 Codex 宠物",
          "社区志愿制作桌面伙伴",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}/#howto`,
        name: "如何向社区申请制作 Codex 小宠物",
        description,
        totalTime: "PT5M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "搜索宠物画廊",
            text: "检查画廊和已有申请中是否已经存在相同角色。",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "准备角色参考",
            text: "提供角色、所属作品、公开参考图和希望保留的外观特点。",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "发布免费申请",
            text: "使用 Codex 或 GitHub 申请表创建社区制作申请。",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}/#faq`,
        inLanguage: "zh-CN",
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
      <RequestPageContent locale="zh" petCount={pets.length} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
