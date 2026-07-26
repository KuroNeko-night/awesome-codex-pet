import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { format } from "prettier";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const petsDir = join(repoRoot, "pets");
const rawBase =
  "https://raw.githubusercontent.com/legeling/awesome-codex-pet/main";
const websiteUrl = "https://codexpet.top";

const categoryCatalog = JSON.parse(
  readFileSync(join(repoRoot, "categories.json"), "utf8"),
);
const categories = categoryCatalog.map((category) => category.name);
const categoryZh = Object.fromEntries(
  categoryCatalog.map((category) => [category.name, category.label.zh]),
);

const categoryAliases = {
  "Anime and Game Fan Art": "Anime Characters",
  "Game Fan Art": "Game Characters",
  "Animals and Creatures": "Animals",
  "Robots and Mascots": "Robots",
  "Memes and Internet Icons": "Memes",
  "Human Avatars and Profiles": "Human Avatars",
  Objects: "Objects & Props",
};

const previewStates = [
  ["idle", "Idle", "待机"],
  ["waving", "Waving", "挥手"],
  ["running-right", "Running", "奔跑"],
  ["waiting", "Waiting", "等待"],
  ["review", "Review", "审阅"],
];

const featuredSlugs = ["firefly--lingxiaotian"];
const featuredRank = new Map(featuredSlugs.map((slug, index) => [slug, index]));
const trailingSlugs = ["bocchi--lingxiaotian"];
const trailingRank = new Map(trailingSlugs.map((slug, index) => [slug, index]));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadPets() {
  return readdirSync(petsDir)
    .filter((entry) => !entry.startsWith("."))
    .filter((entry) => existsSync(join(petsDir, entry, "submission.json")))
    .map((slug) => {
      const metadata = readJson(join(petsDir, slug, "submission.json"));
      const runtime = readJson(join(petsDir, slug, "pet.json"));
      return {
        ...metadata,
        slug,
        spriteVersionNumber: runtime.spriteVersionNumber ?? 1,
      };
    })
    .sort((a, b) => {
      const rankA = featuredRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const rankB = featuredRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) return rankA - rankB;
      const trailingA = trailingRank.get(a.slug) ?? -1;
      const trailingB = trailingRank.get(b.slug) ?? -1;
      if (trailingA !== trailingB) {
        if (trailingA === -1) return -1;
        if (trailingB === -1) return 1;
        return trailingA - trailingB;
      }
      return a.name.localeCompare(b.name);
    });
}

function badge(label, message, color) {
  const encodedLabel = encodeURIComponent(label);
  const encodedMessage = encodeURIComponent(message);
  return `![${label}: ${message}](https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color})`;
}

function badges(pets) {
  return [
    badge("pets", String(pets.length), "2ea44f"),
    badge("categories", String(categories.length), "0969da"),
    badge("languages", "en | zh--CN", "8250df"),
    badge("code", "MIT", "111111"),
    badge("assets", "CC BY--NC 4.0", "f97316"),
    badge("install", "one command", "111111"),
    "[![Pet previews](https://github.com/legeling/awesome-codex-pet/actions/workflows/pet-previews.yml/badge.svg)](https://github.com/legeling/awesome-codex-pet/actions/workflows/pet-previews.yml)",
  ].join(" ");
}

function authorLink(pet) {
  const handle = pet.author_handle || pet.author_slug || pet.author;
  if (pet.author_url) return `<a href="${pet.author_url}">@${handle}</a>`;
  return `@${handle}`;
}

function bashInstallCommand(slug) {
  return `curl -fsSL ${rawBase}/scripts/install-pet.sh | bash -s -- ${slug}`;
}

function powershellInstallCommand(slug) {
  return `powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseB ${rawBase}/scripts/install-pet.ps1 | iex; Install-CodexPet ${slug}"`;
}

function localizedPetName(pet, lang) {
  return pet.localized_names?.[lang] || pet.name;
}

