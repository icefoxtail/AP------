// 수열 실험실 장면 9~12(분기 점화식·순환 표·점열 넓이·도형 반복)의 계산부 전수 검산 (node --test, 브라우저 불필요)
// 화면과 무관한 순수 계산(labs/alg-sequence.html 의 ENGINE 블록)을 꺼내어, 문항 정답과 탐구 화면의 값이
// 독립된 직접 계산(앞으로 전부 대입, 기하 수치 계산)과 같은지를 결함 조건(불일치 0)으로 검사합니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const html = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/alg-sequence.html'), 'utf8');
const body = html.split('/* ==ENGINE-START==')[1].split('/* ==ENGINE-END== */')[0];
const E = new Function('/*' + body + '\nreturn {FR,brTree,brFwd,brBrute,BR_POOL,brAns,cyF,cyInfo,cyTerm,cyAnswer,CY_POOL,paS,PA_POOL,paAns,pbS,pbSum,PB_POOL,FRP,frCalc,frSum,frFrames,FR_POOL,frAns};')();

test('장면 9: 거꾸로 가지치기 결과 = 앞으로 전부 대입한 결과 (탐구 화면의 모든 조합)', () => {
  let bad = 0;
  for (const fam of ['par', 'sgn', 'mul']) for (let c = 1; c <= 7; c++) for (let m = 2; m <= 4; m++) for (let t = 1; t <= 12; t++) {
    const T = E.brTree(fam, c, t, m);
    const b = E.brBrute(fam, c, t, m, fam === 'sgn' ? -3000 : 1, 3000);
    if (JSON.stringify(b) !== JSON.stringify(T.a1)) bad++;
    T.a1.forEach((a) => { if (E.brFwd(fam, c, a, m)[m] !== t) bad++; });
  }
  assert.equal(bad, 0);
});

test('장면 9: 문항 풀이 — 정답이 있고 정수이며 같은 문제가 겹치지 않는다', () => {
  const keys = new Set();
  for (const q of E.BR_POOL) {
    const T = E.brTree(q.fam, q.c, q.t, q.m);
    assert.ok(T.a1.length >= 3, 'a1 후보가 너무 적음 ' + JSON.stringify(q));
    assert.ok(Number.isInteger(E.brAns(q)));
    keys.add(JSON.stringify([q.fam, q.c, q.t, q.m, q.ask]));
  }
  assert.equal(keys.size, E.BR_POOL.length);
});

test('장면 10: 표의 모든 항 = 직접 계산, 반복이 표 14칸 안에서 보인다', () => {
  let bad = 0, maxRepeat = 0;
  for (let k = 2; k <= 5; k++) for (let d = 1; d <= 3; d++) for (let a1 = -8; a1 <= 8; a1++) {
    const I = E.cyInfo(a1, k, d);
    maxRepeat = Math.max(maxRepeat, I.repeatAt);
    let x = a1;
    for (let n = 1; n <= 80; n++) { if (E.cyTerm(I, n) !== x) bad++; x = E.cyF(x, k, d); }
  }
  assert.equal(bad, 0);
  assert.ok(maxRepeat <= 14, '반복이 14번째 칸 안에서 보이지 않음: ' + maxRepeat);
});

test('장면 10: 문항 정답 = 처음부터 끝까지 직접 더하기·세기', () => {
  for (const q of E.CY_POOL) {
    const s = [q.a1];
    for (let i = 1; i < q.M; i++) s.push(E.cyF(s[i - 1], q.k, q.d));
    const want = q.ask === 'sum' ? s.reduce((a, b) => a + b, 0) : q.ask === 'count' ? s.filter((x) => x === q.X).length : s[q.M - 1];
    assert.equal(E.cyAnswer(q).val, want, JSON.stringify(q));
  }
});

test('장면 11: 점열 문항 정답 = 교점·삼각형 넓이를 수치로 직접 계산한 합', () => {
  for (const q of E.PA_POOL) {
    const area = (n) => { const x = 4 * Math.sqrt(n), y = (x * x) / 16; assert.ok(Math.abs(y - (Math.sqrt(n) / 4) * x) < 1e-9); return 0.5 * x * y; };
    let s = 0;
    for (let k = q.j; k < q.N; k++) s += area(k + 1) - area(k);
    assert.ok(Math.abs(s - E.paAns(q)) < 1e-9 && Math.abs(s - Math.round(s)) < 1e-9, JSON.stringify(q));
  }
  for (const q of E.PB_POOL) {
    let tot = 0;
    for (let n = 1; n <= q.M; n++) {
      const B = -(q.a - 1) * n - 1, C = -q.a * n * n - n, D = B * B - 4 * C;
      const x1 = (-B - Math.sqrt(D)) / 2, x2 = (-B + Math.sqrt(D)) / 2; // 곡선과 직선의 교점 x좌표
      tot += 0.5 * Math.abs(x1 * (x2 + n) - (x1 + n) * x2);
    }
    const ans = E.pbSum(q.a, q.M);
    assert.equal(ans.d, 1, '정수 정답이어야 함');
    assert.ok(Math.abs(tot - ans.n) < 1e-6, JSON.stringify(q));
  }
});

test('장면 12: 안쪽 정사각형이 삼각형 안의 올바른 위치에 있고, 넓이의 합이 극한 R1/(1−r)로 수렴한다', () => {
  const polyA = (P) => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - a[1] * b[0]; } return Math.abs(s) / 2; };
  const on = (P, Q, X) => Math.abs((Q[0] - P[0]) * (X[1] - P[1]) - (Q[1] - P[1]) * (X[0] - P[0])) < 1e-9;
  for (const key of Object.keys(E.FRP)) {
    const pv = E.FR.val(E.FRP[key]), C = E.frCalc(E.FRP[key]);
    const fs = E.frFrames(pv, 1, 22);
    let S = 0;
    fs.forEach((f, j) => {
      S += polyA([f.Bp, f.C, f.D, f.A]) - polyA([f.E, f.F, f.D]);
      if (j + 1 < fs.length && j < 8) {
        const g = fs[j + 1];
        assert.ok(on(f.D, f.E, g.A) && on(f.D, f.F, g.D) && on(f.E, f.F, g.Bp) && on(f.E, f.F, g.C), key + ' 위치');
        assert.ok(Math.abs(polyA([g.Bp, g.C, g.D, g.A]) / polyA([f.Bp, f.C, f.D, f.A]) - E.FR.val(C.r)) < 1e-9, key + ' 넓이의 비');
      }
    });
    assert.ok(Math.abs(S - E.FR.val(C.lim)) < 1e-6, key + ' 극한');
    for (let n = 1; n <= 4; n++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += polyA([fs[j].Bp, fs[j].C, fs[j].D, fs[j].A]) - polyA([fs[j].E, fs[j].F, fs[j].D]);
      assert.ok(Math.abs(s - E.FR.val(E.frSum(C, n))) < 1e-9, key + ' S_n');
    }
  }
  for (const q of E.FR_POOL) assert.ok(E.frAns(q).n > 0);
});

test('장면 9~12 추가 장면이 실험실에 등록돼 있다', () => {
  for (const id of ['br-tree', 'cyc-table', 'pt-tri-diff', 'pt-tri-sum', 'fig-repeat']) assert.ok(html.includes(`id: '${id}'`), id);
  assert.ok(/\[이전 교육과정\]/.test(html), '「이전 교육과정」 표시');
});
