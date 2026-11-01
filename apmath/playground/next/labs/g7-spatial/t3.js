/* ==========================================================================
   중1 · 위치 관계 — 탭 ③ 「평면이 정해지는 조건」 (t3.js, order 30) — 장면 6개
   · s3-1 한 직선 위에 있지 않은 세 점 · s3-2 한 직선과 그 밖의 한 점 · s3-3 한 점에서 만나는 두 직선 · s3-4 평행한 두 직선
   · s3-5 [반례] 꼬인 위치의 두 직선은 평면이 없다 · s3-6 꼭짓점 세 점으로 만드는 평면의 개수
   평면은 「책장」처럼 직선 둘레를 돌며 무수히 많아요. 시험 평면(초록)을 돌려 보며 원하는 점·직선을 모두 포함하는 평면이 몇 개인지 알아봅니다.
   (제자리 회전만 쓰고 이동은 없어요.) 모든 글자·판정·정답은 지금의 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G) return;
  const { lineRel, jo, DEG, clamp, pick, rint, shuffle, v3, add3, sub3, mul3, dot3, cross3, len3, unit3, lerp3, mid3, scene3, buildSolid, classify, edgeByKey, fit, bboxOf, P, VIEW, mkChoices, mkText, rd, notes, ov, drawSolid, drawVerts, LET } = G;

  const PARAMS = {
    spCd: P('점의 위치 (직선에서 떨어진 거리)', 0, 1.8, 0.05, 1.2, { color: 'amber', hint: '0으로 맞추면 점이 직선 위에 놓여요', format: (v) => v.toFixed(2) }),
    spCl: P('직선 사이의 거리', 0.4, 1.8, 0.05, 1.2, { color: 'amber', hint: '두 직선 사이의 간격을 바꿔요', format: (v) => v.toFixed(2) }),
    spAl: P('두 직선이 이루는 각', 20, 160, 1, 60, { color: 'amber', hint: '각이 바뀌어도 평면은 하나예요', format: (v) => Math.round(v) + '°' }),
    spDs: P('직선 m 옮기기 (앞뒤)', 0, 1.8, 0.05, 0.9, { color: 'amber', hint: '0이면 m이 l 위의 한 점을 지나가요', format: (v) => v.toFixed(2) }),
    spTl: P('직선 m 기울이기', 0, 60, 1, 35, { color: 'amber', hint: '0°이면 m이 바닥과 나란해요', format: (v) => Math.round(v) + '°' }),
    spGm: P('직선 m을 돌리기', 0, 90, 1, 55, { color: 'amber', hint: '제자리에서 돌려요. 기울기도 0°이면 l과 같은 방향이에요', format: (v) => Math.round(v) + '°' }),
    spTh: P('시험 평면 돌리기', 0, 180, 1, 0, { color: 'green', hint: '직선 둘레로 평면을 돌려 보세요', format: (v) => Math.round(v) + '°' })
  };
  const C2 = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const span = (c, t) => `<b style="color:var(--m-${c})">${t}</b>`;
  const U = v3(1, 0, 0), E1 = v3(0, 1, 0), E2 = v3(0, 0, 1);
  const wdir = (deg) => add3(mul3(E1, Math.cos(deg * DEG)), mul3(E2, Math.sin(deg * DEG)));
  const mod180 = (a) => ((a % 180) + 180) % 180;

  /* ------------------------------------------------------------ 책장 모형: 직선(x축) 둘레의 평면들 */
  const PHI_CROSS = 35; // 두 직선이 만나는 평면의 기울기(제자리 회전만 하므로 비스듬해도 돼요)
  function fanModel(type, s) {
    const d = s.spCd == null ? 1.2 : s.spCd, A = v3(-1.8, 0, 0), B = v3(1.8, 0, 0);
    let objs = [], lines = [], pts = [], axisName = '', extra = {};
    const pc = (dd) => add3(mul3(wdir(0), dd), v3(0.5, 0, 0)); // 점·직선 사이 간격은 바닥과 나란히(앞뒤로) 벌어져요
    if (type === 'pts') {
      const Cp = pc(d); objs = [{ k: 'pt', p: Cp }];
      pts = [{ p: A, n: 'A', c: 'amber' }, { p: B, n: 'B', c: 'amber' }, { p: Cp, n: 'C', c: 'rose' }]; axisName = '직선 AB';
    } else if (type === 'linept') {
      const Cp = pc(d); objs = [{ k: 'pt', p: Cp }];
      pts = [{ p: Cp, n: 'A', c: 'rose' }]; lines = [{ p: v3(-2.8, 0, 0), q: v3(2.8, 0, 0), c: 'sky', n: 'l', thick: 5 }]; axisName = '직선 l';
    } else if (type === 'cross') {
      const al = s.spAl == null ? 60 : s.spAl, dm = add3(mul3(U, Math.cos(al * DEG)), mul3(wdir(PHI_CROSS), Math.sin(al * DEG)));
      objs = [{ k: 'ln', p: v3(0, 0, 0), d: dm }];
      lines = [{ p: v3(-2.8, 0, 0), q: v3(2.8, 0, 0), c: 'sky', n: 'l', thick: 5 }, { p: mul3(dm, -2.6), q: mul3(dm, 2.6), c: 'rose', n: 'm', thick: 5 }];
      pts = [{ p: v3(0, 0, 0), n: 'O', c: 'amber' }]; axisName = '직선 l'; extra = { al, dm };
    } else if (type === 'par') {
      const dd = s.spCl == null ? 1.2 : s.spCl, Q = mul3(wdir(0), dd);
      objs = [{ k: 'ln', p: Q, d: U }];
      lines = [{ p: v3(-2.8, 0, 0), q: v3(2.8, 0, 0), c: 'sky', n: 'l', thick: 5 }, { p: add3(Q, v3(-2.8, 0, 0)), q: add3(Q, v3(2.8, 0, 0)), c: 'rose', n: 'm', thick: 5 }];
      extra = { dd, Q }; axisName = '직선 l';
    } else { // skew: 직선 m 은 바닥 위의 점 (0, d, 0) 을 지나요. d 만큼 앞뒤로 옮기고, 가로 방향 g 로 돌리고, t 만큼 기울여요.
      const d = s.spDs == null ? 0.9 : s.spDs, g = s.spGm == null ? 55 : s.spGm, tl = s.spTl == null ? 35 : s.spTl;
      const dm = v3(Math.cos(g * DEG) * Math.cos(tl * DEG), Math.sin(g * DEG) * Math.cos(tl * DEG), Math.sin(tl * DEG)), Q = v3(0, d, 0);
      objs = [{ k: 'ln', p: Q, d: dm }];
      lines = [{ p: v3(-2.8, 0, 0), q: v3(2.8, 0, 0), c: 'sky', n: 'l', thick: 5 }, { p: add3(Q, mul3(dm, -2.6)), q: add3(Q, mul3(dm, 2.6)), c: 'rose', n: 'm', thick: 5 }];
      extra = { d, g, tl, dm, Q, rel: lineRel(v3(0, 0, 0), U, Q, dm) }; axisName = '직선 l';
    }
    // 평면이 있는지(몇 개인지)와 그 각
    const perp = (v) => sub3(v, mul3(U, dot3(v, U)));
    const O0 = v3(0, 0, 0);
    const contains = (th) => {
      const n = cross3(U, wdir(th));
      return objs.every((o) => {
        const offOk = Math.abs(dot3(n, sub3(o.p, O0))) < 0.05;
        if (o.k === 'pt') return offOk;
        return offOk && Math.abs(dot3(n, unit3(o.d))) < 0.04;
      });
    };
    let phi = null, nPl = 0;
    const o0 = objs[0];
    const v0 = o0.k === 'pt' ? perp(sub3(o0.p, O0)) : (len3(perp(unit3(o0.d))) > 1e-3 ? perp(o0.d) : perp(sub3(o0.p, O0)));
    if (len3(v0) < 0.06 && objs.every((o) => (o.k === 'pt' ? len3(perp(o.p)) < 0.06 : len3(perp(o.p)) < 0.06 && len3(perp(unit3(o.d))) < 0.045))) nPl = 'inf';
    else {
      const th = mod180(Math.atan2(dot3(v0, E2), dot3(v0, E1)) / DEG);
      if (contains(th) || contains(th + 0.01)) { nPl = 1; phi = th; }
    }
    return { type, objs, lines, pts, A, B, nPl, phi, contains, axisName, extra, d };
  }

  function drawFan(D, F, theta, C, o = {}) {
    const { b } = D;
    const W = 2.5, S = 2.9;
    const page = (th, w0 = -W, w1 = W) => { const w = wdir(th); return [add3(v3(-S, 0, 0), mul3(w, w0)), add3(v3(S, 0, 0), mul3(w, w0)), add3(v3(S, 0, 0), mul3(w, w1)), add3(v3(-S, 0, 0), mul3(w, w1))]; };
    D.fitPts([v3(-S, -W, -W), v3(S, W, W)].concat(F.pts.map((q) => q.p), F.lines.flatMap((l) => [l.p, l.q])), { t: C.problem ? 50 : 64, b: 56, l: 40, r: 40 });
    // 책장처럼 펼친 평면들(연하게)
    if (o.fan !== false) {
      const ths = [0, 45, 90, 135];
      ths.map((th) => ({ th, dep: D.depth(mid3(page(th)[0], page(th)[2])) })).sort((a, c) => c.dep - a.dep).forEach(({ th }) => D.panel(page(th), 'ink', 0.035, 'ink', 1.2, { alpha: 0.45 }));
    }
    // 정해진 평면(노랑)
    if (o.plane && F.phi != null) D.panel(page(F.phi), 'amber', 0.17, 'amber', 2.6);
    // 시험 평면(초록)
    const ok = F.contains(theta);
    if (o.test !== false) D.panel(page(theta), ok ? 'green' : 'violet', 0.22, ok ? 'green' : 'violet', 3);
    // 직선·점
    F.lines.forEach((l) => D.line(l.p, l.q, l.c, l.thick || 4.5));
    if (F.type === 'pts') { D.line(F.A, F.B, 'sky', 5); if (F.nPl !== 'inf') D.path([F.A, F.pts[2].p, F.B], 'amber', 2.4, { dash: [6, 5] }); }
    F.pts.forEach((q) => { b.point(D.P(q.p), { color: q.c, r: 6.5 }); D.obstacle(q.p, 9); });
    // 시험 평면이 지나지 못하는 직선: 평면을 뚫는 점
    if (o.pierce && F.objs[0].k === 'ln' && !ok) {
      const ob = F.objs[0], n = cross3(U, wdir(theta)), den = dot3(n, ob.d);
      if (Math.abs(den) > 0.03) { const t = -dot3(n, ob.p) / den, X = add3(ob.p, mul3(ob.d, t)); if (len3(X) < 4) { b.point(D.P(X), { color: 'rose', r: 6 }); D.obstacle(X, 8); if (C.txt && F.type === 'skew') D.label(X, '한 점에서만 만나요', { color: 'rose', size: 15, dir: { x: 0, y: -1 }, gap: 12 }); } }
    }
    // 글자
    if (C.txt) {
      F.lines.forEach((l) => D.label(l.q, l.n, { color: l.c, size: 18, dir: { x: 1, y: 0 }, gap: 10 }));
      F.pts.forEach((q) => D.label(q.p, q.n, { color: q.c, size: 18, dir: D.out(q.p, v3(0, 0, 0)), gap: 10 }));
      if (F.type === 'cross' && o.angle) {
        const al = D.arc(v3(0, 0, 0), U, F.extra.dm, 0.85, 'amber', 1);
        D.label(mul3(add3(U, F.extra.dm), 0.55), `${Math.round(F.extra.al)}°`, { color: 'amber', size: 17, dir: D.out(mul3(add3(U, F.extra.dm), 0.55), v3(0, 0, 0)), gap: 14 });
        void al;
      }
      if (F.type === 'par') {
        const q = F.extra.Q, m1 = v3(1.2, 0, 0), m2 = add3(q, v3(1.2, 0, 0));
        D.line(m1, m2, 'amber', 2.4, { dash: [4, 4] });
        D.label(mid3(m1, m2), `${F.extra.dd.toFixed(2)}`, { color: 'amber', size: 16, dir: { x: 1, y: 0 }, gap: 10 });
        D.par(F.lines[0].p, F.lines[0].q, 1, 'sky', 0.72); D.par(F.lines[1].p, F.lines[1].q, 1, 'sky', 0.72);
      }
    }
    D.flush();
    return ok;
  }

  /* 탐구 맨 위 판정 문구 */
  function capFan(b, F, theta, C) {
    if (!C.txt || C.problem) return;
    const ok = F.contains(theta);
    const txt = F.nPl === 'inf' ? '어느 평면이든 지나요 → 평면이 무수히 많아요' : F.nPl === 0 ? (ok ? '' : '이 평면은 두 직선을 모두 포함하지 못해요') : ok ? '이 평면이 모두 지나요 → 평면 1개 고정!' : '이 평면은 지나지 못해요';
    if (!txt) return;
    b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, txt, { color: ok || F.nPl === 'inf' ? 'green' : 'rose', size: b.W < 560 ? 14.5 : 17, weight: 800, align: 'center', baseline: 'middle' });
  }

  /* ------------------------------------------------------------ 책장형 장면 공통 */
  const PL = { inf: '무수히 많아요', 0: '없어요', 1: '1개' };
  function fanScene(cfg) {
    const D = {
      id: cfg.id, title: cfg.title, short: cfg.short, question: cfg.question,
      cam0: { yaw: -28, pitch: 30 },
      ctl: (s) => cfg.ctl.concat(['spTh'], VIEW),
      anim: { key: 'spT', dur: 6, label: '평면 돌려 보기', start: 0 },
      onAnim: (s, t) => { s.spTh = Math.round(t * 180); },
      problemT: 0,
      init: (s) => { Object.assign(s, cfg.init); s.spT = 0; s.spTh = cfg.init.spTh == null ? 0 : cfg.init.spTh; s.spPq = cfg.pq ? cfg.pq(s, true) : null; },
      reroll: (s) => { s.spPq = cfg.pq(s, false); },
      model: (s) => ({ F: fanModel(cfg.type, s), s, pq: s.spPq }),
      draw(b, s, M, C) {
        const Dr = scene3(b, s, C);
        if (C.problem) { cfg.drawProb(Dr, b, s, M, C); return; }
        let F = M.F, th = s.spTh == null ? 0 : s.spTh;
        if (C.review) {
          const st = C.step;
          const s2 = Object.assign({}, s);
          if (st >= 3 && cfg.step3) Object.assign(s2, cfg.step3);
          F = fanModel(cfg.type, s2);
          th = st <= 1 ? 0 : F.phi != null ? F.phi : 60;
          if (st === 1) { drawFan(Dr, F, th, C, { plane: false, test: false, angle: true }); return; }
          drawFan(Dr, F, th, C, { plane: st >= 2, test: st >= 2, angle: true, pierce: true });
          capFan(b, F, th, C);
          return;
        }
        drawFan(Dr, F, th, C, { plane: false, test: true, angle: true, pierce: true });
        capFan(b, F, th, C);
      },
      steps: (M) => cfg.steps(M),
      view: (M, C, s) => {
        const F = M.F, th = s.spTh == null ? 0 : s.spTh, ok = F.contains(th);
        const rows = cfg.rows(M, ok);
        return {
          guide: cfg.guide + ' 시험 평면(<b style="color:var(--m-green)">초록</b>)을 돌려 <b>' + cfg.need + '</b>을(를) 모두 포함하는 평면이 몇 개인지 찾아보세요. 빈 곳을 끌면 시점이 돌아가요.',
          readouts: rows,
          formula: cfg.formula(M),
          rule: cfg.rule,
          notes: cfg.notes
        };
      },
      prob: (M) => cfg.prob(M)
    };
    return D;
  }
  const rdPl = (F, label) => rd(label, F.nPl === 'inf' ? '무수히 많아요' : F.nPl === 0 ? '없어요' : '1개', F.nPl === 1 ? 'green' : F.nPl === 0 ? 'rose' : 'amber', F.nPl === 1 ? '딱 하나로 정해져요' : F.nPl === 'inf' ? '풍차처럼 돌아가요' : '', null, true);
  const rdTest = (ok, what) => rd('지금 돌린 평면', ok ? `${what}${jo(what, 'eul')} 지나요` : `${what}${jo(what, 'eul')} 지나지 못해요`, ok ? 'green' : 'violet');

  /* ---- 5지선다(평면의 개수 5가지 보기) */
  const PCH = [['평면이 없다', 0], ['1개', 1], ['2개', 2], ['3개', 3], ['무수히 많다', 'inf']];
  const planeChoices = (ans, hints) => mkText(PCH.map(([t, v]) => ({ h: t, ok: v === ans, hint: v === ans ? '' : (hints[v] || '') })));
  const HINT_COMMON = { 0: '이 조건에서는 평면이 반드시 하나는 있어요.', 2: '평면이 정해지면 하나뿐이에요. 두 개가 되지 않아요.', 3: '평면이 정해지면 하나뿐이에요.' };

  const S = [];
  /* ---------------- s3-1 세 점 */
  S.push(fanScene({
    id: 's3-1', type: 'pts', title: '한 직선 위에 있지 않은 세 점', short: '세 점',
    question: '세 점을 지나는 평면은 몇 개일까? 세 점이 한 직선 위에 있을 때와 있지 않을 때를 비교해 보자.',
    ctl: ['spCd'], init: { spCd: 1.2, spTh: 75 }, step3: { spCd: 0 },
    guide: '두 점 A, B를 지나는 평면은 직선 AB 둘레로 돌아가는 책장처럼 무수히 많아요. 막대로 <b>점 C</b>의 위치를 바꿔 보세요.', need: '세 점 A, B, C',
    rows: (M, ok) => [rdPl(M.F, 'A, B, C를 지나는 평면'), rd('점 C와 직선 AB 사이의 거리', M.F.d.toFixed(2), 'amber', M.F.d < 0.05 ? '세 점이 한 직선 위에 있어요' : ''), rdTest(ok, '점 C')],
    steps: (M) => ['두 점 A, B를 지나는 직선 AB를 그어요. 이 직선을 포함하는 평면은 책장처럼 무수히 많아요.', '점 C가 직선 AB 밖에 있으면, 그 평면들 중 C를 지나는 평면은 딱 하나예요. 한 직선 위에 있지 않은 세 점은 평면을 하나로 정해요.', '점 C가 직선 AB 위에 있으면 세 점이 한 직선 위에 있어서 평면이 하나로 정해지지 않아요. 평면이 무수히 많아요.'],
    formula: () => '<p>한 직선 위에 있지 않은 세 점 → 평면 $1$개</p><p>한 직선 위에 있는 세 점 → 평면 무수히 많음</p>',
    rule: '한 직선 위에 있지 않은 서로 다른 세 점은 평면을 하나로 정한다',
    notes: notes('“세 점이면 평면이 정해진다”가 아니에요. <b>한 직선 위에 있지 않은</b> 세 점이어야 해요.', '삼발이(다리 세 개)가 울퉁불퉁한 바닥에서도 흔들리지 않는 까닭이에요.'),
    pq: (s, first) => ({ col: first ? false : Math.random() < 0.5 }),
    drawProb: (D, b, s, M, C) => {
      const col = !!(M.pq && M.pq.col), A = v3(-1.7, -0.4, -0.5), Bp = v3(0.4, 0.3, 0.3), Cp = col ? add3(A, mul3(sub3(Bp, A), 2)) : v3(1.2, 1.5, -0.9);
      D.fitPts([A, Bp, Cp], { t: 50, b: 56, l: 60, r: 60 });
      D.line(A, Cp, 'sky', 3.2, { dash: [6, 5], alpha: 0.7 });
      D.line(A, Bp, 'sky', 4); D.line(Bp, Cp, 'sky', 4);
      [['A', A], ['B', Bp], ['C', Cp]].forEach(([n, p]) => { b.point(D.P(p), { color: 'amber', r: 6.5 }); D.obstacle(p, 9); });
      [['A', A], ['B', Bp], ['C', Cp]].forEach(([n, p]) => D.label(p, n, { color: 'amber', size: 18, dir: { x: 0, y: -1 }, gap: 12 }));
      D.flush();
    },
    prob: (M) => {
      const col = !!(M.pq && M.pq.col), ans = col ? 'inf' : 1;
      return { tag: '평면이 정해지는 조건', key: 'c' + col, stem: '그림과 같이 공간에 세 점 $A, B, C$가 있다. 세 점을 모두 지나는 평면은 몇 개인가?', choices: planeChoices(ans, Object.assign({}, HINT_COMMON, { 1: '세 점이 한 직선 위에 있으면 평면이 하나로 정해지지 않아요.', inf: '세 점이 한 직선 위에 있지 않으면 평면이 하나로 정해져요.' })) };
    }
  }));
  /* ---------------- s3-2 직선과 그 밖의 한 점 */
  S.push(fanScene({
    id: 's3-2', type: 'linept', title: '한 직선과 그 밖의 한 점', short: '직선과 점',
    question: '직선 $l$과 점 $A$를 모두 지나는 평면은 몇 개일까? 점 $A$가 직선 위에 있을 때는 어떨까?',
    ctl: ['spCd'], init: { spCd: 1.2, spTh: 75 }, step3: { spCd: 0 },
    guide: '직선 $l$을 포함하는 평면은 책장처럼 무수히 많아요. 막대로 <b>점 A</b>의 위치를 바꿔 보세요.', need: '직선 $l$과 점 $A$',
    rows: (M, ok) => [rdPl(M.F, 'l과 A를 모두 포함하는 평면'), rd('점 A와 직선 l 사이의 거리', M.F.d.toFixed(2), 'amber', M.F.d < 0.05 ? '점이 직선 위에 있어요' : ''), rdTest(ok, '점 A')],
    steps: () => ['직선 $l$을 포함하는 평면은 책장처럼 무수히 많아요.', '점 $A$가 직선 $l$ 밖에 있으면, 그 평면들 중 $A$를 지나는 평면은 딱 하나예요.', '점 $A$가 직선 $l$ 위에 있으면 평면이 무수히 많아서 하나로 정해지지 않아요.'],
    formula: () => '<p>직선과 그 직선 밖의 한 점 → 평면 $1$개</p><p>직선 위의 점 → 평면 무수히 많음</p>',
    rule: '한 직선과 그 직선 밖의 한 점은 평면을 하나로 정한다',
    notes: notes('점이 직선 <b>밖에</b> 있어야 해요. 직선 위의 점은 평면을 정해 주지 못해요.', '직선 위의 두 점과 밖의 한 점을 잡으면 “한 직선 위에 있지 않은 세 점”과 같아요.'),
    pq: (s, first) => ({ on: first ? false : Math.random() < 0.5 }),
    drawProb: (D, b, s, M, C) => {
      const on = !!(M.pq && M.pq.on), p0 = v3(-2.4, -0.45, -0.3), p1 = v3(2.4, 0.5, 0.3), A = on ? lerp3(p0, p1, 0.55) : v3(0.8, 1.3, 0.9);
      D.fitPts([p0, p1, A], { t: 50, b: 56, l: 60, r: 60 });
      D.line(p0, p1, 'sky', 5); b.point(D.P(A), { color: 'rose', r: 6.5 }); D.obstacle(A, 9);
      D.label(p1, 'l', { color: 'sky', size: 18, dir: { x: 1, y: 0 }, gap: 10 }); D.label(A, 'A', { color: 'rose', size: 18, dir: { x: 0, y: -1 }, gap: 12 });
      D.flush();
    },
    prob: (M) => {
      const on = !!(M.pq && M.pq.on);
      return { tag: '평면이 정해지는 조건', key: 'o' + on, stem: '그림과 같이 직선 $l$과 점 $A$가 있다. 직선 $l$과 점 $A$를 모두 포함하는 평면은 몇 개인가?', choices: planeChoices(on ? 'inf' : 1, Object.assign({}, HINT_COMMON, { 1: '점이 직선 위에 있으면 평면이 하나로 정해지지 않아요.', inf: '점이 직선 밖에 있으면 평면이 하나로 정해져요.' })) };
    }
  }));
  /* ---------------- s3-3 한 점에서 만나는 두 직선 + 문제: k개 직선 */
  const DIRS = [v3(1, 0, 0), v3(0, 1, 0), v3(0, 0, 1), v3(1, 1, 1), v3(1, -1, 2)];
  const generalPos = (dirs) => { for (let i = 0; i < dirs.length; i++) for (let j = i + 1; j < dirs.length; j++) for (let k = j + 1; k < dirs.length; k++) if (Math.abs(dot3(dirs[i], cross3(dirs[j], dirs[k]))) < 1e-9) return false; return true; };
  S.push(fanScene({
    id: 's3-3', type: 'cross', title: '한 점에서 만나는 두 직선', short: '만나는 두 직선',
    question: '한 점에서 만나는 두 직선 $l$, $m$을 모두 포함하는 평면은 몇 개일까? 두 직선이 이루는 각을 바꿔도 그럴까?',
    ctl: ['spAl'], init: { spAl: 60, spTh: 75 },
    guide: '직선 $l$을 포함하는 평면은 책장처럼 무수히 많아요. 막대로 두 직선이 이루는 <b>각</b>을 바꿔 보세요.', need: '두 직선 $l$, $m$',
    rows: (M, ok) => [rdPl(M.F, 'l과 m을 모두 포함하는 평면'), rd('두 직선이 이루는 각', Math.round(M.F.extra.al) + '°', 'amber', '한 점 O에서 만나요'), rdTest(ok, '직선 m')],
    steps: () => ['두 직선 $l$, $m$이 만나는 점을 $O$라 해요. 직선 $l$을 포함하는 평면은 무수히 많아요.', '그중 직선 $m$도 포함하는 평면은 딱 하나예요. 직선 $m$ 위에서 점 $O$가 아닌 한 점을 잡으면, 직선 $l$과 그 밖의 한 점이 평면을 하나로 정하기 때문이에요.', '두 직선이 이루는 각이 달라져도 한 점에서 만나는 두 직선은 언제나 평면을 하나로 정해요.'],
    formula: () => '<p>한 점에서 만나는 두 직선 → 평면 $1$개</p>',
    rule: '한 점에서 만나는 두 직선은 평면을 하나로 정한다',
    notes: notes('두 직선이 <b>한 점에서 만나야</b> 해요. 만나지 않는 꼬인 위치의 두 직선은 평면을 정하지 못해요.', '직선 $l$과 $m$ 위에서 점 $O$ 말고 점을 하나씩 잡으면 “한 직선 위에 있지 않은 세 점”과 같아요.'),
    pq: (s, first) => ({ k: first ? 3 : pick([3, 4, 5], (s.spPq && s.spPq.k) || 3) }),
    drawProb: (D, b, s, M, C) => {
      const k = (M.pq && M.pq.k) || 3, ds = DIRS.slice(0, k).map(unit3), O = v3(0, 0, 0);
      D.fitPts(ds.flatMap((d) => [mul3(d, 2.3), mul3(d, -2.3)]), { t: 50, b: 56, l: 50, r: 50 });
      const names = ['l', 'm', 'n', 'p', 'q'], cols = ['sky', 'rose', 'amber', 'green', 'violet'];
      ds.forEach((d, i) => D.line(mul3(d, -2.3), mul3(d, 2.3), cols[i], 4.4));
      b.point(D.P(O), { color: 'ink', r: 5 }); D.obstacle(O, 8);
      ds.forEach((d, i) => D.label(mul3(d, 2.3), names[i], { color: cols[i], size: 18, dir: D.out(mul3(d, 2.3), O), gap: 10 }));
      D.label(O, 'O', { color: 'ink', size: 17, dir: { x: 1, y: 1 }, gap: 10 });
      D.flush();
    },
    prob: (M) => {
      const k = (M.pq && M.pq.k) || 3, ans = C2(k, 2), nm = ['$l$, $m$, $n$', '$l$, $m$, $n$, $p$', '$l$, $m$, $n$, $p$, $q$'][k - 3];
      return {
        tag: '한 점에서 만나는 직선이 정하는 평면', key: 'k' + k,
        stem: `한 점 $O$에서 만나는 서로 다른 직선 ${nm} 중 어느 세 직선도 한 평면 위에 있지 않다. 이 직선들 중 두 직선씩 택하여 만들 수 있는 평면은 모두 몇 개인가?`,
        choices: mkChoices(ans, [[k, '직선의 개수예요. 평면은 두 직선마다 하나씩이에요.'], [k - 1, '한 직선을 뺀 개수예요.'], [ans + 1, '두 직선마다 평면이 하나씩이에요. 하나 더 세었어요.'], [ans - 1, '모든 쌍을 빠뜨리지 않고 세어 보세요.'], [k * (k - 1), '쌍을 순서까지 따져서 두 번씩 세었어요. 2로 나눠야 해요.']], { unit: '개' }),
        note: '두 직선마다 평면이 하나, 서로 다른 평면이에요'
      };
    }
  }));
  /* ---------------- s3-4 평행한 두 직선 */
  const polyPos = (k) => Array.from({ length: k }, (_, i) => { const a = (2 * Math.PI * i) / k + 0.75; return v3(1.7 * Math.cos(a), 1.7 * Math.sin(a), 0); });
  S.push(fanScene({
    id: 's3-4', type: 'par', title: '평행한 두 직선', short: '평행한 두 직선',
    question: '평행한 두 직선 $l$, $m$을 모두 포함하는 평면은 몇 개일까? 두 직선 사이의 거리를 바꿔도 그럴까?',
    ctl: ['spCl'], init: { spCl: 1.2, spTh: 75 },
    guide: '직선 $l$을 포함하는 평면은 책장처럼 무수히 많아요. 막대로 두 직선 사이의 <b>거리</b>를 바꿔 보세요.', need: '평행한 두 직선 $l$, $m$',
    rows: (M, ok) => [rdPl(M.F, 'l과 m을 모두 포함하는 평면'), rd('두 직선 사이의 거리', M.F.extra.dd.toFixed(2), 'amber', 'l ∥ m'), rdTest(ok, '직선 m')],
    steps: () => ['평행한 두 직선 $l$, $m$ 중 직선 $l$을 포함하는 평면은 무수히 많아요.', '그중 직선 $m$까지 포함하는 평면은 딱 하나예요. 평행한 두 직선은 평면 위에 놓여요.', '두 직선 사이의 거리가 달라져도 평행한 두 직선은 언제나 평면을 하나로 정해요.'],
    formula: () => '<p>평행한 두 직선 → 평면 $1$개</p>',
    rule: '평행한 두 직선은 평면을 하나로 정한다',
    notes: notes('평행한 두 직선은 <b>한 평면 위에 있어요</b>. 그래서 꼬인 위치가 아니에요.', '평행한 직선들은 방향이 같아서 한 직선 위의 한 점과 다른 직선을 합친 것과 같아요.'),
    pq: (s, first) => ({ k: first ? 3 : pick([3, 4, 5], (s.spPq && s.spPq.k) || 3) }),
    drawProb: (D, b, s, M, C) => {
      const k = (M.pq && M.pq.k) || 3, ps = polyPos(k);
      D.fitPts(ps.flatMap((p) => [add3(p, v3(0, 0, -1.6)), add3(p, v3(0, 0, 1.6))]), { t: 50, b: 56, l: 50, r: 50 });
      const names = ['l', 'm', 'n', 'p', 'q'], cols = ['sky', 'rose', 'amber', 'green', 'violet'];
      ps.forEach((p, i) => { D.line(add3(p, v3(0, 0, -1.6)), add3(p, v3(0, 0, 1.6)), cols[i], 4.6); D.par(add3(p, v3(0, 0, -1.6)), add3(p, v3(0, 0, 1.6)), 1, cols[i], 0.5); });
      D.path(ps.map((p) => add3(p, v3(0, 0, -1.6))), 'ink', 1.6, { close: true, dash: [4, 5], alpha: 0.5 });
      ps.forEach((p, i) => D.label(add3(p, v3(0, 0, 1.6)), names[i], { color: cols[i], size: 18, dir: { x: 0, y: -1 }, gap: 10 }));
      D.flush();
    },
    prob: (M) => {
      const k = (M.pq && M.pq.k) || 3, ans = C2(k, 2), nm = ['$l$, $m$, $n$', '$l$, $m$, $n$, $p$', '$l$, $m$, $n$, $p$, $q$'][k - 3];
      return {
        tag: '평행한 직선이 정하는 평면', key: 'p' + k,
        stem: `서로 평행한 직선 ${nm} 중 어느 세 직선도 한 평면 위에 있지 않다. 이 직선들 중 두 직선씩 택하여 만들 수 있는 평면은 모두 몇 개인가?`,
        choices: mkChoices(ans, [[k, '직선의 개수예요. 평면은 두 직선마다 하나씩이에요.'], [k - 1, '한 직선을 뺀 개수예요.'], [ans + 1, '두 직선마다 평면이 하나씩이에요. 하나 더 세었어요.'], [ans - 1, '모든 쌍을 빠뜨리지 않고 세어 보세요.'], [1, '직선이 한 평면 위에 있지 않으니 쌍마다 서로 다른 평면이에요.']], { unit: '개' }),
        note: '두 직선마다 평면이 하나, 서로 다른 평면이에요'
      };
    }
  }));
  /* ---------------- s3-5 꼬인 위치는 평면이 없다 (반례) */
  S.push(fanScene({
    id: 's3-5', type: 'skew', title: '[반례] 꼬인 위치의 두 직선', short: '[반례] 꼬인 위치',
    question: '두 직선이 있으면 항상 그 두 직선을 모두 포함하는 평면이 있을까? 꼬인 위치의 두 직선은 어떨까?',
    ctl: ['spDs', 'spGm', 'spTl'], init: { spDs: 0.9, spGm: 55, spTl: 35, spTh: 75 }, step3: { spDs: 0.9, spGm: 55, spTl: 35 },
    guide: '두 직선 $l$, $m$이 있어요. 막대로 $m$을 앞뒤로 옮기고, 돌리고, 기울여 위치 관계를 바꿔 보세요. 옮기는 자리가 0이면 만나고, 돌리기·기울이기가 모두 0°이면 평행해요.', need: '두 직선 $l$, $m$',
    rows: (M, ok) => {
      const rel = { same: '한 직선(일치)', parallel: '평행', meet: '한 점에서 만남', skew: '꼬인 위치' }[M.F.extra.rel];
      return [rd('두 직선의 위치 관계', rel, rel === '꼬인 위치' ? 'green' : 'sky'), rdPl(M.F, 'l과 m을 모두 포함하는 평면'), rdTest(ok, '직선 m')];
    },
    steps: () => ['두 직선 $l$, $m$의 위치 관계를 확인해요. 만나는지, 평행한지, 꼬인 위치인지 살펴봐요.', '만나거나 평행하면 두 직선을 모두 포함하는 평면이 딱 하나 있어요. 시험 평면을 돌리면 맞는 순간이 있어요.', '꼬인 위치이면 어떤 평면도 두 직선을 모두 포함하지 못해요. 평면을 돌려도 직선 $m$은 한 점에서만 만나요.'],
    formula: () => '<p>만나거나 평행 → 평면 $1$개</p><p>꼬인 위치 → 평면 $0$개</p>',
    rule: '꼬인 위치에 있는 두 직선은 한 평면 위에 있지 않다',
    notes: notes('두 직선이 한 평면 위에 있으려면 <b>만나거나 평행</b>해야 해요.', '직육면체에서 꼬인 위치의 모서리 두 개는 어떤 면에도 함께 놓이지 않아요.'),
    pq: (s, first) => ({ kind: first ? 'cuboid' : pick(['cuboid', 'tri', 'trap', 'pyr4', 'prism6'], (s.spPq && s.spPq.kind) || 'cuboid'), ref: first ? null : 'rand' }),
    drawProb: (D, b, s, M, C) => drawSolidProb(D, b, s, M, C),
    prob: (M) => {
      const so = skewSolid(M), { sol, ref, c } = so, ans = c.nMeet + c.nExt + c.nPar;
      return {
        tag: '한 평면 위에 있는 두 모서리', key: sol.name + ref.key,
        stem: `그림은 ${sol.name}이다. 모서리 $${ov(ref.name)}$${jo(ref.name, 'wa')} 한 평면 위에 있는 모서리는 모두 몇 개인가? (모서리 $${ov(ref.name)}$는 제외)`,
        choices: mkChoices(ans, [[c.nSkew, '꼬인 위치의 개수예요. 한 평면 위에 있는 것은 만나거나 평행한 것이에요.'], [c.nMeet + c.nPar, '늘이면 만나는 모서리도 한 평면 위에 있어요.'], [c.nMeet, '만나는 것만 셌어요. 평행한 것도 한 평면 위에 있어요.'], [c.nPar, '평행한 것만 셌어요.'], [ans + 1, '기준 모서리 자신은 빼야 해요.']], { unit: '개' })
      };
    }
  }));
  /* 문제용: 입체 하나와 기준 모서리 */
  function skewSolid(M) {
    const q = M.pq || { kind: 'cuboid' }, kind = q.kind === 'prism6' ? 'prism' : q.kind, sol = buildSolid(kind, 6);
    const keys = sol.edges.map((e) => e.key);
    const key = q.ref && q.ref !== 'rand' ? q.ref : (q.pickKey || keys[0]);
    const ref = edgeByKey(sol, key, keys[0]);
    return { sol, ref, c: classify(sol, ref) };
  }
  function drawSolidProb(D, b, s, M, C) {
    const { sol, ref } = skewSolid(M);
    D.fitPts(sol.order.map((k) => sol.verts[k]), { t: 46, b: 56, l: 44, r: 44 });
    drawSolid(D, sol, (e) => (e.key === ref.key ? { color: 'amber', width: 6.4, glow: true } : { color: 'ink', width: 3.2 }), { faceAlpha: 0.06 });
    drawVerts(D, sol, { hot: (k) => k === ref.u || k === ref.v });
    D.label(mid3(sol.verts[ref.u], sol.verts[ref.v]), `기준 ${ref.name}`, { color: 'amber', size: 16, dir: D.out(mid3(sol.verts[ref.u], sol.verts[ref.v]), sol.ctr), gap: 14 });
    D.flush();
  }
  // 문제용 기준 모서리는 새로 고칠 때 정한다
  const s35 = S[4];
  const reroll35 = s35.reroll;
  s35.reroll = (s) => { reroll35(s); const q = s.spPq, sol = buildSolid(q.kind === 'prism6' ? 'prism' : q.kind, 6); q.pickKey = pick(sol.edges.map((e) => e.key), null); q.ref = q.pickKey; };

  /* ---------------- s3-6 꼭짓점 세 점으로 만드는 평면 */
  const KIND6 = { cuboid: '직육면체', tri: '삼각기둥', pyr4: '정사각뿔', tetra: '정사면체' };
  function planeGroups(sol) {
    const names = sol.order, groups = new Map();
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) for (let k = j + 1; k < names.length; k++) {
      const p = sol.verts[names[i]], q = sol.verts[names[j]], r = sol.verts[names[k]];
      let n = cross3(sub3(q, p), sub3(r, p));
      if (len3(n) < 1e-9) continue;
      n = unit3(n);
      const first = [n.x, n.y, n.z].find((x) => Math.abs(x) > 1e-9);
      if (first < 0) n = mul3(n, -1);
      const key = [n.x, n.y, n.z, dot3(n, p)].map((x) => (Math.round(x * 1e4) / 1e4 + 0).toFixed(4)).join(',');
      if (!groups.has(key)) groups.set(key, { n, d: dot3(n, p), set: new Set() });
      const gr = groups.get(key); gr.set.add(names[i]); gr.set.add(names[j]); gr.set.add(names[k]);
    }
    return Array.from(groups.values());
  }
  const sc6 = {
    id: 's3-6', title: '꼭짓점 세 점으로 만드는 평면', short: '평면의 개수',
    question: '직육면체의 꼭짓점 8개 중 세 점을 골라 만들 수 있는 서로 다른 평면은 모두 몇 개일까? 세 점을 고르는 방법의 수와 같을까?',
    cam0: { yaw: -30, pitch: 22 },
    ctl: () => VIEW,
    presets: () => Object.keys(KIND6).map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: KIND6[k], apply: (s) => { s.spK6 = k; s.spSel3 = defSel(k); }, on: (s) => (s.spK6 || 'cuboid') === k })),
    init: (s) => { s.spK6 = 'cuboid'; s.spSel3 = defSel('cuboid'); },
    reroll: (s) => { s.spK6 = pick(Object.keys(KIND6), s.spK6); s.spSel3 = defSel(s.spK6); },
    model: (s) => {
      const kind = KIND6[s.spK6] ? s.spK6 : 'cuboid', sol = buildSolid(kind, 6), n = sol.order.length, groups = planeGroups(sol), T = C2(n, 3);
      const sel = (s.spSel3 && s.spSel3.length === 3 && s.spSel3.every((k) => sol.verts[k]) ? s.spSel3 : defSel(kind)).slice();
      const rep = groups.filter((g) => g.set.size >= 4), dup = rep.reduce((a, g) => a + (C2(g.set.size, 3) - 1), 0);
      const cur = groups.find((g) => sel.every((k) => g.set.has(k)));
      return { kind, sol, n, T, groups, rep, dup, ans: groups.length, sel, cur };
    },
    draw(b, s, M, C) {
      const D = scene3(b, s, C), { sol, sel, cur, groups } = M;
      D.fitPts(sol.order.map((k) => sol.verts[k]), { t: 58, b: 54, l: 44, r: 44 });
      const sty = () => ({ color: 'ink', width: 3, alpha: 0.9 });
      drawSolid(D, sol, sty, { faceAlpha: 0.05 });
      let pts = [];
      if (!C.problem && cur) {
        const cx = Array.from(cur.set).map((k) => sol.verts[k]), cen = cx.reduce((a, p) => add3(a, p), v3(0, 0, 0));
        const c0 = mul3(cen, 1 / cx.length);
        const u0 = unit3(sub3(cx[1], cx[0])), w0 = unit3(cross3(cur.n, u0));
        const ord = Array.from(cur.set).map((k) => { const v = sub3(sol.verts[k], c0); return { k, a: Math.atan2(dot3(v, w0), dot3(v, u0)) }; }).sort((a, c) => a.a - c.a).map((q) => sol.verts[q.k]);
        const showAll = C.tab === 'explore' || C.thumb || (C.review && C.step >= 2);
        if (showAll) D.panel(ord, 'green', 0.2, 'green', 2.6);
        if (!C.review || C.step >= 1) D.path(sel.map((k) => sol.verts[k]), 'amber', 4, { close: true, fill: 'amber', fillAlpha: 0.18 });
        pts = Array.from(cur.set);
      }
      drawVerts(D, sol, { hot: (k) => sel.includes(k) && !C.problem });
      if (C.txt && !C.problem) pts.forEach((k) => { if (!sel.includes(k)) b.point(D.P(sol.verts[k]), { color: 'green', r: 6 }); });
      if (C.txt && !C.problem && cur) {
        const txt = `이 평면 위의 꼭짓점 ${cur.set.size}개: ${Array.from(cur.set).join(' ')}`;
        b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, txt, { color: 'green', size: b.W < 560 ? 14.5 : 17, weight: 800, align: 'center', baseline: 'middle' });
      }
      D.flush();
      if ((C.tab === 'explore') && C.txt && !C.thumb) {
        const mids = sol.order.map((k) => ({ k, p: D.P(sol.verts[k]) }));
        sel.forEach((k0, i) => {
          b.handle('v' + i, D.P(sol.verts[k0]), { color: ['amber', 'rose', 'sky'][i], r: 8.5, ariaLabel: `꼭짓점 ${i + 1} 고르기`, drag: (w) => {
            let best = null, bd = 1e18;
            mids.forEach((q) => { if (sel.some((x, j) => j !== i && x === q.k)) return; const d = (q.p.x - w.x) ** 2 + (q.p.y - w.y) ** 2; if (d < bd) { bd = d; best = q.k; } });
            if (best) { const nx = sel.slice(); nx[i] = best; s.spSel3 = nx; }
          } });
        });
      }
      void groups;
    },
    steps: (M) => {
      const { n, T, rep, dup, ans } = M;
      const sizes = rep.map((g) => g.set.size);
      const bySize = {}; rep.forEach((g) => { bySize[g.set.size] = (bySize[g.set.size] || 0) + 1; });
      const terms = Object.keys(bySize).map((z) => `${bySize[z]}\\times(${C2(+z, 3)}-1)`).join('-');
      return [
        `꼭짓점 ${n}개 중 세 점을 고르는 방법은 $\\dfrac{${n}\\times${n - 1}\\times${n - 2}}{3\\times2\\times1}=${T}$가지예요. 세 점이 한 직선 위에 있지 않으면 세 점마다 평면이 하나 정해져요.`,
        rep.length ? `그런데 한 평면 위에 꼭짓점이 ${sizes.filter((x, i) => sizes.indexOf(x) === i).join(', ')}개 있는 평면이 ${rep.length}개 있어요. 이런 평면은 같은 평면이 세 점의 여러 조합으로 중복해서 세어져요.` : '한 평면 위에 꼭짓점이 네 개 이상 있는 평면은 없어요. 세 점마다 서로 다른 평면이에요.',
        rep.length ? `중복해서 센 만큼 빼요. $${T}-${terms}=${ans}$. 서로 다른 평면은 모두 $${ans}$개예요.` : `서로 다른 평면은 $${T}$개예요.`
      ];
    },
    view: (M) => ({
      guide: '세 개의 <b>손잡이</b>(노랑·분홍·하늘)를 끌어 다른 꼭짓점으로 옮겨 보세요. 세 점이 정하는 평면(초록)과 그 평면 위의 다른 꼭짓점이 보여요. 위의 칩으로 입체를 바꿀 수 있어요.',
      readouts: [rd('고른 세 점', M.sel.join(' '), 'amber'), rd('이 평면 위의 꼭짓점', `${M.cur ? M.cur.set.size : 3}개`, 'green', M.cur ? Array.from(M.cur.set).join(' ') : ''), rd('세 점을 고르는 방법', `${M.T}가지`, 'sky', `${M.n}C3`), rd('서로 다른 평면', `${M.ans}개`, 'amber', M.dup ? `${M.T} − ${M.dup}` : '', null, true)],
      formula: `<p>(서로 다른 평면의 수) $=${M.T}${M.dup ? `-${M.dup}` : ''}=${M.ans}$ (개)</p>`,
      rule: '같은 평면이 여러 번 세어지는 것을 빼면 서로 다른 평면의 수가 된다',
      notes: notes('세 점을 고르는 방법의 수 $=$ 평면의 수가 아니에요. 한 평면 위에 네 점이 있으면 그 평면을 여러 번 센 거예요.', '직육면체에서는 여섯 면 말고 마주 보는 모서리를 지나는 대각선 평면 여섯 개도 한 평면에 꼭짓점이 네 개 있어요.')
    }),
    prob: (M) => {
      const { sol, T, rep, dup, ans, n } = M, faces = sol.faces.length;
      return {
        tag: '꼭짓점으로 만드는 평면의 개수', key: M.kind,
        stem: `그림과 같은 ${sol.name}의 꼭짓점 중 세 점을 골라 만들 수 있는 서로 다른 평면은 모두 몇 개인가?`,
        choices: mkChoices(ans, [[T, '세 점을 고르는 방법의 수예요. 같은 평면이 여러 번 세어졌어요.'], [T - rep.length, '중복된 평면을 한 번씩만 뺐어요. 한 평면이 여러 번 세어진 만큼 빼야 해요.'], [faces, '입체의 면의 수예요. 면이 아닌 평면도 있어요.'], [rep.length, '네 점 이상이 놓인 평면만 셌어요.'], [ans + 1, '한 번 더 세었어요.']], { unit: '개' })
      };
    }
  };
  function defSel(k) { const s = buildSolid(k, 6); return s.order.slice(0, 3).map((x, i) => (k === 'cuboid' && i === 2 ? 'F' : x)); }
  S.push(sc6);

  G.register(30, 't3', '③ 평면이 정해질 조건', '평면이 정해질 조건', PARAMS, S);
})();
