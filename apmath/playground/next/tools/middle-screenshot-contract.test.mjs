import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import { createScreenshotGuard, screenshotEnvironmentMatches, SCREENSHOT_ENVIRONMENT_POLICY, VIEWPORT_PIXEL_POLICY } from './browser-screenshot-guard.mjs';

const tools = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(tools, '../../../..');
const scripts = [
  { file: 'g7-geometry-browser-audit.mjs', kind: 'audit' },
  { file: 'g8-g9-geometry-browser-audit.mjs', kind: 'audit' },
  { file: 'g7-student-live-smoke.mjs', kind: 'smoke' },
  { file: 'g8-g9-student-live-smoke.mjs', kind: 'smoke' }
];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

// Exercise each real caller's capture boundary with recorded PNG headers and
// the shared environment validator. This is a Node contract test, never a
// browser, native-input or independent image-quality claim.
function fixture(script, { touch = true, fault = null } = {}) {
  const source = fs.readFileSync(path.join(tools, script.file), 'utf8');
  const start = source.indexOf(script.kind === 'audit' ? '      const capture = async filename =>' : '    const capture = async (filename, state) =>');
  const end = source.indexOf(script.kind === 'audit' ? '\n      const measure =' : '\n    try {', start);
  assert.ok(start >= 0 && end > start, `${script.file}: actual capture function is present`);
  const record = { captures: [], viewportCaptures: [], captureMetadata: {}, errors: [] };
  const report = { failures: [] }, bytesByPath = new Map();
  const env = { maxTouchPoints: touch ? 1 : 0, coarsePointer: touch, onTouchStart: touch, hoverNone: touch };
  function frame(fullPage) {
    return { sceneId: 'c2-6', tab: 'problem', step: 0, fullPage, viewport: { width: 390, height: 844 }, scroll: { x: 0, y: 0 },
      touchEnvironment: { phase: 'capture', pass: true, expectedTouch: touch, initial: env, before: env, after: env, restored: env,
        fullPage, pixelEnvironment: fullPage ? touch ? 'UNVERIFIED_BEYOND_VIEWPORT' : 'DESKTOP_FULL_PAGE' : VIEWPORT_PIXEL_POLICY,
        restoreCommand: touch ? { method: 'Emulation.setTouchEmulationEnabled', params: { enabled: true, maxTouchPoints: 1 } } : null } };
  }
  function image(file, width, height) {
    const bytes = Buffer.alloc(33);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
    bytes.write('IHDR', 12, 'ascii'); bytes.writeUInt32BE(width, 16); bytes.writeUInt32BE(height, 20);
    bytesByPath.set(path.join('/evidence', file), bytes);
  }
  const sandbox = { Buffer, path, sha256: hash, screenshotEnvironmentMatches, VIEWPORT_PIXEL_POLICY,
    fs: { readFileSync: file => { assert.ok(bytesByPath.has(file), `unexpected file read: ${file}`); return bytesByPath.get(file); } },
    out: '/evidence', record, dest: record, report, unit: 'g9-circle', run: { name: touch ? 'mobile-paper' : 'pc-paper' },
    screenshotGuard: { expectedTouch: touch }, settle: async () => {},
    page: { evaluate: async () => script.kind === 'audit' ? { id: 'c2-6', state: 'problem:0' } : 'c2-6' },
    captureReviewState: async options => {
      assert.equal(options.fullPage, true);
      assert.equal(options.collectContent, false, 'Do not expand the middle-school state matrix into exhaustive text-scroll checks');
      const raw = { file: options.name, frame: frame(true) }; image(raw.file, 390, 1500); options.onCapture(raw);
      if (fault === 'capture-failed') throw Error('original screenshot failure');
      if (!touch || fault === 'missing-viewport') return { ...raw, supplementalFrames: [] };
      const primary = { file: options.name.replace(/\.png$/, '--viewport.png'), frame: frame(false) };
      if (fault === 'environment-failed') primary.frame.touchEnvironment.restored = { ...env, maxTouchPoints: 0, coarsePointer: false };
      image(primary.file, fault === 'wrong-size' ? 391 : 390, 844); options.onCapture(primary);
      return { ...primary, rawReference: raw, supplementalFrames: [] };
    }
  };
  const capture = vm.runInNewContext(source.slice(start, end) + '\n capture;', sandbox);
  return { record, report, async capture() {
    const result = await capture('g9-circle--c2-6--mobile-paper--problem-hidden.png', 'problem');
    if (script.kind === 'smoke') record.captures.push(result);
    return result;
  } };
}

