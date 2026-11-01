/* ==========================================================================
   중1 · 다각형 — 탭 ① 「다각형과 대각선」 (t1.js, order 10) — 장면 3개
   · p1-one  한 꼭짓점에서 그은 대각선 (n−3)개, 나뉜 삼각형 (n−2)개   · 꼭짓점 고르기·n 조절·하나씩 긋기
   · p1-all  대각선의 총 개수 n(n−3)÷2                                · 꼭짓점마다 세어 두 번씩 센 것을 ÷2
   · p1-find 대각선의 개수로 n 구하기                                    · n 을 바꿔 가며 목표 개수와 맞추기
   모든 글자·표시·정답은 지금의 n(과 고른 꼭짓점·목표 개수)로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PG;
  if (!G) return;
  const { clamp, pt, polar, add, sub, mul, unit, mid, lerp, regUp, centroid, pick, rint, T, tagOut, fit, fillPoly, line, poly, mkChoices, LET, P, rd, notes } = G;

  const PARAMS = {
    pgN: P('꼭짓점의 수 n', 3, 12, 1, 7, { color: 'amber', hint: '막대를 움직여 다각형을 바꿔 보세요', format: (v) => `${v}각형` }),
    pgT: P('그어 보기', 0, 1, 0.01, 1, { color: 'amber', hint: '▶를 누르거나 막대를 끌면 하나씩 그어져요', format: (v) => Math.round(v * 100) + '%' })
  };
  const nDiag = (n) => (n * (n - 3)) / 2;
  const plainNum = (v) => ({ tex: (x) => String(x), plain: (x) => String(x) + '개' });
  // 꼭짓점 안쪽에 놓는 작은 글자
  function inner(b, p, c, str, color, size = 14, d = 20) {
    const u = unit(sub(c, p));
    T(b, p, str, { dx: u.x * d, dy: u.y * d, color, size });
  }
  // ✕ 표시(이을 수 없는 꼭짓점)
  function cross(b, p, color = 'rose') {
    const k = b.k || 60, s = 8 / k;
    b.path([pt(p.x - s, p.y - s), pt(p.x + s, p.y + s)], { color, width: 3 });
    b.path([pt(p.x - s, p.y + s), pt(p.x + s, p.y - s)], { color, width: 3 });
  }
  const vertsOf = (b, Pn, M, C, o = {}) => {
    const c = pt(0, 0);
    Pn.forEach((p, i) => { b.point(p, { color: o.colorOf ? o.colorOf(i) : 'ink', r: o.r || 4.5 }); if (C.txt) tagOut(b, p, c, LET[i], { size: Pn.length > 9 ? 15 : 17, gap: 10 }); });
  };

  /* ====================================================================== 1. 한 꼭짓점에서 그은 대각선 */
  const one = {
    id: 'p1-one', title: '한 꼭짓점에서 그은 대각선', short: '한 꼭짓점의 대각선',
    question: 'n각형의 한 꼭짓점에서 대각선은 몇 개 그을 수 있고, 그 대각선은 n각형을 삼각형 몇 개로 나눌까?',
    ctl: ['pgN', 'pgT'], anim: { key: 'pgT', dur: 5, label: '대각선 하나씩 긋기', start: 1 },
    init: (s) => { s.pgN = 7; s.pgV = 0; s.pgT = 1; },
    reroll: (s) => { s.pgN = pick([5, 6, 7, 8, 9, 10, 11, 12], s.pgN); s.pgV = rint(0, s.pgN - 1); },
    model: (s) => { const n = clamp(Math.round(s.pgN), 3, 12), v = (((s.pgV | 0) % n) + n) % n; return { n, v, a: n - 3, t: n - 2 }; },
    draw(b, s, M, C) {
      const { n, v, a } = M, Pn = regUp(n, 1), O = pt(0, 0), V = Pn[v], nb = [(v + 1) % n, (v + n - 1) % n];
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 62 });
      const prog = C.review ? (C.step >= 2 ? a : 0) : C.t * a;
      const showX = !C.problem && C.step >= 1, showDiag = !C.problem && C.step >= 2, showTri = !C.problem && C.step >= 3;
      const far = Array.from({ length: a }, (_, i) => (v + 2 + i) % n);
      const done = Math.floor(prog + 1e-9);
      // 삼각형(부채 모양으로 나뉨)
      let nTri = 0;
      if (showTri) {
        for (let i = 0; i <= a; i++) {
          if (prog < Math.min(i + 1, a) - 1e-9) continue;
          nTri++;
          fillPoly(b, [V, Pn[(v + 1 + i) % n], Pn[(v + 2 + i) % n]], i % 2 ? 'green' : 'sky', i % 2 ? 0.2 : 0.2);
        }
      } else fillPoly(b, Pn, 'sky', 0.08);
      poly(b, Pn, 'ink', 3.4);
      if (showDiag) far.forEach((j, i) => {
        const f = clamp(prog - i, 0, 1);
        if (f <= 0) return;
        line(b, V, lerp(V, Pn[j], f), 'green', 3.6);
        if (f >= 1 && C.txt) inner(b, Pn[j], O, String(i + 1), 'green', 15, 22);
      });
      if (showX) nb.forEach((j) => cross(b, Pn[j]));
      vertsOf(b, Pn, M, C, { colorOf: (i) => (i === v ? 'amber' : 'ink') });
      if (!C.problem && C.txt && !C.review && !C.thumb) b.handle('v', V, { color: 'amber', r: 8, ariaLabel: '꼭짓점 고르기', drag: (w) => { let best = 0, bd = 1e9; Pn.forEach((p, i) => { const d = Math.hypot(p.x - w.x, p.y - w.y); if (d < bd) { bd = d; best = i; } }); s.pgV = best; } });
      else b.point(V, { color: 'amber', r: 7.5 });
      if (C.txt && !C.problem) {
        const yb = Math.max(...Pn.map((p) => p.y));
        if (n === 3) T(b, pt(0, yb), '삼각형에는 대각선이 없어요', { dy: 46, size: 16, color: 'amber' });
        else if (showDiag) T(b, pt(0, yb), `대각선 ${done}개` + (showTri ? ` → 삼각형 ${nTri}개` : ''), { dy: 46, size: 17, color: 'green' });
        else if (showX) T(b, pt(0, yb), `✕ 이을 수 없는 이웃 점 2개`, { dy: 46, size: 16, color: 'rose' });
      }
    },
    steps: (M) => [
      `꼭짓점 ${LET[M.v]}에서 대각선을 그을 수 없는 꼭짓점은 ${LET[M.v]} 자신과 이웃한 두 꼭짓점이에요. 이웃한 점을 이으면 변이 돼요.`,
      `나머지 ${M.n}−3=${M.a}개의 꼭짓점과 이으면 대각선이 ${M.a}개 생겨요.`,
      `이 대각선들은 ${M.n}각형을 삼각형 ${M.n}−2=${M.t}개로 나눠요.`
    ],
    view: (M, C) => ({
      guide: '<b>노란 점</b>을 끌어 꼭짓점을 골라 보세요. 막대로 <b>n</b>을 바꾸거나 ▶를 누르면 대각선이 하나씩 그어져요. <b>✕</b>는 대각선을 그을 수 없는 이웃한 꼭짓점이에요.',
      readouts: [
        rd('꼭짓점의 수 n', `${M.n}개`, 'ink'),
        rd('한 꼭짓점에서 그은 대각선', `${M.a}개`, 'green', 'n − 3'),
        rd('나누어진 삼각형', `${M.t}개`, 'sky', 'n − 2')
      ],
      formula: `<p>대각선: $n-3=${M.n}-3=${M.a}$ (개)</p><p>삼각형: $n-2=${M.n}-2=${M.t}$ (개)</p>`,
      rule: '한 꼭짓점에서 그은 대각선은 (n−3)개, 나뉜 삼각형은 (n−2)개',
      notes: notes('대각선은 이웃하지 않는 두 꼭짓점을 이은 선분이에요. 이웃한 꼭짓점을 이으면 변이에요.', '그을 수 없는 점은 자기 자신과 이웃한 2개, 모두 3개라서 <b>n−3</b>이에요.')
    }),
    prob: (M) => {
      const { n, a, t } = M;
      return {
        tag: '대각선의 개수와 삼각형의 개수', key: `n${n}`,
        stem: `${n}각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 $a$, 이 대각선으로 나누어지는 삼각형의 개수를 $b$라 할 때, $a+b$의 값은?`,
        choices: mkChoices(a + t, [[a, '대각선의 개수 a만 구했어요. b도 더해야 해요.'], [t, '삼각형의 개수 b만 구했어요. a도 더해야 해요.'], [a + t + 1, '삼각형의 개수는 n−2예요. n−1이 아니에요.'], [a + t - 1, '대각선의 개수는 n−3이에요. n−4가 아니에요.'], [nDiag(n), '대각선의 총 개수예요. 한 꼭짓점에서만 세어요.']], { ...plainNum(), valid: (x) => x >= 0, pad: 1 })
      };
    },
    verify: (s) => { const M = one.model(s), n = M.n, V = regUp(n, 1); let c = 0; for (let j = 0; j < n; j++) if (j !== M.v && j !== (M.v + 1) % n && j !== (M.v + n - 1) % n) c++; const A = Math.abs(G.polyArea(V)); let area = 0, tri = 0; for (let i = 0; i < n - 2 && area < A - 1e-9; i++) { area += Math.abs(G.polyArea([V[M.v], V[(M.v + 1 + i) % n], V[(M.v + 2 + i) % n]])); tri++; } return { ans: c + tri, model: M.a + M.t }; }
  };

  /* ====================================================================== 2. 대각선의 총 개수 */
  const all = {
    id: 'p1-all', title: '대각선의 총 개수', short: '대각선의 총 개수',
    question: 'n각형의 대각선은 모두 몇 개일까? 꼭짓점마다 센 수를 그냥 더해도 될까?',
    ctl: ['pgN', 'pgT'], anim: { key: 'pgT', dur: 7, label: '꼭짓점마다 세어 보기', start: 1 },
    init: (s) => { s.pgN = 6; s.pgT = 1; },
    reroll: (s) => { s.pgN = pick([5, 6, 7, 8, 9, 10, 11, 12], s.pgN); },
    model: (s) => { const n = clamp(Math.round(s.pgN), 3, 12); return { n, a: n - 3, tot: n * (n - 3), N: nDiag(n) }; },
    draw(b, s, M, C) {
      const { n, a } = M, Pn = regUp(n, 1), O = pt(0, 0);
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 84 });
      const kp = C.problem ? 0 : C.review ? (C.step <= 1 ? 1 : n) : C.t * n; // 세어 본 꼭짓점 수(소수)
      const kInt = Math.min(n, Math.ceil(kp - 1e-9));
      fillPoly(b, Pn, 'sky', 0.08);
      poly(b, Pn, 'ink', 3.4);
      const sample = n >= 4 ? [0, 2] : null;
      for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j++) {
          if (i === 0 && j === n - 1) continue; // 변
          const cnt = (i < kp - 1e-9 ? 1 : 0) + (j < kp - 1e-9 ? 1 : 0);
          if (cnt === 0) { if (!C.problem) line(b, Pn[i], Pn[j], 'muted', 1.4, { alpha: 0.35 }); continue; }
          const isSample = sample && i === sample[0] && j === sample[1] && C.review && C.step >= 3;
          line(b, Pn[i], Pn[j], cnt === 2 ? 'amber' : 'green', isSample ? 6 : cnt === 2 ? 3.6 : 3.2);
        }
      }
      Pn.forEach((p, i) => {
        const on = i < kp - 1e-9, cur = !C.problem && kp > 0 && kp < n && i === Math.floor(kp);
        b.point(p, { color: on ? 'green' : 'ink', r: cur ? 7 : 4.8 });
        if (C.txt) tagOut(b, p, O, LET[i], { size: n > 9 ? 15 : 17, gap: 10 });
        if (C.txt && on && n > 3) inner(b, p, O, String(a), 'sky', 14, 21);
      });
      if (C.review && C.step >= 3 && sample && C.txt) { inner(b, Pn[0], O, '①', 'amber', 15, 38); inner(b, Pn[2], O, '②', 'amber', 15, 38); }
      if (C.txt && !C.problem) {
        const yb = Math.max(...Pn.map((p) => p.y));
        if (n === 3) T(b, pt(0, yb), '삼각형에는 대각선이 없어요', { dy: 46, size: 16, color: 'amber' });
        else {
          const full = kp >= n - 1e-9;
          T(b, pt(0, yb), `${kInt}개 × ${a}개 = ${kInt * a}`, { dy: 44, size: 17, color: 'sky' });
          if (full) T(b, pt(0, yb), `두 번씩 센 값 → ÷2 = ${M.N}개`, { dy: 70, size: 17, color: 'amber' });
        }
      }
    },
    steps: (M) => [
      `한 꼭짓점에서 그을 수 있는 대각선은 n−3=${M.n}−3=${M.a}개예요.`,
      `${M.n}개의 꼭짓점 모두에서 세면 ${M.n}×${M.a}=${M.tot}개예요.`,
      `그런데 대각선 하나를 양쪽 끝 꼭짓점에서 두 번씩 센 값이에요. 그러므로 ${M.tot}÷2=${M.N}개예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>n</b>을 바꿔 보고 ▶를 눌러 <b>꼭짓점마다</b> 세어 보세요. 한 번 센 대각선은 <b>초록</b>, 두 번 센 대각선은 <b>노랑</b>이에요.',
      readouts: [
        rd('한 꼭짓점의 대각선', `${M.a}개`, 'sky', 'n − 3'),
        rd('꼭짓점마다 센 합', `${M.tot}개`, 'amber', `${M.n} × ${M.a}`),
        rd('대각선의 총 개수', `${M.N}개`, 'green', 'n(n−3)÷2', null, true)
      ],
      formula: `<p>(대각선의 총 개수) $=\\dfrac{n(n-3)}{2}=\\dfrac{${M.n}\\times${M.a}}{2}=${M.N}$ (개)</p>`,
      rule: 'n각형의 대각선의 총 개수 = n(n−3)÷2',
      notes: notes('꼭짓점마다 센 수를 모두 더하면 대각선이 <b>두 번씩</b> 세어져요. 꼭 2로 나누세요.', 'n(n−3)에서 n−3을 n−2로 쓰지 않도록 조심하세요.')
    }),
    prob: (M) => {
      const { n, a, tot, N } = M;
      return {
        tag: '대각선의 총 개수', key: `n${n}`,
        stem: `${n}각형의 대각선의 개수는?`,
        choices: mkChoices(N, [[tot, '2로 나누지 않았어요. 대각선을 두 번씩 센 값이에요.'], [a, '한 꼭짓점에서 그은 대각선의 개수예요.'], [(n * (n - 2)) / 2, 'n(n−3)÷2에서 n−3 대신 n−2를 곱했어요.'], [(n * (n - 1)) / 2, '대각선이 아니라 모든 선분의 수예요. 변도 들어 있어요.'], [n * (n - 3) / 2 + n, '변 n개까지 더했어요. 변은 대각선이 아니에요.']], { ...plainNum(), pad: 1 })
      };
    },
    verify: (s) => { const M = all.model(s), n = M.n; let c = 0; for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) c++; return { ans: c, model: M.N }; }
  };

  /* ====================================================================== 3. 대각선의 개수로 n 구하기 */
  const TARGETS = [9, 14, 20, 27, 35, 44, 54];
  const nStarOf = (T0) => { for (let n = 4; n <= 12; n++) if (nDiag(n) === T0) return n; return 9; };
  const find = {
    id: 'p1-find', title: '대각선의 개수로 n 구하기', short: '대각선으로 n 구하기',
    question: '대각선의 개수가 주어지면 몇 각형인지 어떻게 알 수 있을까? n을 바꿔 가며 개수가 딱 맞는 때를 찾아보자.',
    ctl: ['pgN'],
    presets: () => TARGETS.map((t, i) => ({ group: i === 0 ? '목표 대각선 수' : '', label: `${t}개`, apply: (s) => { s.pgM = t; }, on: (s) => s.pgM === t })),
    init: (s) => { s.pgN = 6; s.pgM = 27; },
    reroll: (s) => { s.pgM = pick(TARGETS, s.pgM); s.pgN = 6; },
    model: (s) => { const n = clamp(Math.round(s.pgN), 3, 12), T0 = TARGETS.includes(s.pgM) ? s.pgM : 27, ns = nStarOf(T0); return { n, T0, ns, N: nDiag(n), two: 2 * T0, ok: nDiag(n) === T0 }; },
    draw(b, s, M, C) {
      const n = C.review || C.problem ? M.ns : M.n;
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 84 });
      const O = pt(0, 0);
      if (C.problem) {
        b.circle(O, 1, { color: 'muted', width: 2.4, dash: [7, 6] });
        T(b, O, '?각형', { size: 26, color: 'amber' });
        T(b, pt(0, 1), `대각선 ${M.T0}개`, { dy: 46, size: 18, color: 'green' });
        return;
      }
      const Pn = regUp(n, 1);
      fillPoly(b, Pn, M.ok || C.review ? 'green' : 'sky', 0.1);
      poly(b, Pn, 'ink', 3.4);
      for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) line(b, Pn[i], Pn[j], 'green', n > 9 ? 2.2 : 3);
      Pn.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); if (C.txt && n <= 12) tagOut(b, p, O, LET[i], { size: n > 9 ? 15 : 17, gap: 10 }); });
      if (!C.txt) return;
      const yb = Math.max(...Pn.map((p) => p.y)), N = nDiag(n);
      if (C.review) {
        const rows = [`대각선 ${M.T0}개 → n(n−3)÷2 = ${M.T0}`, `n(n−3) = ${M.two}`, `${M.ns}×${M.ns - 3} = ${M.two} → n = ${M.ns}`];
        T(b, pt(0, yb), rows[Math.min(2, Math.max(0, C.step - 1))], { dy: 46, size: 17, color: 'amber' });
      } else {
        T(b, pt(0, yb), `${n}×${n - 3}÷2 = ${N}개`, { dy: 44, size: 17, color: 'sky' });
        const d = N - M.T0;
        T(b, pt(0, yb), M.ok ? `목표 ${M.T0}개와 같아요 ✓` : `목표 ${M.T0}개: ${d < 0 ? -d + '개 부족' : d + '개 넘쳐요'}`, { dy: 70, size: 17, color: M.ok ? 'green' : 'amber' });
      }
    },
    steps: (M) => [
      `대각선이 ${M.T0}개인 다각형을 n각형이라 하면 $\\dfrac{n(n-3)}{2}=${M.T0}$이에요.`,
      `양변에 2를 곱하면 $n(n-3)=${M.two}$예요.`,
      `곱이 ${M.two}이고 3만큼 차이 나는 두 수는 ${M.ns}와 ${M.ns - 3}이에요. 그러므로 $n=${M.ns}$, 정${M.ns}각형이 아니라 <b>${M.ns}각형</b>이에요.`
    ],
    view: (M) => ({
      guide: `막대로 <b>n</b>을 바꾸며 대각선이 <b>${M.T0}개</b>가 되는 때를 찾아보세요. 위의 칩으로 목표 개수를 바꿀 수 있어요.`,
      readouts: [
        rd('다각형', `${M.n}각형`, 'ink'),
        rd('대각선의 개수', `${M.N}개`, M.ok ? 'green' : 'sky', `${M.n}×${M.n - 3}÷2`),
        rd('목표', `${M.T0}개`, 'amber', M.ok ? '같아요 ✓' : (M.N < M.T0 ? `${M.T0 - M.N}개 부족` : `${M.N - M.T0}개 넘쳐요`))
      ],
      status: M.ok ? { tone: 'ok', text: `${M.n}각형이면 대각선이 ${M.T0}개예요` } : { tone: 'info', text: `${M.n}각형: 대각선 ${M.N}개` },
      formula: `<p>$\\dfrac{n(n-3)}{2}=${M.T0}\\ \\Rightarrow\\ n(n-3)=${M.two}$</p><p>$${M.ns}\\times${M.ns - 3}=${M.two}$ 이므로 $n=${M.ns}$</p>`,
      rule: '대각선의 개수 n(n−3)÷2 가 주어지면 n(n−3)을 구한 뒤, 3 차이 나는 두 수의 곱을 찾는다',
      notes: notes('n(n−3)=2×(대각선 수)예요. 2를 곱하는 것을 잊지 마세요.', 'n과 n−3은 3 차이가 나요. 곱이 같아도 차이가 3인 짝만 답이에요.')
    }),
    prob: (M) => {
      const { ns, T0 } = M;
      return {
        tag: '대각선의 개수로 구하는 변의 수', key: `t${T0}`,
        stem: `대각선의 개수가 ${T0}개인 다각형은?`,
        choices: mkChoices(ns, [[ns + 1, `${ns + 1}각형이면 대각선이 ${nDiag(ns + 1)}개예요.`], [ns - 1, `${ns - 1}각형이면 대각선이 ${nDiag(ns - 1)}개예요.`], [ns + 2, `${ns + 2}각형이면 대각선이 ${nDiag(ns + 2)}개예요.`], [ns - 2, `${ns - 2}각형이면 대각선이 ${nDiag(ns - 2)}개예요.`]], { tex: (v) => `${v}\\text{각형}`, plain: (v) => `${v}각형`, valid: (v) => v >= 4 && v <= 14, pad: 1 }),
        note: '막대로 n을 바꿔 확인해 보세요'
      };
    },
    verify: (s) => { const M = find.model(s); let found = -1; for (let n = 4; n <= 14; n++) { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) c++; if (c === M.T0) found = n; } return { ans: found, model: M.ns }; }
  };

  G.register(10, 't1', '① 다각형과 대각선', '다각형과 대각선', PARAMS, [one, all, find]);
})();
