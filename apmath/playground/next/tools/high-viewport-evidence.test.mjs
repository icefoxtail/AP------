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

function captureFixture({ blocked = false } = {}) {
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
  const guard = { expectedTouch: true, capture: async (take, metadata) => ({ value: await take(), observation: metadata }) };
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
