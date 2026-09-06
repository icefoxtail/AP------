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
    assert.match(source, /print-runtime\.js\?v=20260906\.2/, `${name} loads common runtime`);
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

test('adapters record success-only RENDER_READY and reject incomplete render/image transactions before PRINT_READY', () => {
  const archive = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
  const mixer = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
  const clinic = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');

  for (const [name, source, fail] of [
    ['archive', archive, 'failArchiveReadiness'],
    ['mixer', mixer, 'failMixedReadiness'],
    ['clinic', clinic, 'failClinicReadiness']
  ]) {
    assert.match(source, new RegExp(`${fail}\\(outcome\\.code, outcome\\)`), `${name} records failure evidence`);
    assert.match(source, /error\?\.code === 'IMAGE_READINESS_INCOMPLETE' \? 'IMAGE_READINESS_INCOMPLETE' : 'RENDER_FAILED'/, `${name} preserves image failure code`);
    assert.match(source, /assertSuccessfulRender\(renderOutcome\)/, `${name} blocks PRINT_READY for failed render outcome`);
  }
  assert.doesNotMatch(archive, /finally \{[\s\S]{0,240}markArchiveReadiness\('RENDER_READY'/);
  assert.doesNotMatch(mixer, /finally \{[\s\S]{0,240}markMixedReadiness\('RENDER_READY'/);
  assert.match(archive, /IMAGE_READINESS_INCOMPLETE/);
  assert.match(mixer, /IMAGE_READINESS_INCOMPLETE/);
  assert.match(clinic, /waitForClinicPrintImages\(area\)[\s\S]{0,120}markClinicReadiness\('IMAGE_READY', imageReadiness\)/);
});

test('readiness phase evidence distinguishes rendered readiness from an intentionally uninvoked print transport', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-6-readiness-authority.json'), 'utf8'));
  assert.deepEqual(evidence.states, ['DATA_READY', 'MATH_READY', 'IMAGE_READY', 'LAYOUT_READY', 'RENDER_READY', 'PRINT_READY']);
  assert.ok(evidence.browserRenderEvidence.every(item => item.state === 'RENDER_READY' && item.events === 5 && item.renderError === ''));
  assert.equal(evidence.runtimeVersion, '20260906.2');
  assert.match(evidence.hardening.renderReady, /only after renderBody succeeds/);
  assert.match(evidence.hardening.imageReady, /reject load error/);
  assert.deepEqual(evidence.hardening.negativeTests, [
    'intentional render failure blocks RENDER_READY and PRINT_READY',
    'intentional image error blocks IMAGE_READY',
    'intentional image timeout blocks IMAGE_READY'
  ]);
  assert.match(evidence.printReady, /only immediately before/);
});
