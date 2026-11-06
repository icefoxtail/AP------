// AP Math Lab 2.0 · 다면체 실험실 「세 꼭짓점을 지나는 단면」(p4-3) 검사 (브라우저 없이 수 초)
// 실행: node --test apmath/playground/next/tools/cube-section.test.mjs
// 확인하는 것 (개수가 아니라 결함 조건):
//  1) 정육면체의 서로 다른 세 꼭짓점 56가지 모두 단면이 정사각형·직사각형·정삼각형 중 하나이고,
//     좌표로 따로 센 기준(한 면 위 · 한 꼭짓점에 이웃한 세 점 · 나머지)과 같다. 단면의 꼭짓점은 정육면체의 꼭짓점뿐(모서리 가운데를 지나지 않음).
//  2) 넷째 점은 평행한 모서리/같은 면으로 직접 구한 값과 같고, 선생님 문항(A·G·H)은 직사각형 ABGH.
//  3) 평면 넓히기: 0 이면 세 점 삼각형(넓이·꼭짓점), 1 이면 단면, 그 사이는 삼각형에서 단면으로 커지고, 정삼각형 단면은 그대로.
//  4) 시점: 56가지 모두 최종 시점에서 단면이 선처럼 보이지 않고(투영 넓이 비율 0.35 이상) 꼭짓점 이름이 겹치지 않으며, 선생님 문항 3가지는 기본 시점 그대로.
//  5) 문제 탭: 첫 문제는 A·G·H, 정답 보기는 정확히 하나이고 계산한 모양과 같으며, 「새 문제」는 정사각형을 드물게 뽑는다. 정리 풀이는 3단계.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(NEXT, 'labs/g7-polyhedra');
function load(files) {
  const noop = () => {};
  const el = () => ({ style: {}, dataset: {}, append: noop, remove: noop, addEventListener: noop, setAttribute: noop });
  const document = { documentElement: el(), head: el(), body: el(), getElementById: () => null, createElement: el, addEventListener: noop };
  const window = { document };
  const ctx = vm.createContext({ window, document, console, Math, Date, Set, Map, Array, Object, JSON, String, Number, Symbol, Promise });
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(DIR, f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  return window;
}
const W = load(['core', 'geo', 'cubesec', 't4']);
const G = W.APL_PH, CS = G.cubeSec;
const scene = Object.fromEntries(W.APL_PH_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s.ph]));
const P3 = scene['p4-3'];
const sectionScene = W.APL_PH_GROUPS.flatMap((g) => g.scenes).find((s) => s.id === 'p4-3');
const js = (x) => JSON.stringify(x); // vm 안에서 만든 배열은 prototype 이 달라 deepEqual 대신 문자열로 비교

test('세 꼭짓점 56가지가 모두 정사각형·직사각형·정삼각형 중 하나이고 24·24·8가지', () => {
  assert.equal(CS.ALL.length, 56);
  const cnt = { square: 0, rect: 0, tri: 0 };
  for (const x of CS.ALL) {
    assert.ok(x.kind in cnt, `${x.tri.join('')}: 뜻밖의 모양 ${x.name}`);
    cnt[x.kind]++;
    assert.equal(x.crossings, 0, `${x.tri.join('')}: 평면이 모서리 가운데를 지남`);
    assert.ok(x.poly.length === 3 || x.poly.length === 4, `${x.tri.join('')}: 단면의 꼭짓점 수`);
    assert.ok(x.tri.every((L) => x.poly.includes(L)), `${x.tri.join('')}: 고른 점이 단면에 없음`);
  }
  assert.equal(js(cnt), js({ square: 24, rect: 24, tri: 8 }));
});

test('분류가 따로 센 좌표 기준과 같다 (한 면 위 · 한 꼭짓점에 이웃한 세 점 · 나머지)', () => {
  const d2 = (a, b) => CS.pos(a).reduce((s, v, i) => s + (v - CS.pos(b)[i]) ** 2, 0);
  for (const x of CS.ALL) {
    const t = x.tri;
    const sameFace = [0, 1, 2].some((ax) => t.every((L) => CS.pos(L)[ax] === CS.pos(t[0])[ax]));
    const neigh = CS.NAMES.split('').some((h) => t.every((L) => d2(h, L) === 4));
    const want = sameFace ? 'square' : neigh ? 'tri' : 'rect';
    assert.equal(x.kind, want, `${t.join('')}: ${x.name}`);
    assert.equal(!!x.sameFace, sameFace);
  }
});

