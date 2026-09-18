import fs from "node:fs/promises";
import sharp from "sharp";
await fs.mkdir("public/previews", { recursive: true });
await fs.mkdir(".qa", { recursive: true });
const catalog = JSON.parse(await fs.readFile("src/data/sites.json", "utf8"));
const files = catalog.map((s) => s.id + ".png").sort();
for (const file of files) {
  await sharp(`.captures/${file}`)
    .resize(1280, 800, { fit: "contain", background: "#eeeee7" })
    .webp({ quality: 83 })
    .toFile(`public/previews/${file.replace(".png", ".webp")}`);
}
for (let start = 0; start < files.length; start += 12) {
  const batch = files.slice(start, start + 12),
    layers = [];
  for (let i = 0; i < batch.length; i++) {
    const name = batch[i];
    const top = Math.floor(i / 3) * 220,
      left = (i % 3) * 320;
    layers.push({
      input: await sharp(`.captures/${name}`)
        .resize(310, 190, { fit: "contain", background: "#e7e7e7" })
        .toBuffer(),
      top,
      left,
    });
    layers.push({
      input: Buffer.from(
        `<svg width="310" height="25"><rect width="310" height="25" fill="white"/><text x="5" y="18" font-size="15">${name}</text></svg>`,
      ),
      top: top + 190,
      left,
    });
  }
  await sharp({
    create: {
      width: 960,
      height: Math.ceil(batch.length / 3) * 220,
      channels: 3,
      background: "#dddddd",
    },
  })
    .composite(layers)
    .png()
    .toFile(`.qa/contact-${start}.png`);
}
console.log(`Converted ${files.length} previews and contact sheets.`);
const og = Buffer.from(
  '<svg width="1280" height="800"><rect width="1280" height="800" fill="#f7f7f2"/><text x="65" y="110" font-family="Arial" font-weight="bold" font-size="58" fill="#c54831">SiteMuse.</text><text x="65" y="230" font-family="Arial" font-size="46" fill="#242420">Good websites deserve a closer look.</text><text x="65" y="300" font-family="Arial" font-size="23" fill="#71716a">50 independent websites. A bilingual collection of inspiration.</text><text x="65" y="740" font-family="Arial" font-size="22" fill="#71716a">Explore. Collect. Make it your own.</text></svg>',
);
const previews = [];
for (const [i, id] of ["abstractchip", "craftz", "nic"].entries())
  previews.push({
    input: await sharp(`public/previews/${id}.webp`)
      .resize(370, 250, { fit: "contain", background: "#eeeee7" })
      .toBuffer(),
    left: 65 + i * 390,
    top: 370,
  });
await sharp(og).composite(previews).png().toFile("public/og.png");
await sharp(
  Buffer.from(
    '<svg width="64" height="64"><rect width="64" height="64" rx="12" fill="#c54831"/><text x="13" y="48" font-size="45" font-family="Arial" font-weight="bold" fill="#f7f7f2">S</text></svg>',
  ),
)
  .png()
  .toFile("src/app/icon.png");
