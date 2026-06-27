import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

// Converte o hero (PNG pesado) para JPEG otimizado, sem tocar nas outras imagens.
const path = "src/assets/images/hero-posto.jpg";
const buf = readFileSync(path);
const out = await sharp(buf)
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 72, mozjpeg: true })
  .toBuffer();
writeFileSync(path, out);
console.log("hero", (out.length / 1024).toFixed(0) + "KB");
