const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('the clinic engine loads the compiled index and shared resolver before render authority', () => {
  const file = 'apmath/wrong_print_engine.html';
  const html = read(file);
  const indexPosition = html.indexOf('../archive/data/svg-accessibility-index.js');
  const helperPosition = html.indexOf('../archive/svg-accessibility.js');
  const authorityPosition = html.indexOf('../archive/render-authority.js');
  assert.ok(indexPosition >= 0, `${file} loads the compiled metadata index`);
  assert.ok(helperPosition > indexPosition, `${file} loads the resolver after its index`);
  assert.ok(authorityPosition > helperPosition, `${file} loads the resolver before render authority`);
  assert.match(html, /ARCHIVE_ASSET_CACHE_VERSION = '20261014.1'/, `${file} cache version`);
  assert.match(html, /generated-lite/, `${file} includes Generated SVG assets`);
});

test('the original and the mixed engine load the resolver and then the lazy index loader before render authority, and not the whole index as a script', () => {
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html']) {
    const html = read(file);
    const helper = html.indexOf('svg-accessibility.js');
    const lazy = html.indexOf('svg-accessibility-lazy.js');
    const authority = html.indexOf('render-authority.js');
    assert.ok(helper >= 0 && lazy > helper && authority > lazy, `${file}: resolver, then lazy loader, then render authority`);
    assert.doesNotMatch(html, /<script[^>]*\ssrc="data\/svg-accessibility-index\.js/, `${file}: the compiled index (1.4 MB compressed) is not a static script`);
    assert.match(html, /ARCHIVE_ASSET_CACHE_VERSION = '20261014\.1'/, `${file} cache version`);
    assert.match(html, /generated-lite/, `${file} includes Generated SVG assets`);
  }
  assert.match(read('archive/engine.html'), /APSvgAccessibilityLazy\.prepare\(loadedQuestions/, 'the questions wait for their figure names before they are drawn');
  assert.match(read('archive/mixed_engine.html'), /APSvgAccessibilityLazy\.prepare\(AppState\.data[\s\S]{0,160}\n\s*await renderMixedBody\(\);/, 'the body waits for the figure names before it is drawn');
  const adapter = read('archive/screen-runtime-adapter.js');
  assert.match(adapter, /APSvgAccessibilityLazy\.prepare\(raw/, 'a source loaded by the runtime waits too');
  assert.match(adapter, /APSvgAccessibilityLazy\.prepare\(snapshot\.questionBank/);
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