function petBlock(pet, lang) {
  const rootPrefix = lang === "zh" ? "../.." : ".";
  const labels =
    lang === "zh"
      ? ["名称", "安装", "动作", "预览"]
      : ["Name", "Install", "Action", "Preview"];
  const by = lang === "zh" ? "作者" : "by";
  const category = normalizeCategory(pet.primary_category);
  const categoryName =
    lang === "zh" ? categoryZh[category] || category : category;
  const displayName = localizedPetName(pet, lang);
  const stateNames = previewStates.map((state) =>
    lang === "zh" ? state[2] : state[1],
  );
  const gifs = previewStates.map(([state]) => {
    const path = `${websiteUrl}/assets/previews/${pet.slug}/gifs/${state}.gif`;
    return `<img src="${path}" alt="${displayName} ${state}" width="120" height="130">`;
  });

  return [
    `<table>`,
    `<tr><th>${labels[0]}</th><td colspan="5"><a href="${rootPrefix}/pets/${pet.slug}">${displayName}</a> · ${by} ${authorLink(pet)} · ${categoryName} · v${pet.spriteVersionNumber}</td></tr>`,
    `<tr><th>${labels[1]}</th><td colspan="5"><code>${bashInstallCommand(pet.slug)}</code></td></tr>`,
    `<tr><th>${labels[2]}</th>${stateNames.map((name) => `<td><strong>${name}</strong></td>`).join("")}</tr>`,
    `<tr><th>${labels[3]}</th>${gifs.map((gif) => `<td>${gif}</td>`).join("")}</tr>`,
    `</table>`,
  ].join("\n");
}

function normalizeCategory(category) {
  return categoryAliases[category] || category;
}

function categorySections(pets, lang) {
  return categories
    .flatMap((category) => {
      const items = pets.filter(
        (pet) => normalizeCategory(pet.primary_category) === category,
      );
      if (items.length === 0) return [];
      const title = lang === "zh" ? categoryZh[category] || category : category;
      return [
        [
          `### ${title}`,
          "",
          items.map((pet) => petBlock(pet, lang)).join("\n\n"),
        ].join("\n"),
      ];
    })
    .join("\n\n");
}

