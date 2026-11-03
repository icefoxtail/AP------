// AP Math Lab 2.0 · 다면체 실험실 ④탭 「면의 중심을 이으면?」(p4-4) 검사 (브라우저 없이 수 초)
// 실행: node --test apmath/playground/next/tools/polyhedra-dual.test.mjs
// 확인하는 것 (개수가 아니라 결함 조건):
//  1) 정다면체 5종 모두, 각 면의 중심을 꼭짓점으로 하는 입체를 좌표로 만들어 꼭짓점·면·모서리 수를 센다.
//     꼭짓점 = 원래 면의 수, 면 = 원래 꼭짓점의 수, 모서리 = 원래 모서리의 수 (오일러 V−E+F=2도 맞아야 함).
//  2) 새 입체의 모서리는 「이웃한 면 둘」의 중심을 이은 선분과 정확히 같고, 모든 모서리의 길이가 같으며
//     모든 면이 같은 정다각형, 모든 꼭짓점에 모이는 면의 수가 같다 → 정다면체. 장면이 고른 이름도 이 계산과 같다.
//  3) 문제: 어떤 입체·질문이 나와도 정답이 하나뿐이고, 정답은 좌표 계산 값과 같다. 보기는 서로 달라야 하며 오답에는 힌트가 있다.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(NEXT, 'labs/g7-polyhedra');
function load() {
  const noop = () => {};
  const el = () => ({ style: {}, dataset: {}, append: noop, remove: noop, addEventListener: noop, setAttribute: noop });
  const document = { documentElement: el(), head: el(), body: el(), getElementById: () => null, createElement: el, addEventListener: noop };
  const window = { document };
  const ctx = vm.createContext({ window, document, console, Math, Date, Set, Map, Array, Object, JSON, String, Number, Symbol, Promise });
  for (const f of ['core', 'geo', 'cubesec', 't4']) vm.runInContext(fs.readFileSync(path.join(DIR, f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  return window;
}
const W = load();
const G = W.APL_PH;
const scene = W.APL_PH_GROUPS.flatMap((g) => g.scenes).find((s) => s.id === 'p4-4');
const KEYS = G.PLAT_KEYS;

// 장면 코드와 따로, 좌표에서 직접 구한 값
function dualByCoords(key) {
  const V = G.platV(key);
  const orig = G.solidOf(V);                                   // 원래 입체(볼록 껍질)
  const centers = orig.F.map((f) => G.cen3(f.i.map((i) => V[i]))); // 면마다 중심 하나
  const T = G.solidOf(centers);
  const dist = (a, b) => G.len3(G.sub3(a, b));
  const lens = T.E.map((e) => dist(T.V[e.a], T.V[e.b]));
  const adj = new Set(orig.E.map((e) => [e.f[0], e.f[1]].sort((a, b) => a - b).join('-')));
  const edgesByCenters = new Set(T.E.map((e) => [e.a, e.b].sort((a, b) => a - b).join('-')));
  const radius = T.V.map((p) => G.len3(p));
  return { orig, T, centers, lens, adj, edgesByCenters, radius };
}
const cnt = (S) => ({ V: S.V.length, F: S.F.length, E: S.E.length });

test('다섯 정다면체: 면의 중심을 이은 입체의 꼭짓점·면·모서리 수와 정다면체 판정(좌표 계산)', () => {
  assert.equal(KEYS.length, 5);
  const names = new Set();
  for (const key of KEYS) {
    const { orig, T, centers, lens, adj, edgesByCenters, radius } = dualByCoords(key);
    const o = cnt(orig), n = cnt(T);
    assert.equal(centers.length, o.F, `${key}: 면마다 점 하나`);
    assert.equal(n.V, o.F, `${key}: 새 꼭짓점 = 원래 면`);
    assert.equal(n.F, o.V, `${key}: 새 면 = 원래 꼭짓점`);
    assert.equal(n.E, o.E, `${key}: 새 모서리 = 원래 모서리`);
    assert.equal(n.V - n.E + n.F, 2, `${key}: 오일러`);
    // 이웃한 면 둘마다 선분 하나: 껍질의 모서리 = 이웃한 면 쌍
    assert.deepEqual([...edgesByCenters].sort(), [...adj].sort(), `${key}: 새 모서리 = 이웃한 면의 중심끼리`);
    // 정다면체: 모든 모서리 길이 같음, 모든 면이 같은 변의 수, 꼭짓점마다 모이는 면의 수 같음, 모든 꼭짓점이 한 구 위에 있음
    assert.ok(lens.every((x) => Math.abs(x - lens[0]) < 1e-6 * lens[0]), `${key}: 모서리 길이가 모두 같아야 함`);
    assert.ok(T.F.every((f) => f.i.length === T.F[0].i.length), `${key}: 면의 변의 수가 같아야 함`);
    assert.ok(T.vf.every((l) => l.length === T.vf[0].length), `${key}: 꼭짓점마다 모이는 면의 수가 같아야 함`);
    assert.ok(radius.every((r) => Math.abs(r - radius[0]) < 1e-6 * radius[0]), `${key}: 꼭짓점이 한 구 위`);
    // 새 입체 안쪽: 모든 꼭짓점이 원래 입체 안(모든 면의 안쪽)에 있어야 함
    assert.ok(T.V.every((p) => orig.F.every((f) => G.dot3(f.n, G.sub3(p, f.c)) < 1e-9)), `${key}: 새 입체가 원래 입체 안에 들어 있어야 함`);
    // 장면이 계산한 값과 같음
    const X = G.dualOf(key);
    assert.deepEqual({ ...X.cnt }, { V: n.V, F: n.F, E: n.E }, `${key}: 장면 개수`);
    assert.ok(X.regular, `${key}: 장면의 정다면체 판정`);
    assert.ok(X.key && KEYS.includes(X.key), `${key}: 장면이 찾은 이름`);
    // 이름은 정다면체 5가지 중 꼭짓점·면·모서리 수가 모두 맞는 것 하나뿐
    const hits = KEYS.filter((q) => G.PLAT[q].V === n.V && G.PLAT[q].F === n.F && G.PLAT[q].E === n.E);
    assert.deepEqual([...hits], [X.key], `${key}: 이름이 하나로 정해져야 함`);
    names.add(`${key}->${X.key}`);
  }
  // 짝: 사면체↔사면체, 육면체↔팔면체, 십이면체↔이십면체
  assert.equal(G.dualOf('tetra').key, 'tetra');
  assert.equal(G.dualOf('cube').key, 'octa');
  assert.equal(G.dualOf('octa').key, 'cube');
  assert.equal(G.dualOf('dodeca').key, 'icosa');
  assert.equal(G.dualOf('icosa').key, 'dodeca');
  assert.equal(names.size, 5);
});

test('장면: 탐구 막대·단추·읽는 값·정리 3단계에 빈 글이 없다', () => {
  assert.ok(scene, 'p4-4 장면이 있어야 함');
  const D = scene.ph;
  const s = { phYaw: -30, phPitch: 24 };
  D.init(s);
  assert.equal(D.presets(s).length, KEYS.length, '입체 고르기 단추 5개');
  for (const key of KEYS) {
    s.phSel7 = key; s.phQ = { k: key, ask: 'shape' };
    const M = D.model(s), v = D.view(M, { tab: 'explore' }, s), st = D.steps(M);
    assert.equal(st.length, 3);
    assert.ok(st.every((x) => typeof x === 'string' && x.length > 20 && !/undefined|NaN|null/.test(x)), `${key}: 정리 글`);
    assert.ok(v.readouts.every((r) => String(r.value).length && !/undefined|NaN/.test(JSON.stringify(r))), `${key}: 읽는 값`);
    const X = G.dualOf(key), I = G.PLAT[key];
    const wide = v.readouts.find((r) => r.wide).value;
    assert.ok(wide.includes(`면 ${I.F}`) && wide.includes(`꼭짓점 ${X.cnt.V}`) && wide.includes(X.name), `${key}: 면과 꼭짓점이 바뀐 줄 ${wide}`);
    // 쌍대 같은 어려운 말, 점 이름 표기, 루트·소수 금지
    const all = JSON.stringify([v, st]);
    assert.ok(!/쌍대|√|\\sqrt|\d\.\d/.test(all), `${key}: 어려운 말·√·소수 금지`);
  }
});

test('문제: 모든 입체·질문에서 정답이 하나뿐이고 좌표 계산과 같다 (새 문제 반복)', () => {
  const D = scene.ph;
  const asks = ['shape', 'V', 'F', 'E'];
  const seen = new Set();
  const check = (Q) => {
    const s = { phQ: Q };
    const P = D.prob(D.model(s), s);
    const ok = P.choices.filter((c) => c.ok);
    assert.equal(P.choices.length, 5, `${Q.k}/${Q.ask}: 보기 5개`);
    assert.equal(ok.length, 1, `${Q.k}/${Q.ask}: 정답 하나`);
    assert.equal(new Set(P.choices.map((c) => c.h)).size, 5, `${Q.k}/${Q.ask}: 보기가 서로 달라야 함`);
    P.choices.filter((c) => !c.ok).forEach((c) => assert.ok(c.hint && c.hint.length > 5, `${Q.k}/${Q.ask}: 오답 힌트 ${c.h}`));
    const { T, orig } = dualByCoords(Q.k);
    if (Q.ask === 'shape') {
      assert.deepEqual(P.choices.map((c) => c.h), KEYS.map((q) => G.PLAT[q].name), '보기는 정다면체 다섯 가지');
      const want = KEYS.filter((q) => G.PLAT[q].V === T.V.length && G.PLAT[q].F === T.F.length && G.PLAT[q].E === T.E.length);
      assert.equal(want.length, 1);
      assert.equal(ok[0].h, G.PLAT[want[0]].name, `${Q.k}: 정답 이름`);
      assert.ok(P.stem.includes(G.PLAT[Q.k].name) && P.stem.includes('각 면의 중심'));
    } else {
      const want = { V: T.V.length, F: T.F.length, E: T.E.length }[Q.ask];
      assert.equal(ok[0].h, want + '개', `${Q.k}/${Q.ask}: 정답 수`);
      assert.equal(want, { V: orig.F.length, F: orig.V.length, E: orig.E.length }[Q.ask]);
    }
    seen.add(`${Q.k}|${Q.ask}`);
  };
  for (const k of KEYS) for (const ask of asks) check({ k, ask });
  assert.equal(seen.size, 20);
  // 「숫자 바꾸기」로 나오는 문제도 같은 조건을 만족하고, 다섯 입체가 모두 나온다
  const s = { phQ: { k: 'cube', ask: 'shape' } }, ks = new Set();
  for (let i = 0; i < 400; i++) { D.reroll(s); assert.ok(KEYS.includes(s.phQ.k) && asks.includes(s.phQ.ask)); ks.add(s.phQ.k); check(s.phQ); }
  assert.equal(ks.size, 5, '새 문제에 다섯 입체가 모두 나와야 함');
  // 처음 문제는 선생님 문항: 정육면체의 각 면의 중심을 꼭짓점으로 하는 입체도형은?
  const s0 = {}; D.init(s0);
  const P0 = D.prob(D.model(s0), s0);
  assert.equal(P0.stem, '정육면체의 각 면의 중심을 꼭짓점으로 하는 입체도형은?');
  assert.equal(P0.choices.find((c) => c.ok).h, '정팔면체');
});
