/* ==========================================================================
   중1 · 회전체 — 탭 ① 「회전체 만들기」 (t1.js, order 10) — 장면 7개
   · s1-1 직사각형→원기둥 · s1-2 직각삼각형→원뿔[함정: 축을 바꾸면] · s1-3 사다리꼴→원뿔대 · s1-4 반원→구
   · s1-5 축에서 떨어진 도형·빗변을 축으로 · s1-6 회전체→평면도형(역추론, 보기는 그림) · s1-7 회전체인가?
   평면도형은 제자리에서 회전축을 돌며 자취(하늘색 다발)를 남기고, 한 바퀴(360°)가 되면 회전체가 완성됩니다.
   도형의 길이는 그림 속에 크게 쓰이고, 막대·손잡이로 바꾸면 라벨·입체·식·보기·정답이 모두 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SO;
  if (!G || !G.S3) return;
  const S3 = G.S3;
  const { PI, DEG, clamp, fmtN, T, fit, P, rd, notes, mkNum, mkText, rint, pick, shuffle, esc, span, jo, piT, bboxOf } = G;

  const PARAMS = {
    soT: P('돌리는 각도', 0, 1, 0.005, 0.4, { color: 'amber', hint: '오른쪽으로 끌면 평면도형이 축을 따라 한 바퀴 돌아요', format: (v) => Math.round(v * 360) + '°' }),
    soR: P('반지름 r', 1, 6, 1, 3, { color: 'sky', hint: '그림의 노란 점을 끌어도 돼요', format: (v) => Math.round(v) + ' cm' }),
    soH1: P('높이 h', 2, 8, 1, 5, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soA: P('밑변 BC', 2, 6, 1, 3, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soB: P('높이 AB', 2, 6, 1, 4, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soRB: P('아랫변', 2, 7, 1, 4, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soRT: P('윗변', 1, 6, 1, 2, { color: 'amber', hint: '아랫변보다 짧아야 사다리꼴이에요', format: (v) => Math.round(v) + ' cm' }),
    soW: P('직사각형의 너비', 1, 4, 1, 2, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soD: P('축에서 떨어진 거리', 0, 4, 1, 2, { color: 'rose', hint: '그림의 노란 점을 가로로 끌어도 돼요', format: (v) => Math.round(v) + ' cm' }),
    soK: P('삼각형의 크기', 1, 2, 1, 1, { color: 'sky', format: (v) => (Math.round(v) === 1 ? '3-4-5 (1배)' : '6-8-10 (2배)') }),
    soVR: P('큰 반지름', 2, 6, 1, 3, { color: 'sky', format: (v) => Math.round(v) + ' cm' }),
    soVr: P('작은 반지름', 1, 5, 1, 2, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soV1: P('아래 부분의 높이', 2, 6, 1, 3, { color: 'amber', format: (v) => Math.round(v) + ' cm' }),
    soV2: P('위 부분의 높이', 1, 5, 1, 2, { color: 'rose', format: (v) => Math.round(v) + ' cm' }),
    soRot: P('세로 축 둘레로 돌려 보기', 0, 360, 5, 40, { color: 'amber', hint: '돌려도 모양이 그대로인지 보세요', format: (v) => Math.round(v) + '°' })
  };
  const AMB = 'amber', SKY = 'sky', ROSE = 'rose', GRN = 'green';
  const cmv = (v) => fmtN(v) + ' cm';

  /* ------------------------------------------------------------------ 공통 그리기 */
  // 반지름·높이 평면(θ=0) 위의 직각 표시
  function rm(D, c, da, db, sz, col = AMB) {
    const q = (a, b) => D.P({ x: c[0] + a, y: c[1] + b, z: 0 });
    D.g.path([q(da[0] * sz, da[1] * sz), q((da[0] + db[0]) * sz, (da[1] + db[1]) * sz), q(db[0] * sz, db[1] * sz)], { color: col, width: 2.2 });
  }
  // 평면도형을 돌려 입체를 만드는 장면의 그림(탐구·정리)
  function explore3D(b, s, M, C, o) {
    const D = S3.ctx(b, s), sol = M.sol;
    const sweep = 2 * PI * clamp(C.t, 0, 1), full = sweep >= 2 * PI - 1e-3;
    const ext = 0.55;
    const box = S3.boxOf(D, sol, [D.P({ x: 0, y: sol.ymin - ext, z: 0 }), D.P({ x: 0, y: sol.ymax + ext, z: 0 })]);
    fit(b, box, { t: 52, r: 78, l: 74, b: 44 });
    S3.drawRevolve(D, sol, full ? 2 * PI : sweep, {});
    S3.drawAxis(D, sol.ymin, sol.ymax, { ext, label: '회전축 l', dx: o.axisDx || 0 });
    if (C.review && C.step === 2) D.line({ x: 0, y: sol.ymin, z: 0 }, { x: 0, y: sol.ymax, z: 0 }, ROSE, 5);
    if (!full && sweep > 0.02) D.g.path(S3.figAt(D, sol.poly, sweep), { close: true, fill: AMB, fillAlpha: 0.16, color: AMB, width: 2.2, dash: [6, 5] });
    D.g.path(S3.figAt(D, sol.poly, 0), { close: true, fill: AMB, fillAlpha: 0.3, color: AMB, width: C.review && C.step === 1 ? 4.6 : 3.4 });
    if (C.txt && o.labels) o.labels(D, M, C);
    if (!C.thumb && C.tab === 'explore' && o.handles) o.handles(D, b, s, M);
    return D;
  }
  // 문제용 2차원 평면도형(축은 점선). horiz: 축을 가로로
  function prob2D(b, spec) {
    const g = S3.boardSink(b), horiz = !!spec.horiz;
    const f = (p) => (horiz ? { x: p[1], y: p[0] } : { x: p[0], y: p[1] });
    S3.planeFig(g, spec.poly, { horiz, axisText: '회전축 l', ext: spec.ext });
    const pts = spec.poly.map(f);
    const ys = spec.poly.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    pts.push(f([0, y0 - 0.55]), f([0, y1 + 0.55]));
    const bb = bboxOf(pts), cen = { x: (bb.x0 + bb.x1) / 2, y: (bb.y0 + bb.y1) / 2 };
    fit(b, bb, { l: 70, r: 70, t: 56, b: 56 });
    (spec.rights || []).forEach((r) => {
      const c = f(r.c), a = f([r.c[0] + r.da[0], r.c[1] + r.da[1]]), d = f([r.c[0] + r.db[0], r.c[1] + r.db[1]]);
      b.right(c, a, d, { size: 11, color: AMB });
    });
    (spec.labels || []).forEach((lb) => {
      const a = f(lb.a), c = f(lb.b), m = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
      let nx = m.x - cen.x, ny = m.y - cen.y;
      if (lb.out) { nx = lb.out[0]; ny = lb.out[1]; }
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const w = G.textW(lb.text, 16);
      const d = 12 + Math.abs(nx) * w / 2 + Math.abs(ny) * 9;
      T(b, m, lb.text, lb.color || AMB, { dx: nx * d, dy: -ny * d, size: 17 });
    });
    (spec.names || []).forEach((n) => { const p = f(n.p); T(b, p, n.text, 'ink', { dx: n.dx || 0, dy: n.dy || 0, size: 16 }); });
  }
  // 입체 위에 그리는 치수선(반지름·높이): 문제에서 주어진 값
  function solidDims(D, sol, o = {}) {
    const d = sol.d, hs = [], rs = [];
    const k = sol.kind;
    if (k === 'cyl') { rs.push([d.R, 0, 'r']); hs.push([d.R, 0, d.h1]); }
    else if (k === 'cone') { rs.push([d.R, 0, 'r']); hs.push([d.R, 0, d.h1]); }
    else if (k === 'frus') { rs.push([d.R, 0, 'R']); rs.push([d.r, d.h1, 'r']); hs.push([d.R, 0, d.h1]); }
    else if (k === 'pencil') { rs.push([d.R, 0, 'r']); hs.push([d.R, 0, d.h1]); hs.push([d.R, d.h1, d.h1 + d.h2]); }
    else if (k === 'dbl') { rs.push([d.R, d.h1, 'r']); hs.push([d.R, 0, d.h1]); hs.push([d.R, d.h1, d.h1 + d.h2]); }
    else if (k === 'stairs') { rs.push([d.R, 0, 'R']); rs.push([d.r, d.h1 + d.h2, 'r']); hs.push([d.R, 0, d.h1]); hs.push([d.r, d.h1, d.h1 + d.h2]); }
    const col = o.color || AMB;
    rs.forEach((r) => {
      const y = r[1];
      D.line({ x: 0, y, z: 0 }, { x: r[0], y, z: 0 }, col, 2.6, { dash: [5, 4] });
      D.lab({ x: r[0] / 2, y, z: 0 }, `${r[2]} = ${r[0] === d.R ? d.R : r[0]}`, col, { dy: 15, size: 15 });
    });
    hs.forEach((h) => {
      const x = h[0] + 0.4;
      D.line({ x, y: h[1], z: 0 }, { x, y: h[2], z: 0 }, col, 2.6);
      D.line({ x: x - 0.12, y: h[1], z: 0 }, { x: x + 0.12, y: h[1], z: 0 }, col, 2.6);
      D.line({ x: x - 0.12, y: h[2], z: 0 }, { x: x + 0.12, y: h[2], z: 0 }, col, 2.6);
      D.lab({ x, y: (h[1] + h[2]) / 2, z: 0 }, `${fmtN(h[2] - h[1])}`, col, { dx: 20, size: 15 });
    });
  }

  const S = [];
  const rev = (s) => 2 * PI * clamp(s.soT, 0, 1);
  const turnGuide = '막대를 오른쪽으로 끌거나 ▶를 눌러 보세요. 노란 평면도형이 <b>제자리에서</b> 분홍 회전축을 따라 돌면서 하늘색 자취를 남겨요.';

  /* ================================================================== s1-1 직사각형 → 원기둥 */
  S.push({
    id: 's1-1', title: '직사각형을 돌리면 원기둥', short: '직사각형→원기둥',
    question: '직사각형의 한 변을 회전축으로 한 바퀴 돌리면 어떤 입체가 될까? 가로·세로는 입체의 어디가 될까?',
    ctl: ['soR', 'soH1', 'soT'], anim: { key: 'soT', dur: 6, label: '돌려 보기', start: 0.4 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soR = 3; s.soH1 = 5; },
    reroll: (s) => { s.soAx = pick(['v', 'h'], s.soAx); s.soPw = pick([2, 3, 4, 5, 6], s.soPw); s.soPh = pick([3, 4, 5, 6, 7].filter((x) => x !== s.soPw), s.soPh); },
    model: (s) => {
      const R = clamp(Math.round(s.soR), 1, 6), h = clamp(Math.round(s.soH1), 2, 8);
      const ax = s.soAx || 'v', w = s.soPw || 3, ht = s.soPh || 5;
      return { R, h, sol: S3.solid('cyl', { R, h1: h }), ax, w, ht, r2: ax === 'v' ? w : ht, h2: ax === 'v' ? ht : w };
    },
    draw(b, s, M, C) {
      if (C.problem) {
        const poly = [[0, 0], [M.r2, 0], [M.r2, M.h2], [0, M.h2]];
        const horiz = M.ax === 'h';
        prob2D(b, { poly, horiz, rights: [{ c: [0, 0], da: [1, 0], db: [0, 1] }, { c: [M.r2, 0], da: [-1, 0], db: [0, 1] }, { c: [M.r2, M.h2], da: [-1, 0], db: [0, -1] }, { c: [0, M.h2], da: [1, 0], db: [0, -1] }].map((r) => ({ c: r.c, da: r.da.map((v) => v * 0.45), db: r.db.map((v) => v * 0.45) })), labels: [{ a: [0, 0], b: [M.r2, 0], text: `${M.r2} cm` }, { a: [M.r2, 0], b: [M.r2, M.h2], text: `${M.h2} cm` }] });
        return;
      }
      explore3D(b, s, M, C, {
        labels: (D, m) => {
          const sz = Math.min(0.35, m.R * 0.22, m.h * 0.22);
          [[0, 0, [1, 0], [0, 1]], [m.R, 0, [-1, 0], [0, 1]], [m.R, m.h, [-1, 0], [0, -1]], [0, m.h, [1, 0], [0, -1]]].forEach((c) => rm(D, [c[0], c[1]], c[2], c[3], sz));
          D.lab({ x: m.R / 2, y: 0, z: 0 }, `r = ${m.R} cm`, AMB, { dy: 19 });
          D.lab({ x: m.R, y: m.h / 2, z: 0 }, `h = ${m.h} cm`, AMB, { dx: 44 });
        },
        handles: (D, bd, st, m) => bd.handle('rh', D.P({ x: m.R, y: m.h, z: 0 }), { color: AMB, ariaLabel: '직사각형의 오른쪽 위 꼭짓점', drag: (w) => { const u = D.unproj(w.x, w.y); st.playing = false; st.soR = clamp(Math.round(u.rho), 1, 6); st.soH1 = clamp(Math.round(u.y), 2, 8); } })
      });
    },
    steps: (M) => [
      `평면도형을 찾아요. 가로 ${M.R} cm, 세로 ${M.h} cm인 <b>직사각형</b>이에요.`,
      '회전축을 찾아요. 직사각형의 <b>한 변</b>(세로 변)이 회전축 $l$ 위에 놓여 있어요.',
      '축을 중심으로 직사각형을 한 바퀴(360°) 돌리면 <b>원기둥</b>이 돼요.',
      `축에 수직인 변 ${M.R} cm가 밑면의 <b>반지름</b>, 축과 나란한 변 ${M.h} cm가 <b>높이</b>예요.`
    ],
    view: (M, C) => ({
      guide: turnGuide + ' 노란 점을 끌어 가로(반지름)·세로(높이)를 바꿔 보세요.',
      readouts: [rd('평면도형', `직사각형 ${M.R} × ${M.h}`, AMB), rd('회전축', '세로 변', ROSE), rd('회전체', M.sol.name, SKY), rd('밑면의 반지름', cmv(M.R), AMB, '축에 수직인 변'), rd('높이', cmv(M.h), AMB, '축과 나란한 변')],
      status: C.t >= 0.999 ? { tone: 'ok', text: '한 바퀴 → 원기둥 완성' } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: `<p>직사각형을 한 변을 축으로 1회전 → <b>원기둥</b></p><p>(밑면의 반지름) = 축에 수직인 변 = ${M.R} cm</p><p>(높이) = 축과 나란한 변 = ${M.h} cm</p>`,
      rule: '직사각형의 한 변을 축으로 1회전시키면 원기둥이 된다',
      notes: notes('축으로 삼은 변은 입체의 <b>안쪽 중심선</b>이에요. 이 변은 높이가 되고, 축에 수직인 변이 반지름이에요.', '같은 직사각형도 <b>어느 변을 축으로 삼느냐</b>에 따라 반지름과 높이가 서로 바뀌어요.')
    }),
    prob: (M) => {
      const r = M.r2, h = M.h2;
      return {
        tag: '회전체의 밑면의 반지름 (함정)', key: `${M.ax}${r}-${h}`, fig: false,
        stem: `그림과 같은 직사각형을 직선 $l$을 축으로 1회전시킬 때 생기는 회전체의 밑면의 반지름은 몇 cm인가?`.replace(/\$l\$/g, 'l'),
        choices: mkNum(r, [[h, '축과 나란한 변은 높이예요. 반지름은 축에 수직인 변이에요.'], [2 * r, '지름이에요. 반지름은 그 절반이에요.'], [r + h, '두 변의 합이 아니에요.'], [r * h, '넓이가 아니에요.']], (v) => v + ' cm', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: '축에 수직인 변이 밑면의 반지름이에요'
      };
    }
  });

  /* ================================================================== s1-2 직각삼각형 → 원뿔 (축 선택) */
  function triM(s) {
    const a = clamp(Math.round(s.soA), 2, 6), bb = clamp(Math.round(s.soB), 2, 6), ax = s.soAxis || 'AB';
    const h = ax === 'AB' ? bb : a, r = ax === 'AB' ? a : bb;
    return { a, b: bb, ax, h, r, sol: S3.solid('cone', { R: r, h1: h }) };
  }
  S.push({
    id: 's1-2', title: '[함정] 직각삼각형을 돌리면 원뿔', short: '[함정] 삼각형→원뿔',
    question: '직각삼각형의 직각을 낀 한 변을 축으로 돌리면 원뿔이 돼. 어느 변을 축으로 삼느냐에 따라 같은 원뿔일까?',
    ctl: ['soA', 'soB', 'soT'], anim: { key: 'soT', dur: 6, label: '돌려 보기', start: 0.4 },
    presets: (s) => [{ group: '회전축으로 삼을 변', label: `변 AB (${triM(s).b} cm)`, apply: (st) => { st.soAxis = 'AB'; }, on: (st) => (st.soAxis || 'AB') === 'AB' }, { label: `변 BC (${triM(s).a} cm)`, apply: (st) => { st.soAxis = 'BC'; }, on: (st) => st.soAxis === 'BC' }],
    stepT: (n) => (n >= 4 ? 1 : 0),
    init: (s) => { s.soA = 3; s.soB = 4; s.soAxis = 'AB'; },
    reroll: (s) => { s.soPa = pick([2, 3, 4, 5, 6], s.soPa); s.soPb = pick([2, 3, 4, 5, 6].filter((x) => x !== s.soPa), s.soPb); s.soPax = pick(['v', 'h'], s.soPax); },
    model: (s) => {
      const m = triM(s);
      const pa = s.soPa || 3, pb = s.soPb || 4, pax = s.soPax || 'v';
      return Object.assign(m, { pa, pb, pax });
    },
    draw(b, s, M, C) {
      if (C.problem) {
        // 직각삼각형: 직각 B, 축에 놓인 변 길이 pb(높이), 축에 수직인 변 pa(반지름)
        const poly = [[0, 0], [M.pa, 0], [0, M.pb]];
        prob2D(b, {
          poly, horiz: M.pax === 'h', rights: [{ c: [0, 0], da: [0.5, 0], db: [0, 0.5] }],
          labels: [{ a: [0, 0], b: [M.pa, 0], text: `${M.pa} cm` }, { a: [0, 0], b: [0, M.pb], text: `${M.pb} cm`, out: M.pax === 'h' ? [0, -1] : [-1, 0] }],
          names: []
        });
        return;
      }
      const top = M.ax === 'AB' ? 'A' : 'C', side = M.ax === 'AB' ? 'C' : 'A';
      explore3D(b, s, M, C, {
        labels: (D, m) => {
          rm(D, [0, 0], [1, 0], [0, 1], Math.min(0.35, m.r * 0.25, m.h * 0.25));
          D.lab({ x: 0, y: 0, z: 0 }, 'B', 'ink', { dx: -14, dy: 14 });
          D.lab({ x: 0, y: m.h, z: 0 }, top, 'ink', { dx: -14, dy: -4 });
          D.lab({ x: m.r, y: 0, z: 0 }, side, 'ink', { dx: 12, dy: 12 });
          D.lab({ x: 0, y: m.h / 2, z: 0 }, `${m.ax} = ${m.h} cm`, AMB, { dx: -50 });
          D.lab({ x: m.r / 2, y: 0, z: 0 }, `${m.ax === 'AB' ? 'BC' : 'AB'} = ${m.r} cm`, AMB, { dy: 19 });
        }
      });
    },
    steps: (M) => [
      `평면도형은 직각삼각형 ABC예요. 직각을 낀 두 변은 AB=${M.b} cm, BC=${M.a} cm예요.`,
      `변 ${M.ax}를 회전축으로 삼았어요. 축으로 삼은 변의 길이 ${M.h} cm가 원뿔의 <b>높이</b>가 돼요.`,
      `축에 수직인 변 ${M.ax === 'AB' ? 'BC' : 'AB'}(${M.r} cm)가 밑면의 <b>반지름</b>이 돼요.`,
      '축을 중심으로 한 바퀴(360°) 돌리면 <b>원뿔</b>이 돼요.'
    ],
    view: (M, C) => ({
      guide: turnGuide + ' 위의 칩으로 <b>축으로 삼는 변</b>을 바꿔 보세요. 같은 삼각형인데 다른 원뿔이 나와요.',
      readouts: [rd('회전축', `변 ${M.ax}`, ROSE), rd('높이 (축으로 삼은 변)', cmv(M.h), AMB), rd('밑면의 반지름', cmv(M.r), AMB, '축에 수직인 변'), rd('회전체', M.sol.name, SKY)],
      status: C.t >= 0.999 ? { tone: 'ok', text: `원뿔 완성 (반지름 ${M.r}, 높이 ${M.h})` } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: `<p>변 ${M.ax}를 축으로 1회전 → 원뿔</p><p>(높이) = ${M.h} cm · (밑면의 반지름) = ${M.r} cm</p><p>다른 변을 축으로 하면 → (높이) = ${M.r} cm · (반지름) = ${M.h} cm</p>`,
      rule: '직각삼각형의 직각을 낀 한 변을 축으로 1회전시키면 원뿔이 된다',
      notes: notes('같은 직각삼각형이라도 <b>축으로 삼은 변이 높이</b>, 나머지 변이 반지름이에요.', '축을 바꾸면 반지름과 높이가 서로 바뀐 <b>다른 원뿔</b>이 돼요(두 변의 길이가 같지 않으면).')
    }),
    prob: (M) => {
      const r = M.pa, h = M.pb;
      return {
        tag: '회전체의 밑면의 넓이 (함정)', key: `${M.pax}${r}-${h}`,
        stem: '그림과 같은 직각삼각형을 직선 l을 축으로 1회전시킬 때 생기는 회전체의 밑면의 넓이는?',
        choices: mkNum(r * r, [[h * h, '축에 놓인 변 ' + h + ' cm는 높이예요. 반지름은 축에 수직인 변이에요.'], [r * h, '반지름과 높이의 곱이에요. 밑면의 넓이는 π×(반지름)²이에요.'], [2 * r, '밑면의 둘레(2πr)의 계수예요.'], [r * r * 2, '']], (v) => piT(v) + ' cm²', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: '축에 수직인 변이 밑면의 반지름이에요'
      };
    }
  });

  /* ================================================================== s1-3 사다리꼴 → 원뿔대 */
  function trapM(s) {
    const R = clamp(Math.round(s.soRB), 2, 7), r = clamp(Math.min(Math.round(s.soRT), R - 1), 1, 6), h = clamp(Math.round(s.soH1), 2, 8);
    return { R, r, h, sol: S3.solid('frus', { R, r, h1: h }) };
  }
  S.push({
    id: 's1-3', title: '사다리꼴을 돌리면 원뿔대', short: '사다리꼴→원뿔대',
    question: '직각 두 개가 있는 사다리꼴의 높이가 되는 변을 축으로 돌리면 어떤 입체가 될까?',
    ctl: ['soRB', 'soRT', 'soH1', 'soT'], anim: { key: 'soT', dur: 6, label: '돌려 보기', start: 0.4 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soRB = 4; s.soRT = 2; s.soH1 = 3; },
    reroll: (s) => { s.soPB = pick([3, 4, 5, 6, 7], s.soPB); s.soPT = rint(1, s.soPB - 1); s.soPH = pick([2, 3, 4, 5], s.soPH); s.soPax = pick(['v', 'h'], s.soPax); },
    model: (s) => Object.assign(trapM(s), { pb: s.soPB || 5, pt: s.soPT || 2, ph: s.soPH || 3, pax: s.soPax || 'v' }),
    draw(b, s, M, C) {
      if (C.problem) {
        prob2D(b, {
          poly: [[0, 0], [M.pb, 0], [M.pt, M.ph], [0, M.ph]], horiz: M.pax === 'h',
          rights: [{ c: [0, 0], da: [0.45, 0], db: [0, 0.45] }, { c: [0, M.ph], da: [0.45, 0], db: [0, -0.45] }],
          labels: [{ a: [0, 0], b: [M.pb, 0], text: `${M.pb} cm` }, { a: [0, M.ph], b: [M.pt, M.ph], text: `${M.pt} cm` }, { a: [0, 0], b: [0, M.ph], text: `${M.ph} cm`, out: M.pax === 'h' ? [0, -1] : [-1, 0] }]
        });
        return;
      }
      explore3D(b, s, M, C, {
        axisDx: -46,
        labels: (D, m) => {
          const sz = Math.min(0.35, m.r * 0.25, m.h * 0.25);
          rm(D, [0, 0], [1, 0], [0, 1], sz); rm(D, [0, m.h], [1, 0], [0, -1], sz);
          D.lab({ x: m.R / 2, y: 0, z: 0 }, `아랫변 ${m.R} cm`, AMB, { dy: 19 });
          D.lab({ x: m.r / 2, y: m.h, z: 0 }, `윗변 ${m.r} cm`, AMB, { dy: -17 });
          D.lab({ x: 0, y: m.h / 2, z: 0 }, `높이 ${m.h} cm`, AMB, { dx: -48 });
        },
        handles: (D, bd, st, m) => bd.handle('rt', D.P({ x: m.r, y: m.h, z: 0 }), { color: AMB, ariaLabel: '윗변의 오른쪽 끝', drag: (w) => { const u = D.unproj(w.x, w.y); st.playing = false; st.soRT = clamp(Math.round(u.rho), 1, Math.max(1, Math.round(st.soRB) - 1)); st.soH1 = clamp(Math.round(u.y), 2, 8); } })
      });
    },
    steps: (M) => [
      `평면도형은 사다리꼴이에요. 윗변 ${M.r} cm, 아랫변 ${M.R} cm, 높이 ${M.h} cm이고 <b>높이가 되는 변</b>(직각을 낀 변)이 회전축 위에 있어요.`,
      '축에 놓인 변이 높이가 되도록 한 바퀴(360°) 돌려요.',
      '<b>원뿔대</b>가 돼요. 윗변은 윗면(작은 원)의 반지름, 아랫변은 아랫면(큰 원)의 반지름이에요.',
      `윗면의 반지름 ${M.r} cm, 아랫면의 반지름 ${M.R} cm, 높이 ${M.h} cm예요.`
    ],
    view: (M, C) => ({
      guide: turnGuide + ' 노란 점을 끌면 윗변과 높이가 바뀌어요.',
      readouts: [rd('윗면의 반지름', cmv(M.r), AMB, '사다리꼴의 윗변'), rd('아랫면의 반지름', cmv(M.R), AMB, '사다리꼴의 아랫변'), rd('높이', cmv(M.h), AMB, '축에 놓인 변'), rd('회전체', M.sol.name, SKY)],
      status: C.t >= 0.999 ? { tone: 'ok', text: '한 바퀴 → 원뿔대 완성' } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: `<p>사다리꼴의 높이가 되는 변을 축으로 1회전 → <b>원뿔대</b></p><p>윗면의 반지름 = 윗변 = ${M.r} cm, 아랫면의 반지름 = 아랫변 = ${M.R} cm</p>`,
      rule: '직각이 있는 사다리꼴을 높이가 되는 변을 축으로 1회전시키면 원뿔대가 된다',
      notes: notes('두 밑면은 서로 <b>평행하고 크기가 달라요</b>(반지름이 다른 원).', '비스듬한 변(옆변)은 돌면서 원뿔대의 <b>옆면(모선)</b>을 만들어요.')
    }),
    prob: (M) => {
      const R = M.pb, r = M.pt;
      return {
        tag: '회전체의 큰 밑면의 넓이', key: `${M.pax}${R}-${r}-${M.ph}`,
        stem: '그림과 같은 사다리꼴을 직선 l을 축으로 1회전시킬 때 생기는 회전체에서 넓이가 더 큰 밑면의 넓이는?',
        choices: mkNum(R * R, [[r * r, '작은 밑면의 넓이예요.'], [(R + r) * (R + r), '두 변의 합을 반지름으로 쓰지 않아요.'], [R * M.ph, ''], [2 * R, '밑면의 둘레의 계수예요.']], (v) => piT(v) + ' cm²', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: '밑면의 반지름은 축에 수직인 변이에요'
      };
    }
  });

  /* ================================================================== s1-4 반원 → 구 */
  S.push({
    id: 's1-4', title: '반원을 돌리면 구', short: '반원→구',
    question: '반원의 지름을 회전축으로 한 바퀴 돌리면 어떤 입체가 될까? 원을 돌려도 같은 입체일까?',
    ctl: ['soR', 'soT'], anim: { key: 'soT', dur: 6, label: '돌려 보기', start: 0.4 },
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soR = 3; },
    reroll: (s) => { s.soPR = pick([2, 3, 4, 5, 6, 7], s.soPR); s.soPax = pick(['v', 'h'], s.soPax); },
    model: (s) => { const R = clamp(Math.round(s.soR), 1, 6); return { R, sol: S3.solid('sphere', { R }), pR: s.soPR || 4, pax: s.soPax || 'v' }; },
    draw(b, s, M, C) {
      if (C.problem) {
        const R = M.pR, poly = [];
        for (let i = 0; i <= 28; i++) { const a = -PI / 2 + PI * i / 28; poly.push([R * Math.cos(a), R * Math.sin(a)]); }
        const horiz = M.pax === 'h', f = (p) => (horiz ? { x: p[1], y: p[0] } : { x: p[0], y: p[1] });
        prob2D(b, { poly, horiz, ext: 0.5, labels: [] });
        const a = f([0, -R]), c = f([0, R]);
        b.seg(a, c, { color: AMB, width: 2.6 });
        T(b, { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }, `지름 ${2 * R} cm`, AMB, { dx: horiz ? 0 : 56, dy: horiz ? 20 : 0, size: 17 });
        b.point(f([0, 0]), { color: 'ink', r: 4 });
        return;
      }
      explore3D(b, s, M, C, {
        labels: (D, m) => {
          const a = 35 * DEG;
          D.line({ x: 0, y: 0, z: 0 }, { x: m.R * Math.cos(a), y: m.R * Math.sin(a), z: 0 }, AMB, 3);
          D.g.path([D.P({ x: 0, y: -m.R, z: 0 }), D.P({ x: 0, y: m.R, z: 0 })], { color: AMB, width: 3.2 });
          D.lab({ x: m.R * Math.cos(a) * 0.55, y: m.R * Math.sin(a) * 0.55, z: 0 }, `r = ${m.R} cm`, AMB, { dx: 28, dy: -10 });
          D.lab({ x: 0, y: -m.R / 2, z: 0 }, `지름 ${2 * m.R} cm`, AMB, { dx: -52 });
          D.g.path([D.P({ x: 0, y: 0, z: 0 })], {});
          D.lab({ x: 0, y: 0, z: 0 }, 'O', 'ink', { dx: -11, dy: 12, size: 15 });
        }
      });
    },
    steps: (M) => [
      `평면도형은 <b>반원</b>이에요. 반지름 ${M.R} cm, 지름 ${2 * M.R} cm예요.`,
      '반원의 <b>지름</b>(곧은 변)이 회전축 위에 놓여 있어요.',
      '지름을 축으로 한 바퀴(360°) 돌리면 <b>구</b>가 돼요.',
      `구의 반지름은 반원의 반지름 ${M.R} cm와 같아요. (원 전체를 지름을 축으로 돌려도 같은 구가 돼요.)`
    ],
    view: (M, C) => ({
      guide: turnGuide + ' 반지름 막대를 바꿔 보세요.',
      readouts: [rd('반원의 지름', cmv(2 * M.R), AMB, '회전축 위'), rd('반원의 반지름', cmv(M.R), AMB), rd('회전체', '구', SKY), rd('구의 반지름', cmv(M.R), GRN, '반원의 반지름과 같음')],
      status: C.t >= 0.999 ? { tone: 'ok', text: `구 완성 (반지름 ${M.R} cm)` } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: `<p>반원을 지름을 축으로 1회전 → <b>구</b></p><p>(구의 반지름) = (반원의 반지름) = ${M.R} cm</p>`,
      rule: '반원을 지름을 회전축으로 1회전시키면 구가 된다',
      notes: notes('구는 반지름만 있으면 정해져요. <b>밑면과 높이가 없어요</b>.', '회전축은 반드시 <b>지름</b>이어야 해요. 호가 아니라 곧은 변(지름)이 축이에요.')
    }),
    prob: (M) => {
      const d = 2 * M.pR;
      return {
        tag: '구의 반지름', key: `${M.pax}${M.pR}`,
        stem: '그림과 같이 지름이 ' + d + ' cm인 반원을 지름 l을 축으로 1회전시킬 때 생기는 구의 반지름은 몇 cm인가?',
        choices: mkNum(M.pR, [[d, '반원의 지름이에요. 구의 반지름은 그 절반이에요.'], [2 * d, ''], [M.pR + 1, ''], [M.pR * M.pR, '']], (v) => v + ' cm', { valid: (v) => v > 0 && Number.isInteger(v) }),
        note: '구의 반지름 = 반원의 반지름 = 지름의 절반'
      };
    }
  });

  /* ================================================================== s1-5 축에서 떨어진 도형 · 빗변을 축으로 */
  function offM(s) {
    const kind = s.soK5 || 'rect';
    if (kind === 'rect') {
      const w = clamp(Math.round(s.soW), 1, 4), d = clamp(Math.round(s.soD), 0, 4), h = clamp(Math.round(s.soH1), 2, 6);
      const sol = d === 0 ? S3.solid('cyl', { R: w, h1: h }) : S3.solid('hollow', { w, g: d, h1: h });
      return { kind, w, d, h, sol, name: d === 0 ? '원기둥' : '속이 빈 원기둥' };
    }
    const k = clamp(Math.round(s.soK), 1, 2), r = 2.4 * k, h1 = 1.8 * k, h2 = 3.2 * k;
    return { kind, k, r, h1, h2, sol: S3.solid('dbl', { R: r, h1, h2 }), name: '두 원뿔을 밑면끼리 붙인 입체' };
  }
  S.push({
    id: 's1-5', title: '[함정] 축의 위치가 달라지면', short: '[함정] 축의 위치',
    question: '같은 평면도형도 회전축이 도형에서 떨어져 있거나 빗변이 축이면 어떤 입체가 될까?',
    ctl: (s) => (s.soK5 === 'tri' ? ['soK', 'soT'] : ['soW', 'soH1', 'soD', 'soT']), anim: { key: 'soT', dur: 6, label: '돌려 보기', start: 0.45 },
    presets: () => [{ group: '평면도형', label: '직사각형 (축에서 떼기)', apply: (st) => { st.soK5 = 'rect'; st.soT = 0.45; }, on: (st) => (st.soK5 || 'rect') === 'rect' }, { label: '직각삼각형 (빗변이 축)', apply: (st) => { st.soK5 = 'tri'; st.soT = 0.45; }, on: (st) => st.soK5 === 'tri' }],
    stepT: (n) => (n >= 3 ? 1 : 0),
    init: (s) => { s.soK5 = 'rect'; s.soW = 2; s.soH1 = 4; s.soD = 2; s.soK = 1; },
    reroll: (s) => { s.soC5 = pick(['rect0', 'rect1', 'tri', 'leg'], s.soC5); s.soP5w = pick([2, 3], s.soP5w); },
    model: (s) => Object.assign(offM(s), { c5: s.soC5 || 'rect1', pw: s.soP5w || 2 }),
    draw(b, s, M, C) {
      if (C.problem) {
        const w = M.pw;
        let poly, labels, rights = [], horiz = false;
        if (M.c5 === 'rect0') { poly = [[0, 0], [w, 0], [w, 4], [0, 4]]; labels = [{ a: [0, 0], b: [w, 0], text: `${w} cm` }, { a: [w, 0], b: [w, 4], text: '4 cm' }]; }
        else if (M.c5 === 'rect1') { poly = [[2, 0], [2 + w, 0], [2 + w, 4], [2, 4]]; labels = [{ a: [2, 0], b: [2 + w, 0], text: `${w} cm` }, { a: [2, 0], b: [2, 4], text: '4 cm' }, { a: [0, 4.5], b: [2, 4.5], text: '2 cm', out: [0, 1] }]; }
        else if (M.c5 === 'tri') { poly = [[0, 0], [2.4, 1.8], [0, 5]]; labels = [{ a: [0, 0], b: [2.4, 1.8], text: '3 cm', out: [1, -0.6] }, { a: [2.4, 1.8], b: [0, 5], text: '4 cm', out: [1, 0.6] }, { a: [0, 0], b: [0, 5], text: '5 cm', out: [-1, 0] }]; }
        else { poly = [[0, 0], [3, 0], [0, 4]]; labels = [{ a: [0, 0], b: [3, 0], text: '3 cm' }, { a: [0, 0], b: [0, 4], text: '4 cm', out: [-1, 0] }]; rights = [{ c: [0, 0], da: [0.5, 0], db: [0, 0.5] }]; }
        prob2D(b, { poly, horiz, labels, rights });
        return;
      }
      const tri = M.kind === 'tri';
      explore3D(b, s, M, C, {
        labels: (D, m) => {
          if (!tri) {
            const sz = Math.min(0.3, m.w * 0.25, m.h * 0.25);
            if (m.d > 0) {
              D.g.path([D.P({ x: 0, y: -0.38, z: 0 }), D.P({ x: m.d, y: -0.38, z: 0 })], { color: ROSE, width: 3 });
              D.lab({ x: m.d / 2, y: -0.38, z: 0 }, `d = ${m.d}`, ROSE, { dy: 17 });
            }
            [[m.d, 0, [1, 0], [0, 1]], [m.d + m.w, 0, [-1, 0], [0, 1]], [m.d + m.w, m.h, [-1, 0], [0, -1]], [m.d, m.h, [1, 0], [0, -1]]].forEach((c) => rm(D, [c[0], c[1]], c[2], c[3], sz));
            D.lab({ x: m.d + m.w / 2, y: m.h, z: 0 }, `${m.w}`, AMB, { dy: -16 });
            D.lab({ x: m.d + m.w, y: m.h / 2, z: 0 }, `${m.h}`, AMB, { dx: 22 });
          } else {
            const k = m.k;
            D.line({ x: 0, y: m.h1, z: 0 }, { x: m.r, y: m.h1, z: 0 }, AMB, 2.2, { dash: [5, 4] });
            rm(D, [m.r, m.h1], [-1, 0], [0, -1], 0.3 * k);
            D.lab({ x: m.r * 0.55, y: m.h1 * 0.5, z: 0 }, `${3 * k}`, AMB, { dx: 18, dy: 6 });
            D.lab({ x: m.r * 0.55, y: m.h1 + (m.h2 * 0.5), z: 0 }, `${4 * k}`, AMB, { dx: 22, dy: -4 });
            D.lab({ x: 0, y: 2.5 * k, z: 0 }, `빗변 ${5 * k}`, AMB, { dx: -50 });
            D.lab({ x: m.r / 2, y: m.h1, z: 0 }, `${fmtN(m.r)}`, GRN, { dy: 16, size: 15 });
          }
        },
        handles: (D, bd, st, m) => { if (m.kind === 'rect') bd.handle('d', D.P({ x: m.d, y: m.h, z: 0 }), { color: AMB, ariaLabel: '도형을 가로로 옮기기', drag: (w) => { const u = D.unproj(w.x, w.y); st.playing = false; st.soD = clamp(Math.round(u.rho), 0, 4); } }); }
      });
    },
    steps: (M) => (M.kind === 'tri' ? [
      `직각삼각형(변 ${3 * M.k}, ${4 * M.k}, ${5 * M.k} cm)이에요. 이번에는 <b>빗변</b>이 회전축 위에 있어요.`,
      '삼각형이 축의 양쪽 끝까지 닿아요. 꼭짓점 B가 축에서 가장 멀리 떨어져 그리는 원이 두 입체의 공통 밑면이에요.',
      '빗변을 축으로 한 바퀴 돌리면 원뿔 두 개를 <b>밑면끼리 붙인</b> 입체(팽이 모양)가 돼요.',
      `공통 밑면의 반지름은 B에서 빗변까지의 거리 ${fmtN(M.r)} cm예요.`
    ] : [
      `직사각형(가로 ${M.w} cm, 세로 ${M.h} cm)이에요. 축에서 <b>${M.d} cm</b> 떨어져 있어요.`,
      M.d === 0 ? '직사각형의 한 변이 축에 붙어 있어요.' : '직사각형이 축에 닿지 않고 떨어져 있어요. 축 쪽에는 아무것도 그려지지 않아요.',
      M.d === 0 ? '속이 꽉 찬 <b>원기둥</b>이 돼요.' : `한 바퀴 돌리면 가운데가 비어 있는 <b>속이 빈 원기둥</b>이 돼요. 구멍의 반지름은 ${M.d} cm예요.`,
      `정리: 도형이 축에 <b>붙어 있으면</b> 속이 찬 입체, <b>떨어져 있으면</b> 속이 빈 입체가 돼요.`
    ]),
    view: (M, C) => ({
      guide: (M.kind === 'tri' ? '직각삼각형의 <b>빗변</b>을 축으로 돌려 보세요. 두 개의 원뿔이 붙은 모양이 만들어져요.' : '노란 점을 <b>가로로</b> 끌어(또는 막대로) 도형을 축에서 떼어 보세요. 거리가 0이면 속이 찬 원기둥, 떨어지면 속이 빈 입체예요.') + ' ' + '돌리는 각도 막대로 자취도 확인해 보세요.',
      readouts: M.kind === 'tri' ? [rd('회전축', '빗변', ROSE), rd('공통 밑면의 반지름', cmv(M.r), AMB, '꼭짓점 B에서 축까지'), rd('회전체', M.name, SKY, '원뿔 두 개', null, true)] : [rd('축에서 떨어진 거리 d', cmv(M.d), ROSE), rd('도형의 너비', cmv(M.w), AMB), rd('회전체', M.name, SKY, M.d === 0 ? '속이 찬 입체' : `구멍의 반지름 ${M.d} cm`)],
      status: C.t >= 0.999 ? { tone: 'ok', text: M.name } : { tone: 'info', text: `${Math.round(C.t * 360)}° 돌린 자취` },
      formula: M.kind === 'tri' ? '<p>직각삼각형을 빗변을 축으로 1회전 → 원뿔 두 개를 붙인 입체</p>' : `<p>직사각형이 축에서 ${M.d} cm 떨어져 있으면 ${M.d === 0 ? '→ 원기둥' : '→ 속이 빈 원기둥'}</p>`,
      rule: '평면도형이 회전축에 붙어 있어야 속이 찬 회전체가 되고, 떨어져 있으면 속이 빈 회전체가 된다',
      notes: notes('축이 도형과 <b>떨어져 있는지·붙어 있는지</b> 먼저 확인해요.', '삼각형은 <b>어느 변이 축인지</b>에 따라 원뿔, 두 원뿔을 붙인 입체 등으로 달라져요.')
    }),
    prob: (M) => {
      const names = ['원기둥', '속이 빈 원기둥', '원뿔', '두 원뿔을 밑면끼리 붙인 입체', '원뿔대'];
      const ans = { rect0: 0, rect1: 1, tri: 3, leg: 2 }[M.c5];
      return {
        tag: '회전축에 따른 회전체', key: M.c5 + M.pw, wide: true,
        stem: '그림과 같은 평면도형을 직선 l을 축으로 1회전시킬 때 생기는 회전체는?',
        choices: mkText(names.map((n, i) => ({ h: n, ok: i === ans, hint: i === 1 ? '축에서 떨어진 도형만 속이 빈 입체가 돼요.' : i === 3 ? '빗변이 축일 때만 원뿔 두 개가 붙어요.' : i === 4 ? '원뿔대는 사다리꼴을 돌린 입체예요.' : '축과 도형의 위치를 다시 살펴보세요.' })))
      };
    }
  });

  /* ================================================================== s1-6 회전체 → 평면도형 (역추론) */
  const KINDS6 = ['frus', 'pencil', 'dbl', 'stairs'];
  const dims6 = (s) => { const R = clamp(Math.round(s.soVR), 2, 6); return { R, r: clamp(Math.min(Math.round(s.soVr), R - 1), 1, 5), h1: clamp(Math.round(s.soV1), 2, 6), h2: clamp(Math.round(s.soV2), 1, 5) }; };
  S.push({
    id: 's1-6', title: '[핵심] 회전체를 보고 평면도형 찾기', short: '[핵심] 입체→평면도형',
    question: '회전체를 축을 따라 반으로 자른 한쪽 단면이 회전하기 전의 평면도형이야. 그림의 회전체는 어떤 평면도형을 돌린 것일까?',
    ctl: (s) => ({ frus: ['soVR', 'soVr', 'soV1'], pencil: ['soVR', 'soV1', 'soV2'], dbl: ['soVR', 'soV1', 'soV2'], stairs: ['soVR', 'soVr', 'soV1', 'soV2'] }[s.soK6 || 'frus']).concat(['soT']),
    anim: { key: 'soT', dur: 5, label: '거꾸로 풀어 보기', start: 1 },
    presets: () => [{ group: '회전체', label: '원뿔대', apply: (st) => { st.soK6 = 'frus'; }, on: (st) => (st.soK6 || 'frus') === 'frus' }, { label: '원기둥+원뿔', apply: (st) => { st.soK6 = 'pencil'; }, on: (st) => st.soK6 === 'pencil' }, { label: '두 원뿔', apply: (st) => { st.soK6 = 'dbl'; }, on: (st) => st.soK6 === 'dbl' }, { label: '두 원기둥', apply: (st) => { st.soK6 = 'stairs'; }, on: (st) => st.soK6 === 'stairs' }],
    stepT: (n) => (n >= 1 ? 1 : 1),
    init: (s) => { s.soK6 = 'frus'; s.soVR = 3; s.soVr = 2; s.soV1 = 3; s.soV2 = 2; s.soT = 1; },
    reroll: (s) => { s.soK6 = pick(KINDS6, s.soK6); s.soVR = rint(3, 5); s.soVr = rint(1, s.soVR - 1); s.soV1 = rint(2, 4); s.soV2 = rint(2, 3); },
    model: (s) => { const kind = s.soK6 || 'frus', d = dims6(s); return { kind, d, sol: S3.solid(kind, d) }; },
    draw(b, s, M, C) {
      const sol = M.sol, D = S3.ctx(b, s);
      const sweep = C.problem ? 2 * PI : 2 * PI * clamp(C.t, 0, 1), full = sweep >= 2 * PI - 1e-3;
      const ext = 0.55;
      const box = S3.boxOf(D, sol, [D.P({ x: 0, y: sol.ymin - ext, z: 0 }), D.P({ x: 0, y: sol.ymax + ext, z: 0 }), D.P({ x: sol.rmax + 1.0, y: 0, z: 0 })]);
      fit(b, box, { t: 52, r: 66, l: 60, b: 44 });
      S3.drawRevolve(D, sol, full ? 2 * PI : sweep, {});
      S3.drawAxis(D, sol.ymin, sol.ymax, { ext, label: '회전축 l' });
      if (!C.problem) {
        if (!full && sweep > 0.02) D.g.path(S3.figAt(D, sol.poly, sweep), { close: true, fill: AMB, fillAlpha: 0.16, color: AMB, width: 2.2, dash: [6, 5] });
        D.g.path(S3.figAt(D, sol.poly, 0), { close: true, fill: AMB, fillAlpha: 0.3, color: AMB, width: 3.4 });
      }
      if (C.txt) solidDims(D, sol, {});
    },
    steps: (M) => [
      '회전체를 <b>회전축을 지나는 평면</b>으로 반으로 잘라요.',
      '축의 <b>한쪽</b> 단면만 남겨요. 반대쪽까지 그리지 않아요.',
      `그 단면이 회전하기 전의 평면도형이에요. 여기서는 ${M.kind === 'frus' ? '직각이 두 개인 사다리꼴' : M.kind === 'pencil' ? '직사각형과 직각삼각형을 붙인 도형' : M.kind === 'dbl' ? '직각삼각형 하나(축에 꼭짓점 두 개가 닿는 삼각형)' : '직사각형 두 개를 붙인 도형'}이에요.`,
      '축은 도형의 <b>한쪽 가장자리</b>에 놓여요. 축 양쪽에 대칭으로 그려진 그림은 답이 아니에요.'
    ],
    view: (M, C) => ({
      guide: '분홍 점선이 회전축 $l$이에요. <b>돌리는 각도</b>를 줄이면 완성된 입체가 노란 평면도형으로 돌아가요. 입체를 반으로 잘랐을 때 <b>한쪽 단면</b>이 처음 도형이에요.',
      readouts: [rd('회전체', M.sol.name, SKY, null, null, true), rd('평면도형', '축의 한쪽 단면', AMB, '축은 도형의 가장자리'), rd('입체의 높이', cmv(M.sol.ymax - M.sol.ymin), AMB)],
      status: { tone: 'info', text: M.sol.name },
      formula: '<p>회전체의 평면도형 = 회전축을 지나는 평면으로 자른 <b>한쪽</b> 단면</p><p>축을 가운데 두고 양쪽에 그린 그림은 한 쪽만 돌려도 되는 도형을 <b>두 번</b> 그린 것이에요.</p>',
      rule: '회전체를 회전축을 포함하는 평면으로 자른 한쪽 단면이 회전하기 전의 평면도형이다',
      notes: notes('축의 <b>한쪽만</b> 그려요. 양쪽이 대칭으로 그려진 도형은 틀려요.', '입체에 보이는 <b>꺾이는 곳(고리)</b>이 평면도형의 꼭짓점이에요.')
    }),
    prob: (M) => {
      const d = M.d, correct = S3.solid(M.kind, d).poly;
      const others = shuffle(KINDS6.filter((k) => k !== M.kind)).slice(0, 3);
      const items = [{ svg: S3.planeSvg(correct, { w: 150, h: 130 }), ok: true, hint: '' }, { svg: S3.planeSvg(correct, { mirror: true, w: 150, h: 130 }), ok: false, hint: '축 양쪽에 대칭으로 그린 도형은 아니에요. 한쪽 단면만 돌려요.' }];
      others.forEach((k) => items.push({ svg: S3.planeSvg(S3.solid(k, d).poly, { w: 150, h: 130 }), ok: false, hint: '이 도형을 돌리면 다른 모양의 입체가 돼요. 꺾이는 곳을 비교해 보세요.' }));
      const list = shuffle(items);
      return { tag: '회전체의 평면도형 (핵심)', key: M.kind + JSON.stringify(d), fig: true, stem: '그림의 회전체는 어떤 평면도형을 직선 l을 축으로 1회전시킨 것인가?', choices: list.map((x) => ({ h: x.svg, p: '평면도형 그림', ok: x.ok, hint: x.hint })) };
    }
  });

  /* ================================================================== s1-7 회전체인가? */
  const K7 = { cyl: { n: '원기둥', rev: true }, cone: { n: '원뿔', rev: true }, sphere: { n: '구', rev: true }, frus: { n: '원뿔대', rev: true }, cuboid: { n: '직육면체', rev: false }, pyr: { n: '사각뿔', rev: false }, tri: { n: '삼각기둥', rev: false } };
  const K7D = { cyl: { R: 1.5, h1: 3 }, cone: { R: 1.6, h1: 3 }, sphere: { R: 1.6 }, frus: { R: 1.8, r: 0.9, h1: 3 } };
  function top7(kind, rot, ox, oy, k) {
    const out = [];
    const polyr = (n, R, a0) => { for (let i = 0; i < n; i++) { const a = a0 + rot + 2 * PI * i / n; out.push({ x: ox + k * R * Math.cos(a), y: oy + k * R * Math.sin(a) }); } };
    if (kind === 'cuboid') polyr(4, 1.5 * Math.SQRT2, PI / 4); else if (kind === 'pyr') polyr(4, 1.6 * Math.SQRT2, PI / 4); else if (kind === 'tri') polyr(3, 1.9, PI / 2);
    return out;
  }
  S.push({
    id: 's1-7', title: '회전체인가?', short: '회전체인가?',
    question: '다음 입체 중 회전체는 무엇일까? 세로 축을 중심으로 돌렸을 때 모양이 그대로인지 보면 어떨까?',
    ctl: ['soRot'],
    presets: (s) => Object.keys(K7).map((k, i) => ({ group: i === 0 ? '입체 고르기' : '', label: K7[k].n, apply: (st) => { st.soK7 = k; }, on: (st) => (st.soK7 || 'cyl') === k })),
    init: (s) => { s.soK7 = 'cyl'; s.soRot = 40; s.soP7 = null; },
    reroll: (s) => {
      const rv = shuffle(['cyl', 'cone', 'sphere', 'frus']).slice(0, 4), non = pick(['cuboid', 'pyr', 'tri'], null);
      s.soP7 = shuffle(rv.concat([non]));
    },
    model: (s) => { const k = s.soK7 || 'cyl'; return { k, rev: K7[k].rev, name: K7[k].n, rot: clamp(s.soRot == null ? 40 : s.soRot, 0, 360) * DEG, list: s.soP7 || ['cyl', 'pyr', 'cone', 'sphere', 'frus'] }; },
    draw(b, s, M, C) {
      if (C.problem) {
        const narrow = b.W < b.H * 1.1, cells = M.list.map((k, i) => ({ k, i }));
        const colN = narrow ? 3 : 5, cw = 4.2, chh = 4.4;
        const pts = [];
        cells.forEach(({ k, i }) => {
          const col = i % colN, row = Math.floor(i / colN), cx = (col - (colN - 1) / 2) * cw + (narrow && row === 1 ? cw / 2 : 0), cy = -row * chh;
          const D = S3.ctx(b, { soYaw: -25, soPitch: 20 }, { k: 1, ox: cx, oy: cy - 1.2 });
          if (K7[k].rev) S3.drawSolid(D, S3.solid(k, K7D[k]), {}); else S3.drawPolyhedron(D, S3.polyhedron(k), 0, {});
          pts.push({ x: cx - 1.9, y: cy - 1.4 }, { x: cx + 1.9, y: cy + 3.2 });
          if (C.txt) T(b, { x: cx, y: cy - 1.2 }, G.NUM[i], 'amber', { dy: 26, size: 19 });
        });
        fit(b, bboxOf(pts), { l: 20, r: 20, t: 30, b: 50 });
        return;
      }
      const D = S3.ctx(b, { soYaw: -25, soPitch: 20 });
      const rev = M.rev, kind = M.k;
      const narrow = b.W < b.H * 1.1;
      const body = [{ x: -2.2, y: -0.4 }, { x: 2.2, y: 3.4 }];
      const ins = narrow ? { x: 0, y: -3.6 } : { x: 4.3, y: 1.4 };
      const pts = body.concat([{ x: ins.x - 1.2, y: ins.y - 1.7 }, { x: ins.x + 1.2, y: ins.y + 1.7 }]);
      fit(b, bboxOf(pts), { l: 30, r: 30, t: 36, b: 36 });
      if (rev) { S3.drawSolid(D, S3.solid(kind, K7D[kind]), {}); }
      else {
        const ph = S3.polyhedron(kind), gh = S3.drawPolyhedron(S3.nullCtx(D), ph, 0, {});
        S3.drawPolyhedron(D, ph, M.rot, {});
        if (Math.abs(M.rot) > 1e-6 && Math.abs(M.rot - 2 * PI) > 1e-6) D.g.path(gh, { close: true, color: AMB, width: 2.2, dash: [6, 5] });
      }
      // 위에서 본 모양
      const k = 0.62;
      if (C.txt) T(b, { x: ins.x, y: ins.y + 1.2 }, '위에서 본 모양', 'ink', { dy: -6, size: 15 });
      if (rev) {
        const R = K7D[kind].R * k;
        const circ = (R2) => { const q = []; for (let i = 0; i <= 48; i++) q.push({ x: ins.x + R2 * Math.cos(2 * PI * i / 48), y: ins.y + R2 * Math.sin(2 * PI * i / 48) }); return q; };
        b.path(circ(R), { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        if (kind === 'frus') b.path(circ(K7D.frus.r * k), { close: true, color: SKY, width: 2.2 });
        if (C.txt) T(b, { x: ins.x, y: ins.y - 1.2 }, '원 — 돌려도 같아요', GRN, { dy: 8, size: 15 });
      } else {
        const g0 = top7(kind, 0, ins.x, ins.y, k), g1 = top7(kind, M.rot, ins.x, ins.y, k);
        b.path(g0, { close: true, color: AMB, width: 2.2, dash: [6, 5] });
        b.path(g1, { close: true, fill: SKY, fillAlpha: 0.2, color: SKY, width: 3 });
        if (C.txt) T(b, { x: ins.x, y: ins.y - 1.2 }, '돌리면 모양이 달라져요', 'rose', { dy: 8, size: 15 });
      }
      if (C.txt && C.review) {
        if (C.step >= 2) T(b, { x: 0, y: -0.9 }, rev ? '곡면이 있고 회전축이 있어요' : '평평한 면(다각형)만 있어요', rev ? GRN : 'rose', { size: 16 });
      }
    },
    steps: (M) => [
      `입체 <b>${M.name}</b>의 면을 살펴요. ${M.rev ? '둥근 곡면이 있어요.' : '모든 면이 평평한 다각형이에요.'}`,
      `세로 축 둘레로 돌려 봐요. ${M.rev ? '어느 각도로 돌려도 겉모양이 그대로예요.' : '돌리면 겉모양이 달라져요.'}`,
      `위에서 본 모양은 ${M.rev ? '<b>원</b>이에요.' : '<b>다각형</b>이에요.'}`,
      M.rev ? `그러므로 ${M.name}${jo(M.name, 'eun')} <b>회전체</b>예요. 어떤 평면도형을 한 바퀴 돌려 만들 수 있어요.` : `그러므로 ${M.name}${jo(M.name, 'eun')} 다면체이고 <b>회전체가 아니에요</b>.`
    ],
    view: (M, C) => ({
      guide: '입체 칩을 눌러 고르고 <b>돌려 보기</b> 막대를 움직여 보세요. 노란 점선은 처음 모양이에요. 위에서 본 모양도 함께 비교해요.',
      readouts: [rd('입체', M.name, SKY), rd('둥근 곡면', M.rev ? '있어요' : '없어요', M.rev ? GRN : 'rose'), rd('회전체인가요?', M.rev ? '예' : '아니요', M.rev ? GRN : 'rose', M.rev ? '위에서 보면 원' : '위에서 보면 다각형')],
      status: { tone: M.rev ? 'ok' : 'warn', text: `${M.name}: ${M.rev ? '회전체' : '회전체가 아니에요'}` },
      formula: '<p>회전체: 평면도형을 한 직선(회전축)을 중심으로 1회전시켜 만든 입체</p><p>회전체는 축을 중심으로 돌려도 모양이 그대로이고, 위에서 본 모양(축에 수직인 단면)이 원이에요.</p>',
      rule: '다각형으로만 둘러싸인 입체(다면체)는 회전체가 아니다',
      notes: notes('<b>원기둥·원뿔·원뿔대·구</b>는 회전체예요.', '<b>각기둥·각뿔·각뿔대</b>는 다면체라서 회전체가 아니에요.')
    }),
    prob: (M) => {
      const items = M.list.map((k) => ({ k, rev: K7[k].rev }));
      const choices = items.map((x) => ({ h: x.rev ? S3.solidSvg(S3.solid(x.k, K7D[x.k]), -25, 20, 150, 130) : (() => { const D = S3.svgCtx(-25, 20); S3.drawPolyhedron(D, S3.polyhedron(x.k), 0, {}); return D.svg.toSvg(150, 130, 10); })(), p: '입체 그림', ok: !x.rev, hint: x.rev ? '이 입체는 평면도형을 돌려 만들 수 있어요. 회전체예요.' : '' }));
      return { tag: '회전체가 아닌 것', key: M.list.join(','), fig: true, stem: '다음 중 회전체가 아닌 것은? (그림 ①~⑤는 위쪽 그림과 같아요)', choices };
    }
  });

  G.register(10, 'rv1', '① 회전체 만들기', '회전체 만들기', PARAMS, S);
})();