for (const script of scripts) {
  test(`${script.file}: guard pins the ready target document before the first screenshot`, async () => {
    const source = fs.readFileSync(path.join(tools, script.file), 'utf8');
    const start = source.indexOf(script.kind === 'audit' ? '      await page.addInitScript(' : "      page.on('pageerror'");
    const guardStart = source.indexOf('      screenshotGuard = await createScreenshotGuard(');
    const endMarker = '\n      } });';
    const end = source.indexOf(endMarker, guardStart) + endMarker.length;
    assert.ok(start >= 0 && guardStart > start && end > guardStart, 'Guard cannot be pinned on about:blank before the target navigation block');
    let loaded = false, ready = false, currentURL = 'about:blank';
    const calls = [], session = { send: async () => {}, detach: async () => {} };
    const page = {
      addInitScript: async () => {}, on: () => {},
      goto: async url => { currentURL = String(url); loaded = true; calls.push('navigation'); return { status: () => 200, ok: () => true }; },
      url: () => currentURL,
      waitForFunction: async () => { assert.ok(loaded); },
      evaluate: async fn => {
        if (fn.toString().includes('maxTouchPoints')) return { maxTouchPoints: 1, coarsePointer: true, onTouchStart: loaded, hoverNone: true };
        assert.ok(loaded); ready = true; calls.push('ready');
      },
      context: () => ({ newCDPSession: async () => session })
    };
    const record = { screenshotEnvironment: [], errors: [] };
    const sandbox = { page, URL, base: new URL('https://example.invalid/labs/'), url: 'https://example.invalid/labs/g9-circle.html',
      unit: 'g9-circle', run: { name: script.kind === 'audit' ? 'mobile-paper' : 'mobile' }, viewport: { name: 'mobile' },
      record, dest: record, report: { failures: [] }, errors: [], listening: true,
      settle: async () => { assert.ok(loaded); ready = true; calls.push('ready'); },
      createScreenshotGuard: async (...args) => { assert.ok(loaded && ready, 'Snapshot must follow navigation and readiness'); calls.push('guard'); return createScreenshotGuard(...args); }
    };
    const guard = await vm.runInNewContext(`(async () => { let screenshotGuard; ${source.slice(start, end)} return screenshotGuard; })()`, sandbox);
    assert.equal(guard.initial.onTouchStart, true, 'Use the loaded-document event property seen in the failing Actions evidence');
    const shot = await guard.capture(async () => { calls.push('capture'); }, { fullPage: false });
    assert.equal(shot.observation.pass, true);
    assert.ok(calls.indexOf('navigation') < calls.indexOf('ready') && calls.indexOf('ready') < calls.indexOf('guard') && calls.indexOf('guard') < calls.indexOf('capture'));
    await guard.close();
  });
  test(`${script.file}: viewport support preserves one legacy capture and actual byte/environment readback`, async () => {
    const f = fixture(script); await f.capture();
    assert.equal(f.record.captures.length, 1);
    assert.equal(f.record.viewportCaptures.length, 1);
    const viewport = f.record.viewportCaptures[0];
    assert.equal(viewport.frame.fullPage, false);
    assert.equal(viewport.frame.png.width, 390); assert.equal(viewport.frame.png.height, 844);
    assert.match(viewport.frame.png.sha256, /^[a-f0-9]{64}$/);
    assert.equal(viewport.frame.touchEnvironment.pixelEnvironment, VIEWPORT_PIXEL_POLICY);
    assert.equal(f.record.captureMetadata[viewport.rawReference].touchEnvironment.pixelEnvironment, 'UNVERIFIED_BEYOND_VIEWPORT');
  });
  for (const fault of ['missing-viewport', 'wrong-size', 'environment-failed', 'capture-failed']) {
    test(`${script.file}: ${fault} remains a rejected capture and an explicit failure`, async () => {
      const f = fixture(script, { fault });
      await assert.rejects(f.capture());
      assert.equal(f.record.captures.length, 0);
      assert.equal(f.record.viewportCaptures.length, 0);
      assert.ok(f.report.failures.some(e => e.reason === 'screenshot-evidence-failed') || f.record.errors.some(e => e.kind === 'screenshot-evidence-failed'));
    });
  }
  test(`${script.file}: mouse-only desktop keeps its existing single full-page capture`, async () => {
    const f = fixture(script, { touch: false }); await f.capture();
    assert.equal(f.record.captures.length, 1);
    assert.equal(f.record.viewportCaptures.length, 0);
    assert.equal(Object.values(f.record.captureMetadata)[0].touchEnvironment.expectedTouch, false);
  });
}

