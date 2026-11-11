// Independent identities, signs and root counts against the actual HTML data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/derivative-shape-lesson-runtime.mjs';
const lab = await load(), S = lab.api;
const close = (a, b, eps = 1e-7) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), `${a} != ${b}`);
const D = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
const xs = [-3, -1, -.5, 0, .5, 1, 1.5, 2, 3, 5];

test('cubic: simple roots reverse the sign; the double root does not; primitive difference is four', () => {
  const v = S.first('cubic');
  for (const x of xs) { close(v.f1p(x), 3 * x * (x - 2)); close(D(v.f1, x), v.f1p(x)); close(D(v.f2, x), 3 * (x - 1) ** 2); }
  assert.deepEqual([-1, 1, 3].map(x => Math.sign(v.f1p(x))), [1, -1, 1]);
  assert.deepEqual([0, 1, 2].map(x => Math.sign(v.f2p(x))), [1, 0, 1]);
  close(v.f1(0) - v.f1(2), 4);
  for (const C of [-1, 0, 1]) {
    const state = { ...S.initial('cubic'), delta: 1, C };
    close(S.evalTop(1, state, 0) - S.evalTop(1, state, 2), 4);
    for (const x of xs) close(S.evalBottom(1, state, x), v.f1p(x));
  }
  for (const x of xs) assert.ok(S.evalBottom(1, { delta: -.4 }, x) >= 1.2 - 1e-12);
});

test('quartic: exact endpoint roots remove the positive-to-negative crossing only at the endpoint', () => {
  const v = S.first('quartic');
  assert.deepEqual([-2, 0, 2, 4].map(x => Math.sign(v.f(1)(x))), [-1, 1, -1, 1]);
  assert.deepEqual([-2, 0, 4].map(x => Math.sign(v.f(-1)(x))), [-1, -1, 1]);
  assert.deepEqual([-2, 0, 4].map(x => Math.sign(v.f(3)(x))), [-1, 1, 1]);
  for (const lam of [0, .00001, .005, .05, .5, .99999, 1]) {
    const state = { ...S.initial('quartic'), lam, C2: 0 }, gamma = -1 + 4 * lam;
    assert.equal(S.quarticCase(state), lam === 0 ? 'left' : lam === 1 ? 'right' : 'three');
    for (const x of xs) { close(S.evalBottom(2, state, x), .8 * (x + 1) * (x - gamma) * (x - 3)); close(D(z => S.evalTop(2, state, z), x), S.evalBottom(2, state, x), 2e-6); }
    if (lam > 0 && lam < 1) assert.ok(S.evalBottom(2, state, (-1 + gamma) / 2) > 0);
  }
});

test('roots: source C and the exploration C differ by two, and both boundary factorizations hold', () => {
  const v = S.first('roots');
  for (const x of xs) {
    close(v.F(x), x ** 3 - 3 * x ** 2);
    close(D(v.F, x), 3 * x * (x - 2));
    close(v.F(x), x * x * (x - 3)); close(v.F(x) + 4, (x + 1) * (x - 2) ** 2);
    close(S.evalTop(3, { delta: 1, C: 0 }, x), v.F(x) + 2);
  }
  close(v.M, 0); close(v.m, -4);
  for (const C of [-1, 0, 2, 4, 5]) assert.equal(S.roots12([...v.co, 0], -C).n, C > 0 && C < 4 ? 3 : C === 0 || C === 4 ? 2 : 1);
  for (const delta of [0, -.4]) {
    const state = { delta, C: 0 };
    assert.ok(xs.every(x => S.evalBottom(3, state, x) >= 0));
    close(S.evalTop(3, state, 1), 0);
    assert.ok(S.evalTop(3, state, -10) < 0 && S.evalTop(3, state, 10) > 0);
  }
});

