// Chromium can reset touch emulation after captureBeyondViewport. Keep the
// page's real CDP session alive and restore the configured environment, then
// read it back. Never replace navigator values or certify an input from setup.
// Upstream diagnosis/fix: microsoft/playwright#42607 and #42617.
export function readTouchEnvironment() {
  return {
    maxTouchPoints: navigator.maxTouchPoints,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    onTouchStart: 'ontouchstart' in window,
    hoverNone: matchMedia('(hover: none)').matches
  };
}

const sameEnvironment = (a, b) => ['maxTouchPoints', 'coarsePointer', 'onTouchStart', 'hoverNone'].every(k => a?.[k] === b?.[k]);
const errorText = e => String(e?.message || e);
export const SCREENSHOT_ENVIRONMENT_POLICY = 'RESTORE_CONFIGURED_TOUCH_AFTER_CAPTURE';
export const VIEWPORT_PIXEL_POLICY = 'FIXED_VIEWPORT_WITHOUT_CAPTURE_BEYOND_VIEWPORT';
const validSnapshot = e => Number.isInteger(e?.maxTouchPoints) && e.maxTouchPoints >= 0 && ['coarsePointer', 'onTouchStart', 'hoverNone'].every(k => typeof e[k] === 'boolean');
export function screenshotEnvironmentMatches(observation, expectedTouch) {
  const { initial, before, after, restored, restoreCommand } = observation || {};
  if (!observation?.pass || observation.expectedTouch !== expectedTouch || !validSnapshot(initial)) return false;
  if (expectedTouch ? initial.maxTouchPoints < 1 || !initial.coarsePointer : initial.maxTouchPoints !== 0 || initial.coarsePointer) return false;
  if (observation.phase === 'initial') return true;
  if (observation.phase !== 'capture' || ![before, after, restored].every(validSnapshot) || !sameEnvironment(initial, before) || !sameEnvironment(initial, restored)) return false;
  if (observation.fullPage === false && !sameEnvironment(initial, after)) return false;
  return expectedTouch ? restoreCommand?.method === 'Emulation.setTouchEmulationEnabled' && restoreCommand.params?.enabled === true && restoreCommand.params?.maxTouchPoints === initial.maxTouchPoints : restoreCommand === null;
}

export async function createScreenshotGuard(page, { expectedTouch, onObservation = () => {} }) {
  if (typeof expectedTouch !== 'boolean') throw Error('Screenshot guard requires the configured hasTouch boolean');
  let initial;
  try { initial = await page.evaluate(readTouchEnvironment); }
  catch (error) {
    onObservation({ phase: 'initial', expectedTouch, initial: null, pass: false, reason: 'initial-touch-environment-unreadable', error: errorText(error) });
    throw error;
  }
  const initialPass = validSnapshot(initial) && (expectedTouch ? initial.maxTouchPoints > 0 && initial.coarsePointer : initial.maxTouchPoints === 0 && !initial.coarsePointer);
  let session = null;
  if (initialPass && expectedTouch) {
    try { session = await page.context().newCDPSession(page); }
    catch (error) {
      onObservation({ phase: 'initial', expectedTouch, initial, pass: false, reason: 'screenshot-touch-cdp-unavailable', error: errorText(error) });
      throw error;
    }
  }
  onObservation({ phase: 'initial', expectedTouch, initial, pass: !!initialPass, reason: initialPass ? 'configured-environment-observed' : 'initial-touch-environment-mismatch' });
  if (!initialPass) throw Error('Initial browser touch environment differs from hasTouch configuration');
  let closed = false;
  return {
    initial,
    expectedTouch,
    async capture(takeScreenshot, metadata = {}) {
      if (closed) throw Error('Screenshot guard is closed');
      const observation = { ...metadata, phase: 'capture', expectedTouch, initial, before: null, after: null, restored: null, restoreCommand: null, pass: false,
        pixelEnvironment: metadata.fullPage === false ? VIEWPORT_PIXEL_POLICY : expectedTouch ? 'UNVERIFIED_BEYOND_VIEWPORT' : 'DESKTOP_FULL_PAGE' };
      try { observation.before = await page.evaluate(readTouchEnvironment); }
      catch (error) { observation.reason = 'pre-capture-touch-environment-unreadable'; observation.error = errorText(error); onObservation(observation); throw error; }
      if (!sameEnvironment(observation.before, initial)) {
        observation.reason = 'pre-capture-touch-environment-mismatch'; onObservation(observation);
        throw Error('Touch environment drifted before screenshot');
      }
      let value, captureError, restoreError;
      try { value = await takeScreenshot(); }
      catch (error) { captureError = error; observation.captureError = errorText(error); }
      // Restore even when screenshot capture itself rejects. Its original
      // failure is preserved; successful environment repair cannot hide it.
      try {
        observation.after = await page.evaluate(readTouchEnvironment);
        if (expectedTouch) {
          observation.restoreCommand = { method: 'Emulation.setTouchEmulationEnabled', params: { enabled: true, maxTouchPoints: initial.maxTouchPoints } };
          await session.send(observation.restoreCommand.method, observation.restoreCommand.params);
        }
        observation.restored = await page.evaluate(readTouchEnvironment);
        if (!sameEnvironment(observation.restored, initial)) throw Error('Screenshot touch environment was not restored');
      } catch (error) { restoreError = error; observation.restoreError = errorText(error); }
      const viewportDrift = metadata.fullPage === false && !sameEnvironment(observation.after, initial);
      observation.pass = !captureError && !restoreError && !viewportDrift;
      observation.reason = captureError ? 'screenshot-failed' : restoreError ? 'screenshot-touch-restoration-failed' : viewportDrift ? 'viewport-screenshot-environment-drift' : 'screenshot-environment-preserved';
      onObservation(observation);
      if (captureError) throw captureError;
      if (restoreError) throw restoreError;
      if (viewportDrift) throw Error('Touch environment drifted during a fixed-viewport screenshot');
      return { value, observation };
    },
    async close() {
      if (closed) return;
      closed = true;
      // Only at page teardown: a short-lived emulation session can undo the
      // restore when detached, so no detach occurs between screenshots/probes.
      if (session) await session.detach();
    }
  };
}
