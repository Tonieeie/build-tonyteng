// Screenshots past projects (desktop + mobile) with company names and header logos blurred,
// for the anonymized /work page. Output: public/projects/<id>.png and <id>_m.png
// Usage: node scripts/project-shots.mjs
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = path.resolve(
  "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe",
);
const OUT = path.resolve("public/projects");
fs.mkdirSync(OUT, { recursive: true });

// Terms that identify the client. Any element whose own text contains one gets blurred.
const PROJECTS = [
  { id: "hotel", url: "https://hotel.tonyteng.dev/", terms: ["龙旺", "马鬃山", "LONGWANG", "Longwang"] },
  { id: "insurance", url: "https://www.auoshc.com/", terms: ["CoverMate", "auoshc", "AUOSHC"] },
  { id: "agency", url: "https://www.brandpulsemedia.co/", terms: ["BrandPulse", "Brand Pulse", "BRANDPULSE"] },
  { id: "covers", url: "https://xhs-cover-studio.vercel.app/", terms: ["BUPA", "Bupa", "WeUp", "BrandPulse"] },
];

const VIEWPORTS = [
  { suffix: "", width: 1440, height: 900, mobile: false },
  {
    suffix: "_m",
    width: 390,
    height: 844,
    mobile: true,
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
];

function anonymize(terms) {
  const hit = (s) => !!s && terms.some((t) => s.includes(t));
  // Blur strength scales with text size so big headings are as unreadable as small ones.
  const blur = (el) => {
    const size = parseFloat(getComputedStyle(el).fontSize) || 16;
    el.style.setProperty("filter", `blur(${Math.max(10, size * 0.35)}px)`, "important");
  };
  // Text: blur the closest element that directly holds a matching text node.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const els = new Set();
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (hit(n.textContent) && n.parentElement) els.add(n.parentElement);
  }
  // Images/SVGs/links that name the client, plus the home-link logo.
  document.querySelectorAll("img, svg, [aria-label], [title]").forEach((el) => {
    const s = [el.getAttribute("alt"), el.getAttribute("src"), el.getAttribute("aria-label"), el.getAttribute("title")].join(" ");
    if (hit(s)) els.add(el);
  });
  document.querySelectorAll('a[href="/"], a[href="./"], a[href="#"], header a:first-of-type').forEach((a) => {
    a.querySelectorAll("img, svg").forEach((el) => els.add(el));
    if (hit(a.textContent)) els.add(a);
  });
  els.forEach(blur);
  return els.size;
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
try {
  for (const p of PROJECTS) {
    for (const v of VIEWPORTS) {
      const page = await browser.newPage();
      if (v.ua) await page.setUserAgent(v.ua);
      await page.setViewport({ width: v.width, height: v.height, isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: 1 });
      await page.goto(p.url, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 3500));
      const n = await page.evaluate(anonymize, p.terms);
      await new Promise((r) => setTimeout(r, 300));
      const file = path.join(OUT, `${p.id}${v.suffix}.png`);
      await page.screenshot({ path: file });
      console.log(`${p.id}${v.suffix}: blurred ${n} elements`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
