import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";
import { sites, types, styles } from "../src/lib/catalog";
const ids = new Set(),
  slugs = new Set(),
  hosts = new Set();
assert(sites.length >= 50, "Catalog must contain at least 50 sites");
for (const site of sites) {
  assert(!ids.has(site.id), `Duplicate ID ${site.id}`);
  ids.add(site.id);
  assert(
    /^[a-z0-9-]+$/.test(site.slug) && !slugs.has(site.slug),
    `Invalid or duplicate slug ${site.slug}`,
  );
  slugs.add(site.slug);
  const url = new URL(site.url);
  assert.equal(url.protocol, "https:");
  const host = url.hostname.replace(/^www\./, "");
  assert(!hosts.has(host), `Duplicate domain ${host}`);
  hosts.add(host);
  assert(site.author && site.name && types[site.type]);
  assert(site.styles.length && site.styles.every((s) => styles[s]));
  assert(Number.isFinite(site.rank));
  for (const locale of ["zh", "en"] as const) {
    assert(site.description[locale]?.length > 15);
    assert(site.bestFor[locale]?.length > 3);
    assert.equal(site.takeaways[locale]?.length, 3);
    assert(site.takeaways[locale].every((t) => t.length > 10));
  }
  for (const date of [site.verifiedAt, site.addedAt])
    assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)));
  assert.equal(site.image, `/previews/${site.id}.webp`);
  const image = await fs.readFile(`public${site.image}`);
  assert(image.length > 2500, `Suspiciously small preview: ${site.id}`);
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.width, 1280);
  assert.equal(metadata.height, 800);
  for (const link of site.links || []) {
    assert.equal(new URL(link.url).protocol, "https:");
    assert(link.label.zh && link.label.en);
  }
}
assert.equal(
  new Set(sites.map((s) => s.rank)).size,
  sites.length,
  "Ranks must be unique",
);
assert(sites.filter((s) => s.featured).length >= 3);
console.log(
  `Validated ${sites.length} unique sites, bilingual content, metadata, and local 1280×800 previews.`,
);
