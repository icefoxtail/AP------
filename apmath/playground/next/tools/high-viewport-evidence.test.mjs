import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { captureReviewState, readReviewFrame, viewportContentCoverage } from './high-viewport-evidence.mjs';

const rect = (top, bottom, left = 10, right = 380) => ({ top, bottom, left, right, x: left, y: top, width: right - left, height: bottom - top });
function frame(y = 0, { top = 600, bottom = 1200, max = 600 } = {}) {
  const r = rect(top - y, bottom - y), a = Math.max(r.top, 300), b = Math.min(r.bottom, 844);
  return { sceneId: 'one', tab: 'review', step: 3, steps: 3, questionSha256: 'a'.repeat(64), questionPresent: true, answerOpen: true, answerPresent: true, revealed: true, parameters: { k: 1 }, fonts: 'loaded', fullPage: false,
    viewport: { width: 390, height: 844 }, canvas: rect(80, 280), scroll: { x: 0, y }, scrollMax: max, blockedTop: 300,
    occluders: [{ selector: 'apl-stage', rect: rect(0, 300, 0, 390) }],
    regions: [{ name: 'review', present: true, rect: r, documentRect: { top, bottom, left: 10, right: 380 }, horizontal: true, textSha256: 'b'.repeat(64), visibleDocumentRange: b > a ? { top: a + y, bottom: b + y } : null }]
  };
}

test('only the union of actual unoccluded document slices covers long content', () => {
  assert.equal(viewportContentCoverage([frame(0)], ['review']).complete, false);
  const result = viewportContentCoverage([frame(0), frame(300), frame(600)], ['review']);
  assert.equal(result.complete, true); assert.deepEqual(result.regions[0].gaps, []);
  const gap = frame(600); gap.blockedTop = 400; gap.occluders[0].rect = rect(0, 400, 0, 390); gap.regions[0].visibleDocumentRange.top = 1000;
  assert.equal(viewportContentCoverage([frame(0), gap], ['review']).complete, false);
});

test('scroll frames cannot silently change the model, variant question, tab, step, or viewport', () => {
  for (const mutate of [f => { f.parameters.k = 2; }, f => { f.questionSha256 = 'c'.repeat(64); }, f => { f.tab = 'problem'; }, f => { f.step = 2; }, f => { f.viewport.height = 900; }]) {
    const f = frame(512); mutate(f);
    assert.ok(viewportContentCoverage([frame(), f], ['review']).errors.includes('state-changed-between-scroll-frames'));
  }
});

test('missing, nonfinite and inconsistent rectangle evidence cannot borrow a claimed visible range', () => {
  for (const mutate of [f => { delete f.regions[0].rect.top; }, f => { f.regions[0].rect.bottom = NaN; }, f => { f.regions[0].documentRect.top++; f.regions[0].documentRect.top++; }, f => { f.regions[0].visibleDocumentRange = { top: 600, bottom: 1200 }; }, f => { f.blockedTop = 0; }]) {
    const f = frame(); mutate(f); assert.equal(viewportContentCoverage([f], ['review']).complete, false);
  }
});

test('hidden or horizontally clipped required content stays incomplete', () => {
  const hidden = frame(0, { bottom: 700 }); hidden.regions[0].present = false;
  assert.equal(viewportContentCoverage([hidden], ['review']).complete, false);
  const clipped = frame(0, { bottom: 700 }); clipped.regions[0].rect.right = 500; clipped.regions[0].rect.width = 490;
  clipped.regions[0].documentRect.right = 500;
  assert.equal(viewportContentCoverage([clipped], ['review']).complete, false);
});

test('a normal-flow sticky tab row does not invent occlusion above its actual position', () => {
  const element = (name, bounds, style = { position: 'static', top: 'auto' }) => ({ className: name, style, textContent: 'same text', getBoundingClientRect: () => bounds, checkVisibility: () => true,
    cloneNode() { return this; }, querySelectorAll: () => [], querySelector: () => ({ textContent: 'answer' }), classList: { contains: () => true } });
  const bar = element('apl-bar', rect(0, 60, 0, 390), { position: 'sticky', top: '0px' });
  const stage = element('apl-stage', rect(100, 550, 0, 390), { position: 'sticky', top: '100px' });
  const tabs = element('apl-tabs', rect(570, 620, 10, 380), { position: 'sticky', top: '0px' });
  const panel = element('panel', rect(550, 1200));
  const question = element('question', rect(555, 565));
  const sandbox = { innerWidth: 390, innerHeight: 844, scrollX: 0, scrollY: 0, getComputedStyle: e => e.style,
    document: { querySelectorAll: () => [bar, stage, tabs], querySelector: () => panel, documentElement: { scrollHeight: 1600 }, fonts: { status: 'loaded' } },
    lab: { board: { canvas: stage }, scene: { id: 'one', steps: [1, 2, 3] }, refs: { problemText: question, answer: question }, s: { step: 0, k: 1 }, tab: 'explore' }
  };
  const result = vm.runInNewContext(`(${readReviewFrame.toString()})()`, sandbox);
  assert.equal(result.blockedTop, 550);
  assert.equal(result.occluders.some(o => o.selector === 'apl-tabs'), false);
  assert.equal(result.regions.find(r => r.name === 'question').visibleDocumentRange.top, 555);
});

