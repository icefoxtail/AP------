/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ⑤ 「평행선 사이의 선분의 길이의 비」 (t5.js, order 50) — 장면 3개
   · s5-1 세 평행선과 두 직선  · l ∥ m ∥ n 이면 AB : BC = DE : EF (평행한 보조선으로 이유 찾기)
   · s5-2 사다리꼴의 평행선 EF · AD ∥ EF ∥ BC, AE : EB = m : n → EF = (n·AD + m·BC) ÷ (m+n)
   · s5-3 사다리꼴의 중간 평행선 · 두 다리의 중점을 이으면 EF = (AD+BC) ÷ 2
   값은 모두 정수이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, mid, lerp, polar, dist, unit, centroid, seeded, ri, rpick, T, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, P, rd, notes, mkChoices, gcd, fmtN, bboxOf, unionBox, phone, capSize, frT, vtx, inter } = G;

  const PARAMS = {
    smLa: P('AB (위쪽 조각)', 1, 4, 1, 2, { color: 'sky', format: (v) => `${v}` }),
    smLb: P('BC (아래쪽 조각)', 1, 4, 1, 3, { color: 'green', format: (v) => `${v}` }),
    smLu: P('아래 직선이 몇 배 기냐 u', 1, 3, 1, 2, { color: 'amber', hint: 'DE = u × AB, EF = u × BC 가 되도록 둘째 직선의 기울기가 바뀌어요' }),
    smTa2: P('윗변 AD', 2, 6, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    smTm: P('AE의 비 m', 1, 3, 1, 1, { color: 'rose' }),
    smTn: P('EB의 비 n', 1, 3, 1, 2, { color: 'violet' }),
    smTt: P('아랫변과의 차 단위 t', 1, 2, 1, 1, { color: 'amber', hint: 'BC = AD + (m+n)×t' }),
    smKa: P('윗변 AD의 반', 1, 3, 1, 2, { color: 'sky' }),
    smKb: P('아랫변 BC의 반', 4, 7, 1, 5, { color: 'green' })
  };

  /* ====================================================================== 1. 세 평행선과 두 직선 */
  const PH = 64; // 직선 p 의 기울기(도)
  function lmnGeo(a, bb, u) {
    const sp = Math.sin(PH * DEG), cp = Math.cos(PH * DEG), sq = sp / u; // 두 번째 직선: sin φq = sin φp / u
    const phq = u === 1 ? 180 - PH : Math.asin(sq) / DEG, cq = Math.cos(phq * DEG);
    const y1 = 0, y2 = a * sp, y3 = (a + bb) * sp;
    const A = pt(0, y1), B = pt(((y2 - y1) / sp) * cp, y2), C = pt(((y3 - y1) / sp) * cp, y3);
    const x0 = 5.5 + (a + bb) * 0.1, D = pt(x0, y1), E = pt(x0 + ((y2 - y1) / sq) * cq, y2), F = pt(x0 + ((y3 - y1) / sq) * cq, y3);
    // 보조선: A 를 지나 직선 q 에 평행 → m, n 과 만나는 점 M, N
    const dq = pt(cq, sq), M = add(A, mul(dq, (y2 - y1) / sq)), N = add(A, mul(dq, (y3 - y1) / sq));
    return { a, bb, u, c: a * u, d: bb * u, A, B, C, D, E, F, M, N, ys: [y1, y2, y3] };
  }
  const lmnS = {
    id: 'sm5-lmn', title: '세 평행선과 두 직선', short: '세 평행선',
    question: '평행한 세 직선 l, m, n이 두 직선과 만나서 선분을 나눌 때, 한 직선에서 나뉜 선분의 비와 다른 직선에서 나뉜 선분의 비는 어떤 관계일까?',
    ctl: ['smLa', 'smLb', 'smLu'],
    init: (s) => { s.smLa = 2; s.smLb = 3; s.smLu = 2; },
    gen: (seed) => { const r = seeded('g1' + seed), a = ri(r, 1, 4), bb = ri(r, 1, 4), u = ri(r, 1, 3), kind = ri(r, 0, 2); return { seed, a, bb, u, kind }; },
    model: (s) => ({ ...lmnGeo(clamp(Math.round(s.smLa), 1, 4), clamp(Math.round(s.smLb), 1, 4), clamp(Math.round(s.smLu), 1, 3)), g: gcd(clamp(Math.round(s.smLa), 1, 4), clamp(Math.round(s.smLb), 1, 4)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? lmnGeo(pk.a, pk.bb, pk.u) : M;
      const ext = 1.4, xs = [g.A.x, g.B.x, g.C.x, g.D.x, g.E.x, g.F.x].concat(C.solution && C.solStep >= 2 ? [g.M.x, g.N.x] : []), x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1.6;
      fit(b, { x0, x1, y0: -0.6, y1: g.ys[2] + 0.8 }, { t: 40, b: 50, l: 36, r: 40 });
      const names = ['l', 'm', 'n'];
      g.ys.forEach((y, i) => { line(b, pt(x0 + 0.4, y), pt(x1 - 0.5, y), 'green', 3.2); par(b, pt(x0 + 0.4, y), pt(x1 - 0.5, y), 1, 'green', 0.04 + 0.0); T(b, pt(x1 - 0.5, y), names[i], { dx: 14, size: 18, color: 'green' }); });
      // 두 직선 p, q (조금 연장)
      const ext1 = (p, q) => [sub(p, mul(unit(sub(q, p)), 0.9)), add(q, mul(unit(sub(q, p)), 0.9))];
      const [p0, p1] = ext1(g.A, g.C), [q0, q1] = ext1(g.D, g.F);
      line(b, p0, p1, 'ink', 3.4); line(b, q0, q1, 'ink', 3.4);
      if ((!prob && C.review && st >= 1) || (C.solution && C.solStep >= 2)) { // 보조선: A 를 지나 q 에 평행
        line(b, g.A, g.N, 'violet', 2.8, { dash: [7, 5] }); b.point(g.M, { color: 'violet', r: 4.2 }); b.point(g.N, { color: 'violet', r: 4.2 });
        T(b, g.M, 'M', { dx: 15, dy: -13, size: 16, color: 'violet' }); T(b, g.N, 'N', { dx: 15, dy: -13, size: 16, color: 'violet' });
        par(b, g.A, g.N, 1, 'violet', 0.38); par(b, g.D, g.F, 1, 'violet', 0.62);
      }
      const sz = 16, cenP = pt(g.A.x - 1, (g.ys[0] + g.ys[2]) / 2), cenQ = pt(g.D.x + 1, (g.ys[0] + g.ys[2]) / 2);
      const lbA = (p, q, t, col, c) => sideTag(b, p, q, c, t, { color: col, size: sz, gap: 12 });
      const L = (p, q, t, col) => { if (t != null) { const side = p.x < (x0 + x1) / 2 ? pt(p.x + 3, p.y) : pt(p.x - 3, p.y); lbA(p, q, t, col, side); } };
      if (prob) {
        const k = pk.kind;
        L(g.A, g.B, String(g.a), 'sky'); L(g.D, g.E, k === 1 ? String(g.c) : (k === 0 ? String(g.c) : null), 'sky');
        if (k === 0) { L(g.B, g.C, String(g.bb), 'green'); L(g.E, g.F, 'x', 'amber'); }
        else if (k === 1) { L(g.E, g.F, String(g.d), 'green'); L(g.B, g.C, 'x', 'amber'); }
        else { L(g.B, g.C, String(g.bb), 'green'); L(g.D, g.E, 'x', 'amber'); dim(b, g.D, g.F, pt(g.D.x - 1, (g.ys[0] + g.ys[2]) / 2), String(g.c + g.d), { color: 'ink', off: 28 }); }
      } else {
        L(g.A, g.B, String(g.a), 'sky'); L(g.B, g.C, String(g.bb), 'green'); L(g.D, g.E, String(g.c), 'sky'); L(g.E, g.F, String(g.d), 'green');
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, pt(p.x - 0.5, p.y + 1), nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `AB : BC = DE : EF = ${g.a} : ${g.bb}` : st >= 2 ? '△ABM ∽ △ACN (동위각과 공통각)' : st >= 1 ? '보조선 AN ∥ DF, 평행사변형으로 AM = DE, MN = EF' : 'l ∥ m ∥ n';
        T(b, pt((x0 + x1) / 2, g.ys[2]), C.review ? (st >= 3 ? msg : st >= 2 ? `AB : AC = AM : AN = DE : DF` : msg) : `AB : BC = DE : EF = ${g.a} : ${g.bb}`, { dy: 36, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      'A를 지나 직선 DF에 평행한 직선을 그어 m, n과 만나는 점을 M, N이라 해요. 평행사변형 ADEM, MEFN에서 $\\overline{AM}=\\overline{DE}$, $\\overline{MN}=\\overline{EF}$예요.',
      `△ACN에서 $\\overline{BM}\\parallel\\overline{CN}$이므로 $\\triangle ABM\\sim\\triangle ACN$ (AA 닮음)이고 $\\overline{AB}:\\overline{AC}=\\overline{AM}:\\overline{AN}$이에요. 곧 $\\overline{AB}:\\overline{AC}=\\overline{DE}:\\overline{DF}$`,
      `이것을 정리하면 $\\overline{AB}:\\overline{BC}=\\overline{DE}:\\overline{EF}$ → $${M.a}:${M.bb}=${M.c}:${M.d}$이에요.`
    ],
    view: (M) => ({
      guide: '<b>AB, BC</b>로 한 직선 위의 두 조각을 바꾸고 <b>u</b>로 다른 직선의 길이를 바꿔 보세요. 어떻게 바꿔도 <b>AB : BC = DE : EF</b>예요.',
      readouts: [rd('AB : BC', `${M.a} : ${M.bb}`, 'sky', M.g > 1 ? `= ${M.a / M.g} : ${M.bb / M.g}` : ''), rd('DE : EF', `${M.c} : ${M.d}`, 'green', `= ${M.a} : ${M.bb}`), rd('AB : AC', `${M.a} : ${M.a + M.bb}`, 'amber', `= ${M.c} : ${M.c + M.d}`)],
      formula: `<p>$\\overline{AB}:\\overline{BC}=\\overline{DE}:\\overline{EF}$ → $${M.a}:${M.bb}=${M.c}:${M.d}$</p>`,
      rule: '세 평행선이 두 직선과 만나면 한 직선에서 나뉜 선분의 길이의 비와 다른 직선에서 나뉜 선분의 길이의 비가 같다',
      notes: notes('같은 쪽(위에서부터)의 선분끼리 비를 써야 해요: AB와 DE, BC와 EF.', '평행선 사이의 선분이 아니라 <b>직선 위에서 나뉜 선분</b>의 비예요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = lmnGeo(pk.a, pk.bb, pk.u);
      if (pk.kind === 0) return { tag: '평행선 사이의 선분의 비: EF', key: `n0${pk.a}${pk.bb}${pk.u}`, stem: 'l ∥ m ∥ n일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.d, [[g.c * g.a / g.bb, '비례식의 위치가 뒤바뀌었어요. AB : BC = DE : EF예요.'], [g.bb, 'BC의 길이예요.'], [g.c + g.bb - g.a, ''], [g.d + 1, ''], [g.d - 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '평행선 사이의 선분의 비: BC', key: `n1${pk.a}${pk.bb}${pk.u}`, stem: 'l ∥ m ∥ n일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.bb, [[g.d * g.c / g.a, '비례식의 위치가 뒤바뀌었어요. AB : BC = DE : EF예요.'], [g.d, 'EF의 길이예요.'], [g.a + g.d - g.c, ''], [g.bb + 1, ''], [g.bb - 1, '']], { pad: 1 }) };
      return { tag: '평행선 사이의 선분의 비: 전체 이용', key: `n2${pk.a}${pk.bb}${pk.u}`, stem: 'l ∥ m ∥ n일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.c, [[(g.c + g.d) * g.bb / g.a, '[함정] AB : BC가 아니라 AB : AC로 비례식을 세워야 해요.'], [g.c + g.d - g.bb, ''], [(g.c + g.d) / 2, '반으로 나누지 않아요. 비로 나눠요.'], [g.c + 1, ''], [g.c - 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 2. 사다리꼴의 평행선 EF */
  function trGeo(a, m, n, t) {
    const AB = 2 * (m + n), bcL = a + (m + n) * t, A = pt(0, 0), B = pt(0, AB), D = pt(a, 0), Cc = pt(bcL, AB), E = lerp(A, B, m / (m + n)), F = lerp(D, Cc, m / (m + n));
    const Hh = pt(bcL - a, AB), Gg = lerp(A, Hh, m / (m + n));
    return { a, m, n, t, AB, AE: 2 * m, EB: 2 * n, AD: a, BC: bcL, EF: a + m * t, EG: m * t, A, B, C: Cc, D, E, F, H: Hh, Gp: Gg };
  }
  const trS = {
    id: 'sm5-trap', title: '사다리꼴의 평행선 EF', short: '사다리꼴 EF',
    question: '사다리꼴 ABCD의 다리 AB 위의 점 E에서 밑변에 평행한 선분 EF를 그었어. AE : EB의 비를 알면 EF의 길이를 구할 수 있을까?',
    ctl: ['smTa2', 'smTm', 'smTn', 'smTt'],
    init: (s) => { s.smTa2 = 4; s.smTm = 1; s.smTn = 2; s.smTt = 1; },
    gen: (seed) => { const r = seeded('g2' + seed), a = ri(r, 2, 6), m = ri(r, 1, 3), n = ri(r, 1, 3), t = ri(r, 1, 2), kind = ri(r, 0, 1); return { seed, a, m, n, t, kind }; },
    model: (s) => ({ ...trGeo(clamp(Math.round(s.smTa2), 2, 6), clamp(Math.round(s.smTm), 1, 3), clamp(Math.round(s.smTn), 1, 3), clamp(Math.round(s.smTt), 1, 2)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? trGeo(pk.a, pk.m, pk.n, pk.t) : M;
      fit(b, bboxOf([g.A, g.B, g.C, g.D]), { t: 40, b: 78, l: 50, r: 44 });
      const cen = centroid([g.A, g.B, g.C, g.D]);
      fillPoly(b, [g.A, g.D, g.F, g.E], 'sky', 0.14); fillPoly(b, [g.E, g.F, g.C, g.B], 'green', 0.1);
      poly(b, [g.A, g.B, g.C, g.D], 'ink', 3.6); line(b, g.E, g.F, 'amber', 3.8);
      par(b, g.A, g.D, 1, 'green'); par(b, g.E, g.F, 1, 'green'); par(b, g.B, g.C, 1, 'green');
      if ((!prob && C.review && st >= 1) || (C.solution && C.solStep >= 2)) { line(b, g.A, g.H, 'violet', 2.8, { dash: [7, 5] }); b.point(g.H, { color: 'violet', r: 4.2 }); b.point(g.Gp, { color: 'violet', r: 4.2 }); T(b, g.H, 'H', { dy: 18, size: 16, color: 'violet' }); T(b, g.Gp, 'G', { dx: 14, dy: 13, size: 16, color: 'violet' }); par(b, g.A, g.H, 1, 'violet', 0.5); par(b, g.D, g.C, 1, 'violet', 0.5); }
      const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); if (pk.kind !== 1) lb(g.B, g.C, cen, String(g.BC), 'green');
        if (pk.kind === 0) { lb(g.A, g.E, cen, String(g.AE), 'rose'); lb(g.E, g.B, cen, String(g.EB), 'violet'); T(b, lerp(g.E, g.F, 0.35), 'EF = x', { size: 17, color: 'amber', dy: -15 }); }
        else { lb(g.A, g.E, cen, String(g.AE), 'rose'); lb(g.E, g.B, cen, String(g.EB), 'violet'); lb(g.B, g.C, cen, 'x', 'amber'); T(b, lerp(g.E, g.F, 0.35), `EF = ${g.EF}`, { size: 16, color: 'sky', dy: -15 }); }
        if (pk.kind === 1) { /* BC 는 구하는 값, AD 와 EF 가 주어짐 */ }
      } else {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.B, g.C, cen, String(g.BC), 'green'); lb(g.A, g.E, cen, String(g.AE), 'rose'); lb(g.E, g.B, cen, String(g.EB), 'violet');
        T(b, lerp(g.E, g.F, 0.3), !C.review || st >= 3 ? `EF = ${g.EF}` : 'EF', { size: 16, color: 'amber', dy: -14 });
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `EF = EG + GF = ${g.EG} + ${g.AD} = ${g.EF}` : st >= 2 ? `EG : BH = AE : AB = ${g.m} : ${g.m + g.n}` : st >= 1 ? 'A에서 DC에 평행한 보조선 AH' : `AE : EB = ${g.m} : ${g.n}`;
        T(b, pt((g.B.x + g.C.x) / 2, g.B.y), msg, { dy: 58, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      `점 A를 지나 DC에 평행한 선분 AH를 그어 EF, BC와 만나는 점을 G, H라 해요. 그러면 $\\overline{GF}=\\overline{HC}=\\overline{AD}=${M.AD}$, $\\overline{BH}=${M.BC}-${M.AD}=${M.BC - M.AD}$예요.`,
      `$\\triangle ABH\\sim\\triangle AEG$이므로 $\\overline{EG}:\\overline{BH}=\\overline{AE}:\\overline{AB}=${M.m}:${M.m + M.n}$ → $\\overline{EG}=${M.BC - M.AD}\\times${frT(M.m, M.m + M.n).slice(1, -1)}=${M.EG}$`,
      `$\\overline{EF}=\\overline{EG}+\\overline{GF}=${M.EG}+${M.AD}=${M.EF}$. 한 번에 구하면 $\\overline{EF}=\\dfrac{${M.n}\\times${M.AD}+${M.m}\\times${M.BC}}{${M.m + M.n}}=${M.EF}$`
    ],
    view: (M) => ({
      guide: '<b>AD</b>, <b>AE : EB</b>와 두 밑변의 차를 바꿔 보세요. EF는 점 E가 B에 가까울수록 BC에, A에 가까울수록 AD에 가까워져요.',
      readouts: [rd('AE : EB', `${M.AE} : ${M.EB}`, 'rose', `= ${M.m} : ${M.n}`), rd('AD, BC', `${M.AD}, ${M.BC}`, 'sky'), rd('EF', `${M.EF}`, 'amber', `(${M.n}×${M.AD} + ${M.m}×${M.BC}) ÷ ${M.m + M.n}`)],
      formula: `<p>$\\overline{EF}=\\dfrac{n\\times\\overline{AD}+m\\times\\overline{BC}}{m+n}=\\dfrac{${M.n}\\times${M.AD}+${M.m}\\times${M.BC}}{${M.m + M.n}}=${M.EF}$</p>`,
      rule: 'AD ∥ EF ∥ BC이고 AE : EB = m : n 이면 EF = (n × AD + m × BC) ÷ (m + n)',
      notes: notes('<b>[함정]</b> AE : EB = m : n이면 EF는 AD와 BC를 <b>엇갈려서</b> 곱해요: AD에 n, BC에 m을 곱해요.', 'A에서 DC에 평행한 보조선을 그으면 평행사변형과 닮은 삼각형이 나타나요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = trGeo(pk.a, pk.m, pk.n, pk.t);
      if (pk.kind === 0) return { tag: '사다리꼴의 평행선: EF', key: `t0${pk.a}${pk.m}${pk.n}${pk.t}`, stem: 'AD ∥ EF ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EF, [[(g.m * g.AD + g.n * g.BC) / (g.m + g.n), '[함정] 곱하는 위치가 뒤바뀌었어요. AD에 n, BC에 m을 곱해야 해요.'], [(g.AD + g.BC) / 2, '두 밑변의 평균이에요. E가 중점일 때만 성립해요.'], [g.AD + g.BC - g.EF, ''], [g.EF + 1, ''], [g.EF - 1, '']], { pad: 1 }) };
      return { tag: '사다리꼴의 평행선: BC', key: `t1${pk.a}${pk.m}${pk.n}${pk.t}`, stem: 'AD ∥ EF ∥ BC일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.EF + g.t, ''], [(g.m + g.n) * g.EF / g.m - g.n * g.AD / g.m + 0.0 === g.BC ? g.BC + 2 : g.AD + g.EF, ''], [g.EF * 2 - g.AD, '두 밑변의 평균으로 풀었어요. E가 중점일 때만 성립해요.'], [g.BC + 1, ''], [g.BC - 1, '']], { pad: 1 }) };
    }
  };

  /* ====================================================================== 3. 사다리꼴의 중간 평행선 */
  function midTrGeo(a0, b0) {
    const a = 2 * a0, bb = 2 * b0, H = 6, A = pt((bb - a) / 2, 0), D = pt((bb - a) / 2 + a, 0), B = pt(0, H), Cc = pt(bb, H), E = mid(A, B), F = mid(D, Cc);
    const Pp = inter(B, D, E, F), Qp = inter(A, Cc, E, F);
    return { a0, b0, a, bb, AD: a, BC: bb, EF: a0 + b0, EP: a0, PQ: b0 - a0, QF: a0, A, B, C: Cc, D, E, F, Pp, Qp };
  }
  const tmS = {
    id: 'sm5-tmid', title: '사다리꼴의 중간 평행선', short: '중간 평행선',
    question: '사다리꼴 ABCD에서 두 다리 AB, DC의 중점 E, F를 이은 선분 EF의 길이는 두 밑변의 길이로 어떻게 구할까? 대각선과 만나는 점 사이의 길이는?',
    ctl: ['smKa', 'smKb'],
    init: (s) => { s.smKa = 2; s.smKb = 5; },
    gen: (seed) => { const r = seeded('g3' + seed), a0 = ri(r, 1, 3), b0 = ri(r, 4, 7), kind = ri(r, 0, 2); return { seed, a0, b0, kind }; },
    model: (s) => ({ ...midTrGeo(clamp(Math.round(s.smKa), 1, 3), clamp(Math.round(s.smKb), 4, 7)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? midTrGeo(pk.a0, pk.b0) : M;
      fit(b, bboxOf([g.A, g.B, g.C, g.D]), { t: 40, b: 78, l: 50, r: 44 });
      const cen = centroid([g.A, g.B, g.C, g.D]);
      fillPoly(b, [g.A, g.D, g.F, g.E], 'sky', 0.14); fillPoly(b, [g.E, g.F, g.C, g.B], 'green', 0.1);
      poly(b, [g.A, g.B, g.C, g.D], 'ink', 3.6); line(b, g.E, g.F, 'amber', 3.8);
      par(b, g.A, g.D, 1, 'green'); par(b, g.E, g.F, 1, 'green'); par(b, g.B, g.C, 1, 'green');
      tick(b, g.A, g.E, 1, 'amber'); tick(b, g.E, g.B, 1, 'amber'); tick(b, g.D, g.F, 2, 'amber'); tick(b, g.F, g.C, 2, 'amber');
      const showDiag = prob ? pk.kind === 2 : (!C.review || st >= 1);
      if (showDiag) { line(b, g.A, g.C, 'violet', 2.6, { dash: [7, 5] }); if (pk.kind === 2 || !prob) { line(b, g.B, g.D, 'violet', 2.6, { dash: [7, 5] }); b.point(g.Pp, { color: 'violet', r: 4 }); b.point(g.Qp, { color: 'violet', r: 4 }); T(b, g.Pp, 'P', { dx: -3, dy: 16, size: 16, color: 'violet' }); T(b, g.Qp, 'Q', { dx: 3, dy: 16, size: 16, color: 'violet' }); } }
      const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); if (pk.kind !== 1) lb(g.B, g.C, cen, String(g.BC), 'green');
        if (pk.kind === 0) T(b, lerp(g.E, g.F, 0.35), 'EF = x', { size: 17, color: 'amber', dy: -15 });
        else if (pk.kind === 1) { T(b, lerp(g.E, g.F, 0.35), `EF = ${g.EF}`, { size: 16, color: 'sky', dy: -15 }); lb(g.B, g.C, cen, 'x', 'amber'); }
        else { /* BC, AD 모두 주어지고 PQ 를 구함 */ T(b, lerp(g.Pp, g.Qp, 0.5), 'x', { size: 18, color: 'amber', dy: -15 }); }
      } else {
        lb(g.A, g.D, cen, String(g.AD), 'sky'); lb(g.B, g.C, cen, String(g.BC), 'green');
        T(b, lerp(g.E, g.F, 0.5), !C.review || st >= 3 ? `EF = ${g.EF}` : '', { size: 16, color: 'amber', dy: (!C.review || st >= 2) ? 34 : -15 });
        if (!C.review || st >= 2) { T(b, lerp(g.E, g.Pp, 0.5), String(g.EP), { size: 15, color: 'sky', dy: -13 }); T(b, lerp(g.Pp, g.Qp, 0.5), String(g.PQ), { size: 15, color: 'amber', dy: -13 }); T(b, lerp(g.Qp, g.F, 0.5), String(g.QF), { size: 15, color: 'sky', dy: -13 }); }
      }
      [[g.A, 'A'], [g.B, 'B'], [g.C, 'C'], [g.D, 'D'], [g.E, 'E'], [g.F, 'F']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `EF = ${g.a / 2} + ${g.bb / 2} = ${g.EF}  (= (${g.AD} + ${g.BC}) ÷ 2)` : st >= 2 ? `EQ = BC의 절반 = ${g.b0}, QF = AD의 절반 = ${g.a0}` : st >= 1 ? '대각선 AC를 그어 EF와 만나는 점 Q' : 'E, F는 두 다리의 중점';
        T(b, pt((g.B.x + g.C.x) / 2, g.B.y), msg, { dy: 58, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '대각선 AC를 그어 EF와 만나는 점을 Q라 해요. △ABC에서 E는 AB의 중점이고 $\\overline{EQ}\\parallel\\overline{BC}$이므로 Q는 AC의 중점이에요.',
      `중점연결정리로 $\\overline{EQ}=\\dfrac{1}{2}\\overline{BC}=${M.b0}$, △ACD에서도 $\\overline{QF}=\\dfrac{1}{2}\\overline{AD}=${M.a0}$이에요. (대각선 BD와 만나는 점 P에서 $\\overline{EP}=${M.a0}$, $\\overline{PQ}=${M.b0}-${M.a0}=${M.PQ}$)`,
      `$\\overline{EF}=\\overline{EQ}+\\overline{QF}=\\dfrac{1}{2}(\\overline{AD}+\\overline{BC})=\\dfrac{1}{2}\\times(${M.AD}+${M.BC})=${M.EF}$`
    ],
    view: (M) => ({
      guide: '<b>윗변 AD, 아랫변 BC</b>의 절반을 바꿔 보세요. 중간 평행선 EF는 두 밑변의 <b>평균</b>이고, 대각선과 만나서 세 조각 <b>a, b−a, a</b>로 나뉘어요.',
      readouts: [rd('EF', `${M.EF}`, 'amber', `(${M.AD} + ${M.BC}) ÷ 2`), rd('EP, PQ, QF', `${M.EP}, ${M.PQ}, ${M.QF}`, 'violet', '', null, true)],
      formula: `<p>$\\overline{EF}=\\dfrac{\\overline{AD}+\\overline{BC}}{2}=\\dfrac{${M.AD}+${M.BC}}{2}=${M.EF}$</p><p>$\\overline{PQ}=\\dfrac{\\overline{BC}-\\overline{AD}}{2}=${M.PQ}$</p>`,
      rule: '사다리꼴에서 두 다리의 중점을 이은 선분은 두 밑변과 평행하고 길이는 두 밑변의 길이의 합의 절반이다',
      notes: notes('중점이 <b>양쪽 다리 모두</b>에 있을 때만 쓸 수 있어요.', '대각선을 하나 그으면 삼각형 두 개로 나뉘어 중점연결정리를 쓸 수 있어요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = midTrGeo(pk.a0, pk.b0);
      if (pk.kind === 0) return { tag: '사다리꼴의 중간 평행선: EF', key: `u0${pk.a0}${pk.b0}`, stem: '사다리꼴 ABCD에서 AD ∥ BC이고 점 E, F가 각각 AB, DC의 중점일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.EF, [[g.AD + g.BC, '두 밑변의 합이에요. 평균(절반)을 구해야 해요.'], [g.BC - g.AD, '두 밑변의 차예요.'], [(g.BC - g.AD) / 2, ''], [g.EF + 1, ''], [g.EF - 1, '']], { pad: 1 }) };
      if (pk.kind === 1) return { tag: '사다리꼴의 중간 평행선: BC', key: `u1${pk.a0}${pk.b0}`, stem: '사다리꼴 ABCD에서 AD ∥ BC이고 점 E, F가 각각 AB, DC의 중점일 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.BC, [[g.EF * 2 + g.AD, ''], [g.EF - g.AD + g.EF, ''], [g.EF + g.AD, '합이 아니에요. BC = 2×EF − AD예요.'], [g.EF * 2, 'AD를 빼지 않았어요.'], [g.BC + 1, '']], { pad: 1 }) };
      return { tag: '사다리꼴의 중간 평행선: PQ', key: `u2${pk.a0}${pk.b0}`, stem: '사다리꼴 ABCD에서 AD ∥ BC이고 점 E, F가 각각 AB, DC의 중점이다. EF가 대각선 BD, AC와 만나는 점을 각각 P, Q라 할 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(g.PQ, [[g.EF, 'EF의 길이예요.'], [g.AD / 2, 'EP의 길이예요.'], [g.BC / 2, 'EQ의 길이예요.'], [g.PQ + 1, ''], [g.PQ - 1, '']], { pad: 1 }) };
    }
  };

  G.geo = Object.assign(G.geo || {}, { lmnGeo, trGeo, midTrGeo });
  G.register(50, 't5', '⑤ 평행선 사이의 선분의 길이의 비', '평행선과 선분의 비', PARAMS, [lmnS, trS, tmS]);
})();
