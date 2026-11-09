import test from 'node:test';
import assert from 'node:assert/strict';
import { createScreenshotGuard, screenshotEnvironmentMatches, VIEWPORT_PIXEL_POLICY } from './browser-screenshot-guard.mjs';

const touch = { maxTouchPoints: 1, coarsePointer: true, onTouchStart: true, hoverNone: true };
const desktop = { maxTouchPoints: 0, coarsePointer: false, onTouchStart: false, hoverNone: false };
function fixture(initial = touch, { restoreError, inert = false, sessionError } = {}) {
  let state = structuredClone(initial), sessions = 0, detached = 0;
  const observations = [], commands = [];
  const page = {
    evaluate: async () => structuredClone(state),
    context: () => ({ newCDPSession: async () => {
      sessions++; if (sessionError) throw sessionError;
      return { send: async (method, params) => { commands.push({ method, params }); if (restoreError) throw restoreError; if (!inert) state = structuredClone(initial); }, detach: async () => { detached++; } };
    } })
  };
  return { page, observations, commands, drift: () => { state = structuredClone(desktop); }, alter: s => { state = structuredClone(s); },
    options: { expectedTouch: initial.maxTouchPoints > 0, onObservation: o => observations.push(o) },
    counts: () => ({ sessions, detached }) };
}

test('captureBeyondViewport resets are restored by one persistent real CDP session', async () => {
  const f = fixture(), guard = await createScreenshotGuard(f.page, f.options);
  for (let n = 0; n < 2; n++) {
    const result = await guard.capture(async () => { f.drift(); return `png-${n}`; }, { file: `${n}.png`, fullPage: true });
    assert.equal(result.value, `png-${n}`);
    assert.deepEqual(result.observation.after, desktop);
    assert.deepEqual(result.observation.restored, touch);
    assert.equal(screenshotEnvironmentMatches(result.observation, true), true);
    assert.equal(result.observation.pixelEnvironment, 'UNVERIFIED_BEYOND_VIEWPORT');
  }
  assert.deepEqual(f.counts(), { sessions: 1, detached: 0 });
  assert.equal(f.commands.length, 2);
  await guard.close(); await guard.close(); assert.equal(f.counts().detached, 1);
  await assert.rejects(guard.capture(async () => 'x'), /closed/);
});

test('fixed viewport captures remain distinguishable from raw full-page references', async () => {
  const f = fixture(), guard = await createScreenshotGuard(f.page, f.options);
  const { observation } = await guard.capture(async () => 'png', { fullPage: false });
  assert.equal(observation.pixelEnvironment, VIEWPORT_PIXEL_POLICY);
  assert.equal(observation.pass, true); await guard.close();
});

test('initial capability mismatch is a failure and is never repaired into a pass', async () => {
  const f = fixture(desktop);
  await assert.rejects(createScreenshotGuard(f.page, { ...f.options, expectedTouch: true }), /Initial browser/);
  assert.equal(f.observations[0].reason, 'initial-touch-environment-mismatch');
  assert.equal(f.observations[0].pass, false); assert.equal(f.commands.length, 0);
});

test('unexpected touch drift during a viewport capture is restored but cannot certify its PNG', async () => {
  const f = fixture(), guard = await createScreenshotGuard(f.page, f.options);
  await assert.rejects(guard.capture(async () => { f.drift(); return 'png'; }, { fullPage: false }), /fixed-viewport/);
  assert.equal(f.observations.at(-1).reason, 'viewport-screenshot-environment-drift');
  assert.deepEqual(f.observations.at(-1).restored, touch);
  assert.equal(screenshotEnvironmentMatches(f.observations.at(-1), true), false); await guard.close();
});

test('pre-capture drift is recorded before any image is taken', async () => {
  const f = fixture(), guard = await createScreenshotGuard(f.page, f.options); let captured = false; f.drift();
  await assert.rejects(guard.capture(async () => { captured = true; }), /drifted/);
  assert.equal(captured, false); assert.equal(f.observations.at(-1).pass, false); await guard.close();
});

test('an unavailable CDP session is a setup failure rather than a touch pass', async () => {
  const error = Error('CDP unavailable'), f = fixture(touch, { sessionError: error });
  await assert.rejects(createScreenshotGuard(f.page, f.options), e => e === error);
  assert.equal(f.observations.at(-1).reason, 'screenshot-touch-cdp-unavailable');
});

for (const mode of ['reject', 'inert']) test(`a ${mode} restoration keeps the strict failure`, async () => {
  const f = fixture(touch, mode === 'reject' ? { restoreError: Error('CDP rejected') } : { inert: true });
  const guard = await createScreenshotGuard(f.page, f.options);
  await assert.rejects(guard.capture(async () => { f.drift(); return 'png'; }, { fullPage: true }));
  assert.equal(f.observations.at(-1).reason, 'screenshot-touch-restoration-failed');
  assert.equal(screenshotEnvironmentMatches(f.observations.at(-1), true), false); await guard.close();
});

for (const restoreFails of [false, true]) test(`the original screenshot error survives restoration (restoreFails=${restoreFails})`, async () => {
  const f = fixture(touch, restoreFails ? { restoreError: Error('restore failed') } : {}), guard = await createScreenshotGuard(f.page, f.options);
  const original = Error('capture failed');
  await assert.rejects(guard.capture(async () => { f.drift(); throw original; }, { fullPage: true }), e => e === original);
  assert.equal(f.commands.length, 1); assert.equal(f.observations.at(-1).reason, 'screenshot-failed'); await guard.close();
});

test('desktop never enables touch and rejects unexpected environment changes', async () => {
  const f = fixture(desktop), guard = await createScreenshotGuard(f.page, f.options);
  const good = await guard.capture(async () => 'png', { fullPage: true });
  assert.equal(screenshotEnvironmentMatches(good.observation, false), true); assert.equal(f.commands.length, 0);
  await assert.rejects(guard.capture(async () => { f.alter(touch); }, { fullPage: false }), /not restored/);
  assert.equal(f.counts().sessions, 0); await guard.close();
});

test('claimed pass cannot replace correct raw snapshots and restore-command evidence', async () => {
  const f = fixture(), guard = await createScreenshotGuard(f.page, f.options);
  const { observation } = await guard.capture(async () => 'png', { fullPage: false });
  for (const mutate of [o => { o.restored.coarsePointer = false; }, o => { o.before.maxTouchPoints = 0; }, o => { o.restoreCommand = null; }, o => { o.expectedTouch = false; }, o => { o.after.maxTouchPoints = NaN; }]) {
    const changed = structuredClone(observation); mutate(changed); assert.equal(screenshotEnvironmentMatches(changed, true), false);
  }
  await guard.close();
});