function captureFixture({ blocked = false, expectedTouch = true } = {}) {
  let y = 0; const shots = [], captures = [], scrolls = [];
  const page = {
    evaluate: async (fn, arg) => {
      if (fn.name === 'readReviewFrame') {
        const f = frame(y, { max: blocked ? 0 : 600 }); f.question = 'one current question';
        for (const r of f.regions) r.text = 'same current solution'; return f;
      }
      y = typeof arg === 'number' ? Math.min(arg, blocked ? 0 : 600) : 0; scrolls.push(y);
    },
    screenshot: async options => { shots.push(options); return Buffer.from('mock PNG'); }
  };
  const guard = { expectedTouch, capture: async (take, metadata) => ({ value: await take(), observation: metadata }) };
  return { page, guard, shots, captures, scrolls, options: { page, guard, out: '/evidence', name: 'state.png', id: 'one', state: 'review-final', fullPage: true, settle: async () => {}, collectContent: true, onCapture: e => captures.push(e) } };
}

test('capture keeps the legacy raw image but uses real viewport and same-state scroll frames', async () => {
  const f = captureFixture(), result = await captureReviewState(f.options);
  assert.equal(result.rawReference.file, 'state.png'); assert.equal(result.file, 'state--viewport.png');
  assert.equal(result.supplementalFrames.length, 1); assert.equal(result.contentCoverage.complete, true);
  assert.deepEqual(f.shots.map(s => s.fullPage), [true, false, false]);
  assert.equal(f.scrolls.at(-1), 0); assert.equal(f.captures.length, 3);
  assert.deepEqual(result.frame.viewport, { width: 390, height: 844 });
});

test('scroll clamping preserves partial evidence and restores the page while failing coverage', async () => {
  const f = captureFixture({ blocked: true });
  await assert.rejects(captureReviewState(f.options), /coverage incomplete/);
  assert.equal(f.captures.length, 2); assert.equal(f.scrolls.at(-1), 0);
});

for (const expectedTouch of [false, true]) {
  test(`native-only ${expectedTouch ? 'mobile' : 'desktop'} evidence never invokes a distorting full-page screenshot`, async () => {
    const f = captureFixture({ expectedTouch });
    const result = await captureReviewState({ ...f.options, nativeViewportOnly: true });
    assert.equal(result.file, 'state--viewport.png');
    assert.equal(result.rawReference, undefined);
    assert.ok(f.shots.length >= 2, 'the long solution still needs a supplemental frame');
    assert.ok(f.shots.every(s => s.fullPage === false));
    assert.equal(result.contentCoverage.complete, true);
    assert.equal(f.scrolls.at(-1), 0);
  });
}

test('legacy desktop callers keep their existing raw capture contract', async () => {
  const f = captureFixture({ expectedTouch: false }), result = await captureReviewState(f.options);
  assert.equal(result.file, 'state.png');
  assert.equal(result.supplementalFrames.length, 0);
  assert.deepEqual(f.shots.map(s => s.fullPage), [true]);
});

// Exact two-column bounds from stdDef/pc-paper/review-final, run42583866636.
// The left stage ends at x=1040 and cannot cover the review starting at 1058.
function desktopFrame(y = 0) {
  const top = 350.234375, bottom = 1200.484375;
  const f = frame(y, { top, bottom, max: 340.484375 }), r = f.regions[0];
  f.viewport = { width: 1440, height: 900 }; f.blockedTop = 900;
  f.occluders = [
    { selector: 'apl-bar', rect: rect(0, 101.390625, 0, 1440) },
    { selector: 'apl-stage', rect: rect(102, 900, 0, 1040) }
  ];
  r.rect = rect(top - y, bottom - y, 1058, 1422);
  r.documentRect = { top, bottom, left: 1058, right: 1422 };
  r.visibleDocumentRange = { top: Math.max(top - y, 101.390625) + y, bottom: Math.min(bottom - y, 900) + y };
  return f;
}