test('넷째 점: 한 면 위면 그 면의 나머지 꼭짓점, 직사각형이면 평행한 모서리의 끝점, 정삼각형이면 없음', () => {
  for (const x of CS.ALL) {
    if (x.kind === 'tri') { assert.equal(x.fourth, null); assert.ok(x.hub, `${x.tri.join('')}: 이웃한 꼭짓점`); continue; }
    assert.ok(x.fourth && !x.tri.includes(x.fourth), `${x.tri.join('')}: 넷째 점`);
    if (x.kind === 'square') assert.equal(js(CS.lettersOnFace(x.face)), js([...x.tri, x.fourth].sort()));
    else {
      const [p, q] = x.par.edge, z = x.par.z, w = x.par.w, a = CS.pos(p), b = CS.pos(q), zz = CS.pos(z), ww = CS.pos(w);
      assert.equal(CS.relOf(p, q), 'edge');
      assert.equal(CS.relOf(z, w), 'edge', `${x.tri.join('')}: ${z}${w}는 모서리`);
      const e1 = a.map((v, i) => v - b[i]), e2 = zz.map((v, i) => v - ww[i]);
      assert.ok(e1.every((v, i) => v === e2[i] || v === -e2[i]), `${x.tri.join('')}: ${p}${q} ∥ ${z}${w}`);
      assert.equal(w, x.fourth);
    }
  }
});

test('선생님 문항: A·G·H 는 직사각형 ABGH (AB ∥ GH), B·D·E 는 정삼각형, A·B·C 는 정사각형', () => {
  const a = CS.sectionOf3('G', 'A', 'H');
  assert.equal(a.label, '직사각형 ABGH');
  assert.equal(a.fourth, 'B');
  assert.equal(js(a.par.edge), js(['G', 'H']));
  assert.equal(CS.sectionOf3('B', 'D', 'E').label, '정삼각형 BDE');
  assert.equal(CS.sectionOf3('A', 'B', 'C').label, '정사각형 ABCD');
});

test('문제 탭: 첫 문제는 A·G·H, 보기 5개 중 정답은 계산한 모양 하나뿐, 정리는 4단계', () => {
  const s = {};
  const lab = { tab: 'problem', scene: sectionScene, s };
  sectionScene.enter(s, lab);
  assert.equal(js(s.phQ.tri), js(['A', 'G', 'H']));
  for (let g = 0; g < 80; g++) {
    if (g) P3.reroll(s);
    // The public scene now distinguishes inquiry review from current-question
    // review. Enter the same tabs as the student before testing the question's
    // four steps; raw P3.steps(M) describes the independently selected inquiry.
    lab.tab = 'problem'; sectionScene.view(s, lab);
    lab.tab = 'review'; sectionScene.view(s, lab);
    const M = P3.model(s), Q = P3.prob(M, s), sec = CS.sectionOf3(...s.phQ.tri);
    const steps = sectionScene.steps(s);
    assert.equal(js(Q.choices.map((c) => c.h)), js(['정삼각형', '직각삼각형', '정사각형', '직사각형', '오각형']));
    assert.equal(Q.choices.filter((c) => c.ok).length, 1);
    assert.equal(Q.choices.find((c) => c.ok).h, sec.name);
    assert.ok(Q.stem.includes(`세 꼭짓점 ${s.phQ.tri.join(', ')}`));
    Q.choices.filter((c) => !c.ok).forEach((c) => assert.ok(c.hint, `${sec.label}: ${c.h} 힌트 없음`));
    assert.equal(steps.length, 4);
    assert.ok(steps[3].includes(sec.name));
    assert.ok(steps[1].includes(sec.tri.join('')), '2단계가 문제의 세 점 삼각형 이름을 씀');
  }
});

test('새 문제: 정사각형(한 면 위의 세 점)은 드물게, 직사각형·정삼각형 위주이고 같은 문제가 이어서 나오지 않는다', () => {
  const s = {};
  P3.init(s);
  const cnt = { square: 0, rect: 0, tri: 0 };
  let prev = s.phQ.tri.join('');
  for (let g = 0; g < 600; g++) {
    P3.reroll(s);
    const key = s.phQ.tri.join('');
    assert.notEqual(key, prev, '같은 문제가 이어짐');
    prev = key;
    cnt[CS.sectionOf3(...s.phQ.tri).kind]++;
  }
  assert.ok(cnt.rect > 150 && cnt.tri > 150, JSON.stringify(cnt));
  assert.ok(cnt.square < 0.2 * 600, JSON.stringify(cnt));
});

