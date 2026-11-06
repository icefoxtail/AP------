/* ==========================================================================
   중3 · 원의 성질 — 탭 ② 「접선」 (t2.js, order 20) — 장면 7개
   · c2-1 접선과 반지름            · 접선 ⊥ 반지름, 접선 위의 점 P를 가로로 끌기 · OP²=R²+PT²
   · c2-2 한 점에서 그은 두 접선   · PA=PB, ∠APB+∠AOB=180° · P를 가로로 끌기
   · c2-3 [킬러] 접선 3개와 둘레   · 점 E를 호 위에서 움직여도 △PCD의 둘레는 2PA
   · c2-4 직사각형 속 원과 접선 DE · 세 변에 내접한 원, 같은 접선 길이 쌍 → 피타고라스 방정식
   · c2-5 [심화] 외접하는 두 원    · 공통접선 AB=2√(r₁r₂)
   · c2-6 [심화] 내접하는 두 원    · 점 P를 지나는 직선, PA:PB=r:R, 접선 평행
   · c2-7 [심화] 공통접선의 길이   · 떨어진 두 원의 공통외접선·공통내접선
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, lerp, mp, inter, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, fillPoly, dot, pname, segTag, ang, cv, nt, ntD, mkNum, mkChoices, sz, par, tangentPts, degOf, tagOut } = G;
  const lenF = (v) => fmtN(v), degF = G.degF;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const O = pt(0, 0);
  const S = (b, a = 16) => sz(b, a);
  const rtri = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15], [7, 24, 25], [24, 7, 25], [10, 24, 26], [20, 15, 25], [15, 20, 25]];
  const dgx = (v) => fmtN(v) + '°';

  const PARAMS = {
    c2R: P('반지름 R', 3, 8, 1, 5, { color: 'sky', format: lenF }),
    c2L: P('접선 위의 거리 PT', 1, 12, 1, 6, { color: 'amber', hint: '노란 점 P를 가로로 끌어도 돼요', format: lenF }),
    c2P: P('∠APB의 크기', 50, 120, 2, 60, { color: 'rose', hint: '노란 점 P를 가로로 끌어도 돼요', format: degF }),
    c2E: P('접점 E의 위치', -0.9, 0.9, 0.05, 0.3, { color: 'amber', hint: '호 AB 위에서 E를 움직여요', format: (v) => (v === 0 ? '가운데' : v < 0 ? '아래쪽 ' + Math.round(-v * 100) + '%' : '위쪽 ' + Math.round(v * 100) + '%') }),
    c2H: P('세로 AB', 4, 12, 2, 8, { color: 'sky', format: lenF }),
    c2W: P('가로 BC', 6, 24, 1, 12, { color: 'amber', format: lenF }),
    c2r1: P('왼쪽 원의 반지름 r₁', 1, 6, 1, 2, { color: 'sky', format: lenF }),
    c2r2: P('오른쪽 원의 반지름 r₂', 1, 8, 1, 8, { color: 'amber', format: lenF }),
    c2d: P('중심 사이의 거리 d', 6, 20, 1, 13, { color: 'rose', hint: '오른쪽 원이 가로로 움직여요', format: lenF }),
    c2s: P('P를 지나는 직선의 기울기', 10, 70, 1, 40, { color: 'amber', format: degF }),
    c2R2: P('큰 원의 반지름 R', 4, 9, 1, 8, { color: 'sky', format: lenF }),
    c2r3: P('작은 원의 반지름 r', 1, 7, 1, 4, { color: 'amber', format: lenF })
  };

  /* ====================================================================== 1. 접선과 반지름 */
  const trad = {
    id: 'c2-1', title: '접선은 접점에서 반지름과 수직', short: '접선과 반지름',
    question: '원 위의 점 T에서 그은 접선과 반지름 OT는 어떤 각을 이룰까? 접선 위의 점 P를 가로로 끌어 OP의 길이가 어떻게 변하는지 살펴보자.',
    ctl: ['c2R', 'c2L'],
    init: (s) => { s.c2R = 5; s.c2L = 8; },
    gen(rnd, n) { const [R, L, OP] = pickR(rnd, rtri), kind = n % 3; return { kind, R, L, OP, key: `r${kind}.${R}.${L}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, R: q.R, L: q.L, OP: q.OP, Lmax: q.L }; }
      return { R: s.c2R, L: clamp(s.c2L, 1, 12), OP: Math.hypot(s.c2R, clamp(s.c2L, 1, 12)), Lmax: 12 };
    },
    draw(b, s, M, C) {
      const { R, L, OP, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      const T0 = pt(0, R), Pp = pt(L, R);
      fit(b, pr ? { x0: -R - 1.4, x1: L + 1.4, y0: -R, y1: R + 0.6 } : { x0: -9.4, x1: 13.4, y0: -8, y1: 8.6 }, { t: 50, b: 50, l: 30, r: 30 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.05 });
      line(b, pt(-R - 1.2, R), pt(M.Lmax + 1.2, R), 'ink', 3, { alpha: pr || ex || st >= 1 ? 1 : 0.5 });
      if (ex || pr || st >= 3) fillPoly(b, [O, T0, Pp], 'green', 0.13);
      line(b, O, T0, 'ink', 3); line(b, O, Pp, ex || pr || st >= 2 ? 'green' : 'ink', 2.8, { dash: [7, 5] });
      b.right(T0, O, Pp, { size: 14, color: 'amber' });
      dot(b, O, 'ink', 4.8); dot(b, T0, 'ink', 4.8); dot(b, Pp, 'amber', 5.4);
      if (ex) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 가로로 끌기', drag: (w) => { s.c2L = clamp(Math.round(w.x), 1, 12); } });
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: -13, size: 17 }); T(b, T0, 'T', { dy: 20, dx: -2, size: 17 }); T(b, Pp, 'P', { dy: 20, size: 17 });
      const lab = (k, v) => (pr && q.kind === k ? 'x' : String(v));
      const rl = pr ? lab(2, R) : cv(R), ll = pr ? lab(0, L) : cv(L);
      segTag(b, O, T0, pr ? (q.kind === 1 ? String(R) : q.kind === 2 ? 'x' : String(R)) : cv(R), { away: Pp, color: 'sky', size: S(b) });
      segTag(b, T0, Pp, pr ? (q.kind === 1 ? 'x' : String(L)) : cv(L), { toward: pt(L / 2, R + 6), color: 'sky', size: S(b), gap: 12 });
      segTag(b, O, Pp, pr ? (q.kind === 0 ? 'x' : String(q.OP)) : cv(OP), { away: T0, color: pr ? 'sky' : 'green', size: S(b), gap: 12 });
      void rl; void ll;
      if (pr && q.kind === 1) { /* OP 가 주어짐 */ }
    },
    steps: (M) => [
      '원의 접선은 접점 T에서 반지름 OT와 수직이에요: $\\overline{OT}\\perp\\ell$. 그래서 $\\angle OTP=90^{\\circ}$.',
      '삼각형 OTP는 직각삼각형이고 빗변은 $\\overline{OP}$예요.',
      `피타고라스 정리: $\\overline{OP}^2=\\overline{OT}^2+\\overline{PT}^2=${fmtN(M.R)}^2+${fmtN(M.L)}^2$.`,
      `따라서 $\\overline{OP}=${nt(M.OP)}$. P가 접점에서 멀어질수록 OP도 길어져요.`
    ],
    view: (M) => ({
      guide: '노란 점 <b>P를 가로로</b> 끌어 보세요(또는 막대). OT는 접선과 늘 <b>수직</b>이고, P가 멀어질수록 OP는 길어져요.',
      readouts: [rd('반지름 OT', fmtN(M.R), 'sky'), rd('접선의 길이 PT', fmtN(M.L), 'sky'), rd('OP', ntD(M.OP), 'green', '√(R²+PT²)'), rd('∠OTP', '90°', 'amber', '접선 ⊥ 반지름')],
      rule: '원의 접선은 접점을 지나는 반지름에 수직이다  (OP²=OT²+PT²)',
      notes: notes('접선은 원과 <b>한 점에서만</b> 만나요. 그 점이 접점이에요.', '접점과 원 밖의 점 P를 이으면 직각삼각형이 생겨요. 길이를 구할 때는 피타고라스 정리를 써요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { R, L, OP } = q;
      let stem, ans, wr, meas, tag;
      if (q.kind === 0) {
        tag = '접선과 반지름 · OP'; ans = OP; meas = dist(O, pt(L, R));
        stem = `원 O의 반지름의 길이가 ${R} cm이고, 점 P는 원 밖의 점이다. P에서 원에 그은 접선의 접점을 T라 할 때 $\\overline{PT}=${L}$ cm이다. $\\overline{OP}$의 길이는?`;
        wr = [[R + L, '길이를 더하면 안 돼요. 직각삼각형 OTP에서 피타고라스 정리를 써요.'], [Math.abs(L - R) || 1, '길이를 빼면 안 돼요.'], [Math.sqrt(Math.abs(L * L - R * R)) || 2, 'OP가 빗변이에요. 제곱을 더해요.'], [(R + L) / 2, '직각삼각형의 빗변을 구해요.'], [OP + 1, '피타고라스 정리를 다시 확인해 보세요.']];
      } else if (q.kind === 1) {
        tag = '접선과 반지름 · PT'; ans = L; meas = dist(pt(0, R), pt(L, R));
        stem = `원 O의 반지름의 길이가 ${R} cm이고, 원 밖의 점 P에서 원에 그은 접선의 접점을 T라 하자. $\\overline{OP}=${OP}$ cm일 때, $\\overline{PT}$의 길이는?`;
        wr = [[OP - R, '길이를 빼면 안 돼요. OT⊥PT이므로 피타고라스 정리를 써요.'], [OP + R, '길이를 더하면 안 돼요.'], [Math.sqrt(OP * OP + R * R), 'OP가 빗변이에요. 빗변이 가장 길어요.'], [R, '반지름과 접선의 길이는 달라요.'], [OP, '이것은 빗변이에요.']];
      } else {
        tag = '접선과 반지름 · 반지름'; ans = R; meas = dist(O, pt(0, R));
        stem = `원 O 밖의 점 P에서 원에 그은 접선의 접점을 T라 하자. $\\overline{PT}=${L}$ cm, $\\overline{OP}=${OP}$ cm일 때, 원 O의 반지름의 길이는?`;
        wr = [[OP - L, '길이를 빼면 안 돼요. 직각삼각형 OTP에서 OT를 구해요.'], [OP + L, '반지름은 빗변보다 짧아요.'], [Math.sqrt(OP * OP + L * L), 'OP가 빗변이에요.'], [L, '접선의 길이예요. 반지름을 구해야 해요.'], [OP, '빗변이에요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 한 점에서 그은 두 접선 (공용) */
  // O=(0,0), P=(D,0). A(위)·B(아래) 접점. 점 E 는 호 AB 위(원의 P쪽)
  function tanGeo(R, D, eps) {
    const phi = Math.acos(R / D) / DEG, A = mp(O, R, phi), B = mp(O, R, -phi), Pp = pt(D, 0);
    const out = { R, D, phi, A, B, P: Pp, a: Math.sqrt(D * D - R * R) };
    if (eps != null) {
      const E = mp(O, R, eps), t = pt(Math.sin(eps * DEG), Math.cos(eps * DEG));
      out.E = E; out.eps = eps; out.C = inter(Pp, A, E, add(E, t)); out.Dd = inter(Pp, B, E, add(E, t));
    }
    return out;
  }
  const pDist = (R, ang) => R / Math.sin((ang / 2) * DEG); // ∠APB=ang 일 때 OP

  /* ====================================================================== 2. 한 점에서 그은 두 접선 */
  const two = {
    id: 'c2-2', title: '한 점에서 그은 두 접선', short: '두 접선 PA=PB',
    question: '원 밖의 한 점 P에서 원에 접선을 두 개 그으면 두 접선의 길이는 서로 어떨까? ∠APB와 ∠AOB는 어떤 관계일까?',
    ctl: ['c2P'],
    init: (s) => { s.c2P = 60; },
    gen(rnd, n) { const kind = n % 5, th = pickR(rnd, kind === 3 ? [30, 35, 40, 45, 50, 55, 60, 65] : [50, 60, 70, 80, 100, 110, 120]); return { kind, th, key: `t${kind}.${th}` }; },
    model(s, C) {
      const th = C.problem ? s.ciPk.th : clamp(s.c2P, 50, 120);
      const kind = C.problem ? s.ciPk.kind : 9;
      let P2 = th; if (kind === 3) P2 = 180 - 2 * th; // ∠PAB 가 주어지면 ∠APB = 180-2θ
      if (kind === 1) P2 = 180 - th;     // ∠AOB 가 주어지면 ∠APB = 180-θ
      const R = 5, D = pDist(R, P2);
      return { q: C.problem ? s.ciPk : null, R, P2, g: tanGeo(R, D), th };
    },
    draw(b, s, M, C) {
      const { g, R, P2, q } = M, { A, B, P: Pp } = g, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      const Dmax = pDist(R, 50);
      fit(b, { x0: -R - 0.6, x1: pr ? Math.max(g.D, 4) + 0.9 : Dmax + 0.9, y0: -R - 0.4, y1: R + 0.4 }, { t: 52, b: 40, l: 30, r: 34 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.05 });
      line(b, Pp, A, 'ink', 3.4); line(b, Pp, B, 'ink', 3.4); line(b, O, A, 'ink', 2.6); line(b, O, B, 'ink', 2.6);
      if (ex || pr || st >= 3) line(b, A, B, 'green', 2.4, { dash: [6, 5] });
      if (!pr && (ex || st >= 4)) line(b, O, Pp, 'ink', 1.8, { dash: [4, 6], alpha: 0.6 });
      b.right(A, O, Pp, { size: 13, color: 'amber' }); b.right(B, O, Pp, { size: 13, color: 'amber' });
      if (!pr && (ex || st >= 2)) { tick(b, Pp, A, 1, 'amber'); tick(b, Pp, B, 1, 'amber'); }
      dot(b, O, 'ink', 4.8); dot(b, A, 'ink'); dot(b, B, 'ink'); dot(b, Pp, 'amber', 5.4);
      if (ex) b.handle('P', Pp, { color: 'amber', r: 8, ariaLabel: '점 P를 가로로 끌기', drag: (w) => { const d = Math.max(R * 1.01, w.x); s.c2P = clamp(Math.round(2 * Math.asin(R / d) / DEG / 2) * 2, 50, 120); } });
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, dy: 0, size: 17 }); T(b, A, 'A', { dy: -16, size: 17 }); T(b, B, 'B', { dy: 16, size: 17 }); T(b, Pp, 'P', { dx: 17, size: 17 });
      const th = P2, ao = 180 - th, bar = Math.round((180 - th) / 2 * 10) / 10;
      if (pr) {
        if (q.kind === 0) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 34, size: S(b) }); ang(b, O, A, B, { color: 'rose', rings: 2, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 1) { ang(b, O, A, B, { color: 'sky', rings: 2, label: dgx(q.th), r: 30, size: S(b) }); ang(b, Pp, A, B, { color: 'rose', rings: 1, label: 'x', r: 36, size: S(b) + 3 }); }
        if (q.kind === 2) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 36, size: S(b) }); ang(b, A, Pp, B, { color: 'rose', rings: 3, label: 'x', r: 28, size: S(b) + 3 }); }
        if (q.kind === 3) { ang(b, A, Pp, B, { color: 'sky', rings: 3, label: dgx(q.th), r: 28, size: S(b) }); ang(b, O, A, B, { color: 'rose', rings: 2, label: 'x', r: 30, size: S(b) + 3 }); }
        if (q.kind === 4) { ang(b, Pp, A, B, { color: 'sky', rings: 1, label: dgx(q.th), r: 36, size: S(b) }); ang(b, A, O, B, { color: 'rose', rings: 3, label: 'x', r: 24, size: S(b) + 3 }); }
        return;
      }
      if (ex || st >= 1) { ang(b, Pp, A, B, { color: 'rose', rings: 1, label: dgx(th), r: 38, size: S(b) }); }
      if (ex || st >= 4) ang(b, O, A, B, { color: 'sky', rings: 2, label: dgx(ao), r: 30, size: S(b) });
      if (ex || st >= 3) { ang(b, A, Pp, B, { color: 'green', rings: 3, label: dgx(bar), r: 30, size: S(b) - 1 }); }
      segTag(b, Pp, A, 'PA=' + cv(g.a), { away: B, color: 'green', size: S(b) - 1, gap: 14 }); segTag(b, Pp, B, 'PB=' + cv(g.a), { away: A, color: 'green', size: S(b) - 1, gap: 14 });
    },
    steps: (M) => [
      `접선은 반지름과 수직이므로 $\\angle OAP=\\angle OBP=90^{\\circ}$이에요. 직각삼각형 OAP와 OBP에서 $\\overline{OA}=\\overline{OB}$(반지름), $\\overline{OP}$는 공통 → RHS 합동.`,
      '합동이므로 $\\overline{PA}=\\overline{PB}$ → <b>한 점에서 원에 그은 두 접선의 길이는 같다</b>.',
      `삼각형 PAB는 이등변삼각형이므로 $\\angle PAB=\\angle PBA=\\frac{180^{\\circ}-\\angle APB}{2}=${dgx((180 - M.P2) / 2)}$.`,
      `사각형 OAPB의 내각의 합은 $360^{\\circ}$이고 $\\angle A=\\angle B=90^{\\circ}$이므로 $\\angle APB+\\angle AOB=180^{\\circ}$.`,
      `따라서 $\\angle AOB=180^{\\circ}-${dgx(M.P2)}=${dgx(180 - M.P2)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠APB</b>를 바꾸거나 노란 점 <b>P를 가로로</b> 끌어 보세요. PA와 PB는 늘 같고, ∠APB와 ∠AOB를 더하면 늘 180°예요.',
      readouts: [rd('∠APB', dgx(M.P2), 'rose'), rd('∠AOB', dgx(180 - M.P2), 'sky', '합이 180°'), rd('PA = PB', ntD(M.g.a), 'green', '접선의 길이'), rd('∠PAB', dgx((180 - M.P2) / 2), 'green', '이등변삼각형의 밑각')],
      rule: '한 점에서 원에 그은 두 접선의 길이는 같고, ∠APB+∠AOB=180°',
      notes: notes('∠APB+∠AOB=180°는 사각형 OAPB의 두 각 A, B가 직각이어서 생기는 관계예요.', '이등변삼각형 PAB의 밑각은 <b>(180°−∠P)÷2</b>예요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), th = q.th;
      let stem, ans, wr, meas, tag;
      const g = M.g, ao = degOf(O, g.A) * 2;
      const pre = 'PA, PB는 원 O의 접선이고 A, B는 접점이다.';
      if (q.kind === 0) {
        tag = '두 접선 · ∠AOB'; ans = 180 - th; meas = 2 * degOf(O, g.A);
        stem = `${pre} $\\angle APB=${th}^{\\circ}$일 때, $\\angle AOB$의 크기는?`;
        wr = [[th, '∠AOB를 구해야 해요.'], [90 - th / 2, '이등변삼각형 PAB의 밑각이에요.'], [2 * th, '∠APB+∠AOB=180°예요.'], [90 + th / 2, '∠APB+∠AOB=180°를 써요.'], [360 - th, '사각형 OAPB의 내각의 합에서 직각 두 개를 빼요.']];
      } else if (q.kind === 1) {
        tag = '두 접선 · ∠APB'; ans = 180 - th; meas = 2 * Math.asin(g.R / g.D) / DEG;
        stem = `${pre} $\\angle AOB=${th}^{\\circ}$일 때, $\\angle APB$의 크기는?`;
        wr = [[th, '∠APB를 구해야 해요.'], [90 - th / 2, '이등변삼각형 PAB의 밑각이에요.'], [2 * th, '∠APB+∠AOB=180°예요.'], [90 + th / 2, '∠APB+∠AOB=180°를 써요.'], [360 - th, '사각형 OAPB의 내각의 합에서 직각 두 개를 빼요.']];
      } else if (q.kind === 2) {
        tag = '두 접선 · ∠PAB'; ans = (180 - th) / 2; meas = (180 - 2 * Math.asin(g.R / g.D) / DEG) / 2;
        stem = `${pre} $\\angle APB=${th}^{\\circ}$일 때, $\\angle PAB$의 크기는?`;
        wr = [[180 - th, '이것은 ∠AOB예요.'], [th / 2, 'PA=PB이므로 삼각형 PAB는 이등변삼각형이에요. 밑각은 (180°−∠P)÷2예요.'], [90 - th, '밑각은 (180°−∠P)÷2예요.'], [th, '∠APB와 ∠PAB는 달라요.'], [90 + th / 2, '밑각은 (180°−∠P)÷2예요.']];
      } else if (q.kind === 3) {
        tag = '두 접선 · 이등변삼각형에서 ∠AOB'; ans = 2 * th; meas = 2 * degOf(O, g.A);
        stem = `${pre} $\\angle PAB=${th}^{\\circ}$일 때, $\\angle AOB$의 크기는?`;
        wr = [[th, '∠AOB는 ∠PAB의 2배예요.'], [180 - 2 * th, '이것은 ∠APB예요.'], [180 - th, '∠APB=180°−2×∠PAB이고 ∠AOB=180°−∠APB예요.'], [90 + th, '∠AOB=180°−∠APB를 써요.'], [3 * th, '∠AOB=180°−∠APB를 써요.']];
      } else {
        tag = '두 접선 · ∠OAB'; ans = th / 2; meas = (90 - (180 - 2 * Math.asin(g.R / g.D) / DEG) / 2);
        stem = `${pre} $\\angle APB=${th}^{\\circ}$일 때, $\\angle OAB$의 크기는?`;
        wr = [[90 - th / 2, '이것은 ∠PAB예요. ∠OAB=90°−∠PAB.'], [th, '∠OAB는 ∠APB의 절반이에요.'], [180 - th, '이것은 ∠AOB예요.'], [90 - th, '∠OAB=90°−∠PAB예요.'], [2 * th, '∠OAB=90°−∠PAB예요.']];
      }
      void ao;
      return { tag, key, stem, choices: mkChoices(ans, wr, { pad: 5, valid: (v) => v > 0 && v < 180 && Math.abs(v - Math.round(v)) < 1e-9 }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. [킬러] 접선 3개와 삼각형의 둘레 */
  // 문제용: PA=a, PC=c, PD=d 로부터 (R, D, ε) 를 구한다. R² = a(a−c)(a−d)/(c+d−a)
  function perimFrom(a, c, d) {
    const u = a - c, v = a - d, R = Math.sqrt((a * u * v) / (c + d - a)), D = Math.hypot(a, R);
    const al = Math.atan(u / R), be = Math.atan(v / R), eps = (be - al) / DEG;
    return { R, D, eps };
  }
  const per = {
    id: 'c2-3', title: '[킬러] 접선 3개로 만든 삼각형의 둘레', short: '[킬러] 접선 3개와 둘레',
    question: '원 밖의 점 P에서 두 접선 PA, PB를 긋고, 호 AB 위의 점 E에서 세 번째 접선을 그어 PA, PB와 만나는 점을 C, D라 하자. E를 움직여도 △PCD의 둘레는 변할까?',
    ctl: ['c2P', 'c2E'],
    init: (s) => { s.c2P = 60; s.c2E = 0.3; },
    gen(rnd, n) {
      const kind = n % 3;
      if (kind === 2) { const list = [[9, 5, 6], [10, 6, 7], [12, 7, 8], [8, 5, 5], [11, 6, 8], [15, 9, 10], [10, 7, 7], [14, 8, 9]]; const [a, c, d] = pickR(rnd, list); return { kind, a, c, d, key: `p2.${a}.${c}.${d}` }; }
      const a = pickR(rnd, [6, 8, 9, 10, 12, 14, 15]); const c = Math.ceil(a * 0.6), d = Math.ceil(a * 0.65);
      return { kind, a, c, d, key: `p${kind}.${a}` };
    },
    model(s, C) {
      if (C.problem) {
        const q = s.ciPk, { R, D, eps } = perimFrom(q.a, q.c, q.d);
        return { q, g: tanGeo(R, D, eps), a: q.a };
      }
      const th = clamp(s.c2P, 50, 120), R = 5, D = pDist(R, th), phi = Math.acos(R / D) / DEG;
      const eps = clamp(s.c2E, -0.9, 0.9) * (phi - 4);
      return { g: tanGeo(R, D, eps), a: Math.sqrt(D * D - R * R) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', R = g.R;
      const { A, B, P: Pp, E, C: Cc, Dd } = g;
      fit(b, { x0: -R - 0.6, x1: g.D + 0.9, y0: -R - 0.3, y1: R + 0.3 }, { t: 52, b: 40, l: 30, r: 30 });
      fillPoly(b, [Pp, Cc, Dd], 'rose', pr ? 0.13 : (ex || st >= 3) ? 0.16 : 0.07);
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.04 });
      line(b, Pp, A, 'ink', 3.4); line(b, Pp, B, 'ink', 3.4);
      const ext = (p1, p2) => ({ x: p2.x + (p2.x - p1.x) * 0.0, y: p2.y });
      void ext;
      line(b, Cc, Dd, 'amber', 3.6);
      const tl = 0.22; line(b, Cc, add(Cc, mul(unit(sub(Cc, Dd)), tl * R)), 'amber', 3.6); line(b, Dd, add(Dd, mul(unit(sub(Dd, Cc)), tl * R)), 'amber', 3.6);
      if (!pr && (ex || st >= 1)) { tick(b, Cc, A, 1, 'amber'); tick(b, Cc, E, 1, 'amber'); tick(b, Dd, B, 2, 'amber'); tick(b, Dd, E, 2, 'amber'); }
      b.right(A, O, Pp, { size: 12, color: 'amber' }); b.right(B, O, Pp, { size: 12, color: 'amber' });
      dot(b, O, 'ink', 4.6); dot(b, A, 'ink'); dot(b, B, 'ink'); dot(b, Pp, 'ink', 4.8); dot(b, Cc, 'ink'); dot(b, Dd, 'ink'); dot(b, E, 'amber', 5.6);
      if (!C.txt) return;
      T(b, O, 'O', { dx: -15, size: 17 }); T(b, A, 'A', { dy: -16, size: 17 }); T(b, B, 'B', { dy: 16, size: 17 }); T(b, Pp, 'P', { dx: 17, size: 17 });
      T(b, Cc, 'C', { dx: 4, dy: -17, size: 17 }); T(b, Dd, 'D', { dx: 4, dy: 18, size: 17 }); T(b, E, 'E', { dx: -16, dy: 0, size: 17 });
      const f = (v) => cv(v);
      const pc = dist(Pp, Cc), pd = dist(Pp, Dd), cd = dist(Cc, Dd), pa = g.a;
      if (pr) {
        if (q.kind === 0) { segTag(b, Pp, A, 'PA=' + q.a, { away: B, color: 'sky', size: S(b), gap: 14 }); T(b, mid(Pp, mid(Cc, Dd)), '둘레=x', { dx: 0, dy: 0, size: S(b) + 3 }); }
        if (q.kind === 1) { segTag(b, Pp, A, 'x', { away: B, gap: 14 }); T(b, mid(Pp, mid(Cc, Dd)), `둘레=${2 * q.a}`, { size: S(b), color: 'sky' }); }
        if (q.kind === 2) { segTag(b, Pp, A, 'x', { away: B, gap: 14 }); segTag(b, Pp, Cc, String(q.c), { away: Dd, color: 'sky', size: S(b), gap: 12 }); segTag(b, Pp, Dd, String(q.d), { away: Cc, color: 'sky', size: S(b), gap: 12 }); segTag(b, Cc, Dd, String(2 * q.a - q.c - q.d), { toward: Pp, color: 'sky', size: S(b), gap: 12 }); }
        return;
      }
      if (ex || st >= 1) { segTag(b, Pp, A, 'PA=' + f(pa), { away: B, color: 'green', size: S(b) - 1, gap: 14 }); }
      if (ex || st >= 3) { segTag(b, Pp, Cc, 'PC=' + f(pc), { away: Dd, color: 'rose', size: S(b) - 2, gap: 12 }); segTag(b, Pp, Dd, 'PD=' + f(pd), { away: Cc, color: 'rose', size: S(b) - 2, gap: 12 }); segTag(b, Cc, Dd, 'CD=' + f(cd), { toward: Pp, color: 'rose', size: S(b) - 2, gap: 12 }); }
    },
    steps: (M) => {
      const pc = dist(M.g.P, M.g.C), pd = dist(M.g.P, M.g.Dd), cd = dist(M.g.C, M.g.Dd);
      return [
        '점 C에서 원에 그은 두 접선의 길이는 같으므로 $\\overline{CA}=\\overline{CE}$ (표시 ‘|’). 점 D에서도 $\\overline{DB}=\\overline{DE}$ (표시 ‘||’).',
        '삼각형 PCD의 둘레는 $\\overline{PC}+\\overline{CD}+\\overline{DP}$이고, $\\overline{CD}=\\overline{CE}+\\overline{ED}$로 나눌 수 있어요.',
        '$\\overline{CE}=\\overline{CA}$, $\\overline{ED}=\\overline{DB}$를 넣으면 둘레 $=(\\overline{PC}+\\overline{CA})+(\\overline{DB}+\\overline{DP})=\\overline{PA}+\\overline{PB}$.',
        `점 P에서 그은 두 접선의 길이는 같으므로 둘레 $=2\\overline{PA}=2\\times${nt(M.a)}=${nt(2 * M.a)}$. (실제로 $\\overline{PC}+\\overline{CD}+\\overline{PD}=${nt(pc + pd + cd)}$)`
      ];
    },
    view: (M) => {
      const pc = dist(M.g.P, M.g.C), pd = dist(M.g.P, M.g.Dd), cd = dist(M.g.C, M.g.Dd);
      return {
        guide: '막대로 <b>점 E의 위치</b>를 바꿔 보세요. PC, CD, DP는 따로 변하지만 <b>세 변의 합(둘레)은 늘 2PA</b>로 같아요.',
        readouts: [rd('PA = PB', ntD(M.a), 'green'), rd('PC + CD + DP', `$${nt(pc + pd + cd)}$`, 'rose', '둘레'), rd('2·PA', ntD(2 * M.a), 'green', '늘 같아요')],
        status: { tone: 'key', text: 'E가 움직여도 둘레 = 2PA' },
        rule: '△PCD의 둘레 = PA + PB = 2·PA  (E의 위치와 관계없이 일정)',
        notes: notes('핵심은 <b>같은 점에서 그은 두 접선의 길이가 같다</b>는 것을 세 번 쓰는 거예요(C, D, P).', 'E가 어디에 있든 둘레는 같아요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), a = q.a, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = '원 O 밖의 점 P에서 원에 그은 두 접선의 접점을 A, B라 하고, 호 AB 위의 점 E에서 그은 접선이 $\\overline{PA}$, $\\overline{PB}$와 만나는 점을 각각 C, D라 하자.';
      if (q.kind === 0) {
        tag = '[킬러] 접선 3개 · 둘레'; ans = 2 * a; meas = dist(g.P, g.C) + dist(g.P, g.Dd) + dist(g.C, g.Dd);
        stem = `${pre} $\\overline{PA}=${a}$ cm일 때, 삼각형 PCD의 둘레의 길이 $x$는?`;
        wr = [[a, '둘레는 PA+PB예요.'], [3 * a, '둘레는 PA+PB=2PA예요.'], [a + 2, 'PC+CD+DP=PA+PB를 써요.'], [4 * a, '둘레는 PA+PB=2PA예요.'], [2 * a - 2, 'PC+CD+DP=PA+PB를 써요.']];
      } else if (q.kind === 1) {
        tag = '[킬러] 접선 3개 · PA'; ans = a; meas = g.a;
        stem = `${pre} 삼각형 PCD의 둘레의 길이가 ${2 * a} cm일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[2 * a, '둘레가 2PA예요. 둘레를 2로 나눠요.'], [a / 2, '둘레=PA+PB=2PA예요.'], [4 * a, '둘레=2PA예요.'], [a + 1, '둘레=2PA예요.'], [a - 1, '둘레=2PA예요.']];
      } else {
        tag = '[킬러] 접선 3개 · 세 변에서 PA'; ans = a; meas = g.a;
        stem = `${pre} $\\overline{PC}=${q.c}$ cm, $\\overline{PD}=${q.d}$ cm, $\\overline{CD}=${2 * a - q.c - q.d}$ cm일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[2 * a, '둘레=2PA예요. 둘레를 2로 나눠요.'], [q.c + q.d, 'PA=(둘레)÷2예요.'], [a + 1, '둘레=2PA예요.'], [a - 1, '둘레=2PA예요.'], [(q.c + q.d + (2 * a - q.c - q.d) / 2), 'PA=(PC+CD+DP)÷2예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 4. 직사각형 세 변에 내접한 원과 접선 DE */
  const RECT = [[4, 3, 5, 6], [6, 8, 10, 12], [8, 6, 10, 12], [12, 5, 13, 15], [8, 15, 17, 20], [12, 9, 15, 18], [12, 16, 20, 24], [16, 12, 20, 24]]; // [H, EC, DE, W]
  const rectGeo = (H, W) => {
    const r = H / 2, u = (2 * W * (W - H)) / (2 * W - H), E = pt(W - u, H), Dp = pt(W, 0);
    const Oc = pt(r, r), de = dist(E, Dp);
    // 접점 T : 원 위의 점으로 직선 DE 까지의 거리가 r
    const t = unit(sub(E, Dp)), nrm = pt(-t.y, t.x);
    const side = (nrm.x * (Oc.x - Dp.x) + nrm.y * (Oc.y - Dp.y)) >= 0 ? 1 : -1;
    const Tt = add(Oc, mul(nrm, -side * r));
    return { H, W, r, u, E, D: Dp, A: pt(0, 0), B: pt(0, H), Cc: pt(W, H), O: Oc, de, T: Tt, Pt: pt(r, 0), V: pt(r, H), Q: pt(0, r) };
  };
  const rect = {
    id: 'c2-4', title: '직사각형 속 원과 접선 DE', short: '직사각형 속 원',
    question: '원 O가 직사각형 ABCD의 세 변 AD, AB, BC에 접하고, 꼭짓점 D에서 원에 접선 DE를 그었다. 같은 접선의 길이를 이용해 EC와 DE를 구해 보자.',
    ctl: ['c2H', 'c2W'],
    init: (s) => { s.c2H = 8; s.c2W = 12; },
    gen(rnd, n) { const [H, u, de, W] = pickR(rnd, RECT), kind = n % 3; return { kind, H, u, de, W, key: `q${kind}.${H}.${W}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: rectGeo(q.H, q.W) }; }
      const H = clamp(Math.round(s.c2H), 4, 12), W = clamp(Math.round(s.c2W), H, 24); s.c2W = W;
      return { g: rectGeo(H, W) };
    },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { H, W, r } = g;
      fit(b, { x0: -0.2, x1: W + 0.2, y0: -0.2, y1: H + 0.2 }, { t: 54, b: 52, l: 38, r: 70 });
      fillPoly(b, [g.A, g.D, g.Cc, g.B], 'sky', 0.05);
      b.path([g.A, g.D, g.Cc, g.B], { close: true, color: 'ink', width: 3.4 });
      circle(b, g.O, r, 'ink', 3.4, { fill: 'sky', fa: 0.06 });
      line(b, g.D, g.E, 'amber', 3.6);
      if (pr || ex || st >= 3) fillPoly(b, [g.E, g.D, g.Cc], 'rose', 0.14);
      if (!pr && (ex || st >= 1)) { [g.Pt, g.Q, g.V, g.T].forEach((p) => dot(b, p, 'amber', 4.4)); }
      else [g.Pt, g.Q, g.V, g.T].forEach((p) => dot(b, p, 'ink', 3.6));
      if (!pr && (ex || st >= 1)) { tick(b, g.D, g.Pt, 1, 'amber'); tick(b, g.D, g.T, 1, 'amber'); tick(b, g.E, g.T, 2, 'amber'); tick(b, g.E, g.V, 2, 'amber'); }
      b.right(g.Cc, g.D, g.E, { size: 13, color: 'amber' });
      dot(b, g.O, 'ink', 4.2); ['A', 'B', 'D', 'Cc', 'E'].forEach((k) => dot(b, g[k], 'ink', 4.6));
      if (!C.txt) return;
      T(b, g.A, 'A', { dx: -15, dy: -13, size: 17 }); T(b, g.D, 'D', { dx: 15, dy: -13, size: 17 }); T(b, g.B, 'B', { dx: -15, dy: 15, size: 17 }); T(b, g.Cc, 'C', { dx: 15, dy: 15, size: 17 }); T(b, g.E, 'E', { dx: -14, dy: -13, size: 17 });
      T(b, g.O, 'O', { dx: 13, dy: -13, size: 17 });
      const ec = g.u, de = g.de;
      if (pr) {
        segTag(b, g.A, g.B, String(H), { toward: pt(W / 2, H / 2), color: 'sky', size: S(b), gap: 14, dx: -4 });
        // BC=W 가 주어짐
        segTag(b, g.B, g.Cc, String(W), { away: pt(W / 2, 0), color: 'sky', size: S(b), gap: 14 });
        if (q.kind === 0) segTag(b, g.E, g.Cc, 'x', { away: g.D, gap: 14 });
        if (q.kind === 1) segTag(b, g.D, g.E, 'x', { away: g.A, gap: 14 });
        if (q.kind === 2) T(b, pt((g.E.x + 2 * g.Cc.x) / 3 + 0.2, H * 0.72), '둘레 x', { size: S(b) + 1 });
        return;
      }
      segTag(b, g.A, g.B, cv(H), { toward: pt(W / 2, H / 2), color: 'sky', size: S(b), gap: 14, dx: -4 });
      segTag(b, g.B, g.Cc, cv(W), { away: pt(W / 2, 0), color: 'sky', size: S(b), gap: 14 });
      if (ex || st >= 2) segTag(b, g.D, g.E, 'DE=' + cv(de), { away: g.A, color: 'rose', size: S(b) - 1, gap: 14 });
      if (ex || st >= 3) segTag(b, g.E, g.Cc, 'EC=' + cv(ec), { away: g.D, color: 'rose', size: S(b) - 1, gap: 14 });
    },
    steps: (M) => {
      const g = M.g, { H, W } = g;
      return [
        `원은 AB, AD, BC에 접하므로 반지름 $r=\\frac{AB}{2}=${nt(H / 2)}$이고 접점은 AD 위의 P, AB 위의 Q, BC 위의 V예요. 접선 DE의 접점을 T라 해요.`,
        `같은 점에서 그은 두 접선의 길이는 같으므로 $\\overline{DT}=\\overline{DP}=${W}-${nt(H / 2)}=${nt(W - H / 2)}$, $\\overline{ET}=\\overline{EV}$.`,
        `$\\overline{EC}=x$라 하면 $\\overline{BE}=${W}-x$, $\\overline{EV}=\\overline{BE}-\\overline{BV}=${W}-x-${nt(H / 2)}$. 그래서 $\\overline{DE}=\\overline{DT}+\\overline{TE}=${2 * W - H}-x$.`,
        `직각삼각형 DEC에서 $\\overline{DE}^2=\\overline{DC}^2+\\overline{EC}^2$이므로 $(${2 * W - H}-x)^2=${H}^2+x^2$.`,
        `풀면 $x=\\overline{EC}=${nt(g.u)}$, $\\overline{DE}=${nt(g.de)}$. 삼각형 CDE의 둘레는 $${nt(H + g.u + g.de)}$ ($=2\\overline{BC}$)예요.`
      ];
    },
    view: (M) => {
      const g = M.g;
      return {
        guide: '막대로 <b>세로 AB</b>와 <b>가로 BC</b>를 바꿔 보세요. 원은 세 변에 접하고 지름은 AB예요. 접선 DE는 같은 접선 길이 쌍(| 표시)으로 길이가 정해져요.',
        readouts: [rd('반지름 r', ntD(g.H / 2), 'sky', 'AB의 절반'), rd('EC', ntD(g.u), 'rose', '2BC(BC−AB)÷(2BC−AB)'), rd('DE', ntD(g.de), 'rose', '2BC−AB−EC'), rd('△CDE 둘레', ntD(g.H + g.u + g.de), 'green', '= 2·BC')],
        rule: '$DE=2BC-AB-EC$ 이고 $DE^2=DC^2+EC^2$ → 방정식으로 EC를 구한다',
        notes: notes('DE의 길이는 한 번에 구하지 않고 <b>같은 접선 길이 쌍</b>으로 x를 포함한 식을 세워요.', '△CDE의 둘레는 늘 <b>2×BC</b>예요(접선 길이 때문).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { H, u, de, W } = q, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = `원 O가 직사각형 ABCD의 세 변 AD, AB, BC에 접하고, $\\overline{DE}$는 원 O의 접선이다. $\\overline{AB}=${H}$ cm, $\\overline{BC}=${W}$ cm일 때,`;
      if (q.kind === 0) {
        tag = '직사각형과 접선 · EC'; ans = u; meas = dist(g.E, g.Cc);
        stem = `${pre} $\\overline{EC}$의 길이 $x$는?`;
        wr = [[W - H, '같은 접선 길이를 써서 방정식을 세워야 해요.'], [H / 2, '반지름이에요.'], [de, '이것은 DE예요.'], [W - H / 2, '이것은 DT(=DP)예요.'], [u + 1, '(2BC−AB−x)²=AB²+x²을 풀어요.']];
      } else if (q.kind === 1) {
        tag = '직사각형과 접선 · DE'; ans = de; meas = g.de;
        stem = `${pre} $\\overline{DE}$의 길이 $x$는?`;
        wr = [[u, '이것은 EC예요. DE는 빗변이에요.'], [W - H / 2, '이것은 DT(=DP)예요. DE=DT+TE예요.'], [W, 'BC의 길이예요.'], [H + u, '두 변의 합이 아니라 빗변이에요.'], [de + 1, 'DE=2BC−AB−EC를 써요.']];
      } else {
        tag = '직사각형과 접선 · 삼각형 CDE의 둘레'; ans = 2 * W; meas = H + g.u + g.de;
        stem = `${pre} 삼각형 CDE의 둘레의 길이 $x$는?`;
        wr = [[W, '둘레는 DC+EC+DE예요.'], [H + W, 'DE와 EC의 길이를 접선 길이로 구해 보세요.'], [W + de, 'CD+EC+DE를 모두 더해요.'], [2 * W - 2, '둘레=DC+CE+DE=2BC예요.'], [2 * W + 2, '둘레=DC+CE+DE=2BC예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 5. [심화] 외접하는 두 원 */
  const EXT = [[1, 4], [1, 9], [2, 8], [4, 9], [3, 12], [4, 4], [9, 9], [2, 2], [3, 3], [4, 16], [8, 2], [9, 4]]; // (r1, r2): r1·r2 가 제곱수
  const exGeo = (r1, r2) => {
    const O1 = pt(-r1, 0), O2 = pt(r2, 0), h = 2 * Math.sqrt(r1 * r2);
    const A = pt(-r1 + (r1 * (r1 - r2) / (r1 + r2)) * 0 + 0, 0);
    // 외접선 AB 의 접점: 위쪽. 접선 기울기: sin φ = (r1−r2)/(r1+r2), 접점은 중심에서 (−sin φ·… )
    const sp = (r1 - r2) / (r1 + r2), cp = Math.sqrt(1 - sp * sp);
    const a1 = pt(O1.x + r1 * sp, -r1 * cp), a2 = pt(O2.x + r2 * sp, -r2 * cp);
    void A; void h;
    return { r1, r2, O1, O2, A: a1, B: a2, P: pt(0, 0), M: lerp(a1, a2, 0.5), len: dist(a1, a2) };
  };
  const extScene = {
    id: 'c2-5', title: '[심화] 외접하는 두 원의 공통접선', short: '[심화] 외접하는 두 원',
    question: '두 원이 한 점 P에서 서로 밖에서 접한다. 공통접선 AB의 길이는 두 반지름 r₁, r₂와 어떤 관계일까?',
    ctl: ['c2r1', 'c2r2'],
    init: (s) => { s.c2r1 = 2; s.c2r2 = 6; },
    gen(rnd, n) { const [r1, r2] = pickR(rnd, EXT), kind = n % 3; return { kind, r1, r2, key: `x${kind}.${r1}.${r2}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, g: exGeo(q.r1, q.r2), r1: q.r1, r2: q.r2 }; }
      return { g: exGeo(s.c2r1, s.c2r2), r1: s.c2r1, r2: s.c2r2 };
    },
    draw(b, s, M, C) {
      const { g, q, r1, r2 } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      fit(b, { x0: -2 * r1 - 0.4, x1: 2 * r2 + 0.4, y0: -1.3 * Math.max(r1, r2) - 0.6, y1: Math.max(r1, r2) + 0.5 }, { t: 58, b: 40, l: 30, r: 30 });
      circle(b, g.O1, r1, 'ink', 3.4, { fill: 'sky', fa: 0.07 }); circle(b, g.O2, r2, 'ink', 3.4, { fill: 'violet', fa: 0.07 });
      const ext = unit(sub(g.B, g.A));
      line(b, sub(g.A, mul(ext, 0.9)), add(g.B, mul(ext, 0.9)), 'amber', 3.6);
      line(b, pt(0, -1.3 * Math.max(r1, r2) - 0.3), pt(0, 0.8), 'green', 3);
      line(b, g.O1, g.A, 'ink', 2.4); line(b, g.O2, g.B, 'ink', 2.4); line(b, g.P, g.A, 'ink', 2.2, { alpha: pr ? 1 : 0.8 }); line(b, g.P, g.B, 'ink', 2.2);
      b.right(g.A, g.O1, g.B, { size: 12, color: 'amber' }); b.right(g.B, g.O2, g.A, { size: 12, color: 'amber' });
      if (!pr && (ex || st >= 1)) { tick(b, g.M, g.A, 1, 'amber'); tick(b, g.M, g.P, 1, 'amber'); tick(b, g.M, g.B, 1, 'amber'); }
      if (!pr && (ex || st >= 2)) b.right(g.P, g.A, g.B, { size: 12, color: 'rose' });
      [g.O1, g.O2, g.A, g.B, g.P].forEach((p) => dot(b, p, 'ink', 4.4)); dot(b, g.M, 'green', 4.4);
      if (!C.txt) return;
      T(b, g.O1, 'O', { dy: 17, size: 16 }); T(b, g.O2, "O′", { dy: 17, size: 16 }); T(b, g.A, 'A', { dx: -14, dy: -12, size: 17 }); T(b, g.B, 'B', { dx: 14, dy: -12, size: 17 }); T(b, g.P, 'P', { dy: 18, size: 17 }); T(b, g.M, 'M', { dy: -17, size: 17 });
      if (pr) {
        segTag(b, g.O1, g.A, String(r1), { away: pt(g.P.x, -1), color: 'sky', size: S(b), gap: 12 }); segTag(b, g.O2, g.B, q.kind === 1 ? 'x' : String(r2), { away: pt(g.P.x, -1), color: 'sky', size: S(b), gap: 12 });
        T(b, g.M, q.kind === 0 ? 'AB=x' : q.kind === 1 ? `AB=${cv(g.len)}` : '', { dy: -42, size: S(b), color: 'sky' });
        if (q.kind === 2) segTag(b, g.M, g.P, 'x', { toward: g.O1, gap: 12 });
        return;
      }
      segTag(b, g.O1, g.A, cv(r1), { away: pt(g.P.x, -1), color: 'sky', size: S(b), gap: 12 }); segTag(b, g.O2, g.B, cv(r2), { away: pt(g.P.x, -1), color: 'violet', size: S(b), gap: 12 });
      if (ex || st >= 3) T(b, g.M, 'AB=' + cv(g.len), { dy: -42, size: S(b), color: 'rose' });
    },
    steps: (M) => [
      '두 원이 점 P에서 접하므로 P에서 두 원의 공통접선을 그어 선분 AB와 만나는 점을 M이라 해요.',
      '점 M에서 원 O에 그은 접선의 길이는 같으므로 $\\overline{MA}=\\overline{MP}$, 원 O′에서도 $\\overline{MB}=\\overline{MP}$. 그래서 $\\overline{MA}=\\overline{MP}=\\overline{MB}$이고 $\\angle APB=90^{\\circ}$.',
      M.r1 === M.r2 ? '두 반지름이 같으면 OABO′은 직사각형이에요. 마주 보는 변의 길이가 같으므로 $\\overline{AB}=\\overline{OO^{\\prime}}=2r_1$이에요.' : `직각사다리꼴 OABO′에서 $\\overline{OO^{\\prime}}=r_1+r_2$, 두 반지름의 길이 차는 $\\lvert r_1-r_2\\rvert$예요. 따라서 $\\overline{AB}^2=(r_1+r_2)^2-(r_1-r_2)^2=4r_1r_2$.`,
      `$\\overline{AB}=2\\sqrt{r_1r_2}=2\\sqrt{${M.r1}\\times ${M.r2}}=${nt(M.g.len)}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>두 반지름</b>을 바꿔 보세요. 점 M은 AB의 중점이고 MA=MP=MB예요. 두 원이 크기가 같아지면 AB=2r이에요.',
      readouts: [rd('r₁', fmtN(M.r1), 'sky'), rd('r₂', fmtN(M.r2), 'sky'), rd('AB', ntD(M.g.len), 'rose', '2√(r₁r₂)'), rd('MP', ntD(M.g.len / 2), 'green', '= AB의 절반')],
      rule: '[심화] 외접하는 두 원의 공통외접선의 길이 $AB=2\\sqrt{r_1 r_2}$',
      notes: notes('이 장면은 <b>심화</b>예요. 공통접선과 접선의 길이, 피타고라스 정리를 함께 쓰는 문제예요.', '∠APB=90°는 MA=MP=MB(점 M이 AB를 지름으로 하는 원의 중심) 때문이에요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { r1, r2 } = q, g = M.g, len = 2 * Math.sqrt(r1 * r2);
      let stem, ans, wr, meas, tag;
      const pre = '반지름이 각각 $r_1$, $r_2$인 두 원 O, O′이 점 P에서 서로 밖에서 접하고, 직선 AB는 두 원의 공통외접선이다(A, B는 접점).';
      if (q.kind === 0) {
        tag = '[심화] 외접하는 두 원 · AB'; ans = len; meas = g.len;
        stem = `${pre} 두 원의 반지름이 ${r1} cm, ${r2} cm일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[r1 + r2, '직각사다리꼴 OABO′의 높이를 피타고라스 정리로 구해요.'], [Math.sqrt(r1 * r2), 'AB=2√(r₁r₂)예요(MP의 2배).'], [Math.abs(r1 - r2) + 1, 'AB²=(r₁+r₂)²−(r₁−r₂)²예요.'], [2 * (r1 + r2), '높이는 중심 사이의 거리보다 짧아요.'], [r1 * r2, 'AB²=4r₁r₂예요.']];
      } else if (q.kind === 1) {
        tag = '[심화] 외접하는 두 원 · 반지름'; ans = r2; meas = g.r2;
        stem = `${pre} $r_1=${r1}$ cm이고 $\\overline{AB}=${nt(len)}$ cm일 때, 오른쪽 원의 반지름 $x$는?`;
        wr = [[len, 'AB²=4r₁r₂를 써요.'], [len / 2, 'AB²=4r₁r₂를 써요.'], [r2 + 1, 'AB²=4r₁r₂를 써요.'], [r1, '두 원의 반지름이 같다고 가정하지 마세요.'], [len * len / (4 * r1) * 2, 'AB²=4r₁r₂를 써요.']];
      } else {
        tag = '[심화] 외접하는 두 원 · MP'; ans = len / 2; meas = dist(g.M, g.P);
        stem = `${pre} 두 원의 접점 P에서 그은 공통접선이 AB와 만나는 점을 M이라 하자. 반지름이 ${r1} cm, ${r2} cm일 때, $\\overline{MP}$의 길이 $x$는?`;
        wr = [[len, 'MP는 AB의 절반이에요.'], [r1 + r2, '두 반지름의 합이에요.'], [Math.sqrt(r1 * r2) + 1, 'MP=MA=MB=AB÷2예요.'], [r1, '반지름이에요.'], [r2, '반지름이에요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 6. [심화] 내접하는 두 원 */
  const INT = [[12, 8], [9, 6], [6, 4], [10, 4], [15, 9], [12, 9], [8, 6], [10, 6], [12, 6], [9, 3]]; // [R, r]
  const inGeo = (R, r, sl) => {
    const Pp = pt(R, 0), Oc = O, Op = pt(R - r, 0), u = pt(-Math.cos(sl * DEG), -Math.sin(sl * DEG)); // P 에서 왼쪽 위로
    const pb = 2 * R * Math.cos(sl * DEG), pa = 2 * r * Math.cos(sl * DEG);
    const B = add(Pp, mul(u, pb)), A = add(Pp, mul(u, pa));
    return { R, r, P: Pp, O: Oc, Op, A, B, pa, pb, sl, u };
  };
  const intScene = {
    id: 'c2-6', title: '[심화] 내접하는 두 원', short: '[심화] 내접하는 두 원',
    question: '작은 원이 큰 원에 안쪽에서 점 P로 접한다. P를 지나는 직선이 작은 원과 A, 큰 원과 B에서 만나면 PA와 PB의 비는 어떻게 될까? A, B에서의 접선은 어떤 관계일까?',
    ctl: ['c2R2', 'c2r3', 'c2s'],
    init: (s) => { s.c2R2 = 8; s.c2r3 = 4; s.c2s = 40; },
    gen(rnd, n) { const [R, r] = pickR(rnd, INT), kind = n % 3, g = gcd(R, r), js = []; for (let j = 1; j < 2 * g; j++) { const pf = (R / g) * j; if (pf >= 0.9 * R && pf <= 1.85 * R && pf * r / R >= 0.25 * R) js.push(pf); } const pbFull = js.length ? pickR(rnd, js) : (R / g) * (2 * g - 1); return { kind, R, r, key: `i${kind}.${R}.${r}.${pbFull}`, pbFull }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk, sl = Math.acos(q.pbFull / (2 * q.R)) / DEG; return { q, R: q.R, r: q.r, g: inGeo(q.R, q.r, Number.isFinite(sl) ? sl : 30) }; }
      const R = s.c2R2, r = clamp(s.c2r3, 1, R - 1);
      return { R, r, g: inGeo(R, r, s.c2s) };
    },
    draw(b, s, M, C) {
      const { g, R, r, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      fit(b, { x0: -R - 0.2, x1: R + 0.4, y0: -R - 0.2, y1: R + 0.2 }, { t: 52, b: 40, l: 36, r: 40 });
      circle(b, O, R, 'ink', 3.6, { fill: 'sky', fa: 0.05 }); circle(b, g.Op, r, 'ink', 3.4, { fill: 'violet', fa: 0.08 });
      line(b, g.P, g.B, 'ink', 3.4);
      line(b, pt(R, -R * 0.6), pt(R, R * 0.6), 'green', 2.6, { dash: [6, 5] });
      if (!pr && (ex || st >= 1)) { line(b, O, g.B, 'ink', 2.2, { alpha: 0.75 }); line(b, g.Op, g.A, 'ink', 2.2, { alpha: 0.75 }); }
      if (pr) { line(b, O, g.B, 'ink', 2, { alpha: 0.4 }); }
      const tg = (X, cr) => { const rad = unit(sub(X, cr)), t = pt(-rad.y, rad.x); return [add(X, mul(t, 2.6)), sub(X, mul(t, 2.6))]; };
      if (!pr && (ex || st >= 3)) { const tA = tg(g.A, g.Op), tB = tg(g.B, O); line(b, tA[0], tA[1], 'amber', 3); line(b, tB[0], tB[1], 'amber', 3); par(b, tA[0], tA[1], 2, 'rose', 0.85); par(b, tB[0], tB[1], 2, 'rose', 0.85); }
      [O, g.Op, g.P, g.A, g.B].forEach((p) => dot(b, p, 'ink', 4.4));
      if (!C.txt) return;
      T(b, O, 'O', { dx: -14, dy: -12, size: 16 }); T(b, g.Op, "O′", { dx: -4, dy: 17, size: 16 }); T(b, g.P, 'P', { dx: 16, size: 17 });
      tagOut(b, g.A, g.Op, 'A', { size: 17, gap: 12 }); tagOut(b, g.B, O, 'B', { size: 17, gap: 12 });
      const up = pt(g.O.x, g.O.y), dn = g.Op;
      if (pr) {
        if (q.kind !== 2) segTag(b, g.P, g.A, q.kind === 0 ? 'PA=x' : `PA=${cv(g.pa)}`, { toward: pt(g.A.x, g.A.y - 5), color: 'sky', size: S(b), gap: 13 });
        segTag(b, g.A, g.B, q.kind === 2 ? 'AB=x' : '', { away: g.O, color: 'rose', size: S(b), gap: 22, leader: true });
        segTag(b, g.P, g.B, q.kind === 1 ? 'PB=x' : `PB=${q.pbFull}`, { away: pt(g.A.x, g.A.y - 5), color: 'sky', size: S(b), gap: 13 });
        T(b, pt(-R * 0.1, R * 0.62), `R=${R}, r=${r}`, { size: S(b), color: 'sky' });
        return;
      }
      void up; void dn;
      segTag(b, g.P, g.A, 'PA=' + cv(g.pa), { toward: pt(g.A.x, g.A.y - 5), color: 'violet', size: S(b) - 1, gap: 13 });
      segTag(b, g.P, g.B, 'PB=' + cv(g.pb), { away: pt(g.A.x, g.A.y - 5), color: 'sky', size: S(b) - 1, gap: 13 });
      if (ex || st >= 2) T(b, pt(-R * 0.1, R * 0.62), `PA:PB=${r}:${R}`, { size: S(b), color: 'green' });
    },
    steps: (M) => [
      '큰 원의 중심 O, 작은 원의 중심 O′, 접점 P는 한 직선 위에 있어요. 직선 PB와 작은 원의 교점을 A라 해요.',
      '삼각형 OPB와 O′PA는 모두 이등변삼각형이고 ∠P를 공유하므로 닮음이에요(AA). 그래서 $\\overline{PA}:\\overline{PB}=r:R$.',
      `이 장면에서 $\\overline{PA}:\\overline{PB}=${M.r}:${M.R}$ → $\\overline{PA}=${nt(M.g.pa)}$, $\\overline{PB}=${nt(M.g.pb)}$.`,
      '닮음이므로 $\\overline{O^{\\prime}A}\\parallel\\overline{OB}$이고, 접선은 각각 O′A, OB에 수직이므로 A에서의 접선과 B에서의 접선도 <b>평행</b>해요.'
    ],
    view: (M) => ({
      guide: '막대로 <b>두 반지름</b>과 <b>P를 지나는 직선의 기울기</b>를 바꿔 보세요. 직선을 어떻게 그어도 PA : PB는 늘 r : R이고 A, B에서의 두 접선은 평행해요.',
      readouts: [rd('R', fmtN(M.R), 'sky'), rd('r', fmtN(M.r), 'violet'), rd('PA : PB', `${M.r} : ${M.R}`, 'green', '반지름의 비'), rd('PB − PA = AB', ntD(M.g.pb - M.g.pa), 'rose')],
      rule: '[심화] 내접하는 두 원에서 P를 지나는 직선은 PA : PB = r : R 이고, A, B에서의 접선은 평행하다',
      notes: notes('이 장면은 <b>심화</b>예요. 닮음(AA)을 이용해 설명해요.')
    }),
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { R, r, pbFull } = q, pa = pbFull * r / R, g = M.g;
      let stem, ans, wr, meas, tag;
      const pre = `반지름이 ${R} cm, ${r} cm인 두 원이 점 P에서 안쪽으로 접하고, P를 지나는 직선이 작은 원과 A, 큰 원과 B에서 만난다.`;
      if (q.kind === 0) {
        tag = '[심화] 내접하는 두 원 · PA'; ans = pa; meas = dist(g.P, g.A);
        stem = `${pre} $\\overline{PB}=${pbFull}$ cm일 때, $\\overline{PA}$의 길이 $x$는?`;
        wr = [[pbFull * R / r, 'PA : PB = r : R이므로 PA가 더 짧아요.'], [pbFull - r, '비례식 PA : PB = r : R을 써요.'], [pbFull * (R - r) / R, '이것은 AB예요.'], [pbFull / 2, 'PA : PB = r : R을 써요.'], [r, '비례식 PA : PB = r : R을 써요.']];
      } else if (q.kind === 1) {
        tag = '[심화] 내접하는 두 원 · PB'; ans = pbFull; meas = dist(g.P, g.B);
        stem = `${pre} $\\overline{PA}=${pa}$ cm일 때, $\\overline{PB}$의 길이 $x$는?`;
        wr = [[pa * r / R, 'PA : PB = r : R이므로 PB가 더 길어요.'], [pa + R - r, '비례식 PA : PB = r : R을 써요.'], [pa * 2, 'PA : PB = r : R을 써요.'], [pa * (R - r) / r, '이것은 AB예요.'], [R, '비례식을 써요.']];
      } else {
        tag = '[심화] 내접하는 두 원 · AB'; ans = pbFull - pa; meas = dist(g.A, g.B);
        stem = `${pre} $\\overline{PB}=${pbFull}$ cm일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[pa, '이것은 PA예요. AB=PB−PA.'], [pbFull, '이것은 PB예요.'], [pbFull * R / r, 'PA : PB = r : R을 써요.'], [pbFull - r, '비례식으로 PA를 먼저 구해요.'], [pbFull + pa, 'AB=PB−PA예요.']];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  /* ====================================================================== 7. [심화] 공통접선의 길이 */
  // 외접선: len=√(d²−(r1−r2)²), 내접선: len=√(d²−(r1+r2)²)
    const EXTL = [[6, 3, 5, 4], [8, 3, 13, 12], [11, 3, 17, 15], [7, 4, 5, 4], [9, 4, 13, 12], [10, 2, 17, 15], [5, 2, 5, 4], [8, 4, 5, 3]]; // r1,r2,d,len (외접선): len²=d²−(r1−r2)²
  const INTL = [[2, 1, 5, 4], [3, 2, 13, 12], [3, 3, 10, 8], [5, 3, 10, 6], [4, 2, 10, 8], [3, 1, 5, 3], [4, 1, 13, 12], [2, 2, 5, 3]]; // 내접선: len²=d²−(r1+r2)²
  const comGeo = (r1, r2, d, mode) => {
    const O1 = pt(0, 0), O2 = pt(d, 0);
    if (mode === 'ext') {
      const sp = (r1 - r2) / d, cp = Math.sqrt(Math.max(0, 1 - sp * sp)), A = pt(r1 * sp, -r1 * cp), B = pt(d + r2 * sp, -r2 * cp);
      return { O1, O2, A, B, len: dist(A, B), r1, r2, d, mode };
    }
    const sp = (r1 + r2) / d, cp = Math.sqrt(Math.max(0, 1 - sp * sp)), A = pt(r1 * sp, -r1 * cp), B = pt(d - r2 * sp, r2 * cp);
    return { O1, O2, A, B, len: dist(A, B), r1, r2, d, mode };
  };
  const comScene = {
    id: 'c2-7', title: '[심화] 두 원의 공통접선의 길이', short: '[심화] 공통접선의 길이',
    question: '서로 떨어져 있는 두 원의 공통접선의 길이는 어떻게 구할까? 중심 사이의 거리 d를 바꿔 가며 공통외접선과 공통내접선의 길이를 비교해 보자.',
    ctl: ['c2r1', 'c2r2', 'c2d'],
    presets: () => [['ext', '공통외접선'], ['int', '공통내접선']].map(([id, label], i) => ({ group: i === 0 ? '어떤 접선?' : '', label, apply: (s) => { s.c2cm = id; }, on: (s) => (s.c2cm || 'ext') === id })),
    init: (s) => { s.c2cm = 'ext'; s.c2r1 = 6; s.c2r2 = 3; s.c2d = 13; },
    gen(rnd, n) { const mode = n % 2 ? 'int' : 'ext', row = pickR(rnd, mode === 'ext' ? EXTL : INTL), kind = (n >> 1) % 2 + (mode === 'ext' ? 0 : 0); return { mode, kind: n % 4, r1: row[0], r2: row[1], d: row[2], len: row[3], key: `c${n % 4}.${row.join('.')}` }; },
    model(s, C) {
      if (C.problem) { const q = s.ciPk; return { q, mode: q.mode, g: comGeo(q.r1, q.r2, q.d, q.mode) }; }
      const mode = s.c2cm || 'ext', r1 = s.c2r1, r2 = s.c2r2, need = mode === 'ext' ? Math.abs(r1 - r2) + 1 : r1 + r2 + 1, d = Math.max(s.c2d, need); s.c2d = d;
      return { mode, g: comGeo(r1, r2, d, mode) };
    },
    draw(b, s, M, C) {
      const { g, mode, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore';
      fit(b, { x0: -(pr ? g.r1 : 6) - 0.3, x1: pr ? g.d + g.r2 + 0.3 : 20 + 3.3, y0: -(pr ? g.r1 : 6) - 0.5, y1: (pr ? g.r1 : 6) + 0.5 }, { t: 52, b: 40, l: 30, r: 34 });
      circle(b, g.O1, g.r1, 'ink', 3.4, { fill: 'sky', fa: 0.07 }); circle(b, g.O2, g.r2, 'ink', 3.4, { fill: 'violet', fa: 0.07 });
      const u = unit(sub(g.B, g.A)); line(b, sub(g.A, mul(u, 1.2)), add(g.B, mul(u, 1.2)), 'amber', 3.4);
      line(b, g.O1, g.A, 'ink', 2.4); line(b, g.O2, g.B, 'ink', 2.4); line(b, g.O1, g.O2, 'ink', 2.2, { dash: [6, 5] });
      b.right(g.A, g.O1, g.B, { size: 12, color: 'amber' }); b.right(g.B, g.O2, g.A, { size: 12, color: 'amber' });
      // 오른쪽 중심에서 직선 OA에 수선을 그어요. 반지름이 같으면 직사각형이에요.
      if (!pr && (ex || st >= 1)) {
        if (mode === 'ext' && g.r1 === g.r2) {
          line(b, g.O1, g.O2, 'green', 2.6, { dash: [6, 4] });
          b.right(g.O1, g.A, g.O2, { size: 11, color: 'green' });
          fillPoly(b, [g.O1, g.A, g.B, g.O2], 'green', 0.1);
        } else {
          const foot = add(g.O1, mul(unit(sub(g.A, g.O1)), mode === 'ext' ? g.r1 - g.r2 : g.r1 + g.r2));
          line(b, g.O2, foot, 'green', 2.6, { dash: [6, 4] });
          if (mode === 'int' || g.r1 < g.r2) line(b, g.O1, foot, 'green', 2.6, { dash: [6, 4] });
          b.right(foot, g.O1, g.O2, { size: 11, color: 'green' });
          fillPoly(b, [g.O1, g.O2, foot], 'green', 0.1);
        }
      }
      [g.O1, g.O2, g.A, g.B].forEach((p) => dot(b, p, 'ink', 4.4));
      if (!C.txt) return;
      tagOut(b, g.O1, g.A, 'O', { size: 16, gap: 12 }); tagOut(b, g.O2, g.B, "O′", { size: 16, gap: 12 }); tagOut(b, g.A, g.O1, 'A', { size: 17, gap: 12 }); tagOut(b, g.B, g.O2, 'B', { size: 17, gap: 12 });
      const mk = (k, v) => (pr && q.kind === k ? 'x' : String(v));
      if (pr) {
        segTag(b, g.O1, g.A, String(g.r1), { away: g.O2, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.O2, g.B, String(g.r2), { away: g.O1, color: 'sky', size: S(b), gap: 12 });
        if (q.kind === 0 || q.kind === 1) { segTag(b, g.O1, g.O2, String(q.d), { toward: pt(g.d / 2, 5), color: 'sky', size: S(b), gap: 12 }); segTag(b, g.A, g.B, 'x', { away: g.O1, gap: 14 }); }
        else { segTag(b, g.O1, g.O2, 'x', { toward: pt(g.d / 2, 5), gap: 12 }); segTag(b, g.A, g.B, String(q.len), { away: g.O1, color: 'sky', size: S(b), gap: 14 }); }
        void mk;
        return;
      }
      segTag(b, g.O1, g.A, cv(g.r1), { away: g.O2, color: 'sky', size: S(b), gap: 12 }); segTag(b, g.O2, g.B, cv(g.r2), { away: g.O1, color: 'violet', size: S(b), gap: 12 });
      segTag(b, g.O1, g.O2, 'd=' + cv(g.d), { toward: pt(g.d / 2, 6), color: 'green', size: S(b) - 1, gap: 12 });
      if (ex || st >= 2) segTag(b, g.A, g.B, 'AB=' + cv(g.len), { away: g.O1, color: 'rose', size: S(b), gap: 14 });
    },
    steps: (M) => {
      const g = M.g, ex = g.mode === 'ext', dd = ex ? Math.abs(g.r1 - g.r2) : g.r1 + g.r2, equal = ex && g.r1 === g.r2;
      return [
        `점 A, B는 접점이므로 $\\overline{OA}\\perp AB$, $\\overline{O^{\\prime}B}\\perp AB$예요.`,
        equal ? '두 반지름이 같으면 사각형 OABO′이 직사각형이에요. 수선의 발 H는 O와 같으므로 별도의 직각삼각형은 만들지 않아요.' : ex ? `O′에서 직선 OA에 수선 $\\overline{O^{\\prime}H}$를 그으면 $\\overline{OH}=\\lvert r_1-r_2\\rvert=${fmtN(dd)}$, $\\overline{O^{\\prime}H}=\\overline{AB}$. H는 ${g.r1 > g.r2 ? '선분 OA 위' : 'OA를 O 쪽으로 연장한 부분'}에 있어요.` : `O′에서 반지름 OA의 연장선에 수선 $\\overline{O^{\\prime}H}$를 그으면 $\\overline{OH}=r_1+r_2=${fmtN(dd)}$, $\\overline{O^{\\prime}H}=\\overline{AB}$.`,
        equal ? `직사각형의 마주 보는 변이 같으므로 $\\overline{AB}=\\overline{OO^{\\prime}}=d=${fmtN(g.d)}$예요.` : `직각삼각형 OHO′에서 $\\overline{AB}^2=d^2-(${ex ? 'r_1-r_2' : 'r_1+r_2'})^2=${fmtN(g.d)}^2-${fmtN(dd)}^2$.`,
        `$\\overline{AB}=${nt(g.len)}$.`
      ];
    },
    view: (M) => {
      const g = M.g, ex = g.mode === 'ext';
      return {
        guide: '칩으로 <b>공통외접선/공통내접선</b>을 고르고 막대로 <b>중심 사이의 거리 d</b>(오른쪽 원이 가로로 움직여요)와 반지름을 바꿔 보세요.',
        readouts: [rd('d', fmtN(g.d), 'green', '중심 사이의 거리'), rd(ex ? '|r₁ − r₂|' : 'r₁ + r₂', fmtN(ex ? Math.abs(g.r1 - g.r2) : g.r1 + g.r2), 'violet'), rd('AB', ntD(g.len), 'rose', ex ? '√(d²−(r₁−r₂)²)' : '√(d²−(r₁+r₂)²)')],
        rule: ex ? '[심화] 공통외접선의 길이 $=\\sqrt{d^2-(r_1-r_2)^2}$' : '[심화] 공통내접선의 길이 $=\\sqrt{d^2-(r_1+r_2)^2}$',
        notes: notes('이 장면은 <b>심화</b>예요. 접선과 반지름이 수직이라는 것에서 직각삼각형을 만들어요.', ex ? '외접선은 반지름의 <b>차</b>, 내접선은 반지름의 <b>합</b>을 써요.' : '공통내접선이 있으려면 두 원이 떨어져 있어야 해요(d > r₁+r₂).')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), g = M.g, ex = q.mode === 'ext', kn = ex ? '공통외접선' : '공통내접선';
      let stem, ans, wr, meas, tag;
      const dd = ex ? Math.abs(q.r1 - q.r2) : q.r1 + q.r2;
      const pre = `반지름이 ${q.r1} cm, ${q.r2} cm인 두 원 O, O′에 대하여 직선 AB는 두 원의 ${kn}이다(A, B는 접점).`;
      if (q.kind <= 1) {
        tag = `[심화] ${kn}의 길이`; ans = q.len; meas = g.len;
        stem = `${pre} 두 원의 중심 사이의 거리가 ${q.d} cm일 때, $\\overline{AB}$의 길이 $x$는?`;
        wr = [[q.d - dd, '피타고라스 정리를 써요. 길이를 빼면 안 돼요.'], [q.d, '이것은 중심 사이의 거리예요. AB는 직각삼각형의 한 변이에요.'], [Math.sqrt(q.d * q.d + dd * dd), '빗변이 d예요. AB는 한 변이에요.'], [q.len + 1, `AB²=d²−(${ex ? 'r₁−r₂' : 'r₁+r₂'})²예요.`], [q.d - q.r1 - q.r2 + 1, '피타고라스 정리를 써요.']];
      } else {
        tag = `[심화] ${kn} · 중심 사이의 거리`; ans = q.d; meas = dist(g.O1, g.O2);
        stem = `${pre} $\\overline{AB}=${q.len}$ cm일 때, 두 원의 중심 사이의 거리 $x$는?`;
        wr = [[q.len + dd, '피타고라스 정리를 써요. 길이를 더하면 안 돼요.'], [q.len, '이것은 AB예요.'], [q.len - dd + 2, '피타고라스 정리를 써요.'], [q.d + 1, `d²=AB²+(${ex ? 'r₁−r₂' : 'r₁+r₂'})²예요.`], [q.d + 2, `d²=AB²+(${ex ? 'r₁−r₂' : 'r₁+r₂'})²예요.`]];
      }
      return { tag, key, stem, choices: mkNum(ans, wr, { unit: 'cm' }), chk: [meas, ans] };
    }
  };

  G.register(20, 'c2', '접선', '접선', PARAMS, [trad, two, per, rect, extScene, intScene, comScene]);
})();
