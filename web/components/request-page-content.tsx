import Link from "next/link";

import { CodexIcon } from "@/components/codex-icon";
import {
  buildCodexUrl,
  getPetRequestPrompt,
} from "@/lib/codex-links";
import type { Locale } from "@/lib/i18n";

const requestIssueUrl =
  "https://github.com/legeling/awesome-codex-pet/issues/new?template=pet-request.yml";

const content = {
  en: {
    breadcrumb: "Codex pet gallery",
    eyebrow: "Free community request",
    title: "Request a Codex pet for a character you love",
    intro:
      "Submitting a request is free. Tell the Awesome Codex Pet community which character, mascot, animal, or original idea you want. A community contributor may volunteer to create and publish it for free, but requests are not delivery promises.",
    codexCta: "Prepare my request in Codex",
    githubCta: "Open the request form",
    note: "No finished spritesheet or coding experience is required.",
    howEyebrow: "How it works",
    howTitle: "From character idea to community request",
    steps: [
      {
        index: "01",
        title: "Check the gallery",
        description:
          "Search the pet gallery and open requests first so the community does not duplicate an existing character.",
      },
      {
        index: "02",
        title: "Share recognizable references",
        description:
          "Provide the character name, original work, a public or GitHub-hosted reference image, and the visual details that matter.",
      },
      {
        index: "03",
        title: "Publish the free request",
        description:
          "Codex can organize the information and open the GitHub request, or you can fill in the community form yourself.",
      },
      {
        index: "04",
        title: "Wait for a volunteer",
        description:
          "Contributors can discuss, claim, create, review, and submit the pet. Timing depends on volunteer interest and capacity.",
      },
    ],
    promiseEyebrow: "What the community offers",
    promiseTitle: "A request queue, not a paid commission shop",
    promiseBody:
      "Awesome Codex Pet is an open community gallery. The project does not charge a request fee, and community-made pets are published with creator, source, and usage information. A request can be declined, remain unclaimed, or need better references.",
    afterTitle: "When the pet is published",
    afterBody:
      "It receives a gallery detail page with animation previews and installation options. You can then install it directly from the website on macOS, Linux, or Windows.",
    browseCta: "Browse available pets",
    installCta: "Read the install guide",
    faqTitle: "Codex pet request FAQ",
    faq: [
      {
        question: "Does it cost money to request a Codex pet?",
        answer:
          "No. Opening a request in Awesome Codex Pet is free. The community may create it voluntarily; the project does not promise a completion date or acceptance.",
      },
      {
        question: "Can I request an anime or game character?",
        answer:
          "Yes. You can request anime, game, mascot, animal, meme, object, avatar, or original characters. Include a recognizable official or public reference and honest source notes.",
      },
      {
        question: "Do I need to make the spritesheet myself?",
        answer:
          "No. A request only needs a clear character or concept, references, and preferences. Contributors handle production when they choose to claim it.",
      },
    ],
  },
  zh: {
    breadcrumb: "Codex 小宠物画廊",
    eyebrow: "免费社区制作申请",
    title: "免费提交喜欢角色的 Codex 小宠物制作申请",
    intro:
      "提交申请本身完全免费。告诉 Awesome Codex Pet 社区你想要哪个动漫角色、游戏人物、吉祥物、动物或原创形象；社区贡献者可能会志愿认领并免费制作，但申请不等于承诺交付。",
    codexCta: "让 Codex 帮我整理申请",
    githubCta: "直接填写申请表",
    note: "不需要现成 spritesheet，也不要求会画画或写代码。",
    howEyebrow: "申请流程",
    howTitle: "从喜欢的角色到社区制作申请",
    steps: [
      {
        index: "01",
        title: "先搜索画廊",
        description:
          "先搜索宠物画廊和已有申请，确认喜欢的角色尚未收录，避免社区重复制作。",
      },
      {
        index: "02",
        title: "提供清楚的角色参考",
        description:
          "填写角色名称、所属作品、公开或 GitHub 可访问的参考图，以及最重要的外观和动作特点。",
      },
      {
        index: "03",
        title: "免费发布制作申请",
        description:
          "可以让 Codex 自动查重、整理资料并创建 GitHub Issue，也可以自己填写社区申请表。",
      },
      {
        index: "04",
        title: "等待社区志愿者认领",
        description:
          "贡献者可以讨论、认领、制作、审查并投稿。完成时间取决于志愿者兴趣和精力。",
      },
    ],
    promiseEyebrow: "社区机制",
    promiseTitle: "这是免费申请队列，不是付费定制商店",
    promiseBody:
      "Awesome Codex Pet 是开放社区画廊，不收取制作申请费用。社区完成的宠物会公开作者、来源与使用说明；申请也可能暂时无人认领、被拒绝，或需要补充更清楚的参考资料。",
    afterTitle: "宠物收录之后",
    afterBody:
      "完成的宠物会获得独立画廊详情页、完整动作预览和安装入口。你可以直接从网站在 macOS、Linux 或 Windows 上一键安装。",
    browseCta: "先浏览现有宠物",
    installCta: "查看安装方法",
    faqTitle: "Codex 小宠物制作申请常见问题",
    faq: [
      {
        question: "申请制作 Codex 小宠物收费吗？",
        answer:
          "不收费。在 Awesome Codex Pet 创建制作申请是免费的，社区可能志愿完成；项目不承诺一定收录，也不承诺完成时间。",
      },
      {
        question: "可以申请动漫或游戏人物吗？",
        answer:
          "可以。动漫、游戏、吉祥物、动物、梗图、物品、头像和原创角色都可以申请。请提供能辨认角色的官方或公开参考资料，并如实填写来源。",
      },
      {
        question: "申请人需要自己制作 spritesheet 吗？",
        answer:
          "不需要。申请阶段只要说明角色或概念、提供参考图和偏好；有贡献者愿意认领时，再由社区完成制作与审查。",
      },
    ],
  },
} as const;