test('꼭짓점 단추: 세 개까지 고르고 네 번째를 누르면 가장 먼저 고른 점이 빠진다', () => {
  const s = {};
  P3.init(s);
  const chip = (L) => P3.presets(s).find((p) => p.label === L);
  s.phC3 = [];
  ['A', 'G', 'H', 'B'].forEach((L) => chip(L).apply(s));
  assert.equal(js(s.phC3), js(['G', 'H', 'B']));
  chip('H').apply(s);
  assert.equal(js(s.phC3), js(['G', 'B']));
  assert.equal(P3.model(s).sec, null);
  assert.equal(chip('G').on(s), true);
  assert.equal(chip('A').on(s), false);
});

const area = (ps) => { let a = [0, 0, 0]; ps.forEach((p, i) => { const q = ps[(i + 1) % ps.length]; a = [a[0] + p[1] * q[2] - p[2] * q[1], a[1] + p[2] * q[0] - p[0] * q[2], a[2] + p[0] * q[1] - p[1] * q[0]]; }); return Math.hypot(...a) / 2; };
const same = (p, q) => p.every((v, i) => Math.abs(v - q[i]) < 1e-9);

test('평면 넓히기: 0 이면 세 점을 이은 삼각형, 1 이면 단면, 그 사이는 점점 커진다 (56가지 모두)', () => {
  for (const x of CS.ALL) {
    const p0 = CS.patchAt(x, 0), p1 = CS.patchAt(x, 1), tri = x.tri.map(CS.pos);
    assert.ok(p1.every((p, i) => same(p, CS.pos(x.poly[i]))), `${x.tri.join('')}: 1 이면 단면의 꼭짓점`);
    // 0 이면 넓이가 세 점 삼각형의 넓이와 같고, 세 점이 모두 꼭짓점으로 남아 있다
    assert.ok(Math.abs(area(p0) - area(tri)) < 1e-9, `${x.tri.join('')}: 0 이면 삼각형의 넓이`);
    assert.ok(tri.every((p) => p0.some((q) => same(p, q))), `${x.tri.join('')}: 0 에서도 세 점이 꼭짓점`);
    let prev = area(p0);
    for (const t of [0.25, 0.5, 0.75, 1]) { const a = area(CS.patchAt(x, t)); assert.ok(a >= prev - 1e-9, `${x.tri.join('')}: 넓이가 줄어듦`); prev = a; }
    if (x.kind === 'tri') { assert.equal(js(CS.patchAt(x, 0)), js(CS.patchAt(x, 1)), '정삼각형은 넓혀도 그대로'); assert.ok(p0.length === 3); }
    else assert.ok(area(p1) > area(p0) + 1e-9, `${x.tri.join('')}: 넓히면 넓이가 늘어야 함`);
  }
  // 선생님 문항: 삼각형 AGH(직각삼각형, 직각은 H) → 직사각형 ABGH, 넓이 2배
  const a = CS.sectionOf3('A', 'G', 'H');
  assert.equal(CS.triName(a), '직각삼각형');
  assert.equal(CS.rightVertex(a), 'H');
  assert.ok(Math.abs(area(CS.patchAt(a, 1)) / area(CS.patchAt(a, 0)) - 2) < 1e-9);
  const b = CS.sectionOf3('B', 'D', 'E');
  assert.equal(CS.triName(b), '정삼각형');
  assert.equal(CS.rightVertex(b), null);
});

test('직각삼각형 보기의 힌트는 문제의 세 점 삼각형 이름을 쓰고 평면이 더 넓다고 알려 준다', () => {
  const s = {};
  P3.init(s);
  const hint = (tri) => { s.phQ = { tri }; return P3.prob(P3.model(s), s).choices.find((c) => c.h === '직각삼각형').hint; };
  assert.ok(hint(['A', 'G', 'H']).includes('AGH') && hint(['A', 'G', 'H']).includes('평면은 더 넓어요'));
  assert.ok(hint(['A', 'B', 'C']).includes('ABC') && hint(['A', 'B', 'C']).includes('평면은 더 넓어요'));
  assert.ok(hint(['B', 'D', 'E']).includes('BDE') && !hint(['B', 'D', 'E']).includes('더 넓어요'));
});