function selection(workflow, changed) {
  const source = fs.readFileSync(path.join(repo, '.github/workflows', workflow), 'utf8');
  const start = source.indexOf('          const all = ');
  const end = source.indexOf('\n', source.indexOf('fs.appendFileSync(process.env.GITHUB_OUTPUT', start));
  assert.ok(start >= 0 && end > start);
  return vm.runInNewContext(source.slice(start, end) + '\n ({all, affected});', {
    execFileSync: () => changed.join('\n'), fs: { appendFileSync: () => {} },
    process: { env: { BASE_SHA: 'baseline', SHARD: '0', UNIT: 'g9-circle', GITHUB_OUTPUT: '/unused' } }
  });
}

for (const [workflow, unit, count] of [['g7-geometry-browser.yml', 'g7-area', 10], ['g8-g9-geometry-browser.yml', 'g9-circle', 6]]) {
  test(`${workflow}: a shared screenshot dependency plus a unit edit selects every unit`, () => {
    const lab = `apmath/playground/next/labs/${unit}.html`;
    assert.deepEqual(Array.from(selection(workflow, [lab]).affected), [unit]);
    for (const helper of ['browser-screenshot-guard.mjs', 'browser-screenshot-guard.test.mjs', 'high-viewport-evidence.mjs', 'middle-screenshot-contract.test.mjs']) {
      const result = selection(workflow, [lab, 'apmath/playground/next/tools/' + helper]);
      assert.equal(result.affected.length, count, helper);
      assert.deepEqual(Array.from(result.affected), Array.from(result.all));
    }
  });
}

test('all three middle browser workflows trigger on shared capture dependencies', () => {
  const escape = value => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  for (const name of ['g7-geometry-browser.yml', 'g8-g9-geometry-browser.yml', 'g7-geometry-visual-preflight.yml']) {
    const source = fs.readFileSync(path.join(repo, '.github/workflows', name), 'utf8');
    const paths = [...source.slice(source.indexOf('    paths:'), source.indexOf('  workflow_dispatch:')).matchAll(/^\s+- '([^']+)'$/gm)].map(m => m[1]);
    for (const file of ['browser-screenshot-guard.mjs', 'browser-screenshot-guard.test.mjs', 'high-viewport-evidence.mjs', 'middle-screenshot-contract.test.mjs']) {
      assert.ok(paths.some(pattern => new RegExp('^' + pattern.split('*').map(escape).join('.*') + '$').test('apmath/playground/next/tools/' + file)), `${name}: ${file}`);
    }
  }
});

test('public/local smoke plans preserve their original denominators and declare screenshot scope without a browser', () => {
  const g7 = JSON.parse(execFileSync(process.execPath, [path.join(tools, 'g7-student-live-smoke.mjs'), '--plan'], { encoding: 'utf8' }));
  const g89 = JSON.parse(execFileSync(process.execPath, [path.join(tools, 'g8-g9-student-live-smoke.mjs'), '--plan'], { encoding: 'utf8' }));
  assert.deepEqual(g7.expected, { units: 10, pageLoads: 20, initialAndProblemCaptures: 40 });
  assert.deepEqual(g89.expected, { units: 6, inventoryScenes: 247, pageLoads: 48, checkedStates: 336, captures: 336 });
  for (const report of [g7, g89]) {
    assert.equal(report.screenshotEnvironmentPolicy, SCREENSHOT_ENVIRONMENT_POLICY);
    assert.match(report.viewportEvidencePolicy.raw, /UNVERIFIED_BEYOND_VIEWPORT/);
    assert.equal(report.status, 'NOT_RUN');
  }
});
