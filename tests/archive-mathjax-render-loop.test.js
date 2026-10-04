const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const renderLoop = require(path.join(root, 'archive', 'mathjax_render_loop.js'));

test('batch renderer is the default and legacy remains an explicit fallback', () => {
  assert.equal(renderLoop.rendererMode(), 'batch');
  const previousLocation = global.location;
  global.location = { search: '?renderer=legacy' };
  assert.equal(renderLoop.rendererMode(), 'legacy');
  if (previousLocation === undefined) delete global.location;
  else global.location = previousLocation;
  assert.equal(renderLoop.unrenderedMathCount({ textContent: '값은 $x+1$이다.' }), 1);
  assert.equal(renderLoop.unrenderedMathCount({ textContent: '변환 완료' }), 0);
});

test('both archive engines install render metrics and the shared loop runtime', () => {
  for (const filename of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');
    assert.match(html, /<script src="mathjax_render_loop\.js\?v=\d+\.\d+"><\/script>/);
    assert.match(html, /APRenderLoop\?\.start/);
    assert.match(html, /APRenderLoop\?\.finish/);
    assert.match(html, /async function typesetMath\(label, elements\)/);
    assert.match(html, /async function measureRenderPhase\(label, work\)/);
    assert.match(html, /rendererMode\(\) === 'legacy'/);
    assert.match(html, /history\.pushState\(null, '', url\.toString\(\)\)/);
    assert.match(html, /typesetMath\('solution-staging', \[staging\]\)/);
    assert.match(html, /typesetMath\('solution-split-staging', \[chunkStaging\]\)/);
    assert.match(html, /typesetMath\('print-recovery'/);
    assert.doesNotMatch(html, /MathJax\.typesetPromise\(\[targetCol\]\)/);
    assert.match(html, /MathJax\.typesetClear\(\[area, staging\]\)/);
  }
});

test('render metrics are exposed on the document for browser QA', () => {
  const source = fs.readFileSync(path.join(root, 'archive', 'mathjax_render_loop.js'), 'utf8');
  assert.match(source, /dataset\.apRenderReady = 'false'/);
  assert.match(source, /dataset\.apRenderMetrics = JSON\.stringify\(current\)/);
  assert.match(source, /dataset\.apRenderReady = 'true'/);
});

test('inline scripts in both engines remain syntactically valid', () => {
  for (const filename of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
    for (const script of scripts) assert.doesNotThrow(() => new Function(script), `${filename} inline script should parse`);
  }
});