test('대표 단면: A·G·H 는 삼각형(0)에서 시작해 저절로 넓어지고, 나머지와 직접 고르기는 단면(1)부터', () => {
  const s = {};
  P3.init(s);
  assert.equal(s.phTe, 0);
  const chip = (L) => P3.presets(s).find((p) => p.label === L);
  chip('정삼각형 (B·D·E)').apply(s);
  assert.equal(s.phTe, 1); assert.ok(!s.playing);
  chip('직사각형 (A·G·H)').apply(s);
  assert.equal(s.phTe, 0); assert.ok(s.playing);
  s.phTe = 0; chip('C').apply(s);
  assert.equal(s.phTe, 1); assert.ok(!s.playing);
});

test('시점: 56가지 모두 최종 시점에서 단면의 투영 넓이 비율이 0.35 이상이고 꼭짓점이 서로 가깝지 않다', () => {
  let low = 1;
  for (const x of CS.ALL) {
    const v = CS.viewFor(x);
    assert.ok(v.ratio >= CS.MIN_RATIO, `${x.label}: 투영 넓이 비율 ${v.ratio.toFixed(2)}`);
    assert.ok(Math.abs(CS.viewRatio(x, v.yaw, v.pitch) - v.ratio) < 1e-9);
    assert.ok(CS.minSep(v.yaw, v.pitch) >= 0.4, `${x.label}: 꼭짓점 사이가 너무 가까움`);
    low = Math.min(low, v.ratio);
  }
  assert.ok(low >= CS.MIN_RATIO);
  // 기본 시점이 괜찮으면 그대로: 선생님 문항 3가지
  for (const t of [['A', 'G', 'H'], ['B', 'D', 'E'], ['A', 'B', 'C']]) {
    const v = CS.viewFor(CS.sectionOf3(...t));
    assert.equal(v.yaw, CS.DEFAULT_VIEW.yaw); assert.equal(v.pitch, CS.DEFAULT_VIEW.pitch);
  }
  // 기본 시점에서 선처럼 보이던 것(예: B·E·G, C·E·F, A·C·H)은 시점이 바뀐다
  for (const t of [['B', 'E', 'G'], ['C', 'E', 'F'], ['A', 'C', 'H']]) assert.ok(CS.viewFor(CS.sectionOf3(...t)).yaw !== CS.DEFAULT_VIEW.yaw, t.join(''));
});

test('시점 돌리기: 단면이 선이 되는 점을 고르면 부드럽게 돌아가고, 학생이 직접 돌린 뒤에는 자동으로 돌리지 않는다', () => {
  const s = { phYaw: -30, phPitch: 22 };
  P3.init(s);
  const lab = { tab: 'explore' };
  s.phC3 = ['B', 'E', 'G'];
  const want = CS.viewFor(CS.sectionOf3('B', 'E', 'G'));
  let n = 0;
  while (P3.viewTick(s, 0.05, lab) && n < 400) n++;
  assert.ok(n > 3 && n < 400, `부드럽게(여러 프레임) 도착: ${n}`);
  assert.ok(Math.abs(s.phYaw - want.yaw) < 0.1 && Math.abs(s.phPitch - want.pitch) < 0.1);
  // 학생이 직접 돌림 → 이후 점을 바꿔도 자동 회전 없음
  s.phYaw = 10;
  s.phC3 = ['C', 'E', 'F'];
  assert.equal(P3.viewTick(s, 0.05, lab), false);
  assert.equal(s.phYaw, 10);
  // 문제·정리 탭은 문제의 세 점 기준
  const s2 = { phYaw: -30, phPitch: 22 };
  P3.init(s2);
  s2.phQ = { tri: ['A', 'C', 'H'] };
  for (let i = 0; i < 400 && P3.viewTick(s2, 0.05, { tab: 'problem' }); i++);
  const w2 = CS.viewFor(CS.sectionOf3('A', 'C', 'H'));
  assert.ok(Math.abs(s2.phYaw - w2.yaw) < 0.1);
});

test('학생 화면 글(정리 풀이·힌트·읽는 값)에 제곱근 등 중1 밖 표현이 없다', () => {
  const s = {};
  P3.init(s);
  const bad = /√|sqrt|제곱근|법선|벡터|\\\\sqrt/;
  for (const x of CS.ALL) {
    s.phQ = { tri: x.tri };
    s.phC3 = x.tri;
    const M = P3.model(s), Q = P3.prob(M, s), v = P3.view(M);
    const texts = [...P3.steps(M), Q.stem, ...Q.choices.map((c) => c.hint), v.guide, v.rule, v.formula, v.notes, ...v.readouts.map((r) => `${r.label}${r.value}${r.note || ''}`)];
    texts.forEach((t) => assert.ok(!bad.test(t), `${x.tri.join('')}: ${t.slice(0, 60)}`));
  }
});
