/* ==========================================================================
   중3 · 삼각비 — 탭 ⑧ 「입체·결합도형」 (t8.js, order 80) — 장면 6개
   · solid3DTrig 정육면체 ∠AGE   · r8-1 직육면체의 대각선   · r8-2 원뿔의 모선·높이·부피   · r8-3 정사면체
   · r9-1 정사각형 속 ∠EBF   · r9-2 직사각형 종이접기
   입체는 밑면이 아래, 빈 곳을 끌면 시점이 제자리에서 돌아갑니다(이동 없음).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, tick, line, poly, fillPoly, fit, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG, centroid, lerp, unit, sub, add, mul, polar, projOn,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vpow2, vsame, vtex, vcan, sinD, cosD, tanD, mkChoices, checkQ, fmtN, decS, camOf, proj3, p3, drawBox, boxVerts, vplain } = G;

  const PARAMS = {
    t81a: P('모서리의 길이 a', 2, 10, 1, 6, { color: 'sky', hint: '빈 곳을 끌면 입체가 제자리에서 돌아요' }),
    t82a: P('가로 AB = a', 2, 10, 1, 4, { color: 'sky' }),
    t82b: P('세로 BC = b', 2, 10, 1, 4, { color: 'green' }),
    t82c: P('높이 CG = c', 2, 10, 1, 7, { color: 'rose' }),
    t83l: P('모선의 길이 L', 3, 15, 1, 8, { color: 'sky' }),
    t83t: P('모선과 밑면이 이루는 각 θ', 30, 70, 5, 60, { color: 'amber', format: G.degF }),
    t84a: P('모서리의 길이 a', 2, 12, 1, 6, { color: 'sky' }),
    t85s: P('정사각형의 한 변 s', 4, 12, 2, 6, { color: 'sky' }),
    t85u: P('CE의 길이', 1, 11, 1, 3, { color: 'green' }),
    t85f: P('AF의 길이', 1, 11, 1, 3, { color: 'rose', hint: '점 F를 가로로 끌어도 돼요' }),
    t86w: P('세로 AB = w', 3, 12, 1, 6, { color: 'sky' }),
    t86k: P('접기', 0, 1, 0.01, 0, { color: 'amber', format: (v) => Math.round(v * 100) + '%', hint: '▶를 누르거나 막대를 끌면 AE를 접는 선으로 접혀요' })
  };

  /* ---- 3D 도우미 ---- */
  const toP2 = (cam, V3) => V3.map((v) => { const q = proj3(cam, v); return pt(q.x, q.y); });
  // 두 점 사이 선분 중간에서, 그림 중심(cen)의 반대쪽으로 비켜 놓은 글자
  function lab3(b, p, q, cen, str, color, o = {}) {
    const m = mid(p, q), u = unit(sub(m, cen)), size = o.size || 16, w = G.textW2(str, size), d = Math.abs(u.x) * (w / 2) + Math.abs(u.y) * size * 0.55 + (o.gap == null ? 10 : o.gap);
    T(b, m, str, { color, size, dx: u.x * d, dy: u.y * d });
  }
  const mk3 = (col, w, dash) => ({ color: col, width: w, dash });
  function names3(b, P2, names, cen) { names.forEach((n, i) => { if (!n) return; b.point(P2[i], { color: 'ink', r: 4 }); tagOut(b, P2[i], cen, n, { size: 17, gap: 10 }); }); }
  function setup3(b, pts, o = {}) {
    const k = b.W < 560;
    fit(b, bboxOf(pts), { t: o.t || 56, b: o.b || 56, l: k ? 40 : 56, r: k ? 40 : 56 });
  }

  /* ====================================================================== 정육면체 ∠AGE (단면 직각삼각형 AEG) */
  const NMB = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  function drawCube(b, s, a, o = {}) {
    const cam = camOf(s), V3 = boxVerts(a, a, a), P2 = toP2(cam, V3);
    setup3(b, P2, { b: 60 + (o.rows ? o.rows.length * 26 : 0) });
    const cen = centroid(P2), A = P2[0], E = P2[4], Gp = P2[6];
    if (o.stage == null || o.stage >= 2) fillPoly(b, [A, E, Gp], 'violet', 0.12);
    drawBox(b, cam, V3);
    line(b, E, Gp, 'sky', 3.6); line(b, A, Gp, 'green', 3.6); line(b, A, E, 'rose', 3.6);
    b.right(E, A, Gp, { color: 'ink', size: 13 });
    const angleCallout = !b.thumb && b.W < 560 && o.xl === '∠G';
    ang(b, Gp, E, A, { color: 'amber', r: 34, label: angleCallout ? '' : o.xl, size: o.xl === 'x' ? 20 : 16, labelDist: 52 });
    names3(b, P2, NMB, cen);
    const L = o.L || {};
    if (L.AE) lab3(b, A, E, cen, L.AE, 'rose', { size: L.AEs }); if (L.EG) lab3(b, E, Gp, cen, L.EG, 'sky', { gap: 14 }); if (L.AG) T(b, mid(A, Gp), L.AG, { dx: 6, dy: 18, size: L.AGs || 16, color: L.AGc || 'green', align: 'left' });
    if (angleCallout) T(b, Gp, o.xl, { dx: 44, dy: 28, color: 'amber', size: 16, leaderAnchor: Gp, leader: true });
    (o.rows || []).forEach((r, i) => T(b, pt(cen.x, Math.max(...P2.map((q) => q.y))), r.t, { dy: 44 + i * 26, size: r.size || 16, color: r.c }));
  }
  const cube = {
    id: 'solid3DTrig', title: '정육면체 속 직각삼각형 — ∠AGE', short: '정육면체 ∠AGE',
    question: '정육면체의 꼭짓점 A, E, G를 이으면 어떤 삼각형일까? ∠AGE의 삼각비는 얼마일까?',
    ctl: ['t81a'],
    init: (s) => { s.t81a = 6; },
    model: (s) => { const a = Math.round(s.t81a), eg = vmul(vi(a), vsq(2)), ag = vmul(vi(a), vsq(3)); return { a, eg, ag, sn: vdiv(vi(a), ag), cs: vdiv(eg, ag), tn: vdiv(vi(a), eg) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawCube(b, s, M.a, { xl: '∠G', L: { AE: `${M.a}`, EG: show(2) ? vcan(M.eg) : '', AG: show(2) ? vcan(M.ag) : '' }, rows: show(3) ? (b.W < 560 ? [{ t: `sin G = ${vcan(M.sn)},  cos G = ${vcan(M.cs)}`, c: 'amber', size: 15 }, { t: `tan G = ${vcan(M.tn)}`, c: 'amber', size: 15 }] : [{ t: `sin G = ${vcan(M.sn)},  cos G = ${vcan(M.cs)},  tan G = ${vcan(M.tn)}`, c: 'amber', size: 15 }]) : [] }); },
    steps: (M) => [
      `$\\overline{AE}$ 는 밑면에 수직인 모서리이므로 $\\overline{AE}\\perp\\overline{EG}$ 예요. $\\triangle AEG$ 는 $\\angle E=90^{\\circ}$ 인 직각삼각형이에요.`,
      `$AE=${M.a}$, $EG$ 는 윗면의 대각선이므로 $${vtex(M.eg)}$, $AG=\\sqrt{AE^2+EG^2}=${vtex(M.ag)}$ 예요.`,
      `$\\sin(\\angle AGE)=\\frac{AE}{AG}=${vtex(M.sn)}$, $\\cos(\\angle AGE)=\\frac{EG}{AG}=${vtex(M.cs)}$, $\\tan(\\angle AGE)=\\frac{AE}{EG}=${vtex(M.tn)}$`
    ],
    view: (M) => ({
      guide: '<b>모서리 a</b>를 바꾸고 <b>빈 곳을 끌어</b> 입체를 돌려 보세요. 보라색 삼각형 AEG는 모서리 AE, 윗면의 대각선 EG, 입체의 대각선 AG로 이루어진 직각삼각형이에요.',
      readouts: [rd('$\\sin(\\angle AGE)$', `$${vtex(M.sn)}$`, 'rose'), rd('$\\cos(\\angle AGE)$', `$${vtex(M.cs)}$`, 'sky'), rd('$\\tan(\\angle AGE)$', `$${vtex(M.tn)}$`, 'green')],
      rule: '입체도형 속에서 직각삼각형을 찾는다 → 한 변이 밑면에 수직이면 직각 → 삼각비의 값은 모서리의 길이와 관계없다',
      notes: notes('정육면체의 대각선은 $\\sqrt{3}a$, 한 면의 대각선은 $\\sqrt{2}a$ 예요.', '삼각비의 값은 $a$ 에 관계없이 일정해요.')
    }),
    gen: function g() {
      const a0 = pick([2, 3, 4, 5, 6]), kind = pick(['s', 'c', 't', 'ag']), a = vi(a0), eg = vmul(a, vsq(2)), ag = vmul(a, vsq(3));
      const rv = { s: vdiv(a, ag), c: vdiv(eg, ag), t: vdiv(a, eg) };
      let ans, wr, L = { AE: `${a0}` }, xl = 'x', stem;
      if (kind === 'ag') { ans = ag; wr = [[eg, '윗면의 대각선이에요. 입체의 대각선은 한 번 더 피타고라스 정리를 써요.'], [vmul(a, vsq(5)), ''], [vmul(a, vi(3)), ''], [vmul(a, vsq(2)), ''], [vadd(a, eg), '']]; L.AG = 'x'; L.AGs = 21; L.AGc = 'amber'; xl = ''; stem = `그림과 같이 한 모서리의 길이가 $${a0}$ 인 정육면체에서 $\\overline{AG}=x$ 의 길이는?`; }
      else { ans = rv[kind]; const oth = ['s', 'c', 't'].filter((k) => k !== kind).map((k) => [rv[k], '다른 삼각비예요. 대변·이웃변·빗변을 다시 짝지어 봐요.']); wr = [...oth, [vdiv(vi(1), ans), '분자와 분모를 거꾸로 썼어요.'], [vdiv(a, vmul(a, vsq(2))), '']]; stem = `그림과 같이 한 모서리의 길이가 $${a0}$ 인 정육면체에서 $\\angle AGE=x$ 일 때, $${G.FN[kind]} \\,x$ 의 값은?`; }
      const q = { tag: '정육면체 속의 삼각비', key: ['cube', a0, kind].join('|'), stem, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { a0, L, xl }, given: [`${a0}`], ans: [vcan(ans)] };
      q.fig.kind = kind; q.fig.work = { EG: vcan(eg), AG: vcan(ag) };
      return checkQ(q, [
        `현재 정육면체의 한 모서리는 $${a0}$입니다. $A,E,G$를 이은 단면 삼각형을 찾아요.`,
        '$AE$는 윗면에 수직이므로 $AE\\perp EG$입니다. 따라서 $\\triangle AEG$의 직각은 $E$이고 빗변은 $AG$입니다.',
        `윗면의 대각선은 $EG=\\sqrt{${a0}^2+${a0}^2}=${vtex(eg)}$, 입체의 대각선은 $AG=\\sqrt{${a0}^2+${vtex(vpow2(eg))}}=${vtex(ag)}$입니다.`,
        kind === 'ag' ? '문제에서 구하는 입체 대각선 $AG$의 길이를 답으로 써요.' : `$\\angle AGE=x$를 기준으로 대변 $AE=${a0}$, 이웃변 $EG=${vtex(eg)}$, 빗변 $AG=${vtex(ag)}$입니다. $${G.FN[kind]} x=${kind === 's' ? '\\frac{AE}{AG}' : kind === 'c' ? '\\frac{EG}{AG}' : '\\frac{AE}{EG}'}$를 계산해요.`
      ], { kind: 'cube', side: a0, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C, s) => drawCube(b, s, q.fig.a0, { stage: C.review ? C.step : 0, xl: q.fig.xl, L: { ...q.fig.L, ...(C.review && C.step >= 3 ? { EG: q.fig.work.EG, ...(q.fig.kind !== 'ag' || C.last ? { AG: q.fig.work.AG } : {}) } : {}) } })
  };

  /* ====================================================================== 직육면체 */
  function drawBoxG(b, s, a, b0, c, o = {}) {
    const cam = camOf(s), V3 = boxVerts(a, b0, c), P2 = toP2(cam, V3), narrow = b.W < 560;
    setup3(b, P2, { b: 60 + (o.rows ? o.rows.length * 26 : 0) });
    const cen = centroid(P2), A = P2[0], Cc = P2[2], Gp = P2[6];
    if (o.stage == null || o.stage >= 2) fillPoly(b, [A, Cc, Gp], 'violet', 0.12);
    drawBox(b, cam, V3);
    line(b, A, Cc, 'sky', 3.4); line(b, Cc, Gp, 'rose', 3.4); line(b, A, Gp, 'green', 3.6);
    b.right(Cc, A, Gp, { color: 'ink', size: 13 }); ang(b, A, Cc, Gp, { color: 'amber', r: 34, label: o.xl, size: o.xl === 'x' ? 20 : 16, labelDist: 52 });
    names3(b, P2, NMB, cen);
    const L = o.L || {};
    if (L.a) lab3(b, P2[0], P2[1], cen, L.a, 'sky'); if (L.b) lab3(b, P2[1], P2[2], cen, L.b, 'sky'); if (L.c) lab3(b, P2[2], P2[6], cen, L.c, 'rose');
    if (L.AC) T(b, mid(A, Cc), L.AC, { dy: 18, size: 15, color: 'sky' });
    if (L.AG) T(b, mid(A, Gp), L.AG, { dx: -8, dy: -10, size: L.AGs || 16, color: L.AGc || 'green', align: 'right' });
    (o.rows || []).forEach((r, i) => T(b, pt(cen.x, Math.max(...P2.map((q) => q.y))), r.t, { dy: 44 + i * 26, size: r.size || 16, color: r.c }));
  }
  const box = {
    id: 'r8-1', title: '직육면체의 대각선과 삼각비', short: '직육면체 대각선',
    question: '가로·세로·높이가 a, b, c인 직육면체의 대각선 AG의 길이와 AG가 밑면과 이루는 각의 삼각비는?',
    ctl: ['t82a', 't82b', 't82c'],
    init: (s) => { s.t82a = 4; s.t82b = 4; s.t82c = 7; },
    model: (s) => { const a = Math.round(s.t82a), b0 = Math.round(s.t82b), c = Math.round(s.t82c), ac = vsqrt(vi(a * a + b0 * b0)), ag = vsqrt(vi(a * a + b0 * b0 + c * c)); return { a, b0, c, ac, ag, sn: vdiv(vi(c), ag), cs: vdiv(ac, ag), tn: vdiv(vi(c), ac) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawBoxG(b, s, M.a, M.b0, M.c, { xl: b.W < 560 ? '' : 'θ', L: { a: `${M.a}`, b: `${M.b0}`, c: `${M.c}`, AC: show(1) ? vcan(M.ac) : '', AG: show(2) ? vcan(M.ag) : '' }, rows: show(3) ? (b.W < 560 ? [{ t: `sin = ${vcan(M.sn)},  cos = ${vcan(M.cs)}`, c: 'amber', size: 15 }, { t: `tan = ${vcan(M.tn)}`, c: 'amber', size: 15 }] : [{ t: `sin = ${vcan(M.sn)},  cos = ${vcan(M.cs)},  tan = ${vcan(M.tn)}`, c: 'amber', size: 15 }]) : [] }); },
    steps: (M) => [
      `밑면의 대각선 $AC=\\sqrt{${M.a}^2+${M.b0}^2}=${vtex(M.ac)}$ 예요. ($\\triangle ABC$ 는 직각삼각형)`,
      `$CG\\perp$ 밑면이므로 $\\triangle ACG$ 는 $\\angle C=90^{\\circ}$ 인 직각삼각형이에요. $AG=\\sqrt{AC^2+CG^2}=\\sqrt{${M.a}^2+${M.b0}^2+${M.c}^2}=${vtex(M.ag)}$`,
      `$\\angle GAC$ 에 대하여 $\\sin=\\frac{CG}{AG}=${vtex(M.sn)}$, $\\cos=\\frac{AC}{AG}=${vtex(M.cs)}$, $\\tan=\\frac{CG}{AC}=${vtex(M.tn)}$`
    ],
    view: (M) => ({
      guide: '<b>가로·세로·높이</b>를 바꾸고 <b>빈 곳을 끌어</b> 돌려 보세요. 각 θ는 ∠GAC예요. 직각삼각형 ACG(보라)는 밑면의 대각선 AC, 높이 CG, 입체의 대각선 AG로 이루어져요.',
      readouts: [rd('밑면의 대각선 $AC$', `$${vtex(M.ac)}$`, 'violet'), rd('입체의 대각선 $AG$', `$${vtex(M.ag)}$`, 'green'), rd('$\\tan(\\angle GAC)$', `$${vtex(M.tn)}$`, 'amber')],
      rule: '직육면체의 대각선 $AG=\\sqrt{a^2+b^2+c^2}$ → 두 번의 피타고라스 정리',
      notes: notes('먼저 밑면의 대각선 $AC$ 를 구해요. 곧바로 세 변을 제곱해 더해도 같은 결과예요.')
    }),
    gen: function g() {
      const t = pick([[1, 2, 2], [2, 3, 6], [2, 4, 4], [4, 4, 7], [3, 4, 12], [2, 6, 9], [1, 4, 8], [2, 2, 1], [3, 6, 2], [4, 7, 4], [2, 2, 2], [1, 1, 1], [1, 2, 3]]), [a, b0, c] = t, kind = pick(['ag', 'ag', 's', 'c', 't']);
      const ac = vsqrt(vi(a * a + b0 * b0)), ag = vsqrt(vi(a * a + b0 * b0 + c * c)), rv = { s: vdiv(vi(c), ag), c: vdiv(ac, ag), t: vdiv(vi(c), ac) };
      let ans, wr, L = { a: `${a}`, b: `${b0}`, c: `${c}` }, xl = 'x', stem;
      if (kind === 'ag') { ans = ag; wr = [[ac, '밑면의 대각선이에요. 높이까지 한 번 더 피타고라스 정리를 써요.'], [vi(a + b0 + c), '세 모서리의 합이에요.'], [vsqrt(vi(a * a + b0 * b0 + c)), ''], [vsqrt(vi(a * a + b0 + c * c)), ''], [vsqrt(vi((a + b0 + c) * (a + b0 + c)))]]; L.AG = 'x'; L.AGs = 21; L.AGc = 'amber'; xl = ''; stem = `그림과 같이 가로, 세로, 높이가 각각 $${a}$, $${b0}$, $${c}$ 인 직육면체의 대각선 $\\overline{AG}=x$ 의 길이는?`; }
      else { ans = rv[kind]; wr = [...['s', 'c', 't'].filter((k) => k !== kind).map((k) => [rv[k], '다른 삼각비예요. 대변·이웃변·빗변을 다시 짝지어 봐요.']), [vdiv(vi(1), ans), '분자와 분모를 거꾸로 썼어요.']]; stem = `그림과 같이 가로, 세로, 높이가 각각 $${a}$, $${b0}$, $${c}$ 인 직육면체에서 대각선 $AG$ 와 밑면 $ABCD$ 가 이루는 각을 $x$ 라 할 때, $${G.FN[kind]} \\,x$ 의 값은?`; }
      if (kind === 'ag' ? vsame(ag, vi(a)) || vsame(ag, vi(b0)) || vsame(ag, vi(c)) : false) return g();
      const q = { tag: '직육면체의 대각선', key: ['box', a, b0, c, kind].join('|'), stem, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { a, b0, c, L, xl }, given: [`${a}`, `${b0}`, `${c}`], ans: [vcan(ans)] };
      q.fig.kind = kind; q.fig.work = { AC: vcan(ac), AG: vcan(ag) };
      return checkQ(q, [
        `현재 직육면체의 가로·세로·높이는 $${a},${b0},${c}$입니다. 먼저 밑면 대각선 $AC$를 그어요.`,
        `$AC=\\sqrt{${a}^2+${b0}^2}=${vtex(ac)}$입니다. $CG$는 밑면에 수직이므로 $\\triangle ACG$는 $C$에서 직각입니다.`,
        `$AG=\\sqrt{AC^2+CG^2}=\\sqrt{${a * a + b0 * b0}+${c * c}}=${vtex(ag)}$입니다.`,
        kind === 'ag' ? '구하는 선분은 입체 대각선 $AG$입니다. 밑면 대각선 $AC$와 구별해요.' : `밑면과 이루는 각은 $\\angle GAC=x$입니다. 대변은 $CG$, 이웃변은 $AC$, 빗변은 $AG$이므로 $${G.FN[kind]} x=${kind === 's' ? '\\frac{CG}{AG}' : kind === 'c' ? '\\frac{AC}{AG}' : '\\frac{CG}{AC}'}$에 현재 길이를 넣어요.`
      ], { kind: 'box', a, b: b0, c, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C, s) => drawBoxG(b, s, q.fig.a, q.fig.b0, q.fig.c, { stage: C.review ? C.step : 0, xl: q.fig.xl, L: { ...q.fig.L, ...(C.review && C.step >= 2 ? { AC: q.fig.work.AC } : {}), ...(C.review && C.step >= 3 && (q.fig.kind !== 'ag' || C.last) ? { AG: q.fig.work.AG } : {}) } })
  };

  /* ====================================================================== 원뿔 */
  function drawCone(b, s, r, h, th, o = {}) {
    const cam = camOf(s), pr = (x, y, z) => { const q = proj3(cam, p3(x, y, z)); return pt(q.x, q.y); };
    const ring = Array.from({ length: 73 }, (_, i) => { const t = (i / 72) * 2 * Math.PI; return pr(r * Math.cos(t), r * Math.sin(t), 0); });
    const yaw = (s.tgYaw == null ? -32 : s.tgYaw) * DEG, ph = -yaw;
    const apex = pr(0, 0, h), O = pr(0, 0, 0), P1 = pr(r * Math.cos(ph), r * Math.sin(ph), 0), P2 = pr(r * Math.cos(ph + Math.PI), r * Math.sin(ph + Math.PI), 0);
    setup3(b, [...ring, apex], { b: 60 + (o.rows ? o.rows.length * 26 : 0), t: 62 });
    // 밑면(앞·뒤 반원 구분)
    const halfRing = (start) => Array.from({ length: 37 }, (_, i) => { const t = start + i * Math.PI / 36; return pr(r * Math.cos(t), r * Math.sin(t), 0); });
    b.path(ring, { close: true, color: null, fill: 'sky', fillAlpha: 0.08 });
    b.path(halfRing(-yaw), { color: 'ink', width: 2, dash: [6, 5], alpha: 0.55 });
    b.path(halfRing(Math.PI - yaw), { color: 'ink', width: 3 });
    if (o.stage == null || o.stage >= 2) fillPoly(b, [apex, O, P1], 'violet', 0.12);
    line(b, apex, P1, 'green', 4); line(b, apex, P2, 'ink', 3); line(b, apex, O, 'rose', 3, { dash: dashed }); line(b, O, P1, 'sky', 4);
    b.right(O, apex, P1, { color: 'ink', size: 13 }); ang(b, P1, O, apex, { color: 'amber', r: 34, label: o.thL || `${th}°`, size: o.thL === 'x' ? 20 : 16, labelDist: 50 });
    b.point(apex, { color: 'ink', r: 4.5 }); b.point(O, { color: 'ink', r: 4 }); b.point(P1, { color: 'ink', r: 4 });
    T(b, apex, 'A', { dy: -18, size: 17 }); T(b, O, 'O', { dx: -12, dy: 18, size: 17 }); T(b, P1, 'B', { dx: 16, dy: 14, size: 17 });
    const L = o.L || {};
    if (L.L) T(b, mid(apex, P1), L.L, { dx: 12, dy: -10, size: L.Lx ? 21 : 16, color: L.Lx ? 'amber' : 'green', align: 'left' });
    if (L.h) T(b, mid(apex, O), L.h, { dx: -8, size: L.hx ? 21 : 16, color: L.hx ? 'amber' : 'rose', align: 'right' });
    if (L.r) T(b, mid(O, P1), L.r, { dy: 20, size: L.rx ? 21 : 16, color: L.rx ? 'amber' : 'sky' });
    (o.rows || []).forEach((r2, i) => T(b, pt(O.x, Math.max(...ring.map((q) => q.y))), r2.t, { dy: 40 + i * 26, size: r2.size || 16, color: r2.c }));
  }
  const piT = (v) => (vtex(v) === '1' ? '\\pi' : `${vtex(v)}\\pi`);
  const piC = (v) => (vtex(v) === '1' ? 'π' : `${vcan(v)}π`);
  const cone = {
    id: 'r8-2', title: '원뿔의 모선·높이·부피', short: '원뿔',
    question: '모선의 길이 L과 모선이 밑면과 이루는 각 θ를 알면 원뿔의 반지름·높이·부피는? 축을 지나는 단면의 직각삼각형으로 풀어 보자.',
    ctl: ['t83l', 't83t'],
    init: (s) => { s.t83l = 8; s.t83t = 60; },
    model: (s) => { const L = Math.round(s.t83l), th = Math.round(s.t83t), r = vmul(vi(L), cosD(th)), h = vmul(vi(L), sinD(th)), V = vdiv(vmul(vpow2(r), h), vi(3)); return { L, th, r, h, V }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99, f = (v) => (v.x ? vcan(v) : '≈' + decS(v.v, 2)); drawCone(b, s, M.r.v, M.h.v, M.th, { L: { L: `${M.L}`, r: show(2) ? `r = ${f(M.r)}` : '', h: show(2) ? `h = ${f(M.h)}` : '' }, rows: show(3) ? [{ t: `부피 = \\frac{1}{3}π r² h = ${M.V.x ? piC(M.V) : '≈ ' + decS(M.V.v * Math.PI, 2)}`, c: 'amber', size: 15 }] : [] }); },
    steps: (M) => [
      '원뿔을 축을 포함하는 평면으로 자르면 꼭짓점 $A$, 밑면의 중심 $O$, 밑면 위의 점 $B$ 로 이루어진 직각삼각형 $AOB$ 가 나타나요. 빗변 $AB$ 가 모선 $L$ 이에요.',
      `$r=L\\cos\\theta=${vtex(M.r)}$, $h=L\\sin\\theta=${vtex(M.h)}$ ${M.r.x ? '' : '(근삿값)'}`,
      `부피 $V=\\frac{1}{3}\\pi r^2h=${M.V.x ? piT(M.V) : '\\text{(근삿값)}\\ ' + decS(M.V.v * Math.PI, 2)}$`
    ],
    view: (M) => ({
      guide: '<b>모선 L</b>과 <b>각 θ</b>를 바꾸고 <b>빈 곳을 끌어</b> 돌려 보세요. 초록 빗변(모선), 분홍 대변(높이), 하늘색 이웃변(반지름)이 직각삼각형을 이뤄요. 입체는 밑면이 아래에 있어요.',
      readouts: [rd('반지름 $r$', `$${vtex(M.r)}$`, 'sky'), rd('높이 $h$', `$${vtex(M.h)}$`, 'rose'), rd('부피 $V$', M.V.x ? `$${piT(M.V)}$` : decS(M.V.v * Math.PI, 2), 'amber')],
      rule: '모선 $L$, 밑면과 이루는 각 $\\theta$ → 반지름 $L\\cos\\theta$, 높이 $L\\sin\\theta$, 부피 $\\frac{1}{3}\\pi r^2h$',
      notes: notes('모선과 <b>밑면</b>이 이루는 각이에요. 모선과 높이가 이루는 각이라면 $\\sin$ 과 $\\cos$ 이 바뀌어요.', '부피에는 $\\frac{1}{3}$ 을 곱하는 것을 잊지 마세요.')
    }),
    gen: function g() {
      const th = pick([30, 45, 60]), L = th === 45 ? pick([2, 4, 6, 8].map((k) => k)) : pick([2, 4, 6, 8, 12]), kind = pick(['h', 'r', 'V', 'V']);
      const r = vmul(vi(L), cosD(th)), h = vmul(vi(L), sinD(th)), V = vdiv(vmul(vpow2(r), h), vi(3));
      let stem, ans, wr, o = { L: { L: `${L}` } }, fmt = (v) => vtex(v), thL = `${th}°`;
      if (kind === 'h') { ans = h; wr = [[r, '반지름이에요. 높이는 $L\\sin\\theta$ 예요.'], [vi(L), '모선의 길이예요.'], [vmul(vi(L), tanD(th)), '$\\tan$ 을 썼어요.'], [vdiv(vi(L), sinD(th)), '곱해야 하는데 나누었어요.'], [vmul(r, vi(2)), '']]; o.L.h = 'x'; o.L.hx = true; stem = `그림과 같이 모선의 길이가 $${L}$ 이고 모선이 밑면과 이루는 각이 $${th}^{\\circ}$ 인 원뿔의 높이 $x$ 는?`; }
      else if (kind === 'r') { ans = r; wr = [[h, '높이예요. 반지름은 $L\\cos\\theta$ 예요.'], [vi(L), '모선의 길이예요.'], [vdiv(vi(L), cosD(th)), '곱해야 하는데 나누었어요.'], [vmul(h, vi(2)), ''], [vmul(vi(L), tanD(th)), '']]; o.L.r = 'x'; o.L.rx = true; stem = `그림과 같이 모선의 길이가 $${L}$ 이고 모선이 밑면과 이루는 각이 $${th}^{\\circ}$ 인 원뿔의 밑면의 반지름 $x$ 는?`; }
      else { ans = V; fmt = piT; wr = [[vdiv(vmul(vpow2(r), h), vi(1)), '$\\frac{1}{3}$ 을 곱하지 않았어요.'], [vdiv(vmul(vpow2(h), r), vi(3)), '$r$ 과 $h$ 를 바꿨어요.'], [vmul(vpow2(r), h), ''], [vdiv(vmul(vpow2(r), h), vi(2)), '$\\frac{1}{3}$ 이 아니라 $\\frac{1}{2}$ 을 곱했어요.'], [vdiv(vmul(vmul(vi(L), vi(L)), h), vi(3)), '반지름 대신 모선을 썼어요.']].filter((w) => !vsame(w[0], V)); o.rows = [{ t: '부피 = x', c: 'amber', size: 18 }]; stem = `그림과 같이 모선의 길이가 $${L}$ 이고 모선이 밑면과 이루는 각이 $${th}^{\\circ}$ 인 원뿔의 부피는?`; }
      const q = { tag: '원뿔의 높이·반지름·부피', key: ['cone', th, L, kind].join('|'), stem, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans)), { fmt, plain: (v) => vplain(v) + (kind === 'V' ? ' 파이' : '') }), fig: { r: r.v, h: h.v, th, o, thL }, given: [`${L}`, thL], ans: [vcan(ans)] };
      q.fig.kind = kind; q.fig.work = { h: vcan(h), r: vcan(r), V: piC(V) };
      return checkQ(q, [
        `모선은 $AB=${L}$이고 모선과 밑면의 각은 $\\angle ABO=${th}^{\\circ}$입니다. 축을 지나는 단면 $\\triangle AOB$를 찾아요.`,
        '$AO\\perp OB$이므로 빗변은 모선 $AB$, 기준각의 대변은 높이 $AO$, 이웃변은 반지름 $OB$입니다.',
        `$h=${L}\\sin ${th}^{\\circ}=${vtex(h)}$, $r=${L}\\cos ${th}^{\\circ}=${vtex(r)}$입니다.`,
        kind === 'V' ? `부피는 $V=\\frac{1}{3}\\pi r^2h=\\frac{1}{3}\\pi\\times${vtex(vpow2(r))}\\times${vtex(h)}$입니다.` : `구하는 것은 ${kind === 'h' ? '높이 $h$' : '반지름 $r$'}입니다. 모선이나 지름과 구별해요.`
      ], { kind: 'cone', slant: L, angle: th, ask: kind, answer: kind === 'V' ? ans.v * Math.PI : ans.v });
    },
    pdraw: (b, q, C, s) => drawCone(b, s, q.fig.r, q.fig.h, q.fig.th, { ...q.fig.o, stage: C.review ? C.step : 0, thL: q.fig.thL, L: { ...q.fig.o.L, ...(C.review && C.step >= 3 ? Object.fromEntries(['h', 'r'].filter((k) => q.fig.kind !== k || C.last).map((k) => [k, q.fig.work[k]])) : {}) }, rows: C.last && q.fig.kind === 'V' ? [{ t: `부피 = ${q.fig.work.V}`, c: 'amber' }] : q.fig.o.rows })
  };

  /* ====================================================================== 정사면체 */
  function tetra(a) { const R = a / Math.sqrt(3), H = (a * Math.sqrt(6)) / 3, ang0 = [210, 330, 90].map((d) => d * DEG); return { R, H, A: p3(R * Math.cos(ang0[0]), R * Math.sin(ang0[0]), 0), B: p3(R * Math.cos(ang0[1]), R * Math.sin(ang0[1]), 0), C: p3(R * Math.cos(ang0[2]), R * Math.sin(ang0[2]), 0), D: p3(0, 0, H), O: p3(0, 0, 0) }; }
  function drawTetra(b, s, a, o = {}) {
    const cam = camOf(s), T3 = tetra(a), pr = (v) => { const q = proj3(cam, v); return pt(q.x, q.y); }, A = pr(T3.A), B = pr(T3.B), Cc = pr(T3.C), D = pr(T3.D), O = pr(T3.O);
    setup3(b, [A, B, Cc, D], { b: 60 + (o.rows ? o.rows.length * 26 : 0) });
    const cen = centroid([A, B, Cc, D]);
    const V = [T3.A, T3.B, T3.C, T3.D], Q = [A, B, Cc, D], center = p3(0, 0, T3.H / 4);
    const faces = [[0, 1, 2], [0, 1, 3], [1, 2, 3], [2, 0, 3]];
    const front = faces.map(([i, j, k]) => {
      const u = p3(V[j].x - V[i].x, V[j].y - V[i].y, V[j].z - V[i].z), v = p3(V[k].x - V[i].x, V[k].y - V[i].y, V[k].z - V[i].z);
      let n = p3(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
      const inward = n.x * (center.x - V[i].x) + n.y * (center.y - V[i].y) + n.z * (center.z - V[i].z);
      if (inward > 0) n = p3(-n.x, -n.y, -n.z);
      return G.faceFront(cam, n);
    });
    if (o.stage == null || o.stage >= 2) fillPoly(b, [A, O, D], 'violet', 0.12);
    [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]].forEach(([i, j]) => {
      const visible = faces.some((f, k) => f.includes(i) && f.includes(j) && front[k]);
      b.path([Q[i], Q[j]], { color: 'ink', width: visible ? 3 : 2, dash: visible ? undefined : [6, 5], alpha: visible ? 1 : 0.55 });
    });
    line(b, D, O, 'rose', 3.4, { dash: dashed }); line(b, O, A, 'sky', 3.6); line(b, D, A, 'green', 3.8);
    b.right(O, D, A, { color: 'ink', size: 13 }); ang(b, A, O, D, { color: 'amber', r: 34, label: o.thL, size: o.thL === 'x' ? 20 : 16, labelDist: 52 });
    [[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D']].forEach(([p, n]) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cen, n, { size: 17, gap: 10 }); });
    b.point(O, { color: 'violet', r: 4.5 }); T(b, O, 'O', { dx: 12, dy: 16, size: 16, color: 'violet' });
    const L = o.L || {};
    if (L.a) T(b, mid(D, A), L.a, { dx: -8, dy: -8, size: 16, color: 'green', align: 'right' });
    if (L.h) T(b, mid(D, O), L.h, { dx: 8, size: L.hx ? 21 : 16, color: L.hx ? 'amber' : 'rose', align: 'left' });
    if (L.R) T(b, mid(O, A), L.R, { dy: 18, size: 15, color: 'sky' });
    (o.rows || []).forEach((r, i) => T(b, pt(cen.x, Math.max(A.y, B.y, Cc.y)), r.t, { dy: 44 + i * 26, size: r.size || 16, color: r.c }));
  }
  const tet = {
    id: 'r8-3', title: '정사면체의 높이와 부피', short: '정사면체',
    question: '한 모서리가 a인 정사면체의 높이와 부피는? 꼭짓점 D에서 밑면에 내린 수선의 발 O의 위치를 이용해 보자.',
    ctl: ['t84a'],
    init: (s) => { s.t84a = 6; },
    model: (s) => { const a = Math.round(s.t84a), R = vmul(vdiv(vsq(3), vi(3)), vi(a)), H = vmul(vdiv(vsq(6), vi(3)), vi(a)), V = vmul(vdiv(vsq(2), vi(12)), vi(a * a * a)); return { a, R, H, V, cs: vdiv(vsq(3), vi(3)) }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99; drawTetra(b, s, M.a, { thL: show(1) ? '∠DAO' : '', L: { a: `${M.a}`, R: show(1) ? vcan(M.R) : '', h: show(2) ? vcan(M.H) : '' }, rows: show(3) ? [{ t: `부피 = \\frac{1}{3} × \\frac{√3}{4}a² × h = ${vcan(M.V)}`, c: 'amber', size: 15 }] : [] }); },
    steps: (M) => [
      '꼭짓점 $D$ 에서 밑면 $ABC$ 에 내린 수선의 발 $O$ 는 정삼각형 $ABC$ 의 무게중심(외심)이에요. $AO$ 는 정삼각형의 높이의 $\\frac{2}{3}$ 예요.',
      `$AO=\\frac{2}{3}\\times\\frac{\\sqrt{3}}{2}a=\\frac{\\sqrt{3}}{3}a=${vtex(M.R)}$, $\\triangle DAO$ 에서 $DO=\\sqrt{a^2-AO^2}=${vtex(M.H)}$`,
      `$\\cos(\\angle DAO)=\\frac{AO}{DA}=\\frac{\\sqrt{3}}{3}$ (모서리와 밑면이 이루는 각), 부피 $V=\\frac{1}{3}\\times\\frac{\\sqrt{3}}{4}a^2\\times DO=${vtex(M.V)}$`
    ],
    view: (M) => ({
      guide: '<b>모서리 a</b>를 바꾸고 <b>빈 곳을 끌어</b> 돌려 보세요. 보라색 직각삼각형 DAO가 모서리 DA, 높이 DO, 밑면의 반지름 AO로 이루어져요. 밑면이 아래에 있어요.',
      readouts: [rd('$AO$', `$${vtex(M.R)}$`, 'sky'), rd('높이 $DO$', `$${vtex(M.H)}$`, 'rose'), rd('부피 $V$', `$${vtex(M.V)}$`, 'amber')],
      rule: '한 모서리 $a$ 인 정사면체: 높이 $\\frac{\\sqrt{6}}{3}a$, 부피 $\\frac{\\sqrt{2}}{12}a^3$',
      notes: notes('수선의 발은 밑면의 <b>무게중심</b>이에요. 한 변의 중점이 아니에요.', '삼각비를 쓰면 $\\cos(\\angle DAO)=\\frac{\\sqrt{3}}{3}$ 로 모서리와 밑면이 이루는 각의 코사인이에요.')
    }),
    gen: () => {
      const a0 = pick([3, 6, 9, 12]), a = vi(a0), kind = pick(['h', 'V', 'cos']), H = vmul(vdiv(vsq(6), vi(3)), a), V = vmul(vdiv(vsq(2), vi(12)), vi(a0 * a0 * a0)), cs = vdiv(vsq(3), vi(3));
      let ans, wr, o = { L: { a: `${a0}` } }, stem, thL = '';
      if (kind === 'h') { ans = H; wr = [[vmul(vdiv(vsq(3), vi(2)), a), '정삼각형의 높이예요. 정사면체의 높이는 한 번 더 구해요.'], [vmul(vdiv(vsq(3), vi(3)), a), '$AO$ 의 길이예요.'], [vmul(vdiv(vsq(2), vi(2)), a), ''], [vmul(vdiv(vsq(6), vi(2)), a), ''], [a, '']]; o.L.h = 'x'; o.L.hx = true; stem = `그림과 같이 한 모서리의 길이가 $${a0}$ 인 정사면체에서 꼭짓점 $D$ 에서 밑면 $ABC$ 에 내린 수선의 길이 $\\overline{DO}=x$ 는?`; }
      else if (kind === 'V') { ans = V; wr = [[vmul(vdiv(vsq(2), vi(4)), vi(a0 * a0 * a0)), '$\\frac{1}{3}$ 을 곱하지 않았어요.'], [vmul(vdiv(vsq(2), vi(6)), vi(a0 * a0 * a0)), ''], [vmul(vdiv(vsq(3), vi(12)), vi(a0 * a0 * a0)), ''], [vmul(vdiv(vsq(6), vi(12)), vi(a0 * a0 * a0)), ''], [vmul(vdiv(vsq(2), vi(12)), vi(a0 * a0)), '']]; o.rows = [{ t: '부피 = x', c: 'amber', size: 18 }]; stem = `그림과 같이 한 모서리의 길이가 $${a0}$ 인 정사면체의 부피는?`; }
      else { ans = cs; wr = [[vdiv(vsq(6), vi(3)), '높이 DO 와 모서리의 비예요. 구하는 각은 $\\angle DAO$ 예요.'], [vdiv(vi(1), vi(2)), ''], [vdiv(vsq(3), vi(2)), ''], [vdiv(vsq(2), vi(2)), ''], [vdiv(vi(1), vsq(3)), '']].filter((w) => !vsame(w[0], cs)); thL = 'x'; stem = `그림과 같이 한 모서리의 길이가 $${a0}$ 인 정사면체에서 모서리 $DA$ 와 밑면 $ABC$ 가 이루는 각의 크기를 $x$ 라 할 때, $\\cos x$ 의 값은? (단, $O$ 는 점 $D$ 에서 밑면에 내린 수선의 발)`; }
      const q = { tag: '정사면체', key: ['tet', a0, kind].join('|'), stem, choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { a0, o, thL }, given: [`${a0}`], ans: [vcan(ans)] };
      const R = vmul(vdiv(vsq(3), vi(3)), a);
      q.fig.kind = kind; q.fig.work = { R: vcan(R), h: vcan(H), V: vcan(V) };
      return checkQ(q, [
        `정사면체의 모서리는 $${a0}$입니다. 높이의 발 $O$는 밑면 정삼각형 $ABC$의 무게중심입니다.`,
        `밑면의 높이의 $\\frac{2}{3}$만큼이므로 $AO=\\frac{2}{3}\\times\\frac{\\sqrt{3}}{2}\\times${a0}=${vtex(R)}$입니다.`,
        `$\\triangle DAO$에서 $DO\\perp AO$이므로 $DO=\\sqrt{${a0}^2-${vtex(vpow2(R))}}=${vtex(H)}$입니다.`,
        kind === 'V' ? `부피는 $V=\\frac{1}{3}\\times\\frac{\\sqrt{3}}{4}\\times${a0}^2\\times${vtex(H)}$입니다.` : kind === 'cos' ? `모서리와 밑면의 각은 $x=\\angle DAO$이므로 $\\cos x=\\frac{AO}{DA}=\\frac{${vtex(R)}}{${a0}}$입니다.` : '구하는 높이는 $DO$입니다. 밑면 정삼각형의 높이 또는 $AO$와 구별해요.'
      ], { kind: 'tetrahedron', side: a0, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C, s) => drawTetra(b, s, q.fig.a0, { ...q.fig.o, stage: C.review ? C.step : 0, thL: q.fig.thL, L: { ...q.fig.o.L, ...(C.review && C.step >= 2 ? { R: q.fig.work.R } : {}), ...(C.review && C.step >= 3 && (q.fig.kind !== 'h' || C.last) ? { h: q.fig.work.h } : {}) }, rows: C.last && q.fig.kind === 'V' ? [{ t: `부피 = ${q.fig.work.V}`, c: 'amber' }] : q.fig.o.rows })
  };

  /* ====================================================================== r9-1 정사각형 속 ∠EBF */
  function sqGeo(s0, u, f) { return { A: pt(0, -s0), B: pt(0, 0), C: pt(s0, 0), D: pt(s0, -s0), E: pt(s0, -u), F: pt(f, -s0) }; }
  function drawSq(b, g, o = {}) {
    const { A, B, C, D, E, F } = g, st = o.step == null ? 99 : o.step, cen = pt(g.C.x / 2, -g.D.y / 2 * -1 * 0.5);
    fit(b, bboxOf([A, B, C, D]), { t: 56, b: 62 + (o.rows ? o.rows.length * 26 : 0), l: 52, r: 52 });
    poly(b, [A, B, C, D], 'ink', 3.4);
    fillPoly(b, [B, E, F], 'amber', 0.12);
    if (st >= 1) { fillPoly(b, [A, B, F], 'sky', 0.14); fillPoly(b, [B, C, E], 'green', 0.14); fillPoly(b, [D, E, F], 'rose', 0.14); }
    line(b, B, E, 'amber', 3.4); line(b, B, F, 'amber', 3.4); line(b, E, F, 'amber', 3.4);
    ang(b, B, E, F, { color: 'amber', r: 36, label: 'x', size: 20, labelDist: 56 });
    [[A, 'A', pt(g.C.x / 2, 0)], [B, 'B', pt(g.C.x / 2, -g.D.y * 0.0 - g.A.y * -0.5 * -1)], [C, 'C', pt(0, 0)], [D, 'D', pt(0, 0)]].forEach(([p0, n]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, pt(g.C.x / 2, g.A.y / 2), n, { size: 17, gap: 11 }); });
    b.point(E, { color: 'amber', r: 5 }); tagOut(b, E, pt(g.C.x / 2, g.A.y / 2), 'E', { size: 17, gap: 11 }); if (o.handle) b.handle('F', F, { color: 'amber', r: 8, ariaLabel: '점 F 끌기', drag: o.handle }); else b.point(F, { color: 'amber', r: 5 });
    tagOut(b, F, pt(g.C.x / 2, g.A.y / 2), 'F', { size: 17, gap: 11 });
    ang(b, A, B, F, { color: 'ink', r: 14 }); ang(b, C, B, E, { color: 'ink', r: 14 }); ang(b, D, F, E, { color: 'ink', r: 14 });
    const L = o.L || {};
    if (L.s) T(b, mid(B, C), L.s, { dy: 22, size: 16, color: 'sky' });
    if (L.u) T(b, mid(C, E), L.u, { dx: 10, size: 16, color: 'green', align: 'left' });
    if (L.f) T(b, mid(A, F), L.f, { dy: -16, size: 16, color: 'rose' });
    if (o.ticks) { tick(b, C, E, 1, 'amber'); tick(b, E, D, 1, 'amber'); tick(b, A, F, 2, 'amber'); tick(b, F, D, 2, 'amber'); }
    (o.rows || []).forEach((r, i) => T(b, pt(g.C.x / 2, 0), r.t, { dy: 54 + i * 26, size: r.size || 16, color: r.c }));
  }
  const sqM = (s0, u, f) => {
    const abf = vi(s0 * f, 2), bce = vi(s0 * u, 2), def = vi((s0 - u) * (s0 - f), 2), bef = vsub(vsub(vsub(vi(s0 * s0), abf), bce), def);
    const be = vsqrt(vi(s0 * s0 + u * u)), bf = vsqrt(vi(s0 * s0 + f * f)), sn = vdiv(vmul(vi(2), bef), vmul(be, bf));
    const cs = vsqrt(vsub(vi(1), vpow2(sn)));
    return { abf, bce, def, bef, be, bf, sn, cs, tn: vdiv(sn, cs) };
  };
  const r91 = {
    id: 'r9-1', title: '정사각형 속 ∠EBF의 삼각비', short: '정사각형 속 각',
    question: '정사각형 ABCD의 변 위에 점 E, F를 잡으면 ∠EBF의 sin 값은? 넓이로 구해 보자.',
    ctl: ['t85s', 't85u', 't85f'],
    init: (s) => { s.t85s = 6; s.t85u = 3; s.t85f = 3; },
    model: (s) => { const s0 = Math.round(s.t85s), u = Math.min(Math.round(s.t85u), s0 - 1), f = Math.min(Math.round(s.t85f), s0 - 1); return { s0, u, f, ...sqM(s0, u, f) }; },
    draw(b, s, M, C) {
      const st = C.step, show = (n) => st >= n || st === 99;
      drawSq(b, sqGeo(M.s0, M.u, M.f), { step: st, L: { s: `${M.s0}`, u: `${M.u}`, f: `${M.f}` }, handle: C.tab === 'explore' && !C.thumb ? (w) => { s.t85f = clamp(Math.round(w.x), 1, M.s0 - 1); } : null, rows: [show(2) ? { t: `△BEF = ${M.s0 * M.s0} − ${vcan(M.abf)} − ${vcan(M.bce)} − ${vcan(M.def)} = ${vcan(M.bef)}`, c: 'amber', size: 15 } : null, show(3) ? { t: `sin x = ${vcan(M.sn)}`, c: 'sky' } : null].filter(Boolean) });
    },
    steps: (M) => [
      `세 직각삼각형의 넓이를 구해요. $\\triangle ABF=\\frac{1}{2}\\times${M.s0}\\times${M.f}=${vtex(M.abf)}$, $\\triangle BCE=\\frac{1}{2}\\times${M.s0}\\times${M.u}=${vtex(M.bce)}$, $\\triangle DEF=\\frac{1}{2}\\times${M.s0 - M.u}\\times${M.s0 - M.f}=${vtex(M.def)}$`,
      `$\\triangle BEF$ 의 넓이는 정사각형에서 세 삼각형을 뺀 값이에요. $${M.s0 * M.s0}-${vtex(M.abf)}-${vtex(M.bce)}-${vtex(M.def)}=${vtex(M.bef)}$`,
      `$BE=\\sqrt{${M.s0}^2+${M.u}^2}=${vtex(M.be)}$, $BF=\\sqrt{${M.s0}^2+${M.f}^2}=${vtex(M.bf)}$. $\\triangle BEF=\\frac{1}{2}\\times BE\\times BF\\times\\sin x$ 이므로 $\\sin x=${vtex(M.sn)}$`
    ],
    view: (M) => ({
      guide: '<b>한 변 s</b>, <b>CE</b>, <b>AF</b>를 바꿔 보세요(점 F는 가로로 끌어도 돼요). 노란 삼각형 BEF의 넓이를 정사각형에서 세 삼각형을 빼서 구한 뒤 $\\frac{1}{2}\\times BE\\times BF\\times\\sin x$ 와 같다고 놓아요.',
      readouts: [rd('$\\triangle BEF$', `$${vtex(M.bef)}$`, 'amber'), rd('$\\sin x$', `$${vtex(M.sn)}$`, 'sky'), rd('$\\cos x$', `$${vtex(M.cs)}$`, 'green')],
      rule: '$\\triangle BEF=($정사각형$)-($세 직각삼각형$)=\\frac{1}{2}BE\\cdot BF\\sin x$',
      notes: notes('$\\angle EBF$ 는 직각이 아니에요. 코사인법칙 없이 <b>넓이</b>로 $\\sin x$ 를 구해요.', '$BE$, $BF$ 는 피타고라스 정리로 구해요.')
    }),
    gen: function g() {
      const s0 = pick([6, 12]), opts = [s0 / 2, s0 / 3, (2 * s0) / 3], mid2 = Math.random() < 0.5;
      const u = mid2 ? s0 / 2 : pick(opts), f = mid2 ? s0 / 2 : pick(opts), M = sqM(s0, u, f), fn = pick(['s', 'c', 't']);
      if (M.sn.v >= 1 - 1e-9) return g();
      const ans = { s: M.sn, c: M.cs, t: M.tn }[fn], wr = [...['s', 'c', 't'].filter((k) => k !== fn).map((k) => [{ s: M.sn, c: M.cs, t: M.tn }[k], '다른 삼각비예요. 먼저 $\\sin x$ 를 넓이로 구한 뒤 구하는 값을 계산해요.']), [vdiv(M.bef, vmul(M.be, M.bf)), '$\\triangle BEF=\\frac{1}{2}BE\\cdot BF\\sin x$ 에서 $\\frac{1}{2}$ 을 처리하지 못했어요.'], [vdiv(vi(1), ans), '']];
      const q = {
        tag: '정사각형 속의 삼각비', key: ['r91', s0, u, f, fn, mid2].join('|'),
        stem: mid2 ? `그림과 같이 한 변의 길이가 $${s0}$ 인 정사각형 $ABCD$ 에서 점 $E$, $F$ 는 각각 변 $CD$, $AD$ 의 중점이다. $\\angle EBF=x$ 일 때, $${G.FN[fn]} \\,x$ 의 값은?` : `그림과 같이 한 변의 길이가 $${s0}$ 인 정사각형 $ABCD$ 의 변 $CD$, $AD$ 위에 $\\overline{CE}=${u}$, $\\overline{AF}=${f}$ 인 점 $E$, $F$ 가 있다. $\\angle EBF=x$ 일 때, $${G.FN[fn]} \\,x$ 의 값은?`,
        choices: mkChoices(ans, wr.filter((w) => !vsame(w[0], ans))), fig: { s0, u, f, mid2 }, given: [`${s0}`], ans: [vcan(ans)]
      };
      q.fig.work = { abf: vcan(M.abf), bce: vcan(M.bce), def: vcan(M.def), bef: vcan(M.bef) };
      return checkQ(q, [
        `한 변은 $${s0}$, $CE=${u}$, $AF=${f}$입니다.${mid2 ? ' 두 점이 중점이므로 각각 한 변의 절반입니다.' : ''} 구하는 각은 $\\angle EBF=x$입니다.`,
        `세 직각삼각형의 넓이는 $[ABF]=${vtex(M.abf)}$, $[BCE]=${vtex(M.bce)}$, $[DEF]=${vtex(M.def)}$입니다. 따라서 $[BEF]=${s0 * s0}-${vtex(M.abf)}-${vtex(M.bce)}-${vtex(M.def)}=${vtex(M.bef)}$입니다.`,
        `$BE=\\sqrt{${s0}^2+${u}^2}=${vtex(M.be)}$, $BF=\\sqrt{${s0}^2+${f}^2}=${vtex(M.bf)}$이므로 $\\sin x=\\frac{2[BEF]}{BE\\cdot BF}=${vtex(M.sn)}$입니다.`,
        fn === 's' ? '문제에서 구하는 것은 $\\sin x$입니다. 넓이 공식의 $\\frac{1}{2}$를 옮길 때 분자에 2를 곱해요.' : fn === 'c' ? `각 $x$는 예각이므로 $\\cos x=\\sqrt{1-\\sin^2x}=\\sqrt{1-${vtex(vpow2(M.sn))}}$입니다.` : `$\\cos x=\\sqrt{1-\\sin^2x}=${vtex(M.cs)}$를 구하고 $\\tan x=\\frac{\\sin x}{\\cos x}=\\frac{${vtex(M.sn)}}{${vtex(M.cs)}}$를 계산해요.`
      ], { kind: 'square-angle', side: s0, ce: u, af: f, fn, answer: ans.v });
    },
    pdraw: (b, q, C) => { const f = q.fig; drawSq(b, sqGeo(f.s0, f.u, f.f), { step: C.review ? Math.max(0, C.step - 1) : 0, ticks: f.mid2, rows: C.review && C.step >= 2 ? [{ t: `△BEF의 넓이 = ${f.work.bef}`, c: 'amber' }] : [], L: f.mid2 && !(C.review && C.step >= 1) ? { s: `${f.s0}` } : { s: `${f.s0}`, u: `${f.u}`, f: `${f.f}` } }); }
  };

  /* ====================================================================== r9-2 직사각형 종이접기 */
  function foldGeo(w, t) {
    const L = w * Math.sqrt(3), A = pt(0, -w), B = pt(0, 0), Cc = pt(L, 0), D = pt(L, -w), E = pt(w / Math.sqrt(3), 0);
    // B 를 AE 를 축으로 접기: 수직 성분을 cos(πt) 배
    const ax = sub(E, A), foot = add(A, mul(ax, ((B.x - A.x) * ax.x + (B.y - A.y) * ax.y) / (ax.x * ax.x + ax.y * ax.y))), perp = sub(B, foot), k = Math.cos(Math.PI * t);
    const Bt = add(foot, mul(perp, k));
    return { w, L, A, B, C: Cc, D, E, Bt };
  }
  function drawFold(b, g, o = {}) {
    const { A, B, C, D, E, Bt } = g, st = o.step == null ? 99 : o.step, t = o.t || 0;
    fit(b, bboxOf([A, B, C, D, G.pt(Bt.x, Bt.y)]), { t: 56, b: 62 + (o.rows ? o.rows.length * 26 : 0), l: 52, r: 52 });
    poly(b, [A, B, C, D], 'ink', 3.4);
    fillPoly(b, [A, E, Bt], 'amber', 0.16); poly(b, [A, E, Bt], 'amber', 3);
    line(b, A, E, 'violet', 3.6);
    line(b, A, C, 'muted', 2, { dash: dashed }); if (t > 0.02) line(b, A, B, 'muted', 1.8, { dash: dashed });
    [[A, 'A', pt(g.L / 2, -g.w / 2)], [B, 'B', pt(g.L / 2, -g.w / 2)], [C, 'C', pt(g.L / 2, -g.w / 2)], [D, 'D', pt(g.L / 2, -g.w / 2)]].forEach(([p0, n, c]) => { b.point(p0, { color: 'ink', r: 4.5 }); tagOut(b, p0, c, n, { size: 17, gap: 11 }); });
    b.point(E, { color: 'violet', r: 4.5 }); T(b, E, 'E', { dy: 20, size: 17, color: 'violet' });
    if (t > 0.98) { b.point(Bt, { color: 'amber', r: 4.5 }); T(b, Bt, 'B′', { dx: -4, dy: 18, size: 16, color: 'amber' }); ang(b, Bt, A, E, { color: 'ink', r: 14 }); }
    ang(b, B, A, E, { color: 'ink', r: 16 });
    if (o.angs) { ang(b, A, B, E, { color: 'amber', r: 34, label: o.angs[0], size: 16, labelDist: 52 }); ang(b, A, E, C, { color: 'amber', r: 44, noMark: true }); }
    const L = o.L || {};
    if (L.w) T(b, mid(A, B), L.w, { dx: -10, size: L.wx ? 21 : 16, color: L.wx ? 'amber' : 'sky', align: 'right' });
    if (L.bc) T(b, mid(B, C), L.bc, { dy: 38, size: 16, color: 'sky' });
    if (L.ae) T(b, mid(A, E), L.ae, { dx: 12, dy: -6, size: L.aex ? 21 : 16, color: L.aex ? 'amber' : 'violet', align: 'left' });
    if (L.ec) T(b, mid(E, C), L.ec, { dy: 22, size: L.ecx ? 21 : 16, color: L.ecx ? 'amber' : 'green' });
    if (L.be) T(b, mid(B, E), L.be, { dy: 22, size: 15, color: 'sky' });
    (o.rows || []).forEach((r, i) => T(b, pt(g.L / 2, 0), r.t, { dy: 64 + i * 26, size: r.size || 16, color: r.c }));
  }
  const r92 = {
    id: 'r9-2', title: '직사각형 종이접기 — 30°·60° 직각삼각형', short: '종이접기',
    question: '직사각형 ABCD의 꼭짓점 B가 대각선 AC 위에 오도록 AE를 접는 선으로 접으면 어떤 직각삼각형들이 생길까?',
    ctl: ['t86w', 't86k'], anim: { key: 't86k', dur: 3, label: '접어 보기', start: 0 }, stepT: (n) => (n >= 2 ? 1 : 0),
    init: (s) => { s.t86w = 6; s.t86k = 0; },
    model: (s) => { const w = Math.round(s.t86w), be = vdiv(vsq(3), vi(3)), BE = vmul(be, vi(w)), AE = vmul(vdiv(vi(2), vsq(3)), vi(w)), EC = vsub(vmul(vsq(3), vi(w)), BE), S = vdiv(vmul(EC, vi(w)), vi(2)); return { w, BE, AE, EC, S, bc: vmul(vsq(3), vi(w)), k: s.t86k }; },
    draw(b, s, M, C) { const st = C.step, show = (n) => st >= n || st === 99, t = C.review ? C.t : M.k; drawFold(b, foldGeo(M.w, t), { step: st, t, angs: show(1) ? ['30°'] : null, L: { w: `${M.w}`, bc: `${vcan(M.bc)}`, ae: show(2) ? vcan(M.AE) : '', ec: show(3) ? vcan(M.EC) : '', be: show(2) ? vcan(M.BE) : '' }, rows: show(3) ? [{ t: `△AEC = \\frac{1}{2} × EC × AB = ${vcan(M.S)}`, c: 'amber', size: 15 }] : [] }); },
    steps: (M) => [
      `$AB=${M.w}$, $BC=${vtex(M.bc)}$ 이므로 $\\tan(\\angle BAC)=\\sqrt{3}$, $\\angle BAC=60^{\\circ}$ 예요. 접으면 $B$ 가 $AC$ 위의 점 $B^{\\prime}$ 에 오므로 접은 각 $\\angle BAE=\\angle B^{\\prime}AE=\\frac{60^{\\circ}}{2}=30^{\\circ}$ 예요.`,
      `$\\triangle ABE$ 에서 $BE=${M.w}\\tan30^{\\circ}=${vtex(M.BE)}$, $AE=\\frac{${M.w}}{\\cos30^{\\circ}}=${vtex(M.AE)}$ 이고 접은 도형이므로 $B^{\\prime}E=BE$, $\\angle AB^{\\prime}E=90^{\\circ}$ 예요.`,
      `$EC=BC-BE=${vtex(M.EC)}$, $\\triangle AEC=\\frac{1}{2}\\times EC\\times AB=${vtex(M.S)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>세로 w</b>를 바꾸고 ▶를 눌러 보세요. 노란 삼각형 ABE가 접는 선 AE(보라)를 축으로 제자리에서 접혀 대각선 AC 위의 점 B′에 겹쳐요.',
      readouts: [rd('$BE=B^{\\prime}E$', `$${vtex(M.BE)}$`, 'sky'), rd('$AE$', `$${vtex(M.AE)}$`, 'violet'), rd('$EC$', `$${vtex(M.EC)}$`, 'green')],
      rule: '접은 각 = 원래 각 (∠BAE = ∠B′AE) → 30°·60°·90° 직각삼각형으로 변의 길이를 구한다',
      notes: notes('접은 부분과 원래 부분은 합동이에요. 대응하는 변의 길이와 각이 같아요.', '$\\angle AB^{\\prime}E=90^{\\circ}$ 이므로 $\\triangle EB^{\\prime}C$ 도 직각삼각형이에요.')
    }),
    gen: function g() {
      const w = pick([3, 6, 9, 12]), kind = pick(['ae', 'ec', 'S', 'be']);
      const BE = vmul(vdiv(vsq(3), vi(3)), vi(w)), AE = vmul(vdiv(vi(2), vsq(3)), vi(w)), EC = vsub(vmul(vsq(3), vi(w)), BE), S = vdiv(vmul(EC, vi(w)), vi(2));
      let ans, wr, L = { w: `${w}`, bc: `${vcan(vmul(vsq(3), vi(w)))}` }, rows = [], stemAsk;
      if (kind === 'ae') { ans = AE; wr = [[BE, '$BE$ 의 길이예요.'], [vmul(vdiv(vsq(3), vi(2)), vi(w)), ''], [vmul(vsq(3), vi(w)), ''], [vmul(vdiv(vsq(2), vi(2)), vi(w)), ''], [vi(2 * w), '대각선 $AC$ 의 길이예요.']]; L.aex = true; L.ae = 'x'; stemAsk = '$\\overline{AE}=x$ 의 길이는?'; }
      else if (kind === 'ec') { ans = EC; wr = [[BE, '$BE$ 의 길이예요.'], [vmul(vsq(3), vi(w)), '$BC$ 의 길이예요. $BE$ 를 빼야 해요.'], [vmul(vdiv(vsq(3), vi(2)), vi(w)), ''], [vsub(vmul(vsq(3), vi(w)), vi(w)), ''], [AE, '']]; L.ecx = true; L.ec = 'x'; stemAsk = '$\\overline{EC}=x$ 의 길이는?'; }
      else if (kind === 'be') { ans = BE; wr = [[AE, '$AE$ 의 길이예요.'], [vmul(vsq(3), vi(w)), ''], [vi(w), ''], [vmul(vdiv(vsq(3), vi(2)), vi(w)), ''], [EC, '']]; L.be = 'x'; stemAsk = '$\\overline{BE}=x$ 의 길이는?'; }
      else { ans = S; wr = [[vdiv(vmul(vmul(vsq(3), vi(w)), vi(w)), vi(2)), '$\\triangle ABC$ 의 넓이예요.'], [vmul(EC, vi(w)), '$\\frac{1}{2}$ 을 곱하지 않았어요.'], [vdiv(vmul(BE, vi(w)), vi(2)), '$\\triangle ABE$ 의 넓이예요.'], [vdiv(vmul(vmul(vsq(3), vi(w)), vi(w)), vi(1)), ''], [vdiv(vmul(AE, vi(w)), vi(2)), '']]; rows = [{ t: '△AEC의 넓이 = x', c: 'amber', size: 18 }]; stemAsk = '$\\triangle AEC$ 의 넓이는?'; }
      if (vsame(ans, vi(w)) || vsame(ans, vmul(vsq(3), vi(w)))) return g();
      const q = { tag: '직사각형 종이접기', key: ['r92', w, kind].join('|'), stem: `그림과 같이 $\\overline{AB}=${w}$, $\\overline{BC}=${vtex(vmul(vsq(3), vi(w)))}$ 인 직사각형 $ABCD$ 를 꼭짓점 $B$ 가 대각선 $AC$ 위의 점 $B^{\\prime}$ 에 오도록 $\\overline{AE}$ 를 접는 선으로 접었다. ${stemAsk}`, choices: mkChoices(ans, wr.filter((x) => !vsame(x[0], ans))), fig: { w, L, rows }, given: [`${w}`, vcan(vmul(vsq(3), vi(w)))], ans: [vcan(ans)] };
      q.fig.kind = kind; q.fig.work = { be: vcan(BE), ae: vcan(AE), ec: vcan(EC), S: vcan(S) };
      return checkQ(q, [
        `$AB=${w}$, $BC=${vtex(vmul(vsq(3), vi(w)))}$이므로 $\\tan\\angle BAC=\\sqrt{3}$, $\\angle BAC=60^{\\circ}$입니다.`,
        '접은 두 삼각형은 합동이므로 접는 선 $AE$는 $\\angle BAB^{\\prime}$를 이등분합니다. 따라서 $\\angle BAE=\\angle B^{\\prime}AE=30^{\\circ}$입니다.',
        `$BE=${w}\\tan30^{\\circ}=${vtex(BE)}$, $AE=\\frac{${w}}{\\cos30^{\\circ}}=${vtex(AE)}$입니다.`,
        kind === 'ec' || kind === 'S' ? `$EC=BC-BE=${vtex(vmul(vsq(3), vi(w)))}-${vtex(BE)}=${vtex(EC)}$입니다.${kind === 'S' ? ` 넓이는 $[AEC]=\\frac{1}{2}\\times${vtex(EC)}\\times${w}$입니다.` : ''}` : `문제에서 구하는 것은 $${kind.toUpperCase()}$입니다. 접기 전후 대응변의 길이는 같다는 점을 확인해요.`
      ], { kind: 'fold', width: w, ask: kind, answer: ans.v });
    },
    pdraw: (b, q, C) => drawFold(b, foldGeo(q.fig.w, C.review && C.step === 1 ? 0 : 1), { step: C.review ? C.step : 0, t: C.review && C.step === 1 ? 0 : 1, angs: C.review && C.step >= 2 ? ['30°'] : null, L: { ...q.fig.L, ...(C.review && C.step >= 3 ? Object.fromEntries(['be', 'ae'].filter((k) => q.fig.kind !== k || C.last).map((k) => [k, q.fig.work[k]])) : {}), ...(C.last && q.fig.kind === 'ec' ? { ec: q.fig.work.ec, ecx: false } : {}) }, rows: C.last && q.fig.kind === 'S' ? [{ t: `△AEC의 넓이 = ${q.fig.work.S}`, c: 'amber' }] : q.fig.rows })
  };

  G.register(80, 't8', '⑧ 입체·결합도형', '입체·결합도형', PARAMS, [cube, box, cone, tet, r91, r92]);
})();
