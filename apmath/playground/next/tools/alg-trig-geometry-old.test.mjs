// 삼각함수와 도형 활용 실험실 기본 01·03·06·08의 「새 문제」 변형 전수 검산 (node --test, 브라우저 불필요)
// labs/alg-trig-geometry.html 의 TRIGV-ENGINE 블록(화면과 무관한 순수 계산)을 꺼내, 변형마다 정답이
// 문제 조건에서 처음부터 직접 계산한 값(수치 최대화·교점 풀기·좌표 계산)과 같은지를 결함 조건(불일치 0)으로 검사합니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const html = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/alg-trig-geometry.html'), 'utf8');
const body = html.split('/* ==TRIGV-ENGINE-START==')[1].split('/* ==TRIGV-ENGINE-END== */')[0];
const T = new Function('/*' + body + '\nreturn TRIGV;')();
const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} ≠ ${b}`);

test('모든 장면: 변형이 4개 이상이고 같은 문제가 겹치지 않으며 풀이·정답 글에 빈 값이 없다', () => {
  for (const id of ['B1', 'B3', 'B6', 'B8']) {
    const pool = T[id].pool;
    assert.ok(pool.length >= 4);
    assert.equal(new Set(pool.map((it) => JSON.stringify(it))).size, pool.length);
    assert.equal(new Set(pool.map((it) => T[id].build(it).statement)).size, pool.length);
    for (const it of pool) {
      const b = T[id].build(it);
      const all = [b.statement, b.answer, ...b.steps.filter(Boolean).flatMap((s) => [s.title, s.desc]), b.alg || ''].join('\n');
      assert.ok(!/undefined|NaN|Infinity|\[object/.test(all), id + JSON.stringify(it));
    }
  }
});

test('기본 01: 둘레 P 인 부채꼴의 넓이를 r 에 대해 수치로 최대화하면 r=P/4, l=P/2, θ=2, S=P²/16', () => {
  for (const it of T.B1.pool) {
    const P = it.P; let best = { S: -1, r: 0 };
    for (let r = 0.001; r < P / 2; r += 0.001) { const S = 0.5 * r * (P - 2 * r); if (S > best.S) best = { S, r }; }
    const x = T.B1.solve(it);
    near(best.r, x.r, 2e-3); near(best.S, x.S, 1e-3); near((P - 2 * x.r) / x.r, 2); assert.equal(x.l, P - 2 * x.r);
    assert.ok(Number.isInteger(x.r) && Number.isInteger(x.S)); // 정답이 깔끔한 변형만
  }
});

test('기본 03: sin 2x = k 의 네 교점(0≤x≤2π)에서 a·x₁ + b·x₂ + b·x₃ + a·x₄ 는 k와 관계없이 (a+b)·3π/2', () => {
  for (const it of T.B3.pool) for (let k = 0.05; k < 1; k += 0.05) {
    const al = Math.asin(k) / 2, xs = [al, Math.PI / 2 - al, Math.PI + al, 3 * Math.PI / 2 - al];
    xs.forEach((x) => near(Math.sin(2 * x), k, 1e-12));
    const sum = it.a * xs[0] + it.b * xs[1] + it.b * xs[2] + it.a * xs[3];
    near(sum, T.B3.solve(it).S, 1e-9);
    assert.equal(T.B3.solve(it).n % 3, 0);
  }
});

test('기본 06: 반지름 R 인 원의 현 BC 에서 원주각 A 가 일정하고 BC = 2R sin A, A\'C = 2R cos A', () => {
  const val = (o) => o.k * Math.sqrt(o.m);
  for (const it of T.B6.pool) {
    const Aang = { 3: Math.PI / 3, 6: Math.PI / 6, 4: Math.PI / 4 }[it.A], R = it.R;
    const pt = (th) => [R * Math.cos(th), R * Math.sin(th)];
    const B = pt(-Math.PI / 2 - Aang), C = pt(-Math.PI / 2 + Aang), Ap = pt(-Math.PI / 2 - Aang + Math.PI);
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const x = T.B6.solve(it);
    near(dist(B, C), val(x.bc)); near(dist(Ap, C), val(x.ac)); near(dist(B, Ap), x.d);
    // 호 위 어느 점 A 에서도 ∠BAC = A (원주각 일정)
    for (let k = 0; k < 12; k++) {
      const A = pt(-Math.PI / 2 - Aang + Math.PI + (k / 12) * (Math.PI - 0.2)); // A' 에서 B 쪽으로
      const v1 = [B[0] - A[0], B[1] - A[1]], v2 = [C[0] - A[0], C[1] - A[1]];
      near(Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))), Aang, 1e-9);
    }
    assert.ok(Number.isInteger(x.bc.k) && Number.isInteger(x.ac.k));
  }
});

test('기본 08: 좌표로 AB=c, AC=b, ∠A=2π/3 의 이등분선과 BC 의 교점 D 를 구해 AD, BD:DC 를 직접 계산', () => {
  for (const it of T.B8.pool) {
    const { c, b } = it, th = (2 * Math.PI) / 3;
    const A = [0, 0], B = [c, 0], C = [b * Math.cos(th), b * Math.sin(th)];
    const dir = [Math.cos(th / 2), Math.sin(th / 2)];            // 각의 이등분선 방향
    // 직선 BC 와의 교점: B + s(C−B) = λ·dir
    const e = [C[0] - B[0], C[1] - B[1]];
    const det = e[0] * -dir[1] - -dir[0] * e[1];
    const s = ((A[0] - B[0]) * -dir[1] - -dir[0] * (A[1] - B[1])) / det;
    const D = [B[0] + s * e[0], B[1] + s * e[1]];
    const x = T.B8.solve(it);
    near(Math.hypot(D[0], D[1]), x.AD, 1e-9);
    near(Math.hypot(D[0] - B[0], D[1] - B[1]), x.BD * Math.sqrt(x.m), 1e-9);
    near(Math.hypot(C[0] - D[0], C[1] - D[1]), x.DC * Math.sqrt(x.m), 1e-9);
    near(Math.hypot(C[0] - B[0], C[1] - B[1]), x.k * Math.sqrt(x.m), 1e-9);
    assert.ok(Number.isInteger(x.AD) && Number.isInteger(x.BD) && Number.isInteger(x.DC)); // BD·√m, DC·√m 계수가 정수
    // 넓이 합 S = S₁ + S₂
    near(0.5 * c * b * Math.sin(th), 0.5 * c * x.AD * Math.sin(th / 2) + 0.5 * b * x.AD * Math.sin(th / 2), 1e-9);
  }
});
