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

  const TRI = { A: [3, 4, 5], B: [5, 12, 13], C: [6, 8, 10], D: [8, 15, 17] }; // 직각삼각형의 두 변과 빗변
  const KMAX41 = { A: 3, B: 2, C: 2, D: 1 }; // sv4-1: 세 변을 k배 할 수 있는 최대(반지름 15·높이 20 안팎)
  const TRI_LABEL = { A: '3·4·5', B: '5·12·13', C: '6·8·10', D: '8·15·17' };
  const PARAMS = {
    s41K: P('삼각형의 크기', 1, 3, 1, 1, { color: 'amber', hint: '세 변을 모두 몇 배 할지 정해요(모양마다 고를 수 있는 배수가 달라요)', format: (v) => `${v}배`, clampTo: (s) => [1, KMAX41[oneOf(s.svTri, ['A', 'B', 'C', 'D'], 'A')]] }),
    s41T: P('돌리기 · 펼치기', 0, 1, 0.005, 0, { color: 'green', hint: '앞쪽 절반은 삼각형이 축을 중심으로 제자리에서 한 바퀴 돌고, 뒤쪽 절반은 겉넓이를 전개도로 펼쳐요', format: (v, s) => (v < 0.01 ? '0°' : v < 0.5 ? Math.round(v * 720) + '°' : v > 0.99 ? ((s && s.svMode === 'vol') ? '원뿔' : '전개도') : ((s && s.svMode === 'vol') ? '원뿔' : '펼치는 중')) }),
    s42J: P('위쪽 반지름', 1, 12, 1, 3, { color: 'amber', hint: '아래 반지름은 위쪽 반지름에 밑변의 차를 더한 길이예요.', format: (v) => `${v} cm`, clampTo: (s) => [1, 15 - 3 * Math.round(s.s42K)] }),
    s42K: P('아랫변이 더 긴 정도', 1, 2, 1, 1, { color: 'sky', hint: '아랫변이 윗변보다 3 cm(또는 6 cm) 더 길어요. 높이와 빗변도 함께 커져요', format: (v) => `${3 * v} cm`, clampTo: (s) => [1, s.svAxis2 === 'base' ? 2 : Math.min(2, Math.floor((15 - Math.round(s.s42J)) / 3))] }),
    s42A: P('원기둥 부분의 길이', 1, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    s42T: P('돌리기 · 펼치기', 0, 1, 0.005, 0, { color: 'green', hint: '원뿔대는 앞쪽 절반은 돌리기, 뒤쪽 절반은 겉넓이는 펼치기·부피는 작은 원뿔 빼내기예요', format: (v, s) => ((s && (s.svAxis2 !== 'base' || s.svMode !== 'vol')) ? (v < 0.01 ? '0°' : v < 0.5 ? Math.round(v * 720) + '°' : v > 0.99 ? (s.svMode === 'vol' ? '빠짐' : '전개도') : (s.svMode === 'vol' ? '작은 원뿔을 빼는 중' : '펼치는 중')) : (v < 0.01 ? '0°' : v > 0.99 ? '한 바퀴' : Math.round(v * 360) + '°')) }),
    s43T: P('돌리기 · 분해하기', 0, 1, 0.005, 0, { color: 'green', hint: '겉넓이는 앞쪽 절반이 돌리기, 뒤쪽 절반이 펼치기예요. 부피는 뒤쪽 절반에서 두 원뿔이 갈라져요', format: (v, s) => (v < 0.5 ? (v < 0.01 ? '0°' : Math.round(v * 2 * 360) + '°') : (s && s.svMode === 'vol') ? (v > 0.99 ? '분해 완료' : '가로로 분해하는 중') : (v > 0.99 ? '전개도' : '펼치는 중')) }),
    s44H: P('원기둥 부분의 높이', 1, 20, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    s44T: P('분해하기 · 펼치기', 0, 1, 0.01, 0, { color: 'green', hint: '원기둥과 원뿔이 오른쪽으로 옮겨지고 반구는 제자리에서 뒤집혀요. 겉넓이는 뒤쪽 절반에서 조각이 전개도로 펼쳐져요', format: (v, s) => (v < 0.02 ? '붙어 있음' : v > 0.98 ? ((s && s.svMode === 'vol') ? '모두 분해' : '전개도') : Math.round(v * 100) + '%') })
  };
  const oneOf = (v, list, d) => (list.includes(v) ? v : d);
  const A0 = -28 * DEG; // 평면도형이 처음 놓이는 방위(정면을 향함)
  // 수치는 해당 자막에서만 공개합니다. 수동 탐구·정리의 라벨은 그대로 둡니다.
  const lessonValue = (s, C, key, value) => !(C.lesson || s.lessonOn || s.lessonEntry) || (!s.lessonEntry && s[key]) ? value : '';

  // 평면도형(다각형, (r,y)) 하나를 방위 a 에 놓습니다
  const planePts = (poly, a, O = v3(0, 0, 0)) => poly.map(([r, y]) => add3(O, v3(r * Math.cos(a), y, r * Math.sin(a))));
  // 평면도형을 th(0~1) 만큼 돌린 입체 + 지금 평면
  function sweepDraw(D, prof, poly, th, op = {}) {
    const ang = th * TAU, full = th > 0.998;
    if (full) D.body({ mesh: revolveMesh(prof, { N: 48, O: op.O, tags: op.tags }), fill: op.fill || 'sky', alpha: op.alpha || 0.24, edge: 'ink', edgeW: 2.6, faceStyle: op.faceStyle });
    else if (th > 0.002) D.body({ mesh: revolveMesh(prof, { N: Math.max(8, Math.round(48 * th)), a0: A0, a1: A0 + ang, O: op.O, tags: op.tags }), fill: op.fill || 'sky', alpha: op.alpha || 0.24, edge: 'ink', edgeW: 2.6, faceStyle: (f) => (f.cut ? { fill: 'amber', alpha: f.tag === 'cut1' ? 0.5 : 0.3 } : (op.faceStyle ? op.faceStyle(f) : {})) });
    if (!full) {
      const pts = planePts(poly, A0 + ang, op.O);
      D.panel(pts, op.planeFill || 'amber', op.planeAlpha ?? 0.5, op.planeEdge || 'amber', op.planeWidth || 3.2);
    }
  }
  // 가로(x·z) 절반 폭 rx, 세로 절반 높이 ry 인 상자의 꼭짓점 8개(세로로 긴 입체를 정육면체로 어림하면 폭이 부풀어 입체가 작아져요)
  const bxc = (c, rx, ry) => [-1, 1].flatMap((j) => Array.from({ length: 16 }, (_, i) => add3(c, v3(rx * Math.cos((TAU * i) / 16), j * ry, rx * Math.sin((TAU * i) / 16)))));
  const axisLine = (D, y0, y1, x = 0) => D.line(v3(x, y0, 0), v3(x, y1, 0), 'muted', 2.2, { dash: [8, 6], alpha: 0.9 });

  /* ================================================================ sv4-1 직각삼각형 회전 */
  function sv41() {
    const model = (s) => {
      const key = oneOf(s.svTri, ['A', 'B', 'C', 'D'], 'A'), k = clamp(Math.round(s.s41K), 1, KMAX41[oneOf(s.svTri, ['A', 'B', 'C', 'D'], 'A')]), [a, b, c] = TRI[key], A = a * k, B = b * k, Cc = c * k;
      const axis = s.svAxis === 'long' ? 'long' : 'short', r = axis === 'short' ? B : A, h = axis === 'short' ? A : B; // 축으로 삼는 변이 높이
      const mode = s.svMode === 'vol' ? 'vol' : 'surf', S = V(0, r * r), lat = V(0, r * Cc), tot = vadd(S, lat), vol = V(0, (r * r * h) / 3);
      return { key, k, legA: A, legB: B, hyp: Cc, axis, r, h, R: Cc, mode, S, lat, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    const draw = (b, s, M, C) => {
      const st = C.step, rvw = C.review, surf = M.mode === 'surf';
      // 뒤쪽 절반(원뿔이 만들어진 뒤): 겉넓이 = 전개도(부채꼴 + 원), 부피 = 원뿔 겨냥도(밑넓이·높이)
      // 해설 재생 중(s.lessonOn)에는 정리 탭도 탐구처럼 앞 절반(삼각형 돌리기)을 거쳐 뒤 절반(펼치기)로 갑니다(C.t = s41T). 정리 탭·탐구 탭·썸네일은 그대로입니다.
      const lessonRun = rvw && s.lessonOn;
      if (!C.problem && ((rvw && !((lessonRun || C.lesson) && C.t < 0.5)) || C.t >= 0.5 || b.thumb)) {
        const t2 = b.thumb ? 1 : rvw && !lessonRun ? 1 : clamp((C.t - 0.5) * 2, 0, 1);
        const hl = !rvw ? {} : st <= 1 ? {} : surf ? (st === 2 ? { ring: 2, bot: 2 } : { ring: 3, bot: 2 }) : (st === 2 ? { bot: 2 } : { ring: 3, bot: 2 });
        const res = G.coneNet(b, s, C, { r2: M.r, r1: 0, hf: M.h, R2: M.R, R1: 0, t: surf ? t2 : 0, problem: !surf, review: rvw, hl, lessonReveal: { base: s.svBaseReady, side: s.svSideReady, other: s.svOtherReady }, simpleNet: surf && C.tab === 'explore', fitL: surf && C.tab === 'explore' ? 24 : surf && C.lesson && b.W < 560 ? 54 : undefined, fitR: surf && C.tab === 'explore' ? (window.innerWidth>=700 && b.W>=560 ? 245 : 24) : undefined, fitT: surf && C.tab === 'explore' ? 24 : surf ? undefined : 84, fitB: surf && C.tab === 'explore' ? 24 : undefined, vals: { ring: plainVal(M.lat), bot: plainVal(M.S), arcBig: plainVal(V(0, 2 * M.r)), tot: plainVal(M.tot) } });
        if (!surf && !b.thumb && !(C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560)) {
          D4cone(res, M, s, C);
        }
        return;
      }
      const sc = 4.6 / Math.max(M.h, M.r * 1.5), r = M.r * sc, h = M.h * sc, D = scene3(b, s, C);
      const th = C.problem ? 0 : Math.min(1, C.t * 2), y0 = -h / 2;
      const prof = [[0, y0], [r, y0], [0, y0 + h]], poly = prof;
      // 가로 태블릿에서는 오른쪽 공식 카드(220px)가 빗변 치수를 덮지 않게 자리를 남겨요.
      const cardRoom = C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 && b.W < 760;
      D.fit(bxc(v3(0, y0 + h / 2, 0), r, h / 2), [], { l: 30, r: cardRoom ? 245 : 30, t: 34, b: 34 });
      axisLine(D, y0 - 0.5, y0 + h + 0.7);
      sweepDraw(D, prof, poly, th, { O: v3(0, 0, 0), fill: 'sky', alpha: .07, planeFill: 'sky', planeAlpha: .08, planeEdge: 'ink', planeWidth: 2 });
      // 길이 표시는 평면도형(오른쪽 정면 자리)에: 말 + 치수선
      const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pr = pa(r, y0), pt = pa(0, y0 + h), ctr = pa(r / 3, y0 + h / 3);
      D.right(o, sub3(pr, o), sub3(pt, o), Math.min(0.22, r * 0.16), 'ink');
      D.dim(o, pr, `반지름 ${M.r}`, { side: { x: 0, y: 1 }, off: 20, color: 'ink' });
      D.dim(o, pt, `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 22, color: 'ink' });
      D.dim(pr, pt, `모선(빗변) ${M.R}`, { from: ctr, off: 20 });
      D.label(add3(o, v3(0, 0, 0)), '축', { dir: { x: -1, y: 0.3 }, size: 13, color: 'muted', gap: 4 });
    };
    // 부피 쪽 원뿔 겨냥도의 이름표(밑넓이)와 식
    const D4cone = (res, M, s, C) => {
      const { D, sn } = res;
      D.areaLab(centroid(sn.A), '밑넓이', lessonValue(s, C, 'svBaseReady', plainVal(M.S)), { dx: -0.1, dy: 34 });
      G.sumRows(D, [[{ t: '부피 = ' }, { t: '⅓', c: 'amber' }, { t: ' × ' }, { t: '밑넓이', c: 'violet' }, { t: ' × ' }, { t: '높이', c: 'amber' }], [{ t: `= ⅓ × ${plainVal(M.S)} × ${M.h} = ${plainVal(M.vol)}` }]], 1);
    };
    const bg = (M) => `직각을 낀 두 변이 $${M.legA}\\,\\mathrm{cm}$, $${M.legB}\\,\\mathrm{cm}$이고 빗변이 $${M.hyp}\\,\\mathrm{cm}$인 직각삼각형`;
    return {
      id: 'sv4-1', title: '직각삼각형 회전', short: '삼각형 회전',
      question: '직각삼각형을 한 변을 축으로 한 바퀴 돌리면 어떤 입체가 될까? 어느 변을 축으로 하느냐에 따라 달라질까?',
      anim: { key: 's41T', dur: 6, label: '돌리기 · 펼치기' }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 1,
      ctl: () => ['s41T'],
      presets: () => TRI_ORDER.map((k, i) => ({ group: i === 0 ? '삼각형의 세 변' : '', label: TRI_LABEL[k], apply: (st, lab) => { st.svTri = k; st.s41K = Math.min(Math.round(st.s41K) || 1, KMAX41[k]); st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svTri, ['A', 'B', 'C', 'D'], 'A') === k })).concat([{ group: '축으로 하는 변', label: '짧은 변', apply: (st, lab) => { st.svAxis = 'short'; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svAxis !== 'long' }, { label: '긴 변', apply: (st, lab) => { st.svAxis = 'long'; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svAxis === 'long' }, { group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s41T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s41T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s41T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s41T === 0; }, on: (st) => st.svMode === 'vol' }]),
      init: (s) => { s.svTri = 'A'; s.svAxis = 'long'; s.svMode = 'surf'; s.s41K = 1; s.s41T = 0; },
      reroll: (s) => { s.svTri = pick(['A', 'B', 'D'], s.svTri); s.svAxis = pick(['short', 'long'], s.svAxis); s.svMode = pick(['surf', 'vol'], s.svMode); s.s41K = 1; s.s41T = 0.5; },
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
        `축으로 하는 변은 길이 $${M.h}$이고 이 변이 높이가 돼요. 다른 직각변 $${M.r}$이 밑면의 반지름이고, 빗변 $${M.R}$이 모선인 <b>원뿔</b>이 만들어져요.`,
        M.mode === 'vol' ? `밑넓이 $=\\pi\\times${M.r}^2=${tx(M.S)}\\,\\mathrm{cm}^2$예요.` : `밑넓이 $=\\pi\\times${M.r}^2=${tx(M.S)}$예요. 전개도의 부채꼴은 반지름이 모선(빗변) $${M.R}$, 호의 길이가 밑면의 둘레 $${tx(V(0, 2 * M.r))}$이므로 옆넓이는 $\\pi\\times${M.R}\\times${M.r}=${tx(M.lat)}$예요.`,
        M.mode === 'vol' ? `(부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이) $=\\frac{1}{3}\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.` : `(겉넓이) $=$ (옆넓이) $+$ (밑넓이) $=${tx(M.lat)}+${tx(M.S)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, Ctx) => ({
        card: Ctx.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560 ? {title:'', lines:M.mode === 'vol' ? [{text:'밑넓이'}, {text:`$\\pi\\times${M.r}^2=${tx(M.S)}$`}, {text:'부피'}, {text:`$\\frac{1}{3}\\times${tx(M.S)}\\times${M.h}=${tx(M.vol)}$`}] : [{text:'옆넓이'}, {text:`$\\pi\\times${M.r}\\times${M.R}=${tx(M.lat)}$`}, {text:'밑넓이'}, {text:`$\\pi\\times${M.r}^2=${tx(M.S)}$`}, {text:'겉넓이'}, {text:`$${tx(M.lat)}+${tx(M.S)}=${tx(M.tot)}$`}] } : null,
        guide: `<b>돌리기 · 펼치기</b> 막대를 끌거나 ▶를 눌러 보세요. 삼각형이 점선 <b>축</b>을 중심으로 제자리에서 돌아 원뿔이 되고, 이어서 겉넓이는 <b>전개도</b>로 펼쳐져요. 칩에서 <b>축으로 하는 변</b>을 바꾸면 반지름과 높이가 서로 바뀌어요.`,
        readouts: [rd('반지름', M.r + ' cm', 'amber', '축이 아닌 직각변'), rd('높이', M.h + ' cm', 'amber', '축으로 한 변'), rd('모선', M.R + ' cm', 'sky', '빗변'), rd('겉넓이', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted', `옆넓이 ${plainVal(M.lat)} + 밑넓이 ${plainVal(M.S)}`), rd('부피', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted', `⅓ × ${plainVal(M.S)} × ${M.h}`)],
        formula: `<p>(겉넓이) $=$ (옆넓이) $+$ (밑넓이) &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (높이)</p>`,
        rule: '직각삼각형을 한 직각변을 축으로 돌리면 원뿔: 축 = 높이, 다른 직각변 = 반지름, 빗변 = 모선',
        notes: notes('<b>축으로 삼는 변이 높이</b>예요. 축을 바꾸면 반지름과 높이가 서로 바뀌어 겉넓이·부피가 달라져요.', '모선은 항상 <b>빗변</b>이에요.')
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
  const TRI_ORDER = ['A', 'B', 'D'];

  /* ================================================================ sv4-2 직각사다리꼴 회전 */
  function sv42() {
    const model = (s) => {
      const axis = s.svAxis2 === 'base' ? 'base' : 'leg', mode = s.svMode === 'vol' ? 'vol' : 'surf';
      if (axis === 'leg') {
        const k = clamp(Math.round(s.s42K), 1, 2), j = clamp(Math.round(s.s42J), 1, 15 - 3 * k), r1 = j, r2 = j + 3 * k, K = r2 / 3, h = 4 * k, R2 = 5 * r2 / 3, R1 = 5 * r1 / 3, h2 = 4 * r2 / 3, h1 = 4 * r1 / 3;
        const lat2 = V(0, r2 * R2), lat1 = V(0, r1 * R1), latF = vsub(lat2, lat1), top = V(0, r1 * r1), bot = V(0, r2 * r2), surf = vadd(latF, vadd(top, bot)), v2 = V(0, (r2 * r2 * h2) / 3), v1 = V(0, (r1 * r1 * h1) / 3), vol = vsub(v2, v1);
        return { axis, mode, j, k, K, r1, r2, h, R1, R2, h1, h2, lat2, lat1, latF, top, bot, surf, v2, v1, vol, ans: mode === 'vol' ? vol : surf };
      }
      const a = clamp(Math.round(s.s42A), 1, 15), k = clamp(Math.round(s.s42K), 1, 2), hh = 4 * k, p = 3 * k, c = 5 * k, b = a + p; // 높이(반지름) hh, 원기둥 길이 a, 원뿔 높이 p, 모선 c
      const base = V(0, hh * hh), cylLat = V(0, 2 * hh * a), coneLat = V(0, hh * c), surf = vadd(base, vadd(cylLat, coneLat)), vcyl = V(0, hh * hh * a), vcone = V(0, (hh * hh * p) / 3), vol = vadd(vcyl, vcone);
      return { axis, mode, a, k, hh, p, c, b, base, cylLat, coneLat, surf, vcyl, vcone, vol, ans: mode === 'vol' ? vol : surf };
    };
    const draw = (b, s, M, C) => {
      const st = C.step;
      // 높이가 되는 변을 축으로(원뿔대): 앞 절반은 사다리꼴 돌리기, 뒤 절반은 겉넓이 = 전개도(coneNet) · 부피 = 큰 원뿔 − 작은 원뿔 겨냥도(frustumVol)
      if (M.axis === 'base' && M.mode === 'surf' && !C.problem && ((C.review && !C.lesson) || C.t >= 0.5 || b.thumb)) {
        compNet(b, s, C, { simple: true, r: M.hh, R: M.c, H: M.a, nCirc: 1, circNm: '밑면', coneLat: M.coneLat, cylLat: M.cylLat, circTot: M.base, tot: M.surf, hot: { cone: 3, cyl: 2, circ: 2 }, legend: [[{ t: `밑면은 1개만 더해요 (${plainVal(M.base)})`, c: 'sky' }], [{ t: '원뿔과 맞붙은 쪽은 겉에 드러나지 않아서 빼요', c: 'red' }]] });
        return;
      }
      if (M.axis === 'base' && M.mode === 'vol' && !C.problem && !b.thumb && !C.review && C.t >= 0.5) {
        const D = scene3(b, s, C), sc = 4.6 / Math.max(M.b, 2 * M.hh), r = M.hh * sc, h = M.a * sc, coneH = M.p * sc;
        const sep = ease(clamp((C.t - 0.5) * 2, 0, 1)) * (r * 2.4), shift = D.hx(sep), y0 = -(h + coneH) / 2;
        const cylinder = revolveMesh([[0,y0],[r,y0],[r,y0+h],[0,y0+h]],{N:44,tags:['bot','side','top']});
        const cone = xfMesh(revolveMesh([[0,y0+h],[r,y0+h],[0,y0+h+coneH]],{N:44,tags:['bot','side']}),G.shiftT(shift));
        D.fit(cylinder.faces.flatMap(f=>f.pts).concat(cone.faces.flatMap(f=>f.pts)),[],{l:30,r:(window.innerWidth>=700&&b.W>=560?245:30),t:30,b:35});
        [cylinder,cone].forEach(m=>D.body({mesh:m,fill:'sky',alpha:0.06,edge:'ink',edgeW:2}));
        return;
      }
      if (M.axis === 'leg' && !C.problem && ((C.review && !C.lesson) || C.t >= 0.5 || b.thumb)) {
        const t2 = C.review || b.thumb ? (C.review ? clamp((C.t - 0.5) * 2, 0, 1) : 1) : clamp((C.t - 0.5) * 2, 0, 1);
        if (M.mode === 'vol') {
          const D = G.frustumVol(b, s, C, { exactFractions: true, minimal: true, simpleLabels: true, fitR: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 30), r2: M.r2, r1: M.r1, h2: M.h2, h1: M.h1, t: t2, review: C.review, step: st, vals: { v2: plainVal(M.v2), v1: plainVal(M.v1), vol: plainVal(M.vol) } });
          if (C.lesson && !b.thumb) {
            // 기존 겨냥도 위에 해설이 현재 읽는 치수·부피만 덧붙입니다.
            const sc = 4.8 / Math.max(M.h2, 2.2 * M.r2), r2 = M.r2 * sc, r1 = M.r1 * sc, h2 = M.h2 * sc, h1 = M.h1 * sc;
            const y0 = -h2 / 2, yc = y0 + h2 - h1, sh = D.hx(ease(t2) * (r1 * 2.4 + 0.5)), rf = D.rightFront(35);
            const cb = v3(0, y0, 0), ct = add3(v3(0, yc, 0), sh), top = add3(v3(0, y0 + h2, 0), sh);
            D.radius(cb, add3(cb, mul3(rf, r2)), `반지름 ${M.r2}`, { dash: true });
            D.radius(ct, add3(ct, mul3(rf, r1)), `반지름 ${M.r1}`, { dash: true });
            if (s.svOtherReady && !s.lessonEntry) {
              D.height(cb, v3(0, y0 + h2, 0), `큰 높이 ${plainVal(V(M.h2))}`, { side: { x: 1, y: 0 } });
              D.height(ct, top, `작은 높이 ${plainVal(V(M.h1))}`, { side: { x: -1, y: 0 } });
            }
            const row = s.svShowV && !s.lessonEntry ? `부피 = ${plainVal(M.v2)} − ${plainVal(M.v1)} = ${plainVal(M.vol)}`
              : s.svSideReady && !s.lessonEntry ? `작은 원뿔: ⅓ × π × ${M.r1}² × ${plainVal(V(M.h1))} = ${plainVal(M.v1)}`
                : s.svBaseReady && !s.lessonEntry ? `큰 원뿔: ⅓ × π × ${M.r2}² × ${plainVal(V(M.h2))} = ${plainVal(M.v2)}` : null;
            if (row) G.stepRow(D, C, [{ t: row, c: s.svShowV ? 'green' : 'ink' }]);
          }
        } else {
          const rv = C.review, hl = !rv ? {} : C.lesson && st === 0 ? {} : st <= 1 ? { big: true } : st === 2 ? { small: true } : st === 3 ? { ring: 2 } : { ring: 3, bot: 2, top: 2 };
          G.coneNet(b, s, C, { exactFractions: true, cleanFrustum: true, simpleNet: !C.lesson || !s.sv42LengthReady || s.lessonEntry, lessonReveal: { base: s.svBaseReady, side: s.svSideReady, other: s.svOtherReady, big: s.sv42BigReady, small: s.sv42SmallReady }, fitL: C.lesson ? 36 : 20, fitR: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : C.lesson ? 36 : 20), fitT: C.lesson ? 84 : 30, fitB: C.lesson ? 76 : 30, r2: M.r2, r1: M.r1, hf: M.h, R2: M.R2, R1: M.R1, t: rv && !C.lesson ? 1 : t2, review: rv, hl, vals: { ring: plainVal(M.latF), top: plainVal(M.top), bot: plainVal(M.bot), arcBig: plainVal(V(0, 2 * M.r2)), arcSmall: plainVal(V(0, 2 * M.r1)), tot: plainVal(M.surf), big: plainVal(M.lat2), small: plainVal(M.lat1) } });
        }
        return;
      }
      const D = scene3(b, s, C), th = C.problem ? 0.25 : C.review && !C.lesson ? 1 : (M.axis === 'leg' || M.mode === 'surf') ? Math.min(1, C.t * 2) : C.t;
      if (M.axis === 'leg') {
        const sc = 4.4 / Math.max(M.h2, 2 * M.r2), r1 = M.r1 * sc, r2 = M.r2 * sc, h = M.h * sc, h2 = M.h2 * sc, h1 = M.h1 * sc, y0 = -h2 / 2;
        const prof = [[0, y0], [r2, y0], [r1, y0 + h], [0, y0 + h]], poly = prof;
        D.fit(bxc(v3(0, 0, 0), r2, h2 / 2), [], { l: 34, r: 34, t: 34, b: 34 });
        axisLine(D, y0 - 0.5, y0 + h + 1.4);
        sweepDraw(D, prof, poly, th, { planeFill: 'sky', planeAlpha: 0.05, planeEdge: 'ink', planeWidth: 2, faceStyle: (f) => (C.review && st === 4 && M.mode === 'surf' && (f.tag === 'seg0' || f.tag === 'seg2') ? { fill: 'amber', alpha: 0.4 } : C.review && st === 3 && f.tag === 'seg1' ? { fill: 'amber', alpha: 0.3 } : {}) });
        const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pb2 = pa(r2, y0), pc = pa(r1, y0 + h), pd = pa(0, y0 + h);
        D.right(o, sub3(pb2, o), sub3(pd, o), 0.26, 'amber');
        D.right(pd, sub3(pc, pd), sub3(o, pd), 0.26, 'amber');
        const ctr = v3(pa(r2 / 2, y0 + h / 2).x, y0 + h / 2, pa(r2 / 2, y0 + h / 2).z);
        D.dim(o, pb2, `아랫변 ${M.r2}`, { side: { x: 0, y: 1 }, off: 22, color: 'amber' });
        D.dim(pd, pc, `윗변 ${M.r1}`, { side: { x: 0, y: -1 }, off: 22, color: 'amber' });
        D.dim(o, pd, `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 22, color: 'amber' });
        D.dim(pb2, pc, `빗변 ${5 * M.k}`, { from: ctr, off: 22 });
        D.label(o, '축', { dir: { x: -1, y: 0.4 }, size: 13, color: 'muted', gap: 4 });
      } else {
        // 아랫변(긴 변)을 축으로: 반지름 hh 인 원기둥(길이 a) + 원뿔(높이 p)
        const sc = 4.6 / Math.max(M.b, 2 * M.hh), hh = M.hh * sc, a = M.a * sc, bb = M.b * sc, y0 = -bb / 2;
        const prof = [[0, y0], [hh, y0], [hh, y0 + a], [0, y0 + bb]], poly = prof;
        D.fit(bxc(v3(0, 0, 0), hh, bb / 2), [], { l: b.W < 560 ? 70 : 60, r: b.W < 560 ? 100 : 80, t: 34, b: 44 });
        axisLine(D, y0 - 0.5, y0 + bb + 0.5);
        sweepDraw(D, prof, poly, th, { planeFill: 'sky', planeAlpha: 0.05, planeEdge: 'ink', planeWidth: 2, faceStyle: (f) => (C.review && st === 1 && M.mode === 'surf' && f.tag === 'seg0' ? { fill: 'amber', alpha: 0.4 } : C.review && st === 2 && f.tag === 'seg1' ? { fill: 'amber', alpha: 0.34 } : C.review && st === 3 && f.tag === 'seg2' ? { fill: 'amber', alpha: 0.34 } : {}) });
        const pa = (rr, yy) => v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), o = pa(0, y0), pd = pa(hh, y0), pc = pa(hh, y0 + a), pbb = pa(0, y0 + bb);
        D.right(o, sub3(pd, o), sub3(pbb, o), 0.26, 'amber');
        D.right(pd, sub3(pc, pd), sub3(o, pd), 0.26, 'amber');
        const ctr2 = pa(hh / 2, y0 + bb / 2);
        D.dim(o, pd, `높이 ${M.hh}`, { side: { x: 0, y: 1 }, off: 22, color: 'amber' });
        D.dim(pd, pc, `짧은 밑변 ${M.a}`, { side: { x: 1, y: 0 }, off: 22, color: 'amber' });
        D.dim(pc, pbb, `빗변 ${M.c}`, { from: ctr2, off: 22 });
        D.dim(o, pbb, `긴 밑변 ${M.b}`, { side: { x: -1, y: 0 }, off: 22 });
        D.label(o, '축', { dir: { x: -1, y: 0.4 }, size: 13, color: 'muted', gap: 4 });
        D.line(pa(0, y0 + a), pc, 'muted', 1.8, { dash: [5, 4] });
      }
    };
    const lab = (M) => (M.axis === 'leg' ? `아랫변 $${M.r2}\\,\\mathrm{cm}$, 윗변 $${M.r1}\\,\\mathrm{cm}$, 높이(축) $${M.h}\\,\\mathrm{cm}$, 빗변 $${5 * M.k}\\,\\mathrm{cm}$인 직각사다리꼴을 높이가 되는 변을 축으로` : `긴 밑변 $${M.b}\\,\\mathrm{cm}$, 짧은 밑변 $${M.a}\\,\\mathrm{cm}$, 높이 $${M.hh}\\,\\mathrm{cm}$, 빗변 $${M.c}\\,\\mathrm{cm}$인 직각사다리꼴을 긴 밑변을 축으로`);
    return {
      id: 'sv4-2', title: '직각사다리꼴 회전', short: '사다리꼴 회전',
      question: '직각사다리꼴을 돌리면 어떤 입체가 될까? 높이가 되는 변을 축으로 할 때와 긴 밑변을 축으로 할 때 어떻게 다를까?',
      anim: { key: 's42T', dur: 2.5, label: '돌리기 · 펼치기' }, cam0: { yaw: 28, pitch: 20 }, stepT: (st) => { const lab = window.lab, s0 = lab && lab.s; return s0 && s0.svAxis2 !== 'base' && s0.svMode === 'vol' && st <= 1 ? 0.5 : (s0 && s0.svAxis2 === 'base' && s0.svMode === 'vol' ? 1 : 1); }, thumbT: 1, problemT: 1,
      ctl: (s) => (s.svAxis2 === 'base' ? ['s42A', 's42K', 's42T'] : ['s42J', 's42K', 's42T']),
      presets: () => [{ group: '축으로 하는 변', label: '높이가 되는 변 (원뿔대)', apply: (st, lab) => { st.svAxis2 = 'leg'; st.s42T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svAxis2 !== 'base' }, { label: '긴 밑변 (원기둥+원뿔)', apply: (st, lab) => { st.svAxis2 = 'base'; st.s42T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => st.svAxis2 === 'base' }, { group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s42T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s42T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s42T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s42T === 0; }, on: (st) => st.svMode === 'vol' }],
      init: (s) => { s.svAxis2 = 'leg'; s.svMode = 'surf'; s.s42J = 3; s.s42K = 1; s.s42A = 3; s.s42T = 0.5; },
      reroll: (s) => { s.svAxis2 = pick(['leg', 'base'], s.svAxis2); s.svMode = pick(['surf', 'vol'], s.svMode); s.s42J = rint(1, 9); s.s42K = rint(1, 2); s.s42A = rint(1, 6); s.s42T = 0.5; },
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
            `높이가 되는 변을 축으로 돌리면 <b>원뿔대</b>예요. 큰 원뿔(반지름 $${M.r2}$, 높이 $${tx(V(M.h2))}$)에서 작은 원뿔(반지름 $${M.r1}$, 높이 $${tx(V(M.h1))}$)을 빼요.`,
            `큰 원뿔의 부피 $\\frac{1}{3}\\times\\pi\\times${M.r2}^2\\times${tx(V(M.h2))}=${tx(M.v2)}$, 작은 원뿔의 부피 $\\frac{1}{3}\\times\\pi\\times${M.r1}^2\\times${tx(V(M.h1))}=${tx(M.v1)}$예요.`,
            `(원뿔대의 부피) $=$ (큰 원뿔) $-$ (작은 원뿔) $=${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
          ] : [
            `높이가 되는 변을 축으로 돌리면 <b>원뿔대</b>예요. 전개도에서 큰 부채꼴은 반지름이 큰 원뿔의 모선 $${tx(V(M.R2))}$이고 호의 길이가 아랫면의 둘레 $${tx(V(0, 2 * M.r2))}$예요. 넓이는 $\\pi\\times${M.r2}\\times${tx(V(M.R2))}=${tx(M.lat2)}$예요.`,
            `잘라 낸 작은 부채꼴은 반지름이 작은 원뿔의 모선 $${tx(V(M.R1))}$이고 호의 길이가 윗면의 둘레 $${tx(V(0, 2 * M.r1))}$예요. 넓이는 $\\pi\\times${M.r1}\\times${tx(V(M.R1))}=${tx(M.lat1)}$예요.`,
            `원뿔대의 옆넓이는 부채꼴 고리의 넓이예요. (큰 부채꼴) $-$ (작은 부채꼴) $=${tx(M.lat2)}-${tx(M.lat1)}=${tx(M.latF)}$예요.`,
            `(겉넓이) $=$ (옆넓이) $+$ (윗면) $+$ (아랫면) $=${tx(M.latF)}+${tx(M.top)}+${tx(M.bot)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
          ];
        }
        return M.mode === 'vol' ? [
          `긴 밑변을 축으로 돌리면 반지름 $${M.hh}$인 <b>원기둥</b>(길이 $${M.a}$)에 <b>원뿔</b>(높이 $${M.p}$)이 붙은 입체예요.`,
          `원기둥 $\\pi\\times${M.hh}^2\\times${M.a}=${tx(M.vcyl)}$, 원뿔 $\\frac{1}{3}\\times\\pi\\times${M.hh}^2\\times${M.p}=${tx(M.vcone)}$예요.`,
          `(부피) $=${tx(M.vcyl)}+${tx(M.vcone)}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
        ] : [
          `긴 밑변을 축으로 돌리면 반지름 $${M.hh}$인 원기둥(길이 $${M.a}$)에 원뿔(모선 $${M.c}$)이 붙은 입체예요. 붙은 면은 겉에 드러나지 않아요.`,
          `전개도에서 원기둥의 한쪽 밑면은 원이에요. $\\pi\\times${M.hh}^2=${tx(M.base)}$ 이고, 옆면은 가로가 밑면의 둘레, 세로가 길이인 직사각형이라 $2\\pi\\times${M.hh}\\times${M.a}=${tx(M.cylLat)}$예요.`,
          `원뿔의 옆면은 부채꼴이에요. 넓이 $\\pi\\times${M.c}\\times${M.hh}=${tx(M.coneLat)}$예요.`,
          `(겉넓이) $=${tx(M.base)}+${tx(M.cylLat)}+${tx(M.coneLat)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
        ];
      },
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines: M.axis === 'base' ? (M.mode === 'vol' ? [{text:'부피 = 원기둥 + 원뿔',color:'ink'},{text:`$${tx(M.vcyl)}+${tx(M.vcone)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}] : [{text:'겉넓이',color:'ink'},{text:`$${tx(M.base)}+${tx(M.cylLat)}+${tx(M.coneLat)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'}]) : M.mode === 'vol' ? [
          {text:'부피 = 큰 원뿔 − 작은 원뿔',color:'ink'}, {text:`$${tx(M.v2)}-${tx(M.v1)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}
        ] : [
          {text:'옆넓이',color:'ink'}, {text:`$${tx(M.lat2)}-${tx(M.lat1)}=${tx(M.latF)}\\,\\mathrm{cm}^{2}$`,color:'ink'},
          {text:'겉넓이',color:'ink'}, {text:`$${tx(M.latF)}+${tx(M.top)}+${tx(M.bot)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'}
        ]} : null,
        guide: `칩에서 <b>축으로 하는 변</b>과 <b>구하는 것</b>을 골라 보세요. <b>돌리기</b>를 끌면 ${span('amber', '사다리꼴')}이 축 둘레를 제자리에서 돌아요. 원뿔대는 막대 뒤쪽 절반에서 겉넓이는 <b>전개도</b>로 펼쳐지고, 부피는 <b>큰 원뿔 − 작은 원뿔</b>로 보여요. 축이 바뀌면 전혀 다른 입체가 만들어져요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.axis === 'leg'
          ? (M.mode === 'vol' ? [rd('큰 원뿔의 부피', plainVal(M.v2) + ' cm³', 'sky'), rd('작은 원뿔의 부피', plainVal(M.v1) + ' cm³', 'violet'), rd('원뿔대의 부피', plainVal(M.vol) + ' cm³', 'green', '큰 원뿔 − 작은 원뿔')] : [rd('원뿔대의 옆넓이', plainVal(M.latF) + ' cm²', 'amber', '큰 부채꼴 − 작은 부채꼴'), rd('윗면 + 아랫면', plainVal(vadd(M.top, M.bot)) + ' cm²', 'sky'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green', '옆넓이 + 두 밑면')])
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
        return { tag: M.mode === 'vol' ? '회전체의 부피 (사다리꼴)' : '회전체의 겉넓이 (사다리꼴)', key: `${M.axis}|${M.mode}|${M.j}|${M.k}|${M.a}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
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
    // 겉넓이 전개도: 두 원뿔의 옆면 = 부채꼴 2개(맞붙은 원은 겉에 없어 밑면은 없음). 호의 길이는 모두 맞붙은 원의 둘레
    const drawNet = (b, s, M, C) => {
      const D = G.scene3(b, s, C, { yaw: 0, pitch: 0 }), st = C.step, thumb = !!b.thumb, u = (C.review && !C.lesson) || thumb ? 1 : clamp((C.t - 0.5) * 2, 0, 1), e = ease(u); // 해설 재생 중에는 정리 탭도 s43T 를 따라 돌고 펼쳐져요
      const sc = 4.4 / Math.max(M.R1, M.R2), cones = [{ nm: '아래 원뿔', R: M.R1, lat: M.lat1, col: 'sky' }, { nm: '위 원뿔', R: M.R2, lat: M.lat2, col: 'violet' }];
      const th = (c) => (360 * M.r) / c.R;
      const wd = (c) => 2 * c.R * sc * (th(c) >= 180 ? 1 : Math.sin((th(c) / 2) * DEG)), gap = 0.7;
      const total = wd(cones[0]) + wd(cones[1]) + gap;
      let x = -total / 2;
      cones.forEach((c) => { c.cx = x + wd(c) / 2; x += wd(c) + gap; c.rho = c.R * sc; c.ang = th(c) * e; });
      const arcPts = (c, a) => { const out = []; for (let i = 0; i <= 48; i++) { const f = -90 - a / 2 + (a * i) / 48; out.push(v3(c.cx + c.rho * Math.cos(f * DEG), -0.0 + c.rho * Math.sin(f * DEG), 0)); } return out; };
      const all = []; cones.forEach((c) => { arcPts(c, th(c)).forEach((q) => all.push(q)); all.push(v3(c.cx, 0, 0)); });
      D.fit(all, [], { l: 25, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 25), t: thumb ? 5 : 30, b: thumb ? 5 : 30 });
      const hot = (i) => !C.review || (st <= 1) || (st === 2 && true) || st === 3;
      cones.forEach((c, i) => {
        const apex = v3(c.cx, 0, 0), arc = arcPts(c, c.ang);
        // 펼치기 첫 순간에도 두 옆면의 전체 윤곽을 안내합니다. 각이 거의 0인
        // 채색 조각만 그리면 학생 화면에서 입체가 통째로 사라져 보여요.
        if (C.lesson && u < 1) D.path([apex].concat(arcPts(c, th(c)), [apex]), 'ink', 1.6, { alpha: 0.45, dash: true });
        if (c.ang < 0.5) return;
        D.panel([apex].concat(arc), C.review && st === 2 ? 'amber' : 'green', C.review && st === 2 ? 0.1 : 0.06, 'ink', 2);
        D.path(arc, 'ink', 1.8, {});
      });
      void hot;
      if (thumb) return;
      if (C.tab === 'explore' || (C.review && !C.lesson)) { if (u > 0.8) cones.forEach(c => D.areaLab(v3(c.cx, -c.rho * 0.5, 0), c.nm + ' 옆면', '', {size: 13})); return; }
      const flatA = lin01(u, 0.8, 1), VIO = 'violet';
      cones.forEach((c, i) => {
        const apex = v3(c.cx, 0, 0), full = arcPts(c, th(c)), endL = full[0], midBot = v3(c.cx, -c.rho, 0), narrow = D.narrow;
        D.dim(apex, endL, narrow ? `${c.R}` : `모선 ${c.R}`, { from: midBot, off: 20, alpha: flatA });
        D.areaLab(v3(c.cx, -c.rho * 0.5, 0), `${c.nm} 옆넓이`, lessonValue(s, C, i === 0 ? 'svBaseReady' : 'svSideReady', plainVal(c.lat)), { alpha: flatA, maxW: Math.max(60, c.rho * (D.b.k || 40) * 0.95) });
        const kq = 30, arc = lessonValue(s, C, 'svOtherReady', plainVal(V(0, 2 * M.r))); D.edgeLab(full[kq], full[kq + 1], narrow ? `호 ${arc}` : `호의 길이 ${arc}`, { from: apex, color: VIO, alpha: flatA });
      });
      G.sumRows(D, [[{ t: '겉넓이 = ' }, { t: '아래 원뿔의 옆넓이', c: 'sky' }, { t: ' + ' }, { t: '위 원뿔의 옆넓이', c: 'violet' }], [{ t: `= ${plainVal(M.lat1)} + ${plainVal(M.lat2)} = ${plainVal(M.surf)}` }]], flatA);
      G.sumRows(D, [[{ t: `각 호의 길이 = 맞붙은 원의 둘레 ${lessonValue(s, C, 'svOtherReady', plainVal(V(0, 2 * M.r)))}`, c: VIO }], [{ t: '맞붙은 원은 겉에 드러나지 않아 밑면은 더하지 않아요', c: 'red' }]], flatA, true);
    };
    const draw = (b, s, M, C) => {
      // 첫 장이 t=0.5에서 멈춘 동안은 완성된 입체를 유지하고, 다음 장의 펼침부터 전개도로 넘어갑니다.
      const netReady = C.lesson ? C.t > 0.5 : C.review || C.t >= 0.5 || b.thumb;
      if (M.mode === 'surf' && !C.problem && netReady) return drawNet(b, s, M, C);
      const sc = 4.6 / Math.max(M.h1 + M.h2, 2.2 * M.r), r = M.r * sc, h1 = M.h1 * sc, h2 = M.h2 * sc, D = scene3(b, s, C), st = C.step;
      const t = C.problem ? 0 : C.t, rotT = clamp(t / 0.5, 0, 1), sep = ease(lin01(t, 0.5, 0.8)) * (r * 2.6), flip = ease(lin01(t, 0.8, 1));
      const yy0 = -(h1 + h2) / 2, yMid = yy0 + h1;
      const low = revolveMesh([[0, yy0], [r, yMid], [0, yMid]], { N: 44, tags: ['side', 'disc'] }), upm = revolveMesh([[0, yMid], [r, yMid], [0, yMid + h2]], { N: 44, tags: ['disc', 'side'] });
      // 아래 원뿔은 제자리에서 뒤집어(회전) 밑면이 아래로, 위 원뿔은 오른쪽으로만 옮겨요
      const Tl = G.rotAbout(v3(0, (yy0 + yy0 + h1) / 2, 0), v3(0, 0, 1), PI * flip), lp = (p) => G.applyT(Tl, p);
      const lowM = xfMesh(low, Tl), upM = xfMesh(upm, shiftT(D.hx(sep)));
      // 지금 프레임의 입체만으로 맞춰요: 아래 원뿔(제자리에서 뒤집힘)과 위 원뿔(오른쪽으로 옮겨 가는 만큼). 처음엔 이중원뿔이 크게, 분해되면서 서서히 물러나요
      const bx4 = (cx, y0, y1) => bxc(add3(cx, v3(0, (y0 + y1) / 2, 0)), r, (y1 - y0) / 2);
      D.fit(bx4(v3(0, 0, 0), yy0, yMid).concat(bx4(D.hx(sep), yMid, yMid + h2)), [], { l: 30, r: (C.tab === 'explore' && !C.problem && window.innerWidth >= 700 && b.W >= 560 ? 245 : b.W < 560 ? 70 : 30), t: 34, b: 36 });
      const poly = [[0, yy0], [r, yMid], [0, yMid + h2]];
      if (sep < 0.01 && flip < 0.01) axisLine(D, yy0 - 0.5, yMid + h2 + 0.6);
      const faceS = (hot) => (f) => (f.tag === 'disc' ? { fill: 'red', alpha: sep > 0.2 ? 0.5 : 0.001 } : C.review && hot && f.tag === 'side' ? { fill: 'amber', alpha: 0.36 } : {});
      if (rotT < 0.995) sweepDraw(D, [[0, yy0], [r, yMid], [0, yMid + h2]], poly, rotT, {planeFill:'sky',planeAlpha:0.05,planeEdge:'ink',planeWidth:2});
      else { const jn = (e) => (sep < 1e-4 && flip < 1e-4 ? v3(0, 0, 0) : null); D.body({ mesh: lowM, fill: 'sky', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: faceS(C.review && st === 2), dashBack: jn }); D.body({ mesh: upM, fill: 'violet', alpha: 0.26, edge: 'ink', edgeW: 2.6, faceStyle: faceS(C.review && st === 2), dashBack: jn }); }
      if (!C.problem && C.tab === 'explore' && M.mode === 'vol' && t >= 0.5) return;
      const pa = (rr, yy, off) => add3(v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), off || v3(0, 0, 0));
      if (rotT >= 0.995) {
        const ou = D.hx(sep);
        if (M.mode === 'vol' && !C.problem) {
          D.height(lp(pa(0, yMid)), lp(pa(0, yy0)), `높이 ${M.h1}`, { side: { x: -1, y: 0 }, alongFrac: 0.2 });
          D.height(pa(0, yMid, ou), pa(0, yMid + h2, ou), `높이 ${M.h2}`, { side: { x: 1, y: 0 }, alongFrac: 0.2 });
        } else {
          D.edgeLab(lp(pa(0, yy0)), lp(pa(r, yMid)), `모선 ${M.R1}`, { side: { x: -1, y: 0 } });
          D.edgeLab(pa(0, yMid + h2, ou), pa(r, yMid, ou), `모선 ${M.R2}`, { side: { x: 1, y: 0 } });
        }
        D.radius(lp(pa(0, yMid)), lp(pa(r, yMid)), `반지름 ${M.r}`, { end: true, color: 'amber' });
        D.radius(pa(0, yMid, ou), pa(r, yMid, ou), `반지름 ${M.r}`, { end: true, color: 'amber' });
                if (!C.problem && M.mode === 'vol') {
          D.areaLab(lp(v3(0, yy0 + h1 * 0.4, 0)), '아래 원뿔', lessonValue(s, C, 'svBaseReady', plainVal(M.v1)), { alpha: ease(lin01(t, 0.55, 0.9)), maxW: 0 });
          D.areaLab(add3(v3(0, yMid + h2 * 0.4, 0), ou), '위 원뿔', lessonValue(s, C, 'svSideReady', plainVal(M.v2)), { alpha: ease(lin01(t, 0.55, 0.9)), maxW: 0, color: 'violet' });
          G.sumRows(D, [[{ t: '부피 = ' }, { t: '아래 원뿔', c: 'sky' }, { t: ' + ' }, { t: '위 원뿔', c: 'violet' }], [{ t: `= ${plainVal(M.v1)} + ${plainVal(M.v2)} = ${plainVal(M.vol)}` }]], ease(lin01(t, 0.55, 0.9)));
        }
      } else {
        const o = pa(0, yMid), pr = pa(r, yMid);
        D.line(o, pr, 'amber', 2.6); D.dot(o, 'ink', 3.5);
        D.edgeLab(o, pr, C.problem ? `${M.r}` : `반지름 ${M.r}`, { side: { x: 0, y: -1 }, color: 'amber' });
        D.dim(pa(0, yy0), pr, C.problem ? `${M.R1}` : `모선 ${M.R1}`, { side: { x: 1, y: 0 }, off: 20 });
        D.dim(pr, pa(0, yMid + h2), C.problem ? `${M.R2}` : `모선 ${M.R2}`, { side: { x: 1, y: 0 }, off: 20 });
        D.label(pa(0, yy0), '축', { dir: { x: -1, y: 0.3 }, size: 13, color: 'muted', gap: 6 });
        D.dim(pa(0, yy0), o, C.problem ? `${M.h1}` : `높이 ${M.h1}`, { side: { x: -1, y: 0 }, off: 22, color: 'amber' });
        D.dim(o, pa(0, yMid + h2), C.problem ? `${M.h2}` : `높이 ${M.h2}`, { side: { x: -1, y: 0 }, off: 22, color: 'amber' });
      }
    };
    return {
      id: 'sv4-3', title: '이중원뿔', short: '이중원뿔',
      question: '삼각형을 한 변(밑변)을 축으로 돌리면 원뿔 두 개가 맞붙은 입체가 돼. 이 입체의 겉넓이에서 맞붙은 면은 어떻게 될까?',
      anim: { key: 's43T', dur: 2.5, label: '돌리고 분해하기' }, cam0: { yaw: 28, pitch: 14 }, stepT: (n) => { const lab = window.lab, s0 = lab && lab.s; return s0 && s0.svMode !== 'vol' ? 1 : [0, 0.5, 1, 1, 1][Math.min(n, 4)]; }, thumbT: 1, problemT: 0.45,
      ctl: () => ['s43T'],
      presets: () => Object.keys(DBL).map((k, i) => ({ group: i === 0 ? '삼각형' : '', label: DBL[k].label, apply: (st, lab) => { st.svDbl = k; st.s43T = 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svDbl, ['A', 'B', 'C', 'D'], 'D') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s43T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s43T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s43T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s43T === 0; }, on: (st) => st.svMode === 'vol' }]),
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
        `삼각형을 밑변을 축으로 돌리면 두 원뿔이 맞붙어요. 맞붙은 면(반지름 $${M.r}$인 원)은 겉에 드러나지 않아 <b>더하지 않아요</b>. 전개도에는 부채꼴 2개만 있어요.`,
        `각 부채꼴은 반지름이 모선이고 호의 길이가 맞붙은 원의 둘레 $${tx(V(0, 2 * M.r))}$예요. 옆넓이 $\\pi\\times${M.R1}\\times${M.r}=${tx(M.lat1)}$, $\\pi\\times${M.R2}\\times${M.r}=${tx(M.lat2)}$예요.`,
        `(겉넓이) $=${tx(M.lat1)}+${tx(M.lat2)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요. (밑넓이는 더하지 않아요.)`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines: M.mode === 'vol' ? [{text:'부피 = 두 원뿔의 부피 합',color:'ink'},{text:`$${tx(M.v1)}+${tx(M.v2)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}] : [{text:'겉넓이 = 두 원뿔의 옆넓이 합',color:'ink'},{text:`$${tx(M.lat1)}+${tx(M.lat2)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:'맞붙은 밑면은 겉면이 아니에요.',color:'ink'}]} : null,
        guide: `<b>돌리고 분해하기</b> 막대를 끌어 보세요. 앞쪽 절반은 삼각형이 축 둘레를 <b>제자리에서 돌고</b>, 뒤쪽 절반은 겉넓이에서는 옆면이 <b>부채꼴 2개</b>로 펼쳐지고, 부피에서는 위 원뿔이 <b>오른쪽으로</b> 옮겨 가며 ${span('red', '맞붙은 면')}을 드러내요. 마지막에 아래 원뿔이 제자리에서 뒤집혀 밑면이 아래로 와요. 칩에서 삼각형을 바꿔 보세요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.mode === 'vol' ? [rd('아래 원뿔의 부피', plainVal(M.v1) + ' cm³', 'sky', `⅓ × π × ${M.r} × ${M.r} × ${M.h1}`), rd('위 원뿔의 부피', plainVal(M.v2) + ' cm³', 'violet', `⅓ × π × ${M.r} × ${M.r} × ${M.h2}`), rd('부피', plainVal(M.vol) + ' cm³', 'green', '아래 + 위')] : [rd('아래 원뿔의 옆넓이', plainVal(M.lat1) + ' cm²', 'sky', `π×${M.R1}×${M.r}`), rd('위 원뿔의 옆넓이', plainVal(M.lat2) + ' cm²', 'violet', `π×${M.R2}×${M.r}`), rd('맞붙은 면의 넓이(겉넓이에서 제외)', plainVal(M.disc) + ' cm²', 'red'), rd('겉넓이', plainVal(M.surf) + ' cm²', 'green')],
        formula: `<p>(겉넓이) $=$ (아래 원뿔의 옆넓이) $+$ (위 원뿔의 옆넓이) (맞붙은 면은 제외) &nbsp;,&nbsp; (부피) $=\\frac{1}{3}\\times$ (밑넓이) $\\times$ (두 높이의 합)</p>`,
        rule: '이중원뿔의 겉넓이 = 두 원뿔의 옆넓이의 합 (맞붙은 밑면은 더하지 않아요)',
        notes: notes('<b>함정</b>: 두 원뿔의 밑넓이를 더하지 않아요. 맞붙은 면은 입체의 속이에요.', '부피는 두 원뿔을 따로 구해 더하거나, 밑넓이 $\\times$ (두 높이의 합) $\\times\\frac{1}{3}$로 한 번에 구해요.')
      }),
      prob: (M) => {
        let wrongs;
        const tri = `한 꼭짓점에서 밑변에 내린 수선의 발이 밑변을 $${M.h1}\\,\\mathrm{cm}$와 $${M.h2}\\,\\mathrm{cm}$로 나누고, 수선의 길이가 $${M.r}\\,\\mathrm{cm}$, 나머지 두 변이 $${M.R1}\\,\\mathrm{cm}$, $${M.R2}\\,\\mathrm{cm}$인 삼각형`;
        if (M.mode === 'vol') wrongs = [[vadd(M.vol, vmul(M.disc, 1)), '부피에 밑넓이를 더하지 않아요.'], [vmul(M.vol, 3), '$\\frac{1}{3}$을 곱하지 않았어요.'], [V(0, (M.r * M.r * M.R1) / 3 + (M.r * M.r * M.R2) / 3), '높이가 아니라 모선(변의 길이)을 썼어요.'], [M.surf, '겉넓이를 구했어요.'], [vmul(M.vol, 1 / 2), '$\\frac{1}{3}$을 곱해야 해요.']];
        else wrongs = [[vadd(M.surf, vmul(M.disc, 2)), '맞붙은 면은 겉에 드러나지 않아요. 밑넓이를 더하지 않아요.'], [vadd(M.surf, M.disc), '맞붙은 면은 겉에 드러나지 않아요.'], [M.lat1, '한쪽 원뿔의 옆넓이만 구했어요. 두 원뿔 모두 더해야 해요.'], [V(0, M.r * (M.h1 + M.h2)), '모선이 아니라 높이를 썼어요.'], [vmul(M.vol, 1), '부피를 구했어요.']];
        return { tag: M.mode === 'vol' ? '이중원뿔의 부피' : '이중원뿔의 겉넓이 (함정: 붙은 면)', key: `${M.mode}|${M.key}`, stem: `그림과 같이 ${tri}을 밑변을 축으로 한 바퀴 돌려 만든 입체의 ${M.mode === 'vol' ? '부피' : '겉넓이'}는?`, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  /* ================================================================ 조각 줄 전개도(원뿔 옆면 부채꼴 + 원기둥 옆면 직사각형 + 원): sv4-2(긴 밑변이 축)·sv4-4 */
  function compNet(b, s, C, o) {
    const simple = o.simple && !(C.lesson && C.review); // 해설에서만 현재 자막에 맞춰 수치를 공개합니다.
    const D = G.scene3(b, s, C, { yaw: 0, pitch: 0 }), st = C.step, thumb = !!b.thumb, u = C.review || thumb ? 1 : clamp((C.t - 0.5) * 2, 0, 1), e = ease(u), nar = b.W < 560;
    const { r, R, H, nCirc } = o, th = (360 * r) / R, gap = Math.max(1.4, r * 0.6);
    const secPts = (a) => { const out = []; for (let i = 0; i <= 48; i++) { const f = -90 - a / 2 + (a * i) / 48; out.push(v3(R * Math.cos(f * DEG), R * Math.sin(f * DEG), 0)); } return out; };
    const full = secPts(th), ys = full.map((q) => q.y).concat([0]), xs = full.map((q) => q.x).concat([0]);
    const sec = { w: Math.max(...xs) - Math.min(...xs), x0: (Math.max(...xs) + Math.min(...xs)) / 2, ymin: Math.min(...ys) };
    const rect = { w: 2 * PI * r }, cg = 0.8, circW = nCirc * 2 * r + (nCirc - 1) * cg;
    // 두 줄 배치: 위 줄 = 부채꼴 · 원(들), 아래 줄 = 직사각형(가로가 길어서 따로)
    const W1 = sec.w + gap + circW, rowGap = Math.max(gap, 4.6) + (nar ? 0.6 : 0);
    const secCx = -W1 / 2 + sec.w / 2, circL = -W1 / 2 + sec.w + gap, yBot = Math.min(sec.ymin, -2 * r) - rowGap;
    const apex = v3(secCx - sec.x0, 0, 0), arcAt = (a) => secPts(a).map((q) => add3(q, apex));
    const rx0 = -rect.w / 2, rx1 = rect.w / 2, ry0 = yBot, ry1 = yBot - H;
    const cs = []; for (let i = 0; i < nCirc; i++) cs.push(v3(circL + r + i * (2 * r + cg), -r, 0));
    const all = arcAt(th).concat([apex, v3(rx0, ry0, 0), v3(rx1, ry1, 0)]); cs.forEach((c) => { all.push(v3(c.x - r, c.y - r, 0)); all.push(v3(c.x + r, c.y + r, 0)); });
    D.fit(all, [], simple ? {l:25,r:(!nar && window.innerWidth>=700 ? 245 : 25),t:25,b:30} : { l: nar ? 40 : 50, r: nar ? 76 : 64, t: thumb ? 5 : (nar ? 92 : 96), b: thumb ? 5 : (nar ? 62 : 70) });
    const hot = (k) => C.review && st === k;
    D.panel([apex].concat(arcAt(th * e)), hot(o.hot.cone) ? 'amber' : 'violet', simple ? 0.06 : (hot(o.hot.cone) ? 0.4 : 0.26), 'ink', 2.4);
    if (e > 0.02) {
      const w = rect.w * e;
      D.panel([v3(-w / 2, ry0, 0), v3(w / 2, ry0, 0), v3(w / 2, ry1, 0), v3(-w / 2, ry1, 0)], hot(o.hot.cyl) ? 'amber' : 'green', simple ? 0.06 : (hot(o.hot.cyl) ? 0.4 : 0.26), 'ink', 2.4);
      cs.forEach((c) => { if (o.hemi) { const top=[]; for(let i=0;i<=48;i++){const a=PI*i/48;top.push(v3(c.x+r*e*Math.cos(a),c.y+r*e*Math.sin(a),0));} D.panel(top,'sky',0.06,'ink',2); const ell=[]; for(let i=0;i<=48;i++){const a=TAU*i/48;ell.push(v3(c.x+r*e*Math.cos(a),c.y+0.18*r*e*Math.sin(a),0));} D.path(ell,'ink',1.5,{}); } else D.panel(D.circ(c, v3(1, 0, 0), v3(0, 1, 0), r * e, 0, TAU, 72), hot(o.hot.circ) ? 'amber' : 'sky', simple ? 0.06 : (hot(o.hot.circ) ? 0.4 : 0.26), 'ink', 2.4); });
      if (u > 0.8 && !simple) D.path(arcAt(th), 'orange', 3.6, {});
      if (u > 0.8 && !simple) D.line(v3(rx0, ry0, 0), v3(rx1, ry0, 0), 'orange', 3.6);
    }
    if (thumb) return;
    if (simple) { if (u > 0.8) { D.areaLab(v3(apex.x, apex.y - R * 0.55, 0), '원뿔 옆면', '', { size: 13 }); D.areaLab(v3(0, (ry0 + ry1) / 2, 0), '원기둥 옆면', '', { size: 13 }); cs.forEach(c => D.areaLab(o.hemi ? v3(c.x,c.y+r*0.45,0) : c, o.hemi ? '반구' : '밑면', '', { size: 13 })); } return; }
    const flatA = lin01(u, 0.8, 1), arcLen = plainVal(V(0, 2 * r)), kpx = b.k || 40, endL = arcAt(th)[0];
    D.dim(apex, endL, `모선 ${R}`, { from: v3(apex.x, apex.y - R, 0), off: 20, alpha: flatA });
    D.areaLab(v3(apex.x, apex.y - R * 0.55, 0), '원뿔 옆넓이', lessonValue(s, C, 'svSideReady', plainVal(o.coneLat)), { alpha: flatA, maxW: Math.max(70, R * kpx * 0.9) });
    const arcs = arcAt(th);
    D.edgeLab(arcs[24], arcs[25], `호의 길이 ${lessonValue(s, C, 'svOtherReady', arcLen)}`, { from: apex, color: 'orange', alpha: flatA });
    D.dim(v3(rx0, ry0, 0), v3(rx1, ry0, 0), `밑면의 둘레 ${lessonValue(s, C, 'svOtherReady', arcLen)}`, { side: { x: 0, y: -1 }, off: 18, color: 'orange', alpha: flatA });
    D.dim(v3(rx1, ry0, 0), v3(rx1, ry1, 0), `높이 ${H}`, { side: { x: 1, y: 0 }, off: 18, color: 'amber', alpha: flatA });
    D.areaLab(v3(0, (ry0 + ry1) / 2, 0), '원기둥 옆넓이', lessonValue(s, C, 'svOtherReady', plainVal(o.cylLat)), { alpha: flatA, maxW: Math.max(70, rect.w * kpx * 0.9) });
    const each = plainVal(V(0, r * r));
    cs.forEach((c) => D.areaLab(o.hemi ? v3(c.x, c.y + r * 0.45, 0) : c, o.hemi ? '반구의 곡면' : '원', lessonValue(s, C, 'svBaseReady', o.hemi ? plainVal(o.circTot) : each), { alpha: flatA }));
    G.sumRows(D, [[{ t: '겉넓이 = ' }, { t: '원뿔 옆넓이', c: 'violet' }, { t: ' + ' }, { t: '원기둥 옆넓이', c: 'green' }, { t: ' + ' }, { t: o.circNm, c: 'sky' }], [{ t: `= ${plainVal(o.coneLat)} + ${plainVal(o.cylLat)} + ${plainVal(o.circTot)} = ${plainVal(o.tot)}` }]], flatA);
    const legend = C.lesson && (!s.svBaseReady || s.lessonEntry) ? o.legend.filter((_, i) => i !== 0) : o.legend;
    G.sumRows(D, legend, flatA, true);
  }

  /* ================================================================ sv4-4 복합 (원뿔 + 원기둥 + 반구) */
  const TRI4 = { A: [3, 4, 5], B: [4, 3, 5], C: [6, 8, 10], D: [5, 12, 13] }; // [r, 원뿔의 높이, 모선]
  function sv44() {
    const model = (s) => {
      const key = oneOf(s.svTri4, ['A', 'B', 'C', 'D'], 'A'), [r, hc, R] = TRI4[key], H = clamp(Math.round(s.s44H), 1, 20), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const hemi = V(0, 2 * r * r), cylLat = V(0, 2 * r * H), coneLat = V(0, r * R), surf = vadd(hemi, vadd(cylLat, coneLat));
      const vh = V(0, (2 * r * r * r) / 3), vc = V(0, r * r * H), vk = V(0, (r * r * hc) / 3), vol = vadd(vh, vadd(vc, vk));
      return { key, r, hc, R, H, mode, hemi, cylLat, coneLat, surf, vh, vc, vk, vol, ans: mode === 'vol' ? vol : surf };
    };
    // 겉넓이: 겉에 드러난 세 면을 펼친 조각(부채꼴 · 직사각형 · 반구의 곡면 = 반지름 r인 원 2개)
    const drawNet44 = (b, s, M, C) => compNet(b, s, C, { r: M.r, R: M.R, H: M.H, nCirc: 1, simple: true, hemi: true, circNm: '반구의 곡면', coneLat: M.coneLat, cylLat: M.cylLat, circTot: M.hemi, tot: M.surf, hot: { cone: 1, cyl: 2, circ: 3 },
      legend: [[{ t: `반구의 곡면 = 반지름 ${M.r}인 원 ${plainVal(V(0, M.r * M.r))} × 2 = ${plainVal(M.hemi)}`, c: 'sky' }], [{ t: '맞붙은 면은 겉에 드러나지 않아서 빼요', c: 'red' }]] });
    // 50%는 분해한 입체가 남아 있는 순간입니다. 면의 폭·반지름을 0부터
    // 키우지 않고, 같은 옆면 조각을 경첩으로 펴서 전개도로 옮깁니다.
    const drawUnfold44 = (b, s, M, C) => {
      const u = clamp((C.t - 0.5) * 2, 0, 1), e = ease(u), { r, R, H, hc } = M;
      const yaw = s.svYaw == null ? 28 : s.svYaw, pitch = s.svPitch == null ? 22 : s.svPitch;
      const D = scene3(b, s, C, { yaw: yaw * (1 - e), pitch: pitch * (1 - e) });
      const source = scene3(b, s, C), yB = -(r + H + hc) / 2, yH = yB + r, yC = yH + H;
      const N = 36, base = G.circleBase(r, N), smooth = Array(N).fill(true);
      const cone = G.solidNet(base, hc, 0, smooth, 18), cyl = G.solidNet(base, H, 1, smooth, 18);
      const conePose = G.netPose(cone.net, e), cylPose = G.netPose(cyl.net, e);

      // 완성 전개도와 같은 두 줄 배치: 부채꼴·반구 / 원기둥 옆면.
      const th = TAU * r / R, arc = Array.from({ length: 49 }, (_, i) => {
        const a = -PI / 2 - th / 2 + th * i / 48; return v3(R * Math.cos(a), R * Math.sin(a), 0);
      });
      const xs = arc.map(p => p.x).concat(0), ys = arc.map(p => p.y).concat(0);
      const secW = Math.max(...xs) - Math.min(...xs), secX = (Math.max(...xs) + Math.min(...xs)) / 2;
      const gap = Math.max(1.4, r * 0.6), rowW = secW + gap + 2 * r;
      const targetApex = v3(-rowW / 2 + secW / 2 - secX, 0, 0);
      const targetHemi = v3(-rowW / 2 + secW + gap + r, -r, 0);
      const rectTop = Math.min(...ys, -2 * r) - Math.max(gap, 4.6) - (b.W < 560 ? 0.6 : 0);
      const sourceApex = add3(source.hx(4.8 * r), v3(0, yC + hc, 0));
      const coneAnchor = lerp3(sourceApex, targetApex, e);
      // 원뿔은 위쪽으로, 원기둥은 아래쪽으로 옮겨 서로 가로지르지 않게 합니다.
      coneAnchor.y += 4 * r * e * (1 - e);
      const apex = G.applyT(conePose[0], cone.B[0]), flatPose = G.netPose(cone.net, 1);
      const flatApex = G.applyT(flatPose[cone.root], cone.B[0]);
      const flatRim = G.applyT(flatPose[cone.root], mid3(cone.A[cone.root], cone.A[(cone.root + 1) % N]));
      const turn = -PI / 2 - Math.atan2(flatRim.y - flatApex.y, flatRim.x - flatApex.x);
      const coneMove = G.compose(shiftT(sub3(coneAnchor, apex)), G.rotAbout(apex, v3(0, 0, 1), turn * e));
      const coneTs = conePose.map(T => G.compose(coneMove, T));
      const cylPoints = cyl.lat.flatMap(k => cyl.net.pieces[k].pts.map(p => G.applyT(cylPose[k], p)));
      const sourceCyl = add3(source.hx(2.4 * r), v3(0, yH + H / 2, 0));
      const cx = ease(lin01(u, 0.4, 1)), cy = ease(lin01(u, 0, 0.5));
      const cylAnchor = v3(sourceCyl.x * (1 - cx), sourceCyl.y * (1 - cy) + (rectTop - H / 2) * cy, sourceCyl.z * (1 - cx));
      const cylMove = shiftT(sub3(cylAnchor, centroid(cylPoints))), cylTs = cylPose.map(T => G.compose(cylMove, T));

      // 반구는 평면으로 펼 수 없습니다. 크기를 유지한 입체를 뒤집어 옮깁니다.
      const hp = Array.from({ length: 37 }, (_, i) => {
        const a = PI / 2 * (1 - i / 36); return [Math.max(0, r * Math.cos(a)), yH - r * Math.sin(a)];
      });
      hp[0][0] = 0; hp.push([0, yH]);
      const hemiCenter = v3(0, yH, 0), hemiAnchor = lerp3(hemiCenter, targetHemi, e);
      const flip = G.rotAbout(hemiCenter, v3(0, 0, 1), PI * e);
      const tilt = G.rotAbout(hemiCenter, v3(1, 0, 0), Math.asin(0.18) * e);
      const hemiT = G.compose(shiftT(sub3(hemiAnchor, hemiCenter)), G.compose(tilt, flip));
      const hemi = xfMesh(revolveMesh(hp, { N, tags: Array(36).fill('curve').concat('flat') }), hemiT);
      const lateralPoints = (sn, Ts) => sn.lat.flatMap(k => sn.net.pieces[k].pts.map(p => G.applyT(Ts[k], p)));
      const points = lateralPoints(cone, coneTs).concat(lateralPoints(cyl, cylTs), hemi.faces.flatMap(f => f.pts));
      D.fit(points, [], { l: 30 - 5 * e, r: window.innerWidth >= 700 && b.W >= 560 ? 245 : 30, t: 30 - 5 * e, b: 30 });
      const drawSide = (sn, Ts, color) => {
        G.netDraw(D, sn.net, Ts, pc => pc.tag === 'lat' ? { fill: color, alpha: 0.06, edge: 'ink', ew: 2.4 } : { skip: true });
        // 잘린 두 모선은 닫힌 입체의 이웃 관계와 달리 전개 중에는 경계입니다.
        for (const k of [0, 1]) D.line(G.applyT(Ts[k], sn.A[1]), G.applyT(Ts[k], sn.B[1]), 'ink', 2.4);
      };
      drawSide(cone, coneTs, 'violet'); drawSide(cyl, cylTs, 'green');
      D.body({ mesh: hemi, fill: 'sky', alpha: 0.06, edge: 'ink', edgeW: 2, faceStyle: f => f.tag === 'flat' ? { fill: 'sky', alpha: 0.025 } : {} });
      if (u > 0.8) {
        D.areaLab(lerp3(coneAnchor, centroid(lateralPoints(cone, coneTs)), 0.8), '원뿔 옆면', '', { size: 13 });
        D.areaLab(cylAnchor, '원기둥 옆면', '', { size: 13 });
        D.areaLab(add3(hemiAnchor, v3(0, r * 0.45, 0)), '반구', '', { size: 13 });
      }
    };
    const draw = (b, s, M, C) => {
      if (M.mode === 'surf' && !C.problem && ((C.review && !C.lesson) || C.t >= 1 || b.thumb)) return drawNet44(b, s, M, C);
      if (M.mode === 'surf' && !C.problem && C.t > 0.5) return drawUnfold44(b, s, M, C);
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
      const ringAt = (c, y, rr) => Array.from({ length: 16 }, (_, i) => add3(c, v3(rr * Math.cos((TAU * i) / 16), y, rr * Math.sin((TAU * i) / 16))));
      // 윤곽을 정확히: 반구(제자리에서 뒤집힘)는 지름 원 둘레, 원기둥은 위·아래 원, 원뿔은 밑원과 꼭짓점
      D.fit([].concat(ringAt(v3(0, 0, 0), yH, r), ringAt(v3(0, 0, 0), yB + r / 2, r * 0.9), [v3(0, yB, 0), v3(0, yH + r * 0.5, 0)], ringAt(D.hx(dx), yH, r), ringAt(D.hx(dx), yC, r), ringAt(D.hx(2 * dx), yC, r), [add3(D.hx(2 * dx), v3(0, yC + hc, 0))]), [], { l: C.problem ? 6 : 30, r: C.tab === 'explore' && !C.problem && window.innerWidth >= 700 && b.W >= 560 ? 245 : (C.problem ? 6 : b.W < 560 ? 80 : 30), t: C.problem ? 30 : 30, b: C.problem ? 10 : 30 });
      const lvK = !C.review ? 1 : st === 1 ? 2 : 1, lvC = !C.review ? 1 : st === 2 ? 2 : 1, lvH = !C.review ? 1 : st === 3 ? 2 : 1;
      const lv = { k: lvK, c: lvC, h: lvH };
      parts.forEach((p) => D.body({ mesh: p.m, fill: lv[p.k] === 2 ? 'amber' : p.col, alpha: lv[p.k] === 2 ? 0.38 : 0.26, edge: 'ink', edgeW: 2.6, dashBack: () => (dx < 1e-4 ? v3(0, 0, 0) : null), faceStyle: (f) => (f.tag === 'flat' && dx > r * 0.5 ? { fill: 'red', alpha: 0.4 } : f.tag === 'flat' ? { fill: p.col, alpha: 0.12 } : {}) }));
      if (!C.problem && C.tab === 'explore' && M.mode === 'vol' && t >= 0.5) return;
      const pa = (rr, yy, off) => add3(v3(rr * Math.cos(A0), yy, rr * Math.sin(A0)), D.hx(off));
      const slantBase = pa(r, yC, 2 * dx), slantTop = pa(0, yC + hc, 2 * dx);
      if (b.W < 560 && !b.thumb && !C.problem) {
        // 분해된 원뿔 오른쪽의 목차 손잡이를 피해 모선 값을 꼭짓점 위에 둡니다.
        // 입체 크기를 줄이지 않고 실제 모선 한가운데에 지시선을 연결해요.
        const label = `모선 ${M.R}`, size = D.fs(15), metrics = b.annotationSize(label, { size, weight: 800 });
        const top = D.px(slantTop), at = { x: clamp(top.x, 8 + metrics.width / 2, b.W - 32 - metrics.width / 2), y: Math.max(8 + metrics.height / 2, top.y - 24) };
        b.leader(D.px(mid3(slantBase, slantTop)), at, { ...metrics, px: true, color: 'muted', alpha: 0.78 });
        b.text(b.toW(at.x, at.y), label, { size, weight: 800, color: 'ink', align: 'center', baseline: 'middle' });
      } else D.dim(slantBase, slantTop, `모선 ${M.R}`, { side: { x: 1, y: 0 }, off: 20 });
      D.height(pa(0, yC, 2 * dx), pa(0, yC + hc, 2 * dx), `원뿔의 높이 ${M.hc}`, { side: { x: -1, y: 0 }, alongFrac: -0.1, color: 'amber' });
      D.dim(pa(r, yH, dx), pa(r, yC, dx), `높이 ${M.H}`, { side: { x: 1, y: 0 }, off: 20, color: 'amber' });
      D.radius(lp(pa(0, yH, 0)), lp(pa(r, yH, 0)), `반지름 ${M.r}`, { end: true });
      if (!C.problem && dx > r * 0.5) {
        const sv = M.mode === 'vol', hy = flipE > 0.5 ? { dy: r * b.k * Math.abs(D.cam.sp) + 22 } : { dy: 22 }; // 뒤집힌 반구는 밑면 아래 바깥에
        D.areaLab(flipE > 0.5 ? lp(pa(0, yH, 0)) : lp(pa(0, yB + r * 0.5, 0)), sv ? '반구' : '반구의 곡면', lessonValue(s, C, 'svBaseReady', plainVal(sv ? M.vh : M.hemi)), hy);
        D.areaLab(pa(0, (yH + yC) / 2, dx), sv ? '원기둥' : '원기둥 옆넓이', lessonValue(s, C, 'svOtherReady', plainVal(sv ? M.vc : M.cylLat)), { maxW: sv ? 0 : r * b.k * 1.6 });
        D.areaLab(pa(0, yC + hc * 0.12, 2 * dx), sv ? '원뿔' : '원뿔 옆넓이', lessonValue(s, C, 'svSideReady', plainVal(sv ? M.vk : M.coneLat)), { dy: 12, maxW: sv ? 0 : r * b.k * 1.2 });
        if (sv) G.sumRows(D, [[{ t: '부피 = ' }, { t: '반구', c: 'sky' }, { t: ' + ' }, { t: '원기둥', c: 'green' }, { t: ' + ' }, { t: '원뿔', c: 'violet' }], [{ t: `= ${plainVal(M.vh)} + ${plainVal(M.vc)} + ${plainVal(M.vk)} = ${plainVal(M.vol)}` }]], ease(lin01(dx / (r * 2.4), 0.3, 0.7)));
      }
    };
    return {
      id: 'sv4-4', title: '복합 입체', short: '복합 입체',
      question: '원뿔·원기둥·반구를 이어 붙인 입체의 겉넓이는 어떻게 구할까? 맞붙은 면은 어떻게 될까?',
      anim: { key: 's44T', dur: 2.5, label: '분해하기 · 펼치기' }, cam0: { yaw: 28, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['s44H', 's44T'],
      presets: () => Object.keys(TRI4).map((k, i) => ({ group: i === 0 ? '원뿔의 (r, 높이, 모선)' : '', label: TRI4[k].join('·'), apply: (st, lab) => { st.svTri4 = k; st.revealed = false; st.step = 0; lab?._buildProblem?.(); }, on: (st) => oneOf(st.svTri4, ['A', 'B', 'C', 'D'], 'A') === k })).concat([{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.s44T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s44T === 0; }, on: (st) => st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.s44T = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.s44T === 0; }, on: (st) => st.svMode === 'vol' }]),
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
        `원뿔의 옆넓이는 전개도의 부채꼴이에요. $\\pi\\times${M.R}\\times${M.r}=${tx(M.coneLat)}$예요. 원뿔의 밑면은 원기둥과 붙어서 더하지 않아요.`,
        `원기둥의 옆면은 가로가 밑면의 둘레 $2\\times\\pi\\times${M.r}$, 세로가 높이 $${M.H}$인 직사각형이에요. 넓이 $2\\pi\\times${M.r}\\times${M.H}=${tx(M.cylLat)}$예요. 위·아래 밑면은 모두 붙어서 더하지 않아요.`,
        `반구의 곡면은 펼 수 없어서 넓이만 구해요. 구의 절반이므로 $\\frac{1}{2}\\times4\\pi\\times${M.r}^2=${tx(M.hemi)}$예요. 반구의 평평한 면도 붙어서 더하지 않아요.`,
        `(겉넓이) $=${tx(M.coneLat)}+${tx(M.cylLat)}+${tx(M.hemi)}=${tx(M.surf)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines: M.mode === 'vol' ? [{text:'부피 = 세 입체의 부피 합',color:'ink'},{text:`$${tx(M.vk)}+${tx(M.vc)}+${tx(M.vh)}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}] : [{text:'겉넓이 = 겉으로 드러난 면의 합',color:'ink'},{text:`$${tx(M.coneLat)}+${tx(M.cylLat)}+${tx(M.hemi)}=${tx(M.surf)}\\,\\mathrm{cm}^{2}$`,color:'ink'},{text:'반구 곡면은 구 겉넓이의 절반',color:'ink'},{text:'맞붙은 면은 더하지 않아요.',color:'ink'}]} : null,
        guide: `<b>분해하기 · 펼치기</b> 막대를 끌어 보세요. ${M.mode === 'surf' ? `앞부분에서는 원기둥·원뿔이 ${span('sky', '오른쪽으로')} 옮겨지며 맞붙었던 ${span('red', '평평한 면')}이 드러나요. 뒷부분에서는 원뿔과 원기둥의 옆면을 펼쳐 나란히 놓아요. 반구의 곡면은 펼치지 않고 입체로 보여요.` : `겉넓이를 누르면 원뿔과 원기둥은 펼쳐지고, 반구의 곡면은 입체로 보여요. 원기둥·원뿔이 ${span('sky', '오른쪽으로')} 옮겨지고 반구는 제자리에서 뒤집히면서 서로 맞붙었던 ${span('red', '평평한 면')}이 빨갛게 드러나요.`} 칩에서 원뿔의 모양을, 막대로 원기둥의 높이를 바꿔 보세요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : M.mode === 'vol' ? [rd('원뿔', plainVal(M.vk) + ' cm³', 'violet'), rd('원기둥', plainVal(M.vc) + ' cm³', 'green'), rd('반구', plainVal(M.vh) + ' cm³', 'sky'), rd('부피', plainVal(M.vol) + ' cm³', 'amber')] : [rd('원뿔의 옆면', plainVal(M.coneLat) + ' cm²', 'violet', `π × ${M.R} × ${M.r}`), rd('원기둥의 옆면', plainVal(M.cylLat) + ' cm²', 'green', `2 × π × ${M.r} × ${M.H}`), rd('반구의 곡면', plainVal(M.hemi) + ' cm²', 'sky', `2 × π × ${M.r} × ${M.r}`), rd('겉넓이', plainVal(M.surf) + ' cm²', 'amber', '붙은 면 제외')],
        formula: `<p>(겉넓이) $=$ (원뿔 옆넓이) $+$ (원기둥 옆넓이) $+$ (반구의 곡면) &nbsp;(맞붙은 면은 더하지 않아요)</p>`,
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
