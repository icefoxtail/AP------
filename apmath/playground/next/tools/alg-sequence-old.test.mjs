// 수열 실험실 옛 장면 1~8(문제 A·B 16개)의 「새 문제」 변형 전수 검산 (node --test, 브라우저 불필요)
// labs/alg-sequence.html 의 OLDV-ENGINE 블록(화면과 무관한 순수 계산)을 꺼내, 변형마다 정답·풀이 숫자가
// 문제 조건에서 처음부터 직접 계산한 값(수열을 앞으로 전개·모든 후보 대입)과 같은지를 결함 조건(불일치 0)으로 검사합니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const html = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/alg-sequence.html'), 'utf8');
const body = html.split('/* ==OLDV-ENGINE-START==')[1].split('/* ==OLDV-ENGINE-END== */')[0];
const O = new Function('/*' + body + '\nreturn OLDV;')();
const SPECS = ['T1A', 'T1B', 'T2A', 'T2B', 'T3A', 'T3B', 'T4A', 'T4B', 'T5A', 'T5B', 'T6A', 'T6B', 'T7A', 'T7B', 'T8A', 'T8B'];
const sumTo = (f, n) => { let s = 0; for (let k = 1; k <= n; k++) s += f(k); return s; };

test('모든 장면: 변형이 4개 이상이고 서로 달라 연속 중복이 없다', () => {
  for (const id of SPECS) {
    const pool = O[id].pool;
    assert.ok(pool.length >= 4, id + ' 변형이 적음');
    const keys = new Set(pool.map((it) => JSON.stringify(it)));
    assert.equal(keys.size, pool.length, id + ' 같은 변형이 겹침');
    const texts = new Set(pool.map((it) => O[id].build(it).text));
    assert.equal(texts.size, pool.length, id + ' 같은 문제 글이 겹침');
  }
});

