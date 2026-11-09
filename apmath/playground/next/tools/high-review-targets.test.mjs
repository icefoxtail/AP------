import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { captureReviewTargets, neighboringSliderValues, reviewTargetApplicable } from './high-review-targets.mjs';

// Source/control-contract seams only. This does not render or certify a browser,
// pointer event, screenshot, KaTeX layout, or mathematical answer.
function fixture(name, { inertSlider = false, wrongScene = false, emptyCapture = false } = {}) {
  const html = fs.readFileSync(new URL('../labs/' + name + '.html', import.meta.url), 'utf8');
  const code = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('DOMContentLoaded'));
  let seed = 424;
  const math = Object.create(Math);
  math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const ctx = { Math: math, console, setTimeout() {}, clearTimeout() {}, matchMedia: () => ({ matches: false }) };
  ctx.window = ctx;
  ctx.addEventListener = (_, fn) => fn();
  ctx.document = { addEventListener() {}, querySelectorAll: () => [] };
  const values = v => typeof v === 'function' ? v(ctx.lab.s, ctx.lab) : v;
  ctx.APLab = {
    clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)), fmt: String, stripEmoji: s => s,
    tex: s => '$' + s + '$', esc: s => s, toast() {},
    createLab(def) {
      const list = def.scenes || def.groups.flatMap(g => g.scenes);
      const state = { step: 0, revealed: false, grid: false, ...def.state, ...Object.fromEntries(Object.entries(def.params || {}).map(([k, v]) => [k, v.value])) };
      const lab = ctx.lab = {
        def, list, params: def.params, s: state, index: 0, tab: 'explore',
        board: { focus: { x: [-10, 10], y: [-10, 10] }, aspect: '1:1', k: 1, ky: 1, setFocus() {} },
        get scene() { return list[this.index]; },
        goScene(index) { this.index = index; this.tab = 'explore'; this._tween = null; this.s.step = 0; this.s.revealed = false; def.enter?.(state, this.scene, this); this.scene.enter?.(state, this); },
        setTab(tab) { this.tab = tab; },
        setStep(step) { this.s.step = Math.min(Math.max(0, step), values(this.scene.steps)?.length || 0); if (!this.s.step) this.s.revealed = false; },
        invalidate() {}, _buildReview() {}, _measureFocus() { return null; },
        _answerOpen() { return this.s.revealed || this.s.step >= (values(this.scene.steps)?.length || 0); },
        get _ctls() {
          return Object.fromEntries((values(this.scene.controls) || []).filter(k => this.params[k]).map(k => {
            const p = this.params[k];
            return [k, { input: { checkVisibility: () => this.tab === 'explore', min: p.min, max: p.max, step: p.step, getAttribute: () => p.label } }];
          }));
        }
      };
      const problemNode = () => ({ querySelectorAll: () => [], textContent: String(values(lab.scene.problem?.text) || '') });
      lab.refs = { controls: {}, problemText: { cloneNode: problemNode } };
      lab.goScene(0);
      return lab;
    }
  };
  vm.createContext(ctx); vm.runInContext(code, ctx, { timeout: 20000, filename: name });
  const lab = ctx.lab, captured = [], measured = [];
  const buttons = kind => values(lab.scene[kind]) || [];
  const page = {
    evaluate: async (fn, arg) => {
      ctx.__arg = arg;
      const result = vm.runInContext('(' + fn.toString() + ')(__arg)', ctx, { timeout: 1000 });
      if (wrongScene && result && 'conditionText' in result) result.scene = 'wrong-scene';
      return result;
    },
    getByRole: (role, { name: label }) => ({ fill: async value => {
      assert.equal(role, 'slider');
      const key = Object.keys(lab._ctls).find(k => lab.params[k].label === label);
      assert.ok(key, 'visible slider exists: ' + label);
      if (!inertSlider) { lab.s[key] = Number(value); lab.params[key].onInput?.(lab.s, lab); }
    } }),
    locator: selector => {
      const kind = selector.includes('.apl-presets') ? 'presets' : selector.includes('.apl-actions-row') ? 'actions' : null;
      if (kind) return {
        count: async () => lab.tab === 'explore' ? buttons(kind).length : 0,
        nth: index => ({ click: async () => {
          const entry = buttons(kind)[index]; assert.ok(entry, 'button exists');
          if (kind === 'actions') entry.run(lab.s, lab);
          else { entry.apply?.(lab.s, lab); Object.assign(lab.s, entry.set || {}); }
        } })
      };
      if (selector.includes('.apl-newprob')) return { count: async () => lab.scene.vary?.next ? 1 : 0, click: async () => {
        lab.scene.vary.next(); lab.scene.vary.onNext?.(lab.s); lab.s.step = 0; lab.s.revealed = false;
      } };
      if (selector.includes('details.apl-acc')) return {
        count: async () => ['standard', 'quick'].filter(k => lab.scene.solution?.[k]).length,
        nth: () => ({ getAttribute: async () => null, locator: () => ({ click: async () => {} }) })
      };
      throw Error('Unhandled locator in control-contract test: ' + selector);
    }
  };
  const run = async (sceneId, runName = 'pc-paper') => {
    const index = lab.list.findIndex(s => s.id === sceneId);
    assert.ok(index >= 0, sceneId);
    lab.goScene(index);
    return captureReviewTargets({ page, item: { id: name }, scene: { id: sceneId, index }, run: { name: runName },
      settle: async () => {}, measure: async (_, state) => measured.push(state),
      capture: async (_, state) => { captured.push(state); return emptyCapture ? undefined : state + '.png'; } });
  };
  return { run, lab, captured, measured };
}

