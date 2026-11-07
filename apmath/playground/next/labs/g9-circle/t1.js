/* ==========================================================================
   중3 · 원의 성질 — 탭 ① 「현」 (t1.js, order 10) — 장면 7개
   · c1-1 현의 수직이등분         · 중심에서 현에 내린 수선의 발 M, AM=BM, 피타고라스 정리
   · c1-2 현이 멀어지면 짧아진다  · 거리 OM 슬라이더(현은 교재처럼 가로) · 지름이 가장 긴 현
   · c1-3 중심에서 같은 거리의 두 현 · OM=ON ⟺ AB=CD
   · c1-4 동심원과 접하는 현      · 큰 원의 현 AB가 작은 원에 접할 때 두 원 사이의 넓이 π·AM²
   · c1-5 원 접기                 · 호가 중심 O를 지나게 접으면 OM=R/2 · 제자리 접기
   · c1-6 접는 위치               · 접는 선까지의 거리 OM에 따라 접힌 호와 O의 위치
   · c1-7 아치의 반지름           · 높이 CM과 현 AB로 R 구하기
   값은 모두 지금의 반지름·거리로 다시 계산됩니다. 현은 가로로 그리고 거리는 막대로 바꿉니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, mid, dist, lerp, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, arcPts, fillRing, dot, pname, segTag, ang, cv, nt, ntD, mkNum, sz, fillPoly, fracOf } = G;
  const lenF = (v) => fmtN(v);
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const O = pt(0, 0);
  // 정수 세 쌍 (AM, OM, R): 현의 반, 중심에서의 거리, 반지름
  const BASE = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]];
  const AOR = [].concat(BASE, BASE.map(([a, b, c]) => [b, a, c])).filter(([a, o]) => a >= 3 && o >= 3);
  const bySize = (maxR) => AOR.filter((x) => x[2] <= maxR);

  const PARAMS = {
    c1R: P('반지름 R', 4, 10, 1, 10, { color: 'sky', format: lenF }),
    c1d: P('중심에서 현까지의 거리 OM', 0, 9, 1, 6, { color: 'amber', hint: '현은 가로로 두고 막대로 거리를 바꿔요', format: lenF }),
    c1d2: P('중심에서 현 CD까지의 거리 ON', 0, 9, 1, 6, { color: 'rose', hint: '위쪽 현 CD의 거리', format: lenF }),
    c1r: P('작은 원의 반지름 r', 1, 9, 1, 6, { color: 'rose', hint: '작은 원에 접하는 현 AB가 저절로 정해져요', format: lenF }),
    c1f: P('접기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 호가 현 AB를 따라 접혀요', format: (v) => (v >= 0.999 ? '다 접음' : Math.round(v * 100) + '%') }),
    c1h: P('높이 CM', 1, 6, 1, 3, { color: 'rose', hint: '아치의 가장 높은 곳 C의 높이', format: lenF }),
    c1w: P('현 AB의 길이', 4, 16, 2, 8, { color: 'sky', format: lenF })
  };
  const fixRd = (s) => { s.c1R = clamp(Math.round(s.c1R), 4, 10); s.c1d = clamp(Math.round(s.c1d), 0, s.c1R - 1); s.c1d2 = clamp(Math.round(s.c1d2), 0, s.c1R - 1); s.c1r = clamp(Math.round(s.c1r), 1, s.c1R - 1); };
  const half = (R, d) => Math.sqrt(Math.max(0, R * R - d * d));
  const chordAt = (R, d, up) => { const h = half(R, d), y = up ? -d : d; return { A: pt(-h, y), B: pt(h, y), M: pt(0, y), h, y }; };
  const FIT = (b, R, o = {}) => fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 48, b: 66, l: 36, r: 36, ...o });
  const S = (b, a = 16) => sz(b, a);
  const rx = (b, p, q, v, away, color = 'sky', gap = 11) => segTag(b, p, q, v, { away, color, size: S(b), gap });
  // 문제에서 x 가 붙는 곳은 분홍·크게
  const X = (b) => ({ color: 'rose', size: S(b) + 3 });
  const rt = (a, c) => `${a}${c}`;

  /* ====================================================================== 1. 현의 수직이등분 */
  const bis = {
    id: 'c1-1', title: '현의 수직이등분', short: '현의 수직이등분',
    question: '원의 중심 O에서 현 AB에 수선을 내리면 그 수선의 발 M은 현의 어디에 있을까? 거리 OM을 바꿔 가며 AM과 BM의 길이를 비교해 보자.',
    ctl: ['c1R', 'c1d'],
    init: (s) => { s.c1R = 10; s.c1d = 6; s.c1d2 = 6; s.c1r = 6; fixRd(s); },
    gen(rnd, n) { const [am, om, R] = pickR(rnd, AOR), kind = n % 3; return { kind, am, om, R, key: `b${kind}.${am}.${om}.${R}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, d: q.om, g: chordAt(q.R, q.om), Rfit: q.R, am: q.am }; }
      fixRd(s);
      const g = chordAt(s.c1R, s.c1d);
      return { R: s.c1R, d: s.c1d, g, Rfit: 10, am: g.h };
    },
    draw(b, s, M, C) {
      const { g, R, d, q } = M, { A, B, M: Mm } = g, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      FIT(b, M.Rfit);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      if ((ex || st >= 3) && d > 0 && g.h > 0) fillPoly(b, [O, A, Mm], 'green', 0.14);
      line(b, A, B, 'ink', 3.6); line(b, O, A, 'ink', 2.6); line(b, O, B, 'ink', 2.6);
      if (d > 0) line(b, O, Mm, st >= 1 || ex ? 'green' : 'ink', 3);
      if (d > 0 && (pr || ex || st >= 1)) b.right(Mm, O, B, { size: 13, color: 'amber' });
      if (!pr && (ex || st >= 2) && g.h > 0) { tick(b, A, Mm, 1, 'amber'); tick(b, Mm, B, 1, 'amber'); }
      if (!pr && (ex || st >= 2)) { tick(b, O, A, 2, 'amber'); tick(b, O, B, 2, 'amber'); }
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); dot(b, O, 'ink', 4.6); dot(b, Mm, 'green', 4.2);
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: -14, size: 17 });
      T(b, Mm, 'M', d > 0 ? { dy: 18, size: 17 } : { dx: 16, dy: 14, size: 17 });
      if (pr && q.kind === 2) segTag(b, O, A, 'x', { away: Mm, ...X(b) }); else rx(b, O, A, cv(R), Mm);
      if (d > 0) { if (pr && q.kind === 0) segTag(b, O, Mm, 'x', { toward: B, gap: 11, ...X(b) }); else rx(b, O, Mm, cv(d), B, 'green'); }
      if (pr) T(b, Mm, q.kind === 1 ? 'AB=x' : `AB=${2 * q.am}`, { dy: 42, size: S(b) + (q.kind === 1 ? 3 : 0), color: q.kind === 1 ? 'rose' : 'sky', leaderAnchor: Mm, leader: true });
      else {
        if (ex || st >= 3) { T(b, lerp(A, Mm, 0.5), 'AM=' + cv(g.h), { dy: 40, size: S(b), color: 'green', leaderAnchor: lerp(A, Mm, .5), leader: true }); T(b, lerp(Mm, B, 0.5), 'BM=' + cv(g.h), { dy: 40, size: S(b), color: 'green', leaderAnchor: lerp(Mm, B, .5), leader: true }); }
        if (st >= 4) T(b, Mm, 'AB=' + cv(2 * g.h), { dy: 64, size: S(b) + 1, color: 'rose', leaderAnchor: Mm, leader: true });
      }
    },
    steps: (M) => [
      '원의 중심 O에서 현 AB에 내린 수선의 발을 M이라 하면 $\\overline{OM}\\perp\\overline{AB}$예요.',
      '$\\overline{OA}=\\overline{OB}$(반지름)이고 $\\overline{OM}$은 공통이므로 직각삼각형 OAM과 OBM은 합동이에요(RHS). 그래서 $\\overline{AM}=\\overline{BM}$ → 수선은 현을 이등분해요.',
      `직각삼각형 OAM에서 $\\overline{AM}=\\sqrt{R^2-\\overline{OM}^2}=\\sqrt{${M.R}^2-${fmtN(M.d)}^2}=${nt(M.am)}$.`,
      `$\\overline{AB}=2\\overline{AM}=${nt(2 * M.am)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>반지름 R</b>과 <b>중심에서 현까지의 거리 OM</b>을 바꿔 보세요. 점 M은 언제나 현의 한가운데에 있고, AM과 BM은 늘 같아요.',
      readouts: [rd('반지름 R', fmtN(M.R), 'sky'), rd('OM', fmtN(M.d), 'green', '중심에서 현까지의 거리'), rd('AM = BM', ntD(M.am), 'green', 'AM=√(R²−OM²)'), rd('AB', ntD(2 * M.am), 'rose', '현 전체의 길이')],
      rule: '원의 중심에서 현에 내린 수선은 그 현을 이등분한다',
      notes: notes('OM이 0이면 현은 <b>지름</b>이에요. 지름이 가장 긴 현이에요.', '현의 길이를 구할 때는 <b>반쪽(AM)</b>을 먼저 구한 뒤 2배 해요.')
    }),
    prob(M, s) {
      const q = s.ciPk, R = q.R, om = q.om, am = q.am, ab = 2 * am, key = q.key + '#' + (s.ciSeed || 0);
      let stem, ans, wr, meas, tag;
      if (q.kind === 0) {
        tag = '현의 수직이등분 · OM 구하기'; ans = Math.sqrt(R * R - am * am); meas = dist(O, M.g.M);
        stem = `원 O의 반지름의 길이가 ${R} cm이고 현 AB의 길이가 ${ab} cm이다. 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때, $\\overline{OM}$의 길이는?`;
        wr = [[am, '현의 반(AM)과 OM을 헷갈렸어요.'], [R - am, '길이를 빼면 안 돼요. 피타고라스 정리를 써요.'], [ab, '중심에서 현까지의 거리를 구해야 해요.'], [Math.sqrt(Math.abs(R * R - ab * ab)), '현 전체가 아니라 반쪽 AM을 써야 해요.'], [R + am, '길이를 더하면 안 돼요.']];
      } else if (q.kind === 1) {
        tag = '현의 수직이등분 · 현의 길이'; ans = 2 * Math.sqrt(R * R - om * om); meas = dist(M.g.A, M.g.B);
        stem = `원 O의 반지름의 길이가 ${R} cm이다. 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때 $\\overline{OM}=${om}$ cm이다. 현 AB의 길이는?`;
        wr = [[am, '구한 AM은 현의 반쪽이에요. 2배 해야 해요.'], [R + om, '피타고라스 정리를 써요.'], [2 * om, 'OM이 아니라 AM을 구해야 해요.'], [R, '반지름은 현의 길이가 아니에요.'], [2 * R, '지름은 가장 긴 현이에요. OM이 0이 아니면 더 짧아요.']];
      } else {
        tag = '현의 수직이등분 · 반지름 구하기'; ans = Math.sqrt(am * am + om * om); meas = dist(O, M.g.A);
        stem = `원 O의 현 AB의 길이가 ${ab} cm이고 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때 $\\overline{OM}=${om}$ cm이다. 이 원의 반지름의 길이는?`;
        wr = [[ab + om, '길이를 더하면 안 돼요. 직각삼각형 OAM에서 피타고라스 정리를 써요.'], [Math.sqrt(ab * ab + om * om), '현 전체가 아니라 반쪽 AM을 써야 해요.'], [am + om, '두 변의 합이 아니라 빗변이에요.'], [ab, '현의 길이와 반지름은 달라요.'], [am, '구한 길이는 반지름이 아니라 현의 반쪽이에요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 2. 현이 멀어지면 짧아진다 */
  const dist2 = {
    id: 'c1-2', title: '현이 멀어지면 짧아진다', short: '멀어지면 짧아진다',
    question: '반지름이 같은 원에서 중심에서 현까지의 거리 OM을 늘리면 현 AB의 길이는 어떻게 변할까? 가장 긴 현은 어떤 현일까?',
    ctl: ['c1R', 'c1d'],
    init: (s) => { s.c1R = 10; s.c1d = 3; fixRd(s); },
    gen(rnd, n) {
      const kind = n % 2, R = pickR(rnd, [5, 10, 13, 15, 17, 20, 25, 26]);
      const opts = AOR.filter((x) => x[2] === R);
      const a = pickR(rnd, opts); let c = pickR(rnd, opts);
      for (let t = 0; t < 8 && c[1] === a[1]; t++) c = pickR(rnd, opts);
      if (c[1] === a[1]) c = a;
      return { kind, R, a1: a[0], d1: a[1], a2: c[0], d2: c[1], key: `d${kind}.${R}.${a[1]}.${c[1]}` };
    },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, Rfit: q.R, d: q.d1, d2: q.d2, g: chordAt(q.R, q.d1), g2: chordAt(q.R, q.d2, true), am: q.a1 }; }
      fixRd(s);
      const g = chordAt(s.c1R, s.c1d);
      return { R: s.c1R, Rfit: 10, d: s.c1d, g, am: g.h };
    },
    draw(b, s, M, C) {
      const { g, R, d, q } = M, { A, B, M: Mm } = g, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      FIT(b, M.Rfit);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      if (pr) {
        const { A: C1, B: D1, M: N } = M.g2;
        line(b, A, B, 'ink', 3.6); line(b, C1, D1, 'ink', 3.6);
        b.right(Mm, O, B, { size: 13, color: 'amber' }); b.right(N, O, D1, { size: 13, color: 'amber' });
        line(b, O, Mm, 'green', 3); line(b, O, N, 'green', 3);
        pname(b, A, O, 'A'); pname(b, B, O, 'B'); pname(b, C1, O, 'C'); pname(b, D1, O, 'D'); dot(b, O, 'ink', 4.6); dot(b, Mm, 'green', 4.2); dot(b, N, 'green', 4.2);
        T(b, O, 'O', { dx: -15, dy: -14, size: 17 }); T(b, Mm, 'M', { dy: 18, size: 17 }); T(b, N, 'N', { dy: -18, size: 17 });
        const u = (k, v, p, qq, away, tw) => (q.kind === k ? segTag(b, p, qq, 'x', { away, toward: tw, ...X(b) }) : segTag(b, p, qq, v, { away, toward: tw, color: 'sky', size: S(b) }));
        T(b, Mm, `AB=${2 * q.a1}`, { dy: 42, size: S(b), color: 'sky' });
        if (q.kind === 0) T(b, N, 'CD=x', { dy: -44, size: S(b) + 3, color: 'rose' }); else T(b, N, `CD=${2 * q.a2}`, { dy: -44, size: S(b), color: 'sky' });
        segTag(b, O, Mm, String(q.d1), { toward: B, color: 'sky', size: S(b) });
        if (q.kind === 1) segTag(b, O, N, 'x', { toward: D1, ...X(b) }); else segTag(b, O, N, String(q.d2), { toward: D1, color: 'sky', size: S(b) });
        void u;
        return;
      }
      // 현의 가족(연한 선): 거리 0,1,2,… 의 현
      for (let k = 0; k < R; k++) { const c = chordAt(R, k); line(b, c.A, c.B, 'ink', 1.6, { alpha: k === d ? 0 : 0.22 }); }
      line(b, O, Mm, 'green', 3); line(b, O, A, 'ink', 2.4, { alpha: 0.5 }); line(b, O, B, 'ink', 2.4, { alpha: 0.5 });
      line(b, A, B, 'rose', 4.6);
      if (d > 0) b.right(Mm, O, B, { size: 13, color: 'amber' });
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); dot(b, O, 'ink', 4.6); dot(b, Mm, 'green', 4.2);
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: -14, size: 17 }); T(b, Mm, 'M', d > 0 ? { dy: 18, size: 17 } : { dx: 16, dy: 14, size: 17 });
      if (d > 0) rx(b, O, Mm, cv(d), B, 'green');
      T(b, Mm, 'AB=' + cv(2 * g.h), { dy: 44, size: S(b) + 1, color: 'rose' });
      if (ex || st >= 3) T(b, O, d === 0 ? '지름 = 가장 긴 현' : `지름 ${2 * R}`, { dy: -R * b.k * 0.5, size: S(b), color: 'muted' });
    },
    steps: (M) => [
      '중심 O에서 현 AB까지의 거리는 수선의 길이 $\\overline{OM}$이에요.',
      `직각삼각형 OAM에서 $\\overline{AM}^2=R^2-\\overline{OM}^2$이므로 OM이 커질수록 AM(=BM)이 짧아져요. 지금은 $\\overline{AB}=${nt(2 * M.am)}$.`,
      '$\\overline{OM}=0$이면 현은 지름이고 $\\overline{AB}=2R$로 가장 길어요.',
      '그래서 <b>중심에서 가까운 현일수록 길다</b>고 말할 수 있어요.'
    ],
    view: (M) => ({
      guide: '막대로 <b>OM</b>을 늘려 보세요. 연한 선은 거리가 0, 1, 2, …일 때의 현이에요. 거리가 멀어질수록 현이 짧아져요.',
      readouts: [rd('OM', fmtN(M.d), 'green', '중심에서 현까지의 거리'), rd('AB', ntD(2 * M.am), 'rose', '현의 길이'), rd('지름', fmtN(2 * M.R), 'ink', '가장 긴 현')],
      status: M.d === 0 ? { tone: 'key', text: '현이 지름이에요(가장 긴 현)' } : { tone: 'info', text: '거리 OM이 커지면 현 AB는 짧아져요' },
      rule: '한 원에서 중심에 가까운 현일수록 길다 (지름이 가장 긴 현)',
      notes: notes('거리가 같으면 길이가 같아요. 거리가 다르면 <b>더 가까운 현이 더 길어요</b>.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), R = q.R;
      let stem, ans, wr, meas, tag;
      const gA = M.g, gC = M.g2;
      if (q.kind === 0) {
        tag = '중심에서의 거리와 현의 길이 · CD'; ans = 2 * q.a2; meas = dist(gC.A, gC.B);
        stem = `원 O에서 $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$이고 $\\overline{OM}=${q.d1}$ cm, $\\overline{ON}=${q.d2}$ cm, $\\overline{AB}=${2 * q.a1}$ cm일 때, $\\overline{CD}$의 길이는?`;
        wr = [[2 * q.a1, '거리가 다르면 길이도 달라요.'], [q.a2, '구한 값은 현의 반쪽이에요. 2배 해야 해요.'], [q.a1 + q.a2, '현의 길이를 더하면 안 돼요.'], [2 * R, '지름이에요. ON이 0이 아니면 더 짧아요.'], [Math.abs(2 * q.a1 - 2 * q.a2) + 1, '반지름 R을 먼저 구한 뒤 CD를 구해요.']];
      } else {
        tag = '중심에서의 거리와 현의 길이 · ON'; ans = q.d2; meas = dist(O, gC.M);
        stem = `원 O에서 $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$이고 $\\overline{OM}=${q.d1}$ cm, $\\overline{AB}=${2 * q.a1}$ cm, $\\overline{CD}=${2 * q.a2}$ cm일 때, $\\overline{ON}$의 길이는?`;
        wr = [[q.d1, '길이가 다르면 중심에서의 거리도 달라요.'], [q.a2, 'CD의 반쪽이에요. 거리를 구해야 해요.'], [R, '반지름이에요. 중심에서 현까지의 거리가 아니에요.'], [q.a1, 'AB의 반쪽이에요.'], [q.d1 + q.d2, '두 거리를 더하면 안 돼요.']];
      }
      void gA;
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. 중심에서 같은 거리의 두 현 */
  const eqd = {
    id: 'c1-3', title: '중심에서 같은 거리의 두 현', short: '같은 거리의 두 현',
    question: '한 원에서 두 현 AB, CD가 중심에서 같은 거리에 있으면 길이도 같을까? 반대로 두 현의 길이가 같으면 거리는 어떨까?',
    ctl: ['c1R', 'c1d', 'c1d2'],
    init: (s) => { s.c1R = 10; s.c1d = 6; s.c1d2 = 6; fixRd(s); },
    gen(rnd, n) {
      const kind = n % 3, [am, om, R] = pickR(rnd, AOR);
      return { kind, am, om, R, key: `e${kind}.${am}.${om}.${R}` };
    },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, Rfit: q.R, d1: q.om, d2: q.om, g1: chordAt(q.R, q.om), g2: chordAt(q.R, q.om, true) }; }
      fixRd(s);
      return { R: s.c1R, Rfit: 10, d1: s.c1d, d2: s.c1d2, g1: chordAt(s.c1R, s.c1d), g2: chordAt(s.c1R, s.c1d2, true) };
    },
    draw(b, s, M, C) {
      const { R, d1, d2, g1, g2, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      const eq = d1 === d2;
      FIT(b, M.Rfit);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      const col1 = !pr && (ex || st >= 3) ? (eq ? 'green' : 'ink') : 'ink';
      line(b, g1.A, g1.B, col1, 3.8); line(b, g2.A, g2.B, col1, 3.8);
      line(b, O, g1.M, 'green', 3); line(b, O, g2.M, 'green', 3); line(b, O, g1.A, 'ink', 2.4, { alpha: 0.8 });
      if (d1 > 0) b.right(g1.M, O, g1.B, { size: 13, color: 'amber' });
      if (d2 > 0) b.right(g2.M, O, g2.B, { size: 13, color: 'amber' });
      const eqShow = pr ? q.kind !== 1 : (ex || st >= 2) && eq;
      if (eqShow && pr) { tick(b, O, g1.M, 1, 'amber'); tick(b, O, g2.M, 1, 'amber'); }
      if (!pr && (ex || st >= 2) && eq) { tick(b, O, g1.M, 1, 'amber'); tick(b, O, g2.M, 1, 'amber'); }
      if ((pr && q.kind === 1) || (!pr && (ex || st >= 3) && eq)) { tick(b, g1.A, g1.B, 2, 'amber'); tick(b, g2.A, g2.B, 2, 'amber'); }
      pname(b, g1.A, O, 'A'); pname(b, g1.B, O, 'B'); pname(b, g2.A, O, 'C'); pname(b, g2.B, O, 'D'); dot(b, O, 'ink', 4.6); dot(b, g1.M, 'green', 4.2); dot(b, g2.M, 'green', 4.2);
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: -2, size: 17 }); T(b, g1.M, 'M', { dy: 18, size: 17 }); T(b, g2.M, 'N', { dy: -18, size: 17 });
      if (pr) {
        const lbl = (k, v, p2, q2, tw, name) => (q.kind === k ? segTag(b, p2, q2, 'x', { toward: tw, ...X(b) }) : segTag(b, p2, q2, String(v), { toward: tw, color: 'sky', size: S(b) }));
        if (q.kind === 0) { segTag(b, O, g1.M, String(q.om), { toward: g1.B, color: 'sky', size: S(b) }); T(b, g2.M, 'CD=x', { dy: -44, size: S(b) + 3, color: 'rose' }); }
        if (q.kind === 1) { T(b, g1.M, `AB=${2 * q.am}`, { dy: 42, size: S(b), color: 'sky' }); segTag(b, O, g2.M, 'x', { toward: g2.B, ...X(b) }); }
        if (q.kind === 2) { segTag(b, O, g1.M, String(q.om), { toward: g1.B, color: 'sky', size: S(b) }); T(b, g2.M, `CD=${2 * q.am}`, { dy: -44, size: S(b), color: 'sky' }); segTag(b, O, g1.A, 'x', { away: g1.M, ...X(b) }); }
        if (q.kind !== 2) segTag(b, O, g1.A, String(q.R), { away: g1.M, color: 'sky', size: S(b) });
        void lbl;
        return;
      }
      if (d1 > 0) rx(b, O, g1.M, cv(d1), g1.B, 'green'); if (d2 > 0) rx(b, O, g2.M, cv(d2), g2.B, 'green');
      T(b, g1.M, 'AB=' + cv(2 * g1.h), { dy: 44, size: S(b), color: 'sky' }); T(b, g2.M, 'CD=' + cv(2 * g2.h), { dy: -44, size: S(b), color: 'sky' });
    },
    steps: (M) => [
      '중심 O에서 두 현에 내린 수선의 발을 M, N이라 해요. $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$.',
      `$\\overline{OM}=\\overline{ON}$이고 $\\overline{OA}=\\overline{OC}$(반지름)이므로 $\\overline{AM}=\\sqrt{R^2-\\overline{OM}^2}=\\overline{CN}$이에요.`,
      '수선은 현을 이등분하므로 $\\overline{AB}=2\\overline{AM}=2\\overline{CN}=\\overline{CD}$ → <b>거리가 같으면 길이가 같다</b>.',
      '거꾸로 $\\overline{AB}=\\overline{CD}$이면 $\\overline{AM}=\\overline{CN}$이므로 $\\overline{OM}=\\overline{ON}$이에요.'
    ],
    view: (M) => {
      const eq = M.d1 === M.d2, l1 = 2 * M.g1.h, l2 = 2 * M.g2.h;
      return {
        guide: '막대로 <b>OM</b>과 <b>ON</b>을 바꿔 보세요. 두 거리가 같아지는 순간 두 현의 길이도 같아져요. 더 가까운 현이 더 길어요.',
        readouts: [rd('OM', fmtN(M.d1), 'green'), rd('ON', fmtN(M.d2), 'rose'), rd('AB', ntD(l1), 'sky'), rd('CD', ntD(l2), 'sky')],
        status: eq ? { tone: 'ok', text: 'OM = ON → AB = CD' } : { tone: 'info', text: M.d1 < M.d2 ? 'OM < ON → AB > CD (가까운 현이 더 길어요)' : 'OM > ON → AB < CD (가까운 현이 더 길어요)' },
        rule: '중심에서 같은 거리에 있는 두 현의 길이는 같다 (그 역도 성립)',
        notes: notes('현의 길이가 같다는 것과 <b>호의 길이가 같다</b>는 것은 같은 뜻이에요(같은 크기의 중심각).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), R = q.R, om = q.om, am = q.am;
      let stem, ans, wr, meas, tag;
      if (q.kind === 0) {
        tag = '같은 거리의 두 현 · CD'; ans = 2 * am; meas = dist(M.g2.A, M.g2.B);
        stem = `원 O에서 $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$이고 $\\overline{OM}=\\overline{ON}=${om}$ cm이다. 반지름의 길이가 ${R} cm일 때, $\\overline{CD}$의 길이는?`;
        wr = [[am, '구한 값은 현의 반쪽이에요. 2배 해야 해요.'], [om * 2, 'OM의 2배가 아니라 현의 길이를 구해야 해요.'], [R, '반지름은 현의 길이가 아니에요.'], [2 * R, '지름보다 짧아요.'], [R - om, '피타고라스 정리를 써요.']];
      } else if (q.kind === 1) {
        tag = '같은 길이의 두 현 · ON'; ans = om; meas = dist(O, M.g2.M);
        stem = `원 O에서 $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$이고 $\\overline{AB}=\\overline{CD}=${2 * am}$ cm이다. 반지름의 길이가 ${R} cm일 때, $\\overline{ON}$의 길이는?`;
        wr = [[am, '현의 반쪽이에요. 중심에서 현까지의 거리를 구해야 해요.'], [R - am, '길이를 빼면 안 돼요. 피타고라스 정리를 써요.'], [R, '반지름이에요.'], [2 * am, '현의 길이예요.'], [2 * om, 'ON은 OM과 같고, 2배가 아니에요.']];
      } else {
        tag = '같은 거리의 두 현 · 반지름'; ans = R; meas = dist(O, M.g1.A);
        stem = `원 O에서 $\\overline{OM}\\perp\\overline{AB}$, $\\overline{ON}\\perp\\overline{CD}$이고 $\\overline{OM}=\\overline{ON}=${om}$ cm, $\\overline{CD}=${2 * am}$ cm일 때, 원 O의 반지름의 길이는?`;
        wr = [[am + om, '길이를 더하면 안 돼요. 피타고라스 정리를 써요.'], [am, '현의 반쪽이에요.'], [2 * am, 'CD의 길이예요.'], [Math.sqrt(4 * am * am + om * om), '현의 반쪽(CN)을 써야 해요.'], [Math.abs(am - om) + 1, '직각삼각형 OCN에서 빗변을 구해요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. 동심원과 접하는 현 */
  const conc = {
    id: 'c1-4', title: '동심원과 접하는 현', short: '동심원과 접하는 현',
    question: '중심이 같은 두 원에서 큰 원의 현 AB가 작은 원에 접한다. 접점 M은 현의 어디에 있고, 두 원 사이의 넓이는 얼마일까?',
    ctl: ['c1R', 'c1r'],
    init: (s) => { s.c1R = 10; s.c1r = 6; fixRd(s); },
    gen(rnd, n) {
      const [am, om, R] = pickR(rnd, AOR.filter((x) => x[2] - x[1] >= 2)), kind = n % 3;
      return { kind, am, om, R, key: `c${kind}.${am}.${om}.${R}` };
    },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, r: q.om, Rfit: q.R, g: chordAt(q.R, q.om), am: q.am }; }
      fixRd(s);
      const g = chordAt(s.c1R, s.c1r);
      return { R: s.c1R, r: s.c1r, Rfit: 10, g, am: g.h };
    },
    draw(b, s, M, C) {
      const { g, R, r, q } = M, { A, B, M: Mm } = g, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      FIT(b, M.Rfit);
      circle(b, O, R, 'ink', 3.6);
      if (pr && q.kind === 2) circle(b, O, r, 'ink', 0, { fill: 'rose', fa: 0.18 });
      else if (pr || ex || st >= 3) fillRing(b, O, R, r, 'rose', 0.18);
      circle(b, O, r, 'green', 3.2, { fill: 'green', fa: 0.06 });
      line(b, A, B, 'ink', 3.6); line(b, O, A, 'ink', 2.6); line(b, O, Mm, 'green', 3);
      b.right(Mm, O, B, { size: 13, color: 'amber' });
      if (!pr && (ex || st >= 2)) { tick(b, A, Mm, 1, 'amber'); tick(b, Mm, B, 1, 'amber'); }
      pname(b, A, O, 'A'); pname(b, B, O, 'B'); dot(b, O, 'ink', 4.6); dot(b, Mm, 'green', 4.4);
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: -14, size: 17 }); T(b, Mm, 'M', { dy: 18, size: 17 });
      // 반지름 R (OA), r (OM)
      if (!pr || q.kind !== 1) rx(b, O, A, cv(R), Mm);
      if (!pr || q.kind === 0) segTag(b, O, Mm, cv(r), { toward: B, color: 'green', size: S(b), gap: 11 });
      if (pr) {
        T(b, Mm, q.kind === 0 ? '' : `AB=${2 * q.am}`, { dy: 42, size: S(b), color: 'sky' });
        T(b, pt(0, q.kind === 2 ? -r * 0.55 : -(R + r) / 2), 'x', { size: S(b) + 4, color: 'rose' });
      } else if (ex || st >= 3) {
        T(b, Mm, 'AM=' + cv(g.h), { dy: 66, size: S(b) - 1, color: 'green' });
      }
    },
    steps: (M) => [
      '큰 원의 현 AB가 작은 원에 접하는 점을 M이라 하면 접선은 반지름에 수직이므로 $\\overline{OM}\\perp\\overline{AB}$예요.',
      '수선은 현을 이등분하므로 $\\overline{AM}=\\overline{BM}$이고, 직각삼각형 OAM에서 $\\overline{AM}^2=R^2-r^2$이에요.',
      `색칠한 부분의 넓이 $=\\pi R^2-\\pi r^2=\\pi(R^2-r^2)=\\pi\\,\\overline{AM}^2=${nt(M.am * M.am)}\\pi$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>큰 원의 반지름 R</b>과 <b>작은 원의 반지름 r</b>을 바꿔 보세요. 현 AB는 늘 작은 원에 접하고, 색칠한 넓이는 R·r이 아니라 <b>AM²</b>만으로 정해져요.',
      readouts: [rd('R', fmtN(M.R), 'sky'), rd('r = OM', fmtN(M.r), 'green'), rd('AM', ntD(M.am), 'green'), rd('색칠한 넓이', `$${nt(M.am * M.am)}\\pi$`, 'rose', 'π(R²−r²) = π·AM²')],
      rule: '두 원 사이의 넓이 = π(R²−r²) = π·AM²  (AM = 접하는 현의 반)',
      notes: notes('넓이는 <b>R과 r을 따로 몰라도</b> 현 AB의 길이만으로 구할 수 있어요: $\\pi\\left(\\frac{AB}{2}\\right)^2$.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), R = q.R, r = q.om, am = q.am;
      let stem, ans, wr, meas, tag;
      const ring = Math.PI * (R * R - r * r) / Math.PI; // π 의 계수
      if (q.kind === 0) {
        tag = '동심원 · 색칠한 넓이'; ans = R * R - r * r; meas = Math.hypot(M.g.A.x - M.g.M.x, M.g.A.y - M.g.M.y) ** 2;
        stem = `중심이 같은 두 원의 반지름이 각각 ${R} cm, ${r} cm이다. 큰 원의 현 AB가 작은 원에 접할 때, 색칠한 부분(두 원 사이)의 넓이 $x$는?`;
        wr = [[R * R + r * r, '두 원의 넓이를 더하면 안 돼요. 큰 원에서 작은 원을 빼요.'], [(R - r) * (R - r), '반지름의 차를 제곱하면 안 돼요. R²−r²이에요.'], [R * R, '큰 원의 넓이예요.'], [r * r, '작은 원의 넓이예요.'], [(R + r) * (R - r) / 2, '넓이는 π(R²−r²)이에요.']];
      } else if (q.kind === 1) {
        tag = '동심원 · 현의 길이로 넓이'; ans = am * am; meas = (dist(M.g.A, M.g.B) / 2) ** 2;
        stem = `중심이 같은 두 원에서 큰 원의 현 AB가 작은 원에 접하고 $\\overline{AB}=${2 * am}$ cm이다. 색칠한 부분(두 원 사이)의 넓이 $x$는?`;
        wr = [[am * am * 4, '현 전체가 아니라 반쪽 AM을 제곱해요.'], [am * am * 2, 'π·AM²이에요.'], [am, '넓이이므로 제곱해야 해요.'], [am * 2, '넓이는 π·AM²이에요.'], [am * am / 2 + am, 'π(R²−r²)=π·AM²이에요.']];
      } else {
        tag = '동심원 · 작은 원의 넓이'; ans = r * r; meas = M.g.M.y ** 2;
        stem = `중심이 같은 두 원에서 큰 원의 반지름이 ${R} cm이고, 큰 원의 현 AB가 작은 원에 접한다. $\\overline{AB}=${2 * am}$ cm일 때, 작은 원의 넓이 $x$는?`;
        wr = [[am * am, '이것은 두 원 사이의 넓이예요.'], [R * R, '큰 원의 넓이예요.'], [R * R + am * am, '작은 원의 반지름은 피타고라스 정리로 구해요.'], [(R - am) * (R - am), '반지름은 R−AM이 아니라 √(R²−AM²)이에요.'], [r * 2, '넓이이므로 제곱해야 해요.']];
      }
      void ring;
      return { tag, key, stem, choices: G.mkPi(ans, wr, { pad: 3 }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 접기 (c1-5, c1-6) */
  // 현 AB(거리 d) 아래쪽 호를 현을 경첩으로 접은 모습. f: 0(펼침)~1(접음)
  function foldGeo(R, d, f) {
    const al = Math.asin(clamp(d / R, 0, 1)) / DEG, A = mp(O, R, 180 + al), B = mp(O, R, 360 - al);
    const cf = Math.cos(Math.PI * f);
    const arc = arcPts(O, R, 180 + al, 360 - al, 64);
    const folded = arc.map((p) => pt(p.x, d + (p.y - d) * cf));
    return { al, A: pt(A.x, d), B: pt(B.x, d), arc, folded, Op: pt(0, 2 * d), h: half(R, d) };
  }
  function foldDraw(b, M, C, fold, opt) {
    const { R, d, f } = M, F = foldGeo(R, d, f), st = C.step, pr = C.problem;
    fit(b, { x0: -M.Rfit, x1: M.Rfit, y0: -M.Rfit, y1: Math.max(M.Rfit, 2 * d + 0.2) }, { t: 48, b: 40, l: 36, r: 36 });
    const al = F.al;
    // 큰 호(위쪽)
    arcD(b, O, R, -al, 180 + al, 'ink', 3.6);
    // 접히는 부분(아래쪽 작은 활꼴)
    if (f > 0.02) { b.path(F.arc, { color: 'ink', width: 2.4, dash: [6, 6], alpha: 0.4 }); }
    const flap = F.folded.slice();
    b.path(flap, { close: true, fill: 'rose', fillAlpha: 0.2, color: null });
    b.path(F.folded, { color: f > 0.02 ? 'rose' : 'ink', width: f > 0.02 ? 4.4 : 3.6 });
    line(b, F.A, F.B, 'ink', 3.6);
    pname(b, F.A, O, 'A'); pname(b, F.B, O, 'B'); dot(b, O, 'ink', 4.8);
    const Mm = pt(0, d);
    dot(b, Mm, 'green', 4.2);
    if (d > 0) { line(b, O, Mm, 'green', 3); b.right(Mm, O, F.B, { size: 13, color: 'amber' }); }
    line(b, O, F.A, 'ink', 2.4, { alpha: 0.7 }); line(b, O, F.B, 'ink', 2.4, { alpha: 0.7 });
    if (opt && opt.showOp) { dot(b, F.Op, 'violet', 4.6); line(b, F.Op, O, 'violet', 2.2, { dash: [5, 5] }); line(b, F.Op, F.A, 'violet', 2.4, { alpha: 0.8 }); line(b, F.Op, F.B, 'violet', 2.4, { alpha: 0.8 }); }
    return F;
  }
  const foldBase = (id, title, short, question, o) => ({
    id, title, short, question, ctl: o.ctl, anim: { key: 'c1f', dur: 5, label: '접어 보기', start: 0 },
    init: o.init, gen: o.gen,
    model: o.model, draw: o.draw, steps: o.steps, view: o.view, prob: o.prob,
    stepT: o.stepT
  });
  const fold = foldBase('c1-5', '원 접기: 호가 중심을 지나게', '원 접기', '원 O의 호 AB를 현 AB를 접는 선으로 접었더니 접힌 호가 중심 O를 지났다. OM, AB의 길이와 ∠AOB는 R로 어떻게 나타날까?', {
    ctl: ['c1R', 'c1f'],
    init: (s) => { s.c1R = 10; s.c1f = 0; fixRd(s); },
    gen(rnd, n) {
      const kind = n % 4, k = pickR(rnd, [2, 3, 4, 5, 6, 7, 8, 9, 10]), R = pickR(rnd, [4, 6, 8, 10, 12]);
      return kind === 1 ? { kind, k, R: k, key: `f1.${k}` } : { kind, k, R, key: `f${kind}.${R}.${k}` };
    },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, d: q.R / 2, f: 1, Rfit: q.R }; }
      fixRd(s);
      return { R: s.c1R, d: s.c1R / 2, f: C.tab === 'explore' || C.tab === 'review' ? s.c1f : 1, Rfit: 10 };
    },
    draw(b, s, M, C) {
      const { R, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', d = R / 2;
      const F = foldDraw(b, M, C, null, { showOp: !pr && (ex ? M.f > 0.95 : st >= 2) });
      if (!C.txt) return;
      const Mm = pt(0, d), done = M.f > 0.97;
      T(b, O, 'O', { dx: -15, dy: -14, size: 17 }); T(b, Mm, 'M', { dx: 18, dy: 14, size: 17 });
      if (!pr && (ex ? done : st >= 2)) T(b, F.Op, "O′", { dy: 20, size: 17, color: 'violet' });
      if (pr) {
        if (q.kind === 0 || q.kind === 2) segTag(b, O, F.A, String(R), { away: Mm, color: 'sky', size: S(b) });
        if (q.kind === 1) segTag(b, O, F.A, 'x', { away: Mm, ...X(b) });
        if (q.kind === 2) segTag(b, O, Mm, 'x', { toward: F.B, ...X(b) });
        if (q.kind === 3) { segTag(b, O, F.A, String(R), { away: Mm, color: 'sky', size: S(b) }); }
        T(b, Mm, q.kind === 0 ? 'AB=x' : q.kind === 1 ? `AB=${cv(Math.sqrt(3) * q.k)}` : '', { dy: 42, size: S(b) + (q.kind === 0 ? 3 : 0), color: q.kind === 1 ? 'sky' : 'rose' });
        if (q.kind === 3) {
          const radiusPx = R * b.k;
          ang(b, O, F.A, F.B, { color: 'rose', r: clamp(radiusPx * .14, 10, 28), label: 'x', labelDist: clamp(radiusPx * .28, 18, 42), size: S(b) + 3 });
          T(b, Mm, '∠AOB=x', { dy: 56, size: S(b), color: 'rose' });
        }
        return;
      }
      segTag(b, O, F.A, cv(R), { away: Mm, color: 'sky', size: S(b) });
      if (ex || st >= 3) segTag(b, O, Mm, cv(d), { toward: F.B, color: 'green', size: S(b) });
      if (ex || st >= 4) { T(b, Mm, 'AB=' + cv(Math.sqrt(3) * R), { dy: 42, size: S(b), color: 'rose' }); ang(b, O, F.A, F.B, { color: 'rose', r: 34, label: '120°', size: S(b) }); }
    },
    stepT: (n) => (n >= 1 ? 1 : 0),
    steps: (M) => [
      '호 AB를 현 AB를 접는 선으로 접으면 접힌 호를 포함하는 원은 원 O를 현 AB에 대칭이동한 원이에요. 그 중심을 O′이라 하면 반지름은 R로 같고, M은 $\\overline{OO^{\\prime}}$의 중점이에요.',
      '접힌 호가 중심 O를 지나므로 $\\overline{O^{\\prime}O}=R$이에요. 그래서 삼각형 OAO′은 세 변이 모두 R인 정삼각형이에요.',
      `$\\overline{OM}=\\frac{1}{2}\\overline{OO^{\\prime}}=\\frac{R}{2}=${nt(M.R / 2)}$.`,
      `직각삼각형 OAM에서 $\\overline{OA}=R,\\ \\overline{OM}=\\frac{R}{2}$이므로 $\\angle OAM=30^{\\circ}$, $\\overline{AM}=\\frac{\\sqrt{3}}{2}R$. 따라서 $\\overline{AB}=\\sqrt{3}R=${nt(Math.sqrt(3) * M.R)}$, $\\angle AOB=120^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>접기</b>를 끌거나 ▶를 눌러 보세요. 호가 현 AB를 따라 접혀 올라와 <b>중심 O를 딱 지나요</b>. 반지름 R을 바꿔도 OM은 늘 <b>R의 절반</b>이에요.',
      readouts: [rd('반지름 R', fmtN(M.R), 'sky'), rd('OM', ntD(M.R / 2), 'green', 'OM = R의 절반'), rd('AB', ntD(Math.sqrt(3) * M.R), 'rose', 'AB = √3 R'), rd('∠AOB', '120°', 'rose', '중심각')],
      rule: '접힌 호가 중심 O를 지나면 $OM=\\frac{R}{2}$, $AB=\\sqrt{3}R$, $\\angle AOB=120^{\\circ}$',
      notes: notes('접은 부분은 접는 선에 대해 <b>대칭</b>이므로 접힌 호의 반지름도 R이에요.', 'OM과 반지름 OA로 직각삼각형을 만들면 1 : 2 : √3 꼴(30°, 60°, 90°)이 나와요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), R = q.R, k = q.k, r3 = Math.sqrt(3);
      let stem, ans, wr, meas, tag, ch;
      const A = foldGeo(R, R / 2, 1);
      if (q.kind === 0) {
        tag = '원 접기 · AB'; ans = r3 * R; meas = dist(A.A, A.B);
        stem = `반지름의 길이가 ${R} cm인 원 O의 호 AB를 현 AB를 접는 선으로 접었더니 접힌 호가 원의 중심 O를 지났다. $\\overline{AB}$의 길이는?`;
        wr = [[R, '접는 선 AB는 반지름보다 길어요.'], [R * r3 / 2, '구한 값은 AM이에요. 2배 해야 해요.'], [2 * R, '지름이에요. AB는 지름보다 짧아요.'], [R / 2, '이것은 OM이에요.'], [R * Math.sqrt(2), '직각삼각형 OAM의 각은 30°, 60°예요.']];
        ch = mkNum(ans, wr, { unit: 'cm' });
      } else if (q.kind === 1) {
        tag = '원 접기 · 반지름'; ans = k; meas = dist(O, A.A) * 0 + k;
        stem = `원 O의 호 AB를 현 AB를 접는 선으로 접었더니 접힌 호가 원의 중심 O를 지났다. $\\overline{AB}=${k}\\sqrt{3}$ cm일 때, 원 O의 반지름의 길이는?`;
        wr = [[k * r3, 'AB는 √3 R이므로 R로 나누어 구해요.'], [k / 2, '반지름은 AB의 절반이 아니에요.'], [2 * k, 'AB=√3R에서 R을 구해요.'], [k * 3, 'AB=√3R에서 R을 구해요.'], [k / r3, 'AB=√3R이에요.']];
        ch = mkNum(ans, wr, { unit: 'cm' });
        meas = dist(foldGeo(k, k / 2, 1).A, foldGeo(k, k / 2, 1).B) / r3;
      } else if (q.kind === 2) {
        tag = '원 접기 · OM'; ans = R / 2; meas = dist(O, pt(0, R / 2));
        stem = `반지름의 길이가 ${R} cm인 원 O의 호 AB를 현 AB를 접는 선으로 접었더니 접힌 호가 원의 중심 O를 지났다. 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때, $\\overline{OM}$의 길이는?`;
        wr = [[R, '반지름이에요. OM은 그 절반이에요.'], [R / 3, 'OM은 R의 $\\frac{1}{3}$이 아니라 절반이에요.'], [R * r3 / 2, '이것은 AM이에요.'], [2 * R, '반지름보다 짧아요.'], [R / 4, '접힌 호가 O를 지나면 OM=R/2이에요.'.replace('R/2', 'R의 절반')]];
        ch = mkNum(ans, wr, { unit: 'cm' });
      } else {
        tag = '원 접기 · 중심각'; ans = 120; meas = Math.acos((R / 2) / R) / DEG * 2;
        stem = `반지름의 길이가 ${R} cm인 원 O의 호 AB를 현 AB를 접는 선으로 접었더니 접힌 호가 원의 중심 O를 지났다. $\\angle AOB$의 크기는?`;
        wr = [[60, '정삼각형의 각이에요. ∠AOB는 그 두 배예요.'], [90, 'OM=R/2이면 직각이 아니에요.'], [150, '∠OAM=30°이므로 ∠AOM=60°예요.'], [135, '∠OAM=30°이므로 ∠AOM=60°예요.'], [30, '∠OAM=30°이에요. ∠AOB는 그 4배예요.']];
        ch = G.mkChoices(ans, wr, { pad: 10 });
      }
      return { tag, key, stem, choices: ch, chk: [meas, ans] };
    }
  });

  const slide = foldBase('c1-6', '접는 위치와 접힌 호', '접는 위치', '접는 선 AB를 중심 O에서 멀게, 가깝게 바꾸면 접힌 호는 중심 O의 어디를 지날까? O′은 O를 접는 선에 대해 대칭이동한 점이다.', {
    ctl: ['c1R', 'c1d', 'c1f'],
    init: (s) => { s.c1R = 10; s.c1d = 5; s.c1f = 1; fixRd(s); },
    gen(rnd, n) {
      const kind = n % 3, k = pickR(rnd, [2, 3, 4, 5, 6, 7, 8, 9]);
      return { kind, k, key: `s${kind}.${k}` };
    },
    model(s, C) {
      if (C.problem) { const q = s.ciPk, R = 2 * q.k; return { q, R, d: q.k, f: 1, Rfit: R }; }
      fixRd(s);
      return { R: s.c1R, d: s.c1d, f: C.tab === 'explore' ? s.c1f : 1, Rfit: 10 };
    },
    draw(b, s, M, C) {
      const { R, d, q } = M, pr = C.problem, ex = C.tab === 'explore', st = C.step;
      const F = foldDraw(b, M, C, null, { showOp: true });
      if (!C.txt) return;
      const Mm = pt(0, d), o2 = 2 * d;
      T(b, O, 'O', { dx: -15, dy: -14, size: 17 }); T(b, Mm, 'M', { dx: 18, dy: 12, size: 17 });
      T(b, F.Op, "O′", { dy: 22, size: 17, color: 'violet' });
      if (pr) {
        if (q.kind === 0) { segTag(b, O, F.A, String(R), { away: Mm, color: 'sky', size: S(b) }); segTag(b, O, Mm, 'x', { toward: F.B, ...X(b) }); }
        if (q.kind === 1) { segTag(b, O, Mm, String(q.k), { toward: F.B, color: 'sky', size: S(b) }); T(b, Mm, 'AB=x', { dy: 42, size: S(b) + 3, color: 'rose' }); }
        if (q.kind === 2) { segTag(b, O, Mm, String(q.k), { toward: F.B, color: 'sky', size: S(b) }); segTag(b, O, F.A, 'x', { away: Mm, ...X(b) }); }
        return;
      }
      segTag(b, O, F.A, cv(R), { away: Mm, color: 'sky', size: S(b) });
      if (d > 0) segTag(b, O, Mm, cv(d), { toward: F.B, color: 'green', size: S(b) });
      if (ex || st >= 2) T(b, Mm, `OO′=${cv(o2)}`, { dx: -66, dy: R * b.k * 0.02 + 26, size: S(b) - 1, color: 'violet' });
    },
    stepT: () => 1,
    steps: (M) => [
      '호 AB를 접으면 접힌 호를 포함한 원의 중심은 O를 현 AB에 대칭이동한 점 O′이에요. $\\overline{OO^{\\prime}}=2\\,\\overline{OM}$이고 접힌 호의 반지름은 R이에요.',
      `접힌 호가 중심 O를 지나려면 O에서 O′까지의 거리가 반지름 R과 같아야 해요. 즉 $2\\,\\overline{OM}=R$, $\\overline{OM}=\\frac{R}{2}$.`,
      `지금은 $2\\,\\overline{OM}=${fmtN(2 * M.d)}$, $R=${fmtN(M.R)}$이므로 ${2 * M.d < M.R ? 'O는 접힌 호의 안쪽에 있어요(접힌 호가 O를 넘어가요)' : 2 * M.d > M.R ? '접힌 호가 O에 닿지 못해요' : '접힌 호가 정확히 O를 지나요'}.`
    ],
    view: (M) => {
      const t = 2 * M.d, c = t === M.R ? 'ok' : 'info';
      return {
        guide: '막대로 <b>OM</b>(접는 선까지의 거리)과 R을 바꿔 보세요. <b>2·OM = R</b>일 때만 접힌 호가 중심 O를 지나요.',
        readouts: [rd('OM', fmtN(M.d), 'green'), rd('OO′ = 2·OM', fmtN(t), 'violet'), rd('R', fmtN(M.R), 'sky')],
        status: t === M.R ? { tone: 'ok', text: '접힌 호가 O를 지나요 (OM = R의 절반)' } : t < M.R ? { tone: 'info', text: '2·OM < R → O가 접힌 호 안쪽에 있어요' } : { tone: 'warn', text: '2·OM > R → 접힌 호가 O에 닿지 못해요' },
        rule: '접힌 호가 중심 O를 지날 필요충분조건은 $OM=\\frac{R}{2}$',
        notes: notes(c === 'ok' ? '이때 AB=√3R, ∠AOB=120°예요.' : 'OM이 R의 절반보다 작으면 호를 접었을 때 중심 O를 지나 넘어가요.', '접은 도형은 접는 선에 대해 대칭이에요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), k = q.k, R = 2 * k, r3 = Math.sqrt(3);
      let stem, ans, wr, meas, tag;
      const F = foldGeo(R, k, 1);
      if (q.kind === 0) {
        tag = '접는 위치 · OM'; ans = R / 2; meas = dist(O, F.Op) / 2;
        stem = `반지름의 길이가 ${R} cm인 원 O의 호 AB를 접었더니 접힌 호가 원의 중심 O를 지났다. 점 O에서 현 AB에 내린 수선의 발을 M이라 할 때, $\\overline{OM}$의 길이는?`;
        wr = [[R, '반지름이에요.'], [R / 3, '접힌 호가 O를 지나면 OM=R의 절반이에요.'], [R / 4, '접힌 호가 O를 지나면 OM=R의 절반이에요.'], [R * r3 / 2, 'AM이에요.'], [2 * R, '반지름보다 짧아요.']];
      } else if (q.kind === 1) {
        tag = '접는 위치 · AB'; ans = 2 * r3 * k; meas = dist(F.A, F.B);
        stem = `원 O의 호 AB를 접었더니 접힌 호가 원의 중심 O를 지났다. 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때 $\\overline{OM}=${k}$ cm이다. $\\overline{AB}$의 길이는?`;
        wr = [[r3 * k, 'AM이에요. 2배 해야 해요.'], [2 * k, 'OM의 2배는 반지름이에요.'], [4 * k, '지름이에요.'], [3 * k, 'AB=√3R이에요.'], [k * Math.sqrt(2) * 2, '30°, 60°, 90° 삼각형을 써요.']];
      } else {
        tag = '접는 위치 · 반지름'; ans = R; meas = dist(O, F.Op);
        stem = `원 O의 호 AB를 접었더니 접힌 호가 원의 중심 O를 지났다. 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때 $\\overline{OM}=${k}$ cm이다. 원 O의 반지름의 길이는?`;
        wr = [[k, 'OM은 반지름의 절반이에요.'], [3 * k, 'R=2·OM이에요.'], [4 * k, 'R=2·OM이에요.'], [k * r3, 'AM이에요.'], [k / 2, 'R=2·OM이에요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  });

  /* ====================================================================== 7. 아치의 반지름 */
  const ARCH = [[3, 1, 5], [4, 2, 5], [6, 2, 10], [8, 4, 10], [5, 1, 13], [8, 2, 17], [12, 4, 20], [12, 8, 13], [9, 3, 15]];
  const archGeo = (am, h) => { const R = (am * am + h * h) / (2 * h); return { am, h, R, A: pt(-am, 0), B: pt(am, 0), M: pt(0, 0), C: pt(0, -h), Oc: pt(0, R - h) }; };
  const arch = {
    id: 'c1-7', title: '아치(깨진 접시)의 반지름', short: '아치의 반지름',
    question: '아치 모양의 다리나 깨진 접시 조각에서 현 AB의 길이와 높이 CM만 알면 원래 원의 반지름 R을 구할 수 있을까?',
    ctl: ['c1w', 'c1h'],
    init: (s) => { s.c1w = 8; s.c1h = 2; },
    gen(rnd, n) { const [am, h, R] = pickR(rnd, ARCH), kind = n % 3; return { kind, am, h, R, key: `a${kind}.${am}.${h}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk, g = archGeo(q.am, q.h); return { q, g, am: q.am, h: q.h, R: g.R }; }
      const am = clamp(Math.round(s.c1w) / 2, 2, 8), h = clamp(Math.round(s.c1h), 1, Math.min(6, am));
      s.c1h = h;
      const g = archGeo(am, h);
      return { g, am, h, R: g.R };
    },
    draw(b, s, M, C) {
      const { g, am, h, R, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      const { A, B, M: Mm, C: Cc, Oc } = g;
      fit(b, { x0: -Math.max(am, R) , x1: Math.max(am, R), y0: -h - 0.4, y1: Math.max(R - h, 0) + R * 0.05 + 0.8 }, { t: 52, b: 50, l: 40, r: 40 });
      const b0 = Math.atan2(R - h, am) / DEG;
      circle(b, Oc, R, 'ink', 2, { dash: [6, 6], alpha: 0.35 });
      arcD(b, Oc, R, b0, 180 - b0, 'ink', 4.2);
      line(b, A, B, 'ink', 3.6);
      const showO = pr ? true : ex || st >= 1;
      if (showO) { line(b, Oc, A, 'ink', 2.6); line(b, Oc, Cc, 'ink', 2.4); }
      if (showO && (pr || ex || st >= 2)) { fillPoly(b, [Oc, A, Mm], 'green', 0.12); b.right(Mm, A, Cc, { size: 13, color: 'amber' }); }
      dot(b, A, 'ink'); dot(b, B, 'ink'); dot(b, Cc, 'rose', 4.8); dot(b, Mm, 'green', 4.2); if (showO) dot(b, Oc, 'ink', 4.8);
      if (!pr && (ex || st >= 2)) { tick(b, A, Mm, 1, 'amber'); tick(b, Mm, B, 1, 'amber'); }
      if (!C.txt) return;
      T(b, A, 'A', { dx: -16, dy: 4, size: 17 }); T(b, B, 'B', { dx: 16, dy: 4, size: 17 }); T(b, Cc, 'C', { dy: -17, size: 17 }); T(b, Mm, 'M', { dy: 17, size: 17 });
      if (showO) T(b, Oc, 'O', { dx: 16, dy: 14, size: 17 });
      if (pr) {
        T(b, lerp(A, Mm, 0.5), q.kind === 1 ? 'AB=x' : `AB=${2 * q.am}`, { dy: 30, size: S(b) + (q.kind === 1 ? 3 : 0), color: q.kind === 1 ? 'rose' : 'sky' });
        segTag(b, Mm, Cc, q.kind === 2 ? 'x' : String(q.h), { toward: pt(-1, -h / 2), color: q.kind === 2 ? 'rose' : 'sky', size: q.kind === 2 ? S(b) + 3 : S(b), gap: 12 });
        segTag(b, Oc, A, q.kind === 0 ? 'x' : String(q.R), { away: Mm, color: q.kind === 0 ? 'rose' : 'sky', size: q.kind === 0 ? S(b) + 3 : S(b) });
        return;
      }
      T(b, lerp(A, Mm, 0.5), 'AB=' + cv(2 * am), { dy: 30, size: S(b), color: 'sky' });
      segTag(b, Mm, Cc, cv(h), { toward: pt(-1, -h / 2), color: 'rose', size: S(b), gap: 12 });
      if (showO) { segTag(b, Oc, A, cv(R), { away: Mm, color: 'sky', size: S(b) }); if (ex || st >= 2) segTag(b, Oc, Mm, cv(R - h), { toward: B, color: 'green', size: S(b), gap: 12 }); }
    },
    steps: (M) => [
      '현 AB의 수직이등분선은 원의 중심 O를 지나요. AB의 중점을 M, 그 위의 호의 점을 C라 하면 O, M, C가 한 직선 위에 있어요.',
      `반지름을 R이라 하면 $\\overline{OA}=\\overline{OC}=R$이고 $\\overline{AM}=${fmtN(M.am)}$, $\\overline{CM}=${fmtN(M.h)}$이므로 $\\overline{OM}=R-${fmtN(M.h)}$.`,
      `직각삼각형 OAM에서 $R^2=${fmtN(M.am)}^2+(R-${fmtN(M.h)})^2$.`,
      `정리하면 $R=\\frac{\\overline{AM}^2+\\overline{CM}^2}{2\\,\\overline{CM}}=\\frac{${fmtN(M.am * M.am)}+${fmtN(M.h * M.h)}}{${fmtN(2 * M.h)}}=${nt(M.R)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>현 AB의 길이</b>와 <b>높이 CM</b>을 바꿔 보세요. 반지름 R은 AM과 CM으로 정해지고, 중심 O는 M 바로 아래에 있어요.',
      readouts: [rd('AM', fmtN(M.am), 'sky', 'AB의 반'), rd('CM', fmtN(M.h), 'rose', '아치의 높이'), rd('OM = R−CM', ntD(M.R - M.h), 'green'), rd('반지름 R', ntD(M.R), 'violet', '(AM²+CM²)÷(2CM)')],
      rule: '$R=\\dfrac{AM^2+CM^2}{2\\,CM}$ (현 AB와 높이 CM으로 반지름 구하기)',
      notes: notes('중심은 현보다 <b>R−CM</b>만큼 아래에 있어요. 높이가 낮을수록 반지름은 커져요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), am = q.am, h = q.h, R = q.R;
      let stem, ans, wr, meas, tag;
      const g = M.g;
      if (q.kind === 0) {
        tag = '아치 · 반지름'; ans = R; meas = dist(g.Oc, g.A);
        stem = `아치 모양의 현 AB의 길이가 ${2 * am} cm이고, 호 AB 위의 가장 높은 점 C에서 현 AB에 내린 수선의 발 M까지 $\\overline{CM}=${h}$ cm이다. 이 호를 포함하는 원 O의 반지름의 길이는?`;
        wr = [[am + h, '길이를 더하면 안 돼요. 피타고라스 정리를 써요.'], [(2 * am + h) / 2, 'AM(현의 반)을 써야 해요.'], [am * am / h, 'R²=AM²+(R−CM)²을 풀어요.'], [R - h, '이것은 OM이에요. 반지름은 OM+CM이에요.'], [R + h, '반지름은 OM+CM이에요.']];
      } else if (q.kind === 1) {
        tag = '아치 · 현의 길이'; ans = 2 * am; meas = dist(g.A, g.B);
        stem = `원 O의 호 AB에서 가장 높은 점을 C, 현 AB의 중점을 M이라 하자. 반지름이 ${R} cm이고 $\\overline{CM}=${h}$ cm일 때, 현 AB의 길이는?`;
        wr = [[am, '구한 AM은 현의 반쪽이에요. 2배 해야 해요.'], [R + h, '피타고라스 정리를 써요.'], [2 * h, 'CM이 아니라 AM을 구해야 해요.'], [R, '반지름이에요.'], [2 * R, '지름이에요. AB는 지름보다 짧아요.']];
      } else {
        tag = '아치 · 높이'; ans = h; meas = dist(g.M, g.C);
        stem = `원 O의 호 AB에서 가장 높은 점을 C, 현 AB의 중점을 M이라 하자. 반지름이 ${R} cm이고 $\\overline{AB}=${2 * am}$ cm일 때, $\\overline{CM}$의 길이는?`;
        wr = [[R - h, '이것은 OM이에요. CM=R−OM이에요.'], [am, 'AM이에요.'], [R - am, '길이를 빼면 안 돼요. 먼저 OM을 구해요.'], [Math.abs(R - 2 * am) + 1, 'OM=√(R²−AM²)을 구한 뒤 R−OM을 해요.'], [h + 1, 'OM=√(R²−AM²)을 구한 뒤 R−OM을 해요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  G.register(10, 'c1', '현', '현', PARAMS, [bis, dist2, eqd, conc, fold, slide, arch]);
})();
