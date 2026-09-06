const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');
const parent = fs.readFileSync(path.join(root, 'apmath', 'js', 'clinic-print.js'), 'utf8');

test('Clinic preview announces readiness and waits for parent source authority before any URL or storage load', () => {
  assert.match(engine, /type: 'AP_PRINT_READY', engine: 'clinic'/);
  assert.match(engine, /if \(previewMode\) \{[\s\S]{0,900}installPreviewMessageChannel\(\);[\s\S]{0,1200}설정을 선택하면 미리보기가 표시됩니다[\s\S]{0,300}return;/);
  const previewBranch = engine.slice(engine.indexOf('if (previewMode) {', engine.indexOf('async function boot')),
    engine.indexOf('try {', engine.indexOf('async function boot')));
  assert.doesNotMatch(previewBranch, /loadPayloadFromUrlOrStorage/);
});

test('Canonical preview and header messages preserve AP_CLINIC aliases during migration', () => {
  assert.match(engine, /msg\.type !== 'AP_PRINT_PREVIEW' && msg\.type !== 'AP_CLINIC_PREVIEW'/);
  assert.match(engine, /type: 'AP_PRINT_HEADER_EDIT'/);
  assert.match(parent, /type: 'AP_PRINT_PREVIEW'/);
  assert.match(parent, /msg\.type !== 'AP_PRINT_HEADER_EDIT' && msg\.type !== 'AP_CLINIC_HEADER_EDIT'/);
});
