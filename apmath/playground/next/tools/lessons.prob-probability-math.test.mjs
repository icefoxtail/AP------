// Exact, independent enumeration of the original probability conditions.
// Expected results do not use the production transition, counting, fraction,
// binomial, simulator or condition-predicate functions. These are math checks;
// browser/mobile/independent visual review is not performed by this file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/probability-lesson-runtime.mjs';

const { api } = await load({ sourceOnly: true });

function fraction(n, d) {
  assert.ok(Number.isSafeInteger(n) && Number.isSafeInteger(d) && d > 0);
  let a = Math.abs(n), b = d;
  while (b) [a, b] = [b, a % b];
  return [n / a, d / a];
}
function plus([a, b], [c, d]) { return fraction(a * d + c * b, b * d); }
function divide([a, b], [c, d]) { assert.ok(c > 0); return fraction(a * d, b * c); }
function assertFraction(actual, n, d) { assert.deepEqual([actual.n, actual.d], fraction(n, d)); }
function entries(row) { return Array.from(row, ([k, v]) => [k, v]).sort((a, b) => a[0] - b[0]); }

// Decode every integer as a word of equally likely, labelled choices. This
// enumerates actual die faces / actual coin numbers, not aggregated branches.
function* words(K, length) {
  for (let code = 0; code < K ** length; code++) {
    let value = code;
    const word = new Array(length);
    for (let i = 0; i < length; i++) { word[i] = value % K + 1; value = Math.floor(value / K); }
    yield word;
  }
}
function exhaustive(K, n, trial) {
  const rows = Array.from({ length: n + 1 }, () => new Map());
  let given = 0, target = 0, total = 0;
  for (const faces of words(K, n)) {
    const result = trial(faces);
    assert.equal(result.states.length, n + 1);
    result.states.forEach((state, t) => rows[t].set(state, (rows[t].get(state) || 0) + 1));
    total++;
    if (result.given) { given++; if (result.hit) target++; }
  }
  // Each prefix occurs once for every possible suffix in the complete words.
  rows.forEach((row, t) => {
    for (const [state, count] of row) {
      const prefixCount = count / K ** (n - t);
      assert.ok(Number.isSafeInteger(prefixCount));
      row.set(state, prefixCount);
    }
  });
  return { total, given, target, rows };
}
function assertMachine(M, exact) {
  assert.equal(M.total, exact.total);
  assert.equal(M.givN, exact.given);
  assert.equal(M.tgtN, exact.target);
  assert.equal(M.noGiven, exact.given === 0);
  assert.equal(M.cnt.length, exact.rows.length);
  exact.rows.forEach((row, t) => assert.deepEqual(entries(M.cnt[t]), entries(row), `prefix counts at t=${t}`));
  if (exact.given) assertFraction(M.P, exact.target, exact.given);
  // With no given paths, M.P is only an internal sentinel, not probability 0.
}

const pairs = Array.from(words(6, 2));
const predicates = {
  sum7le: (a, b) => a + b <= 7,
  sum9ge: (a, b) => a + b >= 9,
  sum7: (a, b) => a + b === 7,
  sumEven: (a, b) => (a + b) % 2 === 0,
  prod4: (a, b) => a * b % 4 === 0,
  prodOdd: (a, b) => a % 2 === 1 && b % 2 === 1,
  diff1: (a, b) => Math.abs(a - b) === 1,
  diff2: (a, b) => Math.abs(a - b) === 2,
  same: (a, b) => a === b,
  aLtB: (a, b) => a < b
};
const select = predicate => pairs.filter(([a, b]) => predicate(a, b));

test('grid: every original event is counted in the 36 ordered, equiprobable pairs', () => {
  assert.deepEqual(Array.from(api.variants.conditions).sort(), Object.keys(predicates).sort());
  for (const [id, predicate] of Object.entries(predicates)) {
    const exact = select(predicate).length;
    const v = api.math.mkGrid({ kind: 'one', A: id });
    assert.equal(v.n, exact, id);
    assertFraction(v.f, exact, 36);
  }
});

