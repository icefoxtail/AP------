const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('original, mixed, and clinic engines load the compiled index and shared resolver before render authority', () => {
  const cases = [
    ['archive/engine.html', 'data/svg-accessibility-index.js', 'svg-accessibility.js', 'render-authority.js'],
    ['archive/mixed_engine.html', 'data/svg-accessibility-index.js', 'svg-accessibility.js', 'render-authority.js'],
    ['apmath/wrong_print_engine.html', '../archive/data/svg-accessibility-index.js', '../archive/svg-accessibility.js', '../archive/render-authority.js']
  ];
  for (const [file, indexSrc, helperSrc, authoritySrc] of cases) {
    const html = read(file);
    const indexPosition = html.indexOf(indexSrc);
    const helperPosition = html.indexOf(helperSrc);
    const authorityPosition = html.indexOf(authoritySrc);
    assert.ok(indexPosition >= 0, `${file} loads the compiled metadata index`);
    assert.ok(helperPosition > indexPosition, `${file} loads the resolver after its index`);
    assert.ok(authorityPosition > helperPosition, `${file} loads the resolver before render authority`);
    assert.match(html, /ARCHIVE_ASSET_CACHE_VERSION = '20261014\.1'/, `${file} cache version`);
    assert.match(html, /generated-lite/, `${file} includes Generated SVG assets`);
  }
});

test('legacy render paths provide Korean image fallbacks and do not expose generic answer labels', () => {
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/wrong_print_engine.html']) {
    const source = read(file);
    assert.match(source, /selectAccessibleAlt\([^\n]*'문제 그림'\)/, `${file} problem fallback`);
    assert.match(source, /selectAccessibleAlt\([^\n]*'해설 그림'\)/, `${file} solution fallback`);
    assert.doesNotMatch(source, /문항 \$\{q\.id[^\n]*해설 그래프/);
  }
});

test('Archive 2 runtime guard rebuilds and hash-verifies the current SVG accessibility projection', () => {
  const guard = read('tools/check-archive2-runtime.cjs');
  assert.match(guard, /build-svg-accessibility-index\.cjs/);
});
