'use strict';

// Executes the browser-side observation helper with controlled DOM readings.
// Product output remains gated by the separate actual-Chrome benchmark.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
// The focused Node step runs before Playwright installation. Execute the exact
// standalone function injected by the harness without loading its browser CLI.
const harness = fs.readFileSync(path.join(__dirname, 'archive2-output-performance-browser.cjs'), 'utf8');
const injectedHelper = harness.match(/function installRetainedVisibilityObservation\(\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(injectedHelper, 'the executable browser observation helper is required');

function fixture() {
  const frames = new Map(), observers = [];
  let frameId = 0, clock = 20;
  const element = parentElement => ({ parentElement, isConnected: true,
    style: { display: 'block', visibility: 'visible', opacity: '1', contentVisibility: 'visible' } });
  const html = element(null), body = element(html), area = element(body), cell = element(area);
  cell.rect = { x: 20, y: 80, left: 20, top: 80, width: 120, height: 30, right: 140, bottom: 110 };
  cell.getBoundingClientRect = () => ({ ...cell.rect });
  area.cell = cell; area.querySelector = () => area.cell;
  const document = { area, getElementById: () => document.area };
  const snapshot = { rootNode: area, status: 'ACTIVE' };
  const runtime = { activeSnapshot: snapshot };
  const state = { mode: 'ans' };
  class MutationObserver {
    constructor(callback) { this.callback = callback; this.active = false; this.records = []; observers.push(this); }
    observe() { this.active = true; }
    disconnect() { this.active = false; }
    takeRecords() { return this.records.splice(0); }
  }
  const window = { AppState: state, mixedScreenRuntime: runtime,
    __solutionLoadingQA: { operationStart: 10 } };
  const context = vm.createContext({ window, document, AppState: state, MutationObserver,
    getComputedStyle: node => node.style, innerWidth: 1440, innerHeight: 1000,
    performance: { now: () => clock++ },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id) });
  vm.runInContext(`(${injectedHelper})()`, context);
  return { area, cell, body, html, state, document, runtime, snapshot, frames, observers,
    start: () => window.__observeRetainedOutputVisibility('ans'),
    mutate: () => { for (const observer of observers) if (observer.active) observer.callback([]); },
    frame: () => { const pending = [...frames]; frames.clear(); for (const [, callback] of pending) callback(clock++); } };
}

test('an active snapshot remains visibly retained across a real same-mode transaction', () => {
  const f = fixture(), monitor = f.start();
  f.frame();
  f.snapshot.status = 'READY'; f.mutate();
  f.snapshot.status = 'ACTIVE'; f.mutate(); f.frame();
  const evidence = monitor.finish();
  assert.equal(evidence.kind, 'retained-output');
  assert.equal(evidence.retained, true);
  assert.equal(evidence.preservedIdentity, true);
  assert.equal(evidence.allObservedVisible, true);
  assert.equal(evidence.geometryPreserved, true);
  assert.equal(evidence.frameObservations, 2);
  assert.equal(evidence.mutationObservations, 2);
  assert.equal(evidence.observations, 6);
  assert.equal(evidence.firstFailure, null);
  assert.equal(f.frames.size, 0);
  assert.equal(f.observers.every(observer => !observer.active), true);
});

test('a request without a new frame still requires concrete visible before/after evidence', () => {
  const f = fixture(), evidence = f.start().finish();
  assert.equal(evidence.retained, true);
  assert.equal(evidence.observations, 2);
  assert.equal(evidence.frameObservations, 0);
  assert.equal(evidence.mutationObservations, 0);
  assert.equal(evidence.before.width, 120);
  assert.equal(evidence.after.height, 30);
  assert.equal(f.frames.size, 0);
});

for (const [name, style] of Object.entries({ display: { display: 'none' }, visibility: { visibility: 'hidden' },
  collapse: { visibility: 'collapse' }, opacity: { opacity: '0' }, contentVisibility: { contentVisibility: 'hidden' } })) {
  test(`transient ancestor ${name} cannot become retained visibility after recovery`, () => {
    const f = fixture(), monitor = f.start(), before = { ...f.body.style };
    Object.assign(f.body.style, style); f.frame();
    f.body.style = before; f.mutate();
    const evidence = monitor.finish();
    assert.equal(evidence.before.visible, true);
    assert.equal(evidence.after.visible, true);
    assert.equal(evidence.retained, false);
    assert.equal(evidence.allObservedVisible, false);
    assert.equal(evidence.firstFailure.phase, 'frame');
  });
}

test('a transient replacement root is rejected even when original root returns before completion', () => {
  const f = fixture(), monitor = f.start();
  f.document.area = { ...f.area }; f.frame();
  f.document.area = f.area; f.mutate();
  const evidence = monitor.finish();
  assert.equal(evidence.after.rootPreserved, true);
  assert.equal(evidence.retained, false);
  assert.equal(evidence.preservedIdentity, false);
  assert.equal(evidence.firstFailure.rootPreserved, false);
});

test('a transient snapshot replacement invalidates proof even with the same visible root', () => {
  const f = fixture(), monitor = f.start();
  f.runtime.activeSnapshot = { rootNode: f.area }; f.mutate();
  f.runtime.activeSnapshot = f.snapshot;
  const evidence = monitor.finish();
  assert.equal(evidence.retained, false);
  assert.equal(evidence.firstFailure.snapshotPreserved, false);
});

test('replacing the first cell with identical geometry does not prove retained pixels', () => {
  const f = fixture(), monitor = f.start();
  f.area.cell = { ...f.cell }; f.mutate();
  const evidence = monitor.finish();
  assert.equal(evidence.geometryPreserved, true);
  assert.equal(evidence.retained, false);
  assert.equal(evidence.firstFailure.cellPreserved, false);
});

test('disconnected or offscreen output is not visible evidence', () => {
  const disconnected = fixture(), a = disconnected.start();
  disconnected.area.isConnected = false; disconnected.frame();
  disconnected.area.isConnected = true;
  assert.equal(a.finish().retained, false);
  const offscreen = fixture(), b = offscreen.start(), previous = { ...offscreen.cell.rect };
  Object.assign(offscreen.cell.rect, { x: 1500, left: 1500, right: 1620 }); offscreen.frame();
  offscreen.cell.rect = previous;
  const evidence = b.finish();
  assert.equal(evidence.retained, false);
  assert.equal(evidence.firstFailure.inViewport, false);
});

test('a geometry change cannot be reported as unchanged retained output', () => {
  const f = fixture(), monitor = f.start();
  f.cell.rect.width += 2; f.cell.rect.right += 2;
  const evidence = monitor.finish();
  assert.equal(evidence.allObservedVisible, true);
  assert.equal(evidence.preservedIdentity, true);
  assert.equal(evidence.geometryPreserved, false);
  assert.equal(evidence.retained, false);
});

test('queued mutations are sampled before disconnection and initial hidden output stays invalid', () => {
  const f = fixture(), monitor = f.start();
  f.body.style.opacity = '0'; f.observers[0].records.push({ type: 'attributes' });
  const evidence = monitor.finish();
  assert.equal(evidence.mutationObservations, 1);
  assert.equal(evidence.retained, false);
  const initiallyHidden = fixture(); initiallyHidden.body.style.display = 'none';
  const second = initiallyHidden.start(); initiallyHidden.body.style.display = 'block';
  assert.equal(second.finish().retained, false);
});

test('different modes and unowned roots do not start same-view observation', () => {
  const f = fixture(); f.state.mode = 'sol';
  assert.equal(f.start(), null);
  f.state.mode = 'ans'; f.runtime.activeSnapshot = { rootNode: {} };
  assert.equal(f.start(), null);
  assert.equal(f.observers.length, 0);
  assert.equal(f.frames.size, 0);
});