test('desktop review coverage uses actual horizontal occlusion, including every long-content slice', () => {
  assert.equal(viewportContentCoverage([desktopFrame()], ['review']).complete, false);
  assert.equal(viewportContentCoverage([desktopFrame(), desktopFrame(340.484375)], ['review']).complete, true);
  const overlapping = desktopFrame();
  overlapping.occluders[1].rect = rect(102, 900, 0, 1100);
  assert.ok(viewportContentCoverage([overlapping, desktopFrame(340.484375)], ['review']).errors.includes('invalid-visible-region:review'));
});

test('the actual desktop frame reader excludes only the disjoint left stage from right-column occlusion', () => {
  const element = (name, bounds, style = { position: 'static', top: 'auto' }) => ({ className: name, style, textContent: 'same text', getBoundingClientRect: () => bounds, checkVisibility: () => true,
    cloneNode() { return this; }, querySelectorAll: () => [], querySelector: () => ({ textContent: 'answer' }), classList: { contains: () => true } });
  const bar = element('apl-bar', rect(0, 101.390625, 0, 1440), { position: 'sticky', top: '0px' });
  const stage = element('apl-stage', rect(102, 900, 0, 1040), { position: 'sticky', top: '102px' });
  const review = element('review', rect(350.234375, 1200.484375, 1058, 1422));
  const sandbox = { innerWidth: 1440, innerHeight: 900, scrollX: 0, scrollY: 0, getComputedStyle: e => e.style,
    document: { querySelectorAll: () => [bar, stage], querySelector: () => review, documentElement: { scrollHeight: 1240.484375 }, fonts: { status: 'loaded' } },
    lab: { board: { canvas: stage }, scene: { id: 'one', steps: [1, 2, 3] }, refs: { problemText: review, answer: review }, s: { step: 3, k: 1 }, tab: 'review' }
  };
  const result = vm.runInNewContext(`(${readReviewFrame.toString()})()`, sandbox);
  assert.equal(result.blockedTop, 900, 'the recorded global obstruction remains unchanged');
  const visible = result.regions.find(r => r.name === 'review').visibleDocumentRange;
  assert.equal(visible.top, 350.234375); assert.equal(visible.bottom, 900);
  stage.getBoundingClientRect = () => rect(102, 900, 0, 1100);
  const overlap = vm.runInNewContext(`(${readReviewFrame.toString()})()`, sandbox);
  assert.equal(overlap.regions.find(r => r.name === 'review').visibleDocumentRange, null, 'a real partial-width obstruction is still blocked');
});

test('native desktop scrolling covers the full right-hand solution without borrowing the left-stage height', async () => {
  let y = 0; const shots = [], captures = [];
  const page = {
    evaluate: async (fn, arg) => {
      if (fn.name === 'readReviewFrame') {
        const f = desktopFrame(y); f.question = 'same circle question';
        f.regions[0].text = 'same complete solution'; return f;
      }
      y = typeof arg === 'number' ? Math.min(arg, 340.484375) : 0;
    },
    screenshot: async options => { shots.push(options); return Buffer.from('mock PNG'); }
  };
  const guard = { expectedTouch: false, capture: async (take, metadata) => ({ value: await take(), observation: metadata }) };
  const result = await captureReviewState({ page, guard, out: '/evidence', name: 'desktop.png', id: 'one', state: 'review-final', fullPage: true,
    nativeViewportOnly: true, settle: async () => {}, collectContent: true, onCapture: e => captures.push(e) });
  assert.deepEqual(shots.map(s => s.fullPage), [false, false]);
  assert.equal(result.supplementalFrames[0].frame.scroll.y, 340.484375);
  assert.equal(result.contentCoverage.complete, true); assert.equal(y, 0);
  assert.equal(captures.length, 2);
});

test('native-only desktop capture still fails an unreachable required slice and preserves partial files', async () => {
  const f = captureFixture({ blocked: true, expectedTouch: false });
  await assert.rejects(captureReviewState({ ...f.options, nativeViewportOnly: true }), /coverage incomplete/);
  assert.ok(f.shots.every(s => s.fullPage === false));
  assert.equal(f.captures.length, 1); assert.equal(f.scrolls.at(-1), 0);
});

