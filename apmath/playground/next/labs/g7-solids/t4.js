/* ==========================================================================
   중1 · 회전체 — 탭 ④ 「원뿔 옆면의 최단거리」 (t4.js, order 40) — 장면 4개
   · s4-1 끈 감기(끈 후보 비교: 밑면을 따라 · 점 M을 지나게 · 직선) · s4-2 길이 구하기(중심각 60°이면 R, 180°이면 2R)
   · s4-3 모선 위의 점에서 출발 · s4-4 원뿔대에서도(큰 부채꼴의 중심각 60°)
   끈은 입체(3D) 위와 전개도(2D) 위에 함께 그려져 같은 끈이 두 그림에서 대응됩니다. 가려진 쪽은 점선입니다.
   중1 범위: √ 없이, 계산 문제는 중심각이 60°(= 정삼각형, 끈 = R) 또는 180°(= 지름, 끈 = 2R)인 경우만 냅니다.
   그 밖의 중심각은 그림에서 길이를 읽어 비교합니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SO;
  if (!G || !G.S3 || !G.NET) return;
  const S3 = G.S3, N = G.NET;
  const { PI, DEG, clamp, fmtN, T, fit, P, rd, notes, mkNum, mkText, rint, pick, shuffle, sshuffle, esc, jo } = G;
  const { pt, arcPts, sectorPts, unionB, shiftB, arrange, xTxt, px } = N;
  const AMB = 'amber', SKY = 'sky', ROSE = 'rose', GRN = 'green';
  const rad = (d) => d * DEG;
  const cmv = (v) => fmtN(v) + ' cm';

  const PARAMS = {
    soTr: P('밑면의 반지름 r', 1, 4, 1, 2, { color: 'sky', format: (v) => Math.round(v) + ' cm', onInput: (st) => { st.soTR = Math.max(st.soTR == null ? 6 : st.soTR, 2 * Math.round(st.soTr)); } }),
    soTR: P('모선의 길이 R', 2, 9, 1, 6, { color: 'amber', hint: '끈이 한 바퀴를 도는 경우만 다뤄요: R은 r의 2배 이상(중심각 180° 이하)', format: (v) => Math.round(v) + ' cm', onInput: (st) => { st.soTR = Math.max(st.soTR, 2 * Math.round(st.soTr)); } }),
    soTp: P('점 P의 위치 (꼭짓점에서의 거리)', 1, 12, 1, 3, { color: 'amber', hint: '모선을 따라 꼭짓점 O에서 떨어진 거리', format: (v) => Math.round(v) + ' cm' }),
    soTf: P('작은 밑면의 반지름', 1, 4, 1, 2, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soTg: P('큰 밑면의 반지름', 2, 6, 1, 4, { color: 'sky', format: (v) => Math.round(v) + ' cm' })
  };

  /* ------------------------------------------------------------------ 전개도(부채꼴) ↔ 원뿔 위의 점 */
  // 전개도 위의 점(꼭짓점 O 기준 좌표 q)을 원뿔 위의 점으로. A(왼쪽 끝)가 방위각 0 이 됩니다.
  function mapper(r, R, h, x) {
    const a0 = -90 - x / 2;
    return (q) => {
      const s = Math.hypot(q.x, q.y);
      let ph = Math.atan2(q.y, q.x) / DEG;
      while (ph < a0 - 1e-6) ph += 360;
      while (ph > a0 + 360 - 1e-6) ph -= 360;
      const psi = (ph - a0) / x * 2 * PI;
      return { rho: r * s / R, y: h * (1 - s / R), psi };
    };
  }
  const segSamples = (a, c, n = 36) => { const o = []; for (let i = 0; i <= n; i++) o.push({ x: a.x + (c.x - a.x) * i / n, y: a.y + (c.y - a.y) * i / n }); return o; };
  // 입체 위의 끈: 보이는 곳은 실선, 가려진 곳은 점선. nrm: 원뿔의 바깥 방향 높이 성분 비(r/h)
  function drawString3D(D, mp, pts, opts = {}) {
    const g = D.g, sp = Math.sin(D.cam.sp > 0 ? Math.asin(D.cam.sp) : 0), tanP = D.cam.sp / Math.max(0.05, D.cam.cp), kr = opts.kr == null ? 0.3 : opts.kr;
    let run = [], vis = null;
    const flush = () => { if (run.length > 1) g.path(run, { color: opts.color || AMB, width: vis ? (opts.width || 4.4) : 3, dash: vis ? undefined : [6, 5], alpha: vis ? 1 : 0.65 }); };
    void sp;
    pts.forEach((q) => {
      const m = mp(q), p3 = D.P(D.pol(m.rho, m.y, m.psi));
      const v = Math.sin(m.psi) > -kr * tanP - 0.0;
      if (vis === null) vis = v;
      if (v !== vis) { run.push(p3); flush(); run = [p3]; vis = v; } else run.push(p3);
    });
    flush();
  }
  const dist = (a, c) => Math.hypot(a.x - c.x, a.y - c.y);

  // 전개도 + 입체 + 길이 막대의 공통 틀
  function frame(b, s, C, spec) {
    const { r, R, x } = spec, h = Math.sqrt(Math.max(0.01, R * R - r * r));
    const sw = R * Math.sin(rad(Math.min(x / 2, 90)));
    const A = N.sectorBox(R, x, 0, false);
    const cp = Math.cos(22 * DEG), sp = Math.sin(22 * DEG);
    const cb = { x0: -r, x1: r, y0: -r * sp, y1: h * cp };
    const off = arrange(b, A, cb, R * 0.35);
    let all = unionB(A, shiftB(cb, off.dx, off.dy));
    const bars = spec.bars ? 76 : 0;
    fit(b, all, { l: 34, r: 34, t: 44, b: 28 + bars });
    return { A, off, all, h, mp: mapper(r, R, h, x), D: S3.ctx(b, s, { k: 1, ox: off.dx, oy: off.dy }), cone: S3.solid('cone', { R: r, h1: h }) };
  }
  // 막대 비교(가로): 같은 눈금에서 길이를 비교
  function bars(b, C, all, items, maxLen) {
    const k = b.k, x0 = all.x0 + px(b, 8), Wd = Math.max(px(b, 90), (all.x1 - all.x0) * 0.4), y0 = all.y0 - px(b, 20);
    items.forEach((it, i) => {
      const y = y0 - i * px(b, 22), len = Wd * it.len / maxLen;
      b.seg({ x: x0, y }, { x: x0 + len, y }, { color: it.color, width: it.hi ? 9 : 6, alpha: it.hi ? 1 : 0.55 });
      T(b, { x: x0 + len, y }, `${it.label} ${it.text}`, it.color, { dx: 8, align: 'left', size: 14 });
    });
    void k;
  }

  const S = [];
  const lenOf = { rim: (r, R, x) => 2 * PI * r, chord: (r, R, x) => 2 * R * Math.sin(rad(x / 2)) };

  /* ================================================================== s4-1 끈 감기 */
  function m1(s) {
    const r = clamp(Math.round(s.soTr), 1, 4), R = Math.max(clamp(Math.round(s.soTR), 2, 9), 2 * r), x = 360 * r / R;
    const mode = s.soMode || 'via', a0 = -90 - x / 2, a1 = -90 + x / 2;
    const ms = clamp(s.soMs == null ? 0.75 * R : s.soMs, 0.12 * R, R), mp = clamp(s.soMp == null ? -90 : s.soMp, a0 + 1, a1 - 1);
    const A = pt({ x: 0, y: 0 }, R, a0), A2 = pt({ x: 0, y: 0 }, R, a1), M = pt({ x: 0, y: 0 }, ms, mp);
    const rim = 2 * PI * r, chord = 2 * R * Math.sin(rad(x / 2)), via = dist(A, M) + dist(M, A2);
    return { r, R, x, mode, a0, a1, ms, mp, A, A2, M, rim, chord, via, cur: mode === 'rim' ? rim : mode === 'line' ? chord : via };
  }
  S.push({
    id: 's4-1', noView: true, title: '끈 감기: 가장 짧은 길은?', short: '끈 감기',
    question: '원뿔의 밑면의 한 점 A에서 옆면을 한 바퀴 돌아 다시 A로 돌아오는 끈 중 가장 짧은 것은 어떤 모양일까? 전개도에서는 어떻게 보일까?',
    ctl: ['soTr', 'soTR'],
    presets: (s) => [{ group: '끈의 모양', label: '밑면 둘레를 따라', apply: (st) => { st.soMode = 'rim'; }, on: (st) => st.soMode === 'rim' }, { label: '점 M을 지나게', apply: (st) => { st.soMode = 'via'; }, on: (st) => (st.soMode || 'via') === 'via' }, { label: '직선 (전개도에서)', apply: (st) => { st.soMode = 'line'; }, on: (st) => st.soMode === 'line' }].concat((s.soMode || 'via') === 'via' ? [{ group: '점 M의 위치', label: '현의 중점', apply: (st) => { const mm = m1(st); st.soMs = mm.R * Math.cos(rad(mm.x / 2)); st.soMp = -90; }, on: () => false }, { label: '호의 중점', apply: (st) => { st.soMs = m1(st).R; st.soMp = -90; }, on: () => false }, { label: '꼭짓점 O 쪽', apply: (st) => { st.soMs = 0.3 * m1(st).R; st.soMp = -90; }, on: () => false }] : []),
    init: (s) => { s.soTr = 2; s.soTR = 6; s.soMode = 'via'; s.soMs = 5; s.soMp = -90; },
    reroll: (s) => { s.soQv = pick([1, 2, 3], s.soQv); },
    model: (s) => Object.assign(m1(s), { qv: s.soQv || 1 }),
    stepT: undefined,
    draw(b, s, M, C) {
      if (C.problem) { // 문제: 입체와 점 A (끈은 보기에서 고른다)
        const { r, R } = M, h = Math.sqrt(R * R - r * r), D = S3.ctx(b, s, {});
        fit(b, { x0: -r, x1: r, y0: -r * Math.sin(22 * DEG), y1: h * Math.cos(22 * DEG) }, { l: 70, r: 70, t: 40, b: 40 });
        S3.drawSolid(D, S3.solid('cone', { R: r, h1: h }), {});
        D.line({ x: 0, y: h, z: 0 }, D.pol(r, 0, 0), AMB, 3.4);
        T(b, D.P({ x: r / 2, y: h / 2, z: 0 }), `R = ${R} cm`, AMB, { dx: 44, size: 16 });
        D.line({ x: 0, y: 0, z: 0 }, { x: r, y: 0, z: 0 }, SKY, 2.6); T(b, D.P({ x: r / 2, y: 0, z: 0 }), `r = ${r} cm`, SKY, { dy: 18, size: 16 });
        b.point(D.P(D.pol(r, 0, 0)), { color: 'ink', r: 5 }); T(b, D.P(D.pol(r, 0, 0)), 'A', 'ink', { dx: 14, dy: 14, size: 17 });
        return;
      }
      const { r, R, x } = M, F = frame(b, s, C, { r, R, x, bars: true }), O = { x: 0, y: 0 }, D = F.D;
      // 전개도: 부채꼴과 끈
      b.path(sectorPts(O, R, M.a0, M.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
      b.seg(O, M.A, { color: SKY, width: 2.4 }); b.seg(O, M.A2, { color: SKY, width: 2.4 });
      let pathPts;
      if (M.mode === 'rim') { pathPts = arcPts(O, R, M.a0, M.a1); b.path(pathPts, { color: AMB, width: 5 }); }
      else if (M.mode === 'line') { pathPts = segSamples(M.A, M.A2); b.seg(M.A, M.A2, { color: AMB, width: 5 }); }
      else { pathPts = segSamples(M.A, M.M).concat(segSamples(M.M, M.A2)); b.path([M.A, M.M, M.A2], { color: AMB, width: 5 }); }
      if (M.mode !== 'line') b.seg(M.A, M.A2, { color: 'muted', width: 1.8, dash: [5, 5], alpha: 0.8 });
      if (C.txt) {
        T(b, M.A, 'A', 'ink', { dx: -14, dy: 8, size: 17 }); T(b, M.A2, "A′", 'ink', { dx: 16, dy: 8, size: 17 });
        T(b, O, 'O', 'ink', { dy: -14, size: 16 });
        const e = M.A2; T(b, { x: e.x / 2, y: e.y / 2 }, `R = ${R}`, SKY, { dx: 32, size: 15 });
        const rr = Math.min(R * 0.28, px(b, 30)); b.arc(O, rr, rad(M.a0), rad(M.a1), { sector: true, fill: ROSE, fillAlpha: 0.26, color: ROSE, width: 2.2 }); T(b, O, `${xTxt(x)}°`, ROSE, { dy: 30, size: 15 });
      }
      if (M.mode === 'via' && !C.thumb && C.tab === 'explore') b.handle('M', M.M, { color: AMB, ariaLabel: '끈이 지나는 점 M', drag: (w) => { s.soMs = clamp(Math.hypot(w.x, w.y), 0.12 * R, R); let ph = Math.atan2(w.y, w.x) / DEG; while (ph < M.a0 - 1e-6) ph += 360; s.soMp = clamp(ph, M.a0 + 1, M.a1 - 1); } });
      if (M.mode === 'via' && C.txt) T(b, M.M, 'M', 'ink', { dy: -16, size: 16 });
      // 입체(3D) 위의 같은 끈
      S3.drawSolid(D, F.cone, {});
      D.line({ x: 0, y: F.h, z: 0 }, D.pol(r, 0, 0), SKY, 2.4);
      drawString3D(D, F.mp, pathPts, { kr: r / F.h });
      b.point(D.P(D.pol(r, 0, 0)), { color: 'ink', r: 5 });
      if (C.txt) { T(b, D.P(D.pol(r, 0, 0)), 'A', 'ink', { dx: 14, dy: 12, size: 17 }); T(b, D.P({ x: 0, y: F.h, z: 0 }), 'O', 'ink', { dy: -14, size: 16 }); }
      // 길이 비교 막대(같은 눈금, 가로로 늘어남)
      if (C.txt) {
        const mx = Math.max(M.rim, M.chord, M.via);
        bars(b, C, F.all, [{ label: '밑면 둘레를 따라', len: M.rim, text: `약 ${fmtN(M.rim)} cm`, color: SKY, hi: M.mode === 'rim' }, { label: '점 M을 지나게', len: M.via, text: `약 ${fmtN(M.via)} cm`, color: AMB, hi: M.mode === 'via' }, { label: '전개도의 직선', len: M.chord, text: `약 ${fmtN(M.chord)} cm`, color: GRN, hi: M.mode === 'line' }], mx);
      }
    },
    steps: (M) => [
      `원뿔의 옆면을 <b>펼쳐요</b>. 부채꼴의 두 끝 A, A′이 입체에서는 같은 점 A예요. 입체 위의 끈은 전개도에서 A와 A′을 잇는 선이에요.`,
      '두 점 사이를 잇는 선 중 가장 짧은 것은 <b>직선</b>이에요. 점 M을 지나가거나 호를 따라가면 더 길어요.',
      `끈이 가장 짧을 때는 전개도의 <b>현 AA′</b>(직선)이에요. 이 값은 약 ${fmtN(M.chord)} cm이고 밑면 둘레(약 ${fmtN(M.rim)} cm)보다 짧아요.`
    ],
    view: (M) => ({
      guide: '칩으로 끈의 모양을 바꿔 보세요. <b>점 M을 지나게</b>를 고르면 노란 점 M을 끌어 끈의 모양을 바꿀 수 있어요. 입체 위의 끈은 전개도의 선과 같고, 아래 막대로 길이를 비교해요.',
      readouts: [rd('중심각 x', xTxt(M.x) + '°', ROSE), rd('지금 끈의 길이', `약 ${fmtN(M.cur)} cm`, AMB), rd('가장 짧은 끈 (직선 AA′)', `약 ${fmtN(M.chord)} cm`, GRN, '전개도의 현', null, true), rd('밑면 둘레를 따를 때', `약 ${fmtN(M.rim)} cm`, SKY)],
      status: Math.abs(M.cur - M.chord) < 0.05 ? { tone: 'ok', text: '가장 짧은 끈!' } : { tone: 'info', text: `직선보다 ${fmtN(M.cur - M.chord)} cm 더 길어요` },
      formula: '<p>입체 위의 최단 거리 = <b>전개도에서 두 점을 잇는 선분</b>의 길이</p><p>펼치기 → 두 점 A, A′ 잇기 → 선분 AA′의 길이</p>',
      rule: '원뿔의 옆면을 따라 한 바퀴 도는 최단 거리는 전개도에서 두 점을 직선으로 이은 선분의 길이이다',
      notes: notes('밑면의 둘레를 따라 도는 끈은 <b>최단이 아니에요</b>.', '입체에서는 곡선처럼 보여도 펼치면 <b>직선</b>이에요.')
    }),
    prob: (M, s) => {
      const choices = [{ h: '밑면의 둘레를 따라 한 바퀴 도는 끈', ok: false, hint: '둘레를 따라 가면 전개도에서 호가 돼요. 직선이 더 짧아요.' }, { h: '꼭짓점을 지나갔다가 내려오는 끈', ok: false, hint: '꼭짓점을 거치면 모선 두 개의 합(2R)이라 더 길어요.' }, { h: '전개도에서 두 점 A, A′을 직선으로 이은 선에 해당하는 끈', ok: true }, { h: '밑면에서 가장 높은 곳까지 올라갔다 내려오는 끈', ok: false, hint: '꼭짓점 쪽으로 너무 올라가면 길어져요.' }, { h: '모선을 따라 올라가는 끈', ok: false, hint: '한 바퀴를 돌아 A로 돌아오는 끈이 아니에요.' }];
      return { tag: '원뿔 옆면의 최단 거리', key: 'sh' + M.r + '-' + M.R, wide: true, stem: '그림과 같이 원뿔의 밑면 위의 점 A에서 옆면을 한 바퀴 돌아 다시 A로 오는 끈 중 가장 짧은 것은?', choices: mkText(sshuffle(choices, 's4-1|' + M.r + '-' + M.R + '|' + ((s && s.soSeed) || 0))) };
    }
  });

  /* ================================================================== s4-2 길이 구하기 (60° · 180°) */
  const S42 = { 60: 6, 180: 2 };
  function m2(s) {
    const ang = s.soAng === 180 ? 180 : 60, kk = S42[ang], r = clamp(Math.round(s.soTr), 1, 4), R = r * kk, x = ang;
    const O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2, A = pt(O, R, a0), A2 = pt(O, R, a1);
    return { ang, kk, r, R, x, a0, a1, A, A2, ans: ang === 60 ? R : 2 * R };
  }
  S.push({
    id: 's4-2', noView: true, title: '[핵심] 최단 거리의 길이 구하기', short: '[핵심] 길이 구하기',
    question: '전개도 부채꼴의 중심각이 60°나 180°이면 최단 거리를 바로 구할 수 있어. 어떻게 구할까?',
    ctl: ['soTr'], presets: () => [{ group: 'r : R', label: '1 : 6 (중심각 60°)', apply: (st) => { st.soAng = 60; }, on: (st) => st.soAng !== 180 }, { label: '1 : 2 (중심각 180°)', apply: (st) => { st.soAng = 180; }, on: (st) => st.soAng === 180 }],
    init: (s) => { s.soTr = 2; s.soAng = 60; },
    reroll: (s) => { s.soQa = pick([60, 180], s.soQa); s.soQr = rint(1, 4); },
    model: (s) => Object.assign(m2(s), { qa: s.soQa || 60, qr: s.soQr || 2 }),
    draw(b, s, M, C) {
      const prob = C.problem, ang = prob ? M.qa : M.ang, r = prob ? M.qr : M.r, R = r * S42[ang], x = ang;
      if (prob) { // 문제: 입체 + 점 A (전개도는 주어지지 않음)
        const h = Math.sqrt(R * R - r * r), D = S3.ctx(b, s, {});
        fit(b, { x0: -r, x1: r, y0: -r * Math.sin(22 * DEG), y1: h * Math.cos(22 * DEG) }, { l: 70, r: 70, t: 40, b: 40 });
        S3.drawSolid(D, S3.solid('cone', { R: r, h1: h }), {});
        D.line({ x: 0, y: h, z: 0 }, D.pol(r, 0, 0), AMB, 3.4);
        T(b, D.P({ x: r / 2, y: h / 2, z: 0 }), `R = ${R} cm`, AMB, { dx: 44, size: 16 });
        D.line({ x: 0, y: 0, z: 0 }, { x: r, y: 0, z: 0 }, SKY, 2.6); T(b, D.P({ x: r / 2, y: 0, z: 0 }), `r = ${r} cm`, SKY, { dy: 18, size: 16 });
        b.point(D.P(D.pol(r, 0, 0)), { color: 'ink', r: 5 }); T(b, D.P(D.pol(r, 0, 0)), 'A', 'ink', { dx: 14, dy: 14, size: 17 });
        return;
      }
      const m = M, F = frame(b, s, C, { r, R, x }), O = { x: 0, y: 0 }, D = F.D;
      b.path(sectorPts(O, R, m.a0, m.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
      if (ang === 60) { b.path([O, m.A, m.A2], { close: true, fill: GRN, fillAlpha: 0.22, color: null }); b.seg(m.A, m.A2, { color: AMB, width: 5.5 }); }
      else { b.seg(m.A, m.A2, { color: AMB, width: 5.5 }); }
      b.seg(O, m.A, { color: SKY, width: 2.6 }); b.seg(O, m.A2, { color: SKY, width: 2.6 });
      if (C.txt) {
        T(b, m.A, 'A', 'ink', { dx: -14, dy: 8, size: 17 }); T(b, m.A2, "A′", 'ink', { dx: 16, dy: 8, size: 17 }); T(b, O, 'O', 'ink', { dy: -14, size: 16 });
        if (ang === 60) {
          b.ticks(O, m.A, { color: GRN, count: 1 }); b.ticks(O, m.A2, { color: GRN, count: 1 }); b.ticks(m.A, m.A2, { color: GRN, count: 1 });
          const rr = Math.min(R * 0.3, px(b, 26));
          [[O, m.A, m.A2], [m.A, O, m.A2], [m.A2, m.A, O]].forEach((tri) => b.angle(tri[0], tri[1], tri[2], { r: rr, color: ROSE, label: '60°', size: 13 }));
          T(b, { x: (m.A.x + m.A2.x) / 2, y: (m.A.y + m.A2.y) / 2 }, `AA′ = R = ${R} cm`, AMB, { dy: 22, size: 16 });
          T(b, { x: m.A.x / 2, y: m.A.y / 2 }, `R = ${R}`, SKY, { dx: -34, size: 15 });
        } else {
          T(b, { x: m.A.x / 2, y: m.A.y / 2 }, `R = ${R}`, SKY, { dy: -14, dx: -8, size: 15 }); T(b, { x: m.A2.x / 2, y: m.A2.y / 2 }, `R = ${R}`, SKY, { dy: -14, size: 15 });
          T(b, O, `180°`, ROSE, { dy: 32, size: 15 });
          T(b, { x: 0, y: -R }, `AA′ = R + R = ${2 * R} cm`, AMB, { dy: 22, size: 16 });
        }
      }
      S3.drawSolid(D, F.cone, {});
      D.line({ x: 0, y: F.h, z: 0 }, D.pol(r, 0, 0), SKY, 2.4);
      drawString3D(D, F.mp, segSamples(m.A, m.A2), { kr: r / F.h });
      b.point(D.P(D.pol(r, 0, 0)), { color: 'ink', r: 5 });
      if (C.txt) { T(b, D.P(D.pol(r, 0, 0)), 'A', 'ink', { dx: 14, dy: 12, size: 17 }); T(b, D.P({ x: r / 2, y: 0, z: 0 }), `r = ${r}`, SKY, { dy: 18, size: 15 }); }
    },
    steps: (M) => M.ang === 60 ? [
      `원뿔을 펼쳐요. 모선 R = ${M.R} cm가 부채꼴의 반지름이에요.`,
      `중심각 $x = 360°\\times\\dfrac{r}{R} = 360°\\times\\dfrac{${M.r}}{${M.R}} = 60°$`,
      `삼각형 $OAA'$은 $\\overline{OA}=\\overline{OA'}=${M.R}$이고 $\\angle AOA'=60°$이므로 세 각이 모두 60°인 <b>정삼각형</b>이에요.`,
      `최단 거리 $\\overline{AA'} = ${M.R}$ (cm)`
    ] : [
      `원뿔을 펼쳐요. 모선 R = ${M.R} cm가 부채꼴의 반지름이에요.`,
      `중심각 $x = 360°\\times\\dfrac{r}{R} = 360°\\times\\dfrac{${M.r}}{${M.R}} = 180°$`,
      `중심각이 180°이면 부채꼴은 <b>반원</b>이고 A, O, A′가 한 직선 위에 있어요.`,
      `최단 거리 $\\overline{AA'} = ${M.R} + ${M.R} = ${2 * M.R}$ (cm)`
    ],
    view: (M) => ({
      guide: 'r : R 칩으로 <b>중심각 60° / 180°</b>를 고르고 r 막대를 바꿔 보세요. 입체 위의 끈이 전개도의 직선 AA′에 대응돼요. 60°이면 정삼각형, 180°이면 지름이에요.',
      readouts: [rd('r : R', `1 : ${M.kk}`, SKY), rd('중심각 x', M.ang + '°', ROSE, `360° × ${M.r}/${M.R}`), rd('최단 거리 AA′', cmv(M.ans), GRN, M.ang === 60 ? 'AA′ = R (정삼각형)' : 'AA′ = 2R (지름)', null, true)],
      status: { tone: 'ok', text: `최단 거리 = ${cmv(M.ans)}` },
      formula: M.ang === 60 ? `<p>중심각 60° → △OAA′은 정삼각형 → $\\overline{AA'} = R$ = <b>${M.R} cm</b></p>` : `<p>중심각 180° → A, O, A′가 일직선 → $\\overline{AA'} = 2R$ = <b>${2 * M.R} cm</b></p>`,
      rule: '원뿔 옆면의 최단 거리는 전개도에서 두 점을 이은 선분이다. 중심각이 60°이면 R, 180°이면 2R이다',
      notes: notes('먼저 <b>중심각</b> $x = 360° \\times \\dfrac{r}{R}$을 구해요.', '60°는 <b>정삼각형</b>, 180°는 <b>반원의 지름</b>이에요. 둘 다 길이가 바로 나와요.')
    }),
    prob: (M) => {
      const ang = M.qa, r = M.qr, R = r * S42[ang], ans = ang === 60 ? R : 2 * R;
      return {
        tag: '원뿔 옆면의 최단 거리 (핵심)', key: `${ang}-${r}`,
        stem: `그림과 같이 밑면의 반지름이 ${r} cm, 모선의 길이가 ${R} cm인 원뿔의 밑면 위의 점 A에서 옆면을 한 바퀴 돌아 다시 A로 오는 가장 짧은 거리는 몇 cm인가?`,
        choices: mkNum(ans, ang === 60 ? [[2 * R, '꼭짓점을 지나가는 길(R+R)이에요. 가장 짧지 않아요.'], [r * 2 * 3, '밑면 둘레(2πr)의 계수에 가까운 값이에요. 최단 거리는 직선이에요.'], [R / 2, ''], [R + r, '']] : [[R, 'R만 구했어요. 중심각이 180°이면 A, O, A′가 일직선이라 R + R이에요.'], [3 * R, ''], [R + r, ''], [R / 2, '']], (v) => fmtN(v) + ' cm', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: ang === 60 ? '중심각이 60°이면 정삼각형' : '중심각이 180°이면 반원의 지름'
      };
    }
  });

  /* ================================================================== s4-3 모선 위의 점에서 출발 */
  function m3(s) {
    const ang = s.soAng3 === 180 ? 180 : 60, kk = S42[ang], r = clamp(Math.round(s.soTr), 1, 4), R = r * kk, x = ang;
    const p = clamp(Math.round(s.soTp), 1, R), O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2;
    return { ang, kk, r, R, x, p, a0, a1, P1: pt(O, p, a0), P2: pt(O, p, a1), A: pt(O, R, a0), A2: pt(O, R, a1), ans: ang === 60 ? p : 2 * p };
  }
  S.push({
    id: 's4-3', noView: true, title: '모선 위의 점에서 출발하면', short: '모선 위의 점',
    question: '밑면이 아니라 모선 위의 점 P에서 출발해 한 바퀴 돌아 다시 P로 오는 최단 거리는 어떻게 구할까?',
    ctl: ['soTr', 'soTp'], presets: () => [{ group: 'r : R', label: '1 : 6 (중심각 60°)', apply: (st) => { st.soAng3 = 60; }, on: (st) => st.soAng3 !== 180 }, { label: '1 : 2 (중심각 180°)', apply: (st) => { st.soAng3 = 180; }, on: (st) => st.soAng3 === 180 }],
    init: (s) => { s.soTr = 2; s.soAng3 = 60; s.soTp = 6; },
    reroll: (s) => { s.soQa = pick([60, 180], s.soQa); s.soQr = rint(1, 4); s.soQp = rint(1, 6); },
    model: (s) => Object.assign(m3(s), { qa: s.soQa || 60, qr: s.soQr || 2, qp: s.soQp || 3 }),
    draw(b, s, M, C) {
      const prob = C.problem, ang = prob ? M.qa : M.ang, r = prob ? M.qr : M.r, R = r * S42[ang], x = ang, p = prob ? Math.min(M.qp, R) : M.p;
      if (prob) {
        const h = Math.sqrt(R * R - r * r), D = S3.ctx(b, s, {});
        fit(b, { x0: -r, x1: r, y0: -r * Math.sin(22 * DEG), y1: h * Math.cos(22 * DEG) }, { l: 70, r: 70, t: 40, b: 40 });
        S3.drawSolid(D, S3.solid('cone', { R: r, h1: h }), {});
        D.line({ x: 0, y: h, z: 0 }, D.pol(r, 0, 0), AMB, 3.4);
        T(b, D.P({ x: r * 0.8, y: h * 0.2, z: 0 }), `R = ${R} cm`, AMB, { dx: 46, size: 16 });
        const f = p / R, Pp = D.P(D.pol(r * f, h * (1 - f), 0));
        b.point(Pp, { color: 'ink', r: 5.5 }); T(b, Pp, 'P', 'ink', { dx: 16, dy: 0, size: 17 });
        const O3 = D.P({ x: 0, y: h, z: 0 }); b.seg(O3, Pp, { color: ROSE, width: 3 }); T(b, { x: (O3.x + Pp.x) / 2, y: (O3.y + Pp.y) / 2 }, `OP = ${p} cm`, ROSE, { dx: -48, size: 15 });
        T(b, O3, 'O', 'ink', { dy: -14, size: 16 });
        return;
      }
      const m = M, F = frame(b, s, C, { r, R, x }), O = { x: 0, y: 0 }, D = F.D;
      b.path(sectorPts(O, R, m.a0, m.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
      b.seg(O, m.A, { color: SKY, width: 2.6 }); b.seg(O, m.A2, { color: SKY, width: 2.6 });
      b.seg(m.P1, m.P2, { color: AMB, width: 5.5 });
      if (ang === 60) b.path([O, m.P1, m.P2], { close: true, fill: GRN, fillAlpha: 0.22, color: null });
      if (C.txt) {
        T(b, O, 'O', 'ink', { dy: -14, size: 16 }); T(b, m.P1, 'P', 'ink', { dx: -14, dy: 10, size: 17 }); T(b, m.P2, "P′", 'ink', { dx: 16, dy: 10, size: 17 });
        T(b, { x: m.A.x * 0.88, y: m.A.y * 0.88 }, `R = ${R}`, SKY, { dx: -34, dy: -8, size: 14 });
        T(b, { x: m.P1.x / 2, y: m.P1.y / 2 }, `${p}`, ROSE, { dx: 16, size: 16 }); T(b, { x: m.P2.x / 2, y: m.P2.y / 2 }, `${p}`, ROSE, { dx: -16, size: 16 });
        if (ang === 60) { b.ticks(O, m.P1, { color: GRN, count: 1 }); b.ticks(O, m.P2, { color: GRN, count: 1 }); b.ticks(m.P1, m.P2, { color: GRN, count: 1 }); T(b, { x: 0, y: m.P1.y }, `PP′ = ${p} cm`, AMB, { dy: 22, size: 16 }); }
        else T(b, { x: 0, y: 0 }, `PP′ = ${p} + ${p} = ${2 * p} cm`, AMB, { dy: 22, size: 16 });
      }
      S3.drawSolid(D, F.cone, {});
      D.line({ x: 0, y: F.h, z: 0 }, D.pol(r, 0, 0), SKY, 2.4);
      drawString3D(D, F.mp, segSamples(m.P1, m.P2), { kr: r / F.h });
      const f = p / R, Pp = D.P(D.pol(r * f, F.h * (1 - f), 0));
      b.point(Pp, { color: 'ink', r: 5 });
      if (C.txt) T(b, Pp, 'P', 'ink', { dx: 14, dy: 10, size: 17 });
    },
    steps: (M) => M.ang === 60 ? [
      `모선 위의 점 P는 꼭짓점 O에서 ${M.p} cm 떨어져 있어요. 펼치면 두 반지름 위의 점 P, P′가 돼요(OP = OP′ = ${M.p}).`,
      `중심각 $x = 360°\\times\\dfrac{${M.r}}{${M.R}} = 60°$`,
      `삼각형 $OPP'$은 $\\overline{OP}=\\overline{OP'}=${M.p}$, $\\angle POP'=60°$인 <b>정삼각형</b>이에요.`,
      `최단 거리 $\\overline{PP'} = ${M.p}$ (cm)`
    ] : [
      `모선 위의 점 P는 꼭짓점 O에서 ${M.p} cm 떨어져 있어요. 펼치면 P, P′가 O에서 ${M.p} cm인 곳에 놓여요.`,
      `중심각 $x = 360°\\times\\dfrac{${M.r}}{${M.R}} = 180°$ 이므로 P, O, P′가 한 직선 위에 있어요.`,
      `최단 거리 $\\overline{PP'} = ${M.p} + ${M.p} = ${2 * M.p}$ (cm)`
    ],
    view: (M) => ({
      guide: '점 P가 모선을 따라 움직이도록 <b>P의 위치</b> 막대를 바꿔 보세요. 끈은 전개도의 직선 PP′이고 길이는 중심각이 60°이면 OP, 180°이면 2×OP예요.',
      readouts: [rd('꼭짓점 O에서 P까지', cmv(M.p), ROSE), rd('중심각', M.ang + '°', ROSE), rd('최단 거리 PP′', cmv(M.ans), GRN, M.ang === 60 ? 'PP′ = OP' : 'PP′ = 2×OP', null, true)],
      status: { tone: 'ok', text: `최단 거리 = ${cmv(M.ans)}` },
      formula: M.ang === 60 ? `<p>중심각 60° → △OPP′은 정삼각형 → $\\overline{PP'} = \\overline{OP}$ = <b>${M.p} cm</b></p>` : `<p>중심각 180° → P, O, P′ 일직선 → $\\overline{PP'} = 2\\times\\overline{OP}$ = <b>${2 * M.p} cm</b></p>`,
      rule: '모선 위의 점에서 한 바퀴 도는 최단 거리도 전개도에서 두 점을 이은 선분이다',
      notes: notes('길이는 <b>모선 전체 R가 아니라 꼭짓점 O에서 P까지의 거리 OP</b>로 계산해요.', '반지름이 달라도 중심각이 같으므로 삼각형 모양은 같아요.')
    }),
    prob: (M) => {
      const ang = M.qa, r = M.qr, R = r * S42[ang], p = Math.min(M.qp, R), ans = ang === 60 ? p : 2 * p;
      return {
        tag: '모선 위의 점에서의 최단 거리', key: `${ang}-${r}-${p}`,
        stem: `그림과 같이 밑면의 반지름이 ${r} cm, 모선의 길이가 ${R} cm인 원뿔에서 꼭짓점 O로부터 ${p} cm 떨어진 모선 위의 점 P에서 옆면을 한 바퀴 돌아 다시 P로 오는 가장 짧은 거리는 몇 cm인가?`,
        choices: mkNum(ans, [[ang === 60 ? 2 * p : p, ang === 60 ? '2×OP는 중심각 180°일 때예요. 60°이면 PP′ = OP예요.' : '180°이면 P, O, P′가 일직선이라 OP를 두 번 더해요.'], [R, '모선 전체의 길이예요. 점 P까지의 거리 OP로 계산해요.'], [2 * R, ''], [p + r, '']], (v) => fmtN(v) + ' cm', { valid: (v) => v > 0 && Number.isInteger(v) })
      };
    }
  });

  /* ================================================================== s4-4 원뿔대에서도 (중심각 60°) */
  function m4(s) {
    const r2 = clamp(Math.round(s.soTg), 2, 6), r1 = clamp(Math.min(Math.round(s.soTf), r2 - 1), 1, 4), k = 6, R2 = k * r2, R1 = k * r1, x = 60;
    const O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2, A = pt(O, R2, a0), A2 = pt(O, R2, a1), Hf = Math.sqrt(R2 * R2 - r2 * r2);
    return { r1, r2, R1, R2, x, a0, a1, A, A2, Hf, hF: (R2 - R1) * Hf / R2, ans: R2 };
  }
  S.push({
    id: 's4-4', noView: true, title: '원뿔대에서의 최단 거리', short: '원뿔대',
    question: '원뿔대의 큰 밑면의 점 A에서 옆면을 한 바퀴 돌아 다시 A로 오는 최단 거리는? 원뿔일 때와 같은 방법을 쓸 수 있을까?',
    ctl: ['soTg', 'soTf'],
    init: (s) => { s.soTg = 4; s.soTf = 2; },
    reroll: (s) => { s.soQg = rint(2, 5); s.soQf = rint(1, s.soQg - 1); },
    model: (s) => Object.assign(m4(s), { qg: s.soQg || 3, qf: s.soQf || 1 }),
    draw(b, s, M, C) {
      const prob = C.problem, r2 = prob ? M.qg : M.r2, r1 = prob ? Math.min(M.qf, r2 - 1) : M.r1, R2 = 6 * r2, R1 = 6 * r1, x = 60;
      const O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2, A = pt(O, R2, a0), A2 = pt(O, R2, a1), Hf = Math.sqrt(R2 * R2 - r2 * r2), hF = (R2 - R1) * Hf / R2;
      const sw = R2 * Math.sin(rad(30)), Ab = { x0: -sw, x1: sw, y0: -R2, y1: 0 }, cb = { x0: -r2, x1: r2, y0: -r2 * Math.sin(22 * DEG), y1: hF * Math.cos(22 * DEG) };
      const off = prob ? { dx: 0, dy: 0, below: false } : arrange(b, Ab, cb, R2 * 0.3);
      const D = S3.ctx(b, s, { k: 1, ox: off.dx, oy: off.dy }), frus = S3.solid('frus', { R: r2, r: r1, h1: hF });
      const mp = mapper(r2, R2, Hf, x);
      if (prob) { // 문제: 입체(점 A)만 보여 준다. 원래 큰 원뿔의 모선 R₂ 를 점선으로.
        const D0 = S3.ctx(b, s, {});
        const box = { x0: -r2 - 0.3, x1: r2 + 1.2, y0: -r2 * Math.sin(22 * DEG) - 0.2, y1: Hf * Math.cos(22 * DEG) + 0.2 };
        fit(b, box, { l: 60, r: 70, t: 34, b: 34 });
        S3.drawSolid(D0, frus, {});
        const gh = S3.tangents(S3.ringP(D0, r2, 0), S3.ringP(D0, 0, Hf)).lines; gh.forEach((ln) => b.path([ln[0], ln[1]], { color: 'muted', width: 1.8, dash: [6, 5], alpha: 0.8 }));
        D0.line({ x: 0, y: Hf, z: 0 }, D0.pol(r2, 0, 0), AMB, 3);
        T(b, D0.P({ x: r2 * 0.55, y: Hf * 0.42, z: 0 }), `R = ${R2} cm`, AMB, { dx: 50, size: 15 });
        D0.line({ x: 0, y: 0, z: 0 }, { x: r2, y: 0, z: 0 }, SKY, 2.6); T(b, D0.P({ x: r2 / 2, y: 0, z: 0 }), `r = ${r2}`, SKY, { dy: 18, size: 15 });
        D0.line({ x: 0, y: hF, z: 0 }, { x: r1, y: hF, z: 0 }, ROSE, 2.6); T(b, D0.P({ x: r1 / 2, y: hF, z: 0 }), `${r1}`, ROSE, { dy: -16, size: 15 });
        b.point(D0.P(D0.pol(r2, 0, 0)), { color: 'ink', r: 5 }); T(b, D0.P(D0.pol(r2, 0, 0)), 'A', 'ink', { dx: 14, dy: 14, size: 17 });
        return;
      }
      fit(b, unionB(Ab, shiftB(cb, off.dx, off.dy)), { l: 34, r: 34, t: 44, b: 34 });
      const band = arcPts(O, R2, a0, a1).concat(arcPts(O, R1, a1, a0));
      b.path(band, { close: true, fill: SKY, fillAlpha: 0.26, color: SKY, width: 3 });
      b.path(arcPts(O, R1, a0, a1), { color: 'muted', width: 1.6, dash: [5, 5], alpha: 0.8 });
      b.seg(O, pt(O, R1, a0), { color: 'muted', width: 1.4, dash: [4, 4], alpha: 0.7 }); b.seg(O, pt(O, R1, a1), { color: 'muted', width: 1.4, dash: [4, 4], alpha: 0.7 });
      b.seg(A, A2, { color: AMB, width: 5.5 });
      if (C.txt) {
        T(b, A, 'A', 'ink', { dx: -14, dy: 8, size: 17 }); T(b, A2, "A′", 'ink', { dx: 16, dy: 8, size: 17 }); T(b, O, 'O', 'ink', { dy: -14, size: 16 });
        T(b, { x: 0, y: A.y }, `AA′ = R₂ = ${R2} cm`, AMB, { dy: 22, size: 16 });
        T(b, { x: A.x / 2, y: A.y / 2 }, `R₂ = ${R2}`, SKY, { dx: -34, size: 14 });
        T(b, pt(O, R1, -90), `R₁ = ${R1}`, 'muted', { dy: -16, size: 14 });
        b.angle(O, pt(O, 1, a0), pt(O, 1, a1), { r: Math.min(R1 * 0.5, px(b, 26)), color: ROSE, label: '60°', size: 13 });
      }
      S3.drawSolid(D, frus, {});
      drawString3D(D, mp, segSamples(A, A2), { kr: r2 / Hf });
      b.point(D.P(D.pol(r2, 0, 0)), { color: 'ink', r: 5 });
      if (C.txt) { T(b, D.P(D.pol(r2, 0, 0)), 'A', 'ink', { dx: 14, dy: 14, size: 17 }); T(b, D.P({ x: r2 / 2, y: 0, z: 0 }), `${r2}`, SKY, { dy: 17, size: 14 }); T(b, D.P({ x: r1 / 2, y: hF, z: 0 }), `${r1}`, AMB, { dy: -15, size: 14 }); }
    },
    steps: (M) => [
      `원뿔대를 펼치면 큰 부채꼴(반지름 $R_2=${M.R2}$)에서 작은 부채꼴(반지름 $R_1=${M.R1}$)을 뺀 띠 모양이에요.`,
      `큰 부채꼴의 중심각은 $360°\\times\\dfrac{${M.r2}}{${M.R2}} = 60°$예요.`,
      `A와 A′를 직선으로 이어요. 이 직선은 안쪽 부채꼴(점선)을 지나지 않고 띠 위에 놓여요. 삼각형 $OAA'$은 정삼각형이에요.`,
      `최단 거리 $\\overline{AA'} = R_2 = ${M.R2}$ (cm)`
    ],
    view: (M) => ({
      guide: '큰 밑면과 작은 밑면의 반지름을 바꿔 보세요. 입체 위의 끈은 전개도의 직선 AA′예요. 이 원뿔대는 큰 원뿔의 r : R = 1 : 6 이라 중심각이 60°예요.',
      readouts: [rd('큰 부채꼴의 반지름 R₂', cmv(M.R2), SKY, `큰 밑면의 반지름 ${M.r2}의 6배`), rd('작은 부채꼴의 반지름 R₁', cmv(M.R1), 'muted'), rd('최단 거리 AA′', cmv(M.ans), GRN, 'AA′ = R₂ (정삼각형)', null, true)],
      status: { tone: 'ok', text: `최단 거리 = ${cmv(M.ans)}` },
      formula: `<p>큰 부채꼴의 중심각 = 360° × ${M.r2}/${M.R2} = 60° → △OAA′은 정삼각형</p><p>$\\overline{AA'} = R_2$ = <b>${M.R2} cm</b></p>`,
      rule: '원뿔대 옆면의 최단 거리도 전개도에서 두 점을 이은 선분이다',
      notes: notes('원뿔대에서는 <b>큰 부채꼴의 반지름 R₂</b>를 써요(작은 부채꼴이 아니에요).', '직선이 안쪽의 <b>작은 부채꼴을 지나면 안 돼요</b>. 이 그림에서는 지나지 않아요.')
    }),
    prob: (M) => {
      const r2 = M.qg, R2 = 6 * r2, ans = R2;
      return {
        tag: '원뿔대 옆면의 최단 거리', key: `${r2}-${Math.min(M.qf, r2 - 1)}`,
        stem: `그림은 모선의 길이가 ${R2} cm이고 밑면의 반지름이 ${r2} cm인 큰 원뿔에서 윗부분을 잘라 낸 원뿔대이다. 큰 밑면 위의 점 A에서 옆면을 한 바퀴 돌아 다시 A로 오는 가장 짧은 거리는 몇 cm인가? (큰 원뿔의 전개도의 중심각이 60°이다.)`,
        choices: mkNum(ans, [[2 * R2, '꼭짓점을 지나가는 길이에요. 가장 짧지 않아요.'], [R2 / 2, ''], [r2 * 2, ''], [R2 + r2, '']], (v) => v + ' cm', { valid: (v) => v > 0 && Number.isInteger(v) })
      };
    }
  });

  G.register(40, 'rv4', '④ 원뿔 옆면의 최단거리', '원뿔 옆면 최단거리', PARAMS, S);
})();