function englishReadme(pets) {
  const sampleSlug = pets[0]?.slug || "pet-slug--author-slug";
  return `<div align="center">

# Awesome Codex Pet

[简体中文](./docs/zh-CN/README.md) | English

<h2><a href="${websiteUrl}">Browse and install free community Codex pets at codexpet.top →</a></h2>

<p><strong>Awesome Codex Pet is a free community pet gallery.</strong> Browse complete animations like a pet store, install a favorite without cloning the repository, or request a missing character that a community contributor may volunteer to make.</p>

<p><a href="${websiteUrl}"><strong>Browse pets</strong></a> · <a href="${websiteUrl}/install"><strong>Install a pet</strong></a> · <a href="${websiteUrl}/request"><strong>Request a character</strong></a></p>

<a href="${websiteUrl}"><img src="./assets/cover/awesome-codex-pet-cover.png" alt="Open the Awesome Codex Pet gallery"></a>

${badges(pets)}

</div>

This repository is the source catalog behind [codexpet.top](${websiteUrl}): it keeps installable pet packages, creator attribution, collection metadata, validation tools, and contribution history. For browsing and installing pets, start with the website.

## Highlights

- **One-command install** — no clone, no manual setup, works on macOS / Linux / Windows
- **Free community gallery** — complete animation previews, collections, creator credits, sharing, and community statistics at [codexpet.top](${websiteUrl})
- **Free character requests** — submit a character and references without making a spritesheet; a community contributor may volunteer to create it, with no delivery guarantee
- **AI-first contributions** — contributors can create, repair, and submit pets with Codex; advanced contributors can still open a PR
- **Open licensing** — code under MIT, pet assets under CC BY-NC 4.0

Each pet is a small shareable package:

\`\`\`text
pets/<pet-slug>--<author-slug>/
├── submission.json
├── pet.json
└── spritesheet.webp
\`\`\`

Preview images are generated into \`assets/previews/<pet-id>/\` as local or CI build output, never inside the pet folder.

Repository-defined series and collections live in \`collections.json\`. Use \`kind: franchise\` for pets from the same original work and \`kind: theme\` for cross-franchise groups connected by a shared subject or style. A pet joins either by listing its slug in \`submission.json.collections\`; the catalog and website are generated from that metadata. Membership is recorded immediately, while the website publishes a collection only after it has at least three pets.

\`submission.json.name\` is the required fallback name. Creators may keep a pet single-language by omitting \`localized_names\`, or opt into bilingual naming by providing both \`localized_names.en\` and \`localized_names.zh\`. The website follows the visitor's selected language and never invents a translation.

## Pet Versions

| Version | Atlas                            | Runtime metadata                            | Use                                                   |
| ------- | -------------------------------- | ------------------------------------------- | ----------------------------------------------------- |
| v1      | \`1536x1872\`, 8 columns × 9 rows  | omit \`spriteVersionNumber\` or set it to \`1\` | Existing standard-animation pets                      |
| v2      | \`1536x2288\`, 8 columns × 11 rows | set \`spriteVersionNumber: 2\`                | Standard animations plus 16 clockwise look directions |

Both versions remain installable. Use v1 when maintaining an existing 9-row pet; use v2 for newly upgraded pets that need directional looking.

## Quick Install

No clone required. Pick the script for your shell:

\`\`\`bash
# macOS / Linux
${bashInstallCommand(sampleSlug)}
\`\`\`

\`\`\`powershell
# Windows PowerShell
${powershellInstallCommand(sampleSlug)}
\`\`\`

\`\`\`bash
# Anywhere with Node.js
npx awesome-codex-pet ${sampleSlug}
\`\`\`

List available pets:

\`\`\`bash
curl -fsSL ${rawBase}/scripts/install-pet.sh | bash -s -- --list
\`\`\`

Default install locations:

- macOS / Linux: \`~/.codex/pets/<pet-id>/\`
- Windows: \`%USERPROFILE%\\.codex\\pets\\<pet-id>\\\`

Set \`CODEX_HOME\` to override, or \`AWESOME_CODEX_PET_NO_STATS=1\` to opt out of anonymous install counters.

## Upgrade an Existing v1 Pet

1. Open Codex **Settings → Pets**.
2. Find the installed custom pet and choose **Update**.
3. Codex opens a Hatch Pet task. The current v2 workflow validates and preserves the existing 9 animation rows, generates four cardinal anchors plus 16 look directions, then writes an 11-row atlas with \`spriteVersionNumber: 2\`.
4. Review the generated contact sheet and direction previews before accepting the replacement.

The **Update** action is an AI-assisted v1-to-v2 conversion, not a download notification from this repository. It updates the local package under \`~/.codex/pets/\`; it does not modify or submit the GitHub copy automatically.

## Pets

${categorySections(pets, "en")}

## Request or Submit a Pet

Missing a favorite character? Open the [free community request page](${websiteUrl}/request). Submitting is free, no spritesheet is required, and a community contributor may volunteer to make the pet. Requests are not acceptance or delivery promises.

Contributors can start with the [website contribution guide](${websiteUrl}/guide). It offers three paths without making every contributor download this large asset repository:

1. **Request a pet** — Codex checks for duplicates, gathers references and requirements, then opens a labeled request issue.
2. **Create or submit your own pet** — Codex can start from references or existing files, complete and validate the three-file package, then use the GitHub API to create a focused branch and pull request without a full clone.
3. **Advanced pull request** — experienced contributors can work in a GitHub Codespace, a partial clone, or their preferred Git workflow.

The repository skill at [\`.agents/skills/submit-codex-pet\`](./.agents/skills/submit-codex-pet) teaches compatible AI agents how to choose the right route. When credentials or repository write access are unavailable, it falls back to a labeled submission issue instead of losing the contributor's work.

Advanced contributors should add exactly one final package:

\`\`\`text
pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    └── spritesheet.webp
\`\`\`

Use \`pet-slug--author-slug\` so multiple authors can ship variants of the same character. A v1 submission may omit \`spriteVersionNumber\` and must provide a \`1536x1872\` WebP. A v2 submission must set \`spriteVersionNumber: 2\` and provide a \`1536x2288\` WebP.

The v2 runtime manifest looks like:

\`\`\`json
{
  "id": "pet-slug--author-slug",
  "displayName": "Pet Name",
  "description": "One short sentence.",
  "spriteVersionNumber": 2,
  "spritesheetPath": "spritesheet.webp"
}
\`\`\`

Generated previews and README listings are produced by CI:

\`\`\`bash
python -m pip install -r requirements.txt
npm run validate:pr
npm run lint
\`\`\`

Contributor PRs should only include \`submission.json\`, \`pet.json\`, and \`spritesheet.webp\`. Do not submit prompts, references, QA folders, contact sheets, videos, decoded frames, or Hatch Pet run directories. Maintainers or CI regenerate previews, README listings, and \`pets.json\` after merge, but preview binaries are not kept as tracked Git assets.

## Make a Pet

- [.agents/skills/submit-codex-pet](./.agents/skills/submit-codex-pet) — request community production, create or submit your own pet through the GitHub API, or prepare an advanced PR
- [.agents/skills/hatch-pet-v1](./.agents/skills/hatch-pet-v1) — preserve or repair a legacy 8x9 v1 pet
- [.agents/skills/hatch-pet-v2](./.agents/skills/hatch-pet-v2) — create or upgrade an 8x11 v2 pet with 16 look directions

Choose the skill explicitly. For an upgrade, give \`$hatch-pet-v2\` the existing installed \`pet.json\` and \`spritesheet.webp\`; approved rows 0–8 are retained rather than regenerated.

## Documentation

- English: [docs/en](./docs/en)
- 简体中文: [docs/zh-CN](./docs/zh-CN)
- Web gallery source: [web/](./web)
- Stats worker: [worker/](./worker)
- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Star History

[![GitHub star history for Awesome Codex Pet](./assets/community/star-history.svg)](https://github.com/legeling/awesome-codex-pet/stargazers)

The chart is refreshed daily from GitHub's stargazer data. [Star the repository](https://github.com/legeling/awesome-codex-pet) to help more people discover these pets.

## Contributors

<a href="https://github.com/legeling/awesome-codex-pet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=legeling/awesome-codex-pet" alt="Awesome Codex Pet contributors">
</a>

Thanks to everyone who contributes pets, code, documentation, reviews, and ideas.

## License

- Code and scripts: [MIT](./LICENSE)
- Pet assets and generated previews: [CC BY-NC 4.0](./ASSETS-LICENSE.md), unless a pet folder says otherwise
`;
}