test('grid first: both orientations of a difference of two give 8/36 = 2/9', () => {
  const v = api.first('grid'), outcomes = select((a, b) => Math.abs(a - b) === 2);
  assert.equal(v.A, 'diff2');
  assert.equal(outcomes.length, 8);
  assert.equal(outcomes.filter(([a, b]) => b === a + 2).length, 4);
  assert.equal(outcomes.filter(([a, b]) => a === b + 2).length, 4);
  assert.equal(v.n, outcomes.length);
  assertFraction(v.f, 8, 36);
});

test('grid union: the lesson column counts yield A=21, B=15, intersection=7, union=29', () => {
  const v = api.first('grid', 'union');
  assert.equal(v.A, 'sum7le'); assert.equal(v.B, 'prod4');
  const A = predicates.sum7le, B = predicates.prod4;
  const columns = predicate => Array.from({ length: 6 }, (_, i) => select((a, b) => a === i + 1 && predicate(a, b)).length);
  assert.deepEqual(columns(A), [6, 5, 4, 3, 2, 1]);
  assert.deepEqual(columns(B), [1, 3, 1, 6, 1, 3]);
  assert.deepEqual(columns((a, b) => A(a, b) && B(a, b)), [1, 2, 1, 3, 0, 0]);
  const counts = [select(A).length, select(B).length, select((a, b) => A(a, b) && B(a, b)).length, select((a, b) => A(a, b) || B(a, b)).length];
  assert.deepEqual(counts, [21, 15, 7, 29]);
  assert.deepEqual([v.c.nA, v.c.nB, v.c.nI, v.n], counts);
  assertFraction(v.f, 29, 36);
  assert.deepEqual(fraction(counts[2], 36), [7, 36]);
});

test('grid complement: at least one even die is the complement of two odd dice', () => {
  const v = api.first('grid', 'complement');
  const odd = select(predicates.prodOdd), complement = select((a, b) => a % 2 === 0 || b % 2 === 0);
  assert.equal(v.A, 'prodOdd');
  assert.equal(odd.length, 9); assert.equal(complement.length, 27);
  assert.equal(v.n, complement.length);
  assertFraction(v.f, 27, 36);
});

test('grid symmetry: diagonal cells are counted once, while a<b is not symmetric', () => {
  const symmetric = api.first('grid', 'symmetric'), asymmetric = api.first('grid', 'asymmetric');
  const upper = select((a, b) => a < b && a + b <= 7), diagonal = select((a, b) => a === b && a + b <= 7);
  assert.equal(upper.length, 9); assert.equal(diagonal.length, 3);
  assert.equal(symmetric.n, 2 * upper.length + diagonal.length);
  for (const [a, b] of select(predicates.sum7le)) assert.ok(predicates.sum7le(b, a));
  const strict = select(predicates.aLtB);
  assert.equal(strict.length, 15);
  assert.ok(strict.every(([a, b]) => !predicates.aLtB(b, a)));
  assert.equal(asymmetric.n, strict.length);
});

test('grid disjoint: sum 7 and equal dice have no common ordered pair', () => {
  const v = api.first('grid', 'disjoint');
  const intersection = select((a, b) => a + b === 7 && a === b);
  const union = select((a, b) => a + b === 7 || a === b);
  assert.equal(intersection.length, 0); assert.equal(union.length, 12);
  assert.equal(v.c.nI, 0); assert.equal(v.n, union.length);
  assertFraction(v.f, 12, 36);
});

// Each physical pair in the chosen bag has mass 1/(6 * number of pairs in
// that bag). This remains correct when the two bags have different sizes.
function bayesByPhysicalPairs(k, X, Y) {
  const cells = Array.from({ length: 4 }, () => [0, 1]);
  for (let face = 1; face <= 6; face++) {
    const isX = face >= k, [white, black] = isX ? X : Y;
    const physicalPairs = [];
    for (let i = 0; i < white + black; i++) for (let j = i + 1; j < white + black; j++) physicalPairs.push([i, j]);
    for (const [i, j] of physicalPairs) {
      const twoWhite = i < white && j < white;
      const cell = (twoWhite ? 0 : 2) + (isX ? 0 : 1);
      cells[cell] = plus(cells[cell], fraction(1, 6 * physicalPairs.length));
    }
  }
  assert.deepEqual(cells.reduce(plus, [0, 1]), [1, 1]);
  return { cells, posterior: divide(cells[0], plus(cells[0], cells[1])) };
}
function assertBayes(v, expected) {
  const exact = bayesByPhysicalPairs(v.k, v.X, v.Y);
  exact.cells.forEach((mass, i) => assert.deepEqual(fraction(v.tb[i], v.N), mass));
  assert.deepEqual([v.f.n, v.f.d], exact.posterior);
  assert.deepEqual(exact.posterior, expected);
}

