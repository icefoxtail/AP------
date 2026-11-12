/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ⑦ 「닮음의 활용」 (t7.js, order 70) — 장면 2개
   · s7-1 높이와 그림자   · 같은 시각의 막대와 나무: 햇빛이 평행해서 두 직각삼각형이 닮음
   · s7-2 강의 폭 재기    · 탈레스처럼 땅 위에서 잰 길이로 강폭 구하기 (X자형 닮음)
   값은 모두 정수이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, centroid, seeded, ri, rpick, T, sideTag, dim, ang, tick, par, fillPoly, line, poly, fit, P, rd, notes, mkChoices, gcd, fmtN, bboxOf, phone, capSize, frT, vtx } = G;

  const PARAMS = {
    smSh: P('막대의 높이 h', 1, 3, 1, 2, { color: 'sky', format: (v) => v + ' m' }),
    smSs: P('막대의 그림자 s', 1, 4, 1, 3, { color: 'sky', format: (v) => v + ' m' }),
    smSk: P('나무는 막대의 몇 배 k', 2, 5, 1, 4, { color: 'green', format: (v) => `${v}배` }),
    smRm: P('PQ의 단위 m', 1, 3, 1, 2, { color: 'sky' }),
    smRn: P('AE의 단위 n', 1, 3, 1, 1, { color: 'green' }),
    smRu: P('땅 위 길이의 단위 u', 1, 3, 1, 2, { color: 'amber' }),
    smRw: P('강폭의 단위 w', 1, 3, 1, 2, { color: 'rose' })
  };

  /* ====================================================================== 1. 높이와 그림자 */
  function shGeo(h, s, k) {
    const H = k * h, S = k * s, gap = Math.max(1.4, 0.5 * s), x1 = s + gap;
    return { h, s, k, H, S, x0: 0, x1, A: pt(0, 0), Atop: pt(0, -h), Atip: pt(s, 0), Bb: pt(x1, 0), Btop: pt(x1, -H), Btip: pt(x1 + S, 0) };
  }
  const shS = {
    id: 'sm7-shadow', title: '높이와 그림자', short: '높이와 그림자',
    question: '같은 시각에 막대와 나무는 햇빛 때문에 그림자가 생겨. 막대와 그림자, 나무와 그림자가 만드는 두 직각삼각형은 닮은 도형일까? 나무의 높이는 얼마일까?',
    ctl: ['smSh', 'smSs', 'smSk'],
    init: (s) => { s.smSh = 2; s.smSs = 3; s.smSk = 4; },
    gen: (seed) => { const r = seeded('i1' + seed), h = ri(r, 1, 3), s = ri(r, 1, 4), k = ri(r, 2, 5), kind = ri(r, 0, 1); return { seed, h, s, k, kind }; },
    model: (s) => ({ ...shGeo(clamp(Math.round(s.smSh), 1, 3), clamp(Math.round(s.smSs), 1, 4), clamp(Math.round(s.smSk), 2, 5)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? shGeo(pk.h, pk.s, pk.k) : M;
      fit(b, { x0: -0.5, x1: g.x1 + g.S + 0.6, y0: -g.H - 0.8, y1: 0.5 }, { t: 40, b: 70, l: 40, r: 44 });
      line(b, pt(-0.5, 0), pt(g.x1 + g.S + 0.6, 0), 'ink', 3, { alpha: 0.7 });
      // 막대와 나무
      fillPoly(b, [g.A, g.Atip, g.Atop], 'sky', 0.22); fillPoly(b, [g.Bb, g.Btip, g.Btop], 'green', 0.18);
      line(b, g.A, g.Atop, 'sky', 4.6); line(b, g.Bb, g.Btop, 'green', 4.6);
      line(b, g.Atop, g.Atip, 'amber', 3, { dash: [8, 6] }); line(b, g.Btop, g.Btip, 'amber', 3, { dash: [8, 6] });
      par(b, g.Atop, g.Atip, 1, 'amber', 0.6); par(b, g.Btop, g.Btip, 1, 'amber', 0.6);
      ang(b, g.A, g.Atip, g.Atop, { color: 'rose', r: 16 }); ang(b, g.Bb, g.Btip, g.Btop, { color: 'rose', r: 16 });
      if (prob || !C.review || st >= 1) { ang(b, g.Atip, g.A, g.Atop, { color: 'violet', rings: 1, r: 22 }); ang(b, g.Btip, g.Bb, g.Btop, { color: 'violet', rings: 1, r: 22 }); }
      const sz = 16, cA = pt(g.s / 2, -g.h), cB = pt(g.x1 + g.S / 2, -g.H);
      const lbl = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 11 });
      if (prob) {
        lbl(g.A, g.Atop, pt(g.s, -g.h / 2), String(g.h), 'sky'); lbl(g.A, g.Atip, cA, pk.kind === 1 ? 'x' : String(g.s), pk.kind === 1 ? 'amber' : 'sky');
        lbl(g.Bb, g.Btip, cB, String(g.S), 'green');
        if (pk.kind === 0) lbl(g.Bb, g.Btop, pt(g.x1 + g.S, -g.H / 2), 'x', 'amber'); else lbl(g.Bb, g.Btop, pt(g.x1 + g.S, -g.H / 2), String(g.H), 'green');
      } else {
        lbl(g.A, g.Atop, pt(g.s, -g.h / 2), String(g.h), 'sky'); lbl(g.A, g.Atip, cA, String(g.s), 'sky'); lbl(g.Bb, g.Btip, cB, String(g.S), 'green');
        lbl(g.Bb, g.Btop, pt(g.x1 + g.S, -g.H / 2), !C.review || st >= 3 ? `x = ${g.H}` : 'x', 'amber');
      }
      T(b, g.Atop, '막대', { dx: -18, dy: -14, size: 14, color: 'sky' }); T(b, g.Btop, '나무', { dx: -18, dy: -14, size: 14, color: 'green' });
      if (C.txt && !prob) {
        const msg = st >= 3 ? `${g.h} : x = ${g.s} : ${g.S} → x = ${g.H}` : st >= 2 ? `닮음비 ${g.h} : ${g.H} = ${g.s} : ${g.S} = 1 : ${g.k}` : st >= 1 ? '햇빛은 평행 → 그림자 끝의 각이 같아요 (AA 닮음)' : '같은 시각, 햇빛은 평행해요';
        T(b, pt((g.x1 + g.S) / 2, 0), msg, { dy: 56, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '같은 시각에는 햇빛이 평행하므로 그림자 끝에서 지면과 이루는 각이 같아요. 막대와 나무는 모두 지면에 수직이므로 두 직각삼각형은 AA 닮음이에요.',
      `대응변의 비가 같아요. (막대의 높이) : (나무의 높이) = (막대의 그림자) : (나무의 그림자) → $${M.h}:x=${M.s}:${M.S}$ (닮음비 $1:${M.k}$)`,
      `$x=${M.h}\\times${frT(M.S, M.s).slice(1, -1)}=${M.H}$ (m)`
    ],
    view: (M) => ({
      guide: '<b>막대의 높이·그림자</b>와 <b>나무가 몇 배인지</b> 바꿔 보세요. 같은 시각에는 <b>높이의 비와 그림자의 비가 같아서</b> 나무의 높이 x가 정해져요.',
      readouts: [rd('높이의 비 (막대 : 나무)', `${M.h} : ${M.H}`, 'sky', `= 1 : ${M.k}`), rd('그림자의 비', `${M.s} : ${M.S}`, 'green', `= 1 : ${M.k}`), rd('나무의 높이 x', `${M.H} m`, 'amber')],
      formula: `<p>$${M.h}:x=${M.s}:${M.S}$ → $x=\\dfrac{${M.h}\\times${M.S}}{${M.s}}=${M.H}$</p>`,
      rule: '같은 시각에 막대와 나무의 높이의 비는 그림자의 길이의 비와 같다 (닮은 직각삼각형)',
      notes: notes('높이는 높이끼리, 그림자는 그림자끼리 비를 세워요.', '그림자가 길어도 막대와 같은 시각에 잰 것이어야 해요.')
    }),
    prob: (M) => {
      const pk = M.pk, g = shGeo(pk.h, pk.s, pk.k);
      if (pk.kind === 0) return { tag: '닮음의 활용: 나무의 높이', key: `s0${pk.h}${pk.s}${pk.k}`, stem: '같은 시각에 막대와 나무의 그림자가 그림과 같이 생겼다. 나무의 높이 $x$를 구하시오. (단위: m)', choices: mkChoices(g.H, [[g.S - g.s + g.h, '길이의 차를 이용했어요. 비례식으로 구해요.'], [g.h * g.s * 1, ''], [g.S + g.h, ''], [g.H + 1, ''], [g.H - 1, '']], { pad: 1 }) };
      return { tag: '닮음의 활용: 막대의 그림자', key: `s1${pk.h}${pk.s}${pk.k}`, stem: '같은 시각에 막대와 나무의 그림자가 그림과 같이 생겼다. 막대의 그림자의 길이 $x$를 구하시오. (단위: m)', choices: mkChoices(g.s, [[g.S - g.H + g.h, ''], [g.S * g.H / g.h, '비례식의 위치가 뒤바뀌었어요. 높이 : 높이 = 그림자 : 그림자예요.'], [g.S - g.s, ''], [g.s + 1, ''], [g.s + 2, '']], { pad: 1 }) };
    }
  };
  
  /* ====================================================================== 2. 강의 폭 재기 */
  function rvGeo(m, n, u, w) {
    const PQ = m * w, QD = m * u, DA = n * u, AE = n * w, Q = pt(0, 0), Pp = pt(0, -PQ), D = pt(QD, 0), A = pt(QD + DA, 0), E = pt(QD + DA, AE);
    return { m, n, u, w, PQ, QD, DA, AE, Q, P: Pp, D, A, E };
  }
  const rvS = {
    id: 'sm7-river', title: '강의 폭 재기', short: '강의 폭 재기',
    question: '강을 건너지 않고 강의 폭 PQ를 알 수 있을까? 땅 위에서 잴 수 있는 길이만으로 닮은 삼각형을 만들어 구해 보자.',
    ctl: ['smRm', 'smRn', 'smRu', 'smRw'],
    init: (s) => { s.smRm = 2; s.smRn = 1; s.smRu = 2; s.smRw = 2; },
    gen: (seed) => { const r = seeded('i2' + seed), m = ri(r, 1, 3), n = ri(r, 1, 3), u = ri(r, 1, 3), w = ri(r, 1, 3), kind = ri(r, 0, 1); return { seed, m, n, u, w, kind }; },
    model: (s) => ({ ...rvGeo(clamp(Math.round(s.smRm), 1, 3), clamp(Math.round(s.smRn), 1, 3), clamp(Math.round(s.smRu), 1, 3), clamp(Math.round(s.smRw), 1, 3)) }),
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, st = C.step, g = prob ? rvGeo(pk.m, pk.n, pk.u, pk.w) : M;
      const riverColor = g.m <= g.n ? 'sky' : 'green', landColor = g.m <= g.n ? 'green' : 'sky';
      fit(b, { x0: -1.2, x1: g.A.x + 1.3, y0: -g.PQ - 1, y1: g.AE + 1 }, { t: 40, b: 60, l: 52, r: 44 });
      fillPoly(b, [pt(-1.2, -g.PQ), pt(g.A.x + 1.3, -g.PQ), pt(g.A.x + 1.3, 0), pt(-1.2, 0)], 'sky', 0.16);
      line(b, pt(-1.2, 0), pt(g.A.x + 1.3, 0), 'ink', 3.2); line(b, pt(-1.2, -g.PQ), pt(g.A.x + 1.3, -g.PQ), 'ink', 3.2);
      T(b, pt(g.A.x + 0.2, -g.PQ / 2), '강', { size: 15, color: 'sky', dx: 8 });
      fillPoly(b, [g.P, g.Q, g.D], riverColor, 0.2); fillPoly(b, [g.E, g.A, g.D], landColor, 0.2);
      line(b, g.P, g.E, 'amber', 3.4); line(b, g.P, g.Q, 'ink', 3.6); line(b, g.Q, g.A, 'ink', 3.6); line(b, g.A, g.E, 'ink', 3.6);
      ang(b, g.Q, g.P, g.D, { color: 'rose', r: 16 }); ang(b, g.A, g.D, g.E, { color: 'rose', r: 16 });
      if (prob || !C.review || st >= 1) { ang(b, g.D, g.Q, g.P, { color: 'violet', rings: 1, r: 22 }); ang(b, g.D, g.A, g.E, { color: 'violet', rings: 1, r: 22 }); }
      const sz = 16, cen = pt(g.A.x / 2, 0);
      if (prob) {
        const k = pk.kind;
        dim(b, g.P, g.Q, pt(g.A.x, -g.PQ / 2), k === 0 ? 'x' : String(g.PQ), { color: k === 0 ? 'amber' : riverColor, off: 28, size: 17 });
        T(b, lerp(g.Q, g.D, 0.5), String(g.QD), { dy: -16, size: sz, color: riverColor });
        T(b, lerp(g.D, g.A, 0.5), k === 1 ? 'x' : String(g.DA), { dy: -16, size: sz, color: k === 1 ? 'amber' : landColor });
        sideTag(b, g.A, g.E, pt(g.A.x - 3, g.AE / 2), String(g.AE), { color: landColor, size: sz });
      } else {
        dim(b, g.P, g.Q, pt(g.A.x, -g.PQ / 2), !C.review || st >= 3 ? `PQ = ${g.PQ}` : 'PQ = x', { color: 'amber', off: 28, size: 17 });
        T(b, lerp(g.Q, g.D, 0.5), String(g.QD), { dy: -16, size: sz, color: riverColor }); T(b, lerp(g.D, g.A, 0.5), String(g.DA), { dy: -16, size: sz, color: landColor });
        sideTag(b, g.A, g.E, pt(g.A.x - 3, g.AE / 2), String(g.AE), { color: landColor, size: sz });
      }
      [[g.P, 'P', pt(2, -g.PQ / 2)], [g.Q, 'Q', pt(2, -g.PQ / 2)], [g.D, 'D', pt(g.D.x, -3)], [g.A, 'A', pt(g.A.x - 2, -3)], [g.E, 'E', pt(g.E.x - 3, g.AE - 2)]].forEach(([p, nm, c]) => vtx(b, p, c, nm, { size: 17, gap: 12 }));
      if (C.txt && !prob) {
        const msg = st >= 3 ? `PQ : EA = QD : AD → x : ${g.AE} = ${g.QD} : ${g.DA} → x = ${g.PQ}` : st >= 2 ? `△PQD ∽ △EAD (닮음비 ${g.m} : ${g.n})` : st >= 1 ? '∠PQD = ∠EAD = 90°, 맞꼭지각 ∠PDQ = ∠EDA' : '강 건너 P, 땅 위 점 D, A, E';
        T(b, pt(g.A.x / 2, g.AE), msg, { dy: 40, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    },
    steps: (M) => [
      '강 건너 점 P의 바로 맞은편 점을 Q라 하고, QA 위에 점 D를 잡아요. A에서 QA에 수직인 선을 긋고, P, D를 이은 직선과 만나는 점을 E라 하면 ∠PQD=∠EAD=90°이고 맞꼭지각 ∠PDQ=∠EDA예요.',
      '그러므로 $\\triangle PQD\\sim\\triangle EAD$ (AA 닮음)이에요. 땅 위에서 잴 수 있는 $\\overline{QD}$, $\\overline{AD}$, $\\overline{AE}$의 길이를 이용해요.',
      `$\\overline{PQ}:\\overline{EA}=\\overline{QD}:\\overline{AD}$ → $x:${M.AE}=${M.QD}:${M.DA}$이므로 $x=${M.PQ}$ (m)`
    ],
    view: (M) => ({
      guide: '<b>네 막대</b>로 땅 위에서 잰 길이를 바꿔 보세요. 땅 위의 <b>직각삼각형 EAD</b>가 강 건너까지 이어진 <b>삼각형 PQD</b>와 닮음이라서 PQ를 알 수 있어요(X자 모양).',
      readouts: [rd('QD : DA', `${M.QD} : ${M.DA}`, 'sky', `= ${M.m} : ${M.n}`), rd('PQ : EA', `${M.PQ} : ${M.AE}`, 'green', `= ${M.m} : ${M.n}`), rd('강폭 PQ', `${M.PQ} m`, 'amber')],
      formula: `<p>$\\overline{PQ}:\\overline{EA}=\\overline{QD}:\\overline{AD}$ → $x=${M.AE}\\times${frT(M.QD, M.DA).slice(1, -1)}=${M.PQ}$</p>`,
      rule: '직접 잴 수 없는 길이는 땅 위에서 닮은 삼각형을 만들어 대응변의 비로 구한다',
      notes: notes('같은 모양이 되도록 <b>직각과 맞꼭지각</b>을 이용해요.', '대응변끼리 비를 세워요: PQ와 EA, QD와 AD.')
    }),
    prob: (M) => {
      const pk = M.pk, g = rvGeo(pk.m, pk.n, pk.u, pk.w);
      if (pk.kind === 0) return { tag: '닮음의 활용: 강폭', key: `v0${pk.m}${pk.n}${pk.u}${pk.w}`, stem: '그림과 같이 강 건너편의 점 P와 땅 위의 점 Q, D, A, E를 정하여 강폭 PQ를 구하려 한다. $x$의 값을 구하시오. (단위: m)', choices: mkChoices(g.PQ, [[g.AE * g.DA / g.QD, '비례식의 위치가 뒤바뀌었어요. PQ : EA = QD : AD예요.'], [g.QD + g.DA, ''], [g.AE + g.QD - g.DA, ''], [g.PQ + 1, ''], [g.PQ - 1, '']], { pad: 1 }) };
      return { tag: '닮음의 활용: 땅 위의 길이', key: `v1${pk.m}${pk.n}${pk.u}${pk.w}`, stem: '그림과 같이 강 건너편의 점 P와 땅 위의 점 Q, D, A, E를 정하였다. $x$의 값을 구하시오. (단위: m)', choices: mkChoices(g.DA, [[g.AE * g.QD / g.PQ * g.PQ / g.AE === g.DA ? g.DA + 1 : g.QD, ''], [g.PQ * g.QD / g.AE, '비례식의 위치가 뒤바뀌었어요. PQ : EA = QD : AD예요.'], [g.AE, 'AE의 길이예요.'], [g.DA + 1, ''], [g.DA - 1, '']], { pad: 1 }) };
    }
  };

  G.geo = Object.assign(G.geo || {}, { shGeo, rvGeo });
  G.register(70, 't7', '⑦ 닮음의 활용', '닮음의 활용', PARAMS, [shS, rvS]);
})();
