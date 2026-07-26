import type { Locale } from "@/lib/i18n";
import type { Pet } from "@/lib/pets";

const repositoryUrl = "https://github.com/legeling/awesome-codex-pet";

export function buildChatGPTUrl(prompt: string) {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

export function buildCodexUrl(prompt: string) {
  return `codex://new?prompt=${encodeURIComponent(prompt)}`;
}

export function getLocalizedPetName(pet: Pet, locale: Locale) {
  if (locale === "zh") {
    return pet.localizedNames?.zh || pet.displayName || pet.name;
  }
  return pet.localizedNames?.en || pet.name;
}

export function getPetRequestPrompt(locale: Locale) {
  if (locale === "zh") {
    return `请全程使用中文，帮我向 Awesome Codex Pet 请求制作一只 Codex 宠物。仓库：${repositoryUrl}。

这个流程的目标是免费提交一条清楚、可执行的 GitHub Issue，不需要克隆仓库，也不要直接创建 Pull Request。社区贡献者可能会志愿认领并免费制作，但申请不代表承诺收录、交付或完成时间。

执行要求：
1. 通过 GitHub API 或网页读取仓库的 pets.json、collections.json 和现有 Issues，先检查相同角色或概念是否已经存在；不要为了查重克隆整个仓库。
2. 向我询问角色或概念名称、所属作品、希望的 V1/V2、参考图或参考链接、偏好的画风、名称语言和补充要求。不能臆造作者或来源。
3. 创建 Issue 前检查维护者能否打开参考资料：真实宠物、原创角色、头像或其他依赖具体外观的请求，必须至少有一张已上传到 GitHub 的图片附件或公开图片链接；已有知名角色可以提供能明确外观的官方角色页或来源页；只有明确“不限定外观”的概念才可以没有图片。当前对话里的图片、本地文件名或路径、以及“用户提供了照片”之类的文字描述都不算 GitHub 附件。
4. 如果当前 GitHub 能力不能上传本地或对话图片，不要先创建一个没有图片的 Issue，也不要声称图片已经上传；请我先在 GitHub Issue 或评论中附图，随后验证正文或评论里出现维护者可打开的附件链接，再把请求视为完成。
5. 区分“希望社区基于公开角色重新创作”和“希望直接改编某份现有素材”。如实说明素材作者与来源，并将仓库产物标记为仅限非商业使用。
6. 使用仓库的 pet-request Issue Form 字段组织内容，标题使用“[Request]: 角色或概念名称”。正文开头保留 <!-- pet-flow: request -->，写清查重结果、角色与作品、版本、参考资料、制作方向、署名与非商业使用状态。
7. 使用已连接的 GitHub 能力在 ${repositoryUrl} 创建 Issue。仓库自动化会添加 type: request 和 status: triage 标签；不要自行创建重复标签。
8. Issue 创建后，把完整链接和仍需补充的信息告诉我。不要声称宠物已经制作或收录。

先向我询问角色或概念名称，然后完成查重和 Issue 创建。`;
  }

  return `Use English throughout this task. Help me request a new Codex pet from Awesome Codex Pet at ${repositoryUrl}.

The goal is a free, clear, actionable GitHub issue. Do not clone the repository and do not open a pull request yet. A community contributor may volunteer to create the pet for free, but a request is not a promise of acceptance, delivery, or completion time.

Requirements:
1. Use the GitHub API or website to inspect pets.json, collections.json, and existing issues for the same character or concept. Do not clone the full repository for duplicate research.
2. Ask me for the character or concept, original work, preferred V1/V2 runtime, references, visual direction, naming language, and any special requirements. Do not invent authorship or sources.
3. Before creating the issue, verify that maintainers can open the references. A real pet, original character, avatar, or other appearance-specific request requires at least one GitHub image attachment or public image URL. A known canonical character may use an official character or source page that clearly establishes its appearance. Only a concept explicitly described as having no fixed appearance may omit an image. An image visible only in this chat, a local filename or path, or prose saying that a photo exists is not a GitHub attachment.
4. If the connected GitHub capability cannot upload a local or chat image, do not create an image-less issue and do not claim the image was uploaded. Ask me to attach it to the GitHub issue or a comment, then verify that the body or comment contains a maintainer-viewable attachment URL before treating the request as complete.
5. Distinguish a request for an original community interpretation from a request to adapt an existing asset. Keep author and source notes honest, and mark repository output as non-commercial.
6. Follow the repository's pet-request issue fields. Use the title "[Request]: Character or concept" and keep <!-- pet-flow: request --> at the start of the body. Include the duplicate check, character and franchise, version, references, craft direction, attribution, and non-commercial usage status.
7. Create the issue in ${repositoryUrl} with the connected GitHub capability. Repository automation adds type: request and status: triage; do not create duplicate labels.
8. Return the issue URL and list any remaining questions. Do not claim that the pet has already been made or accepted.

Ask me for the character or concept first, then complete the duplicate check and issue creation.`;
}

export function getPetSubmissionPrompt(locale: Locale) {
  if (locale === "zh") {
    return `请全程使用中文，帮我制作、完善或提交一只属于我的 Codex 宠物到 ${repositoryUrl}。

默认使用 GitHub API 完成投稿，不要求我克隆整个仓库，默认目标是做出可审查、可合并的 PR，而不是生成一篇阻塞报告。开始前先问我是要从角色或参考图开始现场制作、完善制作中的宠物，还是直接提交现成的宠物目录或 spritesheet.webp；把缺少的信息集中一次问完。

执行要求：
1. 通过 GitHub API 读取仓库的 AGENTS.md、CONTRIBUTING.md、pets.json、collections.json、校验脚本和 .agents/skills/submit-codex-pet/SKILL.md。查询 canonical_key、名称、作品和 tags，确认不是重复收录。
2. 根据我的选择，判断是从参考资料开始制作、完善现有素材、补元数据，还是直接校验完整三件套。需要制作或修复时，读取并执行仓库对应的 hatch-pet-v1 或 hatch-pet-v2 skill；不要假设用户已经克隆仓库。
3. 最终目录必须是 pets/<pet-slug>--<author-slug>/，且只能包含 submission.json、pet.json、spritesheet.webp。V1 使用 1536x1872；V2 使用 1536x2288 并设置 spriteVersionNumber: 2。
4. 逐帧检查动作、环视方向、角色一致性、尺寸与基线，并在深色、浅色和棋盘格背景下修复紫边、绿边、青边、洋红边和透明洞。不能为了消除色边全局删除角色真实颜色。
5. 区分“最终宠物资产”与“制作参考图”的来源。原创或独立 AI 生成的最终宠物署名投稿人/适配作者，公开 source_url 可以为空，但必须如实说明来源并明确仅限非商业使用。未随包上传的角色参考图只作为参考，不把参考图作者冒充为宠物作者。若 spritesheet 直接裁剪、描摹、清晰化或复用了现有图片像素，要如实记录；当这些像素导致角色不一致、动作质量差、轮廓损坏或色边残留时，优先重新生成或局部修复。选择双语名称时，同时填写 localized_names.en 和 localized_names.zh。
6. 在本地临时目录运行或等价执行 npm run validate:pr、npm run lint 和独立安装测试。不要把 QA、参考图、视频、README、pets.json、预览生成物或临时文件放进 PR。
7. 在发布前把 contact sheet 或最终 spritesheet 图片直接展示给我，得到视觉确认后，使用 GitHub API 在我的 fork 中创建或复用投稿分支，上传三个最终文件，并向主仓库发起一个只包含这只宠物的 PR；不需要完整 clone。成品、视觉确认和必要校验都完成后，必须创建 **Ready for review 的正式 PR，不能默认创建 Draft**；只有我明确要求草稿或投稿确实尚未完成时才使用 Draft，并写清剩余工作。把 contact sheet 作为 PR 正文附件而不是提交进宠物目录；PR 正文还要说明查重、最终资产作者、参考/来源说明、非商业声明、版本和验证结果，并关联已有 Issue。仓库 CI 会再生成可下载的预览 artifact。
8. 不要因为没有公开 source_url 或正式许可证名称就阻塞。只需如实记录作者和来源，并声明“仅限非商业使用”。把审核精力放在角色还原、逐帧一致性、动作方向、跑步步态、环视方向、动画连续性和透明边缘；GitHub 未授权时先请我连接后重试。
9. 只有经过上述补齐、质量修复和 GitHub 连接重试后仍无法继续，并且我明确同意时，才创建带 <!-- pet-flow: submission --> 的 [Submission] Issue。Issue 只写一个真实阻塞点和明确的解除步骤，使用英文三级标题 ### Pet runtime version 与 ### Primary category 记录版本和分类，并附上 contact sheet 以及维护者可访问的 spritesheet 或精简成品包；文件名和本地路径不算附件，不要写维护者无法访问的本地文件校验长报告。
10. 跟进 CI。对确定的结构或格式错误直接修复；涉及视觉取舍、宠物质量或重复收录时停下来让我确认。

请先询问我要现场制作、继续完善还是提交现成文件，再检查我提供的参考资料和素材，把制作或修复、逐帧验收、验证、GitHub API 上传、PR 与 CI 跟进完整做完。`;
  }

  return `Use English throughout this task. Help me create, finish, or submit my own Codex pet to ${repositoryUrl}.

Use the GitHub API by default so I do not need to clone the full repository. The default outcome is a reviewable pull request, not a blocker report. First ask whether I want to make the pet now from a character or references, finish an in-progress pet, or submit an existing pet folder or spritesheet.webp. Collect all missing decisions in one compact question set.

Requirements:
1. Read AGENTS.md, CONTRIBUTING.md, pets.json, collections.json, the validation scripts, and .agents/skills/submit-codex-pet/SKILL.md through the GitHub API. Search canonical_key, names, franchise, and tags to prevent duplicate collection.
2. Based on my choice, decide whether to create from references, finish existing assets, add metadata, or validate a complete three-file package. When production or repair is required, fetch and follow the repository's hatch-pet-v1 or hatch-pet-v2 skill without assuming the repository is cloned.
3. The final folder must be pets/<pet-slug>--<author-slug>/ and contain only submission.json, pet.json, and spritesheet.webp. V1 uses 1536x1872. V2 uses 1536x2288 and spriteVersionNumber: 2.
4. Review actions, look directions, identity, scale, and baseline frame by frame. Repair purple, green, cyan, or magenta fringe and transparent holes on dark, light, and checkerboard backgrounds without globally deleting legitimate character colors.
5. Separate final-pet provenance from reference provenance. Credit the submitter or adapter for original or independently AI-generated final pixels. A public source_url may be empty when the source is described honestly and repository use is marked non-commercial. Character references that are not uploaded remain reference-only; do not miscredit their artists as the pet author. Record direct crops, traces, cleanup, or substantial pixel reuse honestly; regenerate or repair them when they cause inconsistent identity, weak actions, damaged outlines, or chroma residue. When bilingual naming is selected, provide both localized_names.en and localized_names.zh.
6. In a temporary local workspace, run or equivalently perform npm run validate:pr, npm run lint, and an isolated installation test. Do not include QA, references, videos, README files, pets.json, generated previews, or temporary files in the pull request.
7. Before publication, show me the contact sheet or final spritesheet and obtain visual approval. Then use the GitHub API to create or reuse a submission branch in my fork, upload the three final files, and open one focused pull request against the upstream repository. A full clone is not required. Once the package, visual approval, and required validation are complete, open it as a **ready-for-review pull request, not a draft**. Use a draft only when I explicitly request one or the submission is knowingly unfinished, and state the remaining work. Attach the contact sheet to the pull request description rather than committing it to the pet directory. Document duplicate research, final-asset authorship, reference/source notes, the non-commercial statement, version, and validation, and link any existing issue. Repository CI also produces a downloadable preview artifact.
8. Do not block because a public source_url or formal license name is absent. Record authorship and source honestly and state "Non-commercial use only." Put review effort into character fidelity, frame consistency, action direction, alternating running gait, look directions, animation continuity, and transparent edges. If GitHub is not authorized, ask me to connect it and retry.
9. Only after those recovery steps still cannot complete, and after I explicitly approve the fallback, create a [Submission] issue containing <!-- pet-flow: submission -->. State one genuine blocker and the exact resolution step, use the exact headings ### Pet runtime version and ### Primary category, and attach a contact sheet plus an accessible spritesheet or compact package. Filenames and local paths are not attachments. Do not publish a long validation report for inaccessible local files.
10. Follow the CI run. Fix deterministic structural or formatting failures; stop for my confirmation when the decision concerns visual direction, pet quality, or duplicate acceptance.

Ask whether I want live creation, continued production, or submission of existing files first. Then inspect my references and assets and carry production or repair, frame-by-frame review, validation, GitHub API upload, pull request creation, and CI follow-up through end to end.`;
}

export function getPetInstallPrompt(pet: Pet, locale: Locale) {
  const petName = getLocalizedPetName(pet, locale);
  if (locale === "zh") {
    return `请全程使用中文，为我安装 Awesome Codex Pet 中的「${petName}」（${pet.slug}）。先判断当前操作系统，再运行对应的官方安装命令；确认 pet.json 与 spritesheet.webp 已写入 Codex pets 目录，说明实际安装路径，并告诉我是否需要重启 Codex 以及如何在“设置 → 宠物”中启用它。\n\nmacOS / Linux：\n${pet.installCommand}\n\nWindows PowerShell：\n${pet.installCommandPowerShell}`;
  }

  return `Use English throughout this task. Install "${petName}" (${pet.slug}) from Awesome Codex Pet. Detect the current operating system, run the matching official command, verify that pet.json and spritesheet.webp were written to the Codex pets directory, report the actual install path, and explain whether Codex needs to restart and how to enable the pet under Settings → Pets.\n\nmacOS / Linux:\n${pet.installCommand}\n\nWindows PowerShell:\n${pet.installCommandPowerShell}`;
}

export function getInstallGuidePrompt(locale: Locale) {
  if (locale === "zh") {
    return `请全程使用中文，帮我从 ${repositoryUrl} 安装一只 Awesome Codex Pet。先询问我要安装的宠物页面链接或 pet slug；收到后判断当前操作系统，选择仓库提供的 Bash、PowerShell 或本地 Node.js 安装方式。安装完成后验证 pet.json 与 spritesheet.webp，告诉我实际安装路径，并说明如何重启 Codex、在“设置 → 宠物”中选择它。不要猜测宠物 slug，也不要修改其他已安装宠物。`;
  }

  return `Use English throughout this task. Help me install an Awesome Codex Pet from ${repositoryUrl}. First ask for the pet page URL or pet slug. Then detect the current operating system and use the repository's Bash, PowerShell, or local Node.js installer. Verify pet.json and spritesheet.webp after installation, report the actual install path, and explain how to restart Codex and select the pet under Settings → Pets. Do not guess the pet slug or modify other installed pets.`;
}

export function getCollectionInstallPrompt(
  title: string,
  petSlugs: string[],
  locale: Locale,
) {
  const slugs = petSlugs.join(", ");
  if (locale === "zh") {
    return `请全程使用中文，安装 Awesome Codex Pet 的「${title}」合集。宠物列表：${slugs}。请根据当前系统逐个调用仓库官方安装脚本，验证每只宠物的 pet.json 与 spritesheet.webp 都已安装到 Codex pets 目录，并用中文汇总安装路径、成功项和失败项。仓库：${repositoryUrl}`;
  }

  return `Use English throughout this task. Install the "${title}" collection from Awesome Codex Pet. Pet slugs: ${slugs}. Use the repository's official installer for this system for each pet, verify pet.json and spritesheet.webp in the Codex pets directory, then summarize install paths, successes, and failures in English. Repository: ${repositoryUrl}`;
}
