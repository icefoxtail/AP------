/* ==========================================================================
   중1 · 원과 부채꼴 — 탭 "F03 겹치기·빼기" (f03.js, order 63)
   - 겹치는 부분이 있는 도형: 두 도형을 따로 놓았다가 가로로 밀어 겹치면 겹친 부분이 '두 번' 세어집니다.
     그래서 (합친 넓이) = (넓이의 합) − (겹친 부분), 또는 (색칠한 부분) = (큰 도형) − (작은 도형들) + (겹친 부분) 으로 풉니다.
   - "넓이가 같은 경우": 색칠한 두 부분 (가)=(나) 이면, 겹친 공통 부분을 각각 더한 두 도형의 넓이도 같습니다.
   - 교과서 그림 7개를 모두 담았고(잎 모양 둘레 · 직사각형과 부채꼴 · 정삼각형과 두 호 · 초승달 · 네 잎 ·
     두 원을 감싼 도형 · 반원과 부채꼴), 확장 2개(잎 모양 넓이 · 직사각형 두 개 겹치기)를 덧붙였습니다.
   - 모든 도형은 길이·각을 조절 막대(또는 그림 위의 끌 수 있는 점)로 바꿀 수 있고,
     그림의 글자·풀이 단계·문제의 보기와 정답이 바뀐 값에 맞춰 다시 계산됩니다.
   - 움직임 규칙: 조각은 가로로만 밀고(세로 이동 없음), 모양이 바뀔 때는 제자리 회전이나 서서히 나타남만 씁니다.
   - 이 파일은 APL_CS_GROUPS 에 묶음 하나를 등록할 뿐, 다른 전역은 만들지 않습니다.
   - 동작 변수(s.f3*): f3t(진행 0~1) · f3a/f3e/f3b/f3w/f3r/f3k/f3q/f3x/f3h/f3o(길이·각).
     쪽에서 params 를 합쳐 주지 않아도 장면에 들어올 때 스스로 등록합니다.
   ========================================================================== */
