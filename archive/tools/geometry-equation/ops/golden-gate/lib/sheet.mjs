// Side-by-side comparison sheets (2026-11-24): a figure that changed is not a failure, it is something a person looks at.
// Every pair whose bytes differ (and every CLIPPED one) becomes one row: the base figure on the left, the head figure on the right. 8-12 pairs (default 10) make one PNG.
// The sheet is made with the Chrome and playwright of the render dependencies. A sheet that cannot be made is printed as a note and never changes the verdict.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {mkdirp, writeJson} from './util.mjs';
import {resolveChrome} from './env-fingerprint.mjs';

export const PAIRS_PER_SHEET = 10;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

// rows of a comparison -> the pairs a sheet shows: both figures exist and (bytes differ or the head is CLIPPED). CLIPPED first, then by item.
export function sheetPairs(rows, readSvg) {
  const pairs = [];
  for (const r of rows) {
    if (r.verdict !== 'DIFFERENT' && r.verdict !== 'CLIPPED') continue;
    if (r.base?.status !== 'ARCHIVE_BOUND' || r.head?.status !== 'ARCHIVE_BOUND') continue; // a changed failure has no figure to show
    pairs.push({item: r.item, verdict: r.verdict, reason: r.reason ?? '', base: readSvg('base', r.item), head: readSvg('head', r.item)});
  }
  return pairs.filter(p => p.base && p.head).sort((a, b) => (a.verdict === b.verdict ? a.item.localeCompare(b.item) : a.verdict === 'CLIPPED' ? -1 : 1));
}

export const chunkPairs = (pairs, per = PAIRS_PER_SHEET) => { const out = []; for (let i = 0; i < pairs.length; i += per) out.push(pairs.slice(i, i + per)); return out; };

export function sheetHtml(pairs, {title, baseLabel, headLabel, fontUrl}) {
  const rows = pairs.map(p => `<section class="pair"><h2>${esc(p.item)} <span class="${p.verdict}">${esc(p.verdict)}</span> <small>${esc(p.reason).slice(0, 160)}</small></h2>
<div class="cells"><figure><figcaption>${esc(baseLabel)}</figcaption>${p.base}</figure><figure><figcaption>${esc(headLabel)}</figcaption>${p.head}</figure></div></section>`).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
${fontUrl ? `@font-face{font-family:"Noto Sans KR";src:url("${fontUrl}")}` : ''}
body{margin:0;padding:12px;width:1096px;background:#f3f3f3;font:13px "Noto Sans KR",sans-serif;color:#111}
h1{font-size:15px;margin:0 0 8px}
.pair{background:#fff;border:1px solid #bbb;margin:0 0 10px;padding:6px}
h2{font-size:13px;margin:0 0 4px}h2 small{font-weight:400;color:#555}
h2 .CLIPPED{color:#fff;background:#c00;padding:0 4px}h2 .DIFFERENT{color:#333;background:#ddd;padding:0 4px}
.cells{display:flex;gap:8px}figure{flex:1;margin:0;min-width:0;border:1px solid #ddd}
figcaption{font-size:11px;background:#eee;padding:2px 4px}
figure svg{display:block;max-width:100%;max-height:340px;margin:0 auto}
</style></head><body><h1>${esc(title)}</h1>
${rows}</body></html>`;
}

// Writes sheet-01.png ... and index.json into outDir. Returns {dir, sheets: [{file, items}], note}. Never throws.
export async function writeSheets({pairs, outDir, depsDir, baseLabel, headLabel, per = PAIRS_PER_SHEET, log = () => {}}) {
  const result = {dir: outDir, sheets: [], note: null};
  if (!pairs.length) return result;
  let browser = null;
  try {
    mkdirp(outDir);
    const require = createRequire(path.join(depsDir, 'node_modules', 'noop.js'));
    const {chromium} = require('playwright');
    const exe = resolveChrome();
    browser = await chromium.launch({headless: true, ...(exe ? {executablePath: exe} : {})});
    const fontFile = path.join(depsDir, 'NotoSansKR.ttf');
    const fontUrl = fs.existsSync(fontFile) ? pathToFileURL(fontFile).href : null;
    const groups = chunkPairs(pairs, per);
    for (let i = 0; i < groups.length; i++) {
      const name = `sheet-${String(i + 1).padStart(2, '0')}`;
      const htmlFile = path.join(outDir, `${name}.html`), pngFile = path.join(outDir, `${name}.png`);
      fs.writeFileSync(htmlFile, sheetHtml(groups[i], {title: `${name}: ${baseLabel} vs ${headLabel} (${groups[i].length} pairs of ${pairs.length})`, baseLabel, headLabel, fontUrl}));
      const page = await browser.newPage({viewport: {width: 1120, height: 800}});
      await page.goto(pathToFileURL(htmlFile).href);
      await page.evaluate(() => document.fonts?.ready);
      await page.screenshot({path: pngFile, fullPage: true});
      await page.close();
      fs.rmSync(htmlFile, {force: true});
      result.sheets.push({file: pngFile, items: groups[i].map(p => p.item)});
      log(`comparison sheet ${pngFile} (${groups[i].length} pairs)`);
    }
    writeJson(path.join(outDir, 'index.json'), result.sheets.map(s => ({file: path.basename(s.file), items: s.items})));
  } catch (e) {
    result.note = `comparison sheets could not be made: ${String(e?.message ?? e).split('\n')[0]}`;
  } finally { try { await browser?.close(); } catch { /* gone */ } }
  return result;
}
