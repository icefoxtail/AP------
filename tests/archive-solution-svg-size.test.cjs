"use strict";

// Real-Chrome check of the solution-figure display rule (2026-11-11 user decision):
// solution SVGs are sized by label size, not by class: whatever the stored class, an .svg solution figure is shown at
// naturalWidth x 0.6 (never the 105/145/180px class caps), while raster (.png)
// solution images keep the old caps (small 48%/105px, medium 72%/145px, large 92%/180px).
// (PC part superseded 2026-11-18 by the column-ratio rule: see the comment above the PC tests.)
// 2026-11-17 user decision (figures were too large): an svg solution figure is also capped at 90% of the column width and
// 340px tall on PC (phone: 92% / 340px), centered. Only solutionImageSizeOverride "full" lifts that (column width, no height
// cap); solutionImageLayout "fullwidth" keeps its own rule (PC 100% / 640px, phone 100% / no cap).
// Run: node --test tests/archive-solution-svg-size.test.cjs   (AP_PLAYWRIGHT_MODULE overrides the playwright path)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const zlib = require("node:zlib");
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || "playwright");

const root = path.resolve(__dirname, "..");
const examPath = "/archive/exams/test-fixtures/solution-svg-size.js";

const svg = (width, height) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#eef"/><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}" fill="#99f"/></svg>`;
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1; }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(name, data) {
  const type = Buffer.from(name, "ascii");
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0); type.copy(out, 4); data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([type, data])), 8 + data.length);
  return out;
}
function png(width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(Buffer.alloc(height * (1 + width * 4), 200))), chunk("IEND", Buffer.alloc(0))]);
}

// 420x480 is the tall medium shape (shrunk to ~127px before); 900x600 the wide one.
const cases = [
  { id: 1, name: "tall medium svg", image: "/__fx/tall-medium.svg", size: "medium", bytes: svg(420, 480) },
  { id: 2, name: "wide medium svg", image: "/__fx/wide-medium.svg", size: "medium", bytes: svg(900, 600) },
  { id: 3, name: "large svg", image: "/__fx/large.svg", size: "large", bytes: svg(520, 400) },
  { id: 4, name: "small svg", image: "/__fx/small.svg", size: "small", bytes: svg(520, 400) },
  { id: 5, name: "full svg", image: "/__fx/full.svg", size: "full", bytes: svg(520, 400) },
  { id: 6, name: "medium svg with cache buster", image: "/__fx/versioned.svg?v=20261111", size: "medium", bytes: svg(420, 480) },
  { id: 7, name: "medium png", image: "/__fx/medium.png", size: "medium", bytes: png(420, 480) },
  { id: 8, name: "large png", image: "/__fx/large.png", size: "large", bytes: png(420, 480) },
  { id: 9, name: "small png", image: "/__fx/small.png", size: "small", bytes: png(420, 480) },
  // a figure drawn on a small canvas displays narrower than the column, whatever its class
  { id: 10, name: "small canvas full svg", image: "/__fx/small-canvas-full.svg", size: "full", bytes: svg(384, 320) },
  { id: 11, name: "small canvas medium svg", image: "/__fx/small-canvas-medium.svg", size: "medium", bytes: svg(384, 320) },
  // older hand-made SVGs narrower than 384 were drawn 1:1: shown at their natural width (factor 1), capped at the column
  { id: 12, name: "hand-made 120 svg", image: "/__fx/hand-120.svg", size: "medium", bytes: svg(120, 120) },
  { id: 13, name: "hand-made 300 svg", image: "/__fx/hand-300.svg", size: "full", bytes: svg(300, 240) },
  { id: 14, name: "hand-made 383 svg", image: "/__fx/hand-383.svg", size: "large", bytes: svg(383, 300) },
  // 2026-11-17: the only two exceptions to the 90% / 340px cap
  { id: 15, name: "override full tall svg", image: "/__fx/override-full.svg", size: "full", override: "full", bytes: svg(900, 1100) },
  { id: 16, name: "fullwidth layout svg", image: "/__fx/fullwidth.svg", size: "full", layout: "fullwidth", bytes: svg(900, 1100) },
  // same canvas as the override case without the override: capped
  { id: 17, name: "capped tall svg", image: "/__fx/capped-tall.svg", size: "full", bytes: svg(900, 1100) },
  // 2026-11-18: a 3:1 wide figure
  { id: 18, name: "wide 3:1 svg", image: "/__fx/wide-3-1.svg", size: "medium", bytes: svg(900, 300) },
];
const MAX_WIDTH_RATIO = 0.9;
const MAX_HEIGHT = 340;
const K = 0.6;
const SCALED_MIN_WIDTH = 384;
const factorFor = (naturalWidth) => (naturalWidth >= SCALED_MIN_WIDTH ? K : 1);
const bank = cases.map((item) => ({
  id: item.id, content: `fixture ${item.id}`, choices: [], answer: "1", solution: "해설 $x=1$이다.",
  solutionImage: item.image, solutionImageSize: item.size, solutionImageAlt: item.name,
  ...(item.override ? { solutionImageSizeOverride: item.override } : {}),
  ...(item.layout ? { solutionImageLayout: item.layout } : {}),
}));