test('repair target profiles remain bounded and retain dark critical geometry', () => {
  assert.equal(reviewTargetApplicable('common-circle-eq', 'pappusMinSq', 'mobile-board'), true);
  assert.equal(reviewTargetApplicable('common-circle-eq', 'pappusMinSq', 'tablet-landscape-paper'), false);
  assert.equal(reviewTargetApplicable('common-circle-eq', 'threePts', 'pc-paper'), false);
  assert.equal(reviewTargetApplicable('alg-sine-cosine-law', 'adv-5', 'pc-board'), true);
  assert.equal(reviewTargetApplicable('alg-sine-cosine-law', 'bas-1', 'pc-board'), false);
});

test('slider neighbors are distinct legal values on both sides of exact values', () => {
  assert.deepEqual(neighboringSliderValues(0.375), [0.37, 0.38]);
  assert.deepEqual(neighboringSliderValues(1 / 3), [0.33, 0.335]);
  assert.deepEqual(neighboringSliderValues(0), [0.005]);
  assert.deepEqual(neighboringSliderValues(1), [0.995]);
});

test('all selected repairs resolve actual source controls and emit measured evidence or explicit debt', async () => {
  let scenes = 0, frames = 0;
  for (const name of ['common-circle-eq', 'common-functions', 'common-irrational', 'common-rational', 'alg-sequence', 'alg-sine-cosine-law']) {
    const f = fixture(name);
    for (const sc of f.lab.list) {
      if (!reviewTargetApplicable(name, sc.id, 'pc-paper')) continue;
      scenes++;
      const entries = await f.run(sc.id);
      assert.ok(entries.length, name + '/' + sc.id + ' emitted no evidence');
      for (const entry of entries) {
        if (entry.file) {
          frames++; assert.equal(entry.actual.scene, sc.id);
          assert.equal(entry.visualVerdict, 'AWAITING_INDEPENDENT_REVIEW');
          assert.equal(entry.nativeInteractionPass, false);
          assert.match(entry.conditionSHA256, /^[a-f0-9]{64}$/);
          assert.ok(f.measured.includes(entry.state));
        } else assert.ok(['COVERAGE_DEBT', 'NOT_APPLICABLE', 'LIMITATION'].includes(entry.status));
      }
      assert.equal(entries.some(e => /not found|No coincident/.test(e.reason || '')), false, name + '/' + sc.id + ' failed to select its bounded condition');
    }
  }
  assert.ok(scenes > 50 && frames > scenes);
});

test('an inert visible slider cannot emit a successful target frame', async () => {
  const f = fixture('common-functions', { inertSlider: true });
  await assert.rejects(f.run('b9-2'), /slider state mismatch/);
  assert.equal(f.captured.length, 0);
});

test('a stale scene identity cannot receive a target filename', async () => {
  const f = fixture('common-circle-eq', { wrongScene: true });
  await assert.rejects(f.run('pappusMinSq'), /scene mismatch/);
  assert.equal(f.captured.length, 0);
});

test('a missing PNG remains a fatal capture failure', async () => {
  const f = fixture('common-circle-eq', { emptyCapture: true });
  await assert.rejects(f.run('pappusMinSq'), /returned no PNG/);
});

test('fixed question transitions preserve one condition across exploration endpoints', async () => {
  const f = fixture('common-functions');
  const rows = await f.run('bas-5');
  const fixed = rows.filter(e => e.state.includes('function-fixed-after'));
  assert.equal(fixed.length, 2);
  assert.equal(fixed[0].conditionSHA256, fixed[1].conditionSHA256);
  assert.deepEqual(fixed.map(e => e.fixture.previousExploreT), [0, 1]);
  assert.ok(fixed.every(e => e.actual.tab === 'problem' && e.actual.step === 0 && !e.actual.revealed));
});

test('unrequested full trajectories and unreachable endpoints are honest scope notes, not missing required evidence', async () => {
  const sequence = fixture('alg-sequence'), sine = fixture('alg-sine-cosine-law');
  const area = await sequence.run('pt-tri-sum'), critical = await sine.run('adv-5'), arc = await sine.run('ext-1');
  const notes = [...area, ...critical, ...arc].filter(e => !e.file);
  assert.ok(notes.some(e => e.status === 'LIMITATION'));
  assert.ok(notes.some(e => e.status === 'NOT_APPLICABLE'));
  assert.equal(notes.some(e => e.status === 'COVERAGE_DEBT'), false);
  assert.ok(notes.every(e => e.nativeInteractionPass === false && e.reason));
});
