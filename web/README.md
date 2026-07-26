# Awesome Codex Pet — Web Gallery

A Next.js static site that serves as the public gallery for community Codex pets.

## Development

```bash
cd web
npm install
npm run dev
```

The dev server runs `prepare-site` automatically to generate data from the repository.

If preview assets are missing locally, run `npm run previews` in the repo root first so `web/public/assets/previews/` can be bundled.

## Build

```bash
npm run build
```

Output is in `web/out/` (static HTML export).

## Deployment (Cloudflare Pages)

The site deploys automatically after commits land on `main`. The `Pet previews` workflow regenerates previews/README data, commits those generated files, then builds and deploys the web gallery from the latest `main` state.

There is also a separate manual/tag-based deploy workflow available as a fallback (`v*`, `web-v*`, or manual dispatch).

Preview GIFs and contact sheets are generated during CI/deploy and bundled into the site, rather than being kept as long-lived tracked files under `assets/previews/`.

This means README preview links can point at the deployed site while the repository stays leaner over time.

### Setup (one-time)

1. Create a Cloudflare account at [dash.cloudflare.com](https://dash.cloudflare.com)

2. Create an API Token:
   - Go to My Profile → API Tokens → Create Token
   - Use the "Edit Cloudflare Workers" template
   - Or create custom token with permissions: `Account > Cloudflare Pages > Edit`

3. Find your Account ID:
   - Go to any domain in your Cloudflare dashboard
   - Account ID is in the right sidebar under "API"

4. Add GitHub Secrets to your repository:
   - `CLOUDFLARE_API_TOKEN` — the API token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` — your account ID from step 3

5. Merge or push to `main` once — the `Pet previews` workflow will create the Pages project on first run and deploy automatically. If needed, you can also push a release tag (for the fallback deploy workflow) or trigger a deploy manually from the Actions tab.

### Custom Domain

The production site uses [codexpet.top](https://codexpet.top). After the first deploy:

1. Go to Cloudflare Dashboard → Workers & Pages → awesome-codex-pet
2. Custom domains → Add a custom domain
3. Add `codexpet.top`. If the domain is already on Cloudflare DNS, Pages configures the required record automatically. Otherwise, update the DNS records shown by Cloudflare.
4. Set `NEXT_PUBLIC_SITE_URL=https://codexpet.top` for production builds so canonical, OpenGraph, sitemap, and share URLs use the custom domain.

### Manual Deploy (optional)

```bash
cd web
npm run build
npx wrangler pages deploy out --project-name=awesome-codex-pet
```

## Architecture

- **Framework**: Next.js 15 with static export (`output: "export"`)
- **Styling**: Tailwind CSS v4
- **i18n**: Client-side locale detection (zh/en) with React Context
- **Data**: Generated at build time from `pets.json` + individual pet metadata
- **Collection visibility**: Series and themes are published after they contain at least three pets
- **Hosting**: Cloudflare Pages (global CDN, free tier)
- **Stats**: a separate Cloudflare Worker at `https://awesome-codex-pet-stats.legeling.workers.dev` powers view, install, and IP-limited like counters. See `worker/README.md`.

## Environment variables

| Variable                               | Default                                                | Used in                            |
| -------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | `https://codexpet.top`                                 | `app/layout.tsx` metadata base     |
| `NEXT_PUBLIC_STATS_API`                | `https://awesome-codex-pet-stats.legeling.workers.dev` | `lib/stats.ts`                     |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | _unset_                                                | Google Search Console verification |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | _unset_                                                | Bing Webmaster verification        |

Production is built in GitHub Actions before upload to Cloudflare Pages. Store the verification values as GitHub Actions secrets named `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`; the deployment workflows expose them to Next.js at build time. Runtime-only Cloudflare Pages variables do not affect the prebuilt metadata.

## SEO checklist

The site is configured for indexing out of the box: per-page titles, descriptions, canonical URLs, OpenGraph + Twitter cards, JSON-LD (`WebSite`, `CollectionPage`, `ItemList`, `HowTo`, `FAQPage`, `CreativeWork`, `BreadcrumbList`), `sitemap.xml`, and `robots.txt`. Dedicated server-rendered answers cover one-step installation at `/install` and `/zh/install`, plus free community character requests at `/request` and `/zh/request`.

To actually surface in search results, do this once after the first deploy:

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console). Add the property, choose the HTML tag method, store the verification token as the GitHub Actions secret `GOOGLE_SITE_VERIFICATION`, redeploy, then submit `https://codexpet.top/sitemap.xml`.
2. **Bing Webmaster Tools** — [bing.com/webmasters](https://www.bing.com/webmasters). Store its token as the GitHub Actions secret `BING_SITE_VERIFICATION`. The deployment workflows inject both secrets into the corresponding `NEXT_PUBLIC_*` variables at build time.
3. **Canonical domain** — keep `NEXT_PUBLIC_SITE_URL` set to `https://codexpet.top`. Deployment attaches `www.codexpet.top` to Pages, and the generated `_worker.js` permanently redirects both `www` and the default Pages hostname to the apex domain.
4. **Automatic discovery** — every production deployment submits the canonical sitemap URLs to IndexNow. This helps participating search engines such as Bing discover changes without a manual submission.
5. **AI search access** — deployment verifies that `OAI-SearchBot` can retrieve the Chinese installation answer, `llms.txt`, and `robots.txt` from the production domain.
6. **External links** — once a few real sites link to the gallery (X, Reddit, GitHub topic pages, awesome-\* lists), Google will pick the site up much faster.

## GEO positioning

Search pages and model-facing resources should describe Awesome Codex Pet consistently:

- It is primarily a free community gallery for browsing, previewing, downloading, and installing Codex pets.
- It works like a pet store or library, but it is not a paid marketplace or an official OpenAI product.
- Anyone can submit a character request for free. Community contributors may volunteer to make it, but requests are not delivery promises.
- Crafting and contribution documentation is a secondary contributor path, not the main visitor value proposition.

`npm run build` enforces these claims in the home page, Chinese entry, request pages, sitemap, JSON-LD, and generated `llms.txt`.