let server;
let browser;
let baseUrl;
test.before(async () => {
  server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === examPath) {
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      response.end(`window.examTitle='solution svg size fixture';window.questionBank=${JSON.stringify(bank)};`);
      return;
    }
    const fixture = cases.find((item) => item.image.split("?")[0] === pathname);
    if (fixture) {
      response.writeHead(200, { "Content-Type": pathname.endsWith(".svg") ? "image/svg+xml" : "image/png" });
      response.end(fixture.bytes);
      return;
    }
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    const type = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" }[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  try { browser = await chromium.launch({ channel: "chrome" }); } catch (_) { browser = await chromium.launch(); }
});
test.after(async () => {
  await browser?.close();
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

async function measure(width) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  try {
    await page.goto(`${baseUrl}/archive/engine.html?data=${encodeURIComponent("exams/test-fixtures/solution-svg-size.js")}&mode=sol`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction((count) => {
      const images = [...document.querySelectorAll("#print-area .sol-image-wrap img")];
      return images.length >= count && images.every((image) => image.complete && image.naturalWidth > 0)
        && document.documentElement.dataset.apRenderReady === "true";
    }, cases.length, { timeout: 60000 });
    return await page.evaluate(() => [...document.querySelectorAll("#print-area .sol-image-wrap img")].map((image) => {
      const style = getComputedStyle(image);
      const rect = image.getBoundingClientRect();
      return { alt: image.alt, src: image.getAttribute("src"), maxWidth: style.maxWidth, maxHeight: style.maxHeight, width: Math.round(rect.width), height: Math.round(rect.height), column: Math.round(image.closest(".sol-image-wrap").getBoundingClientRect().width) };
    }));
  } finally {
    await page.close();
  }
}
// the engine may replace the alt text, so rows are matched by their image file
const byName = (rows, name) => { const fixture = cases.find((item) => item.name === name); return rows.find((row) => (row.src || "").includes(fixture.image.split("?")[0])); };

// 2026-11-18 사용자 결정(그림 크기는 단 폭 비율 하나): A4 쪽 배치(PC)의 해설 그림은 등급·형식(svg/png)·solutionImageSizeOverride·
// solutionImageLayout과 무관하게 폭·높이 모두 단 폭(83.65mm)의 80% 이하이고, 가로로 긴 그림(자연 폭:높이 >= 2:1)은 폭 88%·높이 30% 이하다.
// 그림 상자의 폭÷높이는 자연 비율과 같다(html2canvas는 object-fit을 지원하지 않아 상자가 비율을 지켜야 한다).
// 이전에는 이 세 테스트가 "자연 폭 x 0.6, 칸 90%·340px, 래스터는 등급 상한 105/145/180px, override full·fullwidth는 예외"를 단정했다.
const COLUMN_PX = 83.65 * 96 / 25.4;
const SOL_RATIO = 0.8;
const WIDE_W = 1;
const WIDE_H = 0.45;
const naturalOf = (name) => {
  const fixture = cases.find((item) => item.name === name);
  const match = /width="(\d+)" height="(\d+)"/.exec(fixture.bytes.toString());
  if (match) return [Number(match[1]), Number(match[2])];
  return [420, 480]; // png fixtures
};

test("PC: every regular solution figure is capped at 80% of the column width and height, regardless of legacy size class", async () => {
  const rows = await measure(1440);
  for (const item of cases) {
    const row = byName(rows, item.name);
    assert.ok(row, item.name);
    const [naturalWidth, naturalHeight] = naturalOf(item.name);
    const wide = naturalWidth / naturalHeight >= 2;
    // the rule is max-width: min(100%, column x ratio): a wide figure at ratio 1 is bounded by the box it sits in
    const maxW = Math.min(COLUMN_PX * (wide ? WIDE_W : SOL_RATIO), Number(row.column) || Infinity);
    const maxH = COLUMN_PX * (wide ? WIDE_H : SOL_RATIO);
    assert.ok(row.width <= maxW + 1.5, `${item.name} must be at most ${Math.round(maxW)}px wide: ${JSON.stringify(row)}`);
    assert.ok(row.height <= maxH + 1.5, `${item.name} must be at most ${Math.round(maxH)}px tall: ${JSON.stringify(row)}`);
    // the box keeps the figure's own ratio (no object-fit letterbox)
    assert.ok(Math.abs(row.width / row.height / (naturalWidth / naturalHeight) - 1) <= 0.02, `${item.name} keeps its aspect ratio: ${JSON.stringify(row)}`);
    // the largest figure that fits is shown at the limit; a 120px hand-made figure is never enlarged
    if (naturalWidth >= maxW && naturalHeight >= maxH) assert.ok(Math.abs(Math.min(row.width, row.height * (naturalWidth / naturalHeight)) - Math.min(maxW, maxH * (naturalWidth / naturalHeight))) <= 2, `${item.name} should reach the limit: ${JSON.stringify(row)}`);
  }
  assert.ok(Math.abs(byName(rows, "hand-made 120 svg").width - 120) <= 1, JSON.stringify(byName(rows, "hand-made 120 svg")));
});

test("PC: the old classes, solutionImageSizeOverride and solutionImageLayout do not change the size", async () => {
  const rows = await measure(1440);
  const base = byName(rows, "capped tall svg");
  for (const name of ["override full tall svg", "fullwidth layout svg"]) {
    const row = byName(rows, name);
    assert.ok(Math.abs(row.width - base.width) <= 1 && Math.abs(row.height - base.height) <= 1, `${name} must equal the plain figure ${JSON.stringify(base)}: ${JSON.stringify(row)}`);
  }
  const small = byName(rows, "small svg"), full = byName(rows, "full svg");
  assert.ok(Math.abs(small.width - full.width) <= 1 && Math.abs(small.height - full.height) <= 1, JSON.stringify([small, full]));
  const smallPng = byName(rows, "small png"), largePng = byName(rows, "large png");
  assert.ok(Math.abs(smallPng.width - largePng.width) <= 1, JSON.stringify([smallPng, largePng]));
});

test("PC: a 3:1 wide figure is 88% wide at most and 30% of the column tall at most", async () => {
  const rows = await measure(1440);
  const row = byName(rows, "wide 3:1 svg");
  assert.ok(row, "wide 3:1 svg");
  // at ratio 1 the figure fills the box it sits in (max-width: min(100%, column x ratio))
  const wideLimit = Math.min(COLUMN_PX * WIDE_W, Number(row.column) || Infinity);
  assert.ok(row.width <= wideLimit + 1.5 && row.width >= wideLimit - 2, JSON.stringify(row));
  assert.ok(row.height <= COLUMN_PX * WIDE_H + 1.5, JSON.stringify(row));
});

test("phone 375: svg solution figures are capped at 92% of the column and 340px tall; override full and fullwidth layout are the exceptions", async () => {
  const rows = await measure(375);
  for (const name of ["tall medium svg", "large svg", "full svg", "capped tall svg"]) {
    const row = byName(rows, name);
    assert.equal(row.maxHeight, `${MAX_HEIGHT}px`, JSON.stringify(row));
    assert.equal(row.maxWidth, "92%", JSON.stringify(row));
    assert.ok(row.width <= row.column * 0.92 + 1, `${name} must not exceed 92% of the column: ${JSON.stringify(row)}`);
    assert.ok(row.height <= MAX_HEIGHT + 1, `${name} must stay within ${MAX_HEIGHT}px: ${JSON.stringify(row)}`);
  }
  const override = byName(rows, "override full tall svg");
  assert.equal(override.maxHeight, "none", JSON.stringify(override));
  assert.equal(override.maxWidth, "100%", JSON.stringify(override));
  assert.ok(override.width >= override.column - 1, JSON.stringify(override));
  const fullwidth = byName(rows, "fullwidth layout svg");
  assert.equal(fullwidth.maxHeight, "none", JSON.stringify(fullwidth));
  assert.equal(fullwidth.maxWidth, "100%", JSON.stringify(fullwidth));
  assert.ok(fullwidth.width >= fullwidth.column - 1, JSON.stringify(fullwidth));
});
