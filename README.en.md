# SiteMuse

[中文](README.md) | English

A bilingual gallery of independent web inspiration. The first edition features 50 personal sites, blogs, portfolios, and creative experiments, with real screenshots and three concrete design takeaways per entry.

![SiteMuse](public/og.png)

## Features

- Responsive editorial gallery and individual case pages.
- Search across both languages; multi-select type and style filters stored in the URL.
- Curated and recently-added sorting.
- Browser-local favorites, shared between languages. Session fallback when storage is unavailable.
- Static `/zh` and `/en` pages with language alternates, social previews, and a sitemap.

## Development

Node.js 24 and npm are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 .

```sh
npm run validate
npm test
npm run build
npm run typecheck
npm start
```

Built with Next.js App Router, React, TypeScript, and Tailwind CSS. No database, authentication service, or admin dashboard.

## Maintenance and deployment

Entries live in `src/data/sites.json`; screenshots live in `public/previews/`. See the [maintenance guide](docs/MAINTENANCE.md). Validate changes before committing. Once linked, Vercel automatically deploys the `main` branch.

Canonical URLs use `NEXT_PUBLIC_SITE_URL`, falling back to Vercel’s `VERCEL_PROJECT_PRODUCTION_URL`. Set the former when using a custom domain and rebuild.

Favorites are stored locally under `sitemuse:saved:v1`. They are not uploaded or synchronized across devices. Clearing browser data removes them.

## Credits and licensing

Code is [MIT licensed](LICENSE). **Third-party screenshots, trademarks, and source-site content are excluded from that license.** They belong to their respective creators. Previews are used for identification, commentary, and design reference, with source links and verification dates. Websites can change after capture.

For corrections or preview removal, contact the maintainer through [GitHub Issues](https://github.com/DocJlm/sitemuse/issues). Geist font license: `src/fonts/OFL.txt`.
