/* ==========================================================================
   중1 · 작도와 합동 — 탭 ⑥ 「숨은 합동」 (t6.js, order 60) — 장면 4개
   · c6-1 정삼각형 두 개 (B·C·E 일직선)   · △BCD를 점 C 둘레로 60° 제자리 회전 → △ACE에 겹침
   · c6-2 정삼각형과 정삼각형 (점 A 공유)   · 점 D를 BC 위에서 가로로 끌기 · △ABD를 점 A 둘레로 60° 회전 → △ACE
   · c6-3 정사각형 둘 (꼭짓점 A 공유)       · △ABE를 점 A 둘레로 90° 회전 → △ADG
   · c6-4 정사각형과 정삼각형              · △ABE를 변 BC의 수직이등분선 둘레로 제자리 뒤집기 → △DCE
   문제는 「어느 합동 조건이냐」가 아니라 구하는 값 하나(각 또는 길이)를 묻습니다. 합동 조건이 여러 가지로 성립해도 답은 하나입니다.
   그림의 길이·각은 모두 지금의 값으로 다시 계산됩니다(√ 없이 같은 눈금·같은 호로 표시).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, rotP, dirDeg, angBetween, inter, centroid, pick, rint, T, tick, line, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, dg, ol, tagOut, sideTag, fillPoly, poly, ang, bboxOf, unionBox } = G;
  const S3 = Math.sqrt(3);
  const pctF = (v) => Math.round(v * 100) + '%';
  const lenF = (v) => fmtN(v) + ' cm';
  const degF = G.degF;
  const rot0 = (p, c, deg) => rotP(p, c, deg);

  const PARAMS = {
    cnGa: P('정삼각형 ABC의 한 변 a', 3, 7, 1, 5, { color: 'sky', format: lenF }),
    cnGb: P('정삼각형 CDE의 한 변 b', 3, 7, 1, 4, { color: 'green', format: lenF }),
    cnGt: P('△BCD를 돌리기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르면 △BCD가 점 C를 중심으로 제자리에서 60° 돌아요', format: (v) => (v >= 0.999 ? '60° (겹침)' : Math.round(v * 60) + '°') }),
    cnHL: P('정삼각형 ABC의 한 변', 4, 9, 1, 6, { color: 'sky', format: lenF }),
    cnHd: P('BD의 길이', 1, 8, 1, 2, { color: 'amber', format: lenF, hint: '노란 점 D를 변 BC 위에서 가로로 끌어도 돼요' }),
    cnHt: P('△ABD를 돌리기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르면 △ABD가 점 A를 중심으로 제자리에서 60° 돌아요', format: (v) => (v >= 0.999 ? '60° (겹침)' : Math.round(v * 60) + '°') }),
    cnKa: P('큰 정사각형 ABCD의 한 변', 4, 8, 1, 6, { color: 'sky', format: lenF }),
    cnKe: P('작은 정사각형 AEFG의 한 변', 2, 5, 1, 3, { color: 'green', format: lenF }),
    cnKth: P('∠BAE의 크기', 15, 75, 5, 35, { color: 'amber', format: degF, hint: '노란 점 E를 끌어도 돼요' }),
    cnKt: P('△ABE를 돌리기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르면 △ABE가 점 A를 중심으로 제자리에서 90° 돌아요', format: (v) => (v >= 0.999 ? '90° (겹침)' : Math.round(v * 90) + '°') }),
    cnJa: P('정사각형의 한 변', 4, 8, 1, 6, { color: 'sky', format: lenF }),
    cnJt: P('△ABE를 뒤집기', 0, 1, 0.01, 0, { color: 'rose', hint: '▶를 누르면 △ABE가 제자리에서 뒤집혀 △DCE에 겹쳐요', format: (v) => (v >= 0.999 ? '뒤집힘 (겹침)' : Math.round(v * 100) + '%') })
  };
  const sm = (b) => b.W < 560;
  const cap = (b, x, y, text, color, dy = 24) => T(b, pt(x, y), text, { dy, size: sm(b) ? 13 : 16, color });
  const lab = (b, p, c, name, size = 17, gap = 11) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, c, name, { size, gap }); };

  /* ====================================================================== 1. 정삼각형 두 개 (B·C·E 일직선) */
  const geo1 = (a, b) => { const B = pt(0, 0), C = pt(a, 0), E = pt(a + b, 0), A = pt(a / 2, -a * S3 / 2), D = pt(a + b / 2, -b * S3 / 2); return { A, B, C, D, E, P: inter(B, D, A, E), a, b }; };
  const eq1 = {
    id: 'c6-1', title: '정삼각형 두 개 · △BCD ≡ △ACE', short: '정삼각형 두 개',
    question: '정삼각형 ABC와 CDE가 점 C를 공유하고 B, C, E가 한 직선 위에 있을 때, 숨어 있는 합동 삼각형은 무엇이고 무엇을 알 수 있을까?',
    ctl: ['cnGa', 'cnGb', 'cnGt'], anim: { key: 'cnGt', dur: 4.5, label: '△BCD 돌리기', start: 0 },
    init: (s) => { s.cnGa = 5; s.cnGb = 4; s.cnGt = 0; s.cnPk = { y: 30, k: 0, kind: 0, q: 0 }; },
    reroll: (s) => { s.cnPk = { y: pick([25, 30, 35, 40, 45], s.cnPk && s.cnPk.y), k: ((s.cnPk && s.cnPk.k) || 0) + 1, kind: ((s.cnPk && s.cnPk.kind) || 0) === 0 ? 1 : 0, q: rint(0, 3) }; },
    model: (s) => { const g = geo1(s.cnGa, s.cnGb), pk = s.cnPk || { y: 30, k: 0, kind: 0, q: 0 }; const y = Math.atan((S3 * s.cnGa) / (s.cnGa + 2 * s.cnGb)) / DEG; return { ...g, y, apb: g.P ? angBetween(g.P, g.A, g.B) : 60, pk }; },
    draw(b, s, M, C) {
      const pk = M.pk, g = C.problem ? (pk.kind === 0 ? geo1(5, Math.max(1.5, 5 * (S3 / Math.tan(pk.y * DEG) - 1) / 2)) : geo1(5, 4)) : M;
      const { A, B, C: Cp, D, E } = g, Pp = g.P || inter(B, D, A, E), st = C.review ? C.step : 4;
      fit(b, { x0: -0.6, x1: g.a + g.b + 0.6, y0: -Math.max(g.a, g.b) * S3 / 2 - 0.5, y1: 0.4 }, { t: 40, b: 52 });
      const t = C.problem ? 0 : C.review ? (st === 3 ? 1 : st >= 4 ? 1 : 0) : C.t;
      const prob = C.problem, cen = centroid([A, B, E]);
      fillPoly(b, [A, B, Cp], 'sky', 0.1); fillPoly(b, [Cp, D, E], 'green', 0.1);
      poly(b, [A, B, Cp], 'ink', 3.4); poly(b, [Cp, D, E], 'ink', 3.4); line(b, B, E, 'ink', 3.4);
      // 숨은 합동의 두 삼각형
      line(b, B, D, 'rose', 3.2); line(b, A, E, 'rose', 3.2);
      if (!prob && t > 0.001) { const R = [B, Cp, D].map((p) => rot0(p, Cp, 60 * t)); fillPoly(b, R, 'rose', 0.22); poly(b, R, 'rose', 3.2, { alpha: 0.9 }); }
      if (!prob && t >= 0.999) poly(b, [A, Cp, E], 'amber', 3, { dash: [8, 5] });
      const expl = C.tab === 'explore';
      if (prob || expl || st === 1 || st === 3) { [[A, B], [B, Cp], [Cp, A]].forEach(([p, q]) => tick(b, p, q, 1, 'amber')); [[Cp, D], [D, E], [E, Cp]].forEach(([p, q]) => tick(b, p, q, 2, 'amber')); }
      if (!prob && st === 2) {
        ang(b, Cp, A, B, { color: 'sky', rings: 1, label: '60°', r: 18, labelDist: 34, size: 13 });
        ang(b, Cp, D, E, { color: 'sky', rings: 1, label: '60°', r: 18, labelDist: 34, size: 13 });
        ang(b, Cp, D, A, { color: 'sky', rings: 1, label: '60°', r: 18, labelDist: 34, size: 13, labelRot: 0 });
      }
      if (!prob && (expl || st === 2 || st === 3)) {
        ang(b, Cp, B, D, { color: 'amber', rings: 2, label: '120°', r: 40, labelDist: 66, size: 14 });
        ang(b, Cp, A, E, { color: 'amber', rings: 2, label: '120°', r: 54, labelDist: 84, size: 14 });
      }
      if (!prob && (expl || st >= 3)) { tick(b, B, D, 3, 'rose'); tick(b, A, E, 3, 'rose'); }
      if (!prob && (expl || st >= 4) && Pp) { ang(b, Pp, A, B, { color: 'rose', rings: 1, label: dg(M.apb), r: 22, labelDist: 40, size: 14 }); }
      if (prob) {
        if (pk.kind === 0) { ang(b, D, B, Cp, { color: 'sky', rings: 1, label: `${pk.y}°`, r: 26, labelDist: 52, size: 14 }); ang(b, E, D, A, { color: 'rose', rings: 1, label: '?', r: 30, labelDist: 52, size: 15 }); }
        else { const o = [[A, B], [B, g.E], [g.E, D], [D, A]][pk.q]; ang(b, Pp, o[0], o[1], { color: 'rose', rings: 1, label: '?', r: 24, labelDist: 44, size: 15 }); }
      }
      [[A, 'A'], [B, 'B'], [Cp, 'C'], [D, 'D'], [E, 'E']].forEach(([p, n]) => { b.point(p, { color: 'ink', r: 4.6 }); const o = n === 'C' ? pt(0, 1) : p; if (n === 'C') T(b, p, 'C', { dy: 18, size: 17 }); else tagOut(b, p, cen, n, { size: 17, gap: n === 'B' || n === 'E' ? 12 : 11 }); });
      if ((prob && pk.kind !== 0) || st >= 4 || C.tab === 'explore') { if (Pp) { b.point(Pp, { color: 'rose', r: 4.2 }); if (C.txt) T(b, Pp, 'P', { dx: 12, dy: 16, size: 16, color: 'rose' }); } }
      if (C.txt && !prob) {
        const msgs = ['같은 길이: AB=BC=CA, CD=DE=EC', '두 각 ∠BCD, ∠ACE는 모두 120°', t >= 0.999 ? '△BCD가 △ACE에 겹쳐요 → 합동 (SAS)' : '△BCD를 점 C 둘레로 60° 돌려요', `합동이라서 BD = AE, 두 선분이 이루는 각 ∠APB = ${dg(M.apb)}`];
        const m = C.review ? msgs[Math.min(3, Math.max(0, st - 1))] : t >= 0.999 ? msgs[2] : t > 0 ? msgs[2] : '▶를 눌러 △BCD를 돌려 보세요';
        cap(b, (g.a + g.b) / 2, 0, m, t >= 0.999 ? 'green' : 'amber', 46);
      }
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `정삼각형이므로 $\\overline{BC}=\\overline{AC}=${M.a}$, $\\overline{CD}=\\overline{CE}=${M.b}$예요. (같은 눈금)`,
      `B, C, E가 한 직선 위이고 $\\angle ACB=\\angle DCE=60^{\\circ}$이므로 $\\angle ACD=180^{\\circ}-60^{\\circ}-60^{\\circ}=60^{\\circ}$예요. 그러므로 $\\angle BCD=\\angle ACE=60^{\\circ}+60^{\\circ}=120^{\\circ}$예요.`,
      `$\\overline{BC}=\\overline{AC}$, $\\angle BCD=\\angle ACE$, $\\overline{CD}=\\overline{CE}$이므로 $\\triangle BCD\\equiv\\triangle ACE$ (SAS 합동)예요. △BCD를 점 C 둘레로 $60^{\\circ}$ 돌리면 △ACE에 겹쳐요.`,
      `합동이므로 $\\overline{BD}=\\overline{AE}$이고 $\\angle CBD=\\angle CAE$예요. 그래서 $\\overline{BD}$와 $\\overline{AE}$가 이루는 각 $\\angle APB=${dg(M.apb).replace('°', '')}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>두 정삼각형의 크기</b>를 바꿔 보세요. ▶를 누르면 <b>△BCD가 점 C를 중심으로 60° 돌아</b> △ACE에 꼭 겹쳐요. 같은 눈금은 같은 길이, 같은 호는 같은 각이에요.',
      readouts: [rd('∠BCD = ∠ACE', '120°', 'amber', '60° + 60°'), rd('BD = AE', '같아요', 'rose', '△BCD ≡ △ACE'), rd('∠BDC = ∠AEC', dg(M.y), 'sky', '대응각'), rd('BD와 AE가 이루는 각', dg(M.apb), 'rose', '늘 60°', null, true)],
      formula: `<p>$\\triangle BCD\\equiv\\triangle ACE$ (SAS) → $\\overline{BD}=\\overline{AE}$, $\\angle BDC=\\angle AEC=${fmtN(M.y)}^{\\circ}$</p>`,
      rule: '정삼각형 두 개가 점 C를 공유하면 △BCD ≡ △ACE (SAS)',
      notes: notes('합동인 두 삼각형의 <b>꼭짓점 순서</b>: B↔A, C↔C, D↔E예요.', '∠BCD와 ∠ACE는 <b>둘 다 120°</b>예요(60°+60°). 60°로 착각하지 마세요.')
    }),
    prob: (M) => {
      const pk = M.pk, key = `y${pk.y}k${pk.kind}q${pk.q}`;
      if (pk.kind === 0) {
        const y = pk.y, x = 60 - y;
        return { tag: '숨은 합동 · 정삼각형 두 개와 각', key, stem: `그림에서 점 B, C, E는 한 직선 위에 있고, △ABC와 △CDE는 정삼각형이다. $\\angle BDC=${y}^{\\circ}$일 때, $\\angle DEA$의 크기는?`, choices: mkChoices(x, [[y, '∠AEC의 크기예요. ∠DEA는 ∠CED(60°)에서 ∠AEC를 빼야 해요.'], [60, '∠CED의 크기예요. ∠AEC를 빼야 해요.'], [120 - y, '∠BCD와 ∠ACE는 모두 120°예요. 삼각형의 내각의 합을 이용해 ∠AEC를 구한 뒤 60°에서 빼요.'], [60 + y, '더하지 않고 60°에서 빼야 해요.']], { tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad: 5, valid: (v) => v > 0 && v < 180 }) };
      }
      const g = geo1(5, 4), Pp = g.P, q = pk.q;
      const opts = [['APB', angBetween(Pp, g.A, g.B)], ['BPE', angBetween(Pp, g.B, g.E)], ['EPD', angBetween(Pp, g.E, g.D)], ['DPA', angBetween(Pp, g.D, g.A)]][q];
      const ans = Math.round(opts[1]);
      return { tag: '숨은 합동 · 두 선분이 이루는 각', key, stem: `그림에서 점 B, C, E는 한 직선 위에 있고, △ABC와 △CDE는 정삼각형이다. 두 선분 AE, BD의 교점을 P라 할 때, $\\angle ${opts[0]}$의 크기는?`, choices: mkChoices(ans, [[60, '△BCD ≡ △ACE이므로 AE와 BD가 이루는 각은 60°예요. ∠' + opts[0] + '가 어느 쪽 각인지 그림에서 확인해 보세요.'], [120, '∠' + opts[0] + '는 그림에서 어느 쪽 각인지 확인해 보세요. 60°와 120° 중 하나예요.'], [90, '직각이 아니에요.'], [30, '60°의 반이 아니에요.'], [45, '45°가 아니에요.']], { tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad: 15, valid: (v) => v > 0 && v < 180 }) };
    },
    verify: (s) => { const g = geo1(s.cnGa, s.cnGb); return { ans: angBetween(g.P, g.A, g.B), model: 60 }; }
  };

  /* ====================================================================== 2. 정삼각형 ABC와 ADE (점 A 공유) */
  const geo2 = (L, d) => { const B = pt(0, 0), C = pt(L, 0), A = pt(L / 2, -L * S3 / 2), D = pt(d, 0), E = rot0(D, A, -60); return { A, B, C, D, E, L, d }; };
  const eq2 = {
    id: 'c6-2', title: '정삼각형 ABC와 ADE · △ABD ≡ △ACE', short: '점 A를 공유한 정삼각형',
    question: '정삼각형 ABC의 변 BC 위에 점 D를 잡고 AD를 한 변으로 하는 정삼각형 ADE를 그리면, 어떤 삼각형이 합동일까?',
    ctl: ['cnHL', 'cnHd', 'cnHt'], anim: { key: 'cnHt', dur: 4.5, label: '△ABD 돌리기', start: 0 },
    init: (s) => { s.cnHL = 6; s.cnHd = 2; s.cnHt = 0; s.cnPk = { L: 8, c: 3, kind: 0, k: 0 }; },
    reroll: (s) => { const L = rint(6, 12), c = rint(2, L - 2); s.cnPk = { L, c, kind: (((s.cnPk && s.cnPk.kind) || 0) + 1) % 3, k: ((s.cnPk && s.cnPk.k) || 0) + 1 }; },
    model: (s) => { const L = s.cnHL, d = clamp(s.cnHd, 1, L - 1); return { L, d, g: geo2(L, d), pk: s.cnPk || { L: 8, c: 3, kind: 0, k: 0 } }; },
    draw(b, s, M, C) {
      const pk = M.pk, L = C.problem ? pk.L : M.L, d = C.problem ? (pk.kind === 1 ? pk.c : pk.L - pk.c) : M.d, g = geo2(L, d), { A, B, C: Cp, D, E } = g, st = C.review ? C.step : 4, prob = C.problem;
      const bb = bboxOf([A, B, Cp, D, E], 0.5);
      fit(b, { x0: bb.x0 - 0.2, x1: Math.max(bb.x1, L + 1), y0: bb.y0, y1: 0.8 }, { t: 40, b: 52 });
      const t = prob ? 0 : C.review ? (st >= 3 ? 1 : 0) : C.t, cen = centroid([A, B, Cp]);
      fillPoly(b, [A, B, Cp], 'sky', 0.1); fillPoly(b, [A, D, E], 'rose', 0.1);
      poly(b, [A, B, Cp], 'ink', 3.4); poly(b, [A, D, E], 'ink', 3.4); line(b, B, Cp, 'ink', 3.4);
      if (!prob && t > 0.001) { const R = [A, B, D].map((p) => rot0(p, A, -60 * t)); fillPoly(b, R, 'amber', 0.22); poly(b, R, 'amber', 3.2, { alpha: 0.9 }); }
      if (!prob && t >= 0.999) poly(b, [A, Cp, E], 'amber', 3, { dash: [8, 5] });
      if (prob || st >= 1) { [[A, B], [B, Cp], [Cp, A]].forEach(([p, q]) => tick(b, p, q, 1, 'amber')); [[A, D], [D, E], [E, A]].forEach(([p, q]) => tick(b, p, q, 2, 'amber')); }
      if (prob && pk.kind === 2) ang(b, Cp, D, E, { color: 'rose', rings: 1, label: '?', r: 26, labelDist: 52, size: 15 });
      if (!prob && st >= 2) { ang(b, A, B, D, { color: 'sky', rings: 1, label: '', r: 30, size: 13 }); ang(b, A, Cp, E, { color: 'sky', rings: 1, label: '', r: 36, size: 13 }); }
      if (!prob && st >= 3) { tick(b, B, D, 3, 'rose'); tick(b, Cp, E, 3, 'rose'); ang(b, Cp, D, E, { color: 'rose', rings: 2, label: '120°', r: 26, labelDist: 52, size: 14 }); }
      if (C.txt) {
        const sd = (p, q, v, col, off) => sideTag(b, p, q, cen, v, { size: sm(b) ? 14 : 16, color: col, gap: off });
        if (prob) {
          // BC 는 D 가 끼어 있어 길이 눈금선을 아래에 따로 그림
          const yy = 0.55; line(b, pt(0, yy), pt(L, yy), 'sky', 2); line(b, pt(0, yy - 0.15), pt(0, yy + 0.15), 'sky', 2); line(b, pt(L, yy - 0.15), pt(L, yy + 0.15), 'sky', 2);
          T(b, pt(L / 2, yy), `BC = ${pk.L} cm`, { dy: 18, size: sm(b) ? 14 : 16, color: 'sky' });
          if (pk.kind === 0 || pk.kind === 2) { if (pk.kind === 0) sd(D, Cp, `CD=${pk.c}`, 'rose', 14); }
          else sd(Cp, E, `CE=${pk.c}`, 'rose', 12);
        } else {
          sd(B, D, `${d}`, 'amber', 14); sd(D, Cp, `${L - d}`, 'sky', 14);
          if (st >= 3) sideTag(b, Cp, E, centroid([Cp, E, A]), `${d}`, { size: sm(b) ? 14 : 16, color: 'rose', gap: 12 });
        }
      }
      [[A, 'A'], [B, 'B'], [Cp, 'C'], [D, 'D'], [E, 'E']].forEach(([p, n]) => { b.point(p, { color: n === 'D' && !prob ? 'amber' : 'ink', r: 4.6 }); if (n === 'B' || n === 'C') T(b, p, n, { dy: 18, size: 17 }); else if (n === 'D') T(b, p, 'D', { dy: 18, size: 17 }); else tagOut(b, p, cen, n, { size: 17, gap: 11 }); });
      if (!prob && !C.review && C.txt && t <= 0.001) b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '점 D 끌기(가로)', drag: (w) => { s.cnHd = clamp(Math.round(w.x), 1, M.L - 1); } });
      if (C.txt && !prob) {
        const msgs = ['같은 길이: AB=BC=CA, AD=DE=EA', `∠BAD = ∠CAE (60° − ∠DAC) 이고 ∠ABD = ∠ACE = 60°`, t >= 0.999 ? '△ABD가 △ACE에 겹쳐요 → 합동 (SAS) → BD = CE' : '△ABD를 점 A 둘레로 60° 돌려요', `BD = CE = ${d}, CD + CE = ${L - d} + ${d} = ${L} = BC, ∠DCE = 120°`];
        const m = C.review ? msgs[Math.min(3, Math.max(0, st - 1))] : t >= 0.999 ? msgs[2] : '▶를 눌러 △ABD를 돌려 보세요';
        cap(b, (bb.x0 + bb.x1) / 2, 0, m, t >= 0.999 ? 'green' : 'amber', 62);
      }
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `정삼각형이므로 $\\overline{AB}=\\overline{AC}=${M.L}$, $\\overline{AD}=\\overline{AE}$예요.`,
      `$\\angle BAD=60^{\\circ}-\\angle DAC=\\angle CAE$이에요. (두 정삼각형의 꼭지각이 모두 $60^{\\circ}$)`,
      `$\\overline{AB}=\\overline{AC}$, $\\angle BAD=\\angle CAE$, $\\overline{AD}=\\overline{AE}$이므로 $\\triangle ABD\\equiv\\triangle ACE$ (SAS 합동)예요. △ABD를 점 A 둘레로 $60^{\\circ}$ 돌리면 △ACE에 겹쳐요.`,
      `합동이므로 $\\overline{CE}=\\overline{BD}=${M.d}$ cm예요. 따라서 $\\overline{CD}+\\overline{CE}=\\overline{CD}+\\overline{BD}=\\overline{BC}=${M.L}$ cm이고, $\\angle ACE=\\angle ABD=60^{\\circ}$이므로 $\\angle DCE=60^{\\circ}+60^{\\circ}=120^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점</b> D를 변 BC 위에서 가로로 끌거나 막대로 길이를 바꿔 보세요. ▶를 누르면 <b>△ABD가 점 A를 중심으로 60° 돌아</b> △ACE에 겹쳐요.',
      readouts: [rd('BD = CE', `${M.d} cm`, 'rose', '△ABD ≡ △ACE'), rd('CD', `${M.L - M.d} cm`, 'sky', `BC − BD`), rd('CD + CE', `${M.L} cm`, 'green', '= BC'), rd('∠DCE', '120°', 'amber', '60° + 60°')],
      formula: `<p>$\\overline{CE}=\\overline{BD}=${M.d}$, $\\overline{CD}+\\overline{CE}=${M.L - M.d}+${M.d}=${M.L}$</p>`,
      rule: '정삼각형 ABC와 ADE에서 △ABD ≡ △ACE (SAS) → BD = CE',
      notes: notes('합동인 두 삼각형은 <b>△ABD와 △ACE</b>예요. 꼭짓점 순서를 맞춰요 (B↔C, D↔E).', '$\\overline{CE}$와 $\\overline{CD}$를 헷갈리지 마세요. $\\overline{CE}=\\overline{BD}$이고 $\\overline{CD}=\\overline{BC}-\\overline{BD}$예요.')
    }),
    prob: (M) => {
      const pk = M.pk, key = `L${pk.L}c${pk.c}kd${pk.kind}`, L = pk.L, c = pk.c;
      if (pk.kind === 0) return { tag: '숨은 합동 · CE의 길이 구하기', key, stem: `그림에서 △ABC와 △ADE는 정삼각형이고 점 D는 변 BC 위의 점이다. $\\overline{BC}=${L}$ cm, $\\overline{CD}=${c}$ cm일 때, $\\overline{CE}$의 길이는?`, choices: mkChoices(L - c, [[c, '∠CD의 길이예요. CE=BD=BC−CD예요.'], [L, 'BC의 길이예요. CE=BD=BC−CD예요.'], [L + c, '더하지 않고 빼야 해요.'], [(L - c) / 2, 'BD를 반으로 나누지 않아요.']], { tex: (v) => `${fmtN(v)}\\text{ cm}`, plain: (v) => fmtN(v) + ' cm', pad: 1, valid: (v) => v > 0 }) };
      if (pk.kind === 1) return { tag: '숨은 합동 · CD의 길이 구하기', key, stem: `그림에서 △ABC와 △ADE는 정삼각형이고 점 D는 변 BC 위의 점이다. $\\overline{BC}=${L}$ cm, $\\overline{CE}=${c}$ cm일 때, $\\overline{CD}$의 길이는?`, choices: mkChoices(L - c, [[c, 'CE의 길이예요. CD=BC−BD이고 BD=CE예요.'], [L, 'BC의 길이예요. CD=BC−CE예요.'], [L + c, '더하지 않고 빼야 해요.'], [(L - c) / 2, '반으로 나누지 않아요.']], { tex: (v) => `${fmtN(v)}\\text{ cm}`, plain: (v) => fmtN(v) + ' cm', pad: 1, valid: (v) => v > 0 }) };
      return { tag: '함정 · ∠DCE의 크기 (60°가 아니에요)', key, stem: '그림에서 △ABC와 △ADE는 정삼각형이고 점 D는 변 BC 위의 점이다. $\\angle DCE$의 크기는?', choices: mkChoices(120, [[60, '∠ACE는 60°이고 ∠ACB도 60°라서 ∠DCE=∠DCA+∠ACE=60°+60°예요.'], [90, '직각이 아니에요.'], [30, '∠DCA와 ∠ACE를 더해야 해요.'], [150, '60°+60°=120°예요.']], { tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad: 10, valid: (v) => v > 0 && v < 180 }) };
    },
    verify: (s) => { const g = geo2(s.cnHL, clamp(s.cnHd, 1, s.cnHL - 1)); return { ans: [dist(g.C, g.E), angBetween(g.C, g.D, g.E)], model: [g.d, 120] }; }
  };

  /* ====================================================================== 3. 정사각형 둘 (꼭짓점 A 공유) */
  const geo3 = (a, e, th) => { const A = pt(0, 0), B = pt(a, 0), C = pt(a, -a), D = pt(0, -a), E = polar(A, e, -th), G = polar(A, e, -th - 90), F = add(E, G); return { A, B, C, D, E, F, G, a, e, th }; };
  const sq = {
    id: 'c6-3', title: '정사각형 두 개 · △ABE ≡ △ADG', short: '정사각형 두 개',
    question: '정사각형 ABCD와 AEFG가 꼭짓점 A를 공유할 때, 숨어 있는 합동 삼각형은 무엇이고 BE와 DG는 어떤 관계일까?',
    ctl: ['cnKa', 'cnKe', 'cnKth', 'cnKt'], anim: { key: 'cnKt', dur: 4.5, label: '△ABE 돌리기', start: 0 },
    init: (s) => { s.cnKa = 6; s.cnKe = 3; s.cnKth = 35; s.cnKt = 0; s.cnPk = { kind: 0, x: 4, k: 2, m: 1, n: 9, th: 40, p: 2, q: 10, k0: 0 }; },
    reroll: (s) => {
      const kind = ((s.cnPk && s.cnPk.kind) || 0) === 0 ? 1 : 0, k0 = ((s.cnPk && s.cnPk.k0) || 0) + 1;
      let pk = { kind, k0, th: 5 * rint(5, 15) };
      if (kind === 0) { for (let t = 0; t < 60; t++) { const k = pick([2, 3], 0), x = rint(2, 6), m = rint(-4, 4), n = k * x + m; if (m !== 0 && n >= 4 && n <= 20) { pk = { ...pk, k, x, m, n }; break; } } }
      else { for (let t = 0; t < 60; t++) { const p = pick([2, 3, 4], 0), x = rint(4, 12), th = 5 * rint(5, 15), q = th - p * x; if (q !== 0 && Math.abs(q) <= 20) { pk = { ...pk, p, x, q, th }; break; } } }
      s.cnPk = pk;
    },
    model: (s) => ({ a: s.cnKa, e: Math.min(s.cnKe, s.cnKa), th: s.cnKth, g: geo3(s.cnKa, Math.min(s.cnKe, s.cnKa), s.cnKth), pk: s.cnPk || { kind: 0, x: 4, k: 2, m: 1, n: 9, th: 40 } }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, g = prob ? geo3(6, 3.2, pk.th || 40) : M.g, { A, B, C: Cp, D, E, F, G: Gp } = g, st = C.review ? C.step : 4;
      const bb = bboxOf([A, B, Cp, D, E, F, Gp], 0.5);
      fit(b, { x0: bb.x0, x1: bb.x1, y0: bb.y0, y1: bb.y1 + 0.2 }, { t: 40, b: 56 });
      const t = prob ? 0 : C.review ? (st >= 3 ? 1 : 0) : C.t, cen = pt(0, 0);
      fillPoly(b, [A, B, Cp, D], 'sky', 0.1); fillPoly(b, [A, E, F, Gp], 'rose', 0.1);
      poly(b, [A, B, Cp, D], 'ink', 3.4); poly(b, [A, E, F, Gp], 'ink', 3.4);
      line(b, B, E, 'green', 3.2); line(b, D, Gp, 'green', 3.2);
      if (!prob && t > 0.001) { const R = [A, B, E].map((p) => rot0(p, A, -90 * t)); fillPoly(b, R, 'amber', 0.22); poly(b, R, 'amber', 3.2, { alpha: 0.9 }); }
      if (!prob && t >= 0.999) poly(b, [A, D, Gp], 'amber', 3, { dash: [8, 5] });
      if (!prob && st >= 1) { tick(b, A, B, 1, 'amber'); tick(b, A, D, 1, 'amber'); tick(b, A, E, 2, 'amber'); tick(b, A, Gp, 2, 'amber'); }
      if (!prob && st >= 2) {
        ang(b, A, B, E, { color: 'sky', rings: 1, label: dg(g.th), r: 26, labelDist: 40, size: 13 });
        ang(b, A, D, Gp, { color: 'sky', rings: 1, label: dg(g.th), r: 26, labelDist: 40, size: 13 });
        ang(b, A, E, D, { color: 'rose', rings: 2, label: dg(90 - g.th), r: 22, labelDist: 40, size: 13 });
      }
      if (!prob && st >= 3) { tick(b, B, E, 3, 'green'); tick(b, D, Gp, 3, 'green'); }
      if (prob) {
        [[A, B], [B, Cp], [Cp, D], [D, A]].forEach(([p, q]) => tick(b, p, q, 1, 'amber')); [[A, E], [E, F], [F, Gp], [Gp, A]].forEach(([p, q]) => tick(b, p, q, 2, 'amber'));
        [[A, B, D], [B, Cp, A], [Cp, D, B], [D, A, Cp], [E, F, A], [F, Gp, E], [Gp, A, F]].forEach(([v, p1, q1]) => ang(b, v, p1, q1, { color: 'sky', r: 14 }));
        if (pk.kind === 0) { const ex = `${pk.k}x${pk.m > 0 ? '+' : '−'}${Math.abs(pk.m)}`; sideTag(b, B, E, pt((B.x + E.x + A.x) / 3, (B.y + E.y + A.y) / 3), ex, { size: sm(b) ? 14 : 16, color: 'rose', gap: 12 }); sideTag(b, D, Gp, pt((D.x + Gp.x + A.x) / 3, (D.y + Gp.y + A.y) / 3), `${pk.n}`, { size: sm(b) ? 14 : 16, color: 'sky', gap: 12 }); }
        else { const ex = `${pk.p}x${pk.q > 0 ? '+' : '−'}${Math.abs(pk.q)}`; ang(b, A, B, E, { color: 'rose', rings: 1, label: `(${ex})°`, r: 28, labelDist: 62, size: 14 }); ang(b, A, D, Gp, { color: 'sky', rings: 1, label: `${pk.th}°`, r: 28, labelDist: 52, size: 14 }); }
      }
      [[A, 'A'], [B, 'B'], [Cp, 'C'], [D, 'D'], [E, 'E'], [F, 'F'], [Gp, 'G']].forEach(([p, n]) => { b.point(p, { color: n === 'E' && !prob && !C.review ? 'amber' : 'ink', r: 4.6 }); if (n === 'A') T(b, p, 'A', { dx: -14, dy: 16, size: 17 }); else tagOut(b, p, pt(g.a / 2, -g.a / 2), n, { size: 17, gap: 11 }); });
      if (!prob && !C.review && C.txt && t <= 0.001) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E 끌기(∠BAE 조절)', drag: (w) => { s.cnKth = clamp(Math.round(-dirDeg(A, w) / 5) * 5, 15, 75); } });
      if (C.txt && !prob) {
        const msgs = ['같은 길이: AB=AD, AE=AG', `∠BAE = 90° − ∠EAD = ∠DAG = ${g.th}° (공통인 ∠EAD를 빼면 같아요)`, t >= 0.999 ? '△ABE가 △ADG에 겹쳐요 → 합동 (SAS)' : '△ABE를 점 A 둘레로 90° 돌려요', 'BE = DG, 그리고 BE와 DG는 서로 수직이에요'];
        const m = C.review ? msgs[Math.min(3, Math.max(0, st - 1))] : t >= 0.999 ? msgs[2] : '▶를 눌러 △ABE를 돌려 보세요';
        cap(b, (bb.x0 + bb.x1) / 2, bb.y1, m, t >= 0.999 ? 'green' : 'amber', 28);
      }
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => [
      `정사각형이므로 $\\overline{AB}=\\overline{AD}=${M.a}$, $\\overline{AE}=\\overline{AG}=${M.e}$예요.`,
      `$\\angle BAE=90^{\\circ}-\\angle EAD$, $\\angle DAG=90^{\\circ}-\\angle EAD$이므로 $\\angle BAE=\\angle DAG=${M.th}^{\\circ}$예요.`,
      `$\\overline{AB}=\\overline{AD}$, $\\angle BAE=\\angle DAG$, $\\overline{AE}=\\overline{AG}$이므로 $\\triangle ABE\\equiv\\triangle ADG$ (SAS 합동)예요. △ABE를 점 A 둘레로 $90^{\\circ}$ 돌리면 △ADG에 겹쳐요.`,
      `합동이므로 $\\overline{BE}=\\overline{DG}$예요. (대응변의 길이는 같아요.)`
    ],
    view: (M) => ({
      guide: '두 정사각형의 크기와 <b>노란 점</b> E(또는 막대)로 ∠BAE를 바꿔 보세요. ▶를 누르면 <b>△ABE가 점 A를 중심으로 90° 돌아</b> △ADG에 겹쳐요.',
      readouts: [rd('∠BAE = ∠DAG', dg(M.th), 'sky', '90° − ∠EAD'), rd('∠EAD', dg(90 - M.th), 'rose'), rd('BE = DG', '같아요', 'green', '△ABE ≡ △ADG')],
      formula: `<p>$\\angle BAE=\\angle DAG=${M.th}^{\\circ}$ → $\\triangle ABE\\equiv\\triangle ADG$ → $\\overline{BE}=\\overline{DG}$</p>`,
      rule: '정사각형 두 개가 꼭짓점 A를 공유하면 △ABE ≡ △ADG (SAS)',
      notes: notes('∠BAE와 ∠DAG는 <b>공통인 ∠EAD를 빼서</b> 같음을 보여요. 직각(90°)에서 같은 각을 빼면 같아요.', '합동인 삼각형의 순서: A↔A, B↔D, E↔G예요.')
    }),
    prob: (M) => {
      const pk = M.pk, key = `k${pk.kind}.${pk.k}.${pk.x}.${pk.m}.${pk.n}.${pk.p}.${pk.q}.${pk.th}`;
      if ((pk.kind || 0) === 0) {
        const { k, x, m, n } = pk, ex = `${k}x${m > 0 ? '+' : '−'}${Math.abs(m)}`;
        return { tag: '숨은 합동 · 정사각형 두 개와 길이', key, stem: `그림에서 □ABCD와 □AEFG는 정사각형이다. $\\overline{BE}=(${ex})$ cm, $\\overline{DG}=${n}$ cm일 때, $x$의 값은?`, choices: mkChoices(x, [[n, `${n}은 선분 DG의 길이예요. 대응변의 길이가 같으므로 $${ex}=${n}$을 풀어서 x를 구해요.`], [(n + m) / k, '상수항을 옮길 때 부호를 확인하세요.'], [x + 1, '식을 풀 때 계산이 틀렸어요.'], [x - 1, '식을 풀 때 계산이 틀렸어요.'], [k * x + m, 'x가 아니라 선분의 길이예요.']], { tex: (v) => String(v), plain: (v) => String(v), valid: (v) => Number.isInteger(v) && v > 0, pad: 1 }) };
      }
      const { p, x, q, th } = pk, ex = `${p}x${q > 0 ? '+' : '−'}${Math.abs(q)}`;
      return { tag: '숨은 합동 · 정사각형 두 개와 각', key, stem: `그림에서 □ABCD와 □AEFG는 정사각형이다. $\\angle BAE=(${ex})^{\\circ}$, $\\angle DAG=${th}^{\\circ}$일 때, $x$의 값은?`, choices: mkChoices(x, [[th, '∠DAG의 크기예요. $' + ex + '=' + th + '$을 풀어야 해요.'], [(th + q) / p, '상수항을 옮길 때 부호를 확인하세요.'], [x + 1, '식을 풀 때 계산이 틀렸어요.'], [x - 1, '식을 풀 때 계산이 틀렸어요.'], [90 - th, '∠EAD의 크기예요. ∠BAE=∠DAG를 이용해요.']], { tex: (v) => String(v), plain: (v) => String(v), valid: (v) => Number.isInteger(v) && v > 0, pad: 1 }) };
    },
    verify: (s) => { const g = geo3(s.cnKa, Math.min(s.cnKe, s.cnKa), s.cnKth); return { ans: [dist(g.B, g.E), angBetween(g.A, g.B, g.E)], model: [dist(g.D, g.G), angBetween(g.A, g.D, g.G)] }; }
  };

  /* ====================================================================== 4. 정사각형과 정삼각형 */
  const geo4 = (a, inside) => { const A = pt(0, 0), B = pt(a, 0), C = pt(a, -a), D = pt(0, -a), E = pt(inside ? a - a * S3 / 2 : a + a * S3 / 2, -a / 2); return { A, B, C, D, E, a }; };
  const MODE4 = [['in', '정삼각형이 정사각형 안쪽'], ['out', '정삼각형이 정사각형 바깥쪽']];
  const sqtri = {
    id: 'c6-4', title: '정사각형과 정삼각형 · △ABE ≡ △DCE', short: '정사각형과 정삼각형',
    question: '정사각형 ABCD의 변 BC를 한 변으로 하는 정삼각형 BCE를 그리면, 숨어 있는 합동 삼각형은 무엇이고 ∠AED는 몇 도일까?',
    ctl: ['cnJa', 'cnJt'], anim: { key: 'cnJt', dur: 4.5, label: '△ABE 뒤집기', start: 0 },
    presets: () => MODE4.map(([id, label], i) => ({ group: i === 0 ? '정삼각형의 위치' : '', label, apply: (s) => { s.cnJm = id; s.cnJt = 0; s.playing = false; }, on: (s) => (s.cnJm || 'in') === id })),
    init: (s) => { s.cnJa = 6; s.cnJt = 0; s.cnJm = 'in'; s.cnPk = { m: 'in', q: 0, k: 0 }; },
    reroll: (s) => { s.cnPk = { m: pick(['in', 'out'], s.cnPk && s.cnPk.m), q: rint(0, 3), k: ((s.cnPk && s.cnPk.k) || 0) + 1 }; },
    model: (s) => { const inside = (s.cnJm || 'in') === 'in', g = geo4(s.cnJa, inside); return { a: s.cnJa, inside, g, pk: s.cnPk || { m: 'in', q: 0, k: 0 }, bae: angBetween(g.A, g.B, g.E), aed: angBetween(g.E, g.A, g.D), eda: angBetween(g.D, g.E, g.A) }; },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, inside = prob ? pk.m === 'in' : M.inside, a = prob ? 6 : M.a, g = geo4(a, inside), { A, B, C: Cp, D, E } = g, st = C.review ? C.step : 4;
      const bb = bboxOf([A, B, Cp, D, E], 0.5);
      fit(b, { x0: bb.x0 - 0.3, x1: bb.x1 + 0.3, y0: bb.y0, y1: bb.y1 + 0.2 }, { t: 40, b: 56 });
      const t = prob ? 0 : C.review ? (st >= 3 ? 1 : 0) : C.t, axis = -a / 2;
      fillPoly(b, [A, B, Cp, D], 'sky', 0.1); fillPoly(b, [B, Cp, E], 'rose', 0.12);
      poly(b, [A, B, Cp, D], 'ink', 3.4); poly(b, [B, Cp, E], 'ink', 3.4); line(b, A, E, 'green', 3.2); line(b, D, E, 'green', 3.2);
      if (!prob && t > 0.001) { const sy = Math.cos(Math.PI * t); const R = [A, B, E].map((p) => pt(p.x, axis + (p.y - axis) * sy)); fillPoly(b, R, 'amber', 0.22); poly(b, R, 'amber', 3.2, { alpha: 0.9 }); }
      if (!prob && t >= 0.999) poly(b, [D, Cp, E], 'amber', 3, { dash: [8, 5] });
      // 문제에서도 주어진 것(정사각형, 정삼각형)은 표시
      [[A, B], [B, Cp], [Cp, D], [D, A]].forEach(([p, q]) => tick(b, p, q, 1, 'amber'));
      [[B, E], [Cp, E]].forEach(([p, q]) => tick(b, p, q, 1, 'amber'));
      [[A, B, D], [B, Cp, A], [Cp, D, B], [D, A, Cp]].forEach(([v, p, q]) => ang(b, v, p, q, { color: 'sky', r: 16, noRight: false }));
      if (prob) { const q = pk.q; if (q === 0) ang(b, A, B, E, { color: 'rose', rings: 1, label: '?', r: 34, labelDist: 56, size: 15 }); else if (q === 1) ang(b, E, A, D, { color: 'rose', rings: 1, label: '?', r: 26, labelDist: 46, size: 15 }); else if (q === 2) ang(b, A, E, D, { color: 'rose', rings: 1, label: '?', r: 34, labelDist: 56, size: 15 }); else ang(b, E, A, B, { color: 'rose', rings: 1, label: '?', r: 26, labelDist: 46, size: 15 }); }
      if (!prob && st >= 2) {
        ang(b, B, A, E, { color: 'rose', rings: 1, label: dg(inside ? 30 : 150), r: 30, labelDist: 50, size: 13 });
        ang(b, Cp, D, E, { color: 'rose', rings: 1, label: dg(inside ? 30 : 150), r: 30, labelDist: 50, size: 13 });
      }
      if (!prob && st >= 3) { tick(b, A, E, 3, 'green'); tick(b, D, E, 3, 'green'); }
      if (!prob && st >= 4) ang(b, E, A, D, { color: 'green', rings: 2, label: dg(M.aed), r: 24, labelDist: 46, size: 14 });
      const cen = pt(a / 2, -a / 2);
      [[A, 'A'], [B, 'B'], [Cp, 'C'], [D, 'D']].forEach(([p, n]) => { b.point(p, { color: 'ink', r: 4.6 }); tagOut(b, p, cen, n, { size: 17, gap: 11 }); });
      b.point(E, { color: 'ink', r: 4.6 }); tagOut(b, E, inside ? pt(a, -a / 2) : cen, 'E', { size: 17, gap: 11 });
      if (C.txt && !prob) {
        const msgs = ['같은 길이: AB=DC (정사각형), BE=CE (정삼각형)', `∠ABE = ∠DCE = 90° ${inside ? '−' : '+'} 60° = ${inside ? 30 : 150}°`, t >= 0.999 ? '△ABE가 △DCE에 겹쳐요 → 합동 (SAS) → AE = DE' : '△ABE를 제자리에서 뒤집어요', `△ABE는 AB=BE인 이등변삼각형 → ∠BAE = ${fmtN(M.bae)}°, ∠EAD = ${fmtN(90 - (inside ? M.bae : M.bae) * (inside ? 1 : 1))}°`];
        const m = C.review ? (st === 4 ? `∠BAE = ${fmtN(M.bae)}° (이등변삼각형 ABE) → ∠AED = ${fmtN(M.aed)}°` : msgs[Math.min(2, st - 1)]) : t >= 0.999 ? msgs[2] : '▶를 눌러 △ABE를 뒤집어 보세요';
        cap(b, (bb.x0 + bb.x1) / 2, bb.y1, m, t >= 0.999 ? 'green' : 'amber', 28);
      }
    },
    stepT: (n) => (n >= 3 ? 1 : 0),
    steps: (M) => {
      const i = M.inside, ang1 = i ? 30 : 150;
      return [
        `정사각형이므로 $\\overline{AB}=\\overline{DC}$, 정삼각형이므로 $\\overline{BE}=\\overline{CE}$예요.`,
        `$\\angle ABE=\\angle DCE=90^{\\circ}${i ? '-' : '+'}60^{\\circ}=${ang1}^{\\circ}$예요.`,
        `$\\overline{AB}=\\overline{DC}$, $\\angle ABE=\\angle DCE$, $\\overline{BE}=\\overline{CE}$이므로 $\\triangle ABE\\equiv\\triangle DCE$ (SAS 합동)이에요. 그래서 $\\overline{AE}=\\overline{DE}$예요.`,
        `△ABE는 $\\overline{AB}=\\overline{BE}$인 이등변삼각형이므로 $\\angle BAE=(180^{\\circ}-${ang1}^{\\circ})\\div 2=${fmtN(M.bae)}^{\\circ}$예요. 그러므로 $\\angle EAD=${fmtN(Math.abs(90 - M.bae))}^{\\circ}$, $\\angle AED=${fmtN(M.aed)}^{\\circ}$예요.`
      ];
    },
    view: (M) => ({
      guide: '<b>정삼각형의 위치</b>를 고르고 막대로 정사각형의 크기를 바꿔 보세요. ▶를 누르면 <b>△ABE가 제자리에서 뒤집혀</b> △DCE에 겹쳐요. (길이가 달라져도 각은 변하지 않아요.)',
      readouts: [rd('∠ABE = ∠DCE', dg(M.inside ? 30 : 150), 'rose', `90° ${M.inside ? '−' : '+'} 60°`), rd('∠BAE', dg(M.bae), 'sky', 'AB = BE (이등변)'), rd('∠AED', dg(M.aed), 'green', 'AE = DE (이등변)')],
      formula: `<p>$\\triangle ABE\\equiv\\triangle DCE$ → $\\overline{AE}=\\overline{DE}$, $\\angle AED=${fmtN(M.aed)}^{\\circ}$</p>`,
      rule: '정사각형 ABCD와 정삼각형 BCE에서 △ABE ≡ △DCE (SAS)',
      notes: notes('정삼각형이 안쪽인지 바깥쪽인지에 따라 ∠ABE가 <b>30°</b>(90°−60°)인지 <b>150°</b>(90°+60°)인지 달라져요.', '이등변삼각형의 두 밑각은 같아요. 꼭지각 ∠ABE에서 $(180^{\\circ}-\\angle ABE)\\div2$를 계산해요.')
    }),
    prob: (M) => {
      const pk = M.pk, inside = pk.m === 'in', g = geo4(6, inside), q = pk.q;
      const items = [['∠BAE', angBetween(g.A, g.B, g.E), `∠BAE`], ['∠AED', angBetween(g.E, g.A, g.D), `∠AED`], ['∠EAD', angBetween(g.A, g.E, g.D), `∠EAD`], ['∠AEB', angBetween(g.E, g.A, g.B), `∠AEB`]][q];
      const ans = Math.round(items[1]), other = inside ? [75, 150, 15, 30, 60] : [15, 30, 75, 60, 150];
      return {
        tag: inside ? '숨은 합동 · 정사각형 안의 정삼각형' : '함정 · 정삼각형이 정사각형 바깥쪽에 있을 때', key: `${pk.m}q${q}`,
        stem: `그림에서 □ABCD는 정사각형이고 △BCE는 정삼각형이다. ${inside ? '' : '(점 E는 정사각형의 바깥쪽에 있다.) '}$\\angle ${items[0].replace('∠', '')}$의 크기는?`,
        choices: mkChoices(ans, other.filter((v) => v !== ans).map((v) => [v, '△ABE ≡ △DCE이고 △ABE는 이등변삼각형이에요. ∠ABE부터 차근차근 구해 보세요.']), { tex: (v) => `${v}^{\\circ}`, plain: (v) => v + '°', pad: 15, valid: (v) => v > 0 && v < 180 })
      };
    },
    verify: (s) => { const g = geo4(s.cnJa, (s.cnJm || 'in') === 'in'); return { ans: [dist(g.A, g.E), angBetween(g.E, g.A, g.D)], model: [dist(g.D, g.E), null] }; }
  };

  G.register(60, 't6', '⑥ 숨은 합동', '숨은 합동', PARAMS, [eq1, eq2, sq, sqtri]);
})();
