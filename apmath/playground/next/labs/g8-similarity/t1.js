/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ① 「닮은 도형」 (t1.js, order 10) — 장면 4개
   · s1-1 닮은 두 평면도형   · 대응점·대응변·대응각, 닮음비는 대응변의 길이의 비
   · s1-2 닮은 두 입체도형   · 사면체·직육면체·원기둥, 닮음비는 대응하는 모서리의 길이의 비
   · s1-3 닮음비로 길이 구하기 · 닮은 두 직사각형, 대응변의 비가 같다
   · s1-4 항상 닮은 도형      · 정다각형·원은 항상 닮음, 직사각형·마름모·이등변삼각형은 아니에요
   값은 모두 정수이고, 글자·표시·정답은 지금의 슬라이더 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, polar, centroid, seeded, ri, rpick, T, tagOut, sideTag, ang, tick, fillPoly, line, poly, fit, P, rd, notes, mkChoices, mkTextChoices, mkRatioChoices, gcd, fmtN, bboxOf, unionBox, josa, phone, capSize, vtx, textW, frT } = G;

  const PARAMS = {
    smM: P('왼쪽 도형의 크기 m', 1, 4, 1, 1, { color: 'sky', hint: '왼쪽 도형의 모든 변의 길이가 m배가 돼요' }),
    smN: P('오른쪽 도형의 크기 n', 1, 4, 1, 2, { color: 'green', hint: '오른쪽 도형의 모든 변의 길이가 n배가 돼요' }),
    smP: P('가로의 단위 p', 2, 4, 1, 3, { color: 'sky' }),
    smQ: P('세로의 단위 q', 1, 3, 1, 2, { color: 'sky' }),
    smM2: P('작은 도형의 크기 m', 1, 3, 1, 2, { color: 'sky' }),
    smN2: P('큰 도형의 크기 n', 2, 5, 1, 3, { color: 'green' }),
    smRatio: P('닮음비 m : n (오른쪽 크기 n)', 1, 4, 1, 2, { color: 'green' }),
    smK2: P('오른쪽 도형의 크기', 1, 3, 1, 2, { color: 'green', hint: '두 번째 도형을 몇 배로 키울까요' }),
    smRq: P('오른쪽 직사각형 세로 바꾸기', -1, 2, 1, 1, { color: 'amber', hint: '0이면 모양이 같아요', format: (v) => (v > 0 ? '+' + v : String(v)) }),
    smAq: P('오른쪽 도형의 각', 30, 130, 10, 100, { color: 'amber', format: (v) => v + '°' })
  };

  /* ====================================================================== 공용: 직각사다리꼴 ABCD (AB=6, BC=5, CD=2, DA=3 의 k배) */
  const trap = (k, ox) => [pt(ox, 0), pt(ox + 6 * k, 0), pt(ox + 2 * k, -3 * k), pt(ox, -3 * k)]; // A B C D
  const TC = ['sky', 'green', 'amber', 'rose'];

  /* ====================================================================== 1. 닮은 두 평면도형 */
  const corr = {
    id: 'sm1-corr', title: '닮은 도형: 대응과 닮음비', short: '닮은 도형의 대응',
    question: '모양이 같고 크기만 다른 두 도형을 닮은 도형이라고 해. 닮은 도형에서 대응하는 변의 길이는 어떤 관계이고, 대응하는 각은 어떨까?',
    ctl: ['smM', 'smN'],
    init: (s) => { s.smM = 1; s.smN = 2; },
    gen: (seed) => {
      const r = seeded('c1' + seed), pr = rpick(r, [[1, 2], [2, 3], [3, 4], [1, 2], [2, 3]]), m = pr[0], n = pr[1], kind = ri(r, 0, 2);
      const given = ri(r, 0, 3); // 큰 도형에서 값을 주는 변
      let ask = ri(r, 0, 3); if (ask === given) ask = (ask + 1) % 4;
      return { seed, m, n, kind, given, ask };
    },
    model: (s) => {
      const m = clamp(Math.round(s.smM), 1, 4), n = clamp(Math.round(s.smN), 1, 4), g = G.gcd(m, n);
      return { m, n, g, sides: [6, 5, 2, 3].map((v) => ({ a: v * m, b: v * n })) };
    },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk;
      const m = prob ? pk.m : M.m, n = prob ? pk.n : M.n;
      const gap = 3 * Math.max(m, n) * 0.5 + 1.5, W1 = 6 * m, W2 = 6 * n, X2 = W1 + gap;
      const Pl = trap(m, 0), Pr = trap(n, X2), cl = centroid(Pl), cr = centroid(Pr);
      const hh = 3 * Math.max(m, n);
      fit(b, { x0: -0.2, x1: X2 + W2 + 0.2, y0: -hh - 0.3, y1: 0.3 }, { t: 42, b: 64, l: 38, r: 38 });
      const st = C.step;
      const sideCol = (i) => (prob ? 'ink' : st >= 2 ? TC[i] : 'ink');
      const draw1 = (Pt, c, nm, who, k) => {
        fillPoly(b, Pt, who ? 'green' : 'sky', 0.1);
        for (let i = 0; i < 4; i++) line(b, Pt[i], Pt[(i + 1) % 4], sideCol(i), 3.6);
        Pt.forEach((p, i) => { b.point(p, { color: !prob && st >= 1 ? TC[i] : 'ink', r: 5 }); tagOut(b, p, c, nm[i], { size: 17, gap: 12, color: !prob && st >= 1 ? TC[i] : 'ink' }); });
        // 각 표시: ∠A=∠D=직각(네모), ∠B 호 1개, ∠C 호 2개
        if (prob || st >= 3) {
          ang(b, Pt[0], Pt[1], Pt[3], { color: 'rose' });
          ang(b, Pt[3], Pt[0], Pt[2], { color: 'rose' });
          ang(b, Pt[1], Pt[0], Pt[2], { color: 'rose', rings: 1, r: 24 });
          ang(b, Pt[2], Pt[1], Pt[3], { color: 'rose', rings: 2, r: 24 });
        }
      };
      draw1(Pl, cl, 'ABCD', 0, m);
      draw1(Pr, cr, 'EFGH', 1, n);
      const vals = [6, 5, 2, 3];
      const lab = (Pt, c, who, k, idx, txt, colr) => sideTag(b, Pt[idx], Pt[(idx + 1) % 4], c, txt, { size: 16, color: colr, gap: 11 });
      for (let i = 0; i < 4; i++) {
        if (prob) {
          const sm = String(vals[i] * m);
          lab(Pl, cl, 0, m, i, sm, 'sky');
          if (i === pk.given) lab(Pr, cr, 1, n, i, String(vals[i] * n), 'green');
          else if (i === pk.ask) lab(Pr, cr, 1, n, i, 'x', 'amber');
        } else {
          lab(Pl, cl, 0, m, i, fmtN(vals[i] * m), st >= 2 ? TC[i] : 'sky');
          lab(Pr, cr, 1, n, i, fmtN(vals[i] * n), st >= 2 ? TC[i] : 'green');
        }
      }
      if (C.txt && !prob) {
        const cx = (X2 + W2 / 2 + W1 / 2) / 2 - 0.0;
        const cap = st >= 2 ? `대응변의 비 모두 ${m} : ${n}` + (M.g > 1 ? ` (= ${m / M.g} : ${n / M.g})` : '') : st >= 1 ? '같은 색 점이 서로 대응해요' : `닮음비 ${m} : ${n}`;
        T(b, pt(cx, 0), cap, { dy: 40, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      '닮은 두 도형에서 포개었을 때 서로 겹치는 꼭짓점을 대응점이라고 해요. 같은 색 점끼리 대응해요: 점 A와 E, 점 B와 F, 점 C와 G, 점 D와 H. 그래서 □ABCD ∽ □EFGH라고 대응하는 순서대로 써요.',
      `대응하는 변의 길이의 비는 모두 같아요. 그 비를 닮음비라고 해요. $\\overline{AB}:\\overline{EF}=\\overline{BC}:\\overline{FG}=\\overline{CD}:\\overline{GH}=\\overline{DA}:\\overline{HE}=${M.m}:${M.n}$`,
      '대응하는 각의 크기는 서로 같아요. $\\angle A=\\angle E,\\ \\angle B=\\angle F,\\ \\angle C=\\angle G,\\ \\angle D=\\angle H$ (같은 표시의 각)'
    ],
    view: (M) => ({
      guide: '<b>m, n</b> 막대로 두 도형의 크기를 바꿔 보세요. 어떻게 바꿔도 <b>대응하는 변의 길이의 비는 모두 같고</b> 각의 크기는 변하지 않아요.',
      readouts: [
        rd('닮음비 (왼쪽 : 오른쪽)', `${M.m} : ${M.n}`, 'amber', M.g > 1 ? `가장 간단히 ${M.m / M.g} : ${M.n / M.g}` : '더 간단히 할 수 없어요'),
        rd('AB : EF', `${6 * M.m} : ${6 * M.n}`, 'sky', `= ${M.m} : ${M.n}`),
        rd('둘레의 비', `${16 * M.m} : ${16 * M.n}`, 'green', `= ${M.m} : ${M.n}`)
      ],
      formula: `<p>닮음비 $=\\overline{AB}:\\overline{EF}=${6 * M.m}:${6 * M.n}=${M.m / M.g}:${M.n / M.g}$</p><p>$\\overline{BC}:\\overline{FG}=${5 * M.m}:${5 * M.n}=${M.m / M.g}:${M.n / M.g}$ (모든 대응변에서 같아요)</p>`,
      rule: '닮은 도형에서 대응하는 변의 길이의 비는 모두 같고, 대응하는 각의 크기는 같다',
      notes: notes('닮음비는 <b>대응하는</b> 변끼리의 비예요. 같은 도형 안의 두 변의 비(AB : BC)와 헷갈리지 마세요.', '기호 ∽는 대응하는 꼭짓점의 순서대로 써야 해요. □ABCD ∽ □EFGH')
    }),
    prob: (M) => {
      const pk = M.pk, v = [6, 5, 2, 3], nm = ['AB', 'BC', 'CD', 'DA'], nm2 = ['EF', 'FG', 'GH', 'HE'];
      const small = v[pk.ask] * pk.m, ans = v[pk.ask] * pk.n;
      const sg = v[pk.given] * pk.m, bg = v[pk.given] * pk.n;
      if (pk.kind === 2) {
        // 둘레: 작은 사각형의 둘레와 닮음비 → 큰 사각형의 둘레
        const per = 16 * pk.m, ans2 = 16 * pk.n;
        return { tag: '닮음비와 둘레', key: `p${pk.m}-${pk.n}`, stem: `□ABCD ∽ □EFGH이고 $\\overline{AB}=${6 * pk.m}$, $\\overline{EF}=${6 * pk.n}$이다. □ABCD의 둘레가 ${per}일 때, □EFGH의 둘레는? (단위: cm)`, choices: mkChoices(ans2, [[per, '닮음비를 곱하지 않았어요. 둘레도 닮음비로 커져요.'], [per + 6 * pk.n - 6 * pk.m, '변 하나의 차만 더했어요. 둘레도 길이니까 비로 구해요.'], [ans2 + 2, '둘레의 비도 닮음비와 같아요.'], [ans2 - 2, '둘레의 비도 닮음비와 같아요.']], { pad: 2 }), note: '둘레의 비는 닮음비와 같아요', fig: 'per' };
      }
      return { tag: '닮은 도형의 대응변', key: `s${pk.m}-${pk.n}-${pk.given}-${pk.ask}`, stem: `□ABCD ∽ □EFGH일 때, $x$의 값을 구하시오. (단위: cm)`, choices: mkChoices(ans, [[small, '작은 도형의 변 그대로예요. 닮음비로 바꿔야 해요.'], [small + bg - sg, '두 도형의 변의 차를 더했어요. 닮음은 곱(비)으로 구해요.'], [ans + 1, '비례식을 다시 세워 보세요. ' + nm[pk.given] + ' : ' + nm2[pk.given] + ' = ' + nm[pk.ask] + ' : ' + nm2[pk.ask]], [ans - 1, '비례식을 다시 세워 보세요.'], [Math.round((small * bg) / sg) === ans ? ans + 2 : Math.round(small * bg / sg) + 0, '']], { pad: 1 }) };
    }
  };
  // 둘레 문제는 그림에 둘레를 쓰지 못하므로 변 길이를 모두 그린다(draw 의 prob 분기: kind 2 는 모든 변 표시)
  const corrDrawFix = corr.draw;
  corr.draw = function (b, s, M, C) {
    if (C.problem && M.pk.kind === 2) {
      const pk = M.pk, m = pk.m, n = pk.n;
      const gap = 3 * Math.max(m, n) * 0.5 + 1.5, X2 = 6 * m + gap, Pl = trap(m, 0), Pr = trap(n, X2), cl = centroid(Pl), cr = centroid(Pr), hh = 3 * Math.max(m, n);
      fit(b, { x0: -0.2, x1: X2 + 6 * n + 0.2, y0: -hh - 0.3, y1: 0.3 }, { t: 42, b: 64, l: 38, r: 38 });
      [[Pl, cl, 'ABCD', 'sky', m], [Pr, cr, 'EFGH', 'green', n]].forEach(([Pt, c, nm, col, k]) => {
        fillPoly(b, Pt, col, 0.1); poly(b, Pt, 'ink', 3.6);
        Pt.forEach((p, i) => vtx(b, p, c, nm[i], { r: 4.5 }));
        ang(b, Pt[0], Pt[1], Pt[3], { color: 'rose' }); ang(b, Pt[3], Pt[0], Pt[2], { color: 'rose' });
        ang(b, Pt[1], Pt[0], Pt[2], { color: 'rose', rings: 1, r: 24 }); ang(b, Pt[2], Pt[1], Pt[3], { color: 'rose', rings: 2, r: 24 });
      });
      // 주어진 것: AB, EF (그림에 모두 표시). 둘레는 글로 주어짐(그림 아래)
      sideTag(b, Pl[0], Pl[1], cl, String(6 * m), { color: 'sky' }); sideTag(b, Pr[0], Pr[1], cr, String(6 * n), { color: 'green' });
      [[1, 5], [2, 2], [3, 3]].forEach(([i, v]) => sideTag(b, Pl[i], Pl[(i + 1) % 4], cl, String(v * m), { color: 'sky' }));
      return;
    }
    corrDrawFix(b, s, M, C);
  };

  /* ====================================================================== 2. 닮은 두 입체도형 */
  // 비스듬한 투영: 앞면이 정면, 깊이 방향은 오른쪽 위로. y 는 높이(위가 +).
  const OB = { x: 0.5, y: 0.3 };
  const P3 = (ox, x, y, z) => pt(ox + x + OB.x * z, -(y + OB.y * z));
  const SOLID = { tet: '사면체', box: '직육면체', cyl: '원기둥' };
  const BASE = { tet: [4, 3, 2], box: [3, 2, 2], cyl: [2, 4] }; // 대응 모서리(길이)의 기준
  const ELAB = { tet: ['AB', 'BC', 'CD'], box: ['가로', '세로', '높이'], cyl: ['반지름', '높이'] };
  const ECOL = ['sky', 'rose', 'amber'];
  // 입체 하나를 그리고 [라벨 위치]를 돌려줍니다. k = 크기 배율, names = 사면체의 꼭짓점 이름, lab(i)= 모서리 i 의 글자(없으면 null)
  function drawSolid(b, type, ox, k, o) {
    const col = o.col || 'ink', lab = o.lab || (() => null), lc = o.lc || ((i) => ECOL[i]);
    const wid = o.edgeCol; // 대응 모서리 색을 입힐지
    const ec = (i) => (wid ? ECOL[i] : col);
    let box;
    if (type === 'tet') {
      const U = 1; // 사면체 좌표(밑면 BCD 가 바닥, 꼭짓점 A 가 위)
      const A = pt(ox + 1.3 * k, -3.1 * k), B = pt(ox, 0), Cc = pt(ox + 1.9 * k, 0.55 * k), D = pt(ox + 3.5 * k, 0);
      fillPoly(b, [A, Cc, D], o.fill || 'sky', 0.1); fillPoly(b, [A, B, Cc], o.fill || 'sky', 0.06);
      line(b, B, D, col, 2.4, { dash: [6, 5] }); line(b, A, D, col, 3.4); line(b, A, Cc, col, 3.4);
      line(b, A, B, ec(0), 3.8); line(b, B, Cc, ec(1), 3.8); line(b, Cc, D, ec(2), 3.8);
      if (o.names) [[A, 0], [B, 1], [Cc, 2], [D, 3]].forEach(([p, i]) => { b.point(p, { color: 'ink', r: 4.2 }); });
      if (o.names) { T(b, A, o.names[0], { dy: -15, size: 17 }); T(b, B, o.names[1], { dx: -14, dy: 6, size: 17 }); T(b, Cc, o.names[2], { dy: 17, size: 17 }); T(b, D, o.names[3], { dx: 14, dy: 6, size: 17 }); }
      const tags = [[lerp(A, B, 0.5), -1, 0], [lerp(B, Cc, 0.5), 0, 1], [lerp(Cc, D, 0.5), 0, 1]];
      tags.forEach(([p, sx, sy], i) => { const t = lab(i); if (t != null) T(b, p, t, { dx: sx * (textW(t, 16) / 2 + 12), dy: sy * 22, size: 16, color: lc(i) }); });
      box = bboxOf([A, B, Cc, D]);
    } else if (type === 'box') {
      const w = BASE.box[0] * k, d = BASE.box[1] * k, h = BASE.box[2] * k;
      const p = (x, y, z) => P3(ox, x, y, z);
      const f = [p(0, 0, 0), p(w, 0, 0), p(w, h, 0), p(0, h, 0)], bk = [p(0, 0, d), p(w, 0, d), p(w, h, d), p(0, h, d)];
      fillPoly(b, [f[3], f[2], bk[2], bk[3]], o.fill || 'sky', 0.1); fillPoly(b, [f[1], bk[1], bk[2], f[2]], o.fill || 'sky', 0.06); fillPoly(b, f, o.fill || 'sky', 0.08);
      [[bk[0], bk[1]], [bk[0], bk[3]], [bk[0], f[0]]].forEach(([u, v]) => line(b, u, v, col, 2.2, { dash: [6, 5] }));
      line(b, bk[3], bk[2], col, 3.2); line(b, bk[2], bk[1], col, 3.2); line(b, f[2], bk[2], col, 3.2); line(b, f[3], bk[3], col, 3.2);
      poly(b, f, col, 3.4);
      line(b, f[0], f[1], ec(0), 4); line(b, f[1], bk[1], ec(1), 4); line(b, f[1], f[2], ec(2), 4);
      const lt = [[lerp(f[0], f[1], 0.5), 0, 1, 0], [lerp(f[1], bk[1], 0.5), 1, 1, 1], [lerp(f[1], f[2], 0.5), 1, 0, 2]];
      lt.forEach(([q, sx, sy, i]) => { const t = lab(i); if (t != null) T(b, q, t, { dx: sx * (textW(t, 16) / 2 + 11), dy: sy * 19, size: 16, color: lc(i) }); });
      box = bboxOf([f[0], bk[1], bk[2], f[3]]);
    } else {
      const r = BASE.cyl[0] * k, h = BASE.cyl[1] * k, ry = 0.3 * r, cx = ox + r;
      const ell = (cy, a0, a1) => Array.from({ length: 33 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 32; return pt(cx + r * Math.cos(a), cy + ry * Math.sin(a)); });
      const top = -h;
      fillPoly(b, [pt(cx - r, 0), pt(cx - r, top), pt(cx + r, top), pt(cx + r, 0)].concat(ell(0, 0, Math.PI).reverse().slice(0)), o.fill || 'sky', 0.08);
      b.path(ell(0, Math.PI, 2 * Math.PI), { color: col, width: 2.2, dash: [6, 5] });
      b.path(ell(0, 0, Math.PI), { color: col, width: 3.4 });
      line(b, pt(cx - r, 0), pt(cx - r, top), col, 3.4); line(b, pt(cx + r, 0), pt(cx + r, top), col, 3.4);
      b.path(ell(top, 0, 2 * Math.PI), { color: col, width: 3.4, close: true, fill: 'sky', fillAlpha: 0.12 });
      line(b, pt(cx, top), pt(cx + r, top), ec(0), 4); b.point(pt(cx, top), { color: 'ink', r: 3.6 });
      line(b, pt(cx + r, top), pt(cx + r, 0), ec(1), 4);
      const t0 = lab(0), t1 = lab(1);
      if (t0 != null) T(b, pt(cx + r / 2, top), t0, { dy: -16, size: 16, color: lc(0) });
      if (t1 != null) T(b, pt(cx + r, top / 2), t1, { dx: textW(t1, 16) / 2 + 12, size: 16, color: lc(1) });
      box = { x0: ox, x1: ox + 2 * r, y0: top - ry, y1: ry };
    }
    return box;
  }
  const extent = (type, k) => (type === 'tet' ? { w: 3.5 * k, h: 3.1 * k + 0.6 * k } : type === 'box' ? { w: (BASE.box[0] + OB.x * BASE.box[1]) * k, h: (BASE.box[2] + OB.y * BASE.box[1]) * k } : { w: 2 * BASE.cyl[0] * k, h: BASE.cyl[1] * k + 0.6 * BASE.cyl[0] * k });
  const solid = {
    id: 'sm1-solid', title: '닮은 입체도형: 대응 모서리', short: '닮은 두 입체',
    question: '한 입체를 일정한 비율로 확대하거나 축소한 입체는 처음 입체와 닮은 도형이야. 닮은 두 입체에서 대응하는 모서리의 길이의 비는 어떻게 될까?',
    ctl: ['smM', 'smN'],
    presets: () => Object.entries(SOLID).map(([id, label], i) => ({ group: i === 0 ? '입체의 종류' : '', label, apply: (s) => { s.smSolid = id; }, on: (s) => (s.smSolid || 'tet') === id })),
    init: (s) => { s.smM = 1; s.smN = 2; s.smSolid = 'tet'; },
    gen: (seed) => {
      const r = seeded('c2' + seed), type = rpick(r, ['tet', 'box', 'cyl']), m = ri(r, 1, 3), n = m + ri(r, 1, 2), ne = type === 'cyl' ? 2 : 3;
      const given = ri(r, 0, ne - 1); let ask = ri(r, 0, ne - 1); if (ask === given) ask = (ask + 1) % ne;
      return { seed, type, m, n, given, ask, ne };
    },
    model: (s) => { const type = s.smSolid || 'tet', m = clamp(Math.round(s.smM), 1, 4), n = clamp(Math.round(s.smN), 1, 4), g = gcd(m, n); return { type, m, n, g, base: BASE[type], names: ELAB[type] }; },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, type = prob ? pk.type : M.type, m = prob ? pk.m : M.m, n = prob ? pk.n : M.n, base = BASE[type];
      const e1 = extent(type, m), e2 = extent(type, n), gap = 1.8 + 0.25 * Math.max(m, n), X2 = e1.w + gap;
      const hh = Math.max(e1.h, e2.h), yb = type === 'tet' ? 0.55 * Math.max(m, n) : type === 'cyl' ? 0.3 * BASE.cyl[0] * Math.max(m, n) : 0;
      fit(b, { x0: -0.3, x1: X2 + e2.w + 0.3, y0: -hh - 0.3, y1: 0.8 + yb }, { t: 40, b: 70, l: 40, r: 44 });
      const st = C.step, shown = prob || st >= 2;
      const labFor = (k, who) => (i) => {
        if (prob) {
          if (!who) return String(base[i] * k);
          if (i === pk.given) return String(base[i] * k);
          if (i === pk.ask) return 'x';
          if (type === 'tet' && i !== pk.given && i !== pk.ask) return 'y';
          return null;
        }
        return st >= 1 ? fmtN(base[i] * k) : null;
      };
      const names1 = type === 'tet' ? ['A', 'B', 'C', 'D'] : null, names2 = type === 'tet' ? ['E', 'F', 'G', 'H'] : null;
      drawSolid(b, type, 0, m, { col: C.solution && C.solStep >= 2 ? 'sky' : 'ink', names: names1, lab: labFor(m, 0), lc: (i) => (prob ? 'sky' : ECOL[i]), edgeCol: shown && !prob, fill: 'sky' });
      drawSolid(b, type, X2, n, { col: C.solution && C.solStep >= 3 ? 'green' : 'ink', names: names2, lab: labFor(n, 1), lc: (i) => (prob ? (i === pk.ask ? 'amber' : (type === 'tet' && i !== pk.given ? 'amber' : 'green')) : ECOL[i]), edgeCol: shown && !prob, fill: 'green' });
      if (C.txt && !prob) {
        const cap = st >= 2 ? `대응하는 모서리의 비 모두 ${m} : ${n}` + (G.gcd(m, n) > 1 ? ` (= ${m / G.gcd(m, n)} : ${n / G.gcd(m, n)})` : '') : st >= 1 ? '같은 색 모서리가 서로 대응해요' : '두 입체는 닮은 도형이에요';
        T(b, pt((X2 + e2.w) / 2, yb), cap, { dy: 44, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      `닮은 두 입체에서 포개었을 때 겹치는 점·모서리·면이 서로 대응해요. 같은 색 모서리끼리 대응해요(${M.names.join(', ')}).`,
      `대응하는 모서리의 길이의 비는 모두 같고, 이 비가 닮음비예요. ${M.names.map((nm, i) => `${nm} ${M.base[i] * M.m} : ${M.base[i] * M.n}`).join(' / ').replace(/ \/ /g, ', ')} → 모두 $${M.m / M.g}:${M.n / M.g}$`,
      `모르는 모서리의 길이는 닮음비로 비례식을 세워 구해요. 예) 처음 모서리가 ${M.base[0] * M.m}이면 ${M.base[0] * M.m} $\\times$ ${frT(M.n, M.m)} = ${M.base[0] * M.n}`
    ],
    view: (M) => ({
      guide: '칩으로 <b>입체의 종류</b>를 고르고, <b>m, n</b> 막대로 두 입체의 크기를 바꿔 보세요. 같은 색 모서리가 서로 대응하고, 길이의 비는 모두 같아요.',
      readouts: M.names.map((nm, i) => rd(`${nm}의 비`, `${M.base[i] * M.m} : ${M.base[i] * M.n}`, ECOL[i], `= ${M.m / M.g} : ${M.n / M.g}`)),
      formula: `<p>닮음비 $=${M.m}:${M.n}=${M.m / M.g}:${M.n / M.g}$</p><p>모든 대응 모서리에서 비가 같아요.</p>`,
      rule: '닮은 두 입체도형에서 대응하는 모서리의 길이의 비는 모두 같다(닮음비)',
      notes: notes('대응하는 모서리끼리만 비를 써야 해요. 한 입체 안의 서로 다른 모서리끼리가 아니에요.', '원기둥이 닮으려면 반지름의 비와 높이의 비가 같아야 해요.')
    }),
    prob: (M) => {
      const pk = M.pk, base = BASE[pk.type], nm = ELAB[pk.type], tot = 0;
      if (pk.type === 'tet') {
        const rest = [0, 1, 2].filter((i) => i !== pk.given), x = base[pk.ask] * pk.n, y = base[rest.find((i) => i !== pk.ask)] * pk.n, ans = x + y;
        const so = rest.map((i) => base[i] * pk.m).reduce((a, c) => a + c, 0);
        return { tag: '닮은 두 사면체', key: `t${pk.m}-${pk.n}-${pk.given}-${pk.ask}`, stem: '두 사면체 ABCD와 EFGH가 닮은 도형일 때, $x+y$의 값을 구하시오. (단위: cm)', choices: mkChoices(ans, [[so, '작은 사면체의 길이를 그대로 더했어요. 닮음비를 곱해야 해요.'], [ans + pk.m, '대응하는 모서리를 다시 찾아보세요.'], [ans - pk.m, '대응하는 모서리를 다시 찾아보세요.'], [ans + 2 * pk.m, '비례식을 다시 세워 보세요.']], { pad: 1 }), note: '대응하는 모서리의 길이의 비는 모두 같아요' };
      }
      const ans = base[pk.ask] * pk.n;
      const stemTxt = pk.type === 'box' ? '두 직육면체가 닮은 도형일 때' : '두 원기둥이 닮은 도형일 때';
      return { tag: pk.type === 'box' ? '닮은 두 직육면체' : '닮은 두 원기둥', key: `${pk.type}${pk.m}-${pk.n}-${pk.given}-${pk.ask}`, stem: `${stemTxt}, $x$의 값을 구하시오. (단위: cm)`, choices: mkChoices(ans, [[base[pk.ask] * pk.m, '작은 입체의 길이 그대로예요. 닮음비로 바꿔야 해요.'], [base[pk.ask] * pk.m + (base[pk.given] * pk.n - base[pk.given] * pk.m), '차를 더했어요. 닮음은 곱(비)으로 구해요.'], [ans + 1, '비례식을 다시 세워 보세요.'], [ans - 1, '비례식을 다시 세워 보세요.']], { pad: 1 }), note: '같은 이름의 모서리끼리 비를 써요' };
    }
  };

  /* ====================================================================== 3. 닮음비로 길이 구하기 (닮은 두 직사각형) */
  const rect = {
    id: 'sm1-len', title: '닮음비로 길이 구하기', short: '닮음비로 길이',
    question: '닮은 두 직사각형에서 가로의 비를 알면 세로의 길이도 구할 수 있을까? 닮음비로 모르는 변의 길이를 구해 보자.',
    ctl: ['smM2', 'smN2', 'smP', 'smQ'],
    init: (s) => { s.smM2 = 2; s.smN2 = 3; s.smP = 3; s.smQ = 2; },
    gen: (seed) => {
      const r = seeded('c3' + seed), m = ri(r, 1, 3), n = m + ri(r, 1, 3), p = ri(r, 2, 4), q = ri(r, 1, 3), ask = ri(r, 0, 1);
      return { seed, m, n, p, q, ask };
    },
    model: (s) => {
      const m = clamp(Math.round(s.smM2), 1, 3), n = clamp(Math.round(s.smN2), 2, 5), p = clamp(Math.round(s.smP), 2, 4), q = clamp(Math.round(s.smQ), 1, 3), g = gcd(m, n);
      return { m, n, p, q, g, w1: p * m, h1: q * m, w2: p * n, h2: q * n };
    },
    draw(b, s, M, C) {
      const prob = C.problem, pk = M.pk, m = prob ? pk.m : M.m, n = prob ? pk.n : M.n, p = prob ? pk.p : M.p, q = prob ? pk.q : M.q;
      const w1 = p * m, h1 = q * m, w2 = p * n, h2 = q * n, gap = 3.8, X2 = w1 + gap, hh = Math.max(h1, h2);
      fit(b, { x0: -0.2, x1: X2 + w2 + 0.2, y0: -hh - 0.3, y1: 0.3 }, { t: 44, b: 66, l: 38, r: 40 });
      const R1 = [pt(0, 0), pt(w1, 0), pt(w1, -h1), pt(0, -h1)], R2 = [pt(X2, 0), pt(X2 + w2, 0), pt(X2 + w2, -h2), pt(X2, -h2)];
      const st = C.step, c1 = centroid(R1), c2 = centroid(R2);
      fillPoly(b, R1, 'sky', 0.12); fillPoly(b, R2, 'green', 0.12);
      poly(b, R1, 'ink', 3.6); poly(b, R2, 'ink', 3.6);
      [R1, R2].forEach((R) => R.forEach((pp, i) => ang(b, pp, R[(i + 1) % 4], R[(i + 3) % 4], { color: 'rose', r: 17 })));
      [[R1, 'ABCD', c1], [R2, 'EFGH', c2]].forEach(([R, nm, c]) => R.forEach((pp, i) => tagOut(b, pp, c, nm[i], { size: 16, gap: 10 })));
      // 대응변: 가로(AB↔EF)=하늘·초록, 세로(BC↔FG)
      const hc = (who) => (who ? 'green' : 'sky');
      if (prob) {
        sideTag(b, R1[0], R1[1], c1, String(w1), { color: 'sky' }); sideTag(b, R1[1], R1[2], c1, String(h1), { color: 'sky' });
        const known = pk.ask === 0 ? 1 : 0; // ask: 0=가로를 구함(세로가 주어짐), 1=세로를 구함(가로가 주어짐)
        sideTag(b, R2[0], R2[1], c2, pk.ask === 0 ? 'x' : String(w2), { color: pk.ask === 0 ? 'amber' : 'green' });
        sideTag(b, R2[1], R2[2], c2, pk.ask === 1 ? 'x' : String(h2), { color: pk.ask === 1 ? 'amber' : 'green' });
      } else {
        sideTag(b, R1[0], R1[1], c1, fmtN(w1), { color: 'sky' }); sideTag(b, R1[1], R1[2], c1, fmtN(h1), { color: 'sky' });
        sideTag(b, R2[0], R2[1], c2, fmtN(w2), { color: 'green' });
        sideTag(b, R2[1], R2[2], c2, st >= 3 || !C.review ? 'x=' + fmtN(h2) : 'x', { color: 'amber' });
      }
      if (C.txt && !prob) {
        const cx = (X2 + w2 + 0) / 2 + 0;
        const cap = st >= 3 ? `x = ${h2}` : st >= 2 ? `닮음비 ${w1} : ${w2} = ${m / M.g} : ${n / M.g}` : '가로는 가로끼리, 세로는 세로끼리 대응해요';
        T(b, pt((X2 + w2) / 2, 0), C.review ? cap : `닮음비 ${m} : ${n}`, { dy: 40, size: capSize(b), color: 'amber' });
      }
    },
    steps: (M) => [
      `□ABCD ∽ □EFGH에서 $\\overline{AB}$와 $\\overline{EF}$는 가로끼리, $\\overline{BC}$와 $\\overline{FG}$는 세로끼리 대응해요.`,
      `대응변인 $\\overline{AB}$와 $\\overline{EF}$의 길이로 닮음비를 구해요. $${M.w1}:${M.w2}=${M.m / M.g}:${M.n / M.g}$`,
      `$\\overline{BC}:\\overline{FG}=${M.m / M.g}:${M.n / M.g}$이므로 $${M.h1}:x=${M.m / M.g}:${M.n / M.g}$에서 $x=${M.h2}$`
    ],
    view: (M) => ({
      guide: '<b>m, n</b>으로 두 직사각형의 닮음비를, <b>p, q</b>로 모양을 바꿔 보세요. 가로의 비가 정해지면 <b>세로의 비도 같아서</b> 노란 x의 값이 정해져요.',
      readouts: [
        rd('닮음비', `${M.m} : ${M.n}`, 'amber', M.g > 1 ? `= ${M.m / M.g} : ${M.n / M.g}` : ''),
        rd('가로의 비 AB : EF', `${M.w1} : ${M.w2}`, 'sky'),
        rd('세로 x', `${M.h2}`, 'amber', `${M.h1} × ${M.n} ÷ ${M.m}`)
      ],
      formula: `<p>$${M.w1}:${M.w2}=${M.h1}:x$</p><p>$x=${M.h1}\\times${frT(M.w2, M.w1).slice(1, -1)}=${M.h2}$</p>`,
      rule: '닮은 도형에서 대응변의 길이의 비는 모두 같다 → 비례식으로 모르는 변을 구한다',
      notes: notes('비례식을 세울 때 <b>작은 도형 : 큰 도형</b>의 순서를 양쪽에서 똑같이 맞춰요.', '가로와 세로를 섞어서 대응시키지 마세요.')
    }),
    prob: (M) => {
      const pk = M.pk, w1 = pk.p * pk.m, h1 = pk.q * pk.m, w2 = pk.p * pk.n, h2 = pk.q * pk.n, ans = pk.ask === 0 ? w2 : h2, base = pk.ask === 0 ? w1 : h1, given = pk.ask === 0 ? h2 : w2;
      return { tag: '닮음비로 길이 구하기', key: `r${pk.m}-${pk.n}-${pk.p}-${pk.q}-${pk.ask}`, stem: `두 직사각형 ABCD와 EFGH가 닮은 도형일 때, $x$의 값을 구하시오. (단위: cm)`, choices: mkChoices(ans, [[base, '작은 직사각형의 길이 그대로예요. 닮음비로 키워야 해요.'], [base + (given - (pk.ask === 0 ? h1 : w1)), '두 변의 차를 더했어요. 닮음은 곱(비)으로 구해요.'], [ans + 1, '비례식을 다시 세워 보세요.'], [ans - 1, '비례식을 다시 세워 보세요.']], { pad: 1 }) };
    }
  };
  // 문제 그림: 주어진 값이 대응변에 맞게 표시되도록 draw 보정(작은 직사각형의 가로·세로는 모두 주어짐, 큰 직사각형은 한 변만 주어짐)
  const rectDraw = rect.draw;
  rect.draw = function (b, s, M, C) {
    if (!C.problem) return rectDraw(b, s, M, C);
    rectDraw(b, s, M, C);
  };

  /* ====================================================================== 4. 항상 닮은 도형 */
  const FAM = {
    tri: { name: '정삼각형', always: true }, sq: { name: '정사각형', always: true }, circ: { name: '원', always: true }, pent: { name: '정오각형', always: true }, rti: { name: '직각이등변삼각형', always: true },
    rec: { name: '직사각형', always: false }, rho: { name: '마름모', always: false }, iso: { name: '이등변삼각형', always: false }
  };
  const FAM_ORDER = ['tri', 'sq', 'circ', 'pent', 'rti', 'rec', 'rho', 'iso'];
  // 도형 하나: 중심 (cx), 바닥이 y=0 이고 크기 k(기준 1)
  function famPts(t, k, cx, q) {
    const reg = (n, R) => Array.from({ length: n }, (_, i) => polar(pt(cx, -R), R, -90 + (360 * i) / n));
    if (t === 'tri') { const a = 2 * k; return [pt(cx - a / 2, 0), pt(cx + a / 2, 0), pt(cx, -a * 0.866)]; }
    if (t === 'sq') return [pt(cx - k, 0), pt(cx + k, 0), pt(cx + k, -2 * k), pt(cx - k, -2 * k)];
    if (t === 'pent') { const R = 1.15 * k; const pts = Array.from({ length: 5 }, (_, i) => polar(pt(cx, -R * 0.809), R, -90 + 72 * i)); return pts; }
    if (t === 'rti') return [pt(cx - k, 0), pt(cx + k, 0), pt(cx - k, -2 * k)];
    if (t === 'rec') return [pt(cx - 1.5 * k, 0), pt(cx + 1.5 * k, 0), pt(cx + 1.5 * k, -(2 + q) * k), pt(cx - 1.5 * k, -(2 + q) * k)];
    if (t === 'rho') { const th = q * DEGR, hw = 1.4 * k, sd = 2.8 * k, dx = sd * Math.cos(th), dy = sd * Math.sin(th); return [pt(cx - hw - dx / 2, 0), pt(cx + hw - dx / 2, 0), pt(cx + hw + dx / 2, -dy), pt(cx - hw + dx / 2, -dy)].map((p) => pt(p.x, p.y)); }
    if (t === 'iso') { const a = 2 * k, th = (q / 2) * DEGR, h = (a / 2) / Math.tan(th) ; return [pt(cx - a / 2, 0), pt(cx + a / 2, 0), pt(cx, -h)]; }
    return reg(4, k);
  }
  const DEGR = Math.PI / 180;
  const same = (t, q1, q2) => FAM[t].always || q1 === q2 || (t === 'rho' && q1 + q2 === 180);
  const sim = {
    id: 'sm1-always', title: '항상 닮은 도형', short: '항상 닮은 도형',
    question: '두 도형이 항상 닮은 도형이 되려면 어떤 조건이어야 할까? 어떤 도형이 항상 닮고, 어떤 도형은 닮지 않을 수 있을까?',
    ctl: (s) => (FAM[s.smFam || 'tri'].always ? ['smK2'] : s.smFam === 'rec' ? ['smK2', 'smRq'] : ['smK2', 'smAq']),
    presets: () => FAM_ORDER.map((id, i) => ({ group: i === 0 ? '도형의 종류' : '', label: FAM[id].name, apply: (s) => { s.smFam = id; if (id === 'iso') s.smAq = 80; if (id === 'rho') s.smAq = 100; if (id === 'rec') s.smRq = 1; }, on: (s) => (s.smFam || 'tri') === id })),
    init: (s) => { s.smFam = 'tri'; s.smK2 = 2; s.smRq = 1; s.smAq = 100; },
    gen: (seed) => {
      const r = seeded('c4' + seed), askAlways = r() < 0.6;
      const A = ['tri', 'sq', 'circ', 'pent', 'rti'], N = ['rec', 'rho', 'iso', 'par', 'trp', 'rtr'];
      const sA = G.shuffle(A, r), sN = G.shuffle(N, r);
      const items = askAlways ? [sA[0], sN[0], sN[1], sN[2], sN[3]] : [sN[0], sA[0], sA[1], sA[2], sA[3]];
      return { seed, askAlways, items: G.shuffle(items, r) };
    },
    model: (s) => {
      const f = s.smFam || 'tri', k = clamp(Math.round(s.smK2), 1, 3), q = f === 'rec' ? s.smRq : f === 'rho' ? s.smAq : f === 'iso' ? s.smAq : 0;
      // 왼쪽 도형의 기준 변수: 직사각형 q=0, 마름모 100°, 이등변삼각형 80°
      const q1 = f === 'rec' ? 0 : f === 'rho' ? 100 : f === 'iso' ? 80 : 0;
      return { f, k, q, q1, always: FAM[f].always, ok: same(f, q1, q) };
    },
    draw(b, s, M, C) {
      if (C.problem) { drawAlwaysProblem(b, M); return; }
      const f = M.f, k1 = 1, k2 = M.k, gap = 1.6;
      const circ = f === 'circ';
      const w = (kk) => (f === 'rec' ? 3 * kk : f === 'rti' ? 2 * kk : f === 'rho' ? 5.6 * kk : 2 * kk);
      const x2 = w(k1) / 2 + gap + w(k2) / 2, W = w(k1) / 2 + gap + w(k2);
      const hh = circ ? 2 * k2 : Math.max(...famPts(f, k1, 0, M.q1).concat(famPts(f, k2, x2, M.q)).map(p => -p.y)) + .2;
      fit(b, { x0: -w(k1) / 2 - 0.2, x1: x2 + w(k2) / 2 + 0.2, y0: -hh, y1: 0.4 }, { t: 40, b: 70, l: 36, r: 36 });
      const draw1 = (cx, kk, qq, col, nm) => {
        if (circ) { b.circle(pt(cx, -kk), kk, { color: 'ink', width: 3.6, fill: col, fillAlpha: 0.12 }); b.point(pt(cx, -kk), { color: 'ink', r: 3.6 }); line(b, pt(cx, -kk), pt(cx + kk, -kk), col, 3.4); T(b, pt(cx + kk / 2, -kk), String(kk), { dy: -14, size: 16, color: col }); return; }
        const Pt = famPts(f, kk, cx, qq);
        fillPoly(b, Pt, col, 0.12); poly(b, Pt, 'ink', 3.6);
        // 변 길이(정수) — 정다각형·사각형·직각이등변은 한 변 표시
        const c = centroid(Pt);
        if (f === 'tri') sideTag(b, Pt[0], Pt[1], c, String(2 * kk), { color: col, gap: 12 });
        if (f === 'sq') { sideTag(b, Pt[0], Pt[1], c, String(2 * kk), { color: col }); sideTag(b, Pt[1], Pt[2], c, String(2 * kk), { color: col }); }
        if (f === 'pent') sideTag(b, Pt[0], Pt[1], c, '', {});
        if (f === 'rti') { sideTag(b, Pt[0], Pt[1], c, String(2 * kk), { color: col }); }
        if (f === 'rec') { sideTag(b, Pt[0], Pt[1], c, String(3 * kk), { color: col }); sideTag(b, Pt[1], Pt[2], c, String((2 + qq) * kk), { color: col }); }
        if (f === 'rho') {
          Pt.forEach((p, i) => tick(b, p, Pt[(i + 1) % 4], 1, col));
          // A rhombus with 80° at one corner is similar to the 100° example:
          // start the correspondence at the neighbouring corner instead.
          const shifted = M.ok && nm === 1 && M.q !== M.q1, i = shifted ? 1 : 0;
          ang(b, Pt[i], Pt[(i + 1) % 4], Pt[(i + 3) % 4], { color: M.ok ? 'rose' : col, label: (shifted ? 180 - qq : qq) + '°', r: 20, size: 14 });
          if (shifted) ang(b, Pt[0], Pt[1], Pt[3], { noMark: true, label: qq + '°', labelColor: col, r: 20, size: 14 });
        }
        if (f === 'iso') { tick(b, Pt[0], Pt[2], 1, col); tick(b, Pt[1], Pt[2], 1, col); ang(b, Pt[2], Pt[0], Pt[1], { color: M.ok ? 'rose' : col, label: qq + '°', r: 22, size: 14 }); }
        if (f === 'tri') Pt.forEach((p, i) => { tick(b, p, Pt[(i + 1) % 3], 1, col); ang(b, p, Pt[(i + 1) % 3], Pt[(i + 2) % 3], { color: 'rose', r: 16 }); });
        if (f === 'sq') Pt.forEach((p, i) => ang(b, p, Pt[(i + 1) % 4], Pt[(i + 3) % 4], { color: 'rose', r: 14 }));
        if (f === 'rec') Pt.forEach((p, i) => ang(b, p, Pt[(i + 1) % 4], Pt[(i + 3) % 4], { color: 'rose', r: 14 }));
        if (f === 'pent') { Pt.forEach((p, i) => tick(b, p, Pt[(i + 1) % 5], 1, col)); }
        if (f === 'rti') { ang(b, Pt[0], Pt[1], Pt[2], { color: 'rose', r: 16 }); tick(b, Pt[0], Pt[1], 1, col); tick(b, Pt[0], Pt[2], 1, col); }
      };
      draw1(0, k1, f === 'rec' ? M.q1 : M.q1, 'sky', 0);
      draw1(x2, k2, M.q, 'green', 1);
      if (C.txt) {
        const msg = M.always ? '항상 닮은 도형이에요 ○' : M.ok ? '지금 두 도형은 닮음이에요 ○' : '지금 두 도형은 닮음이 아니에요 ×';
        const why = M.always ? '모든 대응변의 비와 대응각이 같아요' : f === 'rec' ? (M.ok ? '가로의 비와 세로의 비가 같을 때만 닮음' : `가로의 비와 세로의 비가 달라요`) : (M.ok ? f === 'rho' && M.q !== M.q1 ? '이웃한 꼭짓점부터 대응하면 각이 같아요' : '대응하는 각이 같아요' : '대응하는 각의 크기가 달라요');
        T(b, pt(x2 / 2, 0), msg, { dy: 38, size: capSize(b), color: M.ok ? 'green' : 'rose' });
        T(b, pt(x2 / 2, 0), why, { dy: 62, size: phone(b) ? 13 : 15, color: 'amber' });
      }
    },
    steps: (M) => [
      `두 도형이 닮은 도형이려면 대응하는 변의 길이의 비가 모두 같고 대응하는 각의 크기가 같아야 해요.`,
      M.always ? `${FAM[M.f].name}은(는) 모양이 하나로 정해져 있어서 크기만 달라지므로 <b>항상 닮은 도형</b>이에요.` : `${FAM[M.f].name}은(는) 변의 비나 각이 달라질 수 있어서 <b>항상 닮은 것은 아니에요</b>. 지금은 ${M.ok ? '우연히 두 도형의 모양이 같아 닮음이에요.' : '두 도형의 모양이 달라 닮음이 아니에요.'}`,
      '항상 닮은 도형: 정삼각형, 정사각형, 정n각형, 원, 직각이등변삼각형, 중심각이 같은 부채꼴'
    ],
    view: (M) => ({
      guide: '칩으로 도형을 고르고 <b>오른쪽 도형의 크기</b>를 바꿔 보세요. 직사각형·마름모·이등변삼각형은 <b>모양 바꾸기</b> 막대도 움직여 닮은지 살펴보세요.',
      readouts: [rd('두 도형', M.ok ? '닮음 ○' : '닮음 아님 ×', M.ok ? 'green' : 'rose', FAM[M.f].name), rd('오른쪽 크기', `${M.k}배`, 'amber', '왼쪽 도형 기준')],
      formula: M.always ? '<p>변의 비 $=1:k$ (모두 같아요), 각은 그대로</p>' : M.f === 'rec' ? `<p>가로의 비 $=1:${M.k}$, 세로의 비 $=${2 + M.q1}:${(2 + M.q) * M.k}$ 처럼 같지 않을 수 있어요</p>` : '<p>대응하는 각의 크기가 달라지면 닮음이 아니에요</p>',
      rule: '정다각형·원·직각이등변삼각형은 항상 닮은 도형이지만, 직사각형·마름모·이등변삼각형은 항상 닮은 것은 아니다',
      notes: notes('<b>[함정]</b> 직각이등변삼각형은 항상 닮은 도형이지만 직각삼각형·이등변삼각형은 항상 닮지는 않아요.', '직사각형은 가로의 비와 세로의 비가 같아야 닮아요.')
    }),
    prob: (M) => {
      const pk = M.pk, names = { tri: '정삼각형', sq: '정사각형', circ: '원', pent: '정오각형', rti: '직각이등변삼각형', rec: '직사각형', rho: '마름모', iso: '이등변삼각형', par: '평행사변형', trp: '사다리꼴', rtr: '직각삼각형' };
      const AL = ['tri', 'sq', 'circ', 'pent', 'rti'];
      const ok = (t) => (pk.askAlways ? AL.includes(t) : !AL.includes(t));
      const why = (t) => (AL.includes(t) ? `${names[t]}은(는) 항상 닮은 도형이에요.` : `${names[t]}은(는) 모양이 여러 가지라서 항상 닮은 것은 아니에요.`);
      const items = pk.items.map((t) => ({ h: names[t], ok: ok(t), hint: why(t) }));
      return { tag: pk.askAlways ? '항상 닮은 도형 찾기' : '닮음이 아닐 수 있는 도형', key: pk.items.join(''), stem: pk.askAlways ? '다음 중 항상 닮은 도형인 것은? (그림의 ①~⑤는 보기 순서)' : '다음 중 항상 닮은 도형이라고 할 수 없는 것은? (그림의 ①~⑤는 보기 순서)', choices: items.map((it, i) => ({ h: it.h, p: it.h, ok: it.ok, hint: it.hint })), wide: false };
    }
  };
  // 문제 그림: 보기의 도형 다섯 개를 ①~⑤ 번호와 함께 가로로 나란히
  function drawAlwaysProblem(b, M) {
    const items = M.pk.items, n = items.length, step = 3.4, cols = phone(b) ? 2 : n;
    fit(b, { x0: -1.4, x1: step * (cols - 1) + 1.4, y0: -3.2, y1: 4 * (Math.ceil(n / cols) - 1) + .7 }, { t: 26, b: 36, l: 24, r: 24 });
    items.forEach((t, i) => {
      const cx = step * (i % cols), dy = 4 * Math.floor(i / cols);
      const point = G.pt; const shifted = (x, y) => point(x, y + dy);
      let Pt;
      if (t === 'circ') { b.circle(shifted(cx, -1.2), 1.2, { color: 'ink', width: 3.4, fill: 'sky', fillAlpha: 0.12 }); }
      else {
        if (t === 'par') Pt = [shifted(cx - 1.4, 0), shifted(cx + 0.7, 0), shifted(cx + 1.4, -1.8), shifted(cx - 0.7, -1.8)];
        else if (t === 'trp') Pt = [shifted(cx - 1.4, 0), shifted(cx + 1.4, 0), shifted(cx + 0.6, -1.8), shifted(cx - 0.6, -1.8)];
        else if (t === 'rtr') Pt = [shifted(cx - 1.2, 0), shifted(cx + 1.4, 0), shifted(cx - 1.2, -1.8)];
        else if (t === 'rec') Pt = [shifted(cx - 1.4, 0), shifted(cx + 1.4, 0), shifted(cx + 1.4, -1.9), shifted(cx - 1.4, -1.9)];
        else if (t === 'rho') Pt = [shifted(cx - 1.1, 0), shifted(cx + 0.9, 0), shifted(cx + 1.4, -Math.sqrt(3.75)), shifted(cx - 0.6, -Math.sqrt(3.75))];
        else if (t === 'iso') Pt = [shifted(cx - 1.1, 0), shifted(cx + 1.1, 0), shifted(cx, -2.2)];
        else if (t === 'tri') Pt = [shifted(cx - 1.2, 0), shifted(cx + 1.2, 0), shifted(cx, -2.08)];
        else if (t === 'sq') Pt = [shifted(cx - 1.1, 0), shifted(cx + 1.1, 0), shifted(cx + 1.1, -2.2), shifted(cx - 1.1, -2.2)];
        else if (t === 'pent') Pt = Array.from({ length: 5 }, (_, j) => polar(shifted(cx, -1.2), 1.3, -90 + 72 * j));
        else if (t === 'rti') Pt = [shifted(cx - 1.2, 0), shifted(cx + 1.2, 0), shifted(cx - 1.2, -2.4)];
        fillPoly(b, Pt, 'sky', 0.12); poly(b, Pt, 'ink', 3.4);
      }
      T(b, shifted(cx, 0), G.NUM[i], { dy: 26, size: 26, color: 'amber' });
    });
  }

  G.geo = Object.assign(G.geo || {}, { trap, famPts, drawSolid, solidBase: BASE, solidExtent: extent });
  G.register(10, 't1', '① 닮은 도형', '닮은 도형', PARAMS, [corr, solid, rect, sim]);
})();
