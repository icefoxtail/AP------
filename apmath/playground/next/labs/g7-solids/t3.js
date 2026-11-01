/* ==========================================================================
   중1 · 회전체 — 탭 ③ 「원기둥·원뿔의 전개도」 (t3.js, order 30) — 장면 5개
   · s3-1 원기둥 굴리기(옆면 가로 = 밑면의 둘레 2πr) · s3-2 원뿔 전개도(호의 길이 = 밑면의 둘레) · s3-3 중심각 구하기(360°×r/R)
   · s3-4 원뿔의 옆넓이 = πRr(부채꼴을 잘라 가로로 맞물리기) · s3-5 원뿔대의 전개도(큰 부채꼴 − 작은 부채꼴)
   전개도는 평면(2D)을 크게, 입체는 3D로 하나만 옆에 놓아 같은 길이가 같은 색으로 대응됩니다.
   움직임은 가로로만: 원기둥이 가로로 굴러가며 자취를 남기고, 조각은 가로로 밀려 맞물리며, 작은 부채꼴은 가로로 빠집니다.
   이 파일은 전개도 그리기 도구를 APL_SO.NET 으로 내놓아 t4.js(최단거리)가 함께 씁니다. 중1 범위: √ 없이 π·분수만 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SO;
  if (!G || !G.S3) return;
  const S3 = G.S3;
  const { PI, DEG, clamp, fmtN, T, fit, P, rd, notes, mkNum, mkText, rint, pick, shuffle, esc, span, jo, piT, bboxOf, seg01 } = G;
  const AMB = 'amber', SKY = 'sky', ROSE = 'rose', GRN = 'green';
  const cmv = (v) => fmtN(v) + ' cm';
  const rad = (d) => d * DEG;
  const pk = (n) => (n === 1 ? 'π' : n + 'π');
  const pkT = (n) => (n === 1 ? '\\pi' : n + '\\pi');

  const PARAMS = {
    soCr: P('밑면의 반지름 r', 1, 3, 1, 2, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soCh: P('높이 h', 2, 6, 1, 4, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soRl: P('옆면 펼친 정도', 0, 1, 0.005, 0.5, { color: 'amber', hint: '오른쪽으로 끌면 옆면이 한 줄로 오른쪽으로 펼쳐져요', format: (v) => (v * 100 >= 99.5 ? '한 바퀴' : Math.round(v * 360) + '°') }),
    soNr: P('밑면의 반지름 r', 1, 6, 1, 3, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soNR: P('모선의 길이 R', 2, 9, 1, 6, { color: 'amber', hint: 'R은 r보다 길어야 해요', format: (v) => Math.round(v) + ' cm' }),
    soNt: P('호와 둘레 비교하기', 0, 1, 0.005, 0.5, { color: 'amber', hint: '오른쪽으로 끌면 색이 칠해지며 길이가 같아지는 것을 볼 수 있어요', format: (v) => Math.round(v * 100) + '%' }),
    soNk: P('R은 r의 몇 배', 2, 6, 1, 3, { color: 'amber', format: (v) => 'R = ' + Math.round(v) + ' × r' }),
    soNq: P('조각 밀기', 0, 1, 0.005, 0.4, { color: 'green', hint: '오른쪽으로 끌면 조각이 가로로 밀려 맞물려요', format: (v) => Math.round(v * 100) + '%' }),
    soF1: P('작은 밑면의 반지름', 1, 4, 1, 2, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soF2: P('큰 밑면의 반지름', 2, 6, 1, 4, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soFk: P('모선은 반지름의 몇 배', 2, 5, 1, 3, { color: 'amber', format: (v) => '× ' + Math.round(v) }),
    soFg: P('작은 부채꼴 빼기', 0, 1, 0.005, 1, { color: 'rose', hint: '작은 부채꼴이 가로로 빠져요', format: (v) => Math.round(v * 100) + '%' })
  };

  /* ------------------------------------------------------------------ 평면(전개도) 그리기 도구 */
  const pt = (O, R, deg) => ({ x: O.x + R * Math.cos(rad(deg)), y: O.y + R * Math.sin(rad(deg)) });
  const arcPts = (O, R, a0, a1) => { const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 3)), o = []; for (let i = 0; i <= n; i++) o.push(pt(O, R, a0 + (a1 - a0) * i / n)); return o; };
  const sectorPts = (O, R, a0, a1) => [O].concat(arcPts(O, R, a0, a1));
  const unionB = (a, c) => ({ x0: Math.min(a.x0, c.x0), x1: Math.max(a.x1, c.x1), y0: Math.min(a.y0, c.y0), y1: Math.max(a.y1, c.y1) });
  const shiftB = (a, dx, dy) => ({ x0: a.x0 + dx, x1: a.x1 + dx, y0: a.y0 + dy, y1: a.y1 + dy });
  // 두 그림(A 고정, B 지역 상자)을 오른쪽 또는 아래에 놓습니다. 화면에서 더 크게 보이는 쪽을 고릅니다.
  function arrange(b, A, B, gapU) {
    const W = Math.max(60, b.W - 90), H = Math.max(60, b.H - 90), g = gapU;
    const bw = B.x1 - B.x0, bh = B.y1 - B.y0;
    const right = { dx: A.x1 + g - B.x0, dy: (A.y0 + A.y1) / 2 - (B.y0 + B.y1) / 2 }, below = { dx: (A.x0 + A.x1) / 2 - (B.x0 + B.x1) / 2, dy: A.y0 - g - B.y1 };
    const kOf = (o) => { const u = unionB(A, shiftB(B, o.dx, o.dy)); return Math.min(W / (u.x1 - u.x0), H / (u.y1 - u.y0)); };
    void bw; void bh;
    const bl = kOf(below) > kOf(right) * 1.02;
    return Object.assign(bl ? below : right, { below: bl });
  }
  function sectorBox(R, x, r, withCircle) { const bb = bboxOf(sectorPts({ x: 0, y: 0 }, R, -90 - x / 2, -90 + x / 2)); if (withCircle) { bb.y0 = Math.min(bb.y0, -(R + 2 * r)); bb.x0 = Math.min(bb.x0, -r); bb.x1 = Math.max(bb.x1, r); } return bb; }
  // 부채꼴 전개도: 꼭짓점 O 가 위, 부채꼴이 아래로 열려 있고(중심각 x), 호 아래에 밑면(원)이 붙습니다.
  function netGeom(R, r, x) { const O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2, Cc = { x: 0, y: -(R + r) }; return { O, R, r, x, a0, a1, Cc, box: { x0: Math.min(-R * Math.sin(rad(Math.min(x / 2, 90))), -r), x1: Math.max(R * Math.sin(rad(Math.min(x / 2, 90))), r), y0: -(R + 2 * r), y1: x > 180 ? R * Math.cos(rad(180 - x / 2)) * 0 + 0 : 0 } }; }
  const px = (b, n) => n / b.k;
  // 중심각 표시(작은 부채꼴 + 값). 90° 는 직각 표시.
  function angMark(b, C, G0, o = {}) {
    const { O, x, a0, a1 } = G0, rr = Math.min(G0.R * 0.32, px(b, 38));
    if (Math.abs(x - 90) < 1e-6) b.right(O, pt(O, 1, a0), pt(O, 1, a1), { size: 14, color: AMB });
    else b.arc(O, rr, rad(a0), rad(a1), { sector: true, fill: AMB, fillAlpha: 0.28, color: AMB, width: 2.4 });
    if (C.txt) T(b, O, `${fmtN(x)}°`, AMB, { dy: 40, size: o.size || 17 });
  }
  // 부채꼴 + 밑면(원) 전개도 그리기. prog(0~1): 호와 원둘레를 같은 비율만큼 같은 색으로 칠합니다.
  function drawNet(b, C, G0, o = {}) {
    const { O, R, r, x, a0, a1, Cc } = G0, col = o.color || SKY;
    b.path(sectorPts(O, R, a0, a1), { close: true, fill: col, fillAlpha: o.fa == null ? 0.2 : o.fa, color: col, width: 3 });
    if (!o.noCircle) b.circle(Cc, r, { fill: col, fillAlpha: 0.2, color: col, width: 3 });
    const pr = o.prog;
    if (pr != null && pr > 0) {
      b.path(arcPts(O, R, a0, a0 + x * pr), { color: AMB, width: 7 });
      if (!o.noCircle) b.path(arcPts(Cc, r, 90, 90 + 360 * pr), { color: AMB, width: 7 });
    }
    angMark(b, C, G0);
    if (!o.noCircle) b.point(pt(Cc, r, 90), { color: 'ink', r: 3.5 });
  }

  /* ================================================================== s3-1 원기둥 굴리기 */
  const rollM = (s) => { const r = clamp(Math.round(s.soCr), 1, 3), h = clamp(Math.round(s.soCh), 2, 6); return { r, h, t: clamp(s.soRl, 0, 1), sol: S3.solid('cyl', { R: r, h1: h }), pr: s.soPr || 3, ph: s.soPh || 5 }; };
  const S = [];
  S.push({
    id: 's3-1', noView: true, title: '원기둥의 옆면을 펼치면 직사각형', short: '원기둥 옆면 펼치기',
    question: '원기둥의 옆면을 한 줄로 펼치면 어떤 도형일까? 가로와 세로는 입체의 어디일까?',
    ctl: ['soCr', 'soCh', 'soRl'], anim: { key: 'soRl', dur: 6, label: '펼쳐 보기', start: 0.5 },
    stepT: (n) => (n >= 3 ? 1 : n >= 2 ? 0.5 : 0),
    init: (s) => { s.soCr = 2; s.soCh = 4; s.soRl = 0.5; },
    reroll: (s) => { s.soPr = pick([1, 2, 3, 4, 5], s.soPr); s.soPh = pick([2, 3, 4, 5, 6, 7].filter((v) => v !== s.soPr), s.soPh); },
    model: (s) => Object.assign(rollM(s)),
    draw(b, s, M, C) {
      if (C.problem) { // 원기둥의 전개도: 직사각형(가로는 구하는 값) + 위·아래 원
        const r = M.pr, h = M.ph, w = 2 * PI * r;
        const Wd = w, y0 = -h / 2, y1 = h / 2, Ct = { x: 0, y: y1 + r }, Cb = { x: 0, y: y0 - r };
        fit(b, { x0: -Wd / 2, x1: Wd / 2, y0: Cb.y - r, y1: Ct.y + r }, { l: 24, r: 24, t: 24, b: 24 });
        b.poly([{ x: -Wd / 2, y: y0 }, { x: Wd / 2, y: y0 }, { x: Wd / 2, y: y1 }, { x: -Wd / 2, y: y1 }], { fill: AMB, fillAlpha: 0.2, color: AMB, width: 3 });
        b.circle(Ct, r, { fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        b.circle(Cb, r, { fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        T(b, { x: 0, y: 0 }, '옆면: 가로 = ?', AMB, { size: 17 });
        T(b, { x: Wd / 2, y: 0 }, `h = ${h} cm`, AMB, { dx: -48, size: 16, dy: 22 });
        b.seg(Ct, pt(Ct, r, 30), { color: SKY, width: 2.6 }); T(b, Ct, `r = ${r} cm`, SKY, { dy: 16, size: 16 });
        b.seg(Cb, pt(Cb, r, 30), { color: SKY, width: 2.6 }); T(b, Cb, `r = ${r} cm`, SKY, { dy: 16, size: 16 });
        return;
      }
      const { r, h, t, sol } = M, w = 2 * PI * r, cp = Math.cos(22 * DEG), sp = Math.sin(22 * DEG);
      // 오른쪽(또는 아래)에 펼친 옆면의 자리: 입체의 밑면 높이에 맞춰 놓습니다.
      const cb = { x0: -r, x1: r, y0: -r * sp, y1: h * cp + r * sp };
      const rb = { x0: 0, x1: w, y0: 0, y1: h };
      const off = arrange(b, cb, rb, Math.max(r, h) * 0.5);
      const rx = off.dx, ry = off.dy; // 직사각형 왼쪽 아래 모서리의 위치
      fit(b, unionB(cb, shiftB(rb, rx, ry)), { l: 30, r: 30, t: 40, b: 30 });
      const D = S3.ctx(b, s, {});
      S3.drawSolid(D, sol, {});
      const a = 2 * PI * t, n = Math.max(2, Math.ceil(a / (5 * DEG)));
      for (let i = 0; i < n; i++) { // 입체 옆면에서 펼쳐지는 부분(같은 색)
        const t0 = a * i / n, t1 = a * (i + 1) / n;
        D.g.path([D.P(D.pol(r, 0, t0)), D.P(D.pol(r, 0, t1)), D.P(D.pol(r, h, t1)), D.P(D.pol(r, h, t0))], { close: true, fill: AMB, fillAlpha: 0.3, color: null });
      }
      D.line(D.pol(r, 0, 0), D.pol(r, h, 0), AMB, 3.6);
      if (a > 0.05) D.line(D.pol(r, 0, a), D.pol(r, h, a), AMB, 3.6);
      // 펼친 옆면: 왼쪽에서 오른쪽으로 늘어납니다.
      const X0 = rx, Y0 = ry;
      b.poly([{ x: X0, y: Y0 }, { x: X0 + w, y: Y0 }, { x: X0 + w, y: Y0 + h }, { x: X0, y: Y0 + h }], { color: AMB, width: 2.4, dash: [6, 5] });
      b.poly([{ x: X0, y: Y0 }, { x: X0 + w * t, y: Y0 }, { x: X0 + w * t, y: Y0 + h }, { x: X0, y: Y0 + h }], { fill: AMB, fillAlpha: 0.32, color: AMB, width: 3 });
      if (C.txt) {
        T(b, { x: X0 + w / 2, y: Y0 + h }, `가로 = 밑면의 둘레 = 2π × ${r} = ${2 * r}π cm`, AMB, { dy: -17, size: 16 });
        T(b, { x: X0 + w, y: Y0 + h / 2 }, `세로 h = ${h} cm`, AMB, { dx: -62, size: 16 });
        const c0 = D.P({ x: 0, y: 0, z: 0 }), rimP = D.P(D.pol(r, 0, 0));
        b.seg(c0, rimP, { color: SKY, width: 2.6 });
        T(b, { x: (c0.x + rimP.x) / 2, y: (c0.y + rimP.y) / 2 }, `r = ${r}`, SKY, { dy: 16, size: 16 });
        const hm = D.P({ x: r, y: h / 2, z: 0 });
        T(b, hm, `h = ${h}`, AMB, { dx: 36, size: 15 });
        if (C.review && C.step >= 3) T(b, { x: X0 + w / 2, y: Y0 + h / 2 }, `옆넓이 = ${2 * r}π × ${h} = ${2 * r * h}π cm²`, GRN, { size: 17 });
      }
    },
    steps: (M) => [
      `밑면의 반지름 ${M.r} cm, 높이 ${M.h} cm인 원기둥이에요. 옆면의 한 줄(세로선)을 따라 잘라 오른쪽으로 펼쳐요.`,
      `옆면을 펼치는 만큼 오른쪽으로 직사각형이 늘어나요. 한 바퀴 펼치면 옆면 전체가 <b>직사각형</b>이 돼요.`,
      `가로는 한 바퀴 돈 길이 = <b>밑면의 둘레</b> $2\\pi r = 2\\pi\\times${M.r} = ${2 * M.r}\\pi$ (cm), 세로는 <b>높이</b> $h = ${M.h}$ cm예요.`,
      `(옆넓이) = (가로) × (세로) = $${2 * M.r}\\pi\\times${M.h} = ${2 * M.r * M.h}\\pi$ (cm²)`
    ],
    view: (M, C) => ({
      guide: '막대를 오른쪽으로 끌거나 ▶를 눌러 <b>옆면을 오른쪽으로 펼쳐</b> 보세요. 입체에서 펼쳐지는 부분(노랑)과 오른쪽(또는 아래) 직사각형이 같은 비율로 늘어나요.',
      readouts: [rd('옆면의 가로', `${2 * M.r}π cm`, AMB, '밑면의 둘레 2πr'), rd('옆면의 세로', cmv(M.h), AMB, '원기둥의 높이'), rd('옆넓이', `${2 * M.r * M.h}π cm²`, GRN, '가로 × 세로', null, true)],
      status: M.t >= 0.995 ? { tone: 'ok', text: `한 바퀴 → 가로 ${2 * M.r}π cm` } : { tone: 'info', text: `${Math.round(M.t * 360)}° 펼쳤어요` },
      formula: `<p>(옆면의 가로) = (밑면의 둘레) = $2\\pi r$</p><p>(옆면의 세로) = (높이) = $h$</p><p>(옆넓이) = $2\\pi r\\times h$ = ${2 * M.r}π × ${M.h} = <b>${2 * M.r * M.h}π</b> cm²</p>`,
      rule: '원기둥의 옆면의 전개도는 직사각형이고, 가로의 길이는 밑면의 둘레, 세로의 길이는 높이이다',
      notes: notes('가로는 <b>반지름이 아니라 밑면의 둘레</b> $2\\pi r$ 예요.', '펼친 옆면은 직사각형이므로 넓이는 가로 × 세로예요.')
    }),
    prob: (M) => {
      const r = M.pr, h = M.ph, ans = 2 * r * h;
      return {
        tag: '원기둥의 옆넓이', key: `${r}-${h}`,
        stem: `그림은 밑면의 반지름이 ${r} cm, 높이가 ${h} cm인 원기둥의 전개도이다. 옆면의 넓이는 몇 cm²인가?`,
        choices: mkNum(ans, [[r * h, '가로를 반지름 r로 썼어요. 가로는 둘레 2πr이에요.'], [r * r + 2 * r * h, '밑면의 넓이 πr² 하나를 더했어요. 옆넓이만 구해요.'], [2 * r * r, '밑면의 넓이 두 개의 합이에요.'], [4 * r * h, '']], (v) => pk(v) + ' cm²', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: '옆면은 직사각형: 가로 = 밑면의 둘레'
      };
    }
  });

  /* ================================================================== 원뿔 전개도 공통 (s3-2, s3-3) */
  // 원뿔 위의 점은 입체를 바로 세워 그립니다. 밑면의 중심이 (ox, oy).
  function coneDraw3D(b, s, r, R, ox, oy, o = {}) {
    const h = Math.sqrt(Math.max(0.01, R * R - r * r));
    const D = S3.ctx(b, s, { k: 1, ox, oy }), sol = S3.solid('cone', { R: r, h1: h });
    S3.drawSolid(D, sol, {});
    if (o.prog != null) { D.g.path(S3.ringP(D, r, 0, 0, 2 * PI * o.prog, 72), { color: AMB, width: 7 }); }
    return { D, h, sol };
  }
  const coneBox = (s, r, R) => { const h = Math.sqrt(Math.max(0.01, R * R - r * r)), cp = Math.cos(22 * DEG), sp = Math.sin(22 * DEG); return { x0: -r, x1: r, y0: -r * sp, y1: h * cp + r * sp * 0.0 + 0.0 }; };
  const xOf = (r, R) => 360 * r / R;
  function netScene(b, s, C, r, R, o = {}) {
    const x = xOf(r, R), G0 = netGeom(R, r, x), A = sectorBox(R, x, r, true);
    let all = A, off = null;
    const cb = coneBox(s, r, R);
    if (!o.noCone) { off = arrange(b, A, cb, Math.max(r, R) * 0.45); all = unionB(A, shiftB(cb, off.dx, off.dy)); }
    if (o.extraBottom) all = unionB(all, { x0: all.x0, x1: all.x1, y0: all.y0 - o.extraBottom, y1: all.y1 });
    fit(b, all, { l: 34, r: 34, t: 46, b: o.extraBottom ? 30 + o.extraBottom : 30 });
    return { G0, off, A, x, all };
  }

  /* ================================================================== s3-2 원뿔 펼치기 */
  const coneM = (s) => { const r = clamp(Math.round(s.soNr), 1, 6), R = Math.max(clamp(Math.round(s.soNR), 2, 9), r + 1); return { r, R, x: xOf(r, R), t: clamp(s.soNt, 0, 1) }; };
  const xTxt = (x) => (Math.abs(x - Math.round(x)) < 1e-6 ? String(Math.round(x)) : fmtN(x, 1));
  const CONE_PAIRS = (() => { const o = []; for (let r = 1; r <= 5; r++) for (let R = r + 1; R <= 9; R++) if ((360 * r) % R === 0) o.push([r, R]); return o; })();
  S.push({
    id: 's3-2', noView: true, title: '원뿔의 전개도: 호의 길이 = 밑면의 둘레', short: '원뿔 펼치기',
    question: '원뿔의 옆면을 펼치면 어떤 도형일까? 부채꼴의 호의 길이와 밑면의 둘레는 어떤 관계일까?',
    ctl: ['soNr', 'soNR', 'soNt'], anim: { key: 'soNt', dur: 5, label: '길이 비교하기', start: 0.5 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soNr = 3; s.soNR = 6; s.soNt = 0.5; },
    reroll: (s) => { const q = pick(CONE_PAIRS.map((p, i) => i), s.soQi); s.soQi = q; s.soQ = CONE_PAIRS[q]; s.soQv = pick(['x', 'R'], s.soQv); },
    model: (s) => Object.assign(coneM(s), { q: s.soQ || [2, 6], qv: s.soQv || 'x' }),
    draw(b, s, M, C) {
      if (C.problem) {
        const [r, R] = M.q, x = xOf(r, R), G0 = netGeom(R, r, x);
        const A = sectorBox(R, x, r, true);
        fit(b, A, { l: 40, r: 40, t: 40, b: 30 });
        b.path(sectorPts(G0.O, R, G0.a0, G0.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        b.circle(G0.Cc, r, { fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        const edge = pt(G0.O, R, G0.a1);
        T(b, { x: edge.x / 2, y: edge.y / 2 }, `R = ${R} cm`, AMB, { dx: 40, dy: 4, size: 17 });
        b.seg(G0.Cc, pt(G0.Cc, r, 0), { color: SKY, width: 2.6 });
        T(b, pt(G0.Cc, r / 2, 0), `r = ${r} cm`, SKY, { dy: 16, size: 16 });
        if (M.qv === 'x') {
          const rr = Math.min(R * 0.3, px(b, 36));
          b.arc(G0.O, rr, rad(G0.a0), rad(G0.a1), { sector: true, fill: AMB, fillAlpha: 0.28, color: AMB, width: 2.4 });
          T(b, G0.O, 'x = ?', AMB, { dy: 40, size: 17 });
        } else { T(b, G0.O, `${xTxt(x)}°`, AMB, { dy: 40, size: 17 }); b.arc(G0.O, Math.min(R * 0.3, px(b, 36)), rad(G0.a0), rad(G0.a1), { sector: true, fill: AMB, fillAlpha: 0.28, color: AMB, width: 2.4 }); }
        return;
      }
      const { r, R, t } = M, K = netScene(b, s, C, r, R, { extraBottom: 2.6 });
      drawNet(b, C, K.G0, { prog: t });
      if (K.off) { const cd = coneDraw3D(b, s, r, R, K.off.dx, K.off.dy, { prog: t }); const D = cd.D; D.line({ x: 0, y: cd.h, z: 0 }, { x: r, y: 0, z: 0 }, AMB, 3.4); if (C.txt) { const m = D.P({ x: r / 2, y: cd.h / 2, z: 0 }); T(b, m, `R = ${R}`, AMB, { dx: 36, size: 16 }); T(b, D.P({ x: r / 2, y: 0, z: 0 }), `r = ${r}`, SKY, { dy: 18, size: 16 }); } }
      if (C.txt) {
        const arcL = 2 * PI * r, G0 = K.G0;
        const e = pt(G0.O, R, G0.a1);
        T(b, { x: e.x / 2, y: e.y / 2 }, `R = ${R} cm`, AMB, { dx: 40, dy: 6, size: 16 });
        b.seg(G0.Cc, pt(G0.Cc, r, 0), { color: SKY, width: 2.6 });
        T(b, pt(G0.Cc, r / 2, 0), `r = ${r}`, SKY, { dy: 16, size: 16 });
        // 같이 자라는 두 막대(가로): 호의 길이 · 밑면의 둘레
        const yb = K.all.y0 - px(b, 24), yb2 = yb - px(b, 28), x0 = K.all.x0 + px(b, 6), Lw = Math.max(px(b, 120), (K.all.x1 - K.all.x0) * 0.8), tcap = Math.min(1, t);
        b.seg({ x: x0, y: yb }, { x: x0 + Lw, y: yb }, { color: 'muted', width: 1.6, dash: [4, 4], alpha: 0.7 });
        b.seg({ x: x0, y: yb2 }, { x: x0 + Lw, y: yb2 }, { color: 'muted', width: 1.6, dash: [4, 4], alpha: 0.7 });
        b.seg({ x: x0, y: yb }, { x: x0 + Lw * tcap, y: yb }, { color: AMB, width: 7 });
        b.seg({ x: x0, y: yb2 }, { x: x0 + Lw * tcap, y: yb2 }, { color: AMB, width: 7 });
        T(b, { x: x0, y: yb }, '호의 길이', 'ink', { dy: -13, align: 'left', size: 14 });
        T(b, { x: x0, y: yb2 }, '밑면의 둘레', 'ink', { dy: 13, align: 'left', size: 14 });
        if (tcap > 0.97) T(b, { x: x0 + Lw, y: (yb + yb2) / 2 }, `둘 다 ${2 * r}π cm`, GRN, { size: 15, dx: -4, align: 'right' });
      }
    },
    steps: (M) => [
      `밑면의 반지름 ${M.r} cm, 모선의 길이 ${M.R} cm인 원뿔의 옆면을 펼쳐요. 모선이 부채꼴의 <b>반지름</b>이 돼요.`,
      `밑면의 둘레는 $2\\pi r = 2\\pi\\times${M.r} = ${2 * M.r}\\pi$ (cm)이고, 이것이 부채꼴의 <b>호의 길이</b>와 같아요(같은 색 구간이 겹쳐요).`,
      `부채꼴의 호의 길이 = $2\\pi R\\times\\dfrac{x}{360}$ 이므로 $2\\pi\\times${M.R}\\times\\dfrac{x}{360} = 2\\pi\\times${M.r}$`,
      `$x = 360\\times\\dfrac{r}{R} = 360\\times\\dfrac{${M.r}}{${M.R}} = ${xTxt(M.x)}$ (°)`
    ],
    view: (M, C) => ({
      guide: '막대를 오른쪽으로 끌거나 ▶를 눌러 보세요. 부채꼴의 <b>호</b>와 밑면(원)의 <b>둘레</b>가 같은 비율만큼 같은 색으로 칠해지고, 아래 두 막대가 <b>같은 길이로</b> 자라요. 입체의 밑면 테두리도 같은 색이에요.',
      readouts: [rd('부채꼴의 반지름 (모선 R)', cmv(M.R), AMB), rd('호의 길이 = 밑면의 둘레', `${2 * M.r}π cm`, GRN, `2π × ${M.r}`), rd('중심각 x', xTxt(M.x) + '°', AMB, '360° × r ÷ R', null, true)],
      status: M.t >= 0.97 ? { tone: 'ok', text: '호의 길이 = 밑면의 둘레' } : { tone: 'info', text: `${Math.round(M.t * 100)}% 비교 중` },
      formula: `<p>(호의 길이) = (밑면의 둘레)</p><p>$2\\pi R\\times\\dfrac{x}{360} = 2\\pi r$ → $x = 360\\times\\dfrac{r}{R}$</p><p>$x = 360 \\times \\dfrac{${M.r}}{${M.R}} = $ <b>${xTxt(M.x)}°</b></p>`,
      rule: '원뿔의 전개도에서 부채꼴의 반지름은 모선의 길이, 호의 길이는 밑면의 둘레와 같다',
      notes: notes('부채꼴의 반지름은 <b>밑면의 반지름이 아니라 모선</b>의 길이예요.', '호의 길이가 밑면의 <b>둘레</b>와 같다는 것이 중심각을 구하는 열쇠예요.')
    }),
    prob: (M) => {
      const [r, R] = M.q, x = 360 * r / R;
      if (M.qv === 'R') {
        const ans = R;
        return {
          tag: '모선의 길이', key: `R${r}-${R}`,
          stem: `밑면의 반지름이 ${r} cm인 원뿔의 전개도에서 옆면인 부채꼴의 중심각이 ${xTxt(x)}°이다. 이 원뿔의 모선의 길이는 몇 cm인가?`,
          choices: mkNum(ans, [[Math.round(360 / x * r * 10) / 10 === ans ? ans + 2 : (x * r) / 360, '식을 거꾸로 세웠어요. 360° × r ÷ R = x 에서 R을 구하세요.'], [r * 2, ''], [r + 2, ''], [ans * 2, '']], (v) => fmtN(v) + ' cm', { valid: (v) => v > r && Number.isInteger(v) })
        };
      }
      return {
        tag: '부채꼴의 중심각', key: `x${r}-${R}`,
        stem: `그림은 밑면의 반지름이 ${r} cm, 모선의 길이가 ${R} cm인 원뿔의 전개도이다. 옆면인 부채꼴의 중심각의 크기는?`,
        choices: mkNum(x, [[360 * R / r > 360 ? 360 - x : 360 * R / r, '반대로 계산했어요. 중심각 = 360° × r/R (모선이 분모).'], [180 * r / R, '2π를 두 번 나눴어요. 360°에 r/R을 곱해요.'], [360 * (R - r) / R, ''], [x * 2, '']], (v) => fmtN(v) + '°', { valid: (v) => v > 0 && v < 360 && Number.isInteger(v), step: 15 })
      };
    }
  });

  /* ================================================================== s3-3 중심각 구하기 */
  const angM = (s) => { const r = clamp(Math.round(s.soCr), 1, 3), k = clamp(Math.round(s.soNk), 2, 6); return { r, k, R: r * k, x: 360 / k }; };
  S.push({
    id: 's3-3', noView: true, title: '[핵심] 중심각은 r : R로 정해져요', short: '[핵심] 중심각 구하기',
    question: '밑면의 반지름 r와 모선 R의 비가 정해지면 전개도 부채꼴의 중심각은 얼마일까?',
    ctl: ['soCr', 'soNk'], presets: () => [2, 3, 4, 6].map((k, i) => ({ group: i === 0 ? 'r : R' : '', label: `1 : ${k}`, apply: (st) => { st.soNk = k; }, on: (st) => Math.round(st.soNk) === k })),
    init: (s) => { s.soCr = 2; s.soNk = 3; },
    reroll: (s) => { s.soQk = pick([2, 3, 4, 5, 6], s.soQk); s.soQr = pick([1, 2, 3], s.soQr); s.soQv = pick(['x', 'ratio'], s.soQv); },
    model: (s) => Object.assign(angM(s), { qk: s.soQk || 4, qr: s.soQr || 2, qv: s.soQv || 'x' }),
    draw(b, s, M, C) {
      const prob = C.problem, r = prob ? M.qr : M.r, k = prob ? M.qk : M.k, R = r * k, x = 360 / k, G0 = netGeom(R, r, x);
      const A = sectorBox(R, x, r, true);
      fit(b, A, { l: 40, r: 40, t: 40, b: 30 });
      b.path(sectorPts(G0.O, R, G0.a0, G0.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
      b.circle(G0.Cc, r, { fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
      const e = pt(G0.O, R, G0.a1);
      b.seg(G0.Cc, pt(G0.Cc, r, 0), { color: SKY, width: 2.6 });
      if (prob && M.qv === 'ratio') { // 중심각이 주어지고 r : R 을 구함
        b.arc(G0.O, Math.min(R * 0.3, px(b, 36)), rad(G0.a0), rad(G0.a1), { sector: true, fill: AMB, fillAlpha: 0.28, color: AMB, width: 2.4 });
        T(b, G0.O, `${xTxt(x)}°`, AMB, { dy: 40, size: 17 });
        T(b, pt(G0.Cc, r / 2, 0), `r = ${r} cm`, SKY, { dy: 16, size: 16 });
        T(b, { x: e.x / 2, y: e.y / 2 }, 'R = ?', AMB, { dx: 36, dy: 4, size: 17 });
        return;
      }
      if (prob) { T(b, { x: e.x / 2, y: e.y / 2 }, `R = ${R} cm`, AMB, { dx: 40, dy: 4, size: 17 }); T(b, pt(G0.Cc, r / 2, 0), `r = ${r} cm`, SKY, { dy: 16, size: 16 }); b.arc(G0.O, Math.min(R * 0.3, px(b, 36)), rad(G0.a0), rad(G0.a1), { sector: true, fill: AMB, fillAlpha: 0.28, color: AMB, width: 2.4 }); T(b, G0.O, 'x = ?', AMB, { dy: 40, size: 17 }); return; }
      angMark(b, C, G0);
      T(b, { x: e.x / 2, y: e.y / 2 }, `R = ${R} cm`, AMB, { dx: 40, dy: 4, size: 17 });
      T(b, pt(G0.Cc, r / 2, 0), `r = ${r} cm`, SKY, { dy: 16, size: 16 });
      if (C.txt) {
        T(b, G0.Cc, `r : R = 1 : ${k}`, 'ink', { dy: -6, size: 16 });
        const nm = x === 90 ? '직각' : x === 180 ? '반원' : x === 120 ? '원의 1/3' : x === 60 ? '정삼각형과 같은 각' : x === 72 ? '원의 1/5' : '';
        if (nm) T(b, G0.O, nm, GRN, { dy: 62, size: 15 });
      }
    },
    steps: (M) => [
      `원뿔의 전개도에서 부채꼴의 반지름은 모선 $R = ${M.R}$ cm, 호의 길이는 밑면의 둘레 $2\\pi r = ${2 * M.r}\\pi$ cm예요.`,
      `부채꼴의 호의 길이 = $2\\pi R\\times\\dfrac{x}{360}$ = $2\\pi\\times${M.R}\\times\\dfrac{x}{360}$`,
      `$2\\pi\\times${M.R}\\times\\dfrac{x}{360} = 2\\pi\\times${M.r}$ 에서 $x = 360\\times\\dfrac{${M.r}}{${M.R}}$`,
      `$x = 360\\times\\dfrac{1}{${M.k}} = ${xTxt(M.x)}$ (°). $r : R = 1 : ${M.k}$ 이면 중심각은 $360° \\div ${M.k}$예요.`
    ],
    view: (M) => ({
      guide: '<b>r : R의 비</b> 칩을 눌러 보세요. R가 r의 몇 배인지가 바뀌면 부채꼴의 <b>중심각</b>이 달라져요. 1:2는 반원, 1:4는 직각(네모 표시)이에요.',
      readouts: [rd('반지름 r', cmv(M.r), SKY), rd('모선 R', cmv(M.R), AMB, `r : R = 1 : ${M.k}`), rd('중심각 x', xTxt(M.x) + '°', GRN, `360° × ${M.r}/${M.R}`, null, true)],
      status: { tone: 'info', text: `중심각 x = ${xTxt(M.x)}°` },
      formula: `<p>$x = 360° \\times \\dfrac{r}{R}$</p><p>= $360° \\times \\dfrac{${M.r}}{${M.R}}$ = <b>${xTxt(M.x)}°</b></p>`,
      rule: '원뿔의 전개도에서 옆면인 부채꼴의 중심각의 크기는 360° × (밑면의 반지름) / (모선의 길이)이다',
      notes: notes('분자는 <b>밑면의 반지름 r</b>, 분모는 <b>모선 R</b>이에요(바꾸면 360°보다 커져요).', '<b>r : R = 1 : 2</b>이면 반원(180°), <b>1 : 4</b>이면 직각(90°)이에요.')
    }),
    prob: (M) => {
      const r = M.qr, k = M.qk, R = r * k, x = 360 / k;
      if (M.qv === 'ratio') {
        const opts = [2, 3, 4, 5, 6], texts = (kk) => `1 : ${kk}`;
        return { tag: '밑면의 반지름과 모선의 길이의 비', key: `ratio${k}-${r}`, stem: `밑면의 반지름이 ${r} cm인 원뿔의 전개도에서 옆면인 부채꼴의 중심각이 ${xTxt(x)}°이다. 밑면의 반지름과 모선의 길이의 비 r : R는?`, choices: mkText(opts.map((kk) => ({ h: texts(kk), ok: kk === k, hint: kk === k ? '' : '중심각 x = 360° × r/R 이므로 R/r = 360°/x 예요.' }))) };
      }
      return {
        tag: '부채꼴의 중심각 (핵심)', key: `x${r}-${k}`,
        stem: `그림은 밑면의 반지름이 ${r} cm, 모선의 길이가 ${R} cm인 원뿔의 전개도이다. 옆면인 부채꼴의 중심각의 크기는?`,
        choices: mkNum(x, [[360 * R / r > 360 ? 360 - x : 360 * R / r, '반대로 계산했어요. 중심각 = 360° × r/R.'], [180 * r / R, '2π를 두 번 나눴어요.'], [360 * (R - r) / R, ''], [x * 2, '']], (v) => fmtN(v) + '°', { valid: (v) => v > 0 && v < 360 && Number.isInteger(v), step: 15 })
      };
    }
  });

  /* ================================================================== s3-4 원뿔의 옆넓이 = πRr */
  const areaM = (s) => { const r = clamp(Math.round(s.soNr), 1, 4), R = Math.max(clamp(Math.round(s.soNR), 2, 9), r + 1); return { r, R, x: xOf(r, R), q: clamp(s.soNq, 0, 1) }; };
  S.push({
    id: 's3-4', noView: true, title: '원뿔의 옆넓이는 πRr', short: '옆넓이 = πRr',
    question: '원뿔의 옆면인 부채꼴의 넓이는 어떻게 구할까? 부채꼴을 잘게 잘라 다시 배열하면 어떤 도형에 가까워질까?',
    ctl: ['soNr', 'soNR', 'soNq'], anim: { key: 'soNq', dur: 6, label: '조각 밀기', start: 0.4 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soNr = 2; s.soNR = 6; s.soNq = 0.4; },
    reroll: (s) => { s.soQr = pick([1, 2, 3, 4], s.soQr); s.soQR = rint(s.soQr + 1, 9); },
    model: (s) => Object.assign(areaM(s), { qr: s.soQr || 2, qR: s.soQR || 5 }),
    draw(b, s, M, C) {
      if (C.problem) { // 전개도 그림: r, R 만 주어짐
        const r = M.qr, R = M.qR, x = xOf(r, R), G0 = netGeom(R, r, x);
        const A = sectorBox(R, x, r, true);
        fit(b, A, { l: 40, r: 40, t: 40, b: 30 });
        b.path(sectorPts(G0.O, R, G0.a0, G0.a1), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        b.circle(G0.Cc, r, { fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        const e = pt(G0.O, R, G0.a1);
        T(b, { x: e.x / 2, y: e.y / 2 }, `R = ${R} cm`, AMB, { dx: 40, dy: 4, size: 17 });
        b.seg(G0.Cc, pt(G0.Cc, r, 0), { color: SKY, width: 2.6 }); T(b, pt(G0.Cc, r / 2, 0), `r = ${r} cm`, SKY, { dy: 16, size: 16 });
        return;
      }
      const { r, R, x, q } = M, N = x >= 150 ? 14 : 16, d = x / N, chord = 2 * R * Math.sin(rad(d / 2)), hgt = R * Math.cos(rad(d / 2));
      const W = (N / 2) * chord, topY = 0, G0 = netGeom(R, r, x);
      // 위: 전체 부채꼴(조각 색 번갈아). 아래: 조각을 위·아래 방향을 번갈아 가로로 놓고 맞물림
      const rowY = -R - 1.1 - Math.max(0, R * Math.sin(rad(Math.max(0, x / 2 - 90)))), spread = 1 + 0.45 * (1 - q);
      const sb0 = sectorBox(R, x, r, false), A = { x0: Math.min(sb0.x0, -W * 0.75), x1: Math.max(sb0.x1, W * 0.75), y0: rowY - hgt - 1.6, y1: Math.max(0.4, sb0.y1 + 0.2) };
      fit(b, A, { l: 30, r: 30, t: 30, b: 30 });
      for (let i = 0; i < N; i++) { const a0 = G0.a0 + i * d, col = i % 2 === 0 ? SKY : GRN; b.path(sectorPts(G0.O, R, a0, a0 + d), { close: true, fill: col, fillAlpha: 0.32, color: col, width: 1.4 }); }
      b.path(arcPts(G0.O, R, G0.a0, G0.a1), { color: AMB, width: 3.2 });
      void topY;
      const xc = 0, x0 = xc - W / 2, Yt = rowY, Yb = rowY - hgt;
      for (let i = 0; i < N; i++) {
        const down = i % 2 === 0, j = Math.floor(i / 2), px0 = x0 + (j + (down ? 0.5 : 1)) * chord, X = xc + (px0 - xc) * spread;
        const c = { x: X, y: down ? Yt : Yb }, mid = down ? -90 : 90, col = down ? SKY : GRN;
        b.path(sectorPts(c, R, mid - d / 2, mid + d / 2), { close: true, fill: col, fillAlpha: 0.4, color: col, width: 1.6 });
      }
      if (C.txt) {
        T(b, G0.O, `${xTxt(x)}°`, AMB, { dy: 36, size: 16 });
        T(b, { x: 0, y: -R * 0.55 }, `호의 길이 2π×${r} = ${2 * r}π`, AMB, { dy: 0, size: 14 });
        if (q > 0.6) {
          const al = clamp((q - 0.6) / 0.35, 0, 1);
          b.seg({ x: x0, y: Yt + 0.15 }, { x: x0 + W, y: Yt + 0.15 }, { color: AMB, width: 3, alpha: al });
          T(b, { x: xc, y: Yt + 0.15 }, `가로 ≈ 호의 길이의 절반 = π×${r} = ${pk(r)}`, AMB, { dy: -17, size: 15, alpha: al });
          b.seg({ x: x0 - 0.2, y: Yt }, { x: x0 - 0.2, y: Yb }, { color: ROSE, width: 3, alpha: al });
          T(b, { x: x0 - 0.2, y: (Yt + Yb) / 2 }, `세로 ≈ R = ${R}`, ROSE, { dx: -8, align: 'right', size: 15, alpha: al });
          T(b, { x: xc, y: Yb }, `넓이 ≈ ${pk(r)} × ${R} = ${pk(r * R)} cm²`, GRN, { dy: 24, size: 16, alpha: al });
        }
      }
      b.handle('q', { x: x0 + W * 0.0 + (W * 1.0) * q, y: Yb - 0.9 }, { color: GRN, ariaLabel: '조각을 가로로 밀기', drag: (w) => { s.playing = false; s.soNq = clamp((w.x - x0) / W, 0, 1); } });
      b.seg({ x: x0, y: Yb - 0.9 }, { x: x0 + W, y: Yb - 0.9 }, { color: 'muted', width: 3, alpha: 0.6 });
      void chord;
    },
    steps: (M) => [
      `밑면의 반지름 ${M.r} cm, 모선 ${M.R} cm인 원뿔의 옆면은 반지름 ${M.R}, 호의 길이 $2\\pi\\times${M.r}$인 부채꼴이에요.`,
      `부채꼴을 잘게 나눠 위·아래 방향을 번갈아 가로로 놓고 맞물려요. 직사각형에 가까워져요.`,
      `가로 = 호의 길이의 절반 = $\\dfrac12\\times 2\\pi\\times ${M.r} = ${pkT(M.r)}$, 세로 = 반지름 = ${M.R}`,
      `(옆넓이) = $${pkT(M.r)}\\times${M.R} = ${pkT(M.r * M.R)}$ (cm²). 일반적으로 $\\pi R r$ 이에요.`
    ],
    view: (M) => ({
      guide: '막대를 오른쪽으로 끌면 <b>조각이 가로로 밀려</b> 맞물려요. 가로는 호의 길이의 절반, 세로는 반지름 R이에요.',
      readouts: [rd('가로 (호의 길이의 절반)', `${pk(M.r)} cm`, AMB, 'π × r'), rd('세로 (모선 R)', cmv(M.R), ROSE), rd('옆넓이', `${pk(M.r * M.R)} cm²`, GRN, 'π × R × r', null, true)],
      status: M.q > 0.95 ? { tone: 'ok', text: `옆넓이 = ${pk(M.r * M.R)} cm²` } : { tone: 'info', text: '조각을 가로로 밀어 보세요' },
      formula: `<p>(옆넓이) = $\\dfrac12\\times(\\text{호의 길이})\\times R$ = $\\dfrac12\\times 2\\pi r\\times R$ = $\\pi R r$</p><p>= π × ${M.R} × ${M.r} = <b>${M.r * M.R}π</b> cm²</p>`,
      rule: '원뿔의 옆넓이 = (1/2) × (호의 길이) × (모선의 길이) = πRr',
      notes: notes('옆넓이에는 <b>모선 R</b>을 써요(높이가 아니에요).', '겉넓이는 <b>밑면의 넓이 πr²</b>까지 더해요.')
    }),
    prob: (M) => {
      const r = M.qr, R = M.qR, ans = r * r + r * R;
      return {
        tag: '원뿔의 겉넓이', key: `${r}-${R}`,
        stem: `그림은 밑면의 반지름이 ${r} cm, 모선의 길이가 ${R} cm인 원뿔의 전개도이다. 이 원뿔의 겉넓이는 몇 cm²인가?`,
        choices: mkNum(ans, [[r * R, '옆넓이만 구했어요. 겉넓이에는 밑면의 넓이 πr²도 더해요.'], [r * r + 2 * r * R, '옆넓이를 두 배로 계산했어요. 옆넓이는 πRr이에요.'], [2 * r * r + r * R, '밑면을 두 번 더했어요. 원뿔의 밑면은 하나예요.'], [r * r, '']], (v) => pk(v) + ' cm²', { valid: (v) => v > 0 && Number.isInteger(v) })
      };
    }
  });

  /* ================================================================== s3-5 원뿔대의 전개도 */
  const frM = (s) => { const r2 = clamp(Math.round(s.soF2), 2, 6), r1 = clamp(Math.min(Math.round(s.soF1), r2 - 1), 1, 4), k = clamp(Math.round(s.soFk), 2, 5); return { r1, r2, k, R1: k * r1, R2: k * r2, x: 360 / k, g: clamp(s.soFg, 0, 1), side: k * (r2 - r1) }; };
  S.push({
    id: 's3-5', noView: true, title: '원뿔대의 전개도', short: '원뿔대 전개도',
    question: '원뿔대의 옆면을 펼치면 어떤 모양일까? 큰 부채꼴에서 작은 부채꼴을 빼면 무엇이 남을까?',
    ctl: ['soF1', 'soF2', 'soFk', 'soFg'],
    init: (s) => { s.soF1 = 2; s.soF2 = 4; s.soFk = 3; s.soFg = 1; },
    reroll: (s) => { s.soQk = pick([2, 3, 4, 5], s.soQk); s.soQ2 = rint(2, 5); s.soQ1 = rint(1, s.soQ2 - 1); },
    model: (s) => { const m = frM(s); return Object.assign(m, { qk: s.soQk || 3, q2: s.soQ2 || 4, q1: s.soQ1 || 2, area: m.k * (m.r2 * m.r2 - m.r1 * m.r1) }); },
    draw(b, s, M, C) {
      const prob = C.problem, k = prob ? M.qk : M.k, r1 = prob ? M.q1 : M.r1, r2 = prob ? M.q2 : M.r2, R1 = k * r1, R2 = k * r2, x = 360 / k, g = prob ? 0 : M.g;
      const O = { x: 0, y: 0 }, a0 = -90 - x / 2, a1 = -90 + x / 2, sw = R2 * Math.sin(rad(Math.min(x / 2, 90))), shiftX = g * (sw + R1 * Math.sin(rad(Math.min(x / 2, 90))) + 1.4);
      const sb5 = sectorBox(R2, x, 0, false), A = { x0: sb5.x0, x1: sb5.x1 + shiftX, y0: sb5.y0 - 0.6, y1: Math.max(0.2, sb5.y1 + 0.2) };
      const fh = Math.sqrt(Math.max(0.01, (k * (r2 - r1)) ** 2 - (r2 - r1) ** 2));
      const cb = { x0: -r2, x1: r2, y0: -r2 * Math.sin(22 * DEG), y1: fh * Math.cos(22 * DEG) };
      let all = A, off = null;
      if (!prob) { off = arrange(b, { x0: -sw, x1: sw + (shiftX > 0 ? Math.min(shiftX, sw * 1.0 + R1 * 0.5) : 0), y0: A.y0, y1: A.y1 }, cb, R2 * 0.4); all = unionB(A, shiftB(cb, off.dx, off.dy)); }
      fit(b, all, { l: 36, r: 36, t: 40, b: 30 });
      // 남는 띠(큰 부채꼴 − 작은 부채꼴): 큰 호 · 작은 호 · 두 모선
      const band = arcPts(O, R2, a0, a1).concat(arcPts(O, R1, a1, a0));
      b.path(band, { close: true, fill: SKY, fillAlpha: 0.26, color: SKY, width: 3 });
      // 작은 부채꼴은 가로로 빠져나갑니다.
      const Os = { x: shiftX, y: 0 };
      if (prob) { // 문제: 띠 모양과 주어진 반지름만 (중심각·호의 길이는 구하는 값)
        b.path(sectorPts(O, R1, a0, a1), { close: true, color: 'muted', width: 1.6, dash: [5, 5], alpha: 0.7 });
        if (C.txt) {
          const eL = pt(O, R2, a0), eM = pt(O, R1, a0);
          T(b, { x: eL.x * 0.5, y: eL.y * 0.5 }, `R₂ = ${R2} cm`, SKY, { dx: -8, size: 15, align: 'right' });
          T(b, pt(O, R1, -90), `R₁ = ${R1} cm`, 'ink', { dy: -18, size: 15 });
          void eM;
        }
      } else {
        if (shiftX > 0.4) b.path(sectorPts(O, R1, a0, a1), { close: true, color: 'muted', width: 1.6, dash: [5, 5], alpha: 0.7 });
        b.path(sectorPts(Os, R1, a0, a1), { close: true, fill: AMB, fillAlpha: shiftX < 0.01 ? 0.18 : 0.26, color: AMB, width: 2.6, dash: shiftX < 0.01 ? [6, 5] : undefined });
        if (C.txt) {
          const e2 = pt(O, R2, a1), e1 = pt(O, R1, a1);
          T(b, { x: (e1.x + e2.x) / 2, y: (e1.y + e2.y) / 2 }, `${k * (r2 - r1)} cm`, SKY, { dx: 34, size: 16 });
          T(b, pt(O, R2, -90), `큰 호 = 2π×${r2} = ${2 * r2}π`, SKY, { dy: 18, size: 15 });
          T(b, pt(Os, R1, -90), `작은 호 = 2π×${r1} = ${2 * r1}π`, AMB, { dy: 18, size: 14 });
          { const eL = pt(O, R2, a0); T(b, { x: eL.x * 0.5, y: eL.y * 0.5 }, `R = ${R2}`, SKY, { dx: -6, dy: 0, size: 14, align: 'right' }); }
          const rr = Math.min(R1 * 0.36, px(b, 30));
          b.arc(O, rr, rad(a0), rad(a1), { sector: true, fill: ROSE, fillAlpha: 0.3, color: ROSE, width: 2.2 });
          T(b, O, `${fmtN(x)}°`, ROSE, { dy: 28, size: 15 });
        }
      }
      if (off) {
        const frus = S3.solid('frus', { R: r2, r: r1, h1: fh }), D = S3.ctx(b, s, { k: 1, ox: off.dx, oy: off.dy });
        S3.drawSolid(D, frus, {});
        if (C.txt) { T(b, D.P({ x: r2 / 2, y: 0, z: 0 }), `${r2}`, SKY, { dy: 18, size: 15 }); T(b, D.P({ x: r1 / 2, y: fh, z: 0 }), `${r1}`, AMB, { dy: -16, size: 15 }); D.line({ x: r2, y: 0, z: 0 }, { x: r1, y: fh, z: 0 }, SKY, 3.4); }
      }
    },
    steps: (M) => [
      `원뿔대의 옆면을 펼치면 큰 부채꼴(반지름 ${M.R2})에서 작은 부채꼴(반지름 ${M.R1})을 뺀 <b>띠 모양</b>이에요. 두 부채꼴의 중심각은 같아요: $360°\\div ${M.k} = ${fmtN(M.x)}°$`,
      `큰 호의 길이는 큰 밑면의 둘레 $2\\pi\\times${M.r2}=${2 * M.r2}\\pi$, 작은 호는 작은 밑면의 둘레 $2\\pi\\times${M.r1}=${2 * M.r1}\\pi$예요.`,
      `(옆넓이) = (큰 부채꼴) − (작은 부채꼴) = $\\pi\\times${M.R2}\\times${M.r2} - \\pi\\times${M.R1}\\times${M.r1}$`,
      `= $${M.R2 * M.r2}\\pi - ${M.R1 * M.r1}\\pi = ${M.area}\\pi$ (cm²)`
    ],
    view: (M) => ({
      guide: '<b>작은 부채꼴 빼기</b> 막대를 오른쪽으로 끌면 노란 작은 부채꼴이 <b>가로로</b> 빠져요. 남은 하늘색 띠가 원뿔대의 옆면이에요. 두 부채꼴의 중심각은 같아요.',
      readouts: [rd('큰 부채꼴의 반지름 R₂', cmv(M.R2), SKY), rd('작은 부채꼴의 반지름 R₁', cmv(M.R1), AMB), rd('중심각 (둘 다)', fmtN(M.x) + '°', 'rose'), rd('옆넓이', `${M.area}π cm²`, GRN, 'πR₂r₂ − πR₁r₁', null, true)],
      status: { tone: 'info', text: `옆넓이 = ${M.area}π cm²` },
      formula: `<p>(옆넓이) = (큰 부채꼴의 넓이) − (작은 부채꼴의 넓이)</p><p>= $\\pi R_2 r_2 - \\pi R_1 r_1$ = ${M.R2 * M.r2}π − ${M.R1 * M.r1}π = <b>${M.area}π</b> cm²</p>`,
      rule: '원뿔대의 옆넓이는 큰 원뿔의 옆넓이에서 작은 원뿔의 옆넓이를 뺀 것이다',
      notes: notes('큰 부채꼴과 작은 부채꼴의 <b>중심각은 같아요</b>.', '옆넓이는 <b>큰 것 − 작은 것</b>이에요. 더하지 않아요.')
    }),
    prob: (M) => {
      const k = M.qk, r1 = M.q1, r2 = M.q2, R1 = k * r1, R2 = k * r2, ans = R2 * r2 - R1 * r1;
      return {
        tag: '원뿔대의 옆넓이', key: `${k}-${r1}-${r2}`,
        stem: `그림은 큰 원뿔에서 작은 원뿔을 잘라 낸 원뿔대의 옆면의 전개도이다. 큰 부채꼴의 반지름은 ${R2} cm, 작은 부채꼴의 반지름은 ${R1} cm이고 두 밑면의 반지름은 각각 ${r2} cm, ${r1} cm이다. 원뿔대의 옆넓이는 몇 cm²인가?`,
        choices: mkNum(ans, [[R2 * r2 + R1 * r1, '더하지 않고 빼요. 큰 것에서 작은 것을 빼요.'], [R2 * r2, '큰 부채꼴의 넓이만 구했어요.'], [R1 * r1, '작은 부채꼴의 넓이예요.'], [(R2 - R1) * (r2 - r1), '']], (v) => pk(v) + ' cm²', { valid: (v) => v > 0 && Number.isInteger(v) })
      };
    }
  });

  G.NET = { sectorBox, pt, arcPts, sectorPts, unionB, shiftB, arrange, netGeom, xOf, xTxt, px };
  G.register(30, 'rv3', '③ 원기둥·원뿔의 전개도', '원기둥·원뿔의 전개도', PARAMS, S);
})();
