/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ④ 「회전체의 겉넓이와 부피」 (t4.js, order 40) — 장면 4개
   · sv4-1 직각삼각형 회전(축을 바꾸면 다른 원뿔) · sv4-2 직각사다리꼴 회전(원뿔대 / 원기둥+원뿔)
   · sv4-3 이중원뿔(붙은 면 제외) · sv4-4 복합(원뿔+원기둥+반구, 가로로 분해)
   평면도형은 축을 따라 제자리에서 돌고(회전), 부품 분해는 가로로 늘어놓습니다. √ 없이 (3,4,5)·(5,12,13)·(12,5,13)·(12,9,15)… 세 수가 함께 주어집니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, TAU, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, V, vadd, vsub, vmul, vnum, tx, plainVal, mkV, P, fmtN, pick, rint, notes, rd, span, scene3, revolveMesh, sphereProfile, xfMesh, shiftT, centroid, bboxOf } = G;

  const TRI = { A: [3, 4, 5], B: [5, 12, 13], C: [6, 8, 10] }; // 직각삼각형의 두 변과 빗변
  const TRI_LABEL = { A: '3·4·5', B: '5·12·13', C: '6·8·10' };
  const PARAMS = {
    s41K: P('삼각형의 크기 k', 1, 2, 1, 1, { color: 'amber', format: (v) => `${v}배` }),
    s41T: P('돌리기', 0, 1, 0.005, 0, { color: 'green', hint: '삼각형이 축을 중심으로 제자리에서 한 바퀴 돌아요', format: (v) => (v < 0.01 ? '0°' : v > 0.99 ? '한 바퀴' : Math.round(v * 360) + '°') }),
    s42J: P('위쪽 반지름의 크기 j', 1, 3, 1, 1, { color: 'amber', hint: '위쪽 반지름은 3j cm예요', format: (v) => `${3 * v} cm` }),
    s42K: P('아랫변이 위쪽보다 긴 정도 k', 1, 2, 1, 1, { color: 'sky', hint: '긴 쪽은 3k cm, 높이는 4k cm, 빗변은 5k cm', format: (v) => `${3 * v} cm` }),
    s42A: P('원기둥 부분의 길이 a', 1, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s42T: P('돌리기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.01 ? '0°' : v > 0.99 ? '한 바퀴' : Math.round(v * 360) + '°') }),
    s43T: P('돌리기 · 분해하기', 0, 1, 0.005, 0, { color: 'green', format: (v) => (v < 0.5 ? (v < 0.01 ? '0°' : Math.round(v * 2 * 360) + '°') : v > 0.99 ? '분해 완료' : '가로로 분해하는 중') }),
    s44H: P('원기둥 부분의 높이 H', 1, 8, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    s44T: P('분해하기', 0, 1, 0.01, 0, { color: 'green', hint: '원기둥과 원뿔이 오른쪽으로 옮겨지고 반구는 제자리에서 뒤집혀요', format: (v) => (v < 0.02 ? '붙어 있음' : v > 0.98 ? '모두 분해' : Math.round(v * 100) + '%') })
  };
  const oneOf = (v, list, d) => (list.includes(v) ? v : d);
  const A0 = -28 * DEG; // 평면도형이 처음 놓이는 방위(정면을 향함)

  // 평면도형(다각형, (r,y)) 하나를 방위 a 에 놓습니다
  const planePts = (poly, a, O = v3(0, 0, 0)) => poly.map(([r, y]) => add3(O, v3(r * Math.cos(a), y, r * Math.sin(a))));
  // 평면도형을 th(0~1) 만큼 돌린 입체 + 지금 평면
  function sweepDraw(D, prof, poly, th, op = {}) {
    const ang = th * TAU, full = th > 0.998;
    if (full) D.body({ mesh: revolveMesh(prof, { N: 48, O: op.O, tags: op.tags }), fill: op.fill || 'sky', alpha: op.alpha || 0.24, edge: 'ink', edgeW: 2.6, faceStyle: op.faceStyle });
    else if (th > 0.002) D.body({ mesh: revolveMesh(prof, { N: Math.max(8, Math.round(48 * th)), a0: A0, a1: A0 + ang, O: op.O, tags: op.tags }), fill: op.fill || 'sky', alpha: op.alpha || 0.24, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.cut ? { fill: 'amber', alpha: f.tag === 'cut1' ? 0.5 : 0.3 } : (op.faceStyle ? op.faceStyle(f) : {})) });
    if (!full) {
      const pts = planePts(poly, A0 + ang, op.O);
      D.panel(pts, 'amber', 0.5, 'amber', 3.2);
    }
  }
  const axisLine = (D, y0, y1, x = 0) => D.line(v3(x, y0, 0), v3(x, y1, 0), 'muted', 2.2, { dash: [8, 6], alpha: 0.9 });

  /* ================================================================ sv4-1 직각삼각형 회전 */
  function sv41() {
    const model = (s) => {
      const key = oneOf(s.svTri, ['A', 'B', 'C'], 'A'), k = clamp(Math.round(s.s41K), 1, 2), [a, b, c] = TRI[key], A = a * k, B = b * k, Cc = c * k;
      const axis = s.svAxis === 'long' ? 'long' : 'short', r = axis === 'short' ? B : A, h = axis === 'short' ? A : B; // 축으로 삼는 변이 높이
      const mode = s.svMode === 'vol' ? 'vol' : 'surf', S = V(0, r * r), lat = V(0, r * Cc), tot = vadd(S, lat), vol = V(0, (r * r * h) / 3);
      return { key, k, legA: A, legB: B, hyp: Cc, axis, r, h, R: Cc, mode, S, lat, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    const draw = (b, s, M, C) => {
      const sc = 4.6 / Math.max(M.h, M.r * 1.5), r = M.r * sc, h = M.h * sc, D = scene3(b, s, C), st = C.step;
      const th = C.problem ? 0.25 : C.t, y0 = -h / 2;
      const prof = [[0, y0], [r, y0], [0, y0 + h]], poly = prof;
      D.fit(cube8(v3(0, y0 + h / 2, 0), Math.max(r, h / 2)), [], { l: 44, r: 44, t: 40, b: 40 });
      const lvB = !C.review ? 1 : st === 1 ? 2 : 1, lvL = !C.review ? 1 : st === 2 ? 2 : 1;
      axisLine(D, y0 - 0.5, y0 + h + 0.7);
      sweepDraw(D, prof, poly, th, { O: v3(0, 0, 0), faceStyle: (f) => (f.tag === 'seg0' && st === 2 && C.review && M.mode === 'surf' ? { fill: 'amber', alpha: 0.38 } : f.tag === 'seg1' && st === 3 && C.review ? { fill: 'amber', alpha: 0.3 } : {}) });
      // 길이 표시는 평면도형(오른쪽 정면 자리)에
      const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pr = pa(r, y0), pt = pa(0, y0 + h);
      D.right(o, sub3(pr, o), sub3(pt, o), Math.min(0.32, r * 0.22), 'amber');
      D.elabel(o, pr, `r=${M.r}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 7 });
      D.elabel(o, pt, `h=${M.h}`, { side: { x: -1, y: 0 }, size: 15, color: 'amber', gap: 8 });
      D.elabel(pr, pt, `R=${M.R}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
      D.label(add3(o, v3(0, 0, 0)), '축', { dir: { x: -1, y: 0.3 }, size: 13, color: 'muted', gap: 4 });
      if (!C.problem && th > 0.99) D.tag(add3(o, v3(0, 0, 0)), M.mode === 'surf' ? `πr²=${plainVal(M.S)}` : `S=${plainVal(M.S)}`, { dy: 30, size: 14 });
    };
    const bg = (M) => `직각을 낀 두 변이 $${M.legA}\\,\\mathrm{cm}$, $${M.legB}\\,\\mathrm{cm}$이고 빗변이 $${M.hyp}\\,\\mathrm{cm}$인 직각삼각형`;
    return {
      id: 'sv4-1', title: '직각삼각형 회전', short: '삼각형 회전',
      question: '직각삼각형을 한 변을 축으로 한 바퀴 돌리면 어떤 입체가 될까? 어느 변을 축으로 하느냐에 따라 달라질까?',
      anim: { key: 's41T', dur: 5, label: '한 바퀴 돌리기' }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 1,
      ctl: () => ['s41K', 's41T'],
      presets: () => TRI_ORDER.map((k, i) => ({ group: i === 0 ? '삼각형의 세 변' : '', label: TRI_LABEL[k], apply: (st) => { st.svTri = k; }, on: (st) => oneOf(st.svTri, ['A', 'B', 'C'], 'A') === k })).concat([{ group: '축으로 하는 변', label: '짧은 변', apply: (st) => { st.svAxis = 'short'; }, on: (st) => st.svAxis !== 'long' }, { label: '긴 변', apply: (st) => { st.svAxis = 'long'; }, on: (st) => st.svAxis === 'long' }, { group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri = 'A'; s.svAxis = 'long'; s.svMode = 'surf'; s.s41K = 1; s.s41T = 0.3; },
      reroll: (s) => { s.svTri = pick(['A', 'B', 'C'], s.svTri); s.svAxis = pick(['short', 'long'], s.svAxis); s.svMode = pick(['surf', 'vol'], s.svMode); s.s41K = 1; s.s41T = 0.3; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = (M.r * (M.h - y)) / M.h; sum += PI * rr * rr * (M.h / n); } return { ans: sum, model: vnum(M.vol) }; }
        // 빗변을 축 둘레로 돌린 넓이: 파푸스 정리가 아니라 띠 적분
        let lat = 0; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.h, y1 = ((i + 1) / n) * M.h, r0 = (M.r * (M.h - y0)) / M.h, r1 = (M.r * (M.h - y1)) / M.h; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
        if (Math.abs(Math.hypot(M.r, M.h) - M.R) > 1e-9) return { ans: -1, model: 0 };
        return { ans: PI * M.r * M.r + lat, model: vnum(M.tot) };
      },
      steps: (M) => [
        `축으로 하는 변은 길이 $${M.h}$이고 이 변이 높이 $h$가 돼요. 다른 직각변 $${M.r}$이 밑면의 반지름 $r$이고, 빗변 $${M.R}$이 모선 $R$인 <b>원뿔</b>이 만들어져요.`,
        M.mode === 'vol' ? `밑넓이 $S=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.` : `밑넓이 $\\pi r^2=${tx(M.S)}$, 옆넓이 $\\pi Rr=\\pi\\times${M.R}\\times${M.r}=${tx(M.lat)}$이에요. (모선 $R$는 빗변이에요.)`,
        M.mode === 'vol' ? `(부피) $=\\frac{1}{3}\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.` : `(겉넓이) $=${tx(M.S)}+${tx(M.lat)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>돌리기</b> 막대를 끌거나 ▶를 눌러 보세요. ${span('amber', '노란 삼각형')}이 점선 <b>축</b>을 중심으로 제자리에서 돌아 원뿔이 돼요. 위 칩에서 <b>축으로 하는 변</b>을 바꾸면 반지름과 높이가 서로 바뀌어요.`,
        readouts: [rd('반지름 r', M.r + ' cm', 'amber', '축이 아닌 직각변'), rd('높이 h', M.h + ' cm', 'amber', '축으로 한 변'), rd('모선 R', M.R + ' cm', 'sky', '빗변'), rd('겉넓이 πr(r+R)', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted'), rd('부피 ⅓πr²h', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted')],
        formula: `<p>(겉넓이) $=\\pi r^2+\\pi Rr$ &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\pi r^2h$</p>`,
        rule: '직각삼각형을 한 직각변을 축으로 돌리면 원뿔: 축 = 높이, 다른 직각변 = 반지름, 빗변 = 모선',
        notes: notes('<b>축으로 삼는 변이 높이</b>예요. 축을 바꾸면 $r$와 $h$가 서로 바뀌어 겉넓이·부피가 달라져요.', '모선은 항상 <b>빗변</b>이에요.')
      }),
      prob: (M) => {
        let wrongs, stem;
        const which = `변 ${M.h === M.legA ? '(길이 ' + M.legA + ')' : '(길이 ' + M.legB + ')'}`;
        if (M.mode === 'vol') {
          const other = V(0, (M.h * M.h * M.r) / 3);
          wrongs = [[other, '축으로 삼은 변이 높이예요. 반지름과 높이를 서로 바꿨어요.'], [vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (M.r * M.r * M.R) / 3), '부피에는 높이 $h$를 써요. 빗변을 썼어요.'], [M.tot, '겉넓이를 구했어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.']];
          stem = `그림과 같이 ${bg(M)}을 ${which}을 축으로 한 바퀴 돌려 만든 입체의 부피는?`;
        } else {
          wrongs = [[vadd(V(0, M.h * M.h), V(0, M.h * M.R)), '축으로 삼은 변이 높이예요. 반지름과 높이를 서로 바꿔 계산했어요.'], [M.lat, '옆넓이만 구했어요. 밑넓이도 더해야 해요.'], [vadd(M.S, V(0, M.r * M.h)), '옆넓이에는 모선(빗변)을 써요. 높이를 썼어요.'], [vmul(M.vol, 1), '부피를 구했어요.'], [vadd(vmul(M.S, 2), M.lat), '밑면은 1개예요.']];
          stem = `그림과 같이 ${bg(M)}을 ${which}을 축으로 한 바퀴 돌려 만든 입체의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '회전체의 부피 (함정: 축)' : '회전체의 겉넓이 (함정: 축)', key: `${M.mode}|${M.key}|${M.k}|${M.axis}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }
  const TRI_ORDER = ['A', 'B', 'C'];

  /* ================================================================ sv4-2 직각사다리꼴 회전 */
  function sv42() {
    const model = (s) => {
      const axis = s.svAxis2 === 'base' ? 'base' : 'leg', mode = s.svMode === 'vol' ? 'vol' : 'surf';
      if (axis === 'leg') {
        const j = clamp(Math.round(s.s42J), 1, 3), k = clamp(Math.round(s.s42K), 1, 2), K = j + k, r1 = 3 * j, r2 = 3 * K, h = 4 * k, R2 = 5 * K, R1 = 5 * j, h2 = 4 * K, h1 = 4 * j;
        const lat2 = V(0, r2 * R2), lat1 = V(0, r1 * R1), latF = vsub(lat2, lat1), top = V(0, r1 * r1), bot = V(0, r2 * r2), surf = vadd(latF, vadd(top, bot)), v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
        return { axis, mode, j, k, K, r1, r2, h, R1, R2, h1, h2, lat2, lat1, latF, top, bot, surf, v2, v1, vol, ans: mode === 'vol' ? vol : surf };
      }
      const a = clamp(Math.round(s.s42A), 1, 6), k = clamp(Math.round(s.s42K), 1, 2), hh = 4 * k, p = 3 * k, c = 5 * k, b = a + p; // 높이(반지름) hh, 원기둥 길이 a, 원뿔 높이 p, 모선 c
      const base = V(0, hh * hh), cylLat = V(0, 2 * hh * a), coneLat = V(0, hh * c), surf = vadd(base, vadd(cylLat, coneLat)), vcyl = V(0, hh * hh * a), vcone = V(0, (hh * hh * p) / 3), vol = vadd(vcyl, vcone);
      return { axis, mode, a, k, hh, p, c, b, base, cylLat, coneLat, surf, vcyl, vcone, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const D = scene3(b, s, C), st = C.step, th = C.problem ? 0.25 : C.t;
      if (M.axis === 'leg') {
        const sc = 4.4 / Math.max(M.h2, 2 * M.r2), r1 = M.r1 * sc, r2 = M.r2 * sc, h = M.h * sc, h2 = M.h2 * sc, h1 = M.h1 * sc, y0 = -h2 / 2;
        const prof = [[0, y0], [r2, y0], [r1, y0 + h], [0, y0 + h]], poly = prof;
        D.fit(cube8(v3(0, 0, 0), Math.max(r2, h2 / 2)), [], { l: 50, r: 50, t: 40, b: 40 });
        axisLine(D, y0 - 0.5, y0 + h + 1.4);
        // 큰 뿔 − 작은 뿔 윤곽(보조선)
        D.line(v3(r2 * Math.cos(A0), y0, r2 * Math.sin(A0)), v3(0, y0 + h2, 0), 'muted', 1.8, { dash: [5, 4], alpha: 0.55 });
        sweepDraw(D, prof, poly, th, { faceStyle: (f) => (C.review && st === 4 && M.mode === 'surf' && (f.tag === 'seg0' || f.tag === 'seg2') ? { fill: 'amber', alpha: 0.4 } : C.review && st === 3 && f.tag === 'seg1' ? { fill: 'amber', alpha: 0.3 } : {}) });
        const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pb2 = pa(r2, y0), pc = pa(r1, y0 + h), pd = pa(0, y0 + h);
        D.right(o, sub3(pb2, o), sub3(pd, o), 0.26, 'amber');
        D.right(pd, sub3(pc, pd), sub3(o, pd), 0.26, 'amber');
        D.elabel(o, pb2, `${M.r2}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 7 });
        D.elabel(pd, pc, `${M.r1}`, { side: { x: 0, y: -1 }, size: 15, color: 'amber', gap: 7 });
        D.elabel(o, pd, `${M.h}`, { side: { x: -1, y: 0 }, size: 15, color: 'amber', gap: 8 });
        D.elabel(pb2, pc, `${5 * M.k}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
        D.label(o, '축', { dir: { x: -1, y: 0.4 }, size: 13, color: 'muted', gap: 4 });
        if (!C.problem && th > 0.99) D.tag(v3(0, y0 + h * 0.5, 0), '원뿔대', { size: 15, color: 'green', dy: 8 });
      } else {
        // 아랫변(긴 변)을 축으로: 반지름 hh 인 원기둥(길이 a) + 원뿔(높이 p)
        const sc = 4.6 / Math.max(M.b, 2 * M.hh), hh = M.hh * sc, a = M.a * sc, bb = M.b * sc, y0 = -bb / 2;
        const prof = [[0, y0], [hh, y0], [hh, y0 + a], [0, y0 + bb]], poly = prof;
        D.fit(cube8(v3(0, 0, 0), Math.max(hh, bb / 2)), [], { l: 50, r: 50, t: 40, b: 40 });
        axisLine(D, y0 - 0.5, y0 + bb + 0.5);
        sweepDraw(D, prof, poly, th, { faceStyle: (f) => (C.review && st === 1 && M.mode === 'surf' && f.tag === 'seg0' ? { fill: 'amber', alpha: 0.4 } : C.review && st === 2 && f.tag === 'seg1' ? { fill: 'amber', alpha: 0.34 } : C.review && st === 3 && f.tag === 'seg2' ? { fill: 'amber', alpha: 0.34 } : {}) });
        const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pd = pa(hh, y0), pc = pa(hh, y0 + a), pbb = pa(0, y0 + bb);
        D.right(o, sub3(pd, o), sub3(pbb, o), 0.26, 'amber');
        D.right(pd, sub3(pc, pd), sub3(o, pd), 0.26, 'amber');
        D.elabel(o, pd, `${M.hh}`, { side: { x: 0, y: 1 }, size: 15, color: 'amber', gap: 7 });
        D.elabel(pd, pc, `${M.a}`, { side: { x: 1, y: 0 }, size: 15, color: 'amber', gap: 8 });
        D.elabel(pc, pbb, `${M.c}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
        D.elabel(pa(0, y0 + a), pbb, `${M.p}`, { side: { x: -1, y: 0 }, size: 14, color: 'ink', gap: 8 });
        D.label(o, '축', { dir: { x: -1, y: 0.4 }, size: 13, color: 'muted', gap: 4 });
        D.line(pa(0, y0 + a), pc, 'muted', 1.8, { dash: [5, 4] });
        if (!C.problem && th > 0.99) D.tag(v3(0, y0 + a / 2, 0), '원기둥', { size: 14, color: 'green', dy: 6 });
      }
    };
    const lab = (M) => (M.axis === 'leg' ? `아랫변 $${M.r2}\\,\\mathrm{cm}$, 윗변 $${M.r1}\\,\\mathrm{cm}$, 높이(축) $${M.h}\\,\\mathrm{cm}$, 빗변 $${5 * M.k}\\,\\mathrm{cm}$인 직각사다리꼴을 높이가 되는 변을 축으로` : `긴 밑변 $${M.b}\\,\\mathrm{cm}$, 짧은 밑변 $${M.a}\\,\\mathrm{cm}$, 높이 $${M.hh}\\,\\mathrm{cm}$, 빗변 $${M.c}\\,\\mathrm{cm}$인 직각사다리꼴을 긴 밑변을 축으로`);
    return {
      id: 'sv4-2', title: '직각사다리꼴 회전', short: '사다리꼴 회전',
      question: '직각사다리꼴을 돌리면 어떤 입체가 될까? 높이가 되는 변을 축으로 할 때와 긴 밑변을 축으로 할 때 어떻게 다를까?',
      anim: { key: 's42T', dur: 5, label: '한 바퀴 돌리기' }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 1,
      ctl: (s) => (s.svAxis2 === 'base' ? ['s42A', 's42K', 's42T'] : ['s42J', 's42K', 's42T']),
      presets: () => [{ group: '축으로 하는 변', label: '높이가 되는 변 (원뿔대)', apply: (st) => { st.svAxis2 = 'leg'; }, on: (st) => st.svAxis2 !== 'base' }, { label: '긴 밑변 (원기둥+원뿔)', apply: (st) => { st.svAxis2 = 'base'; }, on: (st) => st.svAxis2 === 'base' }, { group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }],
      init: (s) => { s.svAxis2 = 'leg'; s.svMode = 'surf'; s.s42J = 1; s.s42K = 1; s.s42A = 3; s.s42T = 0.3; },
      reroll: (s) => { s.svAxis2 = pick(['leg', 'base'], s.svAxis2); s.svMode = pick(['surf', 'vol'], s.svMode); s.s42J = rint(1, 3); s.s42K = rint(1, 2); s.s42A = rint(1, 6); s.s42T = 0.3; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        if (M.axis === 'leg') {
          const slope = (M.r2 - M.r1) / M.h;
          if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.h, rr = M.r2 - slope * y; sum += PI * rr * rr * (M.h / n); } return { ans: sum, model: vnum(M.vol) }; }
          let lat = 0; for (let i = 0; i < n; i++) { const y0 = (i / n) * M.h, y1 = ((i + 1) / n) * M.h, r0 = M.r2 - slope * y0, r1 = M.r2 - slope * y1; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
          return { ans: lat + PI * M.r1 * M.r1 + PI * M.r2 * M.r2, model: vnum(M.surf) };
        }
        if (M.mode === 'vol') { let sum = 0; for (let i = 0; i < n; i++) { const y = ((i + 0.5) / n) * M.b, rr = y < M.a ? M.hh : (M.hh * (M.b - y)) / M.p; sum += PI * rr * rr * (M.b / n); } return { ans: sum, model: vnum(M.vol) }; }
        let lat = 2 * PI * M.hh * M.a; for (let i = 0; i < n; i++) { const y0 = M.a + (i / n) * M.p, y1 = M.a + ((i + 1) / n) * M.p, r0 = (M.hh * (M.b - y0)) / M.p, r1 = (M.hh * (M.b - y1)) / M.p; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); }
        return { ans: lat + PI * M.hh * M.hh, model: vnum(M.surf) };
      },
      steps: (M) => {
        if (M.axis === 'leg') {
          return M.mode === 'vol' ? [
            `높이가 되는 변을 축으로 돌리면 <b>원뿔대</b>예요. 큰 원뿔(반지름 $${M.r2}$, 높이 $${M.h2}$)에서 작은 원뿔(반지름 $${M.r1}$, 높이 $${M.h1}$)을 빼요.`,
            `$V_2=\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${M.h2}=${tx(M.v2)}$, $V_1=\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${M.h1}=${tx(M.v1)}$예요.`,
            `(부피) $=V_2-V_1=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
          ] : [
            `높이가 되는 변을 축으로 돌리면 <b>원뿔대</b>예요. 큰 원뿔의 모선은 $${M.R2}$, 작은 원뿔의 모선은 $${M.R1}$이에요.`,
            `옆넓이 $=\\pi\\times${M.R2}\\times${M.r2}-\\pi\\times${M.R1}\\times${M.r1}=${tx(M.lat2)}-${tx(M.lat1)}=${tx(M.latF)}$예요.`,
            `위·아래 밑면 $\\pi\\times${M.r1}^2+\\pi\\times${M.r2}^2=${tx(vadd(M.top, M.bot))}$를 더해요.`,
            `(겉넓이) $=${tx(M.latF)}+${tx(vadd(M.top, M.bot))}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
          ];
        }
        return M.mode === 'vol' ? [
          `긴 밑변을 축으로 돌리면 반지름 $${M.hh}$인 <b>원기둥</b>(길이 $${M.a}$)에 <b>원뿔</b>(높이 $${M.p}$)이 붙은 입체예요.`,
          `원기둥 $\\pi\\times${M.hh}^2\\times${M.a}=${tx(M.vcyl)}$, 원뿔 $\\frac{1}{3}\\times\\pi\\times${M.hh}^2\\times${M.p}=${tx(M.vcone)}$예요.`,
          `(부피) $=${tx(M.vcyl)}+${tx(M.vcone)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
        ] : [
          `긴 밑변을 축으로 돌리면 반지름 $${M.hh}$인 원기둥(길이 $${M.a}$)에 원뿔(모선 $${M.c}$)이 붙은 입체예요. 붙은 면은 겉에 드러나지 않아요.`,
          `원기둥의 한쪽 밑면 $\\pi\\times${M.hh}^2=${tx(M.base)}$ 와 원기둥의 옆면 $2\\pi\\times${M.hh}\\times${M.a}=${tx(M.cylLat)}$예요.`,
          `원뿔의 옆넓이 $\\pi\\times${M.c}\\times${M.hh}=${tx(M.coneLat)}$예요.`,
          `(겉넓이) $=${tx(M.base)}+${tx(M.cylLat)}+${tx(M.coneLat)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
        ];
      },
      view: (M) => ({
        guide: `위 칩에서 <b>축으로 하는 변</b>과 <b>구하는 것</b>을 골라 보세요. <b>돌리기</b>를 끌면 ${span('amber', '사다리꼴')}이 축 둘레를 제자리에서 돌아요. 축이 바뀌면 전혀 다른 입체가 만들어져요.`,
        readouts: M.axis === 'leg'
          ? (M.mode === 'vol' ? [rd('큰 원뿔 V₂', plainVal(M.v2) + ' cm³', 'sky'), rd('작은 원뿔 V₁', plainVal(M.v1) + ' cm³', 'violet'), rd('원뿔대의 부피', plainVal(M.vol) + ' cm³', 'green')] : [rd('옆넓이(큰−작은)', plainVal(M.latF) + ' cm²', 'amber'), rd('두 밑면', plainVal(vadd(M.top, M.bot)) + ' cm²', 'sky'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')])
          : (M.mode === 'vol' ? [rd('원기둥', plainVal(M.vcyl) + ' cm³', 'sky'), rd('원뿔', plainVal(M.vcone) + ' cm³', 'violet'), rd('부피', plainVal(M.vol) + ' cm³', 'green')] : [rd('원기둥의 밑면 1개', plainVal(M.base) + ' cm²', 'sky'), rd('원기둥의 옆면', plainVal(M.cylLat) + ' cm²', 'sky'), rd('원뿔의 옆면', plainVal(M.coneLat) + ' cm²', 'violet'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')]),
        formula: M.axis === 'leg' ? `<p>(원뿔대) $=$ (큰 원뿔) $-$ (작은 원뿔) &nbsp;·&nbsp; (겉넓이) $=$ (옆넓이의 차) $+$ (두 밑면)</p>` : `<p>(겉넓이) $=$ (원기둥의 밑면 1개) $+$ (원기둥의 옆면) $+$ (원뿔의 옆면) &nbsp;·&nbsp; (부피) $=$ (원기둥) $+$ (원뿔)</p>`,
        rule: '회전체를 이루는 입체로 나눈 뒤, 서로 붙은 면은 빼고 더해요',
        notes: notes('축이 되는 변을 먼저 읽어요. 같은 사다리꼴이라도 <b>축이 다르면 다른 입체</b>예요.', '원기둥과 원뿔이 붙은 면(원)은 겉넓이에서 <b>빠져요</b>.')
      }),
      prob: (M) => {
        let wrongs, stem;
        if (M.axis === 'leg') {
          if (M.mode === 'vol') { wrongs = [[vadd(M.v2, M.v1), '작은 원뿔은 더하지 않고 빼요.'], [M.v2, '큰 원뿔의 부피예요.'], [V(0, M.r2 * M.r2 * M.h2 - M.r1 * M.r1 * M.h1), '$\\frac{1}{3}$을 곱하지 않았어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.'], [V(0, (M.r2 * M.r2 * M.h) / 3), '높이가 $h$ 하나가 아니라 큰·작은 원뿔의 높이를 써서 빼야 해요.']]; }
          else { wrongs = [[vadd(M.latF, M.bot), '윗면(작은 원)을 빠뜨렸어요.'], [M.latF, '옆넓이만 구했어요. 두 밑면도 더해야 해요.'], [vadd(M.lat2, vadd(M.top, M.bot)), '큰 원뿔의 옆넓이를 그대로 썼어요.'], [vadd(vsub(M.lat2, M.lat1), vsub(M.bot, M.top)), '밑면은 빼지 않고 더해요.'], [vadd(vadd(M.lat2, M.lat1), vadd(M.top, M.bot)), '작은 원뿔의 옆넓이는 더하지 않고 빼요.']]; }
        } else if (M.mode === 'vol') wrongs = [[vadd(M.vcyl, vmul(M.vcone, 3)), '원뿔의 부피에는 $\\frac{1}{3}$을 곱해요.'], [M.vcyl, '원뿔 부분을 빠뜨렸어요.'], [vmul(M.vol, 1 / 2), '두 부분을 모두 더해야 해요.'], [V(0, M.hh * M.hh * M.b), '전체를 원기둥으로 계산했어요.'], [vadd(M.vcyl, V(0, (M.hh * M.hh * M.c) / 3)), '원뿔의 높이는 모선이 아니라 $' + M.p + '$이에요.']];
        else wrongs = [[vadd(vadd(vmul(M.base, 2), M.cylLat), M.coneLat), '원뿔과 붙은 쪽 밑면은 겉에 드러나지 않아요. 밑면은 1개만 더해요.'], [vadd(M.cylLat, M.coneLat), '원기둥의 바깥쪽 밑면(1개)을 빠뜨렸어요.'], [vadd(M.base, M.cylLat), '원뿔의 옆면을 빠뜨렸어요.'], [vadd(vadd(M.base, M.cylLat), V(0, M.hh * M.p)), '원뿔의 옆넓이에는 모선(빗변)을 써요. 높이를 썼어요.'], [vadd(vadd(M.base, V(0, 2 * M.hh * M.b)), M.coneLat), '원기둥의 길이는 $' + M.a + '$이에요.']];
        stem = `그림과 같이 ${lab(M)} 한 바퀴 돌려 만든 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`;
        return { tag: M.mode === 'vol' ? '회전체의 부피 (사다리꼴)' : '회전체의 겉넓이 (사다리꼴·함정: 붙은 면)', key: `${M.axis}|${M.mode}|${M.j}|${M.k}|${M.a}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv4-3 이중원뿔 */
  const DBL = { D: { r: 3, a: [4, 5], b: [4, 5], label: '마름모 3·4·5' }, A: { r: 12, a: [5, 13], b: [9, 15], label: '5·13, 9·15' }, B: { r: 12, a: [5, 13], b: [16, 20], label: '5·13, 16·20' }, C: { r: 15, a: [8, 17], b: [20, 25], label: '8·17, 20·25' } };
  function sv43() {
    const model = (s) => {
      const key = oneOf(s.svDbl, ['A', 'B', 'C', 'D'], 'D'), d = DBL[key], r = d.r, h1 = d.a[0], R1 = d.a[1], h2 = d.b[0], R2 = d.b[1], mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const lat1 = V(0, r * R1), lat2 = V(0, r * R2), surf = vadd(lat1, lat2), v1 = V(0, (r * r * h1) / 3), v2 = V(0, (r * r * h2) / 3), vol = vadd(v1, v2), disc = V(0, r * r);
      return { key, r, h1, R1, h2, R2, mode, lat1, lat2, surf, v1, v2, vol, disc, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const sc = 4.6 / Math.max(M.h1 + M.h2, 2.2 * M.r), r = M.r * sc, h1 = M.h1 * sc, h2 = M.h2 * sc, D = scene3(b, s, C), st = C.step;
      const t = C.problem ? 0.45 : C.t, rotT = clamp(t / 0.5, 0, 1), sep = ease(lin01(t, 0.5, 0.8)) * (r * 2.6), flip = ease(lin01(t, 0.8, 1));
      const yy0 = -(h1 + h2) / 2, yMid = yy0 + h1;
      const low = revolveMesh([[0, yy0], [r, yMid], [0, yMid]], { N: 44, tags: ['side', 'disc'] }), upm = revolveMesh([[0, yMid], [r, yMid], [0, yMid + h2]], { N: 44, tags: ['disc', 'side'] });
      // 아래 원뿔은 제자리에서 뒤집어(회전) 밑면이 아래로, 위 원뿔은 오른쪽으로만 옮겨요
      const Tl = G.rotAbout(v3(0, (yy0 + yy0 + h1) / 2, 0), v3(0, 0, 1), PI * flip), lp = (p) => G.applyT(Tl, p);
      const lowM = xfMesh(low, Tl), upM = xfMesh(upm, shiftT(D.hx(sep)));
      D.fit(cube8(v3(0, yy0 + h1 / 2, 0), Math.max(r, (h1 + h2) / 2)).concat(cube8(add3(D.hx(r * 2.6), v3(0, yy0 + h1 + h2 / 2 - (yy0 + h1 / 2), 0)), Math.max(r, (h1 + h2) / 2))), [], { l: 40, r: 40, t: 36, b: 40 });
      const poly = [[0, yy0], [r, yMid], [0, yMid + h2]];
      if (sep < 0.01 && flip < 0.01) axisLine(D, yy0 - 0.5, yMid + h2 + 0.6);
      const faceS = (hot) => (f) => (f.tag === 'disc' ? { fill: 'red', alpha: sep > 0.2 ? 0.5 : 0.001 } : C.review && hot && f.tag === 'side' ? { fill: 'amber', alpha: 0.36 } : {});
      if (rotT < 0.995) sweepDraw(D, [[0, yy0], [r, yMid], [0, yMid + h2]], poly, rotT, {});
      else { D.body({ mesh: lowM, fill: 'sky', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: faceS(C.review && st === 2) }); D.body({ mesh: upM, fill: 'violet', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: faceS(C.review && st === 2) }); }
      const pa = (rr, yy, off) => add3(v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), off || v3(0, 0, 0));
      if (rotT >= 0.995) {
        const ou = D.hx(sep);
        D.elabel(lp(pa(0, yy0)), lp(pa(r, yMid)), `${M.R1}`, { side: { x: -1, y: 0 }, size: 15, gap: 8 });
        D.elabel(pa(0, yMid + h2, ou), pa(r, yMid, ou), `${M.R2}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
        D.line(lp(pa(0, yMid)), lp(pa(r, yMid)), 'ink', 2.4);
        D.line(pa(0, yMid, ou), pa(r, yMid, ou), 'ink', 2.4);
        D.tag(lp(pa(r * 0.8, yMid)), `r=${M.r}`, { dy: 15, size: 14, color: 'amber' });
        D.tag(pa(r * 0.8, yMid, ou), `r=${M.r}`, { dy: 15, size: 14, color: 'amber' });
        if (sep > 0.2 && !C.problem) { D.tag(v3(0, yMid, 0), '붙은 면(제외)', { dy: 34, size: 13, color: 'red' }); }
        if (!C.problem) { D.tag(lp(v3(0, yy0 + h1 * 0.4, 0)), `πRr=${plainVal(M.lat1)}`, { size: 14, dx: 4 }); D.tag(add3(v3(0, yMid + h2 * 0.4, 0), ou), `πRr=${plainVal(M.lat2)}`, { size: 14, dx: 4 }); }
      } else {
        const o = pa(0, yMid), pr = pa(r, yMid);
        D.line(o, pr, 'amber', 2.6); D.dot(o, 'ink', 3.5);
        D.tag(mid3(o, pr), `r=${M.r}`, { dy: -12, size: 14, color: 'amber' });
        D.elabel(pa(0, yy0), pr, `${M.R1}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
        D.elabel(pr, pa(0, yMid + h2), `${M.R2}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
        D.label(pa(0, yy0), '축', { dir: { x: -1, y: 0.3 }, size: 13, color: 'muted', gap: 6 });
        D.elabel(pa(0, yy0), o, `${M.h1}`, { side: { x: -1, y: 0 }, size: 14, color: 'amber', gap: 7 });
        D.elabel(o, pa(0, yMid + h2), `${M.h2}`, { side: { x: -1, y: 0 }, size: 14, color: 'amber', gap: 7 });
      }
    };
    return {
      id: 'sv4-3', title: '이중원뿔', short: '이중원뿔',
      question: '삼각형을 한 변(밑변)을 축으로 돌리면 원뿔 두 개가 맞붙은 입체가 돼. 이 입체의 겉넓이에서 맞붙은 면은 어떻게 될까?',
      anim: { key: 's43T', dur: 8, label: '돌리고 분해하기' }, cam0: { yaw: 28, pitch: 14 }, stepT: (n) => [0, 0.5, 1, 1, 1][Math.min(n, 4)], thumbT: 1, problemT: 0.45,
      ctl: () => ['s43T'],
      presets: () => Object.keys(DBL).map((k, i) => ({ group: i === 0 ? '삼각형' : '', label: DBL[k].label, apply: (st) => { st.svDbl = k; }, on: (st) => oneOf(st.svDbl, ['A', 'B', 'C', 'D'], 'D') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svDbl = 'D'; s.svMode = 'surf'; s.s43T = 0.2; },
      reroll: (s) => { s.svDbl = pick(Object.keys(DBL), s.svDbl); s.svMode = pick(['surf', 'vol'], s.svMode); s.s43T = 0.2; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000;
        const cone = (r, h, R) => { let lat = 0, v = 0; for (let i = 0; i < n; i++) { const y0 = (i / n) * h, y1 = ((i + 1) / n) * h, r0 = (r * (h - y0)) / h, r1 = (r * (h - y1)) / h; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); v += PI * ((r0 + r1) / 2) ** 2 * (h / n); } return { lat, v }; };
        const c1 = cone(M.r, M.h1, M.R1), c2 = cone(M.r, M.h2, M.R2);
        if (Math.abs(Math.hypot(M.r, M.h1) - M.R1) > 1e-9 || Math.abs(Math.hypot(M.r, M.h2) - M.R2) > 1e-9) return { ans: -1, model: 0 };
        return { ans: M.mode === 'vol' ? c1.v + c2.v : c1.lat + c2.lat, model: vnum(M.ans) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `삼각형을 밑변을 축으로 돌리면 밑면이 같은 두 원뿔(반지름 $${M.r}$, 높이 $${M.h1}$와 $${M.h2}$)이 맞붙어요.`,
        `$V_1=\\frac{1}{3}\\times\\pi\\times${M.r}^2\\times${M.h1}=${tx(M.v1)}$, $V_2=\\frac{1}{3}\\times\\pi\\times${M.r}^2\\times${M.h2}=${tx(M.v2)}$예요.`,
        `(부피) $=${tx(M.v1)}+${tx(M.v2)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요. (두 원뿔의 높이의 합 $${M.h1 + M.h2}$)`
      ] : [
        `삼각형을 밑변을 축으로 돌리면 두 원뿔이 맞붙어요. 맞붙은 면(반지름 $${M.r}$인 원)은 겉에 드러나지 않아서 <b>빼요</b>.`,
        `두 원뿔의 옆넓이 $\\pi\\times${M.R1}\\times${M.r}=${tx(M.lat1)}$, $\\pi\\times${M.R2}\\times${M.r}=${tx(M.lat2)}$예요.`,
        `(겉넓이) $=${tx(M.lat1)}+${tx(M.lat2)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요. (밑넓이는 더하지 않아요.)`
      ],
      view: (M) => ({
        guide: `<b>돌리고 분해하기</b> 막대를 끌어 보세요. 앞쪽 절반은 삼각형이 축 둘레를 <b>제자리에서 돌고</b>, 뒤쪽 절반은 위 원뿔이 <b>오른쪽으로</b> 옮겨 가며 ${span('red', '맞붙은 면')}을 드러내요. 마지막에 아래 원뿔이 제자리에서 뒤집혀 밑면이 아래로 와요. 위 칩에서 삼각형을 바꿔 보세요.`,
        readouts: M.mode === 'vol' ? [rd('아래 원뿔 V₁', plainVal(M.v1) + ' cm³', 'sky'), rd('위 원뿔 V₂', plainVal(M.v2) + ' cm³', 'violet'), rd('부피', plainVal(M.vol) + ' cm³', 'green')] : [rd('아래 원뿔의 옆넓이', plainVal(M.lat1) + ' cm²', 'sky', `π×${M.R1}×${M.r}`), rd('위 원뿔의 옆넓이', plainVal(M.lat2) + ' cm²', 'violet', `π×${M.R2}×${M.r}`), rd('맞붙은 면(제외)', plainVal(M.disc) + ' cm²', 'red'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')],
        formula: `<p>(겉넓이) $=\\pi Rr+\\pi R'r$ (맞붙은 면은 제외) &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\pi r^2(h+h')$</p>`,
        rule: '이중원뿔의 겉넓이 = 두 원뿔의 옆넓이의 합 (맞붙은 밑면은 빼요)',
        notes: notes('<b>함정</b>: 두 원뿔의 밑넓이를 더하지 않아요. 맞붙은 면은 입체의 속이에요.', '부피는 두 원뿔을 따로 구해 더하거나, 밑넓이 $\\times$ (두 높이의 합) $\\times\\frac{1}{3}$로 한 번에 구해요.')
      }),
      prob: (M) => {
        let wrongs;
        const tri = `밑변(축) 위의 한 점에서 수선을 내려 밑변이 $${M.h1}\\,\\mathrm{cm}$와 $${M.h2}\\,\\mathrm{cm}$로 나뉘고, 수선의 길이가 $${M.r}\\,\\mathrm{cm}$, 나머지 두 변이 $${M.R1}\\,\\mathrm{cm}$, $${M.R2}\\,\\mathrm{cm}$인 삼각형`;
        if (M.mode === 'vol') wrongs = [[vadd(M.vol, vmul(M.disc, 1)), '부피에 밑넓이를 더하지 않아요.'], [vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (M.r * M.r * M.R1) / 3 + (M.r * M.r * M.R2) / 3), '높이가 아니라 모선(변의 길이)을 썼어요.'], [M.surf, '겉넓이를 구했어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.']];
        else wrongs = [[vadd(M.surf, vmul(M.disc, 2)), '맞붙은 면은 겉에 드러나지 않아요. 밑넓이를 더하지 않아요.'], [vadd(M.surf, M.disc), '맞붙은 면은 겉에 드러나지 않아요.'], [M.lat1, '한쪽 원뿔의 옆넓이만 구했어요. 두 원뿔 모두 더해야 해요.'], [V(0, M.r * (M.h1 + M.h2)), '모선이 아니라 높이를 썼어요.'], [vmul(M.vol, 1), '부피를 구했어요.']];
        return { tag: M.mode === 'vol' ? '이중원뿔의 부피' : '이중원뿔의 겉넓이 (함정: 붙은 면)', key: `${M.mode}|${M.key}`, stem: `그림과 같이 ${tri}을 밑변을 축으로 한 바퀴 돌려 만든 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ sv4-4 복합 (원뿔 + 원기둥 + 반구) */
  const TRI4 = { A: [3, 4, 5], B: [4, 3, 5], C: [6, 8, 10], D: [5, 12, 13] }; // [r, 원뿔의 높이, 모선]
  function sv44() {
    const model = (s) => {
      const key = oneOf(s.svTri4, ['A', 'B', 'C', 'D'], 'A'), [r, hc, R] = TRI4[key], H = clamp(Math.round(s.s44H), 1, 8), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const hemi = V(0, 2 * r * r), cylLat = V(0, 2 * r * H), coneLat = V(0, r * R), surf = vadd(hemi, vadd(cylLat, coneLat));
      const vh = V(0, (2 * r * r * r) / 3), vc = V(0, r * r * H), vk = V(0, (r * r * hc) / 3), vol = vadd(vh, vadd(vc, vk));
      return { key, r, hc, R, H, mode, hemi, cylLat, coneLat, surf, vh, vc, vk, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const sc = 5.4 / (M.r + M.H + M.hc), r = M.r * sc, H = M.H * sc, hc = M.hc * sc, D = scene3(b, s, C), st = C.step;
      const t = C.problem ? 0 : C.t, sep = ease(lin01(t, 0, 0.5)) * (r * 2.4), flipE = ease(lin01(t, 0.5, 1)), yB = -(r + H + hc) / 2;
      // 반구(아래, 곡면은 아래쪽): 프로필 = 극에서 적도까지, 맨 위는 평평한 원
      const hp = [], hn = 36;
      for (let i = 0; i <= hn; i++) { const a = (PI / 2) * (1 - i / hn); hp.push([Math.max(0, r * Math.cos(a)), yB + r - r * Math.sin(a)]); }
      hp[0][0] = 0; hp.push([0, yB + r]);
      const yH = yB + r, yC = yH + H;
      const hemi = revolveMesh(hp, { N: 36, tags: Array(hn).fill('curve').concat('flat') });
      const cyl = revolveMesh([[0, yH], [r, yH], [r, yC], [0, yC]], { N: 36, tags: ['flat', 'side', 'flat'] });
      const cone = revolveMesh([[0, yC], [r, yC], [0, yC + hc]], { N: 36, tags: ['flat', 'side'] });
      const dx = sep;
      // 반구는 제자리에서 뒤집어 밑면이 아래로, 원기둥과 원뿔은 오른쪽으로만 옮겨요
      const Th = G.rotAbout(v3(0, yB + r / 2, 0), v3(0, 0, 1), PI * flipE), lp = (p) => G.applyT(Th, p);
      const parts = [{ m: xfMesh(hemi, Th), col: 'sky', k: 'h' }, { m: xfMesh(cyl, shiftT(D.hx(dx))), col: 'green', k: 'c' }, { m: xfMesh(cone, shiftT(D.hx(2 * dx))), col: 'violet', k: 'k' }];
      D.fit([].concat(cube8(v3(0, yB + r / 2, 0), r), cube8(add3(D.hx(dx), v3(0, (yH + yC) / 2, 0)), Math.max(r, H / 2)), cube8(add3(D.hx(2 * dx), v3(0, yC + hc / 2, 0)), Math.max(r, hc / 2))), [], { l: 44, r: 44, t: 40, b: 40 });
      const lvK = !C.review ? 1 : st === 1 ? 2 : 1, lvC = !C.review ? 1 : st === 2 ? 2 : 1, lvH = !C.review ? 1 : st === 3 ? 2 : 1;
      const lv = { k: lvK, c: lvC, h: lvH };
      parts.forEach((p) => D.body({ mesh: p.m, fill: lv[p.k] === 2 ? 'amber' : p.col, alpha: lv[p.k] === 2 ? 0.38 : 0.26, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.tag === 'flat' && dx > r * 0.5 ? { fill: 'red', alpha: 0.4 } : f.tag === 'flat' ? { fill: p.col, alpha: 0.12 } : {}) }));
      const pa = (rr, yy, off) => add3(v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), D.hx(off));
      D.elabel(pa(r, yC, 2 * dx), pa(0, yC + hc, 2 * dx), `${M.R}`, { side: { x: 1, y: 0 }, size: 15, gap: 8 });
      D.elabel(pa(0, yC, 2 * dx), pa(0, yC + hc, 2 * dx), `${M.hc}`, { side: { x: -1, y: 0 }, size: 14, color: 'muted', gap: 8 });
      D.elabel(pa(r, yH, dx), pa(r, yC, dx), `${M.H}`, { side: { x: 1, y: 0 }, size: 15, color: 'amber', gap: 8 });
      D.line(lp(pa(0, yH, 0)), lp(pa(r, yH, 0)), 'ink', 2.4); D.dot(lp(pa(0, yH, 0)), 'ink', 3.5);
      D.tag(lp(pa(r / 2, yH, 0)), `r=${M.r}`, { dy: flipE > 0.5 ? -12 : 14, size: 14, color: 'amber' });
      if (!C.problem && dx > r * 0.5) {
        D.tag(lp(pa(0, yB + r * 0.5, 0)), `2πr²=${plainVal(M.hemi)}`, { size: 14, dy: flipE > 0.5 ? 28 : 22 });
        D.tag(pa(0, (yH + yC) / 2, dx), `2πrH=${plainVal(M.cylLat)}`, { size: 14 });
        D.tag(pa(0, yC + hc * 0.12, 2 * dx), `πRr=${plainVal(M.coneLat)}`, { size: 13, dy: 12 });
      }
    };
    return {
      id: 'sv4-4', title: '복합 입체', short: '복합 입체',
      question: '원뿔·원기둥·반구를 이어 붙인 입체의 겉넓이는 어떻게 구할까? 맞붙은 면은 어떻게 될까?',
      anim: { key: 's44T', dur: 5, label: '분해하기' }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s44H', 's44T'],
      presets: () => Object.keys(TRI4).map((k, i) => ({ group: i === 0 ? '원뿔의 (r, 높이, 모선)' : '', label: TRI4[k].join('·'), apply: (st) => { st.svTri4 = k; }, on: (st) => oneOf(st.svTri4, ['A', 'B', 'C', 'D'], 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st) => { st.svMode = 'surf'; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st) => { st.svMode = 'vol'; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri4 = 'A'; s.svMode = 'surf'; s.s44H = 4; s.s44T = 0.6; },
      reroll: (s) => { s.svTri4 = pick(['A', 'B', 'C', 'D'], s.svTri4); s.svMode = pick(['surf', 'vol'], s.svMode); s.s44H = rint(1, 8); s.s44T = 0.6; },
      model, draw,
      check: (s) => {
        const M = model(s), n = 4000; let lat = 2 * PI * M.r * M.H, vol = PI * M.r * M.r * M.H;
        for (let i = 0; i < n; i++) { const y0 = (i / n) * M.hc, y1 = ((i + 1) / n) * M.hc, r0 = (M.r * (M.hc - y0)) / M.hc, r1 = (M.r * (M.hc - y1)) / M.hc; lat += PI * (r0 + r1) * Math.hypot(r1 - r0, y1 - y0); vol += PI * ((r0 + r1) / 2) ** 2 * (M.hc / n); }
        for (let i = 0; i < n; i++) { const a0 = (PI / 2) * (i / n), a1 = (PI / 2) * ((i + 1) / n); lat += PI * (M.r * Math.cos(a0) + M.r * Math.cos(a1)) * Math.hypot(M.r * (Math.sin(a1) - Math.sin(a0)), M.r * (Math.cos(a1) - Math.cos(a0))); const y = ((i + 0.5) / n) * M.r; vol += PI * (M.r * M.r - y * y) * (M.r / n); }
        if (Math.abs(Math.hypot(M.r, M.hc) - M.R) > 1e-9) return { ans: -1, model: 0 };
        return { ans: M.mode === 'vol' ? vol : lat, model: vnum(M.ans) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `원뿔(높이 $${M.hc}$), 원기둥(높이 $${M.H}$), 반구로 나누어요. 반지름은 모두 $${M.r}$예요.`,
        `원뿔 $\\frac{1}{3}\\pi\\times${M.r}^2\\times${M.hc}=${tx(M.vk)}$, 원기둥 $\\pi\\times${M.r}^2\\times${M.H}=${tx(M.vc)}$, 반구 $\\frac{1}{2}\\times\\frac{4}{3}\\pi\\times${M.r}^3=${tx(M.vh)}$예요.`,
        `(부피) $=${tx(M.vk)}+${tx(M.vc)}+${tx(M.vh)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `원뿔의 옆넓이 $\\pi Rr=\\pi\\times${M.R}\\times${M.r}=${tx(M.coneLat)}$예요. 원뿔의 밑면은 원기둥과 붙어서 빼요.`,
        `원기둥의 옆넓이 $2\\pi rH=2\\pi\\times${M.r}\\times${M.H}=${tx(M.cylLat)}$예요. 위·아래 밑면은 모두 붙어서 빼요.`,
        `반구의 곡면 $\\frac{1}{2}\\times4\\pi r^2=2\\pi\\times${M.r}^2=${tx(M.hemi)}$예요. 반구의 평평한 면도 붙어서 빼요.`,
        `(겉넓이) $=${tx(M.coneLat)}+${tx(M.cylLat)}+${tx(M.hemi)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M) => ({
        guide: `<b>분해하기</b> 막대를 끌어 보세요. 원기둥·원뿔이 ${span('sky', '오른쪽으로')} 옮겨지고 반구는 제자리에서 뒤집히면서 서로 맞붙었던 ${span('red', '평평한 면')}이 빨갛게 드러나요. 위 칩에서 원뿔의 모양을, 막대로 원기둥의 높이를 바꿔 보세요.`,
        readouts: M.mode === 'vol' ? [rd('원뿔', plainVal(M.vk) + ' cm³', 'violet'), rd('원기둥', plainVal(M.vc) + ' cm³', 'green'), rd('반구', plainVal(M.vh) + ' cm³', 'sky'), rd('부피', plainVal(M.vol) + ' cm³', 'amber')] : [rd('원뿔의 옆면 πRr', plainVal(M.coneLat) + ' cm²', 'violet'), rd('원기둥의 옆면 2πrH', plainVal(M.cylLat) + ' cm²', 'green'), rd('반구의 곡면 2πr²', plainVal(M.hemi) + ' cm²', 'sky'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'amber', '붙은 면 제외')],
        formula: `<p>(겉넓이) $=\\pi Rr+2\\pi rH+2\\pi r^2$ &nbsp;(맞붙은 면 3개는 빼요)</p>`,
        rule: '붙인 입체의 겉넓이 = 겉으로 드러난 면만 더하기 (붙은 면은 제외)',
        notes: notes('원뿔의 밑면, 원기둥의 위·아래 밑면, 반구의 평평한 면은 <b>모두 붙어서 겉에 드러나지 않아요</b>.', '원뿔의 옆넓이에는 모선(비스듬한 변)을, 부피에는 높이를 써요.')
      }),
      prob: (M) => {
        let wrongs;
        if (M.mode === 'vol') wrongs = [[vadd(M.vh, vadd(M.vc, vmul(M.vk, 3))), '원뿔의 부피에는 $\\frac{1}{3}$을 곱해요.'], [vadd(vmul(M.vh, 2), vadd(M.vc, M.vk)), '반구가 아니라 구의 부피를 썼어요.'], [vadd(M.vc, M.vk), '반구를 빠뜨렸어요.'], [vadd(M.vh, vadd(M.vc, V(0, (M.r * M.r * M.R) / 3))), '원뿔의 높이는 모선이 아니라 $' + M.hc + '$이에요.'], [M.surf, '겉넓이를 구했어요.']];
        else wrongs = [[vadd(M.surf, V(0, 3 * M.r * M.r)), '맞붙은 면은 겉에 드러나지 않아요. 밑면을 더하지 않아요.'], [vadd(M.surf, V(0, M.r * M.r)), '맞붙은 면은 겉에 드러나지 않아요.'], [vadd(M.coneLat, M.cylLat), '반구의 곡면을 빠뜨렸어요.'], [vadd(vadd(M.cylLat, M.hemi), V(0, M.r * M.hc)), '원뿔의 옆넓이에는 모선을 써요. 높이를 썼어요.'], [vadd(vadd(M.coneLat, M.cylLat), V(0, 4 * M.r * M.r)), '반구의 곡면은 구의 절반 $2\\pi r^2$이에요.']];
        const stem = `그림과 같이 반지름이 $${M.r}\\,\\mathrm{cm}$인 반구, 높이가 $${M.H}\\,\\mathrm{cm}$인 원기둥, 높이가 $${M.hc}\\,\\mathrm{cm}$이고 모선의 길이가 $${M.R}\\,\\mathrm{cm}$인 원뿔을 붙여 만든 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`;
        return { tag: M.mode === 'vol' ? '복합 입체의 부피' : '복합 입체의 겉넓이 (함정: 붙은 면)', key: `${M.mode}|${M.key}|${M.H}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(40, 't4', '④ 회전체', '회전체', PARAMS, [sv41(), sv42(), sv43(), sv44()]);
})();
