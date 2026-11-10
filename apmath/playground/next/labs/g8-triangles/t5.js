/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑤ 「외심」 (t5.js, order 50) — 장면 7개
   · o1 외심 O          · 세 변의 수직이등분선(중점 D·E·F)이 한 점 O에서 만남, OA=OB=OC=R
   · o2 직각삼각형의 외심 · 외심은 빗변의 중점, R = 빗변 ÷ 2
   · o3 30°-60°-90°      · 외심 O와 정삼각형 OBC
   · o4 외심에서의 각    · x+y+z=90°, ∠BOC=2∠A
   · o5 둔각삼각형의 외심 · 외심이 삼각형 바깥에 놓이고 ∠BOC=360°−2∠A
   · o6 중심각의 비      · ∠AOB:∠BOC:∠COA = a:b:c → ∠ACB=½∠AOB
   · o7 외접원의 둘레    · △OBC의 둘레와 BC로 R을 구하고 2πR
   각은 정수(도), 길이는 정수(cm)만 보입니다. 피타고라스 정리(√)는 쓰지 않습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, circumcenter } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;

  const PARAMS = {
    trOa: P('∠A', 45, 75, 1, 60, { color: 'sky', format: (v) => v + '°' }),
    trOb: P('∠B', 45, 75, 1, 65, { color: 'green', format: (v) => v + '°' }),
    trOr: P('외접원의 반지름 R', 3, 10, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    trPr: P('OA = OB = OC', 2, 7, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    trPa: P('∠A', 20, 70, 2, 50, { color: 'sky', format: (v) => v + '°' }),
    trQa: P('∠A', 100, 130, 2, 112, { color: 'amber', format: (v) => v + '°' }),
    trQb: P('∠B', 15, 40, 1, 25, { color: 'green', format: (v) => v + '°' }),
    trRa: P('a', 1, 6, 1, 2, { color: 'sky', format: (v) => String(v) }),
    trRb: P('b', 1, 6, 1, 3, { color: 'green', format: (v) => String(v) }),
    trRc: P('c', 1, 6, 1, 4, { color: 'amber', format: (v) => String(v) }),
    trSr: P('R', 3, 9, 1, 5, { color: 'amber', format: (v) => v + ' cm' }),
    trSa: P('BC', 2, 9, 1, 6, { color: 'sky', format: (v) => v + ' cm' })
  };

  // 단위원(반지름 1, 중심 O=원점) 위의 삼각형. A 위쪽, B 왼쪽, C 오른쪽. 각 A,B,C (도)
  function circGeom(Ad, Bd, Cd) {
    const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, -90 - 2 * Cd), Cc = polar(O, 1, -90 + 2 * Bd);
    const D = mid(B, Cc), E = mid(Cc, A), F = mid(A, B);
    return { O, A, B, C: Cc, D, E, F, a: Ad, b: Bd, c: Cd };
  }
  function drawCirc(b, g, o = {}) {
    const { O, A, B, C: Cc } = g;
    b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.7, dash: [6, 5] });
    fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
  }
  const RBOX = { x0: -1.25, x1: 1.25, y0: -1.2, y1: 1.2 };

  /* ====================================================================== 풀이 흐름 (탐구 · 문제 · 풀이) — 공용 도구 (t5·t6·t7 이 함께 씁니다)
     각 장면은 spec = { box, base, st:{단계키: (L,M,s,X)=>…}, x, top, legend, dyn? } 을 주면 runner 가 풀이 그림을 그려요.
     · 지금 단계(L.on=true)는 색으로, 앞 단계는 L 이 알아서 가는 회색(faded)으로 그려요. 그래서 「지금 단계만 색」 원칙이 자동으로 지켜져요.
     · X = { prob(문제 탭), at(단계), has(단계), xArc(구하는 x 에 호를 그릴지), xVal(x 를 값으로 바꿀지), nw(휴대폰) } */
  const SVB = (G.svB = (function () {
    const FD = G.faded;
    const lay = (b, on) => ({
      on,
      ln: (p, q, col, w = 3, o = {}) => (on ? G.line(b, p, q, col, w, o) : G.line(b, p, q, 'ink', Math.min(w, 1.8), { ...o, alpha: 0.32 })),
      fl: (pts, col, a) => { if (on) G.fillPoly(b, pts, col, a); },
      pl: (pts, col, w = 3, o = {}) => (on ? G.poly(b, pts, col, w, o) : G.poly(b, pts, 'ink', 1.8, { ...o, alpha: 0.32 })),
      ang: (V, A, B, o = {}) => (on ? G.ang(b, V, A, B, o) : o.noMark ? (o.keep && o.label ? G.ang(b, V, A, B, { noMark: true, label: o.label, labelDist: o.labelDist, labelRot: o.labelRot, size: o.size, color: 'ink', labelColor: 'ink', alpha: 0.5 }) : null) : FD(b, V, A, B, { r: o.r, rings: o.rings, label: o.keep ? o.label : undefined, labelDist: o.labelDist, labelRot: o.labelRot, size: o.size })),
      tk: (p, q, n, col) => G.tick(b, p, q, n, on ? col : 'ink'),
      tx: (p, str, o = {}) => { if (on) G.T(b, p, str, o); else if (o.keep) G.T(b, p, str, { ...o, color: 'ink', alpha: 0.5 }); },
      sd: (p, q, c, str, o = {}) => { if (on) G.sideTag(b, p, q, c, str, o); else if (o.keep) G.sideTag(b, p, q, c, str, { ...o, color: 'ink', alpha: 0.5 }); },
      dm: (p, q, c, str, o = {}) => { if (on) G.dim(b, p, q, c, str, o); else if (o.keep) G.dim(b, p, q, c, str, { ...o, color: 'ink' }); },
      circ: (c, r, col, w = 2.4, o = {}) => b.circle(c, r, on ? { color: col, width: w, ...o } : { color: 'ink', width: 1.6, alpha: 0.32, ...o })
    });
    function runner(spec) {
      return function (b, s, M, C, ST, idx) {
        const nw = b.W < 560, cur = idx >= 0 ? ST[idx] : null, f = cur ? cur.f : 'problem', K = cur ? cur.k : 'problem';
        const box = spec.box(M, s, b);
        const side = spec.padL || (nw ? 40 : 54);
        const padding = spec.padding ? spec.padding(b, M, s, idx) : { t: spec.padT || (nw ? 48 : 68), b: idx < 0 ? (nw ? 72 : 80) : (nw ? 126 : 132), l: side, r: side };
        G.fit(b, box, padding);
        const X = { b, idx, cur, f, K, prob: idx < 0, nw, lf: G.fs(b, 14), at: (n) => f === n, has: (n) => idx >= 0 && ST.slice(0, idx + 1).some((q) => q.f === n) };
        X.xArc = X.prob || f === 'given' || f === 'eq' || f === 'ans'; X.xVal = f === 'ans';
        if (spec.base) spec.base(b, M, s, X);
        const fnOf = (j) => spec.st[ST[j].f] || (spec.dyn && spec.dyn(ST[j].f, M, s));
        if (idx < 0) { if (spec.st.given) spec.st.given(lay(b, true), M, s, X); } else for (let j = 0; j <= idx; j++) { if (/^s\d$/.test(ST[j].f) && j !== idx) continue; const fn = fnOf(j); if (fn) fn(lay(b, j === idx), M, s, X, ST[j]); }
        if (spec.x) spec.x(b, M, s, X);
        if (spec.top) spec.top(b, M, s, X);
        // 그림 아래: 단계 설명 한 줄, 그 아래에 점 이름의 뜻
        const capSz = 15, plain = cur ? String(cur.cap).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2') : '', two = cur && G.textW(plain, G.fs(b, capSz)) * 1.1 > Math.max(180, b.W - 28);
        const p0 = G.pt((box.x0 + box.x1) / 2, box.y1);
        if (cur) G.solveCap(b, p0, cur, { dy: spec.captionDy ? spec.captionDy(X) : 52, size: capSz });
        const lg = spec.legend ? spec.legend(M, s, X) : '';
        if (lg) G.T(b, p0, lg, { dy: cur ? (two ? 106 : 80) : 52, size: G.fs(b, 14), color: 'ink', alpha: 0.8 });
      };
    }
    // 보기가 글인(참·거짓 판별) 문제: 발문 아래에 문장 ①~⑤ 를 보여 주고, 답은 글로 보여 줍니다.
    function listStmts(Q) {
      const ok = Q.choices.findIndex((c) => c.ok);
      const lines = Q.choices.map((c, i) => `<div class="tr-stmt" style="margin-top:6px">${G.NUM[i]} ${c.h}</div>`).join('');
      return { ...Q, html: `${G.esc(Q.stem).replace(/&amp;/g, '&')}<div class="tr-stmts" style="margin-top:6px">${lines}</div>`, ansHtml: `${G.NUM[ok]} ${Q.choices[ok].h}` };
    }
    // 문장 하나씩 확인하는 풀이 단계. pool 항목 = { h, f, w(M)→이유 글, c(M)→그림 아래 한 줄, d(L,M,s,X)→그림 }
    function stmtSteps(Q, pool, M, ask, s) {
      const out = [];
      const ok = Q.choices.findIndex((c) => c.ok);
      out.push({ k: 'given', f: 'given', t: `그림의 점과 조건을 먼저 확인하고, 보기 ①~⑤를 하나씩 그림에서 따져 봐요. ${ask ? '옳은' : '옳지 않은'} 것을 찾아요.`, cap: '보기 ①~⑤를 그림에서 하나씩 확인해요' });
      out.push({ k: 'idea', f: 'idea', t: '문장이 늘 참이려면 이유가 있어야 하고, 거짓이려면 맞지 않는 그림(반례)가 하나라도 있으면 돼요. 그래서 참이면 이유를, 거짓이면 반례를 그림에서 찾아요.', cap: '참 → 이유 · 거짓 → 반례' });
      Q.choices.forEach((c, i) => {
        const it = pool.find((p) => p.h === c.h), truth = it ? it.f(M) : true;
        out.push({ k: 'fig', f: 's' + i, lb: `${G.NUM[i]} 확인`, t: `${c.h} — ${truth ? '참' : '거짓'}. ${it ? it.w(M, s) : ''}`, cap: it ? it.c(M, s) : '', col: truth ? 'green' : 'rose' });
      });
      out.push({ k: 'ans', f: 'ans', t: `${ask ? '옳은' : '옳지 않은'} 것은 ${G.NUM[ok]}이에요. ${Q.choices[ok].h}`, cap: `${ask ? '옳은' : '옳지 않은'} 것: ${G.NUM[ok]}` });
      return out;
    }
    return { lay, runner, listStmts, stmtSteps };
  })());
  const stmtDyn = (pool, probFn) => (name, M, s) => {
    const m = /^s(\d)$/.exec(name); if (!m) return null;
    const Q = probFn(M, s), c = Q.choices[+m[1]], it = c && pool.find((p) => p.h === c.h);
    return it ? (L, M2, s2, X) => it.d(L, M2, s2, X) : null;
  };

  /* -------------------------------------------------------------------- 풀이 흐름: 장면별 풀이 (문제와 같은 상태·같은 숫자)
     원칙: 그림 안에는 점 이름만 · 지금 단계만 색(앞 단계는 회색) · 대칭으로 같은 쪽은 주어진 것에서만 진하게 · 좁은 각은 x 만 두고 값은 그림 아래 한 줄에 */
  const cBase = (b, g) => { b.circle(g.O, 1, { color: 'sky', width: 2.2, alpha: 0.6, dash: [6, 5] }); fillPoly(b, [g.A, g.B, g.C], 'sky', 0.07); poly(b, [g.A, g.B, g.C], 'ink', 3.4); };
  const cTop = (b, g, X, o = {}) => {
    const { O, A, B, C: Cc } = g;
    b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
    T(b, O, 'O', { dx: o.odx == null ? 12 : o.odx, dy: o.ody == null ? -10 : o.ody, size: 18, color: 'rose' });
    tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
  };
  // 각 x 의 글자: 값을 그림 안에 쓸 수 있는 크기(15° 이상)면 값, 아니면 x 만 (값은 그림 아래 한 줄에)
  const xLbl = (X, val, unit = '°') => (X.xVal && (unit !== '°' || val >= 15) ? `${val}${unit}` : 'x');

  // 각 라벨을 두 변 사이 이등분선에서 점 P 쪽(sgn=1) 또는 P 반대쪽(sgn=-1)으로 mag° 돌립니다 (부채꼴 안쪽에 머물게 반각-12° 를 넘지 않아요).
  const rotTo = (V, A, B, P, mag = 28, sgn = 1) => {
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x), TP = Math.PI * 2;
    const d = ((a1 - a0 + Math.PI * 3) % TP) - Math.PI, am = a0 + d / 2, ap = Math.atan2(P.y - V.y, P.x - V.x);
    const df = (((ap - am + Math.PI * 3) % TP) - Math.PI) / DEG, lim = Math.max(0, Math.abs(d) / DEG / 2 - 12);
    return sgn * (df >= 0 ? 1 : -1) * Math.min(mag, lim);
  };
  // P 방향 선(예: 외심과 꼭짓점을 잇는 선) 위에 라벨이 얹히지 않게, P 에서 먼 쪽으로 돌립니다 (P 가 이등분선에서 멀면 0)
  const awayRot = (V, A, B, P, mag = 30) => {
    const a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x), TP = Math.PI * 2;
    const d = ((a1 - a0 + Math.PI * 3) % TP) - Math.PI, am = a0 + d / 2, ap = Math.atan2(P.y - V.y, P.x - V.x);
    return Math.abs((((ap - am + Math.PI * 3) % TP) - Math.PI) / DEG) > 40 ? 0 : rotTo(V, A, B, P, mag, -1);
  };
  SVB.rotTo = rotTo;
  // 각 V(A·B 사이)의 라벨(이등분선에서 rotDeg 돌린 방향)이 선분 PQ 를 가로지르지 않도록 거리를 정해요: 선에 닿기 전이면 그 앞에, 아니면 선을 넘은 자리에 둡니다
  const lblAvoid = (b, V, A, B, rotDeg, P, Q, dmin = 30) => {
    const k = b.k || 60, a0 = Math.atan2(A.y - V.y, A.x - V.x), a1 = Math.atan2(B.y - V.y, B.x - V.x), d = ((a1 - a0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI, la = a0 + d / 2 + rotDeg * DEG;
    const ux = Math.cos(la), uy = Math.sin(la), ex = Q.x - P.x, ey = Q.y - P.y, den = ux * ey - uy * ex;
    if (Math.abs(den) < 1e-9) return 44;
    const t = ((P.x - V.x) * ey - (P.y - V.y) * ex) / den;
    if (t <= 0) return 44;
    const px = t * k;
    return px - 17 >= dmin ? px - 17 : px + 20;
  };

  // 좁은 각(약 25° 미만)의 x: 호는 그대로 두고 글자는 각 바깥에 두어 짧은 선으로 잇습니다. (값은 그림 아래 한 줄에)
  function xOut(b, V, P1, P2, label, o = {}) {
    const k = b.k || 60, a0 = Math.atan2(P1.y - V.y, P1.x - V.x), a1 = Math.atan2(P2.y - V.y, P2.x - V.x);
    let d = ((a1 - a0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    const far = d > 0 ? a1 : a0, sg = d > 0 ? 1 : -1, out = far + sg * (o.rot == null ? 30 : o.rot) * DEG, mid = a0 + d / 2, rr = (o.r || 30) / k, ll = (o.dist || 50) / k;
    const from = pt(V.x + Math.cos(mid) * (rr + 2 / k), V.y + Math.sin(mid) * (rr + 2 / k)), to = pt(V.x + Math.cos(out) * ll, V.y + Math.sin(out) * ll);
    ang(b, V, P1, P2, { color: 'amber', r: o.r || 30, noMark: !o.arc, fa: 0.3 });
    line(b, from, to, 'amber', 1.8);
    T(b, to, label, { dx: Math.cos(out) * 8, dy: Math.sin(out) * 8, size: o.size || 17, color: 'amber' });
  }

  SVB.stmtDyn = stmtDyn; SVB.xLbl = xLbl; SVB.xOut = xOut; // t6·t7 이 함께 씁니다

  // 짧은 문제·풀이 무대에서 중복 범례의 빈칸이 원래 도형을 축소하지 않게
  // 합니다. 점의 뜻은 바로 아래 발문에 남고 풀이 단계 설명도 유지합니다.
  // 이 설정은 아래에서 명시한 외심·내심 다섯 장면에만 적용합니다.
  const mobileQuestionFrame = (box, legend, smallBox = box) => ({
    box: (M, s, b) => {
      const value = b.W < 560 ? smallBox : box;
      return typeof value === 'function' ? value(M, s) : value;
    },
    padding: (b, M, s, idx) => b.W < 560
      ? { t: 30, b: idx < 0 ? 30 : 56, l: 38, r: 38 }
      : { t: 68, b: idx < 0 ? 80 : 132, l: 54, r: 54 },
    captionDy: (X) => X.nw ? 36 : 52,
    legend: (M, s, X) => X.nw ? '' : legend
  });
  const MOBILE_CIRCLE_BOX = { x0: -1.02, x1: 1.02, y0: -1.02, y1: 1.02 };
  SVB.mobileQuestionFrame = mobileQuestionFrame;

  /* ---------------------------------------------------------------- 1. 외심 */
  const O1POOL = [
    { h: '$\\overline{OA}=\\overline{OB}=\\overline{OC}$', f: () => true, w: () => '외심 O는 세 변의 수직이등분선의 교점이고, 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있어요.', c: () => 'OA=OB=OC (외접원의 반지름)', d: (L, M) => { const { O, A, B, C: Cc } = M.g; [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 3.6); }); L.tk(O, A, 2, 'rose'); L.tk(O, B, 2, 'rose'); L.tk(O, Cc, 2, 'rose'); } },
    { h: '$\\overline{BD}=\\overline{CD}$', f: () => true, w: () => '문제에서 D는 변 BC의 중점이라고 했어요.', c: () => 'D는 BC의 중점 → BD=CD', d: (L, M) => { const { B, C: Cc, D } = M.g; L.ln(B, D, 'amber', 5); L.ln(D, Cc, 'amber', 5); L.tk(B, D, 1, 'amber'); L.tk(D, Cc, 1, 'amber'); } },
    { h: '$\\overline{OD}\\perp\\overline{BC}$', f: () => true, w: () => 'OD는 변 BC의 수직이등분선의 일부라서 BC와 수직이에요.', c: () => 'OD는 BC의 수직이등분선 → 수직', d: (L, M) => { const { O, C: Cc, D } = M.g; L.ln(O, D, 'green', 4); L.ang(D, O, Cc, { color: 'green', r: 18 }); } },
    { h: '$\\angle OAB=\\angle OBA$', f: () => true, w: () => 'OA=OB이므로 △OAB는 이등변삼각형이고, 이등변삼각형의 두 밑각은 같아요.', c: () => 'OA=OB → 이등변삼각형 → 밑각이 같다', d: (L, M) => { const { O, A, B } = M.g; L.fl([O, A, B], 'amber', 0.14); L.ln(O, A, 'rose', 3.6); L.ln(O, B, 'rose', 3.6); L.tk(O, A, 2, 'rose'); L.tk(O, B, 2, 'rose'); L.ang(A, O, B, { color: 'amber', r: 30, fa: 0.4 }); L.ang(B, O, A, { color: 'amber', r: 30, fa: 0.4 }); } },
    { h: '$\\angle ODB=90^{\\circ}$', f: () => true, w: () => 'OD는 BC의 수직이등분선이라서 BC와 만나는 점 D에서 직각이에요.', c: () => '수직이등분선 → ∠ODB=90°', d: (L, M) => { const { O, B, D } = M.g; L.ln(O, D, 'green', 4); L.ang(D, O, B, { color: 'green', r: 18 }); } },
    { h: '$\\overline{OD}=\\overline{OE}$', f: (m) => Math.abs(dist(m.g.O, m.g.D) - dist(m.g.O, m.g.E)) < 1e-6, w: () => 'OD와 OE는 O에서 두 변까지의 거리인데, 삼각형의 모양에 따라 달라요. 이 그림에서도 OD와 OE의 길이가 달라요 (반례).', c: () => 'OD, OE의 길이가 서로 달라요 (반례)', d: (L, M) => { const { O, D, E } = M.g; L.ln(O, D, 'rose', 5); L.ln(O, E, 'rose', 5); L.tk(O, D, 1, 'rose'); L.tk(O, E, 2, 'rose'); } },
    { h: '$\\angle AOB=\\angle BOC$', f: (m) => m.c === m.a, w: (M) => `∠AOB=2∠C=${2 * M.c}°이고 ∠BOC=2∠A=${2 * M.a}°로 서로 달라요 (반례).`, c: (M) => `∠AOB=${2 * M.c}°, ∠BOC=${2 * M.a}° — 달라요`, d: (L, M) => { const { O, A, B, C: Cc } = M.g; L.ang(O, A, B, { color: 'rose', r: 26, label: dg(2 * M.c), size: 15, labelDist: 46 }); L.ang(O, B, Cc, { color: 'green', r: 26, label: dg(2 * M.a), size: 15, labelDist: 46 }); } },
    { h: '$\\overline{OA}=\\overline{AD}$', f: (m) => Math.abs(dist(m.g.O, m.g.A) - dist(m.g.A, m.g.D)) < 1e-6, w: () => 'OA는 반지름이고 AD는 꼭짓점에서 BC의 중점까지의 선분이에요. 두 길이는 서로 달라요 (반례).', c: () => 'OA와 AD의 길이가 달라요 (반례)', d: (L, M) => { const { O, A, D } = M.g; L.ln(O, A, 'rose', 5); L.ln(A, D, 'amber', 5); L.tk(O, A, 1, 'rose'); L.tk(A, D, 2, 'amber'); } },
    { h: '$\\angle OBC=\\angle OBA$', f: (m) => Math.abs(angBetween(m.g.B, m.g.O, m.g.C) - angBetween(m.g.B, m.g.O, m.g.A)) < 1e-6, w: (M) => `∠OBC=90°−∠A=${90 - M.a}°이고 ∠OBA=90°−∠C=${90 - M.c}°로 서로 달라요 (반례).`, c: (M) => `∠OBC=${90 - M.a}°, ∠OBA=${90 - M.c}° — 달라요`, d: (L, M) => { const { O, A, B, C: Cc } = M.g; L.ang(B, O, Cc, { color: 'green', r: 34, label: dg(90 - M.a), size: 15, labelDist: 56 }); L.ang(B, O, A, { color: 'rose', r: 34, label: dg(90 - M.c), size: 15, labelDist: 56 }); } },
    { h: '$\\overline{AB}=\\overline{BC}$', f: (m) => m.c === m.a, w: (M) => `AB는 ∠C=${M.c}°의 마주 변이고 BC는 ∠A=${M.a}°의 마주 변이에요. 두 각이 다르면 두 변도 길이가 달라요 (반례).`, c: (M) => `∠C=${M.c}°, ∠A=${M.a}° — AB, BC가 달라요`, d: (L, M) => { const { A, B, C: Cc } = M.g; L.ln(A, B, 'amber', 5); L.ln(B, Cc, 'sky', 5); L.tk(A, B, 1, 'amber'); L.tk(B, Cc, 2, 'sky'); } }
  ];
  const o1Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { R, z, a, b: bb, c } = M, out = [];
      if (v === 2) return SVB.stmtSteps(o1.prob(M, s), O1POOL, M, false, s);
      if (v === 0) {
        out.push({ k: 'given', f: 'given', t: `점 O는 △ABC의 외심이고 D, E, F는 각 변의 중점이에요. $\\overline{OA}=${R}$ cm일 때 $\\overline{OB}$의 길이 $x$를 구해요.`, cap: `OA=${R} cm, OB=x` });
        out.push({ k: 'idea', f: 'idea', t: '외심은 세 변의 수직이등분선이 만나는 점이에요. 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있으니까, 외심 O는 세 꼭짓점에서 똑같이 떨어져 있어요.', cap: '수직이등분선 위의 점 → 양 끝점까지 거리가 같다' });
        out.push({ k: 'fig', f: 'perp', lb: '수직이등분선', t: 'F는 $\\overline{AB}$의 중점이고 $\\overline{OF}\\perp\\overline{AB}$이므로 OF는 AB의 수직이등분선이에요. 그 위의 점 O는 두 끝점 A, B에서 같은 거리에 있으니 $\\overline{OA}=\\overline{OB}$.', cap: 'OF는 AB의 수직이등분선 → OA=OB' });
        out.push({ k: 'fig', f: 'rad', lb: '세 반지름', t: `같은 방법으로 $\\overline{OB}=\\overline{OC}$도 알 수 있어요. OA, OB, OC는 모두 외접원의 반지름이라 $\\overline{OA}=\\overline{OB}=\\overline{OC}=${R}$ cm.`, cap: `OA=OB=OC=${R} cm` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{OB}=\\overline{OA}=${R}$ cm`, cap: `x=OB=OA=${R} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${R}\\text{ cm}$`, cap: `x = ${R} cm` });
      } else {
        const aob = 180 - 2 * z;
        out.push({ k: 'given', f: 'given', t: `점 O는 △ABC의 외심이고 $\\angle AOB=${aob}^{\\circ}$예요. $\\angle OAB$의 크기 $x$를 구해요.`, cap: `∠AOB=${aob}°, ∠OAB=x` });
        out.push({ k: 'idea', f: 'idea', t: 'OA와 OB는 둘 다 외접원의 반지름이라 길이가 같아요. 길이가 같은 두 변이 있으니 △OAB는 이등변삼각형이고, 밑각 ∠OAB와 ∠OBA가 같아요.', cap: 'OA=OB (반지름) → △OAB 이등변 → 밑각이 같다' });
        out.push({ k: 'fig', f: 'rad', lb: '반지름', t: '외심 O에서 세 꼭짓점까지의 거리는 같아요. 그래서 $\\overline{OA}=\\overline{OB}$.', cap: 'OA=OB' });
        out.push({ k: 'fig', f: 'iso', lb: '이등변삼각형', t: '△OAB는 $\\overline{OA}=\\overline{OB}$인 이등변삼각형이므로 두 밑각이 같아요: $\\angle OAB=\\angle OBA=x$.', cap: '∠OAB=∠OBA=x' });
        out.push({ k: 'eq', f: 'eq', t: `삼각형의 내각의 합: $x+x+${aob}^{\\circ}=180^{\\circ}$이므로 $x=\\frac{180^{\\circ}-${aob}^{\\circ}}{2}=${z}^{\\circ}$.`, cap: `x=\\frac{180°−${aob}°}{2}=${z}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${z}^{\\circ}$`, cap: `x = ${z}°` });
      }
      return out;
    },
    draw: SVB.runner({
      ...mobileQuestionFrame(RBOX, 'O: 외심 · D, E, F: 변의 중점', MOBILE_CIRCLE_BOX),
      base: (b, M) => cBase(b, M.g),
      dyn: (name, M, s) => stmtDyn(O1POOL, o1.prob)(name, M, s),
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc, D, E, F } = M.g, v = (s.trV || 0) % 3;
          [[D, B, Cc, 1], [E, Cc, A, 2], [F, A, B, 3]].forEach(([Mm, p, q, n]) => { L.ln(O, Mm, 'green', 2.6, { dash: [7, 5] }); L.tk(p, Mm, n, 'amber'); L.tk(Mm, q, n, 'amber'); });
          [A, B, Cc].forEach((z) => L.ln(O, z, 'rose', 3.2));
          if (v === 0) L.sd(O, A, pt(-1, 0), `${M.R} cm`, { color: 'sky', size: fs(X.b, 16), gap: 8, keep: true });
          if (v === 1) L.ang(O, A, B, { color: 'sky', r: 22, label: dg(180 - 2 * M.z), size: 15, labelDist: 40, labelRot: -Math.min(52, (180 - 2 * M.z) / 2 - 10), keep: true });
        },
        idea: (L, M) => { const { O, B, C: Cc, A, D, E, F } = M.g; [[D, Cc], [E, A], [F, B]].forEach(([Mm, q]) => { L.ln(O, Mm, 'green', 3.6); L.ang(Mm, O, q, { color: 'green', r: 16 }); }); },
        perp: (L, M) => { const { O, A, B, F } = M.g; L.ln(O, F, 'green', 4.2); L.ang(F, O, B, { color: 'green', r: 18 }); L.tk(A, F, 3, 'amber'); L.tk(F, B, 3, 'amber'); L.ln(O, A, 'rose', 3.8); L.ln(O, B, 'rose', 3.8); },
        rad: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, t = v === 0 ? `${M.R} cm` : 'R';
          [[A, pt(-1, 0)], [B, pt(1, -1)], [Cc, pt(-1, -1)]].forEach(([z, c], i) => { L.ln(O, z, 'rose', 4); if (i !== 0 && v === 0) L.sd(O, z, c, t, { color: 'rose', size: fs(X.b, 15), gap: 9 }); });
        },
        iso: (L, M) => { const { O, A, B } = M.g; L.fl([O, A, B], 'amber', 0.14); L.ln(O, A, 'rose', 3.4); L.ln(O, B, 'rose', 3.4); L.tk(O, A, 2, 'rose'); L.tk(O, B, 2, 'rose'); L.ang(A, O, B, { color: 'amber', r: 30, fa: 0.4 }); L.ang(B, O, A, { color: 'amber', r: 30, fa: 0.4 }); }
      },
      x: (b, M, s, X) => {
        const { O, A, B } = M.g, v = (s.trV || 0) % 3;
        if (v === 0 && !X.at('rad')) {
          const label = X.xVal ? `${M.R} cm` : 'x';
          if (X.nw) {
            // OB와 가까운 변·중점 눈금 사이에 x를 끼워 넣지 않고,
            // 원 왼쪽의 글자를 실제 반지름 OB의 중점에 연결합니다.
            const anchor = mid(O, B), q = b.toS(anchor), o = b.toS(O);
            T(b, anchor, label, { dx: o.x - b.k - 26 - q.x, dy: -28, color: 'amber', size: fs(b, 18), leaderAnchor: anchor, leader: true });
          } else G.sideTag(b, O, B, pt(1, -1), label, { color: 'amber', size: fs(b, 18), gap: 10 });
        }
        else if (v === 1) { if (M.z < 25) xOut(b, A, O, B, xLbl(X, M.z), { arc: X.xArc, r: 30, dist: 54 }); else ang(b, A, O, B, { color: 'amber', r: 30, label: xLbl(X, M.z), size: 17, labelDist: 52, noMark: !X.xArc, fa: 0.3 }); }
      },
      top: (b, M, s, X) => {
        const { O, A, B, C: Cc, D, E, F } = M.g;
        b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'green', r: 3.8 }));
        T(b, O, 'O', { dx: 12, dy: 4, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
        tagOut(b, D, O, 'D', { size: 16, color: 'green', nameColor: 'green', gap: 8 }); tagOut(b, E, O, 'E', { size: 16, gap: 8 }); tagOut(b, F, O, 'F', { size: 16, gap: 8 });
      }
    })
  };

  /* ---------------------------------------------------------------- 2. 직각삼각형의 외심 */
  const RTBOX = { x0: -1.25, x1: 1.25, y0: -1.1, y1: 1.1 };
  const rtBase = (b, M) => { const { O, A, B, C: Cc } = M.g; b.circle(O, 1, { color: 'sky', width: 2.2, alpha: 0.6, dash: [6, 5] }); fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.4); };
  const rtTop = (b, M) => { const { O, A, B, C: Cc } = M.g; [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 }); T(b, A, 'A', { dx: -14, dy: 4, size: 18 }); T(b, B, 'B', { dx: 14, dy: 4, size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); T(b, O, 'O', { dy: 18, size: 18, color: 'rose' }); };
  const o2Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { al, R, be } = M, out = [];
      if (v === 0) {
        out.push({ k: 'given', f: 'given', t: `∠C=90°인 직각삼각형 ABC에서 외심 O는 빗변 AB의 중점이에요. $\\overline{AB}=${2 * R}$ cm일 때 $\\overline{OC}$의 길이 $x$를 구해요.`, cap: `∠C=90°, AB=${2 * R} cm, OC=x` });
        out.push({ k: 'idea', f: 'idea', t: '외심 O에서 세 꼭짓점까지는 똑같이 떨어져 있어요(외접원의 반지름). 빗변의 중점이 O이면 OA=OB는 빗변의 반이고, OC도 같은 길이예요.', cap: 'OA=OB=OC (모두 외접원의 반지름)' });
        out.push({ k: 'fig', f: 'half', lb: '빗변의 반', t: `O가 빗변 AB의 중점이므로 $\\overline{OA}=\\overline{OB}=\\frac{1}{2}\\overline{AB}=\\frac{${2 * R}}{2}=${R}$ (cm).`, cap: `OA=OB=\\frac{AB}{2}=\\frac{${2 * R}}{2}=${R} cm` });
        out.push({ k: 'fig', f: 'rad', lb: '세 반지름', t: `외심이므로 $\\overline{OC}$도 외접원의 반지름이에요. 그래서 $\\overline{OC}=\\overline{OA}=\\overline{OB}=${R}$ cm.`, cap: `OC=OA=OB=${R} cm` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{OC}=\\overline{OA}=${R}$ cm`, cap: `x=OC=OA=${R} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${R}\\text{ cm}$`, cap: `x = ${R} cm` });
      } else if (v === 1) {
        out.push({ k: 'given', f: 'given', t: `∠C=90°인 직각삼각형 ABC에서 외심 O는 빗변 AB의 중점이고 $\\angle A=${al}^{\\circ}$예요. $\\angle OCB$의 크기 $x$를 구해요.`, cap: `∠C=90°, ∠A=${al}°, ∠OCB=x` });
        out.push({ k: 'idea', f: 'idea', t: 'OB와 OC는 둘 다 외접원의 반지름이라 길이가 같아요. 그러면 △OBC는 이등변삼각형이어서 ∠OCB가 밑각 ∠B와 같아요. 그러니 ∠B부터 구해요.', cap: 'OB=OC → △OBC 이등변 → ∠OCB=∠B' });
        out.push({ k: 'fig', f: 'B', lb: '∠B 구하기', t: `직각삼각형에서 두 예각의 합은 90°이므로 $\\angle B=90^{\\circ}-\\angle A=90^{\\circ}-${al}^{\\circ}=${be}^{\\circ}$.`, cap: `∠B=90°−${al}°=${be}°` });
        out.push({ k: 'fig', f: 'iso', lb: '이등변삼각형', t: `$\\overline{OB}=\\overline{OC}$이므로 △OBC는 이등변삼각형이고, 밑각이 같아서 $\\angle OCB=\\angle B=${be}^{\\circ}$.`, cap: `OB=OC → ∠OCB=∠B=${be}°` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\angle OCB=\\angle B=${be}^{\\circ}$`, cap: `x=∠OCB=∠B=${be}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${be}^{\\circ}$`, cap: `x = ${be}°` });
      } else {
        out.push({ k: 'given', f: 'given', t: `∠C=90°인 직각삼각형 ABC에서 외심 O는 빗변 AB의 중점이고 $\\overline{OC}=${R}$ cm예요. 빗변 $\\overline{AB}$의 길이 $x$를 구해요.`, cap: `∠C=90°, OC=${R} cm, AB=x` });
        out.push({ k: 'idea', f: 'idea', t: 'OA, OB, OC는 모두 외접원의 반지름이에요. 그리고 AB는 중점 O를 지나니까 반지름 두 개를 이어 붙인 길이예요.', cap: 'AB = OA + OB = 반지름의 2배' });
        out.push({ k: 'fig', f: 'rad', lb: '세 반지름', t: `외심 O에서 세 꼭짓점까지의 거리가 같으므로 $\\overline{OA}=\\overline{OB}=\\overline{OC}=${R}$ cm.`, cap: `OA=OB=OC=${R} cm` });
        out.push({ k: 'fig', f: 'dia', lb: '빗변', t: `O는 AB의 중점이므로 $\\overline{AB}=\\overline{OA}+\\overline{OB}=${R}+${R}=${2 * R}$ (cm).`, cap: `AB=OA+OB=${R}+${R}=${2 * R} cm` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AB}=2\\times\\overline{OC}=2\\times${R}=${2 * R}$ (cm)`, cap: `x=2×OC=2×${R}=${2 * R} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${2 * R}\\text{ cm}$`, cap: `x = ${2 * R} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: () => RTBOX,
      base: rtBase,
      legend: () => 'O: 외심 (빗변 AB의 중점)',
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3;
          L.ang(Cc, A, B, { color: 'sky', r: 24 }); L.ln(O, Cc, 'rose', 3.2); L.tk(A, O, 1, 'amber'); L.tk(O, B, 1, 'amber');
          if (v === 0) L.dm(A, B, pt(0, -2), `${2 * M.R} cm`, { color: 'sky', size: fs(X.b, 16), off: 28, keep: true });
          else if (v === 1) L.ang(A, B, Cc, { color: 'sky', r: 36, label: dg(M.al), size: 16, labelDist: 56, keep: true });
          else L.sd(O, Cc, pt(1, 1), `${M.R} cm`, { color: 'sky', size: fs(X.b, 16), gap: 10, keep: true });
        },
        idea: (L, M, s) => { const { O, B, C: Cc } = M.g, v = (s.trV || 0) % 3; if (v === 1) { L.fl([O, B, Cc], 'violet', 0.16); L.ln(O, B, 'rose', 3.6); L.ln(O, Cc, 'rose', 3.6); } else L.circ(O, 1, 'sky', 3.4); },
        half: (L, M, s, X) => { const { O, A, B } = M.g; L.ln(A, O, 'sky', 5); L.ln(O, B, 'sky', 5); L.tk(A, O, 1, 'amber'); L.tk(O, B, 1, 'amber'); L.sd(A, O, pt(0, -2), `${M.R} cm`, { color: 'sky', size: fs(X.b, 16), gap: 10 }); L.sd(O, B, pt(0, -2), `${M.R} cm`, { color: 'sky', size: fs(X.b, 16), gap: 10 }); },
        rad: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3;
          [[A, O], [O, B], [O, Cc]].forEach(([p, q]) => L.ln(p, q, 'rose', 4.4));
          [[A, O], [O, B], [O, Cc]].forEach(([p, q]) => L.tk(p, q, 2, 'rose'));
          if (v === 0) L.sd(O, Cc, pt(1, 1), `${M.R} cm`, { color: 'rose', size: fs(X.b, 16), gap: 10 });
          else { L.sd(A, O, pt(0, -2), `${M.R} cm`, { color: 'rose', size: fs(X.b, 16), gap: 10 }); L.sd(O, B, pt(0, -2), `${M.R} cm`, { color: 'rose', size: fs(X.b, 16), gap: 10 }); }
        },
        dia: (L, M, s, X) => { const { A, B } = M.g; L.ln(A, B, 'amber', 5.2); },
        B: (L, M) => { const { A, B, C: Cc } = M.g; L.ang(B, A, Cc, { color: 'green', r: 34, label: dg(M.be), size: 15, labelDist: 62, labelRot: G.sideRot(B, A, Cc, 'A', 26), fa: 0.4, keep: true }); }, // 값은 빗변 아래쪽에 두고 호에서 시작하는 지시선으로 ∠B 를 가리켜요
        iso: (L, M) => { const { O, B, C: Cc } = M.g; L.fl([O, B, Cc], 'amber', 0.14); L.ln(O, B, 'rose', 3.6); L.ln(O, Cc, 'rose', 3.6); L.tk(O, B, 2, 'rose'); L.tk(O, Cc, 2, 'rose'); L.ang(B, Cc, O, { color: 'green', r: 30, fa: 0.4 }); }
      },
      x: (b, M, s, X) => {
        const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3;
        if (v === 0) { if (!X.at('rad')) G.sideTag(b, O, Cc, pt(1, 1), X.xVal ? `${M.R} cm` : 'x', { color: 'amber', size: fs(b, 18), gap: X.xVal ? 18 : 10 }); }
        else if (v === 1) ang(b, Cc, O, B, { color: 'amber', r: 36, label: xLbl(X, M.be), size: 17, labelDist: 56, noMark: !X.xArc && !X.at('iso'), fa: 0.3 });
        else G.dim(b, A, B, pt(0, -2), X.xVal ? `${2 * M.R} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 16 : 18), off: 28 });
      },
      top: rtTop
    })
  };

  /* ---------------------------------------------------------------- 3. 30°-60°-90° */
  const o3Solve = {
    quickTitle: '10초 컷 · 30°의 마주 변은 빗변의 반',
    quick: (M, s) => {
      const v = (s.trV || 0) % 3, R = M.R;
      return {
        steps: v === 0 ? `<p>∠A=30°이므로 마주 보는 변 BC는 빗변의 반이에요.</p><p>$\\overline{BC}=\\frac{1}{2}\\times${2 * R}=${R}$ (cm)</p>`
          : v === 1 ? `<p>BC가 빗변의 반이므로 빗변은 BC의 2배예요.</p><p>$\\overline{AB}=2\\times${R}=${2 * R}$ (cm)</p>`
            : `<p>정삼각형 OBC의 한 변은 BC=OB=OC=AB의 반이에요.</p><p>$\\frac{1}{2}\\times${2 * R}=${R}$, 둘레 $=3\\times${R}=${3 * R}$ (cm)</p>`,
        note: '30°-60°-90° 직각삼각형: 30°의 마주 변 : 빗변 = 1 : 2 예요.'
      };
    },
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, R = M.R, out = [];
      const askT = ['$\\overline{BC}$의 길이 $x$', '빗변 $\\overline{AB}$의 길이 $x$', '△OBC의 둘레 $x$'][v], askC = ['BC=x', 'AB=x', '△OBC의 둘레=x'][v];
      const gv = [`$\\overline{AB}=${2 * R}$ cm`, `$\\overline{BC}=${R}$ cm`, `$\\overline{AB}=${2 * R}$ cm`][v], gc = [`AB=${2 * R} cm`, `BC=${R} cm`, `AB=${2 * R} cm`][v];
      out.push({ k: 'given', f: 'given', t: `∠C=90°, ∠A=30°, ∠B=60°인 직각삼각형 ABC의 외심 O는 빗변 AB의 중점이에요. ${gv}일 때 ${askT}를 구해요.`, cap: `∠A=30°, ∠B=60°, ${gc}, ${askC}` });
      out.push({ k: 'idea', f: 'idea', t: 'O가 빗변의 중점이면 OB=OC(둘 다 반지름)이고, ∠B=60°예요. 이등변삼각형인데 한 각이 60°이면 세 각이 모두 60°가 되어 정삼각형이에요. 그러면 세 변이 모두 같아서 BC도 OB와 같아요.', cap: 'OB=OC이고 ∠B=60° → △OBC는 정삼각형' });
      out.push({ k: 'fig', f: 'rad', lb: '반지름', t: v === 1 ? 'O는 빗변의 중점이고 외심이므로 $\\overline{OB}=\\overline{OC}$ (둘 다 외접원의 반지름).' : `O는 빗변의 중점이고 외심이므로 $\\overline{OB}=\\overline{OC}=\\frac{1}{2}\\overline{AB}=${R}$ cm.`, cap: v === 1 ? 'OB=OC (반지름)' : `OB=OC=\\frac{AB}{2}=${R} cm` });
      out.push({ k: 'fig', f: 'eq3', lb: '정삼각형', t: '$\\overline{OB}=\\overline{OC}$이므로 $\\angle OCB=\\angle OBC=60^{\\circ}$이고, 내각의 합이 180°이므로 $\\angle BOC=60^{\\circ}$예요. 세 각이 모두 60°라서 △OBC는 정삼각형이에요.', cap: '∠OBC=∠OCB=∠BOC=60° → 정삼각형' });
      out.push({ k: 'fig', f: 'len', lb: '길이', t: v === 1 ? `정삼각형의 세 변은 같으므로 $\\overline{OB}=\\overline{BC}=${R}$ cm이고, O는 AB의 중점이므로 $\\overline{AB}=2\\times\\overline{OB}=${2 * R}$ cm.` : `정삼각형의 세 변은 같으므로 $\\overline{BC}=\\overline{OB}=\\overline{OC}=${R}$ cm.`, cap: v === 1 ? `OB=BC=${R} cm, AB=2×OB=${2 * R} cm` : `BC=OB=OC=${R} cm` });
      if (v === 0) { out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{BC}=\\overline{OB}=${R}$ cm`, cap: `x=BC=OB=${R} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${R}\\text{ cm}$`, cap: `x = ${R} cm` }); }
      else if (v === 1) { out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AB}=2\\times\\overline{BC}=2\\times${R}=${2 * R}$ (cm)`, cap: `x=2×BC=2×${R}=${2 * R} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${2 * R}\\text{ cm}$`, cap: `x = ${2 * R} cm` }); }
      else { out.push({ k: 'eq', f: 'eq', t: `△OBC의 둘레 $x=\\overline{OB}+\\overline{BC}+\\overline{CO}=${R}+${R}+${R}=${3 * R}$ (cm)`, cap: `x=${R}+${R}+${R}=${3 * R} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${3 * R}\\text{ cm}$`, cap: `x = ${3 * R} cm` }); }
      return out;
    },
    draw: SVB.runner({
      ...mobileQuestionFrame(RTBOX, 'O: 외심 (빗변 AB의 중점)', MOBILE_CIRCLE_BOX),
      base: rtBase,
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, R = M.R;
          L.ang(Cc, A, B, { color: 'sky', r: 24 }); L.ln(O, Cc, 'rose', 3.2); L.tk(A, O, 1, 'amber'); L.tk(O, B, 1, 'amber');
          // 30° 안쪽에 긴 숫자를 밀어 넣으면 외심 O에 붙습니다. 좁은
          // 무대에서는 A 바로 바깥에 놓고 실제 A의 호와 지시선으로 잇습니다.
          L.ang(A, B, Cc, { color: 'sky', r: X.nw ? Math.min(36, .3 * X.b.k) : 36, label: '30°', size: 16, labelDist: X.nw ? 36 : 56, labelRot: X.nw ? -50 : 0, keep: true });
          L.ang(B, A, Cc, { color: 'sky', r: X.nw ? Math.min(30, .25 * X.b.k) : 30, label: '60°', size: 16, labelDist: X.nw ? Math.min(50, .46 * X.b.k) : 50, keep: true });
          if (v === 1) L.sd(B, Cc, pt(-1, 1), `${R} cm`, { color: 'sky', size: fs(X.b, 16), gap: 10, keep: true }); else L.dm(A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(X.b, 16), off: 28, keep: true });
        },
        rad: (L, M, s, X) => { const { O, B, C: Cc } = M.g, v = (s.trV || 0) % 3; L.ln(O, B, 'rose', 4.4); L.ln(O, Cc, 'rose', 4.4); L.tk(O, B, 2, 'rose'); L.tk(O, Cc, 2, 'rose'); if (v !== 1) { L.sd(O, Cc, pt(1, 1), `${M.R} cm`, { color: 'rose', size: fs(X.b, 15), gap: 10 }); } },
        eq3: (L, M, s, X) => { const { O, A, B, C: Cc } = M.g; L.fl([O, B, Cc], 'green', 0.3); L.ang(B, Cc, O, { color: 'green', r: 30, fa: 0.4 }); L.ang(Cc, O, B, { color: 'green', r: 20, fa: 0.4 }); L.ang(O, Cc, B, { color: 'green', r: 22, fa: 0.4 }); L.tx(G.lerp(G.centroid([O, B, Cc]), O, 0.45), '60°', { size: 14, color: 'green', dy: 14 }); },
        len: (L, M, s, X) => { const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3; L.fl([O, B, Cc], 'green', 0.3); L.ln(B, Cc, 'green', 5); L.tk(B, Cc, 2, 'green'); L.tk(O, B, 2, 'green'); if (v !== 1) L.sd(B, Cc, pt(-1, 1), `${M.R} cm`, { color: 'green', size: fs(X.b, 16), gap: 10 }); if (v === 1) L.ln(A, B, 'amber', 5); }
      },
      x: (b, M, s, X) => {
        const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, R = M.R;
        if (v === 0) { if (!X.at('len')) G.sideTag(b, B, Cc, pt(-1, 1), X.xVal ? `${R} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 16 : 18), gap: 10 }); }
        else if (v === 1) G.dim(b, A, B, pt(0, -2), X.xVal ? `${2 * R} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 16 : 18), off: 28 });
        else { poly(b, [O, B, Cc], 'amber', X.xArc || X.at('len') ? 4.2 : 2.2, { alpha: X.xArc ? 1 : 0.6 }); T(b, G.lerp(O, B, 0.5), X.xVal ? `${3 * R} cm` : 'x', { dy: 30, size: fs(b, X.xVal ? 15 : 18), color: 'amber' }); }
      },
      top: rtTop
    })
  };

  /* ---------------------------------------------------------------- 4. 외심에서의 각 */
  const o4cols = (v) => (v === 0 ? ['amber', 'sky', 'green'] : v === 1 ? ['green', 'violet', 'rose'] : ['sky', 'green', 'violet']);
  // 짧은 문제 캔버스에서도 각의 숫자가 반지름을 넘어 다른 꼭짓점에 붙지 않게 합니다.
  const o4LabelDist = (b, wanted = 48) => Math.min(wanted, .48 * b.k);
  const o4Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { a, b: bb, c, x, y, z } = M, out = [];
      const ask = ['$\\angle OAB$의 크기 $x$', '$\\angle BOC$의 크기 $x$', '$\\angle ACB$의 크기 $x$'][v];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 O는 예각삼각형 ABC의 외심이고 $\\angle OBC=${y}^{\\circ}$, $\\angle OCA=${z}^{\\circ}$예요. ${ask}를 구해요.` : v === 1 ? `점 O는 예각삼각형 ABC의 외심이고 $\\angle A=${a}^{\\circ}$예요. ${ask}를 구해요.` : `점 O는 예각삼각형 ABC의 외심이고 $\\angle OAB=${x}^{\\circ}$, $\\angle OBC=${y}^{\\circ}$예요. ${ask}를 구해요.`, cap: v === 0 ? `∠OBC=${y}°, ∠OCA=${z}°, ∠OAB=x` : v === 1 ? `∠A=${a}°, ∠BOC=x` : `∠OAB=${x}°, ∠OBC=${y}°, ∠ACB=x` });
      out.push({ k: 'idea', f: 'idea', t: v === 1 ? 'O가 외심이면 OA=OB=OC예요. 그래서 O에서 꼭짓점을 이은 세 삼각형이 모두 이등변삼각형이 되고, 이등변삼각형의 밑각이 같다는 걸로 ∠BOC와 ∠A를 연결할 수 있어요.' : 'O가 외심이면 OA=OB=OC예요. 그래서 O에서 꼭짓점을 이으면 이등변삼각형이 셋 생기고, 밑각끼리 같아요. 삼각형 ABC의 내각의 합 180°를 이 밑각들로 나타내면 x+y+z=90°를 얻어요.', cap: 'OA=OB=OC → 이등변삼각형 셋 → 밑각이 같다' });
      out.push({ k: 'fig', f: 'iso', lb: '반지름', t: '$\\overline{OA}=\\overline{OB}=\\overline{OC}$ (모두 외접원의 반지름)이므로 △OAB, △OBC, △OCA는 모두 이등변삼각형이에요.', cap: 'OA=OB=OC → △OAB, △OBC, △OCA는 이등변' });
      out.push({ k: 'fig', f: 'pairs', lb: '같은 밑각', t: v === 0 ? '밑각끼리 같아요. $\\angle OAB=\\angle OBA=x$, $\\angle OBC=\\angle OCB=y$, $\\angle OCA=\\angle OAC=z$.' : '밑각끼리 같아요. $\\angle OAB=\\angle OBA=x$, $\\angle OBC=\\angle OCB=y$, $\\angle OCA=\\angle OAC=z$로 놓아요.', cap: '같은 색 호 = 같은 밑각 (x, y, z)' });
      out.push({ k: 'fig', f: 'sum', lb: '내각의 합', t: `삼각형 ABC의 세 내각은 $\\angle A=x+z$, $\\angle B=x+y$, $\\angle C=y+z$예요. 합이 180°이므로 $2(x+y+z)=180^{\\circ}$, 즉 $x+y+z=90^{\\circ}$.`, cap: '∠A+∠B+∠C=2(x+y+z)=180° → x+y+z=90°' });
      if (v === 0) {
        out.push({ k: 'eq', f: 'eq', t: `$x=90^{\\circ}-y-z=90^{\\circ}-${y}^{\\circ}-${z}^{\\circ}=${x}^{\\circ}$`, cap: `x=90°−${y}°−${z}°=${x}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${x}^{\\circ}$`, cap: `x = ${x}°` });
      } else if (v === 1) {
        out.push({ k: 'eq', f: 'eq', t: `$\\angle A=x+z$이고 $x+y+z=90^{\\circ}$이므로 $y=90^{\\circ}-\\angle A=90^{\\circ}-${a}^{\\circ}=${y}^{\\circ}$. △OBC에서 $\\angle BOC=180^{\\circ}-2y=180^{\\circ}-2\\times${y}^{\\circ}=${2 * a}^{\\circ}$ ($=2\\angle A$).`, cap: `y=90°−${a}°=${y}°, ∠BOC=180°−2y=${2 * a}° (=2∠A)` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${2 * a}^{\\circ}$`, cap: `x = ${2 * a}°` });
      } else {
        out.push({ k: 'eq', f: 'eq', t: `$z=90^{\\circ}-x-y=90^{\\circ}-${x}^{\\circ}-${y}^{\\circ}=${z}^{\\circ}$이고 $\\angle ACB=\\angle OCB+\\angle OCA=y+z=${y}^{\\circ}+${z}^{\\circ}=${c}^{\\circ}$.`, cap: `z=90°−${x}°−${y}°=${z}°, ∠ACB=y+z=${y}°+${z}°=${c}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${c}^{\\circ}$`, cap: `x = ${c}°` });
      }
      void bb;
      return out;
    },
    draw: SVB.runner({
      // 외심이라는 설명은 발문과 풀이에 있으므로 같은 범례 줄을 다시 비워
      // 두지 않습니다. 실제 원의 경계에 맞춰 세 꼭짓점과 각을 크게 봅니다.
      box: () => ({ x0: -1.02, x1: 1.02, y0: -1.02, y1: 1.02 }),
      padding: (b, M, s, idx) => ({ t: b.H < 520 ? 30 : 44, b: idx < 0 ? 22 : 90, l: 40, r: 40 }),
      base: (b, M) => cBase(b, M.g),
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, [cx, cy, cz] = o4cols(v);
          const labelDist = o4LabelDist(X.b);
          [A, B, Cc].forEach((z) => L.ln(O, z, 'rose', 3.2));
          if (v === 0) { L.ang(B, Cc, O, { color: cy, r: 30, label: dg(M.y), size: 15, labelDist, keep: true }); L.ang(Cc, A, O, { color: cz, r: 30, label: dg(M.z), size: 15, labelDist, keep: true }); }
          else if (v === 1) L.ang(A, B, Cc, { color: 'sky', r: 34, label: dg(M.a), size: 16, labelDist: o4LabelDist(X.b, 56), labelRot: 20, keep: true });
          else { L.ang(A, B, O, { color: cx, r: 30, label: dg(M.x), size: 15, labelDist, keep: true }); L.ang(B, Cc, O, { color: cy, r: 30, label: dg(M.y), size: 15, labelDist, keep: true }); }
        },
        idea: (L, M) => { const { O, A, B, C: Cc } = M.g; L.fl([O, A, B], 'sky', 0.14); L.fl([O, B, Cc], 'green', 0.14); L.fl([O, Cc, A], 'violet', 0.14); },
        iso: (L, M) => { const { O, A, B, C: Cc } = M.g; [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 4); L.tk(O, z, 1, 'rose'); }); },
        pairs: (L, M, s) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, [cx, cy, cz] = o4cols(v), r = 30;
          L.ang(A, O, B, { color: cx, r, fa: 0.4 }); L.ang(B, O, A, { color: cx, r, fa: 0.4 }); L.ang(B, O, Cc, { color: cy, r, rings: 2, fa: 0.4 }); L.ang(Cc, O, B, { color: cy, r, rings: 2, fa: 0.4 });
          L.ang(Cc, O, A, { color: cz, r, rings: 3, fa: 0.4 }); L.ang(A, O, Cc, { color: cz, r, rings: 3, fa: 0.4 });
        },
        sum: (L, M, s) => {
          const { A, B, C: Cc } = M.g, v = (s.trV || 0) % 3;
          L.fl([A, B, Cc], 'amber', 0.1);
          L.ang(A, B, Cc, { color: 'amber', r: 40, fa: 0.3 }); L.ang(B, Cc, A, { color: 'amber', r: 40, fa: 0.3 }); L.ang(Cc, A, B, { color: 'amber', r: 40, fa: 0.3 });
        },
        eq: (L, M, s) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3, [cx, cy, cz] = o4cols(v);
          if (v === 0) { L.ang(B, Cc, O, { color: cy, r: 34, fa: 0.4 }); L.ang(Cc, A, O, { color: cz, r: 34, fa: 0.4 }); }
          else if (v === 1) { L.ang(B, Cc, O, { color: cy, r: 32, fa: 0.4 }); L.ang(Cc, O, B, { color: cy, r: 32, fa: 0.4 }); }
          else { L.ang(Cc, A, O, { color: cz, r: 40, fa: 0.4 }); L.ang(B, Cc, O, { color: cy, r: 30, fa: 0.4 }); }
          void cx;
        }
      },
      x: (b, M, s, X) => {
        const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 3;
        if (v === 0) { if (M.x < 25) xOut(b, A, B, O, xLbl(X, M.x), { arc: X.xArc, r: 34, dist: 56 }); else ang(b, A, B, O, { color: 'amber', r: 30, label: xLbl(X, M.x), size: 17, labelDist: o4LabelDist(b, 46), noMark: !X.xArc, fa: 0.3 }); }
        else if (v === 1) ang(b, O, B, Cc, { color: 'amber', r: 26, label: xLbl(X, 2 * M.a), size: 17, labelDist: 42, noMark: !X.xArc, fa: 0.3 });
        else ang(b, Cc, A, B, { color: 'amber', r: 30, label: xLbl(X, M.c), size: 17, labelDist: o4LabelDist(b), noMark: !X.xArc, fa: 0.3 });
      },
      top: (b, M, s, X) => cTop(b, M.g, X)
    })
  };

  /* ---------------------------------------------------------------- 5. 둔각삼각형의 외심 */
  const o5Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, boc } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 O는 ∠A가 둔각인 삼각형 ABC의 외심이고 $\\angle A=${a}^{\\circ}$예요. $\\angle BOC$의 크기 $x$를 구해요.` : `점 O는 ∠A가 둔각인 삼각형 ABC의 외심이고 $\\angle BOC=${boc}^{\\circ}$예요. $\\angle A$의 크기 $x$를 구해요.`, cap: v === 0 ? `∠A=${a}° (둔각), ∠BOC=x` : `∠BOC=${boc}°, ∠A=x (둔각)` });
      out.push({ k: 'idea', f: 'idea', t: '둔각삼각형에서는 외심 O가 삼각형 바깥(변 BC 너머)에 있어서 예각삼각형의 공식 ∠BOC=2∠A를 그대로 쓸 수 없어요. 대신 O와 A를 이은 선분 OA로 이등변삼각형 △OAB, △OAC를 만들면 어떤 경우에도 통해요.', cap: '외심이 바깥 → 공식 대신 이등변삼각형으로 구해요' });
      out.push({ k: 'fig', f: 'iso', lb: '이등변삼각형', t: '$\\overline{OA}=\\overline{OB}=\\overline{OC}$ (모두 반지름)이므로 △OAB와 △OAC는 이등변삼각형이에요.', cap: 'OA=OB=OC → △OAB, △OAC는 이등변' });
      out.push({ k: 'fig', f: 'base', lb: '밑각', t: `밑각이 같아요: $\\angle OAB=\\angle OBA=p$, $\\angle OAC=\\angle OCA=q$. 그러면 $\\angle A=\\angle OAB+\\angle OAC=p+q$.`, cap: v === 0 ? `∠A=p+q=${a}°` : '∠A=p+q' });
      out.push({ k: 'fig', f: 'ang', lb: '꼭지각', t: '두 이등변삼각형의 꼭지각은 $\\angle AOB=180^{\\circ}-2p$, $\\angle AOC=180^{\\circ}-2q$예요. 선분 OA가 ∠BOC 안에 있으므로 $\\angle BOC=\\angle AOB+\\angle AOC$.', cap: '∠BOC=∠AOB+∠AOC=(180°−2p)+(180°−2q)' });
      if (v === 0) {
        out.push({ k: 'eq', f: 'eq', t: `$\\angle BOC=360^{\\circ}-2(p+q)=360^{\\circ}-2\\angle A=360^{\\circ}-2\\times${a}^{\\circ}=${boc}^{\\circ}$`, cap: `x=360°−2∠A=360°−2×${a}°=${boc}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${boc}^{\\circ}$`, cap: `x = ${boc}°` });
        out.push({ k: 'trap', f: 'trap', t: `예각삼각형의 공식 $\\angle BOC=2\\angle A$를 그대로 쓰면 ${2 * a}°가 되어 버려요. ${2 * a}°는 180°보다 큰 바깥쪽 각이고, 우리가 구하는 ∠BOC는 그 나머지인 $360^{\\circ}-${2 * a}^{\\circ}=${boc}^{\\circ}$예요.`, cap: `2∠A=${2 * a}°는 바깥쪽 각이라 틀려요 → ∠BOC=360°−${2 * a}°=${boc}°`, col: 'rose' });
      } else {
        out.push({ k: 'eq', f: 'eq', t: `$\\angle BOC=360^{\\circ}-2\\angle A$이므로 $2\\angle A=360^{\\circ}-\\angle BOC=360^{\\circ}-${boc}^{\\circ}=${360 - boc}^{\\circ}$, $x=\\angle A=\\frac{${360 - boc}^{\\circ}}{2}=${a}^{\\circ}$.`, cap: `x=\\frac{360°−${boc}°}{2}=${a}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${a}^{\\circ}$`, cap: `x = ${a}°` });
        out.push({ k: 'trap', f: 'trap', t: `예각삼각형의 공식을 그대로 쓰면 $\\angle A=\\frac{${boc}^{\\circ}}{2}=${boc / 2}^{\\circ}$가 되는데, 이 값은 둔각이 아니라서 문제의 조건과 맞지 않아요. 둔각삼각형에서는 $\\angle A=\\frac{360^{\\circ}-\\angle BOC}{2}$예요.`, cap: `${boc}°÷2=${boc / 2}°는 둔각이 아니라서 틀려요 → ∠A=${a}°`, col: 'rose' });
      }
      return out;
    },
    draw: SVB.runner({
      box: (M) => bboxOf([M.g.A, M.g.B, M.g.C, M.g.O], 0.16), // 둔각삼각형은 납작해서 삼각형과 O 쪽으로 확대해요 (아래쪽 원은 설명 글과 겹치지 않게 생략)
      base: (b, M) => { const { O, A, B, C: Cc } = M.g; b.arc(O, 1, 150 * DEG, 390 * DEG, { color: 'sky', width: 2.2, alpha: 0.6, dash: [6, 5] }); fillPoly(b, [A, B, Cc], 'sky', 0.07); poly(b, [A, B, Cc], 'ink', 3.4); },
      legend: () => 'O: 외심 (삼각형 바깥)',
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 2;
          [B, Cc, A].forEach((z) => L.ln(O, z, 'rose', 3.2));
          if (v === 0) L.ang(A, B, Cc, { color: 'sky', r: 22, label: dg(M.a), size: 16, labelDist: X.nw ? lblAvoid(X.b, A, B, Cc, awayRot(A, B, Cc, O), B, Cc) : 38, labelRot: X.nw ? awayRot(A, B, Cc, O) : 180, keep: true });
          else L.ang(O, B, Cc, { color: 'sky', r: X.nw ? Math.min(22, .2 * X.b.k) : 22, label: dg(M.boc), size: 16, labelDist: 34, labelRot: 180, keep: true });
        },
        iso: (L, M) => { const { O, A, B, C: Cc } = M.g; L.fl([O, A, B], 'sky', 0.14); L.fl([O, A, Cc], 'green', 0.14); [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 4); L.tk(O, z, 1, 'rose'); }); },
        base: (L, M) => {
          const { O, A, B, C: Cc } = M.g;
          L.ang(A, O, B, { color: 'sky', r: 22, fa: 0.4 }); L.ang(A, O, Cc, { color: 'green', r: 22, fa: 0.4 }); // 꼭짓점 A: ∠OAB(p), ∠OAC(q)
          L.ang(B, O, A, { color: 'sky', r: 28, fa: 0.4 }); L.ang(Cc, O, A, { color: 'green', r: 28, fa: 0.4 });
        },
        ang: (L, M) => { const { O, A, B, C: Cc } = M.g; L.ang(O, A, B, { color: 'sky', r: 24, fa: 0.4 }); L.ang(O, A, Cc, { color: 'green', r: 32, fa: 0.4 }); },
        trap: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 2;
          if (v === 0) L.ang(O, B, Cc, { color: 'rose', r: 34, big: true, label: `2∠A=${2 * M.a}°`, size: 14, labelDist: 62, labelRot: 100, fa: 0.2 }); else L.ang(A, B, Cc, { color: 'rose', r: 30, label: `${M.boc / 2}°`, size: 15, labelDist: lblAvoid(X.b, A, B, Cc, awayRot(A, B, Cc, O), B, Cc), labelRot: awayRot(A, B, Cc, O), fa: 0.3 });
        }
      },
      x: (b, M, s, X) => {
        const { O, A, B, C: Cc } = M.g, v = (s.trV || 0) % 2;
        if (v === 1 && X.K === 'trap') return;
        // 화면 폭과 관계없이 O각의 값은 O 아래에 연결하고 A각은 A 가까이에 둡니다.
        // 현 BC를 피하려다 값이 다른 각의 위치까지 멀어지는 것을 막아요.
        if (v === 0) ang(b, O, B, Cc, { color: 'amber', r: X.nw ? Math.min(22, .2 * b.k) : 22, label: xLbl(X, M.boc), size: 17, labelDist: 34, labelRot: 180, noMark: !X.xArc, fa: 0.3 });
        else ang(b, A, B, Cc, { color: 'amber', r: 22, label: xLbl(X, M.a), size: 17, labelDist: X.nw ? lblAvoid(b, A, B, Cc, awayRot(A, B, Cc, O), B, Cc) : 38, labelRot: X.nw ? awayRot(A, B, Cc, O) : 180, noMark: !X.xArc, fa: 0.3 });
      },
      top: (b, M, s, X) => {
        const { O, A, B, C: Cc } = M.g;
        b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
        T(b, O, 'O', { dx: 14, dy: -10, size: 18, color: 'rose' }); T(b, A, 'A', { dx: -18, dy: -10, size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      }
    })
  };

  /* ---------------------------------------------------------------- 6. 중심각의 비 */
  const o6Solve = {
    steps: (M) => {
      const { a, b: bb, c, ab, bc, ca } = M, S0 = a + bb + c;
      return [
        { k: 'given', f: 'given', t: `점 O는 △ABC의 외심이고 $\\angle AOB:\\angle BOC:\\angle COA=${a}:${bb}:${c}$예요. $\\angle ACB$의 크기 $x$를 구해요.`, cap: `∠AOB:∠BOC:∠COA=${a}:${bb}:${c}, ∠ACB=x` },
        { k: 'idea', f: 'idea', t: 'O 둘레의 세 각을 모으면 한 바퀴(360°)예요. 그러니 비로 나눠서 ∠AOB를 구할 수 있어요. 그리고 ∠ACB는 같은 호 AB를 바라보는 각이라서, 중심에서 본 ∠AOB의 딱 절반이에요.', cap: '세 중심각의 합 360° · 원주각 = 중심각의 반' },
        { k: 'fig', f: 'sum', lb: '비의 합', t: `세 각의 합이 360°이고 비가 $${a}:${bb}:${c}$이므로 비의 합은 $${a}+${bb}+${c}=${S0}$예요. 비 1에 해당하는 각은 $\\frac{360^{\\circ}}{${S0}}=${360 / S0}^{\\circ}$.`, cap: `비의 합 ${a}+${bb}+${c}=${S0}, 비 1 → \\frac{360°}{${S0}}=${360 / S0}°` },
        { k: 'fig', f: 'ab', lb: '∠AOB', t: `$\\angle AOB=360^{\\circ}\\times\\frac{${a}}{${S0}}=${ab}^{\\circ}$ (다른 두 각은 ∠BOC=${bc}°, ∠COA=${ca}°).`, cap: `∠AOB=360°×\\frac{${a}}{${S0}}=${ab}°` },
        { k: 'fig', f: 'half', lb: '원주각', t: `$\\angle ACB$는 호 AB를 바라보는 각이에요. 같은 호에 대한 이 각은 ∠AOB의 반이에요.`, cap: '∠ACB = \\frac{1}{2}∠AOB' },
        { k: 'eq', f: 'eq', t: `$x=\\angle ACB=\\frac{1}{2}\\angle AOB=\\frac{1}{2}\\times${ab}^{\\circ}=${ab / 2}^{\\circ}$`, cap: `x=\\frac{1}{2}×${ab}°=${ab / 2}°` },
        { k: 'ans', f: 'ans', t: `$x=${ab / 2}^{\\circ}$`, cap: `x = ${ab / 2}°` }
      ];
    },
    draw: SVB.runner({
      ...mobileQuestionFrame(RBOX, 'O: 외심 (중심)', MOBILE_CIRCLE_BOX),
      base: (b, M) => { const { O, A, B, C: Cc } = M.g; b.circle(O, 1, { color: 'sky', width: 2.2, alpha: 0.6, dash: [6, 5] }); fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.4); },
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc } = M.g;
          [A, B, Cc].forEach((z) => L.ln(O, z, 'rose', 3));
          L.ang(O, A, B, { color: 'rose', r: 30, label: String(M.a), size: 15, labelDist: 48, keep: !X.has('sum') }); L.ang(O, B, Cc, { color: 'green', r: 30, label: String(M.b), size: 15, labelDist: 48, keep: !X.has('sum') }); L.ang(O, Cc, A, { color: 'violet', r: 30, label: String(M.c), size: 15, labelDist: 48, keep: !X.has('sum') });
        },
        idea: (L, M) => { const { O, A, B, C: Cc } = M.g; L.fl([O, A, B], 'rose', 0.12); L.fl([O, B, Cc], 'green', 0.12); L.fl([O, Cc, A], 'violet', 0.12); },
        sum: (L, M, s, X) => { const { O, A, B, C: Cc } = M.g; L.ang(O, A, B, { color: 'rose', r: 30, label: String(M.a), size: 15, labelDist: 48, keep: !X.has('ab') }); L.ang(O, B, Cc, { color: 'green', r: 30, label: String(M.b), size: 15, labelDist: 48, keep: true }); L.ang(O, Cc, A, { color: 'violet', r: 30, label: String(M.c), size: 15, labelDist: 48, keep: true }); },
        ab: (L, M) => { const { O, A, B } = M.g; L.ang(O, A, B, { color: 'rose', r: 30, label: dg(M.ab), size: 16, labelDist: 50, fa: 0.4, keep: true }); },
      },
      x: (b, M, s, X) => {
        const { C: Cc, A, B } = M.g, compact = X.nw || b.k < 140;
        // 세로 태블릿도 원이 작으면 C의 각 값을 중심 O까지 밀어 넣지 않습니다.
        ang(b, Cc, A, B, { color: 'amber', r: compact ? Math.min(34, .24 * b.k) : 34, label: X.xVal ? dg(M.ab / 2) : 'x', size: 17, labelDist: compact ? Math.min(56, .4 * b.k) : 56, labelRot: compact && !X.nw ? M.ab / 4 + 30 : 0, noMark: !(X.xArc || X.at('half')), fa: 0.3 });
      },
      top: (b, M, s, X) => cTop(b, M.g, X)
    })
  };

  /* ---------------------------------------------------------------- 7. 외접원의 둘레 */
  const o7geom = (M) => { const { R, a } = M, phi = Math.asin(clamp(a / (2 * R), 0.05, 0.98)) / DEG, O = pt(0, 0); return { O, B: polar(O, 1, 90 + phi), C: polar(O, 1, 90 - phi), A: polar(O, 1, -60) }; };
  const o7Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { R, a, per } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `점 O는 △ABC의 외심이고 △OBC의 둘레는 ${per} cm, $\\overline{BC}=${a}$ cm예요. 외접원의 반지름 $R$을 구해요.` : `점 O는 △ABC의 외심이고 △OBC의 둘레는 ${per} cm, $\\overline{BC}=${a}$ cm예요. 외접원의 둘레 $x$를 구해요.`, cap: v === 0 ? `△OBC의 둘레 ${per} cm, BC=${a} cm, R=x` : `△OBC의 둘레 ${per} cm, BC=${a} cm, 원의 둘레=x` });
      out.push({ k: 'idea', f: 'idea', t: v === 0 ? 'OB와 OC는 둘 다 외접원의 반지름 R이에요. 그러면 △OBC의 둘레에는 R이 두 번 들어 있으니까, 둘레에서 BC를 빼고 2로 나누면 R이 나와요.' : '원의 둘레는 2πR이라서 반지름 R부터 알아야 해요. R은 △OBC의 둘레에서 구해요. OB, OC가 둘 다 R이라서 둘레에 R이 두 번 들어 있거든요.', cap: 'OB=OC=R → △OBC의 둘레 = 2R + BC' });
      out.push({ k: 'fig', f: 'rad', lb: '반지름', t: '외심 O에서 두 꼭짓점 B, C까지의 거리는 같아요. $\\overline{OB}=\\overline{OC}=R$.', cap: 'OB=OC=R (외접원의 반지름)' });
      out.push({ k: 'fig', f: 'perim', lb: '둘레', t: `△OBC의 둘레는 $\\overline{OB}+\\overline{OC}+\\overline{BC}=R+R+${a}=2R+${a}$이고, 이것이 ${per} cm예요.`, cap: `2R+${a}=${per}` });
      out.push({ k: 'eq', f: 'eq', t: `$2R=${per}-${a}=${per - a}$이므로 $R=\\frac{${per - a}}{2}=${R}$ (cm)`, cap: `R=\\frac{${per}−${a}}{2}=${R} cm` });
      if (v === 0) out.push({ k: 'ans', f: 'ans', t: `$R=${R}\\text{ cm}$`, cap: `R = ${R} cm` });
      else {
        out.push({ k: 'eq', f: 'eq2', t: `원의 둘레는 $2\\pi R$이므로 $x=2\\pi\\times${R}=${2 * R}\\pi$ (cm)`, cap: `x=2π×${R}=${2 * R}π cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${2 * R}\\pi\\text{ cm}$`, cap: `x = ${2 * R}π cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: () => RBOX,
      base: (b, M) => { const g = o7geom(M); b.circle(g.O, 1, { color: 'sky', width: 2.4, alpha: 0.7 }); fillPoly(b, [g.A, g.B, g.C], 'sky', 0.06); poly(b, [g.A, g.B, g.C], 'ink', 2.2, { alpha: 0.5 }); },
      legend: (M) => `O: 외심 · △OBC의 둘레 ${M.per} cm`,
      st: {
        given: (L, M, s, X) => {
          const { O, B, C: Cc } = o7geom(M);
          L.fl([O, B, Cc], 'rose', 0.14); L.ln(O, B, 'rose', 3.4); L.ln(O, Cc, 'rose', 3.4); L.ln(B, Cc, 'ink', 3.6); L.tk(O, B, 1, 'amber'); L.tk(O, Cc, 1, 'amber');
          L.tx(G.mid(B, Cc), `${M.a} cm`, { dy: -20, size: fs(X.b, 16), color: 'sky', keep: true });
        },
        rad: (L, M, s, X) => { const { O, B, C: Cc } = o7geom(M); L.ln(O, B, 'rose', 4.6); L.ln(O, Cc, 'rose', 4.6); L.tk(O, B, 2, 'rose'); L.tk(O, Cc, 2, 'rose'); L.sd(O, Cc, pt(-1, 0.2), 'R', { color: 'rose', size: fs(X.b, 16), gap: 8 }); L.sd(O, B, pt(1, 0.2), 'R', { color: 'rose', size: fs(X.b, 16), gap: 8 }); },
        perim: (L, M, s, X) => { const { O, B, C: Cc } = o7geom(M); L.fl([O, B, Cc], 'rose', 0.22); L.pl([O, B, Cc], 'rose', 4); L.sd(O, Cc, pt(-1, 0.2), 'R', { color: 'rose', size: fs(X.b, 16), gap: 8 }); L.sd(O, B, pt(1, 0.2), 'R', { color: 'rose', size: fs(X.b, 16), gap: 8 }); },
        eq: (L, M, s, X) => { const { O, B, C: Cc } = o7geom(M); L.ln(O, B, 'rose', 4.6); L.sd(O, B, pt(1, 0.2), `R = ${M.R} cm`, { color: 'rose', size: fs(X.b, 16), gap: 8 }); }
      },
      x: (b, M, s, X) => {
        const { O, B } = o7geom(M), v = (s.trV || 0) % 2;
        if (v === 0) { if (!X.at('eq') && !X.at('rad') && !X.at('perim')) G.sideTag(b, O, B, pt(1, 0.2), X.xVal ? `R = ${M.R} cm` : 'R', { color: 'amber', size: fs(b, X.xVal ? 16 : 18), gap: 8 }); }
        else {
          const on = X.prob || X.at('given') || X.at('eq2') || X.at('ans');
          if (on) b.circle(O, 1, { color: 'amber', width: 3.6 });
          T(b, pt(0, -1), X.xVal ? `x = ${2 * M.R}π cm` : 'x', { dy: -20, size: fs(b, X.xVal ? 16 : 18), color: 'amber' });
        }
      },
      top: (b, M, s, X) => { const { O, A, B, C: Cc } = o7geom(M); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 }); T(b, O, 'O', { dx: 0, dy: -16, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); T(b, B, 'B', { dx: -14, dy: -8, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: -8, size: 18 }); }
    })
  };

  /* ====================================================================== 1. 외심 */
  const o1 = {
    id: 't5-1', title: '외심 O와 세 변의 수직이등분선', short: '외심', solve: o1Solve,
    question: '삼각형 세 변의 수직이등분선은 한 점에서 만날까? 그 점에서 세 꼭짓점까지의 거리는?',
    ctl: ['trOa', 'trOb', 'trOr'],
    init: (s) => { s.trOa = 60; s.trOb = 65; s.trOr = 6; s.trV = 0; },
    reroll: (s) => { let a, b2; do { a = rint(50, 70); b2 = rint(50, 70); } while (Math.abs(a - b2) < 6 || Math.abs(180 - a - b2 - a) < 6 || Math.abs(180 - a - b2 - b2) < 6); // 세 각이 눈에 띄게 달라서 「같지 않다」는 반례를 그림에서 볼 수 있게
      s.trOa = a; s.trOb = b2; s.trOr = rint(4, 9); s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const a = clamp(Math.round(s.trOa), 45, 75), b = clamp(Math.round(s.trOb), 45, 75), c = 180 - a - b, R = clamp(Math.round(s.trOr), 3, 10);
      return { a, b, c, R, g: circGeom(a, b, c), z: 90 - c };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, R, g } = M, { O, A, B, C: Cc, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      const mids = [[D, B, Cc, 1], [E, Cc, A, 2], [F, A, B, 3]];
      mids.forEach(([Mm, p, q, n]) => { line(b, O, Mm, show(1) || C.problem ? 'green' : 'green', 3, { dash: [7, 5] }); tick(b, p, Mm, n, 'amber'); tick(b, Mm, q, n, 'amber'); });
      if (!C.problem) { ang(b, D, O, Cc, { color: 'green', r: 18 }); ang(b, E, O, A, { color: 'green', r: 18 }); ang(b, F, O, B, { color: 'green', r: 18 }); }
      [[O, A, 1], [O, B, 2], [O, Cc, 3]].forEach(([p, q]) => line(b, p, q, show(2) || C.problem ? 'rose' : 'ink', show(2) || C.problem ? 3.2 : 1.4, { alpha: show(2) || C.problem ? 1 : 0.35 }));
      if (C.problem) {
        if (v === 0) { G.sideTag(b, O, A, pt(1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 8 }); G.sideTag(b, O, B, pt(1, -1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { ang(b, O, A, B, { color: 'sky', r: 22, label: dg(180 - 2 * M.z), size: 15, labelDist: 40, labelRot: 40 }); ang(b, A, O, B, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
      } else {
        const lf = fs(b, 15);
        if (show(2)) { G.sideTag(b, O, A, pt(1, 1), `${R} cm`, { color: 'rose', size: lf, gap: 8 }); G.sideTag(b, O, B, pt(1, -1), `${R} cm`, { color: 'rose', size: lf, gap: 10 }); G.sideTag(b, O, Cc, pt(-1, -1), `${R} cm`, { color: 'rose', size: lf, gap: 10 }); }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); [D, E, F].forEach((z) => b.point(z, { color: 'green', r: 3.8 }));
      T(b, O, 'O', { dx: 12, dy: 4, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      tagOut(b, D, O, 'D', { size: 16, color: 'green', nameColor: 'green', gap: 8 }); tagOut(b, E, O, 'E', { size: 16, gap: 8 }); tagOut(b, F, O, 'F', { size: 16, gap: 8 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '세 변의 수직이등분선이 한 점 O에서 만나요';
        else if (C.review && st === 2) { row = `OA=OB=OC=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `O는 외접원의 중심, 반지름 R=${R} cm`; col = 'rose'; }
        else row = `OA=OB=OC=${R} cm  (외접원의 반지름)`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
      void a; void bb; void c;
    },
    steps: (M) => [
      `삼각형 ABC의 세 변 BC, CA, AB의 수직이등분선을 그으면 한 점 O에서 만나요. 이 점이 외심이에요. 각 변의 중점은 D, E, F예요.`,
      `수직이등분선 위의 점은 선분의 양 끝점에서 같은 거리에 있으므로 $\\overline{OB}=\\overline{OC}$, $\\overline{OC}=\\overline{OA}$예요. 즉 $\\overline{OA}=\\overline{OB}=\\overline{OC}=${M.R}$ cm.`,
      `외심 O에서 세 꼭짓점까지의 거리가 같으므로 O를 중심으로 하고 세 꼭짓점을 지나는 원(외접원)이 있어요. 반지름 $R=${M.R}$ cm예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>와 <b>반지름 R</b>을 바꿔 보세요. 세 변의 수직이등분선(초록 점선)은 늘 <b>한 점 O</b>에서 만나고, O에서 세 꼭짓점까지의 거리는 모두 같아요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('OA = OB = OC', `${M.R} cm`, 'rose', '외접원의 반지름 R', null, true)],
      formula: `<p>$\\overline{OA}=\\overline{OB}=\\overline{OC}=R=${M.R}$ cm</p><p>$\\overline{BD}=\\overline{CD},\\ \\overline{CE}=\\overline{AE},\\ \\overline{AF}=\\overline{BF}$ (D, E, F는 변의 중점)</p>`,
      rule: '삼각형의 세 변의 수직이등분선은 한 점(외심)에서 만나고, 외심에서 세 꼭짓점까지의 거리는 같다.',
      notes: notes('외심 O는 변의 <b>중점</b>(D, E, F)이 아니에요. 수직이등분선이 만나는 점이에요.', '외심에서 <b>꼭짓점</b>까지의 거리(OA, OB, OC)가 같아요. 변까지의 거리(OD, OE, OF)는 같지 않아요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { R, z } = M, key = `${v}:${R}:${M.a}:${M.b}`;
      const head = '그림에서 점 O는 삼각형 ABC의 외심이고, 점 D, E, F는 각 변의 중점이다.';
      if (v === 0) return numProb({ tag: '외심 · 외접원의 반지름', key, stem: `${head} ${S('OA')}=${R} cm일 때, ${S('OB')}의 길이 $x$는?`, correct: R, wrongs: [[R * 2, '두 배가 아니에요. 외심에서 세 꼭짓점까지의 거리는 같아요.'], [R + 1, '다시 생각해 보세요.'], [R - 1, '다시 생각해 보세요.'], [R + 2, '다시 생각해 보세요.'], [Math.max(1, R - 2), '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '외심 · 이등변삼각형', key, stem: `${head} ∠AOB=${180 - 2 * z}°일 때, ∠OAB의 크기 $x$는?`, correct: z, wrongs: [[180 - 2 * z, '∠AOB예요.'], [90 - z, '다시 생각해 보세요.'], [2 * z, '다시 생각해 보세요.'], [z + 10, '다시 계산해 보세요.'], [z - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== z), ...degOpts(5) });
      const pool = O1POOL; // 풀이 흐름의 문장 풀과 같은 목록(문장마다 이유·그림이 붙어 있어요)
      const r = mkStmtChoices(pool, M, key + 'F', false);
      return { tag: '외심의 성질 · 옳지 않은 것', key: key + 'F', stem: `${head} 다음 중 옳지 않은 것은?`, choices: r.choices, wide: true };
    },
    verify: (s) => { const M = o1.model(s), g = M.g; return { ans: dist(g.O, g.A), model: dist(g.O, g.B), extra: [[dist(g.O, g.C), dist(g.O, g.A)], [angBetween(g.A, g.B, g.C), M.a], [angBetween(g.B, g.A, g.C), M.b]] }; }
  };

  /* ====================================================================== 2. 직각삼각형의 외심 */
  const rightGeom = (al) => { const O = pt(0, 0), A = pt(-1, 0), B = pt(1, 0), Cc = polar(O, 1, -2 * al); return { O, A, B, C: Cc }; };
  const o2 = {
    id: 't5-2', title: '직각삼각형의 외심은 빗변의 중점', short: '직각삼각형의 외심', solve: o2Solve,
    question: '∠C=90°인 직각삼각형 ABC의 외심 O는 어디에 있을까?',
    ctl: ['trPa', 'trPr'],
    init: (s) => { s.trPa = 50; s.trPr = 4; s.trV = 0; },
    reroll: (s) => { s.trPa = pick([24, 30, 36, 40, 50, 56, 64], s.trPa); s.trPr = rint(2, 7); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const al = clamp(Math.round(s.trPa / 2) * 2, 20, 70), R = clamp(Math.round(s.trPr), 2, 7); return { al, R, g: rightGeom(al), be: 90 - al }; },
    draw(b, s, M, C) {
      const { al, R, g, be } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, { x0: -1.25, x1: 1.25, y0: -1.1, y1: 1.1 }, { t: 40, b: C.problem ? 40 : 56, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      ang(b, Cc, A, B, { color: 'sky', r: 24 });
      line(b, O, Cc, 'rose', 3.2);
      tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber');
      if (C.problem) {
        tick(b, O, Cc, 1, 'amber');
        if (v === 0) { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); G.sideTag(b, O, Cc, pt(1, 1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 36, label: dg(al), size: 16, labelDist: 54 }); ang(b, Cc, O, B, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 46 }); }
        else { G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 10 }); dim(b, A, B, pt(0, -2), 'x', { color: 'amber', size: fs(b, 18), off: 28 }); }
      } else {
        if (show(2)) { tick(b, O, Cc, 1, 'amber'); G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'rose', size: fs(b, 16), gap: 10 }); }
        if (show(3)) dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 });
        // AO와 AB는 같은 반직선이므로 A의 조건은 한 번만 표시합니다.
        // 같은 50°를 두 번 배치하면 두 번째 글자가 빗변 위로 밀립니다.
        ang(b, A, B, Cc, { color: 'sky', r: show(2) ? 28 : 30, rings: 1, label: dg(al), size: 14, labelDist: 46, noMark: !show(2) });
        if (show(2)) ang(b, B, Cc, A, { color: 'green', r: 28, rings: 2, label: dg(be), size: 14, labelDist: 48 });
      }
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 });
      T(b, A, 'A', { dx: -14, dy: 4, size: 18 }); T(b, B, 'B', { dx: 14, dy: 4, size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); T(b, O, 'O', { dy: 18, size: 18, color: 'rose' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '∠C=90° → 빗변 AB가 외접원의 지름';
        else if (C.review && st === 2) { row = `외심 O는 AB의 중점: OA=OB=OC=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `AB=2×${R}=${2 * R} cm`; col = 'amber'; }
        else row = `외심 O = 빗변의 중점 → R=${R} cm, AB=${2 * R} cm`;
        rowT(b, pt(0, 0), row, { dy: 70, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `$\\angle C=90^{\\circ}$이면 빗변 AB는 외접원의 지름이에요. (한 호에 대한 원주각이 90°)`,
      `따라서 외심 O는 빗변 AB의 중점이에요. $\\overline{OA}=\\overline{OB}=\\overline{OC}=${M.R}$ cm.`,
      `외접원의 반지름은 $R=${fr('\\overline{AB}', 2)}=${fr(String(2 * M.R), 2)}=${M.R}$ cm, 즉 $\\overline{AB}=2R=${2 * M.R}$ cm예요. 또 △OBC가 이등변삼각형이므로 $\\angle OCB=\\angle B=${M.be}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A</b>와 <b>OA=OB=OC</b>를 바꿔 보세요. ∠C=90°인 직각삼각형의 외심 O는 늘 <b>빗변 AB의 중점</b>이에요. 그래서 OC는 빗변의 반이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A · ∠B', `${M.al}° · ${M.be}°`, 'sky'), rd('OA = OB = OC', `${M.R} cm`, 'rose'), rd('빗변 AB', `${2 * M.R} cm`, 'amber', '반지름의 2배', null, true)],
      formula: `<p>R $=\\overline{OA}=\\overline{OB}=\\overline{OC}=${fr('\\overline{AB}', 2)}=${M.R}$ cm</p><p>$\\overline{AB}=2R=${2 * M.R}$ cm</p>`,
      rule: '직각삼각형의 외심은 빗변의 중점이고, 외접원의 반지름은 빗변의 길이의 반이다.',
      notes: notes('직각이 있는 꼭짓점 C가 아니라 <b>빗변의 중점</b>이 외심이에요.', 'OC도 반지름이에요. 직각 꼭짓점에서 빗변의 중점까지의 거리 = 빗변의 반이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { al, R, be } = M, key = `${v}:${al}:${R}`;
      const head = '그림에서 ∠C=90°인 직각삼각형 ABC의 외심 O는 빗변 AB의 중점이다.';
      if (v === 0) return numProb({ tag: '직각삼각형의 외심 · 반지름', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, ${S('OC')}의 길이 $x$는?`, correct: R, wrongs: [[2 * R, '빗변의 길이예요. OC는 외접원의 반지름이라 빗변의 반이에요.'], [3 * R, '다시 계산해 보세요.'], [R + 1, '다시 계산해 보세요.'], [R - 1, '다시 계산해 보세요.'], [R + 2, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '직각삼각형의 외심 · 각', key, stem: `${head} ∠A=${al}°일 때, ∠OCB의 크기 $x$는?`, correct: be, wrongs: [[al, '∠A와 같다고 했어요. OC=OB이므로 ∠OCB=∠B예요.'], [90, '직각이에요.'], [2 * be, '다시 생각해 보세요.'], [be + 10, '다시 계산해 보세요.'], [be - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== be), ...degOpts(5) });
      return numProb({ tag: '직각삼각형의 외심 · 빗변', key, stem: `${head} ${S('OC')}=${R} cm일 때, 빗변 ${S('AB')}의 길이 $x$는?`, correct: 2 * R, wrongs: [[R, 'OC의 길이예요. 빗변은 반지름의 2배예요.'], [3 * R, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.'], [2 * R - 1, '다시 계산해 보세요.'], [2 * R + 1, '다시 계산해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = o2.model(s), g = M.g; return { ans: dist(g.O, g.C), model: dist(g.O, g.A), extra: [[angBetween(g.C, g.A, g.B), 90], [angBetween(g.A, g.B, g.C), M.al]] }; }
  };

  /* ====================================================================== 3. 30°-60°-90° */
  const o3 = {
    id: 't5-3', title: '30°-60°-90° 직각삼각형의 외심', short: '30°-60°-90°', solve: o3Solve,
    question: '∠A=30°, ∠B=60°, ∠C=90°인 직각삼각형에서 BC와 외접원의 반지름은 어떤 관계일까?',
    ctl: ['trSr'],
    init: (s) => { s.trSr = 5; s.trV = 0; },
    reroll: (s) => { s.trSr = rint(3, 9); s.trV = (s.trV + 1) % 3; },
    model: (s) => ({ R: clamp(Math.round(s.trSr), 3, 9), g: rightGeom(30) }),
    draw(b, s, M, C) {
      const { R, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, { x0: -1.25, x1: 1.25, y0: -1.1, y1: 1.1 }, { t: 40, b: C.problem ? (v === 2 ? 64 : 40) : 56, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.08); fillPoly(b, [O, B, Cc], 'green', show(2) ? 0.28 : 0.1); poly(b, [A, B, Cc], 'ink', 3.6); line(b, O, Cc, 'rose', 3.2);
      ang(b, Cc, A, B, { color: 'sky', r: 24 });
      tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber');
      if (C.problem) {
        tick(b, O, Cc, 1, 'amber');
        ang(b, A, B, Cc, { color: 'sky', r: 36, label: '30°', size: 16, labelDist: 56 }); ang(b, B, A, Cc, { color: 'sky', r: 30, label: '60°', size: 16, labelDist: 50 });
        if (v === 0) { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); G.sideTag(b, B, Cc, pt(-1, 1), 'x', { color: 'amber', size: fs(b, 18), gap: 10 }); }
        else if (v === 1) { G.sideTag(b, B, Cc, pt(-1, 1), `${R} cm`, { color: 'sky', size: fs(b, 16), gap: 10 }); dim(b, A, B, pt(0, -2), 'x', { color: 'amber', size: fs(b, 18), off: 28 }); }
        else { dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 }); poly(b, [O, B, Cc], 'amber', 4.2); T(b, pt(0, 1.1), '△OBC의 둘레 = x', { dy: 20, size: fs(b, 17), color: 'amber' }); }
      } else {
        ang(b, A, B, Cc, { color: 'sky', r: 36, label: '30°', size: 14, labelDist: 56 });
        if (show(2)) { ang(b, B, A, Cc, { color: 'green', r: 30, rings: 1, label: '60°', size: 14, labelDist: 50 }); ang(b, Cc, B, O, { color: 'green', r: 26, label: '60°', size: 14, labelDist: 40 }); ang(b, O, Cc, B, { color: 'green', r: 22, label: '60°', size: 14, labelDist: 40 }); tick(b, O, Cc, 1, 'amber'); tick(b, B, Cc, 1, 'amber'); }
        G.sideTag(b, O, Cc, pt(1, 1), `${R} cm`, { color: 'rose', size: fs(b, 15), gap: 10 });
        if (show(3)) G.sideTag(b, B, Cc, pt(-1, 1), `${R} cm`, { color: 'green', size: fs(b, 16), gap: 10 });
        dim(b, A, B, pt(0, -2), `${2 * R} cm`, { color: 'sky', size: fs(b, 16), off: 28 });
      }
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); b.point(O, { color: 'rose', r: 5.5 });
      T(b, A, 'A', { dx: -14, dy: 4, size: 18 }); T(b, B, 'B', { dx: 14, dy: 4, size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); T(b, O, 'O', { dy: 18, size: 18, color: 'rose' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '외심 O는 빗변 AB의 중점 → OB=OC=R';
        else if (C.review && st === 2) { row = '△OBC: ∠B=60°, OB=OC → 정삼각형'; col = 'green'; }
        else if (C.review && st === 3) { row = `BC=OB=OC=R=${R} cm`; col = 'green'; }
        else row = `AB=${2 * R} cm → BC=${R} cm (빗변의 반)`;
        rowT(b, pt(0, 0), row, { dy: 70, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이므로 외심 O는 빗변 AB의 중점이에요. $\\overline{OB}=\\overline{OC}=R=${M.R}$ cm.`,
      `△OBC에서 $\\overline{OB}=\\overline{OC}$이므로 $\\angle OCB=\\angle B=60^{\\circ}$이고, 세 각이 모두 60°예요. 따라서 △OBC는 정삼각형이에요.`,
      `정삼각형이므로 $\\overline{BC}=\\overline{OB}=${M.R}$ cm예요. 즉 $\\overline{BC}=${fr('1', 2)}\\overline{AB}=${fr(String(2 * M.R), 2)}=${M.R}$ cm (∠A=30°일 때 마주 보는 변은 빗변의 반).`
    ],
    view: (M) => ({
      guide: '막대로 <b>외접원의 반지름 R</b>을 바꿔 보세요. 30°-60°-90° 직각삼각형에서 외심 O를 찍으면 <b>△OBC가 정삼각형</b>이 돼요. 그래서 BC=R=AB의 반이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('외접원의 반지름 R', `${M.R} cm`, 'rose'), rd('AB (빗변)', `${2 * M.R} cm`, 'sky'), rd('BC', `${M.R} cm`, 'green', '= R, △OBC는 정삼각형', null, true)],
      formula: `<p>△OBC는 정삼각형 $\\Rightarrow\\ \\overline{BC}=\\overline{OB}=R=${M.R}$ cm</p><p>$\\overline{AB}=2R=${2 * M.R}$ cm</p>`,
      rule: '∠A=30°인 직각삼각형에서 BC = 빗변 AB의 반 = 외접원의 반지름 R이다.',
      notes: notes('∠A=30°의 <b>마주 보는 변</b> BC가 빗변의 반이에요. 다른 직각변 AC는 아니에요.', '정삼각형임을 보이려면 두 변이 같고 한 각이 60°임을 확인해요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { R } = M, key = `${v}:${R}`;
      const head = '그림에서 ∠C=90°, ∠A=30°, ∠B=60°인 직각삼각형 ABC의 외심은 점 O이다.';
      if (v === 0) return numProb({ tag: '30°-60°-90° · 변의 길이', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, ${S('BC')}의 길이 $x$는?`, correct: R, wrongs: [[2 * R, '빗변의 길이예요. BC는 빗변의 반이에요.'], [R * 3, '다시 계산해 보세요.'], [R + 1, '다시 계산해 보세요.'], [R - 1, '다시 계산해 보세요.'], [R + 2, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '30°-60°-90° · 빗변', key, stem: `${head} ${S('BC')}=${R} cm일 때, ${S('AB')}의 길이 $x$는?`, correct: 2 * R, wrongs: [[R, 'BC의 길이예요. 빗변은 BC의 2배예요.'], [3 * R, '다시 계산해 보세요.'], [2 * R + 1, '다시 계산해 보세요.'], [2 * R - 1, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.']], ...cmOpts });
      return numProb({ tag: '30°-60°-90° · 정삼각형 OBC의 둘레', key, stem: `${head} ${S('AB')}=${2 * R} cm일 때, △OBC의 둘레 $x$는?`, correct: 3 * R, wrongs: [[2 * R, '다시 생각해 보세요. △OBC는 정삼각형이에요.'], [R, '한 변의 길이예요.'], [4 * R, '다시 계산해 보세요.'], [3 * R + 1, '다시 계산해 보세요.'], [3 * R - 1, '다시 계산해 보세요.']], ...cmOpts });
    },
    verify: (s) => { const M = o3.model(s), g = M.g; return { ans: dist(g.B, g.C), model: dist(g.O, g.B), extra: [[dist(g.O, g.C), 1], [angBetween(g.B, g.O, g.C), 60]] }; }
  };

  /* ====================================================================== 4. 외심의 각 */
  const o4 = {
    id: 't5-4', title: '외심에서의 각 (x+y+z=90°, ∠BOC=2∠A)', short: '외심의 각', solve: o4Solve,
    question: '외심 O에서 세 꼭짓점을 이으면 생기는 이등변삼각형의 밑각 x, y, z의 합은 얼마일까?',
    ctl: ['trOa', 'trOb'],
    init: (s) => { s.trOa = 60; s.trOb = 65; s.trV = 0; },
    reroll: (s) => { s.trOa = rint(50, 70); s.trOb = rint(50, 70); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const a = clamp(Math.round(s.trOa), 45, 75), b = clamp(Math.round(s.trOb), 45, 75), c = 180 - a - b; return { a, b, c, x: 90 - c, y: 90 - a, z: 90 - b, g: circGeom(a, b, c) }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, x, y, z, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 3;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      [[O, A], [O, B], [O, Cc]].forEach(([p, q]) => line(b, p, q, 'rose', 3.2));
      const lab = (val, nm, prob) => (prob ? '' : dg(val) );
      if (C.problem) {
        if (v === 0) { ang(b, B, Cc, O, { color: 'sky', r: 34, label: dg(y), size: 15, labelDist: 54 }); ang(b, Cc, A, O, { color: 'green', r: 34, label: dg(z), size: 15, labelDist: 54 }); ang(b, A, B, O, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 54 }); }
        else if (v === 1) { ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56 }); ang(b, O, B, Cc, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 52 }); }
        else { ang(b, A, B, O, { color: 'amber', r: 34, label: dg(x), size: 15, labelDist: 54 }); ang(b, B, Cc, O, { color: 'sky', r: 34, label: dg(y), size: 15, labelDist: 54 }); ang(b, Cc, A, B, { color: 'green', r: 40, label: 'x', size: 17, labelDist: 62 }); }
      } else {
        const rg = (n) => show(n);
        if (rg(1)) { ang(b, B, A, O, { color: 'amber', r: 34, rings: 1, label: dg(x), size: 14, labelDist: 52 }); ang(b, A, B, O, { color: 'amber', r: 34, rings: 1 }); }
        if (rg(1)) { ang(b, Cc, B, O, { color: 'sky', r: 34, rings: 2, label: dg(y), size: 14, labelDist: 52 }); ang(b, B, Cc, O, { color: 'sky', r: 34, rings: 2 }); }
        if (rg(1)) { ang(b, A, Cc, O, { color: 'green', r: 34, rings: 3, label: dg(z), size: 14, labelDist: 52 }); ang(b, Cc, A, O, { color: 'green', r: 34, rings: 3 }); }
        if (rg(3)) { T(b, mid(B, Cc), `∠BOC=2∠A=${2 * a}°`, { dy: 30, size: fs(b, 14), color: 'rose' }); }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = 'OA=OB=OC → 세 이등변삼각형의 밑각 x, y, z';
        else if (C.review && st === 2) { row = `x+y+z=${x}°+${y}°+${z}°=90°`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠BOC=180°−2y=${180 - 2 * y}°=2∠A`; col = 'rose'; }
        else row = `x+y+z=${x + y + z}°, ∠BOC=2∠A=${2 * a}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
      void bb; void c;
    },
    steps: (M) => [
      `외심 O에서 $\\overline{OA}=\\overline{OB}=\\overline{OC}$이므로 △OAB, △OBC, △OCA는 모두 이등변삼각형이에요. 밑각을 각각 $\\angle OAB=\\angle OBA=x$, $\\angle OBC=\\angle OCB=y$, $\\angle OCA=\\angle OAC=z$라 해요.`,
      `삼각형 ABC의 세 내각의 합: $2x+2y+2z=180^{\\circ}$이므로 $x+y+z=90^{\\circ}$ (이 그림: ${M.x}°+${M.y}°+${M.z}°=90°).`,
      `$\\angle A=x+z$이고 $\\angle BOC=180^{\\circ}-2y=2(90^{\\circ}-y)=2(x+z)$이므로 $\\angle BOC=2\\angle A=${2 * M.a}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>를 바꿔 보세요. 외심 O에서 세 꼭짓점까지는 같은 거리이므로 이등변삼각형이 셋 생기고, 같은 표시(호의 개수)의 각이 같아요. <b>x+y+z는 늘 90°</b>, <b>∠BOC는 ∠A의 2배</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('x (∠OAB=∠OBA)', `${M.x}°`, 'amber'), rd('y (∠OBC=∠OCB)', `${M.y}°`, 'sky'), rd('z (∠OCA=∠OAC)', `${M.z}°`, 'green'), rd('x + y + z', '90°', 'rose', `∠BOC = 2∠A = ${2 * M.a}°`, null, true)],
      formula: `<p>$x+y+z=90^{\\circ}$</p><p>$\\angle BOC=2\\angle A=2\\times${M.a}^{\\circ}=${2 * M.a}^{\\circ}$</p>`,
      rule: '삼각형의 외심에서 세 꼭짓점을 이으면 이등변삼각형 셋이 생기고, 밑각의 합 x+y+z=90°, ∠BOC=2∠A이다.',
      notes: notes('같은 표시의 <b>밑각</b>끼리만 같아요. x, y, z는 서로 달라도 돼요.', '∠BOC는 ∠A의 <b>2배</b>예요. 이 성질은 예각삼각형일 때 성립해요. 둔각삼각형은 다음 장면에서 달라져요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 3, { a, x, y, z, c } = M, key = `${v}:${a}:${M.b}`;
      const head = '그림에서 점 O는 예각삼각형 ABC의 외심이다.';
      if (v === 0) return numProb({ tag: '외심의 각 · x+y+z=90°', key, stem: `${head} ∠OBC=${y}°, ∠OCA=${z}°일 때, ∠OAB의 크기 $x$는?`, correct: x, wrongs: [[y + z, '두 각의 합이에요. x+y+z=90°를 이용해요.'], [180 - y - z, '다시 생각해 보세요.'], [90 + y + z, '다시 계산해 보세요.'], [x + 10, '다시 계산해 보세요.'], [Math.max(1, x - 5), '다시 계산해 보세요.']].filter((q) => q[0] !== x), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '외심의 각 · ∠BOC=2∠A', key, stem: `${head} ∠A=${a}°일 때, ∠BOC의 크기 $x$는?`, correct: 2 * a, wrongs: [[a, '∠A 그대로예요. ∠BOC는 ∠A의 2배예요.'], [180 - 2 * a, '이등변삼각형 OBC의 밑각의 합이에요.'], [90 - a, '다시 생각해 보세요.'], [2 * a + 10, '다시 계산해 보세요.'], [2 * a - 10, '다시 계산해 보세요.']].filter((q) => q[0] > 0), ...degOpts(5) });
      return numProb({ tag: '외심의 각 · ∠C', key, stem: `${head} ∠OAB=${x}°, ∠OBC=${y}°일 때, ∠ACB의 크기 $x$는?`, correct: c, wrongs: [[x + y, 'x+y는 ∠B예요. ∠C=y+z이고 z=90°−x−y예요.'], [90 - y, '다시 생각해 보세요.'], [z, '다시 생각해 보세요.'], [c + 10, '다시 계산해 보세요.'], [c - 5, '다시 계산해 보세요.']].filter((q) => q[0] !== c), ...degOpts(5) });
    },
    verify: (s) => { const M = o4.model(s), g = M.g; return { ans: angBetween(g.O, g.B, g.C), model: 2 * M.a, extra: [[angBetween(g.A, g.B, g.O), M.x], [angBetween(g.B, g.C, g.O), M.y], [angBetween(g.C, g.A, g.O), M.z], [M.x + M.y + M.z, 90]] }; }
  };

  /* ====================================================================== 5. 둔각삼각형의 외심 */
  const o5 = {
    id: 't5-5', title: '둔각삼각형의 외심은 삼각형의 바깥', short: '둔각삼각형의 외심', solve: o5Solve,
    question: '∠A가 둔각인 삼각형의 외심 O는 삼각형 안에 있을까, 밖에 있을까?',
    ctl: ['trQa', 'trQb'],
    init: (s) => { s.trQa = 112; s.trQb = 25; s.trV = 0; },
    reroll: (s) => { s.trQa = pick([100, 104, 110, 116, 120, 126], s.trQa); s.trQb = rint(15, 35); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const a = clamp(Math.round(s.trQa / 2) * 2, 100, 130), b = clamp(Math.round(s.trQb), 15, 40), c = 180 - a - b; return { a, b, c, boc: 360 - 2 * a, g: circGeom(a, b, c) }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, boc, g } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      drawCirc(b, g);
      [[O, B], [O, Cc], [O, A]].forEach(([p, q]) => line(b, p, q, 'rose', 3.2));
      ang(b, A, B, Cc, { color: 'sky', r: 24, label: C.problem && v === 1 ? 'x' : dg(a), size: 16, labelDist: 40 });
      if (C.problem) { ang(b, O, B, Cc, { color: v === 1 ? 'sky' : 'amber', r: 22, label: v === 1 ? dg(boc) : 'x', size: 17, labelDist: 38 }); if (v === 1) { /* A 의 각이 x */ } }
      else if (show(2)) ang(b, O, B, Cc, { color: 'rose', r: 22, label: dg(boc), size: 15, labelDist: 38 });
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠A=${a}° (둔각) → 외심 O는 삼각형의 바깥`;
        else if (C.review && st === 2) { row = `∠BOC=360°−2∠A=${boc}°`; col = 'rose'; }
        else row = `∠A=${a}° 둔각: O는 밖에 있고 ∠BOC=360°−2×${a}°=${boc}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 15), color: col });
      }
      void bb; void c;
    },
    steps: (M) => [
      `∠A=${M.a}°가 둔각이면 외심 O는 삼각형 ABC의 바깥쪽(변 BC 너머)에 놓여요. 세 변의 수직이등분선이 삼각형 밖에서 만나기 때문이에요.`,
      `호 BC(점 A를 지나지 않는 쪽)의 중심각은 $360^{\\circ}-\\angle BOC$이고, 원주각 ∠A는 이 호에 대한 각이므로 $\\angle A=${fr('1', 2)}\\times(360^{\\circ}-\\angle BOC)$예요. 따라서 $\\angle BOC=360^{\\circ}-2\\angle A=360^{\\circ}-2\\times${M.a}^{\\circ}=${M.boc}^{\\circ}$.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A(둔각)</b>와 ∠B를 바꿔 보세요. ∠A가 90°보다 크면 외심 O는 <b>삼각형 바깥</b>에 있고, ∠BOC는 2∠A가 아니라 <b>360°−2∠A</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A (둔각)', `${M.a}°`, 'sky'), rd('외심 O', '삼각형의 바깥', 'rose'), rd('∠BOC', `${M.boc}°`, 'rose', '360° − 2∠A', null, true)],
      formula: `<p>$\\angle BOC=360^{\\circ}-2\\angle A=360^{\\circ}-2\\times${M.a}^{\\circ}=${M.boc}^{\\circ}$</p>`,
      rule: '둔각삼각형의 외심은 삼각형의 바깥에 있고, ∠BOC = 360° − 2∠A (예각삼각형은 2∠A)이다.',
      notes: notes('둔각삼각형에서는 ∠BOC를 <b>2∠A</b>로 쓰면 안 돼요. 360°보다 크거나 정리의 모양이 달라져요.', '직각삼각형의 외심은 변 위(빗변의 중점), 둔각삼각형의 외심은 바깥이에요.')
    }),
    prob: (M, s) => {
      const v = (s.trV || 0) % 2, { a, boc } = M, key = `${v}:${a}`;
      const head = '그림에서 점 O는 ∠A가 둔각인 삼각형 ABC의 외심이다.';
      if (v === 0) return numProb({ tag: '[함정] 둔각삼각형의 외심 · ∠BOC', key, stem: `${head} ∠A=${a}°일 때, ∠BOC의 크기 $x$는?`, correct: boc, wrongs: [[2 * a, '예각삼각형일 때의 공식이에요. 둔각이면 360°−2∠A예요.'], [180 - 2 * (a - 90), '다시 생각해 보세요.'], [a, '∠A 그대로예요.'], [boc + 10, '다시 계산해 보세요.'], [boc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== boc && q[0] > 0 && q[0] < 360), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
      return numProb({ tag: '[함정] 둔각삼각형의 외심 · ∠A', key, stem: `${head} ∠BOC=${boc}°일 때, ∠A의 크기 $x$는?`, correct: a, wrongs: [[boc / 2, '예각삼각형일 때의 공식이에요. 둔각이면 ∠A=(360°−∠BOC)÷2예요.'], [boc, '∠BOC 그대로예요.'], [180 - boc / 2, '다시 생각해 보세요.'], [a + 10, '다시 계산해 보세요.'], [a - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== a && Number.isInteger(q[0])), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
    },
    verify: (s) => { const M = o5.model(s), g = M.g; return { ans: angBetween(g.O, g.B, g.C), model: M.boc, extra: [[angBetween(g.A, g.B, g.C), M.a]] }; }
  };

  /* ====================================================================== 6. 중심각의 비 */
  const validRatio = (a, b, c) => { const S0 = a + b + c; return [a, b, c].every((q) => (360 * q) % S0 === 0 && ((360 * q) / S0) % 2 === 0 && (360 * q) / S0 < 180); };
  const o6 = {
    id: 't5-6', title: '중심각의 비로 구하는 원주각', short: '중심각의 비', solve: o6Solve,
    question: '∠AOB : ∠BOC : ∠COA = a : b : c 일 때 ∠ACB는 얼마일까?',
    ctl: ['trRa', 'trRb', 'trRc'],
    init: (s) => { s.trRa = 2; s.trRb = 3; s.trRc = 4; s.trV = 0; },
    reroll: (s) => { const c = [[2, 3, 4], [3, 4, 5], [2, 3, 5], [3, 3, 4], [1, 2, 3], [4, 5, 6], [3, 4, 5]].filter((q) => validRatio(...q)); const p = pick(c, null); s.trRa = p[0]; s.trRb = p[1]; s.trRc = p[2]; s.trV = (s.trV + 1) % 2; },
    model: (s) => {
      const a = clamp(Math.round(s.trRa), 1, 6), b = clamp(Math.round(s.trRb), 1, 6), c0 = clamp(Math.round(s.trRc), 1, 6);
      let c = c0, ok = validRatio(a, b, c0);
      if (!ok) { for (let k = 1; k <= 6 && !ok; k++) for (const sg of [1, -1]) { const t = c0 + sg * k; if (t >= 1 && t <= 6 && validRatio(a, b, t)) { c = t; ok = true; break; } } }
      if (!ok) { c = 4; const aa = 2, bb = 3; return { a: aa, b: bb, c, adj: true, ...ratioGeo(aa, bb, c) }; }
      return { a, b, c, adj: c !== c0, ...ratioGeo(a, b, c) };
    },
    draw(b, s, M, C) {
      const { a, b: bb, c, g, ab, bc, ca } = M, { O, A, B, C: Cc } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.4, alpha: 0.6, dash: [6, 5] });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      [[O, A], [O, B], [O, Cc]].forEach(([p, q]) => line(b, p, q, 'rose', 3));
      if (C.problem) {
        ang(b, O, A, B, { color: 'rose', r: 22, label: String(a), size: 15, labelDist: 40 }); ang(b, O, B, Cc, { color: 'green', r: 22, label: String(bb), size: 15, labelDist: 40 }); ang(b, O, Cc, A, { color: 'violet', r: 22, label: String(c), size: 15, labelDist: 40 });
        ang(b, Cc, A, B, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 56 });
      } else {
        ang(b, O, A, B, { color: 'rose', r: 22, label: dg(ab), size: 13, labelDist: 40 }); ang(b, O, B, Cc, { color: 'green', r: 22, label: dg(bc), size: 13, labelDist: 40 }); ang(b, O, Cc, A, { color: 'violet', r: 22, label: dg(ca), size: 13, labelDist: 40 });
        if (show(3)) {
          // C의 원주각은 중심각 무리 밖으로 빼고 실제 C각 호에 연결합니다.
          const narrow = b.W < 560 && !C.thumb;
          ang(b, Cc, A, B, { color: 'amber', r: narrow ? Math.min(28, .24 * b.k) : 34, label: dg(ab / 2), size: 15, labelDist: narrow ? Math.min(40, .48 * b.k) : 56, labelRot: narrow ? ab / 4 + 30 : 0 });
        }
      }
      b.point(O, { color: 'rose', r: 5.5 }); [A, B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: -10, size: 18, color: 'rose' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠AOB:∠BOC:∠COA = ${a}:${bb}:${c}, 합 360°`;
        else if (C.review && st === 2) { row = `∠AOB = 360°×${a}/${a + bb + c} = ${ab}°`.replace(/(\d+)\/(\d+)/, '$1÷$2'); col = 'rose'; }
        else if (C.review && st === 3) { row = `∠ACB = ${ab}°÷2 = ${ab / 2}°`; col = 'amber'; }
        else row = `∠AOB=${ab}°, ∠BOC=${bc}°, ∠COA=${ca}° → ∠ACB=${ab / 2}°`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `세 중심각의 합은 $360^{\\circ}$이고 비가 $${M.a}:${M.b}:${M.c}$이므로 비의 합은 $${M.a}+${M.b}+${M.c}=${M.a + M.b + M.c}$예요.`,
      `$\\angle AOB=360^{\\circ}\\times${fr(String(M.a), String(M.a + M.b + M.c))}=${M.ab}^{\\circ}$, $\\angle BOC=${M.bc}^{\\circ}$, $\\angle COA=${M.ca}^{\\circ}$`,
      `한 호에 대한 원주각은 중심각의 반이므로 $\\angle ACB=${fr('1', 2)}\\angle AOB=${fr('1', 2)}\\times${M.ab}^{\\circ}=${M.ab / 2}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>비 a : b : c</b>를 바꿔 보세요. 중심각이 정수(짝수)가 되도록 c를 자동으로 맞춰요. 중심각 ∠AOB의 반이 <b>∠ACB</b>예요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('비 a : b : c', `${M.a} : ${M.b} : ${M.c}`, 'sky', M.adj ? '정수 각이 되도록 c를 맞췄어요' : null), rd('∠AOB · ∠BOC · ∠COA', `${M.ab}° · ${M.bc}° · ${M.ca}°`, 'rose'), rd('∠ACB', `${M.ab / 2}°`, 'amber', '∠AOB의 반', null, true)],
      formula: `<p>$\\angle AOB=360^{\\circ}\\times${fr(String(M.a), String(M.a + M.b + M.c))}=${M.ab}^{\\circ}$</p><p>$\\angle ACB=${fr('1', 2)}\\times${M.ab}^{\\circ}=${M.ab / 2}^{\\circ}$</p>`,
      rule: '세 중심각의 합은 360°이고, 한 호에 대한 원주각의 크기는 중심각의 크기의 반이다.',
      notes: notes('중심각의 합은 360°예요. 180°가 아니에요.', '∠ACB는 호 AB에 대한 원주각이므로 ∠AOB의 반이에요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, ab, bc, ca } = M, key = `${a}:${bb}:${c}`;
      return numProb({ tag: '중심각의 비와 원주각', key, stem: `그림에서 점 O는 삼각형 ABC의 외심이고 ∠AOB : ∠BOC : ∠COA = ${a} : ${bb} : ${c}이다. ∠ACB의 크기 $x$는?`, correct: ab / 2, wrongs: [[ab, '중심각 ∠AOB예요. ∠ACB는 그 반이에요.'], [bc / 2, '다른 호에 대한 원주각이에요.'], [ca / 2, '다른 호에 대한 원주각이에요.'], [(180 * a) / (a + bb + c), '비의 합이 360°이에요. 180°가 아니에요.'], [ab / 2 + 10, '다시 계산해 보세요.'], [ab / 2 - 10, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== ab / 2 && q[0] > 0), ...degOpts(5) });
    },
    verify: (s) => { const M = o6.model(s), g = M.g; return { ans: angBetween(g.C, g.A, g.B), model: M.ab / 2, extra: [[angBetween(g.O, g.A, g.B), M.ab], [M.ab + M.bc + M.ca, 360]] }; }
  };
  function ratioGeo(a, b, c) {
    const S0 = a + b + c, ab = (360 * a) / S0, bc = (360 * b) / S0, ca = (360 * c) / S0, O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, -90 + ab), Cc = polar(O, 1, -90 + ab + bc);
    return { ab, bc, ca, g: { O, A, B, C: Cc } };
  }

  /* ====================================================================== 7. 외접원의 둘레 */
  const o7 = {
    id: 't5-7', title: '△OBC의 둘레로 구하는 외접원의 둘레', short: '외접원의 둘레', solve: o7Solve,
    question: '△OBC의 둘레와 BC의 길이를 알면 외접원의 반지름과 둘레를 구할 수 있을까?',
    ctl: ['trSr', 'trSa'],
    init: (s) => { s.trSr = 5; s.trSa = 6; s.trV = 0; },
    reroll: (s) => { s.trSr = rint(4, 9); s.trSa = rint(3, 8); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const R = clamp(Math.round(s.trSr), 3, 9), a = clamp(Math.round(s.trSa), 2, Math.min(9, 2 * R - 1)), per = 2 * R + a; return { R, a, per, circ: 2 * R }; },
    draw(b, s, M, C) {
      const { R, a, per } = M, st = C.step, v = (s.trV || 0) % 2;
      const phi = Math.asin(clamp(a / (2 * R), 0.05, 0.98)) / DEG, O = pt(0, 0), B = polar(O, 1, 90 + phi), Cc = polar(O, 1, 90 - phi), A = polar(O, 1, -60);
      fit(b, RBOX, { t: 44, b: C.problem ? 50 : 92, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'sky', width: 2.6, alpha: 0.75 });
      fillPoly(b, [O, B, Cc], 'rose', 0.14);
      line(b, O, B, 'rose', 3.4); line(b, O, Cc, 'rose', 3.4); line(b, B, Cc, 'ink', 3.6);
      tick(b, O, B, 1, 'amber'); tick(b, O, Cc, 1, 'amber');
      if (C.problem) {
        T(b, mid(B, Cc), `${a} cm`, { dy: -22, size: fs(b, 17), color: 'sky' }); if (v === 0) G.sideTag(b, O, B, pt(1, 0.2), 'R', { color: 'amber', size: fs(b, 18), gap: 8 }); else T(b, O, '원의 둘레 = x', { dy: -48, size: fs(b, 16), color: 'amber' });
        T(b, mid(B, Cc), `△OBC의 둘레 ${per} cm`, { dy: 36, size: fs(b, 15), color: 'rose' });
      } else {
        T(b, mid(B, Cc), `BC = ${a} cm`, { dy: -22, size: fs(b, 16), color: 'sky' });
        if (show(2)) { G.sideTag(b, O, B, pt(1, 0.2), `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 8 }); G.sideTag(b, O, Cc, pt(-1, 0.2), `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 8 }); }
        T(b, mid(B, Cc), `△OBC의 둘레 = ${per} cm`, { dy: 36, size: fs(b, 15), color: 'rose' });
        if (show(3)) T(b, O, `원의 둘레 = ${2 * R}π cm`, { dy: -48, size: fs(b, 15), color: 'amber' });
      }
      b.point(O, { color: 'rose', r: 5.5 }); [B, Cc].forEach((q) => b.point(q, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 0, dy: -16, size: 18, color: 'rose' }); T(b, B, 'B', { dx: -14, dy: -8, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: -8, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `OB=OC=R, BC=${a} cm, 둘레 ${per} cm`;
        else if (C.review && st === 2) { row = `2R+${a}=${per} → R=${R} cm`; col = 'rose'; }
        else if (C.review && st === 3) { row = `2πR = 2π×${R} = ${2 * R}π cm`; col = 'amber'; }
        else row = `R=${R} cm → 외접원의 둘레 ${2 * R}π cm`;
        rowT(b, pt(0, 1.2), row, { dy: 40, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `외심 O에서 두 꼭짓점 B, C까지의 거리는 외접원의 반지름이므로 $\\overline{OB}=\\overline{OC}=R$이에요. △OBC의 둘레는 $2R+\\overline{BC}=${M.per}$ cm예요.`,
      `$2R+${M.a}=${M.per}$에서 $2R=${M.per - M.a}$, 따라서 $R=${M.R}$ cm예요.`,
      `외접원의 둘레는 $2\\pi R=2\\pi\\times${M.R}=${2 * M.R}\\pi$ (cm)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>R</b>과 <b>BC</b>를 바꿔 보세요(BC는 2R보다 작아요). △OBC의 둘레는 <b>2R+BC</b>예요. 거꾸로 둘레와 BC를 알면 R을 구할 수 있고, 외접원의 둘레는 <b>2πR</b>이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('R', `${M.R} cm`, 'rose'), rd('BC', `${M.a} cm`, 'sky'), rd('△OBC의 둘레', `${M.per} cm`, 'rose', '2R + BC'), rd('외접원의 둘레', `${M.circ}π cm`, 'amber', '2πR', null, true)],
      formula: `<p>$2R+\\overline{BC}=${M.per}$ → $R=${fr(`${M.per}-${M.a}`, 2)}=${M.R}$ (cm)</p><p>(원의 둘레) $=2\\pi R=${M.circ}\\pi$ (cm)</p>`,
      rule: '외심에서 두 꼭짓점까지의 거리는 모두 외접원의 반지름 R이다. △OBC의 둘레 = 2R + BC, 외접원의 둘레 = 2πR.',
      notes: notes('△OBC의 둘레에는 BC도 들어 있어요. <b>둘레에서 BC를 먼저 빼고</b> 2로 나눠요.', '원의 둘레는 2πR이에요. 반지름 R과 지름 2R을 헷갈리지 마세요.')
    }),
    prob: (M, s) => {
      const { R, a, per } = M, v = (s.trV || 0) % 2, key = `${v}:${R}:${a}`;
      const head = `그림에서 점 O는 삼각형 ABC의 외심이고 △OBC의 둘레는 ${per} cm, ${S('BC')}=${a} cm이다.`;
      if (v === 0) return numProb({ tag: '외접원의 반지름', key, stem: `${head} 삼각형 ABC의 외접원의 반지름 $R$은?`, correct: R, wrongs: [[per - a, '2R이에요. 반으로 나누어야 해요.'], [per, '둘레 그대로예요.'], [(per - a) / 2 + 1, '다시 계산해 보세요.'], [(per - a) / 2 - 1, '다시 계산해 보세요.'], [per / 2, '다시 생각해 보세요. BC를 빼야 해요.']].filter((q) => Number.isInteger(q[0]) && q[0] > 0 && q[0] !== R), ...cmOpts });
      const pi = { tex: (x) => `${x}\\pi\\text{ cm}`, plain: (x) => `${x}π cm`, pad: 2, valid: (x) => Number.isInteger(x) && x > 0 };
      return numProb({ tag: '외접원의 둘레', key, stem: `${head} 삼각형 ABC의 외접원의 둘레 $x$는?`, correct: 2 * R, wrongs: [[R, '반지름이에요. 둘레는 2πR이에요.'], [R * R, '넓이의 공식이에요.'], [per - a, '2R이에요. 둘레는 2πR이에요.'], [4 * R, '다시 계산해 보세요.'], [2 * R + 2, '다시 계산해 보세요.']].filter((q) => q[0] !== 2 * R), ...pi });
    },
    verify: (s) => { const M = o7.model(s); return { ans: (M.per - M.a) / 2, model: M.R }; }
  };


  // 풀이 흐름: 보기가 글인 문제는 5지선다 대신 문장 ①~⑤ 를 발문 아래에 보여 줍니다
  const o1p = o1.prob;
  o1.prob = (M, s) => (((s.trV || 0) % 3 === 2) ? SVB.listStmts(o1p(M, s)) : o1p(M, s));

  G.register(50, 't5', '⑤ 외심', '외심', PARAMS, [o1, o2, o3, o4, o5, o6, o7]);
})();
