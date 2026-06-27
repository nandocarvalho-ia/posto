import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.SHOOT_URL || "http://localhost:5173";
const OUT = "shots";
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

async function launch() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

// Rola a página em passos para disparar os IntersectionObservers (reveals),
// depois volta ao topo.
async function triggerReveals(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
}

const browser = await launch();
for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  await page.goto(URL, { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${vp.name}-fold.png` });
  await triggerReveals(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  if (vp.name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".nav__toggle").click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/mobile-menu.png` });
  }

  if (vp.name === "desktop") {
    for (const id of ["o-posto", "estrutura", "localizacao"]) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await el.screenshot({ path: `${OUT}/sec-${id}.png` });
    }
  }
  await page.close();
  console.log("ok", vp.name);
}
await browser.close();
console.log("done");
