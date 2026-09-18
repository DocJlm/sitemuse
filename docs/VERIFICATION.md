# Verification / 验收记录

2026-09-18 · Production: https://sitemuse-eight.vercel.app

- Content validation: 50 unique websites, complete Chinese/English notes, three takeaways per language, local 1280×800 WebP previews.
- Automated tests: 7 passing (bilingual search, filter intersections/unions, URL parsing, sorting, related cases, persistence failure and malformed storage).
- Next.js production build and TypeScript: passed. GitHub Actions: passed.
- Production HTTP checks: 159 requests passed (100 bilingual detail URLs, 50 previews, root, both home/about/saved pages, sitemap, robots).
- Browser: search, combined filters, sort, empty results, clear filters, language-preserved query, direct detail refresh, related links and source URLs checked.
- Favorites: save, reload, switch language, saved page, and keyboard removal checked on production.
- Responsive: 390 px phone and 768 px tablet frames visually checked; main content has no horizontal overflow. Desktop checked at 1280 px. Reduced-motion CSS disables animations/transitions.
- Canonical and Open Graph URLs resolve to the production domain.

Screenshots record a point in time; third-party pages and designs may change. Storage-denied behavior is unit-tested using an adapter that throws SecurityError; ordinary persistence is also verified in the browser.
