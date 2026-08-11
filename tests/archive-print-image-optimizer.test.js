const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const optimizer = require(path.join(root, 'archive', 'print_image_optimizer.js'));

test('print image optimizer caps raster work at the rendered 300dpi size', () => {
  const result = optimizer.targetPixelSize(2226, 3153, 300, 425, 300);
  assert.equal(result.width, 938);
  assert.equal(result.height, 1328);
  assert(result.scale < 0.5);
});

test('print image optimizer never upscales a small source', () => {
  const result = optimizer.targetPixelSize(500, 300, 400, 240, 300);
  assert.deepEqual(result, { width: 500, height: 300, scale: 1 });
});

test('archive engines use the shared restorable print optimizer', () => {
  for (const filename of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');
    assert.match(html, /<script src="print_image_optimizer\.js\?v=\d+\.\d+"><\/script>/);
    assert.match(html, /APPrintImageOptimizer\?\.prepare/);
    assert.match(html, /await flattenPrintImagesForOpaquePrint\(\)/);
    assert.match(html, /printDryRun/);
    assert.match(html, /printopt/);
    assert.match(html, /optimizedImages\.restore\(\)/);
    assert.doesNotMatch(html, /canvas\.width = img\.naturalWidth/);
  }
});

test('print optimizer reuses one opaque JPEG raster for repeated source images', () => {
  const source = fs.readFileSync(path.join(root, 'archive', 'print_image_optimizer.js'), 'utf8');
  assert.match(source, /const rasterCache = new Map\(\)/);
  assert.match(source, /summary\.cacheHits \+= 1/);
  assert.match(source, /canvasToBlob\(canvas, 'image\/jpeg'/);
  assert.match(source, /global\.URL\.revokeObjectURL\(url\)/);
});

test('vector and already opaque JPEG assets are not rasterized again', () => {
  const makeImage = src => ({ src, currentSrc: '' });
  assert.equal(optimizer.isFlattenableRasterImage(makeImage('q01.png')), true);
  assert.equal(optimizer.isFlattenableRasterImage(makeImage('q02.webp?v=1')), true);
  assert.equal(optimizer.isFlattenableRasterImage(makeImage('diagram.svg')), false);
  assert.equal(optimizer.isFlattenableRasterImage(makeImage('photo.jpg')), false);
});