export function RequestPageContent({
  locale,
  petCount,
}: {
  locale: Locale;
  petCount: number;
}) {
  const copy = content[locale];
  const localePrefix = locale === "zh" ? "/zh" : "";
  const requestPrompt = getPetRequestPrompt(locale);

  return (
    <main
      className="mx-auto max-w-[1120px] px-6 pb-24 pt-14 sm:pt-20"
      lang={locale === "zh" ? "zh-CN" : "en"}
    >
      <header className="border-b border-border pb-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link className="hover:text-accent" href="/">
            {copy.breadcrumb}
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span>{locale === "zh" ? "制作申请" : "Pet request"}</span>
        </nav>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.eyebrow}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-text sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
          {copy.intro}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            href={buildCodexUrl(requestPrompt)}
          >
            <CodexIcon className="size-5" />
            {copy.codexCta}
          </a>
          <a
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-bg-elevated px-5 text-sm font-medium text-text transition-colors hover:bg-surface"
            href={requestIssueUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.githubCta}
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">{copy.note}</p>
      </header>

      <section className="border-b border-border py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.howEyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-text">
          {copy.howTitle}
        </h2>
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {copy.steps.map((step) => (
            <li
              className="grid gap-3 py-6 sm:grid-cols-[64px_0.7fr_1.3fr]"
              key={step.index}
            >
              <span className="font-mono text-sm text-accent">
                {step.index}
              </span>
              <h3 className="text-lg font-semibold text-text">{step.title}</h3>
              <p className="leading-7 text-text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-10 border-b border-border py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {copy.promiseEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-text">
            {copy.promiseTitle}
          </h2>
        </div>
        <div className="space-y-7 text-base leading-8 text-text-secondary">
          <p>{copy.promiseBody}</p>
          <div className="border-l-2 border-accent pl-5">
            <h3 className="font-semibold text-text">{copy.afterTitle}</h3>
            <p className="mt-2">{copy.afterBody}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <Link className="text-accent hover:underline" href="/#gallery">
              {copy.browseCta} ({petCount})
            </Link>
            <Link
              className="text-accent hover:underline"
              href={`${localePrefix}/install`}
            >
              {copy.installCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-3xl font-semibold text-text">{copy.faqTitle}</h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {copy.faq.map((item) => (
            <article className="grid gap-3 py-6 sm:grid-cols-2" key={item.question}>
              <h3 className="font-semibold leading-7 text-text">
                {item.question}
              </h3>
              <p className="leading-7 text-text-secondary">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
