/**
 * Measures every deferred section's mounted height at the six placeholder widths and compares
 * them with src/app/deferred-sections.tsx.
 *
 *   npm run build && npm start        (in another terminal, port 3006)
 *   node scripts/measure-heights.mjs            print a fresh SECTIONS height table
 *   node scripts/measure-heights.mjs --check    exit 1 when any stored height drifts > 8%
 *
 * Needs `playwright` resolvable from this folder (npm i -D playwright) and a browser it can launch.
 * Env: BASE_URL (default http://localhost:3006), CHROME_PATH (optional executable).
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3006";
const WIDTHS = [375, 640, 768, 1024, 1280, 1536];
const DRIFT_LIMIT = 0.08;
const check = process.argv.includes("--check");

async function mountEverything(page) {
  for (let i = 0; i < 400; i += 1) {
    const pending = await page.locator('[data-deferred="pending"]').count();
    if (pending === 0) break;
    await page.evaluate(() => window.scrollBy({ top: 1500, behavior: "instant" }));
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((img) => img.scrollIntoView()));
  await page.waitForTimeout(1500);
}

async function measure(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await mountEverything(page);
  const result = await page.evaluate(() =>
    Object.fromEntries([...document.querySelectorAll("[data-spy]")].map((el) => [el.dataset.spy, Math.round(el.getBoundingClientRect().height)])),
  );
  await page.close();
  return result;
}

function storedHeights() {
  const src = readFileSync(new URL("../src/app/deferred-sections.tsx", import.meta.url), "utf8");
  const rows = [...src.matchAll(/id: "([^"]+)", heights: \[([^\]]+)\]/g)];
  return Object.fromEntries(rows.map((m) => [m[1], m[2].split(",").map((n) => Number(n.trim()))]));
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const perWidth = [];
for (const w of WIDTHS) perWidth.push(await measure(browser, w));
await browser.close();

const stored = storedHeights();
let drifted = 0;
for (const id of Object.keys(stored)) {
  const fresh = perWidth.map((m) => m[id]);
  console.log(`  { id: "${id}", heights: [${fresh.join(", ")}] },`);
  fresh.forEach((h, i) => {
    if (Math.abs(h - stored[id][i]) / h > DRIFT_LIMIT) {
      drifted += 1;
      console.error(`DRIFT ${id} @${WIDTHS[i]}: stored ${stored[id][i]}, measured ${h}`);
    }
  });
}
if (check && drifted > 0) process.exit(1);