test('conditional first: weighted dice and physical ball pairs give P(X|two white)=3/5', () => {
  const v = api.first('cond');
  assert.equal(v.k, 5); assert.deepEqual(Array.from(v.X), [3, 3]); assert.deepEqual(Array.from(v.Y), [2, 4]);
  assert.equal(v.N, 90); assert.deepEqual(Array.from(v.tb), [6, 4, 24, 56]);
  assertBayes(v, [3, 5]);
});

test('conditional Bayes variant: unequal bag sizes require unequal pair weights', () => {
  const v = api.math.mkBayes(4, [2, 3], [3, 3]);
  assertBayes(v, [1, 3]);
  assert.equal(v.N, 180); assert.deepEqual(Array.from(v.tb), [9, 18, 81, 72]);
});

function tableMembers(tb) {
  return tb.flatMap((count, cell) => Array.from({ length: count }, (_, i) => ({ id: `${cell}:${i}`, A: cell < 2, B: cell % 2 === 0 })));
}
for (const [key, cond, denominator, expected] of [['tableB', 'B', 11, [6, 11]], ['tableA', 'A', 10, [3, 5]]]) {
  test(`conditional ${key}: the condition selects ${denominator} people, not all 22`, () => {
    const v = api.first('cond', key), people = tableMembers(Array.from(v.tb));
    assert.equal(v.cond, cond); assert.equal(people.length, 22);
    const given = people.filter(p => p[cond]), intersection = given.filter(p => p.A && p.B);
    assert.equal(given.length, denominator); assert.equal(intersection.length, 6);
    assertFraction(v.f, intersection.length, given.length);
    assert.deepEqual([v.f.n, v.f.d], expected);
  });
}

test('conditional exploration: reversing A|B to B|A changes the denominator', () => {
  const tb = [6, 6, 3, 5], people = tableMembers(tb), st = api.math.tbStats(tb);
  const A = people.filter(p => p.A), B = people.filter(p => p.B), both = people.filter(p => p.A && p.B);
  assert.deepEqual([st.N, st.nA, st.nB, st.n11], [20, A.length, B.length, both.length]);
  assert.deepEqual(fraction(both.length, B.length), [2, 3]);
  assert.deepEqual(fraction(both.length, A.length), [1, 2]);
});

test('conditional exploration: positive-probability disjoint events are not independent', () => {
  for (const [tb, independent] of [[[4, 6, 4, 6], true], [[0, 10, 10, 0], false]]) {
    const people = tableMembers(tb), N = people.length;
    const A = people.filter(p => p.A).length, B = people.filter(p => p.B).length, both = people.filter(p => p.A && p.B).length;
    const exact = fraction(both, N), product = fraction(A * B, N * N);
    assert.equal(exact[0] === product[0] && exact[1] === product[1], independent);
    assert.equal(api.math.tbStats(tb).indep, independent);
    assert.ok(A > 0 && B > 0);
  }
});

test('conditional zero-probability condition has no denominator, even if events are independent', () => {
  const tb = [0, 0, 8, 12], people = tableMembers(tb), st = api.math.tbStats(tb);
  assert.equal(people.filter(p => p.A).length, 0);
  assert.equal(st.nA, 0); assert.equal(st.n11, 0);
  // A is impossible, so P(A∩B)=P(A)P(B)=0; P(B|A) is still undefined.
  assert.equal(st.indep, true);
  assert.throws(() => fraction(st.n11, st.nA));
});