test('difference: the tangent level is minus three and a double stationary point is not an extremum', () => {
  const v = S.first('difference');
  for (const x of xs) { close(v.fp(x), 3 * (x - 1) ** 2 - 3); close(v.fp(x) + 3, 3 * (x - 1) ** 2); }
  close(v.fp(1), -3);
  assert.deepEqual([0, 1, 2].map(x => Math.sign(v.fp(x) + 3)), [1, 0, 1]);
  for (const k of [-4, -3, 0]) for (const x of xs) close(D(z => S.evalTop(4, { k }, z), x), v.fp(x) - k);
  assert.ok(xs.every(x => v.fp(x) + 4 >= 1));
  assert.deepEqual([-1, 1, 3].map(x => Math.sign(v.fp(x))), [1, -1, 1]);
});

test('integral: both lower limits give zero minimum and changing the lower limit adds a constant', () => {
  const v = S.first('integral'), F = x => x ** 3 - 3 * x ** 2;
  for (const x of xs) { close(v.g(x), (x + 1) * (x - 2) ** 2); close(D(v.g, x), v.fp(x)); }
  for (const a of [-1, 2]) { close(F(2) - F(a), 0); close(a ** 3 - 3 * a ** 2 + 4, 0); }
  assert.notEqual(F(2) - F(0), 0);
  for (const a of [-.5, .7]) { const s = { delta: 1, a }; close(S.evalTop(5, s, a), 0); for (const x of xs) close(S.evalTop(5, s, x), F(x) - F(a)); }
  for (const x of xs) close(S.evalTop(5, { delta: 1, a: .7 }, x) - S.evalTop(5, { delta: 1, a: -.5 }, x), F(-.5) - F(.7));
});

test('always: the difference has a global minimum of two on x>=0 with a strict counterexample above two', () => {
  const v = S.first('always');
  assert.equal(v.fam.dom, 'ge0'); assert.equal(v.ask, 'amax');
  for (const x of [0, .1, .9, 1, 1.1, 2, 10]) {
    close(v.h(x), v.f(x) - v.g(x)); close(v.h(x) - 2, (x - 1) ** 2 * (x + 2));
    assert.ok(v.h(x) >= 2 - 1e-10); close(S.h10(x), v.h(x));
  }
  close(v.h(0), 4); close(v.h(1), 2);
  assert.ok(v.f(1) < v.g(1) + 2.8);
  assert.ok(v.h(-3) < 2, 'the domain restriction is essential and cannot be silently dropped');
});

test('rootcount: independent positive branches, contact multiplicities, and integer enumeration agree', () => {
  const v = S.first('rootcount');
  const f = x => x ** 3 - 3 * x ** 2;
  // Independently count the monotone positive intervals (0,2) and (2,infinity),
  // plus the shared contact at x=2; x=0 is explicitly excluded.
  const positives = k => k < -4 ? 0 : k === -4 ? 1 : k < 0 ? 2 : 1;
  const distinct = k => k < -4 || k > 0 ? 1 : k === -4 || k === 0 ? 2 : 3;
  assert.deepEqual(Array.from(v.co), [1, -3, 0, 0]);
  for (const x of xs) close(v.f(x), f(x));
  for (const k of [-5, -4, -3, -2, -1, 0, 1]) {
    const r = S.roots12(v.co, k);
    assert.equal(r.pos, positives(k)); assert.equal(r.n, distinct(k));
    for (const x of r.list) close(f(x), k, 2e-7);
    assert.equal(r.zero, k === 0 ? 1 : 0);
    assert.equal(S.COND12.pos1.ok(r), k === -4 || k >= 0);
    assert.equal(S.COND12.real2.ok(r), k === -4 || k === 0);
  }
  const ints = Array.from({ length: 11 }, (_, i) => i - 6).filter(k => positives(k) === 2);
  assert.deepEqual(ints, [-3, -2, -1]); assert.equal(ints.length, v.ans);
  assert.deepEqual(Array.from(S.roots12(v.co, 0).list), [0, 3]);
  const lower = Array.from(S.roots12(v.co, -4).list); close(lower[0], -1); close(lower[1], 2);
});
