"use strict";

// Real-Chrome check of the solution-figure display rule (2026-11-11 user decision):
// solution SVGs are sized by label size, not by class: whatever the stored class, an .svg solution figure is shown at
// naturalWidth x 0.6 capped at the column width, height auto (never the 105/145/180px class caps), while raster (.png)
// solution images keep the old caps (small 48%/105px, medium 72%/145px, large 92%/180px).
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
];
const K = 0.6;
const bank = cases.map((item) => ({
  id: item.id, content: `fixture ${item.id}`, choices: [], answer: "1", solution: "해설 $x=1$이다.",
  solutionImage: item.image, solutionImageSize: item.size, solutionImageAlt: item.name,
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

test("PC: svg solution figures are shown at natural width x k capped at the column, never class-capped", async () => {
  const rows = await measure(1440);
  const natural = { "tall medium svg": [420, 480], "wide medium svg": [900, 600], "large svg": [520, 400], "small svg": [520, 400], "full svg": [520, 400],
    "medium svg with cache buster": [420, 480], "small canvas full svg": [384, 320], "small canvas medium svg": [384, 320] };
  for (const [name, [naturalWidth, naturalHeight]] of Object.entries(natural)) {
    const row = byName(rows, name);
    assert.ok(row, name);
    // fails if a 145px / 180px / 105px height cap or a 72% / 92% / 48% width cap is back for an svg
    assert.equal(row.maxHeight, "none", `${name} must not be height-capped: ${JSON.stringify(row)}`);
    assert.equal(row.maxWidth, "100%", `${name} must not be width-capped: ${JSON.stringify(row)}`);
    const expectedWidth = Math.min(naturalWidth * K, row.column);
    assert.ok(Math.abs(row.width - expectedWidth) <= 1, `${name} should be ${expectedWidth}px wide: ${JSON.stringify(row)}`);
    assert.ok(Math.abs(row.height - expectedWidth * naturalHeight / naturalWidth) <= 1.5, `${name} keeps its aspect ratio: ${JSON.stringify(row)}`);
  }
  // 420x480 medium was 127x145 before this rule; it must now be well above the old height cap
  assert.ok(byName(rows, "tall medium svg").height > 200, JSON.stringify(byName(rows, "tall medium svg")));
  // a small canvas displays narrower than the column, whatever its stored class (full included): never larger than before
  for (const name of ["small canvas full svg", "small canvas medium svg"]) {
    const row = byName(rows, name);
    assert.ok(row.width < row.column - 20, `${name} should be narrower than the column: ${JSON.stringify(row)}`);
  }
  // a wide canvas still reaches the column and no further
  assert.ok(Math.abs(byName(rows, "wide medium svg").width - byName(rows, "wide medium svg").column) <= 1);
});

test("PC: raster (png) solution figures keep the old size-class caps", async () => {
  const rows = await measure(1440);
  const expected = { "medium png": ["72%", "145px"], "large png": ["92%", "180px"], "small png": ["48%", "105px"] };
  for (const [name, [maxWidth, maxHeight]] of Object.entries(expected)) {
    const row = byName(rows, name);
    assert.equal(row.maxWidth, maxWidth, JSON.stringify(row));
    assert.equal(row.maxHeight, maxHeight, JSON.stringify(row));
    assert.ok(row.height <= parseFloat(maxHeight) + 1, JSON.stringify(row));
  }
});

test("phone 375: svg solution figures stay at full column width (the reader mode already did this; must not regress)", async () => {
  const rows = await measure(375);
  for (const name of ["tall medium svg", "large svg", "full svg"]) {
    const row = byName(rows, name);
    assert.equal(row.maxHeight, "none", JSON.stringify(row));
    assert.ok(row.width >= row.column - 1, JSON.stringify(row));
  }
});