function walkTrial(cfg, faces) {
  let position = 0;
  const states = [position];
  for (const face of faces) { position += cfg.move.includes(face) ? 1 : cfg.other === 'back' ? -1 : 0; states.push(position); }
  return { states, given: true, hit: position >= cfg.thr };
}
test('walk first: the final positions 3 and 4 have 324 and 81 labelled sequences', () => {
  const v = api.first('rep-walk'), exact = exhaustive(6, v.cfg.n, faces => walkTrial(v.cfg, faces));
  assert.deepEqual(Array.from(v.cfg.move), [2, 4, 6]); assert.equal(v.cfg.other, 'stay');
  assert.equal(v.cfg.n, 4); assert.equal(v.cfg.thr, 3);
  assertMachine(v.M, exact);
  assert.equal(exact.rows[2].get(1), 18);
  assert.equal(exact.rows[4].get(2), 486);
  assert.deepEqual(fraction(exact.rows[4].get(2), exact.total), [3, 8]);
  assert.equal(exact.rows[4].get(3), 324); assert.equal(exact.rows[4].get(4), 81);
  assert.equal(exact.target, 405); assertFraction(v.M.P, 5, 16);
});
test('walk back: final position, rather than an intermediate visit, defines the event', () => {
  const v = api.first('rep-walk', 'back'), exact = exhaustive(6, v.cfg.n, faces => walkTrial(v.cfg, faces));
  assert.deepEqual(Array.from(v.cfg.move), [5, 6]); assert.equal(v.cfg.other, 'back');
  assertMachine(v.M, exact);
  assert.equal(exact.rows[4].get(2), 128); assert.equal(exact.rows[4].get(4), 16);
  assert.equal(exact.target, 144); assertFraction(v.M.P, 1, 9);
  const faces = [5, 6, 1, 2], trace = walkTrial(v.cfg, faces);
  assert.deepEqual(trace.states, [0, 1, 2, 1, 0]); assert.equal(trace.hit, false);
  assert.deepEqual(Array.from(api.math.traceFaces(v.M, faces).path), trace.states);
});

function ballTrial(cfg, faces) {
  let white = 0, black = 0, whiteTurns = 0, visited = false;
  const states = [0];
  for (const face of faces) {
    if (face >= cfg.th) { white += cfg.wAdd; whiteTurns++; }
    else black += cfg.bAdd;
    states.push(whiteTurns);
    if (white === black) visited = true; // Only after a positive number of trials.
  }
  return { states, given: white + black >= cfg.T, hit: visited };
}
for (const [index, tuple] of Array.from(api.variants.ball).entries()) {
  test(`ball original variant ${index + 1}: exact physical dice paths and the conditioned denominator`, () => {
    const v = index === 0 ? api.first('rep-ball') : api.math.mkBall(tuple), cfg = v.cfg;
    assert.deepEqual([cfg.th, cfg.wAdd, cfg.bAdd, cfg.n, cfg.T], Array.from(tuple));
    const exact = exhaustive(6, cfg.n, faces => ballTrial(cfg, faces));
    assertMachine(v.M, exact);
    const equalStates = [];
    for (let t = 1; t <= cfg.n; t++) for (let w = 0; w <= t; w++) if (cfg.wAdd * w === cfg.bAdd * (t - w)) equalStates.push([t, w]);
    assert.equal(equalStates.length, 1, 'the one-red-cell explanation requires a unique eligible equality state');
    const [[t, w]] = equalStates;
    assert.deepEqual([v.fl.t, v.fl.k, v.fl.c], [t, w, exact.rows[t].get(w)]);
    let suffixes = 0;
    for (const faces of words(6, cfg.n - t)) {
      let white = cfg.wAdd * w, black = cfg.bAdd * (t - w);
      for (const face of faces) { if (face >= cfg.th) white += cfg.wAdd; else black += cfg.bAdd; }
      if (white + black >= cfg.T) suffixes++;
    }
    assert.equal(v.cont, suffixes);
    assert.equal(exact.target, exact.rows[t].get(w) * suffixes);
    assert.ok(exact.given < exact.total && exact.given > 0);
    if (index === 0) {
      assert.equal(exact.total, 7776); assert.equal(exact.given, 6318); assert.equal(exact.target, 2187);
      assert.deepEqual(entries(exact.rows[5]).slice(0, 4), [[0, 243], [1, 1215], [2, 2430], [3, 2430]]);
      assert.deepEqual([t, w, v.fl.c, suffixes], [3, 2, 81, 27]);
      assertFraction(v.M.P, 9, 26); assert.equal(v.M.P.n + v.M.P.d, 35);
      const allBlack = ballTrial(cfg, [1, 1, 1, 1, 1]);
      assert.equal(allBlack.given, true); assert.equal(allBlack.hit, false, 'the initial empty bag is outside 1≤k≤n');
      const tooFewBalls = ballTrial(cfg, [4, 4, 1, 4, 4]);
      assert.equal(tooFewBalls.hit, true); assert.equal(tooFewBalls.given, false);
      assert.deepEqual(Array.from(api.math.traceFaces(v.M, [4, 4, 1, 4, 4]).path), tooFewBalls.states);
    }
  });
}

