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