(function () {
  'use strict';

  const PI = Math.PI, DEG = PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg = (t, a, b) => ease((t - a) / (b - a));
  const NUM = ['①', '②', '③', '④', '⑤'];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CA = 'amber', CB = 'rose', CO = 'violet', CS = 'sky'; // 도형1 · 도형2 · 겹친 부분 · 색칠(답)

  /* ------------------------------------------------------------------ 숫자 서식 (유리수 π) */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const r = a % b; a = b; b = r; } return a; };
  const q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const qm = (x, y) => q(x[0] * y[0], x[1] * y[1]);
  const qv = (x) => x[0] / x[1];
  const qP = (x) => (x[1] === 1 ? String(x[0]) : x[0] + '/' + x[1]);
  const qT = (x) => (x[1] === 1 ? String(x[0]) : '\\dfrac{' + x[0] + '}{' + x[1] + '}');
  const piP = (k) => (k[1] === 1 ? (k[0] === 1 ? '' : k[0]) + 'π' : (k[0] === 1 ? 'π' : k[0] + 'π') + '/' + k[1]);
  const piT = (k) => (k[1] === 1 ? (k[0] === 1 ? '' : k[0]) + '\\pi' : k[0] === 1 ? '\\dfrac{\\pi}{' + k[1] + '}' : '\\dfrac{' + k[0] + '}{' + k[1] + '}\\pi');
  const fmtN = (v, d = 2) => { const f = Math.pow(10, d); return String(Math.round(v * f) / f).replace('-', '−'); };
  // k·π + c 를 글자(p)와 KaTeX(t)로. piFirst=false 이면 상수항을 먼저.
  function lin(k, c, piFirst = true) {
    const terms = [];
    const add = (kind, val) => { if (val[0] !== 0) terms.push({ kind, neg: val[0] < 0, v: q(Math.abs(val[0]), val[1]) }); };
    if (piFirst) { add('pi', k); add('c', c); } else { add('c', c); add('pi', k); }
    if (!terms.length) return { p: '0', t: '0', v: 0 };
    let p = '', t = '';
    terms.forEach((m, i) => {
      const ps = m.kind === 'pi' ? piP(m.v) : qP(m.v), ts = m.kind === 'pi' ? piT(m.v) : qT(m.v);
      if (i === 0) { p += (m.neg ? '−' : '') + ps; t += (m.neg ? '-' : '') + ts; } else { p += (m.neg ? ' − ' : ' + ') + ps; t += (m.neg ? '-' : '+') + ts; }
    });
    return { p, t, v: qv(k) * PI + qv(c) };
  }
  const Z = [0, 1];
  const par = (L, unit) => '\\left(' + L.t + '\\right)\\mathrm{' + unit + '}';        // (…) cm²
  const parP = (L, unit) => '(' + L.p + ') ' + unit;

  /* ------------------------------------------------------------------ 기하 도우미 (y 아래쪽, 각은 시계 방향이 +) */
  const pt = (x, y) => ({ x, y });
  const polar = (c, r, deg) => ({ x: c.x + r * Math.cos(deg * DEG), y: c.y + r * Math.sin(deg * DEG) });
  function arcPts(c, r, a0, a1) {
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 3));
    const o = [];
    for (let i = 0; i <= n; i++) o.push(polar(c, r, a0 + (a1 - a0) * i / n));
    return o;
  }
  const cat = (...a) => [].concat(...a);
  const sectorPts = (c, r, a0, a1) => cat([c], arcPts(c, r, a0, a1));
  const shift = (pts, dx, dy = 0) => pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  function inPoly(pts, x, y) {
    let ins = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i], b = pts[j];
      if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) ins = !ins;
    }
    return ins;
  }
  function segDist(x, y, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1e-12;
    const t = clamp(((x - a.x) * dx + (y - a.y) * dy) / l2, 0, 1);
    return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
  }
  // 도형 안에서 가장자리와 가장 먼 점(글자 놓을 자리)
  function spot(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    const N = 20;
    let best = null, bd = -1;
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j <= N; j++) {
        const x = x0 + (x1 - x0) * i / N, y = y0 + (y1 - y0) * j / N;
        if (!inPoly(pts, x, y)) continue;
        let d = 1e9;
        for (let k = 0; k < pts.length; k++) d = Math.min(d, segDist(x, y, pts[k], pts[(k + 1) % pts.length]));
        if (d > bd) { bd = d; best = { x, y }; }
      }
    }
    return best || { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
  }

  /* ------------------------------------------------------------------ 그리기 도우미 */
  function fillP(b, paths, color, alpha, o = {}) {
    if (!(alpha > 0.002) || !paths.length) return;
    const em = o.ref != null ? b._em({ ref: o.ref }) : 0;
    let a = alpha;
    if (em === -1) a *= 0.25; else if (em === 1) a = Math.min(0.62, a * 1.5);
    const c = b.ctx;
    c.save();
    c.beginPath();
    paths.forEach((pts) => {
      pts.forEach((p, i) => { const s = b.toS(p); if (i) c.lineTo(s.x, s.y); else c.moveTo(s.x, s.y); });
      c.closePath();
    });
    c.fillStyle = b.color(color, a);
    c.fill(o.evenodd ? 'evenodd' : 'nonzero');
    c.restore();
  }
  function line(b, pts, color, width, o = {}) {
    b.path(pts, Object.assign({ color, width, close: false }, o));
  }
  function tx(b, C, p, str, color, o = {}) {
    if (!C.txt || str == null || str === '') return;
    b.text(p, str, Object.assign({ color, size: 15, baseline: 'middle', weight: 800 }, o));
  }
  // 부채꼴: 색칠 + 호(굵게) + 반지름 두 개
  function sector(b, c, r, a0, a1, color, o = {}) {
    const al = o.alpha == null ? 1 : o.alpha;
    const fa = o.fa == null ? 0.24 : o.fa;
    fillP(b, [sectorPts(c, r, a0, a1)], color, fa * al, { ref: o.ref });
    if (al > 0.01) {
      b.path(arcPts(c, r, a0, a1), { color, width: o.w || 5, alpha: al, ref: o.ref });
      if (o.radii !== false) {
        b.seg(c, polar(c, r, a0), { color, width: 1.8, alpha: 0.85 * al });
        b.seg(c, polar(c, r, a1), { color, width: 1.8, alpha: 0.85 * al });
      }
    }
  }
  function angMark(b, C, v, d0, d1, color, label, rpx, o = {}) {
    if (!C.txt) return;
    b.angle(v, polar(v, 1, d0), polar(v, 1, d1), Object.assign({ r: rpx, color, label, size: 14.5, labelGap: 15 }, o));
  }
  // 도형 상자(fig)와 조각을 늘어놓을 줄(row)을 무대에 맞춥니다. 줄은 오른쪽 또는 아래쪽(그림 크기가 더 큰 쪽).
  function layout2(b, fig, row, o = {}) {
    const aw = Math.max(10, b.W - (b.panes ? 0 : b.insets.left + b.insets.right));
    const ah = Math.max(10, b.H - (b.panes ? 0 : b.insets.top + b.insets.bottom));
    const pp = b.pad * Math.min(aw, ah);
    const W = aw - 2 * pp, H = ah - 2 * pp;
    const narrow = aw < 560;
    const tiny = !!b.thumb;
    const pad = tiny ? { l: 5, r: 5, t: 5, b: 5 } : { l: (narrow ? 20 : 34) + (o.padL || 0), r: (narrow ? 20 : 34) + (o.padR || 0), t: (narrow ? 24 : 54) + (o.padT || 0), b: (narrow ? 26 : 32) + (o.padB || 0) };
    let best = null;
    const tryBox = (box, rowO, mode) => {
      const k = Math.max(3, Math.min((W - pad.l - pad.r) / (box.x1 - box.x0), (H - pad.t - pad.b) / (box.y1 - box.y0)));
      if (!best || k > best.k * 1.03) best = { k, box, row: rowO, mode };
    };
    if (!row) tryBox(fig, null, 'fig');
    else {
      const g = o.gap != null ? o.gap : 0.5 * (o.u || Math.max(fig.x1 - fig.x0, fig.y1 - fig.y0));
      const cy = (fig.y0 + fig.y1) / 2, cx = (fig.x0 + fig.x1) / 2;
      tryBox({ x0: fig.x0, x1: fig.x1 + g + row.w, y0: Math.min(fig.y0, cy - row.h / 2), y1: Math.max(fig.y1, cy + row.h / 2) }, { x: fig.x1 + g, y: cy - row.h / 2 }, 'right');
      tryBox({ x0: Math.min(fig.x0, cx - row.w / 2), x1: Math.max(fig.x1, cx + row.w / 2), y0: fig.y0, y1: fig.y1 + g + row.h }, { x: cx - row.w / 2, y: fig.y1 + g }, 'below');
    }
    const k = best.k, bx = best.box;
    let fx = [bx.x0 - pad.l / k, bx.x1 + pad.r / k], fy = [bx.y0 - pad.t / k, bx.y1 + pad.b / k];
    if (o.small && o.mix != null && o.mix < 1) { // 처음에는 도형만 크게 → 조각이 나타나면서 서서히 물러남
      const sb = o.small;
      const ks = Math.max(3, Math.min((W - pad.l - pad.r) / (sb.x1 - sb.x0), (H - pad.t - pad.b) / (sb.y1 - sb.y0)));
      const sx = [sb.x0 - pad.l / ks, sb.x1 + pad.r / ks], sy = [sb.y0 - pad.t / ks, sb.y1 + pad.b / ks], m = o.mix;
      fx = [sx[0] + (fx[0] - sx[0]) * m, sx[1] + (fx[1] - sx[1]) * m];
      fy = [sy[0] + (fy[0] - sy[0]) * m, sy[1] + (fy[1] - sy[1]) * m];
    }
    b.focus = { x: fx, y: fy };
    return { k: b.k, row: best.row, mode: best.mode };
  }
  const rpxOf = (b, r, lo = 22, hi = 46, f = 0.22) => clamp(r * b.k * f, lo, hi);

  /* ------------------------------------------------------------------ 조절 값 */
  const PARAM_T = {
    value: 0, min: 0, max: 1, step: 0.005, color: 'amber', label: '움직여 보기',
    hint: '오른쪽으로 끌면 조각이 가로로 움직여요',
    format: (v) => Math.round(v * 100) + '%'
  };
  const cmF = (v) => fmtN(v) + ' cm';
  const PARAMS = {
    f3t: PARAM_T,
    f3a: { value: 6, min: 2, max: 12, step: 1, color: 'sky', label: '정사각형의 한 변 a', format: cmF },
    f3e: { value: 6, min: 2, max: 12, step: 2, color: 'sky', label: '정사각형의 한 변 a', hint: '반지름 a/2가 정수가 되도록 짝수만', format: cmF },
    f3b: { value: 4, min: 2, max: 10, step: 2, color: 'sky', label: '$\\overline{AB}$의 길이', format: cmF },
    f3w: { value: 2, min: 0.5, max: 9, step: 0.01, color: 'amber', label: '$\\overline{AD}$의 길이', hint: '그림의 점 D를 좌우로 끌어도 돼요', format: cmF },
    f3r: { value: 6, min: 3, max: 9, step: 1, color: 'sky', label: '원의 반지름 r', format: cmF },
    f3k: { value: 1, min: 1, max: 2, step: 0.05, color: 'amber', label: '두 원의 중심 사이의 거리 d', hint: '그림의 오른쪽 점을 좌우로 끌어도 돼요. d=r 이 교과서 그림', format: (v) => (Math.abs(v - 1) < 0.001 ? 'd = r' : 'd = ' + fmtN(v) + ' r') },
    f3q: { value: 12, min: 6, max: 18, step: 2, color: 'sky', label: '반원의 지름', format: cmF },
    f3x: { value: 30, min: 5, max: 90, step: 1, color: 'amber', label: '부채꼴의 중심각 x', hint: '그림의 노란 점을 끌어도 돼요', format: (v) => v + '°' },
    f3h: { value: 3, min: 2, max: 6, step: 1, color: 'sky', label: '두 직사각형의 세로', format: cmF },
    f3o: { value: 2, min: 0, max: 4, step: 0.5, color: 'amber', label: '겹친 부분의 가로', hint: '오른쪽 직사각형(분홍)을 좌우로 끌어도 돼요', format: cmF }
  };
  const NUMERIC = ['f3a', 'f3e', 'f3b', 'f3r', 'f3q', 'f3h'];

  let curLab = null;
  function refreshReview(lab) {
    try { lab._buildReview(); } catch (e) { /* 키트가 바뀌어도 그림은 그대로 동작 */ }
    lab.invalidate(true);
  }
  function ensureParams(lab) {
    if (!lab || !lab.params) return;
    for (const id of Object.keys(PARAMS)) {
      if (!lab.params[id]) lab.params[id] = Object.assign({}, PARAMS[id]);
      if (NUMERIC.indexOf(id) >= 0) lab.params[id].onInput = (st, lb) => { st.f3pick = null; st.f3chk = null; refreshReview(lb || lab); };
      if (lab.s && lab.s[id] == null) lab.s[id] = PARAMS[id].value;
    }
  }

  /* ------------------------------------------------------------------ 그림 상태 (탭·단계·진행) */
  function baseCtx(s, lab, thumb) {
    const tab = thumb ? 'explore' : (lab && lab.tab) || 'explore';
    const plain = !thumb && (tab === 'problem' || (tab === 'review' && !s.step));
    const review = !thumb && tab === 'review' && s.step > 0;
    const t = thumb ? 1 : plain ? 0 : clamp(+s.f3t || 0, 0, 1);
    return { tab, plain, review, step: review ? s.step : 99, t, txt: !thumb, thumb: !!thumb, truth: tab !== 'explore' };
  }
  const isStep = (C, n) => C.review && C.step === n;

  const rd = (label, value, color, note, ref, wide) => ({ label, value, color, note, ref, wide });

  /* ================================================================== 장면 정의 */
  const SCENES = [];

  /* ------------------------------------------------------------------ ① 잎 모양의 둘레 (교과서 12번) */
  SCENES.push({
    id: 'f3-leaf-len', title: '정사각형 안의 잎 모양 · 둘레', short: '잎 모양 둘레',
    question: '색칠한 잎 모양의 둘레는 어떤 호로 이루어져 있을까? 그 호들을 이어 붙이면 어떤 모양이 될까?',
    ctl: ['f3a', 'f3t'], dur: 11,
    init: (s) => { s.f3a = 6; },
    reroll: (s) => { s.f3a = pick([4, 6, 8, 10, 12], s.f3a); },
    model: (s) => { const a = s.f3a; return { a, arc: q(a, 2), tot: q(a, 1) }; },
    stepT: (n) => (n >= 4 ? 1 : 0),
    draw(b, s, M, C) {
      const a = M.a, t = C.t;
      const row = C.plain ? null : { w: 2.3 * a, h: 2 * a };
      const mixA = row ? seg(t, 0.02, 0.11) : 1;
      const LY = layout2(b, { x0: 0, y0: 0, x1: a, y1: a }, row, { u: a, gap: 0.35 * a, padB: row ? 44 * mixA : 0, small: { x0: 0, y0: 0, x1: a, y1: a }, mix: mixA });
      const TL = pt(0, 0), TR = pt(a, 0), BL = pt(0, a), BR = pt(a, a);
      const arc1 = arcPts(BR, a, 180, 270), arc2 = arcPts(TL, a, 90, 0);
      const leaf = cat(arc2, arc1.slice().reverse());
      const hi1 = isStep(C, 2), hi2 = isStep(C, 3);
      if (hi1) fillP(b, [sectorPts(BR, a, 180, 270)], CB, 0.2);
      if (hi2) fillP(b, [sectorPts(TL, a, 0, 90)], CA, 0.2);
      fillP(b, [leaf], CS, C.plain ? 0.5 : 0.42, { ref: 'leaf' });
      b.poly([TL, TR, BR, BL], { color: 'ink', width: 2.4, alpha: 0.85 });
      b.path(arc1, { color: C.plain ? 'ink' : CB, width: C.plain ? 3 : 5.5, ref: 'arc1' });
      b.path(arc2, { color: C.plain ? 'ink' : CA, width: C.plain ? 3 : 5.5, ref: 'arc2' });
      tx(b, C, pt(a / 2, a), cmF(a), 'ink', { dy: 21 });
      if (!C.plain) {
        const rr = rpxOf(b, a);
        angMark(b, C, BR, 180, 270, CB, '90°', rr, { ref: 'arc1' });
        angMark(b, C, TL, 0, 90, CA, '90°', rr, { ref: 'arc2' });
        b.right(TR, TL, BR, { size: 10, color: 'muted' });
        b.right(BL, TL, BR, { size: 10, color: 'muted' });
        if (hi1) tx(b, C, pt(a / 2, a), 'r = ' + fmtN(a), CB, { dy: -14, size: 15 });
        if (hi2) tx(b, C, pt(0, a / 2), 'r = ' + fmtN(a), CA, { dx: 8, align: 'left' });
        if (C.review && C.step >= 2) tx(b, C, polar(BR, a, 225), '① ' + piP(M.arc) + ' cm', CB, { dx: -22, dy: -26, size: 15, ref: 'arc1' });
        if (C.review && C.step >= 3) tx(b, C, polar(TL, a, 45), '② ' + piP(M.arc) + ' cm', CA, { dx: 26, dy: 26, size: 15, ref: 'arc2' });
      }
      if (row && LY.row) {
        const Cf = pt(LY.row.x + 2.3 * a, LY.row.y + a);
        const al = seg(t, 0.12, 0.24), th = 90 * seg(t, 0.3, 0.48), Xs = Cf.x - 1.3 * a, sl = seg(t, 0.52, 0.78), u = seg(t, 0.84, 0.97);
        const C2 = pt(Xs + (Cf.x - Xs) * sl, Cf.y);
        const ghost = 1 - seg(t, 0.7, 0.82);
        if (ghost > 0.02) {
          b.path(cat(arcPts(Cf, a, 90, 270), [polar(Cf, a, 90)]), { color: 'muted', width: 1.8, dash: [6, 5], alpha: 0.75 * ghost });
          if (mixA > 0.6) tx(b, C, pt(Cf.x - a / 2, Cf.y + a), '이어 붙일 자리', 'muted', { size: 14, alpha: ghost * mixA, dy: 20 });
        }
        if (al > 0.01) {
          sector(b, Cf, a, 180, 270, CB, { alpha: al, ref: 'arc1' });
          sector(b, C2, a, th, 90 + th, CA, { alpha: al, ref: 'arc2' });
          if (al > 0.6) {
            tx(b, C, polar(Cf, 0.55 * a, 225), '90°', CB, { alpha: al });
            tx(b, C, polar(C2, 0.55 * a, 45 + th), '90°', CA);
          }
          if (u > 0.01) {
            const m = pt(Cf.x - a / 2, Cf.y + a);
            tx(b, C, m, '90° + 90° = 180°', 'ink', { dy: 24, alpha: u });
            tx(b, C, m, piP(M.arc) + ' + ' + piP(M.arc) + ' = ' + piP(M.tot) + ' cm', 'ink', { dy: 46, size: 16, alpha: u });
          }
        }
      }
    },
    steps: (M) => [
      '색칠한 부분의 둘레는 호 2개로 이루어져 있어요. 분홍 호는 오른쪽 아래 꼭짓점이, 노랑 호는 왼쪽 위 꼭짓점이 중심이에요.',
      `분홍 호 ①: 반지름 ${M.a}, 중심각 90° → $2\\pi\\times${M.a}\\times\\dfrac{90}{360}=${piT(M.arc)}$ (cm)`,
      `노랑 호 ②: 반지름 ${M.a}, 중심각 90° → $2\\pi\\times${M.a}\\times\\dfrac{90}{360}=${piT(M.arc)}$ (cm)`,
      `두 호를 이어 붙이면 중심각 90°+90°=180°인 호(반원의 호)예요. 둘레 = $${piT(M.arc)}+${piT(M.arc)}=${piT(M.tot)}$ (cm)`
    ],
    view(M, C, s) {
      const half = C.t > 0.8;
      return {
        guide: C.t < 0.08 ? '색칠한 잎 모양의 <b>둘레</b>는 <b>호 2개</b>예요(분홍·노랑). ▶를 누르거나 막대를 오른쪽으로 끌어, 두 호를 떼어 이어 붙여 보세요.'
          : C.t < 0.5 ? '두 호가 만드는 부채꼴을 옆에 복사했어요. 각 부채꼴의 중심각은 <b>90°</b>예요. 노랑 부채꼴이 제자리에서 돌고 있어요.'
          : C.t < 0.82 ? '노랑 부채꼴을 <b>가로로</b> 밀어 분홍 부채꼴 옆에 붙이고 있어요.'
          : `두 호를 이으니 <b>중심각 180°</b>, 반지름 ${M.a} cm인 반원의 호가 되었어요! 호의 길이 = 원 둘레의 절반 = <b>${piP(M.tot)} cm</b>.`,
        readouts: [
          rd('정사각형의 한 변 = 반지름', cmF(M.a), 'ink', '호의 반지름'),
          rd('호 ① (중심각 90°)', piP(M.arc) + ' cm', CB, `2π×${M.a}×90/360`, 'arc1'),
          rd('호 ② (중심각 90°)', piP(M.arc) + ' cm', CA, `2π×${M.a}×90/360`, 'arc2'),
          rd('색칠한 부분의 둘레', piP(M.tot) + ' cm', 'sky', '≈ ' + fmtN(qv(M.tot) * PI) + ' cm', 'leaf', true)
        ],
        status: half ? { tone: 'ok', text: `둘레 = ${piP(M.tot)} cm (반원의 호)` } : { tone: 'info', text: '둘레 = 호 2개' },
        parts: [
          { id: 'arc1', name: '분홍 호 ①', desc: '중심각 90°', value: piP(M.arc) + ' cm', color: CB },
          { id: 'arc2', name: '노랑 호 ②', desc: '중심각 90°', value: piP(M.arc) + ' cm', color: CA }
        ],
        formula: `<p>둘레 = (호 ①) + (호 ②)</p><p>= $2\\pi\\times${M.a}\\times\\dfrac{90}{360}\\times 2$ = <b>${piP(M.tot)} cm</b></p>`,
        rule: '(호의 길이) = 2π × (반지름) × (중심각 / 360°)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>둘레에는 정사각형의 변이 들어가지 않아요. 색칠한 부분의 <b>경계선</b>만 세요.</li><li>두 호의 중심은 서로 <b>마주 보는 꼭짓점</b>이에요. 반지름은 모두 정사각형의 한 변이에요.</li><li>중심각이 90°인 호 2개는 합치면 180°, 즉 원 둘레의 <b>절반</b>이에요.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 색칠한 부분의 둘레를 이루는 호를 찾는다.<br>② 각 호의 반지름과 중심각을 구하고 호의 길이를 구한다.<br>③ 호의 길이를 모두 더한다.<br><br>호 ① $2\\pi\\times${M.a}\\times\\dfrac{90}{360}=${piT(M.arc)}$<br>호 ② $2\\pi\\times${M.a}\\times\\dfrac{90}{360}=${piT(M.arc)}$<br>(둘레) $=${piT(M.arc)}+${piT(M.arc)}=${piT(M.tot)}$ (cm)`,
      warning: '호의 중심은 정사각형의 꼭짓점이고 반지름은 한 변의 길이예요. 두 호 모두 중심각은 90°!'
    }),
    quick: (M) => ({
      steps: `두 호의 중심각을 모으면 90°+90°=180°이므로 <b>반지름 ${M.a}인 원의 둘레의 절반</b>이에요: $\\dfrac12\\times2\\pi\\times${M.a}=${piT(M.tot)}$ (cm)`,
      highlight: '잎 모양 둘레 = 반지름이 한 변인 원의 둘레의 절반 = π × (한 변)'
    }),
    prob(M) {
      const base = M.arc;
      const opts = [1, 2, 3, 4, 5].map((k) => { const v = qm(base, [k, 1]); return { t: piT(v) + '\\ \\mathrm{cm}', p: piP(v) + ' cm', ok: k === 2, hint: HINTS_LEAF[k] }; });
      return { tag: '색칠한 부분의 둘레의 길이', stem: `그림과 같이 한 변의 길이가 ${M.a} cm인 정사각형에서 색칠한 부분의 둘레의 길이는?`, choices: opts, key: 'a' + M.a };
    }
  });
  const HINTS_LEAF = {
    1: '호 하나의 길이만 구했어요. 색칠한 부분의 둘레는 호가 2개예요.',
    2: '',
    3: '호 3개분이에요. 둘레를 이루는 호는 2개뿐이에요.',
    4: '반지름이 한 변인 원의 둘레 전체(2π×한 변)예요. 호 2개는 합쳐서 그 절반이에요.',
    5: '너무 커요. 중심각이 90°인 호 하나는 원 둘레의 4분의 1이에요.'
  };

  /* ------------------------------------------------------------------ ② 직사각형과 부채꼴 · 넓이가 같을 때 (교과서 16번) */
  function mRS(s, truth) {
    const r = s.f3b;
    const w = truth ? (PI * r) / 4 : clamp(s.f3w, 0.5, 9);
    const x0 = Math.min(w, r), root = Math.sqrt(Math.max(0, r * r - x0 * x0));
    const K = 0.5 * (x0 * root + r * r * Math.asin(clamp(x0 / r, 0, 1)));
    const rect = r * w, sect = (PI * r * r) / 4;
    return { r, w, x0, root, K, rect, sect, P1: rect - K, P2: sect - K, eq: Math.abs(rect - sect) < 0.006 * r, secK: q(r * r, 4), adK: q(r, 4) };
  }
  SCENES.push({
    id: 'f3-rect-sector', title: '직사각형과 부채꼴 · 넓이가 같을 때', short: '직사각형·부채꼴',
    question: '색칠한 두 부분 (가), (나)의 넓이가 같으면, 직사각형 ABCD와 부채꼴 ABE의 넓이는 어떤 관계일까?',
    ctl: ['f3b', 'f3w', 'f3t'], dur: 12,
    init: (s) => { s.f3b = 4; s.f3w = 2; },
    reroll: (s) => { s.f3b = pick([2, 4, 6, 8, 10], s.f3b); s.f3w = Math.round(s.f3b / 2 * 100) / 100; },
    presets: () => [{ group: '넓이가 같아지는 AD 찾기', label: '같아질 때의 AD 보기', apply: (s, lab) => lab.tween({ f3w: Math.round((PI * s.f3b / 4) * 100) / 100 }), on: (s) => mRS(s, false).eq }],
    model: (s, truth) => mRS(s, truth),
    stepT: (n) => (n >= 2 ? 1 : 1),
    draw(b, s, M, C) {
      const r = M.r, w = M.w, t = C.t;
      const sepOn = !C.plain && !C.review;
      const g = 0.28 * r, dxMax = w + g;
      const LY = layout2(b, { x0: 0, y0: -r, x1: sepOn ? dxMax + r : Math.max(w, r), y1: 0 }, null, { padB: 8, padL: 48 });
      const sl = sepOn ? seg(t, 0.16, 0.6) : 1;
      const dx = dxMax * (1 - sl);
      const A = pt(0, -r), B = pt(0, 0), Cc = pt(w, 0), D = pt(w, -r), E = pt(r, 0);
      const Bs = pt(dx, 0);
      const phiF = -Math.atan2(M.root, M.x0) / DEG;
      const F = pt(M.x0, -M.root);
      const Kp = cat([B, pt(M.x0, 0), F], arcPts(B, r, phiF, -90));
      const P1 = w < r ? cat([A, D, pt(w, -M.root)], arcPts(B, r, phiF, -90)) : cat([A, D, Cc, E], arcPts(B, r, 0, -90));
      const P2 = w < r ? cat([Cc, E], arcPts(B, r, 0, phiF), [pt(w, -M.root)]) : null;
      const ov = sepOn ? seg(t, 0.62, 0.76) : (C.review && C.step >= 2 ? 1 : 0);
      const stepOv = C.review ? (C.step >= 2 ? 1 : 0) : ov;
      if (C.plain || (C.review && C.step === 1)) {
        fillP(b, [P1], CS, 0.5, { ref: 'p1' });
        if (P2) fillP(b, [P2], CS, 0.5, { ref: 'p2' });
      } else {
        // 두 도형(겹치면 색이 섞여 '두 번' 센 것이 보입니다)
        fillP(b, [[A, D, Cc, B]], CA, 0.22, { ref: 'rect' });
        fillP(b, [shift(sectorPts(B, r, 0, -90), dx)], CB, 0.22, { ref: 'sec' });
        if (stepOv > 0.01) {
          fillP(b, [P1], CA, 0.34 * stepOv, { ref: 'p1' });
          if (P2) fillP(b, [P2], CB, 0.34 * stepOv, { ref: 'p2' });
          fillP(b, [Kp], CO, 0.42 * stepOv, { ref: 'k' });
        }
      }
      const rc = C.plain ? 'ink' : CA, sc = C.plain ? 'ink' : CB;
      b.poly([A, D, Cc, B], { color: rc, width: C.plain ? 2.4 : 3.2, ref: 'rect' });
      b.path(arcPts(Bs, r, 0, -90), { color: sc, width: C.plain ? 2.4 : 3.6, ref: 'sec' });
      if (C.plain || sl < 0.99 || true) {
        b.seg(Bs, polar(Bs, r, 0), { color: sc, width: C.plain ? 2.4 : 2.2, ref: 'sec' });
        if (dx > 0.01 || C.plain) b.seg(Bs, polar(Bs, r, -90), { color: sc, width: C.plain ? 2.4 : 2.2, ref: 'sec' });
      }
      // 이름표
      if (C.txt) {
        const home = sl > 0.97;
        if (home || C.plain) {
          tx(b, C, A, 'A', 'ink', { dx: -13, dy: -9 }); tx(b, C, B, 'B', 'ink', { dx: -13, dy: 11 });
          tx(b, C, Cc, 'C', 'ink', { dx: -3, dy: 17 }); tx(b, C, D, 'D', 'ink', { dx: 12, dy: -9 }); tx(b, C, E, 'E', 'ink', { dx: 11, dy: 15 });
          b.right(A, D, B, { size: 9, color: 'muted' }); b.right(B, A, Cc, { size: 9, color: 'muted' }); b.right(Cc, B, D, { size: 9, color: 'muted' }); b.right(D, A, Cc, { size: 9, color: 'muted' });
          tx(b, C, pt(0, -r / 2), cmF(r), 'ink', { dx: -13, align: 'right' });
        } else {
          tx(b, C, pt(0, -r / 2), cmF(r), 'ink', { dx: -13, align: 'right' });
        }
        if (!C.plain && sepOn) tx(b, C, pt(w / 2, -r), cmF(w), CA, { dy: -17 });
        if (!C.plain && !sepOn && C.step >= 4) tx(b, C, pt(w / 2, -r), 'AD = ?', CA, { dy: -17 });
        // 따로 있을 때: 이름과 넓이
        const nm = 1 - sl;
        if (nm > 0.05 && !C.plain && sepOn) {
          tx(b, C, pt(Math.min(w, r) * 0.42, -r * 0.55), '직사각형', CA, { alpha: nm, dy: -9 });
          tx(b, C, pt(Math.min(w, r) * 0.42, -r * 0.55), fmtN(M.rect) + ' cm²', CA, { alpha: nm, dy: 12, size: 14 });
          tx(b, C, polar(Bs, 0.52 * r, -42), '부채꼴', CB, { alpha: nm, dy: -9 });
          tx(b, C, polar(Bs, 0.52 * r, -42), fmtN(M.sect) + ' cm²', CB, { alpha: nm, dy: 12, size: 14 });
        }
        if (ov > 0.05 && sepOn || (C.review && C.step >= 2)) {
          const a = C.review ? 1 : ov;
          const s1 = spot(P1);
          tx(b, C, s1, '(가)', CA, { alpha: a, ref: 'p1' });
          if (P2) tx(b, C, spot(P2), '(나)', CB, { alpha: a, ref: 'p2' });
          const sk = spot(Kp);
          tx(b, C, sk, '공통', CO, { alpha: a, ref: 'k' });
          if (!C.review || C.step >= 4) {
            tx(b, C, pt(w / 2, 0), '직사각형 ' + fmtN(M.rect), CA, { dy: 38, size: 14, alpha: a });
            tx(b, C, pt(Math.max(w, r) * 0.78, 0), '부채꼴 ' + fmtN(M.sect), CB, { dy: 38, size: 14, alpha: a, dx: Math.max(0, (w < r ? 14 : 0)) });
          }
        }
      }
      // 끌 수 있는 점 D (가로로만)
      if (sepOn && C.txt) {
        b.handle('ad', D, { color: 'amber', r: 7, ariaLabel: 'AD의 길이', drag: (p) => { s.f3w = clamp(Math.round(p.x * 100) / 100, 0.5, 9); } });
      }
    },
    steps: (M) => [
      '색칠한 두 부분을 (가), (나)라 하고, 직사각형과 부채꼴이 겹친 부분을 \'공통 부분\'이라 해요.',
      '(직사각형 ABCD) = (가) + (공통 부분),  (부채꼴 ABE) = (나) + (공통 부분)',
      '(가)와 (나)의 넓이가 같고 같은 공통 부분을 더했으니, (직사각형 ABCD) = (부채꼴 ABE)',
      `(직사각형 ABCD) $=${M.r}\\times\\overline{AD}$,  (부채꼴 ABE) $=\\pi\\times${M.r}^2\\times\\dfrac{90}{360}=${piT(M.secK)}$`,
      `$${M.r}\\times\\overline{AD}=${piT(M.secK)}$ 이므로 $\\overline{AD}=${piT(M.adK)}$ (cm)`
    ],
    view(M, C, s) {
      const d = M.P1 - M.P2;
      const msg = M.eq ? '(가)와 (나)의 넓이가 거의 같아요!' : d > 0 ? '(가)가 더 넓어요' : '(나)가 더 넓어요';
      return {
        guide: C.t < 0.16 ? `직사각형 ABCD와 부채꼴 ABE를 따로 놓았어요. 막대를 오른쪽으로 끌거나 ▶를 눌러 부채꼴을 <b>가로로</b> 밀어 겹쳐 보세요. 그림의 <b>점 D</b>를 끌어 AD를 바꿀 수도 있어요.`
          : C.t < 0.62 ? '부채꼴을 왼쪽으로 밀고 있어요. 겹친 곳은 색이 섞여 보여요 — 겹친 부분은 <b>두 번</b> 들어 있어요.'
          : `겹치면 (가), (나), 공통 부분이 생겨요. AD를 바꾸며 (가)와 (나)가 같아지는 곳을 찾아보세요. 같아질 때 직사각형과 부채꼴의 넓이도 <b>같아져요</b>!`,
        readouts: [
          rd('직사각형 ABCD', fmtN(M.rect) + ' cm²', CA, `${M.r} × ${fmtN(M.w)}`, 'rect'),
          rd('부채꼴 ABE', fmtN(M.sect) + ' cm²', CB, `π×${M.r}²×90/360 = ${piP(M.secK)}`, 'sec'),
          rd('(가) 직사각형 쪽', fmtN(M.P1) + ' cm²', CA, '직사각형 − 공통', 'p1'),
          rd('(나) 부채꼴 쪽', fmtN(M.P2) + ' cm²', CB, '부채꼴 − 공통', 'p2'),
          rd('(가) − (나)', fmtN(d) + ' cm²', M.eq ? 'green' : 'orange', msg, null, true),
          rd('직사각형 − 부채꼴', fmtN(M.rect - M.sect) + ' cm²', 'ink', '(가) − (나) 와 늘 같아요', null, true)
        ],
        status: M.eq ? { tone: 'ok', text: `(가) = (나) → 직사각형 = 부채꼴, AD ≈ ${fmtN(M.w)} cm` } : { tone: 'info', text: `(가) ${fmtN(M.P1)}  (나) ${fmtN(M.P2)}` },
        parts: [
          { id: 'p1', name: '(가) 직사각형 안쪽', desc: '직사각형 − 공통 부분', value: fmtN(M.P1), color: CA },
          { id: 'p2', name: '(나) 부채꼴 바깥쪽', desc: '부채꼴 − 공통 부분', value: fmtN(M.P2), color: CB },
          { id: 'k', name: '공통 부분', desc: '두 도형이 겹친 부분', value: fmtN(M.K), color: CO }
        ],
        formula: `<p>(직사각형) = (가) + (공통), (부채꼴) = (나) + (공통)</p><p>(가) = (나) ⟺ (직사각형) = (부채꼴)</p><p>$${M.r}\\times\\overline{AD}=${piT(M.secK)}\\ \\Rightarrow\\ \\overline{AD}=${piT(M.adK)}$ (cm)</p>`,
        rule: '(가)=(나) 이면, 같은 공통 부분을 더한 두 도형의 넓이도 같다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>(가)(나)를 따로 계산하지 마세요. 공통 부분을 구하기 어려워도 <b>직사각형 = 부채꼴</b>만 쓰면 돼요.</li><li>부채꼴 ABE의 반지름은 AB, 중심각은 90°예요.</li><li>AD는 AB보다 짧아요 (그림에서 호가 CD와 만나요).</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 색칠한 두 부분의 넓이가 같으면, 각각에 공통 부분을 더한 도형의 넓이도 같다.<br>② (직사각형 ABCD) = (부채꼴 ABE)로 식을 세운다.<br><br>$${M.r}\\times\\overline{AD}=\\pi\\times${M.r}^2\\times\\dfrac{90}{360}=${piT(M.secK)}$<br>따라서 $\\overline{AD}=${piT(M.adK)}$ (cm)`,
      warning: '색칠한 부분의 넓이를 직접 구하려고 하지 마세요. 공통 부분을 더해 "도형 전체"로 바꾸면 쉬워져요.'
    }),
    quick: (M) => ({
      steps: `(직사각형) = (부채꼴) 에서 $\\overline{AB}\\times\\overline{AD}=\\dfrac14\\pi\\,\\overline{AB}^2$ → $\\overline{AD}=\\dfrac{\\pi}{4}\\overline{AB}=${piT(M.adK)}$`,
      highlight: '직사각형의 세로가 부채꼴의 반지름이면, 넓이가 같을 때 가로 = (π/4) × 반지름'
    }),
    prob(M, s) {
      const opts = [1, 2, 3, 4, 5].map((j) => {
        const v = q(j, 2);
        const ok = j === M.r / 2;
        return { t: piT(v) + '\\ \\mathrm{cm}', p: piP(v) + ' cm', ok, hint: ok ? '' : `AD = ${piP(v)} 이면 직사각형은 ${M.r}×${piP(v)} = ${piP(qm(v, [M.r, 1]))}, 부채꼴은 ${piP(M.secK)} 이에요. 두 넓이가 같은지 비교해 보세요.` };
      });
      return { tag: '색칠한 부분의 넓이가 같은 경우', stem: `그림은 $\\overline{AB}=${M.r}$ cm인 직사각형 ABCD와 부채꼴 ABE를 겹쳐 놓은 것이다. 색칠한 두 부분의 넓이가 같을 때, $\\overline{AD}$의 길이는?`, choices: opts, key: 'b' + M.r };
    }
  });

  /* ------------------------------------------------------------------ ③ 정삼각형과 두 호 (교과서 22번, 서술형) */
  SCENES.push({
    id: 'f3-two-arcs', title: '두 호가 만나는 점 E · 색칠한 넓이', short: '정삼각형과 두 호',
    question: '두 사분원의 호가 만나는 점 E를 이으면 어떤 삼각형이 될까? 색칠한 부분은 정사각형에서 무엇을 빼면 될까?',
    ctl: ['f3a', 'f3t'], dur: 11,
    init: (s) => { s.f3a = 9; },
    reroll: (s) => { s.f3a = pick([6, 8, 9, 10, 12], s.f3a); },
    model: (s) => { const a = s.f3a; return { a, one: q(a * a, 12), two: q(a * a, 6), sq: [a * a, 1] }; },
    stepT: (n) => (n >= 4 ? 1 : 0),
    draw(b, s, M, C) {
      const a = M.a, t = C.t;
      layout2(b, { x0: 0, y0: 0, x1: 1.5 * a, y1: a }, null, { padB: 4, small: { x0: 0, y0: 0, x1: a, y1: a }, mix: C.plain ? 0 : seg(t, 0.02, 0.2) });
      const A = pt(0, 0), D = pt(a, 0), B = pt(0, a), Cc = pt(a, a), E = pt(a / 2, a - (a * Math.sqrt(3)) / 2);
      const arcB = arcPts(B, a, -90, 0), arcC = arcPts(Cc, a, 270, 180);
      const shaded = cat([A, D], arcPts(Cc, a, 270, 240), [Cc, B], arcPts(B, a, -60, -90));
      const hole1 = sectorPts(B, a, -90, -60), hole2 = sectorPts(Cc, a, -120, -90);
      const showHole = !C.plain && (C.review ? C.step >= 3 : true);
      const hl = C.review ? (C.step === 3 ? 1 : C.step >= 4 ? 0.7 : 0) : 0.35 + 0.65 * seg(t, 0, 0.18);
      fillP(b, [shaded], CS, C.plain ? 0.5 : 0.42, { ref: 'sh' });
      b.poly([A, D, Cc, B], { color: 'ink', width: 2.4, alpha: 0.85 });
      b.path(arcB, { color: 'ink', width: 2, alpha: 0.7 });
      b.path(arcC, { color: 'ink', width: 2, alpha: 0.7 });
      line(b, [B, E, Cc], C.plain ? 'ink' : CS, C.plain ? 2.2 : 3, { alpha: 0.9 });
      const sl = C.review ? (C.step >= 4 ? seg(t, 0.2, 0.7) : 0) : seg(t, 0.22, 0.7);
      if (showHole) {
        fillP(b, [hole2], CA, 0.3 * hl, { ref: 'h2' });
        b.path(sectorPts(Cc, a, -120, -90).concat([Cc]), { color: CA, width: 2.2, alpha: 0.9 * hl, dash: [6, 4] });
        // 왼쪽 30° 부채꼴: 오른쪽으로 a 만큼 가로로 밀려 갑니다
        const Bc = pt(a * sl, a);
        if (sl > 0.002) fillP(b, [sectorPts(Bc, a, -90, -60)], CB, 0.38, { ref: 'h1' });
        else fillP(b, [hole1], CB, 0.3 * hl, { ref: 'h1' });
        b.path(arcPts(Bc, a, -90, -60), { color: CB, width: 4.5, alpha: hl, ref: 'h1' });
        b.seg(Bc, polar(Bc, a, -60), { color: CB, width: 2, alpha: hl });
        b.seg(Bc, polar(Bc, a, -90), { color: CB, width: 2, alpha: hl });
        if (sl > 0.002) b.path(cat([B], arcPts(B, a, -90, -60), [B]), { color: CB, width: 1.8, alpha: 0.6, dash: [5, 5] });
        b.path(arcPts(Cc, a, -120, -90), { color: CA, width: 4.5, alpha: hl, ref: 'h2' });
        if (C.txt) {
          const mid = sl < 0.5;
          if (mid) tx(b, C, polar(Bc, 0.62 * a, -75), '30°', CB, { ref: 'h1' });
          if (mid) tx(b, C, polar(Cc, 0.62 * a, -105), '30°', CA, { ref: 'h2' });
          if (sl > 0.97) {
            tx(b, C, polar(Cc, 0.5 * a, -75), '60°', 'ink', { size: 17 });
            tx(b, C, polar(Cc, 0.5 * a, -75), '원의 1/6', 'ink', { size: 14, dy: 20 });
          }
        }
      }
      if (C.txt) {
        tx(b, C, A, 'A', 'ink', { dx: -13, dy: -9 }); tx(b, C, D, 'D', 'ink', { dx: 13, dy: -9 });
        tx(b, C, B, 'B', 'ink', { dx: -13, dy: 12 }); tx(b, C, Cc, 'C', 'ink', { dx: 13, dy: 12 });
        tx(b, C, E, 'E', 'ink', { dx: -2, dy: -17 });
        tx(b, C, pt(a / 2, a), cmF(a), 'ink', { dy: 21 });
        b.point(E, { r: 3.6, color: 'ink', glow: false });
        if (!C.plain && (!C.review || C.step >= 1)) {
          b.ticks(B, Cc, { color: 'ink', count: 3 }); b.ticks(B, E, { color: 'ink', count: 3 }); b.ticks(Cc, E, { color: 'ink', count: 3 });
          const rr = rpxOf(b, a, 24, 40, 0.2);
          angMark(b, C, B, -60, 0, CS, '60°', rr, { labelGap: 17 });
          angMark(b, C, Cc, 240, 180, CS, '60°', rr, { labelGap: 17 });
          if (!C.review || C.step >= 2) {
            angMark(b, C, B, -90, -60, CB, '30°', rr * 1.5, { labelGap: 18 });
            angMark(b, C, Cc, 270, 240, CA, '30°', rr * 1.5, { labelGap: 18 });
          }
        }
      }
    },
    steps: (M) => [
      `E는 B와 C를 중심으로 반지름 ${M.a}인 두 호의 교점이므로 $\\overline{BE}=\\overline{CE}=\\overline{BC}=${M.a}$. △EBC는 정삼각형이에요 (각 60°).`,
      '∠EBC = 60° 이므로 ∠ABE = 90° − 60° = 30°. 같은 방법으로 ∠DCE = 30°.',
      '색칠한 부분은 정삼각형 부분과 위쪽 부분이에요. 정사각형에서 두 부채꼴 ABE, DCE(중심각 30°)를 빼면 바로 이 부분이 남아요.',
      `부채꼴 하나 $\\pi\\times${M.a}^2\\times\\dfrac{30}{360}=${piT(M.one)}$. 둘을 가로로 붙이면 중심각 60°인 부채꼴이고 넓이는 $${piT(M.two)}$.`,
      `(색칠한 부분) = (정사각형) − (부채꼴 두 개) $=${M.a * M.a}-${piT(M.two)}$ (cm²)`
    ],
    view(M, C, s) {
      const ans = lin(q(-M.a * M.a, 6), [M.a * M.a, 1], false);
      return {
        guide: C.t < 0.2 ? `점 E는 두 호가 만나는 점이에요. 색칠한 부분은 <b>정사각형 − (30° 부채꼴 2개)</b>예요. ▶를 누르면 왼쪽 부채꼴이 <b>가로로</b> 밀려 가요.`
          : C.t < 0.7 ? '분홍 30° 부채꼴이 오른쪽으로 밀려가는 중이에요. 중심이 같은 높이에 있어서 가로로만 움직여요.'
          : `두 30° 부채꼴이 모여 <b>중심각 60°</b>, 반지름 ${M.a} cm인 부채꼴(원의 1/6)이 되었어요. 색칠한 부분 = ${M.a * M.a} − ${piP(M.two)} cm².`,
        readouts: [
          rd('정삼각형 EBC', 'BE = CE = BC = ' + M.a, CS, '각 60°'),
          rd('부채꼴 ABE (30°)', piP(M.one) + ' cm²', CB, `π×${M.a}²×30/360`, 'h1'),
          rd('부채꼴 DCE (30°)', piP(M.one) + ' cm²', CA, '위와 같아요', 'h2'),
          rd('색칠한 부분', ans.p + ' cm²', 'sky', '≈ ' + fmtN(ans.v) + ' cm²', 'sh', true)
        ],
        status: { tone: C.t > 0.7 ? 'ok' : 'info', text: C.t > 0.7 ? `색칠한 넓이 = ${ans.p} cm²` : '색칠한 부분 = 정사각형 − 30° 부채꼴 2개' },
        parts: [
          { id: 'sh', name: '색칠한 부분', desc: '정삼각형 부분 + 위쪽 부분', value: ans.p, color: CS },
          { id: 'h1', name: '부채꼴 ABE', desc: '중심 B, 중심각 30°', value: piP(M.one), color: CB },
          { id: 'h2', name: '부채꼴 DCE', desc: '중심 C, 중심각 30°', value: piP(M.one), color: CA }
        ],
        formula: `<p>(색칠한 부분) = (정사각형) − (부채꼴 ABE) − (부채꼴 DCE)</p><p>$=${M.a * M.a}-2\\times${piT(M.one)}=${ans.t}$ (cm²)</p>`,
        rule: '정삼각형의 각은 60° → 90° − 60° = 30°인 부채꼴 두 개를 뺀다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>정삼각형의 높이(√3)를 쓰지 않아도 돼요. 색칠한 부분의 모양을 "정사각형에서 뺀 것"으로 바꿔 보세요.</li><li>뺀 부채꼴의 중심각은 <b>90° − 60° = 30°</b>, 반지름은 정사각형의 한 변이에요.</li></ul>'
      };
    },
    std: (M) => {
      const ans = lin(q(-M.a * M.a, 6), [M.a * M.a, 1], false);
      return {
        steps: `<b>해결 전략</b><br>① △EBC가 정삼각형임을 이용해 ∠ABE, ∠DCE를 구한다.<br>② 색칠한 부분 = (정사각형) − (부채꼴 ABE) − (부채꼴 DCE)<br><br>∠EBC = 60° → ∠ABE = ∠DCE = 30°<br>부채꼴 ABE = 부채꼴 DCE = $\\pi\\times${M.a}^2\\times\\dfrac{30}{360}=${piT(M.one)}$<br>(색칠한 부분) $=${M.a}^2-2\\times${piT(M.one)}=${ans.t}$ (cm²)`,
        warning: '서술형이에요. "E는 두 호의 교점 → 정삼각형 → 30°" 순서를 꼭 쓰세요.'
      };
    },
    quick: (M) => ({
      steps: `30° 부채꼴 두 개의 중심각을 합치면 60° → 원의 $\\dfrac16$. $\\pi\\times${M.a}^2\\times\\dfrac16=${piT(M.two)}$ 이므로 ${M.a * M.a} − ${piP(M.two)}`,
      highlight: '빼는 부채꼴 두 개를 이어 붙이면 중심각 60°인 부채꼴 하나'
    }),
    prob(M) {
      const A = M.a * M.a;
      const cs = [q(1, 12), q(1, 6), q(1, 4), q(1, 8), q(1, 9)];
      const names = ['30° 부채꼴을 하나만 뺐어요. 두 개를 빼야 해요.', '', '90° 부채꼴(사분원) 하나를 뺐어요. 빼는 부채꼴의 중심각은 30°예요.', '45° 부채꼴로 계산했어요. 중심각은 90° − 60° = 30°예요.', '중심각을 40°로 계산한 것 같아요. 정삼각형의 한 각은 60°예요.'];
      const order = [2, 0, 3, 1, 4]; // 정답(1)을 ③ 자리에
      const opts = order.map((i, pos) => { const L = lin(qm(cs[i], [-A, 1]), [A, 1], false); return { t: par(L, 'cm^2'), p: parP(L, 'cm²'), ok: i === 1, hint: names[i] }; });
      return { tag: '서술형 · 5지선다로 확인', stem: `그림과 같이 한 변의 길이가 ${M.a} cm인 정사각형 ABCD에서 색칠한 부분의 넓이를 구하시오. (점 E는 B, C를 중심으로 하는 두 호가 만나는 점이다.)`, choices: opts, key: 'a' + M.a, note: '원래는 풀이 과정을 쓰는 서술형이에요. 먼저 공책에 풀어 보고 보기로 확인하세요.' };
    }
  });

  /* ------------------------------------------------------------------ ④ 초승달 (교과서 11번) */
  SCENES.push({
    id: 'f3-crescent', title: '초승달 모양의 넓이', short: '초승달',
    question: '큰 사분원에서 두 반원을 빼면 초승달이 남아요. 겹친 두 반원의 공통 부분은 어떻게 될까?',
    ctl: ['f3e', 'f3t'], dur: 12,
    init: (s) => { s.f3e = 6; },
    reroll: (s) => { s.f3e = pick([4, 6, 8, 10, 12], s.f3e); },
    model: (s) => {
      const a = s.f3e, h = a / 2, A = a * a;
      return { a, h, Q: q(A, 4), D: q(A, 8), L: lin(q(A, 8), q(-A, 4)), sq: h * h, qd: q(A, 16) };
    },
    stepT: (n) => (n >= 4 ? 1 : n === 3 ? 0.55 : n === 2 ? 0.1 : 0),
    draw(b, s, M, C) {
      const a = M.a, h = M.h, t = C.t;
      layout2(b, { x0: 0, y0: 0, x1: a, y1: a }, null, { padB: 4, padR: 46 });
      const TL = pt(0, 0), TR = pt(a, 0), BL = pt(0, a), BR = pt(a, a), M1 = pt(0, h), M2 = pt(h, a);
      const cres = cat(arcPts(BL, a, -90, 0), arcPts(M2, h, 360, 270), arcPts(M1, h, 0, -90));
      const lens = cat(arcPts(M1, h, 0, 90), arcPts(M2, h, 180, 270));
      const D1 = arcPts(M1, h, -90, 90), D2 = arcPts(M2, h, 180, 360);
      const Q = sectorPts(BL, a, -90, 0);
      const st = C.review ? C.step : 99;
      let aQ = 0, a1 = 0, a2 = 0, aL = 0;
      if (C.review) { aQ = st === 2 ? 1 : 0; a1 = st === 3 || st >= 4 ? 1 : 0; a2 = a1; aL = st >= 4 ? 1 : 0; if (st === 3) aL = 0; }
      else if (!C.plain) { a1 = seg(t, 0.05, 0.3); a2 = seg(t, 0.3, 0.55); aL = seg(t, 0.6, 0.8); }
      if (aQ > 0) fillP(b, [Q], 'ink', 0.18, { ref: 'q' });
      fillP(b, [cres], CS, C.plain ? 0.5 : 0.45, { ref: 'cres' });
      if (a1 > 0) fillP(b, [D1], CA, 0.3 * a1, { ref: 'd1' });
      if (a2 > 0) fillP(b, [D2], CB, 0.3 * a2, { ref: 'd2' });
      if (aL > 0) fillP(b, [lens], CO, 0.5 * aL, { ref: 'lens' });
      b.poly([TL, TR, BR, BL], { color: 'ink', width: 2.4, alpha: 0.85 });
      b.path(arcPts(BL, a, -90, 0), { color: 'ink', width: 2.6 });
      b.path(arcPts(M1, h, -90, 90), { color: C.plain ? 'ink' : CA, width: C.plain ? 2.6 : 3.4, ref: 'd1' });
      b.path(arcPts(M2, h, 180, 360), { color: C.plain ? 'ink' : CB, width: C.plain ? 2.6 : 3.4, ref: 'd2' });
      b.point(M1, { r: 4, color: 'ink', glow: false }); b.point(M2, { r: 4, color: 'ink', glow: false });
      if (C.txt) {
        tx(b, C, pt(a, a / 2), cmF(a), 'ink', { dx: 16, align: 'left' });
        if (st === 2 && C.review) {
          tx(b, C, polar(BL, 0.62 * a, -42), '큰 사분원 ' + piP(M.Q) + ' cm²', 'ink', { size: 15 });
          tx(b, C, polar(BL, 0.62 * a, -42), 'r = ' + fmtN(a) + ', 90°', 'ink', { dy: 21, size: 14 });
        }
        if (C.review && st === 3) {
          tx(b, C, pt(0.2 * a, 0.28 * a), '반원 ' + piP(M.D), CA, { size: 15, ref: 'd1' });
          tx(b, C, pt(0.2 * a, 0.28 * a), 'r = ' + fmtN(h), CA, { dy: 20, size: 14, ref: 'd1' });
          tx(b, C, pt(0.74 * a, 0.9 * a), '반원 ' + piP(M.D), CB, { size: 15, ref: 'd2' });
        }
        if (aL > 0.3) tx(b, C, spot(lens), '겹친 부분', CO, { alpha: aL, ref: 'lens', size: 14 });
        if (!C.plain) {
          if (C.review && st >= 4) tx(b, C, spot(cres), '색칠한 부분', 'sky', { size: 14, ref: 'cres' });
        }
      }
      // 겹친 부분 = 사분원 둘 − 정사각형 (마지막 단계)
      if (C.review && st >= 5) {
        const sub = [pt(0, h), pt(h, h), pt(h, a), pt(0, a)];
        b.poly(sub, { color: CO, width: 2.4, dash: [6, 4] });
        tx(b, C, pt(h / 2, h), fmtN(h) + ' cm', CO, { dy: -14, size: 14 });
      }
    },
    steps: (M) => [
      '색칠한 부분은 큰 사분원에서 두 반원이 덮은 곳을 뺀 초승달이에요.',
      `큰 사분원: 반지름 ${M.a}, 중심각 90° → $\\pi\\times${M.a}^2\\times\\dfrac{90}{360}=${piT(M.Q)}$`,
      `반원 하나: 반지름 ${fmtN(M.h)} → $\\dfrac12\\times\\pi\\times${fmtN(M.h)}^2=${piT(M.D)}$. 반원 두 개의 합 = 큰 사분원 ${piP(M.Q)}!`,
      '큰 사분원 − 반원 − 반원 에서는 겹친 부분이 두 번 빠졌어요. 그래서 겹친 부분을 한 번 더해 주면 색칠한 부분의 넓이 = 겹친 부분의 넓이.',
      `겹친 부분 = (사분원 두 개) − (정사각형) $=2\\times\\dfrac14\\pi\\times${fmtN(M.h)}^2-${fmtN(M.h)}^2=${M.L.t}$ (cm²)`
    ],
    view(M, C, s) {
      return {
        guide: C.t < 0.05 ? '색칠한 <b>초승달</b>은 큰 사분원에서 두 반원이 덮은 곳을 뺀 거예요. ▶를 누르면 두 반원이 차례로 나타나요. 겹친 곳이 <b>두 번</b> 덮여요.'
          : C.t < 0.6 ? '두 반원이 큰 사분원을 덮어 가고 있어요. 두 반원이 포개진 곳(보라)이 겹친 부분이에요.'
          : `큰 사분원 = 두 반원의 넓이의 합이에요. 그러니 초승달의 넓이는 <b>겹친 부분의 넓이</b>와 같아요: ${M.L.p} cm².`,
        readouts: [
          rd('큰 사분원', piP(M.Q) + ' cm²', 'ink', `π×${fmtN(M.a)}²×90/360`, 'q'),
          rd('반원 ' + '하나', piP(M.D) + ' cm²', CA, `½×π×${fmtN(M.h)}²`, 'd1'),
          rd('반원 둘의 합', piP(qm(M.D, [2, 1])) + ' cm²', CB, '큰 사분원과 같아요', 'd2'),
          rd('겹친 부분', M.L.p + ' cm²', CO, '사분원 둘 − 정사각형', 'lens'),
          rd('색칠한 초승달', M.L.p + ' cm²', 'sky', '≈ ' + fmtN(M.L.v) + ' cm²  (= 겹친 부분)', 'cres', true)
        ],
        status: { tone: 'info', text: `초승달 = 겹친 부분 = ${M.L.p} cm²` },
        parts: [
          { id: 'cres', name: '색칠한 초승달', desc: '큰 사분원 − 두 반원', value: M.L.p, color: CS },
          { id: 'lens', name: '겹친 부분', desc: '두 반원의 공통 부분', value: M.L.p, color: CO },
          { id: 'q', name: '큰 사분원', desc: '반지름 ' + fmtN(M.a), value: piP(M.Q), color: 'ink' }
        ],
        formula: `<p>(색칠한 부분) = (큰 사분원) − (반원) − (반원) + (겹친 부분)</p><p>$=${piT(M.Q)}-${piT(M.D)}-${piT(M.D)}+\\left(${M.L.t}\\right)=${M.L.t}$ (cm²)</p>`,
        rule: '여러 도형을 겹쳐 뺄 때, 겹친 부분은 두 번 빠지므로 한 번 더해 준다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>반원은 <b>변 위에 중심</b>이 있고 반지름은 한 변의 절반이에요.</li><li>겹친 부분은 두 사분원(반지름 ' + fmtN(M.h) + ')에서 정사각형(한 변 ' + fmtN(M.h) + ')을 빼서 구해요.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① (색칠한 부분) = (큰 사분원) − (두 반원이 덮은 부분)<br>② 두 반원이 겹친 부분은 두 번 빠지므로 한 번 더한다.<br><br>큰 사분원 $=${piT(M.Q)}$, 반원 $=${piT(M.D)}$ 두 개<br>겹친 부분 $=2\\times\\dfrac14\\pi\\times${fmtN(M.h)}^2-${fmtN(M.h)}^2=${M.L.t}$<br>(색칠한 부분) $=${piT(M.Q)}-${piT(M.D)}-${piT(M.D)}+\\left(${M.L.t}\\right)=${M.L.t}$ (cm²)`,
      warning: '반원 두 개를 그냥 빼면 겹친 부분이 두 번 빠져요. 한 번 더해 주세요.'
    }),
    quick: (M) => ({
      steps: `(큰 사분원) = (반원) + (반원) 이므로 초승달 = <b>겹친 부분</b>: $2\\times\\dfrac14\\pi\\times${fmtN(M.h)}^2-${fmtN(M.h)}^2=${M.L.t}$`,
      highlight: '큰 사분원과 두 반원의 넓이가 같으면, 초승달 = 겹친 부분'
    }),
    prob(M) {
      const A = M.a * M.a;
      const sp = [[q(A, 8), q(-A, 4), '정답'], [q(A, 8), q(-A, 8), '상수항이 달라요. 겹친 부분의 정사각형은 한 변이 반지름(' + fmtN(M.h) + ')이에요.'], [q(A, 8), q(A, 4), '겹친 부분을 빼야 하는데 더했어요.'], [q(A, 4), q(-A, 4), '큰 사분원 전체의 넓이를 쓴 것 같아요.'], [q(A, 2), q(-A, 4), '반지름을 잘못 써서 π의 계수가 커졌어요.']];
      const opts = sp.map((v, i) => { const L = lin(v[0], v[1]); return { t: par(L, 'cm^2'), p: parP(L, 'cm²'), ok: i === 0, hint: i === 0 ? '' : v[2] }; });
      return { tag: '색칠한 부분의 넓이', stem: `그림과 같이 한 변의 길이가 ${fmtN(M.a)} cm인 정사각형에서 색칠한 부분의 넓이는?`, choices: opts, key: 'e' + M.a };
    }
  });

  /* ------------------------------------------------------------------ ⑤ 네 잎 (교과서 12번) */
  function leafCells(a) {
    const h = a / 2, MT = pt(h, 0), ML = pt(0, h), MB = pt(h, a), MR = pt(a, h);
    return {
      h, MT, ML, MB, MR,
      leaves: [
        cat(arcPts(ML, h, -90, 0), arcPts(MT, h, 90, 180)),
        cat(arcPts(MT, h, 0, 90), arcPts(MR, h, 180, 270)),
        cat(arcPts(MR, h, 90, 180), arcPts(MB, h, 270, 360)),
        cat(arcPts(ML, h, 0, 90), arcPts(MB, h, 180, 270))
      ],
      // 각 칸의 사분원 (칸 TL, TR, BR, BL 순서; [색, 중심, 각0, 각1])
      qds: [
        [[CB, ML, -90, 0], [CA, MT, 90, 180]],
        [[CA, MT, 0, 90], [CB, MR, 180, 270]],
        [[CB, MR, 90, 180], [CA, MB, 270, 360]],
        [[CB, ML, 0, 90], [CA, MB, 180, 270]]
      ]
    };
  }
  SCENES.push({
    id: 'f3-four-leaf', title: '네 잎 모양의 넓이', short: '네 잎',
    question: '네 개의 잎은 어떻게 만들어질까? 한 칸에서 두 사분원이 겹친 부분이 잎이라면, 잎 하나의 넓이는?',
    ctl: ['f3e', 'f3t'], dur: 13,
    init: (s) => { s.f3e = 4; },
    reroll: (s) => { s.f3e = pick([4, 6, 8, 10, 12], s.f3e); },
    model: (s) => {
      const a = s.f3e, h = a / 2, A = a * a;
      return { a, h, qd: q(A, 16), two: q(A, 8), sq: q(A, 4), leaf: lin(q(A, 8), q(-A, 4)), all: lin(q(A, 2), q(-A, 1)) };
    },
    stepT: (n) => (n >= 3 ? 1 : n === 2 ? 0.7 : 0),
    draw(b, s, M, C) {
      const a = M.a, t = C.t;
      layout2(b, { x0: 0, y0: 0, x1: a, y1: a }, null, { padB: 4 });
      const G = leafCells(a), h = G.h, st = C.review ? C.step : 99;
      const cellOnly = C.review && (st === 2 || st === 3) ? 0 : -1;
      const showCell = (i) => !C.plain && (C.review ? (st === 2 || st === 3 ? i === 0 : st >= 4) : true);
      const aAmb = C.review ? 1 : seg(t, 0.04, 0.4), aRose = C.review ? 1 : seg(t, 0.36, 0.72);
      G.qds.forEach((cell, i) => {
        if (!showCell(i)) return;
        cell.forEach(([col, c, a0, a1]) => {
          const al = col === CA ? aAmb : aRose;
          fillP(b, [sectorPts(c, h, a0, a1)], col, 0.28 * al, { ref: 'qd' });
          if (al > 0.01) b.path(arcPts(c, h, a0, a1), { color: col, width: C.review ? 4 : 3, alpha: al, ref: 'qd' });
        });
      });
      const ls = C.plain ? 0.5 : 0.5 + 0.22 * Math.max(aAmb, aRose);
      G.leaves.forEach((lp, i) => {
        const dim = C.review && (st === 2 || st === 3) && i !== 0;
        fillP(b, [lp], CS, dim ? 0.12 : ls, { ref: 'leaf' });
      });
      b.poly([pt(0, 0), pt(a, 0), pt(a, a), pt(0, a)], { color: 'ink', width: 2.4, alpha: 0.85 });
      [G.MT, G.ML, G.MB, G.MR].forEach((m) => b.point(m, { r: 4, color: 'ink', glow: false }));
      G.leaves.forEach((lp, i) => { if (C.plain || !(C.review && (st === 2 || st === 3) && i !== 0)) b.path(lp.concat([lp[0]]), { color: C.plain ? 'ink' : 'ink', width: C.plain ? 2.6 : 2, alpha: C.plain ? 1 : 0.55 }); });
      if (C.txt) {
        tx(b, C, pt(a / 2, 0), cmF(a), 'ink', { dy: -17 });
        if (C.review && (st === 2 || st === 3)) {
          const sub = [pt(0, 0), pt(h, 0), pt(h, h), pt(0, h)];
          b.poly(sub, { color: CO, width: 2.4, dash: [6, 4] });
          tx(b, C, pt(h / 2, 0), fmtN(h) + ' cm', CO, { dy: 14, size: 14, baseline: 'middle' });
          tx(b, C, pt(0, h / 2), 'r = ' + fmtN(h), CB, { dx: 8, align: 'left', size: 14 });
          tx(b, C, pt(h / 2, 0), 'r = ' + fmtN(h), CA, { dy: 34, size: 14 });
          tx(b, C, spot(G.leaves[0]), '잎', 'sky', { size: 15 });
        }
      }
    },
    steps: (M) => [
      `잎 하나는 한 변이 ${fmtN(M.h)}인 정사각형 칸 안에서, 반지름 ${fmtN(M.h)}인 두 사분원이 겹친 부분이에요.`,
      `사분원 하나 $\\dfrac14\\pi\\times${fmtN(M.h)}^2=${piT(M.qd)}$. 두 사분원 $=${piT(M.two)}$.`,
      `두 사분원은 칸(정사각형 ${fmtN(M.h)}×${fmtN(M.h)} = ${fmtN(M.sq[0] / M.sq[1])})을 한 번 덮고, 겹친 부분(잎)을 한 번 더 덮어요. 잎 = $${piT(M.two)}-${fmtN(M.sq[0] / M.sq[1])}$ = $${M.leaf.t}$`,
      `잎은 4개 → $4\\times\\left(${M.leaf.t}\\right)=${M.all.t}$ (cm²)`
    ],
    view(M, C, s) {
      return {
        guide: C.t < 0.04 ? '색칠한 <b>잎 4개</b>예요. ▶를 누르면 한 변의 중점이 중심인 사분원이 8개 나타나요. 한 칸에서 두 사분원이 <b>겹친 부분</b>이 잎이에요.'
          : C.t < 0.72 ? '사분원이 칸을 덮고 있어요. 한 칸을 <b>두 사분원이 모두 덮은 곳</b>이 잎(파랑)이에요.'
          : `(사분원 8개) − (정사각형) = 잎 4개. 사분원 8개는 반지름 ${fmtN(M.h)}인 원 2개와 같아요.`,
        readouts: [
          rd('사분원 하나', piP(M.qd) + ' cm²', CA, `¼×π×${fmtN(M.h)}²`, 'qd'),
          rd('한 칸 (정사각형)', fmtN(M.h * M.h) + ' cm²', CO, `${fmtN(M.h)} × ${fmtN(M.h)}`),
          rd('잎 하나', M.leaf.p + ' cm²', 'sky', '사분원 둘 − 한 칸', 'leaf'),
          rd('잎 네 개 (색칠한 부분)', M.all.p + ' cm²', 'sky', '≈ ' + fmtN(M.all.v) + ' cm²', 'leaf', true)
        ],
        status: { tone: 'info', text: `잎 4개 = ${M.all.p} cm²` },
        parts: [
          { id: 'leaf', name: '잎 (색칠한 부분)', desc: '한 칸에서 두 사분원이 겹친 곳', value: M.leaf.p, color: CS },
          { id: 'qd', name: '사분원', desc: '반지름 ' + fmtN(M.h) + ', 중심각 90°', value: piP(M.qd), color: CA }
        ],
        formula: `<p>잎 하나 = (사분원 2개) − (정사각형 한 칸) $=${piT(M.two)}-${fmtN(M.sq[0] / M.sq[1])}$</p><p>잎 4개 $=4\\times\\left(${M.leaf.t}\\right)=${M.all.t}$ (cm²)</p>`,
        rule: '두 도형으로 한 칸을 덮으면, 겹친 부분 = (두 도형의 넓이의 합) − (칸의 넓이)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>사분원의 중심은 한 변의 <b>중점</b>(그림의 점)이에요. 반지름은 한 변의 절반.</li><li>사분원 8개 = 원 2개이므로 한꺼번에: $2\\times\\pi\\times' + fmtN(M.h) + '^2-' + fmtN(M.a * M.a) + '$.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 잎 하나 = (사분원) + (사분원) − (정사각형 한 칸)<br>② 잎의 개수만큼 곱한다.<br><br>잎 하나 $=2\\times${piT(M.qd)}-${fmtN(M.sq[0] / M.sq[1])}=${M.leaf.t}$<br>(색칠한 부분) $=4\\times\\left(${M.leaf.t}\\right)=${M.all.t}$ (cm²)`,
      warning: '사분원의 반지름은 정사각형의 한 변이 아니라 그 절반이에요.'
    }),
    quick: (M) => ({
      steps: `사분원 8개 = 반지름 ${fmtN(M.h)}인 원 2개. 정사각형 4칸 = 전체 ${fmtN(M.a * M.a)}. $2\\times\\pi\\times${fmtN(M.h)}^2-${fmtN(M.a * M.a)}=${M.all.t}$`,
      highlight: '네 잎 = (원 2개의 넓이) − (정사각형 전체)'
    }),
    prob(M) {
      const A = M.a * M.a;
      const sp = [[q(A, 2), q(-A, 1), '정답'], [q(A, 2), q(-A, 2), '정사각형을 한 번만 빼는 게 아니라 전체(' + A + ')를 빼야 해요.'], [q(A, 1), q(-A, 1), '반지름을 한 변으로 계산한 것 같아요. 반지름은 한 변의 절반이에요.'], [q(A, 1), q(-A, 2), '반지름과 정사각형의 넓이를 모두 잘못 썼어요.'], [q(2 * A, 1), q(-A, 1), '사분원 8개가 아니라 원 2개로 계산해야 해요.']];
      const opts = sp.map((v, i) => { const L = lin(v[0], v[1]); return { t: par(L, 'cm^2'), p: parP(L, 'cm²'), ok: i === 0, hint: i === 0 ? '' : v[2] }; });
      return { tag: '색칠한 부분의 넓이', stem: `그림과 같이 한 변의 길이가 ${fmtN(M.a)} cm인 정사각형에서 색칠한 부분의 넓이는?`, choices: opts, key: 'e' + M.a };
    }
  });

  /* ------------------------------------------------------------------ ⑥ 두 원을 감싼 도형 (교과서 14번) */
  SCENES.push({
    id: 'f3-two-circles', title: '두 원이 서로의 중심을 지날 때', short: '두 원을 감싼 도형',
    question: '두 원의 위·아래를 접선으로 이은 도형에서, 왼쪽 원을 뺀 색칠한 부분의 넓이는? 반원 하나를 가로로 밀면 어떤 모양이 될까?',
    ctl: ['f3r', 'f3k', 'f3t'], dur: 10,
    init: (s) => { s.f3r = 6; s.f3k = 1; },
    reroll: (s) => { s.f3r = pick([3, 6, 9], s.f3r); s.f3k = 1; },
    presets: () => [
      { group: '두 원 사이의 거리', label: '서로의 중심을 지날 때 (d=r)', set: { f3k: 1 }, on: (s) => Math.abs(s.f3k - 1) < 0.02 },
      { label: '두 원이 맞닿을 때 (d=2r)', set: { f3k: 2 }, on: (s) => Math.abs(s.f3k - 2) < 0.02 }
    ],
    model: (s, truth) => {
      const r = s.f3r, k = truth ? 1 : clamp(s.f3k, 1, 2), d = k * r;
      return { r, k, d, area: 2 * r * d, areaQ: q(2 * r * r * Math.round(k * 20), 20), rectEq: truth || Math.abs(k - 1) < 0.001 };
    },
    stepT: (n) => (n >= 4 ? 1 : n === 3 ? 0.2 : 0),
    draw(b, s, M, C) {
      const r = M.r, d = M.d, t = C.t;
      layout2(b, { x0: -r, y0: -r, x1: d + r, y1: r }, null, { padB: 18 });
      const O1 = pt(0, 0), O2 = pt(d, 0);
      const hull = cat([pt(0, -r), pt(d, -r)], arcPts(O2, r, -90, 90), [pt(d, r), pt(0, r)], arcPts(O1, r, 90, 270));
      const circ1 = arcPts(O1, r, 0, 360);
      const H = arcPts(O1, r, -90, 90), bump = arcPts(O2, r, -90, 90);
      const rect = [pt(0, -r), pt(d, -r), pt(d, r), pt(0, r)];
      const sl = C.plain ? 0 : C.review ? (C.step >= 4 ? seg(t, 0.2, 0.7) : 0) : seg(t, 0.12, 0.62);
      const mg = C.plain ? 0 : C.review ? (C.step >= 4 ? seg(t, 0.72, 0.9) : 0) : seg(t, 0.68, 0.84);
      const hi = C.review ? (C.step === 3 ? 1 : C.step >= 4 ? 0.7 : 0) : seg(t, 0, 0.1);
      // 색칠: (직사각형 − 왼쪽 원의 오른쪽 반원) + 오른쪽 덧붙은 반원(밀려 감)
      fillP(b, [rect, H], CS, C.plain ? 0.5 : 0.42, { evenodd: true, ref: 'sh' });
      if (isStep(C, 2)) {
        fillP(b, [arcPts(O1, r, 90, 270)], CO, 0.22, { ref: 'lh' });
        fillP(b, [H], CB, 0.3, { ref: 'hole' });
        tx(b, C, pt(-r * 0.55, r * 0.5), '왼쪽 반원', CO, { size: 14 });
        tx(b, C, pt(r * 0.5, r * 0.55), '오른쪽 반원', CB, { size: 14 });
      }
      if (isStep(C, 1)) b.path(hull.concat([hull[0]]), { color: 'sky', width: 5, alpha: 0.9 });
      const mv = shift(bump, -d * sl);
      const moving = C.plain ? 0 : hi * (1 - mg);
      fillP(b, [mv], CS, (C.plain ? 0.5 : 0.42) * (1 - moving), { ref: 'sh' });
      if (moving > 0.01) fillP(b, [mv], CA, 0.5 * moving, { ref: 'bump' });
      // 윤곽
      const oa = C.plain ? 1 : 1 - 0.75 * mg;
      b.path(circ1, { color: 'ink', width: 2.4, alpha: 0.9 * oa });
      b.circle(O2, r, { color: 'ink', width: 2.4, alpha: 0.9 * oa });
      line(b, [pt(0, -r), pt(d, -r)], 'ink', 2.4, { alpha: oa });
      line(b, [pt(0, r), pt(d, r)], 'ink', 2.4, { alpha: oa });
      if (!C.plain) {
        const dashA = (0.8 - 0.6 * mg);
        b.path(H.concat([H[0]]), { color: CB, width: 2.6, dash: [6, 4], alpha: hi * dashA, ref: 'hole' });
        b.path(mv.concat([mv[0]]), { color: CA, width: 3, alpha: hi * (1 - mg), ref: 'bump' });
        if (mg > 0.01) b.poly(rect, { color: 'sky', width: 3.2, alpha: mg, ref: 'sh' });
      }
      line(b, [O1, O2], 'ink', 1.8, { alpha: 0.85 * oa });
      b.point(O1, { r: 4, color: 'ink', glow: false }); b.point(O2, { r: 4, color: 'ink', glow: false });
      if (C.txt) {
        if (mg < 0.3) {
          tx(b, C, pt(d / 2, 0), 'd = ' + fmtN(d) + ' cm', 'ink', { dy: -15, alpha: 1 - mg });
          tx(b, C, pt(-r / 2, 0), 'r = ' + fmtN(r), 'ink', { dy: -14, alpha: 1 - mg });
        }
        if (!C.plain) {
          if (sl < 0.4 && hi > 0.3) { tx(b, C, pt(r * 0.5 + d * 0.0, r * 0.62), '빼는 반원', CB, { alpha: hi, size: 14 }); }
          if (sl < 0.3 && hi > 0.3) tx(b, C, pt(d + r * 0.55, -r * 0.45), '덧붙은 반원', CA, { alpha: hi, size: 14 });
          if (mg > 0.3) {
            tx(b, C, pt(d / 2, 0), '직사각형', 'ink', { alpha: mg, dy: -2, size: 15, ref: 'sh' });
            tx(b, C, pt(d / 2, r), fmtN(d) + ' cm', 'sky', { alpha: mg, dy: 20 });
            tx(b, C, pt(d, -r / 2), fmtN(2 * r) + ' cm', 'sky', { alpha: mg, dx: 10, align: 'left' });
          }
        }
      }
      if (!C.plain && !C.review && C.txt) {
        b.handle('d', O2, { color: 'amber', r: 7, ariaLabel: '두 원의 중심 사이의 거리', drag: (p) => { s.f3k = clamp(Math.round((p.x / r) * 20) / 20, 1, 2); } });
      }
    },
    steps: (M) => [
      `두 원의 위·아래를 접선으로 이은 도형(직사각형 ${fmtN(M.d)}×${fmtN(2 * M.r)} + 양쪽 반원)에서 왼쪽 원을 뺀 부분이 색칠한 부분이에요. 위·아래 좁은 틈도 색칠되어 있어요.`,
      `왼쪽 원 = 왼쪽 반원 + 오른쪽 반원. 오른쪽 반원은 직사각형 안에 있어요.`,
      `(색칠한 부분) = (직사각형) + (오른쪽에 덧붙은 반원) − (왼쪽 원의 오른쪽 반원)`,
      `덧붙은 반원을 가로로 d=${fmtN(M.d)}만큼 밀면 빠진 반원 자리에 꼭 맞아요. 서로 없어지고 직사각형만 남아요.`,
      `(색칠한 부분) = (직사각형) $=${fmtN(M.d)}\\times${fmtN(2 * M.r)}=${fmtN(M.d * 2 * M.r)}$ (cm²)`
    ],
    view(M, C, s) {
      return {
        guide: C.t < 0.1 ? `두 원이 서로의 중심을 지나요(d = r). 색칠한 부분 = (두 원을 감싼 도형) − (왼쪽 원). ▶를 누르면 오른쪽 <b>덧붙은 반원</b>이 <b>가로로</b> 밀려 가요. 오른쪽 점을 끌면 d가 바뀌어요.`
          : C.t < 0.62 ? '덧붙은 반원(노랑)을 왼쪽으로 밀고 있어요. 왼쪽 원의 오른쪽 반원(분홍 점선)이 빠진 자리예요.'
          : `덧붙은 반원이 빠진 반원 자리에 꼭 맞아요! 남은 것은 가로 ${fmtN(M.d)}, 세로 ${fmtN(2 * M.r)}인 <b>직사각형</b>이에요.`,
        readouts: [
          rd('반지름 r · 거리 d', `r = ${fmtN(M.r)}, d = ${fmtN(M.d)}`, 'ink', M.rectEq ? 'd = r : 서로의 중심을 지나요' : 'd를 바꾸면 도형이 달라져요'),
          rd('직사각형', `${fmtN(M.d)} × ${fmtN(2 * M.r)}`, 'sky', '가로 d, 세로 2r'),
          rd('색칠한 부분', fmtN(M.area) + ' cm²', 'sky', '= 2r × d', 'sh', true),
          rd('두 반원', '넓이가 같아요', CA, `π×${fmtN(M.r)}²/2 로 같은 크기`, 'bump')
        ],
        status: { tone: 'ok', text: `색칠한 부분 = 직사각형 = ${fmtN(M.area)} cm²` },
        parts: [
          { id: 'bump', name: '덧붙은 반원', desc: '오른쪽에 더해진 반원', value: piP(q(M.r * M.r, 2)) + ' cm²', color: CA },
          { id: 'hole', name: '빠진 반원', desc: '왼쪽 원의 오른쪽 반원', value: piP(q(M.r * M.r, 2)) + ' cm²', color: CB }
        ],
        formula: `<p>(색칠한 부분) = (직사각형) + (반원) − (반원) = (직사각형)</p><p>$= d\\times 2r = ${fmtN(M.d)}\\times${fmtN(2 * M.r)}=${fmtN(M.area)}$ (cm²)</p>`,
        rule: '밀어서 포개지는 두 도형은 넓이가 같다 → 더하고 빼면 서로 없어진다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>색칠한 부분에는 <b>위·아래의 좁은 틈</b>도 들어 있어요(접선과 두 원 사이).</li><li>π가 들어 있는 부분(반원)이 서로 없어져서, 답에 π가 없어요.</li><li>두 원의 거리가 d일 때(d ≥ r) 색칠한 넓이는 항상 2r × d 예요.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 두 원을 접선으로 감싼 도형을 직사각형과 반원으로 나눈다.<br>② 더해진 반원과 빼는 반원이 같음을 이용한다.<br><br>(색칠한 부분) = (직사각형) + (반원) − (반원)<br>$=${fmtN(M.d)}\\times${fmtN(2 * M.r)}=${fmtN(M.d * 2 * M.r)}$ (cm²)`,
      warning: '"서로의 중심을 지난다"는 두 원의 중심 사이의 거리가 반지름과 같다는 뜻이에요.'
    }),
    quick: (M) => ({
      steps: `원이 가로로 d만큼 지나간 자리에서 원 자신을 빼면 (가로 d) × (세로 2r) 직사각형이에요. $${fmtN(M.d)}\\times${fmtN(2 * M.r)}=${fmtN(M.d * 2 * M.r)}$`,
      highlight: '(지나간 자리) − (처음 원) = 2r × (움직인 거리)'
    }),
    prob(M) {
      const r = M.r, a = 2 * r * r;
      const vs = [
        { t: String(a - 2 * r), p: String(a - 2 * r), hint: '직사각형 넓이에서 2r만큼 덜 구했어요. 가로 r, 세로 2r인 직사각형이 아니라 가로 r+r 인지 확인해 보세요.' },
        { t: String(a), p: String(a), ok: true },
        { t: String(a + r), p: String(a + r), hint: '직사각형 넓이보다 r만큼 크게 구했어요.' },
        (() => { const v = q(2 * r * r, 3); return { t: piT(v), p: piP(v), hint: '원의 일부로 계산한 것 같아요. 반원이 서로 없어지는 걸 이용해 보세요.' }; })(),
        (() => { const v = q(5 * r * r, 6); return { t: piT(v), p: piP(v), hint: '원의 일부로 계산한 것 같아요. 반원이 서로 없어지는 걸 이용해 보세요.' }; })()
      ];
      const opts = vs.map((v, i) => ({ t: v.t + (i < 3 ? '' : '') + '\\ \\mathrm{cm^2}', p: v.p + ' cm²', ok: !!v.ok, hint: v.ok ? '' : v.hint }));
      return { tag: '색칠한 부분의 넓이', stem: `그림과 같이 반지름의 길이가 ${r} cm인 두 원이 서로의 중심을 지날 때, 색칠한 부분의 넓이는?`, choices: opts, key: 'r' + r };
    }
  });

  /* ------------------------------------------------------------------ ⑦ 반원과 부채꼴 · 넓이가 같을 때 (교과서 16번) */
  function mHS(s, truth) {
    const dia = s.f3q, r = dia / 2, x = truth ? 45 : s.f3x;
    const xr = x * DEG;
    const K = 72 * 0 + (dia * dia / 2) * (xr / 2 + Math.sin(2 * xr) / 4);
    const hd = (PI * r * r) / 2, sec = (PI * dia * dia * x) / 360;
    return { dia, r, x, K, hd, sec, P1: hd - K, P2: sec - K, eq: Math.abs(hd - sec) < 0.02 * r * r, hdK: q(r * r, 2), secK: q(dia * dia * 45, 360) };
  }
  SCENES.push({
    id: 'f3-half-sector', title: '반원과 부채꼴 · 넓이가 같을 때', short: '반원과 부채꼴',
    question: '색칠한 두 부분 (가), (나)의 넓이가 같으면, 반원과 부채꼴의 넓이는 어떤 관계일까? 그때 중심각 x는?',
    ctl: ['f3q', 'f3x', 'f3t'], dur: 12,
    init: (s) => { s.f3q = 12; s.f3x = 30; },
    reroll: (s) => { s.f3q = pick([8, 10, 12, 14, 16, 18], s.f3q); s.f3x = 30; },
    presets: () => [{ group: '넓이가 같아지는 x 찾기', label: '같아질 때의 x 보기', set: { f3x: 45 }, on: (s) => s.f3x === 45 }],
    model: (s, truth) => mHS(s, truth),
    stepT: () => 1,
    draw(b, s, M, C) {
      const dia = M.dia, r = M.r, x = M.x, t = C.t;
      const sepOn = !C.plain && !C.review;
      const g = 0.4 * r, dxMax = dia + g;
      layout2(b, { x0: 0, y0: -Math.max(r, dia * Math.sin(x * DEG)), x1: sepOn ? dxMax + dia : dia, y1: 0 }, null, { padB: 28, padL: 34 });
      const sl = sepOn ? seg(t, 0.16, 0.6) : 1, dx = dxMax * (1 - sl);
      const A = pt(0, 0), B = pt(dia, 0), Mm = pt(r, 0), Ac = pt(dx, 0);
      const T = polar(Ac, dia, -x), Gx = polar(Mm, r, -2 * x);
      const half = arcPts(Mm, r, 180, 360);
      const Kp = cat([A], arcPts(Mm, r, 0, -2 * x));
      const P1 = cat([A], arcPts(Mm, r, -2 * x, -180));
      const P2 = cat(arcPts(A, dia, 0, -x), arcPts(Mm, r, -2 * x, 0));
      const ov = sepOn ? seg(t, 0.62, 0.76) : (C.review && C.step >= 2 ? 1 : 0);
      if (C.plain || (C.review && C.step === 1)) {
        fillP(b, [P1], CS, 0.5, { ref: 'p1' }); fillP(b, [P2], CS, 0.5, { ref: 'p2' });
      } else {
        fillP(b, [half], CA, 0.24, { ref: 'hd' });
        fillP(b, [shift(sectorPts(A, dia, 0, -x), dx)], CB, 0.24, { ref: 'sec' });
        if (ov > 0.01) {
          fillP(b, [P1], CA, 0.34 * ov, { ref: 'p1' }); fillP(b, [P2], CB, 0.34 * ov, { ref: 'p2' }); fillP(b, [Kp], CO, 0.42 * ov, { ref: 'k' });
        }
      }
      const hc = C.plain ? 'ink' : CA, sc = C.plain ? 'ink' : CB;
      b.path(half.concat([pt(0, 0)]), { color: hc, width: C.plain ? 2.4 : 3.4, ref: 'hd' });
      b.path(arcPts(Ac, dia, 0, -x), { color: sc, width: C.plain ? 2.4 : 3.6, ref: 'sec' });
      b.seg(Ac, polar(Ac, dia, 0), { color: sc, width: C.plain ? 2.4 : 2.4, ref: 'sec' });
      b.seg(Ac, T, { color: sc, width: C.plain ? 2.4 : 2.4, ref: 'sec' });
      b.point(Mm, { r: 3.6, color: 'ink', glow: false });
      if (C.txt) {
        tx(b, C, A, 'A', 'ink', { dx: -12, dy: 4, align: 'right' });
        tx(b, C, pt(r, 0), cmF(dia), 'ink', { dy: 22 });
        angMark(b, C, Ac, 0, -x, 'amber', (C.plain || (C.review && C.step < 5)) ? 'x°' : x + '°', clamp(dia * b.k * 0.14, 24, 44), { labelGap: 16 });
        if (!C.plain && sepOn && sl < 0.97) {
          const nm = 1 - sl;
          tx(b, C, pt(r, 0), '반원 ' + fmtN(M.hd) + ' cm²', CA, { alpha: nm, dy: 46, size: 14 });
          tx(b, C, pt(Ac.x + dia / 2, 0), '부채꼴 ' + fmtN(M.sec) + ' cm²', CB, { alpha: nm, dy: 24, size: 14 });
        }
        if ((sepOn && ov > 0.05) || (C.review && C.step >= 2)) {
          const a = C.review ? 1 : ov;
          tx(b, C, spot(P1), '(가)', CA, { alpha: a, ref: 'p1' });
          tx(b, C, spot(P2), '(나)', CB, { alpha: a, ref: 'p2' });
          tx(b, C, spot(Kp), '공통', CO, { alpha: a, ref: 'k' });
          if (!C.review || C.step >= 4) {
            tx(b, C, pt(r, 0), '반원 ' + fmtN(M.hd), CA, { dy: 44, size: 14, alpha: a });
            tx(b, C, pt(r, 0), '부채꼴 ' + fmtN(M.sec), CB, { dy: 64, size: 14, alpha: a });
          }
        }
      }
      if (sepOn && C.txt) {
        b.handle('x', T, { color: 'amber', r: 7, ariaLabel: '중심각 x', drag: (p) => { const ang = Math.atan2(-(p.y - 0), p.x - Ac.x) / DEG; s.f3x = clamp(Math.round(ang), 5, 90); } });
      }
    },
    steps: (M) => [
      '색칠한 두 부분을 (가), (나)라 하고, 반원과 부채꼴이 겹친 부분을 \'공통 부분\'이라 해요.',
      '(반원) = (가) + (공통 부분),  (부채꼴) = (나) + (공통 부분)',
      '(가)와 (나)의 넓이가 같고 같은 공통 부분을 더했으니, (반원) = (부채꼴)',
      `(반원) $=\\dfrac12\\times\\pi\\times${M.r}^2=${piT(M.hdK)}$,  (부채꼴) $=\\pi\\times${M.dia}^2\\times\\dfrac{x}{360}$`,
      `$${piT(M.hdK)}=\\pi\\times${M.dia}^2\\times\\dfrac{x}{360}$ 이므로 $x=45$`
    ],
    view(M, C, s) {
      const d = M.P1 - M.P2;
      return {
        guide: C.t < 0.16 ? '반원(노랑)과 부채꼴(분홍)을 따로 놓았어요. ▶를 누르거나 막대를 끌어 부채꼴을 <b>가로로</b> 밀어 겹쳐 보세요. 그림의 <b>노란 점</b>을 끌어 중심각 x를 바꿔 보세요.'
          : C.t < 0.62 ? '부채꼴을 왼쪽으로 밀고 있어요. 겹친 곳은 두 번 들어 있어요.'
          : `겹치면 (가), (나), 공통 부분이 생겨요. x를 바꾸며 (가)와 (나)가 같아지는 곳을 찾아보세요. 같아질 때 반원과 부채꼴의 넓이도 <b>같아요</b>.`,
        readouts: [
          rd('반원', fmtN(M.hd) + ' cm²', CA, `½×π×${M.r}² = ${piP(M.hdK)}`, 'hd'),
          rd(`부채꼴 (중심각 ${M.x}°)`, fmtN(M.sec) + ' cm²', CB, `π×${M.dia}²×${M.x}/360`, 'sec'),
          rd('(가) 반원 쪽', fmtN(M.P1) + ' cm²', CA, '반원 − 공통', 'p1'),
          rd('(나) 부채꼴 쪽', fmtN(M.P2) + ' cm²', CB, '부채꼴 − 공통', 'p2'),
          rd('(가) − (나)', fmtN(d) + ' cm²', M.eq ? 'green' : 'orange', M.eq ? '거의 같아요!' : d > 0 ? '(가)가 더 넓어요' : '(나)가 더 넓어요', null, true)
        ],
        status: M.eq ? { tone: 'ok', text: `(가) = (나) → 반원 = 부채꼴, x ≈ ${M.x}°` } : { tone: 'info', text: `(가) ${fmtN(M.P1)}  (나) ${fmtN(M.P2)}` },
        parts: [
          { id: 'p1', name: '(가) 반원 쪽', desc: '반원 − 공통 부분', value: fmtN(M.P1), color: CA },
          { id: 'p2', name: '(나) 부채꼴 쪽', desc: '부채꼴 − 공통 부분', value: fmtN(M.P2), color: CB },
          { id: 'k', name: '공통 부분', desc: '두 도형이 겹친 부분', value: fmtN(M.K), color: CO }
        ],
        formula: `<p>(가)=(나) ⟺ (반원) = (부채꼴)</p><p>$${piT(M.hdK)}=\\pi\\times${M.dia}^2\\times\\dfrac{x}{360}\\ \\Rightarrow\\ x=45$</p>`,
        rule: '(가)=(나) 이면, 같은 공통 부분을 더한 두 도형의 넓이도 같다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>부채꼴의 반지름은 반원의 <b>지름</b>(' + M.dia + ' cm)이에요. 반지름이 2배면 넓이는 4배!</li><li>반지름이 지름과 같은 부채꼴에서는 반원의 크기와 상관없이 항상 x = 45° 예요.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 색칠한 두 부분의 넓이가 같으면, 공통 부분을 더한 두 도형의 넓이도 같다.<br>② (반원) = (부채꼴)로 식을 세운다.<br><br>$\\dfrac12\\times\\pi\\times${M.r}^2=\\pi\\times${M.dia}^2\\times\\dfrac{x}{360}$<br>${piP(M.hdK)} = ${piP(q(M.dia * M.dia, 360))}·x 이므로 $x=45$`.replace('${piP(M.hdK)}', piP(M.hdK)),
      warning: '부채꼴의 반지름은 반원의 반지름이 아니라 지름이에요. (중심 A에서 B까지)'
    }),
    quick: (M) => ({
      steps: `부채꼴은 반지름이 2배이므로 원 전체의 넓이가 반원의 8배. 반원과 같으려면 원의 $\\dfrac{1}{8}$ → $360°\\times\\dfrac18=45°$`,
      highlight: '반지름이 지름과 같은 부채꼴이 반원과 넓이가 같으려면 원의 1/8, 곧 45°'
    }),
    prob(M, s) {
      return { tag: '색칠한 부분의 넓이가 같은 경우', stem: `그림에서 색칠한 두 부분의 넓이가 같을 때, $x$의 값을 구하시오. (반원의 지름: ${M.dia} cm, 부채꼴의 반지름: ${M.dia} cm)`, number: { label: 'x =', unit: '°', answer: 45, hint: '(반원) = (부채꼴)로 식을 세워 보세요.' }, key: 'q' + M.dia, note: '서답형이에요. 값을 입력하고 확인을 눌러요.' };
    }
  });

  /* ------------------------------------------------------------------ ⑧ 확장 · 잎 모양의 넓이 */
  SCENES.push({
    id: 'f3-leaf-area', title: '확장 · 잎 모양의 넓이', short: '잎 넓이(확장)',
    question: '한 변이 a인 정사각형에서 마주 보는 꼭짓점을 중심으로 사분원 두 개를 그리면, 잎 모양의 넓이는?',
    ctl: ['f3a', 'f3t'], dur: 11,
    init: (s) => { s.f3a = 6; },
    reroll: (s) => { s.f3a = pick([4, 6, 8, 10, 12], s.f3a); },
    model: (s) => { const a = s.f3a, A = a * a; return { a, A, qd: q(A, 4), two: q(A, 2), leaf: lin(q(A, 2), q(-A, 1)) }; },
    stepT: (n) => (n >= 4 ? 1 : n === 3 ? 0.75 : n === 2 ? 0.35 : 0),
    draw(b, s, M, C) {
      const a = M.a, t = C.t, st = C.review ? C.step : 99;
      layout2(b, { x0: 0, y0: 0, x1: a, y1: a }, null, { padB: 6 });
      const TL = pt(0, 0), TR = pt(a, 0), BL = pt(0, a), BR = pt(a, a);
      const arcA = arcPts(TL, a, 90, 0), arcB = arcPts(BR, a, 180, 270);
      const leaf = cat(arcA, arcB.slice().reverse());
      const a1 = C.plain ? 0 : C.review ? (st >= 2 ? 1 : 0) : seg(t, 0.05, 0.38);
      const a2 = C.plain ? 0 : C.review ? (st >= 3 ? 1 : 0) : seg(t, 0.36, 0.68);
      if (a1 > 0) fillP(b, [sectorPts(TL, a, 0, 90)], CA, 0.28 * a1, { ref: 'q1' });
      if (a2 > 0) fillP(b, [sectorPts(BR, a, 180, 270)], CB, 0.28 * a2, { ref: 'q2' });
      fillP(b, [leaf], CS, C.plain ? 0.5 : C.review ? 0.72 : 0.5 + 0.22 * seg(t, 0.6, 0.8), { ref: 'leaf' });
      b.poly([TL, TR, BR, BL], { color: 'ink', width: 2.4, alpha: 0.85 });
      b.path(arcA, { color: C.plain ? 'ink' : CA, width: C.plain ? 2.6 : 4, alpha: C.plain ? 1 : Math.max(0.35, a1), ref: 'q1' });
      b.path(arcB, { color: C.plain ? 'ink' : CB, width: C.plain ? 2.6 : 4, alpha: C.plain ? 1 : Math.max(0.35, a2), ref: 'q2' });
      if (C.txt) {
        tx(b, C, pt(a / 2, a), cmF(a), 'ink', { dy: 21 });
        if (a1 > 0.5) tx(b, C, polar(TL, 0.78 * a, 25), '사분원 ' + piP(M.qd), CA, { size: 14, alpha: a1, ref: 'q1', dy: 0 });
        if (a2 > 0.5) tx(b, C, polar(BR, 0.78 * a, 205), '사분원 ' + piP(M.qd), CB, { size: 14, alpha: a2, ref: 'q2' });
        if (!C.plain) tx(b, C, spot(leaf), '잎', 'sky', { size: 15, ref: 'leaf' });
        if (!C.plain && (C.review ? st >= 4 : t > 0.82)) tx(b, C, pt(a / 2, 0), '두 사분원 = 정사각형 + 잎', 'ink', { dy: -17, size: 14, alpha: C.review ? 1 : seg(t, 0.82, 0.95) });
      }
    },
    steps: (M) => [
      '잎 모양은 한 꼭짓점이 중심인 사분원과 마주 보는 꼭짓점이 중심인 사분원이 겹친 부분이에요.',
      `사분원 하나 $\\dfrac14\\pi\\times${M.a}^2=${piT(M.qd)}$`,
      `두 사분원을 겹쳐 놓으면 정사각형 전체를 한 번 덮고, 잎은 한 번 더 덮어요.`,
      `(사분원) + (사분원) = (정사각형) + (잎)  →  잎 = $${piT(M.two)}-${M.A}$`,
      `잎 모양의 넓이 $=${M.leaf.t}$ (cm²)`
    ],
    view(M, C, s) {
      return {
        guide: C.t < 0.05 ? '정사각형에서 마주 보는 두 꼭짓점이 중심인 <b>사분원 2개</b>를 그려요. ▶를 누르면 사분원이 차례로 나타나요.'
          : C.t < 0.68 ? '두 사분원이 정사각형을 덮어 가요. 두 사분원이 겹친 곳(잎)은 <b>두 번</b> 덮여요.'
          : `(사분원 2개) = (정사각형) + (잎). 그래서 잎 = ${piP(M.two)} − ${M.A} = <b>${M.leaf.p} cm²</b>.`,
        readouts: [
          rd('사분원 하나', piP(M.qd) + ' cm²', CA, `¼×π×${M.a}²`, 'q1'),
          rd('정사각형', M.A + ' cm²', 'ink', `${M.a} × ${M.a}`),
          rd('잎 모양의 넓이', M.leaf.p + ' cm²', 'sky', '≈ ' + fmtN(M.leaf.v) + ' cm²', 'leaf', true)
        ],
        status: { tone: 'info', text: `잎 = 사분원 2개 − 정사각형 = ${M.leaf.p} cm²` },
        parts: [
          { id: 'q1', name: '사분원 ①', desc: '왼쪽 위 꼭짓점이 중심', value: piP(M.qd), color: CA },
          { id: 'q2', name: '사분원 ②', desc: '오른쪽 아래 꼭짓점이 중심', value: piP(M.qd), color: CB },
          { id: 'leaf', name: '잎 모양', desc: '두 사분원이 겹친 곳', value: M.leaf.p, color: CS }
        ],
        formula: `<p>(잎) = (사분원) + (사분원) − (정사각형)</p><p>$=2\\times${piT(M.qd)}-${M.A}=${M.leaf.t}$ (cm²)</p>`,
        rule: '(겹친 부분) = (두 도형의 넓이의 합) − (두 도형이 덮은 전체)',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>네 잎 문제는 이 계산을 한 변이 절반인 칸 4개에 쓴 거예요.</li><li>잎의 둘레(앞 장면)와 넓이를 함께 생각해 보세요.</li></ul>'
      };
    },
    std: (M) => ({
      steps: `<b>해결 전략</b><br>① 두 사분원이 정사각형을 덮고 있음을 이용한다.<br>② (잎) = (사분원) + (사분원) − (정사각형)<br><br>$=2\\times\\dfrac14\\pi\\times${M.a}^2-${M.A}=${M.leaf.t}$ (cm²)`,
      warning: '잎 모양의 넓이를 직접 구하기 어렵다면, 겹친 부분 = 합 − 전체 로 구해요.'
    }),
    quick: (M) => ({ steps: `잎 = 원의 $\\dfrac12$ − 정사각형 = $\\dfrac12\\pi\\times${M.a}^2-${M.A}$`, highlight: '사분원 2개는 반원과 같은 넓이' }),
    prob(M) {
      const A = M.A;
      const sp = [[q(A, 2), q(-A, 1), '정답'], [q(A, 4), q(-A / 2 | 0, 1), '사분원 하나만 썼어요. 사분원 2개에서 정사각형을 빼야 해요.'], [q(A, 2), q(-A / 2 | 0, 1), '정사각형을 절반만 뺐어요. 정사각형 전체를 빼야 해요.'], [q(A, 1), q(-A, 1), '원 전체의 넓이를 썼어요. 사분원 2개는 원의 절반이에요.'], [q(A, 4), q(-A, 1), '사분원 하나로 계산했어요. 사분원은 2개예요.']];
      const opts = sp.map((v, i) => { const L = lin(v[0], v[1]); return { t: par(L, 'cm^2'), p: parP(L, 'cm²'), ok: i === 0, hint: i === 0 ? '' : v[2] }; });
      return { tag: '잎 모양의 넓이', stem: `그림과 같이 한 변의 길이가 ${M.a} cm인 정사각형에서 마주 보는 두 꼭짓점을 중심으로 사분원을 그렸을 때, 색칠한 잎 모양의 넓이는?`, choices: opts, key: 'a' + M.a };
    }
  });

  /* ------------------------------------------------------------------ ⑨ 확장 · 직사각형 두 개 겹치기 */
  function mRR(s, truth) {
    const h = s.f3h, o = truth ? clamp(s.f3o, 0.5, 3.5) : clamp(s.f3o, 0, 4), wA = 5, wB = 4;
    const A = wA * h, B = wB * h, O = o * h;
    return { h, o, wA, wB, A, B, O, U: A + B - O };
  }
  SCENES.push({
    id: 'f3-two-rects', title: '확장 · 직사각형 두 개를 겹쳐 놓기', short: '겹쳐 놓기(확장)',
    question: '두 직사각형을 겹쳐 놓으면 전체 넓이는 두 넓이의 합보다 얼마나 줄어들까?',
    ctl: ['f3h', 'f3o'], dur: 8,
    init: (s) => { s.f3h = 3; s.f3o = 2; },
    reroll: (s) => { s.f3h = pick([2, 3, 4, 5], s.f3h); s.f3o = pick([1, 1.5, 2, 2.5, 3], s.f3o); },
    model: (s, truth) => mRR(s, truth),
    tick: (s, dt, lab) => { if (s.playing) { s.f3dir = s.f3dir || 1; s.f3o += s.f3dir * dt * 1.1; if (s.f3o > 4) { s.f3o = 4; s.f3dir = -1; } if (s.f3o < 0) { s.f3o = 0; s.f3dir = 1; } return true; } return false; },
    draw(b, s, M, C) {
      const h = M.h, wA = M.wA, wB = M.wB;
      const o = C.review && C.step <= 1 ? 0 : M.o;   // 1단계: 따로 놓은 모양, 2단계부터 가로로 밀어 겹침
      layout2(b, { x0: 0, y0: -h, x1: wA + wB, y1: 0 }, null, { padB: 40, padL: 44, padT: C.review ? 14 : 0 });
      const xB = wA - o;
      const ra = [pt(0, -h), pt(wA, -h), pt(wA, 0), pt(0, 0)], rb = [pt(xB, -h), pt(xB + wB, -h), pt(xB + wB, 0), pt(xB, 0)];
      const ov = [pt(xB, -h), pt(wA, -h), pt(wA, 0), pt(xB, 0)];
      fillP(b, [ra], CA, 0.26, { ref: 'ra' }); fillP(b, [rb], CB, 0.26, { ref: 'rb' });
      if (o > 0.001) fillP(b, [ov], CO, 0.5, { ref: 'ov' });
      b.poly(ra, { color: CA, width: 3.2, ref: 'ra' }); b.poly(rb, { color: CB, width: 3.2, ref: 'rb' });
      if (C.review && C.step >= 4) b.path([pt(0, -h), pt(xB + wB, -h), pt(xB + wB, 0), pt(0, 0)], { color: 'ink', width: 4.2, close: true, dash: [8, 5] });
      if (C.txt) {
        const aX = o > 1 ? (xB) / 2 : wA / 2, bX = (wA + xB + wB) / 2;
        tx(b, C, pt(aX, -h / 2), 'A', CA, { size: 17 });
        tx(b, C, pt(bX, -h / 2), 'B', CB, { size: 17 });
        if (o > 0.4) tx(b, C, pt((xB + wA) / 2, -h / 2), '겹침', CO, { size: 14 });
        tx(b, C, pt(wA / 2, 0), fmtN(M.wA) + ' cm', CA, { dy: 18, size: 14 });
        tx(b, C, pt(xB + wB / 2, 0), fmtN(M.wB) + ' cm', CB, { dy: 36, size: 14 });
        tx(b, C, pt(0, -h / 2), fmtN(h) + ' cm', 'ink', { dx: -10, align: 'right' });
        if (C.review) {
          tx(b, C, pt(aX, -h), 'A ' + fmtN(M.A) + ' cm²', CA, { dy: -16, size: 14 });
          tx(b, C, pt(bX, -h), 'B ' + fmtN(M.B) + ' cm²', CB, { dy: -16, size: 14 });
          if (o > 0.3 && C.step >= 3) tx(b, C, pt((xB + wA) / 2, 0), '겹침 ' + fmtN(M.O) + ' cm²', CO, { dy: 56, size: 14 });
        } else if (o > 0.3) tx(b, C, pt((xB + wA) / 2, -h), fmtN(o) + ' cm', CO, { dy: -16, size: 14 });
        if (!C.plain && !C.review && !C.thumb) b.handle('ob', pt(xB, -h), { color: 'rose', r: 7, ariaLabel: '겹친 부분의 가로', drag: (p) => { s.f3o = clamp(Math.round((wA - p.x) * 2) / 2, 0, 4); } });
      }
    },
    steps: (M) => [
      `직사각형 A의 넓이 $=${M.wA}\\times${M.h}=${M.A}$, 직사각형 B의 넓이 $=${M.wB}\\times${M.h}=${M.B}$`,
      `두 직사각형을 겹쳐 놓으면 겹친 부분은 A에도, B에도 들어 있어요. 그래서 A + B로 세면 겹친 부분을 두 번 센 거예요.`,
      `겹친 부분의 넓이 $=${fmtN(M.o)}\\times${M.h}=${fmtN(M.O)}$`,
      `(전체 넓이) = (A) + (B) − (겹친 부분) $=${M.A}+${M.B}-${fmtN(M.O)}=${fmtN(M.U)}$ (cm²)`
    ],
    view(M, C, s) {
      return {
        guide: `분홍 직사각형 B를 <b>가로로</b> 끌어(또는 막대로) 겹치는 폭을 바꿔 보세요. 겹친 부분(보라)은 A에도 B에도 들어 있어서 <b>두 번</b> 세어져요. ▶를 누르면 저절로 움직여요.`,
        readouts: [
          rd('직사각형 A', fmtN(M.A) + ' cm²', CA, `${M.wA} × ${M.h}`, 'ra'),
          rd('직사각형 B', fmtN(M.B) + ' cm²', CB, `${M.wB} × ${M.h}`, 'rb'),
          rd('겹친 부분', fmtN(M.O) + ' cm²', CO, `${fmtN(M.o)} × ${M.h}`, 'ov'),
          rd('합친 도형의 넓이', fmtN(M.U) + ' cm²', 'sky', 'A + B − 겹친 부분', null, true)
        ],
        status: { tone: 'info', text: `전체 = ${fmtN(M.A)} + ${fmtN(M.B)} − ${fmtN(M.O)} = ${fmtN(M.U)}` },
        parts: [
          { id: 'ov', name: '겹친 부분', desc: 'A와 B에 모두 들어 있어요', value: fmtN(M.O), color: CO }
        ],
        formula: `<p>(합친 넓이) = (A) + (B) − (겹친 부분)</p><p>$=${M.A}+${M.B}-${fmtN(M.O)}=${fmtN(M.U)}$ (cm²)</p>`,
        rule: '겹친 부분은 두 번 세어지므로 한 번 빼 준다.',
        notes: '<ul style="margin:0;padding-left:18px;display:grid;gap:4px"><li>원과 부채꼴 문제에서 <b>겹친 부분</b>이 보이면 이 생각을 떠올리세요.</li></ul>'
      };
    },
    std: (M) => ({ steps: `<b>해결 전략</b><br>① 두 직사각형의 넓이를 각각 구한다.<br>② 겹친 부분을 구해서 한 번 뺀다.<br><br>$${M.wA}\\times${M.h}+${M.wB}\\times${M.h}-${fmtN(M.o)}\\times${M.h}=${fmtN(M.U)}$ (cm²)`, warning: '겹친 부분을 빼지 않으면 두 번 센 거예요.' }),
    quick: (M) => ({ steps: `세로가 같으므로 가로만 합쳐서: $(${M.wA}+${M.wB}-${fmtN(M.o)})\\times${M.h}=${fmtN(M.U)}$`, highlight: '합친 도형의 가로 = 5 + 4 − (겹친 가로)' }),
    prob(M) {
      const u = M.U;
      const vals = [M.A + M.B, u, M.A + M.B + M.O, M.A, M.B];
      const hints = ['겹친 부분을 두 번 세었어요. 한 번 빼 주세요.', '', '겹친 부분을 빼야 하는데 더했어요.', '직사각형 A만 구했어요.', '직사각형 B만 구했어요.'];
      const opts = vals.map((v, i) => ({ t: fmtN(v) + '\\ \\mathrm{cm^2}', p: fmtN(v) + ' cm²', ok: i === 1, hint: hints[i] }));
      return { tag: '겹쳐 놓은 도형의 넓이', stem: `가로 ${M.wA} cm, 세로 ${M.h} cm인 직사각형과 가로 ${M.wB} cm, 세로 ${M.h} cm인 직사각형을 가로로 ${fmtN(M.o)} cm만큼 겹쳐 놓았다. 합친 도형의 넓이는?`, choices: opts, key: 'h' + M.h + 'o' + M.o };
    }
  });

  /* ------------------------------------------------------------------ 문제 탭 (보기 · 서답형 · 숫자 바꾸기) */
  function pick(list, cur) {
    const pool = list.filter((x) => x !== cur);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function problemHTML(D, s) {
    const M = D.model(s, true);
    const P = D.prob(M, s);
    const key = D.id + '|' + P.key + '|' + (s.f3seed || 0);
    const pk = s.f3pick && s.f3pick.key === key ? s.f3pick : null;
    let h = `<div class="f3-q">${esc(P.stem).replace(/\$([^$]*)\$/g, '$$$1$$').replace(/&amp;/g, '&')}</div>`;
    // 정답 위치: 장면마다 정해 둔 순서를 숫자 바꾸기 때마다 섞지 않고 그대로 둡니다(교과서처럼 고정).
    if (P.choices) {
      h += '<div class="f3-choices">';
      P.choices.forEach((o, i) => {
        const cls = pk && pk.idx === i ? (o.ok ? ' ok' : ' bad') : '';
        h += `<button type="button" class="f3-ch${cls}" data-f3-pick="${i}" aria-label="${NUM[i]} ${esc(o.p)}"><span class="n">${NUM[i]}</span><span class="v">$${o.t}$</span></button>`;
      });
      h += '</div>';
      if (pk) {
        const o = P.choices[pk.idx];
        h += o.ok ? '<div class="f3-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="f3-fb bad"><b>다시 생각해 볼까요?</b> ${esc(o.hint || '')}</div>`;
      }
    } else if (P.number) {
      const v = s.f3ans == null ? '' : s.f3ans;
      h += `<div class="f3-num"><label>${esc(P.number.label)}</label><input type="number" inputmode="decimal" data-f3-in value="${esc(v)}" aria-label="${esc(P.number.label)}"><span>${esc(P.number.unit)}</span><button type="button" class="apl-btn sm" data-f3-chk>확인</button></div>`;
      if (s.f3chk) {
        const ok = Math.abs(parseFloat(v) - P.number.answer) < 1e-6;
        h += ok ? '<div class="f3-fb ok"><b>정답이에요!</b> 정리 탭에서 풀이 과정을 확인해 보세요.</div>' : `<div class="f3-fb bad"><b>다시 생각해 볼까요?</b> ${esc(P.number.hint)}</div>`;
      }
    }
    h += `<div class="f3-tools"><button type="button" class="apl-btn sm" data-f3-new>숫자 바꾸기</button>${P.note ? `<span class="f3-note">${esc(P.note)}</span>` : ''}</div>`;
    return h;
  }
  function answerText(D, s) {
    const M = D.model(s, true), P = D.prob(M, s);
    if (P.choices) { const i = P.choices.findIndex((o) => o.ok); return `${NUM[i]} $${P.choices[i].t}$`; }
    return `$${P.number.label.replace('=', '').trim()}=${P.number.answer}^{\\circ}$`;
  }

  /* ------------------------------------------------------------------ 장면 만들기 */
  function makeScene(D) {
    return {
      id: D.id, title: D.title, short: D.short, f3: D,
      question: D.question,
      controls: () => D.ctl,
      presets: () => (D.presets ? D.presets() : []),
      actions: () => [
        {
          id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'),
          label: (s) => (s.playing ? '일시 정지' : D.tick || D.id === 'f3-two-rects' ? '저절로 움직이기' : s.f3t >= 0.999 ? '다시 재생' : '조각 움직여 보기'),
          on: (s) => s.playing,
          run: (s) => { if (s.playing) s.playing = false; else { if (!D.tick && s.f3t >= 0.999) s.f3t = 0; s.playing = true; } }
        },
        { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; if (!D.tick) s.f3t = 0; else D.init(s); } }
      ],
      steps: (s) => D.steps(D.model(s, true)),
      solution: {
        standardTitle: '교과서식 풀이 (해결 전략)', standardTag: '정석',
        quickTitle: '빠른 풀이 · 핵심 원리', quickTag: '핵심',
        standard: (s) => D.std(D.model(s, true)),
        quick: (s) => D.quick(D.model(s, true))
      },
      notesTitle: '자주 틀리는 부분',
      problem: {
        tag: (s) => D.prob(D.model(s, true), s).tag,
        text: (s) => problemHTML(D, s),
        answer: (s) => answerText(D, s)
      },
      enter: (s, lab) => {
        D.init(s);
        s.f3t = 0; s.f3seed = 0; s.f3pick = null; s.f3ans = null; s.f3chk = null; s.playing = false; s.f3dir = 1;
        if (lab) { curLab = lab; if (s === lab.s) ensureParams(lab); }
      },
      tick: D.tick || ((s, dt, lab) => {
        let again = false;
        if (s.playing) {
          s.f3t = Math.min(1, (s.f3t || 0) + dt / (D.dur || 12));
          if (s.f3t >= 1) s.playing = false;
          again = true;
        } else if (lab && lab.tab === 'review' && D.stepT && !s.dragging) {
          const tg = D.stepT(s.step || 0), d = tg - s.f3t;
          if (Math.abs(d) > 8e-4) { s.f3t += clamp(d, -0.3 * dt, 0.3 * dt); again = true; }
        }
        return again;
      }),
      view: (s, lab) => {
        if (lab) curLab = lab;
        const C = baseCtx(s, lab, false);
        const v = D.view(D.model(s, C.truth), C, s);
        // 문제·정리 탭에서는 무대 위 띠가 답을 미리 알려 주지 않도록 바꿉니다.
        if (C.tab === 'problem') v.status = { tone: 'info', text: '그림을 보고 풀어 보세요' };
        else if (C.tab === 'review') { const n = D.steps(D.model(s, true)).length; v.status = { tone: s.step >= n ? 'ok' : 'info', text: `풀이 ${Math.min(s.step || 1, n)} / ${n}단계` }; }
        return v;
      },
      draw: (b, s, v, lab) => {
        const C = baseCtx(s, lab, !!b.thumb);
        if (b.thumb) { C.step = 99; }
        D.draw(b, s, D.model(s, C.truth), C);
      }
    };
  }

  /* ------------------------------------------------------------------ 문제 탭 버튼 · 서식 */
  function installClicks() {
    const root = document.documentElement;
    if (root.dataset.f3Bound) return;
    root.dataset.f3Bound = '1';
    document.addEventListener('click', (ev) => {
      const lab = curLab || window.lab;
      if (!lab || !ev.target || !ev.target.closest) return;
      const hit = ev.target.closest('[data-f3-pick],[data-f3-new],[data-f3-chk]');
      if (!hit) return;
      const sc = lab.scene;
      if (!sc || !sc.f3) return;
      const D = sc.f3, s = lab.s;
      const key = () => D.id + '|' + D.prob(D.model(s, true), s).key + '|' + (s.f3seed || 0);
      if (hit.hasAttribute('data-f3-new')) {
        D.reroll(s);
        s.f3seed = (s.f3seed || 0) + 1; s.f3pick = null; s.f3ans = null; s.f3chk = null; s.revealed = false; s.f3t = 0; s.playing = false;
        lab.setStep(1);
        refreshReview(lab);
        return;
      }
      if (hit.hasAttribute('data-f3-chk')) {
        const inp = document.querySelector('[data-f3-in]');
        s.f3ans = inp ? inp.value : s.f3ans;
        s.f3chk = true;
        const P = D.prob(D.model(s, true), s);
        if (P.number && Math.abs(parseFloat(s.f3ans) - P.number.answer) < 1e-6) s.revealed = true;
        lab.invalidate(true);
        return;
      }
      const idx = parseInt(hit.getAttribute('data-f3-pick'), 10);
      s.f3pick = { key: key(), idx };
      const P = D.prob(D.model(s, true), s);
      if (P.choices[idx] && P.choices[idx].ok) s.revealed = true;
      lab.invalidate(true);
    });
    document.addEventListener('input', (ev) => {
      const lab = curLab || window.lab;
      if (lab && ev.target && ev.target.matches && ev.target.matches('[data-f3-in]')) { lab.s.f3ans = ev.target.value; lab.s.f3chk = null; }
    });
  }
  function installStyle() {
    if (document.getElementById('f3-css')) return;
    const st = document.createElement('style');
    st.id = 'f3-css';
    st.textContent = `
.f3-q{font-size:var(--fs-md);line-height:1.85}
.f3-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.f3-ch{display:flex;gap:8px;align-items:center;min-height:44px;padding:6px 10px;border:1px solid var(--line-2);background:var(--card-2);color:var(--text);border-radius:var(--r-md);font:700 var(--fs-md) var(--font-ui);cursor:pointer;text-align:left}
.f3-ch:hover{background:var(--hover)}
.f3-ch .n{color:var(--m-amber);flex:none}
.f3-ch.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 14%,var(--card))}
.f3-ch.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 12%,var(--card))}
.f3-fb{margin-top:8px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--fs-sm);line-height:1.7;border-left:3px solid var(--m-sky);background:var(--card-2)}
.f3-fb.ok{border-left-color:var(--m-green)}
.f3-fb.bad{border-left-color:var(--m-red)}
.f3-num{display:flex;gap:8px;align-items:center;margin:12px 0 4px;font:700 var(--fs-md) var(--font-ui)}
.f3-num input{width:96px;min-height:40px;padding:4px 10px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--card-2);color:var(--text);font:700 var(--fs-md) var(--font-ui)}
.f3-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}
.f3-note{font-size:var(--fs-xs);color:var(--text-3)}`;
    document.head.append(st);
  }
  installStyle();
  installClicks();

  /* ------------------------------------------------------------------ 등록 */
  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({
    order: 63,
    id: 'f03',
    title: 'F03 겹치기·빼기',
    short: 'F03 겹치기·빼기',
    params: PARAMS,
    scenes: SCENES.map(makeScene)
  });
})();
