/* ==========================================================================
   중1 · 원과 부채꼴 · 「F06 점의 이동 — 굴리기」 탭 (rolling.js, order 66)
   - 도형을 가로선(직선 l) 위에서 왼쪽 → 오른쪽으로 실제로 굴립니다(회전). 세로로 옮겨 다니는 움직임은 없습니다.
   - 한 번 회전할 때마다 한 꼭짓점을 중심으로 돌고, 점이 남기는 자취는 그 중심을 중심으로 하는 부채꼴의 호입니다.
     (반원이 둥근 부분으로 굴러갈 때 중심 O는 가로로 곧게 움직이고, 그 거리는 굴러간 호의 길이와 같습니다.)
   - 정리 탭은 교과서 「해결 전략」 그대로: ㉠ ㉡ ㉢ 각각 2π × r × (중심각/360) → 합.
   - 문제 탭은 교과서 문제를 그대로(문구·수치·그림·보기 순서·정답). '숫자 바꾸기'는 확장입니다.
   - 이 파일은 단독으로 동작합니다(작은 도구는 모두 IIFE 안). 전역은 APL_CS_GROUPS 하나뿐.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================= 1. 작은 도구 ======================= */
  const D2R = Math.PI / 180;
  const S3 = Math.sqrt(3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const snapInt = (x) => (Math.abs(x - Math.round(x)) < 1e-6 ? Math.round(x) : x);
  const cleanNum = (x) => (Math.abs(x * 2 - Math.round(x * 2)) < 1e-9 ? Math.round(x * 2) / 2 : x);
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rngOf = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const pick = (rng, arr) => arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];
  const JAMO = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥', '㉦', '㉧'];
  const CIRC = ['①', '②', '③', '④', '⑤'];
  const PRIME = ['', '′', '″', '‴', '⁗'];
  const primes = (k) => PRIME[Math.min(k, PRIME.length - 1)];
  const ARC_COL = ['sky', 'green', 'violet', 'orange', 'rose', 'amber'];
  const ROT_SEC = 1.7; // 한 번 회전하는 데 걸리는 시간(초)
  const FS = { name: 17, len: 15, sec: 16, arc: 17, ang: 14 }; // 그림 안 글자 크기(px) — 휴대폰에서도 12px 이상

  /** 분수(분모 720 이하)로 딱 떨어지면 {p,q}, 아니면 null (√ 가 섞인 값) */
  function toFrac(x) {
    if (!Number.isFinite(x)) return null;
    for (let q = 1; q <= 720; q++) {
      const p = Math.round(x * q);
      if (Math.abs(x * q - p) < 1e-7) { const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; }
    }
    return null;
  }
  const rTxt = (r) => { const f = toFrac(r); return f && f.q === 1 ? String(f.p) : f ? String(Math.round(r * 100) / 100) : r.toFixed(1); };
  const coefTex = (c) => {
    const f = toFrac(c);
    if (!f) return `\\approx ${c.toFixed(2)}\\pi`;
    if (f.p === 0) return '0';
    if (f.q === 1) return (f.p === 1 ? '' : f.p) + '\\pi';
    return `\\frac{${f.p}}{${f.q}}\\pi`;
  };
  const coefPlain = (c) => {
    const f = toFrac(c);
    if (!f) return `약 ${c.toFixed(2)}π`;
    if (f.p === 0) return '0';
    if (f.q === 1) return (f.p === 1 ? '' : f.p) + 'π';
    return `${f.p === 1 ? '' : f.p}π/${f.q}`;
  };
  const arcEq = (r, th) => {
    const c = (r * th) / 180;
    return toFrac(c)
      ? `2\\pi\\times${rTxt(r)}\\times\\frac{${th}}{360}=${coefTex(c)}`
      : `2\\pi\\times${r.toFixed(1)}\\times\\frac{${th}}{360}\\approx${c.toFixed(2)}\\pi`;
  };
  const sumTex = (coefs) => {
    const total = coefs.reduce((t, c) => t + c, 0);
    return coefs.map(coefTex).join('+') + (toFrac(total) ? '=' : '\\approx') + coefTex(total);
  };
  const sumPlain = (coefs) => coefs.map(coefPlain).join(' + ') + ' = ' + coefPlain(coefs.reduce((t, c) => t + c, 0));
  const rollPhrase = (N) => (N === 1 ? '한 번' : `${N}번`);

  /* ======================= 2. 도형 정의 ======================= */
  // 다각형: 꼭짓점을 반시계 방향으로, 변 0→1 이 직선 l 위(아래쪽 변). 오른쪽으로 굴리면 1, 2, 3 … 번 꼭짓점이 차례로 회전의 중심이 됩니다.
  const SHAPES = {
    rect: (c) => ({
      names: ['A', 'B', 'C', 'D'], pts: [[0, 0], [c.w, 0], [c.w, c.h], [0, c.h]],
      lens: { 0: c.w, 3: c.h }, diags: [{ a: 1, b: 3, v: Math.hypot(c.w, c.h) }],
      ticks: [1, 2, 1, 2], rights: [0, 1, 2, 3], angles: []
    }),
    tri: (c) => ({
      names: ['A', 'B', 'C'], pts: [[0, 0], [c.a, 0], [c.a / 2, (c.a * S3) / 2]],
      lens: { 0: c.a }, diags: [], ticks: [1, 1, 1], rights: [],
      angles: [{ i: 0, deg: 60, rings: 1, label: true }, { i: 1, deg: 60, rings: 1 }, { i: 2, deg: 60, rings: 1 }]
    }),
    square: (c) => ({
      names: ['A', 'B', 'C', 'D'], pts: [[0, 0], [c.a, 0], [c.a, c.a], [0, c.a]],
      lens: { 0: c.a }, diags: [], ticks: [1, 1, 1, 1], rights: [0, 1, 2, 3], angles: []
    }),
    // 직각삼각형: ∠C=90°, ∠B=β(기본 60°), BC=a, AB=a/cosβ (교과서 연습문제 2-2: β=60° → AB=2a)
    rtri: (c) => {
      const t = Math.tan(c.beta * D2R), ab = c.a / Math.cos(c.beta * D2R);
      return {
        names: ['B', 'C', 'A'], pts: [[0, 0], [c.a, 0], [c.a, c.a * t]],
        lens: { 0: c.a, 2: cleanNum(ab) }, diags: [], ticks: [], rights: [1],
        angles: [{ i: 0, deg: c.beta, rings: 1, label: true, given: true }, { i: 2, deg: 90 - c.beta, rings: 2, label: true }]
      };
    },
    // 점 C 중심 회전 (교과서 18번): ∠A=90°, AC=d, ∠ACB=γ
    turn: (c) => {
      const g = c.at === 'C' ? c.deg : 90 - c.deg; // γ = ∠ACB
      const gr = g * D2R;
      const B = [0, 0], C = [c.d / Math.cos(gr), 0], A = [(c.d * Math.sin(gr) * Math.sin(gr)) / Math.cos(gr), c.d * Math.sin(gr)];
      const angles = [];
      if (c.at === 'C') angles.push({ i: 1, deg: g, rings: 1, label: true, given: true });
      else { angles.push({ i: 0, deg: c.deg, rings: 1, label: true, given: true }); angles.push({ i: 1, deg: g, rings: 1, label: true }); }
      return { names: ['B', 'C', 'A'], pts: [B, C, A], lens: { 1: c.d }, diags: [], ticks: [], rights: [2], angles };
    }
  };

  /* ======================= 3. 굴리기 계산 (모델) ======================= */
  const CACHE = new Map();
  const rotCW = (p, c, a) => {
    const dx = p.x - c.x, dy = p.y - c.y, co = Math.cos(a), si = Math.sin(a);
    return { x: c.x + dx * co + dy * si, y: c.y - dx * si + dy * co };
  };

  const finishModel = (M) => {
    const { states, rots } = M;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const upd = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
    states.forEach((st) => st.forEach((p) => upd(p.x, p.y)));
    rots.forEach((rt) => {
      if (rt.arc < 0) return;
      if (rt.kind === 'roll') { upd(rt.C.x, rt.C.y); upd(rt.C.x + rt.len, rt.C.y); return; }
      for (let j = 0; j <= 24; j++) { const a = rt.phi0 - (rt.theta * D2R * j) / 24; upd(rt.C.x + rt.r * Math.cos(a), rt.C.y + rt.r * Math.sin(a)); }
    });
    upd(0, 0);
    M.arcs = rots.filter((r) => r.arc >= 0);
    M.total = M.arcs.reduce((t, r) => t + r.coef, 0);
    M.bbox = { x0, x1, y0, y1 };
    M.valid = M.arcs.every((r) => toFrac(r.coef) !== null);
    return M;
  };

  /** 다각형을 오른쪽으로 굴립니다. 회전 i 는 (i+1) 번 꼭짓점을 중심으로 외각만큼 시계 방향으로 돕니다. */
  function buildPoly(spec, cfg) {
    const sh = SHAPES[spec.shape](cfg);
    const pts = sh.pts.map((p) => ({ x: p[0], y: p[1] }));
    const n = pts.length, N = cfg.rolls, T = cfg.track;
    const interior = pts.map((p, i) => {
      const a = pts[(i + n - 1) % n], c = pts[(i + 1) % n];
      const v1x = a.x - p.x, v1y = a.y - p.y, v2x = c.x - p.x, v2y = c.y - p.y;
      return snapInt(Math.acos(clamp((v1x * v2x + v1y * v2y) / (Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y)), -1, 1)) / D2R);
    });
    const ext = interior.map((a) => snapInt(180 - a));
    const states = [pts], rots = [];
    let cur = pts, arcN = 0;
    for (let i = 0; i < N; i++) {
      const pv = (i + 1) % n, th = ext[pv], c = cur[pv];
      const r = cleanNum(Math.hypot(pts[T].x - pts[pv].x, pts[T].y - pts[pv].y));
      const phi0 = Math.atan2(cur[T].y - c.y, cur[T].x - c.x);
      const next = cur.map((p) => rotCW(p, c, th * D2R));
      const arc = r > 1e-9 ? arcN++ : -1;
      rots.push({ i, kind: 'pivot', pivot: pv, pname: sh.names[pv], C: c, theta: th, r, phi0, arc, coef: (r * th) / 180, dur: 1 });
      states.push(next);
      cur = next;
    }
    const M = {
      spec, cfg, sh, n, nOut: n, N, T, names: sh.names, labelIdx: pts.map((p, i) => i), interior, ext, states, rots,
      pvx: states.map((st, k) => st[(k + 1) % n].x) // 손잡이(끌어서 굴리기)가 움직이는 자리
    };
    return finishModel(M);
  }

  /** 반원(반지름 R)을 굴립니다: B 를 중심으로 90° 돌고 → 둥근 부분으로 굴러가고(중심 O 는 가로로 곧게) → A 를 중심으로 90° 돕니다. */
  function buildSemi(spec, cfg) {
    const R = cfg.R, K = 48;
    const pts = [];
    for (let j = 0; j <= K; j++) { const a = Math.PI - (Math.PI * j) / K; pts.push({ x: R + R * Math.cos(a), y: Math.max(0, R * Math.sin(a)) }); } // A(0)…B(K): 위로 볼록
    pts[0] = { x: 0, y: 0 }; pts[K] = { x: 2 * R, y: 0 };
    pts.push({ x: R, y: 0 }); // O
    const iA = 0, iB = K, iO = K + 1;
    const names = pts.map((p, i) => (i === iA ? 'A' : i === iB ? 'B' : i === iO ? 'O' : ''));
    const sh = {
      names, pts: [], lens: {}, diags: [], ticks: [], rights: [], angles: [],
      segs: [{ a: iA, b: iO, text: `${R} cm` }],
      tickSegs: [{ a: iA, b: iO, count: 1 }, { a: iO, b: iB, count: 1 }]
    };
    const S0 = pts;
    const B0 = S0[iB];
    const S1 = S0.map((p) => rotCW(p, B0, (90 * Math.PI) / 180));
    const O1 = S1[iO];
    const S2 = S1.map((p) => { const q = rotCW(p, O1, Math.PI); return { x: q.x + Math.PI * R, y: q.y }; });
    const A2 = S2[iA];
    const S3 = S2.map((p) => rotCW(p, A2, (90 * Math.PI) / 180));
    const rots = [
      { i: 0, kind: 'pivot', pivot: iB, pname: 'B', C: B0, theta: 90, r: R, phi0: Math.atan2(S0[iO].y - B0.y, S0[iO].x - B0.x), arc: 0, coef: (R * 90) / 180, dur: 1 },
      { i: 1, kind: 'roll', pivot: -1, pname: '', C: O1, theta: 180, r: R, phi0: 0, arc: 1, coef: (R * 180) / 180, len: Math.PI * R, dur: 1.5 },
      { i: 2, kind: 'pivot', pivot: iA, pname: 'A', C: A2, theta: 90, r: R, phi0: Math.atan2(S2[iO].y - A2.y, S2[iO].x - A2.x), arc: 2, coef: (R * 90) / 180, dur: 1 }
    ];
    const M = {
      spec, cfg, sh, n: K + 1, nOut: K + 1, N: 3, T: iO, names, labelIdx: [iA, iB, iO], interior: [], ext: [],
      states: [S0, S1, S2, S3], rots, pvx: [S0[iO].x, S1[iO].x, S2[iO].x, S3[iO].x]
    };
    return finishModel(M);
  }

  function buildModel(spec, cfg) {
    const key = spec.id + JSON.stringify(cfg);
    if (CACHE.has(key)) return CACHE.get(key);
    const M = spec.shape === 'semi' ? buildSemi(spec, cfg) : buildPoly(spec, cfg);
    if (CACHE.size > 200) CACHE.clear();
    CACHE.set(key, M);
    return M;
  }

  /** 도형이 phase k 의 f(0~1) 만큼 진행했을 때의 점들 */
  function posAt(M, k, f) {
    const st = M.states[k];
    if (f <= 0 || k >= M.N) return st;
    const rt = M.rots[k];
    if (rt.kind === 'roll') return st.map((p) => { const q = rotCW(p, rt.C, rt.theta * f * D2R); return { x: q.x + rt.len * f, y: q.y }; });
    return st.map((p) => rotCW(p, rt.C, rt.theta * f * D2R));
  }

  const figKind = () => !(window.lab && window.lab.board && window.lab.board.kind === 'cartesian');
  const boxOf = (pts, mx, top, bot) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach((p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    return figKind() ? { x: [x0 - mx, x1 + mx], y: [-(y1 + top), -(y0 - bot)] } : { x: [x0 - mx, x1 + mx], y: [y0 - bot, y1 + top] };
  };
  /** 화면 맞춤 범위(길 전체와 호, 아래쪽 손잡이 줄까지). */
  function focusOf(M) {
    const b = M.bbox, w = b.x1 - b.x0;
    return boxOf([{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y1 }], 0.9 + w * 0.03, 1.0 + (b.y1 - b.y0) * 0.04, 2.4);
  }
  /** 작은 화면용: 지금 일어나는 회전 하나(또는 굴러가는 반원 한 개)만 크게. */
  function regionOf(M, k, f) {
    const pts = [];
    const rt = M.rots[k];
    const cur = posAt(M, k, f);
    if (rt.kind === 'roll') {
      cur.slice(0, M.nOut).forEach((p) => pts.push(p));
      pts.push({ x: rt.C.x, y: rt.C.y }, { x: rt.C.x + rt.len * f, y: rt.C.y }, { x: Math.min(...cur.map((p) => p.x)) - 0.3 * rt.r, y: 0 });
    } else {
      M.states[k].slice(0, M.nOut).forEach((p) => pts.push(p));
      M.states[k + 1].slice(0, M.nOut).forEach((p) => pts.push(p));
      for (let j = 0; j <= 12; j++) { const a = rt.phi0 - (rt.theta * D2R * j) / 12; pts.push({ x: rt.C.x + rt.r * Math.cos(a), y: rt.C.y + rt.r * Math.sin(a) }); }
      pts.push({ x: rt.C.x, y: 0 });
    }
    pts.push({ x: pts[0].x, y: 0 });
    const w = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
    return boxOf(pts, 1.6 + w * 0.07, 1.3, 2.4);
  }

  /* ======================= 4. 장면 상태(어느 탭이냐에 따라 보여 줄 모습) ======================= */
  function stepList(spec, M) {
    const T = M.names[M.T];
    const L = [];
    const arcs = M.arcs;
    const names = arcs.map((a) => JAMO[a.arc]);
    const list = names.length === 1 ? `${names[0]}의 길이와 같다.` : `${names.join(', ')}의 길이의 합과 같다.`;
    const ov = spec.overview ? spec.overview(M) : [
      `해결 전략 ① 점 ${T}가 움직인 자취를 실제로 그려 본다. 이때 점이 움직인 거리는 모두 부채꼴의 호의 길이이다.`,
      `해결 전략 ② 부채꼴의 반지름의 길이와 중심각의 크기를 구한 후 점 ${T}가 움직인 거리를 구한다. 점 ${T}가 움직인 거리는 ${list}`
    ];
    ov.forEach((t) => L.push({ type: 'overview', text: t }));
    if (spec.infoSteps) spec.infoSteps(M).forEach((t) => L.push({ type: 'info', text: t }));
    M.rots.forEach((rt) => {
      const P = rt.pname;
      if (rt.kind === 'roll') {
        L.push({
          type: 'arc', arc: rt.arc, rot: rt.i,
          text: `${JAMO[rt.arc]} 반원이 둥근 부분으로 굴러가는 동안 점 ${T}는 가로로 곧게 움직인다. 움직인 거리는 굴러간 호의 길이와 같다. 반지름 ${rTxt(rt.r)} cm, 중심각 ${rt.theta}°인 호이므로 $${arcEq(rt.r, rt.theta)}$ (cm)`
        });
      } else if (rt.arc >= 0) {
        const adj = ((M.T - rt.pivot + M.n) % M.n === 1) || ((rt.pivot - M.T + M.n) % M.n === 1);
        const seg = [T, P].sort().join('');
        let why = `반지름은 점 ${T}와 회전의 중심 ${P} 사이의 거리 $\\overline{${seg}}$=${rTxt(rt.r)} cm`;
        if (spec.shape !== 'semi') {
          if (!adj && spec.shape === 'rect') why += '(직사각형의 대각선, 두 대각선의 길이는 같다)';
          else if (!adj) why += '(대각선)';
        }
        const mid = spec.shape === 'semi'
          ? `${why}, 중심각은 반원이 세워질 때까지 돌아간 각 ${rt.theta}°`
          : spec.shape === 'turn'
            ? `${why}, 중심각은 180° − ∠ACB = 180° − ${M.interior[rt.pivot]}° = ${rt.theta}°`
            : `${why}, 중심각은 180° − ${M.interior[rt.pivot]}° = ${rt.theta}°`;
        L.push({
          type: 'arc', arc: rt.arc, rot: rt.i,
          text: `${JAMO[rt.arc]} 점 ${P}를 중심으로 회전한다. ${mid}이므로 $${arcEq(rt.r, rt.theta)}$ (cm)`
        });
      } else {
        L.push({ type: 'still', rot: rt.i, text: `(참고) 점 ${P}를 중심으로 회전할 때는 점 ${T}가 회전의 중심이라 움직이지 않는다. 호가 생기지 않으니 더하지 않는다.` });
      }
    });
    L.push({ type: 'total', text: `따라서 점 ${T}가 움직인 거리는 ${names.join(' + ')} = $${sumTex(arcs.map((a) => a.coef))}$ (cm)` });
    return L;
  }

  function scenario(spec, s, lab, thumb) {
    const tab = thumb ? 'thumb' : (lab && lab.tab) || 'explore';
    const cfg = tab === 'problem' ? probCfg(spec, s) : s.cfg;
    const M = buildModel(spec, cfg);
    const N = M.N;
    const sc = { spec, tab, M, plain: false, hl: null, outline: false, u: N, item: null, shown: null };
    if (tab === 'explore') {
      sc.u = clamp(s.rlT, 0, 1) * N;
    } else if (tab === 'review') {
      const items = stepList(spec, M);
      const si = clamp(Math.round(s.step || 1), 1, items.length);
      sc.items = items;
      sc.item = items[si - 1];
      sc.shown = new Set();
      for (let j = 0; j < si; j++) if (items[j].type === 'arc') sc.shown.add(items[j].arc);
      sc.hl = sc.item.type === 'arc' ? sc.item.arc : null;
      sc.outline = sc.item.type === 'overview' || sc.item.type === 'info';
      if (sc.item.type === 'info') sc.u = 0;
      else if (sc.item.rot != null) sc.u = sc.item.rot + 1;
      sc.si = si;
    } else if (tab === 'problem') {
      sc.plain = !(lab ? lab._answerOpen() : true);
      sc.shown = new Set(M.arcs.map((a) => a.arc));
    } else {
      sc.shown = new Set(M.arcs.map((a) => a.arc));
    }
    const u = clamp(sc.u, 0, N);
    const k = Math.min(Math.floor(u + 1e-9), N);
    let f = k >= N ? 0 : clamp(u - k, 0, 1);
    if (f < 1e-9) f = 0;
    sc.k = k; sc.f = f;
    sc.pos = posAt(M, k, f);
    sc.nGhost = f > 0 ? k + 1 : k;
    sc.fracs = M.rots.map((r) => {
      if (tab === 'explore') return r.i < k ? 1 : r.i === k ? f : 0;
      if (r.arc < 0) return 0;
      return sc.shown && sc.shown.has(r.arc) ? 1 : 0;
    });
    return sc;
  }

  /* ======================= 5. 그리기 ======================= */
  function paint(b, sc, spec, st) {
    const M = sc.M, sh = M.sh, N = M.N, n = M.nOut, T = M.T;
    const FIG = b.kind === 'figure';
    const P = (p) => (FIG ? [p.x, -p.y] : [p.x, p.y]);
    const thumb = !!b.thumb;
    const ctx = b.ctx;
    const kpx = b.k;
    const colOf = (rt) => ARC_COL[rt.arc % ARC_COL.length];
    const compact = kpx < 10; // 길이 아주 긴 그림을 작은 화면에 통째로 담을 때: 겹치는 보조 글자는 줄입니다
    const outline = (pos) => pos.slice(0, n);
    const cen = (pos) => { const o = outline(pos); return { x: o.reduce((t, p) => t + p.x, 0) / o.length, y: o.reduce((t, p) => t + p.y, 0) / o.length }; };
    const away = (p, c, px) => { const dx = p.x - c.x, dy = p.y - c.y, l = Math.hypot(dx, dy) || 1; return { dx: (dx / l) * px, dy: (-dy / l) * px }; };
    const cm = (v) => (toFrac(v) ? `${rTxt(v)} cm` : `≈${v.toFixed(1)} cm`);
    const arcAt = (C, r, phi0, sweep, o) => {
      if (FIG) b.arc(P(C), r, -phi0, -phi0 + sweep, o);
      else b.arc(P(C), r, phi0, phi0 - sweep, { ...o, cw: true });
    };
    const arrowHead = (pt, phi, color) => { // 가는 방향(시계 방향 호의 끝, 수학 각 phi)에 화살촉
      const S = b.toS(P(pt));
      const dx = Math.sin(phi), dy = Math.cos(phi), nx = -dy, ny = dx;
      ctx.save();
      ctx.fillStyle = b.color(color);
      ctx.beginPath();
      ctx.moveTo(S.x, S.y);
      ctx.lineTo(S.x - dx * 11 + nx * 5, S.y - dy * 11 + ny * 5);
      ctx.lineTo(S.x - dx * 11 - nx * 5, S.y - dy * 11 - ny * 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    const label = (p, text, o) => b.text(P(p), text, { size: FS.len, weight: 800, align: 'center', baseline: 'middle', ...o });
    const vlabel = (p, c, text, color, size) => { const o = away(p, c, 17); label(p, text, { dx: o.dx, dy: o.dy, color: color || 'ink', size: size || FS.name }); };
    const outward = (a, bb, pos) => { // 선분 a-b 의 바깥쪽(도형 중심 반대쪽) 단위 벡터
      const dx = bb.x - a.x, dy = bb.y - a.y, l = Math.hypot(dx, dy) || 1;
      let nx = dy / l, ny = -dx / l;
      const c = cen(pos), mx = (a.x + bb.x) / 2, my = (a.y + bb.y) / 2;
      if ((mx - c.x) * nx + (my - c.y) * ny < 0) { nx = -nx; ny = -ny; }
      return { nx, ny, mx, my };
    };
    const segLabel = (pos, a, bb, text) => { const o = outward(pos[a], pos[bb], pos); label({ x: o.mx, y: o.my }, text, { dx: o.nx * 19, dy: -o.ny * 19, size: FS.len, color: 'ink', weight: 800 }); };
    const drawMarks = (pos, o) => {
      if (thumb) return;
      const q = (i) => P(pos[((i % n) + n) % n]);
      sh.rights.forEach((i) => b.right(q(i), q(i + 1), q(i - 1), { size: 13, color: 'amber' }));
      if (o.rightsOnly) return;
      if (o.ticks) {
        sh.ticks.forEach((cnt, i) => { if (cnt) b.ticks(q(i), q(i + 1), { count: cnt, color: 'amber', size: 7 }); });
        (sh.tickSegs || []).forEach((t) => b.ticks(P(pos[t.a]), P(pos[t.b]), { count: t.count, color: 'amber', size: 7 }));
      }
      sh.angles.forEach((a) => {
        if (o.onlyGiven && !a.given) return;
        b.angle(q(a.i), q(a.i + 1), q(a.i - 1), { r: 22, rings: a.rings, color: 'amber', label: a.label ? `${snapInt(Math.round(a.deg * 100) / 100)}°` : undefined, labelGap: 15, size: FS.ang });
      });
    };
    const drawLens = (pos, diag) => {
      if (thumb) return;
      Object.keys(sh.lens).forEach((i) => segLabel(pos, +i, (+i + 1) % n, cm(sh.lens[i])));
      (sh.segs || []).forEach((sg) => segLabel(pos, sg.a, sg.b, sg.text));
      if (diag) sh.diags.forEach((d) => {
        b.seg(P(pos[d.a]), P(pos[d.b]), { color: 'muted', width: 1.6, dash: [4, 4], alpha: 0.9 });
        const m = { x: (pos[d.a].x + pos[d.b].x) / 2, y: (pos[d.a].y + pos[d.b].y) / 2 };
        label(m, cm(d.v), { dx: 18, dy: -11, size: FS.len, color: 'muted', weight: 800 });
      });
    };

    // 직선 l
    b.hline(0, { color: 'muted', width: 3 });
    if (!thumb) {
      const ys = b.toS(P({ x: 0, y: 0 })).y;
      b.stext(b.W - (b.panes ? 0 : b.insets.right) - 24, ys + 16, 'l', { color: 'muted', size: 16, weight: 800, align: 'center', baseline: 'middle' });
    }

    /* ---------- 교과서 문제 그림(풀이 전): 처음·끝 모양과 자취, 주어진 길이·각만 ---------- */
    if (sc.plain) {
      for (let j = 0; j <= N; j++) {
        const solid = j === 0 || j === N;
        b.poly(outline(M.states[j]).map(P), solid ? { color: 'ink', width: 2.6 } : { color: 'muted', width: 1.7, dash: [5, 4], alpha: 0.85 });
      }
      M.rots.forEach((rt) => {
        if (rt.arc < 0) return;
        if (rt.kind === 'roll') {
          const e = { x: rt.C.x + rt.len, y: rt.C.y };
          b.seg(P(rt.C), P(e), { color: 'ink', width: 1.8, alpha: 0.92 });
          arrowHead(e, Math.PI / 2, 'ink');
          return;
        }
        arcAt(rt.C, rt.r, rt.phi0, rt.theta * D2R, { color: 'ink', width: 1.9, alpha: 0.92 });
        const e = rt.phi0 - rt.theta * D2R;
        arrowHead({ x: rt.C.x + rt.r * Math.cos(e), y: rt.C.y + rt.r * Math.sin(e) }, e, 'ink');
      });
      const first = M.states[0], last = M.states[N];
      drawMarks(first, { onlyGiven: true });
      drawMarks(last, { rightsOnly: true });
      drawLens(first, true);
      if (!thumb) {
        const c0 = cen(first), c1 = cen(last);
        M.labelIdx.forEach((i) => vlabel(first[i], c0, M.names[i], i === T ? 'rose' : 'ink'));
        M.labelIdx.forEach((i) => {
          if (Math.hypot(last[i].x - first[i].x, last[i].y - first[i].y) < 1e-6) return; // 회전의 중심처럼 그대로인 점은 한 번만
          vlabel(last[i], c1, M.names[i] + (spec.primeLast ? '′' : ''), i === T ? 'rose' : 'ink');
        });
      }
      return;
    }

    /* ---------- 풀이 그림: 부채꼴 색칠 · 반지름/중심각 · 굴러가는 도형 ---------- */
    const pos = sc.pos;
    if (sc.tab === 'review') b.emph = sc.hl != null ? { part: sc.hl, ref: sc.hl } : null;

    // (1) 부채꼴 색칠 + 반지름 (굴러가는 구간은 곧은 선)
    M.rots.forEach((rt) => {
      if (rt.arc < 0 || rt.kind === 'roll') return;
      const fr = sc.fracs[rt.i];
      if (fr <= 0 || sc.outline) return;
      const C = rt.C, c = colOf(rt), sweep = rt.theta * D2R * fr;
      arcAt(C, rt.r, rt.phi0, sweep, { sector: true, fill: c, fillAlpha: 0.26, stroke: false, part: rt.arc });
      [rt.phi0, rt.phi0 - sweep].forEach((a) => b.seg(P(C), P({ x: C.x + rt.r * Math.cos(a), y: C.y + rt.r * Math.sin(a) }), { color: c, width: 1.8, dash: [5, 4], alpha: 0.9, part: rt.arc }));
    });

    // (2) 지나간 자리(점선 도형)
    for (let j = 0; j < sc.nGhost; j++) b.poly(outline(M.states[j]).map(P), { color: 'muted', width: 1.6, dash: [5, 4], alpha: 0.6 });

    // (3) 지금 도형
    b.poly(outline(pos).map(P), { fill: 'ink', fillAlpha: 0.07, color: 'ink', width: 2.9 });
    drawMarks(pos, { ticks: true });
    if (!(compact && (sc.k > 0 || sc.f > 0))) drawLens(pos, sc.k === 0 && sc.f === 0);

    // (4) 호(자취)
    M.rots.forEach((rt) => {
      if (rt.arc < 0) return;
      const c = colOf(rt);
      if (sc.outline) {
        if (sc.tab !== 'review') return;
        if (rt.kind === 'roll') b.seg(P(rt.C), P({ x: rt.C.x + rt.len, y: rt.C.y }), { color: 'rose', width: 3.2, alpha: 0.95, glow: true });
        else arcAt(rt.C, rt.r, rt.phi0, rt.theta * D2R, { color: 'rose', width: 3.2, alpha: 0.95, glow: true });
        return;
      }
      const fr = sc.fracs[rt.i];
      if (fr <= 0) return;
      if (rt.kind === 'roll') b.seg(P(rt.C), P({ x: rt.C.x + rt.len * fr, y: rt.C.y }), { color: c, width: 5.2, glow: true, part: rt.arc });
      else arcAt(rt.C, rt.r, rt.phi0, rt.theta * D2R * fr, { color: c, width: 5, glow: true, part: rt.arc });
    });

    if (thumb) { b.point(P(pos[T]), { color: 'rose', r: 5 }); return; }

    // (5) 호 이름표 ㉠ ㉡ ㉢ (호의 가운데 바깥쪽 / 굴러가는 선의 위쪽)
    M.rots.forEach((rt) => {
      if (rt.arc < 0) return;
      const fr = sc.fracs[rt.i];
      if (!sc.outline && fr <= 0) return;
      if (sc.outline && sc.tab !== 'review') return;
      if (rt.kind === 'roll') { label({ x: rt.C.x + (rt.len * Math.max(fr, 0.0)) / 2, y: rt.C.y }, JAMO[rt.arc], { dy: -(sc.outline ? 16 : 16), color: colOf(rt), size: FS.arc, part: rt.arc }); return; }
      const m = rt.phi0 - (rt.theta * D2R) / 2;
      const pt = { x: rt.C.x + rt.r * Math.cos(m), y: rt.C.y + rt.r * Math.sin(m) };
      label(pt, JAMO[rt.arc], { dx: Math.cos(m) * 16, dy: -Math.sin(m) * 16, color: colOf(rt), size: FS.arc, part: rt.arc });
    });

    // (6) 안쪽 글자: 반지름 r 과 중심각 (크게)
    if (!sc.outline) {
      M.rots.forEach((rt) => {
        if (rt.arc < 0) return;
        const fr = sc.fracs[rt.i];
        if (fr <= 0) return;
        const c = colOf(rt), live = fr < 1 ? Math.round(rt.theta * fr) : rt.theta;
        if (rt.kind === 'roll') {
          const mid = { x: rt.C.x + (rt.len * fr) / 2, y: rt.C.y };
          label(mid, `r=${rTxt(rt.r)}  ${live}°`, { dy: 18, color: c, size: FS.sec, part: rt.arc });
          return;
        }
        const m = rt.phi0 - (rt.theta * D2R) / 2;
        const rhoPx = Math.max(0.62 * rt.r * kpx, 32);
        const inside = rt.r * kpx >= 44 && 2 * rhoPx * Math.sin((rt.theta * D2R) / 2) >= 40;
        const rho = inside ? rhoPx / kpx : rt.r;
        const anchor = { x: rt.C.x + rho * Math.cos(m), y: rt.C.y + rho * Math.sin(m) };
        const ox = inside ? 0 : Math.cos(m) * 34, oy = inside ? 0 : -Math.sin(m) * 34;
        label(anchor, `r=${rTxt(rt.r)}`, { dx: ox, dy: oy - 9, color: c, size: FS.sec, part: rt.arc });
        label(anchor, `${live}°`, { dx: ox, dy: oy + 9, color: c, size: FS.sec, part: rt.arc });
        if (rt.r * kpx >= 44) { // 중심각 표시(중심 가까이에 작은 호)
          const S = b.toS(P(rt.C));
          ctx.save();
          ctx.strokeStyle = b.color(c);
          ctx.lineWidth = 2.2 * b.lw;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(S.x, S.y, 18, -rt.phi0, -rt.phi0 + rt.theta * D2R * fr, false);
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // (7) 회전의 중심 표시
    const ring = (rt, c) => rt.kind === 'pivot' && b.point(P(rt.C), { hollow: true, color: c, r: 9, glow: false });
    if (sc.tab === 'explore') {
      if (sc.k < N) { const rt = M.rots[sc.k]; ring(rt, rt.arc >= 0 ? colOf(rt) : 'muted'); }
    } else if (sc.tab === 'review') {
      if (sc.outline) M.rots.forEach((rt) => { if (rt.arc >= 0) ring(rt, colOf(rt)); });
      else if (sc.item.type === 'arc') ring(M.rots[sc.item.rot], colOf(M.rots[sc.item.rot]));
      else if (sc.item.type === 'still') ring(M.rots[sc.item.rot], 'muted');
    }

    // (8) 점 이름
    const doneArcs = M.rots.filter((r, i) => r.arc >= 0 && i < sc.k).length;
    const cPos = cen(pos);
    const sfx = (i) => (spec.primeLast ? (i === M.rots[0].pivot ? '' : primes(Math.min(sc.k, 1))) : i === T ? primes(doneArcs) : '');
    M.labelIdx.forEach((i) => { if (i === T && sc.f > 0) return; vlabel(pos[i], cPos, M.names[i] + sfx(i), i === T ? 'rose' : 'ink'); });
    for (let j = 0; j < sc.nGhost; j++) { // 지나간 자리에서 점이 있던 곳
      if (compact || !(j === 0 || M.rots[j - 1].arc >= 0)) continue;
      const g = M.states[j], cg = cen(g);
      const cnt = M.rots.slice(0, j).filter((r) => r.arc >= 0).length;
      b.point(P(g[T]), { hollow: true, color: 'rose', r: 5, glow: false });
      vlabel(g[T], cg, M.names[T] + primes(cnt), 'rose', FS.len);
    }
    if (spec.primeLast && sc.nGhost > 0) {
      const g = M.states[0], cg = cen(g);
      M.labelIdx.forEach((i) => { if (i === T || Math.hypot(g[i].x - pos[i].x, g[i].y - pos[i].y) < 1e-6) return; vlabel(g[i], cg, M.names[i], 'muted', FS.len); });
    }
    b.point(P(pos[T]), { color: 'rose', r: 7 });

    // (9) 끌어서 굴리기 손잡이
    if (sc.tab === 'explore') {
      const yBar = -Math.max(0.8, 36 / kpx);
      const pv = M.pvx;
      b.seg(P({ x: pv[0], y: yBar }), P({ x: pv[N], y: yBar }), { color: 'muted', width: 2, alpha: 0.55, dash: [3, 4] });
      pv.forEach((x) => b.point(P({ x, y: yBar }), { color: 'muted', r: 3, glow: false }));
      let xp = pv[N];
      if (sc.k < N) xp = pv[sc.k] + sc.f * (pv[sc.k + 1] - pv[sc.k]);
      const uFromX = (x) => {
        if (x <= pv[0]) return 0;
        for (let k = 0; k < N; k++) if (x <= pv[k + 1]) return k + (x - pv[k]) / (pv[k + 1] - pv[k] || 1);
        return N;
      };
      b.handle('roll', P({ x: xp, y: yBar }), {
        color: 'amber', ariaLabel: '도형 굴리기 손잡이', label: sc.u <= 0 ? '끌어서 굴리기' : undefined, dx: 0, dy: 26, align: 'center', size: 14,
        drag: (w) => { st.rlT = clamp(uFromX(w.x) / N, 0, 1); st.playing = false; st.rlHold = 0; }
      });
      // 처음 모양에서는 모서리를 끌어 크기·각을 바꿀 수 있습니다(풀이·합·문제가 바로 다시 계산됩니다).
      if (sc.u <= 1e-9 && !st.playing && spec.hdls) {
        spec.hdls.forEach((h, j) => {
          const idx = h.i === 'B' ? M.labelIdx[1] : h.i;
          b.handle('size' + j, P(M.states[0][idx]), {
            color: 'sky', ariaLabel: '도형 모양 바꾸기 손잡이', priority: 1,
            drag: (w) => {
              const y = FIG ? -w.y : w.y, patch = h.patch(w.x, y, st.cfg), nc = { ...st.cfg, ...patch };
              if (Object.keys(patch).some((k) => nc[k] !== st.cfg[k])) { st.cfg = nc; syncSliders(spec, st); cfgChanged(st); }
            }
          });
        });
      }
    }
  }

  /* ======================= 6. 문제(보기·정답) ======================= */
  const isBase = (spec, cfg) => Object.keys(spec.base).every((k) => spec.base[k] === cfg[k]);
  const numOpt = (c) => ({ tex: coefTex(c), v: c });
  /** 문제 탭에서 쓰는 조건: 지금 그림이 '깔끔한 수'(π 꼴)로 떨어지면 그대로, 아니면 기본 문제. */
  function probCfg(spec, s) {
    const M = buildModel(spec, s.cfg);
    return M.valid && (!spec.probOK || spec.probOK(s.cfg)) ? s.cfg : spec.base;
  }

  /** 보기 5개(작은 것부터). 기본 그림은 교과서 보기, 조절한 그림은 같은 모양으로 새로 만듭니다. */
  function choicesOf(spec, s) {
    const cfg = probCfg(spec, s), M = buildModel(spec, cfg);
    const key = spec.id + JSON.stringify(cfg) + '#' + s.rlSeed;
    if (choicesOf.key === key) return choicesOf.val;
    let opts = null;
    if (spec.baseChoices) {
      if (isBase(spec, cfg)) opts = spec.baseChoices.slice();
      else if (spec.genChoices) opts = spec.genChoices(M);
      else {
        const rng = rngOf(hash(key));
        const c = M.total, f = toFrac(c);
        const step = f.q === 2 ? 0.5 : pick(rng, [1, 1, 2]);
        const p = pick(rng, [0, 1, 2, 3, 4].filter((q) => c - q * step > 1e-9));
        opts = [0, 1, 2, 3, 4].map((j) => numOpt(c + (j - p) * step));
      }
    }
    const correct = opts ? opts.findIndex((o) => Math.abs(o.v - M.total) < 1e-9) : -1;
    const val = { opts, correct };
    choicesOf.key = key;
    choicesOf.val = val;
    return val;
  }

  function problemHTML(spec, s) {
    const cfg = probCfg(spec, s), M = buildModel(spec, cfg);
    const ch = choicesOf(spec, s);
    const A = window.APLab;
    let html = '<div class="rl-prob">';
    if (cfg !== s.cfg) html += '<div class="apl-callout" data-tone="info"><div>지금 조절한 그림은 길이가 깔끔하게 떨어지지 않아서(√가 필요해요), 기본 그림으로 문제를 보여 줘요. 숫자 바꾸기를 눌러 새 문제를 만들 수도 있어요.</div></div>';
    html += `<p class="rl-stmt">${spec.statement(cfg, M)}</p>`;
    if (ch.opts) {
      html += '<div class="rl-choices">';
      ch.opts.forEach((o, i) => {
        let cls = '';
        if (s.rlPick === i) cls = i === ch.correct ? ' ok' : ' bad';
        else if (s.revealed && i === ch.correct) cls = ' ok';
        html += `<button type="button" class="rl-choice${cls}" data-rl-pick="${i}"><span class="n">${CIRC[i]}</span><span>$${o.tex}$ cm</span></button>`;
      });
      html += '</div>';
      if (s.rlPick >= 0) {
        html += s.rlPick === ch.correct
          ? '<div class="apl-callout" data-tone="ok"><div><b>정답이에요!</b> 정리 탭에서 ㉠, ㉡, ㉢ … 호의 길이를 어떻게 더했는지 확인해 보세요.</div></div>'
          : '<div class="apl-callout" data-tone="bad"><div>아쉬워요. 점이 움직인 거리는 <b>부채꼴 호의 길이의 합</b>이에요. 각 호의 <b>반지름</b>과 <b>중심각</b>을 다시 살펴보세요.</div></div>';
      }
    } else {
      html += '<p class="rl-hint">먼저 스스로 풀어 보세요. 정리 탭의 풀이를 끝까지 보거나 아래 &lsquo;지금 보기&rsquo;를 누르면 정답이 열려요.</p>';
    }
    html += `<div class="rl-new-row"><button type="button" class="apl-btn" data-rl-new>${A && A.icon ? A.icon('reset') : ''}<span>숫자 바꾸기</span></button></div></div>`;
    return html;
  }

  /* ======================= 7. 보기 좋게: 스타일·클릭 처리 ======================= */
  (function injectStyle() {
    if (document.getElementById('rl-style')) return;
    const st = document.createElement('style');
    st.id = 'rl-style';
    st.textContent = `
.rl-prob{display:grid;gap:12px}
.rl-stmt{margin:0;line-height:1.9}
.rl-hint{margin:0;font-size:var(--fs-sm);color:var(--text-2);line-height:1.7}
.rl-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(138px,1fr));gap:8px}
.rl-choice{display:flex;align-items:center;gap:8px;min-height:46px;padding:8px 12px;border-radius:var(--r-md);border:1px solid var(--line-2);background:var(--card);color:var(--text);font:inherit;font-weight:700;text-align:left;cursor:pointer}
.rl-choice:hover{border-color:var(--text-3);background:var(--hover)}
.rl-choice .n{color:var(--text-3);font-weight:800}
.rl-choice.ok{border-color:var(--m-green);background:color-mix(in srgb,var(--m-green) 12%,var(--card))}
.rl-choice.bad{border-color:var(--m-red);background:color-mix(in srgb,var(--m-red) 10%,var(--card))}
.rl-new-row{display:flex;gap:8px}
`;
    document.head.append(st);
  })();

  /** 그림 조건(크기·각)이 바뀌면 정답 잠금·고른 보기·풀이 단계를 처음으로 되돌립니다(풀이·문제는 바뀐 그림으로 다시 계산). */
  const cfgChanged = (s) => { s.rlPick = -1; s.revealed = false; s.step = 1; };
  const syncSliders = (spec, s) => (spec.sliders || []).forEach((sl) => { s[sl.param] = s.cfg[sl.key]; });

  document.addEventListener('click', (e) => {
    const lab = window.lab;
    if (!lab || !lab.scene || !lab.scene.rl || !e.target.closest) return;
    const spec = lab.scene.rl, s = lab.s;
    const pk = e.target.closest('[data-rl-pick]');
    const nw = e.target.closest('[data-rl-new]');
    if (pk) {
      const ch = choicesOf(spec, s);
      s.rlPick = +pk.getAttribute('data-rl-pick');
      if (s.rlPick === ch.correct) s.revealed = true;
      lab.invalidate(true);
    } else if (nw) {
      s.rlSeed = (s.rlSeed || 1) + 1;
      const rng = rngOf(hash(spec.id + ':' + s.rlSeed));
      s.cfg = spec.reroll(probCfg(spec, s), rng);
      syncSliders(spec, s);
      s.rlT = 0; s.playing = false; s.part = null;
      cfgChanged(s);
      lab._tween = null;
      lab._buildPanel();
      lab.invalidate(true);
    }
  });

  /* ======================= 8. 장면 정의(교과서 그림 6가지 + 확장) ======================= */
  const len = (a, b2, v) => `$\\overline{\\mathrm{${a}${b2}}}=${v}\\,\\mathrm{cm}$`;
  const GUIDE_TAIL = ' 그림 안의 이름표, 반지름 r, 중심각을 함께 읽어 보세요. 길이의 단위는 cm예요.';
  const rd = (x, step) => Math.round(x / step) * step;

  // 점 C 중심 회전: 변형 목록 (모두 ∠A=90°, AC=d, 주어진 각은 ∠ACB(at:C) 또는 ∠ABC(at:B))
  const TURN_VARS = {
    C: [{ d: 9, deg: 60 }, { d: 6, deg: 30 }, { d: 6, deg: 60 }, { d: 10, deg: 45 }, { d: 12, deg: 45 }, { d: 8, deg: 60 }],
    B: [{ d: 8, deg: 45 }, { d: 6, deg: 45 }, { d: 6, deg: 60 }, { d: 9, deg: 30 }, { d: 12, deg: 30 }, { d: 10, deg: 45 }]
  };
  const turnSpec = (id, at, base, title, short, baseChoices) => ({
    id, shape: 'turn', title, short, base: { d: base.d, at, deg: base.deg, track: 2, rolls: 1 }, primeLast: true,
    baseChoices: baseChoices.map(numOpt), probOK: (c) => c.track === 2,
    sliders: [
      { param: 'rlTd', key: 'd', min: 4, max: 12, step: 1, label: 'AC의 길이', fmt: (v) => `${Math.round(v)} cm` },
      at === 'C'
        ? { param: 'rlTc', key: 'deg', min: 20, max: 75, step: 5, label: '∠ACB의 크기', fmt: (v) => `${Math.round(v)}°` }
        : { param: 'rlTb', key: 'deg', min: 20, max: 70, step: 5, label: '∠ABC의 크기', fmt: (v) => `${Math.round(v)}°` }
    ],
    hdls: [{
      i: 2,
      patch: (x, y, c) => {
        if (at === 'B') return { deg: clamp(rd(Math.atan2(y, x) / D2R, 5), 20, 70) };
        const cx = c.d / Math.cos(c.deg * D2R), dx = cx - x;
        return { d: clamp(Math.round(Math.hypot(dx, y)), 4, 12), deg: clamp(rd(Math.atan2(y, dx) / D2R, 5), 20, 75) };
      }
    }],
    question: '직각삼각형 ABC를 점 C를 중심으로 회전시켜 점 A가 직선 l 위의 점 A′에 오게 하면, 점 A는 얼마만큼 움직일까?',
    guide: () => `점 C를 중심으로 삼각형을 돌리면 점 A는 <b>점 C를 중심으로 하는 호</b>를 그리며 직선 <i>l</i> 위의 점 A′에 도착해요. 반지름은 <b>AC</b>이고, 중심각은 <b>∠ACB와 합해서 180°</b>(한 직선 위의 각)가 되는 만큼이에요. ` + (at === 'C' ? '∠ACB의 크기와 AC의 길이를 바꿔 보세요.' : '∠ABC의 크기와 AC의 길이를 바꿔 보세요. (∠ACB는 직접 구해야 해요)') + GUIDE_TAIL,
    infoSteps: (M) => {
      const c = M.cfg, out = [];
      const g = c.at === 'C' ? c.deg : 90 - c.deg;
      if (c.at === 'B') out.push(`먼저 ∠ACB를 구한다. 삼각형의 세 각의 크기의 합은 180°이고 ∠A=90°이므로 ∠ACB = 180° − 90° − ${c.deg}° = ${g}°이다.`);
      out.push(`점 A′이 직선 l 위에 오므로 ∠ACB와 중심각을 합하면 180°(한 직선 위의 각)이다. 따라서 중심각은 180° − ${g}° = ${180 - g}°이다.`);
      return out;
    },
    statement: (c) => `오른쪽 그림과 같이 직각삼각형 ABC를 직선 $l$ 위에서 점 C를 중심으로 점 A가 점 A′에 오도록 회전시켰다. ${len('A', 'C', c.d)}, $${c.at === 'C' ? '\\angle \\mathrm{ACB}' : '\\angle \\mathrm{ABC}'}=${c.deg}^\\circ$일 때, 점 A가 움직인 거리는?`,
    reroll: (cur, rng) => {
      const pool = TURN_VARS[at].filter((v) => !(v.d === cur.d && v.deg === cur.deg));
      return { ...pick(rng, pool), at, track: 2, rolls: 1 };
    },
    chips: () => TURN_VARS[at].slice(0, 3).map((v) => ({ label: `AC=${v.d} cm, ${at === 'C' ? '∠ACB' : '∠ABC'}=${v.deg}°`, patch: { ...v } })),
    trackChips: true, rollChips: 0,
    notes: '<ul><li><b>중심각은 도형의 각이 아니에요.</b> 점 A가 직선 위에 오도록 돌아간 각이라서, ∠ACB와 합하면 180°가 되는 각이에요.</li><li><b>반지름은 회전의 중심에서 움직이는 점까지의 거리</b>예요. 여기서는 AC의 길이예요.</li><li>∠ACB가 바로 주어지지 않으면(∠ABC=45°처럼) 삼각형의 세 각의 합이 180°임을 이용해 ∠ACB부터 구해요.</li></ul>'
  });

  const SPECS = [
    /* ---------- 예제 2 : 직사각형 ---------- */
    {
      id: 'rl-rect', shape: 'rect', title: '직사각형을 굴릴 때 점이 움직인 거리', short: '직사각형 (예제)',
      base: { w: 3, h: 4, track: 0, rolls: 3 }, baseChoices: null,
      sliders: [
        { param: 'rlW', key: 'w', min: 2, max: 8, step: 1, label: 'AB의 길이', fmt: (v) => `${Math.round(v)} cm` },
        { param: 'rlH', key: 'h', min: 2, max: 8, step: 1, label: 'AD의 길이', fmt: (v) => `${Math.round(v)} cm` }
      ],
      hdls: [{ i: 2, patch: (x, y) => ({ w: clamp(Math.round(x), 2, 8), h: clamp(Math.round(y), 2, 8) }) }],
      question: '직사각형 ABCD를 직선 l 위에서 회전시키면 점 A는 어떤 길을 따라 움직일까? 그 길이는 얼마일까?',
      guide: (M) => `<b>굴리기</b>를 눌러 직사각형이 직선 <i>l</i> 위를 굴러가는 모습을 보세요. 한 번 회전할 때마다 직사각형은 한 꼭짓점(<b>회전의 중심</b>)을 중심으로 90°씩 돌아가고, 점 ${M.names[M.T]}는 그 중심을 중심으로 하는 <b>부채꼴의 호</b>를 그려요. AB, AD의 길이를 바꾸면 반지름과 합이 바로 다시 계산돼요. 대각선(BD)이 정수가 아니면 &lsquo;≈&rsquo;로 표시돼요.` + GUIDE_TAIL,
      statement: (c) => `오른쪽 그림과 같이 직사각형 ABCD를 직선 $l$ 위에서 회전시켰다. ${len('A', 'B', c.w)}, ${len('A', 'D', c.h)}, ${len('B', 'D', Math.hypot(c.w, c.h))}일 때, 점 ${'ABCD'[c.track]}가 움직인 거리를 구하시오.`,
      reroll: (cur, rng) => {
        const z = pick(rng, [[3, 4], [4, 3], [6, 8], [8, 6]].filter((q) => !(q[0] === cur.w && q[1] === cur.h)));
        return { w: z[0], h: z[1], track: pick(rng, [0, 0, 1, 2, 3]), rolls: 3 };
      },
      chips: () => [[3, 4], [4, 3], [6, 8], [8, 6]].map((z) => ({ label: `AB=${z[0]}, AD=${z[1]}`, patch: { w: z[0], h: z[1] } })),
      trackChips: true, rollChips: 4,
      notes: '<ul><li><b>반지름은 회전의 중심에서 움직이는 점까지의 거리</b>예요. 직사각형에서는 변이 아니라 <b>대각선</b>이 반지름일 때도 있어요(㉡).</li><li><b>중심각은 도형의 각이 아니라 &lsquo;돌아간 각&rsquo;</b>이에요. 돌아간 각 = 180° − (회전의 중심이 되는 꼭짓점의 내각).</li><li><b>회전의 중심이 되는 점은 그 회전에서 움직이지 않아요.</b> 그때는 호가 생기지 않으니 더하지 않아요.</li><li>호의 길이는 <b>2πr × ($\\dfrac{\\text{중심각}}{360}$)</b>이에요. 원 전체(2πr)를 그대로 쓰지 않도록 조심해요.</li></ul>'
    },
    /* ---------- 연습문제 2-1 : 정삼각형 ---------- */
    {
      id: 'rl-tri', shape: 'tri', title: '정삼각형을 굴릴 때 점이 움직인 거리', short: '정삼각형',
      base: { a: 3, track: 0, rolls: 2 }, baseChoices: [2, 3, 4, 5, 6].map(numOpt),
      sliders: [{ param: 'rlA', key: 'a', min: 2, max: 8, step: 1, label: '한 변의 길이', fmt: (v) => `${Math.round(v)} cm` }],
      hdls: [{ i: 1, patch: (x) => ({ a: clamp(Math.round(x), 2, 8) }) }],
      question: '한 변의 길이가 3 cm인 정삼각형 ABC를 직선 l 위에서 회전시키면 점 A가 지나간 길은 어떤 모양일까?',
      guide: (M) => `정삼각형은 한 번 회전할 때마다 한 꼭짓점을 중심으로 <b>120°</b>씩 돌아가요. (정삼각형의 한 각은 60°이므로 돌아가는 각은 180° − 60° = 120°) 점 ${M.names[M.T]}가 그리는 호의 중심각이 모두 120°인지 확인하고, 한 변의 길이를 바꿔 보세요.` + GUIDE_TAIL,
      statement: (c) => `다음 그림과 같이 한 변의 길이가 ${c.a} cm인 정삼각형 ABC를 직선 $l$ 위에서 회전시켰을 때, 점 ${'ABC'[c.track]}가 움직인 거리는?`,
      reroll: (cur, rng) => ({ a: pick(rng, [2, 3, 4, 5, 6].filter((x) => x !== cur.a)), track: pick(rng, [0, 0, 1, 2]), rolls: 2 }),
      chips: () => [], trackChips: true, rollChips: 3,
      notes: '<ul><li><b>정삼각형을 굴릴 때 중심각은 60°가 아니라 120°</b>예요. 도형의 내각(60°)이 아니라 돌아간 각이기 때문이에요.</li><li>회전의 중심이 되는 점은 움직이지 않아요. 호의 개수를 세어 보세요.</li></ul>'
    },
    /* ---------- 연습문제 2-2 : 직각삼각형 ---------- */
    {
      id: 'rl-rtri', shape: 'rtri', title: '직각삼각형을 굴릴 때 점이 움직인 거리', short: '직각삼각형',
      base: { a: 3, beta: 60, track: 0, rolls: 2 }, baseChoices: [6, 6.5, 7, 7.5, 8].map(numOpt),
      sliders: [
        { param: 'rlRa', key: 'a', min: 2, max: 6, step: 1, label: 'BC의 길이', fmt: (v) => `${Math.round(v)} cm` },
        { param: 'rlRb', key: 'beta', min: 30, max: 75, step: 5, label: '∠ABC의 크기', fmt: (v) => `${Math.round(v)}°` }
      ],
      hdls: [{ i: 1, patch: (x) => ({ a: clamp(Math.round(x), 2, 6) }) }, { i: 2, patch: (x, y, c) => ({ beta: clamp(rd(Math.atan2(y, c.a) / D2R, 5), 30, 75) }) }],
      question: '직각삼각형은 꼭짓점마다 내각이 달라요. 돌아가는 각(중심각)도 달라질까?',
      guide: (M) => `직각삼각형은 꼭짓점마다 내각이 달라서 돌아가는 각도 달라요. ` + M.names.map((nm, i) => `점 ${nm}를 중심으로는 ${rTxt(M.ext[i])}°`).join(', ') + ` 돌아가요. BC의 길이와 ∠ABC의 크기를 바꾸면 반지름과 중심각이 바로 다시 계산돼요.` + GUIDE_TAIL,
      statement: (c) => `다음 그림과 같이 직각삼각형 ABC를 직선 $l$ 위에서 회전시켰다. ${len('A', 'B', rTxt(c.a / Math.cos(c.beta * D2R)))}, ${len('B', 'C', c.a)}, $\\angle \\mathrm{ABC}=${c.beta}^\\circ$일 때, 점 B가 움직인 거리는?`,
      reroll: (cur, rng) => ({ a: pick(rng, [2, 3, 4, 6].filter((x) => x !== cur.a)), beta: 60, track: 0, rolls: 2 }),
      chips: () => [], trackChips: true, rollChips: 3,
      notes: '<ul><li><b>중심각은 꼭짓점마다 달라요.</b> 돌아간 각 = 180° − (회전의 중심이 되는 꼭짓점의 내각)이에요. 점 C에서는 180° − 90° = 90°, 점 A에서는 180° − 30° = 150°예요.</li><li>회전의 중심이 되는 점의 호는 없어요. 점 B가 중심일 때는 B가 움직이지 않아요.</li></ul>'
    },
    /* ---------- 18번 : 점 C 중심 회전 (두 가지) ---------- */
    turnSpec('rl-turn60', 'C', { d: 9, deg: 60 }, '점 C를 중심으로 회전시킬 때 (∠ACB가 주어질 때)', '점 C 중심 회전 ①', [3, 6, 9, 12, 15]),
    turnSpec('rl-turn45', 'B', { d: 8, deg: 45 }, '점 C를 중심으로 회전시킬 때 (∠ABC가 주어질 때)', '점 C 중심 회전 ②', [3, 4, 5, 6, 8]),
    /* ---------- 19번 17 : 반원 ---------- */
    {
      id: 'rl-semi', shape: 'semi', title: '반원을 굴릴 때 중심이 움직인 거리', short: '반원 굴리기',
      base: { R: 9, rolls: 3 },
      baseChoices: [{ tex: '9\\pi', v: 9 }, { tex: '(9\\pi+18)', v: 9 + 18 / Math.PI }, { tex: '18\\pi', v: 18 }, { tex: '(18\\pi+18)', v: 18 + 18 / Math.PI }, { tex: '27\\pi', v: 27 }],
      genChoices: (M) => { const R = M.cfg.R; return [{ tex: `${R}\\pi`, v: R }, { tex: `(${R}\\pi+${2 * R})`, v: R + (2 * R) / Math.PI }, { tex: `${2 * R}\\pi`, v: 2 * R }, { tex: `(${2 * R}\\pi+${2 * R})`, v: 2 * R + (2 * R) / Math.PI }, { tex: `${3 * R}\\pi`, v: 3 * R }]; },
      sliders: [{ param: 'rlSR', key: 'R', min: 3, max: 12, step: 1, label: '반원의 반지름', fmt: (v) => `${Math.round(v)} cm` }],
      hdls: [{ i: 'B', patch: (x) => ({ R: clamp(Math.round(x / 2), 3, 12) }) }],
      question: '반원을 직선 l 위에서 회전시키면 중심 O는 어떤 길을 따라 움직일까? 곧은 선이 되는 구간도 있을까?',
      guide: () => `반원은 세 번에 걸쳐 굴러가요. <b>㉠</b> 끝점 B를 중심으로 90° 돌아 일어서고, <b>㉡</b> 둥근 부분으로 굴러가는 동안 중심 O는 <b>가로로 곧게</b> 움직이고(굴러간 호의 길이만큼), <b>㉢</b> 끝점 A를 중심으로 90° 돌아 다시 눕습니다. 반지름을 바꿔 보세요.` + GUIDE_TAIL,
      overview: () => [
        '해결 전략 ① 중심 O가 움직인 자취를 실제로 그려 본다. 반원은 끝점 B를 중심으로 돌고(호), 둥근 부분으로 굴러가고(곧은 선), 끝점 A를 중심으로 다시 돈다(호).',
        '해결 전략 ② 각 부분의 반지름과 중심각을 구해 호의 길이를 구한다. 점 O가 움직인 거리는 ㉠, ㉡, ㉢의 길이의 합과 같다.'
      ],
      statement: (c) => `다음 그림과 같이 반지름의 길이가 ${c.R} cm인 반원 O를 직선 $l$ 위에서 회전시켰을 때, 중심 O가 움직인 거리는?`,
      reroll: (cur, rng) => ({ R: pick(rng, [4, 5, 6, 8, 10, 12].filter((x) => x !== cur.R)), rolls: 3 }),
      chips: () => [4, 6, 9, 12].map((R) => ({ label: `반지름 ${R} cm`, patch: { R } })),
      trackChips: false, rollChips: 0,
      notes: '<ul><li><b>반원이 둥근 부분으로 굴러갈 때</b> 중심 O는 곡선이 아니라 <b>가로로 곧게</b> 움직여요. 움직인 거리는 굴러간 호의 길이(반지름 r, 중심각 180°)와 같아요.</li><li>끝점을 중심으로 돌 때는 O가 반지름 r, 중심각 90°인 부채꼴의 호를 그려요.</li><li>세 부분을 모두 더해야 해요. 하나라도 빠뜨리면 틀려요.</li></ul>'
    },
    /* ---------- 확장 : 정사각형 ---------- */
    {
      id: 'rl-square', shape: 'square', title: '[확장] 정사각형을 굴릴 때 점이 움직인 거리', short: '[확장] 정사각형',
      base: { a: 4, track: 2, rolls: 3 }, baseChoices: [2, 3, 4, 5, 6].map(numOpt),
      sliders: [{ param: 'rlS', key: 'a', min: 2, max: 8, step: 1, label: '한 변의 길이', fmt: (v) => `${Math.round(v)} cm` }],
      hdls: [{ i: 2, patch: (x, y) => ({ a: clamp(Math.round((x + y) / 2), 2, 8) }) }],
      question: '정사각형을 회전시킬 때, 점 C가 회전의 중심이 되면 점 C는 어떻게 될까?',
      guide: (M) => `정사각형은 한 번 회전할 때마다 90°씩 돌아가요. 점 ${M.names[M.T]}가 회전의 중심이 되는 때에는 움직이지 않아요. 점 A나 D를 골라 보면 <b>대각선</b>이 반지름이 되는 호도 나타나요(그 길이는 중3에서 배우는 √ 가 필요해 &lsquo;≈&rsquo;로 표시돼요).` + GUIDE_TAIL,
      statement: (c) => `한 변의 길이가 ${c.a} cm인 정사각형 ABCD를 직선 $l$ 위에서 오른쪽으로 ${rollPhrase(c.rolls)} 회전시켰을 때, 점 ${'ABCD'[c.track]}가 움직인 거리는?`,
      reroll: (cur, rng) => {
        const combo = pick(rng, [[2, 3], [2, 3], [2, 2], [0, 1], [1, 2], [2, 1]]);
        return { a: pick(rng, [2, 3, 4, 5, 6].filter((x) => x !== cur.a)), track: combo[0], rolls: combo[1] };
      },
      chips: () => [], trackChips: true, rollChips: 4,
      notes: '<ul><li>점 C가 회전의 중심이 되는 회전에서는 점 C가 움직이지 않아요.</li><li>정사각형의 한 각은 90°이므로 돌아가는 각(중심각)은 180° − 90° = 90°예요.</li></ul>'
    }
  ];

  /* ======================= 9. 조절 막대(값) — 장면마다 크기·각을 직접 바꿀 수 있습니다 ======================= */
  const PARAMS = {
    rlT: {
      value: 0, min: 0, max: 1, step: 0.001, color: 'amber', label: '굴러간 정도',
      hint: '막대를 끌거나, 그림 아래쪽 손잡이를 끌어서 도형을 굴려 보세요',
      format: (v, s) => {
        const N = (s && s.cfg && s.cfg.rolls) || 1, u = v * N;
        if (u <= 0.001) return '굴리기 전';
        if (u >= N - 0.001) return `${N}번 회전 끝`;
        return `${Math.floor(u) + 1}번째 회전 ${Math.round((u - Math.floor(u)) * 100)}%`;
      }
    }
  };
  SPECS.forEach((spec) => (spec.sliders || []).forEach((sl) => {
    if (PARAMS[sl.param]) return;
    PARAMS[sl.param] = {
      value: spec.base[sl.key], min: sl.min, max: sl.max, step: sl.step, color: 'sky', label: sl.label, hint: sl.hint, format: sl.fmt,
      onInput: (s) => { s.cfg = { ...s.cfg, [sl.key]: s[sl.param] }; cfgChanged(s); } // 반지름·합·풀이·문제가 바로 다시 계산됩니다
    };
  }));
  function ensureParams(lab) {
    if (!lab || !lab.params) return;
    Object.keys(PARAMS).forEach((k) => {
      if (!lab.params[k]) lab.params[k] = { ...PARAMS[k] };
      if (lab.s[k] == null) lab.s[k] = PARAMS[k].value;
    });
  }

  /* ======================= 10. 장면 조립 ======================= */
  const FORMULA = '<p><b>호의 길이</b> $l=2\\pi r\\times\\dfrac{x}{360}$ <span style="color:var(--text-3)">(r: 반지름, x: 중심각의 크기)</span></p><p><b>돌아가는 각(중심각)</b> = 180° − (회전의 중심이 되는 꼭짓점의 내각)</p><p><b>점이 움직인 거리</b> = 각 회전에서 생긴 호의 길이를 모두 더한 값</p>';
  const FORMULA_SEMI = '<p><b>호의 길이</b> $l=2\\pi r\\times\\dfrac{x}{360}$ <span style="color:var(--text-3)">(r: 반지름, x: 중심각의 크기)</span></p><p><b>끝점을 중심으로 돌 때</b> 중심 O는 반지름 r, 중심각 90°인 호를 그려요.</p><p><b>둥근 부분으로 굴러갈 때</b> 중심 O는 가로로 곧게 움직이고, 그 거리 = 굴러간 호의 길이 (반지름 r, 중심각 180°)</p>';
  const RULE = '회전의 중심이 되는 점은 그 회전에서 움직이지 않는다. 점이 움직인 거리는 점이 그린 부채꼴 호의 길이의 합이다.';
  const RULE_SEMI = '반원의 중심 O가 움직인 거리 = 끝점을 중심으로 돈 두 호의 길이 + 굴러간 호의 길이.';
  const NARROW_KFIT = 22; // 맞춤 배율(px/cm)이 이보다 작으면(작은 화면·긴 길) 지금 일어나는 회전만 크게 따라가며 보여 줍니다.

  /** 다른 장면의 상태가 섞여 들어와도(모든 장면 미리보기 등) 이 장면 조건이 아니면 기본 조건을 씁니다. */
  const cfgOf = (spec, s) => (s && s.cfg && Object.keys(spec.base).every((k) => k in s.cfg) ? s.cfg : spec.base);

  function buildScene(spec) {
    const resetRun = (s, play) => { s.rlT = 0; s.rlHold = 0; s.playing = !!play; s.part = null; };
    const setCfg = (s, lab, patch) => {
      s.cfg = { ...s.cfg, ...patch };
      syncSliders(spec, s);
      resetRun(s, true);
      cfgChanged(s);
      if (lab) { lab._tween = null; lab._buildPanel(); }
    };
    return {
      id: spec.id, title: spec.title, short: spec.short, rl: spec,
      question: spec.question,
      focus: (s) => focusOf(buildModel(spec, cfgOf(spec, s))),
      enter: (s, lab) => {
        ensureParams(lab);
        s.cfg = { ...spec.base };
        s.rlSeed = 1; s.rlPick = -1;
        resetRun(s, !!(lab && s === lab.s));
        syncSliders(spec, s);
      },
      controls: () => ['rlT'].concat((spec.sliders || []).map((sl) => sl.param)),
      presets: (s) => {
        const cfg = s.cfg || spec.base, M = buildModel(spec, cfg), out = [];
        if (spec.trackChips) {
          M.names.map((nm, i) => ({ nm, i })).sort((x, y) => (x.nm < y.nm ? -1 : 1)).forEach(({ nm, i }) => {
            if (spec.shape === 'turn' && !(nm === 'A' || nm === 'B')) return;
            out.push({ group: '움직임을 볼 점', label: `점 ${nm}`, apply: (st, lab) => setCfg(st, lab, { track: i }), on: (st) => st.cfg.track === i });
          });
        }
        (spec.chips ? spec.chips() : []).forEach((c) => out.push({ group: '크기·조건 바꾸기', label: c.label, apply: (st, lab) => setCfg(st, lab, c.patch), on: (st) => Object.keys(c.patch).every((k) => st.cfg[k] === c.patch[k]) }));
        if (spec.rollChips) {
          for (let i = 1; i <= spec.rollChips; i++) out.push({ group: '회전시키는 횟수', label: `${i}번`, apply: (st, lab) => setCfg(st, lab, { rolls: i }), on: (st) => st.cfg.rolls === i });
        }
        const N = M.N;
        for (let i = 0; i <= N; i++) {
          out.push({
            group: '단계별로 회전시키기', label: i === 0 ? '처음' : N === 1 ? '회전 끝' : `${i}번째 회전`,
            apply: (st, lab) => { st.playing = false; lab.tween({ rlT: i / N }, 750); }, on: (st) => Math.abs(st.rlT - i / N) < 0.002
          });
        }
        return out;
      },
      actions: () => [
        { id: 'play', play: true, primary: true, icon: (s) => (s.playing ? 'pause' : 'play'), label: (s) => (s.playing ? '멈추기' : s.rlT >= 0.999 ? '다시 굴리기' : '굴리기'), on: (s) => s.playing, run: (s) => { if (s.rlT >= 0.999) s.rlT = 0; s.playing = !s.playing; s.rlHold = 0; } },
        { id: 'reset', icon: 'reset', label: '처음으로', run: (s) => { s.playing = false; s.rlT = 0; s.rlHold = 0; } }
      ],
      tick: (s, dt, lab) => {
        if (!s.playing) return false;
        if (lab && lab.tab !== 'explore') { s.playing = false; return false; }
        const M = buildModel(spec, s.cfg), N = M.N;
        if (s.rlHold > 0) { s.rlHold -= dt; return true; }
        let u = s.rlT * N;
        const k0 = Math.floor(u + 1e-9);
        u += dt / (ROT_SEC * (M.rots[Math.min(k0, N - 1)].dur || 1));
        const k1 = Math.floor(u + 1e-9);
        if (u >= N) { u = N; s.playing = false; }
        else if (k1 > k0) { u = k1; s.rlHold = 0.45; }
        s.rlT = u / N;
        return true;
      },
      steps: (s) => stepList(spec, buildModel(spec, cfgOf(spec, s))).map((x) => x.text),
      view: (s, lab) => {
        const sc = scenario(spec, s, lab, false);
        const M = sc.M, N = M.N, T = M.names[M.T];
        const arcFr = (rt) => sc.fracs[rt.i];
        const done = M.arcs.filter((rt) => arcFr(rt) >= 1 - 1e-9);
        const dist = M.arcs.reduce((t, rt) => t + Math.PI * rt.coef * arcFr(rt), 0);
        const i = Math.min(sc.k, N - 1), rt = M.rots[i], P = rt.pname;
        const finished = sc.k >= N;
        const live = finished ? rt.theta : Math.round(rt.theta * sc.f);
        const col = rt.arc >= 0 ? ARC_COL[rt.arc % ARC_COL.length] : 'muted';
        const roll = rt.kind === 'roll';
        const reads = [
          { label: '지금 회전하는 중', value: sc.u <= 0 ? `${N}번 중 0번` : finished ? `${N}번 중 ${N}번 (끝)` : `${N}번 중 ${sc.k + 1}번째`, note: roll ? '반원이 둥근 부분으로 굴러가요' : `회전의 중심: 점 ${P}`, color: 'amber' },
          rt.arc >= 0
            ? { label: roll ? '반지름 r (굴러가는 호)' : `반지름 r (점 ${T}~점 ${P})`, value: `${toFrac(rt.r) ? rTxt(rt.r) : '약 ' + rTxt(rt.r)} cm`, note: `${JAMO[rt.arc]}의 반지름`, color: col }
            : { label: `반지름 r (점 ${T}~점 ${P})`, value: '0 cm', note: `점 ${T}가 회전의 중심 → 움직이지 않아요`, color: 'muted' },
          { label: '중심각', value: rt.arc >= 0 ? `${live}°` : '—', note: rt.arc >= 0 ? (roll ? `굴러간 호의 중심각 (끝나면 ${rt.theta}°)` : `돌아가는 각 (끝나면 ${rt.theta}°)`) : '호가 없어요', color: col },
          { label: `지금까지 점 ${T}가 움직인 거리`, value: `${dist.toFixed(2)} cm`, note: done.length ? `끝난 부분의 합 = ${sumPlain(done.map((d) => d.coef))}` : '아직 끝난 부분이 없어요', color: 'rose', wide: true }
        ];
        const parts = M.arcs.map((a) => ({
          id: a.arc, name: `${JAMO[a.arc]} 반지름 ${rTxt(a.r)} cm · 중심각 ${a.theta}°`, desc: a.kind === 'roll' ? '굴러가는 동안 가로로 곧게 움직인 거리' : `점 ${a.pname}가 중심`, value: coefPlain(a.coef), color: ARC_COL[a.arc % ARC_COL.length]
        }));
        // 띠(움직인 거리를 한 줄로 이어 붙인 모양)
        const segsOf = (fracOf) => M.arcs.filter((a) => fracOf(a) > 0).map((a) => ({
          text: fracOf(a) >= 1 - 1e-9 ? `${JAMO[a.arc]} ${coefPlain(a.coef)}` : JAMO[a.arc], weight: Math.round(a.coef * fracOf(a) * 100) / 100, color: ARC_COL[a.arc % ARC_COL.length]
        }));
        const sumAll = sumPlain(M.arcs.map((a) => a.coef));
        let tape;
        if (sc.tab === 'review') {
          tape = { title: sc.item && sc.item.type === 'total' ? `점 ${T}가 움직인 거리 = ${sumAll} cm` : `점 ${T}가 움직인 거리 = 길이의 합`, segments: segsOf((a) => sc.fracs[a.i]) };
        } else if (sc.tab === 'problem') {
          tape = sc.plain ? null : { title: `점 ${T}가 움직인 거리 = ${sumAll} cm`, segments: segsOf(() => 1) };
        } else {
          const allDone = done.length === M.arcs.length && finished;
          tape = { title: allDone ? `점 ${T}가 움직인 거리 = ${sumAll} cm` : `점 ${T}가 움직인 거리 (한 줄로 이어 붙인 모양)`, segments: segsOf((a) => sc.fracs[a.i]) };
        }
        const status = sc.tab === 'explore'
          ? { tone: 'info', text: sc.u <= 0 ? (spec.hdls ? '파란 점을 끌어 모양을 바꿔 보세요' : `점 ${T}는 처음 자리에 있어요`) : finished ? `${N}번 회전했어요` : roll ? `${sc.k + 1}번째 · 반원이 굴러가요` : `${sc.k + 1}번째 회전 · 점 ${P}가 회전의 중심` }
          : null;
        const semi = spec.shape === 'semi';
        return {
          guide: spec.guide(M),
          readouts: reads, parts,
          summary: finished || sc.tab !== 'explore' ? `점 ${T}가 움직인 거리 = ${sumAll} cm` : null,
          chips: [{ k: '호의 길이', tex: 'l=2\\pi r\\times\\dfrac{x}{360}', color: 'sky' }],
          status, tape,
          formula: semi ? FORMULA_SEMI : FORMULA, rule: semi ? RULE_SEMI : RULE, notes: spec.notes
        };
      },
      draw: (b, s, v, lab) => {
        const thumb = !!b.thumb;
        const sc = scenario(spec, s, lab, thumb);
        const full = focusOf(sc.M);
        if (!thumb) {
          const key = sc.tab + JSON.stringify(sc.M.cfg);
          // 작은 화면에서 길이 너무 길면: 지금 일어나는 회전만 크게(부드럽게 따라가며)
          let target = full;
          const area = b._area(), pad = b.pad * Math.min(area.w, area.h);
          const kFit = Math.min((area.w - 2 * pad) / (full.x[1] - full.x[0]), (area.h - 2 * pad) / Math.abs(full.y[1] - full.y[0]));
          if (kFit < NARROW_KFIT) {
            const N = sc.M.N;
            if (sc.tab === 'explore' && sc.k < N) target = regionOf(sc.M, sc.k, sc.f);
            else if (sc.tab === 'review' && sc.item && sc.item.rot != null) target = regionOf(sc.M, sc.item.rot, 1);
          }
          if (b.__rlKey !== key && !s.dragging) { b.__rlKey = key; b.setFocus(target, true); }
          else if (b.focus !== target && !s.dragging) {
            const f0 = b.focus, e = 0.2;
            const mix = (a, c) => a + (c - a) * e;
            const nf = { x: [mix(f0.x[0], target.x[0]), mix(f0.x[1], target.x[1])], y: [mix(f0.y[0], target.y[0]), mix(f0.y[1], target.y[1])] };
            const diff = Math.abs(nf.x[0] - target.x[0]) + Math.abs(nf.x[1] - target.x[1]) + Math.abs(nf.y[0] - target.y[0]) + Math.abs(nf.y[1] - target.y[1]);
            if (diff < 0.02) b.focus = target;
            else { b.focus = nf; if (lab) lab.invalidate(); }
          }
        }
        paint(b, sc, spec, s);
      },
      problem: {
        tag: () => (spec.baseChoices ? '객관식 · 점이 움직인 거리' : '예제 · 점이 움직인 거리'),
        text: (s) => problemHTML(spec, s.cfg ? s : { ...s, cfg: spec.base, rlSeed: 1 }),
        answer: (s) => {
          const st = s.cfg ? s : { ...s, cfg: spec.base }, cfg = probCfg(spec, st), M = buildModel(spec, cfg), ch = choicesOf(spec, { ...st, rlSeed: s.rlSeed || 1 });
          return (ch.correct >= 0 ? `${CIRC[ch.correct]} ` : '') + `$${coefTex(M.total)}$ cm`;
        }
      }
    };
  }

  (window.APL_CS_GROUPS = window.APL_CS_GROUPS || []).push({
    order: 66, id: 'rolling', title: 'F06 점의 이동 — 굴리기', short: 'F06 굴리기', params: PARAMS,
    scenes: SPECS.map(buildScene)
  });
})();
