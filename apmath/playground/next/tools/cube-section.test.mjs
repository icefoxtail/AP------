// AP Math Lab 2.0 · 다면체 실험실 「세 꼭짓점을 지나는 단면」(p4-3) 검사 (브라우저 없이 수 초)
// 실행: node --test apmath/playground/next/tools/cube-section.test.mjs
// 확인하는 것 (개수가 아니라 결함 조건):
//  1) 정육면체의 서로 다른 세 꼭짓점 56가지 모두 단면이 정사각형·직사각형·정삼각형 중 하나이고,
//     좌표로 따로 센 기준(한 면 위 · 한 꼭짓점에 이웃한 세 점 · 나머지)과 같다. 단면의 꼭짓점은 정육면체의 꼭짓점뿐(모서리 가운데를 지나지 않음).
//  2) 넷째 점은 평행한 모서리/같은 면으로 직접 구한 값과 같고, 선생님 문항(A·G·H)은 직사각형 ABGH.
//  3) 문제 탭: 첫 문제는 A·G·H, 정답 보기는 정확히 하나이고 계산한 모양과 같으며, 「새 문제」는 정사각형을 드물게 뽑는다. 정리 풀이는 3단계.
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

test('문제 탭: 첫 문제는 A·G·H, 보기 5개 중 정답은 계산한 모양 하나뿐, 정리는 3단계', () => {
  const s = {};
  P3.init(s);
  assert.equal(js(s.phQ.tri), js(['A', 'G', 'H']));
  for (let g = 0; g < 80; g++) {
    if (g) P3.reroll(s);
    const M = P3.model(s), Q = P3.prob(M, s), sec = CS.sectionOf3(...s.phQ.tri);
    assert.equal(js(Q.choices.map((c) => c.h)), js(['정삼각형', '직각삼각형', '정사각형', '직사각형', '오각형']));
    assert.equal(Q.choices.filter((c) => c.ok).length, 1);
    assert.equal(Q.choices.find((c) => c.ok).h, sec.name);
    assert.ok(Q.stem.includes(`세 꼭짓점 ${s.phQ.tri.join(', ')}`));
    Q.choices.filter((c) => !c.ok).forEach((c) => assert.ok(c.hint, `${sec.label}: ${c.h} 힌트 없음`));
    assert.equal(P3.steps(M).length, 3);
    assert.ok(P3.steps(M)[2].includes(sec.name));
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
