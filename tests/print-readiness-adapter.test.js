const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('all three adapters load the shared readiness tracker without collapsing transport capability', () => {
  const archive = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
  const mixer = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
  const clinic = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');
  for (const [name, source] of [['archive', archive], ['mixer', mixer], ['clinic', clinic]]) {
    assert.match(source, /print-runtime\.js\?v=20260906\.1/, `${name} loads common runtime`);
    assert.match(source, /DATA_READY/);
    assert.match(source, /MATH_READY/);
    assert.match(source, /IMAGE_READY/);
    assert.match(source, /LAYOUT_READY/);
    assert.match(source, /RENDER_READY/);
    assert.match(source, /PRINT_READY/);
  }
  assert.match(archive, /safePrint\('vector'\)/);
  assert.match(mixer, /safePrint\('vector'\)/);
  assert.match(archive, /APNativePrint\.printGdi/);
  assert.match(mixer, /APNativePrint\.printGdi/);
  assert.match(clinic, /async function clinicSafePrint\(\)/);
  assert.match(clinic, /transport: 'browser'/);
});

test('readiness phase evidence distinguishes rendered readiness from an intentionally uninvoked print transport', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-6-readiness-authority.json'), 'utf8'));
  assert.deepEqual(evidence.states, ['DATA_READY', 'MATH_READY', 'IMAGE_READY', 'LAYOUT_READY', 'RENDER_READY', 'PRINT_READY']);
  assert.ok(evidence.browserRenderEvidence.every(item => item.state === 'RENDER_READY' && item.events === 5 && item.renderError === ''));
  assert.match(evidence.printReady, /only immediately before/);
});