test('모든 장면: 풀이 단계와 정답 글에 비어 있는 값(undefined·NaN)이 없다', () => {
  for (const id of SPECS) for (const it of O[id].pool) {
    const b = O[id].build(it);
    const all = [b.text, b.ans, ...b.std, ...b.quick].join('\n');
    assert.ok(!/undefined|NaN|Infinity|\[object/.test(all), id + ' ' + JSON.stringify(it));
    assert.ok(b.std.length >= 1 && b.quick.length >= 1);
    for (const k of Object.keys(b.params)) assert.ok(Number.isFinite(b.params[k]), id + ' params ' + k);
  }
});

test('유형 1-A: a_p + a_q = 0 을 만족하는 a₁을 찾아 a_m, S_(2m-1), a₁₀ 을 직접 계산', () => {
  for (const it of O.T1A.pool) {
    const hits = [];
    for (let a1 = -300; a1 <= 300; a1++) if (2 * a1 + (it.p + it.q - 2) * it.d === 0) hits.push(a1);
    assert.equal(hits.length, 1);
    const a = (n) => hits[0] + (n - 1) * it.d, m = (it.p + it.q) / 2, r = O.T1A.solve(it);
    assert.equal(a(m), r.am); assert.equal(sumTo(a, 2 * m - 1), r.S); assert.equal(a(10), r.a10);
    assert.ok(O.T1A.build(it).ans.includes(`a_{10} = ${a(10)}`));
  }
});

test('유형 1-B: 첫째항과 a_k + a_(k+1) = 0 에서 공차를 찾아 처음 부호가 바뀌는 항과 S_2k 를 직접 계산', () => {
  for (const it of O.T1B.pool) {
    const ds = [];
    for (let d = -20; d <= 20; d++) if (2 * it.A + (2 * it.k - 1) * d === 0) ds.push(d);
    assert.equal(ds.length, 1); assert.equal(ds[0], it.d);
    const a = (n) => it.A + (n - 1) * it.d;
    const first = [...Array(30)].map((_, i) => i + 1).find((n) => (it.d < 0 ? a(n) < 0 : a(n) > 0));
    assert.equal(first, O.T1B.solve(it).first); assert.equal(sumTo(a, 2 * it.k), 0);
  }
});

test('유형 2-A·B: S_p = S_q 인 등차수열(첫째항>0)에서 최대가 되는 n과 S_k=0 인 k를 직접 계산', () => {
  for (const id of ['T2A', 'T2B']) for (const it of O[id].pool) {
    const d = -2, a1 = (it.p + it.q - 1); // 2a1 + (p+q-1)d = 0
    assert.ok(a1 > 0);
    const S = (n) => (n * (2 * a1 + (n - 1) * d)) / 2;
    assert.equal(S(it.p), S(it.q));
    const mx = Math.max(...[...Array(40)].map((_, i) => S(i + 1)));
    const ns = [...Array(40)].map((_, i) => i + 1).filter((n) => S(n) === mx);
    const r = O[id].solve(it);
    if (id === 'T2A') { assert.deepEqual(ns, [r.n]); assert.equal(S(r.k), 0); assert.equal([...Array(40)].map((_, i) => i + 1).find((n) => S(n) === 0), r.k); }
    else { assert.equal(ns.reduce((x, y) => x + y, 0), r.sum); assert.equal(ns.length, 2); assert.equal(a1 + (r.k - 1) * d, 0); }
  }
});

test('유형 3-A: Sₙ = −n²+Nn 에서 일반항으로 Σ|a_k| 를 직접 합산', () => {
  for (const it of O.T3A.pool) {
    const S = (n) => -n * n + it.N * n, a = (n) => S(n) - S(n - 1);
    assert.equal(sumTo((k) => Math.abs(a(k)), it.T), O.T3A.solve(it).val);
    assert.ok(it.T > it.N / 2 && it.T >= 5 && it.T <= 12);
  }
});

test('유형 3-B: |S_a| = |S_(N-a)| = c 이고 n>N 에서 |S_r| = L 을 만족하는 자연수 r은 주어진 r 하나', () => {
  for (const it of O.T3B.pool) {
    const S = (n) => -n * (n - it.N), x = O.T3B.solve(it);
    assert.equal(Math.abs(S(it.a)), x.c); assert.equal(Math.abs(S(it.N - it.a)), x.c);
    const rs = [...Array(80)].map((_, i) => i + 1).filter((n) => n > it.N && Math.abs(S(n)) === x.L);
    assert.deepEqual(rs, [it.r]);
  }
});

test('유형 4-A: Sₙ 에서 a₁ = S₁, a₅ = S₅ − S₄ 로 a₁ + a₅ 직접 계산 · C≠0 이라 함정(직선식에 n=1 대입)과 값이 다르다', () => {
  for (const it of O.T4A.pool) {
    const S = (n) => it.p * n * n + it.q * n + it.C, r = O.T4A.solve(it);
    assert.equal(S(1) + (S(5) - S(4)), r.val);
    assert.notEqual(it.C, 0);
    assert.notEqual(it.p + it.q + (S(5) - S(4)), r.val); // 함정 값(a₁ 을 2pn+(q−p) 에 n=1 대입)은 정답이 아니다
  }
});

test('유형 4-B: Sₙ = pn²+qn+C 가 첫째항부터 등차수열이 되는 C는 0 하나, 그때 a_n = 2pn+(q−p) (n ≥ 1)', () => {
  for (const it of O.T4B.pool) {
    const good = [];
    for (let C = -20; C <= 20; C++) {
      const S = (n) => it.p * n * n + it.q * n + C, a = (n) => (n === 1 ? S(1) : S(n) - S(n - 1)); // 첫째항은 a₁ = S₁
      const d = a(2) - a(1);
      if ([...Array(10)].every((_, i) => a(i + 2) - a(i + 1) === d)) good.push(C);
    }
    assert.deepEqual(good, [0]);
    const S = (n) => it.p * n * n + it.q * n;
    for (let n = 1; n <= 8; n++) assert.equal(S(n) - S(n - 1), 2 * it.p * n + (it.q - it.p));
  }
});

test('유형 5-A·B: 등비수열(공비 R, n=1)로 S_n, S_2n, S_3n 을 직접 계산', () => {
  for (const id of ['T5A', 'T5B']) for (const it of O[id].pool) {
    const a = (k) => it.P1 * it.R ** (k - 1), S = (n) => sumTo(a, n), r = O[id].solve(it);
    assert.equal(S(1), it.P1); assert.equal(S(2), r.S2); assert.equal(S(3), r.S3); assert.equal(S(3) - S(2), r.P3);
    assert.ok(it.R === 2 || it.R === 3); // 구간별 합의 공비가 정수(그림의 막대 비율이 깔끔)
    // r^n 이 정수 R 이 되는 다른 n(예: n=2, r=√R)에서도 같은 값: S_2n/S_n 로 R 복원
    assert.equal(r.S2 / it.P1 - 1, it.R);
  }
});

test('유형 6-A·B: Σ 1/(a_k a_(k+1)) 을 분수로 직접 합산', () => {
  const g = (x, y) => (y ? g(y, x % y) : x);
  for (const id of ['T6A', 'T6B']) for (const it of O[id].pool) {
    let N = 0, D = 1; // 분수 합
    for (let k = 1; k <= it.n; k++) { const ak = it.a1 + (k - 1) * it.d, bk = ak + it.d, dn = ak * bk; N = N * dn + D; D *= dn; const q = g(N, D); N /= q; D /= q; }
    const r = O[id].solve(it), q = g(r.num, r.den);
    assert.equal(N, r.num / q); assert.equal(D, r.den / q);
    assert.equal(r.an1, it.a1 + it.n * it.d);
  }
});

test('유형 7-A·B: 점화식을 N항까지 전개한 합 = 마디의 몫·나머지로 구한 값, 주기 3', () => {
  for (const id of ['T7A', 'T7B']) for (const it of O[id].pool) {
    const seq = [it.a1]; for (let i = 1; i < it.N; i++) { const x = seq[i - 1]; seq.push(x < 4 ? x + 2 : x - 4); }
    const r = O[id].solve(it);
    assert.equal(seq.reduce((x, y) => x + y, 0), r.val);
    assert.equal(seq[3], seq[0]); assert.equal(seq[4], seq[1]);
    assert.deepEqual(r.c, seq.slice(0, 3));
    if (id === 'T7A') assert.equal(it.N % 3, 0); else assert.notEqual(it.N % 3, 0);
  }
});

test('유형 8-A·B: 나뭇가지로 찾은 a₁ = 앞으로 3번 전개해 a₄가 되는 모든 자연수 a₁', () => {
  for (const id of ['T8A', 'T8B']) for (const it of O[id].pool) {
    const f = (a) => (a < it.k ? 2 * a : a - it.k);
    const brute = []; for (let a = 1; a <= 3000; a++) if (f(f(f(a))) === it.t) brute.push(a);
    const r = O[id].solve(it);
    assert.deepEqual(r.a1, brute);
    assert.equal(r.sum, brute.reduce((x, y) => x + y, 0));
    assert.ok(brute.length >= 1);
  }
});

test('유형 8-B: 변형 중 지워지는 가지가 경계값(÷2 한 값이 기준값과 같음)인 경우가 있어 원래 함정이 유지된다', () => {
  const hasBoundary = (it) => { let hit = false; (function w(n) { if (n.valid) n.children.forEach((c) => { if (c.rule === '÷2' && !c.valid && c.val === it.k) hit = true; w(c); }); })(O.tree8(it.t, it.k).root); return hit; };
  assert.ok(O.T8B.pool.slice(0, 3).every(hasBoundary), '문제 B의 앞 변형은 모두 경계값 함정을 포함');
});