function chineseReadme(pets) {
  const sampleSlug = pets[0]?.slug || "pet-slug--author-slug";
  return `<div align="center">

# Awesome Codex Pet

简体中文 | [English](../../README.md)

<h2><a href="${websiteUrl}">免费浏览并安装 Codex 小宠物：codexpet.top →</a></h2>

<p><strong>Awesome Codex Pet 是免费的社区小宠物画廊。</strong>像逛宠物商店一样查看完整动画并一键安装；没有喜欢的角色时，还可以免费提交申请，社区贡献者可能会志愿制作。</p>

<p><a href="${websiteUrl}"><strong>挑选宠物</strong></a> · <a href="${websiteUrl}/zh/install"><strong>安装宠物</strong></a> · <a href="${websiteUrl}/zh/request"><strong>申请喜欢的角色</strong></a></p>

<a href="${websiteUrl}"><img src="../../assets/cover/awesome-codex-pet-cover.png" alt="进入 Awesome Codex Pet 精品画廊"></a>

${badges(pets)}

</div>

本仓库是 [codexpet.top](${websiteUrl}) 背后的宠物目录，负责保存可安装成品、作者与来源信息、合集元数据、校验工具和贡献记录。挑选与安装宠物时，请优先使用网站。

## 亮点

- **一条命令安装** — 不需要克隆仓库，macOS / Linux / Windows 全平台支持
- **免费社区画廊** — [codexpet.top](${websiteUrl}) 提供完整动作预览、合集、作者署名、便捷分享和社区统计
- **免费角色申请** — 不需要自己制作 spritesheet；提交角色和参考资料后，社区贡献者可能会志愿制作，但不承诺交付
- **AI 优先投稿** — 贡献者可在 Codex 中制作、修复并提交自己的宠物，熟悉 Git 的用户也可以直接提交 PR
- **非商用原则** — 正式许可证可选；没有正式许可证时必须明确禁止商用

每只宠物都是一个很小的可分享包：

\`\`\`text
pets/<pet-slug>--<author-slug>/
├── submission.json
├── pet.json
└── spritesheet.webp
\`\`\`

预览图会作为本地或 CI 构建产物生成到 \`assets/previews/<pet-id>/\`，不会塞进宠物目录。

仓库级作品系列与主题系列统一维护在 \`collections.json\`：\`kind: franchise\` 表示来自同一原作的作品系列，\`kind: theme\` 表示按题材、风格或伙伴类型组织的跨作品主题系列。宠物通过 \`submission.json.collections\` 声明归属，目录与网站都会从这些元数据自动生成。归属信息会立即记录，但只有达到至少 3 只宠物的合集才会在网站公开展示。

\`submission.json.name\` 是必填的默认名称。投稿者可以省略 \`localized_names\`，只使用一种语言；也可以选择双语，并同时填写 \`localized_names.en\` 与 \`localized_names.zh\`。网站会跟随访客选择的语言展示，不会擅自生成翻译。

## Pet 版本

| 版本 | 图集                      | 运行时元数据                          | 用途                           |
| ---- | ------------------------- | ------------------------------------- | ------------------------------ |
| v1   | \`1536x1872\`，8 列 × 9 行  | 省略 \`spriteVersionNumber\` 或设为 \`1\` | 已有的标准动作宠物             |
| v2   | \`1536x2288\`，8 列 × 11 行 | 设置 \`spriteVersionNumber: 2\`         | 标准动作加 16 个顺时针环视方向 |

两个版本都可以安装。维护已有九行动画时使用 v1；需要环视动作的新宠物或升级宠物使用 v2。

## 快速安装

无需 clone，按你的系统选一条命令：

\`\`\`bash
# macOS / Linux
${bashInstallCommand(sampleSlug)}
\`\`\`

\`\`\`powershell
# Windows PowerShell
${powershellInstallCommand(sampleSlug)}
\`\`\`

\`\`\`bash
# 任何能跑 Node.js 的环境
npx awesome-codex-pet ${sampleSlug}
\`\`\`

列出可安装的宠物：

\`\`\`bash
curl -fsSL ${rawBase}/scripts/install-pet.sh | bash -s -- --list
\`\`\`

默认安装位置：

- macOS / Linux：\`~/.codex/pets/<pet-id>/\`
- Windows：\`%USERPROFILE%\\.codex\\pets\\<pet-id>\\\`

可通过 \`CODEX_HOME\` 自定义安装路径，或者设置 \`AWESOME_CODEX_PET_NO_STATS=1\` 关闭匿名安装计数。

## 升级已有 v1 宠物

1. 打开 Codex 的**设置 → 宠物**。
2. 找到已安装的自定义宠物，点击**更新**。
3. Codex 会打开 Hatch Pet 任务。当前 v2 流程会校验并保留原有九行动画，只生成四个方向锚点和 16 个环视方向，然后写出带 \`spriteVersionNumber: 2\` 的十一行图集。
4. 接受替换前，检查生成的 contact sheet 和方向预览。

这里的**更新**是 AI 辅助的 v1 → v2 转换，不是本仓库发出了新版下载通知。它只更新 \`~/.codex/pets/\` 下的本地包，不会自动修改或提交 GitHub 仓库里的版本。

## 宠物收录

${categorySections(pets, "zh")}

## 申请或投稿

没有喜欢的角色时，请打开[免费社区制作申请页](${websiteUrl}/zh/request)。提交申请不收费，不需要自己准备 spritesheet，社区贡献者可能会志愿认领并制作；申请不代表承诺收录或交付。

贡献者可以从[网站上的制作与投稿指南](${websiteUrl}/guide)开始。为了避免每位投稿者都下载体积较大的素材仓库，我们提供三条路径：

1. **请求制作宠物** — Codex 先检查重复项、收集参考和制作要求，再创建带标签的请求 Issue。
2. **制作或提交自己的宠物** — Codex 可以从参考图现场制作，也可以接收现成文件；完成三件套制作与校验后，通过 GitHub API 创建专用分支和 PR，无需完整克隆。
3. **高级 PR** — 熟悉 Git 的贡献者可以使用 GitHub Codespaces、部分克隆或自己的 Git 工作流。

仓库内的 [\`.agents/skills/submit-codex-pet\`](../../.agents/skills/submit-codex-pet) 会指导兼容的 AI 选择正确路径。若缺少凭据或仓库写入权限，它会退回到带标签的成品投稿 Issue，不会让投稿内容丢失。

高级贡献者只需添加一个最终成品包：

\`\`\`text
pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    └── spritesheet.webp
\`\`\`

目录名使用 \`pet-slug--author-slug\`，这样同一个角色的不同作者版本可以并存。v1 投稿可以省略 \`spriteVersionNumber\`，WebP 必须是 \`1536x1872\`；v2 投稿必须设置 \`spriteVersionNumber: 2\`，WebP 必须是 \`1536x2288\`。

v2 的运行时清单示例：

\`\`\`json
{
  "id": "pet-slug--author-slug",
  "displayName": "Pet 名称",
  "description": "一句简短描述。",
  "spriteVersionNumber": 2,
  "spritesheetPath": "spritesheet.webp"
}
\`\`\`

预览图和 README 收录表都由 CI 自动生成：

\`\`\`bash
python -m pip install -r requirements.txt
npm run validate:pr
npm run lint
\`\`\`

贡献者 PR 只需提交 \`submission.json\`、\`pet.json\` 和 \`spritesheet.webp\`。不要提交 prompts、参考图、QA 目录、contact sheet、视频、解码帧或 Hatch Pet 运行目录。预览图、README 收录和 \`pets.json\` 由维护者或 CI 在合并后统一生成，但预览二进制不会长期作为 Git 跟踪文件保留。

## 制作 Pet

- [.agents/skills/submit-codex-pet](../../.agents/skills/submit-codex-pet) — 请求社区制作、通过 GitHub API 制作或提交自己的宠物，或准备高级 PR
- [.agents/skills/hatch-pet-v1](../../.agents/skills/hatch-pet-v1) — 保留或修复旧版 8x9 v1 宠物
- [.agents/skills/hatch-pet-v2](../../.agents/skills/hatch-pet-v2) — 创建或升级带 16 个环视方向的 8x11 v2 宠物

调用时要显式选择 skill。升级已有宠物时，把现有的 \`pet.json\` 和 \`spritesheet.webp\` 交给 \`$hatch-pet-v2\`；通过审核的第 0–8 行会被保留，不会重新生成。

## 文档

- English: [docs/en](../en)
- 简体中文: [docs/zh-CN](./)
- 在线画廊源码: [web/](../../web)
- 统计 Worker: [worker/](../../worker)
- 贡献指南: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 星标历史

[![Awesome Codex Pet 的 GitHub 星标历史](../../assets/community/star-history.svg)](https://github.com/legeling/awesome-codex-pet/stargazers)

图表每天根据 GitHub 星标数据自动更新。欢迎[为仓库点亮 Star](https://github.com/legeling/awesome-codex-pet)，让更多人发现这些精品宠物。

## 贡献者

<a href="https://github.com/legeling/awesome-codex-pet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=legeling/awesome-codex-pet" alt="Awesome Codex Pet 贡献者">
</a>

感谢每一位贡献宠物、代码、文档、审核与创意的朋友。

## 许可说明

- 代码和脚本：[MIT](../../LICENSE)
- 宠物资产和自动生成预览：[CC BY-NC 4.0](../../ASSETS-LICENSE.md)，除非具体宠物目录另有说明
`;
}

const pets = loadPets();

writeFileSync(join(repoRoot, "README.md"), englishReadme(pets), "utf8");
mkdirSync(join(repoRoot, "docs", "zh-CN"), { recursive: true });
writeFileSync(
  join(repoRoot, "docs", "zh-CN", "README.md"),
  chineseReadme(pets),
  "utf8",
);
const catalog = pets.map((pet) => ({
  slug: pet.slug,
  name: pet.name,
  localized_names: pet.localized_names,
  author: pet.author,
  author_handle: pet.author_handle,
  author_url: pet.author_url,
  primary_category: normalizeCategory(pet.primary_category),
  collections: pet.collections ?? [],
  license: pet.license,
  description: pet.description,
  spriteVersionNumber: pet.spriteVersionNumber,
}));
const formattedCatalog = await format(JSON.stringify(catalog), {
  parser: "json",
});
writeFileSync(join(repoRoot, "pets.json"), formattedCatalog, "utf8");

console.log(`generated README files for ${pets.length} pet(s)`);