const bitCount = mask => mask.toString(2).replaceAll('0', '').length;
function coinTrial(cfg, numbers) {
  let mask = (1 << cfg.h0) - 1;
  const full = (1 << cfg.m) - 1, states = [bitCount(mask)];
  for (const number of numbers) { mask ^= 1 << (number - 1); states.push(bitCount(mask)); }
  return { states, given: mask === 0 || mask === full, hit: mask === full };
}
for (const [index, tuple] of Array.from(api.variants.coin).entries()) {
  test(`coin original variant ${index + 1}: enumerate physical coin numbers, allowing repeated selections`, () => {
    const v = index === 0 ? api.first('rep-coin') : api.math.mkCoin(tuple), cfg = v.cfg;
    assert.deepEqual([cfg.h0, cfg.n], Array.from(tuple)); assert.equal(cfg.m, 4);
    const exact = exhaustive(cfg.m, cfg.n, numbers => coinTrial(cfg, numbers));
    assertMachine(v.M, exact);
    exact.rows.forEach((row, t) => { for (const h of row.keys()) assert.equal(h % 2, (cfg.h0 + t) % 2); });
    assert.equal(exact.given, (exact.rows[cfg.n].get(0) || 0) + (exact.rows[cfg.n].get(4) || 0));
    if (index === 0) {
      assert.deepEqual(entries(exact.rows[1]), [[0, 1], [2, 3]]);
      assert.deepEqual(entries(exact.rows[2]), [[1, 10], [3, 6]]);
      assert.deepEqual(entries(exact.rows[3]), [[0, 10], [2, 48], [4, 6]]);
      assert.equal(exact.total, 64); assert.equal(exact.given, 16); assert.equal(exact.target, 6);
      assertFraction(v.M.P, 3, 8);
    }
  });
}
test('coin identity: selecting 1,1,2 flips the same physical coin back before selecting another', () => {
  const v = api.first('rep-coin'), exact = coinTrial(v.cfg, [1, 1, 2]);
  assert.deepEqual(exact.states, [1, 0, 1, 2]);
  assert.deepEqual(Array.from(api.math.traceFaces(v.M, [1, 1, 2]).path), exact.states);
  for (const heads of [1, 2, 3]) {
    const cfg = { m: 4, h0: heads, n: 1 };
    const paths = Array.from(words(4, 1), numbers => coinTrial(cfg, numbers).states.at(-1));
    assert.equal(paths.filter(h => h === heads - 1).length, heads);
    assert.equal(paths.filter(h => h === heads + 1).length, 4 - heads);
  }
});
test('coin parity: starting with one head and flipping four times makes the condition impossible', () => {
  const cfg = { kind: 'coin', m: 4, h0: 1, n: 4 };
  const exact = exhaustive(4, 4, numbers => coinTrial(cfg, numbers)), M = api.math.makeMachine(cfg);
  assertMachine(M, exact);
  assert.deepEqual(Array.from(exact.rows[4].keys()).sort(), [1, 3]);
  assert.equal(exact.total, 256); assert.equal(exact.given, 0); assert.equal(exact.target, 0);
  assert.equal(M.noGiven, true);
  assert.throws(() => fraction(exact.target, exact.given), 'zero denominator is not a zero probability');
});
