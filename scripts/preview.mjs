import fs from "node:fs/promises";
import sharp from "sharp";
const [id, source] = process.argv.slice(2);
const sites = JSON.parse(await fs.readFile("src/data/sites.json", "utf8"));
if (!id || !source || !sites.some((s) => s.id === id))
  throw new Error(
    "Usage: node scripts/preview.mjs <existing-id> <local-screenshot-path>",
  );
await sharp(source)
  .resize(1280, 800, { fit: "contain", background: "#eeeee7" })
  .webp({ quality: 83 })
  .toFile(`public/previews/${id}.webp`);
console.log(
  `Updated preview for ${id}. Inspect it and update verifiedAt after review.`,
);
