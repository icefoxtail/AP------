'use strict';

// Read-only inspection of Chrome-generated print output. Temporary PDFs and
// page pixels never enter the evidence directory; only digests and dimensions do.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function inspectPdf(bytes, expectedPages) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pdf-parity-'));
  const started = performance.now();
  try {
    const input = path.join(directory, 'chrome.pdf');
    fs.writeFileSync(input, bytes);
    // This is an offline, all-page image inspection budget, not a product
    // rendering or print-readiness timeout. Fifty one-question pages need more
    // raster work than the previous thirteen-page exam sample. Keep every page
    // and the same resolution; allow the inspector to finish that extra work.
    const rasterTimeoutMs = Math.max(45000, Math.min(240000, 15000 + expectedPages * 4000));
    try {
      execFileSync('pdftoppm', ['-r', '96', input, path.join(directory, 'page')], {
        timeout: rasterTimeoutMs, maxBuffer: 1024 * 1024, stdio: ['ignore', 'ignore', 'pipe']
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') throw Object.assign(new Error('PDF_RASTER_INSPECTION_TIMEOUT'), {
        code: 'PDF_RASTER_INSPECTION_TIMEOUT', details: { expectedPages, rasterTimeoutMs }
      });
      throw error;
    }
    const files = fs.readdirSync(directory).filter(name => /^page-\d+\.ppm$/.test(name))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    if (!files.length) throw new Error('PDF_RASTER_PAGES_MISSING');
    if (files.length !== expectedPages) throw new Error('PDF_RASTER_PAGE_COUNT_CHANGED');
    const pages = files.map((name, index) => {
      const image = fs.readFileSync(path.join(directory, name));
      const header = /^P6\s+(\d+)\s+(\d+)\s+255\r?\n/.exec(image.subarray(0, 120).toString('latin1'));
      if (!header) throw new Error('PDF_RASTER_HEADER_INVALID');
      const width = Number(header[1]), height = Number(header[2]);
      const pixels = image.subarray(Buffer.byteLength(header[0], 'latin1'));
      if (pixels.length !== width * height * 3) throw new Error('PDF_RASTER_PIXELS_INCOMPLETE');
      return { page: index + 1, width, height, rgbSha256: sha256(pixels) };
    });
    const text = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', input, '-'], {
      timeout: 45000, maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
    });
    return { renderer: 'Poppler pdftoppm', dpi: 96, pages, rasterTimeoutMs,
      inspectionElapsedMs: Number((performance.now() - started).toFixed(2)),
      textSha256: sha256(text), textBytes: text.length };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

module.exports = { inspectPdf };
