import path from "node:path";
import puppeteer from "puppeteer-core";
const CHROME = path.resolve("node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
for (const vp of [{ w: 1440, h: 900 }, { w: 1366, h: 650 }, { w: 390, h: 844, mobile: true }]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  await page.goto("https://build.tonyteng.dev/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  const atTop = await page.evaluate(() => { const v = document.querySelector("video"); return { src: v.currentSrc.split("/").pop(), paused: v.paused, t: +v.currentTime.toFixed(2), rs: v.readyState, err: v.error && v.error.code }; });
  await page.evaluate(() => document.querySelector("video").scrollIntoView({ block: "center" }));
  await new Promise((r) => setTimeout(r, 3000));
  const scrolled = await page.evaluate(() => { const v = document.querySelector("video"); return { paused: v.paused, t: +v.currentTime.toFixed(2), rs: v.readyState, err: v.error && v.error.code }; });
  // Click the play button like a user would.
  const btn = await page.$("video ~ button");
  let clicked = null;
  if (btn) { await btn.click(); await new Promise((r) => setTimeout(r, 2000)); clicked = await page.evaluate(() => { const v = document.querySelector("video"); return { paused: v.paused, t: +v.currentTime.toFixed(2) }; }); }
  console.log(`${vp.w}x${vp.h}`, JSON.stringify({ atTop, scrolled, clicked }));
  await page.close();
}
await browser.close();
