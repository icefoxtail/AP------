'use strict';

// Read-only inspection of Chrome-generated print output. Temporary PDFs and
// page pixels never enter the evidence directory; only digests and dimensions do.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function inspectPdf(bytes) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pdf-parity-'));
  try {
    const input = path.join(directory, 'chrome.pdf');
    fs.writeFileSync(input, bytes);
    execFileSync('pdftoppm', ['-r', '96', input, path.join(directory, 'page')], {
      timeout: 45000, maxBuffer: 1024 * 1024, stdio: ['ignore', 'ignore', 'pipe']
    });
    const files = fs.readdirSync(directory).filter(name => /^page-\d+\.ppm$/.test(name))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    if (!files.length) throw new Error('PDF_RASTER_PAGES_MISSING');
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
    return { renderer: 'Poppler pdftoppm', dpi: 96, pages,
      textSha256: sha256(text), textBytes: text.length };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

module.exports = { inspectPdf };
