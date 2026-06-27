import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

// Recomprime/redimensiona os placeholders para aliviar o peso em conexão fraca.
// Lê o buffer original, processa e sobrescreve.

async function jpg(path, width, quality) {
  const buf = readFileSync(path);
  const out = await sharp(buf)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  writeFileSync(path, out);
  console.log(path, (out.length / 1024).toFixed(0) + "KB");
}

async function png(path, width) {
  const buf = readFileSync(path);
  const out = await sharp(buf)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
  writeFileSync(path, out);
  console.log(path, (out.length / 1024).toFixed(0) + "KB");
}

await jpg("src/assets/images/hero-posto.jpg", 1600, 68);
await jpg("src/assets/images/carreta.jpg", 1200, 72);
await jpg("src/assets/images/combustivel.jpg", 1000, 72);
await png("src/assets/logo.png", 460);
await png("public/logo.png", 192);
console.log("done");
