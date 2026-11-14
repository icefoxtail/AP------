import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { once } from 'node:events';
import { loadBank } from './build-visual-render-matrix.mjs';
import { launchBrowser, repoRoot, sameOriginExamImageUrl, captureTimeoutMs } from './visual-browser-runtime.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const sourcePattern = /^archive\/exams\/(?:original|similar|types)\/(?:high|middle)\/(?:[^/]+\/)*[^/]+\.js$/;
const surfaces = [
  { name: 'desktop', width: 1440, height: 1000, media: 'screen' },
  { name: 'mobile', width: 390, height: 844, media: 'screen' },
  { name: 'print', width: 1440, height: 1000, media: 'print' }
];

function archiveFile(relative) {
  const file = path.resolve(repoRoot, relative);
  if (!file.startsWith(path.resolve(repoRoot) + path.sep)) throw Error('Path escapes repository');
  return file;
}

function serve(req, res) {
  try {
    const file = archiveFile('.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    const type = mime[path.extname(file).toLowerCase()];
    if (!type || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(400).end();
  }
}

function readSource(entry) {
  if (!sourcePattern.test(entry.exam)) throw Error('Expected an Archive exam path');
  const bytes = fs.readFileSync(archiveFile(entry.exam));
  const bank = loadBank(bytes.toString('utf8'));
  if (!Array.isArray(bank) || !Array.isArray(entry.targets) || !entry.targets.length) throw Error('Missing bank or targets: ' + entry.exam);
  const targets = entry.targets.map(target => {
    const index = bank.findIndex((q, i) => String(q.id ?? q.qid ?? q.number ?? i + 1) === String(target.id));
    if (index < 0) throw Error('Question absent from bank: ' + target.id);
    if (!Array.isArray(target.slots)) throw Error('Expected an SVG slot array');
    return { id: target.id, ordinal: index + 1, slots: target.slots };
  });
  return { ...entry, targets, sourceSha256: sha(bytes), questionCount: bank.length };
}

function inspectQuestion(box) {
  const slotFor = element => {
    const choice = element.closest('.choice-item');
    if (choice) return 'choice-' + ([...choice.parentElement.children].indexOf(choice) + 1);
    return element.closest('.q-image-wrap') ? 'image' : 'body';
  };
  const bounds = element => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  };
  const nodes = [...box.querySelectorAll('.q-content img, .q-image-wrap img, .choice-text img, .q-content svg, .choice-text svg')].filter(element => {
    if (element.tagName.toLowerCase() === 'svg') return !element.parentElement.closest('svg') && !element.closest('mjx-container, .katex');
    return /^data:image\/svg\+xml/i.test(element.src) || /\.svg(?:[?#]|$)/i.test(element.src);
  });
  return {
    sourceRef: box.dataset.sourceRef,
    box: bounds(box),
    page: [...document.querySelectorAll('#print-area .page')].indexOf(box.closest('.page')) + 1,
    clipped: [...box.querySelectorAll('.q-content, .choice-item, .choice-text, img, svg')]
      .some(element => {
        const item = bounds(element);
        if (item.height <= 0) return false;
        for (let ancestor = element.parentElement; ancestor && ancestor !== box.closest('.page')?.parentElement; ancestor = ancestor.parentElement) {
          if (!['hidden', 'clip'].includes(getComputedStyle(ancestor).overflowY)) continue;
          const clip = bounds(ancestor);
          if (item.y + item.height > clip.y + clip.height + 2 || item.y < clip.y - 2) return true;
        }
        return false;
      }),
    images: nodes.map(element => {
      const rect = bounds(element);
      const style = getComputedStyle(element);
      const slot = element.closest('.choice-text, .q-content, .q-image-wrap');
      const slotRect = bounds(slot);
      const choiceGrid = element.closest('.choices');
      const choiceRect = choiceGrid ? bounds(choiceGrid) : null;
      const isImage = element.tagName.toLowerCase() === 'img';
      const loaded = !isImage || element.complete && element.naturalWidth > 0;
      const intrinsic = isImage
        ? { width: element.naturalWidth, height: element.naturalHeight }
        : { width: element.viewBox.baseVal.width, height: element.viewBox.baseVal.height };
      const contains = (outer, inner) => inner.x >= outer.x - 1 && inner.y >= outer.y - 1
        && inner.x + inner.width <= outer.x + outer.width + 1 && inner.y + inner.height <= outer.y + outer.height + 1;
      const contained = contains(slotRect, rect) && contains(bounds(box), rect) && (!choiceRect || contains(choiceRect, rect));
      const payload = isImage ? element.currentSrc || element.src : element.outerHTML;
      return { slot: slotFor(element), kind: isImage ? (/^data:/i.test(payload) ? 'data' : 'external') : 'inline', payload,
        loaded, rect, slotRect, intrinsic, objectFit: style.objectFit, contained };
    })
  };
}

async function capture(browser, origin, entry, surface, folder) {
  const page = await browser.newPage({ viewport: { width: surface.width, height: surface.height } });
  const responseDigests = new Map();
  const pending = [];
  const row = { surface: surface.name, questions: [], errors: [] };
  try {
    await page.route('**/*', route => {
      const url = route.request().url();
      return url.startsWith(origin + '/') || /^(?:data|blob):/.test(url) ? route.continue() : route.abort();
    });
    page.on('pageerror', error => row.errors.push(String(error)));
    page.on('response', response => {
      if (/\.svg(?:[?#]|$)/i.test(response.url()) && response.ok()) {
        pending.push(response.body().then(bytes => responseDigests.set(response.url(), sha(bytes))).catch(error => row.errors.push(String(error))));
      }
    });
    const query = new URLSearchParams({ data: entry.exam.slice('archive/'.length), mode: 'exam' });
    await page.goto(sameOriginExamImageUrl(origin + '/archive/engine.html?' + query), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(count => {
      const failure = document.documentElement.dataset.apRenderError;
      if (failure) throw Error(failure);
      const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
      return ['RENDER_READY', 'PRINT_READY'].includes(readiness.state)
        && document.querySelectorAll('#print-area .q-box[data-source-ref] .q-num').length === count;
    }, entry.questionCount, { timeout: captureTimeoutMs(60000) });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('#print-area img')].map(image => image.decode().catch(() => {})));
    });
    if (surface.media === 'print') await page.emulateMedia({ media: 'print' });
    // Capture the rendered question without the fixed toolbar obscuring its first lines.
    await page.addStyleTag({ content: '#mode-ctrl { visibility: hidden !important; }' });
    const blocks = page.locator('#print-area .q-box[data-source-ref]');
    for (const target of entry.targets) {
      const box = blocks.filter({ has: page.locator('.q-num').getByText(String(target.ordinal) + '.', { exact: true }) });
      const question = { ...target, ...await box.evaluate(inspectQuestion) };
      if (question.clipped) row.errors.push('QUESTION_CLIPPED:' + target.id);
      const expectedSlots = [...target.slots].sort().join(',');
      const actualSlots = question.images.map(image => image.slot).sort().join(',');
      if (expectedSlots !== actualSlots) row.errors.push('SVG_SLOT_MISMATCH:' + target.id + ':' + actualSlots);
      const overlaps = question.images.some((image, i) => question.images.slice(i + 1).some(other => {
        const a = image.rect;
        const b = other.rect;
        return a.x < b.x + b.width - 1 && b.x < a.x + a.width - 1
          && a.y < b.y + b.height - 1 && b.y < a.y + a.height - 1;
      }));
      if (overlaps) row.errors.push('SVG_SLOTS_OVERLAP:' + target.id);
      if (question.images.some(image => !image.loaded || !image.contained || image.rect.width <= 0 || image.rect.height <= 0)) {
        row.errors.push('SVG_SLOT_SIZE_OR_LOAD:' + target.id);
      }
      const screenshot = surface.name + '-q' + target.ordinal + '.png';
      await box.screenshot({ path: path.join(folder, screenshot), animations: 'disabled' });
      question.screenshot = { path: screenshot, sha256: sha(fs.readFileSync(path.join(folder, screenshot))) };
      row.questions.push(question);
    }
    if (surface.media === 'print') {
      const pdf = path.join(folder, 'print.pdf');
      await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
      row.pdfSha256 = sha(fs.readFileSync(pdf));
    }
    await Promise.all(pending);
    for (const question of row.questions) {
      for (const image of question.images) {
        if (image.kind === 'external') {
          const relative = decodeURIComponent(new URL(image.payload).pathname).replace(/^\//, '');
          image.sha256 = responseDigests.get(image.payload) ?? null;
          image.path = relative;
          if (!image.sha256 || !fs.existsSync(archiveFile(relative)) || image.sha256 !== sha(fs.readFileSync(archiveFile(relative)))) {
            row.errors.push('SVG_RESPONSE_HASH_MISMATCH:' + question.id + ':' + image.slot);
          }
        } else image.sha256 = sha(image.payload);
        delete image.payload;
      }
    }
  } catch (error) {
    row.errors.push(String(error.stack || error));
  } finally {
    await page.close();
  }
  return row;
}

const [manifestPath, outputPath] = process.argv.slice(2);
if (!manifestPath || !outputPath) throw Error('Usage: node capture-problem-svg-slots.mjs <manifest.json> <new output directory>');
const entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, '')).map(readSource);
const output = path.resolve(outputPath);
fs.mkdirSync(output, { recursive: false });
const server = http.createServer(serve).listen(0, '127.0.0.1');
let browser;
let failed = false;
try {
  await once(server, 'listening');
  const origin = 'http://127.0.0.1:' + server.address().port;
  browser = await launchBrowser();
  for (const [index, entry] of entries.entries()) {
    const folder = path.join(output, 'exam-' + (index + 1));
    fs.mkdirSync(folder);
    const rows = [];
    for (const surface of surfaces) rows.push(await capture(browser, origin, entry, surface, folder));
    const errors = rows.reduce((n, row) => n + row.errors.length, 0);
    failed ||= errors > 0;
    fs.writeFileSync(path.join(folder, 'capture.json'), JSON.stringify({
      ...entry, engineSha256: sha(fs.readFileSync(archiveFile('archive/engine.html'))),
      browser: browser.version(), rows
    }, null, 2) + '\n');
    console.log(JSON.stringify({ exam: entry.exam, targets: entry.targets.length, errors }));
  }
} finally {
  await browser?.close();
  server.closeAllConnections();
  server.close();
}
if (failed) process.exitCode = 1;
