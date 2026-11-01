/* ==========================================================================
   중1 · 회전체 — 탭 ② 「회전체의 단면」 (t2.js, order 20) — 장면 6개
   · s2-1 축에 수직으로 자르면 원 · s2-2 축을 포함하면 선대칭도형 · s2-3 [함정] 단면의 넓이(2r ≠ r) · s2-4 단면 → 입체(거꾸로)
   · s2-5 선대칭도형(접어서 겹치기) · s2-6 원뿔대 = 큰 원뿔 − 작은 원뿔
   회전체는 모두 밑면이 아래로 가도록 똑바로 세워 놓습니다(회전축은 세로). 움직임은 왼쪽에서 오른쪽으로만:
   자르는 판(칼날)이 왼쪽에서 들어와 오른쪽으로 밀려가며 단면이 나타나고, 떼어 내는 조각도 오른쪽으로 밀립니다.
   축을 포함하는 판을 축 둘레로 돌리는 것·접는 것은 제자리 회전입니다.
   오른쪽(또는 아래)의 작은 그림은 단면의 실제 모양이고, 가로 2r·세로 h가 그림 속에 크게 쓰입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SO;
  if (!G || !G.S3) return;
  const S3 = G.S3;
  const { PI, DEG, clamp, fmtN, T, fit, P, rd, notes, mkNum, mkText, rint, pick, sshuffle, jo, bboxOf } = G;
  const AMB = 'amber', SKY = 'sky', ROSE = 'rose', GRN = 'green';
  const cmv = (v) => fmtN(v) + ' cm';

  const PARAMS = {
    soSR: P('반지름 r', 2, 6, 1, 3, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soSr: P('윗면의 반지름', 1, 5, 1, 2, { color: 'amber', hint: '아랫면보다 작아야 해요', format: (v) => Math.round(v) + ' cm' }),
    soSH: P('높이 h', 3, 9, 1, 6, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soU: P('자르는 높이', 0.04, 0.96, 0.01, 0.4, { color: 'rose', hint: '평면의 높이를 정해요(칼날은 이 높이에서 가로로 지나가요)', format: (v) => Math.round(v * 100) + '%' }),
    soE: P('칼날 밀어 넣기', 0, 1, 0.005, 1, { color: 'rose', hint: '오른쪽으로 끌면 판이 왼쪽에서 들어와 가로로 지나가요', format: (v) => Math.round(v * 100) + '%' }),
    soPsi: P('단면판 돌리기', 0, 90, 1, 0, { color: 'rose', hint: '축을 포함한 채 제자리에서 돌아요', format: (v) => Math.round(v) + '°' }),
    soC: P('작은 원뿔의 높이', 1, 3, 1, 2, { color: 'amber', hint: '큰 원뿔 높이의 1/4, 2/4, 3/4', format: (v) => Math.round(v) + '/4' }),
    soG: P('작은 원뿔 떼어 내기', 0, 1, 0.01, 0.7, { color: 'rose', hint: '작은 원뿔이 오른쪽으로 밀려 나가요', format: (v) => Math.round(v * 100) + '%' }),
    soFold: P('왼쪽 반을 접기', 0, 1, 0.005, 0.5, { color: 'rose', hint: '회전축을 접는 선으로 접어요', format: (v) => Math.round(v * 180) + '°' })
  };

  /* ------------------------------------------------------------------ 입체·단면 계산 */
  const dimsOf = (s) => { const R = clamp(Math.round(s.soSR), 2, 6); return { R, r: clamp(Math.min(Math.round(s.soSr), R - 1), 1, 5), h1: clamp(Math.round(s.soSH), 3, 9) }; };
  function mkSol(kind, d) {
    if (kind === 'dbl') { const a = Math.ceil(d.h1 / 2); return S3.solid('dbl', { R: d.R, h1: a, h2: d.h1 - a }); }
    return S3.solid(kind, d);
  }
  // 축 위의 높이 y 에서 단면(원)의 반지름
  function rAt(sol, y) {
    const d = sol.d, h = d.h1;
    switch (sol.kind) {
      case 'cyl': return d.R;
      case 'cone': return d.R * (1 - y / h);
      case 'frus': return d.R + (d.r - d.R) * y / h;
      case 'sphere': return Math.sqrt(Math.max(0, d.R * d.R - y * y));
      case 'dbl': return y <= d.h1 ? d.R * y / d.h1 : d.R * (1 - (y - d.h1) / d.h2);
      default: return d.R;
    }
  }
  // 축을 포함한 단면(2차원, u=높이, v=가로 반지름 방향): 오른쪽 반 + 왼쪽 반
  function secPoly(sol) {
    const rt = sol.poly.map((p) => [p[1], p[0]]);
    const lf = sol.poly.slice().reverse().map((p) => [p[1], -p[0]]);
    return rt.concat(lf);
  }
  const SEC_NAME = { cyl: '직사각형', cone: '이등변삼각형', frus: '등변사다리꼴', sphere: '원', dbl: '연 모양(두 이등변삼각형)' };
  // 다각형을 d(p) ≥ 0 인 쪽으로 자릅니다(Sutherland–Hodgman)
  function clipPoly(poly, d) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const A = poly[i], B = poly[(i + 1) % poly.length], da = d(A), db = d(B);
      if (da >= 0) out.push(A);
      if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]); }
    }
    return out;
  }

  /* ------------------------------------------------------------------ 그림 틀: 똑바로 세운 입체 + 단면의 실제 모양(작은 그림) */
  const union = (a, c) => ({ x0: Math.min(a.x0, c.x0), x1: Math.max(a.x1, c.x1), y0: Math.min(a.y0, c.y0), y1: Math.max(a.y1, c.y1) });
  function placeInset(b, sb, side) {
    const gap = side * 0.12, W = Math.max(60, b.W - 90), H = Math.max(60, b.H - 90);
    const R = { cx: sb.x1 + gap + side / 2, cy: (sb.y0 + sb.y1) / 2 }, B = { cx: (sb.x0 + sb.x1) / 2, cy: sb.y0 - gap - side / 2 };
    const box = (q) => ({ x0: q.cx - side / 2, x1: q.cx + side / 2, y0: q.cy - side / 2, y1: q.cy + side / 2 });
    const kOf = (q) => { const u = union(sb, box(q)); return Math.min(W / (u.x1 - u.x0), H / (u.y1 - u.y0)); };
    const below = kOf(B) > kOf(R), q = below ? B : R;
    return { cx: q.cx, cy: q.cy, side, narrow: below, box: box(q) };
  }
  const sweepE = (rmax, t) => -1.5 * rmax + t * 2.7 * rmax;   // 판의 오른쪽 가장자리(가로 위치): 왼쪽 → 오른쪽
  const sheetW = (rmax) => 2.4 * rmax;                        // 판의 가로 길이
  function stage(b, s, M, C, hooks) {
    const D = S3.ctx(b, s), sol = M.sol, ext = 0.5 + 0.4 * sol.rmax, Rs = sol.rmax * 1.2;
    const pts = [D.P({ x: 0, y: sol.ymin - ext, z: 0 }), D.P({ x: 0, y: sol.ymax + ext, z: 0 })];
    if (hooks.pts) hooks.pts(D, M, Rs).forEach((p) => pts.push(p));
    const sb = S3.boxOf(D, sol, pts);
    const side = hooks.side === undefined ? Math.max(sol.h, 2 * sol.rmax) * 1.28 : hooks.side;
    const ins = side ? placeInset(b, sb, side) : null;
    fit(b, ins ? union(sb, ins.box) : sb, { t: 50, b: ins && ins.narrow ? 36 : 40, l: 44, r: 44 });
    S3.drawSolid(D, sol, {});
    S3.drawAxis(D, sol.ymin, sol.ymax, { ext, label: '회전축 l' });
    hooks.after(D, M, C, ins, Rs);
  }
  // (a) 축에 수직인(수평) 판: 높이 u, 오른쪽 가장자리 e (왼쪽에서 들어옴). 모서리 화면 위치.
  const perpCorners = (D, u, Rs) => [[-Rs, -Rs], [Rs, -Rs], [Rs, Rs], [-Rs, Rs]].map((q) => D.P({ x: q[0], y: u, z: q[1] }));
  function perpSheet(D, sol, u, ru, e, W, Rs, col = ROSE, fa = 0.16) {
    const x1 = e, x0 = e - W;
    D.poly3([{ x: x0, y: u, z: -Rs }, { x: x1, y: u, z: -Rs }, { x: x1, y: u, z: Rs }, { x: x0, y: u, z: Rs }], { close: true, fill: col, fillAlpha: fa, color: col, width: 2 });
    D.line({ x: x1, y: u, z: -Rs }, { x: x1, y: u, z: Rs }, col, 4.2);
    const circ = []; for (let i = 0; i < 72; i++) circ.push([ru * Math.cos(2 * PI * i / 72), ru * Math.sin(2 * PI * i / 72)]);
    const sec = clipPoly(clipPoly(circ, (p) => x1 - p[0]), (p) => p[0] - x0);
    if (sec.length >= 3) D.poly3(sec.map((p) => ({ x: p[0], y: u, z: p[1] })), { close: true, fill: AMB, fillAlpha: 0.34, color: AMB, width: 3.4 });
  }
  // (b) 축을 포함하는(세로) 판: 방위각 psi, 판 위 가로 좌표 v 의 오른쪽 가장자리 e
  const axCorners = (D, sol, psi, Rs, e = 0.4) => [[-Rs, sol.ymin - e], [Rs, sol.ymin - e], [Rs, sol.ymax + e], [-Rs, sol.ymax + e]].map((q) => D.P(D.pol(q[0], q[1], psi)));
  function axSheet(D, sol, psi, e, W, Rs, col = ROSE, fa = 0.12, ee = 0.4) {
    const v1 = e, v0 = e - W, y0 = sol.ymin - ee, y1 = sol.ymax + ee, q = (v, y) => D.pol(v, y, psi);
    D.poly3([q(v0, y0), q(v1, y0), q(v1, y1), q(v0, y1)], { close: true, fill: col, fillAlpha: fa, color: col, width: 2 });
    D.line(q(v1, y0), q(v1, y1), col, 4.2);
    const sp = secPoly(sol).map((p) => [p[1], p[0]]);   // [v, u]
    const sec = clipPoly(clipPoly(sp, (p) => v1 - p[0]), (p) => p[0] - v0);
    if (sec.length >= 3) D.poly3(sec.map((p) => D.pol(p[0], p[1], psi)), { close: true, fill: AMB, fillAlpha: 0.34, color: AMB, width: 3.4 });
  }

  // 단면 2차원 그림(회전축은 세로): 척도와 좌표 변환
  function secFrame(ins, sol) {
    const hs = sol.ymax - sol.ymin, ws = 2 * sol.rmax;
    const k = Math.min(ins.side * 0.62 / hs, ins.side * 0.62 / ws);
    return { k, f: (u, v) => ({ x: ins.cx + v * k, y: ins.cy + (u - (sol.ymin + sol.ymax) / 2) * k }) };
  }
  // 단면 그림과 길이(2r·h)를 그림 속에 크게. o: {fa, hiW, noDims, clip: 오른쪽 가장자리 이전만}
  function drawSection(b, C, ins, sol, o = {}) {
    const { k, f } = secFrame(ins, sol), px = (n) => n / b.k;
    const poly = secPoly(sol).map((p) => f(p[0], p[1]));
    b.path(poly, { close: true, fill: o.fill || AMB, fillAlpha: o.fa == null ? 0.3 : o.fa, color: o.color || AMB, width: o.width || 3.4 });
    b.seg(f(sol.ymin - 0.35, 0), f(sol.ymax + 0.35, 0), { color: ROSE, width: 2.2, dash: [7, 5] });
    if (C.txt && !o.noDims) {
      const d = sol.d, hiW = o.hiW ? 5 : 3, top = sol.ymax, bot = sol.ymin;
      const tk = (x, y, vert) => (vert ? b.seg({ x, y: y - px(5) }, { x, y: y + px(5) }, { color: AMB, width: hiW }) : b.seg({ x: x - px(5), y }, { x: x + px(5), y }, { color: AMB, width: hiW }));
      const hdim = (v0, v1, u, label, side) => { // 가로 길이(지름 2r) — side -1: 아래, +1: 위
        const p0 = f(u, v0), p1 = f(u, v1), yy = p0.y + side * px(16);
        b.seg({ x: p0.x, y: yy }, { x: p1.x, y: yy }, { color: AMB, width: hiW }); tk(p0.x, yy, true); tk(p1.x, yy, true);
        T(b, { x: (p0.x + p1.x) / 2, y: yy }, label, AMB, { dy: -side * 15, size: 16 });
      };
      const vdim = (v, u0, u1, label, side) => { // 세로 길이(높이 h)
        const p0 = f(u0, v), p1 = f(u1, v), xx = p0.x + side * px(16);
        b.seg({ x: xx, y: p0.y }, { x: xx, y: p1.y }, { color: AMB, width: hiW }); tk(xx, p0.y, false); tk(xx, p1.y, false);
        T(b, { x: xx, y: (p0.y + p1.y) / 2 }, label, AMB, { dx: side * (G.textW(label, 16) / 2 + 10), size: 16 });
      };
      const kd = sol.kind;
      if (kd === 'cyl') { hdim(-d.R, d.R, bot, `2r = ${2 * d.R}`, -1); vdim(d.R, bot, top, `h = ${d.h1}`, 1); }
      else if (kd === 'cone') { hdim(-d.R, d.R, bot, `2r = ${2 * d.R}`, -1); vdim(d.R, bot, top, `h = ${d.h1}`, 1); }
      else if (kd === 'frus') { hdim(-d.R, d.R, bot, `2R = ${2 * d.R}`, -1); hdim(-d.r, d.r, top, `2r = ${2 * d.r}`, 1); vdim(d.R, bot, top, `h = ${d.h1}`, 1); }
      else if (kd === 'sphere') { hdim(-d.R, d.R, bot, `2r = ${2 * d.R}`, -1); }
      else if (kd === 'dbl') { hdim(-d.R, d.R, d.h1, `2r = ${2 * d.R}`, 1); vdim(d.R, bot, d.h1, `${d.h1}`, 1); vdim(d.R, d.h1, top, `${sol.d.h2}`, 1); }
    }
    return { k, f };
  }
  const slantTicks = (b, ins, sol) => {
    const { f } = secFrame(ins, sol), d = sol.d;
    if (sol.kind === 'cone') { b.ticks(f(0, -d.R), f(d.h1, 0), { color: GRN, count: 1 }); b.ticks(f(0, d.R), f(d.h1, 0), { color: GRN, count: 1 }); }
    else if (sol.kind === 'frus') { b.ticks(f(0, -d.R), f(d.h1, -d.r), { color: GRN, count: 1 }); b.ticks(f(0, d.R), f(d.h1, d.r), { color: GRN, count: 1 }); }
    else if (sol.kind === 'dbl') { b.ticks(f(0, 0), f(d.h1, -d.R), { color: GRN, count: 1 }); b.ticks(f(0, 0), f(d.h1, d.R), { color: GRN, count: 1 }); }
  };

  const KIND = (s) => s.soK2 || 'cyl';
  const CHIPS = (list) => () => list.map((k, i) => ({ group: i === 0 ? '회전체' : '', label: { cyl: '원기둥', cone: '원뿔', frus: '원뿔대', sphere: '구', dbl: '두 원뿔' }[k], apply: (st) => { st.soK2 = k; }, on: (st) => KIND(st) === k }));
  const ctlOf = (s) => ({ cyl: ['soSR', 'soSH'], cone: ['soSR', 'soSH'], frus: ['soSR', 'soSr', 'soSH'], sphere: ['soSR'], dbl: ['soSR', 'soSH'] }[KIND(s)]);
  const baseModel = (s) => { const kind = KIND(s), d = dimsOf(s), sol = mkSol(kind, d); return { kind, d, sol }; };
  const S = [];
  const EA = { key: 'soE', dur: 5, label: '판 밀어 보기', start: 1 };

  /* ================================================================== s2-1 축에 수직인 단면 → 원 */
  S.push({
    id: 's2-1', pitchOnly: true, title: '회전축에 수직으로 자르면', short: '축에 수직 → 원',
    question: '회전체를 회전축에 수직인 평면으로 자르면 단면은 어떤 모양일까? 자르는 높이를 바꾸면 크기는 어떻게 달라질까?',
    ctl: (s) => ctlOf(s).concat(['soU', 'soE']), presets: CHIPS(['cyl', 'cone', 'frus', 'sphere']), anim: EA,
    stepT: (n) => (n >= 2 ? 1 : 1),
    init: (s) => { s.soK2 = 'cyl'; s.soSR = 3; s.soSr = 2; s.soSH = 6; s.soU = 0.4; s.soE = 1; },
    reroll: (s) => { s.soP1 = pick([1, 2], s.soP1); s.soPK = pick(['cone', 'frus'], s.soPK); s.soPR = pick([2, 4, 6], s.soPR); s.soPH = pick([4, 6, 8], s.soPH); },
    model: (s) => {
      const m = baseModel(s), sol = m.sol, u = sol.ymin + clamp(s.soU, 0.04, 0.96) * (sol.ymax - sol.ymin);
      const pk = s.soPK || 'cone', pr = s.soPR || 4, ph = s.soPH || 6, kindP = s.soP1 || 1;
      return Object.assign(m, { u, ru: rAt(sol, u), pk, pr, ph, kindP });
    },
    draw(b, s, M, C) {
      if (C.problem && M.kindP === 2) { // 원뿔을 밑면에 평행하게 자른 단면의 반지름
        const sol = S3.solid('cone', { R: M.pr, h1: M.ph }), t = M.ph / 2, ru = rAt(sol, t);
        M = Object.assign({}, M, { sol, u: t, ru });
        stage(b, s, M, C, {
          side: 0, pts: (D, m, Rs) => perpCorners(D, m.u, Rs).concat([D.P({ x: -m.sol.d.R - 3.2, y: 0, z: 0 }), D.P({ x: m.sol.d.R + 3.2, y: 0, z: 0 })]),
          after: (D, m, c, ins, Rs) => {
            perpSheet(D, m.sol, m.u, m.ru, Rs, 2 * Rs, Rs, ROSE, 0.14);
            const R0 = m.sol.d.R, h0 = m.sol.d.h1;
            D.line({ x: 0, y: 0, z: 0 }, { x: R0, y: 0, z: 0 }, AMB, 2.6, { dash: [5, 4] });
            D.lab({ x: R0 / 2, y: 0, z: 0 }, `r = ${R0} cm`, AMB, { dy: 16 });
            const bx = -R0 - 0.9;
            D.line({ x: bx, y: 0, z: 0 }, { x: bx, y: h0, z: 0 }, 'ink', 2.6);
            D.lab({ x: bx, y: h0 / 2, z: 0 }, `높이 ${h0} cm`, 'ink', { dx: -46, size: 15 });
            const cx2 = R0 + 0.9;
            D.line({ x: cx2, y: 0, z: 0 }, { x: cx2, y: m.u, z: 0 }, ROSE, 2.6);
            D.lab({ x: cx2, y: m.u / 2, z: 0 }, `${m.u} cm`, ROSE, { dx: 34, size: 15 });
          }
        });
        return;
      }
      if (C.problem) {
        stage(b, s, M, C, { side: 0, pts: (D, m, Rs) => perpCorners(D, m.u, Rs), after: (D, m, c, ins, Rs) => perpSheet(D, m.sol, m.u, Math.max(0.05, m.ru), Rs, 2 * Rs, Rs, ROSE, 0.14) });
        return;
      }
      stage(b, s, M, C, {
        pts: (D, m, Rs) => perpCorners(D, m.u, Rs),
        after: (D, m, c, ins, Rs) => {
          const hi = c.review && c.step === 1, e = sweepE(m.sol.rmax * 1.2 / 1.2, c.t * 1);
          perpSheet(D, m.sol, m.u, Math.max(0.04, m.ru), sweepE(Rs / 1.2, c.t), sheetW(Rs / 1.2), Rs * 1.15, ROSE, hi ? 0.26 : 0.16);
          void e;
          if (!ins) return;
          const cx = ins.cx, cy = ins.cy, K = ins.side * 0.34 / m.sol.rmax, rr = Math.max(0.04, m.ru) * K;
          const circ = (R2) => { const q = []; for (let i = 0; i <= 56; i++) q.push({ x: cx + R2 * Math.cos(2 * PI * i / 56), y: cy + R2 * Math.sin(2 * PI * i / 56) }); return q; };
          b.path(circ(m.sol.rmax * K), { close: true, color: 'muted', width: 1.6, dash: [5, 5], alpha: 0.7 });
          b.path(circ(rr), { close: true, fill: AMB, fillAlpha: 0.32, color: AMB, width: c.review && c.step === 2 ? 5.5 : 3.4 });
          if (c.txt) {
            T(b, { x: cx, y: cy + ins.side * 0.46 }, '단면(실제 모양)', 'ink', { size: 15 });
            if (m.kind !== 'sphere') {
              b.seg({ x: cx, y: cy }, { x: cx + rr, y: cy }, { color: AMB, width: 2.8 });
              T(b, { x: cx, y: cy - ins.side * 0.46 }, `반지름 r = ${fmtN(m.ru)} cm`, AMB, { size: 17 });
            } else T(b, { x: cx, y: cy - ins.side * 0.46 }, '가운데에서 가장 커요', AMB, { size: 16 });
          }
        }
      });
    },
    steps: (M) => [
      '회전축에 <b>수직인 평면</b>(분홍)이 정한 높이에서 왼쪽에서 오른쪽으로 가로로 밀려 지나가요.',
      '잘린 면(단면)은 어느 높이에서든 <b>원</b>이에요. (구도 마찬가지예요.)',
      M.kind === 'cyl' ? '원기둥은 어디를 잘라도 원의 크기가 <b>같아요</b>.' : M.kind === 'sphere' ? '구는 가운데를 자를 때 원이 가장 크고, 위·아래 끝으로 갈수록 작아져요.' : '원뿔(대)은 꼭짓점 쪽으로 갈수록 원이 <b>작아져요</b>.'
    ],
    view: (M) => ({
      guide: '<b>자르는 높이</b>를 정하고 <b>칼날 밀어 넣기</b> 막대를 오른쪽으로 끌어(또는 ▶) 보세요. 분홍 판이 정한 높이에서 왼쪽→오른쪽으로 지나가며 단면(노랑)이 나타나요. 오른쪽(또는 아래)에 단면의 실제 모양이 나와요.',
      readouts: [rd('회전체', M.sol.name, SKY), rd('단면의 모양', '원', AMB, '축에 수직인 평면'), rd('단면의 반지름', M.kind === 'sphere' ? '그림에서 확인' : cmv(M.ru), GRN, M.kind === 'cyl' ? '어디서나 같아요' : '높이에 따라 달라요')],
      status: { tone: 'ok', text: '축에 수직으로 자르면 항상 원' },
      formula: '<p>회전축에 수직인 평면으로 자른 단면 → <b>원</b></p><p>원기둥: 반지름이 일정 · 원뿔(대): 높이에 따라 반지름이 변함 · 구: 가운데에서 가장 큼</p>',
      rule: '회전체를 회전축에 수직인 평면으로 자른 단면은 항상 원이다',
      notes: notes('축에 <b>수직</b>이면 원이에요. 축을 <b>포함</b>하는 평면으로 자르면 원이 아니에요(다음 장면).', '원뿔·원뿔대는 자르는 높이에 따라 원의 <b>크기</b>가 달라져도 모양은 항상 원이에요.')
    }),
    prob: (M) => {
      if (M.kindP === 2) {
        const R = M.pr, h = M.ph, t = h / 2, ans = R / 2;
        return {
          tag: '단면(원)의 반지름', key: `c${R}-${h}`,
          stem: `그림은 밑면의 반지름이 ${R} cm, 높이가 ${h} cm인 원뿔이다. 밑면에서 ${t} cm 위에서 밑면과 평행한 평면으로 자를 때 생기는 단면(원)의 반지름은 몇 cm인가?`,
          choices: mkNum(ans, [[R, '밑면의 반지름이에요. 위로 올라갈수록 원이 작아져요.'], [R - 1, ''], [t, '자른 높이예요. 반지름이 아니에요.'], [R / 4, '너무 작아요. 높이의 중간이에요.']], (v) => fmtN(v) + ' cm', { valid: (v) => v > 0 })
        };
      }
      const names = ['원', '정사각형', '직사각형', '이등변삼각형', '사다리꼴'];
      return {
        tag: '단면의 모양', key: 'shape' + M.kind,
        stem: `그림과 같이 ${M.sol.name}${jo(M.sol.name, 'eul')} 회전축에 수직인 평면으로 자를 때 생기는 단면의 모양은?`,
        choices: mkText(names.map((n, i) => ({ h: n, ok: i === 0, hint: '회전축에 수직인 단면은 항상 원이에요. 축을 포함할 때와 헷갈리지 않았나요?' })))
      };
    }
  });

  /* ================================================================== s2-2 축을 포함하는 단면 → 선대칭도형 */
  S.push({
    id: 's2-2', pitchOnly: true, title: '회전축을 포함하여 자르면', short: '축을 포함 → 선대칭',
    question: '회전축을 포함하는 평면으로 자르면 단면은 어떤 모양일까? 평면을 축 둘레로 돌려도 단면의 모양이 달라질까?',
    ctl: (s) => ctlOf(s).concat(['soPsi', 'soE']), presets: CHIPS(['cyl', 'cone', 'frus', 'sphere']), anim: EA,
    stepT: () => 1,
    init: (s) => { s.soK2 = 'cyl'; s.soSR = 3; s.soSr = 2; s.soSH = 6; s.soPsi = 0; s.soE = 1; },
    reroll: (s) => { s.soPK = pick(['cyl', 'cone', 'frus', 'sphere'], s.soPK); },
    model: (s) => Object.assign(baseModel(s), { psi: clamp(s.soPsi, 0, 90) * DEG, pk: s.soPK || 'cone' }),
    draw(b, s, M, C) {
      if (C.problem) {
        const sol = mkSol(M.pk, { R: 3, r: 2, h1: 6 }); M = Object.assign({}, M, { sol, psi: 0 });
        stage(b, s, M, C, { side: 0, pts: (D, m, Rs) => axCorners(D, m.sol, m.psi, Rs), after: (D, m, c, ins, Rs) => axSheet(D, m.sol, m.psi, Rs, 2 * Rs, Rs) });
        return;
      }
      stage(b, s, M, C, {
        pts: (D, m, Rs) => axCorners(D, m.sol, m.psi, Rs),
        after: (D, m, c, ins, Rs) => {
          axSheet(D, m.sol, m.psi, sweepE(Rs / 1.2, c.t), sheetW(Rs / 1.2), Rs, ROSE, c.review && c.step === 1 ? 0.22 : 0.12);
          if (!ins) return;
          T(b, { x: ins.cx, y: ins.cy + ins.side * 0.46 }, `단면의 모양: ${SEC_NAME[m.kind]}`, 'ink', { size: 15 });
          drawSection(b, c, ins, m.sol, { hiW: c.review && c.step === 3 });
          slantTicks(b, ins, m.sol);
        }
      });
    },
    steps: (M) => [
      '회전축을 <b>포함하는</b> 세로 평면(분홍)이 왼쪽에서 오른쪽으로 가로로 밀려 지나가요.',
      `단면은 <b>${SEC_NAME[M.kind]}</b>이에요. 평면을 축 둘레로 돌려도 모양과 크기가 <b>그대로</b>예요.`,
      '단면은 회전축을 <b>대칭축</b>으로 하는 <b>선대칭도형</b>이에요(같은 표시의 변은 길이가 같아요).'
    ],
    view: (M) => ({
      guide: '<b>칼날 밀어 넣기</b>(▶)로 판이 왼쪽에서 오른쪽으로 지나가는 것을 보고, <b>단면판 돌리기</b>로 판을 축 둘레에서 제자리 회전시켜 보세요. 축을 포함하기만 하면 단면의 모양과 길이는 그대로예요. 단면 그림 속 길이는 지름 $2r$과 높이 $h$예요.',
      readouts: [rd('회전체', M.sol.name, SKY), rd('단면의 모양', SEC_NAME[M.kind], AMB), rd('대칭축', '회전축', ROSE, '선대칭도형')],
      status: { tone: 'ok', text: `${SEC_NAME[M.kind]} · 선대칭도형` },
      formula: `<p>${M.sol.name}의 축을 포함한 단면 = <b>${SEC_NAME[M.kind]}</b></p><p>어느 방향으로 잘라도 단면은 합동이고, 회전축이 대칭축이에요.</p>`,
      rule: '회전체를 회전축을 포함하는 평면으로 자른 단면은 회전축을 대칭축으로 하는 선대칭도형이다',
      notes: notes('지름 <b>2r</b>이 가로 길이예요. 반지름 r가 아니에요.', '축을 포함하기만 하면 <b>어느 방향</b>으로 잘라도 같은 모양이에요.')
    }),
    prob: (M) => {
      const names = ['원', '직사각형', '이등변삼각형', '등변사다리꼴', '마름모'];
      const ans = { sphere: 0, cyl: 1, cone: 2, frus: 3 }[M.pk];
      const nm = { sphere: '구', cyl: '원기둥', cone: '원뿔', frus: '원뿔대' }[M.pk];
      return {
        tag: '축을 포함한 단면의 모양', key: 'axial' + M.pk,
        stem: `그림과 같이 ${nm}${jo(nm, 'eul')} 회전축을 포함하는 평면으로 자를 때 생기는 단면의 모양은?`,
        choices: mkText(names.map((n, i) => ({ h: n, ok: i === ans, hint: i === 0 && M.pk !== 'sphere' ? '원은 축에 수직으로 자른 단면이에요. 축을 포함하면 달라요.' : '자른 단면을 축의 한쪽 반만 그려 보면 알 수 있어요.' })))
      };
    }
  });

  /* ================================================================== s2-3 단면의 넓이 */
  const area2 = (kind, d) => (kind === 'cyl' ? 2 * d.R * d.h1 : kind === 'cone' ? d.R * d.h1 : (d.R + d.r) * d.h1);
  S.push({
    id: 's2-3', pitchOnly: true, title: '[함정] 단면의 넓이는 2r로', short: '[함정] 단면의 넓이',
    question: '회전체를 축을 포함하는 평면으로 자른 단면의 넓이는 어떻게 구할까? 가로 길이는 반지름일까, 지름일까?',
    ctl: (s) => ctlOf(s), presets: CHIPS(['cyl', 'cone', 'frus']),
    init: (s) => { s.soK2 = 'cyl'; s.soSR = 3; s.soSr = 2; s.soSH = 6; },
    reroll: (s) => { s.soPK = pick(['cyl', 'cone', 'frus'], s.soPK); s.soPR = rint(2, 5); s.soPr2 = rint(1, s.soPR - 1); s.soPH = rint(3, 8); },
    model: (s) => {
      const m = baseModel(s), pk = s.soPK || 'cyl', pR = s.soPR || 3, pr = Math.min(s.soPr2 || 1, pR - 1), ph = s.soPH || 6;
      return Object.assign(m, { area: area2(m.kind, m.d), pk, pR, pr, ph, pd: { R: pR, r: pr, h1: ph } });
    },
    draw(b, s, M, C) {
      if (C.problem) {
        const sol = mkSol(M.pk, M.pd), d = sol.d;
        stage(b, s, Object.assign({}, M, { sol }), C, {
          side: 0, pts: (D, m, Rs) => axCorners(D, sol, 0, Rs).concat([D.P({ x: -sol.rmax - 3.2, y: 0, z: 0 }), D.P({ x: sol.rmax + 1.2, y: 0, z: 0 })]),
          after: (D, m, c, ins, Rs) => {
            axSheet(D, sol, 0, Rs, 2 * Rs, Rs);
            D.line({ x: 0, y: 0, z: 0 }, { x: d.R, y: 0, z: 0 }, AMB, 2.6, { dash: [5, 4] });
            D.lab({ x: d.R / 2, y: 0, z: 0 }, `r = ${d.R}`, AMB, { dy: 17, size: 16 });
            if (M.pk === 'frus') { D.line({ x: 0, y: d.h1, z: 0 }, { x: d.r, y: d.h1, z: 0 }, AMB, 2.6, { dash: [5, 4] }); D.lab({ x: d.r / 2, y: d.h1, z: 0 }, `r = ${d.r}`, AMB, { dy: -16, size: 16 }); }
            const bx = -sol.rmax - 1;
            D.line({ x: bx, y: 0, z: 0 }, { x: bx, y: d.h1, z: 0 }, AMB, 2.6);
            D.lab({ x: bx, y: d.h1 / 2, z: 0 }, `h = ${d.h1}`, AMB, { dx: -30, size: 16 });
          }
        });
        return;
      }
      stage(b, s, M, C, {
        pts: (D, m, Rs) => axCorners(D, m.sol, 0, Rs),
        after: (D, m, c, ins, Rs) => {
          axSheet(D, m.sol, 0, Rs, 2 * Rs, Rs);
          if (!ins) return;
          const { k, f } = drawSection(b, c, ins, m.sol, { hiW: c.review && c.step === 2 });
          // 함정: 반지름만 쓴 오른쪽 반(r × h)
          if (c.txt && (c.review ? c.step >= 4 : true)) {
            const half = secPoly(m.sol).filter((p) => p[1] >= 0).map((p) => f(p[0], p[1]));
            b.path(half, { close: true, fill: ROSE, fillAlpha: 0.2, color: null });
            T(b, f(m.sol.ymax * 0.5, m.d.R * 0.5), `r × h = ${m.d.R * m.d.h1}`, ROSE, { size: 15 });
            T(b, { x: ins.cx, y: ins.cy + ins.side * 0.47 }, `단면의 넓이 = ${m.kind === 'cyl' ? `2r × h = ${2 * m.d.R} × ${m.d.h1}` : m.kind === 'cone' ? `½ × 2r × h = ½ × ${2 * m.d.R} × ${m.d.h1}` : `(${2 * m.d.R} + ${2 * m.d.r}) × ${m.d.h1} ÷ 2`} = ${m.area}`, GRN, { size: 15 });
          }
        }
      });
    },
    steps: (M) => {
      const d = M.d;
      return [
        `축을 포함하는 평면으로 자른 단면은 ${M.kind === 'cyl' ? '직사각형' : M.kind === 'cone' ? '이등변삼각형' : '사다리꼴'}이에요.`,
        `가로(밑변)는 <b>지름 2r</b>이에요. 반지름 r=${d.R}이 아니라 2r=${2 * d.R}을 써요.` + (M.kind === 'frus' ? ` 윗변은 2r=${2 * d.r}이에요.` : ''),
        `세로(높이)는 입체의 높이 h=${d.h1}이에요.`,
        M.kind === 'cyl' ? `(넓이) = 가로 × 세로 = ${2 * d.R} × ${d.h1} = <b>${M.area}</b> (cm²)` : M.kind === 'cone' ? `(넓이) = ½ × 밑변 × 높이 = ½ × ${2 * d.R} × ${d.h1} = <b>${M.area}</b> (cm²)` : `(넓이) = (윗변 + 아랫변) × 높이 ÷ 2 = (${2 * d.r} + ${2 * d.R}) × ${d.h1} ÷ 2 = <b>${M.area}</b> (cm²)`
      ];
    },
    view: (M) => ({
      guide: '반지름 r와 높이 h를 바꿔 보세요. 단면 그림의 <b>가로는 지름 2r</b>이에요. 분홍색은 반지름만 쓴 <b>반쪽(r×h)</b>이라 넓이의 절반밖에 안 돼요.',
      readouts: [rd('단면의 가로', `2r = ${2 * M.d.R} cm`, AMB, '반지름이 아니라 지름'), rd('단면의 세로', `h = ${M.d.h1} cm`, AMB), rd('단면의 넓이', `${M.area} cm²`, GRN, null, null, true)],
      status: { tone: 'warn', text: `가로는 2r = ${2 * M.d.R}` },
      formula: M.kind === 'cyl' ? `<p>직사각형: 가로 × 세로 = $2r \\times h$ = ${2 * M.d.R} × ${M.d.h1} = <b>${M.area}</b></p>` : M.kind === 'cone' ? `<p>삼각형: $\\dfrac12 \\times 2r \\times h$ = ½ × ${2 * M.d.R} × ${M.d.h1} = <b>${M.area}</b></p>` : `<p>사다리꼴: $(2r_1 + 2r_2) \\times h \\div 2$ = (${2 * M.d.r} + ${2 * M.d.R}) × ${M.d.h1} ÷ 2 = <b>${M.area}</b></p>`,
      rule: '축을 포함한 단면의 가로 길이는 반지름이 아니라 지름(2r)이다',
      notes: notes('가로에 <b>반지름 r</b>을 넣으면 넓이가 절반이 돼요. 꼭 <b>지름 2r</b>을 쓰세요.', '원뿔의 단면은 삼각형이라 <b>½</b>을 곱해요. 원기둥은 직사각형이라 곱하지 않아요.')
    }),
    prob: (M) => {
      const d = M.pd, kind = M.pk, ans = area2(kind, d);
      const half = kind === 'cyl' ? d.R * d.h1 : kind === 'cone' ? d.R * d.h1 / 2 : (d.R + d.r) * d.h1 / 2;
      const nm = { cyl: '원기둥', cone: '원뿔', frus: '원뿔대' }[kind];
      return {
        tag: '단면의 넓이 (함정)', key: `${kind}${d.R}-${d.r}-${d.h1}`,
        stem: `그림과 같은 ${nm}${jo(nm, 'eul')} 회전축을 포함하는 평면으로 자를 때 생기는 단면의 넓이는 몇 cm²인가?`,
        choices: mkNum(ans, [[half, '반지름 r를 가로로 썼어요. 가로는 지름 2r이에요.'], [ans * 2, '2를 한 번 더 곱했어요.'], [ans + d.h1, ''], [d.R * d.R, '반지름의 제곱이에요. 단면의 넓이가 아니에요.']], (v) => fmtN(v) + ' cm²', { valid: (v) => v > 0 })
      };
    }
  });

  /* ================================================================== s2-4 단면 → 입체 (거꾸로) */
  const K4 = ['cyl', 'cone', 'frus', 'sphere', 'dbl'];
  S.push({
    id: 's2-4', pitchOnly: true, title: '단면을 보고 회전체 찾기', short: '단면 → 입체',
    question: '회전축을 포함하는 평면으로 자른 단면이 이렇게 생겼다면 그 회전체는 무엇일까? 단면의 반쪽을 축 둘레로 돌려 보면?',
    ctl: (s) => ctlOf(s).concat(['soT']), presets: CHIPS(K4), anim: { key: 'soT', dur: 6, label: '반쪽을 돌려 보기', start: 0.4 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soK2 = 'cyl'; s.soSR = 3; s.soSr = 2; s.soSH = 6; s.soT = 0.4; },
    reroll: (s) => { s.soPK = pick(K4, s.soPK); s.soPR = rint(2, 4); s.soPr2 = rint(1, s.soPR - 1); s.soPH = rint(4, 8); },
    model: (s) => { const m = baseModel(s); return Object.assign(m, { pk: s.soPK || 'frus', pd: { R: s.soPR || 3, r: Math.min(s.soPr2 || 1, (s.soPR || 3) - 1), h1: s.soPH || 6 } }); },
    draw(b, s, M, C) {
      if (C.problem) { // 2차원 단면 그림(축은 세로 점선), 모든 치수가 주어짐
        const sol = mkSol(M.pk, M.pd), side = Math.max(sol.h, 2 * sol.rmax) * 1.5, ins = { cx: 0, cy: 0, side };
        fit(b, { x0: -side * 0.62, x1: side * 0.62, y0: -side * 0.55, y1: side * 0.55 }, { l: 30, r: 30, t: 50, b: 30 });
        drawSection(b, C, ins, sol, {});
        const sf = secFrame(ins, sol);
        T(b, sf.f((sol.ymin + sol.ymax) / 2, 0), '회전축 l', ROSE, { dx: 44, size: 16 });
        return;
      }
      const D = S3.ctx(b, s), sol = M.sol, ext = 0.5 + 0.4 * sol.rmax;
      const sweep = 2 * PI * clamp(C.t, 0, 1), full = sweep >= 2 * PI - 1e-3;
      const side = Math.max(sol.h, 2 * sol.rmax) * 1.28;
      const sb = S3.boxOf(D, sol, [D.P({ x: 0, y: sol.ymin - ext, z: 0 }), D.P({ x: 0, y: sol.ymax + ext, z: 0 })]);
      const ins = placeInset(b, sb, side);
      fit(b, union(sb, ins.box), { t: 50, b: 40, l: 44, r: 44 });
      S3.drawRevolve(D, sol, full ? 2 * PI : sweep, {});
      S3.drawAxis(D, sol.ymin, sol.ymax, { ext, label: '회전축 l' });
      if (!full && sweep > 0.02) D.g.path(S3.figAt(D, sol.poly, sweep), { close: true, fill: AMB, fillAlpha: 0.16, color: AMB, width: 2.2, dash: [6, 5] });
      D.g.path(S3.figAt(D, sol.poly, 0), { close: true, fill: AMB, fillAlpha: 0.32, color: AMB, width: C.review && C.step === 2 ? 5 : 3.4 });
      if (C.txt) {
        T(b, { x: ins.cx, y: ins.cy + ins.side * 0.47 }, '축을 포함한 단면', 'ink', { size: 15 });
        drawSection(b, C, ins, sol, { hiW: false });
        slantTicks(b, ins, sol);
      }
    },
    steps: (M) => [
      `주어진 단면은 ${SEC_NAME[M.kind]}이에요. 회전축 $l$은 단면의 <b>대칭축</b>이에요.`,
      '대칭축의 <b>한쪽 반</b>만 남겨요. 그것이 회전하기 전의 평면도형이에요.',
      `반쪽을 축 둘레로 한 바퀴 돌려요. 이 반쪽이 만드는 입체는 <b>${M.sol.name}</b>이에요.`
    ],
    view: (M, C) => ({
      guide: '왼쪽은 단면의 <b>반쪽(노랑)</b>을 축 둘레로 제자리에서 돌려 만드는 회전체, 오른쪽(또는 아래)은 그 회전체의 <b>축을 포함한 단면</b>이에요. 돌리는 각도 막대를 움직여 보세요.',
      readouts: [rd('단면의 모양', SEC_NAME[M.kind], AMB), rd('회전체', M.sol.name, SKY, null, null, true)],
      status: C.t >= 0.999 ? { tone: 'ok', text: `${M.sol.name} 완성` } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: '<p>단면의 반쪽 = 회전하기 전의 평면도형 → 한 바퀴 돌리면 회전체</p>',
      rule: '회전체의 축을 포함하는 단면의 반쪽을 축 둘레로 1회전시키면 처음 회전체가 된다',
      notes: notes('단면은 <b>양쪽이 대칭</b>이에요. 반쪽만 돌리면 돼요.', '단면이 같은 모양이어도 <b>안이 비었는지</b>(구멍)는 단면에 구멍이 있는지 보고 판단해요.')
    }),
    prob: (M) => {
      const names = ['원기둥', '원뿔', '원뿔대', '구', '두 원뿔을 밑면끼리 붙인 입체'], ans = K4.indexOf(M.pk);
      return {
        tag: '단면 → 회전체', key: 'sec' + M.pk + JSON.stringify(M.pd), wide: true,
        stem: '회전축 l을 포함하는 평면으로 자른 단면이 그림과 같은 회전체는?',
        choices: mkText(names.map((n, i) => ({ h: n, ok: i === ans, hint: '단면의 반쪽을 돌렸을 때 만들어지는 입체를 생각해 보세요.' })))
      };
    }
  });

  /* ================================================================== s2-5 선대칭도형(접어서 겹치기) */
  S.push({
    id: 's2-5', noView: true, title: '단면을 접으면 포개져요', short: '선대칭도형',
    question: '축을 포함한 단면을 회전축으로 접으면 두 반쪽이 겹쳐질까? 이 도형을 무엇이라고 할까?',
    ctl: (s) => ctlOf(s).concat(['soFold']), presets: CHIPS(['cyl', 'cone', 'frus', 'sphere']),
    anim: { key: 'soFold', dur: 4, label: '접어 보기', start: 0.4 },
    stepT: (n) => (n >= 2 ? 1 : 0), problemT: 0.5,
    init: (s) => { s.soK2 = 'cyl'; s.soSR = 3; s.soSr = 2; s.soSH = 6; s.soFold = 0.4; },
    reroll: (s) => { s.soPK = pick(['cyl', 'cone', 'frus', 'sphere'], s.soPK); s.soPs = (s.soPs || 0) + 1; },
    model: (s) => Object.assign(baseModel(s), { pk: s.soPK || 'cone', ps: s.soPs || 0 }),
    draw(b, s, M, C) {
      if (C.problem) {
        const sol = mkSol(M.pk, { R: 3, r: 2, h1: 6 });
        stage(b, s, Object.assign({}, M, { sol, psi: 0 }), C, { side: 0, pts: (D, m, Rs) => axCorners(D, sol, 0, Rs), after: (D, m, c, ins, Rs) => axSheet(D, sol, 0, Rs, 2 * Rs, Rs) });
        return;
      }
      const sol = M.sol, hs = sol.ymax - sol.ymin, side = Math.max(sol.h, 2 * sol.rmax) * 1.4;
      const ins = { cx: 0, cy: 0, side };
      const sf = secFrame(ins, sol), phi = PI * clamp(C.t, 0, 1);
      fit(b, { x0: -side * 0.6, x1: side * 0.6, y0: -side * 0.58, y1: side * 0.58 }, { l: 40, r: 40, t: 50, b: 50 });
      const rt = sol.poly.map((p) => sf.f(p[1], p[0])), lf = sol.poly.map((p) => sf.f(p[1], -p[0] * Math.cos(phi)));
      b.path(rt, { close: true, fill: AMB, fillAlpha: 0.34, color: AMB, width: 3.4 });
      b.path(lf, { close: true, fill: ROSE, fillAlpha: 0.3, color: ROSE, width: 3.4 });
      b.seg(sf.f(sol.ymin - 0.35, 0), sf.f(sol.ymax + 0.35, 0), { color: ROSE, width: 2.6, dash: [7, 5] });
      if (C.txt) {
        T(b, sf.f(sol.ymax + 0.35, 0), '대칭축 = 회전축 l', ROSE, { dy: -16, size: 16 });
        const done = phi > PI - 0.04;
        T(b, sf.f(sol.ymin - 0.35, 0), done ? '두 반쪽이 꼭 겹쳐져요' : `${Math.round(phi / DEG)}° 접는 중`, done ? GRN : 'ink', { dy: 20, size: 17 });
        T(b, sf.f(sol.ymin - 0.35, 0), SEC_NAME[M.kind], 'ink', { dy: 42, size: 16 });
      }
      void hs;
    },
    steps: (M) => [
      `축을 포함한 단면은 ${SEC_NAME[M.kind]}이에요. 회전축이 단면을 왼쪽·오른쪽 두 반쪽으로 나눠요.`,
      '왼쪽 반을 회전축을 접는 선으로 접어 오른쪽으로 넘겨요(제자리 회전).',
      '두 반쪽이 <b>꼭 겹쳐져요</b>. 접어서 겹치는 도형은 <b>선대칭도형</b>이고, 접는 선이 <b>대칭축</b>이에요.',
      '그러므로 회전체의 축을 포함한 단면은 회전축을 대칭축으로 하는 선대칭도형이에요.'
    ],
    view: (M, C) => ({
      guide: '막대로 <b>왼쪽 반(분홍)</b>을 접어 오른쪽으로 넘겨 보세요. 단면의 모양이 달라도 접으면 항상 겹쳐져요.',
      readouts: [rd('단면의 모양', SEC_NAME[M.kind], AMB), rd('접는 선', '회전축', ROSE), rd('겹치나요?', C.t > 0.99 ? '예 (선대칭도형)' : '접는 중', GRN)],
      status: C.t > 0.99 ? { tone: 'ok', text: '두 반쪽이 겹쳐져요: 선대칭도형' } : { tone: 'info', text: `${Math.round(C.t * 180)}° 접었어요` },
      formula: '<p>접었을 때 완전히 겹치는 도형 = <b>선대칭도형</b> · 접는 선 = <b>대칭축</b></p><p>회전체의 축을 포함한 단면 → 대칭축은 회전축</p>',
      rule: '회전체를 회전축을 포함하는 평면으로 자른 단면은 선대칭도형이다',
      notes: notes('대칭축은 <b>회전축</b>이에요. 회전축에 수직인 선이 아니에요.', '회전축에 <b>수직</b>인 단면(원)과 헷갈리지 않게 해요.')
    }),
    prob: (M, s) => {
      const nm = { sphere: '구', cyl: '원기둥', cone: '원뿔', frus: '원뿔대' }[M.pk];
      const items = [
        { h: '선대칭도형이고, 대칭축은 회전축이다.', ok: true },
        { h: '모양이 어느 방향으로 자르느냐에 따라 달라진다.', hint: '축을 포함하면 어느 방향으로 잘라도 합동이에요.' },
        { h: '대칭축은 회전축에 수직인 직선이다.', hint: '대칭축은 회전축 자체예요.' },
        { h: '항상 원이다.', hint: '원은 축에 수직인 단면(또는 구)일 때예요.' },
        { h: '선대칭도형이 아니다.', hint: '접으면 겹치므로 선대칭도형이에요.' }
      ];
      const list = sshuffle(items.map((x) => ({ h: x.h, ok: !!x.ok, hint: x.hint || '' })), 's2-5|' + M.pk + M.ps + '|' + ((s && s.soSeed) || 0));
      return { tag: '축을 포함한 단면의 성질', key: 'sym' + M.pk + M.ps, wide: true, stem: `그림과 같이 ${nm}${jo(nm, 'eul')} 회전축을 포함하는 평면으로 자를 때 생기는 단면에 대한 설명으로 옳은 것은?`, choices: mkText(list) };
    }
  });

  /* ================================================================== s2-6 원뿔대 = 큰 원뿔 − 작은 원뿔 */
  S.push({
    id: 's2-6', pitchOnly: true, title: '원뿔대는 원뿔에서 원뿔을 뺀 것', short: '원뿔대 = 뿔 − 뿔',
    question: '원뿔을 밑면에 평행하게 잘라 윗부분을 떼어 내면 무엇이 남을까? 떼어 낸 부분과 남은 부분은 어떤 입체일까?',
    ctl: ['soSR', 'soSH', 'soC', 'soG'],
    init: (s) => { s.soSR = 4; s.soSH = 6; s.soC = 2; s.soG = 0.7; },
    reroll: (s) => { s.soPR = pick([2, 3, 4], s.soPR); s.soPH = pick([4, 6, 8, 12], s.soPH); s.soPc = pick([1, 2, 3], s.soPc); },
    model: (s) => {
      const R = clamp(Math.round(s.soSR), 2, 6), H = clamp(Math.round(s.soSH), 3, 9), c = clamp(Math.round(s.soC), 1, 3) / 4;
      const hs = H * c, rs = R * c, pR = s.soPR || 3, pH = s.soPH || 8, pc = s.soPc || 2;
      return { R, H, c, hs, rs, hf: H - hs, pR, pH, pc, ph: pH * pc / 4, prs: pR * pc / 4, gap: clamp(s.soG, 0, 1) };
    },
    draw(b, s, M, C) {
      const prob = C.problem;
      const R = prob ? M.pR : M.R, H = prob ? M.pH : M.H, c = prob ? M.pc / 4 : M.c, hs = H * c, rs = R * c, g = prob ? 0 : M.gap;
      const D = S3.ctx(b, s);
      const frus = S3.solid('frus', { R, r: rs, h1: H - hs }), big = S3.solid('cone', { R, h1: H });
      const shift = g * (2 * R + 1.4);       // 작은 원뿔은 같은 높이에서 오른쪽(가로)으로 밀려 나갑니다.
      const ext = 0.5 + 0.4 * R;
      const pts = [D.P({ x: 0, y: -ext, z: 0 }), D.P({ x: 0, y: H + ext, z: 0 }), D.P({ x: shift + rs, y: H - hs, z: 0 })];
      if (prob) pts.push(D.P({ x: -R - 1.4, y: 0, z: 0 }), D.P({ x: R + 1.6, y: 0, z: 0 }));
      const sb = S3.boxOf(D, big, pts);
      const side = Math.max(2 * R, 4) * 1.1;
      const ins = prob ? null : placeInset(b, unionB(sb, { x0: sb.x0, x1: sb.x1, y0: sb.y0, y1: sb.y1 }), side);
      fit(b, ins ? union(sb, ins.box) : sb, { t: 50, b: 40, l: prob ? 96 : 44, r: prob ? 100 : 44 });
      // 큰 원뿔의 윤곽(점선)
      if (g > 0.02 || prob) S3.tangents(S3.ringP(D, R, 0), S3.ringP(D, 0, H)).lines.forEach((ln) => D.g.path([ln[0], ln[1]], { color: 'muted', width: 1.8, dash: [6, 5], alpha: 0.8 }));
      S3.drawBands(D, frus.bands, {});
      // 작은 원뿔: 위치는 그대로 높이만 유지하고 가로로 shift 만큼 이동(밑면 높이 H-hs)
      const Ds = S3.ctx(b, s, { k: 1, ox: D.P({ x: shift, y: 0, z: 0 }).x - D.P({ x: 0, y: 0, z: 0 }).x, oy: 0 });
      S3.drawBands(Ds, [{ y0: H - hs, y1: H, r0: rs, r1: 0 }], { color: AMB, fillAlpha: 0.2 });
      S3.drawAxis(D, 0, H, { ext, label: '회전축 l' });
      if (C.txt) {
        D.line({ x: 0, y: 0, z: 0 }, { x: R, y: 0, z: 0 }, SKY, 2.4, { dash: [5, 4] });
        D.lab({ x: R / 2, y: 0, z: 0 }, `R = ${fmtN(R)}`, SKY, { dy: 16, size: 16 });
        Ds.line({ x: 0, y: H - hs, z: 0 }, { x: rs, y: H - hs, z: 0 }, AMB, 2.4, { dash: [5, 4] });
        Ds.lab({ x: rs / 2, y: H - hs, z: 0 }, `r = ${fmtN(rs)}`, AMB, { dy: 16, size: 15 });
        if (prob) {
          const bx = -R - 1, bx2 = R + 1.2;
          D.line({ x: bx, y: 0, z: 0 }, { x: bx, y: H, z: 0 }, 'ink', 2.6);
          D.lab({ x: bx, y: H / 2, z: 0 }, `큰 원뿔 높이 ${H}`, 'ink', { dx: -56, size: 15 });
          D.line({ x: bx2, y: H - hs, z: 0 }, { x: bx2, y: H, z: 0 }, AMB, 2.6);
          D.lab({ x: bx2, y: H - hs / 2, z: 0 }, `작은 원뿔 높이 ${fmtN(hs)}`, AMB, { dx: 62, size: 15 });
        }
      }
      if (ins && C.txt) {
        const cx = ins.cx, cy = ins.cy, K = ins.side * 0.36 / R;
        const circ = (R2) => { const q = []; for (let i = 0; i <= 56; i++) q.push({ x: cx + R2 * Math.cos(2 * PI * i / 56), y: cy + R2 * Math.sin(2 * PI * i / 56) }); return q; };
        b.path(circ(R * K), { close: true, fill: SKY, fillAlpha: 0.18, color: SKY, width: 3.2 });
        b.path(circ(rs * K), { close: true, fill: AMB, fillAlpha: 0.3, color: AMB, width: 3.2 });
        T(b, { x: cx, y: cy + ins.side * 0.46 }, '두 밑면(원)', 'ink', { size: 15 });
        T(b, { x: cx, y: cy }, `${fmtN(rs)}`, AMB, { size: 16 });
        T(b, { x: cx + R * K * 0.72, y: cy + R * K * 0.72 }, `${fmtN(R)}`, SKY, { dx: 6, size: 16 });
        T(b, { x: cx, y: cy - ins.side * 0.46 }, `원뿔대의 높이 = ${fmtN(H)} − ${fmtN(hs)} = ${fmtN(H - hs)}`, GRN, { size: 15 });
      }
    },
    steps: (M) => [
      `밑면의 반지름 ${M.R} cm, 높이 ${M.H} cm인 큰 원뿔을 밑면에 평행하게 잘라요.`,
      `윗부분을 오른쪽으로 떼어 내면 <b>작은 원뿔</b>(높이 ${fmtN(M.hs)} cm, 밑면의 반지름 ${fmtN(M.rs)} cm)이 분리돼요.`,
      `남은 부분이 <b>원뿔대</b>예요. (원뿔대) = (큰 원뿔) − (작은 원뿔)`,
      `원뿔대의 높이 = ${M.H} − ${fmtN(M.hs)} = <b>${fmtN(M.hf)} cm</b>예요.`
    ],
    view: (M) => ({
      guide: '<b>떼어 내기</b> 막대를 움직이면 노란 작은 원뿔이 같은 높이에서 <b>오른쪽으로(가로로)</b> 밀려 나가요. 남은 하늘색 입체가 원뿔대예요. 높이와 자르는 위치도 바꿔 보세요.',
      readouts: [rd('큰 원뿔', `R ${M.R} · 높이 ${M.H}`, SKY), rd('작은 원뿔', `r ${fmtN(M.rs)} · 높이 ${fmtN(M.hs)}`, AMB), rd('원뿔대의 높이', cmv(M.hf), GRN, `${M.H} − ${fmtN(M.hs)}`)],
      status: { tone: 'info', text: '원뿔대 = 큰 원뿔 − 작은 원뿔' },
      formula: `<p>(원뿔대) = (큰 원뿔) − (작은 원뿔)</p><p>(원뿔대의 높이) = ${M.H} − ${fmtN(M.hs)} = ${fmtN(M.hf)}</p>`,
      rule: '원뿔대는 원뿔을 밑면에 평행한 평면으로 자르고 윗부분(작은 원뿔)을 떼어 낸 나머지이다',
      notes: notes('원뿔대의 <b>두 밑면</b>은 반지름이 다른 원이에요. 위쪽 원이 작은 원뿔의 밑면이에요.', '원뿔대의 높이는 두 원 사이의 거리예요. <b>큰 원뿔의 높이 − 작은 원뿔의 높이</b>로 구해요.')
    }),
    prob: (M) => {
      const H = M.pH, hs = M.ph, ans = H - hs;
      return {
        tag: '원뿔대의 높이', key: `${M.pR}-${H}-${M.pc}`,
        stem: `그림은 높이가 ${H} cm인 큰 원뿔에서 높이가 ${fmtN(hs)} cm인 작은 원뿔을 잘라 낸 것이다. 남은 원뿔대의 높이는 몇 cm인가?`,
        choices: mkNum(ans, [[H, '큰 원뿔의 높이예요. 작은 원뿔을 빼야 해요.'], [hs, '작은 원뿔의 높이예요.'], [H + hs, '더하지 않고 빼요.'], [ans + 1, '']], (v) => fmtN(v) + ' cm', { valid: (v) => v > 0, step: 0.5 })
      };
    }
  });
  function unionB(a, c) { return union(a, c); }

  G.register(20, 'rv2', '② 회전체의 단면', '회전체의 단면', PARAMS, S);
})();
