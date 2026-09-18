import { test } from "node:test";
import assert from "node:assert/strict";
import { sites, parseFilters, filterSites, related } from "../src/lib/catalog";
test("bilingual searches discover the same brutalist collection", () => {
  const zh = filterSites(
    sites,
    parseFilters(new URLSearchParams("q=粗野主义")),
  );
  const en = filterSites(
    sites,
    parseFilters(new URLSearchParams("q=Brutalist")),
  );
  assert(zh.length >= 3);
  assert.deepEqual(
    zh.map((s) => s.id),
    en.map((s) => s.id),
  );
});
test("OR within one dimension, AND across dimensions", () => {
  const f = parseFilters(
    new URLSearchParams("type=personal,portfolio&style=brutalist,3d"),
  );
  const result = filterSites(sites, f);
  assert(result.some((s) => s.id === "abstractchip"));
  assert(result.some((s) => s.id === "craftz"));
  assert(!result.some((s) => s.id === "bruno"));
  assert(
    result.every(
      (s) =>
        f.types.includes(s.type) && s.styles.some((t) => f.styles.includes(t)),
    ),
  );
});
test("query URL round trip, invalid filters and empty results", () => {
  const p = new URLSearchParams();
  p.set("q", "  Anthony Fu  ");
  p.set("style", "minimal,invalid");
  const f = parseFilters(new URLSearchParams(p.toString()));
  assert.equal(f.styles.length, 1);
  assert.equal(filterSites(sites, f)[0].id, "antfu");
  assert.equal(
    filterSites(sites, { ...f, q: "no-such-site-123456" }).length,
    0,
  );
  assert.equal(
    filterSites(sites, parseFilters(new URLSearchParams())).length,
    sites.length,
  );
});
test("latest sort uses actual addition dates with curated tie break", () => {
  const fixtures = [
    { ...sites[0], addedAt: "2025-01-01", rank: 1 },
    { ...sites[1], addedAt: "2026-02-01", rank: 3 },
    { ...sites[2], addedAt: "2026-02-01", rank: 2 },
  ];
  assert.deepEqual(
    filterSites(fixtures, { q: "", types: [], styles: [], sort: "new" }).map(
      (s) => s.rank,
    ),
    [2, 3, 1],
  );
});
test("recommendations contain three unique other sites", () => {
  for (const s of sites) {
    const result = related(s);
    assert.equal(result.length, 3);
    assert(!result.some((r) => r.id === s.id));
    assert.equal(new Set(result.map((r) => r.id)).size, 3);
  }
});