// Document bounds and scroll limits from candidate run42583866636. At y=0
// only the bar is pinned; any of these larger scrolls also pins the stage.
const stickyProfiles = {
  sine: { tab: 'review', name: 'review', top: 675.140625, bottom: 1542.140625, max: 758, firstScroll: 711 },
  sequence: { tab: 'explore', name: 'panel', top: 557.140625, bottom: 1200.984375, max: 357, firstScroll: 357 }
};
function stickyFrame(y, profile) {
  const f = frame(y, profile), r = f.regions[0];
  f.tab = profile.tab; f.step = profile.tab === 'review' ? 3 : 0; r.name = profile.name;
  f.blockedTop = y === 0 ? 101.390625 : 553.75;
  f.occluders = [{ selector: 'apl-bar', rect: rect(0, 101.390625, 0, 390) }];
  if (y > 0) f.occluders.push({ selector: 'apl-stage', rect: rect(98, 553.75, 0, 390) });
  const top = Math.max(r.rect.top, f.blockedTop, 0), bottom = Math.min(r.rect.bottom, 844);
  r.visibleDocumentRange = bottom > top ? { top: top + y, bottom: bottom + y } : null;
  return f;
}
function stickyCaptureFixture(profile, { changeModelOnReturn = false, ignoreScroll = false } = {}) {
  let y = 0, modelChanged = false; const scrolls = [], captures = [], shots = [];
  const page = {
    evaluate: async (fn, arg) => {
      if (fn.name === 'readReviewFrame') {
        const f = stickyFrame(y, profile); f.question = 'one current question';
        if (modelChanged) f.parameters.k = 2;
        for (const r of f.regions) r.text = 'same current solution'; return f;
      }
      const next = typeof arg === 'number' ? Math.round(Math.max(0, Math.min(arg, profile.max))) : 0;
      if (typeof arg === 'number' && next < y && changeModelOnReturn) modelChanged = true;
      y = ignoreScroll ? 0 : next; scrolls.push(y);
    },
    screenshot: async options => { shots.push(options); return Buffer.from('mock PNG'); }
  };
  const guard = { expectedTouch: true, capture: async (take, metadata) => ({ value: await take(), observation: metadata }) };
  return { scrolls, captures, shots, options: { page, guard, out: '/evidence', name: 'state.png', id: 'one', state: profile.tab === 'review' ? 'review-final' : 'initial-explore', fullPage: true, settle: async () => {}, collectContent: true, onCapture: e => captures.push(e) } };
}

for (const [name, profile] of Object.entries(stickyProfiles)) {
  test(`actual ${name} sticky transition gaps are filled with backward viewport captures`, async () => {
    const priorFrames = [stickyFrame(0, profile), stickyFrame(profile.firstScroll, profile), stickyFrame(profile.max, profile)];
    const priorCoverage = viewportContentCoverage(priorFrames, [profile.name]);
    assert.equal(priorCoverage.complete, false);
    assert.deepEqual(priorCoverage.regions[0].gaps[0], { top: 844, bottom: profile.firstScroll + 553.75 });
    const f = stickyCaptureFixture(profile), result = await captureReviewState(f.options);
    assert.equal(result.contentCoverage.complete, true);
    assert.deepEqual(result.contentCoverage.regions[0].gaps, []);
    assert.deepEqual(result.frame.viewport, { width: 390, height: 844 });
    assert.equal(result.supplementalFrames[0].frame.scroll.y, profile.firstScroll);
    assert.equal(result.supplementalFrames[1].frame.scroll.y, 258, 'capture returns to the skipped slice');
    assert.ok(result.supplementalFrames.every(e => e.frame.fullPage === false && e.frame.parameters.k === 1));
    assert.equal(f.scrolls.at(-1), 0);
  });
}

test('backward gap filling still rejects a changed model and preserves partial captures', async () => {
  const f = stickyCaptureFixture(stickyProfiles.sine, { changeModelOnReturn: true });
  await assert.rejects(captureReviewState(f.options), /state-changed-between-scroll-frames/);
  assert.ok(f.captures.some(e => e.frame.parameters.k === 2));
  assert.equal(f.scrolls.at(-1), 0);
});

test('an unreachable gap does not loop or borrow coverage from a clamped scroll', async () => {
  const f = stickyCaptureFixture(stickyProfiles.sine, { ignoreScroll: true });
  await assert.rejects(captureReviewState(f.options), /coverage incomplete/);
  assert.ok(f.captures.every(e => e.frame.scroll.y === 0));
  assert.ok(f.captures.length <= 3);
  assert.equal(f.scrolls.at(-1), 0);
});
