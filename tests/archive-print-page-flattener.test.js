const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const flattener = require(path.join(root, 'archive', 'print_page_flattener.js'));

test('fast print uses an exact 200dpi A4 raster target', () => {
  assert.equal(flattener.captureScaleForDpi(200), 200 / 96);
  assert.deepEqual(flattener.pixelSizeForA4(200), { width: 1654, height: 2335 });
});

test('page raster cache key changes with rendered output', () => {
  const makeRoot = html => ({
    innerHTML: html,
    querySelectorAll(selector) {
      if (selector === '.page') return [{}, {}];
      if (selector === 'img') return [];
      return [];
    }
  });
  const first = flattener.makeCacheKey(makeRoot('<div>first</div>'), { printDpi: 200, jpegQuality: 0.9 });
  const second = flattener.makeCacheKey(makeRoot('<div>second</div>'), { printDpi: 200, jpegQuality: 0.9 });
  assert.notEqual(first, second);
});

test('archive engines use hybrid fast print and preserve vector and compatibility modes', () => {
  for (const filename of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');
    assert.match(html, /html2canvas@1\.4\.1\/dist\/html2canvas\.min\.js/);
    assert.match(html, /print_page_flattener\.js\?v=\d+\.\d+/);
    assert.match(html, /print_math_optimizer\.js\?v=\d+\.\d+/);
    assert.match(html, /safePrint\(\{ mode: 'hybrid' \}\)/);
    assert.match(html, /safePrint\(\{ mode: 'raster' \}\)/);
    assert.match(html, /safePrint\(\{ mode: 'vector' \}\)/);
    assert.match(html, /APPrintPageFlattener\.prepare/);
    assert.match(html, /APPrintMathOptimizer\.prepare/);
    assert.match(html, /mathOptimization/);
    assert.match(html, /pageRasterization/);
    assert.match(html, /ap-print-raster-active/);
    assert.match(html, /scheduleFastPrintPrewarm\(\)/);
  }
});

test('page flattener produces one restorable JPEG image per printed page', () => {
  const source = fs.readFileSync(path.join(root, 'archive', 'print_page_flattener.js'), 'utf8');
  assert.match(source, /canvas\.toBlob\(resolve, 'image\/jpeg'/);
  assert.match(source, /img\.className = 'ap-print-raster-page'/);
  assert.match(source, /global\.URL\.revokeObjectURL\(url\)/);
  assert.match(source, /const rasterCache = new Map\(\)/);
  assert.match(source, /const pendingRasters = new Map\(\)/);
});
