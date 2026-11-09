import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { captureReviewTargets, neighboringSliderValues, reviewTargetApplicable, readSolutionControlGeometry, setNativeSolutionDisclosure } from './high-review-targets.mjs';

// Source/control-contract seams only. This does not render or certify a browser,
// pointer event, screenshot, KaTeX layout, or mathematical answer.
function fixture(name, { inertSlider = false, wrongScene = false, emptyCapture = false } = {}) {
  const solutionOpened = new Set(); let pendingSolution = null;
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
        goScene(index) { this.index = index; this.tab = 'explore'; this._tween = null; this.s.step = 0; this.s.revealed = false; solutionOpened.clear(); def.enter?.(state, this.scene, this); this.scene.enter?.(state, this); },
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
    mouse: { click: async () => {
      assert.notEqual(pendingSolution, null);
      if (solutionOpened.has(pendingSolution)) solutionOpened.delete(pendingSolution); else solutionOpened.add(pendingSolution);
    } },
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
        nth: index => ({ getAttribute: async () => solutionOpened.has(index) ? '' : null, locator: () => ({ evaluate: async () => {
          pendingSolution = index;
          return { rect: { left: 20, right: 370, top: 680, bottom: 728, width: 350, height: 48 }, viewport: { width: 390, height: 844 },
            scroll: { x: 0, y: 0 }, scrollMax: 1200, blockedTop: 554, occluders: [], hits: [{ x: 195, y: 704, inSummary: true }], point: { x: 195, y: 704 } };
        } }) })
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

function solutionFixture({ desktop = false, covered = false, inert = false, invalid = false, clickError = null, open = true } = {}) {
  let scrollY = desktop ? 0 : 200, isOpen = open;
  const events = [], observations = [], scrolls = [];
  const dimensions = (left, top, right, bottom) => ({ left, top, right, bottom, width: right - left, height: bottom - top });
  const summary = { tagName: 'SUMMARY', className: '', checkVisibility: () => true,
    getBoundingClientRect: () => dimensions(desktop ? 1058 : 20, 700 - scrollY, desktop ? 1422 : 370, 748 - scrollY), contains: el => el === child };
  const child = { tagName: 'SPAN', className: 'summary-label' };
  const stage = { tagName: 'SECTION', className: 'apl-stage', checkVisibility: () => true,
    getBoundingClientRect: () => desktop ? dimensions(0, 102, 1040, 900) : dimensions(0, 142.75, 390, 553.75) };
  const body = { tagName: 'SPAN', className: 'apl-acc-body' };
  const width = desktop ? 1440 : 390, height = desktop ? 900 : 844;
  const hit = (x, y) => {
    const s = stage.getBoundingClientRect(), r = summary.getBoundingClientRect();
    if (covered) return body;
    if (x >= s.left && x <= s.right && y >= s.top && y <= s.bottom) return stage;
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? child : body;
  };
  const context = () => ({ summary, innerWidth: width, innerHeight: height, scrollX: 0, scrollY,
    getComputedStyle: () => ({ position: 'sticky', top: desktop ? '102px' : '142.75px' }),
    document: { querySelectorAll: () => [stage], documentElement: { scrollHeight: 2400 }, elementFromPoint: hit } });
  const locator = { evaluate: async fn => {
    const result = vm.runInNewContext('(' + fn.toString() + ')(summary)', context());
    if (invalid) result.rect.top = NaN;
    return result;
  } };
  const card = { getAttribute: async () => isOpen ? '' : null, locator: name => { assert.equal(name, 'summary'); return locator; } };
  const page = {
    evaluate: async (fn, y) => vm.runInNewContext('(' + fn.toString() + ')(y)', { y, window: { scrollTo: options => {
      assert.equal(options.behavior, 'instant'); assert.equal(options.left, 0); scrollY = Math.max(0, Math.min(2400 - height, options.top)); scrolls.push(scrollY);
    } } }),
    mouse: { click: async (x, y) => { events.push({ x, y }); if (clickError) throw clickError; assert.ok(summary.contains(hit(x, y)), 'native input reaches the actual summary descendant'); if (!inert) isOpen = !isOpen; } }
  };
  return { page, card, settle: async () => {}, onObservation: r => observations.push(r), events, observations, scrolls,
    read: () => locator.evaluate(readSolutionControlGeometry), get open() { return isOpen; },
    // Model the recorded failure mechanism, not a claim of native reproduction:
    // automatic centering at viewport/2 leaves this summary behind the stage.
    legacyCenteredClick: async () => { scrollY = 724 - height / 2; if (!summary.contains(hit(width / 2, height / 2))) throw Error('sticky stage intercepts centered summary click'); }
  };
}

test('native solution closing scrolls a sticky-covered summary to an actual browser hit target', async () => {
  const f = solutionFixture();
  await assert.rejects(f.legacyCenteredClick(), /stage intercepts/);
  const initial = await f.read(); assert.equal(initial.point, null);
  const r = await setNativeSolutionDisclosure({ ...f, open: false });
  assert.equal(r.pass, true); assert.equal(r.inputPerformed, true); assert.equal(r.transport, 'Playwright.page.mouse.click');
  assert.equal(f.open, false); assert.equal(f.events.length, 1); assert.ok(f.scrolls.length > 0);
  assert.equal(r.attempts[0].point, null); assert.ok(r.attempts.at(-1).hits.some(h => h.inSummary));
  assert.ok(f.events[0].y > 553.75); assert.equal(f.observations.length, 1);
});

test('native solution opening retains desktop right-column access beside a sticky stage', async () => {
  const f = solutionFixture({ desktop: true, open: false });
  const r = await setNativeSolutionDisclosure({ ...f, open: true });
  assert.equal(r.pass, true); assert.equal(r.afterOpen, true); assert.equal(f.events.length, 1); assert.equal(f.scrolls.length, 0);
  assert.equal(r.attempts[0].blockedTop, 0, 'left stage does not occlude the right summary');
});

test('native solution input fails if coverage, geometry or the resulting state is invalid', async () => {
  for (const options of [{ covered: true }, { invalid: true }, { inert: true }]) {
    const f = solutionFixture(options);
    await assert.rejects(setNativeSolutionDisclosure({ ...f, open: false }), /covered|geometry|did not change/);
    assert.equal(f.open, true); assert.equal(f.observations.length, 1); assert.equal(f.observations[0].pass, false);
    assert.equal(f.events.length, options.inert ? 1 : 0, 'never send a forced click to a covered or invalid target');
  }
});

test('native solution input preserves a transport failure and does not invent an input for an open card', async () => {
  const error = Error('native input transport failed'), f = solutionFixture({ clickError: error });
  await assert.rejects(setNativeSolutionDisclosure({ ...f, open: false }), e => e === error);
  assert.equal(f.observations[0].pass, false); assert.match(f.observations[0].error, /transport failed/);
  const unchanged = solutionFixture(), r = await setNativeSolutionDisclosure({ ...unchanged, open: true });
  assert.equal(r.status, 'ALREADY_IN_REQUESTED_STATE'); assert.equal(r.inputPerformed, false); assert.equal(r.transport, null); assert.equal(unchanged.events.length, 0);
});

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

test('repaired sequence HUDs capture only the missing review disclosure boundaries across existing profiles', async () => {
  const ids = [1, 2, 4, 5, 6, 7].flatMap(n => [`type${n}-0`, `type${n}-1`]).concat(['cyc-table', 'pt-tri-sum', 'fig-repeat']);
  let added = 0;
  for (const profile of ['pc-paper', 'mobile-paper', 'mobile-board']) {
    const f = fixture('alg-sequence');
    for (const id of ids) {
      const entries = await f.run(id, profile), rows = entries.filter(e => e.state.startsWith('target-sequence-staged-hud-'));
      assert.deepEqual(rows.map(e => e.actual.step), [0, 1, 2], id + '/' + profile);
      assert.ok(rows.every(e => e.file && e.actual.tab === 'review' && !e.actual.revealed && e.nativeInteractionPass === false));
      assert.equal(new Set(rows.map(e => e.conditionSHA256)).size, 1, 'the three disclosure frames use one fixed question');
      assert.ok(entries.some(e => !e.state.startsWith('target-sequence-staged-hud-')), 'existing exploration targets remain');
      added += rows.length;
    }
    for (const id of ['type3-0', 'type3-1', 'type8-0', 'type8-1', 'pt-tri-diff']) {
      const rows = await f.run(id, profile);
      assert.equal(rows.some(e => e.state.startsWith('target-sequence-staged-hud-')), false, 'already captured review stages are not duplicated');
      assert.deepEqual([...new Set(rows.filter(e => e.file && e.actual.tab === 'review').map(e => e.actual.step))].sort(), [0, 1, 2, 3]);
    }
    const branch = (await f.run('br-tree', profile)).filter(e => e.state.startsWith('target-branch-review-disclosure-'));
    assert.deepEqual(branch.map(e => e.actual.step), [0, 1, 4, 5]);
    assert.ok(branch.every(e => e.fixture.variantIndex === 3 && e.fixture.m === 4 && e.fixture.finalStep === 5 && e.actual.variantIndex === 3 && !e.nativeInteractionPass));
    assert.equal(new Set(branch.map(e => e.conditionSHA256)).size, 1);
    added += branch.length;
  }
  assert.equal(added, 147, 'additional targets remain separate from the 1304 required base states');
  assert.deepEqual(await fixture('alg-sequence').run('type1-0', 'pc-board'), [], 'existing target profile scope is unchanged');
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

function drawCandidateChoices(P) {
  const { lab } = fixture('common-functions');
  lab.goScene(lab.list.findIndex(s => s.id === 'b9-5'));
  lab.scene.vary.cur().P = P;
  lab.setTab('review'); lab.setStep(2);
  const marks = [], board = {};
  for (const method of ['poly', 'seg', 'point', 'text']) board[method] = (...args) => { marks.push({ method, args }); return board; };
  lab.scene.draw(board, lab.s, lab.scene.view(lab.s, lab), lab);
  return marks;
}

test('coincident candidates from one input are not marked as a cross-input conflict', () => {
  // Actual run42583866636 condition: only x=5 has A=B=-20.
  const marks = drawCandidateChoices({ X: [2, 3, 4, 5], al: 5, k: 4 });
  const rings = marks.filter(m => m.method === 'point' && m.args[1].r === 21 && m.args[1].color === 'red');
  assert.equal(rings.length, 0, 'two rules for the same input do not break injectivity');
  assert.ok(marks.some(m => m.method === 'text' && m.args[1] === '−20'), 'the common output remains labelled');
});

test('different inputs sharing an output remain highlighted with a visible value above the ring fill', () => {
  // The default question has B(1)=A(3)=-4, a genuine forbidden pair.
  const marks = drawCandidateChoices({ X: [1, 2, 3, 4], al: 5, k: 4 });
  const rings = marks.filter(m => m.method === 'point' && m.args[1].r === 21 && m.args[1].color === 'red');
  assert.equal(rings.length, 1, 'the genuine cross-input collision remains emphasized');
  const p = rings[0].args[0], samePoint = m => Array.isArray(m.args[0]) && m.args[0][0] === p[0] && m.args[0][1] === p[1];
  const lastAtOutput = marks.filter(m => ['point', 'text'].includes(m.method) && samePoint(m)).at(-1);
  // Production Board.point(hollow) fills its halo; the number must be painted after it.
  assert.equal(lastAtOutput.method, 'text');
  assert.equal(lastAtOutput.args[1], '−4');
  assert.equal(lastAtOutput.args[2].color, 'red');
  assert.equal(lastAtOutput.args[2].halo, false);
});

function drawDecreasingCounterexample(tab, step, t) {
  const { lab } = fixture('common-functions');
  lab.goScene(lab.list.findIndex(s => s.id === 'bas-7'));
  lab.setTab(tab); lab.setStep(step); lab.s.t = t;
  const marks = [], no = () => {};
  const board = { W: 1000, H: 700, k: 1, lw: 1, fs: 1, font: 'sans-serif',
    colors: {}, _ts: () => 1, color: c => c, toS: (x,y) => ({x,y}),
    ctx: new Proxy({ measureText: s => ({width: String(s).length * 7}) }, {get: (o,k) => k in o ? o[k] : no}) };
  for (const method of ['seg', 'point', 'handle', 'right', '_text']) {
    board[method] = (...args) => { marks.push({method,args}); return board; };
  }
  const view = lab.scene.view(lab.s, lab);
  lab.scene.draw(board, lab.s, view, lab);
  const segments = color => marks.filter(m => m.method === 'seg' && m.args[2].color === color).map(m => m.args.slice(0,2));
  return { marks, view, f: segments('#38bdf8'), inverse: segments('#f472b6') };
}

// Independent segment intersection calculation. In particular, a positive-length
// collinear overlap must not be mistaken for a finite set of shared endpoints.
function commonPoints(left, right) {
  const eps = 1e-8, points = [], overlaps = [];
  const sub = (a,b) => ({x:a.x-b.x,y:a.y-b.y});
  const cross = (a,b) => a.x*b.y-a.y*b.x;
  const dot = (a,b) => a.x*b.x+a.y*b.y;
  const add = p => { if (!points.some(q => Math.hypot(p.x-q.x,p.y-q.y) < eps)) points.push(p); };
  for (const [p,p1] of left) for (const [q,q1] of right) {
    const r=sub(p1,p), s=sub(q1,q), qp=sub(q,p), den=cross(r,s);
    if (Math.abs(den) > eps) {
      const t=cross(qp,s)/den, u=cross(qp,r)/den;
      if (t >= -eps && t <= 1+eps && u >= -eps && u <= 1+eps) add({x:p.x+t*r.x,y:p.y+t*r.y});
    } else if (Math.abs(cross(qp,r)) <= eps) {
      const rr=dot(r,r), t0=dot(qp,r)/rr, t1=dot(sub(q1,p),r)/rr;
      const lo=Math.max(0,Math.min(t0,t1)), hi=Math.min(1,Math.max(t0,t1));
      if (hi-lo > eps) overlaps.push({p,p1,q,q1,lo,hi});
      else if (hi >= lo-eps) add({x:p.x+lo*r.x,y:p.y+lo*r.y});
    }
  }
  return {points,overlaps};
}

test('the decreasing-function diagram has exactly three isolated inverse intersections at every comparison step', () => {
  for (const tab of ['explore','review']) for (const step of [0,1,2,3,4]) for (const t of [0,1]) {
    const {marks,f,inverse} = drawDecreasingCounterexample(tab,step,t);
    assert.ok(f.length >= 4);
    // Design coordinates have downward-positive y: both x and screen y increase.
    for (const [a,b] of f) assert.ok(b.x>a.x && b.y>a.y, 'strictly decreasing function');
    if (!inverse.length) { assert.equal(tab,'explore'); assert.ok(t<=.2 && step<2); continue; }
    const fixed = marks.find(m => m.method === 'point' && m.args[1].color === '#fbbf24').args[0];
    const mirrorSum=fixed.x+fixed.y;
    assert.equal(inverse.length,f.length);
    f.forEach((line,i) => line.forEach((p,j) => {
      const reflected=inverse[i][j];
      assert.ok(Math.abs(reflected.x-(mirrorSum-p.y))<1e-8 && Math.abs(reflected.y-(mirrorSum-p.x))<1e-8, 'inverse is an exact y=x reflection');
    }));
    const red = marks.filter(m => ['point','handle'].includes(m.method) && m.args.at(-1).color === '#fb7185').map(m => m.args[m.method==='handle'?1:0]).sort((a,b)=>a.x-b.x);
    assert.equal(red.length,2);
    const origin={x:(red[0].x+red[1].x)/2,y:(red[0].y+red[1].y)/2}, unit=(red[1].x-red[0].x)/6;
    const world = p => ({x:(p.x-origin.x)/unit,y:(origin.y-p.y)/unit});
    const actual=commonPoints(f.map(s=>s.map(world)),inverse.map(s=>s.map(world)));
    assert.equal(actual.overlaps.length,0, `${tab}/${step}/${t}: no shared segment`);
    assert.equal(actual.points.length,3, `${tab}/${step}/${t}: exactly three points`);
    for (const [x,y] of [[-3,3],[1,1],[3,-3]]) assert.ok(actual.points.some(p=>Math.hypot(p.x-x,p.y-y)<1e-8), `intersection (${x},${y})`);
  }
});

test('the decreasing-function final comparison keeps the slope -1 chord and perpendicular marker', () => {
  const {marks,view}=drawDecreasingCounterexample('review',4,0);
  assert.match(view.guide,/3개의 교점/);
  const chord=marks.find(m=>m.method==='seg' && m.args[2].color==='#fb7185' && m.args[2].dash?.join(',')==='4,4');
  assert.ok(chord,'outer symmetric pair is connected');
  const [a,b]=chord.args;
  assert.ok(Math.abs((b.y-a.y)-(b.x-a.x))<1e-8,'screen slope +1 means mathematical slope -1');
  const [o,p,q]=marks.find(m=>m.method==='right').args;
  assert.ok(Math.abs((p.x-o.x)*(q.x-o.x)+(p.y-o.y)*(q.y-o.y))<1e-8,'symmetry line and chord are perpendicular');
});

test('circle line clipping retains distinct boundary endpoints and rejects a corner-only contact', () => {
  const html = fs.readFileSync(new URL('../labs/common-circle-eq.html', import.meta.url), 'utf8');
  const source = html.match(/function clipLine\(L, box\) \{[\s\S]*?\n    \}/)?.[0];
  assert.ok(source, 'test the production clipping function');
  const clip = vm.runInNewContext('(' + source + ')', {
    P: (x,y) => ({x,y}), distP: (p,q) => Math.hypot(p.x-q.x,p.y-q.y)
  });
  const box = {x:[-2,3],y:[-1,4]}, cornerBox = {x:[-1.5,3.5+Math.SQRT2],y:[-4.5,2.5+Math.SQRT2]};
  const cases = [
    ['reported pink tangent', {a:1,b:-1,c:-3}, cornerBox, [[-1.5,-4.5],[3.5+Math.SQRT2,.5+Math.SQRT2]]],
    ['other blue tangent', {a:1,b:-1,c:1}, cornerBox, [[-1.5,-.5],[1.5+Math.SQRT2,2.5+Math.SQRT2]]],
    ['two opposite corners', {a:1,b:-1,c:1}, box, [[-2,-1],[3,4]]],
    ['corner contact only', {a:1,b:1,c:3}, box, null],
    ['horizontal', {a:0,b:1,c:-2}, box, [[-2,2],[3,2]]],
    ['vertical', {a:1,b:0,c:-1}, box, [[1,-1],[1,4]]],
    ['horizontal boundary', {a:0,b:1,c:1}, box, [[-2,-1],[3,-1]]],
    ['vertical boundary', {a:1,b:0,c:2}, box, [[-2,-1],[-2,4]]],
    ['positive slope', {a:1,b:-2,c:2}, box, [[-2,0],[3,2.5]]],
    ['negative slope', {a:2,b:1,c:-2}, box, [[-1,4],[1.5,-1]]],
    ['outside horizontal', {a:0,b:1,c:-5}, box, null],
    ['outside vertical', {a:1,b:0,c:-4}, box, null],
    ['degenerate equation', {a:0,b:0,c:0}, box, null]
  ];
  for (const [name,line,view,expected] of cases) {
    const ends = clip(line,view);
    if (!expected) { assert.equal(ends,null,name); continue; }
    assert.ok(ends && ends.length===2,name);
    assert.ok(Math.hypot(ends[0].x-ends[1].x,ends[0].y-ends[1].y)>1e-8,name+' has positive length');
    for (const [x,y] of expected) assert.ok(ends.some(p=>Math.hypot(p.x-x,p.y-y)<1e-8),name+' boundary endpoint');
    for (const p of ends) assert.ok(Math.abs(line.a*p.x+line.b*p.y+line.c)<1e-8,name+' lies on line');
  }
});

test('the reported distance-versus-radius question draws both full tangents through their contact points', () => {
  const {lab} = fixture('common-circle-eq');
  lab.goScene(lab.list.findIndex(s=>s.id==='dVsR'));
  const q = lab.scene.vary.cur(), segments = [], board = {};
  for (const name of ['circle','point','right','text']) board[name] = () => board;
  board.seg = (p,q,o) => { segments.push({p,q,o}); return board; };
  q.draw(board,4);
  // Production W converts (x,y) to (10x,-10y); compare in mathematical units.
  for (const [color,k,contact] of [['rose',-3,[3,0]],['sky',1,[1,2]]]) {
    const line = segments.find(s=>s.o.color===color && s.o.width===2.6);
    assert.ok(line,color+' tangent is emitted');
    const ends=[line.p,line.q].map(p=>({x:p.x/10,y:-p.y/10}));
    assert.ok(Math.hypot(ends[0].x-ends[1].x,ends[0].y-ends[1].y)>6,color+' tangent has full extent');
    for (const p of ends) assert.ok(Math.abs(p.y-p.x-k)<1e-8,color+' tangent equation');
    const [a,b]=ends, dx=b.x-a.x, dy=b.y-a.y;
    const t=((contact[0]-a.x)*dx+(contact[1]-a.y)*dy)/(dx*dx+dy*dy);
    assert.ok(t>=0 && t<=1,color+' includes the actual circle contact');
    assert.ok(Math.hypot(a.x+t*dx-contact[0],a.y+t*dy-contact[1])<1e-8,color+' contact lies on segment');
  }
});
